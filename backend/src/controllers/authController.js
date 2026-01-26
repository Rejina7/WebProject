// backend/controllers/authController.js
import { auth } from "../config/firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Signup controller
export const signup = async (req, res) => {
  const { email, password, username } = req.body;

  // basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username,
    });

    return res.status(201).json({
      message: "Signup successful",
      uid: userRecord.uid,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

