require('dotenv').config();

module.exports = {
  test: {
    dialect: 'sqlite',
    storage: './src/database/test.sqlite',
    define: {
      timestamps: true,
      underscored: true,
    },
  },
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    define: {
      timestamps: true,
      underscored: true,
    },
  },
  production: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    define: {
      timestamps: true,
      underscored: true,
    },
  },

};