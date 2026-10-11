import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const fallbackAudioTracks = [
  {
    id: 'intro',
    title: 'Giới thiệu tổng quan',
    duration: '03:20',
    category: 'Khởi đầu',
    description: 'Giới thiệu ngắn về giá trị lịch sử, không gian và ý nghĩa của Chín Hầm.',
  },
  {
    id: 'nha-chung-tich',
    title: 'Nhà chứng tích Ngô Đình Cẩn',
    duration: '05:15',
    category: 'Không gian',
    description: 'Khám phá nơi lưu giữ hình ảnh, hiện vật và ký ức lịch sử quan trọng.',
  },
  {
    id: 'ham-1',
    title: 'Hầm 1 và ký ức lịch sử',
    duration: '04:45',
    category: 'Dấu vết',
    description: 'Câu chuyện về không gian, cấu trúc và giá trị lịch sử của hầm.',
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
    };

    const tracks = Array.isArray(data)
      ? data.map((item: AudioItem) => ({
          id: String(item.id ?? item.AudioId ?? item.title ?? item.Title ?? 'unknown'),
          title: item.title ?? item.Title ?? 'Không tên',
          duration: item.duration ?? item.Duration ?? '00:00',
          category: item.category ?? item.Category ?? 'Khác',
          description: item.description ?? item.Description ?? '',
        }))
      : Array.isArray(data.tracks)
        ? data.tracks.map((item: AudioItem) => ({
            id: String(item.id ?? item.AudioId ?? item.title ?? item.Title ?? 'unknown'),
            title: item.title ?? item.Title ?? 'Không tên',
            duration: item.duration ?? item.Duration ?? '00:00',
            category: item.category ?? item.Category ?? 'Khác',
            description: item.description ?? item.Description ?? '',
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
