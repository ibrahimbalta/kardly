import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { message, history, profiles } = await req.json()

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        const systemInstruction = `Sen Kardly Business Hub Networking Asistanısın. Görevin, kullanıcıların ağdaki profesyonelleri bulmalarına yardımcı olmaktır. 
        Aşağıda ağdaki kayıtlı kullanıcıların bir listesi bulunmaktadır. 
        Bu listeyi kullanarak kullanıcının ihtiyacına en uygun kişileri öner. 
        Önerirken neden bu kişiyi seçtiğini biyografilerine veya mesleklerine dayanarak açıkla. 
        Eğer listede uygun kimse yoksa dürüstçe belirt.
        
        NETWORK LİSTESİ:
        ${JSON.stringify(profiles, null, 2)}
        
        Yanıtlarken:
        1. Nazik ve profesyonel ol.
        2. Önerdiğin kişilerin kullanıcı adlarını (username) mutlaka belirt ki kullanıcı onları bulabilsin.
        3. Yanıtlarını kısa ve öz tut.`

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "model", parts: [{ text: "Anlaşıldı. Kardly Network Asistanı olarak hazırım. Ağı tarayarak kullanıcıya en uygun profesyonelleri önereceğim." }] },
                ...history.map((m: any) => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }]
                }))
            ]
        })

        const result = await chat.sendMessage(message)
        const response = await result.response
        const text = response.text()

        return NextResponse.json({ reply: text })

    } catch (error) {
        console.error("Hub Assistant Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
