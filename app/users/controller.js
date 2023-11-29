const { createUser, loginUser } = require('./services');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validate and clean params

    const user = await createUser(name, email, password);

    if (user.error) {
      return res.status(user.status).json(user);
    }

    res.cookie('jwt', user.accessToken, {
      httpOnly: true,
      maxAge: user.tokenAge * 1000, // convert 2h to ms; maxAge uses miliseconds
    });

    return res.status(200).json({
      error: false,
      message: 'User created Succesfully',
      status: 200,
      data: user.user,
    });
  } catch (err) {
    return res.status(501).json({
      error: true,
      message: 'Internal Server Error',
      status: 500,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate and clean params

    const user = await loginUser(email, password);

    if (user.error) {
      return res.status(user.status).json(user);
    }

    res.cookie('jwt', user.accessToken, {
      httpOnly: true,
      maxAge: user.tokenAge * 1000, // convert 2h to ms; maxAge uses miliseconds
    });

    return res.status(200).json({
      error: false,
      message: 'User logged in Succesfully',
      status: 200,
      data: user.user,
    });
  } catch (err) {
    return res.status(501).json({
      error: true,
      message: 'Internal Server Error',
      status: 500,
    });
  }
};

module.exports = { register, login };
