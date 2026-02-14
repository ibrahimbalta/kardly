# Kardly - AI Destekli Dijital Kartvizit Platformu 🚀

Kardly, profesyonellerin kendilerini tanıtmak, ürünlerini sergilemek ve randevu almak için saniyeler içinde AI destekli dijital kartvizitler oluşturmasını sağlar.

## 🚀 Hızlı Kurulum

1. **Bağımlıklıkları Yükleyin:**
   ```bash
   npm install
   ```

2. **Veritabanını Hazırlayın:**
   `.env` dosyanızı oluşturun ve `DATABASE_URL` bilgisini girin, ardından:
   ```bash
   npx prisma db push
   ```

3. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```

## 🌍 Canlıya Alma (Vercel)

Projeyi Vercel üzerinde canlıya almak için aşağıdaki adımları takip edin:

### 1. Çevresel Değişkenler (Environment Variables)
Vercel Dashboard'da projenize aşağıdaki değişkenleri ekleyin:

| Değişken | Açıklama |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL bağlantı URL'niz (Neon.tech önerilir) |
| `NEXTAUTH_URL` | Sitenizin URL'si (örn: `https://siteniz.vercel.app`) |
| `NEXTAUTH_SECRET` | Rastgele bir string (örn: `openssl rand -base64 32`) |
| `OPENAI_API_KEY` | OpenAI API anahtarınız |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID (Opsiyonel) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret (Opsiyonel) |

### 2. Build Komutları
Vercel ayarlarında build komutunun `npm run build` olduğundan ve `postinstall` komutu sayesinde `prisma generate` işleminin yapıldığından emin olun.

## ✨ Özellikler
- **AI Onboarding:** Tek cümleyle profesyonel bir profil oluşturun.
- **Dinamik Temalar:** Profil renginizi tek dokunuşla kişiselleştirin.
- **Analitik:** Ziyaretleri, ürün tıklamalarını ve vCard indirmelerini takip edin.
- **Randevu Sistemi:** Müşterilerinizden doğrudan randevu talebi alın.
- **QR Kod:** Her profile özel indirilebilir QR kod.
- **Tıklanabilir vCard:** Tek tıkla rehbere ekleme özelliği.

## 🛠 Teknoloji Yığını
- **Framework:** Next.js 16 (App Router)
- **Database:** Prisma + PostgreSQL
- **UI:** Tailwind CSS + Framer Motion
- **AI:** OpenAI GPT-4o-mini
- **Auth:** NextAuth.js
