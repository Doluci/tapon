/**
 * core posts
 * 
 * @package Sngine JSL
 * @author Zamblek
 */

$(function() {

    $('body').delegate('.viewMoreComments', 'click',
	    function() {

		var viewmore = $(this);
		var loading = $(this).find('div.hidden');
		var targetId = $(this).parents('.dataContainer').attr('id');

		loading.show();
		$.ajax({
		    type: "GET",
		    url: SITE_URL + "ajax/comments/get.php",
		    data: 'id=' + targetId + '-' + $(this).attr('id') + '&get=qcomments',
		    success: function(data) {
			viewmore.remove();
			$('.dataContainer#' + targetId).find('ul#streamComments').prepend(data);
		    }
		});
	    }

    );
    $('body').delegate('.doLikePost', 'click',
	    function() {

		var like = $(this);
		var dislike = $(this).next();
		var targetId = $(this).parents('.dataContainer').attr('id');

		var likeBox = $('#' + targetId + '.dataContainer').find('.whoLikePost');
		var likeNum = likeBox.find('span.text');
		var dislikeBox = likeBox.next();
		var dislikeNum = dislikeBox.find('span.text');

		if (like.hasClass('active')) {
		    return false;
		}

		if (dislike.hasClass("active")) {

		    dislike.removeClass("active");
		    dislikeNum.text(parseInt(dislikeNum.text()) - 1);
		    dislikeBox.attr('hits', parseInt(dislikeBox.attr('hits')) - 1);

		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/posts/modify.php",
			data: 'id=' + targetId + '&do=undislike',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				dislike.addClass("active");
				dislikeNum.text(parseInt(dislikeNum.text()) + 1);
				dislikeBox.attr('hits', parseInt(dislikeBox.attr('hits')) + 1);
			    }
			}
		    });
		} else {

		    like.addClass("active");
		    likeNum.text(parseInt(likeNum.text()) + 1);
		    likeBox.attr('hits', parseInt(likeBox.attr('hits')) + 1);

		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/posts/modify.php",
			data: 'id=' + targetId + '&do=like',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				like.removeClass("active");
				likeNum.text(parseInt(likeNum.text()) - 1);
				likeBox.attr('hits', parseInt(likeBox.attr('hits')) - 1);
			    }
			}
		    });
		}
	    }
    );

    $('body').delegate('.doDislikePost', 'click',
	    function() {

		var dislike = $(this);
		var like = $(this).prev();
		var targetId = $(this).parents('.dataContainer').attr('id');

		var likeBox = $('#' + targetId + '.dataContainer').find('.whoLikePost');
		var likeNum = likeBox.find('span.text');
		var dislikeBox = likeBox.next();
		var dislikeNum = dislikeBox.find('span.text');

		if (dislike.hasClass('active')) {
		    return false;
		}

		if (like.hasClass("active")) {

		    like.removeClass("active");
		    likeNum.text(parseInt(likeNum.text()) - 1);
		    likeBox.attr('hits', parseInt(likeBox.attr('hits')) - 1);

		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/posts/modify.php",
			data: 'id=' + targetId + '&do=unlike',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				like.addClass("active");
				likeNum.text(parseInt(likeNum.text()) + 1);
				likeBox.attr('hits', parseInt(likeBox.attr('hits')) + 1);
			    }
			}
		    });
		} else {

		    dislike.addClass("active");
		    dislikeNum.text(parseInt(dislikeNum.text()) + 1);
		    dislikeBox.attr('hits', parseInt(dislikeBox.attr('hits')) + 1);

		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/posts/modify.php",
			data: 'id=' + targetId + '&do=dislike',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				dislike.removeClass("active");
				dislikeNum.text(parseInt(dislikeNum.text()) - 1);
				dislikeBox.attr('hits', parseInt(dislikeBox.attr('hits')) - 1);
			    }
			}
		    });
		}
	    }
    );

    $(document).delegate('.doFavorite', 'click',
	    function() {

		var button = $(this);
		var targetId = $(this).parents('.dataContainer').attr('id');
		var parent = $(this).parent();

		if (parent.hasClass("active")) {
		    parent.removeClass("active");
		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/posts/modify.php",
			data: 'id=' + targetId + '&do=unfavorite',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				parent.addClass("active");
			    }
			}
		    });
		} else {
		    parent.addClass("active");
		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/posts/modify.php",
			data: 'id=' + targetId + '&do=favorite',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				parent.removeClass("active");
			    }
			}
		    });
		}
	    }

    );

    $(document).delegate('.whoLikePost, .whoDislikePost', 'click',
	    function() {

		var hits = $(this).attr('hits');
		if (hits == 0)
		    return;

		var popupWidth = (hits >= 5) ? 461 : 437;
		var targetId = $(this).attr('id');

		if ($(this).hasClass('whoLikePost')) {
		    var data = 'id=' + targetId + '&view=like';
		} else if ($(this).hasClass('whoDislikePost')) {
		    var data = 'id=' + targetId + '&view=dislike';
		}

		$.popups.popup({source: SITE_URL + "ajax/posts/who.php", data: data, width: popupWidth});
	    }

    );

    $('.doHidePost, .doHideUser, .doSpam').click(
	    function(event) {

		event.preventDefault();

		var button = $(this);
		var targetDiv = $(this).parents('.dataContainer');
		var targetId = targetDiv.attr('id');

		if ($(this).hasClass('doHidePost')) {
		    var action = 'hidepost';
		    var msg = '<div class="dataContainer" id="' + targetId + '"><div class="pt5 pb5 pl10"><p><strong>' + translate['Post Hidden'] + '</strong></p><p>' + translate['This post will no longer appear to you'] + '. <span class="uiButtonText doUnHidePost">' + translate['Undo'] + '</span></p></div></div>';
		} else if ($(this).hasClass('doHideUser')) {
		    var action = 'hideuser';
		    var msg = '<div class="dataContainer" id="' + targetId + '"><div class="pt5 pb5 pl10"><p><strong>' + translate['Posts Now Removed'] + '</strong></p><p>' + translate['Posts from this user will no longer appear to you'] + '. <span class="uiButtonText doUnHideUser">' + translate['Undo'] + '</span></p></div></div>';
		} else if ($(this).hasClass('doSpam')) {
		    var action = 'spam';
		    var msg = '<div class="dataContainer" id="' + targetId + '"><div class="pt5 pb5 pl10"><p><strong>' + translate['Thanks for Your Help'] + '</strong></p><p>' + translate['Your feedback helps us keep site clear of spam'] + '. <span class="uiButtonText doUnSpam">' + translate['Undo'] + '</span></p></div></div>';
		}

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/posts/filter.php",
		    data: 'id=' + targetId + '&do=' + action,
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			if (!data) {
			    targetDiv.hide();
			    targetDiv.parent().append(msg);
			    if (button.hasClass('doHideUser') || button.hasClass('doSpam')) {
				$(".dataContainer:visible").each(function(i) {
				    var x = $(this).attr('id').split("-");
				    var y = targetId.split("-");
				    if (x[3] === y[3] && $(this).attr('id') !== targetId) {
					$(this).hide();
				    }
				});
			    }
			} else {
			    $.popups.alert({message: data.value, title: data.title});
			}
		    }
		});
	    }
    );

    $('.doUnHidePost, .doUnHideUser, .doUnSpam').click(
	    function() {

		var button = $(this);
		var targetDiv = $(this).parents('.dataContainer');
		var targetId = targetDiv.attr('id');

		if ($(this).hasClass('doUnHidePost')) {
		    var action = 'unhidepost';
		} else if ($(this).hasClass('doUnHideUser')) {
		    var action = 'unhideuser';
		} else if ($(this).hasClass('doUnSpam')) {
		    var action = 'unspam';
		}

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/posts/filter.php",
		    data: 'id=' + targetId + '&do=' + action,
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			if (!data) {
			    targetDiv.hide();
			    $('div#' + targetId + '.dataContainer:hidden').show();
			    targetDiv.remove();
			    if (button.hasClass('doUnHideUser') || button.hasClass('doUnSpam')) {
				$(".dataContainer:hidden").each(function(i) {
				    $(this).show();
				});
			    }
			} else {
			    $.popups.alert({message: data.value, title: data.title});
			}
		    }
		});

	    }

    );

    $(document).delegate('.doRemovePost', 'click',
	    function() {

		var target = $(this).parents('.dataContainer');

		$.popups.confirm(translate['Are you sure you want to delete this post?'], '400',
			function(result) {
			    if (result) {

				$.ajax({
				    url: SITE_URL + 'ajax/posts/delete.php',
				    type: 'POST',
				    data: 'id=' + target.attr('id'),
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

    $(document).delegate('.doLikeComment', 'click',
	    function() {

		var like = $(this);
		var dislike = $(this).next();
		var action = $(this).attr('action');
		var targetId = $(this).parents('.qCommentContainer').attr('id');
		var commentId = targetId.split("-");
		var likeNum = $(this).parent().find('.whoLikeComment span.text');

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/comments/modify.php",
		    data: 'id=' + targetId + '&do=' + action,
		    cache: false,
		    success: function(data) {
			if (!data) {
			    if (action == 'like') {
				dislike.hide();
				if (likeNum.length > 0) {
				    like.text(" Unlike");
				    like.attr('action', 'unlike');
				    likeNum.text(parseInt(likeNum.text()) + 1);
				    if (!likeNum.parent().is(":visible")) {
					likeNum.parent().show();
				    }
				} else {
				    like.text(" · Unlike");
				    like.attr('action', 'unlike');
				    like.before('<span class="uiInfoBox whoLikeComment" id="' + commentId[0] + '" hits="1"><span class="icon like fa fa-thumbs-up"></span><span class="text">1</span></span>')
				}
			    } else if (action == 'unlike') {
				like.text("Like ");
				like.attr('action', 'like');
				dislike.show();
				if (likeNum.text() == 1) {
				    likeNum.parent().hide();
				}
				likeNum.text(parseInt(likeNum.text()) - 1);
			    }

			} else {
			    $.popups.alert({message: data.value, title: data.title});
			}
		    }
		});
	    }
    );

    $(document).delegate('.doDislikeComment', 'click',
	    function() {

		var dislike = $(this);
		var like = $(this).prev();
		var action = $(this).attr('action');
		var targetId = $(this).parents('.qCommentContainer').attr('id');
		var commentId = targetId.split("-");
		var dislikeNum = $(this).parent().find('.whoDislikeComment span.text');

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/comments/modify.php",
		    data: 'id=' + targetId + '&do=' + action,
		    cache: false,
		    success: function(data) {
			if (!data) {

			    if (action == 'dislike') {
				like.hide();
				if (dislikeNum.length > 0) {
				    dislike.text(" Undislike");
				    dislike.attr('action', 'undislike');
				    dislikeNum.text(parseInt(dislikeNum.text()) + 1);
				    if (!dislikeNum.parent().is(":visible")) {
					dislikeNum.parent().show();
				    }
				} else {
				    dislike.text("· Undislike");
				    dislike.attr('action', 'undislike');
				    like.before('<span class="uiInfoBox whoDislikeComment" id="' + commentId[0] + '" hits="1"><span class="icon dislike fa fa-thumbs-down"></span><span class="text">1</span></span>')
				}
			    } else if (action == 'undislike') {
				dislike.text("· Dislike");
				dislike.attr('action', 'dislike');
				like.show();
				if (dislikeNum.text() == 1) {
				    dislikeNum.parent().hide();
				}
				dislikeNum.text(parseInt(dislikeNum.text()) - 1);
			    }

			} else {
			    $.popups.alert({message: data.value, title: data.title});
			}
		    }
		});
	    }

    );

    $('.whoLikeComment, .whoDislikeComment').click(
	    function() {

		var hits = $(this).attr('hits');
		if (hits == 0)
		    return;

		var popupWidth = (hits >= 5) ? 461 : 437;
		var targetId = $(this).attr('id');

		if ($(this).hasClass('whoLikeComment')) {
		    var data = 'id=' + targetId + '&view=like';
		} else if ($(this).hasClass('whoDislikeComment')) {
		    var data = 'id=' + targetId + '&view=dislike';
		}

		$.popups.popup({source: SITE_URL + "ajax/comments/who.php", data: data, width: popupWidth});
	    }

    );

    $('.doSpamComment').click(
	    function(event) {

		event.preventDefault();

		var button = $(this);
		var targetDiv = $(this).parents('.qCommentContainer');
		var targetId = targetDiv.attr('id');
		var msg = '<div class="qCommentContainer" id="' + targetId + '"><div class="dataSideWrapper medium"></div><div class="qCommentContentWrapper ml5"><p><strong>' + translate['Thanks for Your Help'] + '</strong></p><p>' + translate['Your feedback helps us keep site clear of spam'] + '. <span class="uiButtonText doUnSpamComment">' + translate['Undo'] + '</span></p></div></div>';

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/comments/filter.php",
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

    $('.doUnSpamComment').click(
	    function() {

		var button = $(this);
		var targetDiv = $(this).parents('.qCommentContainer');
		var targetId = targetDiv.attr('id');

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/comments/filter.php",
		    data: 'id=' + targetId + '&do=unspam',
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			if (!data) {
			    targetDiv.hide();
			    $('div#' + targetId + '.qCommentContainer:hidden').show();
			    targetDiv.remove();
			} else {
			    $.popups.alert({message: data.value, title: data.title});
			}
		    }
		});

	    }

    );

    $('.doRemoveComment').click(
	    function() {

		var target = $(this).parents('.qCommentContainer');
		var commentsNum = $(this).parents('.dataContainer').find('.whoComment span.text');

		$.popups.confirm(translate['Are you sure you want to delete this comment?'], '400',
			function(result) {
			    if (result) {

				$.ajax({
				    url: SITE_URL + 'ajax/comments/delete.php',
				    type: 'POST',
				    data: 'id=' + target.attr('id'),
				    dataType: "json",
				    cache: false,
				    success: function(data) {
					if (!data) {
					    target.parent().hide();
					    commentsNum.text(parseInt(commentsNum.text()) - 1);
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

    $('body').delegate('.addQComment', 'click',
	    function() {
		//alert('dfdf');
		var parent = $(this).parents(".dataContainer");
		parent.find(".postQComment").show();
		parent.find("textarea").focus();
	    }
    );

    $('body').delegate('.postQComment', 'submit',
	    function(event) {

		event.preventDefault();

		var button = $(this).find('input');
		var loading = button.next();
		var textarea = $(this).find('textarea');
		var parent = $(this).parents('.dataContainer');
		var commentsNum = parent.find('.whoComment span.text');

		// check inputs values
		if (!textarea.hasClass('active')) {
		    return;
		}

		button.hide();
		loading.show();
		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/comments/post.php",
		    data: 'id=' + parent.attr('id') + '&text=' + encodeURIComponent(textarea.val()) + '&type=qcomment',
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			button.show();
			loading.hide();
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    textarea.val('').focus();
			    commentsNum.text(parseInt(commentsNum.text()) + 1);
			    parent.find('ul#streamComments').append($(data.value).fadeIn('slow'));
			}
		    }
		});

		event.stopPropagation();

	    }
    );

    $('body').delegate('.pollBtn, .pollRadioBtn, .pollResultsBar', 'click',
	    function(event) {

		var radioBtn = $(this).parents('tr:first').find('input');
		if (radioBtn.attr("disabled"))
		    return;

		var parent = $(this).parents('.dataContainer');
		var total = parent.find("input[name='poll[votes]']");
		var selected = parent.find("input[name='poll[selected]']");

		// disalble all inputs
		parent.find('input.pollBtn').each(function(i) {
		    $(this).attr("disabled", 'disabled');
		});

		if (selected != '' && radioBtn.attr('id') == selected.val()) {
		    var action = 'unselect';
		} else {
		    var action = 'select';
		}

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/polls/select.php",
		    data: 'id=' + parent.attr('id') + '&option=' + radioBtn.attr('id') + '&do=' + action,
		    cache: false,
		    success: function(data) {
			if (data) {
			    $.popups.alert({message: data.value, title: data.title});
			} else {

			    // select
			    if (selected.val() == '') {
				var selectedId, width;
				total.val(parseInt(total.val()) + 1);
				parent.find('tr').each(function(i) {
				    var votes = $(this).find('.optionVotes');
				    var whoVoted = $(this).find('.whoVoted');
				    var pollBtn = $(this).find('input.pollBtn');
				    if (pollBtn.attr('id') == radioBtn.attr('id')) {
					width = (parseInt(votes.text()) + 1) / (parseInt(total.val())) * 100;
					votes.text(parseInt(votes.text()) + 1);
					whoVoted.attr('hits', parseInt(whoVoted.attr('hits')) + 1);
					selectedId = pollBtn.attr('id');
				    } else {
					width = (parseInt(votes.text())) / (parseInt(total.val())) * 100;
				    }
				    $(this).find('.shaded').width(width + '%');
				});
				selected.val(selectedId);
				// unselect
			    } else if (selected != '' && radioBtn.attr('id') == selected.val()) {
				var width;
				total.val(parseInt(total.val()) - 1);
				parent.find('tr').each(function(i) {
				    var votes = $(this).find('.optionVotes');
				    var whoVoted = $(this).find('.whoVoted');
				    var pollBtn = $(this).find('input.pollBtn');
				    if (pollBtn.attr('id') == radioBtn.attr('id')) {
					width = (parseInt(votes.text()) - 1) / (parseInt(total.val())) * 100;
					votes.text(parseInt(votes.text()) - 1);
					whoVoted.attr('hits', parseInt(whoVoted.attr('hits')) - 1);
				    } else {
					width = (parseInt(votes.text())) / (parseInt(total.val())) * 100;
				    }
				    width = (isNaN(width)) ? 0 : width;
				    $(this).find('.shaded').width(width + '%');
				});
				selected.val('');
				// change
			    } else {
				var selectedId, width;
				parent.find('tr').each(function(i) {
				    var votes = $(this).find('.optionVotes');
				    var whoVoted = $(this).find('.whoVoted');
				    var pollBtn = $(this).find('input.pollBtn');
				    // new option
				    if (pollBtn.attr('id') == radioBtn.attr('id')) {
					width = (parseInt(votes.text()) + 1) / (parseInt(total.val())) * 100;
					votes.text(parseInt(votes.text()) + 1);
					whoVoted.attr('hits', parseInt(whoVoted.attr('hits')) + 1);
					selectedId = pollBtn.attr('id');
					// old option
				    } else if (pollBtn.attr('id') == selected.val()) {
					width = (parseInt(votes.text()) - 1) / (parseInt(total.val())) * 100;
					votes.text(parseInt(votes.text()) - 1);
					whoVoted.attr('hits', parseInt(whoVoted.attr('hits')) - 1);
				    } else {
					width = (parseInt(votes.text())) / (parseInt(total.val())) * 100;
				    }
				    $(this).find('.shaded').width(width + '%');
				});
				selected.val(selectedId);
			    }

			    if (selected != '' && radioBtn.attr('id') == selected.val()) {
				radioBtn.prop('checked', true);
			    } else {
				radioBtn.prop('checked', false);
			    }

			    // enable all inputs
			    parent.find('input.pollBtn').each(function(i) {
				$(this).removeAttr("disabled");
			    });

			}
		    }
		});

		event.stopPropagation();

	    }
    );

    $('body').delegate('.whoVoted', 'click',
	    function() {

		var hits = $(this).attr('hits');
		if (hits == 0)
		    return;

		var popupWidth = (hits >= 5) ? 461 : 437;
		var targetId = $(this).attr('id');

		var data = 'id=' + targetId;

		$.popups.popup({source: SITE_URL + "ajax/polls/who.php", data: data, width: popupWidth});
	    }
    );

    $('body').delegate('.playVideo', 'click',
	    function() {
		var parentNode = $(this).parents(".dataContainer");
		parentNode.find(".mediaPlayer:first").hide();
		parentNode.find(".mediaPlayer:last").fadeIn("slow");
	    }

    );

    $(".seeMore_button").click(
	    function() {
		$(this).next().fadeIn('fast');
		$(this).remove();
	    }

    );

});
