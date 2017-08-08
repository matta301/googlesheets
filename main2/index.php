<?php 
	
	$pageClass = "home";
	
	include 'header.php'; 

?>


	<form id="location-form" action="">
		<input id="user-location" type="text" name="location" value="">		
		<select id="distance-option" name="distance">
			<option value="2000">2km</option>	
			<option value="5000">5km</option>			
			<option value="10000">10km</option>
			<option value="15000">15km</option>
		</select>
		


		<input type="submit" value="Submit" onClick="event.preventDefault(); locationSearch()">
	</form> 

	




		<!-- Results Table -->
	<div class="shop-info mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet">
		<h1>Your Results</h1>

		<table class="results-table mdl-data-table mdl-js-data-table mdl-shadow--2dp" style="width: 100%;">
			<thead>
				<tr>
					<th class="mdl-data-table__shop-name mdl-data-table__cell--non-numeric"><h5>Integer</h5></th>
					<th class="mdl-data-table__buy-now mdl-data-table__cell--non-numeric"><h5>mollis</h5></th>
				</tr>
			</thead>
			<tbody id="maintable">
				
			</tbody>
		</table>
	</div>




<?php include 'footer.php'; ?>