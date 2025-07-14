import express, { Application } from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import sessionRoutes from "./routes/sessionRoutes";
import sequelize from "./db"; // PostgreSQL Sequelize instance

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/session", sessionRoutes);
import upcomingSessionRoutes from "./routes/upcomingSession";
app.use("/api/upcoming-session", upcomingSessionRoutes);


// PostgreSQL DB sync
sequelize.sync()
  .then(() => {
    console.log("🟢 PostgreSQL synced");
  })
  .catch((err: Error) => {
    console.error("❌ PostgreSQL connection error:", err);
  });

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data); // broadcast to all
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
