


<script src="http://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
<script defer src="https://code.getmdl.io/1.2.1/material.min.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAba88TkOPqBvviadfQZnVJ4V6hbaDHReM&libraries=places,geocode"></script>
<script type="text/javascript">


/*	
	googleAutoComplete() -
	Auto completes the location input field using google api
*/
function googleAutoComplete(){

	// Google autocomplete
	var input = document.getElementById('user-location');

	var options = {
	   types: ['(regions)'],
	   componentRestrictions: { country: 'gb' }
	};
	
	var autocomplete = new google.maps.places.Autocomplete(input,options);
}


/*	
	returnCoordinates() -
	Take the users location generated from google auto complete and returns the coordinates
*/
function returnCoordinates() {

	var output = '';

	var locationInput = document.getElementById('user-location').value;
	console.log(locationInput);

	// Puts user input location into the url to return the latitude and longitude coordinates
	var data =  "https://maps.googleapis.com/maps/api/geocode/json?address=" + locationInput + "&key=AIzaSyAba88TkOPqBvviadfQZnVJ4V6hbaDHReM";


	$.getJSON(data, function (json) {

		var results = json.results;
		for (var i = 0; i < results.length; i++) {
			//console.log(results[i]);
			var coords = results[i].geometry.location;

			// Passes the coordinates in to the resultsList() function where they will be used to gather information on shops near by
			resultsList(coords, output);
		};
	})
}




/*



*/
function resultsList(coords, output) {

	// Coordinates of users locatoin
	var latitude  = coords.lat; 
	var longitude = coords.lng;
	console.log(latitude.toString());
	console.log(longitude.toString());

	var locationInput = document.getElementById('user-location').value;
	console.log(locationInput);


	
	/*
		Parameters that will generate a list of bicycle shops near by to the location of the user
		Location - search results near users locatoin
		rankBy - distance
		type - all shops listed as bicycle _store
	*/ 
	var request = {
		location: new google.maps.LatLng(latitude, longitude),
		//radius: '9000',
		rankBy: google.maps.places.RankBy.DISTANCE,
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

      			/*

				// Renders the results to a node element div
  				var service = new google.maps.places.PlacesService(document.createElement('div'));

			    service.getDetails({
			    	placeId: placeId
				}, function(place, status) {
			      	if (status === google.maps.places.PlacesServiceStatus.OK) {
		      			
		      			//console.log(place);

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
		      			


 						output += 	'<tr>' +
 										'<td>' + shopName +'</td>' +
 										'<td>' + formattedAddress + '</td>' +
									'</tr>';

 						if (output) {
 							document.getElementById('maintable').innerHTML = output;
 						};
			      	}
			  	});
				
				*/

    		}


    		
  		}
	}	
}

	




/*function dataFeed() {

	var dataSheet = "https://spreadsheets.google.com/feeds/list/1DgePfAxco-xVy2VdrfxkyPs3W1R5ZL5B-7zKgVf8DzI/od6/public/values?alt=json";

	$.getJSON(dataSheet, function (json) {
		// JSON Feed 
		var shopData = json.feed.entry;
		console.log(shopData);

		// Loop over json feed to return info on each shop
		for (var i = 0; i < shopData.length; i++) {
			
			var shopCity     = shopData[i].gsx$city.$t
			var shopCounty   = shopData[i].gsx$county.$t
			var shopPostcode = shopData[i].gsx$postcode.$t
			


			//console.log(shopData[i].gsx$shopname.$t);
		};
	});
}*/




//dataFeed();
googleAutoComplete();

</script>
</body>
</html>