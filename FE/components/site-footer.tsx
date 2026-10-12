'use client';

import Link from 'next/link';
import { Sparkles, MapPin, Compass, ShieldCheck, ArrowUp, ArrowUpRight, Phone } from 'lucide-react';

export function SiteFooter() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative border-t border-emerald-500/20 bg-gradient-to-b from-transparent via-black/10 to-black/20 backdrop-blur-[5px] text-stone-300 overflow-hidden">
      {/* Tia sáng hairline viền đỉnh mờ ảo */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent pointer-events-none" />

      {/* Nội dung footer chính */}
      <div className="container-shell grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-12 relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {/* Cột 1: Thông tin thương hiệu & Giới thiệu di tích (5 cột) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-3.5 group mb-4">
              <div className="relative">
                <img
                  src="/Logo CH1.png"
                  alt="Logo Chín Hầm"
                  className="h-11 w-11 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <div className="text-lg font-bold tracking-wider text-white font-display">
                  Chín Hầm Heritage
                </div>
                <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 tracking-wide">
                  <Sparkles size={11} className="text-amber-400" />
                  <span>Di sản công nghệ số Huế</span>
                </div>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-stone-300/85 leading-relaxed mb-5 max-w-md">
              Không gian số hóa di tích lịch sử Quốc gia Chín Hầm — Đồi Ba Đồn, Huế. Tái hiện dòng thời gian và ký ức bất khuất qua công nghệ 3D, bản đồ 360° thực địa và giáo dục di sản tương tác.
            </p>
          </div>

          {/* Huy hiệu vị trí & trạng thái mở cửa */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-stone-300 backdrop-blur-md">
              <MapPin size={12} className="text-amber-400 shrink-0" />
              <span>Đồi Ba Đồn, P. An Tây, TP. Huế</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 backdrop-blur-md font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Di tích mở cửa tham quan</span>
            </div>
          </div>
        </div>

        {/* Cột 2: Khám Phá Không Gian Số (2 cột) */}
        <div className="lg:col-span-2">
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
            <Compass size={13} />
            <span>Khám Phá</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-stone-400">
            <li>
              <Link href="/ban-do-360" className="inline-flex items-center gap-1 hover:text-emerald-300 hover:translate-x-1 transition duration-200">
                <span>Bản đồ 360°</span>
                <ArrowUpRight size={11} className="opacity-60" />
              </Link>
            </li>
            <li>
              <Link href="/hien-vat-3d" className="inline-flex items-center gap-1 hover:text-emerald-300 hover:translate-x-1 transition duration-200">
                <span>Hiện vật 3D</span>
                <ArrowUpRight size={11} className="opacity-60" />
              </Link>
            </li>
            <li>
              <Link href="/di-tich" className="hover:text-emerald-300 hover:translate-x-1 inline-block transition duration-200">
                Di tích Chín Hầm
              </Link>
            </li>
            <li>
              <Link href="/audio-guide" className="hover:text-emerald-300 hover:translate-x-1 inline-block transition duration-200">
                Audio Guide thuyết minh
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Trải Nghiệm & Ký Ức (3 cột) */}
        <div className="lg:col-span-3">
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>Trải Nghiệm</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-stone-400">
            <li>
              <Link href="/giai-ma" className="hover:text-emerald-300 hover:translate-x-1 inline-block transition duration-200">
                Giải Mã Ký Ức 1963
              </Link>
            </li>
            <li>
              <Link href="/dau-tri-ba-don" className="hover:text-emerald-300 hover:translate-x-1 inline-block transition duration-200">
                Đấu Trí & Góc Học Đường
              </Link>
            </li>
            <li>
              <Link href="/chatbot" className="inline-flex items-center gap-1.5 hover:text-emerald-300 hover:translate-x-1 transition duration-200">
                <span>Chatbot AI Di Tích</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">AI</span>
              </Link>
            </li>
            <li>
              <Link href="/hanh-trinh-ky-uc" className="hover:text-emerald-300 hover:translate-x-1 inline-block transition duration-200">
                Hành trình ký ức tổng quan
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 4: Thông Tin & Liên Hệ (2 cột) */}
        <div className="lg:col-span-2">
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck size={13} />
            <span>Thông Tin</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-stone-400">
            <li>
              <Link href="/lien-he" className="inline-flex items-center gap-1 text-emerald-400 font-semibold hover:text-emerald-300 hover:translate-x-1 transition duration-200">
                <span>Đặt lịch tham quan</span>
                <ArrowUpRight size={11} />
              </Link>
            </li>
            <li>
              <Link href="/chin-ham" className="hover:text-emerald-300 hover:translate-x-1 inline-block transition duration-200">
                Giới thiệu dự án
              </Link>
            </li>
            <li>
              <Link href="/chinh-sach" className="hover:text-emerald-300 hover:translate-x-1 inline-block transition duration-200">
                Chính sách & Bản quyền
              </Link>
            </li>
            <li className="pt-1">
              <a href="tel:02343822537" className="inline-flex items-center gap-1.5 text-stone-400 hover:text-amber-300 transition text-[11px]">
                <Phone size={11} className="text-emerald-400" />
                <span>0234 3822 537</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Dòng bản quyền & Nút cuộn lên đầu trang */}
      <div className="border-t border-emerald-500/10 py-4 bg-transparent">
        <div className="container-shell flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <div className="text-center sm:text-left">
            © 2026 <strong className="text-stone-300 font-semibold">Chín Hầm Heritage Digital</strong> • Kết nối ký ức với tương lai
          </div>
          <div className="flex items-center gap-4">
            <span className="text-stone-500 hidden md:inline text-[11px]">
              Dự án số hóa di sản phi lợi nhuận
            </span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/5 hover:bg-emerald-950/60 border border-white/10 hover:border-emerald-500/40 text-stone-300 hover:text-emerald-300 transition text-xs font-medium backdrop-blur-md active:scale-95"
              title="Cuộn lên đầu trang"
            >
              <span>Lên đầu trang</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
