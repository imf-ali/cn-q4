import bcrypt from 'bcryptjs';
import AuthRepository from "../repository/auth.repository.js";
import googleLogin from '../services/google.service.js';
import nodemailerHelper from '../services/nodemailer.service.js';
import jwt from 'jsonwebtoken';

class AuthController {

  constructor() {
    this.authRepository = new AuthRepository();
  }

  getSignup(req, res, next) {
    try {
      console.log(req.session.token);
      if (req.session.token) {
        return res.render('home', { loggedIn: true });
      }
      return res.render('signup', { error: null });
    } catch (err) {
      next(err);
    }
  }

  getSignin(req, res, next) {
    try {
      if (req.session.token) {
        return res.render('home', { loggedIn: true });
      }
      return res.render('signin', { error: null, message: null });
    } catch (err) {
      next(err);
    }
  }

  async getResetPassword(req, res, next) {
    try {
      const userId = req.userId;
      const user = await this.authRepository.findById(userId);
      const getResetToken = jwt.sign({ id: userId }, 'myjwt', { expiresIn: '5m' })
      nodemailerHelper(user.email, `
        <h2>Link to reset password</h2>
        <a href="http://localhost:3000/auth/change-password?q=${getResetToken}">
          Click here to reset password
        </a>
      `);
      return res.render('reset-password', { message: 'Link sent on email to reset password.' });
    } catch (err) {
      next(err);
    }
  }

  async getChangePassword(req, res, next) {
    try {
      const { q: token } = req.query;
      const decoded = jwt.verify(token, 'myjwt');
      return res.render('change-password', { expiry: false, error: null })
    } catch (err) {
      if (err.message.includes('expired')) {
        return res.render('change-password', { expiry: true, error: 'The link has expired' })
      }
      next(err);
    }
  }

  async signup(req, res, next) {
    try {
      let { name, email, password, credential } = req.body;
      if (credential) {
        const payload = await googleLogin(credential);
        name = payload.name;
        email = payload.email;
      }
      else {
        if (password.length < 5) {
          return res.render('signup', { error: 'Password should be atleast 5 characters long' });
        }
        password = await bcrypt.hash(password, 8);
      }
      const user = await this.authRepository.signup(name, email, password);
      const token = await user.generateAuthToken();
      req.session.token = token;
      nodemailerHelper(email, 'Welcome to the Auth app');
      return res.render('home', { loggedIn: true });
    } catch (err) {
      if (err.message.includes('email_1 dup key')) {
        return res.render('signup', { error: 'Email already present' });
      }
      next(err);
    }
  }

  async signin(req, res, next) {
    try {
      let { email, password, credential } = req.body;
      if (credential) {
        const payload = await googleLogin(credential);
        email = payload.email;
      }
      const user = await this.authRepository.signin(email);
      if (!user) {
        return res.render('signin', { error: 'User not found. Enter the correct details', message: null });
      }
      if (password && !(await bcrypt.compare(password, user.password))) {
        return res.render('signin', { error: 'Password entered is not correct', message: null });
      }
      const token = await user.generateAuthToken();
      req.session.token = token;
      return res.render('home', { loggedIn: true });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async signout(req, res, next) {
    try {
      const userId = req.userId;
      const token = req.token;
      await this.authRepository.signout(userId, token);
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          return res.render('home', { loggedIn: false });
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req, res, next) {
    try {
      let { password, repassword } = req.body;
      const token = req.token;
      const userId = req.userId;
      if (password.length < 5) {
        return res.render('change-password', { expiry: false, error: 'Password should be atleast 5 characters long' });
      }
      if (password !== repassword) {
        return res.render('change-password', { expiry: false, error: 'Passwords do not match' });
      }
      password = await bcrypt.hash(password, 8);
      await this.authRepository.changePassword(userId, password);
      await this.authRepository.signout(userId, token);
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          return res.render('home', { loggedIn: false });
        }
      });
      return res.render('signin', { error: null, message: 'Password reset successfully. Login to continue.' })
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;