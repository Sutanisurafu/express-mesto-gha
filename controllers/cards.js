const Card = require('../models/card');
const NotFoundError = require('../errors/Not-found');
const BadRequestError = require('../errors/Bad-request');
const ForbiddenError = require('../errors/Forbidden-request');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const {
    name, link, likes, createAt,
  } = req.body;
  Card.create({
    name,
    link,
    owner,
    likes,
    createAt,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      } return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Карточки с таким id несуществует'))
    .then((data) => {
      if (data.owner._id.toString() !== req.user._id) {
        return next(new ForbiddenError('Вы не можете удалить карточку другого пользователя'));
      }
      return Card.deleteOne(data)
        .then(res.send('Карточка успешно удалена!'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный id'));
      } return next(err);
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((data) => {
    if (!data) {
      throw new NotFoundError('Карточки с таким id несуществует');
    } res.send(data);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некоректный id карточки'));
    } return next(err);
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((data) => {
    if (!data) {
      throw new NotFoundError('Карточки с таким id несуществует');
    } res.send(data);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некоректный id карточки'));
    } return next(err);
  });
