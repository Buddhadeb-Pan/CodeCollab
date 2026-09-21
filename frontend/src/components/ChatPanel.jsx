import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const ChatPanel = ({ socket, roomCode, messages, setMessages, typingUsers }) => {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    setSending(true);
    socket.emit("chat-message", { roomCode, text: input });
    setInput("");
    setSending(false);

    // Stop typing indicator
    if (isTypingRef.current) {
      socket.emit("typing-stop", { roomCode });
      isTypingRef.current = false;
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!socket) return;

    // Start typing
    if (!isTypingRef.current && e.target.value.length > 0) {
      socket.emit("typing-start", { roomCode });
      isTypingRef.current = true;
    }

    // Reset debounce
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        socket.emit("typing-stop", { roomCode });
        isTypingRef.current = false;
      }
    }, 1500);

    // If input empty, stop immediately
    if (e.target.value.length === 0 && isTypingRef.current) {
      socket.emit("typing-stop", { roomCode });
      isTypingRef.current = false;
    }
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="border border-line bg-bg-surface flex flex-col h-[500px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-line flex items-center justify-between">
        <div className="font-mono text-xs text-muted tracking-wider">
          // chat
        </div>
        <div className="font-mono text-xs text-green-400">
          ● {messages.length}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center font-mono text-xs text-muted py-8">
            // no messages yet
            <br />
            <span className="text-muted/60">say hi to your collaborator</span>
          </div>
        ) : (
          messages.map((m) => {
            const isOwn = m.userId === user?.id;
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] text-muted">
                    {isOwn ? "you" : m.name}
                  </span>
                  <span className="font-mono text-[10px] text-muted/50">
                    {formatTime(m.timestamp)}
                  </span>
                </div>
                <div
                  className={`font-mono text-xs px-3 py-1.5 max-w-[85%] break-words ${
                    isOwn
                      ? "bg-amber text-bg-primary"
                      : "bg-bg-primary border border-line text-cream"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      <div className="px-4 py-1 h-5">
        {typingUsers.length > 0 && (
          <div className="font-mono text-[10px] text-amber animate-pulse">
            {typingUsers.length === 1
              ? `${typingUsers[0].name} is typing...`
              : `${typingUsers.map((u) => u.name).join(", ")} are typing...`}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-line p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="type a message..."
          maxLength={500}
          className="flex-1 bg-bg-primary border border-line text-cream font-mono text-xs px-3 py-2 focus:outline-none focus:border-amber transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="font-mono text-xs border border-amber text-amber px-3 py-2 hover:bg-amber hover:text-bg-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          send_
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
