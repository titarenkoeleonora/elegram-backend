const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/auth/authController')
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const auth = require('../middleware/auth');

const registrationSchema = Joi.object({
  username: Joi.string().min(2).required(),
  password: Joi.string().min(6).required(),
  mail: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).required(),
  mail: Joi.string().email().required(),
});

router.post(
  '/registration',
  validator.body(registrationSchema),
  authControllers.controllers.registerController
);

router.post(
  '/login',
  validator.body(loginSchema),
  authControllers.controllers.loginControler
);

module.exports = router;