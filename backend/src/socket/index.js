const { Server } = require("socket.io");

const rooms = new Map();

const getRoom = (code) => {
  if (!rooms.has(code)) {
    rooms.set(code, {
      users: new Map(),
      code: null,
      language: null,
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

      console.log(
        `📤 Snapshot → ${user.name} @ ${roomCode}: code=${
          room.code === null ? "null" : JSON.stringify(room.code.substring(0, 30))
        }`
      );

      socket.emit("code-snapshot", {
        code: room.code,
        language: room.language,
      });

      broadcastUsers(roomCode);
      console.log(`👤 ${user.name} joined ${roomCode} (total=${room.users.size})`);
    });

    socket.on("code-init", ({ roomCode, code, language }) => {
      const room = getRoom(roomCode);
      if (room.code === null) {
        room.code = code;
        room.language = language;
        console.log(`📝 Initialized code @ ${roomCode} by ${socket.data.user?.name}`);
      }
    });

    socket.on("code-change", ({ roomCode, code, language }) => {
      if (!roomCode) return;
      const room = getRoom(roomCode);
      room.code = code;
      if (language) room.language = language;

      console.log(`📝 Code-change @ ${roomCode} from ${socket.data.user?.name}, len=${code.length}`);

      // Broadcast to OTHERS in room
      socket.to(roomCode).emit("code-update", { code, language });
    });

    const handleLeave = () => {
      const roomCode = socket.data.roomCode;
      if (!roomCode) return;
      const room = rooms.get(roomCode);
      if (!room) return;

      room.users.delete(socket.id);
      // KEEP room.code in memory even if empty — reconnects should see it
      if (room.users.size === 0) {
        console.log(`🕐 Room ${roomCode} empty (code preserved)`);
      } else {
        broadcastUsers(roomCode);
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
