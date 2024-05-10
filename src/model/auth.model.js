import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  tokens: [{
    type: String,
  }]
});

user.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
}

user.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({_id : user._id} , 'myjwt')

  user.tokens = user.tokens.concat(token)
  await user.save()
  return token
}

const User = mongoose.model("User", user);
export default User;