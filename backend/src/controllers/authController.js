import { sequelize } from "../db.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  console.log("\n📝 SIGNUP REQUEST:");
  console.log("Username:", username);
  console.log("Email:", email);
  console.log("Password:", password);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await sequelize.query(
      `INSERT INTO users (username, email, password, role)
       VALUES (:username, :email, :password, :role)
       RETURNING id, username, email, role, "createdAt"`,
      {
        replacements: {
          username,
          email,
          password: hashedPassword,
          role: req.body.role || 'user',
        },
      }
    );

    console.log("✅ Signup successful for:", result[0]);

    // Display all registered users
    const [allUsers] = await sequelize.query(
      "SELECT id, username, email, \"createdAt\" FROM users ORDER BY \"createdAt\" DESC"
    );
    console.log("\n📋 ALL REGISTERED USERS:");
    console.table(allUsers);

    res.status(201).json({
      message: "Signup successful",
      user: result[0],
    });
  } catch (err) {
    console.error(err);

    if (err.original?.code === "23505") {
      const constraint = err.original.constraint;
      if (constraint === "users_email_key") {
        return res.status(409).json({ message: "Email already exists" });
      }
      if (constraint === "users_username_key") {
        return res.status(409).json({ message: "Username already taken" });
      }
    }

    res.status(500).json({
      message: "Database error",
      detail: err.original?.message || err.message,
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  console.log("\n🔐 LOGIN REQUEST:");
  console.log("Username:", username);
  console.log("Password:", password);

  try {
    const [result] = await sequelize.query(
      "SELECT * FROM users WHERE username = :username",
      { replacements: { username } }
    );

    if (result.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("✅ Login successful for:", user.username);
    console.log("👤 User role:", user.role);

    // Display all registered users
    const [allUsers] = await sequelize.query(
      "SELECT id, username, email, role, \"createdAt\" FROM users ORDER BY \"createdAt\" DESC"
    );
    console.log("\n📋 ALL REGISTERED USERS:");
    console.table(allUsers);

    // Determine redirect path based on role
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/home';

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      redirectPath: redirectPath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await sequelize.query(
      "SELECT id, username, email, role, \"createdAt\" FROM users WHERE id = :id",
      { replacements: { id } }
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User profile retrieved",
      user: result[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  try {
    // Check if user exists
    const [userExists] = await sequelize.query(
      "SELECT id FROM users WHERE id = :id",
      { replacements: { id } }
    );

    if (userExists.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user
    const [result] = await sequelize.query(
      `UPDATE users 
       SET username = :username, email = :email, "updatedAt" = NOW()
       WHERE id = :id
       RETURNING id, username, email, role, "createdAt", "updatedAt"`,
      {
        replacements: { id, username, email },
      }
    );

    res.json({
      message: "Profile updated successfully",
      user: result[0],
    });
  } catch (err) {
    console.error(err);

    if (err.original?.code === "23505") {
      const constraint = err.original.constraint;
      if (constraint === "users_email_key") {
        return res.status(409).json({ message: "Email already in use" });
      }
      if (constraint === "users_username_key") {
        return res.status(409).json({ message: "Username already taken" });
      }
    }

    res.status(500).json({ message: "Server error" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await sequelize.query(
      "SELECT id, username, email, role, \"createdAt\" FROM users ORDER BY \"createdAt\" DESC"
    );

    res.json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};