const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const User = sequelize.define('User', {
  googleId: {
    type: DataTypes.STRING,
    unique: true
  },
  naverId: {
    type: DataTypes.STRING,
    unique: true
  },
});

module.exports = User;
