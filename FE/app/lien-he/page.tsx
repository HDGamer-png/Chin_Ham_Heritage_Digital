"use client";

import { ChangeEvent, FormEvent, useState } from 'react';

const initialForm = {
  name: '',
  email: '',
  purpose: 'Tham quan cá nhân',
  message: '',
};

export default function LienHePage() {
  const [formData, setFormData] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setError('Vui lòng nhập đầy đủ họ tên, email và nội dung.');
      setSubmitted(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Không thể gửi thông tin.');
      }

      setSubmitted(true);
      setError('');
      setFormData(initialForm);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Có lỗi xảy ra.');
      setSubmitted(false);
    }
  };

  return (
    <main className="container-shell py-16">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2.5rem] border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] p-8 md:p-10 backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] shadow-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 backdrop-blur-[3px]">
            Liên Hệ & Đặt Lịch
          </div>
          <h1 className="text-4xl font-black text-white md:text-5xl font-display drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Đặt Lịch Tham Quan & Hợp Tác</h1>
          <p className="mt-4 text-base text-stone-300 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            Khách du lịch, trường học và các đoàn nghiên cứu có thể gửi yêu cầu đặt lịch tham quan thực tế hoặc trải nghiệm bảo tàng số tương tác.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/20 bg-black/[0.05] p-5 backdrop-blur-[3px]">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Thời gian phản hồi</div>
              <div className="mt-2 text-stone-200 text-sm">Trong vòng 24 giờ làm việc</div>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-black/[0.05] p-5 backdrop-blur-[3px]">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Phạm vi hỗ trợ</div>
              <div className="mt-2 text-stone-200 text-sm">Tham quan, thuyết minh & số hóa</div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-[2.5rem] border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] p-8 md:p-10 backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] shadow-2xl">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-300">Họ và tên</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-stone-500 outline-none backdrop-blur-[3px] transition focus:border-emerald-400"
              placeholder="Nhập họ tên của bạn"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-300">Email liên hệ</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-stone-500 outline-none backdrop-blur-[3px] transition focus:border-emerald-400"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-300">Mục đích</label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none backdrop-blur-[3px] transition focus:border-emerald-400"
            >
              <option className="bg-stone-900">Tham quan cá nhân / gia đình</option>
              <option className="bg-stone-900">Đặt lịch cho trường học / sinh viên</option>
              <option className="bg-stone-900">Hợp tác tổ chức sự kiện di sản</option>
              <option className="bg-stone-900">Đặt lịch cho đoàn lữ hành</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-300">Nội dung yêu cầu</label>
            <textarea
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-stone-500 outline-none backdrop-blur-[3px] transition focus:border-emerald-400"
              placeholder="Nhập nội dung bạn muốn trao đổi..."
            />
          </div>

          {submitted && (
            <div className="rounded-2xl border border-emerald-400/40 bg-emerald-950/80 px-4 py-3 text-sm text-emerald-300 backdrop-blur-md">
              ✓ Thông tin của bạn đã được ghi nhận. Đội ngũ Chín Hầm sẽ liên hệ lại sớm nhất!
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-400/40 bg-red-950/80 px-4 py-3 text-sm text-red-300 backdrop-blur-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3.5 font-bold text-white shadow-xl shadow-emerald-950/50 transition hover:from-emerald-500 hover:to-emerald-400"
          >
            Gửi Thông Tin Đặt Lịch
          </button>
        </form>
      </div>
    </main>
  );
}
