'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Sparkles, Eye, ShieldCheck } from 'lucide-react';

interface LogoOption {
  id: string;
  name: string;
  tag: string;
  src: string;
  desc: string;
  highlights: string[];
  recommended?: boolean;
}

const DEMOS: LogoOption[] = [
  {
    id: 'demo2',
    name: 'Demo 2: Nền Trong Suốt • Nét Sáng Bạch Kim & Ngọc Lục Bảo',
    tag: 'Tối ưu Dark Mode (Khuyên dùng)',
    src: '/logo-demos/demo2-darkmode-contrast.png',
    desc: 'Tách sạch nền trắng 100%. Các đường nét màu tím sẫm được nâng sáng thành gam bạch kim/bạc ánh kim thanh thoát, kết hợp đường viền xanh ngọc rực rỡ. Rất sắc nét, nổi bật và sang trọng trên nền tối.',
    highlights: ['Nền trong suốt 100%', 'Tương phản cao trên nền đen', 'Không bị chìm nét tím', 'Hiện đại & tinh tế'],
    recommended: true,
  },
  {
    id: 'demo3',
    name: 'Demo 3: Huy Hiệu Kính Tối Bo Góc (Dark Glass Badge)',
    tag: 'Ấn Tín Bảo Tàng Cao Cấp',
    src: '/logo-demos/demo3-dark-glass-badge.png',
    desc: 'Logo được đặt trang trọng trong khung huy hiệu bo góc (squircle) với nền kính mờ đen titan (Frosted Dark Glass) cùng đường viền kim loại vàng gold hairline tinh tế.',
    highlights: ['Khung huy hiệu đồng bộ menu', 'Viền vàng kim sang trọng', 'Dễ nhận diện thương hiệu', 'Độc lập trên mọi nền'],
  },
  {
    id: 'demo1',
    name: 'Demo 1: Tách Nền Trong Suốt Nguyên Bản (Transparent Original)',
    tag: 'Giữ Màu Gốc',
    src: '/logo-demos/demo1-transparent.png',
    desc: 'Tách sạch hoàn toàn nền trắng bao quanh và các ô mở. Giữ nguyên 100% màu vẽ nguyên thủy (xanh ngọc teal và tím đậm violet).',
    highlights: ['Giữ trọn bản quyền màu gốc', 'Không còn viền trắng chói', 'Hòa vào nền trang web'],
  },
  {
    id: 'demo4',
    name: 'Demo 4: Phiên Bản Hoàng Kim Di Sản (Imperial Gold & Crimson)',
    tag: 'Phong Cách Cố Đô Huế',
    src: '/logo-demos/demo4-heritage-gold.png',
    desc: 'Tách nền trong suốt, phối lại màu theo nhận diện lịch sử Huế: Đường nét mạ vàng gold hoàng gia kết hợp các mảng màu đỏ son di tích trầm ấm.',
    highlights: ['Tone màu Hoàng Cung Huế', 'Hòa hợp đèn lồng & lá phong đỏ', 'Nền trong suốt hoàn toàn'],
  },
];

