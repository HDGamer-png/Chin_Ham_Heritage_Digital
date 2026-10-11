import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type ContactSubmission = {
  name: string;
  email: string;
  purpose: string;
  message: string;
  createdAt: string;
};

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, { cache: 'no-store' });
    const data = await response.json();
    return NextResponse.json({
      count: Array.isArray(data) ? data.length : data?.items?.length ?? 0,
      items: Array.isArray(data) ? data : data?.items ?? [],
    });
  } catch {
    return NextResponse.json({ count: 0, items: [] });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, purpose, message } = body ?? {};

  if (!name || !email || !message) {
    return NextResponse.json(
      {
        success: false,
        message: 'Thiếu thông tin bắt buộc: họ tên, email hoặc nội dung.',
      },
      { status: 400 }
    );
  }

  const entry: ContactSubmission = {
    name: String(name).trim(),
    email: String(email).trim(),
    purpose: String(purpose ?? 'Tham quan cá nhân').trim(),
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      message: data?.message || 'Thông tin của bạn đã được ghi nhận.',
      data: data?.data ?? entry,
    });
  } catch {
    return NextResponse.json({
      success: true,
      message: 'Thông tin của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ lại sớm nhất.',
      data: entry,
    });
  }
}
