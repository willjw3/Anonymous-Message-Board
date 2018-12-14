/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

//require('dotenv').config();
var expect            = require('chai').expect;
const board           = require('../models/board');
const thread          = require('../controllers/threadManager');
const reply           = require('../controllers/replyManager');
//const thread          = require('../models/thread');
var fs                = require('fs');

module.exports = function (app) {

  app.route('/messages')
    .get((req, res) => {
      var myBoard = req.query.board;
      res.send(board.getOneBoard(myBoard));
    });

  app.route('/api/threads/:board')
  .get(async (req, res) => {
    var recentThreads = await thread.getRecentThreads(req);
    console.log(recentThreads.length);
    res.send(recentThreads);
  })
  .post((req, res) => {
    const postStatus = thread.postThread(req);
    console.log('status: '+postStatus);
    res.send(postStatus);
  })
  .put((req, res) => {
    var reportedThread = thread.reportThread(req);
    console.log(reportedThread);
    res.send(reportedThread);
  })
  .delete(async (req, res) => {
    var deletedThread = await thread.deleteThread(req);
    console.log('deleted thread: '+deletedThread);
    res.send(deletedThread);
  });



  app.route('/api/replies/:board')
  .get(async (req, res) => {
    var threadReplies = await thread.getThreadReplies(req);
    console.log(threadReplies);
    res.send(threadReplies);
  })
  .post((req, res) => {
    const commentStatus = reply.postReply(req);
    console.log('status: '+commentStatus);
    res.send(commentStatus);
  })
  .put((req, res) => {
    var reportedReply = reply.reportReply(req);
    console.log(reportedReply);
    res.send(reportedReply);
  })
  .delete(async (req, res) => {
    var deletedReply = await reply.deleteReply(req);
    console.log(deletedReply);
    res.send(deletedReply);
  });

};
