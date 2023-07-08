$(function () {		
  $(".rslides2").responsiveSlides({
	auto: true,
	pager: false,
	speed: 3000, 
	timeout: 4000,
	nav: true,             // Boolean: Show navigation, true or false
	random: false,         // Boolean: Randomize the order of the slides, true or false
	pause: true,          // Boolean: Pause on hover, true or false
	pauseControls: true,   // Boolean: Pause when hovering controls, true or false
	prevText: "",	       // String: Text for the "previous" button
	nextText: "",	       // String: Text for the "next" button
	maxwidth: "",          // Integer: Max-width of the slideshow, in pixels
	navContainer: "",      // Selector: Where controls should be appended to, default is after the 'ul'
	manualControls: "",    // Selector: Declare custom pager navigation
	namespace: "rslides",  // String: Change the default namespace used
	before: function(){},  // Function: Before callback
	after: function(){}    // Function: After callback
  });
});