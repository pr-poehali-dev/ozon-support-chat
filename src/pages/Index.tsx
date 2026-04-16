import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const MOCK_TICKETS = [
  {
    id: "TK-1042",
    subject: "Не работает оплата на сайте",
    status: "open",
    priority: "high",
    date: "2026-04-16T10:23:00",
    unread: 2,
    client: { name: "Алексей Морозов", email: "morozov@mail.ru", phone: "+7 916 234-55-12" },
    messages: [
      { id: 1, from: "client", text: "Добрый день! При попытке оплатить заказ выдаёт ошибку «Платёж отклонён». Карта рабочая, деньги есть. Что делать?", time: "2026-04-16T10:23:00", files: [] },
      { id: 2, from: "agent", text: "Здравствуйте, Алексей! Уже разбираемся с этим вопросом. Уточните, пожалуйста, какой браузер вы используете?", time: "2026-04-16T10:31:00", files: [] },
      { id: 3, from: "client", text: "Chrome, последняя версия. Вот скриншот ошибки.", time: "2026-04-16T10:35:00", files: [{ name: "error_screenshot.png", type: "image", size: "142 KB" }] },
    ],
    rating: null,
  },
  {
    id: "TK-1041",
    subject: "Запрос на возврат средств",
    status: "pending",
    priority: "medium",
    date: "2026-04-15T14:10:00",
    unread: 0,
    client: { name: "Мария Соколова", email: "sokolova@gmail.com", phone: "+7 903 100-22-33" },
    messages: [
      { id: 1, from: "client", text: "Здравствуйте, хотела бы вернуть товар, заказ №89234. Он не подошёл по размеру.", time: "2026-04-15T14:10:00", files: [] },
      { id: 2, from: "agent", text: "Мария, добрый день! Для оформления возврата заполните форму по ссылке и прикрепите фото товара.", time: "2026-04-15T14:45:00", files: [] },
      { id: 3, from: "client", text: "Заполнила. Прикладываю документы.", time: "2026-04-15T15:02:00", files: [{ name: "return_form.pdf", type: "pdf", size: "89 KB" }, { name: "photo_item.jpg", type: "image", size: "2.1 MB" }] },
    ],
    rating: null,
  },
  {
    id: "TK-1039",
    subject: "Вопрос по тарифам",
    status: "closed",
    priority: "low",
    date: "2026-04-14T09:00:00",
    unread: 0,
    client: { name: "Дмитрий Лебедев", email: "lebedev.d@yandex.ru", phone: "+7 926 500-77-88" },
    messages: [
      { id: 1, from: "client", text: "Подскажите, какой тариф подойдёт для команды из 10 человек?", time: "2026-04-14T09:00:00", files: [] },
      { id: 2, from: "agent", text: "Дмитрий, для команды от 10 человек оптимален тариф «Бизнес» — 2990 ₽/мес. Включает неограниченные проекты и приоритетную поддержку.", time: "2026-04-14T09:15:00", files: [] },
      { id: 3, from: "client", text: "Отлично, спасибо за быстрый ответ!", time: "2026-04-14T09:22:00", files: [] },
    ],
    rating: 5,
  },
  {
    id: "TK-1038",
    subject: "Не приходит письмо подтверждения",
    status: "closed",
    priority: "medium",
    date: "2026-04-13T18:30:00",
    unread: 0,
    client: { name: "Екатерина Новикова", email: "e.novikova@corp.ru", phone: "+7 985 333-44-55" },
    messages: [
      { id: 1, from: "client", text: "Зарегистрировалась час назад, письмо с подтверждением так и не пришло.", time: "2026-04-13T18:30:00", files: [] },
      { id: 2, from: "agent", text: "Екатерина, проверили — письмо попало в спам. Также выслали повторно на вашу почту.", time: "2026-04-13T18:42:00", files: [] },
      { id: 3, from: "client", text: "Нашла в спаме, всё ок. Спасибо!", time: "2026-04-13T18:50:00", files: [] },
    ],
    rating: 4,
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  open: { label: "Открыт", color: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  pending: { label: "Ожидание", color: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  closed: { label: "Закрыт", color: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  high: { label: "Высокий", color: "text-rose-500" },
  medium: { label: "Средний", color: "text-amber-500" },
  low: { label: "Низкий", color: "text-slate-400" },
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("ru", { day: "numeric", month: "short" });
}

function formatFullTime(iso: string) {
  return new Date(iso).toLocaleString("ru", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

type FileItem = { name: string; type: string; size: string };

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

function StarRating({ value, onChange, readonly = false }: { value: number | null; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          disabled={readonly}
          className={`transition-transform ${!readonly ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => onChange && onChange(star)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2L12.09 7.26L17.8 7.27L13.45 10.87L15.18 16.2L10 13L4.82 16.2L6.55 10.87L2.2 7.27L7.91 7.26L10 2Z"
              fill={(hovered || value || 0) >= star ? "#f59e0b" : "none"}
              stroke={(hovered || value || 0) >= star ? "#f59e0b" : "#cbd5e1"}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

type Message = { id: number; from: string; text: string; time: string; files: FileItem[] };
type Ticket = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  date: string;
  unread: number;
  client: { name: string; email: string; phone: string };
  messages: Message[];
  rating: number | null;
};

export default function Index() {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [selected, setSelected] = useState<Ticket>(tickets[0]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showRating, setShowRating] = useState(false);
  const [ratingComment, setRatingComment] = useState("");
  const [pendingRating, setPendingRating] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filtered = tickets.filter((t) => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages]);

  function sendMessage() {
    if (!message.trim() && files.length === 0) return;
    const newMsg: Message = {
      id: Date.now(),
      from: "agent",
      text: message,
      time: new Date().toISOString(),
      files: files.map((f) => ({ name: f.name, type: f.type.startsWith("image") ? "image" : "pdf", size: (f.size / 1024).toFixed(0) + " KB" })),
    };
    const updated = tickets.map((t) =>
      t.id === selected.id ? { ...t, messages: [...t.messages, newMsg] } : t
    );
    setTickets(updated);
    const upd = updated.find((t) => t.id === selected.id)!;
    setSelected(upd);
    setMessage("");
    setFiles([]);
  }

  function closeTicket() {
    setShowRating(true);
  }

  function submitRating() {
    if (!pendingRating) return;
    const updated = tickets.map((t) =>
      t.id === selected.id ? { ...t, status: "closed", rating: pendingRating } : t
    );
    setTickets(updated);
    const upd = updated.find((t) => t.id === selected.id)!;
    setSelected(upd);
    setShowRating(false);
    setPendingRating(null);
    setRatingComment("");
  }

  function selectTicket(t: Ticket) {
    setSelected(t);
    setSidebarOpen(false);
  }

  return (
    <div className="h-screen flex bg-[#f7f8fa] font-golos overflow-hidden relative">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* LEFT PANEL */}
      <aside className={`
        fixed md:static z-30 md:z-auto top-0 left-0 h-full
        w-72 bg-white border-r border-slate-100 flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="px-5 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-[17px] font-semibold text-slate-800 tracking-tight">Поддержка</h1>
              <p className="text-xs text-slate-400 mt-0.5">Центр обработки обращений</p>
            </div>
            <button className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-colors">
              <Icon name="Plus" size={15} />
            </button>
          </div>
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по обращениям..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-slate-400 transition-colors placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="px-4 pt-3 pb-2 flex gap-1.5 flex-wrap">
          {[
            { key: "all", label: "Все" },
            { key: "open", label: "Открытые" },
            { key: "pending", label: "Ожидание" },
            { key: "closed", label: "Закрытые" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === f.key ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div className="text-center text-slate-400 text-sm py-12">Обращений не найдено</div>
          )}
          {filtered.map((ticket) => {
            const st = STATUS_CONFIG[ticket.status];
            const isSelected = selected?.id === ticket.id;
            return (
              <button
                key={ticket.id}
                onClick={() => selectTicket(ticket)}
                className={`w-full text-left px-5 py-3.5 border-b border-slate-50 transition-colors ${
                  isSelected ? "bg-slate-50" : "hover:bg-slate-50/60"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className={`text-[11px] font-mono font-medium ${PRIORITY_CONFIG[ticket.priority].color}`}>{ticket.id}</span>
                  <div className="flex items-center gap-1.5">
                    {ticket.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[10px] flex items-center justify-center font-semibold">
                        {ticket.unread}
                      </span>
                    )}
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${st.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>
                </div>
                <p className="text-[13px] font-medium text-slate-700 leading-snug line-clamp-1 mb-1">{ticket.subject}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{ticket.client.name}</span>
                  <span className="text-[11px] text-slate-400">{formatTime(ticket.date)}</span>
                </div>
                {ticket.rating && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <StarRating value={ticket.rating} readonly />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 grid grid-cols-3 gap-3">
          {[
            { label: "Открытых", value: tickets.filter((t) => t.status === "open").length, color: "text-emerald-600" },
            { label: "Ожидание", value: tickets.filter((t) => t.status === "pending").length, color: "text-amber-600" },
            { label: "Закрытых", value: tickets.filter((t) => t.status === "closed").length, color: "text-slate-500" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className={`text-lg font-semibold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        {selected ? (
          <>
            <header className="bg-white border-b border-slate-100 px-6 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  className="md:hidden w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-lg"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Icon name="Menu" size={18} />
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-semibold text-sm shrink-0">
                  {selected.client.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{selected.client.name}</span>
                    <span className="text-xs text-slate-400 font-mono">{selected.id}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-[300px]">{selected.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selected.status !== "closed" && (
                  <button
                    onClick={closeTicket}
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
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5 ${isAgent ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-600"}`}>
                          {isAgent ? "А" : selected.client.name.charAt(0)}
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
                        <StarRating value={pendingRating} onChange={setPendingRating} />
                      </div>
                      <textarea
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        placeholder="Оставьте комментарий (необязательно)..."
                        className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 resize-none transition-colors placeholder:text-slate-400"
                        rows={3}
                      />
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => setShowRating(false)}
                          className="flex-1 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                          Отмена
                        </button>
                        <button
                          onClick={submitRating}
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
                            <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-slate-400 hover:text-rose-500 ml-0.5">
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
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
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
                          onChange={(e) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])}
                        />
                        <button
                          onClick={() => fileRef.current?.click()}
                          className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                          <Icon name="Paperclip" size={16} />
                        </button>
                        <button
                          onClick={sendMessage}
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
                      <span className="text-xs font-medium text-slate-700">{selected.messages.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Создано</span>
                      <span className="text-xs text-slate-700">{formatTime(selected.date)}</span>
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
                        onClick={() => selectTicket(t)}
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
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <Icon name="MessageSquare" size={40} className="mx-auto mb-3 opacity-30" />
              <p>Выберите обращение</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
