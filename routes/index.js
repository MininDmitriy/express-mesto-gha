const routes = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { message } = require('../helpers/constants');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { login, createUser } = require('../controllers/users');
const { NotFoundError } = require('../helpers/errors');

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Передан некорректный e-mail пользователя');
    }),
    password: Joi.string().required().min(8),
  }),
}), login);
routes.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  }),
}), createUser);
routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);
routes.use('*', (req, res, next) => next(new NotFoundError(message.errorNotFound.page)));

module.exports = routes;
