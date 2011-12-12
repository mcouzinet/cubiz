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
  rfid		: Number,
  couleur	: String,
  twitter   : Boolean,
  sms		: Boolean,
  email		: Boolean,
  contenu   : String
});

var message = new Schema({
  texte  	: String,
  cube		: Number,
  date      : Date
});

var socle = new Schema({
  id    	: Number,
  Cubes		: [cube]
});

var user = new Schema({
  nom    	: String,
  prenom    : String,
  cubes     : [cube],
  mail      : String,
  tel		: Number,
  twitter	: String,
  facebook  : String,
  mdp		: String,
  Timeline  : [message]
});

var Socles = mongoose.model('socle', socle),
	Messages = mongoose.model('message', message),
	Cubes = mongoose.model('cube', cube),
	Users = mongoose.model('user', user);
mongoose.connect('mongodb://92.243.19.190/baby');

/**
 *  Modules
 */

var express = require('express'),
    _ = require('underscore'),
	nodemailer = require('nodemailer'),
    path = require('path'),
    url = require('url'),
    https = require('https'),
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

nodemailer.SMTP = {
  host: 'smtp.gmail.com',
  port: 465,
  ssl: true,
  use_authentication: true,
  user: 'lescubz@gmail.com',
  pass: 'equipe04'
}

/**
 *  Routes
 */

app.get('/', function(req, res){
  res.render('index', {
    title: "cubi'z"
  });
});

//Permet la création en base de donnée des lots de cubes.
app.post('/admin', function(req, res){
  var cube1 = new Cubes({
	rfid : req.param('rfid1'),
	couleur : 'bleu',
    twitter : true,
    sms		: false,
    email	: true,
	contenu : 'La phrase de votre premier cube'});
  var cube2 = new Cubes({
	rfid : req.param('rfid2'),
	couleur : 'vert',
    twitter : true,
    sms		: false,
    email	: true,
	contenu : 'La phrase de votre second cube'});
  var cube3 = new Cubes({
	rfid : req.param('rfid3'),
	couleur : 'rouge',
    twitter : true,
    sms		: false,
    email	: true,
	contenu : 'La phrase de votre troisième cube'});
  var cube4 = new Cubes({
	rfid : req.param('rfid4'),
	couleur : 'violet',
    twitter : true,
    sms		: false,
    email	: true,
	contenu : 'La phrase de votre quatrième cube'});
  var cube5 = new Cubes({
	rfid : req.param('rfid5'),
	couleur : 'orange',
    twitter : true,
    sms		: false,
    email	: true,
	contenu : 'La phrase de votre cinquième cube'});
  cube1.save(function (err){ if (err) console.log('mongo: ', err); });
  cube2.save(function (err){ if (err) console.log('mongo: ', err); });
  cube3.save(function (err){ if (err) console.log('mongo: ', err); });
  cube4.save(function (err){ if (err) console.log('mongo: ', err); });
  cube5.save(function (err){ if (err) console.log('mongo: ', err); });
  var cubes = new Array(cube1,cube2, cube3, cube4, cube5);
  var socle = new Socles({id : req.param('idSocle'),Cubes : cubes});
  socle.save(function (err) { if (err) console.log('mongo: ', err); });
  res.render('admin',{
	title: 'admin'
  });
})

app.get('/admin', function(req, res){
  res.render('admin',{
	title: 'admin',
  });
});

app.post('/addUser', function(req, res){
  Socles.findOne({id:req.param('idsocle')},function(err,socle){
	if (err) console.log('login: ', err); 
    var user = new Users({ 
      nom    	  : req.param('nom'),
      prenom      : req.param('prenom'),
	  cubes       : socle.Cubes,
	  mail        : req.param('mail'),
	  tel		  : req.param('tel'),
	  twitter	  : req.param('twitter'),
	  facebook    : req.param('facebook'),
	  mdp		  : req.param('password'),
	  Timeline    : new Array()
  });
  user.save(function (err) { if (err) console.log('mongo: ', err); });
  });
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
	  res.cookie('rememberme', 'yes', { expires: new Date(Date.now() + 900000), httpOnly: true });
	  res.render('login',{title: 'login'});
	  console.log('user: ', user.idsocle);
	}else{
	  console.log('mauvais pass');
	  res.render('login',{title: 'login'});
	}
  });

});

app.post('/rfid', function(req, res){
  rfid = req.param('rfid');
  console.log('rfid');
});

app.get('/rfid', function(req, res){
  var a = 3333;
  Cubes.findOne({rfid:a},function(err,cube){
	if (err) console.log('mongo: ', err);
	console.log(cube);
	Users.findOne({'cubes._id':cube._id},function(err,user){
	  if (err) console.log('mongo: ', err);
	  var message = new Messages({
	    texte   : cube.contenu,
	    cube	: Number,
	    date    : new Date(Date.now())
	  });
	  message.save(function (err) { if (err) console.log('mongo: ', err); });
	  user.Timeline.push(message);
	  user.save(function (err) { if (err) console.log('mongo: ', err); });
	  if(cube.twitter){
		/*
		  CODE POUR TWITTER :(
		*/
	  };
	  if(cube.email){
		mail_data = {
			sender: 'mcouzinet@gmail.com',
		    to:user.mail,
		    subject:'Cubiz : Un nouveau message de votre enfant !',
			body:cube.contenu
		}
		nodemailer.send_mail(mail_data, function(error, success){
	        console.log('Email ' + success ? 'sent' : 'failed');
	    });
	  };
	  if(false/*cube.sms*/){
		mail_data = {
			sender: 'mcouzinet@gmail.com',
		    to:'sms@smsbox.fr',
		    subject:'login=mcouzinet&pass=iec560&dest='+user.tel+'&origine=Cubiz&mode=Expert&notif=0',
			body:cube.contenu
		}
		nodemailer.send_mail(mail_data, function(error, success){
	        console.log('SMS ' + success ? 'sms-sent' : 'sms-failed');
	    });		
	  };
	});
  });
  res.render('index',{
	title: 'index'
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

