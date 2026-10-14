"use client";

import { FormEvent, useState, useRef, useEffect } from 'react';
import { faqItems } from '@/content/site-data';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  sources?: string[];
  suggestions?: string[];
  intent?: string;
  reasoningMode?: string;
}

const defaultQuickQuestions = [
  'Tại sao Hầm số 4 được gọi là chuồng cọp?',
  'Ngô Đình Cẩn là ai và có vai trò gì?',
  'So sánh Hầm số 1 và Hầm số 4',
  'Lịch sử Chín Hầm diễn ra như thế nào qua các năm?',
  'Hướng dẫn lộ trình tham quan Chín Hầm',
  'Liệt kê chi tiết 9 căn hầm',
];

// Helper hiển thị thẻ tag suy luận (Reasoning Mode Tag)
function getReasoningBadge(intent?: string, mode?: string) {
  if (!intent && !mode) return null;

  if (mode && mode.startsWith('tunnel_')) {
    const num = mode.replace('tunnel_', '').replace('_details', '');
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
        <span>📍</span>
        <span>Hồ Sơ Hầm Số {num}</span>
      </span>
    );
  }

  const map: Record<string, { label: string; color: string; icon: string }> = {
    cause: { label: 'Phân tích Nhân - Quả', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: '🔍' },
    person: { label: 'Tiểu sử Nhân vật', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: '👤' },
    compare: { label: 'So sánh Đối chiếu', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', icon: '⚖️' },
    timeline: { label: 'Dòng Thời gian', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: '⏳' },
    guide: { label: 'Lộ trình Tham quan', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: '🗺️' },
    list: { label: 'Danh mục Chi tiết', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: '📋' },
    greeting: { label: 'Chào hỏi Xã giao', color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: '👋' },
    factual: { label: 'Tổng hợp Tư liệu', color: 'bg-stone-500/20 text-stone-300 border-stone-500/30', icon: '📜' },
  };

  const key = intent || mode || 'factual';
  const badge = map[key] || map['factual'];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badge.color}`}>
      <span>{badge.icon}</span>
      <span>{badge.label}</span>
    </span>
  );
}

// Helper render Markdown đơn giản (hỗ trợ bold, headings, bảng so sánh và danh sách)
function MarkdownContent({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];

  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  const flushTable = (keyIdx: number) => {
    if (tableHeader.length > 0 || tableRows.length > 0) {
      elements.push(
        <div key={`table-${keyIdx}`} className="my-3 overflow-x-auto rounded-xl border border-white/15 bg-black/40">
          <table className="w-full text-left text-xs border-collapse">
            {tableHeader.length > 0 && (
              <thead>
                <tr className="border-b border-white/15 bg-white/10 text-emerald-300">
                  {tableHeader.map((h, i) => (
                    <th key={i} className="p-2.5 font-bold">{renderFormattedText(h.trim())}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-white/10 hover:bg-white/5 transition">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-2.5 text-stone-200">{renderFormattedText(cell.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeader = [];
      tableRows = [];
    }
    inTable = false;
  };

  const renderFormattedText = (str: string) => {
    // Thay thế **bold**
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Xử lý bảng Markdown | col1 | col2 |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed.split('|').slice(1, -1);
      // Bỏ qua dòng separator |---|---|
      if (cells.every(c => c.trim().match(/^[-:]+$/))) {
        return;
      }
      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      return;
    } else if (inTable) {
      flushTable(idx);
    }

    // Tiêu đề
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={idx} className="text-base font-bold text-emerald-300 mt-2.5 mb-1.5 font-display flex items-center gap-1.5">
          {renderFormattedText(trimmed.replace('### ', ''))}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={idx} className="text-lg font-bold text-white mt-3 mb-2 font-display">
          {renderFormattedText(trimmed.replace('## ', ''))}
        </h2>
      );
    } else if (trimmed.startsWith('---')) {
      elements.push(<hr key={idx} className="my-3 border-white/10" />);
    } else if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
      elements.push(
        <div key={idx} className="flex items-start gap-2 my-1 text-stone-200 pl-1 leading-relaxed">
          <span className="text-emerald-400 mt-0.5">•</span>
          <div className="flex-1">{renderFormattedText(trimmed.slice(2))}</div>
        </div>
      );
    } else if (trimmed.match(/^\d+\.\s+/)) {
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      elements.push(
        <div key={idx} className="flex items-start gap-2 my-1.5 text-stone-200 pl-1 leading-relaxed">
          <span className="font-bold text-emerald-400 min-w-[20px]">{numMatch ? numMatch[1] : '•'}.</span>
          <div className="flex-1">{renderFormattedText(numMatch ? numMatch[2] : trimmed)}</div>
        </div>
      );
    } else if (trimmed) {
      elements.push(
        <p key={idx} className="my-1.5 leading-relaxed text-stone-200">
          {renderFormattedText(trimmed)}
        </p>
      );
    }
  });

  if (inTable) {
    flushTable(lines.length);
  }

  return <div className="space-y-1">{elements}</div>;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Xin chào! 👋 Tôi là **Trợ lý AI Di sản Chín Hầm**.\n\nTôi sẵn sàng giải đáp và cung cấp tư liệu lịch sử về 9 căn hầm, nhân vật Ngô Đình Cẩn, chế độ ngục tù và ngày giải phóng 02/11/1963.\n\nHãy chọn câu hỏi gợi ý bên dưới hoặc nhập câu hỏi của bạn!',
      intent: 'greeting',
      suggestions: [
        'Tại sao Hầm số 4 được gọi là chuồng cọp?',
        'Ngô Đình Cẩn là ai và có vai trò gì?',
        'So sánh Hầm số 1 và Hầm số 4',
      ]
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>(defaultQuickQuestions);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống dưới khi có tin nhắn mới
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isLoading) return;

    const newUserMessage: ChatMessage = { sender: 'user', text: trimmed };
    setMessages((current) => [...current, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: trimmed }),
      });

      const result = await response.json();
      const replyText = result.reply || 'Tôi chưa có câu trả lời phù hợp cho câu hỏi này.';

      const newBotMessage: ChatMessage = {
        sender: 'bot',
        text: replyText,
        sources: result.sources || [],
        suggestions: result.suggestions || [],
        intent: result.intent,
        reasoningMode: result.reasoning_mode,
      };

      setMessages((current) => [...current, newBotMessage]);

      if (result.suggestions && result.suggestions.length > 0) {
        setCurrentSuggestions(result.suggestions);
      }
    } catch (error) {
      setMessages((current) => [
        ...current,
        { sender: 'bot', text: 'Đã xảy ra lỗi khi kết nối với máy chủ AI. Vui lòng kiểm tra lại dịch vụ.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <main className="container-shell py-16">
      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Trợ Lý AI Di Sản Chín Hầm
        </div>
        <h1 className="text-4xl font-black text-white md:text-5xl font-display drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          Trợ Lý AI Di Sản Chín Hầm
        </h1>
        <p className="mt-3 max-w-2xl text-stone-300 text-base leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          Hệ thống hỗ trợ tra cứu lịch sử, giải đáp thông tin và cung cấp tư liệu chi tiết về di tích Chín Hầm - Đồi Ba Đồn.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[2.5rem] border-2 border-emerald-500/30 bg-gradient-to-b from-transparent via-black/[0.04] to-black/[0.08] p-6 backdrop-blur-[3px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] shadow-2xl flex flex-col h-[750px]">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between border-b border-emerald-500/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/40 bg-white/5 backdrop-blur-[3px] text-base font-bold text-emerald-300 shadow-md">
                🤖
              </div>
              <div>
                <div className="font-bold text-white font-display text-lg">
                  Trợ Lý Di Sản Huế
                </div>
                <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Đang trực tuyến</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                setMessages([messages[0]]);
                setCurrentSuggestions(defaultQuickQuestions);
              }}
              title="Xóa hội thoại"
              className="text-xs text-stone-400 hover:text-white px-3 py-1.5 rounded-full border border-emerald-500/20 bg-white/5 hover:bg-white/10 transition backdrop-blur-[3px]"
            >
              Làm mới
            </button>
          </div>

          {/* Chat Messages Container */}
          <div 
            ref={chatScrollRef}
            className="flex-1 space-y-4 rounded-2xl border-2 border-emerald-500/20 bg-transparent p-4 text-sm text-stone-200 overflow-y-auto pr-2 backdrop-blur-[2px]"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={message.sender === 'user'
                  ? 'ml-auto max-w-[85%] rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white shadow-md'
                  : 'max-w-[95%] rounded-2xl border-2 border-emerald-500/35 bg-black/[0.08] p-4 text-stone-200 backdrop-blur-md shadow-xl space-y-2'
                }
              >
                {/* Badge phân loại lập luận cho bot */}
                {message.sender === 'bot' && (message.intent || message.reasoningMode) && (
                  <div className="mb-2">
                    {getReasoningBadge(message.intent, message.reasoningMode)}
                  </div>
                )}

                {/* Nội dung tin nhắn */}
                <div className="text-sm">
                  {message.sender === 'bot' ? (
                    <MarkdownContent text={message.text} />
                  ) : (
                    message.text
                  )}
                </div>

                {/* Gợi ý câu hỏi đi kèm từng câu trả lời */}
                {message.sender === 'bot' && message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-emerald-500/15">
                    <div className="text-[11px] font-semibold text-emerald-400 mb-1.5 flex items-center gap-1">
                      <span>💡</span> <span>Gợi ý câu hỏi liên quan:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {message.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => sendMessage(sug)}
                          className="text-left text-xs bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 hover:border-emerald-400/50 text-emerald-200 px-3 py-1 rounded-full transition backdrop-blur-sm"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="max-w-[80%] rounded-2xl border-2 border-emerald-500/35 bg-black/[0.08] p-4 text-stone-200 backdrop-blur-md flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-emerald-300">Đang tra cứu tư liệu & suy luận câu trả lời...</span>
              </div>
            )}
          </div>

          {/* Quick suggestions bar */}
          <div className="mt-3">
            <div className="text-[11px] text-stone-400 mb-1.5 font-medium flex items-center gap-1">
              <span>⚡</span> <span>Khám phá nhanh:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentSuggestions.slice(0, 4).map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  className="rounded-full border border-emerald-500/25 bg-white/5 px-3.5 py-1 text-xs font-medium text-emerald-200 backdrop-blur-[3px] transition-all hover:border-emerald-400/60 hover:bg-emerald-600 hover:text-white hover:shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Hỏi về Ngô Đình Cẩn, chuồng cọp, ngày phá hầm 1963, lộ trình..."
              className="flex-1 rounded-full border-2 border-emerald-500/30 bg-black/[0.08] px-5 py-3 text-sm text-white placeholder-stone-400 outline-none backdrop-blur-md transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-full bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition hover:from-emerald-500 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Đang xử lý...' : 'Gửi'}
            </button>
          </form>
        </div>

        {/* Right Panel: Thông tin hệ thống & FAQ */}
        <div className="space-y-4">
          <div className="rounded-[2.5rem] border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] p-6 backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] shadow-2xl">
            <h2 className="text-lg font-bold text-white font-display mb-3 flex items-center gap-2">
              <span className="text-emerald-400">⚙️</span> Cơ Chế Trả Lời Thông Minh
            </h2>
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-black/[0.05] backdrop-blur-[3px]">
                <span className="font-semibold text-emerald-300">1. Phân tích câu hỏi</span>: Nhận diện ý định và dữ liệu lịch sử
              </div>
              <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-black/[0.05] backdrop-blur-[3px]">
                <span className="font-semibold text-emerald-300">2. Truy hồi tư liệu</span>: Tìm kiếm chuẩn xác dữ liệu 9 căn hầm
              </div>
              <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-black/[0.05] backdrop-blur-[3px]">
                <span className="font-semibold text-emerald-300">3. Đối chiếu sự kiện</span>: Phân tích nhân quả, so sánh và dòng thời gian
              </div>
              <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-black/[0.05] backdrop-blur-[3px]">
                <span className="font-semibold text-emerald-300">4. Trích dẫn & Định dạng</span>: Trình bày súc tích kèm nguồn khảo chứng
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-emerald-500/20 bg-gradient-to-b from-transparent via-black/[0.06] to-black/[0.12] p-6 backdrop-blur-[3px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] shadow-2xl">
            <h2 className="text-lg font-bold text-[#fef08a] font-display mb-3">Câu Hỏi Thường Gặp</h2>
            <div className="space-y-3">
              {faqItems.map((item) => (
                <div 
                  key={item.question} 
                  onClick={() => sendMessage(item.question)}
                  className="rounded-2xl border border-emerald-500/20 bg-black/[0.05] p-3.5 backdrop-blur-[3px] hover:border-emerald-500/40 hover:bg-black/[0.15] cursor-pointer transition group"
                >
                  <div className="font-bold text-white text-xs group-hover:text-emerald-300 transition flex items-center justify-between">
                    <span>{item.question}</span>
                    <span className="text-stone-400 group-hover:text-emerald-400">→</span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-stone-300 line-clamp-2">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
