const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
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
}

module.exports = { authenticate };
