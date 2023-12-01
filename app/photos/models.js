/* eslint-disable prettier/prettier */
const Joi = require('joi');

const upload = Joi.object({
  files: Joi.array()
    .items(
      Joi.object({
        name: Joi.string(),
        file: Joi.binary(),
      }),
    ),
});

module.exports = { upload };
