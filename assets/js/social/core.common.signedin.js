/**
 * core common signedin
 * 
 * @package Sngine JSL
 * @author Zamblek
 */

var originalTitle;
var originalTitleWithCounter;

function liveNotifications(get) {
    if (get == 'new') {
	if ($('.stopCronJobs').length > 0)
	    return;
    }

    var counter = $('#notifiCounter').text();
    if (counter == '')
	counter = 0;

    $.ajax({
	type: 'GET',
	url: SITE_URL + 'ajax/live/notifications.php',
	data: 'get=' + get + '&counter=' + counter,
	success: function(data) {
	    if (data) {
		if (get == 'new') {
		    if (data == 'reseted') {
			$("#notificationsIcon").find('#notifiCounter').hide().text('');
			document.title = originalTitleWithCounter = originalTitle;
			return;
		    }
		    if ($('ul#liveNotifications').children('.navMenuItem').length > 0) {
			$('ul#liveNotifications').children('.navMenuItem').each(function(i) {
			    $(this).remove();
			});
		    }
		}
		$('ul#liveNotifications').append(data);

		var update = $('li.notifiCounter').attr('id');
		if (update > 0) {
		    document.title = originalTitleWithCounter = '(' + update + ') ' + originalTitle;
		    $('#notifiCounter').text(update).fadeIn('fast');
		}
		$('li.notifiCounter').remove();
	    }
	}
    });
}

function liveMessages(get) {

    if (get == 'new') {
	if ($('.stopCronJobs').length > 0)
	    return;
    }

    $.ajax({
	type: 'GET',
	url: SITE_URL + 'ajax/live/messages.php',
	data: 'get=' + get,
	success: function(data) {
	    if (data) {
		if (get == 'new') {
		    if (data == 'reseted') {
			$("#messagesIcon").find('#msgCounter').hide().text('');
			return;
		    }
		    if ($('ul#liveMessages').children('.navMenuItem').length > 0) {
			$('ul#liveMessages').children('.navMenuItem').each(function(i) {
			    $(this).remove();
			});
		    }
		}
		$('ul#liveMessages').append(data);

		var update = $('li.msgCounter').attr('id');
		if (update > 0) {
		    $('#msgCounter').text(update).fadeIn('fast');
		}
		$('li.msgCounter').remove();

	    }
	}
    });
}

function clickReset(app) {

    if (app == 'messages' && $('span#msgCounter').text() == '')
	return;
    if (app == 'notifications' && $('span#notifiCounter').text() == '')
	return;

    $.ajax({
	type: 'POST',
	url: SITE_URL + 'ajax/live/reset.php',
	data: 'app=' + app,
	cache: false,
	success: function(data) {
	    if (!data) {
		if (app == 'messages') {
		    $('span#msgCounter').hide().text('');
		} else if (app == 'notifications') {
		    $('span#notifiCounter').hide().text('');
		}
	    } else {
		$.popups.alert(data);
	    }
	}
    });
}

