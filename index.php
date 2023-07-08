<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<title>DyeCraft - Printing, Packaging, Dye Cutting and Foiling</title>
<meta name="keywords" content="Designing, Packaging, Screen Printing, Lamination, Foil Stamping &amp; Spot U.V coating, Die Cutting" />
<meta name="description" content="We take of your personal and professional requirements in terms of designing and delivering Invitations, Brochures, Packagings, Catalogs, Leaflets, Posters, and much more." />
<link rel="shortcut icon" href="favicon.ico" />
<style type="text/css" media="screen, tv, projection">
@import "css/menu.css";
@import "css/style.css";
@import "css/slide.css";
@import "css/banner.css";
@import "css/gallery.css";
@import "css/responsive.css";
@import "css/testimonial.css";
</style>
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript">
	$(window).load(function() {
		$(".se-pre-con").fadeOut("slow");
	}); 
</script>
<script type="text/javascript">
	jQuery( document ).ready( function ( $ )
		{
			$( document ).on( "scroll", onScroll );
			$( ".scroll" ).click( function ( event ) {
				event.preventDefault();
				$( 'html,body' ).animate( {
					scrollTop: $( this.hash ).offset().top
				}, 1000 );
			} );

			function onScroll( event ) {
				var scrollPos = $( document ).scrollTop();
				$('.cloned').find('a').each(function() {
					
					var currLink = $( this );
					var refElement = $(this).attr('href');
					var splitEle = refElement.split( '#' );
					
					var windowHeight = $(window).height();
					var percentage = 0.4;
					var topPercentage = windowHeight * percentage;
					
					if ( $( "#" + splitEle[ 1 ] ).offset().top - topPercentage <= scrollPos && $( "#" + splitEle[ 1 ] ).offset().top + $( "#" + splitEle[ 1 ] ).height() > scrollPos ) {
						$( '.cloned ul li' ).removeClass( "on" );
						currLink.parent().addClass( "on" );
					} else {
						/*currLink.parent().removeClass( "on" );*/
					}
				});
			}
		} );
