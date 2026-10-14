"""
Module tổng hợp và định dạng câu trả lời tự nhiên (Answer Synthesizer)
Tạo phản hồi chuẩn văn phong lịch sử, trích dẫn nguồn tư liệu và gợi ý câu hỏi tiếp theo
"""
from typing import List, Tuple
from .document_loader import DocumentChunk
from .text_normalizer import remove_vietnamese_accents

GREETING_KEYWORDS = ['chào', 'xin chào', 'hello', 'hi', 'bạn là ai', 'giới thiệu', 'trợ lý']

class AnswerSynthesizer:
    def __init__(self):
        pass

    def synthesize(self, query: str, scored_chunks: List[Tuple[DocumentChunk, float]]) -> dict:
        """Tổng hợp câu trả lời từ các đoạn tư liệu đã truy hồi"""
        clean_query = query.strip()
        lower_no_acc = remove_vietnamese_accents(clean_query.lower())

        # 1. Xử lý câu chào hỏi xã giao
        if any(w in lower_no_acc for w in ['xin chao', 'chao ban', 'hello', 'hi', 'ban la ai', 'tro ly la ai']):
            return {
                "reply": (
                    "Xin chào! Tôi là Trợ lý AI Di sản của Khu Di tích Lịch sử Chín Hầm (Huế).\n\n"
                    "Tôi được huấn luyện dựa trên toàn bộ hệ thống hồ sơ tư liệu về:\n"
                    "• Lịch sử 9 căn hầm xây dựng từ thời Pháp (1941) đến thời Ngô Đình Cẩn (1954–1963)\n"
                    "• Tội ác ngục tù chuồng cọp và các nhân vật lịch sử bị đày ải\n"
                    "• Sự kiện giải phóng, phá hầm ngày 02/11/1963\n"
                    "• Không gian Nhà Chứng Tích, Đài Tưởng Niệm và hướng dẫn tham quan.\n\n"
                    "Bạn muốn tìm hiểu thông tin gì về Chín Hầm hôm nay?"
                ),
                "confidence": 1.0,
                "sources": [],
                "suggestions": [
                    "Ngô Đình Cẩn là ai và có vai trò gì ở Chín Hầm?",
                    "Hầm số 4 chuồng cọp có kết cấu như thế nào?",
                    "Sự kiện phá hầm ngày 02/11/1963 diễn ra ra sao?",
                    "Lộ trình tham quan 9 căn hầm bắt đầu từ đâu?"
                ]
            }

        # 2. Nếu không tìm thấy đoạn tư liệu nào đạt ngưỡng tin cậy
        if not scored_chunks or scored_chunks[0][1] < 0.18:
            return {
                "reply": (
                    "Hiện tại trong nguồn tư liệu Chín Hầm tôi chưa tìm thấy nội dung chi tiết cho câu hỏi này.\n\n"
                    "Bạn có thể thử hỏi cụ thể hơn về:\n"
                    "• Nhân vật Ngô Đình Cẩn và chế độ cai trị tại miền Trung\n"
                    "• Cấu trúc từng căn hầm (Hầm 1 đến Hầm 9)\n"
                    "• Sự kiện ngày 02/11/1963 phá tan xiềng xích\n"
                    "• Nhà Chứng Tích hoặc Audio Guide thuyết minh."
                ),
                "confidence": scored_chunks[0][1] if scored_chunks else 0.0,
                "sources": [],
                "suggestions": [
                    "Ngô Đình Cẩn là ai?",
                    "Hầm số 1 được xây năm nào?",
                    "Hầm số 4 chuồng cọp",
                    "Ngày phá hầm 02/11/1963"
                ]
            }

        # 3. Tổng hợp nội dung từ các đoạn tài liệu có điểm số cao nhất
        best_chunk, top_score = scored_chunks[0]

        # Lọc các đoạn bổ trợ có điểm số tốt (score >= top_score * 0.6)
        relevant_chunks = [c for c, score in scored_chunks if score >= max(0.2, top_score * 0.55)]

        response_parts = []
        sources = []

        # Mở đầu tự nhiên
        response_parts.append(f"Theo tài liệu lịch sử về **{best_chunk.section_title}**:")
        response_parts.append("")

        for idx, chunk in enumerate(relevant_chunks):
            # Trích dẫn nội dung chính
            content_cleaned = chunk.content.strip()
            response_parts.append(content_cleaned)
            response_parts.append("")

            src_label = f"{chunk.source_file} (Mục: {chunk.section_title})"
            if src_label not in sources:
                sources.append(src_label)

        # Trích dẫn nguồn tài liệu cuối câu trả lời
        response_parts.append("---")
        response_parts.append(f"📚 *Nguồn tư liệu tham chiếu: {', '.join(sources)}*")

        full_reply = "\n".join(response_parts)

        # Gợi ý câu hỏi tiếp theo dựa trên thực thể tìm được
        suggestions = self._generate_suggestions(best_chunk)

        return {
            "reply": full_reply,
            "confidence": round(float(top_score), 3),
            "sources": sources,
            "suggestions": suggestions
        }

    def _generate_suggestions(self, chunk: DocumentChunk) -> list[str]:
        suggestions = []
        if 'ngo dinh can' in chunk.entities:
            suggestions.extend(["Ngô Đình Cẩn đã biến Chín Hầm thành ngục tối như thế nào?", "Tòa án cách mạng xét xử Ngô Đình Cẩn ra sao?"])
        if 'ham 4' in chunk.entities or 'chuong cop' in chunk.entities:
            suggestions.extend(["Tại sao Hầm số 4 được gọi là chuồng cọp?", "Ai từng bị giam cầm tại Hầm 4?"])
        if 'ham 1' in chunk.entities:
            suggestions.extend(["Hầm số 1 có kích thước bao nhiêu?", "Năm 1941 thực dân Pháp xây dựng Chín Hầm để làm gì?"])
        if 'pha ham 1963' in chunk.entities:
            suggestions.extend(["Ngày 02/11/1963 có bao nhiêu tù nhân được cứu sống?", "Quần chúng nhân dân Huế tham gia phá hầm thế nào?"])

        if not suggestions:
            suggestions = [
                "Kể cho tôi nghe về Ngô Đình Cẩn",
                "Kết cấu Hầm số 4 chuồng cọp",
                "Sự kiện phá hầm ngày 02/11/1963",
                "Cách tham quan Nhà Chứng Tích"
            ]

        return suggestions[:3]
