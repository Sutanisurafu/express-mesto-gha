const User = require("../models/user");

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(err => {
        res.status(400).send({ message: err.message})
      })
      
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => user ? res.send(user) : res.send(err))
    .catch((err) => err ? res.status(404).send(err.message) : console.log(err)); //res.status(404).send({ message: "Получен некоректный id" })
};

module.exports.updateUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(
    // eslint-disable-next-line no-underscore-dangle
    req.user._id,
    { name, about, avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      upsert: true, // если пользователь не найден, он будет создан
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};
