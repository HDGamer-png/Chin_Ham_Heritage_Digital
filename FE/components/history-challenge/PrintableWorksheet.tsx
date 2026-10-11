'use client';

import React from 'react';
import { Printer, FileText, ArrowLeft } from 'lucide-react';
import { QUIZ_QUESTIONS, WORKSHEET_OPEN_QUESTIONS } from './challenge-data';

interface PrintableWorksheetProps {
  onBack?: () => void;
}

export function PrintableWorksheet({ onBack }: PrintableWorksheetProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Screen action header (Hidden on print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-amber-500/30 bg-stone-900/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft size={16} /> Quay lại
            </button>
          )}
          <div>
            <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <FileText size={18} className="text-amber-400" />
              Phiếu Học Tập Thực Địa Di Tích Chín Hầm (Khổ A4 Chuẩn)
            </h2>
            <p className="text-xs text-stone-400">
              Dành cho giáo viên Lịch sử, học sinh, sinh viên khi tham quan hoặc làm bài thu hoạch.
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition hover:scale-105 active:scale-95"
        >
          <Printer size={18} />
          In Phiếu Học Tập (1-Click PDF / Máy In)
        </button>
      </div>

      {/* Printable Sheet (Styling optimized for paper print) */}
      <div
        id="printable-sheet"
        className="bg-white text-black p-8 sm:p-12 rounded-2xl shadow-2xl border border-stone-200 leading-relaxed"
        style={{
          minHeight: '1100px',
          fontFamily: '"Times New Roman", "Noto Serif", Times, serif',
        }}
      >
        {/* Top Header School / Student Meta */}
        <div className="flex justify-between items-start border-b-2 border-stone-800 pb-4 mb-6">
          <div className="text-xs space-y-1">
            <div className="font-bold uppercase tracking-wider">SỞ GIÁO DỤC VÀ ĐÀO TẠO</div>
            <div className="italic">Trường: ..............................................................</div>
            <div className="italic">Lớp: ........................ Khóa: ............................</div>
          </div>
          <div className="text-right text-xs space-y-1">
            <div className="font-bold uppercase tracking-wider">DI TÍCH LỊCH SỬ QUỐC GIA</div>
            <div className="font-bold text-red-700">CHÍN HẦM — ĐỒI BA ĐỒN, HUẾ</div>
            <div className="italic">Ngày tham quan: ..... / ..... / 20.....</div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center my-6 space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-red-900">
            PHIẾU HỌC TẬP THỰC ĐỊA & TRẢI NGHIỆM LỊCH SỬ
          </h1>
          <p className="text-sm font-semibold italic text-stone-700">
            Chủ đề: "Địa ngục trần gian Chín Hầm & Khát vọng Tự Do của người tù kiên trung"
          </p>
          <div className="text-xs text-stone-600">
            Họ và tên học sinh: <span className="font-bold text-stone-900">...........................................................................</span>  |  Điểm số: ............. / 10
          </div>
        </div>

        {/* SECTION 1: CÂU HỎI TRẮC NGHIỆM NHANH */}
        <div className="mb-6 space-y-3">
          <div className="font-bold text-sm uppercase tracking-wide border-b border-stone-300 pb-1 text-red-950 flex justify-between">
            <span>Phần I: Khảo Sát Kiến Thức Cơ Bản (Khoanh tròn đáp án đúng)</span>
            <span className="text-xs font-normal italic">(5.0 Điểm)</span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            {QUIZ_QUESTIONS.slice(0, 5).map((q, idx) => (
              <div key={q.id} className="space-y-1">
                <div className="font-semibold text-stone-900">
                  Câu {idx + 1}: {q.question}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-4 text-xs">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-start gap-1.5">
                      <span className="font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: CÂU HỎI TỰ LUẬN THỰC ĐỊA & LIÊN HỆ */}
        <div className="mb-8 space-y-4">
          <div className="font-bold text-sm uppercase tracking-wide border-b border-stone-300 pb-1 text-red-950 flex justify-between">
            <span>Phần II: Nhận Thức Thực Địa & Cảm Nhận Bản Thân</span>
            <span className="text-xs font-normal italic">(5.0 Điểm)</span>
          </div>

          <div className="space-y-5 text-xs sm:text-sm">
            {WORKSHEET_OPEN_QUESTIONS.map((oq) => (
              <div key={oq.id} className="space-y-2">
                <div className="font-bold text-stone-900">
                  {oq.title}:
                </div>
                <p className="text-xs text-stone-700 italic">
                  {oq.prompt}
                </p>
                {/* Dòng kẻ chấm để học sinh viết tay */}
                <div className="space-y-2.5 pt-1">
                  <div className="border-b border-dotted border-stone-400 h-4 w-full" />
                  <div className="border-b border-dotted border-stone-400 h-4 w-full" />
                  <div className="border-b border-dotted border-stone-400 h-4 w-full" />
                  <div className="border-b border-dotted border-stone-400 h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: NHẬN XÉT & CHỮ KÝ */}
        <div className="grid grid-cols-2 gap-8 pt-6 border-t-2 border-stone-800 text-xs">
          <div className="space-y-1">
            <div className="font-bold uppercase">Nhận xét của Giáo viên bộ môn / Ban Quản Lý:</div>
            <div className="border-b border-dotted border-stone-300 h-4" />
            <div className="border-b border-dotted border-stone-300 h-4" />
            <div className="border-b border-dotted border-stone-300 h-4" />
          </div>

          <div className="text-center space-y-12">
            <div>
              <div className="italic">Ngày ..... tháng ..... năm 20.....</div>
              <div className="font-bold uppercase">Giáo viên / Người hướng dẫn</div>
              <div className="italic text-[11px] text-stone-500">(Ký và ghi rõ họ tên)</div>
            </div>
            <div className="italic text-stone-400">...................................................</div>
          </div>
        </div>
      </div>
    </div>
  );
}
