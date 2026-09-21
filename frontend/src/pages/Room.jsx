import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../hooks/useSocket";
import Navbar from "../components/Navbar";
import CodeEditor from "../components/CodeEditor";
import UserList from "../components/UserList";
import ChatPanel from "../components/ChatPanel";

const starterCode = {
  javascript: '// Welcome to CodeCollab\n// Start typing to collaborate\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
  python: '# Welcome to CodeCollab\n# Start typing to collaborate\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))',
  cpp: '// Welcome to CodeCollab\n// Start typing to collaborate\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  java: '// Welcome to CodeCollab\n// Start typing to collaborate\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
};

const Room = () => {
  const { code: roomCodeParam } = useParams();
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [modified, setModified] = useState(false);
  const [users, setUsers] = useState([]);
  const [syncReady, setSyncReady] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [remoteCursors, setRemoteCursors] = useState({}); // { userId: { name, position } }

  // Track what server last sent us — to prevent echo
  const lastRemoteCode = useRef(null);
  const joinedRef = useRef(false);
  const cursorThrottleRef = useRef(null);

  // 1. Fetch room metadata
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/api/rooms/${roomCodeParam}`);
        const r = res.data.data.room;
        setRoom(r);
        setLanguage(r.language || "javascript");
      } catch (err) {
        setError(true);
        toast.error(err.response?.data?.message || "Room not found");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomCodeParam]);

  // 2. Register socket listeners ONCE per socket instance
  useEffect(() => {
    if (!socket) return;

    const onSnapshot = ({ code: snapCode, language: snapLang }) => {
      console.log("📥 Snapshot:", { code: snapCode, lang: snapLang });

      if (snapCode === null || snapCode === undefined) {
        // Server has NO code — we will seed starter (handled in effect 3)
        setSyncReady(true);
        return;
      }

      // Server has code (could be empty string if user cleared it)
      lastRemoteCode.current = snapCode;
      setCode(snapCode);
      if (snapLang) setLanguage(snapLang);
      if (snapCode.length > 0) setModified(true);
      setSyncReady(true);
    };

    const onUpdate = ({ code: newCode, language: newLang }) => {
      console.log("📥 Update received, len:", newCode?.length);
      lastRemoteCode.current = newCode;
      setCode(newCode);
      if (newLang) setLanguage(newLang);
      setModified(true);
    };

    const onUsers = (list) => {
      setUsers(list);
      // Clean up cursors for users who left
      const activeUserIds = new Set(list.map((u) => u.userId));
      setRemoteCursors((prev) => {
        const next = {};
        Object.entries(prev).forEach(([uid, val]) => {
          if (activeUserIds.has(uid)) {
            next[uid] = val;
          }
        });
        return next;
      });
    };

    const onChatHistory = (history) => {
      setMessages(history || []);
    };

    const onChatMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const onUserTyping = ({ userId, name }) => {
      setTypingUsers((prev) => {
        if (prev.some((u) => u.userId === userId)) return prev;
        return [...prev, { userId, name }];
      });
    };

    const onUserStopTyping = ({ userId }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
    };

    const onCursorUpdate = ({ userId, name, position }) => {
      setRemoteCursors((prev) => ({
        ...prev,
        [userId]: { name, position },
      }));
    };

    socket.on("code-snapshot", onSnapshot);
    socket.on("code-update", onUpdate);
    socket.on("room-users", onUsers);
    socket.on("chat-history", onChatHistory);
    socket.on("chat-message", onChatMessage);
    socket.on("user-typing", onUserTyping);
    socket.on("user-stop-typing", onUserStopTyping);
    socket.on("cursor-update", onCursorUpdate);

    return () => {
      socket.off("code-snapshot", onSnapshot);
      socket.off("code-update", onUpdate);
      socket.off("room-users", onUsers);
      socket.off("chat-history", onChatHistory);
      socket.off("chat-message", onChatMessage);
      socket.off("user-typing", onUserTyping);
      socket.off("user-stop-typing", onUserStopTyping);
      socket.off("cursor-update", onCursorUpdate);
    };
  }, [socket]);

  // 3. Join room when we have socket + room + user
  useEffect(() => {
    if (!socket || !room || !user) return;
    if (joinedRef.current) return;

    const doJoin = () => {
      console.log("📤 Emitting join-room:", room.code, user.name);
      socket.emit("join-room", { roomCode: room.code, user });
      joinedRef.current = true;
    };

    if (socket.connected) doJoin();
    socket.on("connect", doJoin);

    return () => {
      socket.off("connect", doJoin);
      socket.emit("leave-room");
      joinedRef.current = false;
      setSyncReady(false);
      setRemoteCursors({});
    };
  }, [socket, room, user]);

  // 4. Seed starter code if server has none
  useEffect(() => {
    if (!syncReady || !room || !socket) return;

    // If server has no code AND our local is empty → seed starter
    if (lastRemoteCode.current === null && code === "") {
      const initial = starterCode[room.language] || starterCode.javascript;
      console.log("📝 Seeding starter code locally and to server");
      lastRemoteCode.current = initial;
      setCode(initial);
      socket.emit("code-init", {
        roomCode: room.code,
        code: initial,
        language: room.language,
      });
    }
  }, [syncReady, room, socket, code]);

  // 5. User typed
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setModified(true);

    // Skip if this change matches what server last sent (echo)
    if (newCode === lastRemoteCode.current) return;

    if (!socket || !room || !socket.connected) return;

    socket.emit("code-change", {
      roomCode: room.code,
      code: newCode,
      language,
    });
  };

  // 6. User moved cursor
  const handleCursorChange = (position) => {
    if (!socket || !room) return;
    if (cursorThrottleRef.current) return; // throttle
    cursorThrottleRef.current = setTimeout(() => {
      cursorThrottleRef.current = null;
    }, 80);

    socket.emit("cursor-move", {
      roomCode: room.code,
      position,
    });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    toast.success("Room code copied!");
    setTimeout(() => setCopied(false), 1500);
  };

  const copyLink = () => {
    const link = `${window.location.origin}/#/room/${room.code}`;
    navigator.clipboard.writeText(link);
    toast.success("Room link copied!");
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="font-mono text-muted text-sm">
            <span className="text-amber">$</span> loading_room...
          </p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="font-mono text-red-500 text-sm mb-6">! room_not_found</p>
          <Link
            to="/dashboard"
            className="font-mono text-sm border border-line text-muted px-4 py-2 hover:border-amber hover:text-amber transition-all"
          >
            [ ← back_to_dashboard ]
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 pb-4 border-b border-line">
          <div className="flex-1">
            <div className="font-mono text-xs text-muted tracking-wider mb-1">
              <span className="text-amber">//</span> room
            </div>
            <h1 className="font-mono text-2xl font-bold text-cream mb-1">{room.name}</h1>
            <div className="font-mono text-xs text-muted flex flex-wrap gap-4">
              <span>
                <span className="text-amber">●</span> owner: {room.owner_name}
                {room.owner_id === user?.id && <span className="text-amber"> (you)</span>}
              </span>
              <span>
                <span className={isConnected ? "text-green-400" : "text-red-500"}>●</span>{" "}
                {isConnected ? "socket_live" : "socket_offline"}
              </span>
              {syncReady && <span className="text-green-400">● read-write access</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyCode}
              className="font-mono text-xs border border-line text-cream px-3 py-2 hover:border-amber transition-all"
            >
              code: <span className="text-amber tracking-widest">{room.code}</span>
              {copied ? " ✓" : ""}
            </button>
            <button
              onClick={copyLink}
              className="font-mono text-xs border border-line text-muted px-3 py-2 hover:border-amber hover:text-amber transition-all"
            >
              [ share_link ]
            </button>
            <Link
              to="/dashboard"
              className="font-mono text-xs border border-line text-muted px-4 py-2 hover:border-amber hover:text-amber transition-all"
            >
              [ ← leave_room ]
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between border border-line border-b-0 bg-bg-surface px-4 py-2">
              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="text-amber">{language}</span>
                <span className="text-green-400">● collaborative · read/write</span>
                {modified && <span className="text-amber">● modified</span>}
              </div>
              <div className="font-mono text-xs text-muted">
                {code.split("\n").length} lines · {code.length} chars
              </div>
            </div>

            <CodeEditor
              code={code}
              language={language}
              onChange={handleCodeChange}
              onCursorChange={handleCursorChange}
              remoteCursors={remoteCursors}
            />
          </div>

          <div className="lg:col-span-1 space-y-4">
            <UserList users={users} currentUserId={user?.id} />

            <ChatPanel
              socket={socket}
              roomCode={room.code}
              messages={messages}
              setMessages={setMessages}
              typingUsers={typingUsers}
            />

            <div className="border border-line bg-bg-surface p-4">
              <div className="font-mono text-xs text-muted mb-2">// room_details</div>
              <div className="font-mono text-xs text-cream space-y-1">
                <div>
                  <span className="text-muted">id:</span>{" "}
                  <span className="text-amber">{room.id.slice(0, 8)}...</span>
                </div>
                <div>
                  <span className="text-muted">lang:</span>{" "}
                  <span className="text-amber">{room.language}</span>
                </div>
                <div>
                  <span className="text-muted">your_role:</span>{" "}
                  <span className="text-amber">
                    {room.owner_id === user?.id ? "Owner" : "Collaborator"}
                  </span>
                </div>
                <div>
                  <span className="text-muted">permissions:</span>{" "}
                  <span className="text-green-400">Read / Write</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
