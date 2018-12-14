'use strict'

var mongoose       = require('mongoose');
var Schema         = mongoose.Schema;

var replySchema  = new Schema({
  text            : {type: String , required: true},
  created_on      : {type: Date   , required: true},
  reported        : {type: Boolean, required: true},
  delete_password : {type: String , minlength: 8, maxlength: 20, required: true}
})


var threadSchema = new Schema({
  text            : {type: String , required: true},
  created_on      : {type: Date   , required: true},
  bumped_on       : {type: Date   , required: true},
  reported        : {type: Boolean, required: true},
  replies         : {type: [replySchema]},
  delete_password : {type: String , minlength: 8, maxlength: 20, required: true}
});

module.exports = {
  useThreadSchema: function(collection) {
    console.log('schema used')
    return mongoose.model('Thread', threadSchema, collection);
  },

  useReplySchema: function() {
    return mongoose.model('Reply', replySchema);
  }
}