export default function LogoDemoPage() {
  const [selectedDemo, setSelectedDemo] = useState<string>('demo2');
  const [bgMode, setBgMode] = useState<'black' | 'charcoal' | 'gradient'>('black');
  const [applying, setApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState<string | null>(null);

  const activeOption = DEMOS.find((d) => d.id === selectedDemo) || DEMOS[0];

  const handleApplyLogo = async (demoId: string) => {
    setApplying(true);
    try {
      const res = await fetch('/api/apply-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoId }),
      });
      if (res.ok) {
        setAppliedSuccess(demoId);
        setTimeout(() => setAppliedSuccess(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setApplying(false);
    }
  };

  const getBgStyle = () => {
    if (bgMode === 'black') return 'bg-[#05070a]';
    if (bgMode === 'charcoal') return 'bg-[#111827]';
    return 'bg-gradient-to-b from-[#141d24] via-[#080d12] to-[#040608]';
  };

  return (
    <div className={`min-h-screen ${getBgStyle()} text-stone-100 font-sans transition-colors duration-300 pb-20`}>
      {/* Header Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05070a]/90 backdrop-blur-xl px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-stone-300 hover:text-white hover:bg-white/10 transition"
            >
              <ArrowLeft size={14} /> Về Trang Chủ
            </Link>
            <div className="h-4 w-px bg-white/15" />
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <h1 className="text-sm md:text-base font-bold text-white tracking-tight">
                Phòng So Sánh & Thử Nghiệm Logo Chín Hầm (Dark Mode)
              </h1>
            </div>
          </div>

          {/* Background switcher */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-400 mr-1">Màu nền thử:</span>
            <button
              onClick={() => setBgMode('black')}
              className={`px-2.5 py-1 rounded-md border ${bgMode === 'black' ? 'border-amber-400 bg-amber-400/10 text-amber-300' : 'border-white/10 text-stone-400 hover:text-white'}`}
            >
              Đen Trang Chủ (#05070a)
            </button>
            <button
              onClick={() => setBgMode('charcoal')}
              className={`px-2.5 py-1 rounded-md border ${bgMode === 'charcoal' ? 'border-amber-400 bg-amber-400/10 text-amber-300' : 'border-white/10 text-stone-400 hover:text-white'}`}
            >
              Xám Than (#111827)
            </button>
            <button
              onClick={() => setBgMode('gradient')}
              className={`px-2.5 py-1 rounded-md border ${bgMode === 'gradient' ? 'border-amber-400 bg-amber-400/10 text-amber-300' : 'border-white/10 text-stone-400 hover:text-white'}`}
            >
              Gradient Kính Mờ
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-10">
        {/* Intro Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Eye size={14} /> Trực quan hóa nền Logo trước khi duyệt chính thức
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Chọn Phương Án Nền Logo Phù Hợp Nhất
          </h2>
          <p className="text-sm text-stone-300">
            Logo gốc có nền trắng vuông bị chói sáng giữa giao diện tối. Dưới đây là 4 phương án thiết kế chuyên biệt để logo hòa hợp tự nhiên và sang trọng với màu sắc di tích.
          </p>
        </div>

        {/* Live Header Simulation */}
        <div className="p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Mô phỏng thực tế trên Menu điều hướng website:
            </span>
            <span className="text-xs text-stone-400">Đang xem thử: <b className="text-white">{activeOption.name}</b></span>
          </div>

          {/* Mockup Header */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-black/70 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <img
                  src={activeOption.src}
                  alt={activeOption.name}
                  className="h-10 w-10 object-contain drop-shadow-md transition-all duration-300"
                />
              </div>
              <div>
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#fef08a] font-display">
                  CHÍN HẦM
                </div>
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <Sparkles size={11} /> Di sản công nghệ số Huế
                </div>
              </div>
            </div>

            {/* Dummy nav items */}
            <div className="hidden md:flex items-center gap-6 text-xs text-stone-300 font-medium">
              <span className="text-red-400 font-semibold">Chứng Tích</span>
              <span>9 Căn Hầm</span>
              <span>Hồ Sơ Di Sản</span>
              <span>Hồi Sinh</span>
              <span>Ảnh Tổng Quan</span>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-xs text-white font-semibold shadow">
                Bảo Tàng Số →
              </button>
            </div>
          </div>
        </div>

        {/* 4 Demo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEMOS.map((demo) => {
            const isSelected = selectedDemo === demo.id;
            return (
              <div
                key={demo.id}
                onClick={() => setSelectedDemo(demo.id)}
                className={`relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-white/[0.06] shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/30'
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'
                }`}
              >
                {/* Badge top */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      demo.recommended
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-white/10 text-stone-300 border-white/15'
                    }`}
                  >
                    {demo.tag}
                  </span>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold">
                      <Check size={14} /> Đang chọn xem thử
                    </span>
                  )}
                </div>

                {/* Visual Preview Box */}
                <div className="flex items-center justify-center p-8 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md mb-5 group">
                  <img
                    src={demo.src}
                    alt={demo.name}
                    className="w-36 h-36 object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {demo.name}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {demo.desc}
                  </p>

                  {/* Highlights pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {demo.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-stone-300"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer action button */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-stone-400">
                    Kích thước: 1351 × 1407 px (HD)
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDemo(demo.id);
                      handleApplyLogo(demo.id);
                    }}
                    disabled={applying}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow ${
                      appliedSuccess === demo.id
                        ? 'bg-emerald-600 text-white'
                        : isSelected
                        ? 'bg-amber-400 hover:bg-amber-300 text-black'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {appliedSuccess === demo.id ? (
                      <>
                        <Check size={14} /> Đã áp dụng làm Logo chính!
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={14} /> Chọn & Áp dụng bản này
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Row */}
        <div className="p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            So sánh kích thước nhỏ (Thực tế trên thanh Menu 36px):
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {DEMOS.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedDemo(d.id)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-3 cursor-pointer transition ${
                  selectedDemo === d.id ? 'border-amber-400 bg-white/5' : 'border-white/10 bg-black/40 hover:border-white/20'
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center p-1 rounded-lg bg-black/60 border border-white/10">
                  <img src={d.src} alt={d.name} className="w-9 h-9 object-contain" />
                </div>
                <span className="text-xs font-semibold text-center text-stone-300">
                  {d.name.split(':')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
