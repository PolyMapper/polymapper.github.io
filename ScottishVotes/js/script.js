/* DATA REQUESTS */
var ScottishVotes = $.ajax({
  url: "https://raw.githubusercontent.com/PolyMapper/polymapper.github.io/master/ScottishVotes/raw/ScottishVotes.geojson",
  dataType: "json",
  success: console.log("County data successfully loaded."),
  error: function(xhr) {
	alert(`ScottishVotes: ${xhr.statusText}`);
  }
});

/* when().done() SECTION*/
// Add the variable for each of your AJAX requests to $.when()
// inside here is basically normal javascript
$.when(ScottishVotes).done(function() {
  var map = L.map("map").setView([56.781854, -4.577107], 7);

  var basemap = L.tileLayer(
	"https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
	{
	  attribution:
		'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	  subdomains: "abcd",
	  maxZoom: 19
	}
  ).addTo(map);
  
  // Add requested external GeoJSON to map
  var geoScottishVotes = L.geoJSON(ScottishVotes.responseJSON, {
	fillOpacity: 0,
	color: '#b2b2b2',
	weight: 0.75
  }).addTo(map);

  var kyMotorways = L.geoJSON(motorways.responseJSON, {
	color: 'red',
	weight: 1
  }).addTo(map);

});