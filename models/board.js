'use strict'

var db         = require('./DB')
var mongoose   = require('mongoose');

var boardNames;
var sendNames;




db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected, yo!');

  db.db.listCollections().toArray(function(err, names) {
    boardNames = names;
  });
});




module.exports = {
  getBoards: function() {
    let sendNames = boardNames.map((name) => {
      return name.name;
    });
    return sendNames;
  },
  getOneBoard: function(myBoard) {
    let theBoards = boardNames.map((name) => {
      return name.name;
    });
    if(!theBoards.includes(myBoard)) {
      return 'No board with that name exists.';
    }
    else {
      return 'Welcome to the '+myBoard+' board!'
    }
  }
};
