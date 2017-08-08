


<script src="http://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
<script defer src="https://code.getmdl.io/1.2.1/material.min.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAba88TkOPqBvviadfQZnVJ4V6hbaDHReM&libraries=places,geocode"></script>


<?php  echo $_SERVER['REQUEST_URI']; ?>









<script type="text/javascript">


function locationSearch() {


	// Searches for whether there is a search form
	if (document.getElementById('location-form')) {
	
		console.log('form exists');

		// Google autocomplete ========================
		var input = document.getElementById('user-location');

		var options = {
		   types: ['(regions)'],
		   componentRestrictions: { country: 'gb' }
		};
		
		var autocomplete = new google.maps.places.Autocomplete(input,options);
		// ============================================


		var output = '';
		var locationInput 	 = document.getElementById('user-location').value;
		var locationDistance = document.getElementById('distance-option').value;
		console.log(locationInput);
		console.log(locationDistance);	
	
		// Puts user input location into the url to return the latitude and longitude coordinates
		if (locationInput) {
			var data =  "https://maps.googleapis.com/maps/api/geocode/json?address=" + locationInput + "&key=AIzaSyAba88TkOPqBvviadfQZnVJ4V6hbaDHReM";
		};
		
		$.getJSON(data, function (json) {

			var results = json.results;

			for (var i = 0; i < results.length; i++) {				

				var coords = results[i].geometry.location;

				// Latitude and Longitude of Coordinates from a user's locatoin
				var latitude  = coords.lat; 
				var longitude = coords.lng;
				console.log(latitude.toString());
				console.log(longitude.toString());
	
				
				/*
					Parameters that will generate a list of bicycle shops near by to the location of the user
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
			    		for (var i = 0; i < results.length; i++) {
			      			console.log(results[i]);

			      			// All place ID's returned from search
			      			var shopName = results[i].name;
			      			var placeId  = results[i].place_id;
			      			console.log(shopName);
			      			console.log(placeId);

			      			output += 	'<tr>' +
											'<td>' + shopName +'</td>' +
											'<td><a href="results.php?shopname=' + shopName + '&shopid=' + placeId + '" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Buy Now</a></td>' +
										'</tr>';

							if (output) {
								document.getElementById('maintable').innerHTML = output;
							};
						}
					}
				}
			};
		})
	}
}

locationSearch();


</script>

<!-- 	Runs script if is on results page -->
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

			// Renders the results to a node element div
			var service = new google.maps.places.PlacesService(document.createElement('div'));

		    service.getDetails({
		    	placeId: shopId
			}, function(place, status) {
	      		if (status === google.maps.places.PlacesServiceStatus.OK) {

	      			if (place.name) { var shopName = place.name; }
	      			if (place.formatted_address) { var formattedAddress = place.formatted_address; }
	      			if (place.formatted_phone_number) { var formattedPhone = place.formatted_phone_number; }
	      			if (place.opening_hours && place.opening_hours.open_now) { var openNow = place.opening_hours.open_now; }
	      			if (place.rating) {  var rating = place.rating; }
	      			if (place.website) { var website = place.website; }
	      			if (place.opening_hours && place.opening_hours.weekday_text) { var monday    = place.opening_hours.weekday_text[0]; }
	      			if (place.opening_hours && place.opening_hours.weekday_text) { var tuesday   = place.opening_hours.weekday_text[1]; }
	      			if (place.opening_hours && place.opening_hours.weekday_text) { var wednesday = place.opening_hours.weekday_text[2]; }
	      			if (place.opening_hours && place.opening_hours.weekday_text) { var thursday  = place.opening_hours.weekday_text[3]; }
	      			if (place.opening_hours && place.opening_hours.weekday_text) { var friday    = place.opening_hours.weekday_text[4]; }
	      			if (place.opening_hours && place.opening_hours.weekday_text) { var saturday  = place.opening_hours.weekday_text[5]; }
	      			if (place.opening_hours && place.opening_hours.weekday_text) { var sunday    = place.opening_hours.weekday_text[6]; }
					if (place.url) { var mapUrl = place.url; }

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

					/*
					output += 	'<tr>' +
									'<td>' + shopName +'</td>' +
									'<td>' + formattedAddress + '</td>' +
							'</tr>';

					if (output) {
						document.getElementById('maintable').innerHTML = output;
					};
					*/
	      		}
  			});		
		}

		shopDetails(shopId)

	});
</script>

<?php } ?>
</body>
</html>