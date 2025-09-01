import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js"

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// Start server
connectDB();
const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
app.listen(PORT, () => console.log(`🚀 Server running on ${process.env.BASE_URL}`));
