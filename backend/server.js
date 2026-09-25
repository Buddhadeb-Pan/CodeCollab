const express = require("express");
const http = require("http");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
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

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));

app.use(cors());
app.use(express.json());

// Request logger for development
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      const statusColor =
        res.statusCode >= 500 ? "\x1b[31m" :
        res.statusCode >= 400 ? "\x1b[33m" :
        res.statusCode >= 300 ? "\x1b[36m" :
        "\x1b[32m";
      console.log(
        `${statusColor}${res.statusCode}\x1b[0m ${req.method} ${req.originalUrl} - ${duration}ms`
      );
    });
    next();
  });
}

// General API limiter: 200 requests per 15 min per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth limiter: 20 requests per 15 min per IP (stricter for login/register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many auth attempts. Please wait 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Execute limiter: 50 code executions per 15 min per IP
const executeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: "Too many code executions. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "CodeCollab API running" });
});

// Apply rate limiters
app.use("/api", generalLimiter);
app.use("/api/auth", authLimiter);
app.use("/api/execute", executeLimiter);

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
