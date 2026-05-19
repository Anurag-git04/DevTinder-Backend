const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");
const ConnectionsRequest = require("../models/connectionsRequest");

const { userAuth } = require("../middlewares/auth");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatuses = ["ignored", "interested"];
      if (!allowedStatuses.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status value" + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const connectionRequest = new ConnectionsRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstname + "is" + status + " with " + toUser.firstname,
        data,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  },
);