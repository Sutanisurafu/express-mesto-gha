const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { STATUS_CODES } = require('../constants/errors');
const NotFoundError = require('../errors/Not-found');
const BadRequestError = require('../errors/Bad-request');
const UnauthorizedError = require('../errors/Unauthorized');
const ConflictError = require('../errors/Conflict-request');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => next(new UnauthorizedError(err.message)));
};

module.exports.createUser = (req, res, next) => {
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
    .catch(() => next(new ConflictError('Такой имейл уже зарегистрирован')));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } return next(new NotFoundError('Запрашиваемый пользователь не найден'));
    })
    .catch((err) => {
      if (err.name !== 'CastError') {
        next(err);
      } return next(new BadRequestError('Некорректный id пользователя'));
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
      if (err.name !== 'ValidationError') {
        next(err);
      } return next(new BadRequestError(err.message));
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
      if (err.name !== 'ValidationError') {
        next(err);
      } return next(new BadRequestError({ message: 'некорректный id пользователя' }));
    });
};

module.exports.getEnteredUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(STATUS_CODES.OK).send(user))
    .catch((err) => next(new BadRequestError(err.message)));
};
