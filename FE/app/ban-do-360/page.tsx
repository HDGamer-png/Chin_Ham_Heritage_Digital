'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Eye,
  Layers,
  Sparkles,
  MapPin,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Info,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Navigation,
  Sliders,
  Send,
  HelpCircle,
  Clock,
  ShieldAlert,
  Share2,
} from 'lucide-react';

// --- DATA CÁC CĂN HẦM VÀ ĐIỂM MỐC TRÊN BIA ĐÁ PHỤC HỒI ---
interface LandmarkPoint {
  id: string;
  slug: string;
  name: string;
  tag: string;
  historicalRole: string;
  coords: string;
  x: number; // Tọa độ % trên bia đá ngang (1024px)
  y: number; // Tọa độ % trên bia đá dọc (571px)
  color: string;
  image360: string;
  thumbnail: string;
  description: string;
  order: number;
}

const LANDMARK_POINTS: LandmarkPoint[] = [
  {
    id: 'ham-1',
    slug: 'ham-1',
    name: 'Hầm số 1',
    tag: 'Kho đạn Pháp & Hầm trừng phạt',
    historicalRole: 'Căn hầm lớn nhất nằm ở triền dốc thấp, khởi đầu hệ thống kho đạn thời Pháp, sau 1954 biến thành nơi giam giữ tập thể khắc nghiệt.',
    coords: '16°26\'44"N 107°33\'15"E',
    x: 40.04,
    y: 51.49,
    color: '#ef4444',
    image360: '/panorama_ba_don_360.jpg',
    thumbnail: '/so_do_thuc_te_chin_ham.jpg',
    description: 'Kết cấu bê tông cốt thép kiên cố, cửa vòm hướng Tây Nam. Nơi mật vụ Ngô Đình Cẩn từng giam hàng chục người trong bóng tối dày đặc.',
    order: 4,
  },
  {
    id: 'ham-2',
    slug: 'ham-2',
    name: 'Hầm số 2',
    tag: 'Hầm giam giữ cán bộ cốt cán',
    historicalRole: 'Nơi giam giữ các chiến sĩ cách mạng, cán bộ phong trào hòa bình Huế bị mật vụ bắt bớ trong các đợt càn quét.',
    coords: '16°26\'43"N 107°33\'19"E',
    x: 50.10,
    y: 45.01,
    color: '#f59e0b',
    image360: '/tactical_night_ba_don.jpg',
    thumbnail: '/chin_ham_artifacts.jpg',
    description: 'Hầm ngầm nửa chìm nửa nổi, bên trong chia các ngăn chuồng cọp gỗ và sắt, điều kiện ẩm thấp thiếu ánh sáng trầm trọng.',
    order: 5,
  },
  {
    id: 'ham-3',
    slug: 'ham-3',
    name: 'Hầm số 3',
    tag: 'Biệt giam đặc biệt nghiêm ngặt',
    historicalRole: 'Khu vực cách ly nghiêm ngặt các tù chính trị mà mật vụ coi là đối tượng nguy hiểm nhất của Đảng bộ Thừa Thiên Huế.',
    coords: '16°26\'41"N 107°33\'20"E',
    x: 61.04,
    y: 42.91,
    color: '#10b981',
    image360: '/khong_gian_tong_quan.jpg',
    thumbnail: '/chin_ham_tactical_blueprint.jpg',
    description: 'Cửa sắt hai lớp khóa chặt, vách bê tông dày 40cm, cách ly hoàn toàn mọi âm thanh bên ngoài.',
    order: 6,
  },
  {
    id: 'ham-4',
    slug: 'ham-4',
    name: 'Hầm số 4',
    tag: 'Hầm ngập nước (Địa ngục bùn lầy)',
    historicalRole: 'Vũng trũng tự nhiên khiến nước ngầm ngập sâu từ 0.3m đến 0.6m quanh năm, tạo nên hình thức tra tấn thể xác buốt lạnh thấu xương.',
    coords: '16°26\'39"N 107°33\'17"E',
    x: 50.98,
    y: 32.40,
    color: '#06b6d4',
    image360: '/panorama_ba_don_360.jpg',
    thumbnail: '/so_do_thuc_te_chin_ham.jpg',
    description: 'Tù nhân phải đứng hoặc ngồi trên những thanh gỗ mục nổi trên nước bẩn, chân tay lở loét vì lạnh và bùn lầy tù đọng.',
    order: 8,
  },
  {
    id: 'ham-5',
    slug: 'ham-5',
    name: 'Hầm số 5',
    tag: 'Hầm trừng phạt hiểm trở',
    historicalRole: 'Nằm tại góc cua gấp phía Đông, hầm có vách đá ẩm ướt rêu phong, nơi ghi dấu khí phách bất khuất của các chiến sĩ.',
    coords: '16°26\'38"N 107°33\'21"E',
    x: 70.90,
    y: 29.95,
    color: '#ec4899',
    image360: '/chin_ham_aerial_drone.jpg',
    thumbnail: '/chin_ham_relief_3d.jpg',
    description: 'Góc cua hiểm trở tách biệt với con đường chính, từng là nơi diễn ra các cuộc tuyệt thực đòi quyền sống của tù nhân.',
    order: 9,
  },
  {
    id: 'ham-6',
    slug: 'ham-6',
    name: 'Hầm số 6',
    tag: 'Hầm kỷ luật đỉnh đồi',
    historicalRole: 'Hầm cô lập sâu trong rừng thông trên triền dốc cao, nơi mật vụ dùng để biệt giam những tù nhân chống đối kỷ luật.',
    coords: '16°26\'37"N 107°33\'19"E',
    x: 60.06,
    y: 22.42,
    color: '#8b5cf6',
    image360: '/tactical_night_ba_don.jpg',
    thumbnail: '/tactical_night_ba_don.jpg',
    description: 'Vị trí cao nhưng bị phủ kín bởi tán thông rậm rạp, mùa đông nhiệt độ xuống thấp cắt da cắt thịt.',
    order: 10,
  },
  {
    id: 'ham-7',
    slug: 'ham-7',
    name: 'Hầm số 7',
    tag: 'Hầm thẩm vấn & tra khảo',
    historicalRole: 'Nằm gần chốt chỉ huy, nơi mật vụ áp giải tù nhân đến để thẩm vấn bằng những ngón đòn nham hiểm nhất.',
    coords: '16°26\'40"N 107°33\'14"E',
    x: 51.27,
    y: 21.37,
    color: '#e11d48',
    image360: '/khong_gian_tong_quan.jpg',
    thumbnail: '/chin_ham_artifacts.jpg',
    description: 'Không gian ngột ngạt với dấu vết xích sắt và các công cụ tra khảo còn được phát hiện khi tiếp quản năm 1963.',
    order: 11,
  },
  {
    id: 'ham-8',
    slug: 'ham-8',
    name: 'Hầm số 8',
    tag: 'Chuồng cọp tử hình (Tàn bạo nhất)',
    historicalRole: 'Được mệnh danh là "Chuồng cọp tử hình" khét tiếng nhất Chín Hầm, nơi giam giữ những cán bộ bị kết án tử hình hoặc đày ải đến kiệt sức.',
    coords: '16°26\'43"N 107°33\'24"E',
    x: 41.11,
    y: 21.89,
    color: '#dc2626',
    image360: '/panorama_ba_don_360.jpg',
    thumbnail: '/so_do_thuc_te_chin_ham.jpg',
    description: 'Hầm sâu tối tăm, mỗi cũi gỗ chỉ vừa một người ngồi co ro, không thể đứng thẳng, cơm nước hạn chế tối đa để hủy hoại thể lực.',
    order: 12,
  },
  {
    id: 'ham-9',
    slug: 'ham-9',
    name: 'Hầm số 9',
    tag: 'Kho quân sự phụ tâm điểm',
    historicalRole: 'Căn hầm nằm giữa trung tâm hệ thống, cứ điểm quan trọng chứng kiến giờ phút sụp đổ của bạo chúa Ngô Đình Cẩn ngày 02/11/1963.',
    coords: '16°26\'36"N 107°33\'16"E',
    x: 53.13,
    y: 38.18,
    color: '#0284c7',
    image360: '/chin_ham_aerial_drone.jpg',
    thumbnail: '/chin_ham_relief_3d.jpg',
    description: 'Nằm ngay nút giao trung tâm giữa các triền đồi, kết nối các tuyến hào và lối mòn huyết mạch.',
    order: 7,
  },
  {
    id: 'nha-tuong-niem',
    slug: 'nha-tuong-niem',
    name: 'Nhà Tưởng Niệm Quốc Gia',
    tag: 'Công trình tri ân các anh hùng',
    historicalRole: 'Khu tưởng niệm Di tích lịch sử Quốc gia Chín Hầm, nơi nhân dân và du khách thắp hương tưởng niệm các chiến sĩ kiên trung.',
    coords: '16°26\'45"N 107°33\'12"E',
    x: 53.32,
    y: 70.23,
    color: '#facc15',
    image360: '/dai_tuong_niem.jpg',
    thumbnail: '/dai_tuong_niem.jpg',
    description: 'Bao gồm cụm nhà bia đá tưởng niệm ngũ giác và 2 dãy nhà hành lễ trang nghiêm dưới rặng thông Ba Đồn.',
    order: 2,
  },
  {
    id: 'nha-chung-tich',
    slug: 'nha-chung-tich',
    name: 'Nhà Chứng Tích Ngô Đình Cẩn',
    tag: 'Không gian trưng bày lịch sử',
    historicalRole: 'Khu trưng bày hiện vật khảo cổ, sa bàn Chín Hầm, tư liệu tố cáo tội ác của chế độ độc tài Ngô Đình Cẩn.',
    coords: '16°26\'46"N 107°33\'10"E',
    x: 46.00,
    y: 80.74,
    color: '#38bdf8',
    image360: '/nha_chung_tich_exhibition.jpg',
    thumbnail: '/nha_chung_tich_exhibition.jpg',
    description: 'Kiến trúc ngũ giác đặc trưng trên bản đồ, nơi lưu giữ các chứng tích sống động về cuộc đấu tranh quả cảm của quân và dân Thừa Thiên Huế.',
    order: 3,
  },
  {
    id: 'cong-di-tich',
    slug: 'cong-di-tich',
    name: 'Lối Vào Di Tích (Ngã Ba)',
    tag: 'Điểm đón tiếp & Khởi đầu tour',
    historicalRole: 'Ngã ba đường nối từ trung tâm thành phố Huế và tuyến đường tránh vào khu di tích đồi Ba Đồn.',
    coords: '16°26\'48"N 107°33\'08"E',
    x: 13.50,
    y: 77.00,
    color: '#a3e635',
    image360: '/panorama_ba_don_360.jpg',
    thumbnail: '/chin_ham_aerial_drone.jpg',
    description: 'Điểm khởi đầu của hành trình viếng thăm di tích lịch sử Chín Hầm.',
    order: 1,
  },
];

