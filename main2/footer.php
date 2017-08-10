


<script src="http://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
<script defer src="https://code.getmdl.io/1.2.1/material.min.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAba88TkOPqBvviadfQZnVJ4V6hbaDHReM&libraries=places,geocode"></script>
<script type="text/javascript">


function locationSearch() {


	// Searches for whether there is a search form
	if (document.getElementById('location-form')) {
	
		// console.log('form exists');

		// Google autocomplete ========================
		var input = document.getElementById('user-location');

		// Autocomplete restriced to UK only
		var options = {
		   types: ['(regions)'],
		   componentRestrictions: { country: 'gb' }
		};
		
		var autocomplete = new google.maps.places.Autocomplete(input,options);
		// ============================================


		var output = '';
		var locationInput 	 = document.getElementById('user-location').value;
		var locationDistance = document.getElementById('distance-option').value;
		console.log("User Location = " + locationInput);
		console.log("User Distance = " + locationDistance);	
	
		// Puts user input location into the url to return the latitude and longitude coordinates
		if (locationInput) {
			var data =  "https://maps.googleapis.com/maps/api/geocode/json?address=" + locationInput + "&key=AIzaSyAba88TkOPqBvviadfQZnVJ4V6hbaDHReM";
		};

		$.getJSON(data, function (json) {

			var results = json.results;

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
				radius: User can select the distance from their location
				Location - search results near users locatoin
				rankBy - distance
				type - all shops listed as bicycle _store
			*/
			var request = {
				location: new google.maps.LatLng(latitude, longitude),
				radius: locationDistance,
				//rankBy: google.maps.places.RankBy.DISTANCE,
				type: ['bicycle_store']
			}

			// Renders the results to a node element div
			var service = new google.maps.places.PlacesService(document.createElement('div')); 
		  	service.nearbySearch(request, callback);

		  	function callback(results, status) {
		  		
		  		if (status == google.maps.places.PlacesServiceStatus.OK) {    		

					console.log(results);

					


		    		for (var i = 0; i < results.length; i++) {

		      			//console.log(results[i]);

		      			// All place ID's returned from search
		      			var shopName 	 = results[i].name;
		      			var shopVicinity = results[i].vicinity;
		      			var placeId  	 = results[i].place_id;
		      			/*console.log(shopName);
		      			console.log(placeId);*/

		      			output += 	'<tr>' +
										'<td>' + shopName +'</td>' +
										'<td><a href="results.php?shopname=' + shopName + '&shopid=' + placeId + '&address=' + shopVicinity + '" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Buy Now</a></td>' +
									'</tr>';

						if (output) {
							//document.getElementById('maintable').innerHTML = output;
						};
					}
				}
			}
			
		})
	}
}

locationSearch();


</script>

<!-- Runs script if is on results page -->
<?php if (stripos($_SERVER['REQUEST_URI'], 'results.php')) { ?>

<script type="text/javascript">

	$(document).ready(function() {





		// Performs regex of query string and extracts values and stores as variables
		function getParameterByName(name, url) {
		    if (!url) url = window.location.href;
			name = name.replace(/[\[\]]/g, "\\$&");

		    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		        results = regex.exec(url);
		    if (!results) return null;
		    if (!results[2]) return '';
			
			return decodeURIComponent(results[2].replace(/\+/g, " "));
		}

		var shopName = getParameterByName('shopname');
		var shopId   = getParameterByName('shopid'); 
		
		console.log('Shop Name: ' + shopName);
		console.log('Shop ID: ' + shopId);



		function shopDetails(shopId) {

			var openingTimeOutput = '';
			var shopDetails		  = '';

			// Renders the results to a node div element 
			var service = new google.maps.places.PlacesService(document.createElement('div'));

			// Gets the details of the shop using the ID
		    service.getDetails({
		    	placeId: shopId
			}, function(place, status) {
	      		if (status === google.maps.places.PlacesServiceStatus.OK) {
	      			console.log(place)

	      			// Assign the data retrieved to variables to be used below.  First test whether there is data 
	      			if (place.hasOwnProperty('name')) { var shopName = place.name; }
	      			if (place.hasOwnProperty('formatted_address')) { var formattedAddress = place.formatted_address; }
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
          				center: { lat: latitude, lng: longitude},
          				scrollwheel: false,
          				zoom: 17
        			});

        			// Place marker on map
        			var marker = new google.maps.Marker({
        				position: { lat: latitude, lng: longitude},
        				map: map
        			});

        			// Data that is returned
					console.log("Longitude: " + place.geometry.location.lng());
					console.log("Latitude: " + place.geometry.location.lat());
	      			console.log("Shop: " + shopName);
	      			console.log("Address: " + formattedAddress);
	      			console.log("Phone Number: " + formattedPhone);
	      			console.log("open Now: " +  openNow);
	      			console.log("Rating: " + rating);
	      			console.log("Website: " + website);
	      			console.log("Map URL: " + mapUrl);
	      			console.log("Monday: " + monday);
	      			console.log("tuesday: " + tuesday);
	      			console.log("wednesday: " + wednesday);
	      			console.log("thursday: " + thursday);
	      			console.log("friday: " + friday);
	      			console.log("saturday: " + saturday);
	      			console.log("sunday: " + sunday);

	      			// Meta Data
	      			 document.title = shopName + ' | ' + formattedAddress + ' | ' + formattedPhone;


      			 	// Appends the data retrieved to the html on the results page
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
					
					if (openingTimeOutput) {
						document.getElementById('opening-times').innerHTML = openingTimeOutput;
					};											

					// Main shop details
					shopDetails 		+= 	'<div>' + 
												'<h4>' + shopName + '</h4>' +
											'</div>' +
											'<div class="shop-address">' +
												'<p>' + formattedAddress + '</p>' +
											'</div>';
					if (shopDetails) {
						document.getElementById('shop-details').innerHTML = shopDetails;
					};



					console.log(rating);
					shopRating(rating);
	      		}
  			});
		}

















		// Adds star rating to the shop overview page
		function shopRating(rating) {

			var starContainer = document.getElementById('rating');

			
			if (Number.isInteger(rating)) {



				console.log("integer is a whole number");
				for (var i = 1; i <= rating; i++) {
					document.getElementById('rating').innerHTML += '<i class="material-icons">star</i>';
				};

				

			  	document.getElementById('rating').innerHTML += '<div  class="rating-integer"><span>' + rating + '</span></div>';

			}else if(rating == '' || rating == null || rating == 'undefined'){				
				
				document.getElementById('rating').innerHTML += 'This store currently has no reviews';

			}else {
				console.log("integer is a floating number");
				for (var i = 1; i <= rating; i++) {
				
					document.getElementById('rating').innerHTML += '<i class="material-icons">star</i>';
				};
				document.getElementById('rating').innerHTML += '<i class="material-icons">star_half</i>' + '<div class="rating-integer"><span>' + rating + '</span></div>';
			}




		}











		shopDetails(shopId)

	});
</script>

<?php } ?>
</body>
</html>