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
	
var togglevideo = jarPlug.togglevideo = {
	load: function() {
		$('#playback').append(
			$('<button id="button-video">Toggle Video</button>')
			.css({ 
				'display': 'none',
				'font-size': '11px', 
				'position': 'absolute', 
				'bottom': '5px', 
				'left': '5px', 
				'z-index': '10', 
				'border': '0', 
				'color': '#fff',
				'background': '#777',
				'width': '50px'
			})
			.click(function() {
				$('#playback-container').toggle();
			})
		).on('mouseenter.togglevideo', function() {
			$('#button-video').show();
		}).on('mouseleave.togglevideo', function() {
			$('#button-video').hide();
		});

		return true;
	},
	unload: function() {
		$('#playback').unbind('.togglevideo');
		$('#button-video').remove();

		return true;
	}
}
})(jQuery);
