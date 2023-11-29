function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.message,
        status: 400,
      });
    }

    return next();
  };
}

module.exports = { validateBody };