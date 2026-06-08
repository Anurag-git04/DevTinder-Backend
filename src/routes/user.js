const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const ConnectionsRequest = require("../models/connectionsRequest");
const { userAuth } = require("../middlewares/auth");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/users/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user;

    const connectionsRequests = await ConnectionsRequest.find({
      toUserId: loggedInUserId._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionsRequests,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/users/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user;

    const connectionsRequests = await ConnectionsRequest.find({
      $or: [
        { toUserId: loggedInUserId._id, status: "accepted" },
        { fromUserId: loggedInUserId._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    console.log(connectionsRequests);

    const data = connectionsRequests.map((row) => {
      if (row.fromUserId._id.toString() == loggedInUserId._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    return res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionsRequests = await ConnectionsRequest.find({
      $or: [
        { fromUserId: loggedInUserId._id },
        { toUserId: loggedInUserId._id },
      ],
    }).select("fromUserId toUserId status");

    // build a local exclusion set from connections (other party + self)
    const hideUsersFromFeed = new Set();
    connectionsRequests.forEach((r) => {
      if (r.fromUserId) hideUsersFromFeed.add(r.fromUserId.toString());
      if (r.toUserId) hideUsersFromFeed.add(r.toUserId.toString());
    });
    hideUsersFromFeed.add(loggedInUserId._id.toString());

    const users = await User.find({ _id: { $nin: Array.from(hideUsersFromFeed) } })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    // console.log(users);

    res.json({
      data: users,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = userRouter;
