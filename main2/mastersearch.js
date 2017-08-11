/*
	getParameterByName() Summary =============================
	Performs regex of URL query string and extracts values and stores as variables	

*/
function getParameterByName(name, url) {

    if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");

    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
	
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}






/*
	locationSearch() Summary =============================

	This function takes user input for location and distance and returns bicycle shops that are within the distance radius that the user supplied.
	The bicycle shops are then displayed in a table detailing various inromation.

*/
function locationSearch() {

	var autoCompleteForm = document.getElementById('location-form');
	var userLocation 	 = document.getElementById('user-location');
	var userDistance 	 = document.getElementById('distance-option');

	// Checks to see If search form exists 
	if (autoCompleteForm) {		

		document.querySelector('form span').style.visibility = "hidden";

		// Google autocomplete restriced to UK only
		var options = {
		   types: ['(regions)'],
		   componentRestrictions: { country: 'gb' }
		};

		var autocomplete = new google.maps.places.Autocomplete(userLocation, options);

		// Values of autocomplete form for location and chosen distance
		var userAddressEntry  = userLocation.value;
		var userDistanceEntry = userDistance.value;
	

		// If the user has entered a location and distance values will be passed into the url
		if (userAddressEntry && userDistanceEntry) {
			
			var data =  "https://maps.googleapis.com/maps/api/geocode/json?address=" + userAddressEntry + "&key=" + apiKey + "";
			
			console.log("User Location = " + userAddressEntry);
			console.log("User Distance = " + userDistanceEntry);
		}

		// Returns JSON object from the above URL 
		$.getJSON(data, function (json) {

			// Full Results object
			var results = json.results;

			// Loops through results object and sets latitude and longitude			
			for (var i = 0; i < results.length; i++) {

				var coords = results[i].geometry.location;

				// Latitude and Longitude of Coordinates from a user's location
				var latitude  = coords.lat;
				var longitude = coords.lng;
			}
			
			console.log("Latitude of user's location = " + latitude.toString());
			console.log("Longitude of user's location = " + longitude.toString());
				
			/*
				Parameters that will generate a list of bicycle shops near to the location of the user based on the selected distance
				radius: - Set by the select option in the form
				Location - search results near users locatoin
				rankBy - distance
				type - all shops listed as bicycle _store
			*/
			var request = {
				location: new google.maps.LatLng(latitude, longitude),
				radius: userDistanceEntry,
				type: ['bicycle_store']
			}

			// Renders the results to a node element div
			var service = new google.maps.places.PlacesService(document.createElement('div')); 
		  	service.nearbySearch(request, resultsTable);

		  	function resultsTable(results, status) {
		  		
		  		if (status == google.maps.places.PlacesServiceStatus.OK) {
					console.log(results);

					var output = '';

		    		for (var i = 0; i < results.length; i++) {	      		

		      			// All place ID's returned from search
		      			var shopName 	 = results[i].name;
		      			var shopVicinity = results[i].vicinity;
		      			var placeId  	 = results[i].place_id;
		      			
		      			// Results returned as a sting
		      			output += 	'<tr>' +
										'<td>' + shopName +'</td>' +
										'<td><a href="shop-information.php?shopname=' + shopName + '&shopid=' + placeId + '&address=' + shopVicinity + '" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Buy Now</a></td>' +
									'</tr>';

						// Appends results string to the table on the results page
						if (output) {
							document.getElementById('maintable').innerHTML = output;
						};
					}
				}
			}			
		})
	}
}




	

