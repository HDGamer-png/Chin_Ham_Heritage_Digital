import type { Metadata } from 'next';
import Link from 'next/link';
import { Box, KeyRound, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hành Trình Ký Ức | Di Tích Số Hóa Chín Hầm',
  description:
    'Trung tâm trải nghiệm số hóa 3 phân khu: Showroom Hiện vật 3D, Web-Quest Giải Mã Ký Ức 1963 và Đấu Trí Thiên Thai & Góc Học Đường.',
};

const JOURNEY_SECTIONS = [
  {
    id: 'hien-vat-3d',
    title: 'Showroom Hiện Vật 3D',
    subtitle: 'Chạm & Soi Rãnh Khắc Ngục Tối',
    description:
      'Trải nghiệm xoay 360°, chế độ tách lớp phân rã X-Ray, và công nghệ đèn pin 3D rọi sáng từng vết cào đinh chìm trên chiếc lược nhôm, ca nước nhôm, cùm chân sắt và khuy áo giấu mật thư.',
    badge: 'Công Nghệ 3D WebGL',
    badgeColor: 'border-emerald-400/40 bg-emerald-950/60 text-emerald-300',
    icon: Box,
    href: '/hien-vat-3d',
    image: '/chin_ham_artifacts.jpg',
    accent: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    border: 'hover:border-emerald-400/60',
    buttonColor: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    features: ['Đèn pin 3D rọi theo chuột', 'Phân rã X-Ray cơ học', 'Khảo sát rãnh khắc lịch sử'],
  },
  {
    id: 'giai-ma-1963',
    title: 'Web-Quest Giải Mã 1963',
    subtitle: 'Hành Trình Vượt Ngục & Tự Do',
    description:
      'Hành trình gamified 4 trạm tương tác: định vị Hầm số 8 trên sa bàn, giải mật mã lược nhôm 1963, giải mã nhịp gõ Morse qua tường đá xà lim và sắp xếp dòng thời gian ngày giải phóng 02/11/1963.',
    badge: 'Web-Quest Tương Tác',
    badgeColor: 'border-amber-400/40 bg-amber-950/60 text-amber-300',
    icon: KeyRound,
    href: '/giai-ma',
    image: '/ban_do_chinham.png',
    accent: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    border: 'hover:border-amber-400/60',
    buttonColor: 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white hover:from-amber-500 hover:to-yellow-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    features: ['Âm thanh Morse tường đá Web Audio', '4 trạm thử thách tư liệu', 'Xuất Giấy Chứng Nhận độc bản'],
  },
  {
    id: 'dau-tri-ba-don',
    title: 'Đấu Trí & Góc Học Đường',
    subtitle: 'Thi Đấu Lịch Sử & Tài Liệu A4',
    description:
      'Đấu trí 10 câu hỏi lịch sử Chín Hầm tính điểm phản xạ và chuỗi combo, bảng vàng thi đua giữa các trường học, và xuất Phiếu học tập thực địa chuẩn A4 1-click in ấn dành cho học sinh, sinh viên.',
    badge: 'Giáo Dục & Thi Đua',
    badgeColor: 'border-emerald-400/40 bg-emerald-950/60 text-emerald-300',
    icon: GraduationCap,
    href: '/dau-tri-ba-don',
    image: '/dai_tuong_niem.jpg',
    accent: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    border: 'hover:border-emerald-400/60',
    buttonColor: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    features: ['Bảng vàng vinh danh trường học', 'Hệ thống chuỗi Streak & Huy hiệu', 'In Phiếu Học Tập A4 chuẩn Bộ GD&ĐT'],
  },
];

export default function HanhTrinhKyUcPage() {
  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            <Sparkles size={16} className="text-emerald-400 animate-pulse" />
            Không Gian Tương Tác Số Hóa • Living Green 3D
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-stone-100 font-display tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            Hành Trình Ký Ức
          </h1>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            Quy tụ 3 phân khu trải nghiệm đa giác quan: chạm vào hiện vật 3D, giải mã bí mật lao tù và thi đấu tri thức lịch sử đồi Thiên Thai.
          </p>
        </div>

        {/* 3 Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {JOURNEY_SECTIONS.map((section) => {
            const Icon = section.icon;

            return (
              <div
                key={section.id}
                className={`relative rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] flex flex-col justify-between backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-all duration-500 hover:-translate-y-2 hover:bg-black/[0.15] group overflow-hidden ${section.border}`}
              >
                {/* Image Header with smooth zoom */}
                <div className="relative h-44 overflow-hidden border-b border-emerald-500/15">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="relative z-10 p-5 pb-3 md:pb-5 flex flex-col justify-end md:justify-center h-full">
                    <div className="flex items-center justify-between w-full">
                      <div className="w-12 h-12 rounded-2xl bg-black/40 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shadow-md group-hover:scale-110 group-hover:border-emerald-400 transition duration-300 backdrop-blur-[3px]">
                        <Icon size={24} />
                      </div>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-[3px] ${section.badgeColor}`}
                      >
                        {section.badge}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-7 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-stone-100 font-display group-hover:text-[#fef08a] transition">
                        {section.title}
                      </h2>
                      <p className="text-xs font-semibold text-emerald-400/90 mt-1 uppercase tracking-wider">
                        {section.subtitle}
                      </p>
                    </div>

                    <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                      {section.description}
                    </p>

                    {/* Highlights list */}
                    <div className="space-y-2 pt-3 border-t border-emerald-500/15">
                      {section.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-stone-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <Link
                      href={section.href}
                      className={`w-full py-3 px-5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-300 ${section.buttonColor}`}
                    >
                      <span>Khám phá ngay</span>
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
