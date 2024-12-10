const Earnings = require('../models/earnings');
const User = require('../models/user');

const getEarnings = async (req, res, io) => {
  const { userId } = req.params;  // Change from referralId to userId

  console.log('Fetching earnings for userId:', userId);

  try {
    const earnings = await Earnings.findAll({  // Use findAll to fetch all earnings for the userId
      where: { userId },  // Use userId to filter the earnings
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'email', 'phone'],
      }],
    });

    if (!earnings || earnings.length === 0) {  // Check if earnings were found
      return res.status(404).json({ error: 'No earnings data found for this userId.' });
    }

    console.log('Earnings fetched:', earnings);

    // Map the earnings data into a more suitable format for response
    const earningsData = earnings.map(earning => ({
      id: earning.id,
      userId: earning.userId,
      referralId: earning.referralId,
      amount: earning.amount,
      transactionId: earning.transactionId,
      level: earning.level,
      user: earning.user,  // Include the related user data
    }));

    // Emit the earnings update via socket (if needed)
    io.emit('earnings-update', earningsData);

    // Send the earnings data as a response
    res.json(earningsData);
  } catch (error) {
    console.error('Error fetching earnings:', error);
    res.status(500).json({ error: 'Failed to fetch earnings data' });
  }
};

module.exports = { getEarnings };