</script>
<script type="text/javascript" src="js/script.js"></script>
<script type="text/javascript" src="js/custom.js"></script>
<script type="text/javascript" src="js/slide.js"></script>
<script type="text/javascript" src="js/tab.js"></script>
<script type="text/javascript" src="js/gallery1.js"></script>
<script type="text/javascript" src="js/gallery2.js"></script>
<script type="text/javascript" src="js/gallery3.js"></script>
<script type="text/javascript" src="js/gallery4.js"></script>
<script type="text/javascript">
$(function(){
	$('a[href$=".jpg"]').gallery(options={
		contentDefaultWidth: '50em', // for content
		contentDefaultHeight: '100%', // for content
		mediaMaxWidth: '100%', // for images
		mediaMaxHeight: '100%', // for images
		lightBoxMargin: '2em', // margin around screen (can be em, % or px)
		animateResize: true,
		preloadLoadingImage: 'loading-black-on-white.gif',
		preloadGalleryControlsSprite: 'gallery-controls-sprite.png'
	});
});
</script>
<script type="text/javascript" src="js/banner.js"></script>
<script type="text/javascript" src="js/banner1.js"></script>
<script type="text/javascript" src="js/placeholder.js"></script>
<?php include('alerts.php'); ?>
<script type="text/javascript">
	var captchaBool = 0;
	function regFormValidate(){
		var returnVal=true;

		var enquiryFormName = document.enquiryForm;
		$('div[id^="alert_"]').html('');
		if (enquiryFormName.first_name.value == "") {
			showLabelAlert('<?php echo ALERT_NAME; ?>', 'first_name');
			returnVal= false;
		}
		if (enquiryFormName.email.value == "") {
			showLabelAlert('<?php echo ALERT_EMAIL; ?>', 'email');
			returnVal= false;
		}
		else if (enquiryFormName.email.value.indexOf("@", 0) < 0){
			showLabelAlert('<?php echo ALERT_VALID_EMAIL; ?>', 'email');
			returnVal= false;
		}
		else if (enquiryFormName.email.value.indexOf(".", 0) < 0){
			showLabelAlert('<?php echo ALERT_VALID_EMAIL; ?>', 'email');
			returnVal= false;
		}
		if (enquiryFormName.phone.value == "") {
			showLabelAlert('<?php echo ALERT_PHONE_NO; ?>', 'phone');
			returnVal= false;
		}
		if (enquiryFormName.location.value == "") {
			showLabelAlert('<?php echo ALERT_REQUIRED; ?>', 'location');
			returnVal= false;
		}
		if (enquiryFormName.school.value == "") {
			showLabelAlert('<?php echo ALERT_REQUIRED; ?>', 'school');
			returnVal= false;
		}
		if (enquiryFormName.enquiry.value == "") {
			showLabelAlert('<?php echo ALERT_REQUIRED; ?>', 'enquiry');
			returnVal= false;
		}
		if (enquiryFormName.captcha.value == "") {
			showLabelAlert('<?php echo ALERT_CAPTCHA; ?>', 'captcha');
			returnVal= false;
		}else{
			$.ajax({
			type: "POST",
			url: "captcha/captcha.php",
			async: false,
			data: {
			  "captcha" : enquiryFormName.captcha.value,
			  "type": 'enquiry'
			},
			success: function(responseData){
			captchaBool = responseData;
			  if(captchaBool==0){
				  img = document.getElementById('imgCaptcha');
				  img.src = 'captcha/myimage.php?' + Math.random();
			  }
			}
			});
			if (captchaBool==0 ) {
				$('#alert_captcha').html('Wrong Captcha.');
				returnVal= false;
			}else{
				$('#alert_captcha').html('');
			}
		}

		if(returnVal==true){
			 jQuery.ajax({
				 type: "GET",
				 url: "ajax.php",
				 async: false,
				 data: {

					  "first_name" : enquiryFormName.first_name.value,
					  "email" : enquiryFormName.email.value,
					  "phone" : enquiryFormName.phone.value,
					  "school" : enquiryFormName.school.value,
					  "location" : enquiryFormName.location.value,
					  "enquiry" : enquiryFormName.enquiry.value,
					  "type":'enquiry'
					 
				 },
				 success: function (responseData){
					  if(responseData==1){
							$('#success_msg').addClass('successMsg');
							$('input[type="text"], textarea').val('');
							document.getElementById('success_msg').innerHTML = 'Form Submitted Successfully!. Thank You for contacting Us, We will ge back to you shortly!';
					  }else{
							$('#success_msg').addClass('ErrMsg');
							document.getElementById('success_msg').innerHTML = 'Form not Submitted! Try Again Later';
					  }
				 }
			  });
		}
	}
</script>

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-122242808-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-122242808-1');
</script>

</head>
<body>
<!--<div class="se-pre-con"></div>-->
<div id="wrapper">
  <div class="header-section width100 ">
    <div class="header">
      <div class="container">
        <div class="logo align-center" id="Home"> <a href="index.php"><img src="images/dyecraft_logo1.jpg" alt="Dyecraft Logo" /></a> </div>
      </div>
    </div>
    <div class="menu width100">
      <div class="container">
        <div id="cssmenu">
          <ul>
            <li class="cssmenuFirst"><a href="#Home" class="scroll">Home</a></li>
             <li><a href="#Products" class="scroll">Services</a></li>
           <li><a href="#About" class="scroll">About Us</a></li>
            <li><a href="#Why" class="scroll">Why Dye Craft?</a></li>
<!--             <li><a href="#Gallery" class="scroll">Gallery</a></li>
-->           <li><a href="#Testimonials" class="scroll">Testimonials</a></li>
            <li><a href="#Reachus" class="scroll">Contact Us</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="banner width100 mb_none">
    <div class="scroll_bg">
      <ul class="rslides2">
		<li><img src="images/banner/01.jpg" alt="DyeCraft" />
			<div class="banner-caption">
			  <h1>Works that speaks for itself</h1>
			</div>
		</li>
<!--		<li><img src="images/banner/03.jpg" alt="DyeCraft" />
			<div class="banner-caption">
			  <h1>"Works that speaks for itself"</h1>
			</div>
		</li>
		<li><img src="images/banner/01.jpg" alt="DyeCraft" />
			<div class="banner-caption">
			  <h1>One Stop Solution for all your Print needs</h1>
			</div>
		</li>
