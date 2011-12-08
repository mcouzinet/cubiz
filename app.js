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
  id     	: Number,
  rfid		: Number,
  titre     : String,
  contenu   : String
});

var message = new Schema({
  texte  	: String,
  idsocle	: Number,
  date      : Date
});

var user = new Schema({
  nom    	: String,
  prenom    : String,
  idsocle   : Number,
  mail      : String,
  tel		: Number,
  twitter	: String,
  facebook  : String,
  Timeline  : [message]
});

var socle = new Schema({
  id    	: Number,
  Cubes		: [cube]
});

var Socles = mongoose.model('socle', socle);
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

app.get('/admin', function(req, res){
  res.render('admin');
})

app.post('/addUser', function(req, res){
  for(var i=0;i<5;i++){
	var cube = new Cubes({
	  id     	: Number,
	  titre     : String,
	  contenu   : String
	});
  }
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
