const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
  },
  referralCode: {
    type: DataTypes.STRING,
    unique: true,
  },
  referredBy: {
    type: DataTypes.INTEGER, 
    allowNull: true,
  },
  level: {
    type: DataTypes.INTEGER, 
    defaultValue: 1,
  },
});

module.exports = User;
