'use strict'

var db         = require('./DB')
var mongoose   = require('mongoose');
var schema     = require('./schema');
var newReply;
var replyDelete;
var replyReport;


module.exports = {
  saveReply: async function(thread_id, board, text, dpass) {

    var Reply = await schema.useReplySchema();
    newReply = new Reply({
      text: text,
      created_on: new Date,
      reported: false,
      delete_password: dpass
    });

    console.log('new Reply made');

    const Thread = await schema.useThreadSchema(board);
    const repliesQuery = await Thread.findOneAndUpdate(
      {_id: thread_id},
      {$push: {replies: newReply}, bumped_on: new Date()},
      {new: true}
    );
    return repliesQuery;
  },

  repReply: async function(thread_id, board, reply_id) {
    const Thread = await schema.useThreadSchema(board);
    replyReport = await Thread.findOneAndUpdate(
      {_id: thread_id, replies: {$elemMatch: {_id: reply_id}}},
      {$set: {'replies.$.reported': true}}
    );
    return replyReport;
  },

  delReply: async function(thread_id, board, reply_id, dpass) {
    const Thread = await schema.useThreadSchema(board);
    replyDelete = await Thread.findOneAndUpdate(
      {_id: thread_id, replies: {$elemMatch: {_id: reply_id, delete_password:dpass}}},
      {$set: {'replies.$.text': '[deleted]'}}
    );
    console.log(replyDelete);
    if (replyDelete === null) {
      return 'not deleted';
    }
    else {
      return replyDelete;
    }
  }

}
