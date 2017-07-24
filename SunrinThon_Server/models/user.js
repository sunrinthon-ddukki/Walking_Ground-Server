var express = require('express');
var app = express();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    id: String,
    password: String,
    summary: {
         step: Number,
         win: Number,
         win_streak: Number,
         max_step: Number
    },
    daily_mission: {
         goal: Number,
         isClear: Boolean
    }
}, { collection: 'users' });

module.exports = mongoose.model('user', userSchema);
