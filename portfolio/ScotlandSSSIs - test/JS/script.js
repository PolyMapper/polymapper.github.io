        var map = L.map('map', {
			zoomControl: false,
            center: [55.953082,-3.1944547], 
            zoom: 10
        });


	
        var defaultBase = L.tileLayer.provider('Stamen.TonerLite').addTo(map);

        var baseLayers = {
            'Stamen Toner': defaultBase,
            'USGS TNM': L.tileLayer.provider('USGSTNM'),
            'ESRI Imagery': L.tileLayer.provider('Esri.WorldImagery'),
            'ESRI Ocean Basemap': L.tileLayer.provider('Esri.OceanBasemap'),
            'OSM Topo': L.tileLayer.provider('OpenTopoMap')
        };

        //ESRI ArcGIS layers from Hawaii GIS Program; dynamic layer example
        //Using a relative url to call layer instead of http
        var WaterQualSites = L.esri.dynamicMapLayer({
            url: '//geodata.hawaii.gov/arcgis/rest/services/HumanHealthSafety/MapServer',
            layers: [2],
            useCors: false
        });

        //add popup to Water quality sites dynamic map layer
        WaterQualSites.bindPopup(function(error, featureCollection) {
            if (error || featureCollection.features.length === 0) {
                return false;
            } else {
                return 'Name: ' + featureCollection.features[0].properties.name + '<br>' + 'ID: ' + featureCollection.features[0].properties.identifier;
            }
        });
		

        //Using ESRi to pull layers
		//much slower than the wms links below, but can pull meta deta
		//Country Parks
        var CountParks = L.esri.dynamicMapLayer({
            url: 'https://cagmap.snh.gov.uk/arcgis/rest/services/snh_protected_sites/MapServer',
			layers: [3],
            useCors: false,
			style: function(feature) {
                return {
                    color: '#328000',
                    weight: 2
                }
            }
        });

		
        //add popup to Water quality sites dynamic map layer
        CountParks.bindPopup(function(error, featureCollection) {
            if (error || featureCollection.features.length === 0) {
                return false;
            } else {
                return 'Name: ' + featureCollection.features[0].properties.NAME + '<br>' + 'ID: ' + featureCollection.features[0].properties.PA_CODE ;
            }
        });
		
        var LocNatRes = L.esri.dynamicMapLayer({
            url: 'https://cagmap.snh.gov.uk/arcgis/rest/services/snh_protected_sites/MapServer',
			layers: [5],
            useCors: false
        });
		
        //add popup to Water quality sites dynamic map layer
        LocNatRes.bindPopup(function(error, featureCollection) {
            if (error || featureCollection.features.length === 0) {
                return false;
            } else {
                return 'Name: ' + featureCollection.features[0].properties.NAME + '<br>' + 'ID: ' + featureCollection.features[0].properties.PA_CODE ;
            }
        });


        //Using a relative url to call layer instead of http
		// quicker than using ESRI as no need to load meta data
        var SSSI = L.tileLayer.wms('https://cagmap.snh.gov.uk/arcgis/services/snh_protected_sites/MapServer/WMSServer?', {
            layers: 2,
			transparent: true,
			format: 'image/png'
        });
	
        //Load OSM Buildings then disable it on first load; can only be viewed at certain scales
        var osmb = new OSMBuildings(map).load();
        map.removeLayer(osmb);

        //Overlay grouped layers    
        var groupOverLays = {

            "OSM Bldg Classic": {
                "2.5D Buildings": osmb
            },

            "SNH Data": {
                "Country Parks": CountParks,
				"Local Nature Reserves": LocNatRes,
				"Sites of Special Scientific Interest": SSSI
            }
        };

		
        //add layer switch control
        L.control.groupedLayers(baseLayers, groupOverLays).addTo(map);


        //add scale bar to map
        L.control.scale({
            position: 'bottomleft'
        }).addTo(map);

        // Overview mini map
        var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        });

        var miniMap = new L.Control.MiniMap(Esri_WorldTopoMap, {
            toggleDisplay: true,
            minimized: false,
            position: 'bottomleft'
        }).addTo(map);
		
		//add zoom control with your options
		L.control.zoom({
			 position:'topright'
		}).addTo(map)
		
        //define Drawing toolbar options
        var options = {
            position: 'topright', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
            drawMarker: true, // adds button to draw markers
            drawPolyline: true, // adds button to draw a polyline
            drawRectangle: true, // adds button to draw a rectangle
            drawPolygon: true, // adds button to draw a polygon
            drawCircle: true, // adds button to draw a cricle
            cutPolygon: true, // adds button to cut a hole in a polygon
            editMode: true, // adds button to toggle edit mode for all layers
            removalMode: true, // adds a button to remove layers
        };

        // add leaflet.pm controls to the map
        map.pm.addControls(options);