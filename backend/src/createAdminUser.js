import bcrypt from "bcrypt";
import { sequelize } from "./db.js";
import "./models/User.js";

const createAdminUser = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Create tables if they don't exist
    await sequelize.sync({ alter: true });
    console.log("✅ Database models synced");

    // Delete existing admin user (to reset password)
    const [deleteResult] = await sequelize.query(
      "DELETE FROM users WHERE username = 'admin' RETURNING id"
    );
    if (deleteResult.length > 0) {
      console.log("🗑️  Removed old admin user");
    }

    // Hash the admin password
    const adminPassword = "Admin@123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    console.log("🔐 Password hashed successfully");

    // Create admin user
    const [result] = await sequelize.query(
      `INSERT INTO users (username, email, password, role, "createdAt")
       VALUES (:username, :email, :password, :role, NOW())
       RETURNING id, username, email, password, role, "createdAt"`,
      {
        replacements: {
          username: "admin",
          email: "admin@example.com",
          password: hashedPassword,
          role: "admin",
        },
      }
    );

    console.log("✅ Admin user created successfully!");
    console.log("\n📋 Admin Details:");
    console.table(result[0]);
    console.log("\n📋 Login credentials:");
    console.log("Username: admin");
    console.log("Password: Admin@123");

    // Verify the password hash matches
    const match = await bcrypt.compare(adminPassword, result[0].password);
    console.log("\n🔐 Password verification:", match ? "✅ PASS" : "❌ FAIL");

    // Display all users
    const [allUsers] = await sequelize.query(
      "SELECT id, username, email, role, \"createdAt\" FROM users ORDER BY id DESC"
    );
    console.log("\n📋 ALL USERS IN DATABASE:");
    console.table(allUsers);

    await sequelize.close();
    console.log("\n✅ Script completed!");
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.error(err);
    process.exit(1);
  }
};

createAdminUser();

