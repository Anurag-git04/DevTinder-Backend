const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const http = require("http");

require("dotenv").config();
app.use(express.json());
app.use(cookieParser());

const dotenv = require("dotenv");
dotenv.config();

require("dotenv").config();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");

app.use("/", authRouter);

const server = http.createServer(app);

connectDB()
  .then(()=>{
    console.log("Connected to database successfully...");
      server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
      });
  })
  .catch((err)=>{
    console.error("Failed to connect to database:", err);
  });
