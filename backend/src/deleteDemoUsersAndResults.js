import { sequelize } from "./db.js";

const deleteDemoUsersAndResults = async () => {
  try {
    await sequelize.authenticate();
    // Get all user IDs except admin
    const [users] = await sequelize.query("SELECT id FROM users WHERE username NOT IN ('admin')");
    const userIds = users.map(u => u.id);
    if (userIds.length > 0) {
      // Delete quiz results for these users
      await sequelize.query(`DELETE FROM quiz_results WHERE "userId" IN (${userIds.join(",")})`);
      // Delete the users
      const [rows] = await sequelize.query("DELETE FROM users WHERE username NOT IN ('admin') RETURNING id, username;");
      console.log('Deleted users:', rows);
    } else {
      console.log('No demo/test users found.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

deleteDemoUsersAndResults();
