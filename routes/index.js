const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { message } = require('../helpers/constants');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const { checkAuth } = require('../middlewares/auth');

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
    avatar: Joi.string().custom((value, helpers) => {
      if (/^(http|https):\/\/[^ "]+$/.test(value)) {
        return value;
      }
      return helpers.message('Передан некорректный URL-адрес аватара пользователя');
    }),
  }),
}), createUser);
routes.use('/users', checkAuth, userRoutes);
routes.use('/cards', checkAuth, cardRoutes);
routes.use('*', (req, res, next) => next(new NotFoundError(message.errorNotFound.page)));

module.exports = routes;
