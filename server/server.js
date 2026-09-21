import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DevOps AI Chat backend is running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();