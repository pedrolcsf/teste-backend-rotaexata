const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../models/User');
const Address = require('../models/Address');
const Log = require('../models/Log');

require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const connection = new Sequelize(config.database, config.username, config.password, config);

User.init(connection);
Address.init(connection);
Log.init(connection);

Address.associate(connection.models);
Log.associate(connection.models);

module.exports = connection;