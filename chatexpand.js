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

//keep track of the button for chat expanding
var btn = null;

//rotate an element
function rotate(el, angle)
{
	$(el).css({
		'-webkit-transform': 'rotate(' + angle + 'deg)',
		'-moz-transform': 'rotate(' + angle + 'deg)',
		'-ms-transform': 'rotate(' + angle + 'deg)',
		'-o-transform': 'rotate(' + angle + 'deg)',
		'transform': 'rotate(' + angle + 'deg)'});
}

//change an element's width
function changeWidth(selector, diff)
{
	$(selector).width($(selector).width() + diff);
}

//change an element's left
function changeLeft(selector, diff)
{
	$(selector).css({left: (parseInt($(selector).css('left'), 10) + diff) + 'px'});
}

var chatexpand = jarPlug.chatexpand = {
	settings: {
		
	},
	load: function() {
		btn = document.createElement('div');
		
		//style our button and rotate it for expand mode
		$(btn).css({
			'backgroundColor': '#222',
			'backgroundImage': $('#button-chat-expand').css('background-image'),
			'right': '32px',
			'width': '30px'
		}).addClass('button-chat-size');
		rotate(btn, 90);

		//since we're adding another button next to the input,
		//we've gotta shrink it
		changeWidth('.chat-input', -32);
		changeWidth('#chat-input-field', -32);

		//add the button
		$('#chat').append(btn);

		//when the button is clicked, it toggles the video
		$(btn).click(chatexpand.toggleVideo);

		//when chat expanded/contracted, need to keep the button in the right spot
		$('#button-chat-expand').click(chatexpand.chatExpand);
		$('#button-chat-collapse').click(chatexpand.chatCollapse);
		
		return true;
	},
	unload: function() {
		$(btn).unbind('click', chatexpand.toggleVideo);
		$('#button-chat-expand').unbind('click', chatexpand.chatExpand);
		$('#button-chat-collapse').unbind('click', chatexpand.chatCollapse);
		btn.parentNode.removeChild(btn);
		changeWidth('.chat-input', 32);
		changeWidth('#chat-input-field', 32);
		btn = null;
		return true;
	},
	chatExpand: function() {
		$(btn).css({top: $('#button-chat-collapse').css('top')});
	},
	chatCollapse: function() {
		$(btn).css({top: $('#button-chat-expand').css('top')});
	},
	toggleVideo: function() {
		var pbWidth = $('#playback').width();
		if (!$('#playback').is(":visible"))
		{
			$('#playback').show();
			//invert the pbWidth so we don't need two copies
			//of the code that actually changes the width
			pbWidth = -pbWidth;
			rotate(btn, 90);
		}
		else
		{
			$('#playback').hide();
			rotate(btn, -90);
		}

		//easy css width change
		changeWidth('#chat', pbWidth);
		changeWidth('#chat-messages', pbWidth);
		changeWidth('.chat-input', pbWidth);
		changeWidth('#bottom-chat-line', pbWidth);
		changeWidth('#chat-header', pbWidth);
		changeWidth('#top-chat-line', pbWidth);
		changeWidth('#chat-input-field', pbWidth);

		//easy css left change
		changeLeft('#chat-mention-suggestion', -pbWidth);
		changeLeft('#chat', -pbWidth);

		//this one's a pain, mod the width in the stylesheet directly
		$.each(document.styleSheets, function(i, styleSheet) {
			$.each(styleSheet.cssRules, function(j, rule) {
				if (rule.selectorText == '.chat-message, .chat-mention, .chat-emote, .chat-skip, .chat-moderation, .chat-system, .chat-update'
					|| rule.selectorText == '.chat-admin'
					|| rule.selectorText == '.chat-ambassador'
					|| rule.selectorText == '.chat-manager'
					|| rule.selectorText == '.chat-bouncer')
				{
					rule.style.width = (parseInt(rule.style.width, 10) + pbWidth) + 'px';
				}
			})
		});		
		

		//pin chat to the bottom
		$('#chat-messages').scrollTop($("#chat-messages")[0].scrollHeight);
	}
}

})(jQuery);

