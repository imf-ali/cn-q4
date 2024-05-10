import ApplicationError from "./applicationError.js";
import jwt from 'jsonwebtoken';

const isAuth = (req, res, next) => {
  try {
    const token = req.session.token;
    if (!token) {
      return res.redirect('signin');
    }
    const jwtToken = token.replace('JWT ', '');
    jwt.verify(jwtToken, 'myjwt', (err, decoded) => {
      if (err) {
        console.log(err);
        throw new ApplicationError('Access denied.', 403);
      } else {
        req.userId = decoded._id;
        req.token = jwtToken;
        next();
      }
    });
  } catch (err) {
    next(err);
  }
};

export default isAuth;