'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy,
  Flame,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  GraduationCap,
  FileText,
  ChevronRight,
  School,
  Award,
  Zap,
  Lock,
  Unlock,
  ArrowLeft,
  Star,
  BookOpen,
} from 'lucide-react';
import { QUIZ_SETS, QuizSet, QuizQuestion } from './challenge-sets-data';
import { INITIAL_SCHOOL_RANKINGS, SchoolRanking } from './challenge-data';
import { PrintableWorksheet } from './PrintableWorksheet';
import { QuizCertificate } from './QuizCertificate';

interface ShuffledQuizQuestion extends QuizQuestion {
  shuffledOptions: string[];
  shuffledCorrectIndex: number;
}

// Fisher-Yates shuffle helper
const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Build randomized questions for a specific set
const prepareSetQuestions = (set: QuizSet): ShuffledQuizQuestion[] => {
  const shuffledQuestions = shuffleArray(set.questions);
  return shuffledQuestions.map((q) => {
    const correctOptionText = q.options[q.correctAnswer];
    const shuffledOptions = shuffleArray(q.options);
    const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);
    return {
      ...q,
      shuffledOptions,
      shuffledCorrectIndex: newCorrectIndex,
    };
  });
};

export function HistoryChallengeQuiz() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'leaderboard' | 'worksheet' | 'certificate'>('quiz');
  const [quizMode, setQuizMode] = useState<'board' | 'playing' | 'result'>('board');

  // Progression States across 10 Sets
  const [unlockedSets, setUnlockedSets] = useState<number[]>([1]);
  const [setScores, setSetScores] = useState<Record<number, number>>({});
  const [activeSetId, setActiveSetId] = useState<number>(1);

  // Active playing quiz states
  const [currentQuestions, setCurrentQuestions] = useState<ShuffledQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [roundScore, setRoundScore] = useState<number>(0); // Points
  const [roundCorrectCount, setRoundCorrectCount] = useState<number>(0); // Number of correct out of 10
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [timerActive, setTimerActive] = useState<boolean>(true);

  // School Leaderboard States
  const [rankings, setRankings] = useState<SchoolRanking[]>(INITIAL_SCHOOL_RANKINGS);
  const [userSchool, setUserSchool] = useState<string>('THPT Chuyên Quốc Học Huế');
  const [hasContributed, setHasContributed] = useState<boolean>(false);

  // Audio Synthesizer (0 VND)
  const playSfx = useCallback((type: 'correct' | 'wrong' | 'streak' | 'unlock' | 'finish') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'correct') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'streak') {
        [659.25, 880, 1174.66].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.06);
          gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.06);
          osc.stop(ctx.currentTime + i * 0.06 + 0.3);
        });
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.setValueAtTime(140, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'unlock') {
        // Triumphant rising arpeggio
        [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.08);
          osc.stop(ctx.currentTime + i * 0.08 + 0.35);
        });
      } else if (type === 'finish') {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
          gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + i * 0.1 + 0.4);
        });
      }
    } catch {
      // Audio suppression fallback
    }
  }, []);

  // Restore persistence on client mount
  useEffect(() => {
    try {
      const savedUnlocked = localStorage.getItem('chin_ham_quiz_unlocked_sets');
      if (savedUnlocked) {
        const parsed = JSON.parse(savedUnlocked);
        if (Array.isArray(parsed) && parsed.length > 0) setUnlockedSets(parsed);
      }
      const savedScores = localStorage.getItem('chin_ham_quiz_set_scores');
      if (savedScores) {
        const parsed = JSON.parse(savedScores);
        if (typeof parsed === 'object') setSetScores(parsed);
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  // Compute total correct questions across all 10 sets
  const totalCorrectQuestions = Object.values(setScores).reduce((a, b) => a + b, 0);
  const isEligibleForCertificate = totalCorrectQuestions >= 91 && unlockedSets.length === 10;

  // Start playing a specific set
  const startQuizSet = (setId: number) => {
    const targetSet = QUIZ_SETS.find((s) => s.id === setId) || QUIZ_SETS[0];
    const randomized = prepareSetQuestions(targetSet);
    setActiveSetId(setId);
    setCurrentQuestions(randomized);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setRoundScore(0);
    setRoundCorrectCount(0);
    setStreak(0);
    setHighestStreak(0);
    setTimeLeft(targetSet.timePerQuestion || 20);
    setTimerActive(true);
    setQuizMode('playing');
  };

  // Countdown timer per question
  useEffect(() => {
    if (quizMode !== 'playing' || isAnswered || !timerActive || activeTab !== 'quiz') return;
    if (timeLeft <= 0) {
      setIsAnswered(true);
      setSelectedOption(-1);
      setStreak(0);
      playSfx('wrong');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [quizMode, timeLeft, isAnswered, timerActive, activeTab, playSfx]);

  const currentQ = currentQuestions[currentIndex];

  const handleSelectAnswer = (optionIndex: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentQ.shuffledCorrectIndex;
    if (isCorrect) {
      const streakBonus = streak >= 2 ? (streak >= 4 ? 5 : 3) : 0;
      const speedBonus = timeLeft > 10 ? 2 : 0;
      setRoundScore((s) => s + 10 + streakBonus + speedBonus);
      setRoundCorrectCount((c) => c + 1);

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);

      if (newStreak >= 3) {
        playSfx('streak');
      } else {
        playSfx('correct');
      }
    } else {
      setStreak(0);
      playSfx('wrong');
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      const targetSet = QUIZ_SETS.find((s) => s.id === activeSetId) || QUIZ_SETS[0];
      setTimeLeft(targetSet.timePerQuestion || 20);
    } else {
      // Finished all 10 questions of current set!
      finishCurrentSet();
    }
  };

  const finishCurrentSet = () => {
    const finalCorrect = Math.min(10, roundCorrectCount);
    
    // Update best score for this set
    const currentBest = setScores[activeSetId] || 0;
    const newBest = Math.max(currentBest, finalCorrect);
    const updatedScores = { ...setScores, [activeSetId]: newBest };
    setSetScores(updatedScores);

    // Check unlock condition (>= 9/10)
    let updatedUnlocked = [...unlockedSets];
    if (finalCorrect >= 9 && activeSetId < 10) {
      const nextSetId = activeSetId + 1;
      if (!updatedUnlocked.includes(nextSetId)) {
        updatedUnlocked.push(nextSetId);
        setUnlockedSets(updatedUnlocked);
        playSfx('unlock');
      } else {
        playSfx('finish');
      }
    } else {
      playSfx('finish');
    }

    // Persist progression to localStorage
    try {
      localStorage.setItem('chin_ham_quiz_set_scores', JSON.stringify(updatedScores));
      localStorage.setItem('chin_ham_quiz_unlocked_sets', JSON.stringify(updatedUnlocked));
    } catch {
      // Ignore localStorage errors
    }

    setQuizMode('result');
  };

  // Contribute score to school
  const handleContributeScore = () => {
    if (hasContributed) return;
    setRankings((prev) =>
      prev.map((r) => {
        if (r.schoolName === userSchool) {
          const totalPoints = r.participants * r.avgScore + totalCorrectQuestions;
          const newParticipants = r.participants + 1;
          const newAvg = parseFloat((totalPoints / newParticipants).toFixed(1));
          return {
            ...r,
            participants: newParticipants,
            avgScore: newAvg,
          };
        }
        return r;
      })
    );
    setHasContributed(true);
  };

  const activeSetInfo = QUIZ_SETS.find((s) => s.id === activeSetId) || QUIZ_SETS[0];

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8">
      {/* Background ambient accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-emerald-950/15 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-amber-950/20 blur-[110px]" />
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Tabs Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold shadow-md">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                Góc Học Đường & Di Tích Lịch Sử
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-stone-100 font-display">
                Đấu Trí Ba Đồn (10 Bộ Đề • 100 Câu Hỏi)
              </h1>
            </div>
          </div>

          {/* Tab Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900 border border-white/10 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => {
                setActiveTab('quiz');
                setQuizMode('board');
              }}
              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Zap size={15} /> 10 Bộ Đề
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Trophy size={15} /> Bảng Vàng
            </button>
            <button
              onClick={() => setActiveTab('worksheet')}
              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'worksheet'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <FileText size={15} /> Phiếu Học Tập A4
            </button>
            <button
              onClick={() => setActiveTab('certificate')}
              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'certificate'
                  ? totalCorrectQuestions >= 91
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md font-bold'
                    : 'bg-stone-800 text-amber-300 font-bold border border-amber-500/40'
                  : totalCorrectQuestions >= 91
                  ? 'text-amber-400 hover:text-amber-300 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Award size={15} />
              <span>Chứng Nhận</span>
              {totalCorrectQuestions < 91 && (
                <Lock size={12} className="text-stone-400" />
              )}
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: 10 BỘ ĐỀ ĐẤU TRÍ */}
        {/* ================================================================= */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            {/* MODE 1: BẢNG 10 BỘ ĐỀ (Level Selector Board) */}
            {quizMode === 'board' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Overall Progression HUD */}
                <div className="p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-stone-900/90 via-stone-900/60 to-black/80 backdrop-blur-2xl shadow-2xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                        <Sparkles size={14} /> Tiến Độ Chinh Phục Di Sản
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-display mt-0.5">
                        Lộ Trình 10 Cửa Ải Lịch Sử
                      </h2>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xs text-stone-400">Tổng điểm tích lũy</div>
                        <div className="font-mono text-2xl font-bold text-amber-300">
                          {totalCorrectQuestions} / 100 <span className="text-xs font-normal text-stone-400">câu</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-stone-400">Đã mở khóa</div>
                        <div className="font-mono text-2xl font-bold text-emerald-400">
                          {unlockedSets.length} / 10 <span className="text-xs font-normal text-stone-400">bộ</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar towards 91/100 Certification */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-300">
                        Quy định mở khóa: <strong className="text-amber-400">≥ 9/10 câu đúng</strong> ở bộ trước để mở bộ kế tiếp
                      </span>
                      <span className="text-amber-300 font-semibold">
                        Mục tiêu nhận Giấy Chứng Nhận: ≥ 91/100 câu đúng
                      </span>
                    </div>

                    <div className="relative w-full h-3 rounded-full bg-black/60 border border-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${Math.min(100, (totalCorrectQuestions / 100) * 100)}%` }}
                      />
                      {/* 91 milestone marker */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-red-500 shadow-glow"
                        style={{ left: '91%' }}
                        title="Mốc 91 câu đạt Giấy Chứng Nhận"
                      />
                    </div>
                  </div>

                  {totalCorrectQuestions >= 91 && (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between gap-3 text-amber-300 text-xs sm:text-sm animate-pulse">
                      <div className="flex items-center gap-2">
                        <Award size={20} className="text-amber-400 shrink-0" />
                        <span>
                          Chúc mừng! Bạn đã đạt <strong>{totalCorrectQuestions}/100 câu đúng</strong> và đủ điều kiện nhận Giấy Chứng Nhận Sử Gia!
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveTab('certificate')}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition shrink-0"
                      >
                        Nhận Chứng Nhận Ngay
                      </button>
                    </div>
                  )}
                </div>

                {/* 10 Sets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {QUIZ_SETS.map((qSet) => {
                    const isUnlocked = unlockedSets.includes(qSet.id);
                    const bestScore = setScores[qSet.id] ?? null;
                    const isPassed = bestScore !== null && bestScore >= 9;

                    return (
                      <div
                        key={qSet.id}
                        className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                          isUnlocked
                            ? 'border-white/10 bg-stone-900/85 hover:border-amber-500/50 hover:bg-stone-850 shadow-xl'
                            : 'border-white/5 bg-black/40 opacity-55'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                                  isPassed
                                    ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                                    : isUnlocked
                                    ? 'border-amber-500/40 bg-amber-950/40 text-amber-300'
                                    : 'border-white/10 bg-stone-800 text-stone-400'
                                }`}
                              >
                                Bộ {qSet.id} • 10 Câu
                              </span>

                              {/* Difficulty Badge */}
                              <span
                                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                                  qSet.difficultyLevel === 1
                                    ? 'border-sky-500/40 bg-sky-950/40 text-sky-300'
                                    : qSet.difficultyLevel === 2
                                    ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                                    : qSet.difficultyLevel === 3
                                    ? 'border-amber-500/40 bg-amber-950/40 text-amber-300'
                                    : qSet.difficultyLevel === 4
                                    ? 'border-orange-500/40 bg-orange-950/40 text-orange-300'
                                    : 'border-red-500/40 bg-red-950/40 text-red-300'
                                }`}
                              >
                                {'⭐'.repeat(qSet.difficultyLevel)} Cấp {qSet.difficultyLevel}: {qSet.difficultyLabel}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-stone-300 bg-black/40 px-2 py-0.5 rounded border border-white/5 flex items-center gap-1">
                                <Clock size={11} className="text-amber-400" /> {qSet.timePerQuestion}s/câu
                              </span>
                              {bestScore !== null && (
                                <span className="font-mono text-xs font-bold text-stone-300 bg-black/50 px-2.5 py-1 rounded-lg border border-white/10">
                                  {isPassed ? (
                                    <span className="text-emerald-400">Đạt: {bestScore}/10</span>
                                  ) : (
                                    <span className="text-amber-400">Điểm: {bestScore}/10</span>
                                  )}
                                </span>
                              )}
                              {isUnlocked ? (
                                <Unlock size={16} className="text-emerald-400" />
                              ) : (
                                <Lock size={16} className="text-stone-500" />
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-stone-100 font-display">
                              {qSet.title}
                            </h3>
                            <p className="text-xs text-stone-400 mt-0.5">
                              {qSet.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between gap-3">
                          <div className="text-[11px] text-stone-400">
                            {isUnlocked ? (
                              isPassed ? (
                                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                                  <CheckCircle2 size={13} /> Đã hoàn thành 10 câu (Đạt {bestScore}/10 - Mở khóa Bộ {qSet.id < 10 ? qSet.id + 1 : 10})
                                </span>
                              ) : (
                                <span className="text-amber-400">
                                  Quy định: Làm đủ 10 câu ➔ Chấm đạt ≥ 9/10 để mở Bộ {qSet.id + 1}
                                </span>
                              )
                            ) : (
                              <span className="text-stone-500 flex items-center gap-1">
                                <Lock size={12} /> Cần hoàn thành 10 câu & đạt ≥ 9/10 ở Bộ {qSet.id - 1}
                              </span>
                            )}
                          </div>

                          <button
                            disabled={!isUnlocked}
                            onClick={() => startQuizSet(qSet.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                              isUnlocked
                                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md shadow-amber-500/20'
                                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                            }`}
                          >
                            <span>{bestScore !== null ? 'Thi Lại' : 'Bắt Đầu'}</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODE 2: ĐANG THI ĐẤU (Playing View) */}
            {quizMode === 'playing' && currentQ && (
              <div className="rounded-3xl border border-white/10 bg-stone-900/85 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6 animate-fadeIn">
                {/* HUD Subbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuizMode('board')}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
                      title="Quay lại danh sách 10 Bộ"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wider text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          Bộ {activeSetId} / 10
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                            activeSetInfo.difficultyLevel === 1
                              ? 'border-sky-500/40 bg-sky-950/40 text-sky-300'
                              : activeSetInfo.difficultyLevel === 2
                              ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                              : activeSetInfo.difficultyLevel === 3
                              ? 'border-amber-500/40 bg-amber-950/40 text-amber-300'
                              : activeSetInfo.difficultyLevel === 4
                              ? 'border-orange-500/40 bg-orange-950/40 text-orange-300'
                              : 'border-red-500/40 bg-red-950/40 text-red-300'
                          }`}
                        >
                          {'⭐'.repeat(activeSetInfo.difficultyLevel)} Cấp {activeSetInfo.difficultyLevel}: {activeSetInfo.difficultyLabel}
                        </span>
                      </div>
                      <div className="text-xs text-stone-300 font-medium mt-1">
                        Câu {currentIndex + 1} / 10 <span className="text-stone-400">(Cần làm đủ 10 câu mới nộp bài chấm điểm)</span>
                      </div>
                    </div>

                    {streak >= 2 && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-950/60 px-3 py-1 rounded-full border border-orange-500/40 animate-pulse">
                        <Flame size={14} className="text-orange-400" />
                        Streak x{streak}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-5 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock
                        size={16}
                        className={timeLeft <= 5 ? 'text-red-400 animate-bounce' : 'text-amber-400'}
                      />
                      <span
                        className={`font-mono text-base font-bold ${
                          timeLeft <= 5 ? 'text-red-400 font-extrabold' : 'text-stone-200'
                        }`}
                      >
                        {timeLeft}s
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Sparkles size={16} />
                      <span className="font-mono text-base">Đúng: {roundCorrectCount}/10</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / 10) * 100}%` }}
                  />
                </div>

                {/* Question Prompt */}
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-100 font-display leading-snug">
                    {currentQ.question}
                  </h2>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {currentQ.shuffledOptions.map((opt, oIdx) => {
                    const isSelected = selectedOption === oIdx;
                    const isCorrect = oIdx === currentQ.shuffledCorrectIndex;
                    let optionStyle =
                      'border-white/10 bg-black/40 hover:border-amber-500/50 hover:bg-stone-800/60 text-stone-200';

                    if (isAnswered) {
                      if (isCorrect) {
                        optionStyle =
                          'border-emerald-500 bg-emerald-950/60 text-emerald-200 ring-1 ring-emerald-500 font-semibold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle =
                          'border-red-500 bg-red-950/50 text-red-200 ring-1 ring-red-500';
                      } else {
                        optionStyle = 'border-white/5 bg-black/20 text-stone-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isAnswered}
                        onClick={() => handleSelectAnswer(oIdx)}
                        className={`w-full p-4 rounded-2xl border text-left text-sm sm:text-base transition-all duration-200 flex items-start gap-3.5 ${optionStyle}`}
                      >
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            isAnswered && isCorrect
                              ? 'bg-emerald-500 text-stone-950'
                              : isAnswered && isSelected && !isCorrect
                              ? 'bg-red-500 text-stone-950'
                              : 'bg-stone-800 text-stone-300'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="flex-1 leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Answer Feedback & Historical Explanation */}
                {isAnswered && (
                  <div className="space-y-4 pt-2 animate-fadeIn">
                    <div
                      className={`p-4 rounded-2xl border text-sm leading-relaxed ${
                        selectedOption === currentQ.shuffledCorrectIndex
                          ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
                          : 'border-red-500/40 bg-red-950/30 text-red-200'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-2 mb-1">
                        {selectedOption === currentQ.shuffledCorrectIndex ? (
                          <>
                            <CheckCircle2 size={18} className="text-emerald-400" />
                            <span>Chính xác!</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={18} className="text-red-400" />
                            <span>
                              {selectedOption === -1 ? 'Hết giờ trả lời!' : 'Chưa chính xác!'}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-stone-300">
                        <span className="font-semibold text-amber-300">Tư liệu lịch sử: </span>
                        {currentQ.historicalNote}
                      </p>
                    </div>

                    <div className="text-right">
                      <button
                        onClick={handleNextQuestion}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-amber-500/20 transition hover:scale-105 active:scale-95"
                      >
                        {currentIndex < currentQuestions.length - 1 ? (
                          <>
                            Câu tiếp theo ({currentIndex + 2}/10) <ChevronRight size={16} />
                          </>
                        ) : (
                          <>
                            Nộp Bài & Chấm Điểm Bộ {activeSetId} (10/10 Câu) <Trophy size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODE 3: KẾT QUẢ BỘ ĐỀ (Result & Unlock View) */}
            {quizMode === 'result' && (
              <div className="rounded-3xl border border-amber-500/30 bg-stone-900/90 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl text-center space-y-6 animate-fadeIn">
                <div
                  className={`w-20 h-20 mx-auto rounded-3xl border-2 flex items-center justify-center shadow-xl ${
                    roundCorrectCount >= 9
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-emerald-500/20'
                      : 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-amber-500/20'
                  }`}
                >
                  {roundCorrectCount >= 9 ? <Trophy size={40} /> : <RotateCcw size={36} />}
                </div>

                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                    Kết Quả Chấm Điểm: Bộ {activeSetId} ({activeSetInfo.title})
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 font-display">
                    {roundCorrectCount >= 9 ? '🎉 Đạt Chuẩn Mở Khóa!' : '⚠️ Chưa Đạt Chuẩn Mở Khóa'}
                  </h2>
                  <p className="text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
                    {roundCorrectCount >= 9
                      ? activeSetId < 10
                        ? `Sau khi hoàn thành đủ 10/10 câu và chấm điểm, bạn đã đạt ${roundCorrectCount}/10 câu đúng (đáp ứng tiêu chuẩn tối thiểu ≥ 9/10). Bộ ${activeSetId + 1} đã chính thức được mở khóa!`
                        : `Chúc mừng bạn đã xuất sắc hoàn thành trọn vẹn 10/10 Bộ Đề Đấu Trí Ba Đồn!`
                      : `Bạn đã hoàn thành đủ 10/10 câu, nhưng kết quả chấm điểm đạt ${roundCorrectCount}/10 câu đúng. Quy định yêu cầu phải đạt tối thiểu 9/10 câu đúng sau khi chấm điểm thì mới mở khóa được Bộ ${activeSetId + 1} (còn thiếu ${9 - roundCorrectCount} câu đúng nữa). Hãy làm lại để vượt ải!`}
                  </p>
                </div>

                {/* Next Set Difficulty Preview & Warning if passed */}
                {roundCorrectCount >= 9 && activeSetId < 10 && QUIZ_SETS[activeSetId] && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-stone-900 border border-emerald-500/30 max-w-lg mx-auto text-xs text-stone-200 space-y-1.5 shadow-lg">
                    <div className="font-bold text-emerald-400 flex items-center justify-center gap-1.5 text-sm">
                      <Sparkles size={16} /> Cảnh báo tăng cấp độ khó ở Bộ {activeSetId + 1}:
                    </div>
                    <p className="text-stone-300">
                      <strong>{QUIZ_SETS[activeSetId].title}</strong> — Độ khó sẽ nâng lên mức{' '}
                      <span className="text-amber-300 font-bold underline">
                        {'⭐'.repeat(QUIZ_SETS[activeSetId].difficultyLevel)} {QUIZ_SETS[activeSetId].difficultyLabel}
                      </span>.
                    </p>
                    <p className="text-stone-400">
                      Thời gian suy nghĩ mỗi câu được rút ngắn còn{' '}
                      <strong className="text-amber-400 font-mono">{QUIZ_SETS[activeSetId].timePerQuestion}s/câu</strong> (càng về sau thử thách lịch sử càng khốc liệt!).
                    </p>
                  </div>
                )}

                {/* Score badge summary */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10">
                    <div className="text-xs text-stone-400">Kết quả 10 câu</div>
                    <div className="font-mono text-2xl font-bold text-emerald-400 mt-1">
                      {roundCorrectCount} / 10
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10">
                    <div className="text-xs text-stone-400">Điểm số tính giờ</div>
                    <div className="font-mono text-2xl font-bold text-amber-300 mt-1">
                      {roundScore}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 col-span-2 sm:col-span-1">
                    <div className="text-xs text-stone-400">Tổng điểm 10 bộ</div>
                    <div className="font-mono text-2xl font-bold text-orange-400 mt-1">
                      {totalCorrectQuestions} / 100
                    </div>
                  </div>
                </div>

                {/* Special certificate callout if eligible */}
                {totalCorrectQuestions >= 91 && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 to-amber-950/60 border border-amber-500/50 max-w-md mx-auto space-y-2">
                    <div className="text-amber-300 font-bold text-sm flex items-center justify-center gap-2">
                      <Award size={18} /> Đủ Điều Kiện Cấp Giấy Chứng Nhận!
                    </div>
                    <p className="text-xs text-stone-300">
                      Tổng thành tích của bạn đã vượt mốc 91/100 ({totalCorrectQuestions}/100 câu đúng).
                    </p>
                    <button
                      onClick={() => setActiveTab('certificate')}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs shadow-md transition"
                    >
                      Mở Giấy Chứng Nhận Vinh Danh
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  {roundCorrectCount >= 9 && activeSetId < 10 && (
                    <button
                      onClick={() => startQuizSet(activeSetId + 1)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition hover:scale-105"
                    >
                      Tiến Vào Bộ {activeSetId + 1} (Cấp Độ Khó Hơn) <ChevronRight size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => startQuizSet(activeSetId)}
                    className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center gap-2 transition"
                  >
                    <RotateCcw size={15} /> Thử Thách Lại Bộ {activeSetId}
                  </button>
                  <button
                    onClick={() => setQuizMode('board')}
                    className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-200 text-sm font-semibold transition"
                  >
                    Về Bảng 10 Bộ Đề
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: BẢNG VÀNG TRƯỜNG HỌC */}
        {/* ================================================================= */}
        {activeTab === 'leaderboard' && (
          <div className="rounded-3xl border border-white/10 bg-stone-900/85 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                  Phong Trào Tìm Hiểu Lịch Sử
                </div>
                <h2 className="text-2xl font-bold text-stone-100 font-display">
                  Bảng Vàng Danh Dự Các Trường Học
                </h2>
              </div>
              <button
                onClick={() => {
                  setActiveTab('quiz');
                  setQuizMode('board');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition"
              >
                Chinh phục 10 Bộ Đề
              </button>
            </div>

            {/* Contribute points card */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <div className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <School size={15} /> Đóng góp điểm số ({totalCorrectQuestions}/100) cho trường của bạn:
              </div>
              <select
                value={userSchool}
                disabled={hasContributed}
                onChange={(e) => setUserSchool(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-white/20 text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {INITIAL_SCHOOL_RANKINGS.map((sch) => (
                  <option key={sch.schoolName} value={sch.schoolName}>
                    {sch.schoolName} ({sch.city})
                  </option>
                ))}
              </select>
              <button
                onClick={handleContributeScore}
                disabled={hasContributed}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-emerald-600 disabled:text-white text-stone-950 font-bold text-xs transition"
              >
                {hasContributed ? '✓ Đã đóng góp điểm thành công!' : 'Cộng điểm vào Bảng Vàng Trường Học'}
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-stone-300">
                <thead className="bg-black/50 text-xs uppercase tracking-wider text-amber-400 border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Hạng</th>
                    <th className="py-3 px-4">Trường Học</th>
                    <th className="py-3 px-4">Địa Phương</th>
                    <th className="py-3 px-4 text-center">Lượt thi</th>
                    <th className="py-3 px-4 text-right">Điểm TB</th>
                    <th className="py-3 px-4 text-center">Danh hiệu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rankings.map((sch) => (
                    <tr key={sch.schoolName} className="hover:bg-white/5 transition">
                      <td className="py-4 px-4 font-mono font-bold text-base">
                        {sch.rank === 1 ? (
                          <span className="text-amber-400">#1</span>
                        ) : sch.rank === 2 ? (
                          <span className="text-stone-300">#2</span>
                        ) : sch.rank === 3 ? (
                          <span className="text-amber-600">#3</span>
                        ) : (
                          `#${sch.rank}`
                        )}
                      </td>
                      <td className="py-4 px-4 font-bold text-stone-100">{sch.schoolName}</td>
                      <td className="py-4 px-4 text-stone-400">{sch.city}</td>
                      <td className="py-4 px-4 text-center font-mono">
                        {sch.participants.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-emerald-400 text-base">
                        {sch.avgScore}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
                          {sch.badge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: PHIẾU HỌC TẬP THỰC ĐỊA A4 */}
        {/* ================================================================= */}
        {activeTab === 'worksheet' && (
          <PrintableWorksheet onBack={() => setActiveTab('quiz')} />
        )}

        {/* ================================================================= */}
        {/* TAB 4: GIẤY CHỨNG NHẬN SỬ GIA TINH ANH (≥ 91/100) */}
        {/* ================================================================= */}
        {activeTab === 'certificate' && (
          <div className="space-y-6 animate-fadeIn">
            {totalCorrectQuestions >= 91 ? (
              <QuizCertificate totalScore={totalCorrectQuestions} completedAt={new Date()} />
            ) : (
              <div className="max-w-2xl mx-auto p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-stone-900/95 via-stone-900/80 to-black/90 backdrop-blur-2xl text-center space-y-6 shadow-2xl">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Lock size={36} />
                </div>

                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                    Danh Hiệu Chưa Mở Khóa
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 font-display">
                    Giấy Chứng Nhận Sử Gia Tinh Anh
                  </h2>
                  <p className="text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
                    Để nhận chứng nhận vinh danh từ Ban Quản lý Di tích Chín Hầm, bạn cần chinh phục toàn diện 10 bộ đề và đạt tối thiểu <strong>91/100 câu đúng</strong>.
                  </p>
                </div>

                {/* Progress Box */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 max-w-md mx-auto space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-400">Điểm số tích lũy:</span>
                    <span className="font-mono text-base font-bold text-amber-300">
                      {totalCorrectQuestions} / 100 câu
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-stone-800 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalCorrectQuestions / 100) * 100)}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-red-500"
                      style={{ left: '91%' }}
                      title="Mốc 91 câu nhận chứng nhận"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-400">
                    <span>Cần thêm: <strong className="text-amber-400">{Math.max(0, 91 - totalCorrectQuestions)} câu đúng</strong></span>
                    <span>Đã mở: {unlockedSets.length}/10 bộ</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setActiveTab('quiz');
                      setQuizMode('board');
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition"
                  >
                    Tiếp Tục Chinh Phục 10 Bộ Đề
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
