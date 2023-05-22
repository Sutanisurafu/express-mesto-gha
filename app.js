const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();

const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

const userRouter = require('./routes/users')
const cardRouter = require('./routes/cards')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());



app.use((req, res, next) => {
  req.user = {
    _id: '646a15689f6c97feb47de31e'
  };

  next();
}); 

app.use(userRouter);
app.use(cardRouter);

app.use('*', (req, res) => {
  res.status(404)
  .send({ message: 'Запрашиваемая страница не существует'})
});

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
})
  .then((data) => { console.log('подключились к БД')})
  .catch((error) => {console.log(error, 'ошибка епта')});




app.listen(PORT, () => {
  console.log('Server is running on 3000 PORT');
});

