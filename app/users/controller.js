const { createUser } = require('./services');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validate and clean params

    const user = await createUser(name, email, password);

    if (user.error) {
      return res.status(user.status).json(user);
    }

    return res.status(200).json({
      error: false,
      message: 'User created Succesfully',
      status: 200,
      data: user,
    });
  } catch (err) {
    return res.status(501).json({
      error: true,
      message: 'Internal Server Error',
      status: 500,
    });
  }
};

module.exports = { register };
