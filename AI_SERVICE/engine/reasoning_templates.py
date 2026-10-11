"""
Engine: Reasoning Templates — Các cấu trúc và khuôn mẫu suy luận logic
Biến đổi các sự kiện rời rạc thành câu trả lời có tính lập luận, hành văn chuẩn lịch sử.
"""
from typing import List, Dict, Any, Optional

class ReasoningTemplates:
    """Định hình câu trả lời theo logic đặc thù của từng loại câu hỏi"""

    @staticmethod
    def render_cause(topic: str, reasons: List[str], outcome: Optional[str] = None) -> str:
        """Khuôn mẫu suy luận Nhân - Quả (Tại sao / Vì sao / Lý do gì)"""
        lines = []
        lines.append(f"Về nguyên nhân và lý do liên quan đến **{topic}**:")
        lines.append("")
        
        for idx, r in enumerate(reasons, 1):
            lines.append(f"• **{r.strip()}**" if not r.startswith("•") else r)
            
        if outcome:
            lines.append("")
            lines.append(f"👉 **Kết quả / Ý nghĩa lịch sử**: {outcome}")
        return "\n".join(lines)

    @staticmethod
    def render_person_profile(name: str, role: str, details: List[str], downfall: Optional[str] = None) -> str:
        """Khuôn mẫu tóm tắt tiểu sử và vai trò nhân vật lịch sử"""
        lines = []
        lines.append(f"### 👤 Thông tin về nhân vật: **{name}**")
        lines.append("")
        lines.append(f"• **Chức vụ / Vị thế**: {role}")
        lines.append("")
        lines.append("• **Hành động & Dấu ấn tại Chín Hầm**:")
        for d in details:
            clean_d = d.strip()
            if clean_d:
                lines.append(f"  - {clean_d}")
        
        if downfall:
            lines.append("")
            lines.append(f"• **Kết cục lịch sử**: {downfall}")
            
        return "\n".join(lines)

    @staticmethod
    def render_comparison(title: str, item_a: Dict[str, Any], item_b: Dict[str, Any]) -> str:
        """Khuôn mẫu so sánh, đối chiếu song song giữa 2 thực thể"""
        lines = []
        lines.append(f"### ⚖️ So sánh đối chiếu: **{title}**")
        lines.append("")
        lines.append(f"| Tiêu chí | **{item_a.get('name', 'Mục A')}** | **{item_b.get('name', 'Mục B')}** |")
        lines.append("|---|---|---|")
        
        keys = list(item_a.get('attributes', {}).keys())
        for k in keys:
            val_a = item_a.get('attributes', {}).get(k, "—")
            val_b = item_b.get('attributes', {}).get(k, "—")
            lines.append(f"| **{k}** | {val_a} | {val_b} |")
            
        if item_a.get('summary') or item_b.get('summary'):
            lines.append("")
            lines.append(f"🔍 **Nhận xét tổng quan**:")
            if item_a.get('summary'):
                lines.append(f"- **{item_a.get('name')}**: {item_a.get('summary')}")
            if item_b.get('summary'):
                lines.append(f"- **{item_b.get('name')}**: {item_b.get('summary')}")
                
        return "\n".join(lines)

    @staticmethod
    def render_timeline(title: str, events: List[Dict[str, str]]) -> str:
        """Khuôn mẫu dòng thời gian sự kiện theo năm / ngày tháng"""
        lines = []
        lines.append(f"### ⏳ Diễn biến thời gian: **{title}**")
        lines.append("")
        
        for ev in events:
            time_label = ev.get('time', 'Mốc thời gian')
            desc = ev.get('description', '')
            lines.append(f"🗓️ **{time_label}**:")
            lines.append(f"   {desc}")
            lines.append("")
            
        return "\n".join(lines)

    @staticmethod
    def render_guide(title: str, steps: List[str], notes: Optional[List[str]] = None) -> str:
        """Khuôn mẫu hướng dẫn tham quan / lộ trình di tích"""
        lines = []
        lines.append(f"### 🗺️ Hướng dẫn & Lộ trình: **{title}**")
        lines.append("")
        
        for idx, step in enumerate(steps, 1):
            lines.append(f"**Bước {idx}**: {step.strip()}")
            lines.append("")
            
        if notes:
            lines.append("💡 **Lưu ý hữu ích khi tham quan**:")
            for n in notes:
                lines.append(f"- {n.strip()}")
                
        return "\n".join(lines)

    @staticmethod
    def render_list(title: str, items: List[str]) -> str:
        """Khuôn mẫu danh sách liệt kê có hệ thống"""
        lines = []
        lines.append(f"### 📋 Danh sách chi tiết: **{title}**")
        lines.append("")
        for idx, item in enumerate(items, 1):
            lines.append(f"{idx}. {item.strip()}")
        return "\n".join(lines)
