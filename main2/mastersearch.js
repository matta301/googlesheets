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
		      			var shopName 	 = results[i].name.toLowerCase();
		      				shopName 	 = shopName.replace(/\s/g,'');

	      				var shop 		 = results[i].name.toLowerCase();
		      			var shopVicinity = results[i].vicinity;
		      			var placeId  	 = results[i].place_id;

		      			// Filter out Sports Direct to not show
		      			var sportsDirect1 = 'sportsdirect';


		      			console.log(shopName)

		      			if (shopName.indexOf(sportsDirect1) == -1) {

		      				// Results returned as a sting
			      			output += 	'<tr>'
									+		'<td>' + shop +'</td>'
									+		'<td><a href="shop-information.php?shopname=' + shop + '&shopid=' + placeId + '&address=' + shopVicinity + '" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Buy Now</a></td>'
									+	'</tr>';

							// Appends results string to the table on the results page
							if (output) {
								document.getElementById('maintable').innerHTML = output;
							}
		      			}	      			
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
	  			googleSheetsData(fullDetails);
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

		// Google Maps API Name and address components
		var GMName 				= googleMapsResults.name.toLowerCase();
		var GMaddressComponents = googleMapsResults.address_components;
		
		
		for (var i = 0; i < googleSheetsResults.length; i++) {

			// Google Sheets address components
			var GSName		= googleSheetsResults[i].gsx$shopname.$t.toLowerCase();
			var GSCity		= googleSheetsResults[i].gsx$city.$t.toLowerCase();
			var GSCounty	= googleSheetsResults[i].gsx$county.$t.toLowerCase();
			var GSPostCode	= googleSheetsResults[i].gsx$postcode.$t.toLowerCase();		

			// Loops over address components from Maps API
			for (var j = 0; j < GMaddressComponents.length; j++) {

				// Google Maps API address long name
				var components = GMaddressComponents[j].long_name.toLowerCase();

				console.log(googleMapsResults)
				console.log(GSPostCode)


				// If a matching shop name and postcode are found results are displayed
				if (GMName == GSName && GSPostCode == components) {

					console.log("GM Name - " + GMName);
					console.log("We have a match");

					// Adds items from google sheets into a new array to make it easier to read. It will be joined to google maps data array
					var additionalData = {
						'description': googleSheetsResults[i].gsx$description.$t,
						'email': googleSheetsResults[i].gsx$email.$t,
						'basicservice': googleSheetsResults[i].gsx$basicservice.$t,
						'standardservice': googleSheetsResults[i].gsx$standardservice.$t,
						'fullservice': googleSheetsResults[i].gsx$fullservice.$t,
						'facebook': googleSheetsResults[i].gsx$facebook.$t,
						'twitter': googleSheetsResults[i].gsx$twitter.$t
					};


					// Results from google sheets are cobined to the Google maps data.
					var finalShopDetails = Object.assign(googleMapsResults, additionalData);

					console.log("================ Final Array =========================");
					console.log(finalShopDetails);
					appendBicycleShopDetails(finalShopDetails);
				}
			}
		}
	}
}


