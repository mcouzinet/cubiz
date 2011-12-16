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
  rfid		: String, 	//Tag RFID du cube
  couleur	: String,	//Couleur du cube
  twitter   : Boolean,	//Twitter valid ou non
  sms		: Boolean,	//Sms valid ou non
  email		: Boolean,	//Email valid ou non
  contenu   : String	//Contenu du message
});

var message = new Schema({
  iduser	: String,	//_id de l'user
  texte  	: String,	//texte du message
  couleur	: String,	//couleur du cube d'envoie
  date      : Date,		//date de publication
  twitter   : Boolean,	//Envoié aussi via twitter
  sms		: Boolean,	//Envoié aussi par sms
  email		: Boolean,	//Envoié aussi par email
});

var socle = new Schema({
  id    	: Number,	//Numéro de lot
  Cubes		: [cube]	//Cube lié au socles
});

var user = new Schema({
  nom    	: String,	//Nom
  prenom    : String,	//prénom
  cubes     : [cube],	//Tous les cubes que la personne
  mail      : String,	//le mail
  tel		: Number,	//le tél
  twitter	: String,	//le twitter
  facebook  : String,	//le facebook
  mdp		: String,	//le mdp
  Timeline  : [message]	//Messages de l'utilisateur
});

//Création des modèles et connection 
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

/****************
*   SOCKET.IO   *
****************/
io.sockets.on('connection', function (socket) {
  socket.on('save_cube', function (data) {
	Cubes.findOne({_id:data.idcube},function(err,cube){
      if(cube){
        cube.contenu = data.contenu;
        cube.twitter = data.twitter;
        cube.email = data.mail;
        cube.sms = data.sms;
        cube.save(function (err) {if (err) console.log('mongo: ', err); });
	  };
	});
	Users.findOne({_id:data.user},function(err,user){
		if (err) console.log('login: ', err);
		if (user) {	 
   			for(var i=0;i<user.cubes.length;i++){
				console.log(user.cubes[i]._id);
			  if(user.cubes[i]._id == data.idcube){
				user.cubes[i].contenu = data.contenu;
		        user.cubes[i].twitter = data.twitter;
		        user.cubes[i].email = data.mail;
		        user.cubes[i].sms = data.sms;
				user.save(function (err) {if (err) console.log('mongo: ', err); });
			  };
			};
		};
	});
  });

socket.on('save_user', function (data) {
	console.log(data);
	Users.findOne({_id:data.user},function(err,user){
		if (err) console.log('login: ', err);
		if (user) {	 
			user.nom = data.nom;
		    user.prenom = data.prenom;
		    user.mail = data.mail;
		    user.tel = data.sms;
			user.mdp = data.mdp;
			user.twitter = data.twitter;
			user.save(function (err) {if (err) console.log('mongo: ', err); });
		};
	  });
  });
	// End of socket
});

/*******************
*   GET : INDEX    *
*******************/
app.get('/', function(req, res){
  if(!req.cookies.rememberme){
	res.render('index',{
	  layout: 'layoutFront',
	  title: "Restez connectée avec vos enfants"
	});
  }else{
    res.render('index', {
      layout: 'layoutFront_co',
      title: "Restez connectée avec vos enfants"
    });
  };
});

/****************************
*   GET : FONCTIONNEMENT    *
****************************/
app.get('/fonctionnement', function(req, res){
  if(!req.cookies.rememberme){
	res.render('fonctionnement',{
	  layout: 'layoutFront',
	  title: "Fonctionnement"
	});
  }else{
    res.render('fonctionnement', {
      layout: 'layoutFront_co',
      title: "Fonctionnement"
    });
  };
});

/**********************
*   GET : PRODUITS    *
**********************/
app.get('/produits', function(req, res){
  if(!req.cookies.rememberme){
	res.render('produits',{
	  layout: 'layoutFront',
	  title: "Produits"
	});
  }else{
    res.render('produits', {
      layout: 'layoutFront_co',
      title: "Produits"
    });
  };
});

