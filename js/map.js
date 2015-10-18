
//This is the map variable and the how it is created in the JS.
//Upon adding the map to the page, it calls the getData() function.
var map;
var drawMap = function() {
	map = L.map('container').setView([39.50, -98.35], 4);
	var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
	layer.addTo(map);
	getData();
}

//This function gets the data out of the .json file via an Ajax request
//Upon the retreival success, it calls the customBuild(data) function
var getData = function() {
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

//This function goes through the retreived data and manipulates it, building the cross-tabulation and the map layers
var customBuild = function(data) {
	//These layers are layers of points that correspond to the different suspect races in the data
	var unknown = new L.LayerGroup([]);
	var white = new L.LayerGroup([]);
	var black = new L.LayerGroup([]);
	var asian = new L.LayerGroup([]);
	var amIndian = new L.LayerGroup([]);
	var island = new L.LayerGroup([]);
	//This variable is for tracking each category in the cross-tabulation
	var tableInfo = {
		MenArmed: 0,
		MenUnarmed: 0,
		WomenArmed: 0,
		WomenUnarmed: 0
	};
	//This loop parses through each police shooting entry
	for (var i = 0; i < data.length; i++) {
		var race = data[i].Race;
		var lat = data[i].lat;
		var lng = data[i].lng;
		var txt = data[i].Summary;
		var outcome = data[i]['Hit or Killed?'];
		var armed = data[i]['Armed or Unarmed?'];
		var gender = data[i]["Victim's Gender"];
		//This if else statement create the individual data points
		var circle;
		if (outcome == 'Killed') {
			circle = new L.circleMarker([lat, lng], {
				radius: 8,
				fillColor: "red",
				fillOpacity: 0.3,
				color: "darkred",
				opacity: 0.5
			});
		} else {
			circle = new L.circleMarker([lat, lng], {
				radius: 8,
				fillColor: "darkgray",
				fillOpacity: 0.3,
				color: "black",
				opacity: 0.5
			});
		} 
		//This if else statement determines which category the data falls under for the cross-tabulation and increments the number
		if (gender == 'Male' && armed == 'Armed') {
			tableInfo.MenArmed++;
		} else if (gender == 'Male' && armed == 'Unarmed') {
			tableInfo.MenUnarmed++;
		} else if (gender == 'Female' && armed == 'Armed') {
			tableInfo.WomenArmed++;
		} else {
			tableInfo.WomenUnarmed++;
		}

		circle.bindPopup(txt);
		
		//This adds the circle to the corresponding layer
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

	//This creates and populates the cross-tabulation
	$('#table').append('<table class="table"></table>');
	var row1 = $('<tr class="container"><td></td><td class="heading">Armed</td><td class="heading">Unarmed</td></tr>');
	$('#table table').append(row1);
	var row2 = $('<tr class="container"><td class="heading">Men</td><td>'+tableInfo.MenArmed+'</td><td>'+tableInfo.MenUnarmed+'</td></tr>');
	$('#table table').append(row2);	
	var row3 = $('<tr class="container"><td class="heading">Women</td><td>'+tableInfo.WomenArmed+'</td><td>'+tableInfo.WomenUnarmed+'</td></tr>');
	$('#table table').append(row3);

	//These .addTo functions add the individual race layers to the overall map
	unknown.addTo(map);
	white.addTo(map);
	black.addTo(map);
	asian.addTo(map);
	amIndian.addTo(map);
	island.addTo(map);

	//The following is responsible for creating and adding a leaflet controller that shows/hides layers
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


