/* eslint-disable prettier/prettier */
const Joi = require('joi');

const register = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(15)
    .required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .required(),

});

const login = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .required(),

});

module.exports = { register, login };
