const cardRoutes = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const {checkAuth} = require("../middlewares/auth");
const { celebrate, Joi } = require('celebrate');

cardRoutes.get('/', checkAuth, getCards);
cardRoutes.post('/', checkAuth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), createCard);
cardRoutes.delete('/:cardId', checkAuth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);
cardRoutes.put('/:cardId/likes', checkAuth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);
cardRoutes.delete('/:cardId/likes', checkAuth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = cardRoutes;
