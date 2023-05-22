const router2 = require('express').Router();
const { createCard, getCards, deleteCard } = require('../controllers/cards')

router2.get('/cards', getCards);
router2.post('/cards', createCard);
router2.delete('/cards/:cardId', deleteCard);

module.exports = router2;
