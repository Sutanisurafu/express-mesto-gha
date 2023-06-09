const cardRouter = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { cardValidate } = require('../middlewares/validators')

cardRouter.get('/', getCards);
cardRouter.post('/', cardValidate, createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);
module.exports = cardRouter;
