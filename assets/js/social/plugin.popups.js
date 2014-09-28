/**
 * plugin popups
 * 
 * @package Sngine JSL
 * @author Zamblek
 */
(function($) {

    $.popups = {
	popup: function(options) {

	    var $smodal = $('#social_popup');
	    $smodal.modal({
		backdrop: 'static'
	    });

	    form = $(
		    '<div class="modal-body"><p>' + translate['Loading'] + '...</p></div>' +
		    '');

	    $smodal.html(form);


	    // default values
	    var defaults = {
		source: "loading",
		data: "",
		width: 300,
	    };
	    var options = $.extend(defaults, options);

	    // handle the request
	    if (options.source !== "loading") {
		$.ajax({
		    type: "POST",
		    url: options.source,
		    data: options.data,
		    success: function(data) {
			$smodal.html(data);
		    },
		    error: function() {
			$smodal.html(
				'<div class="modal-header"><button aria-hidden="true" data-dismiss="modal" class="close" type="button" onclick="$smodal.modal(\'hide\');">×</button><h4 class="modal-title">' + translate['Error'] + '</h4></div>' +
				'<div class="modal-body">' + translate['There is some thing wrong happened'] + '</div>');
		    }
		});
	    }

	},
	confirm: function(message, width, callback) {
	    var $smodal = $('#social_popup');
	    $smodal.modal({
		backdrop: 'static'
	    });

	    form = $('<div class="modal-body"><p>' + message + '</p></div>' +
		    '<div class="modal-footer"><button class="btn btn-default" id="popup_ok" type="button">' + translate['Yes'] + '</button><button class="btn btn-primary" id="popup_cancel" type="button">' + translate['No'] + '</button></div>' +
		    '');

	    $smodal.html(form);

	    $("#popup_ok").click(function() {
		$smodal.modal('hide');
		if (callback)
		    callback(true);
	    });

	    $("#popup_cancel").click(function() {
		$smodal.modal('hide');
		if (callback)
		    callback(false);
	    });

	    $("#popup_ok").focus();

	    $("#popup_ok, #popup_cancel").keypress(function(e) {
		if (e.keyCode == 13)
		    $("#popup_ok").trigger('click');
		if (e.keyCode == 27)
		    $("#popup_cancel").trigger('click');
	    });

	},
	alert: function(options) {

	    var $smodal = $('#social_popup');
	    $smodal.modal({
		backdrop: 'static'
	    });

	    // default values
	    var defaults = {
		message: "",
		title: "Error",
		width: 450,
	    };
	    var options = $.extend(defaults, options);

	    // append the popup window
	    form = $('<div class="modal-header"><button aria-hidden="true" data-dismiss="modal" class="close" type="button" onclick="$smodal.modal(\'hide\');">×</button><h4 class="modal-title">' + options.title + '</h4></div>' +
		    '<div class="modal-body"><p>' + options.message + '</p></div>' +
		    '');

	    $smodal.html(form);

	},
	iframe: function(options) {

	    var $smodal = $('#social_popup');
	    $smodal.modal({
		backdrop: 'static'
	    });

	    // default values
	    var defaults = {
		source: "",
		width: 450
	    };
	    var options = $.extend(defaults, options);
		
	    // append the popup window
	    form = $('<div class="modal-header"><button aria-hidden="true" data-dismiss="modal" class="close" type="button" onclick="$smodal.modal(\'hide\');">×</button></div>' +
		    '<div class="modal-body"><iframe width="'+options.width+'" src="' + options.source + '" style="border: none;"></iframe></div>' +
		    '');

	    $smodal.html(form);

	},
	_reposition: function() {
	    var top = ($(window).height() - $("#popup").outerHeight()) / 2 + window.pageYOffset;
	    var left = ($(window).width() - $("#popup").outerWidth()) / 2;

	    if (top < 0)
		top = 0;
	    if (left < 0)
		left = 0;

	    $("#popup").css({
		top: top + 'px',
		left: left + 'px'
	    });
	},
	_hide: function() {
	    $("#popup").fadeOut(function() {
		$("#popup").remove();
	    });
	}

    }

})(jQuery);