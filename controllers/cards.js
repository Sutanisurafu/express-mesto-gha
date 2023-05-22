const Card = require("../models/card");

module.exports.createCard = (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  const owner = req.user._id;
  const { name, link, likes, createAt } = req.body;
  Card.create({ name, link, owner, likes, createAt })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err }));
};

module.exports.deleteCard = (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  Card.findByIdAndRemove(req.params.cardId)
    .then((data) => res.send("Удаление прошло успешно!", data))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(err);
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({ message: "Карточки с таким id несуществует" });
      }
    })
    .catch((err) => res.status(400).send({ message: err.message }));

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({ message: "Карточки с таким id несуществует" });
      }
    })
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message }));
