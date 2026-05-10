const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middleware/authMiddleware");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    const user = res.user;
    res.send(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      return res.status(400).json({ message: "Invalid Edit data" });
    }

    const loggedInUser = res.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstname} Profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user profile", error: error.message });
  }
});

module.exports = profileRouter;
