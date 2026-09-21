const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
require("express-async-errors");

const { connectDB } = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const roomRoutes = require("./src/routes/roomRoutes");
const executeRoutes = require("./src/routes/executeRoutes");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");
const initSocket = require("./src/socket");

const app = express();
const httpServer = http.createServer(app);
const io = initSocket(httpServer);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "CodeCollab API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/execute", executeRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
