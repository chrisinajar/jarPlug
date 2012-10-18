/*
Copyright 2012, Coding Soundtrack
All rights reserved.

Authors:


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

var autowoot = jarPlug.autowoot = {
	settings: {
		delay: 3*1000, //how long to wait (minimum) before wooting
		spread: 5*1000, //random delay up to this amount so we don't all woot at once
		enabled: true //false if you hate fun
	},
	load: function() {
		API.addEventListener(API.DJ_ADVANCE, autowoot.callback);
		return true;
	},
	unload: function() {
		API.removeEventListener(API.DJ_ADVANCE, autowoot.callback);
		return true;
	},
	callback: function(obj) {
		//null obj means nobody is playing
		if (null === obj || !autowoot.settings.enabled) {
			return;
		}
		
		setTimeout(autowoot.woot, autowoot.settings.delay + Math.floor(Math.random() * autowoot.settings.spread));
	},
	woot: function() {
		$('#button-vote-positive').click();
	}
}

})(jQuery);

