const { Server } = require("socket.io");

const rooms = new Map();
// rooms.get(code) = {
//   users: Map<socketId, { id, userId, name, joinedAt }>,
//   code: string,
//   language: string,
//   messages: [{ id, userId, name, text, timestamp }],
// }

const getRoom = (code) => {
  if (!rooms.has(code)) {
    rooms.set(code, {
      users: new Map(),
      code: null,
      language: null,
      messages: [],
    });
  }
  return rooms.get(code);
};

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://code-collab-eta-henna.vercel.app",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const broadcastUsers = (code) => {
    const room = rooms.get(code);
    if (!room) return;
    io.to(code).emit("room-users", Array.from(room.users.values()));
  };

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on("join-room", ({ roomCode, user }) => {
      if (!roomCode || !user) return;

      socket.join(roomCode);
      socket.data.roomCode = roomCode;
      socket.data.user = user;

      const room = getRoom(roomCode);
      room.users.set(socket.id, {
        id: socket.id,
        userId: user.id,
        name: user.name,
        joinedAt: new Date().toISOString(),
      });

      // Send snapshot: code + language + chat history
      socket.emit("code-snapshot", {
        code: room.code,
        language: room.language,
      });

      socket.emit("chat-history", room.messages);

      broadcastUsers(roomCode);
      console.log(`👤 ${user.name} joined ${roomCode}`);
    });

    socket.on("code-init", ({ roomCode, code, language }) => {
      const room = getRoom(roomCode);
      if (room.code === null) {
        room.code = code;
        room.language = language;
        console.log(`📝 Code initialized @ ${roomCode}`);
      }
    });

    socket.on("code-change", ({ roomCode, code, language }) => {
      if (!roomCode) return;
      const room = getRoom(roomCode);
      room.code = code;
      if (language) room.language = language;
      socket.to(roomCode).emit("code-update", { code, language });
    });

    // Chat message
    socket.on("chat-message", ({ roomCode, text }) => {
      if (!roomCode || !text || !text.trim()) return;
      const room = getRoom(roomCode);
      const user = socket.data.user;
      if (!user) return;

      const message = {
        id: `${socket.id}-${Date.now()}`,
        userId: user.id,
        name: user.name,
        text: text.trim().slice(0, 500),
        timestamp: new Date().toISOString(),
      };

      room.messages.push(message);
      // Keep last 100 messages
      if (room.messages.length > 100) {
        room.messages = room.messages.slice(-100);
      }

      io.to(roomCode).emit("chat-message", message);
      console.log(`💬 ${user.name} @ ${roomCode}: ${message.text.substring(0, 30)}`);
    });

    // Typing indicator
    socket.on("typing-start", ({ roomCode }) => {
      const user = socket.data.user;
      if (!roomCode || !user) return;
      socket.to(roomCode).emit("user-typing", {
        userId: user.id,
        name: user.name,
      });
    });

    socket.on("typing-stop", ({ roomCode }) => {
      const user = socket.data.user;
      if (!roomCode || !user) return;
      socket.to(roomCode).emit("user-stop-typing", {
        userId: user.id,
      });
    });

    // Cursor position
    socket.on("cursor-move", ({ roomCode, position }) => {
      const user = socket.data.user;
      if (!roomCode || !user || !position) return;
      socket.to(roomCode).emit("cursor-update", {
        userId: user.id,
        name: user.name,
        position,
      });
    });

    const handleLeave = () => {
      const roomCode = socket.data.roomCode;
      if (!roomCode) return;
      const room = rooms.get(roomCode);
      if (!room) return;

      room.users.delete(socket.id);
      if (room.users.size === 0) {
        console.log(`🕐 Room ${roomCode} empty (code preserved)`);
      } else {
        broadcastUsers(roomCode);
        // Also notify others that this user stopped typing
        const user = socket.data.user;
        if (user) {
          socket.to(roomCode).emit("user-stop-typing", { userId: user.id });
        }
      }
    };

    socket.on("leave-room", handleLeave);
    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
      handleLeave();
    });
  });

  return io;
};

module.exports = initSocket;
