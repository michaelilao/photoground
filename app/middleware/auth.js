const jwt = require('jsonwebtoken');

const authenticateWeb = (req) => {
  const token = req.cookies.jwt || req.headers?.authorization?.split(' ')[1];
  if (!token) {
    return false;
  }

  // authenticate user
  const tokenKey = process.env.TOKEN_KEY;

  try {
    const decoded = jwt.verify(token, tokenKey);
    return decoded;
  } catch (err) {
    return false;
  }
};

const authenticate = (req, res, next) => {
  const token = req.cookies.jwt || req.headers?.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: true, message: 'A token is required to authenticate', status: 403 });
  }

  // authenticate user
  const tokenKey = process.env.TOKEN_KEY;

  try {
    const decoded = jwt.verify(token, tokenKey);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: true, message: 'Invalid Token', status: 401 });
  }
};

module.exports = { authenticate, authenticateWeb };
