const express = require('express');
const router = express.Router();
const { validateCardCreate, validateCardUpdate } = require('../validators/cardValidator');
const cardController = require('../controllers/cardController');

// Define CRUD routes for cards
router.get('/', cardController.getCards);
router.post('/', validateCardCreate, cardController.createCard);
router.put('/:id', validateCardUpdate, cardController.updateCard);
router.delete('/:id', cardController.deleteCard);

module.exports = router;
