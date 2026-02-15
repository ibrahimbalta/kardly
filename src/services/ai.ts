import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "missing_key")
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
    }
})

// Tone-specific style guides for AI prompt
const toneGuides: Record<string, { style: string; colorGuide: string; sloganStyle: string; bioStyle: string }> = {
    profesyonel: {
        style: "Kurumsal, ciddi, güven veren bir dil kullan. Resmi ve otoriter bir ton. Kısa ve net cümleler. 'Biz' dili kullanabilirsin.",
        colorGuide: "Koyu lacivert (#1e3a5f), kurumsal mavi (#2563eb), antrasit (#334155), ya da koyu yeşil (#166534) gibi güven veren, kurumsal renkler seç. Kesinlikle canlı/parlak renkler KULLANMA.",
        sloganStyle: "Profesyonel, otoriter ve güven veren bir slogan yaz. Örnek tarz: 'Güvenilir Çözümler, Kalıcı Sonuçlar'",
        bioStyle: "Resmi ve kurumsal bir dil ile yaz. Üçüncü tekil şahıs ya da 'biz' dili kullan. Uzmanlık ve deneyimi vurgula."
    },
    samimi: {
        style: "Sıcak, arkadaş canlısı, samimi bir dil kullan. Günlük konuşma dili. 'Sen/siz' dili kullan. Emojiler ile destekle. Samimi ve yakın bir ton.",
        colorGuide: "Sıcak turuncu (#f97316), mercan (#fb7185), sıcak sarı (#eab308), pastel pembe (#f472b6) ya da sıcak yeşil (#22c55e) gibi samimi ve sıcak renkler seç. Soğuk ve koyu renkler KULLANMA.",
        sloganStyle: "Samimi, sıcak ve arkadaşça bir slogan yaz. Örnek tarz: 'Birlikte Daha Güzel 🤝' veya 'Senin İçin Buradayız!'",
        bioStyle: "Birinci tekil şahıs kullan. Samimi, sıcak ve yakın bir dil ile yaz. Okuyucuya arkadaşça hitap et."
    },
    yaratıcı: {
        style: "Cesur, yenilikçi, farklı bir dil kullan. Sıra dışı kelime seçimleri. Metaforlar ve yaratıcı ifadeler. Enerjik ve ilham veren bir ton.",
        colorGuide: "Canlı mor (#a855f7), elektrik mavisi (#3b82f6), neon yeşil (#22d3ee), fuşya (#d946ef), ya da parlak kırmızı (#ef4444) gibi cesur ve dikkat çekici renkler seç. Pastel ve sönük renkler KULLANMA.",
        sloganStyle: "Yaratıcı, sıra dışı ve dikkat çekici bir slogan yaz. Metafor kullan. Örnek tarz: 'Sınırları Kaldır, Farkı Yaşa' ya da 'Hayal Et, Gerçekleştir ✨'",
        bioStyle: "Yaratıcı ve enerjik bir dil ile yaz. Metafor ve güçlü kelimeler kullan. İlham verici ve heyecan verici bir ton."
    },
    lüks: {
        style: "Zarif, sofistike, lüks bir dil kullan. Seçkin kelime tercihleri. Kısa ve etkileyici cümleler. Premium ve özel hissettiren bir ton.",
        colorGuide: "Altın (#d4a017), siyah-altın (#b8860b), bordo (#991b1b), derin mor (#581c87), ya da koyu emerald (#064e3b) gibi lüks ve premium hissettiren renkler seç. Parlak ve ucuz görünen renkler KULLANMA.",
        sloganStyle: "Zarif, sofistike ve premium bir slogan yaz. Örnek tarz: 'Mükemmelliğin Adresi' ya da 'Ayrıcalıklı Deneyim'",
        bioStyle: "Sofistike ve zarif bir dil ile yaz. Premium ve ayrıcalıklı hissettir. Kalite ve inceliği vurgula."
    }
}

