const db = require('../database');

const register = (req, res) => {
  console.log(req.body);
  try {
    // Validate and clean params
    res.json({ message: 'REGISTERING' });
  } catch (err) {
    res.json({ message: 'ERROR' });
  }
};

module.exports = { register };
