// Function to draw your map
var drawMap = function() {

// Create map and set view
// Create a tile layer variable using the appropriate url
// Add the layer to your map
// Execute your function to get data
	var map = L.map('container').setView([39.50, -98.35], 4);
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
var customBuild = function() {
// Be sure to add each layer to the map

// Once layers are on the map, add a leaflet controller that shows/hides layers

}


