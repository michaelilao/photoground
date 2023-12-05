const formatBody = (req, res, next) => {
  if (req.files) {
    req.body.files = req.files;
  }
  return next();
};

module.exports = { formatBody };
