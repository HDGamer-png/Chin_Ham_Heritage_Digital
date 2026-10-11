"""
Engine: Section Graph — Đồ thị liên kết giữa các mục tài liệu
Cho phép truy vấn "Hầm 4" → tự động kéo theo thông tin liên quan về "Ngô Đình Cẩn", "tra tấn"...
"""
import sys
from typing import List, Dict
from collections import defaultdict

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Import DocumentChunk type
try:
    from .document_loader import DocumentChunk
except ImportError:
    from engine.document_loader import DocumentChunk


# Bảng liên kết ngữ nghĩa giữa các thực thể
# entity_a ↔ entity_b: nếu user hỏi về entity_a, các chunk chứa entity_b cũng liên quan
SEMANTIC_LINKS = [
    ("ngo dinh can", "chin ham", 0.8),
    ("ngo dinh can", "ham 4", 0.7),
    ("ngo dinh can", "tra tan", 0.7),
    ("ngo dinh can", "pha ham 1963", 0.9),
    ("ham 4", "chuong cop", 1.0),
    ("ham 4", "tra tan", 0.8),
    ("ham 4", "ngo dinh can", 0.7),
    ("ham 1", "chin ham", 0.6),
    ("ham 8", "chin ham", 0.5),
    ("ham 9", "chin ham", 0.5),
    ("pha ham 1963", "chin ham", 0.9),
    ("pha ham 1963", "ngo dinh can", 0.8),
    ("nha chung tich", "tham quan", 0.7),
    ("dai tuong niem", "tham quan", 0.6),
    ("tham quan", "chin ham", 0.5),
]


class SectionGraph:
    """Đồ thị liên kết giữa các section/chunk dựa trên thực thể chung"""

    def __init__(self):
        # adjacency: entity → [(related_entity, weight)]
        self.adjacency: Dict[str, List[tuple]] = defaultdict(list)
        # chunk_entity_map: entity → [chunk_id]
        self.chunk_entity_map: Dict[str, List[str]] = defaultdict(list)
        self.edge_count = 0

    def build(self, chunks: List[DocumentChunk]):
        """Xây dựng đồ thị từ danh sách chunks và bảng liên kết ngữ nghĩa"""
        self.adjacency.clear()
        self.chunk_entity_map.clear()
        self.edge_count = 0

        # 1. Map entity → chunks
        for chunk in chunks:
            for entity in chunk.entities:
                self.chunk_entity_map[entity].append(chunk.id)

        # 2. Xây đồ thị adjacency từ bảng liên kết tĩnh
        for ent_a, ent_b, weight in SEMANTIC_LINKS:
            self.adjacency[ent_a].append((ent_b, weight))
            self.adjacency[ent_b].append((ent_a, weight * 0.8))  # Ngược lại giảm nhẹ
            self.edge_count += 2

        # 3. Tự động phát hiện liên kết thêm dựa trên co-occurrence
        #    Nếu 2 entity cùng xuất hiện trong 1 chunk → liên kết
        entity_cooccurrence = defaultdict(set)
        for chunk in chunks:
            for i, ent_a in enumerate(chunk.entities):
                for ent_b in chunk.entities[i + 1:]:
                    entity_cooccurrence[(ent_a, ent_b)].add(chunk.id)

        for (ent_a, ent_b), shared_chunks in entity_cooccurrence.items():
            co_weight = min(0.5, len(shared_chunks) * 0.2)
            # Chỉ thêm nếu chưa có liên kết tĩnh mạnh hơn
            existing_weights = [w for e, w in self.adjacency.get(ent_a, []) if e == ent_b]
            if not existing_weights or max(existing_weights) < co_weight:
                self.adjacency[ent_a].append((ent_b, co_weight))
                self.adjacency[ent_b].append((ent_a, co_weight * 0.8))
                self.edge_count += 2

        print(f"[SectionGraph] Built graph: {len(self.chunk_entity_map)} entities, {self.edge_count} edges")

    def get_related_chunks(self, query_entities: List[str], max_depth: int = 2) -> Dict[str, float]:
        """
        Tìm các chunk liên quan đến danh sách thực thể qua đồ thị.
        Trả về: {chunk_id: relevance_score}

        BFS tối đa max_depth bước, trọng số giảm dần theo khoảng cách.
        """
        related: Dict[str, float] = {}
        visited_entities = set()

        # Chuẩn hóa entity keys
        normalized_entities = [e.replace("_", " ") for e in query_entities]

        # BFS từ các entity ban đầu
        frontier = [(ent, 1.0) for ent in normalized_entities]

        for depth in range(max_depth):
            next_frontier = []
            for entity, current_weight in frontier:
                if entity in visited_entities:
                    continue
                visited_entities.add(entity)

                # Lấy chunks chứa entity này
                chunk_ids = self.chunk_entity_map.get(entity, [])
                for cid in chunk_ids:
                    existing = related.get(cid, 0)
                    related[cid] = max(existing, current_weight)

                # Mở rộng sang entity liên kết
                for neighbor, edge_weight in self.adjacency.get(entity, []):
                    if neighbor not in visited_entities:
                        propagated = current_weight * edge_weight * 0.7  # Decay factor
                        if propagated > 0.1:  # Chỉ mở rộng nếu trọng số đủ lớn
                            next_frontier.append((neighbor, propagated))

            frontier = next_frontier

        return related
