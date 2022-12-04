const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const PORT = 3000;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '638b4cbd9d363562e8585d45',
  };

  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.get('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