/*
	appendBicycleShopDetails() Summary =============================

	

*/
function appendBicycleShopDetails(finalShopDetails) {

	//console.log(finalShopDetails);

	var shopPage = document.getElementById('shop-details-page-container');


	// Test to see if #shop-details-page-container element and finalShopDetails exists 
	if (shopPage) {

		// Validation 
		// Bicycle shop Inofrmation
		if (finalShopDetails.hasOwnProperty('name')) {
			var name = finalShopDetails.name;
		};
		
		// Description
		if (finalShopDetails.description){
			var description = finalShopDetails.description;
		}else {
			var description = 'Sorry no description is currently available.';
		}

		// Address
		if (finalShopDetails.hasOwnProperty('formatted_address')) { 
			var address = finalShopDetails.formatted_address; 
		}else {
			var address = ''; 
		}
		
		// Phone Number
		if (finalShopDetails.hasOwnProperty('formatted_phone_number')) { 
			var phone = 't. ' + finalShopDetails.formatted_phone_number;
		}else {
			var phone = 't. - ';
		}
		
		// Website
		if (finalShopDetails.website) {
			var website	= finalShopDetails.website; 
				website	= website.replace(/\?.*/, '');
				website = 'w. <a href="'+ website +'" target="_blank">' + website.replace('http://', '') + '</a>';
		}else {
			var website = 'w. - ';
		}
		
		// Email
		if (finalShopDetails.email){	
			var email  = 'e. <a href="mailto:' + finalShopDetails.email + '">' + finalShopDetails.email + '</a>';
		}else {
			var email = 'e. - ';
		}
		
		// Rating
		if (finalShopDetails.rating) {
			var rating = finalShopDetails.rating;
		}

		// Open Now
		if (finalShopDetails.opening_hours) { 
			var open = finalShopDetails.opening_hours.open_now;
		}
		
		// Basic Service
		if (finalShopDetails.basicservice) { 
			var basicService = '<div class="workshop-price mdl-cell mdl-cell--4-col"><h4>Basic Service</h4><h3>' + finalShopDetails.basicservice + '</h3></div>';
		}else {
			var basicService = '';
		}

		// Standard Service
		if (finalShopDetails.standardservice){
			var standardService = '<div class="workshop-price mdl-cell mdl-cell--4-col"><h4>Standard Service</h4><h3>' + finalShopDetails.standardservice + '</h3></div>';
		}else {
			var standardService = '';
		}

		// Full Service
		if (finalShopDetails.fullservice){
			var fullService = '<div class="workshop-price mdl-cell mdl-cell--4-col"><h4>Standard Service</h4><h3>' + finalShopDetails.fullservice + '</h3></div>';
		}else {
			var fullService = '';
		}

		// Social
		// Facebook
		if (finalShopDetails.facebook){
			var facebook = '<a href="http://' + finalShopDetails.facebook + '" target="_blank"><img src="../images/facebook.png" alt="facebook logo" /></a>';
		}else {
			var facebook = '';
		}

		// Twitter
		if (finalShopDetails.twitter){
			var twitter = '<a href="http://' + finalShopDetails.twitter + '" target="_blank"><img src="../images/twitter-grey.png" alt="facebook logo" /></a>';
		}else {
			var twitter = '';
		}
	

		// Elements that will have info appended too
		var openInfo     = document.getElementById('opening-times');
		var shopInfo     = document.getElementById('shop-info');		
		var reviewInfo   = document.getElementById('reviews-info');
		var workshopInfo = document.getElementById('workshop-info');
		
		
		// Init empty variables
		var shopDetailsOutput = '';
		var workshopOutput 	  = '';
		var reviewOutput      = '';
		var starOutput	= '';


		// ===================================
		//	Shop Info Section
		// Displays the main informaiton on the shop
		shopDetailsOutput += 	'<div class="info-container">' +
									'<div>' +
										'<div><h4>' + name +  '</h4></div>' +
	    						 		'<div><p>'  + address + '</p></div>' +
									'</div>' +
									'<div>'  +
										'<p>' + description + '</p>' +
							 		'</div>'  +
							  		'<div class="social-container">' +
										'<div class="social facebook">' + facebook + '</div>' +
			 							'<div class="social twitter">'  + twitter + '</div>' +	
									'</div>' +
								'</div>' +
								'<div class="contact-container">' + 
									'<h4>Contact</h4>' +
									'<p>' + website + '</p>' +
									'<p>' + email 	+ '</p>' +
									'<p>' + phone 	+ '</p>' +
									'<div id="stars"></div>' +		
								'</div>';
		
	 	shopInfo.innerHTML = shopDetailsOutput;



		// ===================================
		//	Workshop Info Section
		// Test to see if any servicing prices have been set in the sheets doc
		if (basicService || standardService || fullService) {
	 	
	 		workshopOutput += 	  '<div><h4>Workshop</h4></div>'
								+ '<div class="workshop-inner mdl-grid">'
								+ 		basicService + standardService + fullService;
								+ '</div>';
		}else {

			workshopOutput += 	  '<div><h4>Workshop</h4></div>'
								+ '<div class="workshop-inner mdl-grid">'
								+ 		'<p>There are currently no workshop details for ' + name + '.  If you would like to find out more please try contacting the shop directly from the details listed above.</p>'
								+ '</div>';
		}

	 	workshopInfo.innerHTML = workshopOutput;




		// ===================================
		// Review Section
		if (rating) {

			var starInfo  	= document.getElementById('stars');

			// Test to see if number is whole
	 		var num = (rating - Math.floor(rating)) !== 0;

	 		console.log(rating);

	 		starOutput += '<h4>' + rating + '</h4>'
	 					+ '<ul class="star-lists">';


	 		// Test to see if the ratings number is a integer or float
	 		if(num) { 

	 			console.log("number is not whole")
				for (var i = 1; i <= rating; i++) {	starOutput += '<li><i class="material-icons">star</i></li>'; };
				starOutput += '<li><i class="material-icons">star_half</i></li>';
	 		}else {

	 			console.log("number is whole")
		 		for (var i = 1; i <= rating; i++) {	starOutput += '<li><i class="material-icons">star</i></li>'; };
	 		}

	 		starOutput += '</ul>';

	 		starInfo.innerHTML = starOutput;
		}

	
		
		// ===================================
		// Rating Section
		// Tests to see if there are ratings if there are then they will show
		reviewOutput += '<div>';
		reviewOutput +=  	'<div class="review-title"><h4>Reviews</h4><span class="see-more">See all reviews</span></div>';
			for (var i = 0; i < finalShopDetails.reviews.length; i++) {
				// console.log(finalShopDetails.reviews[i]);

				reviewOutput += '<div class="review-container">';
				reviewOutput +=		'<div>';
				reviewOutput +=			'<p>' + finalShopDetails.reviews[i].text + '</p>';
				reviewOutput +=	 		'<i>- ' + finalShopDetails.reviews[i].author_name + '</i>';
				reviewOutput +=		'</div>';
				reviewOutput +=		'<div class="author-rating-container">';
				reviewOutput +=			'<div class="author-rating"><p>' + finalShopDetails.reviews[i].rating +'</p></div>';
				reviewOutput +=			'<ul class="star-lists">';
				for (var j = 1; j <= finalShopDetails.reviews[i].rating; j++) {
				reviewOutput += 			'<li><i class="material-icons">star</i></li>';
				};
				reviewOutput += 		'</ul>';
				reviewOutput +=		'</div>';
				reviewOutput +=	'</div>';
			};
			reviewOutput +=	'</div>';

		reviewInfo.innerHTML = reviewOutput;


		// Show only 1st review
		var reviewBox 	 = $('#reviews-info');
		var reviewHeight = $('#reviews-info .review-container').first().height() + $('.review-title').outerHeight(true);

		$(document).ready(function(){

			console.log(reviewHeight);

			$(reviewBox).css({
				'height': reviewHeight,
				'overflow': 'hidden' 
			});

			
			$('.see-more').on('click tap', function(){

				$(reviewBox).toggleClass('show');

				if($(reviewBox).hasClass('show')){

					$(reviewBox).css({
						'height': '100%'						
					});
				}else {
					$(reviewBox).css({
						'height': reviewHeight,
						'overflow': 'hidden' 
					});
				}
			});	
		});
	}
}