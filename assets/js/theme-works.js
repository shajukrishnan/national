(function($) {
  "use strict";


   
// Work Filter 
$(function(){
  $(".filter-boxes").on('click',function() {
    $(".bags, .others").fadeOut(400);
    $(".boxes").fadeIn(400);        
    $(".filter-nav li a").removeClass("active");
    $(".filter-boxes").addClass("active");
  });
  $(".filter-bags").on('click',function(){
    $(".boxes, .others").fadeOut(400);
    $(".bags").fadeIn(400);
    $(".filter-nav li a").removeClass("active");
    $(".filter-bags").addClass("active");
  });
  $(".filter-others").on('click',function(){
    $(".boxes, .bags").fadeOut(400);
    $(".others").fadeIn(400);
    $(".filter-nav li a").removeClass("active");
    $(".filter-others").addClass("active");
  });
  $(".filter-all").on('click',function(){
    $(".boxes, .bags, .others").fadeIn(400);
    $(".filter-nav li a").removeClass("active");
    $(".filter-all").addClass("active");
  });   
}); 



})(jQuery);