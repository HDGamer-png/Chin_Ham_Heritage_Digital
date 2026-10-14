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
  area?: string;
  architecture?: string;
  historicalNarration?: string;
  historicalFigures?: string[];
}

const mapBunkers = [
  {
    slug: 'nha-chung-tich',
    name: 'Nhà Chứng Tích',
    tag: 'Trưng bày trung tâm',
    position: 'Trung tâm đồi Ba Đồn',
    coords: '16°26\'42"N 107°33\'18"E',
    detail: 'Không gian kể chuyện bằng hình ảnh, hiện vật khảo cổ, sa bàn 3D toàn cảnh 9 căn hầm và hồ sơ chứng tích tội ác thời Ngô Đình Cẩn.',
    x: 34,
    y: 50,
    color: '#38bdf8',
  },
  {
    slug: 'ham-1',
    name: 'Hầm 1',
    tag: 'Kho đạn Pháp 1941 • 82m²',
    position: 'Triền đồi phía Bắc',
    coords: '16°26\'44"N 107°33\'15"E',
    detail: 'Hầm chìm sâu 82m², tường bê tông cốt thép, cửa gỗ nẹp sắt (0,6m x 1,8m). Điểm tạm giam phân loại nghi can Cộng sản; mưa lầy lội, đông rét buốt, hè nóng như lò lửa.',
    x: 26,
    y: 38,
    color: '#e0231c',
  },
  {
    slug: 'ham-2',
    name: 'Hầm 2',
    tag: 'Hầm nhỏ nhất • 41m²',
    position: 'Sườn đồi phía Đông Bắc',
    coords: '16°26\'43"N 107°33\'19"E',
    detail: 'Hầm nhỏ nhất 41m², nửa chìm nửa nổi, tường dày 0,35m, trần 0,45m. Nơi biệt giam, tống tiền các thương gia giàu có và cán bộ kinh tài (Phan Văn Thí, Lê Văn Châu, Nguyễn Văn Yến...).',
    x: 42,
    y: 35,
    color: '#ffd700',
  },
  {
    slug: 'ham-3',
    name: 'Hầm 3',
    tag: '20 xà lim kiên cố • 85m²',
    position: 'Triền dốc sâu có hào bảo vệ',
    coords: '16°26\'41"N 107°33\'20"E',
    detail: 'Diện tích 85m², tường 0,45m, trần 0,5m, hào sâu 0,7m, 20 xà lim hai dãy. Nơi giam cầm nhân sĩ trí thức yêu nước (Lê Thiên Tạo, Bác sỹ Lê Khắc Quyến - Giám đốc BV TW Huế...).',
    x: 55,
    y: 44,
    color: '#10b981',
  },
  {
    slug: 'ham-4',
    name: 'Hầm 4',
    tag: 'Hầm ngâm nước • Bể 10m³',
    position: 'Thung lũng trũng',
    coords: '16°26\'39"N 107°33\'17"E',
    detail: 'Diện tích 85m², trước hầm có bể nước 10m³, bên trong 20 xà lim. Giam cầm và tra tấn dã man tù nhân yêu nước đưa về từ các tỉnh miền Trung (Nguyễn Vĩnh Nghiệp, Mai Văn Nệm, Vũ Lam...).',
    x: 38,
    y: 64,
    color: '#38bdf8',
  },
  {
    slug: 'ham-5',
    name: 'Hầm 5',
    tag: 'Hầm lò rải kẽm gai • 70m²',
    position: 'Sườn đồi phía Nam',
    coords: '16°26\'38"N 107°33\'21"E',
    detail: 'Diện tích 70m², thể tích 220m³, hầm lò để trống nóc rải kẽm gai. Giam tăng ni, Phật tử, sinh viên sau biến cố Phật giáo 5/1963, vụ vượt ngục Mai Ca, nhốt hàng trăm người chết ngạt.',
    x: 62,
    y: 60,
    color: '#f97316',
  },
  {
    slug: 'ham-6',
    name: 'Hầm 6',
    tag: 'Lò tra tấn trung cổ • 79m²',
    position: 'Cách hầm số 9 20m',
    coords: '16°26\'37"N 107°33\'19"E',
    detail: 'Diện tích 79m², để trống bày la liệt dao, búa, kìm, xích. Nơi tay chân Cẩn (Nguyễn Chữ, Phan Quang Đông, Dương Văn Hiếu) tra tấn đóng đinh, xẻo thịt, đổ xà phòng đạp vỡ ruột rồi phi tang ra rừng thông.',
    x: 50,
    y: 75,
    color: '#a855f7',
  },
  {
    slug: 'ham-7',
    name: 'Hầm 7',
    tag: '20 xà lim biệt giam • 78m²',
    position: 'Gần vọng gác chỉ huy',
    coords: '16°26\'40"N 107°33\'14"E',
    detail: 'Diện tích 78m², tường 0,4m, trần 0,5m, cửa thép 1,8m x 1,2m. 20 xà lim nền ngập nước; giam đảng phái đối lập và chiến sĩ tình báo Cộng sản (Bạch Ngọc Phách, Phan Trọng Tỉnh, Đoàn Thị Thu Thủy...).',
    x: 20,
    y: 56,
    color: '#ec4899',
  },
  {
    slug: 'ham-8',
    name: 'Hầm 8',
    tag: 'Chuồng cọp tử hình • 72.88m²',
    position: 'Chìm sâu trong lòng đất đỉnh đồi',
    coords: '16°26\'43"N 107°33\'24"E',
    detail: 'Diện tích 72,88m², chìm sâu, tường 0,4m, cửa thép lỗ hơi 30cm. 20 xà lim (1,8m x 0,8m x 1,8m) đan song sắt chuồng cọp; nơi đày ải tử tù chính trị Cộng sản kiên cường (Nguyễn Minh Vân, Phan Trọng Tịnh...).',
    x: 74,
    y: 32,
    color: '#ef4444',
  },
  {
    slug: 'ham-9',
    name: 'Hầm 9',
    tag: 'Nút giao cứ điểm • 75m²',
    position: 'Chân đồi phía Tây',
    coords: '16°26\'36"N 107°33\'16"E',
    detail: 'Diện tích 75m², hầm trung tâm kết nối hào lũy, cứ điểm chứng kiến nhân dân Huế phá tan xiềng xích giải phóng nhà tù ngày 02/11/1963.',
    x: 28,
    y: 82,
    color: '#06b6d4',
  },
];

