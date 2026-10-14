'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  Eye,
  Layers,
  MapPin,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  ChevronLeft,
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
    tag: 'Điểm dừng chân đầu tiên • 82m²',
    historicalRole: 'Diện tích 82m², chìm dưới lòng đất, cửa gỗ nẹp sắt (0,6m x 1,8m). Điểm tạm giam phân loại nghi can Cộng sản trước khi chuyển sang các hầm khác; tù nhân bị chôn sống trong ngột ngạt và lầy lội.',
    coords: '16°26\'44"N 107°33\'15"E',
    x: 40.04,
    y: 51.49,
    color: '#ef4444',
    image360: '/panorama_ba_don_360.jpg',
    thumbnail: '/cac-ham/ham-1.jpg',
    description: 'Mùa mưa nước giọt lầy lội, mùa đông buốt giá, mùa hè như lò lửa ngột ngạt thiếu sáng cùng dịch bệnh côn trùng. Tù nhân bị đày đọa chết dần chết mòn theo dã tâm của Ngô Đình Cẩn.',
    order: 4,
  },
  {
    id: 'ham-2',
    slug: 'ham-2',
    name: 'Hầm số 2',
    tag: 'Hầm nhỏ nhất • 41m²',
    historicalRole: 'Hầm nhỏ nhất (41m²), nửa chìm nửa nổi, tường dày 0,35m, trần 0,45m. Nơi giam giữ, tra tấn thương gia và cán bộ kinh tài (Phan Văn Thí, Lê Văn Châu, Nguyễn Văn Yến, Bửu Bang, Châu Đình Chương, Tống Văn Đen...) để tống tiền chuộc mạng.',
    coords: '16°26\'43"N 107°33\'19"E',
    x: 50.10,
    y: 45.01,
    color: '#f59e0b',
    image360: '/tactical_night_ba_don.jpg',
    thumbnail: '/cac-ham/ham-2.jpg',
    description: 'Ngô Đình Cẩn vu oan tù nhân dính dáng gián điệp nhằm buộc gia đình phải nộp vàng, tiền chuộc thân nhân trong điều kiện giam cầm khắc nghiệt.',
    order: 5,
  },
  {
    id: 'ham-3',
    slug: 'ham-3',
    name: 'Hầm số 3',
    tag: '20 xà lim kiên cố • 85m²',
    historicalRole: 'Diện tích 85m², tường 0,45m, trần 0,5m, hào sâu 0,7m, 2 lỗ thông hơi phi 0,4m. Chia 20 xà lim (1,5m x 0,6m x 1,5m) cửa lưới mắt cáo; nơi giam nhân sĩ, trí thức yêu nước chống họ Ngô.',
    coords: '16°26\'41"N 107°33\'20"E',
    x: 61.04,
    y: 42.91,
    color: '#10b981',
    image360: '/khong_gian_tong_quan.jpg',
    thumbnail: '/cac-ham/ham-3.jpg',
    description: 'Nơi đày ải các trí thức kiên trung như Lê Thiên Tạo, Bác sỹ Lê Khắc Quyến (Giám đốc Bệnh viện Trung ương Huế) trong không gian biệt giam cách ly hoàn toàn.',
    order: 6,
  },
  {
    id: 'ham-4',
    slug: 'ham-4',
    name: 'Hầm số 4',
    tag: 'Hầm ngâm nước • Bể 10m³ • 85m²',
    historicalRole: 'Diện tích 85m², nửa chìm nửa nổi, trước hầm có bể chứa nước 10m³, bên trong chia 2 dãy gồm 20 xà lim. Giam và tra tấn tù nhân từ các tỉnh khác đưa về chưa phân loại (Nguyễn Vĩnh Nghiệp, Mai Văn Nệm, Vũ Lam...).',
    coords: '16°26\'39"N 107°33\'17"E',
    x: 50.98,
    y: 32.40,
    color: '#06b6d4',
    image360: '/panorama_ba_don_360.jpg',
    thumbnail: '/cac-ham/ham-4.jpg',
    description: 'Địa ngục bùn lầy buốt lạnh quanh năm, chân tay lở loét vì nước ngầm tù đọng và thiếu dưỡng khí, thử thách tột cùng ý chí người tù cách mạng.',
    order: 8,
  },
  {
    id: 'ham-5',
    slug: 'ham-5',
    name: 'Hầm số 5',
    tag: 'Hầm lò rải kẽm gai • 70m²',
    historicalRole: 'Diện tích 70m², thể tích 220m³, tường nóc dày 0,45m rải kẽm gai, dạng hầm lò để trống không ngăn xà lim. Nơi giam giữ tăng ni, Phật tử, học sinh sinh viên sau biến cố Phật giáo tháng 5/1963 và vụ vượt ngục của nhà tình báo Mai Ca.',
    coords: '16°26\'38"N 107°33\'21"E',
    x: 70.90,
    y: 29.95,
    color: '#ec4899',
    image360: '/chin_ham_aerial_drone.jpg',
    thumbnail: '/cac-ham/ham-5.jpg',
    description: 'Sau biến cố Phật giáo 1963, Ngô Đình Cẩn nhốt dồn cả trăm người vào không gian hầm lò chật hẹp ngột ngạt khiến nhiều người chết ngạt.',
    order: 9,
  },
  {
    id: 'ham-6',
    slug: 'ham-6',
    name: 'Hầm số 6',
    tag: 'Lò tra tấn trung cổ • 79m²',
    historicalRole: 'Diện tích 79m², cách hầm số 9 20m, bên trong để trống bày la liệt dao, búa, kìm, xích. Nơi tay chân khét tiếng của Cẩn (Nguyễn Chữ, Phan Quang Đông, Dương Văn Hiếu) thi hành nhục hình man rợ thời trung cổ.',
    coords: '16°26\'37"N 107°33\'19"E',
    x: 60.06,
    y: 22.42,
    color: '#8b5cf6',
    image360: '/tactical_night_ba_don.jpg',
    thumbnail: '/cac-ham/ham-6.jpg',
    description: 'Đóng người lên tường, xẻo từng miếng thịt, treo ngược, ép uống nước xà phòng rồi đạp vỡ bụng chết đem vứt xác ra rừng thông. Dù vậy, các chiến sĩ vẫn một lòng trung kiên với Đảng và Tổ quốc.',
    order: 10,
  },
  {
    id: 'ham-7',
    slug: 'ham-7',
    name: 'Hầm số 7',
    tag: '20 xà lim biệt giam • 78m²',
    historicalRole: 'Diện tích 78m², tường 0,4m, trần 0,5m, cửa thép 1,8m x 1,2m, 20 xà lim hai dãy, nền đào sâu ngấm nước mưa không thoát. Nơi giam giữ các đảng phái đối lập và nhiều chiến sĩ tình báo Cộng sản kiên cường.',
    coords: '16°26\'40"N 107°33\'14"E',
    x: 51.27,
    y: 21.37,
    color: '#e11d48',
    image360: '/khong_gian_tong_quan.jpg',
    thumbnail: '/cac-ham/ham-7.jpg',
    description: 'Giam giữ các chiến sĩ tình báo Bạch Ngọc Phách, Phan Trọng Tỉnh, Nguyễn Văn Nại, Nguyễn Văn Nhiệm, Nguyễn Văn Trung, Đoàn Thị Thu Thủy, Võ Côn... Mỗi xà lim chỉ có ô sắt nhỏ đưa cơm.',
    order: 11,
  },
  {
    id: 'ham-8',
    slug: 'ham-8',
    name: 'Hầm số 8',
    tag: 'Chuồng cọp tử hình • 72.88m²',
    historicalRole: 'Diện tích 72,88m², chìm sâu trong lòng đất, tường 0,4m, cửa thép đặc biệt có lỗ hơi 30cm. 20 xà lim biệt giam (1,8m x 0,8m x 1,8m) đan song sắt 16 thanh ngang 2 thanh dọc, lót ván hẹp và xô sắt vệ sinh.',
    coords: '16°26\'43"N 107°33\'24"E',
    x: 41.11,
    y: 21.89,
    color: '#dc2626',
    image360: '/panorama_ba_don_360.jpg',
    thumbnail: '/cac-ham/ham-8.jpg',
    description: 'Địa ngục trần gian khét tiếng nhất Chín Hầm nơi biệt giam tử tù chính trị Cộng sản (Phan Trọng Tịnh, Nguyễn Minh Vân, Nguyễn Văn Quý, Nguyễn Đình Trân...). Biểu tượng bất diệt của khí phách cách mạng.',
    order: 12,
  },
  {
    id: 'ham-9',
    slug: 'ham-9',
    name: 'Hầm số 9',
    tag: 'Nút giao cứ điểm • Giải phóng 1963 • 75m²',
    historicalRole: 'Diện tích 75m², hầm trung tâm kết nối các tuyến hào huyết mạch đồi Ba Đồn. Cứ điểm chứng kiến ngày 02/11/1963 bạo quyền Ngô Đình Cẩn sụp đổ, nhân dân Huế phá tung xiềng xích giải thoát tù nhân.',
    coords: '16°26\'36"N 107°33\'16"E',
    x: 53.13,
    y: 38.18,
    color: '#0284c7',
    image360: '/chin_ham_aerial_drone.jpg',
    thumbnail: '/cac-ham/ham-9.jpg',
    description: 'Mốc son lịch sử khép lại hệ thống nhà tù Chín Hầm, biểu tượng của ngày trở về với ánh sáng tự do của những người con trung kiên.',
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
    image360: '/tuong_dai.jpg',
    thumbnail: '/tuong_dai.jpg',
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
    image360: '/nha_chung_tich.jpg',
    thumbnail: '/nha_chung_tich.jpg',
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

// --- TRANG CHÍNH: SA BÀN THỰC ĐỊA & BẢN ĐỒ 360° ---
export default function BanDo360Page() {
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkPoint>(LANDMARK_POINTS[0]);
  const [is360ModalOpen, setIs360ModalOpen] = useState<boolean>(false);
  const [mapZoom, setMapZoom] = useState<number>(1);

  return (
    <div className="min-h-screen bg-transparent text-stone-100 flex flex-col font-sans selection:bg-amber-500/30">
      {/* --- HEADER CHÍNH --- */}
      <header className="sticky top-0 z-50 border-b border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] backdrop-blur-[3px] px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-stone-300 hover:text-white hover:bg-white/10 transition backdrop-blur-[3px]"
            >
              <img src="/Logo CH1.png" alt="Logo Chín Hầm" className="h-4 w-4 object-contain" />
              <span>Trang Chủ</span>
            </Link>
            <div className="h-4 w-px bg-white/15" />
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-sm md:text-base font-bold text-white tracking-tight">
                Sa Bàn Thực Địa & Bản Đồ 360° Chín Hầm
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-stone-300 backdrop-blur-[3px]">
              <Compass size={13} className="text-amber-400" />
              <span>12 Điểm Tọa Độ Thực Địa</span>
            </span>
          </div>
        </div>
      </header>

      {/* --- NỘI DUNG CHÍNH --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* Banner giới thiệu sa bàn */}
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] backdrop-blur-[3px] p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Layers size={14} /> Sa Bàn Chỉ Huy Khắc Đá & Cửa Sổ Thực Tế Ảo 360°
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Bản đồ các hầm tại di tích
            </h2>
            <p className="text-stone-300 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
              Phục hồi nguyên vẹn dựa trên bia đá sa bàn thực địa đồi Ba Đồn. Nhấp chọn các điểm chốt radar trên bia đá hoặc danh sách bên dưới để định vị không gian và mở cửa sổ toàn cảnh 360° tương tác.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setMapZoom((prev) => Math.min(1.8, prev + 0.2))}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-stone-200 transition backdrop-blur-[3px]"
              title="Phóng to bản đồ"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => setMapZoom((prev) => Math.max(0.9, prev - 0.2))}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-stone-200 transition backdrop-blur-[3px]"
              title="Thu nhỏ bản đồ"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={() => setMapZoom(1)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-stone-200 transition text-xs font-bold backdrop-blur-[3px]"
              title="Mặc định 100%"
            >
              100%
            </button>
          </div>
        </div>

        {/* Layout 2 cột: Bia đá tương tác lớn & Khối thông tin chi tiết */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Cột trái: Tấm bia đá phục hồi tương tác (chiếm 8 cột) */}
          <div className="lg:col-span-8 flex flex-col justify-between gap-4 h-full">
            <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/30 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] backdrop-blur-[3px] group flex-1 flex flex-col justify-center">
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

                {/* Lớp phủ tương tác với các điểm ghim Radar */}
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
                        {isSelected && (
                          <span
                            className="absolute -inset-1 rounded-full animate-ping bg-amber-400/60 pointer-events-none"
                            style={{ animationDuration: '2s' }}
                          />
                        )}

                        <span
                          className={`relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full border text-[9px] sm:text-[10px] font-black shadow-md transition ${
                            isSelected
                              ? 'bg-amber-400 text-stone-950 border-white scale-110 shadow-amber-400/80 ring-2 ring-amber-300 ring-offset-1 ring-offset-stone-950'
                              : 'bg-stone-950/90 text-amber-300 border-amber-400/80 hover:bg-amber-400 hover:text-stone-950 hover:border-white'
                          }`}
                        >
                          {pt.id.startsWith('ham-') ? pt.id.replace('ham-', 'H') : '★'}
                        </span>

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
                <span className="rounded-full bg-black/30 backdrop-blur-[3px] px-3.5 py-1.5 border border-white/10 pointer-events-auto">
                  Đang chọn: <strong className="text-amber-400">{selectedLandmark.name}</strong>
                </span>
                <span className="rounded-full bg-black/30 backdrop-blur-[3px] px-3.5 py-1.5 border border-white/10 hidden sm:inline pointer-events-auto">
                  Click vào các điểm đỏ/vàng trên bia đá để xem
                </span>
              </div>
            </div>

            {/* Danh sách chip nhanh các hầm */}
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] backdrop-blur-[3px] p-3.5 flex flex-col gap-2.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between text-[11px] font-semibold text-stone-400 px-1">
                <span className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
                  <MapPin size={12} /> 12 Điểm Mốc Lịch Sử
                </span>
                <span className="text-[10px] text-stone-400">Nhấp để định vị nhanh trên bản đồ</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {LANDMARK_POINTS.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedLandmark(pt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                      selectedLandmark.id === pt.id
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-md ring-2 ring-amber-300'
                        : 'bg-white/5 hover:bg-white/15 text-stone-200 border border-white/10 backdrop-blur-[3px]'
                    }`}
                  >
                    {pt.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cột phải: Card chi tiết điểm & Nút bấm mở 360° (chiếm 4 cột, h-full đồng bộ) */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] backdrop-blur-[3px] p-5 flex flex-col justify-between h-full gap-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <div className="flex flex-col gap-3.5">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1">
                    <MapPin size={13} /> {selectedLandmark.tag}
                  </div>
                  <h3 className="text-xl font-black text-white">{selectedLandmark.name}</h3>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">{selectedLandmark.coords}</p>
                </div>

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

                <div className="rounded-xl bg-black/[0.05] border border-emerald-500/20 p-3 text-xs text-stone-200 leading-relaxed space-y-1.5 backdrop-blur-[3px]">
                  <p><strong className="text-white">Vai trò lịch sử:</strong> {selectedLandmark.historicalRole}</p>
                  <p className="text-stone-300/90">{selectedLandmark.description}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
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
            </div>
          </div>
        </div>

        {/* Modal xem 360° toàn màn hình khi bấm nút */}
        {is360ModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col p-4 md:p-8 animate-fadeIn">
            <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col gap-3">
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

              <div className="flex-1 w-full rounded-2xl overflow-hidden shadow-2xl relative">
                <PanoramaViewer
                  imageSrc={selectedLandmark.image360}
                  title={`Toàn cảnh 360°: ${selectedLandmark.name}`}
                  className="w-full h-full min-h-[480px]"
                />
              </div>

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
      </main>
    </div>
  );
}
