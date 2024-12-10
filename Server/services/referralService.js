const User = require('../models/user');
const Earnings = require('../models/earnings');
const Transaction = require('../models/transaction');

const calculateEarnings = async (userId, transactionAmount, transactionId) => {
  if (transactionAmount <= 1000) return;

  const user = await User.findOne({ where: { id: userId } });
  if (!user) return;

  const parentUser = await User.findOne({ where: { id: user.referredBy } });
  if (!parentUser) return;

  const directEarnings = transactionAmount * 0.05;
  await Earnings.create({
    userId: parentUser.id, 
    referralId: userId,    
    amount: directEarnings,
    transactionId,
    level: 1,
  });


  const grandparentUser = parentUser.referredBy ? await User.findOne({ where: { id: parentUser.referredBy } }) : null;
  
  
  if (grandparentUser) {
    const indirectEarnings = transactionAmount * 0.01;
    await Earnings.create({
      userId: grandparentUser.id,  
      referralId: userId,        
      amount: indirectEarnings,
      transactionId,
      level: 2,
    });
  }
};





module.exports = { calculateEarnings };
