/*
Copyright 2012, Coding Soundtrack
All rights reserved.

Authors:
lakario


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
		gitPath: 'https://raw.github.com/lakario/plug.dj-plugins/master/'
	},
	load: function() {
		$('#button-vote-negative').click(doublemeh.meh);
		djleavealert.render();		
		return true;
	},
	unload: function() {
		API.removeEventListener(API.DJ_UPDATE, djleavealert.dj_update);
	
		return true;
	},
	render: function() {
		if($('.leave-alert-wrp').length < 1) {
			var markup = $('<div class="leave-alert-wrp"><audio id="loud-beep"><source src="' + djleavealert.settings.gitPath + 'assets/loudbeep.wav" type="audio/wav"><source src="' + djleavealert.settings.gitPath + 'assets/loudbeep.mp3" type="audio/mp3"></audio></div>');
			
			$('#user-container').append(markup);
		}
	},
	dj_update: function(users) {
		var len = users.length;
		
		if(len < 5) {
			console.log('[Leave Alert] DJ slot open.');
			document.getElementById('loud-beep').play();
			djleavealert.flashBg(5);
		}
		else {
			console.log('[Leave Alert] All slots taken.');
		}
	},
	flashWindow: function() {
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
