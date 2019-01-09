
var raster = new ol.layer.Tile({
source: new ol.source.OSM()
});

var source = new ol.source.Vector();

var vector = new ol.layer.Vector({
source: source,
style: new ol.style.Style({
  fill: new ol.style.Fill({
	color: 'rgba(255, 255, 255, 0.2)'
  }),
  stroke: new ol.style.Stroke({
	color: '#ffcc33',
	width: 2
  }),
  image: new ol.style.Circle({
	radius: 7,
	fill: new ol.style.Fill({
	  color: '#ffcc33'
	})
  })
})
});

var countries = new ol.layer.Vector({
	source: new ol.source.Vector({
	  url: 'https://openlayers.org/en/v5.1.3/examples/data/geojson/countries.geojson',
	  format: new ol.format.GeoJSON()
	})
});
//map.addLayer(countries);

var map = new ol.Map({
layers: [raster, vector, countries],
target: 'map',
view: new ol.View({
	  center: [0, 0],
	  zoom: 2
})
});


var modify = new ol.interaction.Modify({source: source});
map.addInteraction(modify);

var draw, snap; // global so we can remove them later
var typeSelect = document.getElementById('type');

function addInteractions() {
draw = new ol.interaction.Draw({
  source: source,
  type: typeSelect.value
});
map.addInteraction(draw);
snap = new ol.interaction.Snap({source: source});
map.addInteraction(snap);

}

/**
* Handle change event.
*/
typeSelect.onchange = function() {
map.removeInteraction(draw);
map.removeInteraction(snap);
addInteractions();
};

addInteractions();