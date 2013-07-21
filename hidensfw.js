/*
Copyright 2012, Coding Soundtrack
All rights reserved.

Authors:
lakario

Description:
This plugin will monitor chat for the term 'nsfw'. If detected, it will hide 
the video until the current track completes playback. This plugin respects 
the hidevideo setting.


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
	
var hidensfw = jarPlug.hidensfw = {
	load: function() {
		API.on(API.CHAT, hidensfw.chat);

		$('#playback').append(
			$('<button id="button-show-video">Show Video</button>')
				.css({
					'position':'absolute',
					'top':'45%', 
					'left':'40%', 
					'z-index':'3',
					'border':'0',
					'width':'100px',
					'padding':'4px',
					'cursor':'pointer',
					'text-transform':'uppercase',
					'font-weight':'bold',
					'color':'#fff',
					'background':'#42A5DC',
					'font-size':'11.5px'
				})
				.on('click', function() { 
					$('#playback-container').show(); 
				})
		);

		return true;
	},
	unload: function() {
		API.off(API.CHAT, hidensfw.chat);
		API.off(API.DJ_ADVANCE, hidensfw.dj_advance);
		
		$("#playback-container").show();
		$('#button-show-video').remove();

		return true;
	},
	chat: function(data) {
		if(data.message && /\bnsfw\b/i.test(data.message)) {
			API.on(API.DJ_ADVANCE, hidensfw.dj_advance);
			$("#playback-container").hide();
		}
	},
	dj_advance: function() {
		API.off(API.DJ_ADVANCE, hidensfw.dj_advance);
		$("#playback-container").show();
	}
}
})(jQuery);
