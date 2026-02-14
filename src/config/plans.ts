export const PLANS = [
    {
        id: "free",
        name: "Ücretsiz",
        price: 0,
        features: [
            "1 Adet Dijital Kartvizit",
            "Kardly Alt Domain",
            "Temel AI Üretimi",
            "Standart QR Kod",
            "Haftalık İstatistik"
        ],
        buttonText: "Mevcut Plan",
        recommended: false
    },
    {
        id: "pro",
        name: "Pro",
        price: 199,
        features: [
            "Sınırsız AI İçerik Üretimi",
            "Özel Domain Desteği",
            "vCard (Rehbere Ekle) Desteği",
            "Gelişmiş Analitik Panel",
            "Tüm Tasarım Şablonları",
            "Öncelikli Destek"
        ],
        buttonText: "Pro'ya Yükselt",
        recommended: true
    },
    {
        id: "business",
        name: "Business",
        price: 499,
        features: [
            "Ödeme Alma (iyzico Entegrasyonu)",
            "Randevu Sistemi",
            "WhatsApp Chatbot Desteği",
            "Özel Markalama (No-Branding)",
            "Ekip Yönetimi",
            "VIP Teknik Destek"
        ],
        buttonText: "İletişime Geç",
        recommended: false
    }
]
