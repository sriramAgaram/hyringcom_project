const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

// GET all history globally
router.get('/', historyController.getAllHistory);

// GET history for a specific card
router.get('/:cardId', historyController.getHistoryByCardId);

module.exports = router;
