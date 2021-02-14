$(document).ready(function() {
    buildMap();

    // event listener
    $("#timeframe").change(function() {
        buildMap();
    });
});

function buildMap() {
    // data
    // set title
    var change_text = $("#timeframe option:selected").text();
    $("#maptitle").text(`All Earthquakes Recorded by the USGS for the ${change_text}`);


    var timeframe = $("#timeframe").val();
    var queryUrl = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${timeframe}.geojson`

    // Perform a GET request
    $.ajax({
        type: "GET",
        url: queryUrl,
        success: function(data) {
            // make second call
            $.ajax({
                type: "GET",
                url: "/SMU_Homework_Sept2020/17-Mapping-Web/Instructions/Submissions/static/data/PB2002_boundaries.json",
                success: function(plates) {
                    //BUILDING 2 DATASETS
                    makeMap(data, plates);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert("Status: " + textStatus);
                    alert("Error: " + errorThrown);
                }
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });
}

function makeMap(data, plates) {
    $("#mapcontainer").empty();
    $("#mapcontainer").append(`<div id="mapid"></div>`);

    // Step 0: Create the Tile Layers

    var dark = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    });

    var light = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

    // STEP 1: INIT MAP
    // Create map object
    var myMap = L.map("mapid", {
        center: [33.0, -96.0],
        zoom: 2,
        layers: [light, dark]
    });

    //Step 2:  Markers
    var earthquakes = [];
    var circle_list = [];
    data.features.forEach(function(earthquake) {
        var marker = L.geoJSON(earthquake, {
            onEachFeature: onEachFeature
        });
        earthquakes.push(marker);

        var circle = L.geoJSON(earthquake, {
            pointToLayer: function(feature, latlng) {
                var geojsonMarkerOptions = createMarkerOptions(feature);
                return L.circleMarker(latlng, geojsonMarkerOptions);
            },
            onEachFeature: onEachFeature
        });
        circle_list.push(circle);
    });

    // tectonic plates
    var tectonic_plates = L.geoJSON(plates, {
        color: "purple",
        weight: 3
    });


    var marker_group = L.layerGroup(earthquakes);
    var marker_group2 = L.layerGroup(circle_list);
    var tectonic_layer = L.layerGroup([tectonic_plates]);

    //STEP 3: Create Layers

    var baseMaps = {
        "Light Mode": light,
        "Dark Mode": dark
    };

    var overlayMaps = {
        "Markers": marker_group,
        "Circles": marker_group2,
        "Tectonic Plates": tectonic_layer
    };

    // put Layer Legend on map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // add layers pre-clicked to map
    tectonic_plates.addTo(myMap);
    marker_group2.addTo(myMap);

    // Step 4: CREATE LEGEND

    // Slegend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        // legend as raw html
        var legendInfo = `<h4 style = "margin-bottom:10px"> Earthquake Depth </h4>
        <div>
        <div style = "background:#98ee00;height:10px;width:10px;display:inline-block"> </div> 
        <div style = "display:inline-block"> Less than 10 Miles</div>
        </div> 
        <div>
        <div style = "background:#d4ee00;height:10px;width:10px;display:inline-block"></div> 
        <div style = "display:inline-block">10 - 30 Miles</div>
        </div>
        <div>
        <div style = "background:#eecc00;height:10px;width:10px;display:inline-block"></div>
        <div style = "display:inline-block">30 - 50 Miles</div>
        </div>
        <div>
        <div style = "background:#ee9c00;height:10px;width:10px;display:inline-block"></div> 
        <div style = "display:inline-block">50 - 70 Miles</div>
        </div>
        <div>
        <div style = "background:#ea822c;height:10px;width:10px;display:inline-block"></div>
        <div style = "display:inline-block">70 - 90 Miles</div>
        </div> 
        <div>
        <div style = "background:#ea2c2c;height:10px;width:10px;display:inline-block"></div>
        <div style = "display:inline-block">Greater than 90 Miles</div>
        </div>`;

        div.innerHTML = legendInfo;
        return (div)
    }

    // Add legend to map
    legend.addTo(myMap);

}

function createMarkerOptions(feature) {
    var depth = feature.geometry.coordinates[2];
    var depthColor = "";
    if (depth > 90) {
        depthColor = "#ea2c2c";
    } else if (depth > 70) {
        depthColor = "#ea822c";
    } else if (depth > 50) {
        depthColor = "#ee9c00";
    } else if (depth > 30) {
        depthColor = "#eecc00";
    } else if (depth > 10) {
        depthColor = "#d4ee00";
    } else {
        depthColor = "#98ee00";
    }


    var geojsonMarkerOptions = {
        radius: (feature.properties.mag * 5) + 1,
        fillColor: depthColor,
        color: "#000",
        weight: 1,
        opacity: 2,
        fillOpacity: .7
    };

    return (geojsonMarkerOptions)
}

// called in the create circles
function onEachFeature(feature, layer) {

    if (feature.properties && feature.properties.place) {
        layer.bindPopup(feature.properties.title);
    }
}