/**
 * plugin textareaExpander
 * 
 * @package Sngine JSL
 * @author Zamblek
 */

(function($) {

    var matched, browser;

    jQuery.uaMatch = function(ua) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
		/(webkit)[ \/]([\w.]+)/.exec(ua) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
		/(msie)[\s?]([\w.]+)/.exec(ua) ||
		/(trident)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
		[];

	return {
	    browser: match[ 1 ] || "",
	    version: match[ 2 ] || "0"
	};
    };

    matched = jQuery.uaMatch(navigator.userAgent);
//IE 11+ fix (Trident) 
    matched.browser = matched.browser == 'trident' ? 'msie' : matched.browser;
    browser = {};

    if (matched.browser) {
	browser[ matched.browser ] = true;
	browser.version = matched.version;
    }

// Chrome is Webkit, but Webkit is also Safari.
    if (browser.chrome) {
	browser.webkit = true;
    } else if (browser.webkit) {
	browser.safari = true;
    }

    jQuery.browser = browser;

    $.fn.TextAreaExpander = function(minHeight, maxHeight) {
	
	// check if the browser  is Safari, IE, Chrome
	var hCheck = !($.browser.msie || $.browser.safari);

	// resize a textarea
	function ResizeTextarea(e) {

	    // event or initialize element?
	    e = e.target || e;

	    // find content length and box width
	    var vlen = e.value.length, ewidth = e.offsetWidth;
	    if (vlen != e.valLength || ewidth != e.boxWidth) {

		if (vlen < e.valLength || ewidth != e.boxWidth)
		    e.style.height = e.iniHeight + "px";
		var h = Math.max(e.expandMin, Math.min(e.scrollHeight, e.expandMax));

		var x = (!hCheck ? e.scrollHeight - e.padding : e.scrollHeight);
		e.style.overflow = (x > h ? "auto" : "hidden");
		e.style.height = x + "px";

		e.valLength = vlen;
		e.boxWidth = ewidth;
	    }

	    return true;
	}
	;

	// initialize
	this.each(function() {

	    // is a textarea?
	    if (this.nodeName.toLowerCase() != "textarea")
		return;

	    // set height restrictions
	    var p = this.className.match(/expand(\d+)\-*(\d+)*/i);
	    this.expandMin = minHeight || (p ? parseInt('0' + p[1], 10) : 0);
	    this.expandMax = maxHeight || (p ? parseInt('0' + p[2], 10) : 99999);
	    this.iniHeight = $(this).height();
	    this.padding = parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom'));

	    // initial resize
	    ResizeTextarea(this);

	    // zero vertical padding and add events
	    if (!this.Initialized) {
		this.Initialized = true;
		$(this).bind("keyup", ResizeTextarea).bind("focus", ResizeTextarea);
	    }
	});

	return this;
    };

})(jQuery);


// initialize all expanding textareas
jQuery(document).ready(function() {
    jQuery("textarea[class*=expand]").TextAreaExpander();
});