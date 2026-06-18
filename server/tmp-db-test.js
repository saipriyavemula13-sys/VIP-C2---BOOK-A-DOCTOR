require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
console.log('URI:', uri);

(async () => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('connected');
    await conn.disconnect();
  } catch (err) {
    console.error('CONNECT ERROR', err);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  }
})();
