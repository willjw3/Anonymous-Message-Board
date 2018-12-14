/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  this.timeout(4000);

  let threadID1;
  let threadID2;
  let replyID;

  suite('API ROUTING FOR /api/threads/:board', function() {

    suite('POST', function() {
      test('Test POST /api/threads/:board', function(done) {
        chai.request(server)
         .post('/api/threads/:board')
         .send({
           board: 'test',
           text: "This is just a test",
           delete_password: 'deletethis'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.type, 'text/html');
           assert.equal(res.text, 'Thread saved and posted.');
           done();
         });
      });
      test('Test POST /api/threads/:board to add 2nd thread', function(done) {
        setTimeout(() => {
          chai.request(server)
           .post('/api/threads/:board')
           .send({
             board: 'test',
             text: "This is just a second test",
             delete_password: 'deletethis2'
           })
           .end(function(err, res){
             assert.equal(res.status, 200);
             assert.equal(res.type, 'text/html');
             assert.equal(res.text, 'Thread saved and posted.');
             done();
           });
        }, 500);
      });
    });

    suite('GET', function() {
      test('Test GET /api/threads/:board to get 10 most recent threads', function(done) {
        chai.request(server)
         .get('/api/threads/test')
         .end(function(err, res){
           threadID1 = res.body[0]._id;
           threadID2 = res.body[1]._id;
           assert.equal(res.status, 200);
           assert.isArray(res.body, 'response should be an array');
           assert.isAbove(res.body.length, 1, '1 or more items returned');
           assert.isBelow(res.body.length, 11, 'No more than 10 threads returned');
           assert.isBelow(res.body[0].replies.length, 4, 'No more than 3 replies per thread returned');
           assert.property(res.body[0], 'text', 'threads in array should have property text');
           assert.property(res.body[0], '_id', 'threads in array should have property _id');
           assert.notProperty(res.body[0], 'delete_password', 'threads in array should not show property delete_password');
           assert.notProperty(res.body[0], 'reported', 'threads in array should not show property reported');
           assert.equal(res.body[0].text, 'This is just a second test', 'first thread should be most recently added');
           assert.property(res.body[0], 'created_on', 'threads in array should have property created_on');
           assert.property(res.body[0], 'replies', 'threads in array should have property replies');
           assert.isArray(res.body[0].replies, 'replies property should be an array');
           done();
         });
      });

    });

    suite('DELETE', function() {
      test('Test DELETE /api/threads/:board to delete a thread', function(done) {
        chai.request(server)
         .delete('/api/threads/:board')
         .send({
           board: 'test',
           thread_id: threadID1,
           delete_password: 'deletethis2'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.type, 'text/html', 'response should be a text string');
           assert.equal(res.text, 'success', 'response should be the string - success')
           done();
         });
      });
      test( 'Delete the first thread using an INCORRECT PASSWORD', done => {
        chai.request( server )
         .delete('/api/threads/:board')
         .send({ thread_id: threadID2, delete_password: 'badpassword' })
         .end((err,res) => {
           assert.equal(res.text, 'Not Deleted. Check thread id and password');
           done( );
         });
      });
    });

    suite('PUT', function() {
      test('Test PUT /api/threads/:board to report a thread', function(done) {
        chai.request(server)
         .put('/api/threads/:board')
         .send({
           board: 'test',
           thread_id: threadID2
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.type, 'text/html', 'response should be a text string');
           assert.equal(res.text, 'success', 'response should be the string - success');
           done();
         });
       });

    });


  });

  suite('API ROUTING FOR /api/replies/:board', function() {

    suite('POST', function() {
      test('Test POST /api/replies/:board post a new reply', function(done) {
        chai.request(server)
         .post('/api/replies/:board')
         .send({
           board: 'test',
           thread_id: threadID2,
           text: "This is a test comment",
           delete_password: 'deletethisreply'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.type, 'text/html');
           assert.equal(res.text, 'Reply saved and posted.');
           done();
         });
      });

    });

    suite('GET', function() {
      test('Test GET /api/replies/:board to get one thread with all replies', function(done) {
        setTimeout(() => {
        chai.request(server)
         .get('/api/replies/test')
         .query({
           thread_id: threadID2
         })
         .end(function(err, res){
           replyID = res.body.replies[0]._id;
           assert.equal(res.status, 200);
           assert.isObject(res.body, 'response should be an object');
           assert.property(res.body, 'text', 'threads should have property text');
           assert.property(res.body, '_id', 'threads should have property _id');
           assert.notProperty(res.body, 'delete_password', 'threads should not show property delete_password');
           assert.notProperty(res.body, 'reported', 'threads should not show property reported');
           assert.equal(res.body.text, 'This is just a test', 'first thread should be most recently added');
           assert.property(res.body, 'created_on', 'threads should have property created_on');
           assert.property(res.body, 'replies', 'threads should have property replies');
           assert.property(res.body, 'bumped_on', 'threads should have property - bumped_on');
           assert.isObject(res.body.replies[0], 'reply should be an object');
           assert.property(res.body.replies[0], 'text', 'replies should have property - text');
           assert.property(res.body.replies[0], '_id');
           assert.property(res.body.replies[0], 'created_on');
           assert.notProperty(res.body.replies[0], 'reported', 'hiding property - reported');
           assert.notProperty(res.body.replies[0], 'delete_password', 'hiding property - delete_password')
           assert.isArray(res.body.replies, 'replies property should be an array');
           assert.isBelow(res.body.replies.length, 4, 'No more than 3 replies per thread returned');
           assert.equal(res.body.replies[0].text, 'This is a test comment')
           done();
         });
       }, 500)
      });

    });

    suite('PUT', function() {
      test('Test PUT /api/replies/:board to report a reply', function(done) {
        chai.request(server)
         .put('/api/replies/:board')
         .send({
           board: 'test',
           thread_id: threadID2,
           reply_id: replyID
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.type, 'text/html', 'response should be a text string');
           assert.equal(res.text, 'success', 'response should be the string - success');
           done();
         });
       });
    });

    suite('DELETE', function() {
      test('Test DELETE /api/replies/:board to delete a reply', function(done) {
        chai.request(server)
         .delete('/api/replies/:board')
         .send({
           board: 'test',
           thread_id: threadID2,
           reply_id: replyID,
           delete_password: 'deletethisreply'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.type, 'text/html', 'response should be a text string');
           assert.equal(res.text, 'success', 'response should be the string - success')
           done();
         });
      });
      test( 'Delete the first thread using an INCORRECT PASSWORD', done => {
        chai.request( server )
         .delete('/api/replies/:board')
         .send({
           board: 'test',
           thread_id: threadID2,
           reply_id: replyID,
           delete_password: 'badpassword'
           })
         .end((err,res) => {
           assert.notEqual(res.text, 'success');
           done( );
         });
      });
    });

  });

});
