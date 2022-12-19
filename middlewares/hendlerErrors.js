function handlerErrors(err, req, res, next) {
  const { statusCode = 500, message } = err;

  if (err.code === 11000) {
    return res.status(409).send({ message: 'Такой пользователь уже существует' });
  }

  return res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
}

module.exports = { handlerErrors };
