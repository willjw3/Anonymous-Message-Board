'use strict'

const reply     = require('../models/reply');




module.exports = {
  postReply: function(req) {
    var thread_id = req.body.thread_id;
    var board     = req.body.board;
    var text      = req.body.text;
    var dpass     = req.body.delete_password;

    if (!text || !dpass || !thread_id) {
      throw 'Must fill in thread id, text and password to delete.'
    }
    const posted = reply.saveReply(thread_id, board, text, dpass);
    if (!posted) {
      throw 'Reply not saved. Try again.'
    }
    return 'Reply saved and posted.'
  },

  reportReply: function(req) {
    var thread_id = req.body.thread_id;
    var board     = req.body.board;
    var reply_id  = req.body.reply_id;
    var replyReported = reply.repReply(thread_id, board, reply_id);
    if (!replyReported) {
      throw 'request failed'
    }
    return 'success'
  },

  deleteReply: async function(req) {
    var thread_id = req.body.thread_id;
    var board     = req.body.board;
    var reply_id  = req.body.reply_id;
    var dpass     = req.body.delete_password;
    var replyGone = await reply.delReply(thread_id, board, reply_id, dpass);
    if (replyGone === 'not deleted') {
      return "Not Deleted. Check thread id and password"
    }
    if (typeof replyGone === 'object') {
      return 'success';
    }
  }
}
