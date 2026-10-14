"""
Agent 5: FORMATTER — Định Dạng, Kiểm Chứng Nguồn & Gợi Ý Tiếp Theo
Chuẩn hóa văn bản cuối cùng, kiểm định nguồn tư liệu và đề xuất câu hỏi khám phá.
"""
from typing import Dict, List, Any
import re

class Formatter:
    """Agent định dạng đầu ra cho UI người dùng và kiểm chứng dữ liệu"""

    def format(self, context: Dict, reasoned: Dict[str, Any]) -> Dict[str, Any]:
        """
        Chuẩn hóa câu trả lời cuối cùng từ Reasoner.
        Trả về payload khớp chuẩn API Frontend:
        {
            "reply": str,
            "confidence": float,
            "sources": List[str],
            "suggestions": List[str]
        }
        """
        raw_answer = reasoned.get("raw_answer", "").strip()
        confidence = reasoned.get("confidence", 0.0)
        sources = reasoned.get("sources", [])
        mode = reasoned.get("reasoning_mode", "factual")
        entities = context.get("entities", [])
        intent = context.get("intent", "factual")

        # 1. Thêm nguồn tư liệu minh bạch vào cuối câu trả lời nếu có
        lines = [raw_answer]
        if sources and mode != "fallback":
            lines.append("")
            lines.append("---")
            lines.append(f"📚 *Nguồn tư liệu tham chiếu: {', '.join(sources)}*")

        full_reply = "\n".join(lines)

        # 2. Sinh danh sách câu hỏi gợi ý thông minh dựa trên bối cảnh
        suggestions = self._generate_smart_suggestions(intent, entities, mode)

        return {
            "reply": full_reply,
            "confidence": confidence,
            "sources": sources,
            "suggestions": suggestions
        }

    def _generate_smart_suggestions(self, intent: str, entities: List[str], mode: str) -> List[str]:
        """Sinh 3 câu hỏi gợi ý phù hợp nhất với chủ đề vừa trả lời"""
        suggestions = []

        if "ham_4" in entities or "chuong_cop" in entities:
            suggestions = [
                "Tại sao Hầm số 4 được gọi là chuồng cọp?",
                "Ai từng bị đày ải và hy sinh tại Hầm số 4?",
                "Sự kiện phá hầm ngày 02/11/1963 giải cứu những ai?"
            ]
        elif "ngo_dinh_can" in entities:
            suggestions = [
                "Mật vụ Đoàn Công tác Đặc biệt Miền Trung hoạt động như thế nào?",
                "Kết cục của Ngô Đình Cẩn sau đảo chính 1963 ra sao?",
                "Hầm số 4 chuồng cọp có kết cấu dã man thế nào?"
            ]
        elif "pha_ham_1963" in entities or intent == "timeline":
            suggestions = [
                "Quần chúng nhân dân Huế tham gia phá hầm ngày 02/11/1963 ra sao?",
                "Số phận Ngô Đình Cẩn sau khi Chín Hầm được giải phóng?",
                "Xem lộ trình tham quan di tích Chín Hầm hiện nay"
            ]
        elif "ham_1" in entities:
            suggestions = [
                "So sánh Hầm số 1 và Hầm số 4 chuồng cọp",
                "Năm 1941 thực dân Pháp xây Chín Hầm để làm gì?",
                "Toàn bộ 9 căn hầm nằm ở những vị trí nào trên đồi Thiên Thai?"
            ]
        elif intent == "guide" or "tham_quan" in entities:
            suggestions = [
                "Nhà Chứng Tích Chín Hầm trưng bày những hiện vật gì?",
                "Lộ trình đi bộ tham quan 9 căn hầm trong rừng thông?",
                "Nghe Audio Guide thuyết minh di tích ở đâu?"
            ]
        elif intent == "compare":
            suggestions = [
                "Kể tên chi tiết tất cả 9 căn hầm trên đồi Thiên Thai",
                "Tại sao Hầm 4 là nơi tàn khốc nhất?",
                "Tội ác của Ngô Đình Cẩn tại Chín Hầm"
            ]
        else:
            suggestions = [
                "Ngô Đình Cẩn là ai và có vai trò gì ở Chín Hầm?",
                "Tại sao Hầm số 4 lại gọi là 'chuồng cọp'?",
                "Sự kiện ngày 02/11/1963 diễn ra như thế nào?",
                "Lộ trình tham quan 9 căn hầm bắt đầu từ đâu?"
            ]

        return suggestions[:3]
