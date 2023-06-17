const mongoose = require("mongoose");
const Env = require("./env");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(Env.mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
