const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Pass io object to req so routers can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());

const posRoutes = require("./routes/posRoutes");

app.use("/api", posRoutes);

const orderRoutes = require("./routes/order");

app.use("/api/order", orderRoutes);

const salesRoutes = require("./routes/sales");
app.use("/api/sales", salesRoutes);

const printJobsRoutes = require("./routes/printJobs");
app.use("/api/print-jobs", printJobsRoutes);

const comboRoutes = require("./routes/combo");
app.use("/api/combo", comboRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("POS Backend Running");
});

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("🔌 New Socket.IO Client Connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔌 Socket.IO Client Disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});