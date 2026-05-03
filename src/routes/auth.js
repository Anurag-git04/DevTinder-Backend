const express = require('express');
const { validateSignUpData } = require('../utils/validation');

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
        })

        res.json({message: "User Added Successfully!", data: savedUser});
    }catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;
        
        const user = await User.findOne({emailId});
        
        if(!user){
            throw new Error("Invalid Credtials") 
        }

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            const token = await user.getJWT();

            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            })

            res.send(user);
        }else{
            throw new Error("Invalid Credtials")
        }
    }catch(error){
        res.status(400).send("Error: " + error.message);
    }
});

authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logged out successfully");
});

module.exports = authRouter;