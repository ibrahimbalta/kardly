import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "missing_key")
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
    }
})

export async function generateProfileData(data: {
    occupation: string
    targetAudience: string
    tone: string
}) {
    const prompt = `
    Sen bir profesyonel dijital marka uzmanısın. Kullanıcının verdiği bilgilere dayanarak mükemmel bir dijital kartvizit/mini site içeriği üretmelisin.
    
    Kullanıcı Bilgileri:
    - Meslek: ${data.occupation}
    - Hedef Kitle: ${data.targetAudience}
    - Ton: ${data.tone}

    Senden şunları üretmeni bekliyorum (JSON formatında):
    1. slogan: Akılda kalıcı, kısa bir slogan.
    2. bio: 2-3 cümlelik profesyonel bir "Hakkımda" metni.
    3. services: En az 3 adet hizmet başlığı ve kısa açıklaması. (Dizi objesi: {title, description})
    4. themeColor: Sektöre ve tona uygun bir HEX renk kodu.
    5. recommendations: Tasarım için kısa bir öneri.

    Lütfen SADECE JSON döndür. Başka bir metin ekleme.
    `

    try {
        const result = await model.generateContent(prompt)
        const response = result.response
        const text = response.text()
        return JSON.parse(text)
    } catch (error) {
        console.error("Gemini API Error:", error)
        // Fallback data
        return {
            slogan: `${data.occupation} Alanında Uzman Çözümler`,
            bio: `${data.occupation} olarak ${data.targetAudience} kitlesine özel profesyonel hizmetler sunuyorum.`,
            services: [
                { title: "Danışmanlık", description: "İhtiyacınıza uygun stratejiler." },
                { title: "Uygulama", description: "Hızlı ve etkili sonuçlar." },
                { title: "Destek", description: "Her adımda yanınızdayım." }
            ],
            themeColor: "#6366f1",
            recommendations: "Modern bir tasarım önerilir."
        }
    }
}
