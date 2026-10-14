import Link from 'next/link';
import { heritageSites as fallbackSites } from '@/content/site-data';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const siteImages: Record<string, string> = {
  'nha-chung-tich': '/nha_chung_tich_exhibition.jpg',
  'ham-1': '/cac-ham/ham-1.jpg',
  'ham-2': '/cac-ham/ham-2.jpg',
  'ham-3': '/cac-ham/ham-3.jpg',
  'ham-4': '/cac-ham/ham-4.jpg',
  'ham-5': '/cac-ham/ham-5.jpg',
  'ham-6': '/cac-ham/ham-6.jpg',
  'ham-7': '/cac-ham/ham-7.jpg',
  'ham-8': '/cac-ham/ham-8.jpg',
  'ham-9': '/cac-ham/ham-9.jpg',
  'dai-tuong-niem': '/dai_tuong_niem.jpg',
};

async function getSites() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sites`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Backend unavailable');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : fallbackSites;
  } catch {
    return fallbackSites;
  }
}

export default async function DiTichPage() {
  const heritageSites = await getSites();

  return (
    <main className="container-shell py-16">
      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Di Tích Lịch Sử • Chín Hầm
        </div>
        <h1 className="text-4xl font-black text-white md:text-5xl font-display tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          9 Căn Hầm & Điểm Chứng Tích
        </h1>
        <p className="mt-3 max-w-2xl text-stone-300 text-base leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          Khám phá không gian thực địa từng căn hầm tại đồi Ba Đồn qua các tài liệu lịch sử, kết cấu quân sự và các câu chuyện hào hùng trong không gian 3D Living Green.
        </p>
      </div>

      <div className="mb-12 grid gap-4 md:grid-cols-3">
        {[
          { value: '09', label: 'Căn hầm lịch sử thực địa' },
          { value: '1941–1963', label: 'Giai đoạn xây dựng & biệt giam' },
          { value: '100%', label: 'Tương tác bảo tàng số 3D' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] p-6 backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-all hover:border-emerald-400/40 hover:bg-black/[0.15]"
          >
            <div className="text-3xl font-black text-[#fef08a] font-display">{stat.value}</div>
            <div className="mt-2 text-sm text-stone-300">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {heritageSites.map((site) => (
          <Link
            key={site.slug}
            href={`/di-tich/${site.slug}`}
            className="group overflow-hidden rounded-[2rem] border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/50 hover:shadow-[0_20px_45px_rgba(16,185,129,0.2)] hover:bg-black/[0.15] flex flex-col justify-between"
          >
            <div>
              {/* Card Image Header with subtle Living Green Grading */}
              <div className="relative h-52 overflow-hidden border-b border-emerald-500/15">
                <img
                  src={siteImages[site.slug] || '/khong_gian_tong_quan.jpg'}
                  alt={site.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative z-10 p-5 flex flex-col justify-between h-full">
                  <div className="self-start rounded-full border border-emerald-400/30 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300 backdrop-blur-[3px]">
                    {site.category || 'Di tích'}
                  </div>
                  <div>
                    <span className="text-[11px] font-medium tracking-wider uppercase text-emerald-400/90">Đồi Ba Đồn • Huế</span>
                    <h3 className="text-xl font-bold text-[#fef08a] font-display">{site.name}</h3>
                  </div>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">{site.subtitle}</p>
                <h2 className="mt-2 text-2xl font-bold text-white font-display transition group-hover:text-[#fef08a]">{site.name}</h2>
                <p className="mt-3 text-stone-300 text-sm leading-relaxed line-clamp-3">{site.description}</p>
              </div>
            </div>

            {/* Interactive Sylva Pill Button */}
            <div className="px-6 pb-6 pt-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-white/5 backdrop-blur-[3px] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <span>Khám phá tư liệu</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
