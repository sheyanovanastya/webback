import { USERS } from './db.js';

export const authorizationMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token was not found" });
  }

  const user = USERS.find(el => el.token === token);
  if (!user) {
    return res.status(400).json({ message: "User with this token was not found" });
  }

  req.user = user;
  next();
};
