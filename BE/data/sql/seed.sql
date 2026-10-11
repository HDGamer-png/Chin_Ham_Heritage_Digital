USE ChinhHamDb;
GO

INSERT INTO dbo.Sites (Slug, Name, Subtitle, Description, Summary, Category, Status, SortOrder)
VALUES
    ('nha-chung-tich', N'Nhà chứng tích', N'Trưng bày và tường thuật lịch sử', N'Không gian kể chuyện bằng hình ảnh, hiện vật và thông tin đối chiếu.', N'Không gian kể lại lịch sử và những sự kiện trọng tâm của khu di tích.', N'chinh-tich', 'active', 1),
    ('ham-1', N'Hầm 1', N'Di tích khảo cổ, kiến trúc và dấu vết', N'Mô tả không gian, kết cấu và ý nghĩa của hầm trong lịch sử di tích.', N'Một trong các hầm được tường thuật theo dấu vết và không gian thực tế.', N'ham', 'active', 2),
    ('ham-2', N'Hầm 2', N'Ký ức sống động trong không gian', N'Cung cấp góc nhìn lịch sử, hình khối kiến trúc và trải nghiệm tham quan.', N'Hầm mang yếu tố kiến trúc và ký ức sống động, phản ánh không gian lịch sử.', N'ham', 'active', 3);
GO

INSERT INTO dbo.Documents (SiteId, Title, FileName, FileType, MimeType, Category, Description, FileUrl, IsFeatured, Status, PublishedAt)
VALUES
    (1, N'Giới thiệu tổng quan về Chín Hầm', N'intro.pdf', 'pdf', 'application/pdf', N'Tổng quan', N'Tài liệu tổng hợp về bối cảnh lịch sử và giá trị di tích.', '/documents/intro.pdf', 1, 'active', '2026-01-01'),
    (2, N'Ký ức và dấu tích của Hầm 1', N'ham-1.jpg', 'image', 'image/jpeg', N'Hầm', N'Tư liệu hình ảnh phục vụ cho màn hình thuyết minh di tích.', '/documents/ham-1.jpg', 0, 'active', '2026-01-05'),
    (2, N'Bản đồ không gian Hầm 1', N'ham-1-map.pdf', 'pdf', 'application/pdf', N'Bản đồ', N'Tài liệu bản đồ và trường hợp tham quan.', '/documents/ham-1-map.pdf', 0, 'active', '2026-01-12');
GO

INSERT INTO dbo.AudioTracks (SiteId, Title, FileName, FileUrl, DurationSeconds, Category, Description, Language, IsFeatured, Status)
VALUES
    (1, N'Giới thiệu tổng quan', N'intro.mp3', '/audio/intro.mp3', 200, N'Khởi đầu', N'Giới thiệu ngắn về giá trị lịch sử và không gian của Chín Hầm.', 'vi', 1, 'active'),
    (2, N'Hầm 1 và ký ức lịch sử', N'ham-1.mp3', '/audio/ham-1.mp3', 285, N'Dấu vết', N'Câu chuyện về không gian, cấu trúc và giá trị lịch sử của hầm.', 'vi', 0, 'active');
GO

INSERT INTO dbo.MediaAssets (SiteId, Title, AssetType, FileName, FileUrl, MimeType, AltText, Width, Height, IsCover, SortOrder, Status)
VALUES
    (1, N'Ảnh bìa di tích', 'image', N'cover-main.jpg', '/media/cover-main.jpg', 'image/jpeg', N'Ảnh bìa di tích Chín Hầm', 1600, 900, 1, 1, 'active'),
    (2, N'Hầm 1 - nơi dựng ký ức', 'image', N'ham-1-photo.jpg', '/media/ham-1-photo.jpg', 'image/jpeg', N'Hầm 1 trong không gian di tích', 1200, 800, 1, 2, 'active'),
    (3, N'Hầm 2 - cảnh quan nội thất', 'image', N'ham-2-photo.jpg', '/media/ham-2-photo.jpg', 'image/jpeg', N'Hầm 2 với không gian kiến trúc và cảnh quan', 1200, 800, 0, 3, 'active');
GO
