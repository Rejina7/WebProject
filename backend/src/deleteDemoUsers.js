import { sequelize } from "./db.js";

const deleteDemoUsers = async () => {
  try {
    await sequelize.authenticate();
    const [rows] = await sequelize.query(
      "DELETE FROM users WHERE username NOT IN ('admin') RETURNING id, username;"
    );
    console.log('Deleted users:', rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

deleteDemoUsers();
