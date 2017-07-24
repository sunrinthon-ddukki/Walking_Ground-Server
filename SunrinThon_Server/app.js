var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var routeIndex = require('./routes/index');
var routeUser = require('./routes/user');

app.set('port', process.env.PORT || 80);

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("Connected to MongoDB");
});
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Sunrin-thonDB', { useMongoClient: true });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routeIndex);
app.use('/user', routeUser);

app.listen(app.get('port'), function(){
     console.log('Sunrin-thon Server Running on ' + app.get('port'));
});

module.exports = app;
