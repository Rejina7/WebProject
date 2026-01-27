import { sequelize } from "../db.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await sequelize.query(
      `INSERT INTO users (username, email, password)
       VALUES (:username, :email, :password)
       RETURNING id, username, email`,
      {
        replacements: {
          username,
          email,
          password: hashedPassword,
        },
      }
    );

    res.status(201).json({
      message: "Signup successful",
      user: result[0],
    });
  } catch (err) {
    console.error(err);

    if (err.original?.code === "23505") {
      return res.status(409).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Database error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [result] = await sequelize.query(
      "SELECT * FROM users WHERE email = :email",
      { replacements: { email } }
    );

    if (result.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
