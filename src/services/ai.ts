const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "llama-3.3-70b-versatile";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Tone-specific style guides for AI prompt
const toneGuides: Record<string, { style: string; colorGuide: string; sloganStyle: string; bioStyle: string; designGuide: string }> = {
    profesyonel: {
        style: "Kurumsal, ciddi, güven veren bir dil kullan. Resmi ve otoriter bir ton. Kısa ve net cümleler. 'Biz' dili kullanabilirsin.",
        colorGuide: "Koyu lacivert (#1e3a5f), kurumsal mavi (#2563eb), antrasit (#334155), ya da koyu yeşil (#166534) gibi güven veren, kurumsal renkler seç. Kesinlikle canlı/parlak renkler KULLANMA.",
        sloganStyle: "Profesyonel, otoriter ve güven veren bir slogan yaz. Örnek tarz: 'Güvenilir Çözümler, Kalıcı Sonuçlar'",
        bioStyle: "Resmi ve kurumsal bir dil ile yaz. Üçüncü tekil şahıs ya da 'biz' dili kullan. Uzmanlık ve deneyimi vurgula.",
        designGuide: "Temiz hatlar, keskin köşeler (rounded-lg), sade tipografi (font-sans). Şablon: neon_blue veya neon_indigo."
    },
    samimi: {
        style: "Sıcak, arkadaş canlısı, samimi bir dil kullan. Günlük konuşma dili. 'Sen/siz' dili kullan. Emojiler ile destekle. Samimi ve yakın bir ton.",
        colorGuide: "Sıcak turuncu (#f97316), mercan (#fb7185), sıcak sarı (#eab308), pastel pembe (#f472b6) ya da sıcak yeşil (#22c55e) gibi samimi ve sıcak renkler seç. Soğuk ve koyu renkler KULLANMA.",
        sloganStyle: "Samimi, sıcak ve arkadaşça bir slogan yaz. Örnek tarz: 'Birlikte Daha Güzel 🤝' veya 'Senin İçin Buradayız!'",
        bioStyle: "Birinci tekil şahıs kullan. Samimi, sıcak ve yakın bir dil ile yaz. Okuyucuya arkadaşça hitap et.",
        designGuide: "Ekstra yuvarlak hatlar (rounded-[3rem]), yumuşak gölgeler, enerjik tipografi. Şablon: neon_orange veya neon_pink."
    },
    yaratıcı: {
        style: "Cesur, yenilikçi, farklı bir dil kullan. Sıra dışı kelime seçimleri. Metaforlar ve yaratıcı ifadeler. Enerjik ve ilham veren bir ton.",
        colorGuide: "Canlı mor (#a855f7), elektrik mavisi (#3b82f6), neon yeşil (#22d3ee), fuşya (#d946ef), ya da parlak kırmızı (#ef4444) gibi cesur ve dikkat çekici renkler seç. Pastel ve sönük renkler KULLANMA.",
        sloganStyle: "Yaratıcı, sıra dışı ve dikkat çekici bir slogan yaz. Metafor kullan. Örnek tarz: 'Sınırları Kaldır, Farkı Yaşa' ya da 'Hayal Et, Gerçekleştir ✨'",
        bioStyle: "Yaratıcı ve enerjik bir dil ile yaz. Metafor ve güçlü kelimeler kullan. İlham verici ve heyecan verici bir ton.",
        designGuide: "Vibrant renk geçişleri, asimetrik detaylar, modern ve kalın tipografi. Şablon: neon_purple veya neon_cyan."
    },
    lüks: {
        style: "Zarif, sofistike, lüks bir dil kullan. Seçkin kelime tercihleri. Kısa ve etkileyici cümleler. Premium ve özel hissettiren bir ton.",
        colorGuide: "Altın (#d4a017), siyah-altın (#b8860b), bordo (#991b1b), derin mor (#581c87), ya da koyu emerald (#064e3b) gibi lüks and premium hissettiren renkler seç. Parlak ve ucuz görünen renkler KULLANMA.",
        sloganStyle: "Zarif, sofistike ve premium bir slogan yaz. Örnek tarz: 'Mükemmelliğin Adresi' ya da 'Ayrıcalıklı Deneyim'",
        bioStyle: "Sofistike ve zarif bir dil ile yaz. Premium ve ayrıcalıklı hissettir. Kalite ve inceliği vurgula.",
        designGuide: "Sade ve asil tasarım, ince detaylar (serif font), premium renkler. Şablon: neon_black veya neon_amber."
    }
}

