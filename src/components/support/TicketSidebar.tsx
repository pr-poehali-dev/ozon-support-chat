import Icon from "@/components/ui/icon";
import { Ticket, STATUS_CONFIG, PRIORITY_CONFIG, formatTime } from "./types";
import StarRating from "./StarRating";

interface TicketSidebarProps {
  tickets: Ticket[];
  filtered: Ticket[];
  selected: Ticket;
  search: string;
  filter: string;
  sidebarOpen: boolean;
  onSearch: (v: string) => void;
  onFilter: (v: string) => void;
  onSelect: (t: Ticket) => void;
  onCloseSidebar: () => void;
}

export default function TicketSidebar({
  tickets,
  filtered,
  selected,
  search,
  filter,
  sidebarOpen,
  onSearch,
  onFilter,
  onSelect,
  onCloseSidebar,
}: TicketSidebarProps) {
  return (
    <aside
      className={`
        fixed md:static z-30 md:z-auto top-0 left-0 h-full
        w-72 bg-white border-r border-slate-100 flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
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
            onChange={(e) => onSearch(e.target.value)}
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
            onClick={() => onFilter(f.key)}
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
              onClick={() => { onSelect(ticket); onCloseSidebar(); }}
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
  );
}
