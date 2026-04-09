import { Navbar } from "@/components/Navbar"
import { HomeClientContainer } from "@/components/sections/HomeClientContainer"
// Sunucu tarafında çeviri veya veri çekme işlemleri buraya eklenebilir.
// Şu anki yapıda çeviri mantığı Client side Context üzerinden yürüdüğü için 
// HomeClientContainer kendi içinde useTranslation kullanmaya devam edecek.

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-rose-100 selection:text-rose-600 overflow-x-hidden relative">
      {/* ─── GLOBAL PREMIUM LAYERS ─── */}
      {/* Bu katmanlar statik içerdiği için burada kalabilir, 
          ancak motion bileşenleri HomeClientContainer veya ayrı bir bileşene taşınmalıdır.
          Performans için bu arka plan efektlerini ClientContainer içine alıyoruz. */}
      
      <div className="fixed inset-0 pointer-events-none z-[1]">
          {/* Grain Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] contrast-150 brightness-100 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      </div>

      <Navbar />
      
      {/* Client tarafındaki tüm state ve lazy load yönetimini bu bileşen üstlenir */}
      <HomeClientContainer t={null /* t artık içeride context'ten alınacak */} />
    </main>
  )
}
