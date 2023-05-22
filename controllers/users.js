const User = require("../models/user");

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res
          .status(404)
          .send({ message: "Запрашиваемый пользователь не найден" });
      }
    }) //res.send(user)
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.updateUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(
    // eslint-disable-next-line no-underscore-dangle
    req.user._id,
    { name, about, avatar },
    { runValidators: true,
      new: true, // обработчик then получит на вход обновлённую запись
      upsert: true, // если пользователь не найден, он будет создан
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: err.message }));
};
