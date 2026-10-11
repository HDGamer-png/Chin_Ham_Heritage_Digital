"""
Module tải và bóc tách tài liệu từ thư mục knowledge_base
Hỗ trợ file Markdown (.md), Text (.txt), JSON (.json)
"""
import os
import re
import sys
import json
import glob
from dataclasses import dataclass
from typing import List, Dict, Any
from .text_normalizer import normalize_text, remove_vietnamese_accents, extract_entities

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

@dataclass
class DocumentChunk:
    id: str
    source_file: str
    section_title: str
    content: str
    normalized_content: str
    no_accent_content: str
    entities: List[str]

class DocumentLoader:
    def __init__(self, knowledge_dir: str):
        self.knowledge_dir = knowledge_dir
        self.last_loaded_mtime: Dict[str, float] = {}

    def get_supported_files(self) -> List[str]:
        """Lấy tất cả các file tài liệu trong thư mục knowledge_base"""
        if not os.path.exists(self.knowledge_dir):
            os.makedirs(self.knowledge_dir, exist_ok=True)
            return []

        patterns = ['*.md', '*.txt', '*.json']
        files = []
        for pattern in patterns:
            files.extend(glob.glob(os.path.join(self.knowledge_dir, pattern)))
        return sorted(files)

    def has_files_changed(self) -> bool:
        """Kiểm tra xem người dùng có vừa cập nhật hoặc thêm file mới vào thư mục không"""
        files = self.get_supported_files()
        current_mtimes = {f: os.path.getmtime(f) for f in files}

        if current_mtimes != self.last_loaded_mtime:
            return True
        return False

    def load_documents(self) -> List[DocumentChunk]:
        """Đọc và bóc tách toàn bộ tài liệu thành các khối tri thức (chunks)"""
        files = self.get_supported_files()
        chunks: List[DocumentChunk] = []
        chunk_idx = 0

        current_mtimes = {}

        for file_path in files:
            mtime = os.path.getmtime(file_path)
            current_mtimes[file_path] = mtime
            file_name = os.path.basename(file_path)

            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                if file_name.endswith('.json'):
                    # Đọc file JSON danh mục
                    json_chunks = self._parse_json(content, file_name, chunk_idx)
                    chunks.extend(json_chunks)
                    chunk_idx += len(json_chunks)
                else:
                    # Đọc file Markdown hoặc Text
                    text_chunks = self._parse_markdown(content, file_name, chunk_idx)
                    chunks.extend(text_chunks)
                    chunk_idx += len(text_chunks)
            except Exception as e:
                print(f"[DocumentLoader] Lỗi đọc file {file_name}: {e}")

        self.last_loaded_mtime = current_mtimes
        print(f"[DocumentLoader] Đã tải {len(files)} file tài liệu thành {len(chunks)} khối tri thức.")
        return chunks

    def _parse_markdown(self, text: str, file_name: str, start_idx: int) -> List[DocumentChunk]:
        """Tách nhỏ file Markdown theo các tiêu đề (#, ##, ###) để câu trả lời chính xác từng mục"""
        chunks = []
        lines = text.split('\n')

        current_title = os.path.splitext(file_name)[0].replace('_', ' ').title()
        current_paragraphs = []
        idx = start_idx

        def flush_chunk():
            nonlocal idx, current_title, current_paragraphs
            body = "\n".join(current_paragraphs).strip()
            if len(body) > 30: # Bỏ qua các đoạn quá ngắn
                norm = normalize_text(f"{current_title} {body}")
                no_acc = remove_vietnamese_accents(norm)
                entities = extract_entities(f"{current_title} {body}")

                chunks.append(DocumentChunk(
                    id=f"chunk_{idx}",
                    source_file=file_name,
                    section_title=current_title,
                    content=body,
                    normalized_content=norm,
                    no_accent_content=no_acc,
                    entities=entities
                ))
                idx += 1
            current_paragraphs = []

        for line in lines:
            stripped = line.strip()
            # Bắt tiêu đề Markdown
            if stripped.startswith('#'):
                flush_chunk()
                current_title = re.sub(r'^#+\s*', '', stripped)
            elif stripped:
                current_paragraphs.append(line)
            else:
                # Dòng trống -> có thể kết thúc đoạn nếu đã dài
                if len("\n".join(current_paragraphs)) > 400:
                    flush_chunk()

        flush_chunk()
        return chunks

    def _parse_json(self, content: str, file_name: str, start_idx: int) -> List[DocumentChunk]:
        """Hỗ trợ nạp file JSON chứa mảng đối tượng tri thức"""
        chunks = []
        try:
            data = json.loads(content)
            if isinstance(data, list):
                for idx, item in enumerate(data):
                    title = item.get('title') or item.get('name') or f"Mục {idx+1}"
                    desc = item.get('desc') or item.get('description') or item.get('content') or str(item)
                    norm = normalize_text(f"{title} {desc}")
                    no_acc = remove_vietnamese_accents(norm)
                    entities = extract_entities(f"{title} {desc}")

                    chunks.append(DocumentChunk(
                        id=f"chunk_{start_idx + idx}",
                        source_file=file_name,
                        section_title=title,
                        content=desc,
                        normalized_content=norm,
                        no_accent_content=no_acc,
                        entities=entities
                    ))
        except Exception as e:
            print(f"[DocumentLoader] Lỗi phân tích JSON {file_name}: {e}")
        return chunks
