jQuery.gallery = {};

jQuery.gallery.defaultOptions = {
	contentDefaultWidth: null, // For content (can be em, % or px) - null default means 50em if pxToEm is available or 700px otherwise (a good line length for legibility)
	contentDefaultHeight: '100%', // For content (can be em, % or px)
	mediaMaxWidth: '100%', // For images (can be em, % or px)
	mediaMaxHeight: '100%', // For images (can be em, % or px)
	treatAsMedia: false, // Set to true for content to be resized as if it's media (good for video content)
	lightBoxMargin: null, // Margin around screen (can be em, % or px) - null default == 2em if pxToEm is available or 20px otherwise
	animateResize: true,
	animationSpeed: 150,
	collapseHeightWhenPossible: true, // When content is shorter than available height, collapse height of lightbox
	reuseFragment: false, // When using a fragment from the same page as the link, reuse the same DOM nodes (persisting their state) or clone a new copy?
	closeButton: false, // Should we have a close button?
	closeButtonImage: '', // Set to the path of your close button image
	closeButtonCorner: 'tl', // Top left 'tl' or top right 'tr' or bottom left (bl) or bottom right (br) - top left is the most intuitive option that doesn't overlap scrollabrs
	clickOverlayCloses: true, // Will clicking the overlay layer (the dark tinted area) close the lightbox?
	preloadLoadingImage: '', // Specify an image path here and it will be preloaded
	preloadGalleryControlsSprite: '', // Specify an image path here and it will be preloaded
	galleryControlWidth: 49, // width of each control (default based on sprite that ships with gallery)
	galleryControlHeight: 85, // height of each control (default based on sprite that ships with gallery)
	galleryMode: 'rel', // Allow navigation between lightboxed images? Options are: rel (all links that have the same 'rel' attribute), 'container' (all links within the one container), 'all' (all linked images), or nothing '' (don't use galleries)
	galleryContainers: '', // CSS selectors specifying elements that contain linked images to form discrete galleries. e.g: '.gallery-pets, #gallery-flowers'
	galleryLoops: false, // When you reach the end of the gallery, should 'next' take you back to the begining? (and vice versa)
	preloadNextGalleryImage: true, // Should the next lightbox be preloaded if it's an image?
	zoomFromClicked: false, // Experimental
	callbackPreOpen: null, // Six callback functions can be defined that will be called at various points in the opening, closing and resizing of lightboxes
	callbackPreResize: null,
	callbackPostResize: null,
	callbackPostOpen: null,
	callbackPreClose: null,
	callbackPostClose: null
};

jQuery.gallery.conf = {
	overlayOpacity: .7,
	lightboxClass: 'lightbox',
	lightboxLinkSelector: 'a.lightbox'
};

jQuery.gallery.linkCount = 0;

/**
 * Standard key mappings
 */
	DOM_VK_END    = 35;
	DOM_VK_HOME   = 36;
	DOM_VK_LEFT   = 37;
	DOM_VK_UP     = 38;
	DOM_VK_RIGHT  = 39;
	DOM_VK_DOWN   = 40;
	DOM_VK_ESCAPE = 27;

