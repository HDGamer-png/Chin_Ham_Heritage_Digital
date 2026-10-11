import type { Metadata } from 'next';
import { WebQuest1963 } from '@/components/web-quest/WebQuest1963';

export const metadata: Metadata = {
  title: 'Web-Quest Giải Mã Ký Ức 1963 | Di Tích Số Hóa Chín Hầm',
  description:
    'Hành trình tương tác lịch sử 4 trạm: định vị Hầm 8, giải mã di vật lược nhôm, nhịp gõ Morse xà lim và thời khắc phá ngục 02/11/1963. Nhận Giấy chứng nhận danh dự độc bản.',
};

export default function GiaiMaPage() {
  return (
    <div className="relative min-h-screen bg-transparent text-stone-100">
      <WebQuest1963 />
    </div>
  );
}
