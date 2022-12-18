const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');

const PORT = 3000;

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use('/', routes);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  if (err.code === 11000) {
    return res.status(409).send({ message: 'Такой пользователь уже существует' });
  }

  return res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
