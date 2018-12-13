/* DATA REQUESTS */
var counties = $.ajax({
  url: "https://gist.githubusercontent.com/maptastik/df8e483d5ac1c6cae3dc4a7c02ea9039/raw/ff9897d53ee19a92e4393d23c87aa6d305e6b247/kyCounties.geojson",
  dataType: "json",
  success: console.log("County data successfully loaded."),
  error: function(xhr) {
	alert(`Counties: ${xhr.statusText}`);
  }
});

var motorways = $.ajax({
  url: "https://raw.githubusercontent.com/PolyMapper/polymapper.github.io/master/StarterMapMultSplit/raw/kyMotorwaysSimplified.geojson",
  dataType: "json",
  success: console.log("County data successfully loaded."),
  error: function(xhr) {
	alert(`Motorways: ${xhr.statusText}`);
  }
});

var parks = $.ajax({
  url: "https://gist.githubusercontent.com/maptastik/df8e483d5ac1c6cae3dc4a7c02ea9039/raw/ff9897d53ee19a92e4393d23c87aa6d305e6b247/kyParks.geojson",
  dataType: "json",
  success: console.log("County data successfully loaded."),
  error: function(xhr) {
	alert(`Parks: ${xhr.statusText}`);
  }
});

/* when().done() SECTION*/
// Add the variable for each of your AJAX requests to $.when()
// inside here is basically normal javascript
$.when(counties, motorways, parks).done(function() {
  var map = L.map("map").setView([37.857507, -85.632935], 7);

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
  var kyCounties = L.geoJSON(counties.responseJSON, {
	fillOpacity: 0,
	color: '#b2b2b2',
	weight: 0.75
  }).addTo(map);

  var kyMotorways = L.geoJSON(motorways.responseJSON, {
	color: 'red',
	weight: 1
  }).addTo(map);
  
  var kyParks = L.geoJSON(parks.responseJSON, {
	pointToLayer: function(feature, latlng) {
	  return L.circleMarker(latlng, {
		radius: 4,
		fillOpacity: 0,
		color: 'black',
		weight: 0.75
	  })
	}
  }).addTo(map);
});