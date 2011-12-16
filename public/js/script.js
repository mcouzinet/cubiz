/* Author:
	name: Mickael Couzinet
	twitter: @mcouzinet
*/
$(function charge(){
	/*************
	* Socket.IO  *
	*************/
	var content,a=true,media=false;
	var socket = io.connect('http://www.cubiz.fr:3000');
	//var socket = io.connect('http://localhost:3000/');
	
	/* MODIFICATION D'UN CUBZ */
	overlay = $('.overlay');
	
	$('.boitecube').click(function (){
		if(a){
			console.log('clickboite');
			$this = $(this);
			a = false;
			media = true;
			$this.parent().css({'z-index':'51'});
			$this.parent().find('.bts').show();
			mes = $this.find('p').contents();
		    content = mes[0].data;
			mes.replaceWith('<textarea name="demande" rows="4" cols="40" value="">'+content+'</textarea>');
			overlay.show();
		}
	});
	
	$('.Bt_retour').click(function(){
		a=true;
		media = false;
		$this = $(this);
		boite = $(this).parent().parent();
		boite.find('.bts').hide();
		mes = boite.find('p').contents();
		mes.replaceWith(content);
		boite.css({'z-index':'5'});
		overlay.hide();
	});
	
	$('.Bt_valid').click(function(){
		a=true;
		media = false;
		$this = $(this);
		boite = $this.parent().parent();
		boite.find('.bts').hide();
		mes = boite.find('p').contents();
		content = boite.find('textarea').attr('value');
		boite.find('p').contents().replaceWith(content);
		boite.css({'z-index':'5'});
		overlay.hide();
		twitter = boite.find(".twitter").hasClass('cercle-social-afficher')?true:false;
		sms = boite.find(".sms").hasClass('cercle-social-afficher')?true:false;
		mail = boite.find(".mail").hasClass('cercle-social-afficher')?true:false;
		socket.emit('save_cube', {
			user:boite.find('.bts').attr('id'),
			idcube:boite.find('.boitecube').attr('id'),
			contenu:content,
			twitter:twitter,
			sms:sms,
			mail:mail
		});
	});
	
	$('.twitter').click(function(){
		if(media){
			$this = $(this);
			$this.hasClass('cercle-social-afficher')?$this.removeClass('cercle-social-afficher').addClass('cercle-social-masquer'):$this.addClass('cercle-social-afficher').removeClass('cercle-social-masquer');
		}
	});
	$('.sms').click(function(){
		if(media){
			$this = $(this);
			$this.hasClass('cercle-social-afficher')?$this.removeClass('cercle-social-afficher').addClass('cercle-social-masquer'):$this.addClass('cercle-social-afficher').removeClass('cercle-social-masquer');
		}
	});
	$('.mail').click(function(){
		if(media){
			$this = $(this);
			$this.hasClass('cercle-social-afficher')?$this.removeClass('cercle-social-afficher').addClass('cercle-social-masquer'):$this.addClass('cercle-social-afficher').removeClass('cercle-social-masquer');
		}
	});
	
	/* MODIFICATION D'UN USER */
	$('.validinfo').click(function(){
		$this = $(this);
		boite = $this.parent();
		console.log(boite);
		socket.emit('save_user', {
			prenom:boite.find('.prenom').attr('value'),
			nom:boite.find('.nom').attr('value'),
			twitter:boite.find('.twit').attr('value'),
			sms:boite.find('.tel').attr('value'),
			mdp:boite.find('.mdp').attr('value'),
			mail:boite.find('.email').attr('value'),
			user:$this.attr('id')
		});
		return false;
	});
	
	/* LIVE ACTU*/
	socket.on('message', function (data) {
		twit = data.twitter?'cercle-social-afficher':'cercle-social-masquer';
		sms = data.sms?'cercle-social-afficher':'cercle-social-masquer';
		mail = data.email?'cercle-social-afficher':'cercle-social-masquer';
		$('#actu').prepend('<div class="box-actu clearfix">'+
			'<span class="cube-actu '+data.couleur+'"></span>'+
			'<div id="border-actu"></div>'+
			'<span class="date">Nouveau message</span>'+
			'<p>'+data.contenu+'</p>'+
			'<div id="support">'+
				'<span class="twitter '+twit+'"></span>'+
				'<span class="mail '+sms+'"></span>'+
				'<span class="sms '+mail+'"></span>'+	
			'</div>'+
		'</div>');
	    console.log(data);
	});
});