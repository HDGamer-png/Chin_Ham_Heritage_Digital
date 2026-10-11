"""
Module tìm kiếm và truy hồi tri thức (Knowledge Retrieval Engine)
Kết hợp Vector TF-IDF, Cosine Similarity và Khớp thực thể lịch sử
"""
from typing import List, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .document_loader import DocumentChunk
from .text_normalizer import normalize_text, remove_vietnamese_accents, extract_entities

class KnowledgeRetriever:
    def __init__(self):
        self.chunks: List[DocumentChunk] = []
        self.vectorizer: TfidfVectorizer = None
        self.tfidf_matrix = None

    def index(self, chunks: List[DocumentChunk]):
        """Xây dựng chỉ mục TF-IDF cho tất cả các đoạn tài liệu"""
        self.chunks = chunks
        if not chunks:
            self.vectorizer = None
            self.tfidf_matrix = None
            return

        corpus = [f"{c.section_title} {c.content} {c.no_accent_content}" for c in chunks]

        # Khởi tạo Vectorizer với n-gram từ 1 đến 2 từ
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            min_df=1,
            sublinear_tf=True
        )
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)
        print(f"[KnowledgeRetriever] Đã lập chỉ mục {len(chunks)} đoạn tri thức với {self.tfidf_matrix.shape[1]} đặc trưng từ vựng.")

    def search(self, query: str, top_k: int = 3) -> List[Tuple[DocumentChunk, float]]:
        """Tìm kiếm top_k đoạn văn bản phù hợp nhất với câu hỏi"""
        if not self.chunks or self.vectorizer is None:
            return []

        norm_query = normalize_text(query)
        no_acc_query = remove_vietnamese_accents(norm_query)
        query_entities = extract_entities(query)

        # 1. Tính toán Cosine Similarity qua TF-IDF
        query_text = f"{norm_query} {no_acc_query}"
        query_vec = self.vectorizer.transform([query_text])
        cos_scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

        scored_results = []

        for idx, chunk in enumerate(self.chunks):
            base_score = float(cos_scores[idx])

            # 2. Khớp thực thể quan trọng (Entity Boost)
            entity_boost = 0.0
            for ent in query_entities:
                if ent in chunk.entities:
                    entity_boost += 0.25 # Tăng điểm mạnh nếu cùng nói về Ngô Đình Cẩn, Hầm 4, Phá hầm,...

            # 3. Khớp chính xác tiêu đề mục (Title Boost)
            title_boost = 0.0
            norm_title = normalize_text(chunk.section_title)
            if any(word in norm_title for word in norm_query.split() if len(word) > 2):
                title_boost += 0.15

            # 4. Khớp từ khóa không dấu (Fuzzy Boost)
            fuzzy_boost = 0.0
            query_words = no_acc_query.split()
            matched_words = sum(1 for w in query_words if len(w) > 2 and w in chunk.no_accent_content)
            if query_words:
                fuzzy_boost = (matched_words / len(query_words)) * 0.2

            final_score = base_score + entity_boost + title_boost + fuzzy_boost
            scored_results.append((chunk, final_score))

        # Sắp xếp theo điểm giảm dần
        scored_results.sort(key=lambda x: x[1], reverse=True)
        return scored_results[:top_k]
