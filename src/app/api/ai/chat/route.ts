import { NextResponse } from "next/server"

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

        const API_KEY = process.env.GEMINI_API_KEY;
        const MODEL = "llama-3.3-70b-versatile";
        const API_URL = "https://api.groq.com/openai/v1/chat/completions";

        // Filter out error messages
        const filteredMessages = messages?.filter((m: any) => !m.isError) || [];
        if (filteredMessages.length === 0) {
            return NextResponse.json({ error: "No messages to process" }, { status: 400 })
        }

        // Build OpenAI compatible messages array
        const groqMessages = [
            { role: "system", content: systemPrompt },
            ...filteredMessages.map((m: any) => ({
                role: m.role === "assistant" ? "assistant" : "user",
                content: m.content
            }))
        ];

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: groqMessages,
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq API Error:", JSON.stringify(data));
            return NextResponse.json({
                error: "AI servisi şu an yoğun. Lütfen birkaç dakika sonra tekrar deneyin. 🕐"
            }, { status: response.status });
        }

        const text = data?.choices?.[0]?.message?.content;

        if (!text) {
            console.error("No text in response:", JSON.stringify(data));
            return NextResponse.json({ error: "AI yanıt üretemedi. Lütfen tekrar deneyin." }, { status: 500 });
        }

        return NextResponse.json({ text })
    } catch (error: any) {
        console.error("AI Chat Error:", error);
        return NextResponse.json({
            error: "Bir bağlantı hatası oluştu. Lütfen tekrar deneyin."
        }, { status: 500 })
    }
}
