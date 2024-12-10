const User = require('../models/user');
const { generateReferralCode } = require('../utils/referralCodeGenerator'); 

const createUser = async (req, res) => {
  try {
    const { name, email, phone, referredBy } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({ error: 'Phone number already in use' });
    }

    let validReferredBy = null; 

    if (referredBy) {
      console.log(`Checking referredBy: ${referredBy}`);
      const referredUser = await User.findByPk(referredBy);
      if (!referredUser) {
        console.log('Referred user does not exist');
        return res.status(400).json({ error: 'Referred user does not exist' });
      }
      validReferredBy = referredBy; 
    }

    const referralCode = generateReferralCode();

    const user = await User.create({
      name,
      email,
      phone,
      referredBy: validReferredBy,
      referralCode,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getReferralHierarchy = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const directReferrals = await User.findAll({
      where: { referredBy: userId }
    });
    
    const indirectReferrals = [];
    for (const referral of directReferrals) {
      const secondLevelReferrals = await User.findAll({
        where: { referredBy: referral.id }
      });
      indirectReferrals.push(...secondLevelReferrals);
    }

    res.json({
      directReferrals,
      indirectReferrals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createUser,
  getUserById,
  getReferralHierarchy,
};