export function SiteDetailInteractive({ site }: { site: SiteData }) {
  const isNhaChungTich = site.slug === 'nha-chung-tich';
  const isBunker = Boolean(site.slug && site.slug.startsWith('ham-'));
  const bunkerImg = isBunker ? `/cac-ham/${site.slug}.jpg` : null;
  const siteHeroImg =
    isBunker && bunkerImg
      ? bunkerImg
      : site.slug === 'dai-tuong-niem'
      ? '/dai_tuong_niem.jpg'
      : '/nha_chung_tich.jpg';

  // Selected Radar Bunker state (no page reload)
  const [selectedRadarSlug, setSelectedRadarSlug] = useState<string>(site.slug || 'nha-chung-tich');

  const [lightboxImg, setLightboxImg] = useState<{ src: string; title: string; desc: string } | null>(null);

  // Audio Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => {
        console.warn('Audio play error:', e);
      });
    }
  };

  const handleAudioTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 1;
    setAudioProgress((cur / dur) * 100);
  };

  // Text-to-Speech (SpeechSynthesis) for Historical Narration
  const [isSpeaking, setIsSpeaking] = useState(false);
  const narrationText = site.historicalNarration || site.description || '';

  const handleSpeakNarration = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ tính năng phát giọng nói tự động.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = (narrationText + (site.architecture ? ` Đặc điểm kiến trúc: ${site.architecture}` : '')).replace(/[#*]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);


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
          {/* Main Visual Screen Content */}
          <div className="relative h-[420px] md:h-[540px] w-full overflow-hidden bg-[#020508] select-none group">
            <img
              src={siteHeroImg}
              alt={`Ảnh thực địa ${site.name}`}
              className="h-full w-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Ambient vignette gradient */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(224, 35, 28, 0.08) 0%, transparent 65%), linear-gradient(180deg, rgba(2,4,6,0.15) 0%, rgba(2,4,6,0.85) 100%)',
              }}
            />

            {/* Top Left Badge: Site Real Photo Indicator */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="rounded-full bg-black/85 border border-emerald-400/50 px-3.5 py-1 text-[11px] font-bold text-emerald-300 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                📍 ẢNH THỰC TẾ {site.name.toUpperCase()} (ĐỒI BA ĐỒN)
              </span>
            </div>

            {/* Top Right: Lightbox Expand Button */}
            <div className="absolute top-4 right-4 z-20">
              <button
                type="button"
                onClick={() =>
                  setLightboxImg({
                    src: siteHeroImg,
                    title: site.name,
                    desc: site.subtitle || 'Ảnh chụp thực địa độ phân giải cao tại khu di tích Chín Hầm.',
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-black/90 hover:border-[#38bdf8] transition shadow-xl cursor-pointer"
                title="Phóng to toàn màn hình"
              >
                <Maximize2 size={13} className="text-[#38bdf8]" />
                <span>Phóng to ảnh</span>
              </button>
            </div>

            {/* Bottom Overlay Legend */}
            <div className="absolute bottom-4 left-6 z-10 hidden sm:flex items-center gap-3 pointer-events-none">
              <span className="rounded-full bg-black/70 border border-white/10 px-3 py-1 text-[11px] text-stone-300 backdrop-blur-md">
                ✦ Di tích lịch sử Quốc gia Chín Hầm • Huế
              </span>
            </div>
          </div>

          {/* Integrated Interactive Audio Guide Bar */}
          <div className="border-t border-white/10 bg-gradient-to-r from-emerald-950/40 via-black/80 to-blue-950/40 p-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <audio
              ref={audioRef}
              src={site.slug === 'ham-8' ? '/audio/ham-so-8.mp3' : '/audio/gioi-thieu-ngo-dinh-can.mp3'}
              onTimeUpdate={handleAudioTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              preload="metadata"
            />
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={toggleAudio}
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
                  <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-stone-300 font-mono">
                    {site.slug === 'ham-8' ? '04:33' : '04:44'}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">
                  {site.slug === 'ham-8'
                    ? 'Hầm 8: Bản Lĩnh Kiên Trung Nơi Đáy Ngục'
                    : 'Nhà Chứng Tích Ngô Đình Cẩn & Ký Ức Đồi Ba Đồn'}
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
      {/* 📜 BẢN THUYẾT MINH LỊCH SỬ & HỒ SƠ KIẾN TRÚC THỰC ĐỊA */}
      {/* ========================================================================= */}
      <div className="container-shell relative z-10 mt-14">
        <div className="rounded-[2.5rem] border border-amber-500/25 bg-gradient-to-b from-black/90 via-[#0a0f14]/90 to-black/95 p-6 md:p-10 backdrop-blur-xl shadow-2xl">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ffd700]">
                <Sparkles size={14} className="text-[#ffd700]" />
                HỒ SƠ TƯ LIỆU THUYẾT MINH LỊCH SỬ CHÍNH THỨC
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white font-display mt-1">
                Bản Thuyết Minh Kiến Trúc & Ký Ức: {site.name}
              </h2>
              <p className="mt-1 text-xs text-stone-300">
                Trích xuất từ hồ sơ khảo cứu di tích lịch sử Quốc gia Chín Hầm - Đồi Ba Đồn, Thừa Thiên Huế
              </p>
            </div>

            {/* Audio Speech Synthesis Button */}
            {narrationText && (
              <button
                type="button"
                onClick={handleSpeakNarration}
                className={`inline-flex items-center gap-2.5 rounded-2xl px-5 py-3 text-xs font-bold transition shadow-xl active:scale-95 cursor-pointer ${
                  isSpeaking
                    ? 'bg-[#e0231c] text-white shadow-[#e0231c]/40 animate-pulse'
                    : 'bg-gradient-to-r from-[#ffd700] to-[#f59e0b] text-black shadow-[#ffd700]/30 hover:brightness-110'
                }`}
              >
                <Volume2 size={16} className={isSpeaking ? 'animate-bounce' : ''} />
                <span>{isSpeaking ? '⏹ Dừng đọc thuyết minh' : '🔊 Nghe đọc thuyết minh hầm'}</span>
              </button>
            )}
          </div>

          {/* 4 Specifications Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                📐 Diện tích mặt bằng
              </span>
              <div className="text-xl font-black text-white font-display">
                {site.area || (isBunker ? 'Đang cập nhật' : 'Toàn khu di tích')}
              </div>
              <p className="mt-1 text-[11px] text-stone-400">
                {isBunker ? 'Không gian hầm ngầm bê tông cốt thép' : 'Quần thể đồi Ba Đồn'}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
              <span className="text-[11px] font-bold text-[#38bdf8] uppercase tracking-wider block mb-1">
                🧱 Kết cấu & Xây dựng
              </span>
              <div className="text-sm font-bold text-white leading-tight">
                {isBunker ? 'Bê tông cốt thép Pháp 1941' : 'Nhà Tả Vu & trưng bày'}
              </div>
              <p className="mt-1 text-[11px] text-stone-400 line-clamp-2">
                {site.architecture || 'Công trình phòng thủ kiên cố biến thành nhà tù biệt giam'}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                ⚖️ Phân loại giam cầm
              </span>
              <div className="text-sm font-bold text-white leading-tight line-clamp-1">
                {site.subtitle || 'Khu chứng tích lịch sử'}
              </div>
              <p className="mt-1 text-[11px] text-stone-400">
                Thời kỳ bạo chúa miền Trung Ngô Đình Cẩn (1954 - 1963)
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                📍 Vị trí & Tọa độ
              </span>
              <div className="text-sm font-bold text-white leading-tight">
                Đồi Ba Đồn, TP Huế
              </div>
              <p className="mt-1 text-[11px] font-mono text-stone-300">
                16°26&apos;42&quot;N 107°33&apos;18&quot;E
              </p>
            </div>
          </div>

          {/* Full Narration Text Box */}
          <div className="rounded-3xl border border-white/10 bg-black/60 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-[#ffd700]" />
              <h3 className="text-lg font-bold text-[#fef08a] font-display">
                Nội dung thuyết minh chi tiết
              </h3>
            </div>

            {/* Architecture detail quote if present */}
            {site.architecture && (
              <div className="mb-6 rounded-2xl border-l-4 border-[#38bdf8] bg-sky-950/30 p-4 pl-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#38bdf8] block mb-1">
                  Đặc điểm cấu trúc kiến trúc thực địa:
                </span>
                <p className="text-sm text-stone-200 leading-relaxed">
                  {site.architecture}
                </p>
              </div>
            )}

            {/* Narration paragraphs */}
            <div className="prose prose-invert max-w-none text-stone-200 text-sm md:text-base leading-relaxed space-y-4 font-serif">
              {(site.historicalNarration || site.description || '')
                .split('\n\n')
                .map((para, idx) => (
                  <p key={idx} className="first-letter:text-2xl first-letter:font-bold first-letter:text-[#ffd700] first-letter:mr-1">
                    {para}
                  </p>
                ))}
            </div>

            {/* Commemorative Note Box */}
            <div className="mt-8 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-black/40 to-transparent p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700]">
                  📜
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Di tích Lịch sử Quốc gia Chín Hầm</div>
                  <div className="text-[11px] text-stone-400">
                    Xếp hạng Di tích Lịch sử cấp Quốc gia theo Quyết định của Bộ Văn hóa - Thông tin
                  </div>
                </div>
              </div>

              <Link
                href="/audio-guide"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-[#38bdf8] hover:bg-white/10 hover:text-white transition"
              >
                <Headphones size={13} />
                <span>Kho bài thuyết minh Audio</span>
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
                const isSelectedBunker = currentBunker.slug.startsWith('ham-');
                return (
                  <div className="mt-5 p-4 rounded-2xl border border-[#38bdf8]/40 bg-gradient-to-br from-[#38bdf8]/10 via-black/60 to-black/85 backdrop-blur-md transition-all duration-300">
                    <div className="flex gap-4 items-start">
                      {isSelectedBunker && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#38bdf8]/40 shrink-0 shadow-md">
                          <img
                            src={`/cac-ham/${currentBunker.slug}.jpg`}
                            alt={currentBunker.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
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
                      </div>
                    </div>
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
