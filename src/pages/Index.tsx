import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { Ticket, Message, MOCK_TICKETS } from "@/components/support/types";
import TicketSidebar from "@/components/support/TicketSidebar";
import ChatArea from "@/components/support/ChatArea";

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

  const filtered = tickets.filter((t) => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

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
    setSelected(updated.find((t) => t.id === selected.id)!);
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
    setSelected(updated.find((t) => t.id === selected.id)!);
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

      <TicketSidebar
        tickets={tickets}
        filtered={filtered}
        selected={selected}
        search={search}
        filter={filter}
        sidebarOpen={sidebarOpen}
        onSearch={setSearch}
        onFilter={setFilter}
        onSelect={selectTicket}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {selected ? (
          <ChatArea
            tickets={tickets}
            selected={selected}
            message={message}
            files={files}
            showRating={showRating}
            ratingComment={ratingComment}
            pendingRating={pendingRating}
            fileRef={fileRef}
            onOpenSidebar={() => setSidebarOpen(true)}
            onMessageChange={setMessage}
            onFilesChange={setFiles}
            onSendMessage={sendMessage}
            onCloseTicket={closeTicket}
            onSubmitRating={submitRating}
            onCancelRating={() => setShowRating(false)}
            onRatingCommentChange={setRatingComment}
            onPendingRatingChange={setPendingRating}
            onSelectTicket={selectTicket}
          />
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
