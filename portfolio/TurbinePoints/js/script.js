var mymap;
var lyrOSM;
var lyrPubs;
var lyrSearch;
var lyrMarkerCluster;
var lyrPubHeat
var mrkCurrentLocation;
var popZocalo;
var fgpDrawnItems;
var fgpDrawnItemsBuff;
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
var pntBuff;

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
var multiBufferPoints;

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

    fgpDrawnItems = new L.FeatureGroup();
    fgpDrawnItems.addTo(mymap);
    
    fgpDrawnItemsBuff = new L.FeatureGroup();
    fgpDrawnItemsBuff.addTo(mymap);
    

    // ********* Setup Layer Control  ***************

    objBasemaps = {
        "Open Street Maps": lyrOSM,
        "Topo Map":lyrTopo,
        "Imagery":lyrImagery,
        "Outdoors":lyrOutdoors,
        "Watercolor":lyrWatercolor
    };
    
    objOverlays = {
        "Drawn Items":fgpDrawnItems,
        "Buffers":fgpDrawnItemsBuff
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
            featureGroup:fgpDrawnItems,
            remove:false
        }
    });
    ctlDraw.addTo(mymap);

    mymap.on('draw:created', function(e){
        
     
        if (mymap.hasLayer(multiBufferPoints)) {
            mymap.removeLayer(multiBufferPoints);
            console.log("Layer here");
        }
		
            
        fgpDrawnItems.addLayer(e.layer);
		
        var lt = e.layer.getLatLng().lat;
        var ln = e.layer.getLatLng().lng;
        arPubll.push([ln,lt]);   
        /*console.log(arPubll);*/
        
        var pointTest3 = turf.multiPoint(arPubll);
        var pointTest31 = turf.multiPoint([[-3.212549, 55.946015],[-3.195523, 55.940343]]);
        console.log(pointTest3);
        console.log(pointTest31);
        
        var bufferedTest3 = turf.buffer(pointTest3, 3, 'kilometers')
        
        multiBufferPoints = L.geoJSON(bufferedTest3, {style:{color:'red', dashArray:'5,5', fillOpacity:0}}).addTo(mymap);

        pntBuff = turf.buffer(e.layer.toGeoJSON(), 0.7, 'kilometers');
        pntBuff = L.geoJSON(pntBuff, {style:{color:'blue', dashArray:'5,5', fillOpacity:0}}).addTo(mymap);
        
        /*fgpDrawnItemsBuff.addLayer(multiBufferPoints);*/
		fgpDrawnItemsBuff.addLayer(pntBuff);
        fgpDrawnItemsBuff.bringToFront();
        fgpDrawnItems.bringToFront();
        
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


//  ***********  General Functions *********

