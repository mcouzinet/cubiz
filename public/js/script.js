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
});