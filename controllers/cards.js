const Card = require('../models/card');
const { STATUS_CODES } = require('../constants/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res
      .status(STATUS_CODES.INTERNATL_SERVER_ERROR)
      .send({ message: 'Сервер не отвечает' }));
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
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: err.message });
      } else next(err);
    });
};
//??
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: 'Карточки с таким id несуществует' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: 'Некоректный id' });
      } else next(err);
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((data) => {
    if (data) {
      res.send(data);
    } else {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .send({ message: 'Карточки с таким id несуществует' });
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ message: 'Некоректный id карточки' });
    } else next(err);
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((data) => {
    if (data) {
      res.send(data);
    } else {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .send({ message: 'Карточки с таким id несуществует' });
    }
  })
  .then((data) => res.send(data))
  .catch((err) => {
    if (err.name === 'CastError') {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ message: 'Некоректный id карточки' });
    } else next(err);
  });
