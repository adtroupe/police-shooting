
var map;
// Function to draw your map
var drawMap = function() {

// Create map and set view
// Create a tile layer variable using the appropriate url
// Add the layer to your map
// Execute your function to get data
	map = L.map('container').setView([39.50, -98.35], 4);
	var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
	layer.addTo(map);

	getData();






}

// Function for getting data
var getData = function() {

// Execute an AJAX request to get the data in data/response.js
// When your request is successful, call your customBuild function
	var data;
	$.ajax({
		url: 'data/response.json',
		type: "get",
		success: function(dat) {
			data = dat;
			customBuild(data);
		},
		dataType: "json"
	})

}

// Loop through your data and add the appropriate layers and points
var customBuild = function(data) {
// Be sure to add each layer to the map
	var unknown = new L.LayerGroup([]);
	var white = new L.LayerGroup([]);
	var black = new L.LayerGroup([]);
	var asian = new L.LayerGroup([]);
	var amIndian = new L.LayerGroup([]);
	var island = new L.LayerGroup([]);


	for (var i = 0; i < data.length; i++) {
		var race = data[i].Race;
		var lat = data[i].lat;
		var lng = data[i].lng;
		var txt = data[i].Summary;
		var outcome = data[i]['Hit or Killed?'];
		var circle = new L.circleMarker([lat, lng], 3);
		circle.bindPopup(txt);
		// if (outcome == 'Killed') {
		// 	circle.css('fill', 'red');
		// } else {
		// 	circle.attr('fill', 'black');
		// }


		if(race == 'White') {
			circle.addTo(white);
		} else if(race == 'Black or African American') {
			circle.addTo(black);
		} else if(race == 'Asian') {
			circle.addTo(asian);
		} else if(race == 'American Indian or Alaska Native') {
			circle.addTo(amIndian);
		} else if(race == 'Native Hawaiian or Other Pacific Islander') {
			circle.addTo(island);
		} else {
			circle.addTo(unknown);
		}
	}

	unknown.addTo(map);
	white.addTo(map);
	black.addTo(map);
	asian.addTo(map);
	amIndian.addTo(map);
	island.addTo(map);

// Once layers are on the map, add a leaflet controller that shows/hides layers

	var overlays = {
		"White": white,
		"Black or African American": black,
		"Asian": asian,
		"American Indian or Alaska Native": amIndian,
		"Native Hawaiian or Pacific Islander": island,
		"Unknown": unknown
	}

	L.control.layers(null, overlays).addTo(map);

}


