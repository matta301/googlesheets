<?php 
	
	$pageClass = "shop-details";

	include 'header.php'; 

?>
<style>

	h4 , p { font-family: "Roboto","Helvetica","Arial",sans-serif; }
	p, ul li { font-weight: 300; }
	a { color: firebrick; text-decoration: none; }
	.page-container { margin: 0; padding: 0; }
	.page-container .inner-wrapper { margin-top: 0; margin-bottom: 0; }
	.page-container .inner-wrapper .mdl-grid { padding: 0; }



	/*	Side Bar		*/
	#opening-times { margin-top: 0; margin-bottom: 0; padding: 30px 25px; /* background: #202020; color: #fff;  */}
	#opening-times ul { padding: 0; }
	#opening-times ul li { list-style: none; margin: 5px; }
	

	#main-shop-body { margin-top: 0; margin-bottom: 0; }
	#main-shop-body .mdl-grid { padding: 0; }
	#main-shop-body .mdl-grid .mdl-cell { margin-top: 0; margin-bottom: 0; }
	#main-shop-body .title { float: left; }
	#main-shop-body .address { float: right; margin: 33px 0 16px; }
	#main-shop-body .address span { text-transform: uppercase; }
	#main-shop-body .introduction { clear: both; }

	#main-shop-body	#shop-info .info-container { width: 55%; float: left; }
	#main-shop-body	#shop-info .contact-container { width: 39%; float: right; }
	
	#stars { clear: both; }
	#stars h4 { margin-top: 11px; float: left; }
	ul.star-lists { float: left; margin-left: 0; padding-left: 20px; }
	ul.star-lists li { display: inline-block; color: #FFD966; }


	#shop-info { /*border: 1px solid green; */position: relative; padding-top: 30px; }
	#shop-info h4 { text-transform: capitalize; }


	
	#main-shop-body .mdl-grid #workshop-info.mdl-cell { margin-top: 30px; margin-bottom: 30px; }


	#reviews-info { /*border: 1px solid green; */min-height: 200px; }
		
	#main-shop-body	#shop-info .social-container { clear: both; }
	#main-shop-body	#shop-info .social img { width: 90%; }
	#main-shop-body	#shop-info .facebook { float: left; margin-right: 25px; }
	#main-shop-body	#shop-info .twitter { float: left; }

	#reviews-info h4 { display: inline; }
	#reviews-info .review-title { padding: 20px 0; }
	.review-container { border-bottom: 1px solid #e9e9e9; /* padding: 30px;  */ float: left; clear: both; width: 100%; }
	.review-container:nth-child(even) { background: #e9e9e9;  }
	.review-container p { margin: 0; }

	.review-container .author-rating-container { float: left; width: 100%; margin-top: 15px; }
	.review-container .author-rating-container ul.star-lists { margin: 0; }

	.review-container .author-rating-container .author-rating { float: left; }
	.review-container .author-rating-container { padding: 0 30px 30px; }
	.review-container > div { padding: 30px 30px 0px; }



	#reviews-info.active { height: 100%; }

	.workshop-price { text-align: center; }

	.see-more { position: relative; float: right; right: 40px; top: 10px; cursor: pointer; }


	#map-container { float: left; width: 100%; padding: 0; }
	#map { margin: 0; width: 100%; } 

</style>

<!-- Main Body -->
<section id="<?php echo $pageClass; ?>-page-container" class="page-container mdl-grid">
	<div class="inner-wrapper mdl-cell mdl-cell--10-col mdl-cell--1-offset-desktop" style=" ">


		<div class="mdl-grid">

			<!-- Sidebar -->	
			<sidebar id="opening-times" class="mdl-cell mdl-cell--3-col mdl-cell--8-col-tablet mdl-cell--4-col-phone" style="border: 1px solid green;">
				<!-- Opening Times appended from appendBicycleShopDetails() -->
			</sidebar>

			<div id="main-shop-body" class="mdl-cell mdl-cell--9-col" style=" ">

				<div class="mdl-grid">
					<section id="shop-info" class="mdl-cell mdl-cell--12-col" style="">
					</section>

					<section id="workshop-info" class="mdl-cell mdl-cell--12-col" style="">

					</section>

					<section id="reviews-info" class="mdl-cell mdl-cell--12-col" style="">
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