const { createUser, loginUser } = require('./services');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await createUser(name, email, password);
  if (user.error) {
    return res.status(user.status).json(user);
  }

  res.cookie('jwt', user.accessToken, {
    httpOnly: true,
    maxAge: user.tokenAge * 1000,
  });

  return res.status(200).json({
    error: false,
    message: 'user created succesfully',
    status: 200,
    data: user.user,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUser(email, password);
  if (user.error) {
    return res.status(user.status).json(user);
  }

  res.cookie('jwt', user.accessToken, {
    httpOnly: true,
    maxAge: user.tokenAge * 1000,
  });
  return res.status(200).json({
    error: false,
    message: 'user logged in succesfully',
    status: 200,
    data: user.user,
  });
};

module.exports = { register, login };
