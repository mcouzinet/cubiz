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

var socle = new Schema({
  id    	: Number,
  Cubes		: [cube]
});

var user = new Schema({
  nom    	: String,
  prenom    : String,
  idsocle   : [socle],
  mail      : String,
  tel		: Number,
  twitter	: String,
  facebook  : String,
  mdp		: String,
  Timeline  : [message]
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

app.post('/admin', function(req, res){
  var cube1 = new Cubes({id : req.param('Cube1'),rfid : req.param('rfid1'),titre : 'Votre Premier Cube',contenu : 'La phrase de votre premier cube'});
  var cube2 = new Cubes({id : req.param('Cube2'),rfid : req.param('rfid2'),titre : 'Votre second Cube',contenu : 'La phrase de votre second cube'});
  var cube3 = new Cubes({id : req.param('Cube3'),rfid : req.param('rfid3'),titre : 'Votre troisième Cube',contenu : 'La phrase de votre troisième cube'});
  var cube4 = new Cubes({id : req.param('Cube4'),rfid : req.param('rfid4'),titre : 'Votre quatrième Cube',contenu : 'La phrase de votre quatrième cube'});
  var cube5 = new Cubes({id : req.param('Cube5'),rfid : req.param('rfid5'),titre : 'Votre cinquième Cube',contenu : 'La phrase de votre cinquième cube'});
  cube1.save(function (err) { if (err) console.log('mongo: ', err); });
  cube2.save(function (err) { if (err) console.log('mongo: ', err); });
  cube3.save(function (err) { if (err) console.log('mongo: ', err); });
  cube4.save(function (err) { if (err) console.log('mongo: ', err); });
  cube5.save(function (err) { if (err) console.log('mongo: ', err); });
  var cubes = new Array(cube1,cube2, cube3, cube4, cube5);
  var socle = new Socles({id : req.param('idSocle'),Cubes : cubes});
  socle.save(function (err) { if (err) console.log('mongo: ', err); });
  res.render('admin',{
	title: 'admin'
  });
})

app.get('/admin', function(req, res){
  res.render('admin',{
	title: 'admin'
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
	mdp		    : req.param('password'),
	Timeline    : new Array()
  });
  user.save(function (err) { if (err) console.log('mongo: ', err); });
  res.render('addUser',{
	title: 'addUser'
  });
});

app.get('/addUser', function(req, res){
  res.render('addUser',{
	title: 'addUser'
  });
});

app.post('/login', function(req, res){
  Users.findOne({mdp:req.param('mdp'),mail:req.param('mail')},function(err,user){
	if (err) console.log('login: ', err);
	if (user) {
	  console.log('user: ', user.idsocle);
	}else{
	  console.log('mauvais pass');
	}
  });

});

app.get('/login', function(req, res){
  res.render('login',{
	title: 'login'
  });
});

/**
 *  Start
 */

app.listen(3000);
