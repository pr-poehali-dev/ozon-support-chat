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
