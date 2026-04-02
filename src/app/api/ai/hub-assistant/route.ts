import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { message, history, profiles } = await req.json()

        const API_KEY = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;
        const MODEL = "llama-3.3-70b-versatile";
        const API_URL = "https://api.groq.com/openai/v1/chat/completions";

        if (!API_KEY) {
            console.error("AI API Key is missing")
            return NextResponse.json({ error: "AI API Key is not configured" }, { status: 500 })
        }

        const systemInstruction = `Sen Kardly Business Hub Networking Asistanısın. Görevin, kullanıcıların ağdaki profesyonelleri bulmalarına yardımcı olmaktır. 
        Aşağıda ağdaki kayıtlı kullanıcıların bir listesi bulunmaktadır. 
        Bu listeyi kullanarak kullanıcının ihtiyacuna en uygun kişileri öner. 
        Önerirken neden bu kişiyi seçtiğini biyografilerine veya mesleklerine dayanarak açıkla. 
        Eğer listede uygun kimse yoksa dürüstçe belirt.
        
        NETWORK LİSTESİ:
        ${JSON.stringify(profiles, null, 2)}
        
        Yanıtlarken:
        1. Nazik ve profesyonel ol.
        2. Önerdiğin kişilerin kullanıcı adlarını (username) mutlaka belirt ki kullanıcı onları bulabilsin.
        3. Yanıtlarını kısa ve öz tut.
        4. Kullanıcının dili neyse (Türkçe veya İngilizce) o dilde cevap ver.`

        const groqMessages = [
            { role: "system", content: systemInstruction },
            ...(history || []).map((m: any) => ({
                role: m.role === "assistant" ? "assistant" : "user",
                content: m.content
            })),
            { role: "user", content: message }
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
                error: "AI servisi şu an yoğun. Lütfen tekrar deneyin."
            }, { status: response.status });
        }

        const reply = data?.choices?.[0]?.message?.content;

        if (!reply) {
            return NextResponse.json({ error: "AI yanıt üretemedi." }, { status: 500 });
        }

        return NextResponse.json({ reply })

    } catch (error) {
        console.error("Hub Assistant Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
