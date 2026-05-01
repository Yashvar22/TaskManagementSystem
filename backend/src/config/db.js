const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.DATABASE_URL || process.env.MONGO_URI;
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
