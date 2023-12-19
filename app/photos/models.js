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

const status = Joi.object({
  batchId: Joi.string().required()
});

const list = Joi.object({
  limit: Joi.number(),
  offset: Joi.number()
});

module.exports = { upload, status, list };
