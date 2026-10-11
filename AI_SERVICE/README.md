# 🤖 TRỢ LÝ AI CHÍN HẦM (PYTHON LOCAL ENGINE)

Dịch vụ AI Lịch sử Chín Hầm được viết hoàn toàn bằng **Python**, chạy độc lập 100% trên máy chủ nội bộ, **hoàn toàn KHÔNG phụ thuộc vào Gemini API hay bất kỳ API trả phí nào**.

Hệ thống được thiết kế theo kiến trúc **RAG (Retrieval-Augmented Generation)** tối ưu cho tiếng Việt, giúp bạn dễ dàng cập nhật, bổ sung tư liệu bất kỳ lúc nào mà không cần sửa code.

---

## 📂 Cách Cập Nhật Nội Dung & Tư Liệu Mới

Bạn chỉ cần thêm hoặc chỉnh sửa các file trong thư mục:
👉 `AI_SERVICE/knowledge_base/`

Hỗ trợ các định dạng:
- **Markdown (`.md`)** *(Khuyên dùng)*: Sử dụng các thẻ `# Tiêu đề lớn`, `## Tiêu đề con` để AI hiểu cấu trúc từng mục.
- **Văn bản thuần (`.txt`)**: Mỗi đoạn văn cách nhau bằng 1 dòng trống.
- **JSON (`.json`)**: Dạng danh sách các mục `[{"title": "...", "content": "..."}]`.

> 💡 **Tính năng tự động nhận diện (Auto Hot-Reload):**  
> Khi bạn thêm mới hoặc sửa bất kỳ file nào trong `knowledge_base/`, hệ thống sẽ **tự động phát hiện và nạp lại tri thức mới ngay trong lần hỏi tiếp theo**, không cần khởi động lại server!

---

## 🚀 Cách Chạy Dịch Vụ

Mở Terminal và chạy lệnh:

```bash
cd AI_SERVICE
py app.py
```

Server sẽ khởi động tại: `http://127.0.0.1:8000`

---

## 📡 Các Điểm Cuối API Sẵn Sàng (REST API)

| Phương thức | Đường dẫn | Chức năng |
| :--- | :--- | :--- |
| `POST` | `/chat` | Gửi câu hỏi nhận câu trả lời `{ "message": "Ngô Đình Cẩn là ai?" }` |
| `GET` | `/health` | Kiểm tra trạng thái và danh sách file đã nạp |
| `GET` | `/documents` | Xem chi tiết tất cả các phân đoạn tài liệu đang có trong bộ nhớ |
| `POST` | `/reload` | Chủ động làm mới toàn bộ tri thức trong thư mục |

---

## 🔗 Liên Kết Với Web Next.js

Đã được cấu hình tự động tại `FE/app/api/chat/route.ts`. Khi người dùng nhắn tin tại trang `/chatbot`, ứng dụng web sẽ tự động gửi câu hỏi sang `http://127.0.0.1:8000/chat` để lấy câu trả lời thông minh nhất kèm trích dẫn nguồn văn bản!
