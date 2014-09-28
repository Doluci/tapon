/**
 * page messages
 * 
 * @package Sngine JSL
 * @author Zamblek
 */

function getMessages(get, page, replace) {

    // will execute only if messages div is visible
    if ($('#messages-main-content').is(':visible')) {


	if (get == 'new') {
	    if ($('span#currentPage').text() > 1)
		return;
	    if ($('.stopCronJobs').length > 0)
		return;
	}

	page = (page === undefined) ? 1 : page;
	replace = (replace === undefined) ? false : replace;

	var counter = $('#msgCounter').text();
	if (counter == '')
	    counter = 0;

	$.ajax({
	    url: SITE_URL + 'ajax/messages/get.php',
	    type: 'GET',
	    data: 'get=' + get + '&page=' + page + '&counter=' + counter,
	    success: function(data) {
		if (data) {
		    if (replace) {
			$('ul#messagesFeeds').hide().html(data).fadeIn();
		    } else {
			$('ul#messagesFeeds').prepend(data);
		    }
		}
	    }
	});
    }

}

function loadMessagesDiv(elm, href) {
    $.ajax({
	url: href,
	type: 'GET',
	success: function(data) {
	    $('.main-content-div').hide();
	    $('#messages-main-content').html(data).show();
	    getMessages('all', 1, true);
	}
    });

}

$(function() {

//    $(window).load(function() {
//	getMessages('all', 1, true);
//    });
//
//    $(document).ready(function() {
//	setInterval("getMessages('new', 1, true)", 10000);
//    });

    $('.pagerButton').click('click',
	    function() {
		getMessages('all', $(this).attr('id'), true);
	    }
    );

    $('.doRead, .doUnRead').click('click',
	    function() {

		var button = $(this);
		var targetId = $(this).parents('.feedItem').attr('id');

		if (button.hasClass('doRead')) {
		    var action = 'read';
		    button.parents('li:first').removeClass('unread');
		    button.removeClass('doRead msgButtonRead').addClass('doUnRead msgButtonUnRead');
		    button.attr('title', translate['Mark as Unread']);
		} else if (button.hasClass('doUnRead')) {
		    var action = 'unread';
		    button.parents('li:first').addClass('unread');
		    button.removeClass('doUnRead msgButtonUnRead').addClass('doRead msgButtonRead');
		    button.attr('title', translate['Mark as Read']);
		}

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/messages/modify.php",
		    data: 'id=' + targetId + '&do=' + action,
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			if (data) {
			    $.popups.alert({message: data.value, title: data.title});
			    if (button.hasClass('doRead')) {
				button.parents('li:first').removeClass('unread');
				button.removeClass('doRead msgButtonRead').addClass('doUnRead msgButtonUnRead');
			    } else if (button.hasClass('doUnRead')) {
				button.parents('li:first').addClass('unread');
				button.removeClass('doUnRead msgButtonUnRead').addClass('doRead msgButtonRead');
			    }
			}
		    }
		});

		return false;
	    }
    );

    $('body').delegate('.doRemoveConversation', 'click',
	    function() {

		var target = $(this).parents('.feedItem');

		$.popups.confirm(translate['Are you sure you want to delete this message?'], '350',
			function(result) {
			    if (result) {

				$.ajax({
				    url: SITE_URL + 'ajax/messages/delete.php',
				    type: 'POST',
				    data: 'id=' + target.attr('id') + '&type=conversation',
				    cache: false,
				    success: function(data) {
					if (!data) {
					    target.hide();
					} else {
					    $.popups.alert({message: data.value, title: data.title});
					}
				    }
				});

			    }
			}
		);
		return false;
	    }
    );

});
