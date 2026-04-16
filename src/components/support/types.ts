export type FileItem = { name: string; type: string; size: string };

export type Message = { id: number; from: string; text: string; time: string; files: FileItem[] };

export type Ticket = {
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

export const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  open: { label: "Открыт", color: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  pending: { label: "Ожидание", color: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  closed: { label: "Закрыт", color: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
};

export const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  high: { label: "Высокий", color: "text-rose-500" },
  medium: { label: "Средний", color: "text-amber-500" },
  low: { label: "Низкий", color: "text-slate-400" },
};

export function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("ru", { day: "numeric", month: "short" });
}

export function formatFullTime(iso: string) {
  return new Date(iso).toLocaleString("ru", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "TK-2291",
    subject: "Снятие средств с карты",
    status: "open",
    priority: "medium",
    date: "2026-04-14T17:13:00",
    unread: 0,
    client: { name: "Вы", email: "", phone: "" },
    messages: [
      {
        id: 1,
        from: "client",
        text: "Здравствуйте. Подскажите, смогу ли я снять средства с карты 17 числа?",
        time: "2026-04-14T17:13:00",
        files: [],
      },
      {
        id: 2,
        from: "agent",
        text: "Здравствуйте! Пока, как и планировалось, после расторжения договора вы сможете снять средства с карты. Если ситуация изменится, мы вас уведомим заранее.",
        time: "2026-04-14T17:21:00",
        files: [],
      },
    ],
    rating: null,
  },
];