// --- COMPONENT EQUIRTECTANGULAR / PANORAMA 360 VIEWER ---
interface PanoramaViewerProps {
  imageSrc: string;
  title: string;
  onYawChange?: (yawDegrees: number) => void;
  className?: string;
  compact?: boolean;
}

function PanoramaViewer({
  imageSrc,
  title,
  onYawChange,
  className = '',
  compact = false,
}: PanoramaViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [yaw, setYaw] = useState<number>(0); // in degrees
  const [pitch, setPitch] = useState<number>(0); // in degrees
  const [fov, setFov] = useState<number>(75); // in degrees
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const dragStart = useRef<{ x: number; y: number; startYaw: number; startPitch: number }>({
    x: 0,
    y: 0,
    startYaw: 0,
    startPitch: 0,
  });

  // Load and render panorama via WebGL or Canvas 2D
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    let animId: number;

    const render = () => {
      if (!canvas) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      if (img.complete && img.naturalWidth > 0) {
        // Cylindrical/spherical wrap onto canvas
        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;

        // Calculate offset based on yaw
        const normYaw = ((yaw % 360) + 360) % 360; // 0..360
        const offsetX = (normYaw / 360) * imgW;
        const pitchOffset = (pitch / 90) * (height * 0.35);

        // Clear
        ctx.fillStyle = '#05080e';
        ctx.fillRect(0, 0, width, height);

        // Draw wrapped slices
        const scale = (height / imgH) * (90 / fov);
        const drawH = height * (90 / fov);
        const drawW = imgW * scale;

        const posX = -((offsetX * scale) % drawW);
        const posY = (height - drawH) / 2 + pitchOffset;

        ctx.drawImage(img, posX, posY, drawW, drawH);
        ctx.drawImage(img, posX + drawW, posY, drawW, drawH);
        if (posX > 0) {
          ctx.drawImage(img, posX - drawW, posY, drawW, drawH);
        }
      } else {
        // Loading skeleton
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#64748b';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Đang tải không gian 360°...', width / 2, height / 2);
      }

      // Auto rotation
      if (autoRotate && !isDragging) {
        setYaw((prev) => {
          const next = (prev + 0.15) % 360;
          if (onYawChange) onYawChange(next);
          return next;
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [imageSrc, yaw, pitch, fov, autoRotate, isDragging, onYawChange]);

  // Mouse & Touch interaction
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setAutoRotate(false);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      startYaw: yaw,
      startPitch: pitch,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const sensitivity = fov / 500;

    const newYaw = (dragStart.current.startYaw - dx * sensitivity + 360) % 360;
    const newPitch = Math.max(-45, Math.min(45, dragStart.current.startPitch + dy * sensitivity));

    setYaw(newYaw);
    setPitch(newPitch);
    if (onYawChange) onYawChange(newYaw);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setFov((prev) => Math.max(40, Math.min(95, prev + e.deltaY * 0.05)));
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top overlay badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-xl bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/15 text-xs text-stone-200">
        <Compass size={14} className="text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
        <span className="font-semibold text-white truncate max-w-[200px]">{title}</span>
        <span className="text-[10px] text-amber-300 font-mono">({Math.round(yaw)}°)</span>
      </div>

      {/* Controls toolbar */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-xl bg-black/70 backdrop-blur-md p-1.5 border border-white/15">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-lg text-xs font-semibold transition ${
            autoRotate ? 'bg-amber-500/30 text-amber-300 border border-amber-400/40' : 'text-stone-300 hover:bg-white/10'
          }`}
          title="Tự động xoay 360°"
        >
          {autoRotate ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          onClick={() => setFov((prev) => Math.max(40, prev - 10))}
          className="p-2 rounded-lg text-stone-300 hover:bg-white/10 transition"
          title="Phóng to"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={() => setFov((prev) => Math.min(95, prev + 10))}
          className="p-2 rounded-lg text-stone-300 hover:bg-white/10 transition"
          title="Thu nhỏ"
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={() => {
            setYaw(0);
            setPitch(0);
            if (onYawChange) onYawChange(0);
          }}
          className="p-2 rounded-lg text-stone-300 hover:bg-white/10 transition"
          title="Đặt lại hướng Bắc"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Compass indicator widget */}
      <div className="absolute top-3 right-3 z-10 pointer-events-none">
        <div className="w-10 h-10 rounded-full border border-white/20 bg-black/60 backdrop-blur-md flex items-center justify-center relative shadow-lg">
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-75"
            style={{ transform: `rotate(${-yaw}deg)` }}
          >
            <div className="w-0.5 h-3 bg-red-500 rounded-full absolute -top-1" />
            <div className="w-0.5 h-3 bg-stone-300 rounded-full absolute -bottom-1" />
            <span className="text-[8px] font-black text-red-400 absolute top-0.5">B</span>
          </div>
        </div>
      </div>

      {/* Hint for interaction */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden sm:block">
        <span className="text-[10px] text-stone-400 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
          Kéo chuột hoặc vuốt để xoay 360° | Cuộn chuột để zoom
        </span>
      </div>
    </div>
  );
}

// --- MAIN PAGE VỚI 4 DEMO CHO NGƯỜI DÙNG DUYỆT ---
export default function BanDo360ReviewPage() {
  const [selectedDemo, setSelectedDemo] = useState<'demo1' | 'demo2' | 'demo3' | 'demo4'>('demo1');
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkPoint>(LANDMARK_POINTS[0]);
  const [is360ModalOpen, setIs360ModalOpen] = useState<boolean>(false);
  const [liveYaw, setLiveYaw] = useState<number>(45);
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(0);
  const [isTourPlaying, setIsTourPlaying] = useState<boolean>(false);
  const [approvedDemo, setApprovedDemo] = useState<string | null>(null);

  // Auto-tour progression for Demo 4
  useEffect(() => {
    let timer: any;
    if (isTourPlaying && selectedDemo === 'demo4') {
      timer = setInterval(() => {
        setTourStep((prev) => {
          const next = (prev + 1) % LANDMARK_POINTS.length;
          setSelectedLandmark(LANDMARK_POINTS[next]);
          return next;
        });
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isTourPlaying, selectedDemo]);

  // Handle tour step change
  const handleNextStep = () => {
    const next = (tourStep + 1) % LANDMARK_POINTS.length;
    setTourStep(next);
    setSelectedLandmark(LANDMARK_POINTS[next]);
  };

  const handlePrevStep = () => {
    const prev = (tourStep - 1 + LANDMARK_POINTS.length) % LANDMARK_POINTS.length;
    setTourStep(prev);
    setSelectedLandmark(LANDMARK_POINTS[prev]);
  };

  return (
    <div className="min-h-screen bg-transparent text-stone-100 flex flex-col font-sans selection:bg-amber-500/30">
      {/* --- HEADER CHÍNH --- */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b12]/90 backdrop-blur-xl px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-stone-300 hover:text-white hover:bg-white/10 transition"
            >
              <img src="/Logo CH1.png" alt="Logo Chín Hầm" className="h-4 w-4 object-contain" />
              <span>Trang Chủ</span>
            </Link>
            <div className="h-4 w-px bg-white/15" />
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-sm md:text-base font-bold text-white tracking-tight">
                Đề Xuất 4 Bản Demo Bản Đồ 360° (Dựa trên Bia Đá Phục Hồi)
              </h1>
            </div>
          </div>

          {/* Quick status */}
          <div className="flex items-center gap-2 text-xs">
            {approvedDemo ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 text-emerald-300 font-semibold">
                <CheckCircle2 size={13} /> Đã chọn duyệt: {approvedDemo}
              </span>
            ) : (
              <span className="text-stone-400 hidden sm:inline">
                Hãy trải nghiệm cả 4 bản demo dưới đây và bấm nút <strong className="text-amber-400">"Duyệt Demo Này"</strong>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* --- THANH CHUYỂN TABS 4 BẢN DEMO --- */}
      <section className="bg-stone-950/80 border-b border-white/10 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedDemo('demo1')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                selectedDemo === 'demo1'
                  ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/30'
                  : 'bg-white/5 text-stone-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              <Layers size={14} />
              <span>Demo 1: Sa Bàn Bia Đá Tương Tác</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 uppercase font-mono">Bia Gốc</span>
            </button>

            <button
              onClick={() => setSelectedDemo('demo2')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                selectedDemo === 'demo2'
                  ? 'bg-sky-500 text-stone-950 shadow-lg shadow-sky-500/30'
                  : 'bg-white/5 text-stone-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              <Navigation size={14} />
              <span>Demo 2: Góc Nhìn Kép (Dual Radar)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 uppercase font-mono">Đồng Bộ</span>
            </button>

            <button
              onClick={() => setSelectedDemo('demo3')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                selectedDemo === 'demo3'
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 text-stone-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              <Sparkles size={14} />
              <span>Demo 3: Sa Bàn 3D Không Gian</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 uppercase font-mono">Chiều Sâu</span>
            </button>

            <button
              onClick={() => setSelectedDemo('demo4')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                selectedDemo === 'demo4'
                  ? 'bg-emerald-500 text-stone-950 shadow-lg shadow-emerald-500/30'
                  : 'bg-white/5 text-stone-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              <Compass size={14} />
              <span>Demo 4: Tour Kể Chuyện Lộ Trình</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 uppercase font-mono">Từng Bước</span>
            </button>
          </div>

          {/* Quick action button for current demo */}
          <button
            onClick={() => setApprovedDemo(
              selectedDemo === 'demo1' ? 'Demo 1 (Sa Bàn Bia Đá Tương Tác)' :
              selectedDemo === 'demo2' ? 'Demo 2 (Góc Nhìn Kép Dual Radar)' :
              selectedDemo === 'demo3' ? 'Demo 3 (Sa Bàn 3D Không Gian)' :
              'Demo 4 (Tour Kể Chuyện Lộ Trình)'
            )}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-4 py-2 text-xs font-black text-stone-950 shadow-lg shadow-amber-950/40 transition hover:scale-105"
          >
            <CheckCircle2 size={15} />
            <span>Duyệt Chọn {selectedDemo.toUpperCase()}</span>
          </button>
        </div>
      </section>

      {/* --- NỘI DUNG CHÍNH CỦA BẢN DEMO ĐANG CHỌN --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">

        {/* ========================================================================= */}
        {/* DEMO 1: SA BÀN BIA ĐÁ TƯƠNG TÁC + CỬA SỔ TOÀN CẢNH 360° */}
        {/* ========================================================================= */}
        {selectedDemo === 'demo1' && (
          <div className="flex flex-col gap-6">
            {/* Banner tóm tắt triết lý */}
            <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-stone-900/60 to-stone-900/40 p-4 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                  <Layers size={14} /> Triết lý cốt lõi: Tôn trọng 100% Nguyên Tác Bia Đá Lịch Sử
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  Sa Bàn Bia Đá Chỉ Huy & Cửa Sổ Khám Phá 360° Đa Điểm
                </h2>
                <p className="text-stone-300 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
                  Bản đồ bia đá phục hồi được giữ nguyên vẹn với vân đá granite đỏ trầm và các đường nét khắc trắng sắc nét. Từng căn hầm và công trình lịch sử được gắn các <strong>Radar Beacons</strong> phát xung ánh sáng trực tiếp tại vị trí khắc trên đá. Nhấp vào bất kỳ điểm nào để xem tóm lược lịch sử và mở không gian 360° tương tác toàn cảnh.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setMapZoom((prev) => Math.min(1.8, prev + 0.2))}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 transition"
                  title="Phóng to bản đồ"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={() => setMapZoom((prev) => Math.max(0.9, prev - 0.2))}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 transition"
                  title="Thu nhỏ bản đồ"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={() => setMapZoom(1)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 transition text-xs font-bold"
                  title="Mặc định 100%"
                >
                  100%
                </button>
              </div>
            </div>

            {/* Layout 2 cột: Bia đá tương tác lớn & Khối thông tin chi tiết */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Cột trái: Tấm bia đá phục hồi tương tác (chiếm 8 cột) */}
              <div className="lg:col-span-8 flex flex-col gap-3">
                <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/30 bg-stone-950 shadow-2xl group">
                  {/* Container có zoom */}
                  <div
                    className="relative w-full aspect-[1024/571] overflow-hidden transition-transform duration-300 origin-center"
                    style={{ transform: `scale(${mapZoom})` }}
                  >
                    {/* Hình ảnh bia đá phục hồi */}
                    <Image
                      src="/ban_do_chinh_ham_phuc_hoi.jpg"
                      alt="Bản đồ Chín Hầm bia đá phục hồi nét trắng"
                      fill
                      className="object-contain select-none pointer-events-none"
                      priority
                    />

                    {/* Lớp phủ tương tác với các điểm ghim Radar nằm chính xác TRONG các biểu tượng */}
                    <div className="absolute inset-0">
                      {LANDMARK_POINTS.map((pt) => {
                        const isSelected = selectedLandmark.id === pt.id;
                        return (
                          <button
                            key={pt.id}
                            onClick={() => setSelectedLandmark(pt)}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group/pin z-20 focus:outline-none transition-transform hover:scale-125"
                            style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                            title={pt.name}
                          >
                            {/* Vòng xung radar tinh tế, không che lấp chữ xung quanh */}
                            {isSelected && (
                              <span
                                className="absolute -inset-1 rounded-full animate-ping bg-amber-400/60 pointer-events-none"
                                style={{ animationDuration: '2s' }}
                              />
                            )}

                            {/* Tâm điểm nút - kích thước vừa vặn trong biểu tượng hình học */}
                            <span
                              className={`relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full border text-[9px] sm:text-[10px] font-black shadow-md transition ${
                                isSelected
                                  ? 'bg-amber-400 text-stone-950 border-white scale-110 shadow-amber-400/80 ring-2 ring-amber-300 ring-offset-1 ring-offset-stone-950'
                                  : 'bg-stone-950/90 text-amber-300 border-amber-400/80 hover:bg-amber-400 hover:text-stone-950 hover:border-white'
                              }`}
                            >
                              {pt.id.startsWith('ham-') ? pt.id.replace('ham-', 'H') : '★'}
                            </span>

                            {/* Tooltip hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/pin:flex flex-col items-center pointer-events-none z-30">
                              <span className="whitespace-nowrap rounded-md bg-stone-950/95 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-amber-300 border border-amber-400/50 shadow-xl">
                                {pt.name}
                              </span>
                              <div className="w-1.5 h-1.5 bg-stone-950 rotate-45 -mt-1 border-r border-b border-amber-400/50" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Thanh điều khiển góc dưới tấm bia */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-300 pointer-events-none">
                    <span className="rounded-lg bg-black/70 backdrop-blur-md px-3 py-1.5 border border-white/10 pointer-events-auto">
                      Đang chọn: <strong className="text-amber-400">{selectedLandmark.name}</strong>
                    </span>
                    <span className="rounded-lg bg-black/70 backdrop-blur-md px-3 py-1.5 border border-white/10 hidden sm:inline pointer-events-auto">
                      Click vào các điểm đỏ/vàng trên bia đá để xem
                    </span>
                  </div>
                </div>

                {/* Danh sách chip nhanh các hầm */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {LANDMARK_POINTS.map((pt) => (
                    <button
                      key={pt.id}
                      onClick={() => setSelectedLandmark(pt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        selectedLandmark.id === pt.id
                          ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                          : 'bg-white/5 text-stone-300 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {pt.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cột phải: Card chi tiết điểm & Nút bấm mở 360° (chiếm 4 cột) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="rounded-2xl border border-white/15 bg-stone-900/80 backdrop-blur-xl p-5 shadow-xl flex flex-col gap-4">
                  {/* Badge & Tên */}
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1">
                      <MapPin size={13} /> {selectedLandmark.tag}
                    </div>
                    <h3 className="text-xl font-black text-white">{selectedLandmark.name}</h3>
                    <p className="text-xs text-stone-400 font-mono mt-0.5">{selectedLandmark.coords}</p>
                  </div>

                  {/* Thumbnail xem trước */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 group">
                    <Image
                      src={selectedLandmark.thumbnail}
                      alt={selectedLandmark.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <span className="text-xs font-semibold text-stone-200">
                        {selectedLandmark.name} - Triền đồi Ba Đồn
                      </span>
                    </div>
                  </div>

                  {/* Mô tả lịch sử */}
                  <div className="rounded-xl bg-white/5 border border-white/5 p-3 text-xs text-stone-300 leading-relaxed space-y-2">
                    <p><strong className="text-white">Vai trò lịch sử:</strong> {selectedLandmark.historicalRole}</p>
                    <p className="text-stone-400">{selectedLandmark.description}</p>
                  </div>

                  {/* Nút bấm vàng mở cửa sổ 360° */}
                  <button
                    onClick={() => setIs360ModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-black py-3 px-4 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition hover:scale-[1.02] active:scale-95 text-sm"
                  >
                    <Eye size={17} />
                    <span>MỞ KHÔNG GIAN 360° THỰC ĐỊA</span>
                  </button>

                  <div className="text-[11px] text-center text-stone-400">
                    Hỗ trợ xoay toàn cảnh 360°, la bàn định hướng và zoom chi tiết
                  </div>
                </div>

                {/* Card đánh giá ưu điểm của Demo 1 */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-stone-300 space-y-2">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Ưu điểm của Demo 1:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-stone-400">
                    <li>Bản đồ đá hiển thị toàn diện, không che khuất tầm nhìn</li>
                    <li>Tọa độ chuẩn xác từng nét khắc thực tế của di tích</li>
                    <li>Giao diện quen thuộc, thân thiện với người dùng mọi lứa tuổi</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal xem 360° toàn màn hình khi bấm nút */}
            {is360ModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col p-4 md:p-8 animate-fadeIn">
                <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col gap-3">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md bg-amber-400 text-stone-950 text-xs font-black">
                        360° VIEW
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-white">
                        {selectedLandmark.name} - {selectedLandmark.tag}
                      </h3>
                    </div>
                    <button
                      onClick={() => setIs360ModalOpen(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <span>Đóng [ESC]</span>
                    </button>
                  </div>

                  {/* Viewer 360 component */}
                  <div className="flex-1 w-full rounded-2xl overflow-hidden shadow-2xl relative">
                    <PanoramaViewer
                      imageSrc={selectedLandmark.image360}
                      title={`Toàn cảnh 360°: ${selectedLandmark.name}`}
                      className="w-full h-full min-h-[480px]"
                    />
                  </div>

                  {/* Modal Footer: Chuyển nhanh qua hầm khác */}
                  <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                    <span>Di chuột/vuốt để xoay toàn cảnh 360 độ</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const idx = LANDMARK_POINTS.findIndex((p) => p.id === selectedLandmark.id);
                          const prev = LANDMARK_POINTS[(idx - 1 + LANDMARK_POINTS.length) % LANDMARK_POINTS.length];
                          setSelectedLandmark(prev);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition"
                      >
                        ← Điểm trước
                      </button>
                      <button
                        onClick={() => {
                          const idx = LANDMARK_POINTS.findIndex((p) => p.id === selectedLandmark.id);
                          const next = LANDMARK_POINTS[(idx + 1) % LANDMARK_POINTS.length];
                          setSelectedLandmark(next);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition"
                      >
                        Điểm kế tiếp →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* DEMO 2: GÓC NHÌN KÉP ĐỒNG BỘ (DUAL-VIEW RADAR SYNCHRONIZATION) */}
        {/* ========================================================================= */}
        {selectedDemo === 'demo2' && (
          <div className="flex flex-col gap-6">
            {/* Banner tóm tắt triết lý */}
            <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-950/30 via-stone-900/60 to-stone-900/40 p-4 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
                  <Navigation size={14} /> Triết lý cốt lõi: Không Bao Giờ Bị Mất Phương Hướng
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  Góc Nhìn Kép Song Hành: Radar Bia Đá & Không Gian 360° Realtime
                </h2>
                <p className="text-stone-300 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
                  Màn hình chia đôi: Một bên là <strong>Không gian 360° thời gian thực</strong>, một bên là <strong>Bản đồ bia đá với Nón Tầm Nhìn (Radar Cone)</strong>. Khi bạn xoay chuột nhìn quanh không gian 360°, nón góc nhìn trên bản đồ đá sẽ xoay theo đúng góc độ đó trong thời gian thực! Bạn có thể click vào bất kỳ hầm nào trên bản đồ đá để dịch chuyển camera 360 tới đó.
                </p>
              </div>

              <div className="rounded-xl border border-sky-400/30 bg-sky-950/50 px-3.5 py-2 text-xs text-sky-200 flex items-center gap-2 shrink-0">
                <Compass size={16} className="text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Góc nhìn hiện tại: <strong>{Math.round(liveYaw)}°</strong></span>
              </div>
            </div>

            {/* Layout Split Screen 50 / 50 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Cột trái: Không gian 360 tương tác trực tiếp (6 cột) */}
              <div className="lg:col-span-6 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-stone-300">
                  <span className="font-bold text-sky-400 flex items-center gap-1.5">
                    <Eye size={14} /> KHÔNG GIAN 360° THỰC ĐỊA: {selectedLandmark.name.toUpperCase()}
                  </span>
                  <span className="text-stone-400 text-[11px]">Kéo chuột để xoay & xem nón radar quay theo</span>
                </div>

                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-sky-500/30 shadow-2xl">
                  <PanoramaViewer
                    imageSrc={selectedLandmark.image360}
                    title={`360° Live: ${selectedLandmark.name}`}
                    onYawChange={(yawDegrees) => setLiveYaw(yawDegrees)}
                    className="w-full h-full"
                  />
                </div>

                {/* Thông tin nhanh điểm đang xem */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-stone-300 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{selectedLandmark.name}</span> —{' '}
                    <span className="text-stone-400">{selectedLandmark.tag}</span>
                  </div>
                  <span className="text-sky-400 font-mono text-[11px]">{selectedLandmark.coords}</span>
                </div>
              </div>

              {/* Cột phải: Bản đồ bia đá với Nón Radar đồng bộ góc nhìn (6 cột) */}
              <div className="lg:col-span-6 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-stone-300">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Navigation size={14} /> RADAR BIA ĐÁ ĐỒNG BỘ HƯỚNG NHÌN
                  </span>
                  <span className="text-amber-300 text-[11px]">Click vào hầm trên đá để dịch chuyển</span>
                </div>

                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-amber-500/30 bg-stone-950 shadow-2xl flex items-center justify-center p-2">
                  {/* Container map đá */}
                  <div className="relative w-full aspect-[1024/571] rounded-xl overflow-hidden">
                    <Image
                      src="/ban_do_chinh_ham_phuc_hoi.jpg"
                      alt="Bản đồ đá đồng bộ radar"
                      fill
                      className="object-contain select-none"
                    />

                    {/* Vị trí các hầm và Nón Radar */}
                    <div className="absolute inset-0">
                      {LANDMARK_POINTS.map((pt) => {
                        const isSelected = selectedLandmark.id === pt.id;
                        return (
                          <div
                            key={pt.id}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                            style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                          >
                            {/* NÓN TẦM NHÌN RADAR CONE KHI ĐƯỢC CHỌN */}
                            {isSelected && (
                              <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75"
                                style={{ transform: `rotate(${liveYaw}deg)` }}
                              >
                                <svg
                                  width="120"
                                  height="120"
                                  viewBox="-60 -60 120 120"
                                  className="overflow-visible"
                                >
                                  {/* Radar Sector Wedge */}
                                  <path
                                    d="M 0 0 L -30 -60 A 70 70 0 0 1 30 -60 Z"
                                    fill="url(#radarGradient)"
                                    opacity="0.6"
                                  />
                                  {/* Radar pulse line */}
                                  <line
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="-60"
                                    stroke="#38bdf8"
                                    strokeWidth="1.5"
                                    strokeDasharray="2 2"
                                  />
                                  <defs>
                                    <radialGradient id="radarGradient" cx="0" cy="0" r="70" gradientUnits="userSpaceOnUse">
                                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                                    </radialGradient>
                                  </defs>
                                </svg>
                              </div>
                            )}

                            {/* Nút Marker nằm gọn trong biểu tượng */}
                            <button
                              onClick={() => setSelectedLandmark(pt)}
                              className={`relative z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full border text-[9px] sm:text-[10px] font-black flex items-center justify-center transition hover:scale-125 ${
                                isSelected
                                  ? 'bg-sky-400 text-stone-950 border-white shadow-lg shadow-sky-400/80 ring-2 ring-sky-300 ring-offset-1 ring-offset-stone-950 scale-110'
                                  : 'bg-stone-950/90 text-amber-300 border-amber-400/80 hover:bg-amber-400 hover:text-stone-950 hover:border-white shadow-md'
                              }`}
                            >
                              {pt.id.startsWith('ham-') ? pt.id.replace('ham-', 'H') : '★'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card đánh giá ưu điểm của Demo 2 */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-stone-300 space-y-1.5">
                  <div className="font-bold text-sky-400 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Ưu điểm vượt trội của Demo 2:
                  </div>
                  <p className="text-stone-400 leading-relaxed">
                    Khắc phục hoàn toàn nhược điểm lớn nhất của các ứng dụng 360 truyền thống: <em>người dùng dễ bị lạc hướng và không biết mình đang nhìn về phía nào</em>. Nón radar đồng bộ giúp định vị không gian 100% chuẩn xác.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DEMO 3: SA BÀN 3D KHÔNG GIAN & PHỐI CẢNH ĐỒI BA ĐỒN */}
        {/* ========================================================================= */}
        {selectedDemo === 'demo3' && (
          <div className="flex flex-col gap-6">
            {/* Banner tóm tắt triết lý */}
            <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-stone-900/60 to-stone-900/40 p-4 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
                  <Sparkles size={14} /> Triết lý cốt lõi: Trải Nghiệm Thị Giác Sa Bàn Điện Tử Tương Tác
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  Sa Bàn 3D Không Gian & Phối Cảnh Chiều Sâu Đồi Ba Đồn
                </h2>
                <p className="text-stone-300 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
                  Tấm bia đá được đặt trong không gian phối cảnh 3D (Isometric Perspective) mô phỏng địa hình đồi thông dốc. Các căn hầm nhô lên thành các khối kiến trúc bán nổi với hiệu ứng ánh sáng laser chạy dọc các con đường nối. Người dùng có thể chỉnh góc nghiêng 3D và click vào hầm để bay sà xuống (Cinematic Fly-to) mở toàn cảnh 360°.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIs360ModalOpen(true)}
                  className="rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-purple-950/50 transition flex items-center gap-1.5"
                >
                  <Eye size={14} /> Xem 360° Điểm Chọn
                </button>
              </div>
            </div>

            {/* Container 3D Isometric View */}
            <div className="relative rounded-3xl border-2 border-purple-500/30 bg-gradient-to-b from-[#090b14] via-[#05070d] to-black p-6 md:p-12 overflow-hidden shadow-2xl flex items-center justify-center min-h-[460px]">
              {/* Lưới tọa độ không gian 3D nền */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(rgba(168, 85, 247, 0.4) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* TẤM BIA ĐÁ NGHIÊNG 3D */}
              <div
                className="relative w-full max-w-4xl aspect-[1024/571] rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(168,85,247,0.3)] transition-transform duration-700 ease-out hover:rotate-0"
                style={{
                  transform: 'perspective(1200px) rotateX(20deg) rotateZ(-2deg) scale(0.95)',
                  boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(168, 85, 247, 0.25)',
                }}
              >
                {/* Ảnh bia đá */}
                <Image
                  src="/ban_do_chinh_ham_phuc_hoi.jpg"
                  alt="Bản đồ 3D Bia đá"
                  fill
                  className="object-cover"
                />

                {/* Các khối hầm nổi 3D (3D Extruded Bunker Pillars) */}
                <div className="absolute inset-0">
                  {LANDMARK_POINTS.map((pt) => {
                    const isSelected = selectedLandmark.id === pt.id;
                    return (
                      <div
                        key={pt.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                        style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                      >
                        {/* Cột sáng laser đứng */}
                        <div
                          className={`w-0.5 h-12 md:h-16 mx-auto -mb-1 transition-all ${
                            isSelected ? 'bg-gradient-to-t from-purple-400 to-white opacity-100' : 'bg-purple-500/50 opacity-40 group-hover:opacity-100'
                          }`}
                        />

                        {/* Thẻ ghim 3D nổi */}
                        <button
                          onClick={() => setSelectedLandmark(pt)}
                          className={`relative px-2.5 py-1 rounded-lg border text-[11px] font-black whitespace-nowrap shadow-xl transition-all transform hover:-translate-y-1 hover:scale-110 ${
                            isSelected
                              ? 'bg-purple-600 text-white border-purple-300 shadow-purple-500/50 scale-105 ring-2 ring-purple-400'
                              : 'bg-black/80 text-stone-200 border-white/20 hover:border-purple-400'
                          }`}
                        >
                          {pt.name}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chú thích góc */}
              <div className="absolute bottom-4 left-6 z-10 text-xs text-stone-400 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                Hiệu ứng Sa Bàn 3D | Đang chọn: <strong className="text-purple-300">{selectedLandmark.name}</strong>
              </div>
            </div>

            {/* Modal 360 tích hợp cho Demo 3 */}
            {is360ModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col p-4 md:p-8">
                <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Toàn cảnh 360°: {selectedLandmark.name}</h3>
                    <button
                      onClick={() => setIs360ModalOpen(false)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-bold"
                    >
                      Đóng [X]
                    </button>
                  </div>
                  <div className="flex-1 w-full rounded-2xl overflow-hidden shadow-2xl">
                    <PanoramaViewer
                      imageSrc={selectedLandmark.image360}
                      title={`360°: ${selectedLandmark.name}`}
                      className="w-full h-full min-h-[460px]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* DEMO 4: TOUR KỂ CHUYỆN LỘ TRÌNH (GUIDED STORYLINE TOUR) */}
        {/* ========================================================================= */}
        {selectedDemo === 'demo4' && (
          <div className="flex flex-col gap-6">
            {/* Banner tóm tắt triết lý */}
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/30 via-stone-900/60 to-stone-900/40 p-4 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  <Compass size={14} /> Triết lý cốt lõi: Hướng Dẫn Viên Ảo Theo Dấu Chân Lịch Sử
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  Tour Thực Tế Ảo 360 Tuyến Điểm Kể Chuyện (Storyline Guided Tour)
                </h2>
                <p className="text-stone-300 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
                  Được thiết kế như một chuyến viếng thăm có thuyết minh tự động. Khách tham quan được dẫn dắt tuần tự qua 12 điểm mốc theo đúng cung đường vẽ trắng trên bia đá: từ Cổng vào → Nhà Tưởng niệm → Nhà Chứng tích → Hầm 1 → ... → Hầm 8. Có chế độ Tự Động Chạy Tour (Auto-Play) và Thuyết Minh Âm Thanh.
                </p>
              </div>

              {/* Bộ điều khiển tour */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsTourPlaying(!isTourPlaying)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    isTourPlaying
                      ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                  }`}
                >
                  {isTourPlaying ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isTourPlaying ? 'Tạm Dừng Tour' : 'Tự Động Chạy Tour'}</span>
                </button>

                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`p-2 rounded-xl border text-xs transition ${
                    audioEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : 'bg-white/5 text-stone-400 border-white/10 hover:text-white'
                  }`}
                  title="Thuyết minh âm thanh"
                >
                  {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>
            </div>

            {/* Layout Tour: Bản đồ có lộ trình + Màn hình 360 kết hợp */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Cột trái: Tấm bia đá làm kim chỉ nam lộ trình (chiếm 5 cột) */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <div className="relative aspect-[1024/571] w-full rounded-2xl overflow-hidden border-2 border-emerald-500/30 bg-stone-950 shadow-xl">
                  <Image
                    src="/ban_do_chinh_ham_phuc_hoi.jpg"
                    alt="Bản đồ lộ trình tour bia đá"
                    fill
                    className="object-contain"
                  />

                  {/* Marker hiện tại đang tham quan */}
                  <div className="absolute inset-0">
                    {LANDMARK_POINTS.map((pt, idx) => {
                      const isActive = tourStep === idx;
                      return (
                        <button
                          key={pt.id}
                          onClick={() => {
                            setTourStep(idx);
                            setSelectedLandmark(pt);
                          }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all ${
                            isActive ? 'scale-125 z-30' : 'opacity-70 hover:opacity-100 hover:scale-110'
                          }`}
                          style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                        >
                          <span
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border text-[9px] sm:text-[10px] font-black flex items-center justify-center transition ${
                              isActive
                                ? 'bg-emerald-400 text-stone-950 border-white ring-2 ring-emerald-300 ring-offset-1 ring-offset-stone-950 shadow-lg scale-110'
                                : 'bg-stone-950/90 text-stone-200 border-emerald-500/60 shadow-md hover:border-emerald-300'
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Progress bar của tour */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-stone-300">
                    <span>Tiến độ tour: <strong>Chặng {tourStep + 1} / {LANDMARK_POINTS.length}</strong></span>
                    <span className="text-emerald-400 font-bold">{selectedLandmark.name}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${((tourStep + 1) / LANDMARK_POINTS.length) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={handlePrevStep}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-stone-200 transition flex items-center gap-1"
                    >
                      <ChevronLeft size={14} /> Chặng trước
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition flex items-center gap-1 shadow-md"
                    >
                      Chặng sau <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Cột phải: Không gian 360° trực tiếp và lời thuyết minh (chiếm 7 cột) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl">
                  <PanoramaViewer
                    imageSrc={selectedLandmark.image360}
                    title={`Chặng ${tourStep + 1}: ${selectedLandmark.name}`}
                    className="w-full h-full"
                  />
                </div>

                {/* Khối lời dẫn thuyết minh lịch sử */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                      THUYẾT MINH LỊCH SỬ
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {selectedLandmark.name} — {selectedLandmark.tag}
                    </h4>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {selectedLandmark.historicalRole}
                  </p>
                  <p className="text-xs text-stone-400 italic">
                    "{selectedLandmark.description}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BẢNG SO SÁNH TỔNG HỢP & PHÊ DUYỆT CỦA NGƯỜI DÙNG */}
        {/* ========================================================================= */}
        <section className="rounded-3xl border border-white/15 bg-stone-900/60 backdrop-blur-xl p-6 mt-4 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sliders size={18} className="text-amber-400" /> Bảng Đối Chiếu 4 Phương Án Để Bạn Duyệt
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Xem xét ưu điểm của từng bản demo và chọn phương án bạn thấy ưng ý nhất để hệ thống hoàn thiện tiếp
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => alert(`Cảm ơn bạn! Bạn đã duyệt phương án: ${selectedDemo.toUpperCase()}. Antigravity sẽ tiến hành hoàn thiện chuyên sâu cho phương án này!`)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-950/50 transition hover:scale-105"
              >
                <CheckCircle2 size={16} /> Duyệt Chốt Phương Án Này
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Demo 1 Card */}
            <div
              onClick={() => setSelectedDemo('demo1')}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                selectedDemo === 'demo1'
                  ? 'bg-amber-950/30 border-amber-500 ring-2 ring-amber-500/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="font-bold text-amber-400 mb-1 flex items-center justify-between">
                <span>Demo 1: Sa Bàn Bia Gốc</span>
                {selectedDemo === 'demo1' && <CheckCircle2 size={14} />}
              </div>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                Giữ 100% nguyên bản bia đá với nét khắc trắng. Click điểm mở toàn cảnh 360° riêng biệt. Rất trực quan và chuẩn lịch sử.
              </p>
            </div>

            {/* Demo 2 Card */}
            <div
              onClick={() => setSelectedDemo('demo2')}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                selectedDemo === 'demo2'
                  ? 'bg-sky-950/30 border-sky-500 ring-2 ring-sky-500/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="font-bold text-sky-400 mb-1 flex items-center justify-between">
                <span>Demo 2: Góc Nhìn Kép Realtime</span>
                {selectedDemo === 'demo2' && <CheckCircle2 size={14} />}
              </div>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                Bản đồ đá đồng bộ Nón Tầm Nhìn (Radar Cone). Xoay 360° đến đâu thì radar trên đá xoay theo đến đó, không bao giờ mất hướng.
              </p>
            </div>

            {/* Demo 3 Card */}
            <div
              onClick={() => setSelectedDemo('demo3')}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                selectedDemo === 'demo3'
                  ? 'bg-purple-950/30 border-purple-500 ring-2 ring-purple-500/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="font-bold text-purple-400 mb-1 flex items-center justify-between">
                <span>Demo 3: Sa Bàn 3D Không Gian</span>
                {selectedDemo === 'demo3' && <CheckCircle2 size={14} />}
              </div>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                Tấm bia đá phối cảnh 3D nghiêng với cột laser hầm nổi. Hiệu ứng thị giác công nghệ cao đẳng cấp quốc tế.
              </p>
            </div>

            {/* Demo 4 Card */}
            <div
              onClick={() => setSelectedDemo('demo4')}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                selectedDemo === 'demo4'
                  ? 'bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="font-bold text-emerald-400 mb-1 flex items-center justify-between">
                <span>Demo 4: Tour Kể Chuyện Lộ Trình</span>
                {selectedDemo === 'demo4' && <CheckCircle2 size={14} />}
              </div>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                Dẫn dắt tham quan tuần tự từ Cổng vào đến Hầm 8 theo đường vẽ trắng. Có thuyết minh tự động từng bước rất sâu sắc.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
