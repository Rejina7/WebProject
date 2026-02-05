import bcrypt from 'bcrypt';

const password = 'admin123';
const hash = await bcrypt.hash(password, 10);

console.log('\n=== BCRYPT HASH FOR admin123 ===');
console.log(hash);
console.log('\n=== SQL UPDATE COMMAND ===');
console.log(`UPDATE users SET password = '${hash}' WHERE username = 'Admin';`);
console.log('\n');
