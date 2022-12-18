const JWT = require('jsonwebtoken');
const { message, errors } = require('../constants');

const checkAuth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(errors.errorUnauthorized).send({ message: message.errorIncorrectDate.authorization });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    const privateKey = 'my_secret_key';
    payload = JWT.verify(token, privateKey);
  } catch(err) {
    console.log(err);
    return res.status(errors.errorUnauthorized).send({ message: message.errorIncorrectDate.authorization });
  }

  req.user = payload;
  next();
};

module.exports = { checkAuth };