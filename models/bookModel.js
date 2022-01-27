const mongoose = require('mongoose'); // get a hold of mongoose again

const { Schema } = mongoose; // destructuring

const bookModel = new Schema( // create a new model
  { // add properties and their types
    title: { type: String },
    author: { type: String },
    genre: { type: String },
    read: { type: Boolean, default: false },
  }
);

module.exports = mongoose.model('Book', bookModel); // define the bookModel as Book and export it
