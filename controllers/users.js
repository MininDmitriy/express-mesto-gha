const User = require('../models/user');
const { message, errors } = require('../constants');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(errors.success).json(users);
  } catch (err) {
    console.log(err);
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user === null) {
      return res.status(errors.errorNotFound).json({ message: message.errorNotFound.userId });
    }
    return res.status(errors.success).json(user);
  } catch (err) {
    console.log(err);
    if (err.name === 'CastError') {
      return res.status(errors.errorIncorrectDate).json({
        message: message.errorIncorrectDate.userId,
      });
    }
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(errors.created).json(user);
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError') {
      return res.status(errors.errorIncorrectDate).json({
        message: message.errorIncorrectDate.dateUser,
      });
    }
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });
  }
};

const updateInfoUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(userId, { name, about }, {
      new: true,
      runValidators: true,
    });
    if (user === null) {
      return res.status(errors.errorNotFound).json({ message: message.errorNotFound.userId });
    }
    return res.status(errors.success).json(user);
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(errors.errorIncorrectDate).json({
        message: message.errorIncorrectDate.updateDateUser,
      });
    }
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });
  }
};

const updateAvatarUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (user === null) {
      return res.status(errors.errorNotFound).json({ message: message.errorNotFound.userId });
    }
    const { avatar } = req.body;
    const newUser = await User.findByIdAndUpdate(userId, { avatar }, {
      new: true,
      runValidators: true,
    });
    return res.status(errors.success).json(newUser);
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(errors.errorIncorrectDate).json({
        message: message.errorIncorrectDate.updateAvatarUser,
      });
    }
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateInfoUser,
  updateAvatarUser,
};
