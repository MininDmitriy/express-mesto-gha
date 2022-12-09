const express = require('express');
const mongoose = require('mongoose');
const routes =require('./routes/index');

const PORT = 3000;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '638b4cbd9d363562e8585d45',
  };

  next();
});

app.use('/', routes);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
