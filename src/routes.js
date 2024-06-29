const express = require('express');
const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');
const AddressController = require('./controllers/AddressController');
const protected = require('./middlewares/AuthMiddleware')

const routes = express.Router();

routes.post('/user', UserController.store)
routes.post('/login', AuthController.store)

routes.post('/addresses', protected, AddressController.store)
routes.put('/addresses/:id', protected, AddressController.store)
routes.get('/addresses', protected, AddressController.index)

module.exports = routes;