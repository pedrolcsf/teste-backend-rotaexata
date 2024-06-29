const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../models/User');
const Address = require('../models/Address');
const Log = require('../models/Log');

const connection = new Sequelize(dbConfig);

User.init(connection);
Address.init(connection);
Log.init(connection);

Address.associate(connection.models);
Log.associate(connection.models);

module.exports = connection;