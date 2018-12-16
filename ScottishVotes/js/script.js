
/* FUNCTIONS */
function getColor(d) {
    return d > 72 ? '#800026' :
           d > 70  ? '#BD0026' :
           d > 66  ? '#E31A1C' :
           d > 63  ? '#FC4E2A' :
           d > 60   ? '#FD8D3C' :
           d > 55   ? '#FEB24C' :
           d > 50   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.RemainPercent_EU),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

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
	style: style
  }).addTo(map);


});