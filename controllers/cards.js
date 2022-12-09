const Card = require('../models/card');
const { message, errors } = require('../constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(errors.success).json(cards);
  } catch (err) {
    console.log(err);
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(errors.created).json(card);
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(errors.errorIncorrectDate).json({ message: message.errorIncorrectDate.dateCard });
    }
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndRemove(cardId);
    if (card === null) {
      return res.status(errors.errorNotFound).json({ message: message.errorNotFound.cardId });
    }
    return res.status(errors.success).json({ message: message.success.cardDelete });
  } catch (err) {
    console.log(err);
    if (err.name === 'CastError') {
      return res.status(errors.errorIncorrectDate).json({ message: message.errorIncorrectDate.cardId });
    }
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });
  }
};

const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (card === null) {
      return res.status(errors.errorNotFound).json({ message: message.errorNotFound.cardId });
    }
    await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    return res.status(errors.success).json({ message: message.success.likeCard });
  } catch (err) {
    console.log(err);
    if (err.name === 'CastError') {
      return res.status(errors.errorIncorrectDate).json({ message: message.errorIncorrectDate.likeCard });
    }
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (card === null) {
      return res.status(errors.errorNotFound).json({ message: message.errorNotFound.cardId });
    }
    await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    return res.status(errors.success).json({ message: message.success.dislikeCard });
  } catch (err) {
    console.log(err);
    if (err.name === 'CastError') {
      return res.status(errors.errorIncorrectDate).json({ message: message.errorIncorrectDate.dislikeCard });
    }
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
