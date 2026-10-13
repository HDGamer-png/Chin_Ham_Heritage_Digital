'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Compass,
  Headphones,
  MapPin,
  Play,
  Pause,
  Maximize2,
  Volume2,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  Share2,
  RotateCcw,
  Eye,
  X,
} from 'lucide-react';

interface SiteData {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  summary?: string;
  description?: string;
  category?: string;
}

const mapBunkers = [
  {
    slug: 'nha-chung-tich',
    name: 'Nhà Chứng Tích',
    tag: 'Trưng bày trung tâm',
    position: 'Trung tâm đồi Ba Đồn',
    coords: '16°26\'42"N 107°33\'18"E',
    detail: 'Bảng vàng ghi danh, hiện vật khảo cổ, sa bàn 3D toàn cảnh 9 căn hầm và hồ sơ chứng tích lịch sử thời Ngô Đình Cẩn.',
    x: 34,
    y: 50,
    color: '#38bdf8',
  },
  {
    slug: 'ham-1',
    name: 'Hầm 1',
    tag: 'Kho đạn Pháp 1941',
    position: 'Triền đồi phía Bắc',
    coords: '16°26\'44"N 107°33\'15"E',
    detail: 'Căn hầm bê tông kiên cố lớn nhất, nơi khởi đầu hệ thống kho đạn thời Pháp, sau 1954 biến thành nơi giam giữ tập thể.',
    x: 26,
    y: 38,
    color: '#e0231c',
  },
  {
    slug: 'ham-2',
    name: 'Hầm 2',
    tag: 'Hầm giam giữ',
    position: 'Sườn đồi phía Đông Bắc',
    coords: '16°26\'43"N 107°33\'19"E',
    detail: 'Hiện trường nguyên vẹn tái hiện ký ức sống động về chuỗi ngày biệt giam của các chiến sĩ cách mạng kiên trung.',
    x: 42,
    y: 35,
    color: '#ffd700',
  },
  {
    slug: 'ham-3',
    name: 'Hầm 3',
    tag: 'Biệt giam cấp cao',
    position: 'Triền dốc sâu',
    coords: '16°26\'41"N 107°33\'20"E',
    detail: 'Hầm ngầm có kết cấu bê tông cốt thép kiên cố, nơi mật vụ dùng để giam giữ các cán bộ cốt cán bí mật.',
    x: 55,
    y: 44,
    color: '#10b981',
  },
  {
    slug: 'ham-4',
    name: 'Hầm 4',
    tag: 'Hầm ngập nước',
    position: 'Thung lũng trũng',
    coords: '16°26\'39"N 107°33\'17"E',
    detail: 'Địa ngục bùn lầy ngập nước buốt lạnh quanh năm, không gian thiếu dưỡng khí tra tấn thể xác và ý chí tù nhân.',
    x: 38,
    y: 64,
    color: '#38bdf8',
  },
  {
    slug: 'ham-5',
    name: 'Hầm 5',
    tag: 'Hầm trừng phạt',
    position: 'Sườn đồi phía Nam',
    coords: '16°26\'38"N 107°33\'21"E',
    detail: 'Chế độ trừng phạt khắc nghiệt, vách đá ẩm ướt rêu phong, nơi ghi dấu khí phách bất khuất của các tù nhân.',
    x: 62,
    y: 60,
    color: '#f97316',
  },
  {
    slug: 'ham-6',
    name: 'Hầm 6',
    tag: 'Hầm kỷ luật',
    position: 'Triền rừng thông',
    coords: '16°26\'37"N 107°33\'19"E',
    detail: 'Dấu tích hầm ngầm cô lập sâu trong rừng thông, nơi cách ly hoàn toàn mọi âm thanh và ánh sáng mặt trời.',
    x: 50,
    y: 75,
    color: '#a855f7',
  },
  {
    slug: 'ham-7',
    name: 'Hầm 7',
    tag: 'Hầm tra khảo',
    position: 'Gần vọng gác chỉ huy',
    coords: '16°26\'40"N 107°33\'14"E',
    detail: 'Hầm thẩm vấn man rợ của mật vụ Ngô Đình Cẩn, gần sở chỉ huy quản thúc nghiêm ngặt.',
    x: 20,
    y: 56,
    color: '#ec4899',
  },
  {
    slug: 'ham-8',
    name: 'Hầm 8',
    tag: 'Chuồng cọp tử hình',
    position: 'Khu vực đỉnh đồi cô lập',
    coords: '16°26\'43"N 107°33\'24"E',
    detail: 'Hầm biệt giam tử tù chính trị đặc biệt khốc liệt và tàn bạo nhất tại Chín Hầm, biểu tượng ý chí bất diệt.',
    x: 74,
    y: 32,
    color: '#ef4444',
  },
  {
    slug: 'ham-9',
    name: 'Hầm 9',
    tag: 'Kho quân sự phụ',
    position: 'Chân đồi phía Tây',
    coords: '16°26\'36"N 107°33\'16"E',
    detail: 'Kho quân sự phụ thời Pháp, cứ điểm chứng kiến sự sụp đổ của chế độ Ngô Đình Cẩn ngày giải phóng 02/11/1963.',
    x: 28,
    y: 82,
    color: '#06b6d4',
  },
];

