/* eslint-disable no-param-reassign */
/* eslint-disable linebreak-style */
const express = require('express');
const Book = require('../models/bookModel'); // we need to create a bookModel
const booksController = require('../controllers/booksController');

const bookRouter = express.Router();
const controller = booksController(Book); // an object having two functions ... { post, get }

// // add a middleware for /books as well just for testing
// bookRouter.use('/books', (req, res, next) => {
//   console.log('********* middleware /books');
//   return next(); // go to the next destination in route
// });

bookRouter.route('/books')
  .post(controller.post)
  .get(controller.get);

// add a middleware between client and server
// the 'next' will hand over matters to server
bookRouter.use('/books/:bookId', (req, res, next) => {
  Book.findById(req.params.bookId, (err, book) => {
    console.log('************ MIDDLEWARE');
    if (err) {
      return res.send(err);
      // 'return' added on multiple places so to make sure we return from this function
    }
    if (book) { // if book is found
      req.book = book;
      return next();
    }
    return res.sendStatus(404); // return 404 error if the function reaches here
  });
});
bookRouter.route('/books/:bookId')
  .get((req, res) => {
    console.log('************ GET (BOOK ID)');
    const returnBook = req.book.toJSON();
    returnBook.links = {};
    const genre = req.book.genre.replace(' ', '%20');
    returnBook.links.FilterByThisGenre = `http://${req.headers.host}/api/books/?genre=${genre}`;
    res.json(returnBook);
  })
  .put((req, res) => { // replace an item altogether
    console.log('************ PUT (BOOK ID)');
    const { book } = req; // book = req.book (destructuring)
    book.title = req.body.title;
    book.author = req.body.author;
    book.genre = req.body.genre;
    book.read = req.body.read;
    req.book.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(book);
    });
  })
  .patch((req, res) => { // just modify some part of an item
    console.log('************ PATCH (BOOK ID)');
    const { book } = req;
    // eslint-disable-next-line no-underscore-dangle
    if (req.body._id) {
      // eslint-disable-next-line no-underscore-dangle
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      book[key] = value;
    });
    req.book.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(book);
    });
  })
  .delete((req, res) => { // delete an item
    console.log('************ DELETE (BOOK ID)');
    req.book.remove((err) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204);
    });
  });

module.exports = bookRouter;
