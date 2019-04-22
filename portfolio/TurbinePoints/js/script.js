var mymap;
var lyrOSM;
var ctlAttribute;
var ctlScale;
var ctlZoom;
var ctlMouseposition;
var ctlEasybutton;
var ctlSidebar;
var ctlLayers;
var ctlDraw;
var ctlStyle;
var objBasemaps;
var objOverlays;
var icnBeer;
var arPubNames = [];
var arPubll = [];
var arTestPubll = [];
var impactPntBuff;

var pointTestGroup;
var pointTestCombined;
var bufferedTest1;
var bufferedTest2;
/*var bufferedTest3;*/
var bufferedTestGroup;
var pointTest1;
var pointTest2;
/*var pointTest3;*/
var pntsAR = [];
var multiBufferPoly;

var fgpPointLoc;
var fgpStudyPointBuff;
var fgpImpactPointBuff;





$(document).ready(function(){
    
    //  ********* Map Initialization ****************

    mymap = L.map('mapdiv', {center:[55.94036, -3.19084], zoom:12, attributionControl:false});

    ctlSidebar = L.control.sidebar('side-bar',{closebutton: 'true'}).addTo(mymap);

    ctlEasybutton = L.easyButton('glyphicon-transfer', function(){
       ctlSidebar.toggle(); 
    }, 'Toggle Side Bar', 'btnSideBar').addTo(mymap);
    
    ctlAttribute = L.control.attribution().addTo(mymap);
    ctlAttribute.addAttribution('OSM');
    ctlAttribute.addAttribution('&copy; <a href="https://polymapper.github.io">PloyMapper</a>');

    ctlScale = L.control.scale({position:'bottomleft', metric:false, maxWidth:200}).addTo(mymap);
    
    ctlMouseposition = L.control.mousePosition().addTo(mymap);
    
    
    
    //   *********** Layer Initialization **********

    lyrOSM = L.tileLayer.provider('OpenStreetMap.Mapnik');
    lyrTopo = L.tileLayer.provider('OpenTopoMap');
    lyrImagery = L.tileLayer.provider('Esri.WorldImagery');
    lyrOutdoors = L.tileLayer.provider('Thunderforest.Outdoors');
    lyrWatercolor = L.tileLayer.provider('Stamen.Watercolor');
    mymap.addLayer(lyrOSM);

    fgpPointLoc = new L.FeatureGroup();
    fgpPointLoc.addTo(mymap);
    
    fgpStudyPointBuff = new L.FeatureGroup();
    fgpStudyPointBuff.addTo(mymap);
	
	fgpImpactPointBuff = new L.FeatureGroup();
    fgpImpactPointBuff.addTo(mymap);
	
	lyrSPA = L.geoJSON.ajax('data/EdinburghSPA_WGS84.geojson',{style:{color:'yellow', dashArray:'5,5', fillOpacity:0},onEachFeature:processSPA}).addTo(mymap);
	console.log(lyrSPA);
	
	
	/*lyrSPA.bindPopup("SPA");*/
	lyrSPA.bringToFront();
	

    // ********* Setup Layer Control  ***************

    objBasemaps = {
        "Open Street Maps": lyrOSM,
        "Topo Map":lyrTopo,
        "Imagery":lyrImagery,
        "Outdoors":lyrOutdoors,
        "Watercolor":lyrWatercolor
    };
    
    objOverlays = {
        "Turbine Points":fgpPointLoc,
        "Buffers":fgpStudyPointBuff,
		"Impacted Area": fgpImpactPointBuff
    };
    
    ctlLayers = L.control.layers(objBasemaps, objOverlays).addTo(mymap);
    
    // **********  Setup Draw Control ****************

    ctlDraw = new L.Control.Draw({
        draw:{
            polyline:false,
            polygon:false,
            circle:false,
            rectangle:false,
        },
        edit:{
            featureGroup:fgpPointLoc,
            remove:false
        }
    });
    ctlDraw.addTo(mymap);

    mymap.on('draw:created', function(e){
        
     
        if (mymap.hasLayer(fgpStudyPointBuff)) {
			fgpStudyPointBuff.clearLayers();

        }
		
		/*call a function that collects the highest array value*/
		/*the high array value for the single points and buffers*/
        
		/*add the point to the group to allow for turning off and on*/
        fgpPointLoc.addLayer(e.layer);
		
		/*get the lat and lon of the point*/
		getLatLn(e);   
        
		/*create a multipoint feature from the lat ln array*/
        var pointLocGroup = turf.multiPoint(arPubll);
        
		/*create buffer from the multipoint*/
		/*This allows the buffer to be dissolved*/
        var pointLocGroupBuf = turf.buffer(pointLocGroup, 3, 'kilometers')
		
		/*calculate area*/
        var area = calcArea(pointLocGroupBuf);
		
		/*intersect*/
		var intStudyArea = intersectPolyByPolyFC(pointLocGroupBuf, lyrSPA.toGeoJSON());
		
		L.geoJSON(intStudyArea, {style:{color:'red', weight:5}}).addTo(mymap);
		
		/*style the dissolved buffer*/
        pointLocGroupBuf = L.geoJSON(pointLocGroupBuf, {style:{color:'red', dashArray:'5,5', fillOpacity:0}})
		
		/*determine tooltip*/
		console.log(intStudyArea.features.length);
		
		if (intStudyArea.features.length > 0) {
			var ttSPA = "<h4> Study Area</h4> <br> AREA: "+area+"km sq <br> INTERSECTS: SPA"
		}
		else{
			var ttSPA = "<h4> Study Area</h4> <br> AREA: "+area+"km sq"
		}
		
		pointLocGroupBuf.bindTooltip(ttSPA).addTo(mymap);
		
		/*add to map*/
		fgpStudyPointBuff.addLayer(pointLocGroupBuf);
		fgpStudyPointBuff.bringToFront();
		
		
		
		/*create a buffer around the point but not dissolved*/
        impactPntBuff = turf.buffer(e.layer.toGeoJSON(), 0.7, 'kilometers');
		
		var impactArea = calcArea(impactPntBuff);
		
        impactPntBuff = L.geoJSON(impactPntBuff, {style:{color:'blue', dashArray:'5,5', fillOpacity:0}});
		
		impactPntBuff.bindTooltip("<h4>Hight Impact Area</h4> <br> AREA: "+impactArea+"km sq").addTo(mymap);
		
		fgpImpactPointBuff.addLayer(impactPntBuff);
		
        fgpImpactPointBuff.bringToFront();

		
		

	
        
    });
    
});




