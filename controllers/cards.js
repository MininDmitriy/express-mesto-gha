const Card = require('../models/card');

const SUCCESS = 200;
const ERROR_NOT_FOUND = 404;
const ERROR_INCORRECT_DATE = 400;
const ERROR_INTERNAL_SERVER = 500;

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    if (cards.length === 0) {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Карточки не найдены' });
    }
    return res.status(SUCCESS).json(cards);
  } catch (err) {
    console.log(err);
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(SUCCESS).json(card);
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Переданы некорректные данные при создании карточки' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (card === null) {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Карточка с указанным _id не найдена' });
    }
    await Card.findByIdAndRemove(cardId);
    return res.status(SUCCESS).json({ message: 'Карточка успешно удалена' });
  } catch (err) {
    console.log(err);
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};

const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (cardId.length !== 24) {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Переданы некорректные данные для постановки лайка' });
    }
    const card = await Card.findById(cardId);
    if (card === null) {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Передан несуществующий _id карточки' });
    }
    await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    return res.status(SUCCESS).json({ message: 'Постановка лайка прошло успешно' });
  } catch (err) {
    console.log(err);
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (cardId.length !== 24) {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Переданы некорректные данные для снятия лайка' });
    }
    const card = await Card.findById(cardId);
    if (card === null) {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Передан несуществующий _id карточки' });
    }
    await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    return res.status(SUCCESS).json({ message: 'Снятие лайка прошло успешно' });
  } catch (err) {
    console.log(err);
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
