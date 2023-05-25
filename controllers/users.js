const User = require('../models/user');
const { STATUS_CODES } = require('../constants/errors');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Неверно заполнено одно из полей' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res
      .status(STATUS_CODES.INTERNATL_SERVER_ERROR)
      .send({ message: 'Сервер не отвечает' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
    })
    .catch(() => res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Некоректный id пользователя' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      runValidators: true,
      new: true, // обработчик then получит на вход обновлённую запись
    },
  )
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Некоректные данные пользователя' }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      runValidators: true,
      new: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Некоректная ссылка на аватар' }));
};
