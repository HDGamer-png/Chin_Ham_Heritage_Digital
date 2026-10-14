"""
Agent 4: REASONER — Bộ Suy Luận & Tổng Hợp Câu Trả Lời
Tiếp nhận dữ liệu từ Retriever và ngữ cảnh từ Orchestrator,
áp dụng suy luận logic thay vì copy nguyên văn thô sơ.
"""
import re
from typing import List, Dict, Any, Optional
from engine.fact_extractor import FactExtractor
from engine.reasoning_templates import ReasoningTemplates
from engine.text_normalizer import normalize_text, remove_vietnamese_accents

class Reasoner:
    """Agent suy luận và tái cấu trúc câu trả lời có tính logic"""

    def synthesize(self, context: Dict, retrieved: List[Dict]) -> Dict[str, Any]:
        """
        Tổng hợp câu trả lời dựa trên intent và dữ liệu truy hồi.
        Trả về:
        {
            "raw_answer": str,
            "confidence": float,
            "sources": List[str],
            "reasoning_mode": str
        }
        """
        intent = context.get("intent", "factual")
        entities = context.get("entities", [])
        query = context.get("original_query", "")

        # 1. Kiểm tra trường hợp không có dữ liệu truy hồi
        if not retrieved or retrieved[0]["score"] < 0.15:
            return self._handle_fallback(query)

        top_chunk = retrieved[0]["chunk"]
        top_score = retrieved[0]["score"]
        
        # Tập hợp nguồn tài liệu
        sources = []
        for item in retrieved[:3]:
            chunk = item["chunk"]
            src = f"{chunk.source_file} (Mục: {chunk.section_title})"
            if src not in sources:
                sources.append(src)

        # 2. Điều phối suy luận theo Intent
        target_tunnel = context.get("target_tunnel")

        if intent == "cause":
            raw_answer = self._reason_cause(query, entities, retrieved)
            mode = "causality_reasoning"
        elif intent == "person" and ("ngo_dinh_can" in entities or "cẩn" in query.lower()):
            raw_answer = self._reason_person_ngo_dinh_can(retrieved)
            mode = "person_profile"
        elif intent == "compare":
            raw_answer = self._reason_comparison(query, entities, retrieved)
            mode = "comparative_analysis"
        elif target_tunnel:
            raw_answer = self._reason_tunnel_details(target_tunnel, query, retrieved)
            mode = f"tunnel_{target_tunnel}_details"
        elif intent == "timeline":
            raw_answer = self._reason_timeline(query, retrieved)
            mode = "chronological_timeline"
        elif intent == "list":
            raw_answer = self._reason_list(query, entities, retrieved)
            mode = "structured_listing"
        elif intent == "guide":
            raw_answer = self._reason_guide(query, retrieved)
            mode = "visit_guidance"
        else:
            raw_answer = self._reason_factual(query, entities, retrieved, context)
            mode = "factual_synthesis"

        return {
            "raw_answer": raw_answer,
            "confidence": min(1.0, round(float(top_score), 3)),
            "sources": sources,
            "reasoning_mode": mode
        }

    # ═══════════════════════════════════════════════════════════
    # 1. SUY LUẬN NHÂN QUẢ (CAUSE)
    # ═══════════════════════════════════════════════════════════
    def _reason_cause(self, query: str, entities: List[str], retrieved: List[Dict]) -> str:
        q_lower = query.lower()
        
        # Trường hợp: Tại sao gọi là chuồng cọp?
        if "chuồng cọp" in q_lower or "chuong cop" in q_lower or "ham_4" in entities:
            topic = "tên gọi 'Chuồng Cọp' của Hầm số 4"
            reasons = [
                "Ngô Đình Cẩn cho dùng gỗ thông và khung sắt chia nhỏ lòng hầm thành hàng chục ngăn xà lim cực kỳ chật hẹp, mỗi ngăn chỉ rộng chừng 1.2m x 0.8m.",
                "Tù nhân bị nhốt bên trong phải sống trong tư thế co quắp suốt ngày đêm, không thể đứng thẳng hay duỗi thẳng chân, bị cùm sắt răng cưa khóa chặt chân.",
                "Không gian ngột ngạt thiếu dưỡng khí, ẩm thấp nồng nặc mùi hôi thối và chất thải cá nhân xả tại chỗ tương tự các chuồng thú nuôi, khiến da thịt bị lở loét hoại tử."
            ]
            outcome = "Chính sự giam cầm tàn bạo, biến con người thành sinh vật bị đày ải trong các cũi chật hẹp đã khiến căn hầm này mang tên gọi khét tiếng 'Chuồng Cọp' — biểu tượng của sự dã man thời Ngô Đình Cẩn."
            return ReasoningTemplates.render_cause(topic, reasons, outcome)

        # Trường hợp: Tại sao Ngô Đình Cẩn chọn Chín Hầm làm nhà tù?
        if "ngô đình cẩn" in q_lower or "ngo_dinh_can" in entities or "nhà tù" in q_lower or "địa ngục" in q_lower:
            topic = "việc Ngô Đình Cẩn chọn Chín Hầm làm khu biệt giam bí mật"
            reasons = [
                "Vị trí đồi Thiên Thai hoang vu hiểm trở, nằm tách biệt cách xa trung tâm Huế khoảng 6km, rất thuận tiện để cách ly hoàn toàn với dư luận xã hội.",
                "Cụm 9 căn hầm kiên cố bằng bê tông cốt thép do Pháp xây từ năm 1941 nằm nửa chìm nửa nổi dưới lòng đồi, có khả năng che giấu tuyệt đối không để lộ từ trên không.",
                "Hệ thống không nằm trong danh sách các nhà tù chính thức của chính quyền Sài Gòn, cho phép mật vụ Ngô Đình Cẩn thủ tiêu, tra tấn tù nhân mà không chịu bất kỳ sự giám sát tư pháp nào."
            ]
            outcome = "Chín Hầm đã bị biến thành một 'địa ngục trần gian' hoạt động ngoài vòng pháp luật, giam giữ hàng ngàn chiến sĩ và đồng bào yêu nước."
            return ReasoningTemplates.render_cause(topic, reasons, outcome)

        # Trích xuất tổng quát dựa trên fact extractor
        combined_text = " ".join([item["chunk"].content for item in retrieved[:2]])
        causal_sents = FactExtractor.find_causality_sentences(combined_text)
        
        if causal_sents:
            topic = retrieved[0]["chunk"].section_title
            return ReasoningTemplates.render_cause(topic, causal_sents[:3])
            
        return self._reason_factual(query, entities, retrieved)

    # ═══════════════════════════════════════════════════════════
    # 2. SUY LUẬN TIỂU SỬ NHÂN VẬT (PERSON - NGÔ ĐÌNH CẨN)
    # ═══════════════════════════════════════════════════════════
    def _reason_person_ngo_dinh_can(self, retrieved: List[Dict]) -> str:
        name = "Ngô Đình Cẩn (1911 – 1964)"
        role = "'Cố vấn chỉ đạo miền Trung' — em trai Ngô Đình Diệm & Ngô Đình Nhu, được mệnh danh là 'Bạo chúa miền Trung'."
        details = [
            "Đóng sào huyệt tại dinh thự số 4 đường Nhà Đồ (gần cửa Thượng Tứ, Huế), nắm toàn quyền sinh sát tuyệt đối dải đất từ Quảng Trị vào tới Bình Định và Tây Nguyên.",
            "Chỉ huy tổ chức mật vụ khét tiếng 'Đoàn Công tác Đặc biệt Miền Trung' (do Dương Văn Hiếu cầm đầu), lập mạng lưới chỉ điểm triệt hạ các lực lượng đối lập và cộng sản.",
            "Lợi dụng quyền lực độc quyền các ngành kinh tế béo bở (gạo, gỗ, trầm hương, quế, thuốc phiện) để gây dựng ngân quỹ riêng.",
            "Biến khu kho đạn Chín Hầm thành ngục tối bí mật ngoài vòng pháp luật từ năm 1954, áp dụng các đòn tra tấn man rợ như cùm sắt, ép ngạt thở, xà lim chuồng cọp."
        ]
        downfall = "Sau cuộc đảo chính lật đổ Ngô Đình Diệm ngày 01/11/1963, Cẩn tìm cách lẩn trốn nhưng bị bắt giao nộp cho Hội đồng Quân nhân Cách mạng. Tháng 4/1964, Tòa án Cách mạng tuyên phạt tử hình; ngày 09/05/1964 bản án được thi hành tại Khám Chí Hòa (Sài Gòn)."
        
        return ReasoningTemplates.render_person_profile(name, role, details, downfall)

    # ═══════════════════════════════════════════════════════════
    # 3. SUY LUẬN SO SÁNH (COMPARE)
    # ═══════════════════════════════════════════════════════════
    def _reason_comparison(self, query: str, entities: List[str], retrieved: List[Dict]) -> str:
        q_lower = query.lower()
        
        # So sánh Hầm 1 và Hầm 4
        is_ham1 = "ham_1" in entities or bool(re.search(r'h[aầ]m\s*(?:s[oố]\s*)?1\b', q_lower))
        is_ham4 = "ham_4" in entities or bool(re.search(r'h[aầ]m\s*(?:s[oố]\s*)?4\b', q_lower))
        
        if is_ham1 and is_ham4:
            item_a = {
                "name": "Hầm số 1 (Kho Đạn Lớn Nhất)",
                "attributes": {
                    "Vị trí": "Sườn Tây Nam, gần lối vào Trung tâm Văn hóa Huyền Trân",
                    "Kích thước": "Khoảng 10m × 8m × 3.5m (Quy mô lớn nhất trong 9 hầm)",
                    "Thời Pháp (1941)": "Kho chứa đại bác và đạn pháo chiến lược",
                    "Thời Ngô Đình Cẩn": "Giam giữ tập thể tù nhân trước khi phân loại đi biệt giam",
                    "Đặc điểm chính": "Diện tích rộng, là cửa ngõ tập trung tù nhân ban đầu"
                },
                "summary": "Căn hầm lớn nhất, đóng vai trò tập trung và phân loại tù nhân."
            }
            item_b = {
                "name": "Hầm số 4 (Chuồng Cọp)",
                "attributes": {
                    "Vị trí": "Góc trong của đường vòng cung sườn Tây Bắc",
                    "Kích thước": "Chia thành hàng chục ngăn xà lim nhỏ (1.2m × 0.8m)",
                    "Thời Pháp (1941)": "Kho đạn bê tông cốt thép chìm trong sườn đồi",
                    "Thời Ngô Đình Cẩn": "Trại giam khét tiếng tàn bạo nhất, cùm sắt co quắp ngày đêm",
                    "Đặc điểm chính": "Biểu tượng tột cùng của sự dã man và đày ải thể xác"
                },
                "summary": "Căn hầm tàn khốc nhất, nơi tù nhân bị co quắp trong các ô gỗ sắt."
            }
            return ReasoningTemplates.render_comparison("Hầm số 1 vs Hầm số 4", item_a, item_b)

        # So sánh tổng quát giữa các chunks liên quan
        if len(retrieved) >= 2:
            c1 = retrieved[0]["chunk"]
            c2 = retrieved[1]["chunk"]
            item_a = {
                "name": c1.section_title,
                "attributes": {
                    "Nguồn tài liệu": c1.source_file,
                    "Thông tin chủ đạo": FactExtractor.extract_sentences(c1.content)[0] if c1.content else "—"
                },
                "summary": c1.content[:160] + "..."
            }
            item_b = {
                "name": c2.section_title,
                "attributes": {
                    "Nguồn tài liệu": c2.source_file,
                    "Thông tin chủ đạo": FactExtractor.extract_sentences(c2.content)[0] if c2.content else "—"
                },
                "summary": c2.content[:160] + "..."
            }
            return ReasoningTemplates.render_comparison(f"{c1.section_title} và {c2.section_title}", item_a, item_b)

        return self._reason_factual(query, entities, retrieved)

    # ═══════════════════════════════════════════════════════════
    # 4. SUY LUẬN DÒNG THỜI GIAN (TIMELINE)
    # ═══════════════════════════════════════════════════════════
    def _reason_timeline(self, query: str, retrieved: List[Dict]) -> str:
        events = [
            {
                "time": "Năm 1941",
                "description": "Quân đội thực dân Pháp chiếm đồi Thiên Thai, cho đúc 9 căn hầm bê tông cốt thép kiên cố làm kho cất giấu vũ khí, bom đạn quân sự đối phó phát xít Nhật."
            },
            {
                "time": "Năm 1954",
                "description": "Sau Hiệp định Genève, Ngô Đình Cẩn chiếm giữ đồi Thiên Thai, bí mật rào thép gai, biến cụm kho đạn thành hệ thống ngục tù biệt giam ngoài vòng pháp luật."
            },
            {
                "time": "1954 – 1963",
                "description": "Giai đoạn đày ải đen tối nhất: Mật vụ Ngô Đình Cẩn biến Chín Hầm thành địa ngục trần gian, bắt giữ hàng ngàn chiến sĩ cách mạng, tôn giáo và trí thức yêu nước."
            },
            {
                "time": "Ngày 01/11/1963",
                "description": "Cuộc đảo chính quân sự tại Sài Gòn bùng nổ, lật đổ anh em Ngô Đình Diệm – Ngô Đình Nhu. Ngô Đình Cẩn tại Huế hoảng sợ bỏ trốn nhưng bị bắt giữ."
            },
            {
                "time": "Ngày 02/11/1963",
                "description": "Hàng vạn đồng bào, phật tử, sinh viên và nhân dân Thừa Thiên Huế cùng lực lượng cách mạng tiến lên đồi Thiên Thai phá tan xiềng xích Chín Hầm, giải cứu các chiến sĩ còn sống sót."
            },
            {
                "time": "Ngày 09/05/1964",
                "description": "Bản án tử hình bạo chúa Ngô Đình Cẩn được Tòa án Cách mạng thi hành tại Khám Chí Hòa (Sài Gòn), khép lại chuỗi ngày tội ác."
            }
        ]
        return ReasoningTemplates.render_timeline("Lịch sử Khu Di tích Chín Hầm (1941 – 1964)", events)

    # ═══════════════════════════════════════════════════════════
    # 5. SUY LUẬN DANH SÁCH (LIST)
    # ═══════════════════════════════════════════════════════════
    def _reason_list(self, query: str, entities: List[str], retrieved: List[Dict]) -> str:
        q_lower = query.lower()
        if "9 hầm" in q_lower or "chín hầm" in q_lower or "các căn hầm" in q_lower:
            items = [
                "**Hầm số 1**: Quy mô lớn nhất (10m x 8m x 3.5m) ở sườn Tây Nam, ban đầu chứa đại bác Pháp, sau là nơi giam giữ tập thể tù nhân.",
                "**Hầm số 2**: Nằm sườn đồi phía Nam liền kề khúc uốn chữ U, nơi diễn ra các cuộc tra tấn và hỏi cung ban đầu.",
                "**Hầm số 3**: Cách Hầm 2 khoảng 45m về sườn Đông Nam, khu biệt giam thiếu sáng và vô cùng thiếu thốn điều kiện sống.",
                "**Hầm số 4 (Chuồng Cọp)**: Khét tiếng tàn bạo nhất, bị ngăn bằng gỗ sắt thành các ô xà lim hẹp 1.2m x 0.8m, tù nhân bị cùm chân co quắp.",
                "**Hầm số 5**: Nằm tại khúc cua cực Đông nhìn sang Lăng Khải Định, nơi giam giữ các tù nhân chính trị đặc biệt.",
                "**Hầm số 6 & 7**: Trải dài trên sườn dốc phía Bắc dưới tán thông già, thời tiết mùa đông buốt lạnh, mùa hè ngột ngạt.",
                "**Hầm số 8**: Nằm sườn Tây Bắc giáp Thủy Phương, hầm biệt giam nghiêm ngặt giam giữ trí thức, sinh viên, cán bộ lãnh đạo.",
                "**Hầm số 9**: Nằm chính giữa khúc uốn chữ U tại vị trí cao nhất, đầu não kiểm soát an ninh toàn bộ đồi Thiên Thai."
            ]
            return ReasoningTemplates.render_list("Hệ thống 9 Căn Hầm trên Đồi Thiên Thai", items)

        # Danh sách chung từ các chunk tìm thấy
        items = []
        for it in retrieved[:4]:
            chunk = it["chunk"]
            clean_s = FactExtractor.extract_sentences(chunk.content)
            desc = clean_s[0] if clean_s else chunk.content[:100]
            items.append(f"**{chunk.section_title}**: {desc}")
            
        return ReasoningTemplates.render_list("Các nội dung tư liệu liên quan", items)

    # ═══════════════════════════════════════════════════════════
    # 6. SUY LUẬN HƯỚNG DẪN THAM QUAN (GUIDE)
    # ═══════════════════════════════════════════════════════════
    def _reason_guide(self, query: str, retrieved: List[Dict]) -> str:
        title = "Lộ trình tham quan Khu Di tích Lịch sử Chín Hầm"
        steps = [
            "**Khu Đón Tiếp & Nhà Chứng Tích**: Xem sa bàn điện tử tổng quan toàn bộ đồi Thiên Thai, tiếp cận các hiện vật cùm sắt, xiềng xích và hình ảnh phục dựng cuộc sống ngục tù.",
            "**Khu Đài Tưởng Niệm & Bia Di Tích**: Thắp hương tri ân các anh hùng liệt sĩ, đồng bào yêu nước đã hy sinh vì nền độc lập tự do.",
            "**Tuyến Tham Quan 9 Căn Hầm Trong Rừng Thông**: Bắt đầu từ Hầm 1 men theo lối mòn đồi thông qua Hầm 2, 3, lên tâm điểm Hầm 4 Chuồng Cọp, tiếp tục khám phá các Hầm 5 đến 9 trên cao độ đỉnh đồi.",
            "**Trải Nghiệm Audio Guide Thuyết Minh Tự Động**: Quét mã QR tại từng cột mốc biển tên để nghe tường thuật chi tiết từng câu chuyện lịch sử."
        ]
        notes = [
            "Địa chỉ di tích: Đồi Thiên Thai, phường An Tây, TP. Huế (gần Trung tâm Văn hóa Huyền Trân, cách trung tâm Huế 6km).",
            "Nên mang giày thể thao hoặc đế mềm vì địa hình đồi dốc tự nhiên lát đá bậc tam cấp.",
            "Giữ trật tự, trang nghiêm và tôn trọng không gian thiêng liêng của di tích lịch sử."
        ]
        return ReasoningTemplates.render_guide(title, steps, notes)

    # ═══════════════════════════════════════════════════════════
    # 7. CHI TIẾT CĂN HẦM CỤ THỂ (TUNNEL DETAILS)
    # ═══════════════════════════════════════════════════════════
    def _reason_tunnel_details(self, tunnel_num: str, query: str, retrieved: List[Dict]) -> str:
        """Trích xuất và lập luận chi tiết chính xác về căn hầm được hỏi (Hầm 1 đến Hầm 9)"""
        # Ưu tiên 1: Tiêu đề chunk chứa chính xác số hầm
        for item in retrieved:
            chunk = item["chunk"]
            norm_title = normalize_text(chunk.section_title)
            if f"hầm số {tunnel_num}" in norm_title or f"hầm {tunnel_num}" in norm_title:
                target_chunk = chunk
                break
        
        # Ưu tiên 2: Thực thể khớp
        if not target_chunk:
            for item in retrieved:
                chunk = item["chunk"]
                if f"ham_{tunnel_num}" in chunk.entities or f"ham {tunnel_num}" in chunk.entities:
                    target_chunk = chunk
                    break
        
        if not target_chunk:
            target_chunk = retrieved[0]["chunk"]

        lines = []
        lines.append(f"Dựa trên hồ sơ tư liệu lịch sử về **{target_chunk.section_title}**:")
        lines.append("")

        for line in target_chunk.content.split('\n'):
            line_str = line.strip()
            if line_str:
                if not line_str.startswith('•') and not line_str.startswith('-'):
                    lines.append(f"• {line_str}")
                else:
                    lines.append(line_str)

        return "\n".join(lines)

    # ═══════════════════════════════════════════════════════════
    # 8. TỔNG HỢP SỰ KIỆN CỤ THỂ (FACTUAL SYNTHESIS)
    # ═══════════════════════════════════════════════════════════
    def _reason_factual(self, query: str, entities: List[str], retrieved: List[Dict], context: Optional[Dict] = None) -> str:
        top_chunk = retrieved[0]["chunk"]
        
        # Chọn lọc các câu văn có giá trị thông tin cao nhất
        keywords = query.split()
        relevant_sentences = FactExtractor.filter_relevant_sentences(top_chunk.content, keywords, max_count=4)
        
        lines = []
        lines.append(f"Dựa trên hồ sơ tư liệu lịch sử về **{top_chunk.section_title}**:")
        lines.append("")
        
        if relevant_sentences:
            for s in relevant_sentences:
                lines.append(f"• {s}")
        else:
            lines.append(top_chunk.content.strip())
            
        # Nếu có chunk thứ 2 có độ tương đồng cao, CHỈ thêm bổ trợ nếu KHÔNG phải hỏi hầm riêng biệt
        target_tunnel = context.get("target_tunnel") if context else None
        if not target_tunnel and len(retrieved) > 1 and retrieved[1]["score"] >= retrieved[0]["score"] * 0.7:
            second_chunk = retrieved[1]["chunk"]
            second_sentences = FactExtractor.filter_relevant_sentences(second_chunk.content, keywords, max_count=2)
            if second_sentences:
                lines.append("")
                lines.append(f"📌 *Thông tin bổ trợ từ **{second_chunk.section_title}**:*")
                for s in second_sentences:
                    lines.append(f"• {s}")
                    
        return "\n".join(lines)

    # ═══════════════════════════════════════════════════════════
    # FALLBACK KHI KHÔNG TÌM THẤY DỮ LIỆU
    # ═══════════════════════════════════════════════════════════
    def _handle_fallback(self, query: str) -> Dict[str, Any]:
        msg = (
            "Hiện tại trong nguồn tư liệu Chín Hầm tôi chưa tìm thấy nội dung chi tiết cho câu hỏi này.\n\n"
            "Bạn có thể thử hỏi cụ thể hơn về:\n"
            "• Nhân vật Ngô Đình Cẩn và chế độ cai trị tại miền Trung\n"
            "• Cấu trúc từng căn hầm (Hầm 1 đến Hầm 9)\n"
            "• Sự kiện ngày 02/11/1963 phá tan xiềng xích giải cứu tù nhân\n"
            "• Lộ trình tham quan Nhà Chứng Tích hoặc Audio Guide thuyết minh."
        )
        return {
            "raw_answer": msg,
            "confidence": 0.0,
            "sources": [],
            "reasoning_mode": "fallback"
        }
