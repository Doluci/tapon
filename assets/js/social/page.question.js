/**
 * page question
 * 
 * @package Sngine JSL
 * @author Zamblek
 */

$(function() {

    $('body').delegate('.viewMoreAnswers, .viewMoreNotes', 'click',
	    function() {

		var viewmore = $(this);
		var loading = $(this).find('div.hidden');

		if (viewmore.hasClass('viewMoreAnswers')) {
		    var get = 'answers';
		    var hook = $('ul#streamAnswers');
		    var targetId = $('.dataContainer:first').attr('id');
		} else if (viewmore.hasClass('viewMoreNotes')) {
		    var get = 'notes';
		    var hook = viewmore.parents('ul#streamNotes');
		    var targetId = viewmore.parents('.dataContainer:first').attr('id');
		}

		loading.show();
		$.ajax({
		    type: "GET",
		    url: SITE_URL + "ajax/answers/get.php",
		    data: 'id=' + targetId + '-' + $(this).attr('id') + '&get=' + get,
		    success: function(data) {
			viewmore.remove();
			if (get == 'answers') {
			    hook.append(data);
			} else {
			    hook.prepend(data);
			}

		    }
		});
	    }
    );

    $('body').delegate('.doVoteUp', 'click',
	    function() {

		var voteup = $(this);
		var votedown = $(this).next();
		var targetId = $(this).parents('.dataContainer:first').attr('id');
		var voteNum = $(this).parents('.dataContainer:first').find('.questionBoxCounts');

		if (voteup.hasClass('active')) {
		    return false;
		}

		if (votedown.hasClass("active")) {

		    votedown.removeClass("active");
		    voteNum.text(parseInt(voteNum.text()) + 1);

		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/answers/vote.php",
			data: 'id=' + targetId + '&vote=undown',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				votedown.addClass("active");
				voteNum.text(parseInt(voteNum.text()) - 1);
			    }
			}
		    });
		} else {

		    voteup.addClass("active");
		    voteNum.text(parseInt(voteNum.text()) + 1);

		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/answers/vote.php",
			data: 'id=' + targetId + '&vote=up',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				voteup.removeClass("active");
				voteNum.text(parseInt(voteNum.text()) - 1);
			    }
			}
		    });
		}
	    }
    );

    $('body').delegate('.doVoteDown', 'click',
	    function() {

		var votedown = $(this);
		var voteup = $(this).prev();
		var targetId = $(this).parents('.dataContainer:first').attr('id');
		var voteNum = $(this).parents('.dataContainer:first').find('.questionBoxCounts');

		if (votedown.hasClass('active')) {
		    return false;
		}

		if (voteup.hasClass("active")) {

		    voteup.removeClass("active");
		    voteNum.text(parseInt(voteNum.text()) - 1);

		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/answers/vote.php",
			data: 'id=' + targetId + '&vote=unup',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				voteup.addClass("active");
				voteNum.text(parseInt(voteNum.text()) + 1);
			    }
			}
		    });
		} else {

		    votedown.addClass("active");
		    voteNum.text(parseInt(voteNum.text()) - 1);

		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/answers/vote.php",
			data: 'id=' + targetId + '&vote=down',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				votedown.removeClass("active");
				voteNum.text(parseInt(voteNum.text()) + 1);
			    }
			}
		    });
		}
	    }
    );

    $('body').delegate('.doSpamAnswer', 'click',
	    function(event) {

		event.preventDefault();

		var button = $(this);
		var targetDiv = $(this).parents('.dataContainer');
		var targetId = targetDiv.attr('id');
		var msg = '<div class="dataContainer" id="' + targetId + '"><div class="pt5 pb5 pl10"><p><strong>' + translate['Thanks for Your Help'] + '</strong></p><p>' + translate['Your feedback helps us keep site clear of spam'] + '. <span class="uiButtonText doUnSpamAnswer">' + translate['Undo'] + '</span></p></div></div>';

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/answers/filter.php",
		    data: 'id=' + targetId + '&do=spam',
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			if (!data) {
			    targetDiv.hide();
			    targetDiv.parent().append(msg);
			} else {
			    $.popups.alert({message: data.value, title: data.title});
			}
		    }
		});

	    }
    );

    $('body').delegate('.doUnSpamAnswer', 'click',
	    function() {

		var button = $(this);
		var targetDiv = $(this).parents('.dataContainer');
		var targetId = targetDiv.attr('id');

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/answers/filter.php",
		    data: 'id=' + targetId + '&do=unspam',
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			if (!data) {
			    targetDiv.hide();
			    $('div#' + targetId + '.dataContainer:hidden').show();
			    targetDiv.remove();
			} else {
			    $.popups.alert({message: data.value, title: data.title});
			}
		    }
		});

	    }
    );

    $('body').delegate('.doRemoveAnswer, .doRemoveNote', 'click',
	    function() {

		if ($(this).hasClass('doRemoveAnswer')) {
		    var target = $(this).parents('.dataContainer');
		    var node = translate['answer'];
		} else {
		    var target = $(this).parents('.questionNote');
		    var node = translate['note'];
		}

		$.popups.confirm(translate['Are you sure you want to delete this'] + ' ' + node + '?', '400',
			function(result) {
			    if (result) {

				$.ajax({
				    url: SITE_URL + 'ajax/answers/delete.php',
				    type: 'POST',
				    data: 'id=' + target.attr('id') + '&type=' + node,
				    dataType: "json",
				    cache: false,
				    success: function(data) {
					if (!data) {
					    target.parent().hide();
					} else {
					    $.popups.alert({message: data.value, title: data.title});
					}
				    }
				});

			    }
			}
		);
	    }
    );

});
