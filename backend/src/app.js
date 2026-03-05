// src/app.js
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/products", productRoutes);
app.use("/api/feedback", feedbackRoutes);

export default app;