-->      </ul>
    </div>
  </div>
  <div class="banner width100 mb_visible">
    <div class="scroll_bg">
      <ul class="rslides2">
		<li><img src="images/banner/01.jpg" alt="DyeCraft" /></li>
<!--		<li><img src="images/banner/01.jpg" alt="DyeCraft" /></li>
		<li><img src="images/banner/01.jpg" alt="DyeCraft" /></li>
-->      </ul>
    </div>
  </div>
  <div class="home-content width100">
  
    
    <div id="Products" class="products width100">
      <div class="container">
        <div class="title">
          <h1>Services</h1>
        </div>
        <div class="width100">
          <div class="products-list animation-element slide-left">
            <h4>Designing</h4>
            <div class="product-features width100">
              <div class="features-img"> <img src="images/home_content/icons/Ic_logo.jpg" alt="DyeCraft" /> </div>
              <div class="features-txt">
                <p>Logo Design</p>
              </div>
            </div>
            <div class="product-features width100">
              <div class="features-img"> <img src="images/home_content/icons/Ic_leaf.jpg" alt="DyeCraft" /> </div>
              <div class="features-txt">
                <p>Brochures &amp; Packages</p>
              </div>
            </div>
            <div class="product-features width100">
              <div class="features-img"> <img src="images/home_content/icons/Ic_invi.jpg" alt="DyeCraft" /> </div>
              <div class="features-txt">
                <p>Invitations</p>
              </div>
            </div>
          </div>
          
          <div class="products-list animation-element slide-bottom">
            <h4>Printing &amp; Packaging</h4>
<!--            <div class="fadein"> 
            	<img src="images/products/canteens/01.jpg" alt="DyeCraft" />
            	<img src="images/products/canteens/02.jpg" alt="DyeCraft" />
            	<img src="images/products/canteens/03.jpg" alt="DyeCraft" />
            </div>
            <p>To establish a chain of nutrition based canteens at institutions to ensure access to healthier food options</p>
-->         <div class="product-features width100">
              <div class="features-img"> <img src="images/home_content/icons/Ic_digi.jpg" alt="DyeCraft" /> </div>
              <div class="features-txt">
                <p>Digital Printing</p>
              </div>
            </div>
            <div class="product-features width100">
              <div class="features-img"> <img src="images/home_content/icons/Ic_scre.jpg" alt="DyeCraft" /> </div>
              <div class="features-txt">
                <p>Screen Printing</p>
              </div>
            </div>
                    <div class="product-features width100">
              <div class="features-img"> <img src="images/home_content/icons/Ic_offs.jpg" alt="DyeCraft" /> </div>
              <div class="features-txt">
                <p>Offset Printing</p>
              </div>
            </div>
       
          </div>
          <div class="products-list products-list-last animation-element slide-right">
            <h4>Post Press</h4>
            <div class="product-features width100">
              <div class="features-img"> <img src="images/home_content/icons/Ic_foil.jpg" alt="DyeCraft" /> </div>
              <div class="features-txt">
                <p>Die Cutting &amp; Foil Stamping</p>
              </div>
            </div>
            <div class="product-features width100">
              <div class="features-img"> <img src="images/home_content/icons/Ic_pack.jpg" alt="DyeCraft" /> </div>
              <div class="features-txt">
                <p>Lamination &amp; Spot U.V coating</p>
              </div>
            </div>
            <div class="product-features width100">
              <div class="features-img"> <img src="images/home_content/icons/Ic_bind.jpg" alt="DyeCraft" /> </div>
              <div class="features-txt">
                <p>Binding &amp; Packaging</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
      <div id="About" class="about width100">
      <div class="container">
        <div class="title align-center">
          <h1>About Dye Craft</h1>
        </div>
        <div class="about-content">
          <div class="animation-element slide-bottom">
            <h3>With the combined industry expertise of over thirty years, Dyecraft is lead by dynamic team of professionals who deliver top notch design and printing solutions.</h3>
            <h2>What do we do</h2>
            <p>We take of your personal and professional requirements in terms of designing and delivering Invitations, Brochures, Packagings, Catalogs, Leaflets, Posters, and much more.</p>
			<p>We also engage in post-press works like <br />
            > Screen Printing<br />
            > Lamination <br />
            > Foil Stamping &amp; Spot U.V coating<br />
            > Die Cutting</p>
          </div>
        </div>
      </div>
    </div>
  
  
      <div id="Why" class="why width100">
      <div class="container">
        <div class="title">
          <h1>why Dye Craft?</h1>
        </div>
        <div class="width100">
          <div class="why-list animation-element slide-bottom"> <img src="images/home_content/why/02a.png" alt="DyeCraft" />
          <h2>Timely Delivery</h2>
            <p>We at Dyecraft because our years of experience in the printing industry we plan astutely and ensure timely deliver of the projects.</p>
          </div>
          <div class="why-list animation-element slide-bottom"> <img src="images/home_content/why/01a.png" alt="DyeCraft" />
          <h2>Professional Touch </h2>
			<p>The real difference between a good work and a great work is the amount of dedication put into it and we at Dyecraft put all our expertise into every project and make sure they have the professional touch and delivery good quality work.</p>
          </div>
          <div class="why-list why-list-last animation-element slide-bottom"> <img src="images/home_content/why/03a.png" alt="DyeCraft" />
           <h2>Support</h2>
           <p>At Dyecraft, we mindfully understand your requirements, develop the best possible design and printing solutions and will deliver it on time - everytime.</p>
          </div>
        </div>
      </div>
    </div>


