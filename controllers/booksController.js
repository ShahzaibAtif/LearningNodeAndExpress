/* eslint-disable linebreak-style */
function booksController(Book) {
  function post(req, res) {
    console.log('************ POST');
    const book = new Book(req.body);
    if (!req.body.title) {
      res.status(400);
      return res.send('title is required');
    }
    book.save();
    res.status(201);
    return res.json(book);
  }

  function get(req, res) {
    console.log('************ GET');
    const query = {};
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    Book.find(query, (err, books) => {
      if (err) {
        return res.send(err);
      }
      const returnBooks = books.map((book) => {
        const newBook = book.toJSON();
        newBook.links = {};
        newBook.links.self = `http://localhost:4000/api/books/${book._id}`;
        return newBook;
      });
      return res.json(returnBooks);
    });
  }
  return { post, get };
}

module.exports = booksController;
