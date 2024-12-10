const express = require('express');
const { createTransaction } = require('../controllers/transactionsController');

const router = express.Router();

router.post('/transactions', createTransaction);

module.exports = router;
