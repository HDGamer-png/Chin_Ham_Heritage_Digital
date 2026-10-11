import Link from 'next/link';
import { ArrowRight, Compass, Headphones, MessageSquareText, Sparkles, Trees, Eye, Volume2, ShieldCheck, MapPin } from 'lucide-react';
import { MotionSection } from '@/components/motion-section';
import { heritageSites } from '@/content/site-data';

export default function ChinHamPage() {
  return (
    <div className="relative">
      {/* HERO SECTION OVER FULLSCREEN 3D LIVING WORLD */}
      <section className="container-shell pt-20 pb-24 md:pt-28 md:pb-32 lg:pt-36 lg:pb-40">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300 backdrop-blur-md shadow-lg shadow-black/40">
            <Sparkles size={14} className="text-emerald-400 animate-pulse" />
            Di Tích Lịch Sử • Đồi Ba Đồn, Cố Đô Huế
          </div>

          <h1 className="text-4xl font-black leading-[1.08] text-white md:text-6xl lg:text-7xl font-display drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            Chín Hầm — <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#fef08a] via-amber-200 to-emerald-300 bg-clip-text text-transparent">
              Ký Ức Bi Tráng & Sự Sống Hồi Sinh
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone-200 md:text-lg lg:text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Nơi từng là chốn ngục tối khốc liệt của Ngô Đình Cẩn, nay thảm rêu phong đồi Ba Đồn đã phủ xanh những vết thương lịch sử. Hoa dại nảy mầm, dương xỉ xanh ngát và cánh bướm tự do chao liệng — mời bạn bước vào bảo tàng số tương tác cùng thiên nhiên sống động.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/di-tich"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-7 py-4 text-base font-bold text-white shadow-xl shadow-emerald-950/60 transition duration-200 hover:-translate-y-1 hover:shadow-2xl hover:from-emerald-500 hover:to-emerald-400"
            >
              Khám Phá 9 Căn Hầm <ArrowRight size={18} />
            </Link>
            <Link
              href="/audio-guide"
              className="inline-flex items-center gap-2.5 rounded-2xl border border-white/20 bg-black/40 px-7 py-4 text-base font-semibold text-white backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-black/60"
            >
              <Headphones size={18} className="text-emerald-400" /> Nghe Audio Guide
            </Link>
            <Link
              href="/hien-vat-3d"
              className="inline-flex items-center gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-950/40 px-7 py-4 text-base font-semibold text-amber-200 backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-amber-400 hover:bg-black/60"
            >
              <Sparkles size={18} className="text-amber-400" /> Hiện Vật 3D
            </Link>
          </div>

          {/* Micro Feature Tags */}
          <div className="mt-12 flex flex-wrap items-center gap-6 text-xs font-medium text-stone-300 drop-shadow">
            <span className="flex items-center gap-2">
              <Trees size={16} className="text-emerald-400" /> Rừng Thông Đồi Ba Đồn
            </span>
            <span className="flex items-center gap-2">
              <Eye size={16} className="text-emerald-400" /> 3D Living Green Realtime
            </span>
            <span className="flex items-center gap-2">
              <Volume2 size={16} className="text-emerald-400" /> Giọng Thuyết Minh Xứ Huế
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" /> Di Tích Lịch Sử Quốc Gia
            </span>
          </div>
        </div>
      </section>

      {/* CORE EXPERIENCE PILLARS - TRANSLUCENT GLASS CARDS */}
      <MotionSection className="container-shell pb-20 md:pb-28">
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {[
            {
              icon: Compass,
              title: 'Hành Trình Di Tích',
              text: 'Dạo bước qua 9 căn hầm và Nhà Chứng Tích, tìm hiểu kết cấu quân sự thời Pháp 1941 và tội ác giam cầm 1954–1963.',
              link: '/di-tich',
              badge: 'Không Gian Thực Địa',
            },
            {
              icon: Headphones,
              title: 'Audio Guide Truyền Cảm',
              text: 'Giọng đọc chuẩn truyền cảm xứ Huế, hòa quyện cùng tiếng thông reo Ba Đồn, tiếng chuông tưởng niệm và lời kể nhân chứng.',
              link: '/audio-guide',
              badge: 'Âm Thanh Không Gian',
            },
            {
              icon: MessageSquareText,
              title: 'Trợ Lý AI Lịch Sử',
              text: 'Giải đáp chuẩn xác các thắc mắc về sự kiện 02/11/1963 phá hầm giải phóng, hồ sơ nhân vật và các mốc lịch sử di sản.',
              link: '/chatbot',
              badge: 'Tương Tác 24/7',
            },
          ].map(({ icon: Icon, title, text, link, badge }) => (
            <Link
              key={title}
              href={link}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-black/45 p-7 backdrop-blur-2xl shadow-2xl transition duration-300 hover:-translate-y-2 hover:border-emerald-500/50 hover:bg-black/60"
            >
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/70 text-emerald-300 shadow-md">
                    <Icon size={24} />
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-stone-300">
                    {badge}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white font-display transition group-hover:text-[#fef08a]">
                  {title}
                </h3>
                <p className="mt-3 leading-relaxed text-stone-300 text-sm md:text-base">
                  {text}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-emerald-400 transition group-hover:translate-x-1">
                Trải nghiệm ngay <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </MotionSection>

      {/* FOCAL BUNKER SITES */}
      <MotionSection className="container-shell pb-20 md:pb-28">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              <MapPin size={13} />
              Chứng Tích Đồi Ba Đồn
            </div>
            <h2 className="text-3xl font-black text-white md:text-5xl font-display">
              Các Điểm Đến Trọng Yếu
            </h2>
          </div>

          <Link
            href="/di-tich"
            className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full border border-white/15 bg-black/40 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-emerald-500/60 hover:bg-black/60 md:self-auto"
          >
            Xem toàn bộ 9 căn hầm
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-200 group-hover:translate-x-0.5">
              <ArrowRight size={15} />
            </span>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {heritageSites.slice(0, 3).map((site) => (
            <div
              key={site.slug}
              className="group flex flex-col justify-between rounded-[2rem] border border-white/10 bg-black/40 p-7 backdrop-blur-2xl shadow-2xl transition duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40"
            >
              <div>
                <div className="mb-5 flex h-44 flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-950/80 via-stone-900/90 to-black p-5 text-white shadow-inner">
                  <span className="inline-block self-start rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                    {site.subtitle}
                  </span>
                  <div>
                    <span className="text-xs text-stone-400">Vị trí thực địa</span>
                    <h4 className="text-xl font-bold text-[#fef08a] font-display">{site.name}</h4>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white font-display">{site.name}</h3>
                <p className="mt-3 leading-relaxed text-stone-300 text-sm line-clamp-3">
                  {site.description}
                </p>
              </div>

              <Link
                href={`/di-tich/${site.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-400 transition group-hover:text-emerald-300"
              >
                Xem chi tiết tư liệu <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </MotionSection>
    </div>
  );
}
