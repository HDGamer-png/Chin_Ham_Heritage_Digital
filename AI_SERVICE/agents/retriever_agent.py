"""
Agent 2: RETRIEVER AGENT — Bộ Truy Hồi Tri Thức Đa Tầng
Tìm kiếm song song 3 tầng: TF-IDF + Entity Matching + Section Graph
Kết hợp Re-ranking để trả về kết quả chính xác nhất.
"""
import sys
from typing import List, Tuple, Dict, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from engine.document_loader import DocumentChunk
from engine.text_normalizer import normalize_text, remove_vietnamese_accents, extract_entities
from engine.section_graph import SectionGraph


class RetrieverAgent:
    """Agent truy hồi tri thức 3 tầng song song + Re-ranking"""

    def __init__(self):
        self.chunks: List[DocumentChunk] = []
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.tfidf_matrix = None
        self.section_graph = SectionGraph()

    def index(self, chunks: List[DocumentChunk]):
        """Xây dựng chỉ mục TF-IDF + Section Graph cho tất cả chunks"""
        self.chunks = chunks
        if not chunks:
            self.vectorizer = None
            self.tfidf_matrix = None
            return

        # ── Tầng 1: TF-IDF Index ──
        corpus = []
        for c in chunks:
            # Kết hợp tiêu đề + nội dung + nội dung không dấu để mở rộng khả năng tìm kiếm
            text = f"{c.section_title} {c.section_title} {c.content} {c.no_accent_content}"
            corpus.append(text)

        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 3),  # Nâng lên trigram để bắt cụm từ dài hơn
            min_df=1,
            max_df=0.95,
            sublinear_tf=True,
        )
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)

        # ── Tầng 3: Section Graph ──
        self.section_graph.build(chunks)

        print(f"[RetrieverAgent] Đã lập chỉ mục {len(chunks)} chunks | "
              f"TF-IDF features={self.tfidf_matrix.shape[1]} | "
              f"Graph edges={self.section_graph.edge_count}")

    def search(self, query: str, context: Dict, top_k: int = 5) -> List[Dict]:
        """
        Tìm kiếm 3 tầng song song + Re-rank.

        Args:
            query: Câu hỏi đã chuẩn hóa
            context: Kết quả phân tích từ Orchestrator (chứa intent, entities, expanded_entities)
            top_k: Số lượng kết quả trả về

        Returns:
            List[Dict] với mỗi item chứa: chunk, score, matched_layers
        """
        if not self.chunks or self.vectorizer is None:
            return []

        entities = context.get("entities", [])
        expanded = context.get("expanded_entities", [])
        all_entities = entities + expanded

        norm_query = normalize_text(query)
        no_acc_query = remove_vietnamese_accents(norm_query)

        # ═══ TẦNG 1: TF-IDF Cosine Similarity ═══
        tfidf_scores = self._tfidf_search(norm_query, no_acc_query)

        # ═══ TẦNG 2: Entity Matching ═══
        entity_scores = self._entity_search(all_entities)

        # ═══ TẦNG 3: Section Graph ═══
        graph_scores = self._graph_search(entities)

        # ═══ MERGE & RE-RANK ═══
        results = self._merge_and_rerank(
            tfidf_scores, entity_scores, graph_scores,
            norm_query, no_acc_query, context
        )

        # Sắp xếp giảm dần theo điểm
        results.sort(key=lambda x: x["score"], reverse=True)

        top_results = results[:top_k]

        print(f"[RetrieverAgent] Query='{query[:50]}...' → {len(top_results)} results | "
              f"Top score={top_results[0]['score']:.3f}" if top_results else "[RetrieverAgent] No results")

        return top_results

    # ═══════════════════════════════════════════════════════════
    # Tầng 1: TF-IDF Search
    # ═══════════════════════════════════════════════════════════
    def _tfidf_search(self, norm_query: str, no_acc_query: str) -> Dict[int, float]:
        """Tính cosine similarity giữa query và tất cả chunks"""
        query_text = f"{norm_query} {no_acc_query}"
        query_vec = self.vectorizer.transform([query_text])
        cos_scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

        return {idx: float(score) for idx, score in enumerate(cos_scores)}

    # ═══════════════════════════════════════════════════════════
    # Tầng 2: Entity Matching
    # ═══════════════════════════════════════════════════════════
    def _entity_search(self, entities: List[str]) -> Dict[int, float]:
        """Khớp thực thể giữa query và chunks"""
        scores = {}
        if not entities:
            return scores

        for idx, chunk in enumerate(self.chunks):
            entity_score = 0.0
            for ent in entities:
                # Chuyển entity key → dạng đã chuẩn hóa
                ent_normalized = ent.replace("_", " ")
                if ent_normalized in " ".join(chunk.entities):
                    entity_score += 0.35  # Khớp trực tiếp entity
                elif any(ent_normalized in alias for alias in chunk.entities):
                    entity_score += 0.2   # Khớp gián tiếp

                # Kiểm tra entity key trong nội dung không dấu
                ent_no_acc = ent.replace("_", " ")
                if ent_no_acc in chunk.no_accent_content:
                    entity_score += 0.15

            if entity_score > 0:
                scores[idx] = min(entity_score, 1.0)

        return scores

    # ═══════════════════════════════════════════════════════════
    # Tầng 3: Section Graph Search
    # ═══════════════════════════════════════════════════════════
    def _graph_search(self, entities: List[str]) -> Dict[int, float]:
        """Tìm chunks liên quan qua đồ thị liên kết"""
        scores = {}
        if not entities:
            return scores

        related_chunk_ids = self.section_graph.get_related_chunks(entities)
        for chunk_id, relevance in related_chunk_ids.items():
            # Tìm index trong self.chunks
            for idx, chunk in enumerate(self.chunks):
                if chunk.id == chunk_id:
                    scores[idx] = relevance * 0.3  # Graph contributes 30% max
                    break

        return scores

    # ═══════════════════════════════════════════════════════════
    # Merge & Re-rank
    # ═══════════════════════════════════════════════════════════
    def _merge_and_rerank(
        self,
        tfidf_scores: Dict[int, float],
        entity_scores: Dict[int, float],
        graph_scores: Dict[int, float],
        norm_query: str,
        no_acc_query: str,
        context: Dict,
    ) -> List[Dict]:
        """Kết hợp điểm từ 3 tầng + áp dụng boost theo ngữ cảnh"""
        all_indices = set(tfidf_scores.keys()) | set(entity_scores.keys()) | set(graph_scores.keys())
        results = []

        for idx in all_indices:
            chunk = self.chunks[idx]
            norm_title = normalize_text(chunk.section_title)

            # Tổng hợp điểm 3 tầng
            s_tfidf = tfidf_scores.get(idx, 0.0)
            s_entity = entity_scores.get(idx, 0.0)
            s_graph = graph_scores.get(idx, 0.0)

            combined = s_tfidf + s_entity + s_graph

            # ── TARGET TUNNEL PRECISION BOOST & PENALTY ──
            target_tunnel = context.get("target_tunnel")
            if target_tunnel:
                # 1. Tiêu đề của chunk có phải chính là căn hầm được hỏi không?
                is_exact_tunnel_title = (
                    f"hầm số {target_tunnel}" in norm_title or
                    f"hầm {target_tunnel}" in norm_title
                )
                
                # 2. Tiêu đề của chunk có phải là một căn hầm KHÁC không?
                other_tunnel_nums = [str(n) for n in range(1, 10) if str(n) != str(target_tunnel)]
                is_other_tunnel_title = any(
                    (f"hầm số {other_n}" in norm_title or f"hầm {other_n}" in norm_title)
                    for other_n in other_tunnel_nums
                )

                if is_exact_tunnel_title:
                    combined += 5.0  # Ưu tiên tuyệt đối vì tiêu đề chính là căn hầm này!
                elif is_other_tunnel_title:
                    combined -= 5.0  # Loại trừ vì tiêu đề là căn hầm khác!
                elif any(tk in chunk.entities for tk in [f"ham_{target_tunnel}", f"ham {target_tunnel}"]):
                    combined += 1.0  # Nội dung có đề cập đến hầm này

            # ── BOOST: Title match (bao gồm cả chữ số 1-9) ──
            query_words = [w for w in norm_query.split() if len(w) > 2 or w.isdigit()]
            title_match_count = sum(1 for w in query_words if w in norm_title)
            if query_words:
                title_boost = (title_match_count / len(query_words)) * 0.35
                combined += title_boost

            # ── BOOST: Exact phrase match ──
            if len(norm_query) > 5 and norm_query in normalize_text(chunk.content):
                combined += 0.3

            # ── BOOST: Fuzzy no-accent match (bao gồm cả chữ số) ──
            no_acc_words = [w for w in no_acc_query.split() if len(w) > 2 or w.isdigit()]
            fuzzy_hits = sum(1 for w in no_acc_words if w in chunk.no_accent_content)
            if no_acc_words:
                fuzzy_boost = (fuzzy_hits / len(no_acc_words)) * 0.15
                combined += fuzzy_boost

            # Theo dõi tầng nào đóng góp
            matched_layers = []
            if s_tfidf > 0.05:
                matched_layers.append("tfidf")
            if s_entity > 0:
                matched_layers.append("entity")
            if s_graph > 0:
                matched_layers.append("graph")

            results.append({
                "chunk": chunk,
                "score": round(combined, 4),
                "tfidf_score": round(s_tfidf, 4),
                "entity_score": round(s_entity, 4),
                "graph_score": round(s_graph, 4),
                "matched_layers": matched_layers,
            })

        return results
