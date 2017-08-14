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

	  			var fullDetails = [];	  			

	  			// Assign the data retrieved to variables to be used below. First test whether there is data by checking the node has a property
	  			if (place.hasOwnProperty('name')) { var shopName = place.name.toLowerCase(); }
	  			if (place.hasOwnProperty('formatted_address')) { var formattedAddress = place.formatted_address.toLowerCase(); }
	  			if (place.hasOwnProperty('formatted_phone_number')) { var formattedPhone = place.formatted_phone_number; }
	  			
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

	  			// Meta Data
	  			document.title = shopName + ' | ' + formattedAddress + ' | ' + formattedPhone;
  				
	  			var fullDetails = place;

  				// Passes array to googleSheetsData() function where it will be compared to find a matching row in google sheets
	  			googleSheetsData(fullDetails)
	  		}
		});
	};
}






/*
	shopDetails() Summary =============================

	Retrieves Google sheets data as json and returns object to compareresults() function.  
	The shop results returned from maps api is also passed into shopDetails() as an array.

*/
function googleSheetsData(fullDetails) {

	// URL of data stored in google sheets.  Contains additional infomration such as servicing prices, socila media channels
	var url	= "https://spreadsheets.google.com/feeds/list/1DgePfAxco-xVy2VdrfxkyPs3W1R5ZL5B-7zKgVf8DzI/od6/public/values?alt=json";

 	$.ajax({
 		url: url,
 		dataType: 'json',
 		success: function (GSdata) { 		
			compareResults(GSdata, fullDetails); 		
 		}
 	});
}






/*
	compareResults() Summary =============================

	

*/
function compareResults(GSdata, fullDetails) {
		
	var googleMapsResults   = fullDetails;
	var googleSheetsResults = GSdata.feed.entry;

	// Checks to see if the results in google sheets are set
	if (googleMapsResults && googleSheetsResults) {

		for (var i = 0; i < googleSheetsResults.length; i++) {			

			var GMshop = googleMapsResults.name.toLowerCase();
			var GSshop = googleSheetsResults[i].gsx$shopname.$t.toLowerCase();

			// Bicycle Shop Post code from both sets of data
			var GMsaddress 	   = googleMapsResults.formatted_address.toLowerCase();
			var GSshopPostCode = googleSheetsResults[i].gsx$postcode.$t.toLowerCase();

			
			// A comparison is made between both sets of data to find matching results using the shop name and the postcode
			if(GMshop == GSshop && GMsaddress.indexOf(GSshopPostCode)) {
				
				// Merges both sets of results
				var finalShopDetails = Object.assign(googleMapsResults, googleSheetsResults[i]);
				
				appendBicycleShopDetails(finalShopDetails);
			}		
		};	
	}
}


/*
	appendBicycleShopDetails() Summary =============================

	

*/
function appendBicycleShopDetails(finalShopDetails) {
	console.log(finalShopDetails);

	// Bicycle shop Inofrmation 
	var name 		= finalShopDetails.name;
	var description	= finalShopDetails.gsx$description.$t;
	var address 	= finalShopDetails.formatted_address;
	var phone 		= finalShopDetails.formatted_phone_number;
	var website		= finalShopDetails.website;
	var rating		= finalShopDetails.rating;
	var open 		= finalShopDetails.opening_hours.open_now;

	console.log(name)
	console.log(description)
	console.log(address)
	console.log(phone)
	console.log(website)
	console.log(rating)
	console.log(open)

	// Service prices
	var basicService 	= finalShopDetails.gsx$basicservice.$t;
	var standardService = finalShopDetails.gsx$standardservice.$t;
	var fullService 	= finalShopDetails.gsx$fullservice.$t;

	console.log(basicService)
	console.log(standardService)
	console.log(fullService)

	// Social 
	var facebook = finalShopDetails.gsx$facebook.$t;
	var twitter	 = finalShopDetails.gsx$twitter.$t;
	
	console.log("Facebook - " + facebook)
	console.log("Twitter - " + twitter)

	console.log("----------------------------------------")
	console.log("Reviews")
	console.log("----------------------------------------")
	for (var i = 0; i < finalShopDetails.reviews.length; i++) {
		
		console.log("Author - " + finalShopDetails.reviews[i].author_name)
		console.log("Rating - " + finalShopDetails.reviews[i].rating)
		console.log("Text - " + finalShopDetails.reviews[i].text)
	};



	var shopPage = document.getElementById('shop-details-page-container');	

	if (shopPage && finalShopDetails) {







		// Elements that will have info appended too
		var openInfo = document.getElementById('opening-times');
		var shopInfo = document.getElementById('shop-info');
		

		var shopDetailsOutput = '';
		var opening 	  	  = '';	
		

		




	};
}


