const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const ConnectionsRequest = require("../models/connectionsRequest");
const { userAuth } = require("../middlewares/auth");

const USER_SAFE_DATA = "firstname lastname photoURL age gender about skills";
const hideUserFromFeed = new Set();

userRouter.get("/users/requests/received", userAuth, async (req, res) => {
    try{
        const loggedInUserId = req.user;

        const connectionsRequests = await ConnectionsRequest.find({ 
            toUserId: loggedInUserId._id, 
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({
            message: "Data fetched successfully",
            data: connectionsRequests,
        });

    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
});

userRouter.get("/users/connections", userAuth, async (req, res) => {
    try{
        const loggedInUserId = req.user;

        const connectionsRequests = await ConnectionsRequest.find({
            $or: [
                {toUserId: loggedInUserId._id, status:"accepted"},
                {fromUserId: loggedInUserId._id, status:"accepted"}
            ]
        })
            .populate("fromUserId",USER_SAFE_DATA)
            .populate("toUserId",USER_SAFE_DATA)
        
        console.log(connectionsRequests);
        
        const data = connectionsRequests.map((row)=>{
            if(row.fromUserId._id.toString() == loggedInUserId._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        });

        return res.json({data})

    }catch(err){
        res.status(400).send({message:err.message});
    }
});

userRouter.get("/feed", userAuth, async (req,res) => {
    try{
        const loggedInUserId = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit; 
        const skip = (page - 1) * limit;

        const connectionsRequests = await ConnectionsRequest.find({
            $or: [{fromUserId: loggedInUserId._id}, {toUserId: loggedInUserId._id}]
        }).select("fromUserId toUserId status")
            
        const users = await User.find({
            $and:[
                {_id: {$nin: Array.from(hideUserFromFeed)}},
                {_id: {$ne: loggedInUserId._id}},
            ]
        })
          .select(USER_SAFE_DATA)
          .skip(skip)
          .limit(limit);

        res.json({
            data: users,
        })
    }catch(err){
        res.status(400).send({message:err.message});
    }
})

module.exports = userRouter;