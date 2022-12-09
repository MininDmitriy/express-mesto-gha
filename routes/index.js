const routes = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { message, errors } = require('../constants');

routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);
routes.use('*', (req, res) => res.status(errors.errorNotFound).json({ message: message.errorNotFound.page }));

module.exports = routes;