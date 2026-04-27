const express = require("express");

const app = express();
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/database");

connectDB();

app.listen(3000, () => {
  console.log("Server is listening on port 3000...");
});
