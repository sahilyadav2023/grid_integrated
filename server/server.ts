import express, { Application } from "express";
import http from "http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";

import sequelize from "./db";
import sessionRoutes from "./routes/sessionRoutes";

const app: Application = express();
const server = http.createServer(app);

// Sync PostgreSQL database
sequelize.sync()
  .then(() => {
    console.log("🟢 PostgreSQL synced");
  })
  .catch((err: Error) => {
    console.error("❌ DB sync error:", err);
  });

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/session", sessionRoutes);


// Socket.IO setup
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
