import { signup, login, getUserProfile, updateUserProfile, getAllUsers } from "../controllers/authController.js";

import express from "express";
const router = express.Router();

// POST /signup
router.post("/signup", signup);

// POST /login
router.post("/login", login);

// GET /users
router.get("/users", getAllUsers);

// GET /profile/:id
router.get("/profile/:id", getUserProfile);

// PUT /profile/:id
router.put("/profile/:id", updateUserProfile);

export default router;