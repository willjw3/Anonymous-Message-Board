'use strict';

//require('dotenv').config();
//var expect = require('chai').expect;
var mongoose        = require('mongoose');
const CONNECTION_STRING = process.env.DB;


mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true });
var db = mongoose.connection;
module.exports = db;