export function SiteDetailInteractive({ site }: { site: SiteData }) {
  const isNhaChungTich = site.slug === 'nha-chung-tich';

  // Selected Radar Bunker state (no page reload)
  const [selectedRadarSlug, setSelectedRadarSlug] = useState<string>(site.slug || 'nha-chung-tich');

  // Viewport Tab modes
  const [activeTab, setActiveTab] = useState<'exhibition' | 'artifacts' | 'flycam' | 'monument'>('exhibition');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [lightboxImg, setLightboxImg] = useState<{ src: string; title: string; desc: string } | null>(null);

  // Audio Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Audio simulation timer
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 0.3));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Living Canvas particle background
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create particles
    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.6 ? '#38bdf8' : Math.random() > 0.3 ? '#ffd700' : '#e0231c',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle ambient glow spots
      const grad1 = ctx.createRadialGradient(width * 0.25, height * 0.3, 0, width * 0.25, height * 0.3, 400);
      grad1.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(width * 0.8, height * 0.6, 0, width * 0.8, height * 0.6, 450);
      grad2.addColorStop(0, 'rgba(224, 35, 28, 0.04)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Render floating embers / fireflies
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen text-stone-100 overflow-hidden pb-24">
      {/* 3D Living Ambient Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-80"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Top Header & Breadcrumbs */}
      <div className="container-shell relative z-10 pt-8 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <Link
              href="/di-tich"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-xs font-semibold text-stone-300 backdrop-blur-xl transition hover:border-emerald-500/50 hover:bg-black/90 hover:text-white"
            >
              <ArrowLeft size={14} /> Danh sách 9 căn hầm
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-xs font-semibold text-stone-300 backdrop-blur-xl transition hover:border-[#38bdf8]/50 hover:bg-black/90 hover:text-white"
            >
              🏛️ Trang chủ WebGL 3D
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/ban-do-360"
              className="inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/60 bg-gradient-to-r from-[#38bdf8]/25 via-sky-950/40 to-blue-900/40 px-4 py-2 text-xs font-bold text-[#38bdf8] backdrop-blur-xl shadow-lg shadow-[#38bdf8]/20 hover:scale-105 hover:border-[#38bdf8] transition duration-200"
            >
              <Compass size={14} className="text-[#38bdf8] animate-pulse" />
              <span>🌐 Bản Đồ 360°</span>
            </Link>

            <Link
              href="/demo-motion"
              className="inline-flex items-center gap-2 rounded-full border border-[#fef08a]/60 bg-gradient-to-r from-[#ffd700]/25 via-amber-950/40 to-[#38bdf8]/20 px-4 py-2 text-xs font-bold text-[#fef08a] backdrop-blur-xl shadow-lg shadow-[#ffd700]/20 hover:scale-105 hover:border-[#ffd700] transition duration-200"
            >
              <Sparkles size={14} className="text-[#ffd700] animate-spin" style={{ animationDuration: '4s' }} />
              <span>🎨 Xem 5 Demo UI Chuyển Động</span>
            </Link>

            <span className="inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#38bdf8] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#38bdf8] animate-ping" />
              100% Realtime 3D
            </span>
          </div>
        </div>

        {/* Hero Title Section */}
        <div className="mt-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#fef08a] mb-2">
              <Sparkles size={14} className="text-[#38bdf8]" />
              CHỨNG TÍCH LỊCH SỬ • ĐỒI BA ĐỒN, HUẾ
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white font-display tracking-tight">
              {site.name}
            </h1>
            <p className="mt-2 text-lg text-emerald-300 font-semibold max-w-2xl">
              {site.subtitle || 'Không gian trưng bày & bảo tàng lưu giữ ký ức Chín Hầm'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-xs text-stone-300 backdrop-blur-md">
              📍 Tọa độ: <b className="text-white">16°26&apos;42&quot;N 107°33&apos;18&quot;E</b>
            </span>
            <span className="rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-xs text-stone-300 backdrop-blur-md">
              ⛰️ Vị trí: <b className="text-white">Nhà Tả Vu (Sườn đồi)</b>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 MAIN INTERACTIVE 3D & REAL-WORLD VIEWPORT (TRỌNG TÂM TRỰC QUAN HÓA) */}
      {/* ========================================================================= */}
      <div className="container-shell relative z-10 mt-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] shadow-2xl">
          {/* Viewport Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 bg-black/30 px-6 py-4 backdrop-blur-[3px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-[0.16em] text-stone-400 font-semibold mr-2 hidden sm:inline">
                Chế độ góc nhìn:
              </span>
              <button
                onClick={() => { setActiveTab('exhibition'); setActiveHotspot(null); }}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  activeTab === 'exhibition'
                    ? 'bg-[#38bdf8] text-black shadow-lg shadow-[#38bdf8]/30'
                    : 'bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                🏛️ Không Gian 3D Trưng Bày
              </button>
              <button
                onClick={() => { setActiveTab('artifacts'); setActiveHotspot(null); }}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  activeTab === 'artifacts'
                    ? 'bg-[#ffd700] text-black shadow-lg shadow-[#ffd700]/30'
                    : 'bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                ⛓️ Hiện Vật & Xiềng Xích
              </button>
              <button
                onClick={() => { setActiveTab('flycam'); setActiveHotspot(null); }}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  activeTab === 'flycam'
                    ? 'bg-[#e0231c] text-white shadow-lg shadow-[#e0231c]/30'
                    : 'bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                🛰️ Flycam Thực Địa Đồi Ba Đồn
              </button>
              <button
                onClick={() => { setActiveTab('monument'); setActiveHotspot(null); }}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  activeTab === 'monument'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                    : 'bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                🗿 Đài Tưởng Niệm Đá Khối
              </button>

              <Link
                href="/ban-do-360"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#ffd700]/50 bg-gradient-to-r from-[#ffd700]/20 to-[#38bdf8]/20 px-3.5 py-1.5 text-xs font-bold text-[#fef08a] hover:scale-105 transition shadow-lg shadow-[#ffd700]/20"
              >
                <Compass size={13} className="text-[#ffd700]" />
                <span>🌐 Mở Bản Đồ 4K 360°</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const src =
                    activeTab === 'exhibition'
                      ? '/nha_chung_tich_exhibition.jpg'
                      : activeTab === 'artifacts'
                      ? '/chin_ham_artifacts.jpg'
                      : activeTab === 'flycam'
                      ? '/khong_gian_tong_quan.jpg'
                      : '/dai_tuong_niem.jpg';
                  setLightboxImg({
                    src,
                    title: site.name,
                    desc: 'Toàn cảnh không gian số hóa chất lượng cao 8K.',
                  });
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-stone-300 hover:bg-white/10 hover:text-white"
                title="Phóng to toàn màn hình"
              >
                <Maximize2 size={13} />
                <span className="hidden sm:inline">Phóng to</span>
              </button>
            </div>
          </div>

          {/* Viewport Screen Content */}
          <div className="relative h-[420px] md:h-[540px] w-full overflow-hidden bg-[#020508] select-none">
            {/* 1. Tab Exhibition Hall */}
            {activeTab === 'exhibition' && (
              <div className="relative h-full w-full">
                <img
                  src="/nha_chung_tich_exhibition.jpg"
                  alt="Không gian Nhà Chứng Tích - Nhà Tả Vu"
                  className="h-full w-full object-cover object-center transition-transform duration-1000 hover:scale-105"
                />
                {/* Living Flame / Light Shader Layer */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 65%, rgba(255, 180, 80, 0.22) 0%, rgba(56, 189, 248, 0.08) 45%, transparent 70%), linear-gradient(180deg, rgba(2,4,6,0.1) 0%, rgba(2,4,6,0.85) 100%)',
                  }}
                />

                {/* Reticle Target HUD */}
                <div className="absolute top-[68%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full border-2 border-[#38bdf8] shadow-[0_0_20px_#38bdf8] animate-ping opacity-75" />
                  <span className="rounded-full bg-black/85 border border-[#38bdf8]/60 px-3 py-1 text-[11px] font-bold text-[#38bdf8] backdrop-blur-md shadow-2xl">
                    🎯 SA BÀN 3D 9 CĂN HẦM
                  </span>
                </div>

                {/* Interactive Hotspots */}
                <button
                  onClick={() => setActiveHotspot('hotspot-saban')}
                  className="absolute top-[62%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-[#38bdf8] items-center justify-center text-[10px] font-black text-black">
                      1
                    </span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveHotspot('hotspot-tu-lieu')}
                  className="absolute top-[48%] left-[16%] -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd700] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-[#ffd700] items-center justify-center text-[10px] font-black text-black">
                      2
                    </span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveHotspot('hotspot-hien-vat')}
                  className="absolute top-[52%] left-[90%] -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e0231c] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-[#e0231c] items-center justify-center text-[10px] font-black text-white">
                      3
                    </span>
                  </span>
                </button>
              </div>
            )}

            {/* 2. Tab Artifacts */}
            {activeTab === 'artifacts' && (
              <div className="relative h-full w-full">
                <img
                  src="/chin_ham_artifacts.jpg"
                  alt="Kỷ vật khảo cổ Chín Hầm"
                  className="h-full w-full object-cover object-center transition-transform duration-1000 hover:scale-105"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 45% 60%, rgba(255, 215, 0, 0.18) 0%, rgba(224, 35, 28, 0.1) 50%, transparent 75%), linear-gradient(180deg, rgba(2,4,6,0.1) 0%, rgba(2,4,6,0.85) 100%)',
                  }}
                />

                <button
                  onClick={() => setActiveHotspot('hotspot-cum')}
                  className="absolute top-[52%] left-[36%] -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd700] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-[#ffd700] items-center justify-center text-[10px] font-black text-black">
                      ★
                    </span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveHotspot('hotspot-bat')}
                  className="absolute top-[56%] left-[68%] -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-[#38bdf8] items-center justify-center text-[10px] font-black text-black">
                      ✦
                    </span>
                  </span>
                </button>
              </div>
            )}

            {/* 3. Tab Flycam Aerial View */}
            {activeTab === 'flycam' && (
              <div className="relative h-full w-full">
                <img
                  src="/khong_gian_tong_quan.jpg"
                  alt="Không gian tổng quan Flycam"
                  className="h-full w-full object-cover object-[34%_50%] transition-transform duration-1000 hover:scale-105"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 34% 50%, rgba(56, 189, 248, 0.25) 0%, transparent 60%), linear-gradient(180deg, rgba(2,4,6,0.1) 0%, rgba(2,4,6,0.85) 100%)',
                  }}
                />

                {/* Real Ba Đồn POI Pin for Nhà Tả Vu */}
                <div className="absolute top-[50%] left-[34%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full border-2 border-[#38bdf8] shadow-[0_0_25px_#38bdf8] animate-ping" />
                  <span className="mt-2 rounded-full bg-black/90 border border-[#38bdf8] px-3.5 py-1 text-[11px] font-bold text-[#38bdf8] backdrop-blur-md shadow-2xl">
                    📍 VỊ TRÍ NHÀ CHỨNG TÍCH (NHÀ TẢ VU)
                  </span>
                </div>
              </div>
            )}

            {/* 4. Tab Monument */}
            {activeTab === 'monument' && (
              <div className="relative h-full w-full">
                <img
                  src="/dai_tuong_niem.jpg"
                  alt="Đài Tưởng Niệm Chín Hầm"
                  className="h-full w-full object-contain bg-black transition-transform duration-1000 hover:scale-105"
                />
              </div>
            )}

            {/* Interactive Hotspot Tooltip Popup */}
            {activeHotspot && (
              <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-96 rounded-2xl border border-white/20 bg-black/90 p-5 backdrop-blur-2xl shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/70 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                    DI TÍCH KHẢO CỔ GỐC
                  </div>
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="text-stone-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                <h4 className="mt-2 text-base font-bold text-[#fef08a] font-display">
                  {activeHotspot === 'hotspot-saban' && 'Sa Bàn 3D Toàn Cảnh 9 Căn Hầm'}
                  {activeHotspot === 'hotspot-tu-lieu' && 'Tư Liệu Ảnh Giải Phóng 02/11/1963'}
                  {activeHotspot === 'hotspot-hien-vat' && 'Tủ Kính Di Vật Tù Nhân & Khảo Cổ'}
                  {activeHotspot === 'hotspot-cum' && 'Cùm Chân Số 8 & Xiềng Xích Tử Tù'}
                  {activeHotspot === 'hotspot-bat' && 'Bát Sắt & Ca Nhôm Sinh Hoạt'}
                </h4>
                <p className="mt-1 text-xs text-stone-300 leading-relaxed">
                  {activeHotspot === 'hotspot-saban' &&
                    'Tái hiện toàn bộ cấu trúc địa hình đồi Ba Đồn cùng vị trí tọa độ của 9 căn hầm và các công trình đài tưởng niệm theo tỷ lệ thực tế.'}
                  {activeHotspot === 'hotspot-tu-lieu' &&
                    'Lưu giữ hàng trăm bức ảnh lịch sử, bản tự thuật và lời khai tố cáo tội ác của mật vụ Ngô Đình Cẩn sau khi nhà tù Chín Hầm bị xóa sổ.'}
                  {activeHotspot === 'hotspot-hien-vat' &&
                    'Khai quật trực tiếp từ lòng đất tại các căn hầm, được bảo tồn nguyên vẹn dưới điều kiện nhiệt độ và ánh sáng chuẩn bảo tàng quốc gia.'}
                  {activeHotspot === 'hotspot-cum' &&
                    'Khối sắt đặc nặng hơn 10kg, cùm chặt hai chân người tù ngày đêm trong bóng tối ngột ngạt, là chứng tích không thể chối cãi của chế độ giam cầm tàn bạo.'}
                  {activeHotspot === 'hotspot-bat' &&
                    'Những kỷ vật sinh hoạt giản dị nhưng thấm đẫm ý chí kiên cường của các chiến sĩ tử tù trong chuỗi ngày bị biệt giam cách ly với ánh sáng.'}
                </p>
              </div>
            )}

            {/* Bottom Overlay Legend */}
            <div className="absolute bottom-4 left-6 z-10 hidden sm:flex items-center gap-3">
              <span className="rounded-full bg-black/70 border border-white/10 px-3 py-1 text-[11px] text-stone-300 backdrop-blur-md">
                ✦ Di chuột để tương tác và phóng lớn không gian
              </span>
            </div>
          </div>

          {/* Integrated Interactive Audio Guide Bar */}
          <div className="border-t border-white/10 bg-gradient-to-r from-emerald-950/40 via-black/80 to-blue-950/40 p-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl shadow-xl transition transform active:scale-95 ${
                  isPlaying
                    ? 'bg-[#e0231c] text-white shadow-[#e0231c]/40'
                    : 'bg-[#38bdf8] text-black shadow-[#38bdf8]/40 hover:bg-[#60cdff]'
                }`}
                aria-label={isPlaying ? 'Tạm dừng' : 'Phát thuyết minh'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#fef08a] uppercase tracking-wider">
                    Audio Thuyết Minh Trực Quan
                  </span>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-stone-300">
                    05:15
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">
                  Nhà Chứng Tích Ngô Đình Cẩn & Ký Ức Đồi Ba Đồn
                </div>
              </div>
            </div>

            {/* Bouncing Equalizer Waveform */}
            <div className="flex items-center gap-1 h-6">
              {[40, 80, 100, 60, 75, 50, 90, 30].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full bg-[#38bdf8] transition-all duration-300 ${
                    isPlaying ? 'animate-pulse' : 'opacity-40'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(20, (h * (audioProgress % 10 + 2)) / 10)}%` : '35%',
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <Link
                href="/audio-guide"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-stone-200 transition hover:bg-white/10 hover:text-white"
              >
                <Headphones size={14} className="text-[#38bdf8]" />
                <span>Mở Toàn Bộ Audio Guide</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🏛️ BỘ SƯU TẬP HIỆN VẬT & CHỨNG TÍCH KHẢO CỔ (INTERACTIVE CARDS) */}
      {/* ========================================================================= */}
      <div className="container-shell relative z-10 mt-14">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#38bdf8]">
              KHẢO SÁT HIỆN VẬT
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-display mt-1">
              Hiện Vật Khảo Cổ & Ký Ức Biệt Giam
            </h2>
          </div>
          <p className="text-xs text-stone-400 max-w-md">
            Những chứng tích gốc được bảo tồn nguyên vẹn tại Nhà Chứng Tích, minh chứng cho sự kiên trung bất khuất của các chiến sĩ.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              id: 'art-1',
              title: 'Cùm Chân Số 8',
              badge: 'KỶ VẬT GỐC',
              color: '#ffd700',
              img: '/chin_ham_artifacts.jpg',
              desc: 'Cùm sắt đúc nguyên khối khóa chặt chân tử tù, giam giữ trong điều kiện ngập nước và thiếu oxy.',
            },
            {
              id: 'art-2',
              title: 'Sa Bàn 9 Căn Hầm',
              badge: 'MÔ HÌNH 3D',
              color: '#38bdf8',
              img: '/nha_chung_tich_exhibition.jpg',
              desc: 'Tái hiện trực quan toàn bộ hệ thống hầm ngầm quân sự và các cứ điểm phòng thủ từ năm 1941.',
            },
            {
              id: 'art-3',
              title: 'Bát Sắt Khảo Cổ',
              badge: 'HIỆN VẬT SINH HOẠT',
              color: '#10b981',
              img: '/chin_ham_artifacts.jpg',
              desc: 'Vật dụng ăn uống của tù nhân chính trị, lưu giữ dấu vết gỉ sét của năm tháng ngục tù gian nan.',
            },
            {
              id: 'art-4',
              title: 'Hồ Sơ Giải Phóng 1963',
              badge: 'TƯ LIỆU QUỐC GIA',
              color: '#e0231c',
              img: '/nha_chung_tich_exhibition.jpg',
              desc: 'Tài liệu ảnh và biên bản ghi nhận khoảnh khắc nhân dân Thừa Thiên - Huế đập tan ngục tù Chín Hầm.',
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() =>
                setLightboxImg({
                  src: item.img,
                  title: item.title,
                  desc: item.desc,
                })
              }
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] p-4 backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition duration-300 hover:-translate-y-1.5 hover:border-[#38bdf8]/60 hover:bg-black/[0.15] shadow-xl"
            >
              <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-black/60">
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2.5 left-2.5 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-bold text-white border border-white/20 backdrop-blur-md">
                  {item.badge}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-3">
                  <span className="text-xs text-[#38bdf8] font-bold inline-flex items-center gap-1">
                    <Eye size={13} /> Phóng to chi tiết
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-bold text-white font-display group-hover:text-[#38bdf8] transition">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs text-stone-300 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🗺️ BẢN ĐỒ RADAR KHÔNG GIAN 3D (KẾT NỐI TOÀN BỘ 9 CĂN HẦM) */}
      {/* ========================================================================= */}
      <div className="container-shell relative z-10 mt-16">
        <div className="rounded-[2.5rem] border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] p-8 md:p-12 backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#38bdf8] mb-2">
                <Compass size={14} />
                ĐỊNH VỊ KHÔNG GIAN THỰC ĐỊA
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-white font-display">
                Mạng Lưới 9 Căn Hầm & Điểm Chứng Tích
              </h3>
              <p className="mt-3 text-sm text-stone-300 leading-relaxed">
                Bấm vào từng căn hầm bên dưới để định vị ngay lập tức vị trí địa lý trên bản đồ radar đồi Ba Đồn (giữ nguyên trang hiện tại, không tải lại).
              </p>

              {/* Bunker Selector Buttons (In-place interactive switch, 0% page reload) */}
              <div className="mt-6 flex flex-wrap gap-2">
                {mapBunkers.map((b) => {
                  const isSelected = b.slug === selectedRadarSlug;
                  return (
                    <button
                      type="button"
                      key={b.slug}
                      onClick={() => setSelectedRadarSlug(b.slug)}
                      className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer select-none active:scale-95 ${
                        isSelected
                          ? 'bg-[#38bdf8] text-black font-black shadow-lg shadow-[#38bdf8]/40 scale-105 ring-2 ring-white/50'
                          : 'bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white border border-white/10'
                      }`}
                    >
                      {b.name}
                    </button>
                  );
                })}
              </div>

              {/* Selected Bunker Geographical Description Card */}
              {(() => {
                const currentBunker = mapBunkers.find((b) => b.slug === selectedRadarSlug) || mapBunkers[0];
                return (
                  <div className="mt-5 p-4 rounded-2xl border border-[#38bdf8]/40 bg-gradient-to-br from-[#38bdf8]/10 via-black/60 to-black/85 backdrop-blur-md transition-all duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2">
                      <span className="text-xs font-bold text-[#fef08a] uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#38bdf8]" />
                        {currentBunker.name} • {currentBunker.position}
                      </span>
                      <span className="font-mono text-[11px] text-[#38bdf8] font-bold">
                        {currentBunker.coords}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {currentBunker.detail}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                        ĐẶC TÍNH: <span className="text-emerald-300">{currentBunker.tag}</span>
                      </span>
                      {currentBunker.slug !== site.slug && (
                        <Link
                          href={`/di-tich/${currentBunker.slug}`}
                          className="text-[11px] font-bold text-[#38bdf8] hover:text-[#ffd700] transition flex items-center gap-1"
                        >
                          Mở trang hồ sơ riêng &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })()}

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/ban-do-3d"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#e0231c] px-5 py-3 text-xs font-bold text-white shadow-xl shadow-[#e0231c]/30 hover:bg-[#ff3b34] transition"
                >
                  <Compass size={16} /> Mở Bản Đồ 3D Toàn Cảnh
                </Link>
                <Link
                  href="/chatbot"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-bold text-white hover:bg-white/10 transition"
                >
                  🤖 Đặt câu hỏi cho Trợ Lý AI
                </Link>
              </div>
            </div>

            {/* Radar Schematic Visual */}
            <div className="relative h-88 md:h-96 rounded-3xl border border-white/10 bg-[#04080c] overflow-hidden p-6 flex items-center justify-center select-none">
              {/* Radar rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-72 w-72 rounded-full border border-white/5" />
                <div className="h-56 w-56 rounded-full border border-white/10" />
                <div className="h-40 w-40 rounded-full border border-white/15" />
                <div className="h-20 w-20 rounded-full border border-[#38bdf8]/20" />
                {/* Crosshairs */}
                <div className="absolute h-full w-px bg-white/5" />
                <div className="absolute w-full h-px bg-white/5" />
                {/* Rotating scanner beam */}
                <div
                  className="absolute h-72 w-72 rounded-full border-t-2 border-[#38bdf8]/50 animate-spin pointer-events-none"
                  style={{ animationDuration: '6s' }}
                />
              </div>

              {/* Bunker Nodes on radar */}
              {mapBunkers.map((b) => {
                const isSelected = b.slug === selectedRadarSlug;
                return (
                  <button
                    type="button"
                    key={b.slug}
                    onClick={() => setSelectedRadarSlug(b.slug)}
                    title={`${b.name} (${b.tag})`}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer focus:outline-none group"
                    style={{ left: `${b.x}%`, top: `${b.y}%` }}
                  >
                    {/* Active Ping Glow Rings */}
                    {isSelected && (
                      <>
                        <span className="absolute -inset-3 rounded-full bg-[#38bdf8] opacity-75 animate-ping pointer-events-none" />
                        <span className="absolute -inset-6 rounded-full border border-[#38bdf8]/40 animate-pulse pointer-events-none" />
                      </>
                    )}

                    {/* Dot Indicator */}
                    <div
                      className={`rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'h-5 w-5 bg-[#38bdf8] ring-4 ring-[#38bdf8]/50 shadow-[0_0_30px_#38bdf8] scale-125'
                          : 'h-3.5 w-3.5 bg-stone-500 hover:bg-white hover:scale-125'
                      }`}
                    />

                    {/* FLOATING TITLE ON THE ACTIVE BLUE POINT */}
                    {isSelected && (
                      <div className="absolute -top-11 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap rounded-xl bg-black/95 border-2 border-[#38bdf8] px-3 py-1 shadow-[0_0_25px_rgba(56,189,248,0.7)] backdrop-blur-xl flex items-center gap-1.5 animate-in fade-in zoom-in-90 duration-200 pointer-events-none">
                        <span className="h-2 w-2 rounded-full bg-[#38bdf8] animate-ping flex-shrink-0" />
                        <span className="text-xs font-black text-white">{b.name}</span>
                        <span className="text-[10px] text-[#38bdf8] font-mono font-bold">({b.coords})</span>
                      </div>
                    )}

                    {/* Hover tooltip for unselected dots */}
                    {!isSelected && (
                      <span className="absolute left-1/2 -translate-x-1/2 -bottom-6 hidden group-hover:block whitespace-nowrap rounded-lg bg-black/90 px-2 py-0.5 text-[10px] font-bold text-white border border-white/20 z-30 pointer-events-none">
                        {b.name}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Status Header Badge on Radar */}
              <div className="absolute top-4 left-4 text-[10px] font-mono text-stone-400 bg-black/70 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-sm flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] animate-ping" />
                <span>RADAR: ĐỒI BA ĐỒN (16°26&apos;N 107°33&apos;E) • ĐANG CHỈ ĐỊNH:</span>
                <b className="text-[#38bdf8]">
                  {(mapBunkers.find((b) => b.slug === selectedRadarSlug) || mapBunkers[0]).name.toUpperCase()}
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-2xl animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full rounded-3xl border border-white/20 bg-stone-950 p-4 md:p-6 shadow-2xl"
          >
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <X size={18} />
            </button>
            <div className="overflow-hidden rounded-2xl bg-black">
              <img
                src={lightboxImg.src}
                alt={lightboxImg.title}
                className="w-full max-h-[70vh] object-contain mx-auto"
              />
            </div>
            <div className="mt-4 px-2">
              <h3 className="text-xl font-bold text-white font-display">{lightboxImg.title}</h3>
              <p className="mt-1 text-sm text-stone-300">{lightboxImg.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
