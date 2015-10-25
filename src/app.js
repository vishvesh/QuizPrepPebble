/**
 * Welcome to QuizPrep!
 *
 * A Smart Way to Learn :)
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

var main = new UI.Card({
  title: 'QuizPrep',
  icon: 'images/menu_icon.png',
  subtitle: 'Flashcards on the go :)',
  body: '\nClick the "Select" button to View All Topics.',
  scrollable: true
  /*style: 'small'*/
});

main.show();

/** Represents the current Topic the user is currently viewing.. */
var currentTopic = null;

/** Create a new card in which to show our User Topics. */
var topicCard = new UI.Card({scrollable: true, style: 'small'});

function fetchQandAForTopic() {
  console.log("Fetching Q and A for Topic : "+currentTopic);
  topicCard.body('Loading...');
  /** Fetch the Q and A's for a specific Topic.. */
  ajax({url: encodeURI('http://quizprep.club/pebbletopics/'+currentTopic), 'type': 'json'},
      function(data) {
        // It worked! Construct a sentence to show on screen.
        //topicCard.body(data.preamble + " " + data.thing + ".\n\n" + data.action);
        topicCard.title("Topic : "+currentTopic+"\n");
        console.log("Data Received from Server :: "+JSON.stringify(data));
        
        if(typeof data !== 'undefined') {
          topicCard.body("\nQ. "+data.question+ ".\n\n" + "A. "+data.answer+"\n");
        }
      }, function(data) {
        // It didn't work. :(
        console.log("Something went wrong with the Ajax call..");
        topicCard.body("Nooo! Something isn't quite right.. Please retry again..");
    });
  
  //TODO: Replace this with Ajax call..
  //topicCard.body("\nQ. Why is Pebble so awesome?" + ".\n\n" + "A. Do I really need to explain this? :)");
}

topicCard.on('click', 'select', fetchQandAForTopic);

function getTrendingTopics() {
  //TODO: Replace this with Ajax call..
  var topics = [];
  var noTopics = false;
  console.log("Fetching all Trending Topics..");
  /** Fetch All the Trending Topics.. */
  ajax({url: 'http://quizprep.club/pebbletopics', 'type': 'json'},
      function(data) {
        // It worked! Construct a sentence to show on screen.
        //topicCard.body(data.preamble + " " + data.thing + ".\n\n" + data.action);
        console.log("Data Received from Server :: "+JSON.stringify(data));
        if(typeof data !== 'undefined' && data.pebbletopics.length > 0) {
          console.log("Found : "+data.pebbletopics.length+" : Trending Topics..");
          data.pebbletopics.forEach(function(topic) {
            topics.push({
              title: topic,
              icon: 'images/menu_icon.png'
            });            
          });
          
          var menu = new UI.Menu({
              sections: [{
                title: 'Trending Topics',
                items: topics
              }]
            });
            
            menu.on('select', function(e) {
              currentTopic = e.item.title;
              fetchQandAForTopic();
              topicCard.show();
            });
            
            menu.show();
        } else {
          console.log("No Topics Configured.. Or data received from the server is undefined..");
          noTopics = true;
        }
      }, function(data) {
        // It didn't work. :(
        //topicCard.body("I don't know. :(");
        console.log("Something went wrong with the Ajax call..");
        noTopics = true;
    });
  if(noTopics) {
    console.log("No Trending Topics found.. Displaying the status to the User..");
    var card = new UI.Card({scrollable: true, style: 'small'});
    card.title('No Topics Trending Yet..');
    card.subtitle('-----------------');
    card.body('You can generate Topics via our website..');
    card.show();
  }
}

main.on('click', 'select', function(e) {
  getTrendingTopics();
});

/*main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    fullscreen: true,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});*/

/*main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});*/
