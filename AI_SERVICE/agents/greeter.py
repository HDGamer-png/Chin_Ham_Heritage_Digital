"""
Agent 3: GREETER — Xử lý chào hỏi xã giao
Tạo phản hồi thân thiện khi người dùng chào hỏi hoặc hỏi về trợ lý.
"""
import random
import sys

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass


class Greeter:
    """Agent xử lý chào hỏi xã giao & giới thiệu trợ lý"""

    # Các mẫu chào hỏi được chọn ngẫu nhiên để tạo cảm giác tự nhiên
    GREETINGS = [
        (
            "Xin chào! 👋 Tôi là **Trợ lý AI Di sản** của Khu Di tích Lịch sử Chín Hầm (Huế).\n\n"
            "Tôi được xây dựng dựa trên hệ thống hồ sơ tư liệu lịch sử bao gồm:\n"
            "• 📜 Lịch sử 9 căn hầm từ thời Pháp (1941) đến thời Ngô Đình Cẩn (1954–1963)\n"
            "• ⛓️ Chế độ ngục tối, chuồng cọp và các thủ đoạn tra tấn tàn khốc\n"
            "• 🔓 Sự kiện phá hầm giải phóng ngày 02/11/1963\n"
            "• 🏛️ Không gian Nhà Chứng Tích, Đài Tưởng Niệm và hướng dẫn tham quan\n\n"
            "Hãy hỏi tôi bất kỳ điều gì về Chín Hầm — tôi sẵn sàng đồng hành cùng bạn!"
        ),
        (
            "Chào bạn! 🌿 Tôi là Trợ lý AI chuyên về **Khu Di tích Lịch sử Chín Hầm** — "
            "một trong những địa chỉ đỏ thiêng liêng nhất trên dải đất Cố đô Huế.\n\n"
            "Tôi có thể giúp bạn tìm hiểu về:\n"
            "• Lịch sử xây dựng và cấu trúc kiến trúc của 9 căn hầm\n"
            "• Nhân vật lịch sử Ngô Đình Cẩn và bộ máy mật vụ miền Trung\n"
            "• Sự kiện đảo chính 1963 và ngày phá hầm giải phóng\n"
            "• Lộ trình tham quan, Nhà Chứng Tích và Audio Guide\n\n"
            "Bạn muốn bắt đầu từ đâu?"
        ),
    ]

    # Gợi ý câu hỏi mở đầu
    DEFAULT_SUGGESTIONS = [
        "Ngô Đình Cẩn là ai và có vai trò gì ở Chín Hầm?",
        "Hầm số 4 chuồng cọp có kết cấu như thế nào?",
        "Sự kiện phá hầm ngày 02/11/1963 diễn ra ra sao?",
        "Lộ trình tham quan 9 căn hầm bắt đầu từ đâu?",
        "Tại sao Hầm 4 được gọi là chuồng cọp?",
        "Chín Hầm được xây năm nào và do ai xây?",
    ]

    def respond(self) -> dict:
        """Tạo phản hồi chào hỏi"""
        greeting = random.choice(self.GREETINGS)
        suggestions = random.sample(self.DEFAULT_SUGGESTIONS, min(4, len(self.DEFAULT_SUGGESTIONS)))

        print("[Greeter] Xử lý chào hỏi xã giao")
        return {
            "reply": greeting,
            "confidence": 1.0,
            "sources": [],
            "suggestions": suggestions,
        }