/********************
*   GET : CONTACT   *
********************/
app.get('/contact', function(req, res){
  if(!req.cookies.rememberme){
	res.render('contact',{
	  layout: 'layoutFront',
	  title: "Contact"
	});
  }else{
    res.render('contact', {
      layout: 'layoutFront_co',
      title: "Contact"
    });
  };
});

/*****************
*   GET : FAQ    *
*****************/
app.get('/faq', function(req, res){
  if(!req.cookies.rememberme){
	res.render('faq',{
	  layout: 'layoutFront',
	  title: "Faq"
	});
  }else{
    res.render('faq', {
      layout: 'layoutFront_co',
      title: "Faq"
    });
  };
});

/**********************
*   GET : MENTIONS    *
**********************/
app.get('/mentions', function(req, res){
  if(!req.cookies.rememberme){
	res.render('mentions',{
	  layout: 'layoutFront',
	  title: "Mentions"
	});
  }else{
    res.render('mentions', {
      layout: 'layoutFront_co',
      title: "Mentions"
    });
  };
});


/**********************
*   GET : MENTIONS    *
**********************/
app.get('/plandusite', function(req, res){
  if(!req.cookies.rememberme){
	res.render('plandusite',{
	  layout: 'layoutFront',
	  title: "Plandusite"
	});
  }else{
    res.render('plandusite', {
      layout: 'layoutFront_co',
      title: "Plandusite"
    });
  };
});

/********************
*   POST : ADMIN    *
********************/
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
});

/*******************
*   GET : ADMIN    *
*******************/
// Permet l'affichage d'ajout de socle
app.get('/admin', function(req, res){
  res.render('admin',{
	title: 'Admin',
  });
});

/*********************
*   POST : Adduser   *
*********************/
// Page de création de compte
app.post('/addUser', function(req, res){
  Socles.findOne({id:req.param('idsocle')},function(err,socle){
	if (err) console.log('login: ', err); 
	if(socle){
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
  res.cookie('rememberme', user.mail, { expires: new Date(Date.now() + 9000000), httpOnly: true });
  console.log('nouveau utilisateur');
  res.redirect('/');
	}else{
  	  res.render('addUser',{
		layout: 'layoutFront',
		title: 'AddUser'
	  });
	};
  });

});

/********************
*   GET : Adduser   *
********************/
app.get('/addUser', function(req, res){
  res.render('addUser',{
	layout: 'layoutFront',
	title: 'addUser'
  });
});

/*************************
*   GET : Deconnexion    *
*************************/
app.get('/deconnexion', function(req, res){
  if(!req.cookies.rememberme){
	res.render('index',{
	  layout: 'layoutFront',
	  title: "Accueil"
	});
  }else{
	res.clearCookie('rememberme');
    res.render('index', {
      layout: 'layoutFront',
      title: "Accueil"
    });
  };
});

/************************
*   POST : Connection   *
************************/
app.post('/connection', function(req, res){
  Users.findOne({mdp:req.param('mdp'),mail:req.param('mail')},function(err,user){
	if (err) console.log('login: ', err);
	if (user) {
	  res.cookie('rememberme', req.param('mail'), { expires: new Date(Date.now() + 9000000), httpOnly: true });
	  res.redirect('/Mes_actualites');
	}else{
	  console.log('mauvais pass');
	  res.render('connexion',{
	    layout: 'layoutFront',
	    title: "Accueil"
	  });
	}
  });
});

/***********************
*   GET : Connexion    *
***********************/
app.get('/connexion', function(req, res){
  if(!req.cookies.rememberme){
	res.render('connexion',{
	  layout: 'layoutFront',
	  title: "Accueil"
	});
  }else{
     res.redirect('/Mes_actualites');
  };
});

