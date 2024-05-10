import express from 'express';
import AuthController from '../controller/auth.controller.js';
import isAuth from '../middleware/auth.middleware.js';

const router = express.Router();

const authController = new AuthController();

router.get('/signup', (req, res, next) => {
  authController.getSignup(req, res, next);
});
router.get('/signin', (req, res, next) => {
  authController.getSignin(req, res, next);
});
router.get('/reset-password', isAuth, (req, res, next) => {
  authController.getResetPassword(req, res, next);
})
router.get('/change-password', isAuth, (req, res, next) => {
  authController.getChangePassword(req, res, next);
})

router.post('/signup', (req, res, next) => {
  authController.signup(req, res, next);
});
router.post('/signin', (req, res, next) => {
  authController.signin(req, res, next);
});
router.get('/signout', isAuth, (req, res, next) => {
  authController.signout(req, res, next);
});
router.post('/change-password', isAuth, (req, res, next) => {
  authController.changePassword(req, res, next);
})

export default router;