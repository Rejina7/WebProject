import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import { sequelize } from "./db.js";

import "./models/User.js";
import "./models/Quiz.js";
import "./models/QuizResult.js";
import "./models/Product.js";
import "./models/Feedback.js";

const app = express();

app.use(cors({ 
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/products", productRoutes);
app.use("/api/feedback", feedbackRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(async () => {
    console.log("Database connected ✅");
    await sequelize.sync({ alter: true });
    console.log("Database models synced ✅");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Database connection failed ❌", err);
  });
