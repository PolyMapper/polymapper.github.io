var mymap;
var lyrOSM;
var lyrPubs;
var lyrSearch;
var lyrMarkerCluster;
var mrkCurrentLocation;
var popZocalo;
var fgpDrawnItems;
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

$(document).ready(function(){
    
    //  ********* Map Initialization ****************

    mymap = L.map('mapdiv', {center:[55.94036, -3.19084], zoom:12, attributionControl:false});

    ctlSidebar = L.control.sidebar('side-bar').addTo(mymap);

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
    
    /*icnBeer = L.icon({iconUrl:'img/Beer.png', iconSize:[40,40], iconAnchor:[20,24]});*/
    
    
    lyrMarkerCluster = L.markerClusterGroup();
    lyrPubs = L.geoJSON.ajax('data/EdinburghPubs.geojson', {pointToLayer:returnPubMarker, onEachFeature:processPub});
    lyrPubs.on('data:loaded', function(){
        arPubNames.sort();
        /*console.log(arPubNames)*/
        console.log("In Data Loaded");
        $("#txtFindPub").autocomplete({
            source:arPubNames,
            // on select of automcomplete complete the function
            select: function (event, ui) {
                if (ui.item.label) {
                    ui.item.label
                    $('#txtFindPub').val(ui.item.label);
                    var val = $("#txtFindPub").val();
                    testLayerAttribute(arPubNames, val, "Pub Name", "#divFindPub", "#divPubError", "#btnFindPub")
                }
                
                return false;
            }
        });
        console.log("Finished Auto Complete")
        lyrMarkerCluster.addLayer(lyrPubs);
        lyrMarkerCluster.addTo(mymap);
    });
    


    /*console.log(arPubNames)*/;
    
    // ********* Setup Layer Control  ***************

    objBasemaps = {
        "Open Street Maps": lyrOSM,
        "Topo Map":lyrTopo,
        "Imagery":lyrImagery,
        "Outdoors":lyrOutdoors,
        "Watercolor":lyrWatercolor
    };
    
    objOverlays = {
        "Pubs":lyrPubs,
        "Drawn Items":fgpDrawnItems
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
        var llRef = e.layer.getLatLng();
        var strTable = "<table class='table table-hover'>";
        strTable += "<tr><th>Type</th><th>Name</th><th>Distance</th><th>Direction</th></tr>";
        var nrPub= returnClosestlayer(lyrPubs, llRef);
        strTable += "<tr><td>Pub</td><td>"+nrPub.att.name+"</td><td>"+nrPub.distance.toFixed(0)+" m</td><td>"+nrPub.bearing.toFixed(0)+"</td></tr>";
        strTable += "</table>";
        fgpDrawnItems.addLayer(e.layer.bindPopup(strTable, {maxWidth:400}));
    });
    
});




// *********  Pub Functions *****************
function returnPubMarker(json, latlng){
    var att = json.properties;
/*    var clrMrk = 'chartreuse';
    
    return L.circle(latlng, {radius:10, color:clrMrk,fillColor:'chartreuse', fillOpacity:0.5}).bindTooltip("<h4>Pub Name: "+att.name+"</h4>");*/
    
    var icnBeer = L.icon({iconUrl:'img/Beer.png', iconSize:[40,40], iconAnchor:[20,24]});
    return L.marker(latlng, {icon:icnBeer}).bindTooltip("<h4>Pub Name: "+att.name+"</h4>");   
}

// loop each element of the layer
function processPub(json, lyr){
    var att = json.properties;
    lyr.bindTooltip("<h4>Pub Name: "+att.name+"</h4>");
    /*lyr.bindPopup("<h4>Pub Name: "+att.name+"</h4>");*/
    arPubNames.push(att.name.toString());
}

    

$("#txtFindPub").on('keyup paste', function(){
    console.log('textbox has been pinged');
    var val = $("#txtFindPub").val();
    testLayerAttribute(arPubNames, val, "Pub Name", "#divFindPub", "#divPubError", "#btnFindPub");
});

$("#btnFindPub").click(function(){
    var val = $("#txtFindPub").val();
    var lyr = returnLayerByAttribute(lyrPubs,'name',val);
    if (lyr) {
        if (lyrSearch) {
            lyrSearch.remove();
        }
        
        // invisible marker
        var geojsonMarkerOptions = {
            radius: 30,
            fillColor: "red",
            color: "#000",
            weight: 1,
            opacity: 0,
            fillOpacity: 0
        };
        
        lyrSearch = L.geoJSON(lyr.toGeoJSON(), {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(mymap);
        
        var att = lyr.feature.properties;
        
        // add popup
        lyrSearch.bindPopup("<h4>Pub Name: "+att.name+"</h4>");
        lyrSearch.openPopup()
        
        // zoom to
        /*mymap.fitBounds(lyr.getBounds().pad(1));*/
        mymap.flyTo(lyr.getLatLng(), 19)
        /*var att = lyr.feature.properties;*/
        
        // update details in textbox
        $("#divPubData").html("<h4 class='text-center'>Pub Details</h4><h5>name: "+att.name+"</h5>");
        
        
        $("#divPubError").html("");
    
    } else {
        $("#divPubError").html("**** Pub not found ****");
    }
    console.log('Button has been clicked');
});

//  ***********  General Functions *********

function LatLngToArrayString(ll) {
    return "["+ll.lat.toFixed(5)+", "+ll.lng.toFixed(5)+"]";
}

function returnLayerByAttribute(lyr,att,val) {
    var arLayers = lyr.getLayers();
    for (i=0;i<arLayers.length-1;i++) {
        var ftrVal = arLayers[i].feature.properties[att];
        if (ftrVal==val) {
            return arLayers[i];
        }
    }
    return false;
}

function testLayerAttribute(ar, val, att, fg, err, btn) {
    if (ar.indexOf(val)<0) {
        $(fg).addClass("has-error");
        $(err).html("**** "+att+" NOT FOUND ****");
        $(btn).attr("disabled", true);
    } else {
        $(fg).removeClass("has-error");
        $(err).html("");
        $(btn).attr("disabled", false);
    }
}

/*calculating distance*/

function returnLength(arLL) {
    var total=0;

    for (var i=1;i<arLL.length;i++) {
        total = total + arLL[i-1].distanceTo(arLL[i]);
    }

    return total;

}

function returnMultiLength(arArLL) {
    var total=0;

    for (var i=0; i<arArLL.length;i++) {
        total = total + returnLength(arArLL[i]);
    }

    return total;
}

function returnClosestlayer(lyrGroup, llRef) {
    var arLyrs = lyrGroup.getLayers();
    var nearest = L.GeometryUtil.closestLayer(mymap, arLyrs, llRef);
    nearest.distance = llRef.distanceTo(nearest.latlng);
    nearest.bearing = L.GeometryUtil.bearing(llRef, nearest.latlng);
    if (nearest.bearing<0){
        nearest.bearing = nearest.bearing+360;
    }
    nearest.att = nearest.layer.feature.properties;
    return nearest;
}

