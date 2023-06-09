const cardRouter = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { cardValidate, cardIdValidate } = require('../middlewares/validators');

cardRouter.get('/', getCards);
cardRouter.post('/', cardValidate, createCard);
cardRouter.delete('/:cardId', cardIdValidate, deleteCard);
cardRouter.put('/:cardId/likes', cardIdValidate, likeCard);
cardRouter.delete('/:cardId/likes', cardIdValidate, dislikeCard);
module.exports = cardRouter;
