import { useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Ticket, FileItem, STATUS_CONFIG, PRIORITY_CONFIG, formatTime, formatFullTime } from "./types";
import StarRating from "./StarRating";

function FileChip({ file }: { file: FileItem }) {
  const isImage = file.type === "image";
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 mt-2 cursor-pointer hover:bg-slate-50 transition-colors">
      <Icon name={isImage ? "Image" : "FileText"} size={13} />
      <span className="font-medium">{file.name}</span>
      <span className="text-slate-400">{file.size}</span>
    </div>
  );
}

interface ChatAreaProps {
  tickets: Ticket[];
  selected: Ticket;
  message: string;
  files: File[];
  showRating: boolean;
  ratingComment: string;
  pendingRating: number | null;
  fileRef: React.RefObject<HTMLInputElement>;
  onOpenSidebar: () => void;
  onMessageChange: (v: string) => void;
  onFilesChange: (files: File[]) => void;
  onSendMessage: () => void;
  onCloseTicket: () => void;
  onSubmitRating: () => void;
  onCancelRating: () => void;
  onRatingCommentChange: (v: string) => void;
  onPendingRatingChange: (v: number) => void;
  onSelectTicket: (t: Ticket) => void;
}

export default function ChatArea({
  tickets,
  selected,
  message,
  files,
  showRating,
  ratingComment,
  pendingRating,
  fileRef,
  onOpenSidebar,
  onMessageChange,
  onFilesChange,
  onSendMessage,
  onCloseTicket,
  onSubmitRating,
  onCancelRating,
  onRatingCommentChange,
  onPendingRatingChange,
  onSelectTicket,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages]);

  return (
    <>
      <header className="bg-white border-b border-slate-100 px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#005bff] flex items-center justify-center shrink-0 overflow-hidden">
            <span className="text-white font-bold text-[11px] tracking-tight leading-none">OZON</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">Озон</span>
              <span className="text-xs text-slate-400 font-mono">{selected.id}</span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[300px]">{selected.subject}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selected.status !== "closed" && (
            <button
              onClick={onCloseTicket}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Icon name="CheckCheck" size={13} />
              Закрыть обращение
            </button>
          )}
          <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
            <Icon name="MoreVertical" size={16} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Messages */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {selected.messages.map((msg) => {
              const isAgent = msg.from === "agent";
              return (
                <div key={msg.id} className={`flex gap-3 ${isAgent ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isAgent ? "bg-[#005bff]" : "bg-slate-200"}`}>
                    {isAgent
                      ? <span className="text-white font-bold text-[8px] tracking-tight leading-none">OZON</span>
                      : <span className="text-slate-600 text-[11px] font-semibold">Я</span>
                    }
                  </div>
                  <div className={`max-w-[72%] ${isAgent ? "items-end" : "items-start"} flex flex-col`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isAgent
                        ? "bg-slate-800 text-white rounded-tr-sm"
                        : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm shadow-sm"
                    }`}>
                      {msg.text}
                    </div>
                    {msg.files.length > 0 && (
                      <div className={`flex flex-wrap gap-2 ${isAgent ? "justify-end" : ""}`}>
                        {msg.files.map((f, i) => <FileChip key={i} file={f} />)}
                      </div>
                    )}
                    <span className="text-[11px] text-slate-400 mt-1.5 px-1">{formatFullTime(msg.time)}</span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Rating modal */}
          {showRating && (
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10 backdrop-blur-[2px]">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-80 mx-4 animate-scale-in">
                <div className="text-center mb-5">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="Star" size={22} className="text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-slate-800 text-base">Оценка качества</h3>
                  <p className="text-sm text-slate-500 mt-1">Как вы оцениваете работу оператора?</p>
                </div>
                <div className="flex justify-center mb-4">
                  <StarRating value={pendingRating} onChange={onPendingRatingChange} />
                </div>
                <textarea
                  value={ratingComment}
                  onChange={(e) => onRatingCommentChange(e.target.value)}
                  placeholder="Оставьте комментарий (необязательно)..."
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 resize-none transition-colors placeholder:text-slate-400"
                  rows={3}
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={onCancelRating}
                    className="flex-1 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={onSubmitRating}
                    disabled={!pendingRating}
                    className="flex-1 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Подтвердить
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          {selected.status !== "closed" ? (
            <div className="bg-white border-t border-slate-100 px-5 py-4 shrink-0">
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                      <Icon name={f.type.startsWith("image") ? "Image" : "FileText"} size={12} />
                      <span className="max-w-[120px] truncate">{f.name}</span>
                      <button onClick={() => onFilesChange(files.filter((_, j) => j !== i))} className="text-slate-400 hover:text-rose-500 ml-0.5">
                        <Icon name="X" size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={message}
                    onChange={(e) => onMessageChange(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSendMessage(); } }}
                    placeholder="Напишите ответ... (Enter для отправки)"
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 resize-none transition-colors placeholder:text-slate-400 min-h-[44px] max-h-32"
                    rows={1}
                  />
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => e.target.files && onFilesChange([...files, ...Array.from(e.target.files)])}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <Icon name="Paperclip" size={16} />
                  </button>
                  <button
                    onClick={onSendMessage}
                    className="w-9 h-9 flex items-center justify-center bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    <Icon name="Send" size={15} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 text-center shrink-0">
              <span className="text-sm text-slate-400">Обращение закрыто</span>
              {selected.rating && (
                <div className="flex justify-center mt-2">
                  <StarRating value={selected.rating} readonly />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right panel */}
        <aside className="hidden lg:flex w-60 bg-white border-l border-slate-100 flex-col shrink-0 overflow-y-auto">
          <div className="px-5 pt-5 pb-4 border-b border-slate-100">
            <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-4">Клиент</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-semibold shrink-0">
                {selected.client.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{selected.client.name}</p>
                <p className="text-xs text-slate-400">Клиент</p>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <Icon name="Mail" size={13} className="text-slate-400 shrink-0" />
                <span className="truncate">{selected.client.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <Icon name="Phone" size={13} className="text-slate-400 shrink-0" />
                <span>{selected.client.phone}</span>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Обращение</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Статус</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${STATUS_CONFIG[selected.status].color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[selected.status].dot}`} />
                  {STATUS_CONFIG[selected.status].label}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Приоритет</span>
                <span className={`text-xs font-medium ${PRIORITY_CONFIG[selected.priority].color}`}>
                  {PRIORITY_CONFIG[selected.priority].label}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Сообщений</span>
                <span className="text-xs font-medium text-slate-700">107+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Создано</span>
                <span className="text-xs text-slate-700">17 фев.</span>
              </div>
            </div>
          </div>

          {selected.rating && (
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Оценка</h3>
              <StarRating value={selected.rating} readonly />
              <p className="text-xs text-slate-500 mt-2">{selected.rating} из 5 звёзд</p>
            </div>
          )}

          <div className="px-5 py-4">
            <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">История обращений</h3>
            <div className="space-y-1.5">
              {tickets.filter((t) => t.client.name === selected.client.name).map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSelectTicket(t)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-xs ${t.id === selected.id ? "bg-slate-100" : "hover:bg-slate-50"}`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-mono text-slate-500">{t.id}</span>
                    <span className={`text-[10px] ${STATUS_CONFIG[t.status].color} px-1.5 py-0.5 rounded-full`}>
                      {STATUS_CONFIG[t.status].label}
                    </span>
                  </div>
                  <p className="text-slate-700 line-clamp-1 font-medium">{t.subject}</p>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}