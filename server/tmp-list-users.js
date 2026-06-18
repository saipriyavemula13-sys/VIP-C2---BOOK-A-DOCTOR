require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

(async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const users = await mongoose.connection.db.collection('users').find({}).sort({ createdAt: -1 }).limit(10).toArray();
    console.log('Users count:', users.length);
    users.forEach(u => {
      console.log(JSON.stringify({ _id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role, createdAt: u.createdAt }, null, 2));
    });
    await mongoose.disconnect();
  } catch (err) {
    console.error('ERROR', err.message);
    process.exit(1);
  }
})();
