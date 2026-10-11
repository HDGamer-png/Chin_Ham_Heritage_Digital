"""
Agent 1: ORCHESTRATOR — Bộ Điều Phối Trung Tâm
Phân loại ý định (intent) câu hỏi, nhận diện thực thể, mở rộng truy vấn.
"""
import re
from typing import Dict, List, Optional
import sys

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# ═══════════════════════════════════════════════════════════════
# Bảng mẫu phân loại intent — Dễ dàng thêm/sửa mẫu mới
# ═══════════════════════════════════════════════════════════════

INTENT_PATTERNS = {
    # ── Chào hỏi xã giao ──
    "greeting": {
        "keywords": [
            "xin chào", "chào bạn", "chào", "hello", "hi",
            "bạn là ai", "bạn là gì", "trợ lý là ai",
            "giới thiệu bản thân", "giới thiệu về bạn",
            "bạn có thể làm gì", "bạn biết gì",
        ],
        "patterns": [
            r"^(xin\s+)?ch[aà]o",
            r"^hi\b", r"^hello\b",
            r"b[aạ]n\s+l[aà]\s+(ai|g[iì])",
            r"tr[oợ]\s+l[yý]\s+l[aà]\s+ai",
        ],
        "weight": 2.0,  # Ưu tiên cao nhất cho greeting
    },

    # ── So sánh / Đối chiếu ──
    "compare": {
        "keywords": [
            "so sánh", "khác nhau", "giống nhau", "so với",
            "khác gì", "giống gì", "khác biệt", "tương đồng",
            "hơn", "kém", "lớn hơn", "nhỏ hơn",
        ],
        "patterns": [
            r"(so\s+s[aá]nh|kh[aá]c\s+(nhau|g[iì]|bi[eệ]t))",
            r"(gi[oố]ng\s+(nhau|g[iì]))",
            r"(h[aầ]m\s+\d+)\s+v[aà]\s+(h[aầ]m\s+\d+)",
            r"gi[uữ]a\s+.+\s+v[aà]\s+",
        ],
        "weight": 1.8,
    },

    # ── Nguyên nhân / Lý do ──
    "cause": {
        "keywords": [
            "tại sao", "vì sao", "lý do", "nguyên nhân",
            "do đâu", "tại vì", "vì lẽ gì", "sao lại",
            "tại sao lại", "vì đâu", "nguyên cớ",
        ],
        "patterns": [
            r"t[aạ]i\s+sao", r"v[iì]\s+sao",
            r"l[yý]\s+do", r"nguy[eê]n\s+nh[aâ]n",
            r"sao\s+l[aạ]i", r"do\s+[dđ][aâ]u",
        ],
        "weight": 1.7,
    },

    # ── Dòng thời gian / Sự kiện theo năm ──
    "timeline": {
        "keywords": [
            "năm nào", "khi nào", "thời gian", "lúc nào",
            "bao giờ", "diễn ra", "xảy ra", "diễn biến",
            "lịch sử", "quá trình", "giai đoạn",
        ],
        "patterns": [
            r"n[aă]m\s+n[aà]o", r"khi\s+n[aà]o",
            r"th[oờ]i\s+gian", r"l[uú]c\s+n[aà]o",
            r"di[eễ]n\s+(ra|bi[eế]n)", r"x[aả]y\s+ra",
            r"t[uừ]\s+n[aă]m\s+\d{4}", r"giai\s+[dđ]o[aạ]n",
            r"\d{4}\s*[-–]\s*\d{4}",
        ],
        "weight": 1.5,
    },

    # ── Liệt kê / Thống kê ──
    "list": {
        "keywords": [
            "liệt kê", "danh sách", "tất cả", "bao nhiêu",
            "có những", "gồm những", "kể tên", "thống kê",
            "mấy", "những gì", "các loại",
        ],
        "patterns": [
            r"li[eệ]t\s+k[eê]", r"t[aấ]t\s+c[aả]",
            r"bao\s+nhi[eê]u", r"c[oó]\s+nh[uữ]ng",
            r"g[oồ]m\s+nh[uữ]ng", r"k[eể]\s+t[eê]n",
            r"m[aấ]y\s+(c[aă]n|h[aầ]m)",
        ],
        "weight": 1.4,
    },

    # ── Nhân vật lịch sử ──
    "person": {
        "keywords": [
            "là ai", "tiểu sử", "cuộc đời", "nhân vật",
            "con người", "sinh năm", "mất năm", "vai trò",
        ],
        "patterns": [
            r"l[aà]\s+ai",
            r"ti[eể]u\s+s[uử]", r"cu[oộ]c\s+[dđ][oờ]i",
            r"nh[aâ]n\s+v[aậ]t",
        ],
        "weight": 1.3,
    },

    # ── Hướng dẫn tham quan ──
    "guide": {
        "keywords": [
            "tham quan", "hướng dẫn", "lộ trình", "đường đi",
            "vé", "giá vé", "mở cửa", "địa chỉ", "ở đâu",
            "đi như thế nào", "cách đi", "bắt đầu từ đâu",
            "audio guide", "thuyết minh",
        ],
        "patterns": [
            r"tham\s+quan", r"h[uư][oớ]ng\s+d[aẫ]n",
            r"l[oộ]\s+tr[iì]nh", r"[dđ][uư][oờ]ng\s+[dđ]i",
            r"[oở]\s+[dđ][aâ]u", r"gi[aá]\s+v[eé]",
            r"audio\s+guide", r"thuy[eế]t\s+minh",
        ],
        "weight": 1.3,
    },

    # ── Hỏi sự kiện / thông tin cụ thể (default fallback) ──
    "factual": {
        "keywords": [
            "là gì", "như thế nào", "ra sao", "thế nào",
            "kết cấu", "cấu trúc", "diện tích", "kích thước",
            "mô tả", "chi tiết", "thông tin",
        ],
        "patterns": [
            r"l[aà]\s+g[iì]", r"nh[uư]\s+th[eế]\s+n[aà]o",
            r"ra\s+sao", r"th[eế]\s+n[aà]o",
            r"k[eế]t\s+c[aấ]u", r"c[aấ]u\s+tr[uú]c",
        ],
        "weight": 1.0,
    },
}

