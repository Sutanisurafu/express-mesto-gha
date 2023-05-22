const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(req.body)

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: err}));
}; 

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res) => {

  User.findById(req.params.id)
  .then(user => res.send({ data: user}))
  .catch(err => res.status(500).send({message: 'Произошла ошибка'}));
}