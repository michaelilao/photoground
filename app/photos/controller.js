const upload = async (req, res) => {
  try {
    console.log(req.body);
    return res.status(200).json({
      error: false,
      message: 'User created Succesfully',
      status: 200,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error',
      status: 500,
    });
  }
};
module.exports = { upload };
