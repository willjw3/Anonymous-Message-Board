
'use strict'

const thread     = require('../models/thread');




module.exports = {
  postThread: function(req) {
    var board = req.body.board;
    var text  = req.body.text;
    var dpass = req.body.delete_password;

    if (!text || !dpass) {
      throw 'Must fill in both text and password to delete.'
    }
    const posted = thread.saveThread(board, text, dpass);
    if (!posted) {
      throw 'Thread not saved. Try again.'
    }
    return 'Thread saved and posted.'
  },

  getRecentThreads: function(req) {
    var recentThreads = thread.getTenThreads(req.params.board);
    if (recentThreads.length === 0) {
      throw 'No threads on the '+board+' board'
    }
    return recentThreads;
  },

  getThreadReplies: async function(req) {
    var board     = req.params.board;
    var thread_id = req.query.thread_id;
    var threadReplies = await thread.getReplies(board, thread_id);
    if (threadReplies.length === 0) {
      throw 'No replies to this thread';
    }
    if (!threadReplies) {
      throw 'Thread not found. Check thread id and try again'
    }
    return threadReplies;
  },

  reportThread: function(req) {
    var board     = req.body.board;
    var thread_id = req.body.thread_id;
    var threadReported = thread.repThread(board, thread_id);
    if (!threadReported) {
      throw 'request failed'
    }
    return 'success'
  },

  deleteThread: async function(req) {
    var board     = req.body.board;
    var thread_id = req.body.thread_id;
    var dpass     = req.body.delete_password;
    var threadGone = await thread.delThread(board, thread_id, dpass);
    if (threadGone === 'not deleted') {
      return "Not Deleted. Check thread id and password"
    }
    if (typeof threadGone === 'object') {
      return 'success'
    }
  }
}
