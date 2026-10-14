'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, Headphones, Sparkles, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

const mapPoints = [
  { id: 'ct', label: 'Nhà Chứng Tích', detail: 'Bảng vàng ghi danh, di vật, hồ sơ chứng tích tội ác', position: 'Trung tâm đồi Thiên Thai', coords: '16°26\'42"N 107°33\'18"E', status: 'Khu trung tâm tưởng niệm' },
  { id: 'h1', label: 'Hầm Số 1 (Kho Đạn)', detail: 'Không gian mở đầu, nơi giam giữ tập thể sau 1954', position: 'Triền đồi phía Bắc', coords: '16°26\'44"N 107°33\'15"E', status: 'Căn hầm lớn nhất' },
  { id: 'h2', label: 'Hầm Số 2 (Hầm Giam Giữ)', detail: 'Nơi giam các chiến sĩ cách mạng kiên trung', position: 'Sườn đồi phía Đông Bắc', coords: '16°26\'43"N 107°33\'19"E', status: 'Hiện trường nguyên vẹn' },
  { id: 'h3', label: 'Hầm Số 3 (Biệt Giam Cấp Cao)', detail: 'Giam giữ các lãnh đạo cốt cán bí mật', position: 'Triền dốc sâu', coords: '16°26\'41"N 107°33\'20"E', status: 'Kết cấu bê tông kiên cố' },
  { id: 'h4', label: 'Hầm Số 4 (Hầm Ngập Nước)', detail: 'Bùn lầy ngập gối, thiếu oxy và bóng tối quanh năm', position: 'Thung lũng trũng', coords: '16°26\'39"N 107°33\'17"E', status: 'Địa ngục bùn lầy' },
  { id: 'h5', label: 'Hầm Số 5 (Hầm Trừng Phạt)', detail: 'Chế độ tra tấn khắc nghiệt, vách đá ẩm ướt', position: 'Sườn đồi phía Nam', coords: '16°26\'38"N 107°33\'21"E', status: 'Di tích khảo sát' },
  { id: 'h6', label: 'Hầm Số 6 (Hầm Kỷ Luật)', detail: 'Giam cầm biệt lập trong bóng đêm vĩnh hằng', position: 'Triền rừng thông', coords: '16°26\'37"N 107°33\'19"E', status: 'Dấu tích hầm ngầm' },
  { id: 'h7', label: 'Hầm Số 7 (Hầm Tra Khảo)', detail: 'Nơi thẩm vấn man rợ của mật vụ Ngô Đình Cẩn', position: 'Gần vọng gác chỉ huy', coords: '16°26\'40"N 107°33\'14"E', status: 'Tư liệu chứng tích' },
  { id: 'h8', label: 'Hầm Số 8 (Hầm Tử Hình)', detail: 'Hầm biệt giam khốc liệt nhất của Ngô Đình Cẩn', position: 'Khu vực đỉnh đồi cô lập', coords: '16°26\'43"N 107°33\'24"E', status: 'Khắc nghiệt nhất' },
  { id: 'h9', label: 'Hầm Số 9 (Hầm Đạn Dược)', detail: 'Kho quân sự phụ, dấu tích cuối cùng của cụm hầm', position: 'Chân đồi phía Tây', coords: '16°26\'36"N 107°33\'16"E', status: 'Khu vực bảo tồn' },
];

export default function BanDo3DPage() {
  const [selectedPoint, setSelectedPoint] = useState(mapPoints[0]);

  return (
    <main className="container-shell py-12 md:py-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
          >
            <ArrowLeft size={16} /> Quay lại trang chủ
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            <Sparkles size={14} />
            Không Gian 3D Trực Quan • Toàn Cảnh
          </div>
          <h1 className="mt-2 text-3xl font-black text-white md:text-5xl font-display">
            Bản Đồ Không Gian 3D Đồi Thiên Thai
          </h1>
        </div>

        <p className="max-w-md text-sm text-stone-300 leading-relaxed">
          Không gian 3D Living Green tương tác theo thời gian thực — di chuyển con trỏ chuột trên màn hình để điều khiển chùm tia sáng và gọi cánh bướm Thiên Thai.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        {/* INTERACTIVE RADAR & LANDMARK OVERVIEW */}
        <div className="flex flex-col justify-between rounded-[2.5rem] border border-white/10 bg-black/50 p-7 md:p-10 backdrop-blur-2xl shadow-2xl">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-emerald-400">Điểm Đang Chọn</span>
                <h2 className="text-2xl font-bold text-[#fef08a] font-display md:text-3xl">{selectedPoint.label}</h2>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-950/70 px-3.5 py-1 text-xs font-bold text-emerald-300">
                {selectedPoint.coords}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-base leading-relaxed text-stone-200">
                {selectedPoint.detail}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300">
                <span className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
                  <MapPin size={13} className="text-emerald-400" /> {selectedPoint.position}
                </span>
                <span className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" /> {selectedPoint.status}
                </span>
              </div>
            </div>

            {/* Visual Radar Mockup */}
            <div className="mt-8 relative h-64 w-full rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-black/60 to-stone-950/80 p-6 flex flex-col justify-between overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(16,185,129,0.15),_transparent_70%)] pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between text-xs text-emerald-300">
                <span>Vị trí vệ tinh GIS đồi Thiên Thai</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" /> Realtime 3D Sync
                </span>
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-full border border-emerald-400/40 bg-emerald-950/80 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-950/50">
                  <Compass size={32} className="animate-spin" style={{ animationDuration: '20s' }} />
                </div>
                <div className="mt-3 text-sm font-bold text-white font-display">{selectedPoint.label}</div>
                <div className="text-xs text-stone-400">{selectedPoint.position}</div>
              </div>

              <div className="relative z-10 text-right text-[11px] text-stone-400">
                Di chuyển chuột khắp màn hình để chiếu scan light vào lòng đất
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <Link
              href="/di-tich"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-950/40 transition hover:from-emerald-500 hover:to-emerald-400 text-sm"
            >
              Xem Hồ Sơ Chi Tiết <ArrowRight size={16} />
            </Link>
            <Link
              href="/audio-guide"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
            >
              <Headphones size={16} className="text-emerald-400" /> Nghe Thuyết Minh Căn Hầm Này
            </Link>
          </div>
        </div>

        {/* POINT INFORMATION LIST */}
        <div className="space-y-3">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white font-display">Danh Sách 9 Căn Hầm</h2>
            <p className="text-xs text-stone-400">Bấm để xem tọa độ và hồ sơ khảo tả</p>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {mapPoints.map((point) => (
              <button
                key={point.id}
                type="button"
                onClick={() => setSelectedPoint(point)}
                className={`w-full rounded-2xl border p-4 text-left backdrop-blur-xl transition duration-200 ${
                  selectedPoint.id === point.id
                    ? 'border-emerald-500/70 bg-emerald-950/60 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/40'
                    : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-black/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold font-display text-base ${selectedPoint.id === point.id ? 'text-[#fef08a]' : 'text-white'}`}>
                    {point.label}
                  </h3>
                  <span className="text-[10px] font-semibold text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full">
                    {point.position}
                  </span>
                </div>
                <p className="mt-1 text-xs text-stone-300 line-clamp-1">{point.detail}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