<!--<div id="Gallery" class="gallery width100">
      <div class="container">
          <div id="gallery" class="gallery">
            <h1>Gallery</h1>
          <div id="prog01">        
              <ul>
                <li><a href="images/banner/01.jpg" rel="Gallery 01"><img src="images/banner/01.jpg" alt="Gallery 01" /></a></li>
                <li><a href="images/banner/02.jpg" rel="Gallery 01"><img src="images/banner/02.jpg" alt="Gallery 01" /></a></li>
                <li><a href="images/banner/03.jpg" rel="Gallery 01"><img src="images/banner/03.jpg" alt="Gallery 01" /></a></li>
              </ul>
            </div>
  
        </div>
      </div>
    </div>
-->
    
    <div id="Testimonials" class="testimonials width100">
      <div class="container">
        <div class="title">
          <h1>Testimonials</h1>
        </div>
        <div class="width100 testimonials_slide">
          <ul class="rslides2">
            <li>
              <div class="testimonial_lft animation-element slide-left">
                <div class="client_img client_img_after"><img src="images/banner/testi1.jpg" /></div>
              </div>
              <div class="testimonial_rht animation-element slide-right">
				<p>“Good professional team. Delivered export quality packaging. Creative work was really good. In-fact our export customer appreciated packaging. Keep-up the good work Dyecraft”</p>
                 <div class="client_name">
                  <p>- Mr. Ramkumaran</p>
                </div>
                <div class="client_prof">
                  <p>CEO, Seshaa Textiles</p>
                </div>
              </div>
            </li>
            <li>
              <div class="testimonial_lft animation-element slide-left">
                <div class="client_img client_img_after"><img src="images/banner/testi1.jpg" /></div>
              </div>
              <div class="testimonial_rht animation-element slide-right">
				<p>“I really appreciate their professionalism. Customer service was a pleasant experience as well. They really understood our requirements and gave us good packaging designs. Continue the good work.”</p>
                <div class="client_name">
                  <p>- Mr. Joyson</p>
                </div>
                <div class="client_prof">
                  <p>Director, RAMROM Group</p>
                </div>
              </div>
            </li>
            <li>
              <div class="testimonial_lft animation-element slide-left">
                <div class="client_img client_img_after"><img src="images/banner/testi2.jpg" /></div>
              </div>
              <div class="testimonial_rht animation-element slide-right">
				<p>“Handled an emergency order really well. In short notice they delivered our packaging order on time. Thank You for that. Looking forward to continue doing business with Dyecraft”</p>
                <div class="client_name">
                  <p>Mrs. Lalitha Prakadeesh </p>
                </div>
                <div class="client_prof">
                  <p>CEO, Sakthi's Trust</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div id="Contact" class="enquiry width100">
      <div class="container">
        <div class="title">
          <h1>Enquiry</h1>
        </div>
          <div class="form-right">
            <form id="enquiryForm" name="enquiryForm" method="GET" autocomplete="off">
              <div class="form-right-lft">
                <input name="first_name" id="first_name" type="text" placeholder="Name" onChange="return trim(this)"/>
                <div id="alert_first_name" class="errorMsg"></div>
                <input name="phone" id="phone" type="text" placeholder="Phone Number" onKeyPress="return numberHyphenOnly(event)" onChange="return trim(this)"/>
                <div id="alert_phone" class="errorMsg"></div>
                <input name="school" id="school" type="text" placeholder="Company" onChange="return trim(this)"/>
                <div id="alert_school" class="errorMsg"></div>
              </div>
              <div class="form-right-rht">
                <input name="email" id="email" type="text" placeholder="Email Address" onChange="return trim(this)"/>
                <div id="alert_email" class="errorMsg"></div>
                <input name="location" id="location" type="text" placeholder="Location" onChange="return trim(this)"/>
                <div id="alert_location" class="errorMsg"></div>
                <input name="enquiry" id="enquiry" type="text" placeholder="Enquiry" onChange="return trim(this)"/>
                <div id="alert_enquiry" class="errorMsg"></div>
              </div>
              <span><img src="captcha/myimage.php" alt="Captcha" id="imgCaptcha"></span>
              <input name="captcha" id="captcha" type="text" placeholder="Enter Captcha"/>
              <div id="alert_captcha" class="errorMsg"></div>
              <input name="formSubmit" type="button" value="Submit" onClick="return regFormValidate();"/>
            </form>
          </div>
      </div>
    </div>
    <div class="footer width100" id="Reachus">
      <div class="container">
        <div class="footer-content width100">
          <div class="title">
            <h1>Reach Us</h1>
          </div>
          <div class="address width100">
            <div class="footer-section01 width50 mb100">
              <div class="width100">
                <div class="footer-address width100">
                  <h3>Dye Craft</h3>
                  <div class="width50 mb100">
                    <p>63, Chinnaswamy Naidu Road<br>
                       Opp.to Ayyappan Temple<br />
                       New Siddhapudur<br>
                       Coimbatore - 641 044<br>
                       Tamil Nadu, India</p>
                  </div>
                  <div class="footer-contact width50 mb100">
                    <p><img src="images/footer/phone.png" />+91 86676 11635</p>
                    <p><img src="images/footer/mobile.png" />+91 90474 29007</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="footer-section01 width50 mb100">
              <div class="footer-mail">
                <div class="footer-contact width50 mb100">
                   <p><img src="images/footer/mail.png" /><a href="mailto:print@dyecrafts.com">print@dyecrafts.com</a></p>
                  <p><img src="images/footer/mail.png" /><a href="mailto:bestdyecraftworks@gmail.com">bestdyecraftworks@gmail.com </a></p>
                  <p><img src="images/footer/fb.png" /><a href="https://www.facebook.com/Dyecraft-2005943689720333/?modal=admin_todo_tour" target="_blank">DyeCraft</a></p>
                  
             </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="map width100">
    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15664.9300120818!2d76.9731659!3d11.0211747!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x6eb600ffbc434bab!2sDye+Craft!5e0!3m2!1sen!2sin!4v1531236186567" width="600" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>
    </div>
    <div class="copyrights width100">
      <div class="container">
        <div class="DyeCraft width50">
          <p>© All rights reserved @ 2018 DyeCraft</p>
        </div>
        <div class="width50 align-right">
          <p><a href="http://www.ramrom.in/" target="_blank">Made by RAMROM.in</a></p>
        </div>
      </div>
    </div>
  </div>
</div>
<script type="text/javascript" src="js/menu_fixed.js"></script>
<script type="text/javascript">
	var countries=new ddtabcontent("joy")
	countries.setpersist(true)
	countries.setselectedClassTarget("link")
	countries.init()
</script>
</body>
</html>