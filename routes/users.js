const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, updateInfoUser, updateAvatarUser, getInfoTheUser,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/me', getInfoTheUser);
userRoutes.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUser);
userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateInfoUser);
userRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom((value, helpers) => {
      if (/^(http|https):\/\/[^ "]+$/.test(value)) {
        return value;
      }
      return helpers.message('Передан некорректный URL-адрес аватара пользователя');
    }),
  }),
}), updateAvatarUser);

module.exports = userRoutes;
