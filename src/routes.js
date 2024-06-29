const express = require('express');
const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');
const AddressController = require('./controllers/AddressController');
const protected = require('./middlewares/AuthMiddleware')

const routes = express.Router();

routes.post('/user', UserController.store)
routes.post('/login', AuthController.store)

routes.post('/addresses', protected, AddressController.store)
routes.put('/addresses/:id', protected, AddressController.update)
routes.delete('/addresses/:id', protected, AddressController.delete)
routes.get('/addresses', protected, AddressController.index)

// shared
routes.post('/addresses/:id/share', protected, AddressController.share)
routes.get('/shared/:token', AddressController.getSharedAddress)

module.exports = routes;