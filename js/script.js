// Constants and variables
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER = '012345678';
const SYMBOL = "`!?%^&*_-+=:;."
const COMPLEXSYMBOL = "`\"$(){[}]@'#\\<,>?/~|"

var nouns = [];
var adjectives = [];
var characters = 16;

// Helper functions
var randomArrayItem = function(array){
  return array[Math.floor(Math.random()*array.length)];
}

var filterWordLength = function(value){
  return (value.length == this);
}

// Generation Algorhythms
var randomString = function(len, charSet){
    charSet = charSet || UPPER + LOWER + NUMBER;
    var output = '';
    for (var i = 0; i < len; i++) {
    	var randomPoz = Math.floor(Math.random() * charSet.length);
    	output += charSet.substring(randomPoz,randomPoz+1);
    }
    return output;
}

var complexString = function(len){
  return randomString(len, UPPER + LOWER + NUMBER + SYMBOL + COMPLEXSYMBOL)
}

var lesscomplexString = function(len){
  return randomString(len, UPPER + LOWER + NUMBER + SYMBOL)
}

var xkcdString = function(len){
  // Decide how many words to use in the passphrase
  var minWords = Math.ceil(len / 10);
  var maxWords = Math.floor(len / 4);
  var words = Math.floor(Math.random() * (maxWords - minWords)) + minWords;
  if (words < 2){ words=2; }

  // Decide on all word length
  var wordLength = Math.floor(len / words);
  var lastwordLength = len % words;

  var output = ""

  for (var i = 0; i < words; i++){
    thiswordLength = wordLength;
    if (i == words - 1){
      thiswordLength += lastwordLength;
    }
    if (i % 2 == 1 || (words % 2 && i == words - 1)) {
      output += randomArrayItem(nouns.filter(filterWordLength, thiswordLength))
    } else {
      output += randomArrayItem(adjectives.filter(filterWordLength, thiswordLength))
    }
  }
  console.log({"length": output.length,
              "calulated length": words * wordLength + lastwordLength,
              "wordlength": wordLength,
              "lastwordLength": lastwordLength,
              "minWords": minWords,
              "maxWords": maxWords,
              "words": words})
  return output;
}

var pronounceString = function(len){
  output = '';
  for (var i = 0; i < len; i++) {
    if (i % 3 == 0 || i % 3 == 2) {
      output += randomString(1, 'bcdfghjklmnpqrstvwxz');
    } else {
      output += randomString(1, 'aeiouy');
    }
  }
  return output;
}

var generatePass = function(type){
  type = type || null

  switch(type){
    case 'pronounce':
      return pronounceString(characters)
    case 'complex':
      return complexString(characters)
    case 'lesscomplex':
      return lesscomplexString(characters)
    case 'xkcd':
      return xkcdString(characters)
    default:
      return randomString(characters);
  }

}

// Button event listeners
$("#gen_alphanumeric").bind( "click", function() {
  $("#pass").val(generatePass());
});

$("#gen_pronounce").bind( "click", function() {
  $("#pass").val(generatePass('pronounce'));
});

$("#gen_complex").bind( "click", function() {
  $("#pass").val(generatePass('complex'));
});

$("#gen_lesscomplex").bind( "click", function() {
  $("#pass").val(generatePass('lesscomplex'));
});

$("#gen_xkcd").bind( "click", function() {
  $("#pass").val(generatePass('xkcd'));
});

$("#chars").bind( "slideStop", function(e) {
  characters = e.value;
});

// Copy button
var clipboard = new Clipboard('#copy-button', {
    target: function() {
        return document.querySelector('#pass');
    }
});

// Load data
$(document).ready(function() {
  // Load nouns
  $.ajax({
      type: "GET",
      url: "data/nouns.csv",
      dataType: "text",
      success: function(data) {
        nouns = data.split(',');
      }
   });

   // Load adjectives
   $.ajax({
       type: "GET",
       url: "data/adjectives.csv",
       dataType: "text",
       success: function(data) {
         adjectives = data.split(',');
       }
    });
});
