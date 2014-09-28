/**
 * core common
 * 
 * @package Sngine JSL
 * @author Zamblek
 */
function showMainContent() {
    $('.main-content-div').hide();
    $('#main-content').show();
    $('body').attr('page', 'home');
    getPosts($('body').attr('page'), 'all', true);
}

function logout(elm) {
    $.ajax({
	url: $(elm).attr('href'),
	type: 'GET',
	success: function(data) {
	    window.location.href = "index.html";
	}
    });
}

function handleCommonBasicResponse(status, error, statusElm) {
    if (status === '0') {
	$(statusElm).html('<div class="alert alert-danger">' + error + '</div>').show();
    } else if (status === '1') {
	$(statusElm).html('<div class="alert alert-success">' + error + '</div>').show();
    }
}


$(function() {

    $('body').delegate('#main_navigation .main-navigation-menu a', 'click',
	    function(event) {
		$('#main_navigation').removeClass('in');
	    }
    );
    $(document).delegate('.ajax-popup', 'click',
	    function(event) {
		event.preventDefault();
		$.popups.popup({source: $(this).attr('href'), data: null, width: 450});
	    }
    );
    $(document).delegate('.ajax-sec-content', 'click',
	    function(event) {
		event.preventDefault();
		if ($(this).hasClass('appLink2')) {
		    $('body').attr('page', $(this).attr('data-page'));
		}
		$.ajax({
		    url: $(this).attr('href'),
		    type: 'GET',
		    success: function(data) {
			$('.main-content-div').hide();
			$('#secondary-main-content').html(data).show();
		    }
		});
	    }
    );

    $(document).delegate('.ajax-content', 'click',
	    function(event) {
		event.preventDefault();
		if ($(this).hasClass('appLink2')) {
		    $('body').attr('page', $(this).attr('data-page'));
		}
		$.ajax({
		    url: $(this).attr('href'),
		    type: 'GET',
		    success: function(data) {
			$('.main-content-div').hide();
			$('#main-content').html(data).show();
			getPosts($('body').attr('page'), 'all', true);
		    }
		});
	    }
    );

    // load content in message content div
    $(document).delegate('.ajax-message-content', 'click',
	    function(event) {
		event.preventDefault();
		$.ajax({
		    url: $(this).attr('href'),
		    type: 'GET',
		    success: function(data) {
			$('.main-content-div').hide();
			$('#message-main-content').html(data).show();
		    }
		});
	    }
    );

//    $('body').delegate('.connect-facebook-vsmall', 'click',
//	    function(event) {
//		event.preventDefault();
//		$.popups.iframe({source: $(this).attr('href'), width: 450});
//	    }
//    );

    $('.languageDialog').click('click',
	    function() {
		$.popups.popup({source: SITE_URL + "ajax/translation/dialog.php", data: null, width: 450});
	    }
    );

    $('.changeLanguage').click('click',
	    function() {

		var lang = $(this).attr('id');
		$.ajax({
		    url: SITE_URL + 'ajax/translation/change.php',
		    type: 'POST',
		    data: 'lang=' + encodeURIComponent(lang),
		    success: function(data) {
			setTimeout("window.location.reload()", 1000);
		    }
		});
	    }
    );

    $('.uiButton').click('mousedown',
	    function() {
		$(this).addClass("clicked");
	    }
    );

    $('.uiButton').click('mouseup',
	    function() {
		$(this).removeClass("clicked");
	    }
    );

    $(document).delegate('.uiInput, .uiTextArea', 'focus',
	    function() {

		if ($(this).hasClass('active')) {
		    return;
		}

		if ($(this).data('value') == undefined) {
		    $(this).data('value', $(this).val());
		}
		if ($(this).val() == $(this).data('value')) {
		    $(this).val('');
		}
		if ($(this).val() == '') {
		    $(this).addClass("active");
		    if ($(this).hasClass('uiTextArea')) {
			$(this).parent().next().show();
		    }
		}
	    }
    );

    $(document).delegate('.uiInput, .uiTextArea', 'blur',
	    function() {
		if ($(this).val() == '') {
		    $(this).val($(this).data('value'));
		    $(this).removeClass("active");
		    if ($(this).hasClass('uiTextArea') && !$(this).hasClass('shareNews')) {
			$(this).parent().next().hide();
		    }
		}
	    }
    );

    $('#searchForm .glass').click(
	    function() {
		$(this).parent("form").submit();
	    }
    );

    $('.showHoverCard').click('mouseenter',
	    function() {
		var button = $(this);
		var t = setTimeout(function() {
		    button.find('.hoverCardWrapper').html('<div class="hoverCard"><div class="hoverCardHeader">' + translate['Loading'] + '</div></div><div class="hoverCardArrow"></div>').show();
		    $.ajax({
			type: 'GET',
			url: SITE_URL + 'ajax/users/hovercard.php',
			data: 'id=' + button.attr('id'),
			success: function(data) {
			    button.find('.hoverCard').html(data);
			}
		    });
		}, 1000);
		$(this).data('timeout', t);
	    }
    );

    $('.showHoverCard').click('mouseleave',
	    function() {
		clearTimeout($(this).data('timeout'));
		$(this).find(".hoverCardWrapper").hide();
	    }
    );

    $(document).delegate('.showShareButtons', 'mouseenter',
	    function() {
		var button = $(this);
		var t = setTimeout(function() {
		    button.find('.shareButtonsWrapper').show();
		}, 500);
		$(this).data('timeout', t);
	    }
    );

    $(document).delegate('.showShareButtons', 'mouseleave',
	    function() {
		clearTimeout($(this).data('timeout'));
		$(this).find(".shareButtonsWrapper").hide();
	    }
    );

    $('.showflyHint').click('mouseenter',
	    function() {
		hint = $(this).find(".flyHintWrapper");
		hint.css({bottom: $(this).children().last().outerHeight() + 6 + 'px', right: 0 + 'px'}).show();
		if ($(this).hasClass('toLeft')) {
		    hint.css({left: 0 + 'px', right: 'auto'});
		    hint.find('i.arrow').css({left: 8 + 'px', right: 'auto'});
		}
	    }
    );

    $('.showflyHint').click('mouseleave',
	    function() {
		$(this).find(".flyHintWrapper").hide();
	    }
    );

    $('.reportError').click('click',
	    function() {
		var message = $(this).attr('id');
		var parent = $(this).parents('.errorContianer')
		parent.html('<img src="' + spinner['small'] + '" />');
		$.ajax({
		    type: 'POST',
		    url: SITE_URL + 'ajax/system/report.php',
		    data: 'error=' + encodeURIComponent(message),
		    cache: false,
		    success: function(data) {
			if (!data) {
			    parent.html(translate['Thanks for feedback']);
			} else {
			    parent.html(translate['Reporting failed']);
			}
		    }
		});
		return false;
	    }
    );

});