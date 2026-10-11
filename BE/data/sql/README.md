# Cấu trúc dữ liệu SQL Server cho Chín Hầm

Tệp này chuẩn hóa dữ liệu cho website di tích lịch sử theo mô hình quản lý nội dung:

- sites: các di tích / địa điểm / hầm / khu trưng bày
- documents: tài liệu, tư liệu, tài liệu PDF, hình ảnh, báo cáo
- audio_tracks: audio guide / bản ghi thuyết minh
- media_assets: media chung bao gồm ảnh, video, banner, thumbnail

## Mục tiêu

- quản lý dữ liệu theo SQL Server
- dễ mở rộng cho FE / BE sau này
- hỗ trợ upload và hiển thị tài liệu, hình ảnh, audio trong web

## Các file

- schema.sql: định nghĩa schema cơ sở dữ liệu
- seed.sql: dữ liệu mẫu để test nhanh

## Cách sử dụng

1. Tạo database trong SQL Server
2. Chạy schema.sql
3. Chạy seed.sql
4. Kết nối từ backend hoặc frontend để đọc dữ liệu

## Gợi ý quan hệ

- site_id tham chiếu đến bảng Sites
- document.site_id cho tài liệu thuộc từng di tích
- audio_track.site_id cho bài audio thuộc từng di tích
- media_asset.site_id cho hình ảnh / video / banner

## Lưu ý

- File media nên lưu ở thư mục vật lý như data/media/
- Bảng chỉ lưu metadata, không lưu file nhị phân trực tiếp
- Đường dẫn file nên là relative path hoặc URL rút gọn
