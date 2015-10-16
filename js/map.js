
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

	var tableInfo = {
		MenArmed: 0,
		MenUnarmed: 0,
		WomenArmed: 0,
		WomenUnarmed: 0
	};

	for (var i = 0; i < data.length; i++) {
		var race = data[i].Race;
		var lat = data[i].lat;
		var lng = data[i].lng;
		var txt = data[i].Summary;
		var outcome = data[i]['Hit or Killed?'];
		var armed = data[i]['Armed or Unarmed?'];
		var gender = data[i]["Victim's Gender"];

		//WORKS HELLA YO
		var circle;
		if (outcome == 'Killed') {
			circle = new L.circleMarker([lat, lng], {
				radius: 7,
				fillColor: "red",
				fillOpacity: 0.3,
				color: "darkred",
				opacity: 0.5
			});
		} else {
			circle = new L.circleMarker([lat, lng], {
				radius: 7,
				fillColor: "darkgray",
				fillOpacity: 0.3,
				color: "black",
				opacity: 0.5
			});
		} 

		if (gender == 'Male' && armed == 'Armed') {
			tableInfo.MenArmed++;
		} else if (gender == 'Male' && armed == 'Unarmed') {
			tableInfo.MenUnarmed++;
		} else if (gender == 'Female' && armed == 'Armed') {
			tableInfo.WomenArmed++;
		} else {
			tableInfo.WomenUnarmed++;
		}

		// MAKES MORE INTUITIVE SENSE, BUT NOT WORKING
		// var circle = new L.circleMarker([lat, lng], {
		// 	radius: 7,
		// 	fillOpacity: 0.3,
		// 	opacity: 0.5,
		// 	className: outcome
		// });
		// $(this).addClass(outcome);
		// $('.Killed').setStyle('fillColor', 'red').setStyle('color', 'darkred');
		// $('.Hit').setStyle('fillColor', 'darkgray').setStyle('color', 'black');

		circle.bindPopup(txt);

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
	
	$('#table').append('<table class="table"></table>');
	var row1 = $('<tr class="container"><td></td><td class="heading">Armed</td><td class="heading">Unarmed</td></tr>');
	$('#table table').append(row1);
	var row2 = $('<tr class="container"><td class="heading">Men</td><td>'+tableInfo.MenArmed+'</td><td>'+tableInfo.MenUnarmed+'</td></tr>');
	$('#table table').append(row2);	
	var row3 = $('<tr class="container"><td class="heading">Women</td><td>'+tableInfo.WomenArmed+'</td><td>'+tableInfo.WomenUnarmed+'</td></tr>');
	$('#table table').append(row3);

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