// Tone-specific fallback configs
const fallbackConfigs: Record<string, { themeColor: string; templateId: string; sloganPrefix: string; bioTemplate: string; services: { title: string; description: string }[] }> = {
    profesyonel: {
        themeColor: "#2563eb",
        templateId: "neon_blue",
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
        templateId: "neon_orange",
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
        templateId: "neon_purple",
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
        templateId: "neon_black",
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
    🏗️ TASARIM REHBERİ: ${guide.designGuide}

    === ÜRETMEN GEREKENLER (JSON formatında) ===
    1. "slogan": Mesleğe ve tona özel, kısa ve akılda kalıcı bir slogan.
    2. "bio": 2-3 cümlelik hakkımda metni.
    3. "services": En az 3 adet hizmet. Dizi formatında: [{title, description}]. Hizmet isimleri ve açıklamaları da "${data.tone}" tonuna uygun olmalı.
    4. "themeColor": Tonun ruhuna ve sektöre uygun BİR adet HEX renk kodu.
    5. "templateId": "${guide.designGuide}" içindeki önerilen şablona uygun bir ID seç.
       - Temel şablonlar: neon_black, neon_blue, neon_orange, neon_purple, neon_cyan, neon_amber, neon_rose vb.
       - EĞER meslek fiziksel bir ustalık veya hizmet alanı ise (örneğin: tesisatçı, elektrikçi, boyacı, marangoz, oto tamir vb.) şu özel şablonlardan BİRİNİ seç: masters_plumber, masters_electrician, masters_painter, masters_carpenter, masters_auto, masters_renovation.
    6. "recommendations": Tasarım için kısa bir öneri (bu ton için).

    🚨 KESİNLİKLE her ton için FARKLI slogan, bio, hizmet açıklaması, renk ve ŞABLON üret. Her ton birbirinden belirgin şekilde ayırt edilebilir olmalı.

    Lütfen SADECE geçerli bir JSON döndür.
    `

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.7
            })
        });

        const result = await response.json();
        const content = result.choices?.[0]?.message?.content;
        return JSON.parse(content);
    } catch (error) {
        console.error("Groq Profile API Error:", error)
        // Tone-specific fallback data
        const fallback = fallbackConfigs[toneKey] || fallbackConfigs.profesyonel
        return {
            slogan: fallback.sloganPrefix,
            bio: fallback.bioTemplate
                .replace("{occupation}", data.occupation)
                .replace("{audience}", data.targetAudience),
            services: fallback.services,
            themeColor: fallback.themeColor,
            templateId: fallback.templateId,
            recommendations: `${data.tone} tarzında modern bir tasarım önerilir.`
        }
    }
}

export async function generateBio(data: {
    occupation: string
    targetAudience: string
    tone: string
}) {
    const toneKey = data.tone.toLowerCase()
    const guide = toneGuides[toneKey] || toneGuides.profesyonel

    const prompt = `
    Sen bir profesyonel metin yazarısın. Aşağıdaki bilgilere uygun olarak, bir dijital kartvizit için etkileyici ve profesyonel bir "Hakkımda" (Bio) metni yazmalısın.

    KULLANICI BİLGİLERİ:
    - Meslek: ${data.occupation}
    - Hedef Kitle: ${data.targetAudience}
    - Seçilen Ton: ${data.tone}

    TON REHBERİ:
    ${guide.style}

    KURALLAR:
    1. Metin 2 ya da 3 cümleden oluşmalı.
    2. Seçilen tona (${data.tone}) %100 sadık kalmalı.
    3. Hedef kitleye hitap etmeli.
    4. Lütfen SADECE JSON formatında döndür: {"bio": "..."}
    `

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.7
            })
        });

        const result = await response.json();
        const content = result.choices?.[0]?.message?.content;
        return JSON.parse(content);
    } catch (error) {
        console.error("Groq Bio API Error:", error)
        const fallback = fallbackConfigs[toneKey] || fallbackConfigs.profesyonel
        return {
            bio: fallback.bioTemplate
                .replace("{occupation}", data.occupation)
                .replace("{audience}", data.targetAudience)
        }
    }
}

export async function categorizeLinks(links: { title: string; url: string }[]) {
    const prompt = `
    Sen bir sosyal medya ve link uzmanısın. Aşağıdaki link listesini incele ve her birini şu kategorilerden birine ata: 
    "instagram", "twitter", "linkedin", "youtube", "facebook", "whatsapp", "github", "behance", "dribbble", "website", "customLink".

    LINK LİSTESİ:
    ${JSON.stringify(links)}

    KURALLAR:
    1. Her link için sadece belirtilen kategorilerden birini seç.
    2. Eğer net değilse "website" veya "customLink" kullan.
    3. Yanıtı SADECE şu formatta bir JSON objesi içinde bir dizi olarak döndür: {"links": [{"title": "...", "url": "...", "platform": "..."}]}
    `

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.3
            })
        });

        const result = await response.json();
        const content = result.choices?.[0]?.message?.content;
        const parsed = JSON.parse(content);
        return parsed.links || parsed || [];
    } catch (error) {
        console.error("Groq Link Categorization Error:", error)
        // Fallback: Basit domain kontrolü
        return links.map(link => {
            const url = link.url.toLowerCase();
            let platform = "customLink";
            if (url.includes("instagram.com")) platform = "instagram";
            else if (url.includes("twitter.com") || url.includes("x.com")) platform = "twitter";
            else if (url.includes("linkedin.com")) platform = "linkedin";
            else if (url.includes("youtube.com")) platform = "youtube";
            else if (url.includes("facebook.com")) platform = "facebook";
            else if (url.includes("wa.me") || url.includes("whatsapp.com")) platform = "whatsapp";
            else if (url.includes("github.com")) platform = "github";
            else if (url.includes("behance.net")) platform = "behance";
            else if (url.includes("dribbble.com")) platform = "dribbble";
            return { ...link, platform };
        });
    }
}
