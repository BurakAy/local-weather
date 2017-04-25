$(document).ready(function(){
  
  // Time and Date
  var d = new Date();
  var currentTime = d.toLocaleTimeString().replace(/:\d+ /, ' ');
  var currentDate = d.toDateString().replace(/\d+$/, ' ');

  $("#date").html(currentDate + " @ " + currentTime);
  
  // Location
  if (navigator.geolocation) { //if location sharing allowed
    
    navigator.geolocation.getCurrentPosition(function(position) {
      var latCoord = position.coords.latitude;
      var longCoord = position.coords.longitude;
  
      getWeather(latCoord, longCoord);
      
      $("#fahr").show(); //display button
    }); //end geolocation
  
  } else {
    $("#location").html("Geolocation is not supported by this browser."); 
  } //end if navigator
    
    function getWeather(lat, long) {

      $.getJSON('https://query.yahooapis.com/v1/public/yql?q=select location.city, location.region, item.link, item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text="('+lat+', '+long+')")&format=json', function(data) {
        
          var city = data.query.results.channel.location.city;
          var state = data.query.results.channel.location.region;
          var temp = data.query.results.channel.item.condition.temp;
          var cond = data.query.results.channel.item.condition.text;
          var yahooLink = data.query.results.channel.item.link;
          
          //if user location found set weather values
          if (data.query.results.channel != null) {
              $("#location").html(city + ", " + state);
              fahrButton(temp); //call function for calculating temp
              setImage(cond); //call function for setting condition image
              $("#condition").html(cond);
              $(".yahooLink").attr("href", yahooLink);
          } else {         
              $("#location").html("Location not found!");
              $("#temperature").html("---");
              $("#condition").html("---");
          }
 
      }); //end .get
      
    } //end function getWeather
    
    
    function setImage(condition) {
      //check weather condition and set image based on matching string values
      if (condition.toLowerCase().indexOf("cloud") >= 0) {
        $("#faicon1").addClass("fa fa-cloud fa-3x");
        
      } else if (condition.toLowerCase().indexOf("rain") >= 0 && condition.toLowerCase().indexOf("snow") >= 0) {
        $("#faicon2").addClass("fa fa-snowflake-o fa-spin fa-3x fa-fw");
        $("#faicon1").addClass("fa fa-tint fa-2x");
        
      } else if (condition.toLowerCase().indexOf("rain") >= 0 || condition.toLowerCase().indexOf("drizzle") >= 0 || condition.toLowerCase().indexOf("showers") >= 0) {
        $("#faicon1").addClass("fa fa-tint fa-3x");
        
      } else if (condition.toLowerCase().indexOf("thunder") >= 0) {
        $("#faicon1").addClass("fa fa-bolt fa-3x");
        
      } else if (condition.toLowerCase().indexOf("snow") >= 0 || condition.toLowerCase().indexOf("flurr") >= 0) {
        $("#faicon1").addClass("fa fa-snowflake-o fa-spin fa-3x fa-fw");
        
      } else if (condition.toLowerCase().indexOf("sun") >= 0) {
        $("#faicon1").addClass("fa fa-sun-o fa-pulse fa-3x fa-fw");
      }
    } //end function setImage

  function fahrButton(temperature) {
    //default button and fahrenheit value
    $("#fahr").html("F");
    $("#temperature").html(temperature + "&deg;");
    
    $("#fahr").click(function() {
      var fToC = (temperature - 32) * 0.5556; //formula for fahrenheit to celsius
      var celsius = Math.floor(fToC); //round down
      
      // check current value of button and change temperature accordingly
      if ($("#fahr").html() === "F") {
        $("#temperature").html(celsius + "&deg;");
        $("#fahr").html("C");
      } else if ($("#fahr").html() === "C") {
        $("#temperature").html(temperature + "&deg;");
        $("#fahr").html("F");
      }

    }); //end click
    
  } //end fahrButton function
  
}); //end document