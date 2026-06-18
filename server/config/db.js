const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/book-a-doctor';
    if (!uri || uri.includes('<username>') || uri.includes('<password>') || uri.includes('your_mongodb_atlas_connection_string')) {
      throw new Error('MONGO_URI is not configured correctly. Update server/.env with a valid MongoDB connection string.');
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
