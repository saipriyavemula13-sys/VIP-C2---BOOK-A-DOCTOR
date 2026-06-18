require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await mongoose.connection.db.collection('users').find({ email: 'sathvika@gmail.com' }).toArray();
    let output = "Found " + users.length + " users.\\n";
    for (const u of users) {
      output += `Email: '${u.email}'\\n`;
      output += `Password Hash: '${u.password}'\\n`;
      const match = await bcrypt.compare('password123', u.password);
      output += `Matches 'password123': ${match}\\n\\n`;
    }
    fs.writeFileSync('check-login-result.txt', output);
  } catch (err) {
    fs.writeFileSync('check-login-result.txt', 'Error: ' + err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
