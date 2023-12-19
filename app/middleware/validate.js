const validateBody = (schema) => (req, res, next) => {
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

const validateParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      error: true,
      message: error.message,
      status: 400,
    });
  }

  return next();
};

const validatePath = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      error: true,
      message: error.message,
      status: 400,
    });
  }

  return next();
};

module.exports = { validateBody, validateParams, validatePath };
