<?php 
	
	$pageTitle = "";
	$pageClass = "results";

	include 'header.php'; 

?>
<style>

	h4 , p { font-family: "Roboto","Helvetica","Arial",sans-serif; }
	p, ul li { font-weight: 300; }
	.page-container { margin: 0; padding: 0; }
	.page-container .inner-wrapper { margin-top: 0; margin-bottom: 0; }
	.page-container .inner-wrapper .mdl-grid { padding: 0; }



	/*	Side Bar		*/
	#opening-times { margin-top: 0; margin-bottom: 0; padding: 30px 25px; background: #202020; color: #fff; }
	#opening-times ul { padding: 0; }
	#opening-times ul li { list-style: none; margin: 5px; }
	
	#main-shop-body { margin-top: 0; margin-bottom: 0; }
	#main-shop-body .mdl-grid { padding: 0; }
	#main-shop-body .mdl-grid .mdl-cell { margin-top: 0; margin-bottom: 0; }
	
	#rating .material-icons { color: #FFD966;}

	#shop-details { position: relative; padding-top: 30px; }
	.shop-address { position: absolute; bottom: 0; right: 0; }

	.rating-integer {
		display: inline;
		font-size: 20px;
		position: relative;
		top: -3px;
		left: 15px;
	}

	#map-container { float: left; width: 100%; padding: 0; }
	#map { margin: 0; }

</style>

<!-- Main Body -->
<section class="page-container mdl-grid">
	<div class="inner-wrapper mdl-cell mdl-cell--10-col mdl-cell--1-offset-desktop" style=" ">


		<div class="mdl-grid">

			<!-- Sidebar -->	
			<sidebar id="opening-times" class="mdl-cell mdl-cell--3-col mdl-cell--8-col-tablet mdl-cell--4-col-phone" style="border: 1px solid green;">
				<!-- Opening Times appended from shopDetails() -->
			</sidebar>

			<div id="main-shop-body" class="mdl-cell mdl-cell--9-col" style=" ">

				<div class="mdl-grid">
					<section id="shop-details" class="mdl-cell mdl-cell--12-col" style=" ">

					</section>

				

					<section id="service-prices" class="mdl-cell mdl-cell--12-col" style=" ">

					</section>

					<section class="mdl-cell mdl-cell--12-col" style="border: 1px solid firebrick;">
						<h4>Reviews</h4>
						<div id="rating" class="">
						
						</div>





					</section>
				</div>

			</div>
		
		</div>

	</div><!-- End of inner-wrapper -->
</section>





<!-- Map -->
<section id="map-container" class="mdl-grid">
	<div id="map" class="mdl-cell mdl-cell--12-col" style="height: 350px;"></div>
</section>


<?php include 'footer.php'; ?>