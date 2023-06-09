const { celebrate, Joi } = require('celebrate');

const urlCheck = /https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?/;

exports.signUpValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlCheck),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

exports.signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

exports.userIdValidate = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

exports.userValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

exports.avatarValidate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlCheck),
  }),
});

exports.cardValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlCheck),
  }),
});

exports.cardIdValidate = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});
