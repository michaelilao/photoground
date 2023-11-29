/* eslint-disable prettier/prettier */
const Joi = require('joi');

const register = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(15)
    .required(),

  password: Joi.string()
    .min(8)
    .max(30)
    .required(),

  email: Joi.string()
    .email()
    .required(),
});

const login = Joi.object({
  password: Joi.string()
    .min(8)
    .max(30)
    .required(),

  email: Joi.string()
    .email()
    .required(),
});

module.exports = { register, login };
