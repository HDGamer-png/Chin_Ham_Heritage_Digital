'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download, Award, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

interface CertificateGeneratorProps {
  score: number;
  timeSpentSeconds: number;
  completedAt: Date;
}

export function CertificateGenerator({
  score,
  timeSpentSeconds,
  completedAt,
}: CertificateGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [userName, setUserName] = useState<string>('Nguyễn Văn An');
  const [certCode, setCertCode] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Generate unique certificate ID once
  useEffect(() => {
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const timestampHex = Date.now().toString(16).slice(-4).toUpperCase();
    setCertCode(`CH1963-${randomHex}-${timestampHex}`);
  }, []);

  // Format time mm:ss
  const formatDuration = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m} phút ${s < 10 ? '0' : ''}${s} giây`;
  };

  // Draw Certificate onto Canvas (High-res 1200x800)
  const drawCertificate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1200;
    const H = 820;
    canvas.width = W;
    canvas.height = H;

    // 1. Vintage Parchment / Aged Paper Background
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, W * 0.7);
    bgGrad.addColorStop(0, '#fffbf0');
    bgGrad.addColorStop(0.65, '#f5ecd5');
    bgGrad.addColorStop(1, '#e5d7b5');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle paper grain noise
    ctx.fillStyle = 'rgba(120, 80, 20, 0.015)';
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * W;
      const ry = Math.random() * H;
      ctx.fillRect(rx, ry, Math.random() * 3, Math.random() * 3);
    }

    // 2. Ornate Historic Gold & Bronze Borders
    // Outer Border
    ctx.strokeStyle = '#854d0e'; // bronze brown
    ctx.lineWidth = 6;
    ctx.strokeRect(36, 36, W - 72, H - 72);

    // Inner Thin Gold Inset
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.strokeRect(46, 46, W - 92, H - 92);

    // Corner Ornaments
    const drawCorner = (x: number, y: number, scaleX: number, scaleY: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scaleX, scaleY);
      ctx.strokeStyle = '#a16207';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(55, 10);
      ctx.moveTo(10, 10);
      ctx.lineTo(10, 55);

      ctx.moveTo(18, 18);
      ctx.arc(32, 32, 14, 0, Math.PI * 2);

      ctx.stroke();
      ctx.restore();
    };

    drawCorner(46, 46, 1, 1);
    drawCorner(W - 46, 46, -1, 1);
    drawCorner(46, H - 46, 1, -1);
    drawCorner(W - 46, H - 46, -1, -1);

    // 3. National Motto Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1c1917';
    ctx.font = 'bold 15px "Times New Roman", serif';
    ctx.fillText('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', W / 2, 85);

    ctx.font = 'italic 14px "Times New Roman", serif';
    ctx.fillText('Độc lập - Tự do - Hạnh phúc', W / 2, 108);

    // Divider line under motto
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 140, 118);
    ctx.lineTo(W / 2 + 140, 118);
    ctx.stroke();

    // 4. Heritage Institution Header
    ctx.font = '600 13px "Times New Roman", serif';
    ctx.fillStyle = '#b45309';
    ctx.fillText('BAN QUẢN LÝ KHU DI TÍCH LỊCH SỬ CHÍN HẦM — ĐỒI THIÊN THAI, HUẾ', W / 2, 155);

    // 5. Main Title: CHỨNG NHẬN DANH DỰ
    ctx.font = 'bold 36px "Times New Roman", serif';
    ctx.fillStyle = '#991b1b'; // Historic deep crimson
    ctx.fillText('GIẤY CHỨNG NHẬN VINH DANH', W / 2, 210);

    ctx.font = 'bold 22px "Times New Roman", serif';
    ctx.fillStyle = '#854d0e';
    ctx.fillText('CHIẾN SĨ TRINH SÁT KÝ ỨC CHÍN HẦM 1963', W / 2, 246);

    // 6. Recipient Name
    ctx.font = '17px "Times New Roman", serif';
    ctx.fillStyle = '#292524';
    ctx.fillText('Chứng nhận đồng chí:', W / 2, 305);

    const displayName = (userName.trim() || 'Chiến sĩ Trinh sát').toUpperCase();
    ctx.font = 'bold 38px "Times New Roman", serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(displayName, W / 2, 355);

    // Name underline flourishing
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const nameWidth = ctx.measureText(displayName).width;
    ctx.moveTo(W / 2 - nameWidth / 2 - 25, 370);
    ctx.lineTo(W / 2 + nameWidth / 2 + 25, 370);
    ctx.stroke();

    // 7. Achievement Statement
    ctx.font = 'italic 18px "Times New Roman", serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(
      'Đã xuất sắc hoàn thành 4 trạm thử thách của chương trình tương tác lịch sử số hóa:',
      W / 2,
      418
    );

    ctx.font = 'bold 21px "Times New Roman", serif';
    ctx.fillStyle = '#991b1b';
    ctx.fillText('« GIẢI MÃ KÝ ỨC 1963 — ĐỊA NGỤC TRẦN GIAN & KHÁT VỌNG TỰ DO »', W / 2, 452);

    ctx.font = '16px "Times New Roman", serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(
      'Góp phần lan tỏa những giá trị thiêng liêng, thấu hiểu sự hy sinh bất khuất của các anh hùng liệt sĩ cách mạng',
      W / 2,
      488
    );
    ctx.fillText(
      'và tiếp nối ngọn lửa yêu nước của các thế hệ cha anh tại đồi Thiên Thai, Thừa Thiên Huế.',
      W / 2,
      512
    );

    // 8. Stats Badge Table (Điểm & Thời gian)
    const boxY = 548;
    ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
    ctx.fillRect(W / 2 - 260, boxY, 520, 56);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1;
    ctx.strokeRect(W / 2 - 260, boxY, 520, 56);

    ctx.font = '600 15px "Times New Roman", serif';
    ctx.fillStyle = '#1c1917';
    ctx.fillText(
      `Điểm thành tích: ${score}/100 Điểm   •   Thời gian giải mã: ${formatDuration(timeSpentSeconds)}`,
      W / 2,
      boxY + 34
    );

    // 9. Signatures and Verification
    const bottomY = 650;

    // Left: Metadata
    ctx.textAlign = 'left';
    ctx.font = '14px "Times New Roman", serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(`Mã số cấp: ${certCode || 'CH1963-AUTH'}`, 90, bottomY);
    ctx.fillText(
      `Cấp ngày: ${completedAt.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })}`,
      90,
      bottomY + 26
    );
    ctx.fillText('Nền tảng số hóa di sản Chín Hầm', 90, bottomY + 52);

    // Right: Seal & Leadership Signature
    ctx.textAlign = 'center';
    ctx.font = 'italic 15px "Times New Roman", serif';
    ctx.fillStyle = '#292524';
    ctx.fillText(
      `Thừa Thiên Huế, ngày ${completedAt.getDate()} tháng ${completedAt.getMonth() + 1} năm ${completedAt.getFullYear()}`,
      W - 240,
      bottomY - 10
    );
    ctx.font = 'bold 15px "Times New Roman", serif';
    ctx.fillText('BAN TỔ CHỨC DỰ ÁN DI SẢN SỐ', W - 240, bottomY + 16);

    ctx.font = 'italic 14px "Times New Roman", serif';
    ctx.fillStyle = '#78716c';
    ctx.fillText('(Đã ký điện tử & đóng dấu số)', W - 240, bottomY + 105);

    // 10. Authentic Crimson Heritage Seal (Dấu mộc đỏ tròn di tích)
    const sealX = W - 240;
    const sealY = bottomY + 58;
    ctx.save();
    ctx.translate(sealX, sealY);
    ctx.rotate(-0.06); // Slight natural stamp tilt

    // Outer double red circles
    ctx.strokeStyle = 'rgba(220, 38, 38, 0.88)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 44, 0, Math.PI * 2);
    ctx.stroke();

    // Center star
    ctx.fillStyle = 'rgba(220, 38, 38, 0.9)';
    ctx.font = '18px serif';
    ctx.textAlign = 'center';
    ctx.fillText('★', 0, -6);

    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('CHÍN HẦM', 0, 10);
    ctx.fillText('1963', 0, 22);

    // Circular text approximation
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('DI TÍCH LỊCH SỬ HUẾ', 0, -32);
    ctx.fillText('CHỨNG NHẬN ĐIỆN TỬ', 0, 38);

    ctx.restore();
  }, [userName, certCode, score, timeSpentSeconds, completedAt]);

  useEffect(() => {
    drawCertificate();
  }, [drawCertificate]);

  // 1-Click High-Res PNG Download (0 VNĐ)
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    const safeName = userName.trim().replace(/\s+/g, '_') || 'Chien_si';
    link.download = `Chung_Nhan_Chin_Ham_1963_${safeName}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(certCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-amber-500/30 bg-stone-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-semibold mb-3">
          <Award size={18} className="text-amber-400" />
          Vinh Danh Hoàn Thành Xuất Sắc
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-100 font-display">
          Giấy Chứng Nhận Trinh Sát Ký Ức 1963
        </h2>
        <p className="text-stone-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
          Nhập họ và tên của bạn để hệ thống tự động xuất chứng nhận độc bản kèm con dấu di tích cổ điển.
        </p>
      </div>

      {/* Input Name form */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Nhập họ và tên của bạn..."
          maxLength={35}
          className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-amber-500/40 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center sm:text-left text-base"
        />
        <button
          onClick={drawCertificate}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-200 text-sm font-medium flex items-center justify-center gap-1.5 transition"
          title="Làm mới chứng nhận"
        >
          <RefreshCw size={15} /> Cập nhật
        </button>
      </div>

      {/* Certificate Preview Canvas Container */}
      <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-black/40 p-2 sm:p-4 mb-6">
        <canvas
          ref={canvasRef}
          className="w-full h-auto block rounded-lg shadow-inner mx-auto cursor-pointer"
          style={{ maxHeight: '520px', objectFit: 'contain' }}
          onClick={handleDownload}
        />
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-stone-400 text-xs sm:text-sm">
          <ShieldCheck size={18} className="text-emerald-400" />
          <span>Mã định danh:</span>
          <span className="font-mono text-amber-300 font-semibold">{certCode}</span>
          <button
            onClick={handleCopyCode}
            className="text-stone-400 hover:text-stone-200 text-xs underline ml-1"
          >
            {isCopied ? <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Đã chép</span> : 'Sao chép'}
          </button>
        </div>

        <button
          onClick={handleDownload}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-stone-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download size={18} />
          Tải Chứng Nhận Về Máy (PNG Miễn Phí)
        </button>
      </div>
    </div>
  );
}
