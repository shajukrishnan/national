(function($){
	"use strict"

	/*------------------
		Preloder
	--------------------*/
	$(window).on('load', function() {
		$('#preloader').delay(550).fadeOut('slow');
	});


	/*------------------
		Countdown
	--------------------*/
	// For demo preview
    // var today = new Date();
    // var dd = String(today.getDate()).padStart(2, '0');
    // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    // var yyyy = today.getFullYear();

    // if(mm == 12) {
    //     mm = '01';
    //     yyyy = yyyy + 1;
    // } else {
    //     mm = parseInt(mm) + 1;
    //     mm = String(mm).padStart(2, '0');
    // }
    // var timerdate = mm + '/' + dd + '/' + yyyy;
    // For demo preview end
    

    // Use this for real timer date
	 var timerdate = "2022/12/30"; 
	
	$(".counter").countdown(timerdate, function(event) {
		$(this).html(event.strftime("<div class='cd-item'>%D<span>days</span></div>" + "<div class='cd-item'>%H<span>hour</span></div>" + "<div class='cd-item'>%M<span>min</span></div>" + "<div class='cd-item'>%S<span>sec</span></div>"));
	});


	/*------------------
		Subscribe Form
	--------------------*/
	$('#mc-form').ajaxChimp({
		url: 'http://webdevhomes.us12.list-manage.com/subscribe/post?u=4d62424bdf73c15d3fa0f3578&id=9c6fab69f2',//Set Your Mailchamp URL
	});



	$('.popup').magnificPopup({
		type:'inline',
		mainClass:'mfp-zoom-in',
		removalDelay: 400
	});


})(jQuery);
