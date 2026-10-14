'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Maximize2,
  Minimize2,
  Sun,
  Flame,
  Building,
  RotateCw,
  Eye,
  Sliders,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info,
  Layers,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { ARTIFACTS_DATA, ArtifactItem, ArtifactHotspot } from './artifact-data';
import { ArtifactViewer3D } from './ArtifactViewer3D';

export function ArtifactShowcase() {
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>(ARTIFACTS_DATA[0].id);
  const [lightingMode, setLightingMode] = useState<'dungeon' | 'museum' | 'freedom'>('museum');
  const [isXRay, setIsXRay] = useState<boolean>(false);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1.1);
  const [activeHotspot, setActiveHotspot] = useState<ArtifactHotspot | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Current selected artifact object
  const currentArtifact = ARTIFACTS_DATA.find((a) => a.id === selectedArtifactId) || ARTIFACTS_DATA[0];

  // Toggle narration voice using SpeechSynthesis (0 VND client-side)
  const toggleSpeechNarrative = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${currentArtifact.name}. ${currentArtifact.summary} Lời kể nhân chứng: ${currentArtifact.narrativeQuote}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleSelectArtifact = (id: string) => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
    setSelectedArtifactId(id);
    setActiveHotspot(null);
  };

  return (
    <div className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-[#06090c]' : 'py-6'} flex flex-col gap-6`}>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3.5 py-1 text-xs font-semibold text-amber-300">
              <Sparkles size={13} className="text-amber-400 animate-pulse" />
              Bảo Tàng Khảo Cổ Số 3D • Đồi Thiên Thai
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-400/40 bg-yellow-950/50 px-3 py-1 text-xs font-semibold text-yellow-200">
              <span>🔦</span>
              <span>Đèn pin rọi 3D theo chuột: Đang bật</span>
            </div>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl font-display">
            Showroom Hiện Vật 3D Tương Tác
          </h1>
          <p className="text-xs text-stone-300 md:text-sm">
            Rê chuột như cầm đèn pin khảo cổ rọi sáng từng chi tiết • Xoay 360° • Bóc tách tia X 4 bảo vật vô giá.
          </p>
        </div>

        {/* Global Controls & Fullscreen */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSpeechNarrative}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition border ${
              isPlayingAudio
                ? 'border-red-500 bg-red-950/60 text-red-200'
                : 'border-white/15 bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
            title="Thuyết minh âm thanh AI"
          >
            {isPlayingAudio ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-amber-400" />}
            <span className="hidden sm:inline">{isPlayingAudio ? 'Dừng đọc' : 'Nghe thuyết minh'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-stone-300 hover:bg-white/10"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span className="hidden sm:inline">{isFullscreen ? 'Thu nhỏ' : 'Toàn cảnh'}</span>
          </button>
        </div>
      </div>

      {/* Artifact Navigation Tabs (4 Bảo vật) */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {ARTIFACTS_DATA.map((item) => {
          const isSelected = item.id === selectedArtifactId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectArtifact(item.id)}
              className={`group relative flex flex-col text-left p-3.5 rounded-2xl border transition-all duration-300 backdrop-blur-[3px] ${
                isSelected
                  ? 'border-amber-400/80 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] shadow-lg shadow-amber-950/40 ring-1 ring-amber-400/50'
                  : 'border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.04] to-black/[0.08] hover:border-emerald-500/40 hover:bg-black/[0.15]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${item.accentColor}22`,
                    color: item.accentColor,
                  }}
                >
                  {item.bunkerAssociation}
                </span>
                {isSelected && <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />}
              </div>

              <h4 className="mt-2 text-xs font-bold text-white group-hover:text-amber-200 line-clamp-1">
                {item.name}
              </h4>
              <p className="mt-1 text-[11px] text-stone-400 line-clamp-1">{item.era}</p>
            </button>
          );
        })}
      </div>

      {/* Main 3D Canvas Showcase Area & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive 3D Canvas Viewport (8 Cols) */}
        <div className="lg:col-span-8 relative aspect-[4/3] sm:aspect-[16/10] min-h-[380px] sm:min-h-[480px] w-full rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-[#090e13] via-[#05070a] to-[#020406] overflow-hidden shadow-2xl">
          {/* 3D Canvas Component */}
          <ArtifactViewer3D
            artifact={currentArtifact}
            lightingMode={lightingMode}
            isXRay={isXRay}
            isAutoRotate={isAutoRotate}
            zoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
            onSelectHotspot={(hs) => setActiveHotspot(hs)}
            selectedHotspotId={activeHotspot?.id}
          />

          {/* Top-Left Floating Controls: Lighting Presets */}
          <div className="absolute top-4 left-4 z-30 flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-black/40 backdrop-blur-[3px] border border-white/10 shadow-xl">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 hidden sm:inline">
              Ánh sáng:
            </span>
            <button
              type="button"
              onClick={() => setLightingMode('dungeon')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                lightingMode === 'dungeon'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
              title="Ánh nến ngục tối Thiên Thai"
            >
              <Flame size={13} className="text-amber-400" />
              <span>Ngục tối</span>
            </button>
            <button
              type="button"
              onClick={() => setLightingMode('museum')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                lightingMode === 'museum'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
              title="Ánh sáng bảo tàng chuẩn quốc tế"
            >
              <Building size={13} className="text-sky-300" />
              <span>Bảo tàng</span>
            </button>
            <button
              type="button"
              onClick={() => setLightingMode('freedom')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                lightingMode === 'freedom'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
              title="Ánh ban mai đồi Thiên Thai"
            >
              <Sun size={13} className="text-yellow-300" />
              <span>Ban mai</span>
            </button>
          </div>

          {/* Top-Right Floating Controls: X-Ray & Turntable */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/40 backdrop-blur-[3px] border border-white/10 shadow-xl">
            {/* X-Ray / Exploded Matrix Toggle */}
            <button
              type="button"
              onClick={() => setIsXRay(!isXRay)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                isXRay
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_#06b6d4]'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
              title="Bật chế độ tia X bóc tách cấu trúc"
            >
              <Layers size={13} className={isXRay ? 'text-black' : 'text-cyan-400'} />
              <span>Tia X Bóc Tách</span>
            </button>

            {/* Auto Turntable Toggle */}
            <button
              type="button"
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              className={`p-2 rounded-xl text-xs font-semibold transition ${
                isAutoRotate ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-stone-400 hover:bg-white/10'
              }`}
              title={isAutoRotate ? 'Tạm dừng xoay 360°' : 'Bật xoay tự động 360°'}
            >
              <RotateCw size={14} className={isAutoRotate ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Bottom-Right Zoom Slider & Quick Buttons */}
          <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-black/40 backdrop-blur-[3px] border border-white/10 shadow-xl">
            <span className="text-[10px] font-semibold text-stone-400 uppercase hidden sm:inline">Thu phóng:</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.7, parseFloat((z - 0.15).toFixed(2))))}
              className="w-5 h-5 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
              title="Thu nhỏ (-)"
            >
              −
            </button>
            <input
              type="range"
              min="0.7"
              max="2.5"
              step="0.05"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              className="w-16 sm:w-24 accent-amber-400 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(2.5, parseFloat((z + 0.15).toFixed(2))))}
              className="w-5 h-5 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
              title="Phóng to (+)"
            >
              +
            </button>
            <span className="text-xs font-mono font-semibold text-amber-300 min-w-[36px] text-right">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>
        </div>

        {/* Right Column: Museum Dossier & Hotspot Inspector (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Active Hotspot Inspector Card (if clicked) */}
          {activeHotspot ? (
            <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] p-5 shadow-2xl relative overflow-hidden backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <Sparkles size={12} /> {activeHotspot.tag}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveHotspot(null)}
                  className="text-stone-400 hover:text-white text-xs underline"
                >
                  Đóng chi tiết
                </button>
              </div>

              <h3 className="mt-3 text-lg font-bold text-white">{activeHotspot.title}</h3>
              <p className="text-xs font-medium text-amber-200/80">{activeHotspot.subtitle}</p>

              <p className="mt-3 text-xs leading-relaxed text-stone-200">{activeHotspot.description}</p>

              <div className="mt-4 p-3 rounded-2xl bg-black/[0.05] border border-emerald-500/20 text-[11px] leading-relaxed text-stone-300 backdrop-blur-[3px]">
                <span className="font-bold text-amber-300 block mb-1">🔍 Giám định Khảo cổ:</span>
                {activeHotspot.historicalNote}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] p-5 text-center backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-300">
                <Compass size={18} />
              </div>
              <h4 className="mt-3 text-sm font-bold text-white">Chạm Vào Các Điểm Sáng 3D</h4>
              <p className="mt-1 text-xs text-stone-400">
                Nhấp vào các điểm radar vàng trên thân hiện vật để phóng to và mở khóa những chi tiết khảo cổ bí mật.
              </p>
            </div>
          )}

          {/* Museum Artifact Spec Sheet */}
          <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] p-5 backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Info size={16} className="text-amber-400" /> Hồ Sơ Hiện Vật Di Tích
            </h3>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-stone-400">Niên đại:</span>
                <span className="font-semibold text-white">{currentArtifact.era}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-stone-400">Chất liệu:</span>
                <span className="font-semibold text-white text-right max-w-[60%]">{currentArtifact.material}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-stone-400">Kích thước:</span>
                <span className="font-semibold text-white">{currentArtifact.dimensions}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-stone-400">Vị trí phát hiện:</span>
                <span className="font-semibold text-amber-300">{currentArtifact.bunkerAssociation}</span>
              </div>
            </div>

            {/* Witness Quote Box */}
            <div className="mt-4 p-3.5 rounded-2xl border border-emerald-500/20 bg-black/[0.05] backdrop-blur-[3px]">
              <p className="text-xs italic leading-relaxed text-stone-200">
                {currentArtifact.narrativeQuote}
              </p>
              <span className="block mt-2 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                — {currentArtifact.witnessName}
              </span>
            </div>

            {/* Link to Next Step: Web-Quest & Escape room */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <Link
                href="/ban-do-360"
                className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition group"
              >
                <span>Đối chiếu Sa bàn 360° Đồi Thiên Thai</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
