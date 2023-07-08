$(document).ready(function () {
	var maxHeight = 0;
	
	$('.products-list h4').each(function() {
		if($(this).height() > maxHeight) {
			maxHeight = $(this).height();
		}
	});
	$('.products-list h4').height(maxHeight);
	
	/*var maxHeightP = 0;
	
	$('.products-list p').each(function() {
		if($(this).height() > maxHeightP) {
			maxHeightP = $(this).height();
		}
	});
	$('.products-list p').height(maxHeightP);*/
});


function numberHyphenOnly(e){
	var keycode;
	if (window.event) keycode = window.event.keyCode;
	else if (e) keycode = e.which;
	else return true;
	if((keycode>=48 && keycode <=63) || (keycode==45 ) || keycode==8 || keycode==9 || keycode==0 || keycode==13){	
	     return true;
	}
	else return false;				
}

function numberOnly(e){
	var keycode;
	if (window.event) keycode = window.event.keyCode;
	else if (e) keycode = e.which;
	else return true;
	if((keycode>=48 && keycode <=63) || keycode==8 || keycode==9 || keycode==0 || keycode==86 || keycode==118 || keycode==13){	
	     return true;
	}
	else return false;				
}

$('p').each(function() {
    var $this = $(this);
    if($this.html().replace(/\s| /g, '').length == 0)
        $this.remove();
});

function showLabelAlert(alertVal, id){
  	$("#alert_"+id).html(alertVal);
}

function trim (el) {
    el.value = el.value.
    replace (/(^\s*)|(\s*$)/gi, ""). // removes leading and trailing spaces
    replace (/[ ]{2,}/gi," "). // replaces multiple spaces with one space
    replace (/\n +/,"\n"); // Removes spaces after newlines
    return;
}