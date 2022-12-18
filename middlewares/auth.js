const JWT = require('jsonwebtoken');
const { message } = require('../helpers/constants');
const { UnauthorizedError } = require('../helpers/errors')

const checkAuth = (req, res, next) => {
  const authorization = req.cookies.jwt;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(message.errorIncorrectDate.authorization));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    const privateKey = 'my_secret_key';
    payload = JWT.verify(token, privateKey);
  } catch(err) {
    console.log(err);
    return next(new UnauthorizedError(message.errorIncorrectDate.token));
  }

  req.user = payload;
  next();
};

module.exports = { checkAuth };