# ═══════════════════════════════════════════════════════════════
# Bảng thực thể — Tự động nhận diện đối tượng trong câu hỏi
# ═══════════════════════════════════════════════════════════════

ENTITY_ALIASES = {
    "ngo_dinh_can": [
        "ngô đình cẩn", "ngo dinh can", "cậu cẩn", "cau can",
        "bạo chúa miền trung", "cố vấn chỉ đạo miền trung",
    ],
    "chin_ham": [
        "chín hầm", "chin ham", "9 hầm", "9 ham",
        "đồi ba đồn", "doi ba don", "ba đồn",
    ],
    "ham_1": ["hầm 1", "hầm số 1", "ham 1", "ham so 1"],
    "ham_2": ["hầm 2", "hầm số 2", "ham 2", "ham so 2"],
    "ham_3": ["hầm 3", "hầm số 3", "ham 3", "ham so 3"],
    "ham_4": [
        "hầm 4", "hầm số 4", "ham 4", "ham so 4",
        "chuồng cọp", "chuong cop",
    ],
    "ham_5": ["hầm 5", "hầm số 5", "ham 5", "ham so 5"],
    "ham_6": ["hầm 6", "hầm số 6", "ham 6", "ham so 6"],
    "ham_7": ["hầm 7", "hầm số 7", "ham 7", "ham so 7"],
    "ham_8": ["hầm 8", "hầm số 8", "ham 8", "ham so 8"],
    "ham_9": ["hầm 9", "hầm số 9", "ham 9", "ham so 9"],
    "pha_ham_1963": [
        "phá hầm", "pha ham", "02/11/1963", "2/11/1963",
        "ngày 2 tháng 11", "giải phóng chín hầm",
        "đập tan xiềng xích", "giải cứu tù nhân",
    ],
    "nha_chung_tich": [
        "nhà chứng tích", "nha chung tich", "tả vu", "hữu vu",
        "trưng bày", "sa bàn", "bảo tàng",
    ],
    "dai_tuong_niem": [
        "đài tưởng niệm", "dai tuong niem", "bia di tích", "tượng đài",
    ],
    "tra_tan": [
        "tra tấn", "tra tan", "hành hạ", "cùm sắt", "cum sat",
        "đánh đập", "roi", "điện", "ngạt thở", "bỏ đói",
    ],
    "tham_quan": [
        "tham quan", "lộ trình", "vé", "giá vé", "địa chỉ",
        "audio guide", "thuyết minh",
    ],
}

# Bảng mở rộng truy vấn: entity → các entity liên quan
ENTITY_EXPANSION = {
    "ham_4": ["ngo_dinh_can", "tra_tan"],
    "ngo_dinh_can": ["chin_ham", "tra_tan", "pha_ham_1963"],
    "tra_tan": ["ham_4", "ngo_dinh_can"],
    "pha_ham_1963": ["ngo_dinh_can", "chin_ham"],
    "chin_ham": ["ham_1", "ham_4", "ham_9"],
}


