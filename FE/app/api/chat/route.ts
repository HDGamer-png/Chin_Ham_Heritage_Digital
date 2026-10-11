import { NextRequest, NextResponse } from 'next/server';

const PYTHON_AI_URL = process.env.PYTHON_AI_URL || 'http://127.0.0.1:8000';

const cannedResponses = [
  {
    match: ['chín hầm', 'giá trị', 'lịch sử', 'đồi ba đồn'],
    reply:
      'Chín Hầm là cụm di tích lịch sử quốc gia nằm trên đồi Ba Đồn (phường An Tây, Huế). Năm 1941, thực dân Pháp xây dựng 9 căn hầm kiên cố để cất giấu vũ khí. Sau năm 1954, bạo chúa Ngô Đình Cẩn đã biến nơi đây thành "địa ngục trần gian" giam cầm các chiến sĩ cách mạng cho đến ngày nhân dân Huế phá hầm giải phóng ngày 02/11/1963.',
  },
  {
    match: ['ngô đình cẩn', 'ngo dinh can', 'cậu cẩn'],
    reply:
      'Ngô Đình Cẩn (1911 – 1964) là em trai thứ tư của Ngô Đình Diệm, được trao quyền "Cố vấn chỉ đạo miền Trung". Cẩn xây dựng bộ máy mật vụ tàn bạo, độc quyền kinh tế và biến Chín Hầm thành nhà tù bí mật ngoài vòng pháp luật để thanh trừng người yêu nước.',
  },
  {
    match: ['hầm 4', 'hầm số 4', 'chuồng cọp'],
    reply:
      'Hầm số 4 là căn hầm khét tiếng dã man nhất ở Chín Hầm. Ngô Đình Cẩn cho chia nhỏ hầm thành các xà lim "chuồng cọp" chỉ 1.2m x 0.8m. Tù nhân bị khóa chân bằng cùm sắt răng cưa ngày đêm trong bóng tối ngột ngạt và hôi thối.',
  },
  {
    match: ['phá hầm', '1963', '02/11/1963'],
    reply:
      'Sáng ngày 02/11/1963, ngay sau khi chế độ Diệm sụp đổ, hàng ngàn học sinh, sinh viên và nhân dân Huế đã tiến lên đồi Ba Đồn phá tan xiềng xích, cứu sống các tù nhân kiên trung bị giam cầm tại Chín Hầm.',
  },
  {
    match: ['audio', 'guide'],
    reply:
      'Audio Guide được thiết kế để người xem nghe thuyết minh trực tiếp trên điện thoại trong quá trình tham quan với hỗ trợ song ngữ Việt - Anh.',
  },
];

function fallbackReply(input: string) {
  const normalized = input.toLowerCase();

  for (const item of cannedResponses) {
    if (item.match.some((keyword) => normalized.includes(keyword))) {
      return item.reply;
    }
  }

  return 'Tôi là Trợ lý AI Lịch sử Chín Hầm. Bạn có thể hỏi tôi về nhân vật Ngô Đình Cẩn, cấu trúc 9 căn hầm, sự kiện phá hầm 1963 hoặc hướng dẫn tham quan.\n\n*(Gợi ý: Hãy khởi chạy dịch vụ Python AI tại thư mục AI_SERVICE bằng lệnh `py app.py` để tra cứu toàn văn từ các file tài liệu).*';
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (!message) {
    return NextResponse.json(
      { success: false, message: 'Vui lòng nhập câu hỏi.' },
      { status: 400 }
    );
  }

  // 1. Thử gọi sang Python AI Service (FastAPI RAG Engine)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const pyRes = await fetch(`${PYTHON_AI_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (pyRes.ok) {
      const data = await pyRes.json();
      return NextResponse.json({
        success: true,
        reply: data.reply,
        engine: 'python-rag',
        confidence: data.confidence,
        sources: data.sources,
        suggestions: data.suggestions,
        intent: data.intent,
        reasoning_mode: data.reasoning_mode,
      });
    }
  } catch (error) {
    // Python service chưa chạy hoặc đang offline -> dùng fallback thông minh
  }

  // 2. Dự phòng phản hồi tức thì nếu Python service chưa bật
  const reply = fallbackReply(message);
  return NextResponse.json({
    success: true,
    reply,
    engine: 'local-fallback',
  });
}
