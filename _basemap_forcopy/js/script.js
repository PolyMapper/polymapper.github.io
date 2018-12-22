
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
