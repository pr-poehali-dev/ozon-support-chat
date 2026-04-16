import { useState, useRef } from "react";
import { Ticket, Message, MOCK_TICKETS } from "@/components/support/types";
import ChatArea from "@/components/support/ChatArea";

export default function Index() {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [selected, setSelected] = useState<Ticket>(tickets[0]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showRating, setShowRating] = useState(false);
  const [ratingComment, setRatingComment] = useState("");
  const [pendingRating, setPendingRating] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function sendMessage() {
    if (!message.trim() && files.length === 0) return;
    const newMsg: Message = {
      id: Date.now(),
      from: "client",
      text: message,
      time: new Date().toISOString(),
      files: files.map((f) => ({ name: f.name, type: f.type.startsWith("image") ? "image" : "pdf", size: (f.size / 1024).toFixed(0) + " KB" })),
    };
    const autoReply: Message = {
      id: Date.now() + 1,
      from: "agent",
      text: "Ваше сообщение получено. Пожалуйста, ожидайте ответа специалиста.",
      time: new Date().toISOString(),
      files: [],
    };
    const updated = tickets.map((t) =>
      t.id === selected.id ? { ...t, messages: [...t.messages, newMsg, autoReply] } : t
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

  return (
    <div className="h-screen flex bg-[#f7f8fa] font-golos overflow-hidden relative">
      <main className="flex-1 flex flex-col min-w-0">
        <ChatArea
          tickets={tickets}
          selected={selected}
          message={message}
          files={files}
          showRating={showRating}
          ratingComment={ratingComment}
          pendingRating={pendingRating}
          fileRef={fileRef}
          onOpenSidebar={() => {}}
          onMessageChange={setMessage}
          onFilesChange={setFiles}
          onSendMessage={sendMessage}
          onCloseTicket={closeTicket}
          onSubmitRating={submitRating}
          onCancelRating={() => setShowRating(false)}
          onRatingCommentChange={setRatingComment}
          onPendingRatingChange={setPendingRating}
          onSelectTicket={setSelected}
        />
      </main>
    </div>
  );
}