var mymap;
var latit;
var longit;
var lyrOSM;
var lyrPubs;
var lyrSearch;
var lyrMarkerCluster;
var fgpDrawnItems;
var ctlAttribute;
var ctlSidebar;
var ctlEasybutton;
var ctlEasybuttonMyLoc;
var objBasemaps;
var objOverlays;
var arPubNames = [];
var dropdown;
var clueOne;
var clueTwo;
var clueThree;
var currentLoc;
var currentAcc;
var currentLatit;
var currentLongit;

$(document).ready(function(){
    
    //  ********* Map Initialization ****************

    mymap = L.map('mapdiv', {center:[55.94036, -3.19084], zoom:12, attributionControl:false});

    ctlAttribute = L.control.attribution().addTo(mymap);
    ctlAttribute.addAttribution('OSM');
    ctlAttribute.addAttribution('&copy; <a href="https://polymapper.github.io">PloyMapper</a>');

    ctlScale = L.control.scale({position:'bottomleft', metric:false, maxWidth:200}).addTo(mymap);
    
	ctlEasybutton = L.easyButton('glyphicon-transfer', function(){
		//var distance = getDistance([currentLoc.getLatLng().lat, currentLoc.getLatLng().lng], [clueOne.getLatLng().lat, clueOne.getLatLng().lng]);
		//console.log(distance); 
		//checkDistance(clueOne, 200);
		
		
    }, 'Calculate Distance', 'btnCalcDist').addTo(mymap);
	
	ctlEasybuttonMyLoc = L.easyButton('glyphicon-map-marker', function(){
		mymap.locate({setView: true, maxZoom: 18});
    }, 'Find My Location', 'btnMyLoc').addTo(mymap);	
	
	
	
	
    //   *********** Layer Initialization **********

    lyrOSM = L.tileLayer.provider('OpenStreetMap.Mapnik');
    lyrTopo = L.tileLayer.provider('OpenTopoMap');
    lyrImagery = L.tileLayer.provider('Esri.WorldImagery');
    lyrOutdoors = L.tileLayer.provider('Thunderforest.Outdoors');
    lyrWatercolor = L.tileLayer.provider('Stamen.Watercolor');
    mymap.addLayer(lyrOSM);
 
    


    // ********* Setup Layer Control  ***************

    objBasemaps = {
        "Open Street Maps": lyrOSM,
        "Topo Map":lyrTopo,
        "Imagery":lyrImagery,
        "Outdoors":lyrOutdoors,
        "Watercolor":lyrWatercolor
    };
    
    /*objOverlays = {
        "Pubs":lyrPubs,
        "Drawn Items":fgpDrawnItems
    };*/
    
    ctlLayers = L.control.layers(objBasemaps).addTo(mymap);
	
	
    // ********* User Location  ***************
	
	mymap.on('locationfound', onLocationFound);
	mymap.on('locationerror', onLocationError);
	
	// call the locate function first, then repeat every 1 seconds
	// wrap map.locate in a function  
    function locate() {
		//mymap.locate({setView: true, maxZoom: 16});
		mymap.locate();
		//console.log("Getting location");

    }
	// call the locate function first, then repeat every 1 seconds
	locate();
    setInterval(locate, 1000);
	
	
	// adding clue one to map
	showClueOne();
	showClueTwo();
	// looking for change in drop down
	var destinationSelect = document.getElementById('info legend leaflet-control');

	//destinationSelect.addEventListener("change", function() {
			//console.log("Changed drop down");

	//});

	//checkDistance();
	//setInterval(checkDistance, 3000);
	
});




// *********  Clue Functions *****************
function showClueOne(e) {
	var icnBeer = L.icon({iconUrl:'img/Beer.png', iconSize:[40,40], iconAnchor:[20,24]});
	
	var clueToolTip = "<h4>Clue Number One</h4>";  
	clueOne = L.marker([56.057446, -3.382388], {icon:icnBeer}).bindPopup(clueToolTip);
	//clueOne.addTo(mymap)
}

function showClueTwo(e) {
	var icnBeer = L.icon({iconUrl:'img/Beer.png', iconSize:[40,40], iconAnchor:[20,24]});
	
	var clueToolTip = "<h4>Clue Number Two</h4>";  
	clueTwo = L.marker([56.056605, -3.380608], {icon:icnBeer}).bindPopup(clueToolTip);
	//clueOne.addTo(mymap)
}



function checkDistance(inClue, dist){
	
	// check the distance to each of the clues at this POINT
		var distance = getDistance([currentLoc.getLatLng().lat, currentLoc.getLatLng().lng], [inClue.getLatLng().lat, inClue.getLatLng().lng]);
		
	// if the distance if less than 10m make visible, if not make invisible
		//console.log(distance)
		if (distance < dist) {
			mymap.removeLayer(inClue);
			mymap.addLayer(inClue);
		} else {
			mymap.removeLayer(inClue);
		}
	
}
//  ***********  General Functions *********

/*calculating distance*/

function onLocationFound(e) {
  	// if position defined, then remove the existing position marker and accuracy circle from the map
  	if (currentLoc) {
		mymap.removeLayer(currentLoc);
	  	mymap.removeLayer(currentAcc);
  	}

    var radius = e.accuracy / 2;

    currentLoc = L.marker(e.latlng).addTo(mymap)
        .bindPopup("You are within " + radius + " meters from this point");
	//console.log("Current Loc");
	//console.log(currentLoc);

    currentAcc = L.circle(e.latlng, radius).addTo(mymap);
	
	// this point should always check for distance to clues
	checkDistance(clueOne, 100);
	checkDistance(clueTwo, 100);
}

function onLocationError(e) {
    alert(e.message);
}

function returnLength(arLL) {
    var total=0;

    for (var i=1;i<arLL.length;i++) {
        total = total + arLL[i-1].distanceTo(arLL[i]);
    }

    return total;

}

function getDistance(origin, destination) {
    // return distance in meters
    var lon1 = toRadian(origin[1]),
        lat1 = toRadian(origin[0]),
        lon2 = toRadian(destination[1]),
        lat2 = toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
}
function toRadian(degree) {
    return degree*Math.PI/180;
}

function returnClosestlayer(inClue) {

	console.log(inClue);
	console.log(currentLoc);
	var nearest = L.GeometryUtil.closestLayer(mymap, inClue, currentLoc);
	console.log(nearest);
	
    nearest.distance = currentLoc.distanceTo(nearest.latlng);
    nearest.bearing = L.GeometryUtil.bearing(currentLoc, nearest.latlng);
    if (nearest.bearing<0){
        nearest.bearing = nearest.bearing+360;
    }
    nearest.att = nearest.layer.feature.properties;
	console.log(nearest)
    return nearest;
}

