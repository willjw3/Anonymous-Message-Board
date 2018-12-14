'use strict'

var db         = require('./DB')
var mongoose   = require('mongoose');
var schema     = require('./schema');
var newThread;
var threadList;
var oneThread;
var threadDelete;
var threadReport;


module.exports = {
  saveThread: async function(board, text, dpass) {
    var Thread = await schema.useThreadSchema(board);
    newThread = new Thread({
      text: text,
      created_on: new Date,
      bumped_on: new Date,
      reported: false,
      delete_password: dpass,
      replies: []
    });

    console.log('new Thread made');

    const results = await newThread.save(function(err, result) {
      if (err) {
        console.error(err);
        return;
      }
    });
    return results;
  },

  getTenThreads: async function(board) {
    var Thread = await schema.useThreadSchema(board);
    threadList = await Thread.find()
                 .limit(10)
                 .sort('-bumped_on')
                 .select('-reported -delete_password -replies.reported -replies.delete_password');
    for (let thread in threadList) {
      threadList[thread].replies = threadList[thread].replies.reverse().slice(0,3);
    }
    return threadList;
  },

  getReplies: async function(board, thread_id) {
    var Thread = await schema.useThreadSchema(board);
    oneThread  = await Thread.findOne({_id: thread_id})
                             .select('-reported -delete_password -replies.reported -replies.delete_password');
    return oneThread;
  },

  repThread: async function(board, thread_id) {
    var Thread = await schema.useThreadSchema(board);
    threadReport = await Thread.findOneAndUpdate({_id: thread_id}, {reported: true});
    return threadReport;
  },

  delThread: async function(board, thread_id, dpass) {
    var Thread = await schema.useThreadSchema(board);
    threadDelete = await Thread.findOneAndDelete({_id: thread_id, delete_password: dpass});
    if (threadDelete === null) {
      return 'not deleted';
    }
    else {
      return threadDelete;
    }
  }

}