/*
	shopDetails() Summary =============================

	

*/
function shopDetails() {

	var resultsContainer = document.getElementById('shop-details-page-container');


	if (resultsContainer) {

		// Query string parameter values
		var shopName = getParameterByName('shopname');
		var shopId   = getParameterByName('shopid');

		// Init varibles for html string that will be appended to the page			
		var openingTimeOutput = '';
		var shopDetails		  = '';
		var GSdata = '';



		// Renders the results to a node div element 
		var service = new google.maps.places.PlacesService(document.createElement('div'));

		// Retreives the details of the shop using the ID
	    service.getDetails({

	    	placeId: shopId

		}, function(place, status) {
	  		if (status === google.maps.places.PlacesServiceStatus.OK) {
	  			//console.log(place)

	  			// Assign the data retrieved to variables to be used below. First test whether there is data by checking the node has a property
	  			if (place.hasOwnProperty('name')) { var shopName = place.name.toLowerCase(); }
	  			if (place.hasOwnProperty('formatted_address')) { var formattedAddress = place.formatted_address.toLowerCase(); }
	  			if (place.hasOwnProperty('formatted_phone_number')) { var formattedPhone = place.formatted_phone_number; }
	  			if (place.hasOwnProperty('opening_hours') && place.opening_hours.hasOwnProperty('open_now')) { var openNow = place.opening_hours.open_now; }	      			
	  			if (place.hasOwnProperty('rating')) {  var rating = place.rating; }
	  			if (place.hasOwnProperty('website')) { var website = place.website; }	      			
	  			if (place.hasOwnProperty('opening_hours')) { var monday = place.opening_hours.weekday_text[0]; }else { var monday = 'Monday: -'; }
	  			if (place.hasOwnProperty('opening_hours') && place.opening_hours.hasOwnProperty('weekday_text')) { var tuesday   = place.opening_hours.weekday_text[1]; }else { var monday = 'Tuesday: -'; }
	  			if (place.hasOwnProperty('opening_hours') && place.opening_hours.hasOwnProperty('weekday_text')) { var wednesday = place.opening_hours.weekday_text[2]; }else { var monday = 'Wednesday: -'; }
	  			if (place.hasOwnProperty('opening_hours') && place.opening_hours.hasOwnProperty('weekday_text')) { var thursday  = place.opening_hours.weekday_text[3]; }else { var monday = 'Thursday: -'; }	      			
	  			if (place.hasOwnProperty('opening_hours') && place.opening_hours.hasOwnProperty('weekday_text')) { var friday    = place.opening_hours.weekday_text[4]; }else { var monday = 'Friday: -'; }
	  			if (place.hasOwnProperty('opening_hours') && place.opening_hours.hasOwnProperty('weekday_text')) { var saturday  = place.opening_hours.weekday_text[5]; }else { var monday = 'Saturday: -'; }
	  			if (place.hasOwnProperty('opening_hours') && place.opening_hours.hasOwnProperty('weekday_text')) { var sunday    = place.opening_hours.weekday_text[6]; }else { var monday = 'Sunday: -'; }
				if (place.hasOwnProperty('url')) { var mapUrl = place.url; }

				// lat and Lng for map center and position of marker
				if (place.geometry.location) { var latitude  = place.geometry.location.lat(); }
				if (place.geometry.location) { var longitude = place.geometry.location.lng(); }

				// Initilise Map
			 	map = new google.maps.Map(document.getElementById('map'), {
	  				center: { lat: latitude, lng: longitude },
	  				scrollwheel: false,
	  				zoom: 17
				});

				// Place marker on map
				var marker = new google.maps.Marker({
					position: { lat: latitude, lng: longitude},
					map: map
				});

				// Data that is returned
/*				console.log("GM Longitude: " + place.geometry.location.lng());
				console.log("GM Latitude: "  + place.geometry.location.lat());
	  			console.log("GM Shop: " 	  + shopName);
	  			console.log("GM Address: "   + formattedAddress);
	  			console.log("GM Phone: " 	  + formattedPhone);
	  			console.log("GM open Now: "  + openNow);
	  			console.log("GM Rating: " 	  + rating);
	  			console.log("GM Website: "   + website);
	  			console.log("GM Map URL: "   + mapUrl);
	  			console.log("GM Monday: " 	  + monday);
	  			console.log("GM tuesday: "   + tuesday);
	  			console.log("GM wednesday: " + wednesday);
	  			console.log("GM thursday: "  + thursday);
	  			console.log("GM friday: " 	  + friday);
	  			console.log("GM saturday: "  + saturday);
	  			console.log("GM sunday: " 	  + sunday);*/

	  			// Meta Data
	  			document.title = shopName + ' | ' + formattedAddress + ' | ' + formattedPhone;


  			
	  			googleSheetsData(shopName, formattedAddress) 


				/*				
				// Opening Times
				openingTimeOutput 	+=	'<div>' +
											'<h4>Opening Times</h4>' +
											'<ul>' +
												'<li>' + monday +'</li>' +
												'<li>' + tuesday +'</li>' +
												'<li>' + wednesday +'</li>' +
												'<li>' + thursday +'</li>' +
												'<li>' + friday +'</li>' +
												'<li>' + saturday +'</li>' +
												'<li>' + sunday +'</li>' +
											'</ul>' +
										'</div>';

				// Main shop details
				shopDetails 		+= 	'<div>' +
											'<h4>' + shopName + '</h4>' +
										'</div>' +
										'<div class="shop-address">' +
											'<p>' + formattedAddress + '</p>' +
										'</div>';
				
				// Appends strings to html
				if (openingTimeOutput) {
					document.getElementById('opening-times').innerHTML = openingTimeOutput;
				};

				if (shopDetails) {
					document.getElementById('shop-details').innerHTML = shopDetails;
				};
				*/

				
				//shopRating(rating);
	  		}
		});
	};
}












