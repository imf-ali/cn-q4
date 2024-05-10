import ApplicationError from "../middleware/applicationError.js";
import User from "../model/auth.model.js";

class AuthRepository{
  async signup(name, email, password){
    try {
      const user = new User({ name, email, password });
      const savedUser = await user.save();
      return savedUser;
    } catch (err) {
      throw new ApplicationError(err.message, 400);
    }
  }

  async signin(email){
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (err) {
      throw new ApplicationError('Error signing in', 400);
    }
  }

  async signout(id, token){
    try {
      const user = await User.findByIdAndUpdate(id, {
        $pull: {
          tokens: token
        }
      }, { new: true });
      return user;
    } catch (err) {
      throw new ApplicationError('Error signing out', 400);
    }
  }

  async changePassword(id, password){
    try {
      const user = await User.findByIdAndUpdate(id, {
        password
      }, { new: true });
      return user;
    } catch (err) {
      throw new ApplicationError('Error changing password', 400);
    }
  }

  async findById(id) {
    try {
      const user = await User.findById(id);
      return user;
    } catch (err) {
      throw new ApplicationError(err.message, 400);
    }
  }
}

export default AuthRepository;