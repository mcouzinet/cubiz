/*
 * Application Node.js / Baby-mother-connect
 * Author : @mcouzinet / mcouzinet@gmail.com
 */

/*
 *  MongoDB
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cube = new Schema({
    id  	  : Number,
    titre     : String,
    contenu   : String
});

var message = new Schema({
    texte  	  : String,
    date      : Date
});

var user = new Schema({
    nom    		: String,
    prenom      : String,
	idsocle     : Number,
	mail        : String,
	tel		    : Number,
	twitter		: String,
	facebook    : String,
	Timeline    : [message],
	Cubes		: [cube]
});

var Messages = mongoose.model('message', message);
var Cubes = mongoose.model('cube', cube);
var Users = mongoose.model('user', user);
mongoose.connect('mongodb://92.243.19.190/baby');


/**
 *  Modules
 */

var express = require('express'),
    _ = require('underscore'),
    path = require('path'),
    url = require('url'),
	app = module.exports = express.createServer(),
    io = require('socket.io').listen(app);

// Configuration
app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/public'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(app.router);
  app.use(express.session({ secret: 'secretKey' }));
});


/**
 *  Routes
 */

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.get('/addUser', function(req, res){
  res.render('addUser',{
	title: 'addUser'
  });
});

app.post('/addUser', function(req, res){
var user = new Users({ 
    nom    		: req.param('nom'),
    prenom      : req.param('prenom'),
	idsocle     : req.param('idsocle'),
	mail        : req.param('mail'),
	tel		    : req.param('tel'),
	twitter		: req.param('twitter'),
	facebook    : req.param('facebook'),
	Timeline    : new Array(),
	Cubes		: new Array(),
});
user.save(function (err) { if (err) console.log('mongo: ', err); });
  res.render('addUser',{
	title: 'addUser'
  });
});

/**
 *  Start
 */

app.listen(3000);
