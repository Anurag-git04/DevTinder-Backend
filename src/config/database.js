const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;


const connectDB = async () => {
  await mongoose.connect(MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
  }).catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
};

module.exports = connectDB;
