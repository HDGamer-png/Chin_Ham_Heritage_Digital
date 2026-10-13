import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const fallbackAudioTracks = [
  {
    id: 'audio-intro',
    title: 'Giới thiệu tổng quan',
    duration: '02:48',
    category: 'Khởi đầu',
    description: 'Giới thiệu toàn cảnh về không gian lịch sử, địa thế đồi Ba Đồn và ý nghĩa của di tích lịch sử Chín Hầm qua lời thuyết minh âm thanh truyền cảm.',
    fileUrl: '/audio/gioi-thieu-tong-quan.mp3',
  },
  {
    id: 'audio-nha-chung-tich',
    title: 'Nhà chứng tích Ngô Đình Cẩn',
    duration: '02:33',
    category: 'Không gian',
    description: 'Khám phá nơi lưu giữ hình ảnh, hiện vật và các thông tin lịch sử quan trọng để hiểu rõ giá trị của di tích.',
    fileUrl: '/audio/nha-chung-tich.mp3',
  },
  {
    id: 'audio-ham-8',
    title: 'Hầm 8: Bản lĩnh kiên trung nơi đáy ngục',
    duration: '04:45',
    category: 'Dấu vết',
    description: 'Câu chuyện về không gian xà lim chuồng cọp tàn khốc và bản lĩnh kiên trung, bất khuất của những người chiến sĩ cách mạng nơi đáy ngục Chín Hầm.',
    fileUrl: '/audio/gioi-thieu-ngo-dinh-can-1.mp3',
  },
  {
    id: 'audio-ket-thuc',
    title: 'Kết thúc hành trình khám phá',
    duration: '01:25',
    category: 'Tổng kết',
    description: 'Nhắn nhủ kết nối giữa quá khứ, hiện tại và tương lai của ký ức lịch sử tại Chín Hầm.',
    fileUrl: '/audio/ket-thuc-hanh-trinh.mp3',
  },
];

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/audio`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Backend unavailable');
    }

    const data = await response.json();

    type AudioItem = {
      id?: string | number;
      AudioId?: string | number;
      title?: string;
      Title?: string;
      duration?: string;
      Duration?: string;
      category?: string;
      Category?: string;
      description?: string;
      Description?: string;
      fileUrl?: string;
      FileUrl?: string;
    };

    const tracks = Array.isArray(data)
      ? data.map((item: AudioItem) => ({
          id: String(item.id ?? item.AudioId ?? item.title ?? item.Title ?? 'unknown'),
          title: item.title ?? item.Title ?? 'Không tên',
          duration: item.duration ?? item.Duration ?? '00:00',
          category: item.category ?? item.Category ?? 'Khác',
          description: item.description ?? item.Description ?? '',
          fileUrl: item.fileUrl ?? item.FileUrl ?? '',
        }))
      : Array.isArray(data.tracks)
        ? data.tracks.map((item: AudioItem) => ({
            id: String(item.id ?? item.AudioId ?? item.title ?? item.Title ?? 'unknown'),
            title: item.title ?? item.Title ?? 'Không tên',
            duration: item.duration ?? item.Duration ?? '00:00',
            category: item.category ?? item.Category ?? 'Khác',
            description: item.description ?? item.Description ?? '',
            fileUrl: item.fileUrl ?? item.FileUrl ?? '',
          }))
        : fallbackAudioTracks;

    return NextResponse.json({ success: true, tracks });
  } catch {
    return NextResponse.json({
      success: true,
      tracks: fallbackAudioTracks,
    });
  }
}
