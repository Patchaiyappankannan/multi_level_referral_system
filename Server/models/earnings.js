const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user'); 

const Earnings = sequelize.define('Earnings', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  referralId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  level: {
    type: DataTypes.INTEGER, 
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'valid', 
  },
});

Earnings.belongsTo(User, { foreignKey: 'referralId', as: 'user' });

module.exports = Earnings;
