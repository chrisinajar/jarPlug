$(function(){
	module("jquery.emojiTest", { });
	
	var emojiMap = {
		'+1': '1f44d',
		'dizzy': '1f4ab',
		'dog2': '1f415',
		'dog': '1f436',
		'dollar': '1f4b5',
		'walking': '1f6b6',
		'waning_crescent_moon': '1f318',
		'waning_gibbous_moon': '1f316',
		'warning': '26a0',
		'zero': '0030',
		'zzz': '1f4a4'
	};

	var emojiDictionary = [];
	for (key in emojiMap) {
		emojiDictionary.push(key);
	}
	emojiDictionary.sort();
	
	test("wordSuggestionLookup returns an array of words starting with the given characters", function() {
		var matches = jarPlug.emoji.wordSuggestionLookup(emojiDictionary, "wa", 2);
		deepEqual(matches, ['walking','waning_crescent_moon']);
	});

	test("wordSuggestionLookup selects an exact match when it is the only match", function() {
		var matches = jarPlug.emoji.wordSuggestionLookup(emojiDictionary, "dog2", 2);
		deepEqual(matches, ['dog2']);
	});
	
	test("wordSuggestionLookup selects an exact match when there are multiple matches", function() {
		var matches = jarPlug.emoji.wordSuggestionLookup(emojiDictionary, "dog", 2);
		deepEqual(matches, ['dog','dog2']);
	});
	
	test("wordSuggestionLookup returns only matches", function() {
		var matches = jarPlug.emoji.wordSuggestionLookup(emojiDictionary, "dog", 4);
		deepEqual(matches, ['dog','dog2']);
	});
	
	test("wordSuggestionLookup low array limit with no match", function() {
		var matches = jarPlug.emoji.wordSuggestionLookup(emojiDictionary, "++", 2);
		deepEqual(matches, []);
	});
	
	test("wordSuggestionLookup low array limit with match", function() {
		var matches = jarPlug.emoji.wordSuggestionLookup(emojiDictionary, "+", 2);
		deepEqual(matches, ['+1']);
	});
	
	test("wordSuggestionLookup high array limit test", function() {
		var matches = jarPlug.emoji.wordSuggestionLookup(emojiDictionary, "zzzz", 2);
		deepEqual(matches, []);
	});
});