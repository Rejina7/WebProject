// backend/routes/authRoutes.js
import express from "express";
import { signup } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", signup);



export default router;
