const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: {
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
  },
  owner: {
    // eslint-disable-next-line no-undef
    type: String,
    required: true,
  },
  likes: {
    // eslint-disable-next-line no-undef
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}); 

module.exports = mongoose.model('card', cardSchema); 

