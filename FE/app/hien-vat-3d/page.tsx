import type { Metadata } from 'next';
import { ArtifactShowcase } from '@/components/artifact-showcase/ArtifactShowcase';

export const metadata: Metadata = {
  title: 'Showroom Hiện Vật 3D Tương Tác — Khu Di Tích Lịch Sử Chín Hầm Huế',
  description:
    'Khám phá 4 bảo vật khảo cổ học vô giá tại Khu Di Tích Chín Hầm (Đồi Thiên Thai, Huế) qua công nghệ 3D xoay 360 độ, bóc tách tia X và thuyết minh âm thanh.',
};

export default function HienVat3DPage() {
  return (
    <div className="min-h-screen bg-transparent text-stone-100">
      <div className="container-shell py-8 md:py-12">
        <ArtifactShowcase />
      </div>
    </div>
  );
}

