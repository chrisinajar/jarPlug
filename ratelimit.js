/*Copyright 2012, Coding SoundtrackAll rights reserved.Authors:Redistribution and use in source and binary forms, with or withoutmodification, are permitted provided that the following conditions are met: 1. Redistributions of source code must retain the above copyright notice, this   list of conditions and the following disclaimer. 2. Redistributions in binary form must reproduce the above copyright notice,   this list of conditions and the following disclaimer in the documentation   and/or other materials provided with the distribution. I am not responsible for the actions of your parents*/(function($, undefined) {if (!jarPlug) return;var ratelimit = jarPlug.ratelimit = {	settings: {		element = '#chat-input-field',		warnColor: '#CC4141',		regularColor: $(ratelimit.settings.element).css('color')	},	load: function() {		Models.chat._sendChat = Models.chat.sendChat;		Models.chat.sendChat = ratelimit.limitStart;		return true;	},	unload: function() {		Models.chat.sendChat = Models.chat._sendChat;		Models.chat._sendChat = undefined;		return true;	},	limitStart: function(){		var sent = this._sendChat(value);		if (sent)		{			$(ratelimit.settings.element).css({color: ratelimit.settings.warnColor});			setTimeout(function(){ratelimit.limitStop, this.rateLimit * 1000);		}		return sent;	},	limitStop: function() {		$(ratelimit.settings.element).css({color: ratelimit.settings.regularColor});	}}})(jQuery);