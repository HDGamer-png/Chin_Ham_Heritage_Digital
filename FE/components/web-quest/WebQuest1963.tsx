'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Compass,
  KeyRound,
  Radio,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Shield,
  Layers,
  ChevronUp,
  ChevronDown,
  Lightbulb,
} from 'lucide-react';
import {
  QUEST_STAGES,
  STAGE_3_MORSE,
  TIMELINE_EVENTS,
  TimelineEvent,
} from './quest-data';
import { CertificateGenerator } from './CertificateGenerator';

export function WebQuest1963() {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [completedDate, setCompletedDate] = useState<Date>(new Date());

  // Web Audio Context for synthesized sound FX (0 VND)
  const playSound = useCallback(
    (type: 'tap' | 'correct' | 'wrong' | 'victory' | 'click') => {
      if (!soundEnabled) return;
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        if (type === 'tap') {
          // Low hollow stone knock sound
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(140, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
        } else if (type === 'correct') {
          // Bright ascending triad chime
          const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
            gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.08);
            osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
          });
        } else if (type === 'wrong') {
          // Low buzzing error tone
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(160, ctx.currentTime);
          osc.frequency.setValueAtTime(130, ctx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } else if (type === 'victory') {
          // Fanfare chords
          const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51];
          chord.forEach((freq) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.09, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1.2);
          });
        } else {
          // Crisp UI click
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
        }
      } catch {
        // Fallback if audio policy muted
      }
    },
    [soundEnabled]
  );

  // Timer loop
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  // =========================================================================
  // STAGE 1: TỌA ĐỘ BẢN ĐỒ BA ĐỒN (Grid Radar Scout)
  // =========================================================================
  const [selectedBunker, setSelectedBunker] = useState<number | null>(null);
  const [stage1Error, setStage1Error] = useState<string | null>(null);

  const bunkerGrid = [
    { id: 1, name: 'Hầm 1', detail: 'Hầm ngầm kho đạn phía Bắc', isTarget: false },
    { id: 2, name: 'Hầm 2', detail: 'Khu giam giữ phạm nhân nữ', isTarget: false },
    { id: 3, name: 'Hầm 3', detail: 'Hầm kho đạn trung tâm', isTarget: false },
    { id: 4, name: 'Hầm 4', detail: 'Hầm chứa vật tư quân sự', isTarget: false },
    { id: 5, name: 'Hầm 5', detail: 'Khu biệt giam phía Đông', isTarget: false },
    { id: 6, name: 'Hầm 6', detail: 'Hầm giam cán bộ khu Ba', isTarget: false },
    { id: 7, name: 'Hầm 7', detail: 'Hầm ngầm kho đạn vách đá', isTarget: false },
    {
      id: 8,
      name: 'Hầm 8',
      detail: 'Hầm biệt giam tàn bạo nhất (14 chuồng cọp sắt kiên cố trên dốc)',
      isTarget: true,
    },
    { id: 9, name: 'Hầm 9', detail: 'Hầm kho đạn sườn đồi phía Nam', isTarget: false },
  ];

  const handleSelectBunker = (bunker: (typeof bunkerGrid)[0]) => {
    setSelectedBunker(bunker.id);
    if (bunker.isTarget) {
      playSound('correct');
      setStage1Error(null);
      setScore((s) => s + 25);
      setTimeout(() => {
        setCurrentStage(2);
        setShowHint(false);
      }, 900);
    } else {
      playSound('wrong');
      setStage1Error(
        `Chưa chính xác! ${bunker.name} là ${bunker.detail}. Hãy tìm căn hầm xây dựng 14 chuồng cọp sắt tàn bạo nhất trên đỉnh dốc.`
      );
    }
  };

  // =========================================================================
  // STAGE 2: KÝ ỨC RÃNH KHẮC NHÔM (Comb Inscription Code)
  // =========================================================================
  const [combCodeInput, setCombCodeInput] = useState<string>('');
  const [stage2Error, setStage2Error] = useState<string | null>(null);

  const handleVerifyCombCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (combCodeInput.trim() === '1963') {
      playSound('correct');
      setStage2Error(null);
      setScore((s) => s + 25);
      setTimeout(() => {
        setCurrentStage(3);
        setShowHint(false);
      }, 800);
    } else {
      playSound('wrong');
      setStage2Error('Mật mã chưa đúng! Gợi ý: Đây là năm lịch sử mà Chín Hầm được giải phóng.');
    }
  };

  // =========================================================================
  // STAGE 3: NHỊP GÕ QUA TƯỜNG ĐÁ (Morse Tap Code)
  // =========================================================================
  const [isPlayingMorse, setIsPlayingMorse] = useState<boolean>(false);
  const [selectedMorseAnswer, setSelectedMorseAnswer] = useState<string | null>(null);
  const [stage3Error, setStage3Error] = useState<string | null>(null);

  const morseOptions = [
    { label: 'TỰ DO', isCorrect: true },
    { label: 'CHIẾN THẮNG', isCorrect: false },
    { label: 'ĐỒNG CHÍ', isCorrect: false },
    { label: 'KIÊN TRUNG', isCorrect: false },
  ];

  const playMorseSequence = () => {
    if (isPlayingMorse) return;
    setIsPlayingMorse(true);

    let cumulativeDelay = 0;
    STAGE_3_MORSE.audioBeeps.forEach(({ duration, pause }) => {
      if (duration > 0) {
        setTimeout(() => {
          playSound('tap');
        }, cumulativeDelay);
      }
      cumulativeDelay += duration + pause;
    });

    setTimeout(() => {
      setIsPlayingMorse(false);
    }, cumulativeDelay + 200);
  };

  const handleSelectMorse = (option: (typeof morseOptions)[0]) => {
    setSelectedMorseAnswer(option.label);
    if (option.isCorrect) {
      playSound('correct');
      setStage3Error(null);
      setScore((s) => s + 25);
      setTimeout(() => {
        setCurrentStage(4);
        setShowHint(false);
      }, 900);
    } else {
      playSound('wrong');
      setStage3Error(
        `Từ "${option.label}" chưa khớp với nhịp gõ '- ..- / -.. ---' (-: T, ..-: Ư, -..: Đ, ---: O). Hãy thử lại!`
      );
    }
  };

  // =========================================================================
  // STAGE 4: THỜI KHẮC PHÁ NGỤC 02/11/1963 (Timeline Sequence)
  // =========================================================================
  const [timelineOrder, setTimelineOrder] = useState<TimelineEvent[]>([
    TIMELINE_EVENTS[2],
    TIMELINE_EVENTS[0],
    TIMELINE_EVENTS[3],
    TIMELINE_EVENTS[1],
  ]);
  const [stage4Error, setStage4Error] = useState<string | null>(null);
  const [stage4Success, setStage4Success] = useState<boolean>(false);

  const moveTimelineItem = (index: number, direction: 'up' | 'down') => {
    playSound('click');
    const newItems = [...timelineOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setTimelineOrder(newItems);
  };

  const handleVerifyTimeline = () => {
    const isCorrect = timelineOrder.every((item, idx) => item.correctIndex === idx);
    if (isCorrect) {
      playSound('victory');
      setStage4Error(null);
      setStage4Success(true);
      setScore((s) => s + 25);
      setCompletedDate(new Date());
      setTimeout(() => {
        setIsCompleted(true);
      }, 1200);
    } else {
      playSound('wrong');
      setStage4Error(
        'Thứ tự các sự kiện chưa hoàn toàn chính xác. Hãy nhớ diễn biến từ đảo chính Sài Gòn (01/11) đến cuộc giải phóng mở toang 9 hầm (chiều 02/11).'
      );
    }
  };

  // Format mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const restartQuest = () => {
    setCurrentStage(1);
    setScore(0);
    setElapsedTime(0);
    setIsCompleted(false);
    setSelectedBunker(null);
    setCombCodeInput('');
    setSelectedMorseAnswer(null);
    setStage4Success(false);
    setShowHint(false);
    setTimelineOrder([
      TIMELINE_EVENTS[2],
      TIMELINE_EVENTS[0],
      TIMELINE_EVENTS[3],
      TIMELINE_EVENTS[1],
    ]);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8">
      {/* Background ambient accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-red-950/15 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-950/20 blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Control Bar: HUD */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] shadow-xl">
          <div className="flex items-center gap-3">
            <img
              src="/Logo CH1.png"
              alt="Logo Chín Hầm"
              className="w-10 h-10 object-contain rounded-xl border border-white/10 bg-black/30 p-1 shadow-md backdrop-blur-[3px]"
            />
            <div>
              <div className="text-xs uppercase tracking-widest text-red-400 font-semibold">
                Web-Quest Lịch Sử Tương Tác
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-stone-100 font-display">
                Giải Mã Ký Ức 1963
              </h1>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-4 sm:gap-6 text-sm">
            <div className="flex items-center gap-2 text-stone-300">
              <Clock size={16} className="text-amber-400" />
              <span className="font-mono text-base font-semibold text-amber-300">
                {formatTime(elapsedTime)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-stone-300">
              <Sparkles size={16} className="text-emerald-400" />
              <span>Điểm:</span>
              <span className="font-mono text-base font-bold text-emerald-400">
                {score}/100
              </span>
            </div>

            <button
              onClick={() => setSoundEnabled((v) => !v)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-stone-300 transition backdrop-blur-[3px]"
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-400" />}
            </button>

            <button
              onClick={restartQuest}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-stone-300 transition backdrop-blur-[3px]"
              title="Chơi lại từ đầu"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Quest Stepper Progress */}
        {!isCompleted && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {QUEST_STAGES.map((stg) => {
              const isActive = currentStage === stg.id;
              const isPast = currentStage > stg.id;

              return (
                <div
                  key={stg.id}
                  className={`relative p-3.5 rounded-2xl border transition-all duration-300 backdrop-blur-[3px] ${
                    isActive
                      ? 'border-amber-500 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/50'
                      : isPast
                      ? 'border-emerald-500/40 bg-black/[0.08]'
                      : 'border-white/5 bg-black/[0.04] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {isPast ? (
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    ) : (
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isActive
                            ? 'bg-amber-500 text-stone-950'
                            : 'bg-stone-850 text-stone-400'
                        }`}
                      >
                        {stg.id}
                      </span>
                    )}
                    <span
                      className={`text-xs font-bold uppercase tracking-wider truncate ${
                        isActive
                          ? 'text-amber-300'
                          : isPast
                          ? 'text-emerald-300'
                          : 'text-stone-400'
                      }`}
                    >
                      Trạm {stg.id}
                    </span>
                  </div>
                  <div className="text-xs text-stone-300 font-medium truncate">
                    {stg.title.split(': ')[1]}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================================================================= */}
        {/* COMPLETED VIEW: CERTIFICATE OF HONOR */}
        {/* ================================================================= */}
        {isCompleted ? (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold backdrop-blur-[3px]">
                <CheckCircle2 size={18} />
                Hoàn Thành Toàn Bộ 4 Trạm Giải Mã
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-stone-100 font-display drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Khải Hoàn Ký Ức Ba Đồn
              </h2>
              <p className="text-stone-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Bạn đã giải mã thành công tọa độ Hầm 8, tìm thấy mật mã lịch sử 1963, giải đáp nhịp gõ Morse và tái hiện ngày mở toang cánh cửa sắt Chín Hầm.
              </p>
            </div>

            {/* Canvas Certificate Generator Component */}
            <CertificateGenerator
              score={score}
              timeSpentSeconds={elapsedTime}
              completedAt={completedDate}
            />

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/hien-vat-3d"
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-stone-200 text-sm font-semibold flex items-center gap-2 transition backdrop-blur-[3px]"
              >
                Khám phá Showroom Hiện Vật 3D
              </Link>
              <button
                onClick={restartQuest}
                className="px-6 py-3 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-sm font-semibold flex items-center gap-2 transition backdrop-blur-[3px]"
              >
                <RotateCcw size={16} /> Thử thách lại lần nữa
              </button>
            </div>
          </div>
        ) : (
          /* =============================================================== */
          /* ACTIVE STAGE CARD */
          /* =============================================================== */
          <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] p-6 sm:p-10 shadow-2xl backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] space-y-8">
            {/* Stage Header & Context */}
            <div className="space-y-4 border-b border-emerald-500/15 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider backdrop-blur-[3px]">
                  <Shield size={14} /> Thử Thách {currentStage}/4
                </div>
                <button
                  onClick={() => setShowHint((h) => !h)}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition underline underline-offset-4"
                >
                  <Lightbulb size={14} />
                  {showHint ? 'Ẩn manh mối' : 'Xem manh mối lịch sử'}
                </button>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-display">
                  {QUEST_STAGES[currentStage - 1].title}
                </h2>
                <p className="text-amber-300/90 text-sm font-medium mt-1">
                  {QUEST_STAGES[currentStage - 1].subtitle}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/[0.05] border border-emerald-500/20 text-stone-300 text-sm leading-relaxed backdrop-blur-[3px]">
                <span className="text-amber-400 font-semibold">Tư liệu lịch sử: </span>
                {QUEST_STAGES[currentStage - 1].historicalContext}
              </div>

              {showHint && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn backdrop-blur-[3px]">
                  <HelpCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Manh mối trinh sát: </span>
                    {QUEST_STAGES[currentStage - 1].hint}
                  </div>
                </div>
              )}
            </div>

            {/* STAGE 1 CONTENT: SA BÀN ĐỊNH VỊ HẦM 8 */}
            {currentStage === 1 && (
              <div className="space-y-6">
                <div className="text-sm text-stone-300">
                  Chọn căn hầm trên sa bàn sườn đồi Ba Đồn tương ứng với căn cứ biệt giam 14 chuồng cọp sắt:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {bunkerGrid.map((bunker) => {
                    const isSelected = selectedBunker === bunker.id;
                    return (
                      <button
                        key={bunker.id}
                        onClick={() => handleSelectBunker(bunker)}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group backdrop-blur-[3px] ${
                          isSelected && bunker.isTarget
                            ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500'
                            : isSelected && !bunker.isTarget
                            ? 'border-red-500 bg-red-950/30'
                            : 'border-emerald-500/20 bg-black/[0.05] hover:border-amber-500/60 hover:bg-black/[0.15]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-base text-stone-100 group-hover:text-amber-300 transition">
                            {bunker.name}
                          </span>
                          <Compass size={16} className="text-stone-500 group-hover:text-amber-400 transition" />
                        </div>
                        <p className="text-xs text-stone-400 leading-snug line-clamp-2">
                          {bunker.detail}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {stage1Error && (
                  <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-400 shrink-0" />
                    <span>{stage1Error}</span>
                  </div>
                )}
              </div>
            )}

            {/* STAGE 2 CONTENT: MẬT MÃ KHẮC LƯỢC NHÔM */}
            {currentStage === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="p-5 rounded-2xl bg-black/[0.05] border border-amber-500/30 space-y-4 backdrop-blur-[3px]">
                    <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
                      <Layers size={14} /> Di vật: Chiếc lược nhôm khắc chim bồ câu
                    </div>
                    <p className="text-stone-300 text-sm leading-relaxed">
                      Trên sống lược nhôm của người tù Chín Hầm, bên cạnh hình chim bồ câu ngậm cành thùy dương, có một dãy 4 chữ số được cào khắc bí mật bằng mũi đinh sắt.
                    </p>
                    <div className="p-3 rounded-xl bg-black/[0.15] border border-white/10 text-xs text-stone-400">
                      💡 Mật mã này là mốc năm lật đổ chế độ gia đình họ Ngô và mở toang địa ngục Chín Hầm.
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/hien-vat-3d"
                        target="_blank"
                        className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-4 flex items-center gap-1"
                      >
                        Mở Showroom 3D để soi cận cảnh rãnh khắc ↗
                      </Link>
                    </div>
                  </div>

                  <form onSubmit={handleVerifyCombCode} className="space-y-4">
                    <label className="block text-sm font-medium text-stone-200">
                      Nhập mật mã 4 chữ số bí mật:
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        maxLength={4}
                        value={combCodeInput}
                        onChange={(e) => setCombCodeInput(e.target.value)}
                        placeholder="VD: 19xx"
                        className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/20 text-center font-mono text-2xl tracking-[0.4em] text-amber-300 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold backdrop-blur-[3px]"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shrink-0 transition shadow-lg shadow-amber-500/20"
                      >
                        Giải Mã
                      </button>
                    </div>

                    {stage2Error && (
                      <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                        <AlertCircle size={15} className="text-red-400 shrink-0" />
                        <span>{stage2Error}</span>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

            {/* STAGE 3 CONTENT: NHỊP GÕ MOÓC-XƠ QUA TƯỜNG ĐÁ */}
            {currentStage === 3 && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-black/[0.05] border border-white/10 space-y-4 backdrop-blur-[3px]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
                      <Radio size={15} /> Tín hiệu Morse gõ vách xà lim
                    </div>
                    <button
                      onClick={playMorseSequence}
                      disabled={isPlayingMorse}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-stone-950 text-xs font-bold flex items-center gap-2 transition shadow-md shadow-amber-500/20"
                    >
                      <Volume2 size={15} />
                      {isPlayingMorse ? 'Đang truyền tín hiệu...' : 'Nghe tiếng gõ đá'}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-amber-500/30 text-center space-y-2 backdrop-blur-[3px]">
                    <div className="text-xs text-stone-400">Chuỗi tín hiệu vách đá:</div>
                    <div className="font-mono text-xl sm:text-2xl font-bold text-amber-300 tracking-[0.3em]">
                      {STAGE_3_MORSE.morsePattern}
                    </div>
                    <div className="text-xs text-stone-500">
                      Gợi ý bảng mã: - (T) ..- (Ư) / -.. (Đ) --- (O)
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-stone-200">
                    Chọn thông điệp người tù muốn gửi gắm qua vách đá:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {morseOptions.map((opt) => {
                      const isChosen = selectedMorseAnswer === opt.label;
                      return (
                        <button
                          key={opt.label}
                          onClick={() => handleSelectMorse(opt)}
                          className={`p-4 rounded-xl border text-center font-bold text-base transition-all duration-200 backdrop-blur-[3px] ${
                            isChosen && opt.isCorrect
                              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-2 ring-emerald-500'
                              : isChosen && !opt.isCorrect
                              ? 'border-red-500 bg-red-950/30 text-red-200'
                              : 'border-emerald-500/20 bg-black/[0.05] hover:border-amber-500/60 hover:bg-black/[0.15] text-stone-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {stage3Error && (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle size={15} className="text-red-400 shrink-0" />
                      <span>{stage3Error}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STAGE 4 CONTENT: THỜI KHẮC PHÁ NGỤC (Timeline Sort) */}
            {currentStage === 4 && (
              <div className="space-y-6">
                <div className="text-sm text-stone-300">
                  Dùng nút mũi tên <span className="font-bold text-amber-300">▲</span> và <span className="font-bold text-amber-300">▼</span> để sắp xếp 4 sự kiện lịch sử theo đúng trình tự thời gian ngày giải phóng Chín Hầm:
                </div>

                <div className="space-y-3">
                  {timelineOrder.map((ev, idx) => (
                    <div
                      key={ev.id}
                      className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-black/[0.05] border border-emerald-500/20 backdrop-blur-[3px] transition hover:border-emerald-500/40 hover:bg-black/[0.15]"
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-amber-300 text-sm shrink-0">
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-amber-400 font-mono font-semibold">
                            {ev.timeLabel}
                          </span>
                          <span className="text-sm font-bold text-stone-100 truncate">
                            {ev.title}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                          {ev.detail}
                        </p>
                      </div>

                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveTimelineItem(idx, 'up')}
                          className="p-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-200 transition"
                          title="Di chuyển lên"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          disabled={idx === timelineOrder.length - 1}
                          onClick={() => moveTimelineItem(idx, 'down')}
                          className="p-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-200 transition"
                          title="Di chuyển xuống"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {stage4Error && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="text-red-400 shrink-0" />
                    <span>{stage4Error}</span>
                  </div>
                )}

                <div className="text-center pt-2">
                  <button
                    onClick={handleVerifyTimeline}
                    disabled={stage4Success}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-base shadow-lg shadow-red-900/40 transition hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Xác Nhận Dòng Thời Gian & Mở Cửa Ngục
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
