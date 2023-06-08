/* eslint-disable no-useless-escape */
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { STATUS_CODES } = require('./constants/errors');

const { PORT = 3000 } = process.env;

const app = express();
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const handleErrors = require('./middlewares/errors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^https?:\/\/(www\.)?[\w\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*#?$/),
  }),
}), createUser);

app.use('*', (req, res) => {
  res
    .status(STATUS_CODES.NOT_FOUND)
    .send({ message: 'Запрашиваемая страница не существует' });
});

mongoose
  .connect('mongodb://0.0.0.0:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Подключены к БД');
  })
  .catch((error) => {
    console.log(error);
  });

app.use(handleErrors);

app.listen(PORT, () => {
  console.log('Server is running on 3000 PORT');
});
