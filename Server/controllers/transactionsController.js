const Transaction = require('../models/transaction');
const { calculateEarnings } = require('../services/referralService');

const createTransaction = async (req, res) => {
  const { userId, amount } = req.body;

  const transaction = await Transaction.create({ userId, amount, status: 'completed' });

  if (amount > 1000) {
    await calculateEarnings(userId, amount, transaction.id);
  }

  res.status(201).json(transaction);
};

module.exports = { createTransaction };
