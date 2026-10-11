# Backend cho Chín Hầm Heritage

Backend tối thiểu để quản lý dữ liệu nội dung cho website:
- di tích / hầm
- tài liệu, tư liệu hình ảnh
- audio guide
- contact submissions

## Cấu trúc

```bash
BE/
  data/
    sites.json
    documents.json
    audio.json
    contacts.json
  server.js
  package.json
```

## Chạy backend

```bash
npm install
npm run dev
```

Backend mặc định chạy ở:
- http://localhost:4000

## API gợi ý

- GET /api/sites
- GET /api/sites/:slug
- GET /api/documents
- GET /api/audio
- POST /api/contact

## Mục tiêu

Dữ liệu từ folder BE sẽ được frontend FE đọc qua API để hiển thị lên web.
