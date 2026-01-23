import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Middleware
const ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// In-memory data
const db = {
  users: [{ id: 1, email: "test@example.com", password: "password" }],
  products: [
    { id: 1, name: "Sample Product", price: 10.99 },
    { id: 2, name: "Another Product", price: 5.49 }
  ],
  feedback: []
};

// Auth routes
app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  // Return simple token (demo only)
  res.json({ token: "demo-token", user: { id: user.id, email: user.email } });
});

app.post("/api/signup", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });
  const exists = db.users.some(u => u.email === email);
  if (exists) return res.status(409).json({ message: "User exists" });
  const id = db.users.length + 1;
  db.users.push({ id, email, password });
  res.status(201).json({ id, email });
});

// Products routes
app.get("/api/products", (req, res) => {
  res.json(db.products);
});

app.post("/api/products", (req, res) => {
  const { name, price } = req.body || {};
  if (!name || typeof price !== "number") {
    return res.status(400).json({ message: "Invalid product" });
  }
  const id = db.products.length + 1;
  const product = { id, name, price };
  db.products.push(product);
  res.status(201).json(product);
});

// Feedback routes
app.get("/api/feedback", (req, res) => {
  res.json(db.feedback);
});

app.post("/api/feedback", (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ message: "Message required" });
  const item = { id: db.feedback.length + 1, message, createdAt: new Date().toISOString() };
  db.feedback.push(item);
  res.status(201).json(item);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
