const User = require('../models/user');
const { message, errors } = require('../constants');
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const { NotFoundError, IncorrectDateError, UnauthorizedError } = require('../errors');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(errors.success).json(users);
  } catch (err) {
    console.log(err);
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });
    // next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user === null) {
      return res.status(errors.errorNotFound).json({ message: message.errorNotFound.userId });
      // next(new NotFoundError(message.errorNotFound.userId));
    }
    return res.status(errors.success).json(user);
  } catch (err) {
    console.log(err);
    if (err.name === 'CastError') {
      return res.status(errors.errorIncorrectDate).json({ message: message.errorIncorrectDate.userId });
    }
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });

    // if (err.name === 'CastError') {
    //   next(new IncorrectDateError(message.errorIncorrectDate.userId));
    // }
    // next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { email, password, name, about, avatar } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, name, about, avatar });
    return res.status(errors.created).json(user);
  } catch (err) {
    console.log(err);
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });

    // next(err);
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
      return res.status(errors.errorNotFound).json({ message: message.errorNotFound.userId });
    }

    // if (user === null) {
    //   next(new NotFoundError(message.errorNotFound.userId));
    // }
    return res.status(errors.success).json(user);
  } catch (err) {
    console.log(err);
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });

    // next(err);
  }
};

const updateAvatarUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (user === null) {
      return res.status(errors.errorNotFound).json({ message: message.errorNotFound.userId });
    }

    // if (user === null) {
    //   next(new NotFoundError(message.errorNotFound.userId));
    // }
    const { avatar } = req.body;
    const newUser = await User.findByIdAndUpdate(userId, { avatar }, {
      new: true,
      runValidators: true,
    });
    return res.status(errors.success).json(newUser);
  } catch (err) {
    console.log(err);
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });

    // next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email}).select('+password');
    if (user === null) {
      return res.status(errors.errorUnauthorized).json({ message: message.errorIncorrectDate.login });
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(errors.errorUnauthorized).json({ message: message.errorIncorrectDate.login });
    }

    // if (user === null) {
    //   next(new UnauthorizedError(message.errorIncorrectDate.login));
    // }
    // const matched = await bcrypt.compare(password, user.password);
    // if (!matched) {
    //   next(new UnauthorizedError(message.errorIncorrectDate.login));
    // }
    const payload = { _id: user._id };
    const privateKey = 'my_secret_key';
    const token = JWT.sign(payload, privateKey, { expiresIn: '7d' });
    res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
    return res.status(errors.success).send({ message: message.success.login });
  } catch (err) {
    console.log(err);
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });

    // next(err);
  }
}

const getInfoTheUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    return res.status(errors.success).send(user);
  } catch (err) {
    console.log(err);
    return res.status(errors.errorInternalServer).json({ message: message.errorInternalServer });

    // next(err);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateInfoUser,
  updateAvatarUser,
  login,
  getInfoTheUser
};
