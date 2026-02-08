import { sequelize } from "./db.js";

const listDemoUsers = async () => {
  try {
    await sequelize.authenticate();
    const [users] = await sequelize.query("SELECT id, username, email FROM users WHERE username NOT IN ('admin') ORDER BY id");
    if (users.length > 0) {
      console.log('Demo/Test Users:');
      users.forEach(u => console.log(`ID: ${u.id}, Username: ${u.username}, Email: ${u.email}`));
    } else {
      console.log('No demo/test users found.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

listDemoUsers();
