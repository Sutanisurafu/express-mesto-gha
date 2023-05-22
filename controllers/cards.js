const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  const owner = req.user._id;
  const { name, link, likes, createAt } = req.body;
  Card.create({ name, link, owner, likes, createAt })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err }));
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err }));
};

module.exports.deleteCard = (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  Card.findByIdAndRemove(req.params.cardId)
  .then((data) => res.send('Удаление прошло успешно!'))
  .catch((err) => res.status(500).send({ message: err }));
}
