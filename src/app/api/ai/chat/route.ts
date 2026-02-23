import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
    try {
        const { messages, profile } = await req.json()

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing")
            return NextResponse.json({ error: "AI API Key is not configured" }, { status: 500 })
        }

        if (!profile) {
            return NextResponse.json({ error: "Profile context is required" }, { status: 400 })
        }

        const aiBlock = profile.blocks?.find((b: any) => b.type === 'ai_assistant')
        const aiConfig = aiBlock?.content || {
            assistantName: "Kardly AI",
            instructions: ""
        }

        const systemPrompt = `
        Sen ${profile.user.name}'in dijital asistanısın${aiConfig.assistantName !== 'Kardly AI' ? ` (Adın: ${aiConfig.assistantName})` : ""}. Görevin, profil sayfasını ziyaret eden kişilerin sorularını yanıtlamak ve onlara yardımcı olmaktır.
        
        === PROFİL SAHİBİ BİLGİLERİ ===
        - İsim: ${profile.user.name}
        - Meslek/Unvan: ${profile.occupation || "Belirtilmedi"}
        - Slogan: ${profile.slogan || "Belirtilmedi"}
        - Biyografi: ${profile.bio || "Belirtilmedi"}
        - Hizmetler: ${JSON.stringify(profile.services || [])}
        - Sosyal Medya: ${JSON.stringify(profile.socialLinks || [])}
        
        === KURALLAR ===
        1. Her zaman nazik, profesyonel ve yardımcı ol.
        2. ${profile.user.name} adına konuşuyormuş gibi değil, onun asistanı gibi konuş (Örn: "İbrahim Bey şu an...", "Size bu konuda yardımcı olabilirim").
        3. Yanıtlarını kısa ve öz tut.
        4. Eğer kullanıcı randevu almak isterse, sayfadaki "Randevu Al" butonunu kullanabileceğini söyle.
        5. Eğer iletişim kurmak isterse, "İletişime Geç" butonuna tıklamasını veya mail/telefon bilgilerini paylaşabileceğini belirt.
        6. Bilmediğin konularda uydurma yapma, "Bu konuda İbrahim Bey'e danışıp size dönebiliriz" de.
        7. Yanıtlarda emojiler kullanabilirsin ama aşırıya kaçma.
        ${aiConfig.instructions ? `\n=== ÖZEL TALİMATLAR ===\n${aiConfig.instructions}` : ""}
        
        Kullanıcının dili neyse (Türkçe veya İngilizce) o dilde cevap ver.
        `.trim()

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt
        })

        const history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
        }));

        const chat = model.startChat({ history });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text })
    } catch (error: any) {
        console.error("AI Chat Error:", error)
        return NextResponse.json({ error: error.message || "Yapay zeka asistanı şu an yanıt veremiyor." }, { status: 500 })
    }
}