class Orchestrator:
    """Agent điều phối trung tâm — phân loại intent & nhận diện thực thể"""

    def analyze(self, query: str) -> Dict:
        """
        Phân tích câu hỏi của người dùng.
        Trả về:
        {
            "intent": str,           # Loại ý định
            "confidence": float,     # Độ tin cậy
            "entities": List[str],   # Thực thể phát hiện
            "expanded_entities": List[str],  # Thực thể mở rộng
            "original_query": str,   # Câu hỏi gốc
            "normalized_query": str, # Câu hỏi đã chuẩn hóa
        }
        """
        original = query.strip()
        normalized = self._normalize(original)

        # 1. Nhận diện số hầm mục tiêu cụ thể (ví dụ: hầm 8, hầm số 8)
        tunnel_matches = re.findall(r'\b(?:h[aầ]m|ham)\s*(?:s[oố]|so)?\s*([1-9])\b', normalized)
        target_tunnel = tunnel_matches[0] if tunnel_matches else None

        # 2. Nhận diện thực thể
        entities = self._detect_entities(normalized, target_tunnel)

        # 3. Mở rộng thực thể liên quan (nếu hỏi cụ thể 1 hầm thì không mở rộng sang hầm khác)
        expanded = self._expand_entities(entities, target_tunnel)

        # 4. Phân loại intent
        intent, confidence = self._classify_intent(normalized, entities)

        result = {
            "intent": intent,
            "confidence": round(confidence, 3),
            "entities": entities,
            "target_tunnel": target_tunnel,
            "expanded_entities": expanded,
            "original_query": original,
            "normalized_query": normalized,
        }

        print(f"[Orchestrator] Intent={intent} (conf={confidence:.2f}) | TargetTunnel={target_tunnel} | Entities={entities} | Expanded={expanded}")
        return result

    # ───────────────────────────────────────────────────────────
    # Private methods
    # ───────────────────────────────────────────────────────────

    def _normalize(self, text: str) -> str:
        """Chuẩn hóa: lowercase, xóa ký tự đặc biệt, gộp khoảng trắng"""
        text = text.lower().strip()
        text = re.sub(r'[!?.,;:"""\'()…\-–—]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def _detect_entities(self, query: str, target_tunnel: Optional[str] = None) -> List[str]:
        """Nhận diện tất cả thực thể lịch sử có trong câu hỏi với độ ưu tiên số hầm"""
        found = []
        
        # Nếu có số hầm cụ thể, đưa lên đầu danh sách
        if target_tunnel:
            found.append(f"ham_{target_tunnel}")

        for entity_key, aliases in ENTITY_ALIASES.items():
            if entity_key.startswith("ham_"):
                continue  # Đã xử lý số hầm chính xác
            for alias in aliases:
                alias_clean = alias.strip()
                if f" {alias_clean} " in f" {query} " or query.startswith(f"{alias_clean} ") or query.endswith(f" {alias_clean}") or query == alias_clean:
                    if entity_key not in found:
                        found.append(entity_key)
                    break
        return found

    def _expand_entities(self, entities: List[str], target_tunnel: Optional[str] = None) -> List[str]:
        """Mở rộng danh sách thực thể bằng các entity liên quan mà không làm loãng hầm cụ thể"""
        expanded = []
        for ent in entities:
            # Nếu đang hỏi một hầm cụ thể (ví dụ ham_8), không kéo theo các hầm khác!
            if target_tunnel and ent != f"ham_{target_tunnel}" and ent.startswith("ham_"):
                continue
            related = ENTITY_EXPANSION.get(ent, [])
            for r in related:
                # Không mở rộng sang hầm khác khi đang hỏi 1 hầm cụ thể
                if target_tunnel and r.startswith("ham_") and r != f"ham_{target_tunnel}":
                    continue
                if r not in entities and r not in expanded:
                    expanded.append(r)
        return expanded

    def _classify_intent(self, query: str, entities: List[str]) -> tuple:
        """
        Phân loại intent dựa trên pattern matching + keyword scoring.
        Trả về (intent_name, confidence_score)
        """
        scores = {}

        for intent_name, config in INTENT_PATTERNS.items():
            score = 0.0

            # Điểm từ keyword matching
            kw_matches = sum(1 for kw in config["keywords"] if kw in query)
            score += kw_matches * 0.3 * config["weight"]

            # Điểm từ regex pattern matching
            for pattern in config["patterns"]:
                if re.search(pattern, query):
                    score += 0.5 * config["weight"]
                    break  # Chỉ cần 1 pattern match

            scores[intent_name] = score

        # Nếu có 2+ entities dạng hầm → boost intent "compare"
        ham_entities = [e for e in entities if e.startswith("ham_")]
        if len(ham_entities) >= 2:
            scores["compare"] = scores.get("compare", 0) + 1.5

        # Nếu phát hiện entity "ngo_dinh_can" + câu hỏi "là ai" → boost "person"
        if "ngo_dinh_can" in entities:
            if re.search(r'l[aà]\s+ai', query):
                scores["person"] = scores.get("person", 0) + 1.5

        # Tìm intent có điểm cao nhất
        if not scores or max(scores.values()) == 0:
            return ("factual", 0.3)

        best_intent = max(scores, key=scores.get)
        best_score = scores[best_intent]

        # Chuẩn hóa confidence về [0, 1]
        confidence = min(1.0, best_score / 3.0)

        return (best_intent, confidence)
