const express = require('express');
const { createUser, getUserById, getReferralHierarchy } = require('../controllers/usersController');

const router = express.Router();

router.post('/users', createUser);

router.get('/users/:userId', getUserById);

router.get('/users/:userId/hierarchy', getReferralHierarchy);

module.exports = router;