(function($) {// start closure
	
	// On DOMLoad
	$(function(){
		// IE6 fails, bail here.
			if ($.browser.msie && $.browser.version < 7) {
				return;
			}
		
		
		// If ResizeEvents plugin is available, listen for resize events
			if (typeof ResizeEvents != 'undefined') {
				$(this).each(function(){
					ResizeEvents.bind (
						'x-text-resize x-window-resize', // no need to catch 'x-initial-sizes', lightbox not open initially
						resizeLightBox
					);
				});
			}
		
		// Create containers
			$('body')
				.append('<div id="overlay"></div><div id="jb-window"><div id="jb-window-inner"><div id="jb-window-content" style="width: auto; height: auto;" tabindex="0"></div></div></div>')
				.bind('keydown',lightBoxKeypress)
			;
			$('#overlay')
				.fadeTo(0,$.gallery.conf.overlayOpacity)
				.css({
					position : 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%'
				})
				.hide()
			;
			$('#jb-window')
				.css({
					position : 'fixed',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%'
				})
				.hide()
				.click(overlayClicked)
			;
			$('#jb-window-inner')
				.css({
					width: '50%',
					height: '50%',
					margin: 'auto',
					overflow: 'auto'
				})
				.centre()
			;
			$('#jb-window-content')
				.css({
					overflow: 'hidden'
				})
				.hide()
			;
				
	});
	
	$.fn.gallery = function (options) {
		
		// IE6 fails, bail here.
			if ($.browser.msie && $.browser.version < 7) {
				return;
			}
		
		options = typeof options != 'undefined' ? options : {};
		
		
		// Pre-load images
			if (options.closeButtonImage != '') {
				$('<img src="'+options.closeButtonImage+'" alt="" />');
			}
			if (options.preloadLoadingImage != '') {
				$('<img src="'+options.preloadLoadingImage+'" alt="" />');
			}
			if (options.preloadGalleryControlsSprite != '') {
				$('<img src="'+options.preloadGalleryControlsSprite+'" alt="" />');
			}
			
		
		// Initialise lightbox links for each match
			$(this).each(function () {
				initLightBox.apply(this, [options]);
			});
		
		return $(this); // facilitate chaining
	};
	
	initLightBox = function (options) {
		
		// Merge runtime options with defaults
		// Note: The first argument sent to extend is an empty object to
		// prevent extend from overriding the default $.AKN.defaultOptions object.
			options = (typeof options == 'undefined')
				? $.gallery.defaultOptions
				: $.extend({}, $.gallery.defaultOptions, options)
			;
		
		pxToEmExists = (typeof Number.prototype.pxToEm != 'undefined') ? true : false;
		
		if (options.lightBoxMargin == null) {
			// if no margin specified, use 2em if pxToEm available, otherwise use 20px
			options.lightBoxMargin = pxToEmExists ? '2em' : '20px' ;
		}
		if (options.contentDefaultWidth == null) {
			// if no default width specified, use 50em if pxToEm available, otherwise use 700px (good line lengths for legibility)
			options.contentDefaultWidth = pxToEmExists ? '50em' : '700px' ;
		}
		
		// Assign an id if none exists
			if (typeof $(this).attr('id') == 'undefined' || $(this).attr('id') == '') { // cater for jquery 1.6 and previous versions
				$(this).attr('id', $.gallery.conf.lightboxClass+'-uid-'+$.gallery.linkCount);
			}
			options.linkID = $(this).attr('id');
			$.gallery.linkCount++;
		
		$(this).data('options', options);
		$(this).addClass($.gallery.conf.lightboxClass);
		$(this).click(openLightBox);
	};
	
	openLightBox = function (e) {
		
		if (typeof e != 'undefined') {
			e.preventDefault(); // so that links aren't followed
		}
		
		
		// if lightbox is open already and fragment was reused... clean up
			if ($('#overlay').is(':visible')) {
					options = $('#overlay').data('options');
					if (options.linkType == 'fragment' && options.reuseFragment) {
						$('.jb-placeholder').after($(href));
						$('.jb-placeholder').remove();
					}
				originalTrigger = options.originalTrigger;
			} else {
				// if opening for the first time, set the original trigger
					originalTrigger = this;
			}
		
		
		// get target content
			href = $(this).attr('href');
			title = $(this).attr('title');
		
		// get options
			options = $(this).data('options');
			options.href = href;
			options.title = title;
			options.trigger = this; // current trigger element
			options.originalTrigger = originalTrigger; // original trigger element
			if (isImage(href)) {
				options.linkType = 'image';
			} else if (href.substring(0,1) == '#') {
				options.linkType = 'fragment';
			} else {
				options.linkType = 'ajax';
			}
		
		
		// run preOpen callback function
			if (options.callbackPreOpen != null && typeof options.callbackPreOpen == 'function') {
				options.callbackPreOpen.apply(this);
			}
		
		// add/remove close button
			if (options.closeButton) {
				if ($('#jb-close-button').size() == 0) {
					$('#jb-window').prepend('<a href="#" id="jb-close-button"><img src="'+options.closeButtonImage+'" alt="Close lightbox" /></a>');
					$('#jb-close-button').click(closeLightBox);
				}
			} else {
				$('#jb-close-button').remove();
			}
		
		// add class if overlay can be clicked to close
			if (options.clickOverlayCloses) {
				$('#jb-window').addClass('reactive');
			} else {
				$('#jb-window').removeClass('reactive');
			}
		
		// Find and store details of gallery (if configured)
			thisLink = $(this);
			if (options.galleryContainers != '') {
				options.galleryMode = 'container';
			}
			options.gallerySelector = '';
			switch (options.galleryMode) {
				default: case '':
				break;
				case 'all':
					options.gallerySelector = $.gallery.conf.lightboxLinkSelector;
				break;
				case 'container':
					parts = options.galleryContainers.split(',');
					$.each(parts, function(){
						selector = this+' '+$.gallery.conf.lightboxLinkSelector;
						if(thisLink.is(selector)) {
							options.gallerySelector = selector;
							return false; // we found the container, break loop
						}
					});
				// break;
				case 'rel': // process rel even when in container mode (but only if not in a container)
					if (options.gallerySelector == '' && $(this).attr('rel') != '') {
						options.gallerySelector = $.gallery.conf.lightboxLinkSelector+'[rel="'+$(this).attr('rel')+'"]';
					}
				break;
			}
		
		// grab previousOptions
			previousOptions = $('#overlay').data('options') || {};
		
			
		// assign link options to lightbox
			$(this).data('options', options);
			$('#overlay').data('options', options);
		
		// Temporarily focus here, until loading is complete
			$('#jb-window').append('<p id="jb-loading">Loading...</p>');
			$('#jb-loading').attr('tabindex', '0').focus();
		
		if ($('#overlay').is(':visible')) {
			// if lightbox is open:
			
			// cleanup after fragment positioning
				if (previousOptions.linkType == 'fragment' && previousOptions.reuseFragment) {
					$('.jb-placeholder').after($(previousOptions.href));
					$('.jb-placeholder').remove();
					$(previousOptions.href).disableFocussableElements();
				}
			
			// hide/clear content
				$('#jb-window-content')
					.hide()
					.empty()
				;
				$('#jb-window').addClass('loading');
				
				loadLightBoxContent.apply(this, [loadLightBoxComplete]);
				
		} else {
		// if lightbox is closed:
			// Disable focussable elements
				$('body').disableFocussableElements(excludeElements='#jb-window *');
				
			// hide button
				$('#jb-close-button').hide();
			
			// hide gallery controls
				$('#jb-gallery-controls').hide();
				
			// show overlay
				$('#overlay').fadeIn(options.animationSpeed).centre();
			
			// open small lightbox with loading spinner
				$('#jb-window')
					.addClass('loading')
					.show()
				;
			
			// to zoom or not to zoom?
				if (options.zoomFromClicked) {
					// align window with clicked element (for 'zoom in' effect)
						triggerOffset = $(this).offset();
						$('#jb-window-inner').css({
							top: triggerOffset.top,
							left: triggerOffset.left,
							width: $(this).width(),
							height: $(this).height()
						});
				} else {
					// just centre
						$('#jb-window-inner')
							.css({
								width: '100px',
								height: '100px'
							})
							.centre()
						;
				}
			
			// load new content to hidden layer
				loadLightBoxContent.apply(this, [loadLightBoxComplete]);
		}
		
		
			
			
		
		// for any images in the lightbox, if they are now physically smaller than the relevant max-size, add click-to-zoom capability
		
	};
	
	loadLightBoxComplete = function(){
		// once loaded
			// init options
				options = $('#overlay').data('options');
			
			// restore focussable elements inside content (in case content cloned from current page)
				$('#jb-window').restoreFocussableElements();
			
			// remove spinner
				$('#jb-window').removeClass('loading');
			
			
			// Redundant settimeout for webkit, cause otherwise dimensions are 0 when image loaded from cache. Thanks JKS! <http://stackoverflow.com/users/144149/jks>
			// @see http://stackoverflow.com/questions/318630/get-real-image-width-and-height-with-javascript-in-safari-chrome#answer-4909227
			setTimeout(function(){
				
				// Establish appropriate classes for new content type before fade in
					$('#jb-window').removeClass('type-media type-image type-fragment type-ajax');
					switch (options.linkType) {
						case 'image':
							$('#jb-window').addClass('type-image type-media');
							$('#jb-window-inner').css('overflow','hidden');
						break;
						case 'fragment':
							$('#jb-window').addClass('type-fragment');
							$('#jb-window-inner').css('overflow','auto');
						break;
						case 'ajax':
							$('#jb-window').addClass('type-ajax');
							$('#jb-window-inner').css('overflow','auto');
						break;
					}
					if (options.treatAsMedia) {
						$('#jb-window').addClass('type-media');
					}
				
				// resize
					resizeLightBox.apply(this, [function(){
						
						// fade in new content
							$('#jb-window-content').fadeIn(options.animationSpeed, function(){
								
								// set focus to start of lightbox content
									$('#jb-window-content')
										//.attr('tabindex',0) // add to tab index (now occurs during initialisation)
										.focus() // set focus
									;
								
								// Remove temporary loading message
									$('#jb-loading').remove();
							
								// run postOpen callback function
									if (options.callbackPostOpen != null && typeof options.callbackPostOpen == 'function') {
										options.callbackPostOpen.apply(this);
									}
								
								// preload next gallery image?
									nextControl = $('#next');
									if (
										options.preloadNextGalleryImage && 
										nextControl.size() > 0 && 
										nextControl.is(':visible') && 
										nextControl.attr('href') != '#' && 
										isImage(nextControl.attr('href'))
									) {
										$('<img src="'+nextControl.attr('href')+'" alt="" />');
									}
								
							});
							
						
					}]);
			
			}, 0);
			
	};
	
	resizeLightBox = function (callback) {
		
		
		options = $('#overlay').data('options');
		if (typeof options == 'undefined') {
			return; // options haven't been assigned to lightbox overlay yet
		}
		
		
		lbMargin = parseInt(parsePixels(options.lightBoxMargin), 10);
		
		availableWidth = $('#jb-window').width() - (lbMargin * 2);
		availableHeight = $('#jb-window').height() - (lbMargin * 2);
		
		// find current default/max dimensions (convert to pixels if necessary)
			contentDefaultWidth = parsePixels(options.contentDefaultWidth, availableWidth);
			contentDefaultHeight = parsePixels(options.contentDefaultHeight, availableHeight);
			mediaMaxWidth = parsePixels(options.mediaMaxWidth, availableWidth);
			mediaMaxHeight = parsePixels(options.mediaMaxHeight, availableHeight);
		
		
		// run preResize callback function
				if (options.callbackPreResize != null && typeof options.callbackPreResize == 'function') {
					options.callbackPreResize.apply($('#jb-window'), [availableWidth, availableHeight, contentDefaultWidth, contentDefaultHeight, mediaMaxWidth, mediaMaxHeight]);
				}
		
		if (options.linkType == 'image' || options.treatAsMedia) {
		
			// measure content size
				w = $('#jb-window-content').lightBoxContentWidth();
				h = $('#jb-window-content').lightBoxContentHeight();
				
				
			// compare dimensions against max width and height
				if (w > mediaMaxWidth) {
					reductionRatio = w / mediaMaxWidth;
					w = mediaMaxWidth;
					h = h / reductionRatio;
					// $.debug('w ratio = '+reductionRatio);
				}
				if (h > mediaMaxHeight) {
					reductionRatio = h / mediaMaxHeight;
					h = mediaMaxHeight;
					w = w / reductionRatio;
					// $.debug('h ratio = '+reductionRatio);
				}
			
			// compare dimensions against available width and height
				if (w > availableWidth) {
					reductionRatio = w / availableWidth;
					w = availableWidth;
					h = h * reductionRatio;
					// $.debug('w ratio = '+reductionRatio);
				}				
				if (h > availableHeight) {
					reductionRatio = h / availableHeight;
					h = availableHeight;
					w = w * reductionRatio;
					// $.debug('h ratio = '+reductionRatio);
				}
				// $.debug('max img width = '+options.mediaMaxWidth);
				// $.debug('max img height = '+options.mediaMaxHeight);
				
		} else {
			
			// not an image or treat as media (must be content fragment)
			
			// $.debug('contentDefaultWidth = '+options.contentDefaultWidth);
			// $.debug('contentDefaultHeight = '+options.contentDefaultHeight);
			
			// measure content width
				w = $('#jb-window-content').lightBoxContentWidth();
			
				if (
					contentDefaultWidth == '' ||
					contentDefaultWidth == '100%' ||
					availableWidth < contentDefaultWidth
				) {
					w = availableWidth;
				} else {
					w = contentDefaultWidth;
				}
			
			if (options.collapseHeightWhenPossible) {
				
				// set new width temporarily
					prevWidth = $('#jb-window-inner').width();
					//$('#jb-window-inner').width(w); // not kicking in fast enough, use animate to lock in new width
					$('#jb-window-inner').animate({width: w}, 0);
					
				// measure height
					h = $('#jb-window-content').lightBoxContentHeight(relaxWidth = false);
					
				// set width back to previous value
					$('#jb-window-inner').width(prevWidth);
					
					if (
						availableHeight < h
					) {
						h = availableHeight;
					} else {
						// do nothing
						// h = contentDefaultHeight;
					}
					
			} else {
				
				// same height for all content boxes (based on contentDefaultHeight)
					h = $('#jb-window-content').lightBoxContentHeight();
					if (
						contentDefaultHeight == '' ||
						contentDefaultHeight == '100%' ||
						availableHeight < contentDefaultHeight
					) {
						h = availableHeight;
					} else {
						h = contentDefaultHeight;
					}
			}
			
		}
		
		// $.debug('availableWidth = '+availableWidth);
		// $.debug('availableHeight = '+availableHeight);
		// $.debug('final w = '+w);		
		// $.debug('final h = '+h);
		
				
		topLeft = findOffsetToCentre(w, h);
		
		// if not animating resize, set speed to 0
		animationSpeed = options.animateResize ? options.animationSpeed : 0;
		
		$('#jb-close-button').hide();
		$('#jb-gallery-controls').hide();
		
		$('#jb-window-inner').animate({
			'width' : w,
			'height' : h,
			'left' : topLeft[1],
			'top' : topLeft[0]
		}, animationSpeed, 0, function() {
			
			w = $('#jb-window-inner').width();
			h = $('#jb-window-inner').height();
			
			// Show close button
				if ($('#jb-close-button').size() > 0) {
					buttonWidth = parseInt($('#jb-close-button').width(), 10);
					buttonHeight = parseInt($('#jb-close-button').height(), 10);
					
					switch (options.closeButtonCorner) {
						default: case 'tl':
							buttonLeft = topLeft[1] - buttonWidth/2;
							buttonTop = topLeft[0] - buttonHeight/2;
						break;
						case 'tr':
							buttonLeft = topLeft[1] + w - buttonWidth/2;
							buttonTop = topLeft[0] - buttonHeight/2;
						break;
						case 'br':
							buttonLeft = topLeft[1] + w - buttonWidth/2;
							buttonTop = topLeft[0] + h - buttonHeight/2;
						break;
						case 'bl':
							buttonLeft = topLeft[1] - buttonWidth/2;
							buttonTop = topLeft[0] + h - buttonHeight/2;
						break;
					}
					
					$('#jb-close-button')
						.css({
							position: 'absolute',
							'z-index': '999999',
							left: buttonLeft,
							top: buttonTop
						})
						.show()
					;
				}
			
			
			// Are gallery controls relevant?
				if ($('#jb-gallery-controls').is('.active')) {
					// Position gallery controls
						prevTop = topLeft[0] + h/2 - options.galleryControlHeight/2;
						prevLeft = topLeft[1] - options.galleryControlWidth;
						$('#prev').css({top: prevTop, left: prevLeft});
						
						nextTop = topLeft[0] + h/2 - options.galleryControlHeight/2;
						nextLeft = topLeft[1] + w;
						$('#next').css({top: nextTop, left: nextLeft});
						
					// Show gallery controls
						$('#jb-gallery-controls')
							//.fadeIn()
							.show() // faster!
						;
				}
			
			// run postResize callback function
				if (options.callbackPostResize != null && typeof options.callbackPostResize == 'function') {
					options.callbackPostResize.apply($('#jb-window'), [availableWidth, availableHeight, contentDefaultWidth, contentDefaultHeight, mediaMaxWidth, mediaMaxHeight]);
				}
			
			if (typeof callback != 'undefined' && typeof callback.apply != 'undefined') {
				callback.apply();
			}
		});
		
	};
	
	loadLightBoxContent = function (callback) {
		
		options = $('#overlay').data('options');
		href = options.href;
		title = options.title ? '<p class=\'caption\'>' + options.title + '</p>':'';
		
		// remove previous error states
			$('#jb-window').removeClass('error-no-content');
		
		// Setup/adjust gallery (next/prev) links
			// Find the gallery set
				gallerySet = $(options.gallerySelector);
			
			$('#jb-gallery-controls').removeClass('active');
			if (gallerySet.size() > 1 && gallerySet.isInSet('#'+options.linkID)) {
				
				// Setup the HTML for the gallery controls
					if ($('#jb-gallery-controls').size() == 0) {
						$('#jb-window').append('<div id="jb-gallery-controls"></div>');
						prevControl = $('<a id="prev" href="#">Previous</a>').click(galleryControlsClick);
						nextControl = $('<a id="next" href="#">Next</a>').click(galleryControlsClick);
						$('#jb-gallery-controls').append(prevControl).append(nextControl);
						prevControl.add(nextControl).css({
							position: 'absolute',
							'z-index': '99999',
							display: 'block',
							overflow: 'hidden'
						});
					} else {
						prevControl = $('#prev');
						nextControl = $('#next');
						prevControl.add(nextControl)
							.removeClass('disabled')
							.attr('tabindex', '0')
							.attr('title', '')
						;
					}
					$('#jb-gallery-controls').hide();
					$('#jb-gallery-controls').addClass('active');
				
				
				// Find previous link
					prevLink = gallerySet.prevInSet('#'+options.linkID);
					if (prevLink == false) {
						if (options.galleryLoops) {
							prevLink = gallerySet.lastInSet();
						} else {
							prevLink = $('<a href="#" id=""></a>');
							prevControl
								.addClass('disabled')
								.attr('tabindex', '-1')
							;
						}
					}
					prevControl
						.attr('href', prevLink.attr('href'))
						.data('linkID', prevLink.attr('id'))
						.attr('title', prevLink.accessibleText())
					;
				
				// Find next link
					nextLink = gallerySet.nextInSet('#'+options.linkID);
					if (nextLink == false) {
						if (options.galleryLoops) {
							nextLink = gallerySet.firstInSet();
						} else {
							nextLink = $('<a href="#" id=""></a>');
							nextControl
								.addClass('disabled')
								.attr('tabindex', '-1')
							;
						}
					}
					nextControl
						.attr('href', nextLink.attr('href'))
						.data('linkID', nextLink.attr('id'))
						.attr('title', nextLink.accessibleText())
					;
					
			} else {
				$('#jb-gallery-controls').hide();
			}
		
		switch (options.linkType) {
			case 'fragment': // internal page fragment
				
				if (options.reuseFragment) {
					$(href).after('<span class="jb-placeholder"></span>');
					$('#jb-window-content').empty().append($(href)); // href becomes a selector for an id fragment
				} else {
					$('#jb-window-content').empty().append($(href).clone(withDataAndEvents=true));
				}
				
				checkForContent.apply(this, [options.linkType, href]);
				callback.apply(this);

				
			break;
			case 'image': // link to image
					
					$('#jb-window-content').empty().append(
						'<img src="'+href+'" alt="" style="max-width: 100%; max-height: 100%; float: left;" />'+title
					);
					$('#jb-window-content img')
						.error(function(){
							checkForContent.apply(this, [options.linkType, href, callback]);
						})
						.data('full-width', '')
						.data('full-height', '')
						.load(callback)
					;
					
			break;
			default: case 'ajax': case '': // link to external page (or fragment of a page)
			
				// ajax call on remote file
				$.ajaxSetup ({
					cache: true
				});
				if (href.indexOf('#') != -1) {
					ajaxHref = href.split('#').join(' #');
				} else {
					ajaxHref = href;
				}
				$('#jb-window-content').empty().load(ajaxHref, function(){
					checkForContent.apply(this, [options.linkType, href]);
					callback.apply(this);
				});
				
			break;
		}
		
		
	};
	
	checkForContent = function (linkType, href, callback) {
		// check if no content loaded
			wasError = false;
			
			// checkForContent only called for images on .error()
			// otherwise, if no children() exist
				if (linkType == 'image' || $('#jb-window-content').children().size() == 0) {
					wasError = true;
				}
			
			if (wasError) {
				options = $('#overlay').data('options');
				options.linkType = 'fragment';
				options.treatAsMedia = false;
				$('#overlay').data('options', options);
				$('#jb-window')
					.removeClass('type-image type-media')
					.addClass('type-fragment error-no-content')
				;
				$('#jb-window-content').empty().append('<p>There was an error loading lightbox content. <strong>'+$(options.trigger).text()+'</strong> (<samp>'+href+'</samp>) could not be found.</p>');
			}
			if (typeof callback != 'undefined') {
				callback.apply(this);
			}
	};
	
	closeLightBox = function (evt) {
		evt && evt.preventDefault(); // prevent click from following link
		
		options = $('#overlay').data('options');
		href = options.href;
		
		// run preClose callback function
			if (options.callbackPreClose != null && typeof options.callbackPreClose == 'function') {
				options.callbackPreClose.apply(options.trigger);
			}
		
		// cleanup after fragment positioning
			if (options.linkType == 'fragment' && options.reuseFragment) {
				$('.jb-placeholder').after($(href));
				$('.jb-placeholder').remove();
			}
		
		
		// Restore all focussable elements
			$('body').restoreFocussableElements();
		
		$('#overlay').fadeOut(options.animationSpeed);
		$('#jb-window').hide();
		$('#jb-window-content').hide();
		
		// return focus to original trigger element
			originalTriggerEL = $(options.originalTrigger);
			if (typeof originalTriggerEL.attr('tabindex') == 'undefined') {
				originalTriggerEL.attr('tabindex',0);
			}
			originalTriggerEL.focus();
		
		// Remove temporary loading message
			$('#jb-loading').remove();
		
		// run postClose callback function
			if (options.callbackPostClose != null && typeof options.callbackPostClose == 'function') {
				options.callbackPostClose.apply(options.trigger);
			}
	};
	
	
	/**
	 * A plugin to measure the width of an element accurately (even if it is hidden)
	 */
	$.fn.lightBoxContentWidth = function () {
		
		jbWindow = $(this).closest('#jb-window');
		jbWindowInner = $('#jb-window-inner');
		isImageType = jbWindow.hasClass('type-media') ? true : false;
		isImageMedia = jbWindow.hasClass('media-image') ? true : false;
		currentWidth = jbWindowInner.width();
		currentHeight = jbWindowInner.height();
		currentLeft = jbWindowInner.css('left');
		currentTop = jbWindowInner.css('top');
		
		// relax size for measurement
			if (
				$.browser.msie &&
				$.browser.version == 7 &&
				isImageType &&
				isImageMedia && 
				$(this).find('img').outerWidth({margin:true}) == 0 // IE7 width == 0 on initial load
			) { // only works with '100%' for IE7 on initial load
				jbWindowInner.css({
					width: '100%',
					height: '100%',
					left:0,
					top:0
				});
			} else { // must use 'auto' for all other situations
				jbWindowInner.css({
					width: 'auto',
					height: 'auto',
					left:0,
					top:0
				});
			}
		
		
		// if element is hidden, unhide it, then measure
			if ($(this).css('display') == 'none') {
							
				// make element display for a nanosecond
					$(this).css('display', 'block');
					
				// measure
					if (isImageType) {
						fullWidth = $(this).find('img').outerWidth({margin:true});
					} else {
						fullWidth = $(this).outerWidth({margin:true});
					}
				// restore
					$(this).css('display', 'none');
					
			} else {
				fullWidth = $(this).outerWidth({margin:true});
			}
		
		
		// reinstate previous size/position
			jbWindowInner.css({'left':currentLeft,'top':currentTop});
			jbWindowInner.animate({
				width: currentWidth,
				height: currentHeight//,
					//left: curentLeft,
					//top: currentTop
			},0);
		
		return fullWidth;
	};
	
	/**
	 * A plugin to measure the height of an element accurately (even if it is hidden)
	 */
	$.fn.lightBoxContentHeight = function (relaxWidth) {
		
		relaxWidth = typeof relaxWidth != 'undefined' ? relaxWidth : true;
		jbWindow = $(this).closest('#jb-window');
		isImageType = jbWindow.hasClass('type-media') ? true : false;
		isImageMedia = jbWindow.hasClass('media-image') ? true : false;
		
		// always relax height
			currentWidth = $('#jb-window-inner').width();
			currentHeight = $('#jb-window-inner').height();
			currentLeft = jbWindowInner.css('left');
			currentTop = jbWindowInner.css('top');
			
		// relax size for measurement
			if (
				$.browser.msie && 
				$.browser.version == 7 && 
				isImageType && 
				isImageMedia &&
				$(this).find('img').outerWidth({margin:true}) == 0 // IE7 width == 0 on initial load
			) { // only works with '100%' for IE7 on initial load
					$('#jb-window-inner').height('100%');
					if (relaxWidth) {
						$('#jb-window-inner').width('100%').css({left:0,top:0});
					}
			} else { // must use 'auto' for all other situations
					$('#jb-window-inner').height('auto');
					if (relaxWidth) {
						$('#jb-window-inner').width('auto').css({left:0,top:0});
					}
			}
		
		// if element is hidden, unhide it, then measure
		if ($(this).css('display') == 'none') {
						
			// make element display for a nanosecond
				$(this).css('display', 'block');
			
			// measure
				fullHeight = $(this).outerHeight({margin:true});
				
			// restore
				$(this).css('display', 'none');
			
				
		} else {
			fullHeight = $(this).outerHeight({margin:true});
		}
		
		// reinstate previous size
			$('#jb-window-inner')
				.width(currentWidth)
				.height(currentHeight)
				.css({left:currentLeft,top:currentTop})
			;
		
		return fullHeight;
	};
	
	
	overlayClicked = function (evt) {
		options = $('#overlay').data('options');
				
		if (evt.target == $('#jb-window').get(0) && options.clickOverlayCloses) {
			closeLightBox.apply();
		} else {
			// do nothing
		}
	};
	
	/**
	 * Key pressed on keyboard
	 */
	lightBoxKeypress = function (evt) {
		//$.debug('Key pressed: '+evt.keyCode);
		
		// If lightbox is not open or if modifier keys are down, ignore key presses
			if (
				!$('#overlay').is(':visible') ||
				evt.ctrlKey ||
				evt.altKey ||
				evt.shiftKey ||
				evt.metaKey
			) {
				return true; /* facilitate further bubbling */
			}
		
		// Get the key that was pressed
			evtKeyCode = getKeyCode(evt);
		
		
		// handle keypresses here
			switch (evtKeyCode) {
				case DOM_VK_UP:
				case DOM_VK_LEFT:
					$('#prev').click();
				break;
				case DOM_VK_DOWN:
				case DOM_VK_RIGHT:
					$('#next').click();
				break;
				case DOM_VK_HOME:
					$($('#overlay').data('options').gallerySelector).firstInSet().click();
				break;
				case DOM_VK_END:
					$($('#overlay').data('options').gallerySelector).lastInSet().click();
				break;
				case DOM_VK_ESCAPE:
					closeLightBox.apply();
				break;
				default:
					// A different (untracked) key was pressed, just ignore it
						return true; /* facilitate further bubbling */
				break;
			}
		
		// Event already handled, prevent default
			evt.preventDefault();
	};
	
	/**
	 * Someone activated gallery 'next' or 'prev' links
	 */
	galleryControlsClick = function (evt) {
		
		// Prevent default action
			evt.preventDefault();
		// find the gallery link, and activate it
			if ($(this).data('linkID') != '') {
				
				$('#jb-gallery-controls').hide(); // hide gallery controls for the transition
				
				lightboxLink = $('#'+$(this).data('linkID'));
				return lightboxLink.click();
			}
	};
	
	/**
	 * A plugin to centre a visible element on the screen
	 */
	$.fn.centre = function () {
		$(this).css("position","fixed");
		$(this).css("top", ( $(window).height() - $(this).outerHeight() ) / 2 + "px");
		$(this).css("left", ( $(window).width() - $(this).outerWidth() ) / 2 + "px");
		return this;
	};
	
	findOffsetToCentre = function (w, h) {
		topOffset = ( $(window).height() - h ) / 2;
		leftOffset = ( $(window).width() - w ) / 2;
		
		//// $.debug ('w = '+w+' | h = '+h+' | top = '+top+' | left = '+left);
		
		return [topOffset, leftOffset];
	};
	
	
	/**
	 * Find if the node is in the set of nodes
	 */
	$.fn.isInSet = function(currentElement) {
		return $(this).index($(currentElement)) > -1 ? true : false;
	}
	
	/**
	 * Find the next node in the currently selected set of nodes
	 */
	$.fn.nextInSet = function(currentElement) {
		currentIndex = $(this).index($(currentElement));
		if ($(this).size() > currentIndex+1) {
			return $(this).eq(currentIndex+1);
		} else {
			return false;
		}
	}
	
	/**
	 * Find the previous node in the currently selected set of nodes
	 */
	$.fn.prevInSet = function(currentElement) {
		currentIndex = $(this).index($(currentElement));
		if (currentIndex > 0) {
			return $(this).eq(currentIndex-1);
		} else {
			return false;
		}
	}
	
	/**
	 * Find the first node in the currently selected set of nodes
	 */
	$.fn.firstInSet = function() {
		if ($(this).size() > 1) {
			return $(this).eq(0);
		} else if ($(this).size() > 0) {
			return $(this);
		} else {
			return false;
		}
	}
	
	
	/**
	 * Find the last node in the currently selected set of nodes
	 */
	$.fn.lastInSet = function() {
		if ($(this).size() > 1) {
			return $(this).eq($(this).size()-1);
		} else if ($(this).size() > 0) {
			return $(this);
		} else {
			return false;
		}
	}
	
	
	/**
	 * Dump debug messages to // console if available, otherwise to status bar.
	 */
	$.debug = function (message){
		if (typeof window.console != 'undefined' && window.console.log != 'undefined') {
			window.console.log(message);
		} else {
			// un comment next line if testing IE6 issues in dev environment (don't use for production)
				//window.status = message;
		}
	};
	
	/**
	 * from: http://stackoverflow.com/questions/1933501/how-to-put-targetblank-in-jquery
	 */
	isImage = function (fileName) {
		
        if (typeof fileName == 'undefined' || fileName == '') {
            return false;
        }
        var pos = (fileName+'').lastIndexOf(".");
        if (pos == -1){
            return false;
        } else {
            var extension = fileName.substring(pos);
            switch (extension.toLowerCase()) {
            case ".jpg":
            case ".png":
            case ".gif":
            case ".bmp":
            case ".jpeg":
                return true;
            break;
            default:
                return false;
            break;
            }
        }
    };
	
	
	/**
	 * Get the keycode of an event
	 */
	function getKeyCode(evt) {
		evt = evt || window.event;
		
		if (evt.keyCode) {
			return evt.keyCode;
		} else if (evt.which) {
			return evt.which;
		}
		return null;
	}
	
	/**
	 * Disable all focussable elements outside the lightbox. Stores previous tabindex for later restoration
	 * Currently targets links, common form elements and anything with tabindex > -1
	 * @see http://stackoverflow.com/questions/1599660/which-html-elements-can-receive-focus
	 */
	$.fn.disableFocussableElements = function (excludeElements) {
		excludeElements = excludeElements||'';
		focussable = $(this).find('a, input, button, area, frame, iframe, [tabindex]').not(excludeElements).not('*[tabindex="-1"]');
		
		focussable.each(function(){
			prevTabIndex = typeof (prevTabIndex = $(this).attr('tabindex')) == 'undefined' || prevTabIndex == '' ? '' : prevTabIndex;
			$(this)
				.data('prevTabIndex', prevTabIndex)
				.addClass('jb-unfocussed')
				.attr('tabindex', '-1')
			;
		});
	};
	
	/**
	 * Returns the textnodes within the element, concatenated with any alt text.
	 */
	$.fn.accessibleText = function () {
		result = '';
		
		$(this).contents().each(function(){
			switch ($(this).prop('nodeType')) {
				case 3: // text
					result += $(this).text();
				break;
				case 1: // element
					if ($(this).prop('nodeName') == 'IMG') {
						result += $(this).attr('alt');
					}
				break;
				default: break; // otherwise ignore
			}
		});
		
		return result;
	}
	
	/**
	 * Restore all focussable elements outside the lightbox.
	 */
	$.fn.restoreFocussableElements = function () {
		focussable = $(this).find('.jb-unfocussed');
		
		focussable.each(function(){
			switch (prevTabIndex = $(this).data('prevTabIndex')) {
				default:
					$(this).attr('tabindex', prevTabIndex);
				break;
				case '':
					$(this).removeAttr('tabindex');
				break;
			}
			$(this).removeClass('jb-unfocussed');
		});
	};
	
	/**
	 * Converts % or em values to a number of pixels (integer).
	 * Use pxToEm (reverse mode) to convert em values to pixels (if the plugin is available)
	 * @param String input The dimenion to be converted (may include % or em or px)
	 * @param integer centDimension The dimension that represents 100%
	 * @return integer Converted dimension in pixels
	 */
	parsePixels = function (input, centDimension) {
		
		centDimension = typeof centDimension != 'undefined' ? centDimension : $('body').width() ;
		
		input = input
			.replace('px','') // remove px units if present
			.replace(/^\s+|\s+$/g,"") // trim leading and trailing whitespace
		;
		
		if (!isNaN(input)) {
			// int already, return as pixels
				return parseInt(input, 10);
		} else if (input.substr(input.length - 1) == '%') {
			// %, convert to pixels
				
				if (typeof centDimension != 'undefined') {
					input = parseInt(input
						.substr(0, input.length - 1) // strip unit
						.replace(/^\s+|\s+$/g,"") // trim
					, 10);
					return input/100 * parseInt(centDimension, 10);
				} else {
					$.debug('Warning: percentage unit was supplied to parsePixels() but could not be calculated because centDimension was not supplied.');
					return parseInt(input, 10);
				}
				
		} else if (input.substr(input.length - 2) == 'em') {
			// em, check for pxToEm and convert (or warn)
				if (typeof Number.prototype.pxToEm != 'undefined') {
					input = parseInt(input
						.substr(0, input.length - 2) // strip unit
						.replace(/^\s+|\s+$/g,"") // trim
					, 10);
					input = input.pxToEm({
					   reverse: true
					});
					return input.substr(0, input.length - 2); // strip unit px;

				} else {
					$.debug('Warning: em unit was supplied to parsePixels() but could not be calulated because pxToEm plugin was not found.');
					return parseInt(input, 10);
				}
		} else {
			// unknown units, warn
			$.debug('Warning: unknown unit was supplied. parsePixels() can support px, em or % units only.');
			return parseInt(input, 10);
		}
	};


})(jQuery); /* end closure */