/*
Copyright 2013, Coding Soundtrack
All rights reserved.

Authors:
lakario

Description:
This plugin monitors the currently playing djs and notifies the user 
when a dj slot becomes available by flashing and making noise. It will 
only notify if the user is not currently djing.


Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met: 

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer. 
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution. 

I am not responsible for the actions of your parents

*/


(function($, undefined) {
if (!jarPlug) return;
	
var djleavealert = jarPlug.djleavealert = {
	settings: {
		flashCount: 5,
		djs: [],
		maxDjs: 5
	},
	load: function() {
		API.addEventListener(API.DJ_UPDATE, djleavealert.dj_update);
		djleavealert.render();	
		djleavealert.djs = API.getDJs();
		return true;
	},
	unload: function() {
		API.removeEventListener(API.DJ_UPDATE, djleavealert.dj_update);
		return true;
	},
	render: function() {
		if($('.leave-alert-wrp').length < 1) {
			var markup = $('<div class="leave-alert-wrp"> \
				<audio id="loud-beep"><source src="' + jarPlug.baseUrl + 'assets/loudbeep.wav" type="audio/wav"> \
				<source src="' + jarPlug.baseUrl + 'assets/loudbeep.mp3" type="audio/mp3"></audio> \
				</div>');
			
			$('#user-container').append(markup);
			document.getElementById('loud-beep').load();
		}
	},
	dj_update: function(users) {
		var len = users.length;
		var me = API.getSelf();
		
		if(len < djleavealert.settings.maxDjs) {
			console.log('[Leave Alert] DJ slot open.');

			// if there was already a slot available, i am already on the deck, or i just stepped down: don't notify
			if((djleavealert.settings.djs.length >= djleavealert.settings.maxDjs || djleavealert.settings.djs.length < 1)
				&& users.indexOf(me) == -1 
				&& djleavealert.settings.djs.indexOf(me) == -1) {
				djleavealert.beep();
				djleavealert.flashBackground();
			}
		}
		else {
			console.log('[Leave Alert] All slots taken.');
		}
		
		djleavealert.settings.djs = users;
	},
	beep: function() {
		var plugVolume = (window.Playback.volume || 100) / 100;
		var loudBeep = document.getElementById('loud-beep');

		loudBeep.load();
		loudBeep.volume = Math.min(1, (plugVolume + (plugVolume * 0.25))); // plays at current volume + 25% or full volume (whichever is less)
		loudBeep.play();
	},
	flashBackground: function() {
		var flashes = 0;
		var blinkInt = setInterval(function() {
			var body = $('body');
			var bg = body.css('background');
			
			body.css('background', 'none');
			setTimeout(function() {
				body.css('background', bg);
			}, 250);
			
			if(++flashes == djleavealert.settings.flashCount) {
				clearInterval(blinkInt);
			}
		}, 500);  
	}
}
})(jQuery);
