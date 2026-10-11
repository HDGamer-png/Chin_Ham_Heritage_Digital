"""
Dịch vụ Trợ Lý AI Chín Hầm (FastAPI Backend - Multi-Agent Architecture)
Hoàn toàn độc lập, chạy nội bộ bằng Python, không phụ thuộc vào Gemini API hay bất kỳ API nào.
Kiến trúc 5 Agent chuyên biệt:
  1. Orchestrator: Phân loại ý định (8 loại intent) & điều phối
  2. RetrieverAgent: Truy hồi tri thức 3 tầng (TF-IDF + Entity + Section Graph)
  3. Greeter: Xử lý chào hỏi xã giao
  4. Reasoner: Suy luận & tổng hợp câu trả lời theo logic lịch sử
  5. Formatter: Định dạng Markdown, kiểm chứng nguồn & sinh gợi ý
"""
import os
import sys
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from engine.document_loader import DocumentLoader
from agents.orchestrator import Orchestrator
from agents.retriever_agent import RetrieverAgent
from agents.greeter import Greeter
from agents.reasoner import Reasoner
from agents.formatter import Formatter

# Đường dẫn thư mục tri thức
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KNOWLEDGE_DIR = os.path.join(BASE_DIR, "knowledge_base")

# Khởi tạo FastAPI App
app = FastAPI(
    title="Chín Hầm AI Heritage Assistant (Multi-Agent)",
    description="Trợ lý AI Lịch sử Chín Hầm & Ngô Đình Cẩn chạy độc lập bằng kiến trúc Multi-Agent Python",
    version="2.0.0"
)

# Cấu hình CORS để Next.js (port 3000, 3001) gọi trực tiếp
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Khởi tạo các thành phần cốt lõi và các Agent
loader = DocumentLoader(KNOWLEDGE_DIR)
orchestrator = Orchestrator()
retriever_agent = RetrieverAgent()
greeter = Greeter()
reasoner = Reasoner()
formatter = Formatter()

def reload_engine():
    """Hàm nạp lại toàn bộ file tài liệu và tái lập chỉ mục đa tầng cho Retriever"""
    chunks = loader.load_documents()
    retriever_agent.index(chunks)
    return len(chunks)

# Tự động nạp dữ liệu lần đầu khi khởi động
reload_engine()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    success: bool
    reply: str
    confidence: Optional[float] = 0.0
    sources: Optional[List[str]] = []
    suggestions: Optional[List[str]] = []
    intent: Optional[str] = None
    reasoning_mode: Optional[str] = None

@app.get("/health")
def health_check():
    """Kiểm tra trạng thái server, số lượng tài liệu đã nạp và kiến trúc Multi-Agent"""
    files = loader.get_supported_files()
    return {
        "status": "online",
        "service": "Chin Ham AI Assistant (Multi-Agent Python Engine)",
        "architecture": "5-Agent Pipeline (Orchestrator -> Retriever -> Greeter -> Reasoner -> Formatter)",
        "gemini_dependent": False,
        "total_files": len(files),
        "total_chunks": len(retriever_agent.chunks),
        "graph_edges": retriever_agent.section_graph.edge_count,
        "files": [os.path.basename(f) for f in files]
    }

@app.get("/documents")
def list_documents():
    """Liệt kê danh sách tất cả các mục tài liệu đã được nạp vào bộ nhớ"""
    return {
        "files": [os.path.basename(f) for f in loader.get_supported_files()],
        "sections": [
            {
                "id": c.id,
                "file": c.source_file,
                "title": c.section_title,
                "snippet": c.content[:140] + "..." if len(c.content) > 140 else c.content
            }
            for c in retriever_agent.chunks
        ]
    }

@app.post("/reload")
def manual_reload():
    """API cho phép người dùng bấm nút làm mới bộ nhớ sau khi thêm file tài liệu mới"""
    count = reload_engine()
    return {
        "success": True,
        "message": f"Đã nạp lại thành công {count} khối tri thức và tái lập đồ thị liên kết SectionGraph."
    }

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    """
    Quy trình xử lý Multi-Agent Pipeline:
      1. Orchestrator: Phân tích ngữ nghĩa câu hỏi, phân loại intent và nhận diện thực thể
      2. Greeter: Phản hồi tức thì nếu là câu hỏi xã giao / chào hỏi
      3. RetrieverAgent: Truy hồi tri thức 3 tầng (TF-IDF + Entity + Section Graph)
      4. Reasoner: Suy luận logic (nhân-quả, so sánh, tiểu sử, dòng thời gian...)
      5. Formatter: Định dạng kết quả, kiểm định nguồn và sinh câu hỏi khám phá
    """
    query = req.message.strip() if req.message else ""
    if not query:
        raise HTTPException(status_code=400, detail="Câu hỏi không được để trống")

    # Tự động nạp lại nếu phát hiện file trong knowledge_base vừa được thêm/sửa
    if loader.has_files_changed():
        print("[Auto-Reload] Phát hiện file tư liệu mới hoặc có chỉnh sửa. Đang tự động nạp lại...")
        reload_engine()

    # ──── AGENT 1: ORCHESTRATOR ────
    context = orchestrator.analyze(query)
    intent = context.get("intent", "factual")

    # ──── AGENT 3: GREETER (Nhanh chóng xử lý chào hỏi xã giao) ────
    if intent == "greeting":
        greet_res = greeter.respond()
        return ChatResponse(
            success=True,
            reply=greet_res["reply"],
            confidence=greet_res["confidence"],
            sources=[],
            suggestions=greet_res["suggestions"],
            intent="greeting",
            reasoning_mode="conversational_greeting"
        )

    # ──── AGENT 2: RETRIEVER AGENT (Truy hồi 3 tầng song song) ────
    retrieved_results = retriever_agent.search(query, context, top_k=5)

    # ──── AGENT 4: REASONER (Suy luận logic theo loại câu hỏi) ────
    reasoned = reasoner.synthesize(context, retrieved_results)

    # ──── AGENT 5: FORMATTER (Định dạng UI, đính kèm nguồn & gợi ý) ────
    final_output = formatter.format(context, reasoned)

    return ChatResponse(
        success=True,
        reply=final_output["reply"],
        confidence=final_output.get("confidence", 0.0),
        sources=final_output.get("sources", []),
        suggestions=final_output.get("suggestions", []),
        intent=intent,
        reasoning_mode=reasoned.get("reasoning_mode", "unknown")
    )

if __name__ == "__main__":
    print(f"================================================================")
    print(f"🚀 Chín Hầm AI Multi-Agent Service đang khởi động tại http://127.0.0.1:8000")
    print(f"🤖 5 Agents hoạt động: Orchestrator, RetrieverAgent, Greeter, Reasoner, Formatter")
    print(f"📂 Thư mục chứa file tư liệu: {KNOWLEDGE_DIR}")
    print(f"💡 Thêm file .txt hoặc .md vào thư mục trên để cập nhật kiến thức ngay lập tức!")
    print(f"================================================================")
    uvicorn.run(app, host="127.0.0.1", port=8000)
