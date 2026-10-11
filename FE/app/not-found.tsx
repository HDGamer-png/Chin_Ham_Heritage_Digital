import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container-shell flex min-h-[60vh] items-center justify-center py-20">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-heritage-600">404</p>
        <h1 className="mt-4 text-4xl font-bold text-heritage-900">Trang không tồn tại</h1>
        <p className="mt-3 text-slate-700">Nội dung bạn đang tìm kiếm chưa được cập nhật hoặc đã di chuyển.</p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-heritage-800 px-5 py-3 font-medium text-white">
          Quay về trang chủ
        </Link>
      </div>
    </main>
  );
}
