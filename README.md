# 🏰 CHÍN HẦM — NỀN TẢNG BẢO TÀNG SỐ & DI TÍCH LỊCH SỬ HUẾ (3D DIGITAL HERITAGE)

Hệ thống số hóa 3D tương tác đa giác quan Khu Di Tích Lịch Sử Chín Hầm (Đồi Ba Đồn, Cố Đô Huế). Tái hiện dòng thời gian, kiến trúc quân sự ngầm, trải nghiệm hiện vật 3D, sa bàn bia đá 360°, Web-Quest giải mã lịch sử và trợ lý AI RAG nội bộ.

---

## 🏗️ Kiến Trúc Hệ Thống (3 Lớp Độc Lập)

| Thành phần | Công nghệ | Cổng mặc định | Chức năng chính |
| :--- | :--- | :--- | :--- |
| **Frontend (`FE`)** | Next.js 14, React 18, Tailwind CSS, Three.js / ThreeUI (Living Green & Kyoto Kage) | `3000` | Giao diện bảo tàng số 3D, không gian tương tác, Web-Quest & bản đồ 360° |
| **Backend (`BE`)** | Node.js, Express, RESTful APIs, Local Data Engine | `4000` | Cung cấp dữ liệu di tích, thuyết minh audio, quản lý đặt lịch |
| **AI Service (`AI_SERVICE`)** | Python 3, FastAPI, RAG (Retrieval-Augmented Generation) | `8000` | Trợ lý hỏi đáp lịch sử Chín Hầm 100% offline nội bộ (Multi-Agent Engine) |

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Khởi Chạy Frontend (Next.js)
```bash
cd FE
npm install
npm run dev
```
Truy cập: [http://localhost:3000](http://localhost:3000)

### 2. Khởi Chạy Backend (Express)
```bash
cd BE
npm install
npm run dev
```
Truy cập: `http://localhost:4000`

### 3. Khởi Chạy AI Service (Python FastAPI)
```bash
cd AI_SERVICE
pip install -r requirements.txt
py app.py
```
Truy cập: `http://127.0.0.1:8000`

---

## 🌟 Các Tính Năng Đột Phá

1. **Trang Chủ 3D Kyoto Kage (`/`)**: Không gian 3D tương tác khám phá bức tường di tích Chín Hầm và danh mục các căn hầm lịch sử.
2. **Không Gian Living Green 3D (`SylvaHero`)**: Áp dụng xuyên suốt các phân khu:
   - **Di Tích (`/di-tich`)**: Khảo sát 9 căn hầm và nhà chứng tích đồi Ba Đồn.
   - **Hành Trình Ký Ức (`/hanh-trinh-ky-uc`)**: Trung tâm trải nghiệm 3 phân khu.
   - **Showroom Hiện Vật 3D (`/hien-vat-3d`)**: Xoay 360°, bóc tách tia X-Ray, đèn pin 3D soi rãnh khắc đinh trên lược nhôm.
   - **Web-Quest Giải Mã 1963 (`/giai-ma`)**: 4 trạm trinh sát, âm thanh Morse tường đá và cấp giấy chứng nhận danh dự.
   - **Đấu Trí & Góc Học Đường (`/dau-tri-ba-don`)**: 10 câu hỏi đố lịch sử, bảng vàng và in Phiếu học tập thực địa A4 1-click.
   - **Bản Đồ 360° (`/ban-do-360`)**: Sa bàn bia đá chỉ huy & panorama 360° tương tác.
   - **Audio Guide (`/audio-guide`)**: Thuyết minh âm thanh không gian.
   - **Trợ Lý AI (`/chatbot`)**: RAG Engine 5 tác tử giải đáp lịch sử.
   - **Đặt Lịch Tham Quan (`/lien-he`)**: Đăng ký tham quan thực địa.

---

## 📄 Bản Quyền & Giấy Phép
Dự án được xây dựng phục vụ nghiên cứu khoa học, giáo dục lịch sử và chuyển đổi số di sản văn hóa Thừa Thiên Huế.
