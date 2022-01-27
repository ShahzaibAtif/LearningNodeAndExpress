const express = require('express'); // express is a framework used to build web applications efficiently
const mongoose = require('mongoose'); // deals with all database stuff for us
const bodyParser = require('body-parser');

const app = express();

if (process.env.ENV === 'Test') {
  console.log('this is a test');
  mongoose.connect('mongodb://localhost/newBookAPI_Test');
} else {
  console.log('this is for real');
  // mongoose.connect('mongodb://localhost/newBookAPI-prod'); // connect to our database
  const db = mongoose.connect('mongodb://localhost/newBookAPI'); // connect to our database
}

const port = process.env.PORT || 3000;
const bookRouter = require('./routes/bookRouter');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my Nodemon API!');
});

app.server = app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

module.exports = app;
