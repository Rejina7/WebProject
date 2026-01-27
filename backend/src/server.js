import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { sequelize } from "./db.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/auth", authRoutes);

const PORT = 5000;

sequelize.authenticate()
  .then(() => {
    console.log("Database connected ✅");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Database connection failed ❌", err);
  });
