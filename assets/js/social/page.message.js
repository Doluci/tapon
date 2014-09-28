/**
 * page message
 * 
 * @package Sngine JSL
 * @author Zamblek
 */

function getMessage() {
    // will execute only if message div is visible
    if ($('#message-main-content').is(':visible')) {

	if ($('.stopCronJobs').length > 0)
	    return;

	var targetId = $('#messageFeeds li.feedItem').last().attr('id');

	$.ajax({
	    url: SITE_URL + 'ajax/messages/chat.php',
	    type: 'GET',
	    data: 'id=' + targetId,
	    success: function(data) {
		if (data) {
		    $('ul#messageFeeds').append($(data).fadeIn('slow'));
		}
	    }
	});
    }
}

$(function() {

    $(document).ready(function() {
	//setInterval("getMessage()", 10000);
    });

    $('body').delegate('.doRemoveMessage', 'click',
	    function() {

		var target = $(this).parents('.feedItem');

		$.popups.confirm(translate['Are you sure you want to delete this message?'], '350',
			function(result) {
			    if (result) {

				$.ajax({
				    url: SITE_URL + 'ajax/messages/delete.php',
				    type: 'POST',
				    data: 'id=' + target.attr('id') + '&type=message',
				    cache: false,
				    success: function(data) {
					if (!data) {
					    target.hide();
					    if ($('.feedItem:visible').length == 0) {
						//window.location.replace(SITE_URL + '/messages/');
					    }
					} else {
					    $.popups.alert(data);
					}
				    }
				});

			    }
			}
		);
	    }
    );

    $('body').delegate('.postReply', 'submit',
	    function(event) {

		event.preventDefault();

		var button = $(this).find('input[type=submit]');
		var loading = button.next();
		var id = $(this).attr('id');
		var textarea = $(this).find('textarea');

		// check inputs values
		if (!textarea.hasClass('active')) {
		    return;
		}

		button.hide();
		loading.show();
		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/messages/reply.php",
		    data: 'id=' + id + '&message=' + encodeURIComponent(textarea.val()),
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			loading.hide();
			button.show();
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    textarea.val('').focus();
			    $('ul#messageFeeds').append(data.value);
			}
		    }
		});

	    }
    );

});
