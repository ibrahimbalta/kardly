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
        const MODEL = "gemini-1.5-flash";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

        // Filter out error messages
        const filteredMessages = messages?.filter((m: any) => !m.isError) || [];
        if (filteredMessages.length === 0) {
            return NextResponse.json({ error: "No messages to process" }, { status: 400 })
        }

        const lastMessage = filteredMessages[filteredMessages.length - 1].content;
        const historyData = filteredMessages.slice(0, -1);

        const contents: any[] = [
            {
                role: "user",
                parts: [{ text: systemPrompt + "\n\nYukarıdaki bilgilere dayanarak benimle bir asistan gibi konuş." }]
            },
            {
                role: "model",
                parts: [{ text: "Anladım, size yardımcı olmaya hazırım! 😊" }]
            }
        ];

        let lastRole: string = "model";
        for (const m of historyData) {
            const role = m.role === "user" ? "user" : "model";
            if (role !== lastRole) {
                contents.push({ role, parts: [{ text: m.content }] });
                lastRole = role;
            }
        }
        if (lastRole === "user") contents.push({ role: "model", parts: [{ text: "Dinliyorum..." }] });
        contents.push({ role: "user", parts: [{ text: lastMessage }] });

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: contents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", JSON.stringify(data));
            const errMsg = data?.error?.message || JSON.stringify(data);

            // Try to find what models are actually available for this key
            try {
                const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
                const listData = await listRes.json();
                const availableModels = listData.models?.map((m: any) => m.name.replace("models/", "")).join(", ") || "Liste alınamadı";

                return NextResponse.json({
                    error: `SİSTEM HATASI: ${errMsg}. \n\nSenin için aktif olan modeller: ${availableModels}`
                }, { status: response.status });
            } catch (e) {
                return NextResponse.json({ error: `Hata: ${errMsg}` }, { status: response.status });
            }
        }

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error("No text in response:", JSON.stringify(data));
            return NextResponse.json({ error: "AI yanıt üretemedi. Lütfen tekrar deneyin." }, { status: 500 });
        }

        return NextResponse.json({ text })
    } catch (error: any) {
        console.error("AI Chat Full Error:", error);
        return NextResponse.json({
            error: "Bir bağlantı hatası oluştu. Lütfen tekrar deneyin."
        }, { status: 500 })
    }
}
