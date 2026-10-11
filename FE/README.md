# Chín Hầm Heritage Web

## Mục tiêu

Website tương tác bảo tồn và phát huy giá trị cụm di tích Ngô Đình Cẩn - Chín Hầm.

## Công nghệ

- Next.js + TypeScript
- Tailwind CSS
- Framer Motion
- Supabase cho dữ liệu và storage
- Vercel để deploy

## Cài đặt

```bash
npm install
npm run dev
```

## Cấu trúc chính

- `app/`: route và trang chính
- `components/`: UI component dùng chung
- `lib/`: helper và cấu hình liên kết backend
- `content/`: dữ liệu nội dung dạng JSON/Markdown
- `public/models/`: file 3D .glb

## Môi trường

Tạo file `.env.local` với các biến:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```
