/*document.addEventListener('DOMContentLoaded', function(event) {

  document.getElementById('flip-card-btn-turn-to-back').style.visibility = 'visible';
    
  document.getElementById('flip-card-btn-turn-to-front').style.visibility = 'visible';

  document.getElementById('flip-card-btn-turn-to-back').onclick = function() {
      document.getElementById('flip-card').classList.toggle('do-flip');
  };

  document.getElementById('flip-card-btn-turn-to-front').onclick = function() {
      document.getElementById('flip-card').classList.toggle('do-flip');
  };
    
  document.getElementById('flip-card-btn-turn-to-front').onclick = function() {
      document.getElementById('flip-card').classList.toggle('do-flip');
  };
    

});*/

function genQuote() {
    
    /*the text updates before flip, so forces wait*/
    
    var myVar = setTimeout(updateText, 500);
    var randNum = Math.floor(Math.random() * 8);
    
    
    document.getElementById('flip-card').classList.toggle('do-flip');
    
    function updateText(){
        $('p#flip-card-front-text').text(quotes[randNum])
        $('p#flip-card-back-text').text(quotes[randNum])
    }
    
    
    
    /*$("#flip-card-front-text").text("<b>Some</b> new text.");*/

}

//quote array
var quotes = ["Topic zero.", 
              "Topic one.", 
              "Topic two.", 
              "Topic three.",
              "Topic four.",
              "Topic five.",
              "Topic six.",
              "Topic seven."
             ];