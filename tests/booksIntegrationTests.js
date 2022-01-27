/* eslint-disable linebreak-style */
require('should');

const request = require('supertest'); // for comlete end to end testing
// note that we are not mocking anything here because its an end to integration test ...
// .. so we are going to pull mongoose in
const mongoose = require('mongoose');

// process.env.ENV = 'Test'; // a variable to know if we are in the test mode

const app = require('../app.js'); // import our api

const Book = mongoose.model('Book');
const agent = request.agent(app); // request an agent to run our api

describe('Book crud Test', () => {
  it('should allow a book to be posted and return read and _id', (done) => {
    const bookPost = { title: 'My Book', author: 'msa', genre: 'Fiction' };

    agent.post('/api/books') // send a post request to /api/books
      .send(bookPost) // send the bookpost payload in
      .expect(200) // we expect a 200 to comeback
      .end((err, results) => { // at the end, we get a callback that's got error and results
        // results.body.read.should.not.equal(false);
        results.body.should.have.property('_id');
        done(); // to let the supertest and mocha know that we are done
      });
  });
});

afterEach((done) => {
  Book.deleteMany({}).exec();
  done();
});

after((done) => { // after everything is done, close mongoose connection and app server
  mongoose.connection.close();
  app.server.close(done());
});
