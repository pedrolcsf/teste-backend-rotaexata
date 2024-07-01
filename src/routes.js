const express = require('express');

const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');
const AddressController = require('./controllers/AddressController');

const authMiddleware = require('./middlewares/AuthMiddleware')

const routes = express.Router();

routes.post('/user', UserController.store)
routes.post('/login', AuthController.store)

routes.post('/addresses', authMiddleware, AddressController.store)
routes.put('/addresses/:id', authMiddleware, AddressController.update)
routes.delete('/addresses/:id', authMiddleware, AddressController.delete)
routes.get('/addresses', authMiddleware, AddressController.index)

// shared
routes.post('/addresses/:id/share', authMiddleware, AddressController.share)
routes.get('/shared/:token', AddressController.getSharedAddress)

module.exports = routes;