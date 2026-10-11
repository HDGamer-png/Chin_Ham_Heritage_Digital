# Thư mục media cho dự án Chín Hầm

Thư mục này dùng để lưu trữ các tệp hình ảnh, video, audio hoặc tài liệu gốc.

Khuyến nghị:

- media/images/ : lưu ảnh minh họa, banner, cover
- media/audio/ : lưu file audio ngắn / guide
- media/documents/ : lưu file PDF, DOC, XLS

Metadata của file nên được quản lý trong SQL Server qua bảng:

- Documents
- AudioTracks
- MediaAssets

Điều này giúp phía web đọc file theo đường dẫn URL hoặc path tương ứng mà không cần lưu file nhị phân trực tiếp trong database.
