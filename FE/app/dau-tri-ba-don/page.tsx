import type { Metadata } from 'next';
import { HistoryChallengeQuiz } from '@/components/history-challenge/HistoryChallengeQuiz';

export const metadata: Metadata = {
  title: 'Đấu Trí Thiên Thai & Góc Học Đường | Di Tích Số Hóa Chín Hầm',
  description:
    'Thử thách 10 câu hỏi lịch sử Chín Hầm, bảng vàng danh dự trường học và phiếu học tập thực địa in 1-click chuẩn A4 dành cho học sinh, sinh viên.',
};

export default function DauTriBaDonPage() {
  return (
    <div className="relative min-h-screen bg-transparent text-stone-100">
      <HistoryChallengeQuiz />
    </div>
  );
}
