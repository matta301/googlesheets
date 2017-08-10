


<script src="http://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
<script defer src="https://code.getmdl.io/1.2.1/material.min.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAba88TkOPqBvviadfQZnVJ4V6hbaDHReM&libraries=places,geocode"></script>
<script type="text/javascript" src="mastersearch.js"></script>
<script type="text/javascript">
	
	// Google Maps API Key 
	var apiKey = "AIzaSyAba88TkOPqBvviadfQZnVJ4V6hbaDHReM";


	locationSearch(apiKey);




</script>

<!-- Runs script if is on results page -->
<?php if (stripos($_SERVER['REQUEST_URI'], 'results.php')) { ?>

<script type="text/javascript">

	$(document).ready(function() {



	shopDetails();




















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











		

	});
</script>

<?php } ?>
</body>
</html>