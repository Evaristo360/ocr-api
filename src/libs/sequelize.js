const { Sequelize, Op } = require('sequelize');

const { config } = require('../config/config');
const setupModels = require('./../db/models');

const sequelize = new Sequelize(
  {
    host: config.dbHost,
    dialect: 'postgres',
    database: config.dbName,
    username: config.dbUser,
    password: config.dbPassword,
    port: config.dbPort,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false // This is required when connecting to Azure
      }
    }
  }
);

//sequelize.sync();
setupModels(sequelize);

module.exports = { sequelize, Op };