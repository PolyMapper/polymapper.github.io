// creates two basemap layers
var bright = L.tileLayer("https://{s}.tiles.mapbox.com/v3/mapbox.world-bright/{z}/{x}/{y}.png", {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});
var satellite = L.tileLayer("https://{s}.tiles.mapbox.com/v3/mapbox.blue-marble-topo-jul-bw/{z}/{x}/{y}.png", {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});

// functions to style the seismic risk layer
function getColor(a) {
            return a > 79 ? '#a50f15':
                   a > 59 ? '#de2d26' :
                   a > 39  ? '#fb6a4A' :
                   a > 19 ? '#fcae91' :
                   '#fee5d9';
            }

function getStyle(feature) {
                return {
                    fillColor: getColor(feature.properties.ACC_VAL),
                    color: getColor(feature.properties.ACC_VAL),
                    weight: 1,
                    opacity: 0.4,
                    fillOpacity: 0.7
                };
            }

function getSymbol(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: Math.pow(10, feature.properties.mag)/5000,
                    fillColor: '#fff',
                    color: '#000',
                    weight: 1,
                    opacity: 0.2,
                    fillOpacity: 0.5
                });
            }

			
// the seismic risks layer, styled using functions above
var seismic = L.geoJson(seismic_risk, {style:getStyle});

var quakes = L.geoJson(earthq, {
						pointToLayer:getSymbol,
						onEachFeature: popupText});

// function to write html for pop-ups; date, magnitude and depth values for each quake from parsed JSON
function popupText (feature, layer) {
     var date = new Date(feature.properties.time)
     // uses date-format to format the date
     var dateString = date.format('mmm d, yyyy')
     layer.bindPopup('<strong>Date: </strong>' + dateString + '<br />'
                    + '<strong>Magnitude: </strong>' + feature.properties.mag + '<br />'
                    + '<strong>Depth: </strong>' + feature.geometry.coordinates[2] + ' kilometers')
}
			
// creates the map and sets initial view, including layers to be displayed, plus limits for zoom and maximum extent
var map = L.map('map', {
    center: new L.LatLng(40, -100),
    zoom: 4, 
    maxZoom: 6,
    minZoom: 3,
    maxBounds: ([
    [-10, -160],
    [70, -40]
    ]),
    layers: [bright, seismic, quakes]
});

// Defines the two basemaps
var baseMaps = {
    'Satellite': satellite,
    'Map': bright
};

// Defines the overlay maps. 
var overlayMaps = {
    'Seismic risk': seismic,
    'Earthquakes': quakes
};

// Adds a Leaflet layer control, using basemaps and overlay maps defined above
var layersControl = new L.Control.Layers(baseMaps, overlayMaps, {collapsed: false});
map.addControl(layersControl);
