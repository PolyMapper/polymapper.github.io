
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

getStyle = function (feature, resolution) {
    if (feature.get('RemainPercent_EU') < 70) {
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: [255, 0, 0, 0.5] // semi-transparent red
            })
        });
    }
    // else if ...
    else {
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: [255, 255, 0, 0.5] // semi-transparent yellow
            })
        });
    }
};

my_layer = new ol.layer.Vector({
    source: new ol.source.Vector({
	  url: 'https://raw.githubusercontent.com/PolyMapper/polymapper.github.io/master/raw/ScottishVotes.geojson',
	  format: new ol.format.GeoJSON()
	}),
    style: function (feature, resolution) {
        return getStyle(feature, resolution);
    }
});

var map = new ol.Map({
layers: [raster, vector, my_layer],
target: 'map',
view: new ol.View({
	  center: ol.proj.transform([-4.577107,56.781854], 'EPSG:4326', 'EPSG:3857'),
	  zoom: 6
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