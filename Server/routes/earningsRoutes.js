const express = require('express');
const { getEarnings } = require('../controllers/earningsController');
const router = express.Router();

const earningsRoutes = (io) => {
  router.get('/earnings/:userId', (req, res) => getEarnings(req, res, io));
  return router;
};

module.exports = earningsRoutes;
