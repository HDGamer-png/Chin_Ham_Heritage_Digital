"use client";

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Headphones } from 'lucide-react';

type AudioTrack = {
  id: string;
  title: string;
  duration: string;
  category: string;
  description: string;
  fileUrl?: string;
};

export default function AudioGuidePage() {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Đồng bộ nguồn phát khi đổi bài
  useEffect(() => {
    if (!audioRef.current || !selectedTrack) return;
    const audio = audioRef.current;
    
    // Đặt lại thời gian
    setCurrentTime(0);
    audio.currentTime = 0;
    
    if (selectedTrack.fileUrl) {
      audio.src = selectedTrack.fileUrl;
      audio.load();
      if (isPlaying) {
        audio.play().catch((err) => {
          console.warn('Playback prevented or interrupted:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [selectedTrack?.id]);

  const togglePlay = () => {
    if (!audioRef.current || !selectedTrack?.fileUrl) return;
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
        setIsPlaying(false);
      });
    }
  };

  const handleTrackClick = (track: AudioTrack) => {
    if (selectedTrack?.id === track.id) {
      togglePlay();
    } else {
      setSelectedTrackId(track.id);
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, Math.min(duration || 9999, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <main className="container-shell py-16">
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

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
        {/* Danh sách các bài thuyết minh */}
        <div className="space-y-4">
          {tracks.map((item) => {
            const isCurrent = selectedTrack?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTrackClick(item)}
                className={`flex w-full items-center justify-between rounded-2xl border p-6 text-left backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-all duration-300 ${
                  isCurrent
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
                  
                  {/* Equalizer animation khi đang phát */}
                  {isCurrent && isPlaying ? (
                    <div className="flex items-end gap-1 h-3.5">
                      <span className="w-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : null}

                  <span
                    className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      isCurrent && isPlaying
                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/40'
                        : isCurrent
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                        : 'border border-emerald-500/30 bg-white/5 backdrop-blur-[3px] text-emerald-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-400'
                    }`}
                  >
                    {isCurrent && isPlaying ? 'Đang phát ♫' : isCurrent ? 'Tạm dừng ⏸' : 'Nghe ngay ▶'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bảng điều khiển Player chi tiết bên phải */}
        <aside className="rounded-[2.5rem] border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] p-7 backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] shadow-2xl h-fit">
          <div className="relative mb-6 overflow-hidden rounded-2xl border border-emerald-500/20 shadow-inner">
            <img
              src="/khong_gian_tong_quan.jpg"
              alt="Không gian Chín Hầm"
              className="h-36 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 flex flex-col justify-end">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
                <Headphones size={13} />
                <span>{selectedTrack?.category || 'Audio Guide'}</span>
              </div>
              <h2 className="mt-1 text-2xl font-bold text-[#fef08a] font-display">{selectedTrack?.title || 'Chưa chọn track'}</h2>
            </div>
          </div>

          <div className="space-y-5 text-stone-200">
            <p className="text-sm leading-relaxed text-stone-300">{selectedTrack?.description}</p>
            
            {/* Bộ điều khiển Player gọn gàng */}
            <div className="rounded-2xl border border-emerald-500/20 bg-black/[0.20] p-3.5 backdrop-blur-md shadow-inner space-y-2.5">
              {/* Thanh kéo thời gian (Seek Bar) */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.5}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 rounded-full bg-stone-700/60 accent-emerald-400 cursor-pointer transition hover:bg-stone-600"
                />
                <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{duration ? formatTime(duration) : selectedTrack?.duration || '00:00'}</span>
                </div>
              </div>

              {/* Nút bấm điều khiển (Play, Pause, Tua 10s) */}
              <div className="flex items-center justify-center gap-3.5">
                <button
                  type="button"
                  onClick={() => handleSkip(-10)}
                  title="Lùi lại 10 giây"
                  className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition"
                >
                  <RotateCcw size={16} />
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  title={isPlaying ? "Tạm dừng" : "Phát âm thanh"}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-black shadow-lg shadow-emerald-500/25 hover:scale-105 hover:from-emerald-300 hover:to-teal-400 transition active:scale-95"
                >
                  {isPlaying ? (
                    <Pause size={20} className="fill-black" />
                  ) : (
                    <Play size={20} className="fill-black translate-x-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSkip(10)}
                  title="Tua tới 10 giây"
                  className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition"
                >
                  <RotateCw size={16} />
                </button>
              </div>

              {/* Âm lượng & Mute */}
              <div className="flex items-center justify-center gap-2 border-t border-emerald-500/10 pt-2 text-xs text-stone-400">
                <button
                  type="button"
                  onClick={toggleMute}
                  title={isMuted ? "Bật âm" : "Tắt âm"}
                  className="hover:text-emerald-300 transition p-1"
                >
                  {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-28 h-1 rounded-full bg-stone-700/60 accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-white/5 p-4 text-xs font-medium text-emerald-300 leading-relaxed backdrop-blur-[3px] shadow-sm flex items-start gap-2.5">
              <span className="text-base">🎧</span>
              <span>Gợi ý: Hãy đeo tai nghe để cảm nhận trọn vẹn hiệu ứng âm thanh không gian 3D binaural kết hợp cùng cảnh quan thực địa Chín Hầm.</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
