"""
Engine: Fact Extractor — Bóc tách thông tin cốt lõi từ văn bản
Trích xuất: mốc thời gian, số liệu đo lường, quan hệ nhân vật, nguyên nhân - kết quả.
"""
import re
from typing import List, Dict, Any, Optional

class FactExtractor:
    """Trích xuất sự kiện, số liệu và câu văn mang thông tin then chốt từ chunks"""

    @staticmethod
    def extract_sentences(text: str) -> List[str]:
        """Tách đoạn văn thành các câu riêng biệt chuẩn tiếng Việt"""
        # Chuẩn hóa khoảng trắng và dòng
        clean_text = re.sub(r'[\r\n]+', ' ', text).strip()
        # Tách theo dấu chấm, chấm phẩy, chấm than, chấm hỏi kèm khoảng trắng
        raw_sentences = re.split(r'(?<=[.?!;])\s+', clean_text)
        sentences = []
        for s in raw_sentences:
            s_clean = s.strip()
            # Bỏ bullet points thừa hoặc số thứ tự đầu câu
            s_clean = re.sub(r'^[•\-\*\d\.\)]+\s*', '', s_clean)
            if len(s_clean) > 15:
                sentences.append(s_clean)
        return sentences

    @staticmethod
    def extract_dates_and_years(text: str) -> List[str]:
        """Tìm các mốc thời gian, năm, ngày tháng trong văn bản"""
        patterns = [
            r'\b\d{1,2}/\d{1,2}/\d{4}\b',
            r'\bngày\s+\d{1,2}(?:/\d{1,2}/\d{4}|\s+tháng\s+\d{1,2}\s+năm\s+\d{4})\b',
            r'\bnăm\s+\d{4}\b',
            r'\b\d{4}\s*[-–]\s*\d{4}\b',
            r'\btháng\s+\d{1,2}/\d{4}\b',
        ]
        results = []
        for pat in patterns:
            matches = re.findall(pat, text, flags=re.IGNORECASE)
            results.extend(matches)
        return list(dict.fromkeys(results))

    @staticmethod
    def extract_dimensions_and_numbers(text: str) -> List[str]:
        """Tìm các thông số kích thước, độ dày, số lượng"""
        patterns = [
            r'\b\d+(?:\.\d+)?m\s*x\s*\d+(?:\.\d+)?m(?:\s*x\s*\d+(?:\.\d+)?m)?\b',
            r'\bdày\s+(?:từ\s+)?\d+(?:\.\d+)?m(?:\s*đến\s*\d+(?:\.\d+)?m)?\b',
            r'\b\d+\s*(?:ngăn|căn|tù nhân|người|chiến sĩ|hầm|km|m)\b',
        ]
        results = []
        for pat in patterns:
            matches = re.findall(pat, text, flags=re.IGNORECASE)
            results.extend(matches)
        return list(dict.fromkeys(results))

    @classmethod
    def find_causality_sentences(cls, text: str) -> List[str]:
        """Tìm các câu chứa quan hệ nhân quả (vì, do, bởi, nên, khiến, để, nhằm)"""
        sentences = cls.extract_sentences(text)
        causal_keywords = [
            'bởi', 'do', 'vì', 'tại vì', 'nhằm', 'để', 'khiến',
            'dẫn đến', 'nguyên nhân', 'mục đích', 'hậu quả',
            'được gọi là', 'gọi là', 'biến nơi đây'
        ]
        causal_sentences = []
        for s in sentences:
            s_lower = s.lower()
            if any(k in s_lower for k in causal_keywords):
                causal_sentences.append(s)
        return causal_sentences

    @classmethod
    def filter_relevant_sentences(cls, text: str, keywords: List[str], max_count: int = 4) -> List[str]:
        """Lọc các câu chứa nhiều từ khóa truy vấn nhất"""
        sentences = cls.extract_sentences(text)
        scored = []
        for s in sentences:
            s_lower = s.lower()
            hit_count = sum(1 for kw in keywords if kw.lower() in s_lower)
            if hit_count > 0:
                scored.append((s, hit_count))
        scored.sort(key=lambda x: x[1], reverse=True)
        return [item[0] for item in scored[:max_count]]
