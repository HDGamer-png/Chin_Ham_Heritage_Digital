import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-emerald-500/15 bg-[#090e0b]/85 backdrop-blur-2xl text-stone-300">
      <div className="container-shell grid gap-8 py-10 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-3 text-lg font-semibold text-white">
            <img
              src="/Logo CH1.png"
              alt="Logo Chín Hầm"
              className="h-10 w-10 object-contain drop-shadow"
            />
            <span className="font-display tracking-wide">Chín Hầm Heritage</span>
          </div>
          <p className="text-sm text-stone-400 leading-relaxed">
            Nền tảng bảo tàng số về di tích lịch sử, gắn kết tri thức, cảm hứng và trải nghiệm du lịch có trách nhiệm.
          </p>
        </div>

        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Điều hướng</div>
          <ul className="space-y-2 text-sm text-stone-400">
            <li><Link href="/di-tich" className="hover:text-emerald-300 transition-colors">Di tích</Link></li>
            <li><Link href="/audio-guide" className="hover:text-emerald-300 transition-colors">Audio Guide</Link></li>
            <li><Link href="/chatbot" className="hover:text-emerald-300 transition-colors">Chatbot AI</Link></li>
          </ul>
        </div>

        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Pháp lý</div>
          <ul className="space-y-2 text-sm text-stone-400">
            <li><Link href="/chinh-sach" className="hover:text-emerald-300 transition-colors">Chính sách</Link></li>
            <li><Link href="/lien-he" className="hover:text-emerald-300 transition-colors">Liên hệ</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-emerald-500/10 py-4 text-center text-xs text-stone-500">
        © 2026 Chín Hầm Heritage Digital • Kết nối ký ức với tương lai
      </div>
    </footer>
  );
}
