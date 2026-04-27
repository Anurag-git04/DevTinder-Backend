const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please login ...");
    }
    const decodedObj = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).send("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ message: "Unauthorized" });
  }
};

module.exports = {
  userAuth,
};
