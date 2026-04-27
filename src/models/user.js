const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 50,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    lowercase: true,
    required: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid email address"+ value);
      }  
    }
  },
  password: {
    type: String,
    required: true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
      }
    },
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    enum: {
      values: ["male","female","other"],
      message: `{value} is not valid gender type`
    }
  },
},{
  timestamps: true,
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
