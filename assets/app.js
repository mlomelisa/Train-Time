
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDBCYFOGOmD95zfLSBFiofOde2kfO7-XMs",
    authDomain: "testfirebase-ce82f.firebaseapp.com",
    databaseURL: "https://testfirebase-ce82f.firebaseio.com",
    projectId: "testfirebase-ce82f",
    storageBucket: "testfirebase-ce82f.appspot.com",
    messagingSenderId: "963993073118",
    appId: "1:963993073118:web:964f4507c2e0a21e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var updateTrainTimes;
  var database = firebase.database();

  var trainName;
  var trainDestination;
  var trainFrecuency;
  var trainTime;
  var trainMins;
  var countTrain=0;
  
 $('#submit').on('click', function(event){
 
 event.preventDefault();

  var name = $('#input-name').val().trim();
  var destination = $('#input-destination').val().trim();
  var frecuency = $('#input-frecuency').val().trim();
  var time = $('#input-time').val().trim();

  var newTrain = {
    
     name: name,
     destination: destination,
     frecuency: frecuency,
     time: time,
   };

   database.ref().child('trains').push(newTrain);

  // Clean entries

    $('#input-name').val("");
    $('#input-destination').val("");
    $('#input-frecuency').val("");
    $('#input-time').val("");
});// Submit button

   database.ref().child('trains').on("child_added", snapshot =>  {

        trainName = snapshot.val().name;
        trainDestination = snapshot.val().destination;
        trainFrecuency = snapshot.val().frecuency;
        trainTime = snapshot.val().time;

        var now = moment();
        // Calculate minutes passed from Train start tiem

        var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");

        trainMins = now.diff(moment(firstTimeConverted),'minutes');

        // Calculate time
       
      updateTrainTimes ();
      
     
   });

  function updateTrainTimes (){
    countTrain++;
    
  var minutespassed = trainMins % trainFrecuency;
  
  var minutesAway = trainFrecuency - minutespassed;
 
  var nextTrainArrival = moment().add(minutesAway, 'm');
  var nextArrival = moment(nextTrainArrival).format('HH:mm');

  var pencilEdit = $('<i>').addClass('fa fa-pencil-square');
  var menosRemove = $('<i>').addClass('fa fa-minus-square');

 
    //create a table row
    var tableRow = $("<tr>").append(
      $("<th>").attr('contenidoEditable', false).text(trainName),
      $("<th>").attr('contenidoEditable', false).text(trainDestination),
      $("<th>").attr('contenidoEditable', false).text(trainFrecuency),
      $("<th>").attr('contenidoEditable', false).text(nextArrival),
      $("<th>").attr('contenidoEditable', false).text(minutesAway),
      $("<th>").append(pencilEdit, menosRemove)
 
      );
     
    
    $('tbody').append(tableRow);
  }  // updateTrainTimes

function readDB(){

 database.ref().child('trains').once('value', function(snapshot){
   snapshot.forEach(function(childSnapshot){
    trainName = childSnapshot.val().name;
    trainDestination = childSnapshot.val().destination;
    trainFrecuency = childSnapshot.val().frecuency;
    trainTime = childSnapshot.val().time;

    var now = moment();
    // Calculate minutes passed from Train start tiem

    var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");

    trainMins = now.diff(moment(firstTimeConverted),'minutes');

  
    // Calculate time
   
  updateTrainTimes ();

   });
 });

}

$(document).on('click', 'i.fa.fa-pencil-square', function(e){
 
  $(this).removeClass().addClass('fa fa-envelope-o');
  var $row = $(this).closest('tr').off('mousedown');
  var $ths = $row.find('th').not(':last').not(':eq(4)').not(':eq(3)');

  $.each($ths, function(i, el){
    var txt = $(this).text();
    $(this).html("").append("<input type='text' value=\""+txt+"\">");
  });
});
  
$(document).on("click", "i.fa.fa-minus-square", function(e) {
  $(this).closest("tr").remove().draw();
})

$(document).on('click', "i.fa.fa-envelope-o", function(e) {
        
  $(this).removeClass().addClass("fa fa-pencil-square");
  var $row = $(this).closest("tr");
  var $ths = $row.find("th").not(':last').not(':eq(4)').not(':eq(3)');
  
  $.each($ths, function(i, el) {
    var txt = $(this).find("input").val()
    $(this).html(txt);
  });
});

database.ref().child('trains').on("child_changed", snapshot =>  {

  trainName = snapshot.val().name;
  trainDestination = snapshot.val().destination;
  trainFrecuency = snapshot.val().frecuency;
  trainTime = snapshot.val().time;

  var now = moment();
  // Calculate minutes passed from Train start tiem

  var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");

  trainMins = now.diff(moment(firstTimeConverted),'minutes');

  // Calculate time
 
updateTrainTimes ();


});

setInterval(function(){
  $('tbody').empty();
  readDB()}, 60000);