function googleSheetsData(shopName, formattedAddress) {	

	// URL of data stored in google sheets.  Contains additional infomration such as servicing prices, socila media channels
	var url	= "https://spreadsheets.google.com/feeds/list/1DgePfAxco-xVy2VdrfxkyPs3W1R5ZL5B-7zKgVf8DzI/od6/public/values?alt=json";

 	$.ajax({
 		url: url,
 		dataType: 'json',
 		success: function (GSdata) { 		
			compareResults(GSdata, shopName, formattedAddress); 		
 		}
 	});
}




function compareResults(GSdata, shopName, formattedAddress) {

	if (GSdata && shopName && formattedAddress) {
		

		var gsResults = GSdata.feed.entry;

		
		for (var i = 0; i < gsResults.length; i++) {

			var shopNameGS			  = gsResults[i].gsx$shopname.$t.toLowerCase();
			var shopDescriptionGS 	  = gsResults[i].gsx$description.$t;
			var shopCountyGS 		  = gsResults[i].gsx$county.$t;
			var shopPostCodeGS 	      = gsResults[i].gsx$postcode.$t.toLowerCase();
			var shopBasicServiceGS    = gsResults[i].gsx$basicservice.$t;
			var shopStandardServiceGS = gsResults[i].gsx$standardservice.$t;
			var shopFullServiceGS     = gsResults[i].gsx$fullservice.$t;
			var shopFacebookGS     	  = gsResults[i].gsx$facebook.$t;
			var shopTwitterGS     	  = gsResults[i].gsx$twitter.$t;
			
			
			if (shopNameGS == shopName && formattedAddress.includes(shopPostCodeGS)) {
				console.log("============= We have a match =============")
				console.log("GS Name: " + shopName);
				console.log("GS Description: " + shopDescriptionGS);
				console.log("GS County: " + shopCountyGS);
				console.log("GS Post Code: " + shopPostCodeGS);
				console.log("GS Basic Service: " + shopBasicServiceGS);
				console.log("GS Standard Service: " + shopBasicServiceGS);
				console.log("GS Full Service: " + shopFullServiceGS);
				console.log("GS Facebook: " + shopFacebookGS);
				console.log("GS Twitter: " + shopTwitterGS);
			};
		};		
	}	
}