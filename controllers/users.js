const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { STATUS_CODES } = require('../constants/errors');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      res.status(STATUS_CODES.UNAUTHORIZED).send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res
      .status(STATUS_CODES.INTERNATL_SERVER_ERROR)
      .send({ message: 'Сервер не отвечает' }));
};

module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(STATUS_CODES.CREATED).send({
        _id: user._id,
        email: user.email,
      });
    })
    .catch(() => {
      res.status(STATUS_CODES.CONFLICT_REQUEST).send({ message: 'Такой имейл уже зарегистрирован' });
    });
};

module.exports.getUserById = (req, res, next) => {
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
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Некорректный id пользователя' });
      } else next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({ message: err.message });
      } else next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Некорректный id пользователя' });
      } else next(err);
    });
};

module.exports.getEnteredUserInfo = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(STATUS_CODES.OK).send(user))
    .catch((err) => res.status(STATUS_CODES.BAD_REQUEST).send({ message: err.message }));
};