// *********  Pub Functions *****************

// loop each element of the layer
function processPoint(json, lyr){
    
   /*create an array of x and y*/
   /*the 3 is there to increase intensity, would work without it*/
    var lt = lyr.getLatLng().lat;
    var ln = lyr.getLatLng().lng;
    arPubll.push([lt,ln,3]);
     
}

function getLatLn(e) {
	var lt = e.layer.getLatLng().lat;
	var ln = e.layer.getLatLng().lng;
	arPubll.push([ln,lt]);
}

function calcArea(poly) {
	return (turf.area(poly)/1000000).toFixed(2);
}

function processSPA(json, lyr){
	var att = json.properties;
	lyr.bindTooltip("<h4>Name: "+att.NAME);
}
//  ***********  General Functions *********

function intersectPolyByPolyFC(poly, fcPoly) {
	console.log("Here 1");
	var fgp = [];
	var bbPoly = turf.bboxPolygon(turf.bbox(poly));
	for (var i=0;i<fcPoly.features.length;i++) {
		var bb = turf.bboxPolygon(turf.bbox(fcPoly.features[i]));
		if (turf.intersect(bbPoly, bb)) {
			console.log("Im here")
			var int = turf.intersect(poly, fcPoly.features[i]);
			if (int) {
				int.properties = fcPoly.features[i].properties;
				fgp.push(int);
			}
		}
	}
	return turf.featureCollection(fgp);
}