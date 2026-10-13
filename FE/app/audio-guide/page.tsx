"use client";

import { useEffect, useState } from 'react';

type AudioTrack = {
  id: string;
  title: string;
  duration: string;
  category: string;
  description: string;
};

export default function AudioGuidePage() {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('/api/audio');
        const result = await response.json();
        const list = Array.isArray(result) ? result : result.tracks || [];
        setTracks(list);
        if (list[0]) {
          setSelectedTrackId(list[0].id);
        }
      } catch (error) {
        console.error('Failed to load audio tracks', error);
      }
    };

    fetchTracks();
  }, []);

  const selectedTrack = tracks.find((track) => track.id === selectedTrackId) || tracks[0];

  return (
    <main className="container-shell py-16">
      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Thuyết Minh Không Gian • Audio Guide
        </div>
        <h1 className="text-4xl font-black text-white md:text-5xl font-display tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          Nghe Hướng Dẫn Âm Thanh Xứ Huế
        </h1>
        <p className="mt-3 max-w-2xl text-stone-300 text-base leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          Đắm mình trong không gian đồi Ba Đồn cùng âm vang lịch sử, tiếng gió thông reo và lời tự thuật bi tráng của các chứng nhân trong môi trường 3D Living Green.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {tracks.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedTrackId(item.id)}
              className={`flex w-full items-center justify-between rounded-2xl border p-6 text-left backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-all duration-300 ${
                selectedTrack?.id === item.id
                  ? 'border-emerald-400/70 bg-black/[0.25] shadow-[0_10px_30px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/50'
                  : 'border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] hover:border-emerald-400/40 hover:bg-black/[0.15]'
              }`}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">{item.category}</p>
                <h2 className="mt-1 text-xl font-bold text-white font-display">{item.title}</h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-stone-300">{item.duration}</span>
                <span
                  className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    selectedTrack?.id === item.id
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/40'
                      : 'border border-emerald-500/30 bg-white/5 backdrop-blur-[3px] text-emerald-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-400'
                  }`}
                >
                  {selectedTrack?.id === item.id ? 'Đang phát ♫' : 'Nghe ngay'}
                </span>
              </div>
            </button>
          ))}
        </div>

        <aside className="rounded-[2.5rem] border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] p-7 backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] shadow-2xl h-fit">
          <div className="relative mb-6 overflow-hidden rounded-2xl border border-emerald-500/20 shadow-inner">
            <img
              src="/khong_gian_tong_quan.jpg"
              alt="Không gian Chín Hầm"
              className="h-36 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 flex flex-col justify-end">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                {selectedTrack?.category || 'Audio Guide'}
              </div>
              <h2 className="mt-1 text-2xl font-bold text-[#fef08a] font-display">{selectedTrack?.title || 'Chưa chọn track'}</h2>
            </div>
          </div>

          <div className="space-y-5 text-stone-200">
            <p className="text-sm leading-relaxed text-stone-300">{selectedTrack?.description}</p>
            <div className="rounded-2xl border border-emerald-500/20 bg-black/[0.05] p-5 backdrop-blur-[3px]">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-stone-400">Thời lượng ghi âm</span>
                <span className="font-bold text-[#fef08a]">{selectedTrack?.duration || '--:--'}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/40">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-pulse" />
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-white/5 p-4 text-xs font-medium text-emerald-300 leading-relaxed backdrop-blur-[3px] shadow-sm">
              💡 Gợi ý: Hãy đeo tai nghe để cảm nhận hiệu ứng âm thanh không gian 3D binaural kết hợp cùng cảnh quan đồi Ba Đồn.
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
