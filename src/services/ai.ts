import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "missing_key",
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
    3. services: En az 3 adet hizmet başlığı ve kısa açıklaması.
    4. themeColor: Sektöre ve tona uygun bir HEX renk kodu.
    5. recommendations: Tasarım için kısa bir öneri.

    Lütfen SADECE JSON döndür. Başka bir metin ekleme.
  `

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Veya gpt-3.5-turbo
        messages: [
            { role: "system", content: "Sen yardımcı bir asistan ve marka uzmanısın. Çıktıların her zaman geçerli bir JSON objesi olmalı." },
            { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
    })

    return JSON.parse(response.choices[0].message.content || "{}")
}