/******************
*   POST : RFID   *
******************/
app.get('/rfid', function(req, res){
  rfid = req.param('rfid');
  console.log(rfid);
  Cubes.findOne({rfid:rfid},function(err,cube){
	if (err) console.log('mongo: ', err);
	console.log('cubes trouver');
	Users.findOne({'cubes._id':cube._id},function(err,user){
	  if (err) console.log('mongo: ', err);
		if(user){
	  	  var message = new Messages({
			iduser	: user._id,
	    	texte   : cube.contenu,
	    	couleur	: cube.couleur,
	    	date    : new Date(Date.now()),
	  		twitter : cube.twitter,
	  		sms		: cube.sms,
	  		email	: cube.email
	  	  });
	  	  message.save(function (err) { if (err) console.log('mongo: ', err); });
	  	  user.Timeline.push(message);
	  	  user.save(function (err) { if (err) console.log('mongo: ', err); });
	  	}
	  socket.emit('message', { 
		cube: cube 
	  });
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
			html:
			'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><head><meta charset="utf-8"></head>'+
			'<body><table cellpadding="0" cellspacing="0"><tr><td><img src="http://florian.jude.free.fr/hetic/1.jpg" height="38px" width="57px" style="display:block; "/></td>'+
			'<td><img height="38px" width="490px" src="http://florian.jude.free.fr/hetic/2.jpg" style="display:block;"/></td><td>'+
			'<img height="38px" width="59px" src="http://florian.jude.free.fr/hetic/3.jpg" style="display:block;"/></td></tr><tr>'+
			'<td><img src="http://florian.jude.free.fr/hetic/4.jpg" height="160px" width="57px" style="display:block;"/></td>'+
			'<td valign="middle" height="160px" width="490px" style="background-color: #f3e3e6;"><table cellpadding="0" cellspacing="0"><tr><td>'+
			'<img src="http://florian.jude.free.fr/hetic/logo.png" alt="logo cubiz" title="logo cubiz" /></td><td>'+
			'<h1 style="font-family: Verdana; font-size: 24px; color: #fa6176; margin-left: 20px;">Nouveau message</h1>'+
			'<span style="font-family: Verdana; font-size: 14px; margin-left: 20px;">'+cube.contenu+'</span>'+
			'</td></tr></table></td><td><img src="http://florian.jude.free.fr/hetic/5.jpg" height="160px" width="59px" style="display:block;"/></td>'+
			'</tr><tr><td><img src="http://florian.jude.free.fr/hetic/6.jpg" height="57px" width="57px" style="display:block"/></td>'+
			'<td><img src="http://florian.jude.free.fr/hetic/7.jpg" height="57px" width="490px" style="display:block"/></td>'+
			'<td><img src="http://florian.jude.free.fr/hetic/8.jpg" height="57px" width="59px" style="display:block"/></td></tr></table></body></html>'
		}
		nodemailer.send_mail(mail_data, function(error, success){
	        console.log('Email ' + success ? 'sent' : 'failed');
	    });
	  };
	  if(cube.sms){
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

/****************************
*   POST : Mes actualités   *
****************************/
app.get('/Mes_actualites', function(req, res){
  console.log('Mes_actualittes');
  // Si il n'y à pas de cookie -> RETOUR ACCUEIL
  if(!req.cookies.rememberme){
	  res.render('index',{
		layout: 'layoutFront',
		title: 'index'
	  });
  }else{
  var TabMes = new Array();
  // On vérfie que le cookie correspond à la personne loger
  Users.findOne({mail:req.cookies.rememberme},function(err,user){
	if (err) console.log('login: ', err);
	if (user) {
	  // On rafraichit le cookies
	  res.cookie('rememberme', user.mail, { expires: new Date(Date.now() + 9000000), httpOnly: true });
	  // On Cherches les messages de l'utilisateur
   	  Messages.find({iduser:user._id}).limit(10).desc("date").run(function(err, mes) {		
		if (err) console.log('login: ', err);
		if(mes){
			for(var i=0;i<mes.length;i++){
				var message = new Object();
				message.date = mes[i].date.getDate();
				switch(mes[i].date.getDay()){
					case 0:message.jour = 'Dimanche';break;
					case 1:message.jour = 'Lundi';break;
					case 2:message.jour = 'Mardi';break;
					case 3:message.jour = 'Mercredi';break;
					case 4:message.jour = 'Jeudi';break;
					case 5:message.jour = 'Vendredi';break;
					case 6:message.jour = 'Samedi';break;
				};//end switch
				switch(mes[i].date.getMonth()){
					case 0:message.mois = 'Janvier';break;
					case 1:message.mois = 'Février';break;
					case 2:message.mois = 'Mars';break;
					case 3:message.mois = 'Avril';break;
					case 4:message.mois = 'Mai';break;
					case 5:message.mois = 'Juin';break;
					case 6:message.mois = 'Juillet';break;
					case 7:message.mois = 'Aout';break;
					case 8:message.mois = 'Septembre';break;
					case 9:message.mois = 'Octobre';break;
					case 10:message.mois = 'Novembre';break;
					case 11:message.mois = 'Décembre';break;
				};//end switch
				message.heures = mes[i].date.getHours();
				message.minutes = (mes[i].date.getMinutes()<10)?'0'+mes[i].date.getMinutes():mes[i].date.getMinutes();
				message.message = mes[i].texte;
				message.twitter = mes[i].twitter?'cercle-social-afficher':'cercle-social-masquer';
				message.sms = mes[i].sms?'cercle-social-afficher':'cercle-social-masquer';
				message.mail = mes[i].email?'cercle-social-afficher':'cercle-social-masquer';				
				message.couleur = mes[i].couleur;	
		 		TabMes.push(message);	
			};//end for
			res.render('mesactus',{
		      title: 'Mes actualités',
			  prenom: user.prenom,
			  messages: TabMes
		    });
		}else{
			res.render('mesactusVide',{
		      title: 'Mes actualités',
			  prenom: user.prenom,
			  messages: TabMes
		    });
		}
  	  });//end find messages
	}else{
	  // Le cookie ne corespond pas à un utilisateurs -> RETOUR ACCUEIL
	    res.redirect('/');
	};//end if user
  });//end fin user
  };
});

/**********************
*   POST : Mes cubZ   *
**********************/
app.get('/Mes_cubz', function(req, res){
  // Si il n'y à pas de cookie -> RETOUR ACCUEIL
  if(!req.cookies.rememberme){
	console.log('pas de cookies');
	res.render('index',{
	  layout: 'layoutFront',
	  title: 'index'
	});//end of render
  };//end of if
  // On vérfie que le cookie correspond à la personne loger
  Users.findOne({mail:req.cookies.rememberme},function(err,user){
	if (err) console.log('login: ', err);
	if (user) {
	  // On rafraichit le cookies
	  res.cookie('rememberme', user.mail, { expires: new Date(Date.now() + 9000000), httpOnly: true });
	  var tabCubes = new Array();
	  for(var i=0;i<user.cubes.length;i++){
		cube = new Object();
		cube.contenu =  user.cubes[i].contenu;
		cube.mail = user.cubes[i].email?'cercle-social-afficher':'cercle-social-masquer';
		cube.sms = user.cubes[i].sms?'cercle-social-afficher':'cercle-social-masquer';
		cube.twitter = user.cubes[i].twitter?'cercle-social-afficher':'cercle-social-masquer';
		cube.couleur = user.cubes[i].couleur;
		cube.rfid = user.cubes[i].rfid;
		cube._id = user.cubes[i]._id;
		cube.user = user._id;
		tabCubes.push(cube);
	  }
	  //On affiche la page
	  res.render('mescubz',{
		title: "Mes cub'Z",
		cubes: tabCubes
  	  });
	};
  });
});

/******************************
*   POST : Mes informations   *
******************************/
app.get('/Mes_infos', function(req, res){
 // Si il n'y à pas de cookie -> RETOUR ACCUEIL
  if(!req.cookies.rememberme){
	console.log('pas de cookies');
	res.render('index',{
	  layout: 'layoutFront',
	  title: 'index'
	});//end of render
  };//end of if
  // On vérfie que le cookie correspond à la personne loger
  Users.findOne({mail:req.cookies.rememberme},function(err,user){
	if (err) console.log('login: ', err);
	if (user) {
	  // On rafraichit le cookies
	  res.cookie('rememberme', user.mail, { expires: new Date(Date.now() + 9000000), httpOnly: true });
	  //On affiche la page
	  res.render('mesinfos',{
		title: 'Mes informations',
		user: user
	  });
	};
  });
});

/***********
*   Start  *
***********/
app.listen(3000);