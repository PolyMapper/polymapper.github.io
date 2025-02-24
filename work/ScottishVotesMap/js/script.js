
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
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}



/* DATA REQUESTS */
var ScottishVotes = $.ajax({
  url: "raw/ScottishVotes.geojson",
  dataType: "json",
  success: console.log("County data successfully loaded."),
  error: function(xhr) {
	alert(`ScottishVotes: ${xhr.statusText}`);
  }
});

/* when().done() SECTION*/
// Add the variable for each of your AJAX requests to $.when()
// inside here is basically normal javascript
// disabiling the zoom controls
$.when(ScottishVotes).done(function() {
  //var map = L.map("map").setView([56.781854, -4.577107], 7);
  var map = L.map("map", {
	zoomControl: false
  }).setView([56.781854, -4.577107], 7);
  
  var basemap = L.tileLayer(
	"https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
	{
	  attribution:
		'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	  subdomains: "abcd",
	  maxZoom: 19
	}
  ).addTo(map);
  
	//add zoom control with your options
	L.control.zoom({
		 position:'bottomleft'
	}).addTo(map);  
	  
  // Add requested external GeoJSON to map
  var geoScottishVotes = L.geoJSON(ScottishVotes.responseJSON, {
	style: style,
	onEachFeature: onEachFeature
  }).addTo(map);
  function highlightFeature(e) {
	  var layer = e.target;

      layer.setStyle({
          weight: 2,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
      }
	
	  info.update(layer.feature.properties);
  }
  
  function resetHighlight(e) {
	  geoScottishVotes.resetStyle(e.target);
	  info.update();
  }

  function zoomToFeature(e) {
	  map.fitBounds(e.target.getBounds());
   }
   
  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
  }
  
  // look to the pop ups
  var info = L.control();
  
  info.onAdd = function (map) {
	  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
  };

  // method that we will use to update the control based on feature properties passed
  info.update = function (props) {
      this._div.innerHTML = '<h4>Remain percentage </h4>' +  (props ?
          '<b>' + props.NAME + '</b><br />' + props.RemainPercent_EU + '%'
          : 'Hover over a Council area');
  };

  info.addTo(map);  
  
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 50, 55, 60, 63, 66, 70, 72],
          labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
  };
  
  legend.addTo(map);

});

/* MODAL FUNCTION */
(function(){
  var $content = $('.modal_info').detach();

  $('.open_button').on('click', function(e){
    modal.open({
      content: $content,
      width: 540,
      height: 270,
    });
    $content.addClass('modal_content');
    $('.modal, .modal_overlay').addClass('display');
    $('.open_button').addClass('load');
  });
}());

var modal = (function(){

  var $close = $('<button role="button" class="modal_close" title="Close"><span></span></button>');
  var $content = $('<div class="modal_content"/>');
  var $modal = $('<div class="modal"/>');
  var $window = $(window);

  $modal.append($content, $close);

  $close.on('click', function(e){
    $('.modal, .modal_overlay').addClass('conceal');
    $('.modal, .modal_overlay').removeClass('display');
    $('.open_button').removeClass('load');
    e.preventDefault();
    modal.close();
  });

  return {
    center: function(){
      var top = Math.max($window.height() - $modal.outerHeight(), 0) / 2;
      var left = Math.max($window.width() - $modal.outerWidth(), 0) / 2;
      $modal.css({
        top: top + $window.scrollTop(),
        left: left + $window.scrollLeft(),
      });
    },
    open: function(settings){
      $content.empty().append(settings.content);

      $modal.css({
        width: settings.width || 'auto',
        height: settings.height || 'auto'
      }).appendTo('body');

      modal.center();
      $(window).on('resize', modal.center);
    },
    close: function(){
      $content.empty();
      $modal.detach();
      $(window).off('resize', modal.center);
    }
  };
}());