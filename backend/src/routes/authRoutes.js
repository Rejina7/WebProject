// backend/routes/authRoutes.js
import express from "express";
import { signup, login, getUserProfile, updateUserProfile } from "../controllers/authController.js";
import { validateSignup, validateLogin } from "../middleware/validationMiddleware.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", validateSignup, signup);

// POST /api/auth/login
router.post("/login", validateLogin, login);

// GET /api/auth/profile/:id
router.get("/profile/:id", getUserProfile);

// PUT /api/auth/profile/:id
router.put("/profile/:id", updateUserProfile);

export default router;
