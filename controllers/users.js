const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { message, SUCCESS, CREATED } = require('../helpers/constants');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(SUCCESS).json(users);
  } catch (err) {
    return next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user === null) {
      return next(new NotFoundError(message.errorNotFound.userId));
    }
    return res.status(SUCCESS).json(user);
  } catch (err) {
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hash, name, about, avatar,
    });
    return res.status(CREATED).json({
      email: user.email, name: user.name, about: user.about, avatar: user.avatar,
    });
  } catch (err) {
    return next(err);
  }
};

const updateInfoUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(userId, { name, about }, {
      new: true,
      runValidators: true,
    });
    if (user === null) {
      return next(new NotFoundError(message.errorNotFound.userId));
    }
    return res.status(SUCCESS).json(user);
  } catch (err) {
    return next(err);
  }
};

const updateAvatarUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (user === null) {
      return next(new NotFoundError(message.errorNotFound.userId));
    }
    const { avatar } = req.body;
    const newUser = await User.findByIdAndUpdate(userId, { avatar }, {
      new: true,
      runValidators: true,
    });
    return res.status(SUCCESS).json(newUser);
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (user === null) {
      return next(new UnauthorizedError(message.errorIncorrectDate.login));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return next(new UnauthorizedError(message.errorIncorrectDate.login));
    }
    const payload = { _id: user._id };
    const privateKey = 'my_secret_key';
    const token = JWT.sign(payload, privateKey, { expiresIn: '7d' });
    return res.status(SUCCESS).send({ token });
  } catch (err) {
    return next(err);
  }
};

const getInfoTheUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    return res.status(SUCCESS).send(user);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateInfoUser,
  updateAvatarUser,
  login,
  getInfoTheUser,
};