$(function() {

    $(window).load(function() {
	//clickMessages('all');
	//clickNotifications('all');
    });

    $(document).ready(function() {
	originalTitle = originalTitleWithCounter = document.title;
	//setInterval("clickMessages('new')", 10000);
	//setInterval("clickNotifications('new')", 10000);
    });

    $('body').delegate('.navApp', 'click',
	    function(event) {

		if ($(this).hasClass('homeIcon') || $(this).hasClass('signoutIcon'))
		    return;

		var button = $(this);
		var menu = $(this).next();

		$(".subMenu:visible").each(function(i) {
		    if ($(this).hasClass("navigationMenu")) {
			if ($(this).prev().attr('id') !== menu.prev().attr('id')) {
			    $(this).hide();
			    $(this).prev().removeClass("active");
			}
		    } else if ($(this).hasClass("closeMenu")) {
			$(this).hide();
			$(this).prev().removeClass("active");
			$(this).parents(".dataButtons").hide();
		    } else {
			$(this).hide();
			$(this).prev().removeClass("active");
		    }
		});

		if (button.hasClass("active")) {
		    button.removeClass("active");
		    menu.hide();
		} else {
		    button.addClass("active");
		    menu.show();
		    if (button.attr('id') == 'messagesIcon') {
			clickReset('messages');
		    } else if (button.attr('id') == 'notificationsIcon') {
			clickReset('notifications');
		    }
		}

		event.stopPropagation();
	    }
    );

    $('body').delegate('.resendEmail', 'click',
	    function(event) {

		$.ajax({
		    type: 'POST',
		    url: SITE_URL + "ajax/users/email/resend.php",
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			$.popups.alert({message: data.value, title: data.title});
		    }
		});

	    }
    );

    $('body').delegate('.changeEmail', 'click',
	    function() {
		$.popups.popup({source: SITE_URL + "ajax/users/email/change.php", data: '', width: 450});
	    }
    );

    $('body').delegate('.postChangeEmail', 'submit',
	    function(event) {

		event.preventDefault();

		var email = $(this).find('input[name=email]');

		// check inputs values
		if (!email.hasClass('active')) {
		    return;
		}
		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/users/email/post.php",
		    data: 'email=' + encodeURIComponent(email.val()),
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			if (data) {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    $.popups.alert({message: '<p class="fs11 mb10 white">' + translate['Your email was changed to'] + ': <span class="blue">' + email.val() + '</span>.</p><p class="fs11 white">' + translate['Please click on the link in that email to confirm your email address. Be sure to check your spam/junk folder'] + '.</p>', title: translate["Change Email Address"]});
			    setTimeout("window.location.reload()", 3000);
			}
		    }
		});

		event.stopPropagation();
	    }
    );

    $('body').delegate('.composeMessage', 'click',
	    function() {
		if ($(this).attr('id') !== undefined) {
		    var data = 'id=' + $(this).attr('id') + '&name=' + $(this).attr('name');
		} else {
		    var data = null;
		}
		$.popups.popup({source: SITE_URL + "ajax/messages/compose.php", data: data, width: 450});
	    }
    );

    $('body').delegate('.autoComplete', 'click',
	    function() {
		$(this).find('input').focus();
	    }
    );

    $('body').delegate('.typeaheadInput', 'keyup',
	    function() {

		var input = $(this).val();

		if (input == '') {
		    $('.autoCompleteData:visible').hide();
		    return;
		} else {
		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/messages/recipients.php",
			data: 'q=' + input,
			cache: false,
			success: function(data) {
			    $(".autoCompleteData").html(data).show();
			}
		    });
		}
		return false;
	    }
    );

    $('body').delegate('.autoCompleteItem', 'click',
	    function() {

		var id = $(this).attr('id');
		var name = $(this).find('strong').text();
		var token = '<span id="' + id + '" class="uiToken" title="' + name + '">' + name + '<span class="removeToken button-close small clip-close" title="' + translate['Remove'] + ' ' + name + '"></span></span>';
		var recipient = '<input type="hidden" class="recipientsArray" name="recipients[' + id + ']" value="' + id + '" />';

		$('.getRecipients').prepend(recipient);
		$(this).parents('.autoComplete').find('.tokens').append(token);
		$('.typeaheadInput').val('').focus();
		$(".autoCompleteData:visible").hide();
	    }
    );

    $('body').delegate('.removeToken', 'click',
	    function() {
		var token = $(this).parents('.uiToken');
		$('.getRecipients').find('input[name="recipients[' + token.attr('id') + ']"]').remove();
		token.remove();
		$('.typeaheadInput').focus();
	    }
    );

    $('body').delegate('.postMessage', 'submit',
	    function(event) {

		event.preventDefault();

		var textarea = $(this).find('textarea');

		// check inputs values
		if ($('.uiToken').length == 0 || !textarea.hasClass('active')) {
		    return;
		}

		// prepare recipients
		var recipients = '';
		$('.recipientsArray').each(function() {
		    recipients += $(this).val() + '-';
		});

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/messages/send.php",
		    data: 'recipients=' + encodeURIComponent(recipients) + '&message=' + encodeURIComponent(textarea.val()),
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    var path = window.location.pathname;
			    if (path.indexOf("messages") != -1) {
				window.location.replace(SITE_URL + "message/" + data.value + "/");
			    } else {
				$("#social_popup .modal-body").html('<div class="highlightContianer">' + translate['Message Sent'] + '</div>');
				//setTimeout("$('#social_popup').hide()", 1500);
			    }
			}
		    }
		});

		event.stopPropagation();
	    }
    );

    $('body').delegate('.doFollow', 'click',
	    function() {

		var button = $(this);
		var targetId = $(this).attr('id');
		var loading = $(this).next();
		var followersNum = $(this).parents('.hoverCardWrapper').find('span.followersCounter');

		button.hide();
		loading.show();

		if (button.attr('data-action') == 'follow') {

		    $.ajax({
			type: 'POST',
			url: SITE_URL + "ajax/users/follow.php",
			data: 'uid=' + targetId + '&do=follow',
			cache: false,
			success: function(data) {
			    if (!data) {
				button.val(translate['Unfollow']);
				button.attr('data-action', 'unfollow');
				loading.hide();
				button.show();
				followersNum.text(parseInt(followersNum.text()) + 1);
			    } else {
				loading.hide();
				button.show();
				$.popups.alert({message: data.value, title: data.title});
			    }
			}
		    });

		} else if (button.attr('data-action') == 'unfollow') {

		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/users/follow.php",
			data: 'uid=' + targetId + '&do=unfollow',
			cache: false,
			success: function(data) {
			    if (!data) {
				button.val(translate['Follow']);
				button.attr('data-action', 'follow');
				loading.hide();
				button.show();
				followersNum.text(parseInt(followersNum.text()) - 1);
			    } else {
				loading.hide();
				button.show();
				$.popups.alert({message: data.value, title: data.title});
			    }
			}
		    });
		}
	    }
    );

    $('.dataContainer').click('mouseenter',
	    function() {
		$(this).find(".dataButtons:first").show();
	    }
    );

    $('.dataContainer').click('mouseleave',
	    function() {
		if ($(this).find(".subMenu:visible").length > 0) {
		    return false;
		}
		$(this).find(".dataButtons:first").hide();
	    }
    );

    $('.commentContainer, .qCommentContainer').click('mouseenter',
	    function() {
		$(this).find(".dataButtons").show();
	    }
    );

    $('.commentContainer, .qCommentContainer').click('mouseleave',
	    function() {
		if ($(this).find(".subMenu:visible").length > 0) {
		    return false;
		}
		$(this).find(".dataButtons").hide();
	    }
    );

    $('body').delegate('.button-close, .button-edit', 'click',
	    function(event) {

		event.preventDefault();

		var button = $(this);
		var parentNode = $(this).parents(".dataContainer");

		if ($(this).hasClass("closeNode")) {

		    var menu = $(this).next();

		    $(".subMenu:visible").each(function() {
			if ($(this).hasClass("closeMenu")) {
			    if ($(this).parents(".dataContainer").attr("id") !== parentNode.attr("id")) {
				$(this).hide();
				$(this).prev().removeClass("active");
				$(this).parents(".dataContainer").find('.dataButtons:visible').each(function() {
				    $(this).hide();
				});
			    } else {
				if ($(this).attr("id") !== $(event.target).next(".subMenu").attr("id")) {
				    $(this).hide();
				    $(this).prev().removeClass("active");
				    if ($(this).parents(".commentContainer, .qCommentContainer").length > 0) {
					$(this).parents(".dataButtons").hide();
				    }
				}
			    }
			} else {
			    $(this).hide();
			    $(this).prev().removeClass("active");
			}
		    });

		    if ($(this).hasClass("active")) {
			$(this).removeClass("active");
			menu.hide();
		    } else {
			$(this).addClass("active");
			menu.show();
		    }

		} else if ($(this).hasClass("closeVideo")) {
		    parentNode.find(".mediaPlayer:last").hide();
		    parentNode.find(".mediaPlayer:first").fadeIn("slow");
		}

		event.stopPropagation();

	    }
    );

    $('.pagePicture').click('mouseenter',
	    function() {
		$(this).find(".changePagePicture").show();
	    }
    );

    $('.pagePicture').click('mouseleave',
	    function() {
		$(this).find(".changePagePicture").hide();
	    }
    );

    $(document).click(function(event) {

	if (event.isPropagationStopped())
	    return;

	$(".subMenu:visible").each(function(i) {
	    $(this).hide();
	    $(this).prev().removeClass("active");
	    if ($(this).hasClass("closeMenu")) {
		if (($(this).parents(".dataContainer").attr("id") !== $(event.target).parents(".dataContainer").attr("id")) & ($(this).parents(".dataContainer").attr("id") !== $(event.target).attr("id"))) {
		    $(this).parents(".dataContainer").find('.dataButtons:visible').each(function() {
			$(this).hide();
		    });
		} else {
		    if ($(this).parents(".commentContainer, .qCommentContainer").length > 0 & (($(this).parents(".commentContainer, .qCommentContainer").attr("id") !== $(event.target).parents(".commentContainer, .qCommentContainer").attr("id")) & ($(this).parents(".commentContainer, .qCommentContainer").attr("id") !== $(event.target).attr("id")))) {
			$(this).parents(".dataButtons").hide();
		    }
		}
	    }
	});

    });

});
