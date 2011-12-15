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

/*******************
*   GET : INDEX    *
*******************/
app.get('/', function(req, res){
  if(!req.cookies.rememberme){
	res.render('index',{
	  layout: 'layoutFront',
	  title: "cubi'z"
	});
  }else{
    res.render('index', {
      layout: 'layoutFront_co',
      title: "cubi'z"
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
	  title: "fonctionnement"
	});
  }else{
    res.render('fonctionnement', {
      layout: 'layoutFront_co',
      title: "fonctionnement"
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
	  title: "produits"
	});
  }else{
    res.render('produits', {
      layout: 'layoutFront_co',
      title: "produits"
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
	  title: "contact"
	});
  }else{
    res.render('contact', {
      layout: 'layoutFront_co',
      title: "contact"
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
	  title: "faq"
	});
  }else{
    res.render('faq', {
      layout: 'layoutFront_co',
      title: "faq"
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
	  title: "mentions"
	});
  }else{
    res.render('mentions', {
      layout: 'layoutFront_co',
      title: "mentions"
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
	  title: "plandusite"
	});
  }else{
    res.render('plandusite', {
      layout: 'layoutFront_co',
      title: "plandusite"
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
	title: 'admin',
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
  res.render('addUser',{
	layout: 'layoutFront',
	title: 'addUser'
  });
	}else{
  	  res.render('addUser',{
		layout: 'layoutFront',
		title: 'addUser'
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
app.post('/rfid', function(req, res){
  rfid = req.param('rfid');
  Cubes.findOne({rfid:a},function(err,cube){
	if (err) console.log('mongo: ', err);
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
  console.log('Mes_actualites');
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
	  //On affiche la page
	  res.render('mescubz',{
		title: "Mes cub'Z",
		cubes: user.cubes
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