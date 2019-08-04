// Example function to style the isoline polygons when they are returned from the API call
function styleIsolines(feature) {
	// NOTE: You can do some conditional styling by reading the properties of the feature parameter passed to the function
	return {
		color: '#0073d4',
		opacity: 0.5,
		fillOpacity: 0.2
	};
}

// Example function to style the isoline polygons when the user hovers over them
function highlightIsolines(e) {
	// NOTE: as shown in the examples on the Leaflet website, e.target = the layer the user is interacting with
	var layer = e.target;

	layer.setStyle({
		fillColor: '#ffea00',
		dashArray: '1,13',
		weight: 4,
		fillOpacity: '0.5',
		opacity: '1'
	});
}

// Example function to reset the style of the isoline polygons when the user stops hovering over them
function resetIsolines(e) {
	// NOTE: as shown in the examples on the Leaflet website, e.target = the layer the user is interacting with
	var layer = e.target;

	reachabilityControl.isolinesGroup.resetStyle(layer);
}

// Example function to display information about an isoline in a popup when the user clicks on it
function clickIsolines(e) {
	// NOTE: as shown in the examples on the Leaflet website, e.target = the layer the user is interacting with
	var layer = e.target;
	var props = layer.feature.properties;
	var popupContent = 'Mode of travel: ' + props['Travel mode'] + '<br />Range: 0 - ' + props['Range'] + ' ' + props['Range units'] + '<br />Area: ' + props['Area'] + ' ' + props['Area units'] + '<br />Population: ' + props['Population'];
	layer.bindPopup(popupContent).openPopup();
}

// Example function to create a custom marker at the origin of the isoline groups
function isolinesOrigin(latLng, travelMode, rangeType) {
	return L.circleMarker(latLng, { radius: 4, weight: 2, color: '#0073d4', fillColor: '#fff', fillOpacity: 1 });
}


// Create the Leaflet map object
var map = L.map('map', { center:[55.94036, -3.19084], zoom:12, minZoom: 10, zoomDelta: 0.25, zoomSnap: 0 });

// Create a Leaflet tile layer object
var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	minZoom: 3,
	maxZoom: 19
}).addTo(map);

// Add the reachability plugin
var reachabilityControl = L.control.reachability({
	// add settings here
	apiKey: '5b3ce3597851110001cf6248c9f85cae50384963b985be5b9d179444', // PLEASE REGISTER WITH OPENROUTESERVICE FOR YOUR OWN KEY!
	styleFn: styleIsolines,
	mouseOverFn: highlightIsolines,
	mouseOutFn: resetIsolines,
	clickFn: clickIsolines,
	markerFn: isolinesOrigin,
	expandButtonContent: '',
	expandButtonStyleClass: 'reachability-control-expand-button fa fa-bullseye',
	collapseButtonContent: '',
	collapseButtonStyleClass: 'reachability-control-collapse-button fa fa-caret-up',
	drawButtonContent: '',
	drawButtonStyleClass: 'fa fa-pencil',
	deleteButtonContent: '',
	deleteButtonStyleClass: 'fa fa-trash',
	distanceButtonContent: '',
	distanceButtonStyleClass: 'fa fa-road',
	timeButtonContent: '',
	timeButtonStyleClass: 'fa fa-clock-o',
	drivingButtonContent: '',
	drivingButtonStyleClass: 'fa fa-car',
	cyclingButtonContent: '',
	cyclingButtonStyleClass: 'fa fa-bicycle',
	walkingButtonContent: '',
	walkingButtonStyleClass: 'fa fa-male'
}).addTo(map);