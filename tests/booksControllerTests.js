/* eslint-disable linebreak-style */
// mocha is our testing framework ...
const should = require('should'); // should is an assertion framework
const sinon = require('sinon'); // sinon is used for mocking in our unit test
const bookController = require('../controllers/booksController');

describe('Book Controller Tests:', () => { // describe what it is we are testing
  describe('Post', () => { // describe the post test
    it('should not allow an empty title on post', () => { // layout the test
      // to test the post method, we need to send mock book, res, and req
      const Book = function (book) { this.save = () => {}; };

      const req = { // create a mock request that doesn't have a title
        body: {
          author: 'msa'
        }
      };

      const res = {
        status: sinon.spy(),
        // spy() keeps track of what its called with, how many times its called, etc.
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = bookController(Book);
      controller.post(req, res);

      // status should be called with 400 atleast once
      res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
      // send should be called with 'title is required' atleast once
      res.send.calledWith('title is required').should.equal(true);
    });
  });
});
