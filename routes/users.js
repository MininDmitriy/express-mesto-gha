const userRoutes = require('express').Router();
const {
  getUsers, getUser, updateInfoUser, updateAvatarUser, getInfoTheUser
} = require('../controllers/users');
const { checkAuth } = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');

userRoutes.get('/', checkAuth, getUsers);
userRoutes.get('/me', checkAuth, getInfoTheUser);
userRoutes.get('/:userId', checkAuth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);
userRoutes.patch('/me', checkAuth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateInfoUser);
userRoutes.patch('/me/avatar', checkAuth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom((value, helpers) => {
      if (/^(http|https):\/\/[^ "]+$/.test(value)) {
        return value;
      }
      return helpers.message('Not a valid URL!');
    }),
  }),
}), updateAvatarUser);

module.exports = userRoutes;
