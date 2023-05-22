const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

const router = require('./routes/users')
const router2 = require('./routes/cards')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());



app.use((req, res, next) => {
  req.user = {
    _id: '646a15689f6c97feb47de31e'
  };

  next();
}); 

app.use(router);
app.use(router2);

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
})
  .then((data) => { console.log('подключились к БД')})
  .catch((error) => {console.log(error, 'ошибка епта')});




app.listen(PORT, () => {
  console.log('Server is running on 3000 PORT');
});


// "_id": "646a15689f6c97feb47de31e",