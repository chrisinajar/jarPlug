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
		API.addEventListener(API.CHAT, hidensfw.chat);
		return true;
	},
	unload: function() {
		API.removeEventListener(API.CHAT, hidensfw.chat);
		API.removeEventListener(API.DJ_ADVANCE, hidensfw.dj_advance);
		if(!jarPlug.settings['hidevideo']) {
			$("#playback").show();
		}
		return true;
	},
	chat: function(data) {
		if(data.message && /\bnsfw\b/i.test(data.message)) {
			var playback = $("#playback");
			API.addEventListener(API.DJ_ADVANCE, hidensfw.dj_advance);
			$("#playback").hide();
		}
	},
	dj_advance: function() {
		API.removeEventListener(API.DJ_ADVANCE, hidensfw.dj_advance);
		if(!jarPlug.settings['hidevideo']) {
			$("#playback").show();
		}
	}
}
})(jQuery);