// Tone-specific fallback configs
const fallbackConfigs: Record<string, { themeColor: string; sloganPrefix: string; bioTemplate: string; services: { title: string; description: string }[] }> = {
    profesyonel: {
        themeColor: "#2563eb",
        sloganPrefix: "Güvenilir Çözümler, Kalıcı Sonuçlar",
        bioTemplate: "{occupation} alanında uzmanlaşmış ekibimiz, {audience} kitlesine yönelik profesyonel ve kaliteli hizmet sunmaktadır. Deneyim ve güvenle yanınızdayız.",
        services: [
            { title: "Profesyonel Danışmanlık", description: "Sektörel uzmanlığımızla stratejik çözümler sunuyoruz." },
            { title: "Proje Yönetimi", description: "Baştan sona planlı ve sistematik süreç yönetimi." },
            { title: "Kurumsal Destek", description: "7/24 profesyonel teknik destek hizmeti." }
        ]
    },
    samimi: {
        themeColor: "#f97316",
        sloganPrefix: "Birlikte Daha Güzel! 🤝",
        bioTemplate: "Merhaba! Ben bir {occupation} olarak {audience} ile çalışmayı çok seviyorum. Her zaman senin için buradayım, birlikte harika işler başarabiliriz! 😊",
        services: [
            { title: "Kişiye Özel Hizmet 🎯", description: "Senin ihtiyaçlarına göre özel çözümler üretiyorum." },
            { title: "Hızlı İletişim 💬", description: "Sorularına anında dönüş yapıyorum, her zaman ulaşılabilir!" },
            { title: "Dostça Rehberlik 🌟", description: "Adım adım seninle birlikte yürüyorum." }
        ]
    },
    yaratıcı: {
        themeColor: "#a855f7",
        sloganPrefix: "Sınırları Kaldır, Farkı Yaşa ✨",
        bioTemplate: "Sıradan olanı reddediyorum. {occupation} olarak {audience} için alışılmışın dışında, cesur ve yenilikçi çözümler tasarlıyorum. Her proje yeni bir macera!",
        services: [
            { title: "Yaratıcı Tasarım 🎨", description: "Sıra dışı ve dikkat çekici yaratıcı çözümler." },
            { title: "İnovatif Stratejiler 🚀", description: "Alışılmışın dışında, cesur ve etkili fikirler." },
            { title: "Deneyim Tasarımı 💡", description: "Unutulmaz ve ilham verici deneyimler yaratıyorum." }
        ]
    },
    lüks: {
        themeColor: "#b8860b",
        sloganPrefix: "Mükemmelliğin Adresi",
        bioTemplate: "Seçkin {audience} kitlesine özel, {occupation} alanında ayrıcalıklı ve üst düzey hizmet sunuyoruz. Kalite, zarafet ve mükemmellik temel ilkelerimizdir.",
        services: [
            { title: "Premium Danışmanlık", description: "Özel ve ayrıcalıklı danışmanlık deneyimi." },
            { title: "VIP Hizmet", description: "Size özel, birebir ilgi ve üst düzey hizmet." },
            { title: "Elit Çözümler", description: "En yüksek standartlarda, sofistike çözümler." }
        ]
    }
}

export async function generateProfileData(data: {
    occupation: string
    targetAudience: string
    tone: string
}) {
    const toneKey = data.tone.toLowerCase()
    const guide = toneGuides[toneKey] || toneGuides.profesyonel

    const prompt = `
    Sen bir profesyonel dijital marka uzmanısın. Kullanıcının verdiği bilgilere dayanarak dijital kartvizit/mini site içeriği üretmelisin.

    ⚠️ ÇOK ÖNEMLİ: Seçilen ton "${data.tone}" olduğu için, TÜM içerikleri bu tona uygun olarak üretmelisin. Tonun gereklilikleri aşağıda belirtilmiştir. Her kelime, her cümle, her renk seçimi bu tona uygun olmalıdır.

    === KULLANICI BİLGİLERİ ===
    - Meslek: ${data.occupation}
    - Hedef Kitle: ${data.targetAudience}
    - Seçilen Ton: ${data.tone}

    === TON GEREKLİLİKLERİ (${data.tone.toUpperCase()}) ===
    📝 DİL VE ÜSLUP: ${guide.style}
    🎨 RENK PALETİ: ${guide.colorGuide}
    💬 SLOGAN TARZI: ${guide.sloganStyle}
    📄 BİO TARZI: ${guide.bioStyle}

    === ÜRETMEN GEREKENLER (JSON formatında) ===
    1. "slogan": ${guide.sloganStyle} - Mesleğe ve tona özel, kısa ve akılda kalıcı bir slogan.
    2. "bio": ${guide.bioStyle} - 2-3 cümlelik hakkımda metni.
    3. "services": En az 3 adet hizmet. Dizi formatında: [{title, description}]. Hizmet isimleri ve açıklamaları da "${data.tone}" tonuna uygun olmalı.
    4. "themeColor": ${guide.colorGuide} - Tonun ruhuna ve sektöre uygun BİR adet HEX renk kodu.
    5. "recommendations": Tasarım için kısa bir öneri (bu ton için).

    🚨 KESİNLİKLE her ton için FARKLI slogan, bio, hizmet açıklaması ve renk üret. Her ton birbirinden belirgin şekilde ayırt edilebilir olmalı.

    Lütfen SADECE JSON döndür. Başka bir metin ekleme.
    `

    try {
        const result = await model.generateContent(prompt)
        const response = result.response
        const text = response.text()
        return JSON.parse(text)
    } catch (error) {
        console.error("Gemini API Error:", error)
        // Tone-specific fallback data
        const fallback = fallbackConfigs[toneKey] || fallbackConfigs.profesyonel
        return {
            slogan: fallback.sloganPrefix,
            bio: fallback.bioTemplate
                .replace("{occupation}", data.occupation)
                .replace("{audience}", data.targetAudience),
            services: fallback.services,
            themeColor: fallback.themeColor,
            recommendations: `${data.tone} tarzında modern bir tasarım önerilir.`
        }
    }
}
