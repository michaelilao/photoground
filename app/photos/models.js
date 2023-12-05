/* eslint-disable prettier/prettier */
const Joi = require('joi');

const upload = Joi.object({
  files: Joi.array()
    .items(
      Joi.object({
        fieldname: Joi.string(),
        originalname: Joi.string(),
        encoding: Joi.string(),
        mimetype: Joi.string(),
        destination: Joi.string(),
        filename: Joi.string(),
        path: Joi.string(),
        size: Joi.number(),
      }),
    )
    .required()
    .min(1),
});

module.exports = { upload };
