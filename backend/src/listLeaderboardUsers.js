import { sequelize } from "./db.js";

const listLeaderboardUsers = async () => {
  try {
    await sequelize.authenticate();
    const [users] = await sequelize.query(`
      SELECT 
        u.id, 
        u.username, 
        u.email,
        SUM(qr.score) as "totalPoints"
      FROM users u
      LEFT JOIN quiz_results qr ON u.id = qr."userId"
      WHERE u.role != 'admin'
      GROUP BY u.id, u.username, u.email
      HAVING COUNT(qr.id) > 0
      ORDER BY "totalPoints" DESC, u.username ASC
      LIMIT 10
    `);
    if (users.length > 0) {
      console.log('Leaderboard Users:');
      users.forEach(u => console.log(`Username: ${u.username}, Email: ${u.email}, Points: ${u.totalPoints}`));
    } else {
      console.log('No users with quiz results found.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

listLeaderboardUsers();
