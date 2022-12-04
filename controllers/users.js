const User = require('../models/user');

const SUCCESS = 200;
const ERROR_NOT_FOUND = 404;
const ERROR_INCORRECT_DATE = 400;
const ERROR_INTERNAL_SERVER = 500;

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Пользователи не найдены' });
    }
    return res.status(SUCCESS).json(users);
  } catch (err) {
    console.log(err);
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user === null) {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.status(SUCCESS).json(user);
  } catch (err) {
    console.log(err);
    if (err.name === 'CastError') {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Некорректно передан _id пользователя' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(SUCCESS).json(user);
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};

const updateInfoUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (user === null) {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Пользователь с указанным _id не найден' });
    }
    const { name, about } = req.body;
    const newUser = await User.findByIdAndUpdate(userId, { name, about }, {
      new: true,
      runValidators: true,
    });
    return res.status(SUCCESS).json(newUser);
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};

const updateAvatarUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (user === null) {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Пользователь с указанным _id не найден' });
    }
    const { avatar } = req.body;
    const newUser = await User.findByIdAndUpdate(userId, { avatar }, {
      new: true,
      runValidators: true,
    });
    return res.status(SUCCESS).json(newUser);
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateInfoUser,
  updateAvatarUser,
};
