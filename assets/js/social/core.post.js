/**
 * core post
 * 
 * @package Sngine JSL
 * @author Zamblek
 */

$(function() {

    $(".viewMoreComments, .viewMoreReplies").click('click',
	    function() {

		var viewmore = $(this);
		var loading = $(this).find('div.hidden');

		if (viewmore.hasClass('viewMoreComments')) {
		    var get = 'comments';
		    var hook = $('ul#streamComments');
		    var targetId = $('.dataContainer:first').attr('id');
		} else if (viewmore.hasClass('viewMoreReplies')) {
		    var get = 'replies';
		    var hook = viewmore.parents('ul#streamReplies');
		    var targetId = viewmore.parents('.dataContainer:first').attr('id');
		}

		loading.show();
		$.ajax({
		    type: "GET",
		    url: SITE_URL + "ajax/comments/get.php",
		    data: 'id=' + targetId + '-' + $(this).attr('id') + '&get=' + get,
		    success: function(data) {
			viewmore.remove();
			hook.prepend(data);
		    }
		});
	    }
    );

    $('.doLikePost').click(
	    function() {

		var like = $(this);
		var dislike = $(this).next();
		var targetId = $(this).parents('.dataContainer').attr('id');

		var likeBox = $('.whoLikePost');
		var likeNum = likeBox.prev();
		var dislikeBox = $('.whoDislikePost');
		var dislikeNum = dislikeBox.prev();

		if (like.hasClass('active')) {
		    return false;
		}

		if (dislike.hasClass("active")) {

		    dislike.removeClass("active");
		    if (dislikeNum.text() > 1) {
			dislikeNum.text(parseInt(dislikeNum.text()) - 1);
			dislikeBox.attr('hits', parseInt(dislikeBox.attr('hits')) - 1);
		    } else {
			dislikeBox.hide();
			dislikeNum.text(0);
			dislikeBox.attr('hits', 0);
		    }

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
				if (dislikeNum.text() == 1) {
				    dislikeBox.show();
				}
			    }
			}
		    });
		} else {

		    like.addClass("active");
		    if (likeNum.text() > 0) {
			likeNum.text(parseInt(likeNum.text()) + 1);
			likeBox.attr('hits', parseInt(likeBox.attr('hits')) + 1);
		    } else {
			likeBox.show();
			likeNum.text(1);
			likeBox.attr('hits', 1);
		    }

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
				if (likeNum.text() > 1) {
				    likeNum.text(parseInt(likeNum.text()) - 1);
				    likeBox.attr('hits', parseInt(likeBox.attr('hits')) - 1);
				} else {
				    likeBox.hide();
				    likeNum.text(0);
				    likeBox.attr('hits', 0);
				}
			    }
			}
		    });
		}
	    }
    );

    $('.doDislikePost').click(
	    function() {

		var dislike = $(this);
		var like = $(this).prev();
		var targetId = $(this).parents('.dataContainer').attr('id');

		var likeBox = $('.whoLikePost');
		var likeNum = likeBox.prev();
		var dislikeBox = $('.whoDislikePost');
		var dislikeNum = dislikeBox.prev();

		if (dislike.hasClass('active')) {
		    return false;
		}

		if (like.hasClass("active")) {

		    like.removeClass("active");
		    if (likeNum.text() > 1) {
			likeNum.text(parseInt(likeNum.text()) - 1);
			likeBox.attr('hits', parseInt(likeBox.attr('hits')) - 1);
		    } else {
			likeBox.hide();
			likeNum.text(0);
			likeBox.attr('hits', 0);
		    }

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
				if (likeNum.text() == 1) {
				    likeBox.show();
				}
			    }
			}
		    });
		} else {

		    dislike.addClass("active");
		    if (dislikeNum.text() > 0) {
			dislikeNum.text(parseInt(dislikeNum.text()) + 1);
			dislikeBox.attr('hits', parseInt(dislikeBox.attr('hits')) + 1);
		    } else {
			dislikeBox.show();
			dislikeNum.text(1);
			dislikeBox.attr('hits', 1);
		    }

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
				if (dislikeNum.text() > 1) {
				    dislikeNum.text(parseInt(dislikeNum.text()) - 1);
				    dislikeBox.attr('hits', parseInt(dislikeBox.attr('hits')) - 1);
				} else {
				    dislikeBox.hide();
				    dislikeNum.text(0);
				    dislikeBox.attr('hits', 0);
				}
			    }
			}
		    });
		}
	    }
    );

    $('.doFavorite').click(
	    function() {

		var favorite = $(this);
		var targetId = $(this).parents('.dataContainer').attr('id');

		var favoriteBox = $('.whoFavoritePost');
		var favoriteNum = favoriteBox.prev();

		if (favorite.hasClass("active")) {

		    favorite.removeClass("active");
		    if (favoriteNum.text() > 1) {
			favoriteNum.text(parseInt(favoriteNum.text()) - 1);
			favoriteBox.attr('hits', parseInt(favoriteBox.attr('hits')) - 1);
		    } else {
			favoriteBox.hide();
			favoriteNum.text(0);
			favoriteBox.attr('hits', 0);
		    }

		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/posts/modify.php",
			data: 'id=' + targetId + '&do=unfavorite',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				favorite.addClass("active");
				if (favoriteNum.text() > 0) {
				    favoriteNum.text(parseInt(favoriteNum.text()) + 1);
				    favoriteBox.attr('hits', parseInt(favoriteBox.attr('hits')) + 1);
				} else {
				    favoriteBox.show();
				    favoriteNum.text(1);
				    favoriteBox.attr('hits', 1);
				}
			    }
			}
		    });
		} else {

		    favorite.addClass("active");
		    if (favoriteNum.text() > 0) {
			favoriteNum.text(parseInt(favoriteNum.text()) + 1);
			favoriteBox.attr('hits', parseInt(favoriteBox.attr('hits')) + 1);
		    } else {
			favoriteBox.show();
			favoriteNum.text(1);
			favoriteBox.attr('hits', 1);
		    }

		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/posts/modify.php",
			data: 'id=' + targetId + '&do=favorite',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				favorite.removeClass("active");
				if (favoriteNum.text() > 1) {
				    favoriteNum.text(parseInt(favoriteNum.text()) - 1);
				    favoriteBox.attr('hits', parseInt(favoriteBox.attr('hits')) - 1);
				} else {
				    favoriteBox.hide();
				    favoriteNum.text(0);
				    favoriteBox.attr('hits', 0);
				}
			    }
			}
		    });
		}
	    }
    );

    $('.whoLikePost, .whoDislikePost, .whoFavoritePost').click('click',
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
		} else if ($(this).hasClass('whoFavoritePost')) {
		    var data = 'id=' + targetId + '&view=favorite';
		}

		$.popups.popup({source: SITE_URL + "ajax/posts/who.php", data: data, width: popupWidth});
	    }
    );

    $('.doRemovePost').click('click',
	    function() {

		var target = $(this).parents('.dataContainer');

		$.popups.confirm(translate['Are you sure you want to delete this'] + '?', '400',
			function(result) {
			    if (result) {

				$.ajax({
				    url: SITE_URL + 'ajax/posts/delete.php',
				    type: 'POST',
				    data: 'id=' + target.attr('id'),
				    dataType: "json",
				    cache: false,
				    success: function(data) {
					if (!data) {
					    window.location.replace(window.location.protocol + "//" + window.location.host + "/home.php");
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

    $('.doLikeComment').click('click',
	    function() {

		var like = $(this);
		var dislike = $(this).next();

		// check comment or reply
		if ($(this).parents('.commentContainer').length > 0) {
		    var targetId = $(this).parents('.commentContainer').attr('id');
		    var likeBox = $('#' + targetId + '.commentContainer').find('.whoLikeComment');
		} else {
		    var targetId = $(this).parents('.dataContainer:first').attr('id');
		    var likeBox = $('#' + targetId + '.dataContainer').find('.whoLikeComment:first');
		}

		var likeNum = likeBox.find('span.text');
		var dislikeBox = likeBox.next();
		var dislikeNum = dislikeBox.find('span.text');

		if (like.hasClass('active')) {
		    return false;
		}

		if (dislike.hasClass("active")) {

		    dislike.removeClass("active");
		    if (dislikeNum.text() > 1) {
			dislikeNum.text(parseInt(dislikeNum.text()) - 1);
			dislikeBox.attr('hits', parseInt(dislikeBox.attr('hits')) - 1);
		    } else {
			dislikeBox.hide();
			dislikeNum.text(0);
			dislikeBox.attr('hits', 0);
		    }

		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/comments/modify.php",
			data: 'id=' + targetId + '&do=undislike',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				dislike.addClass("active");
				if (dislikeNum.text() > 0) {
				    dislikeNum.text(parseInt(dislikeNum.text()) + 1);
				    dislikeBox.attr('hits', parseInt(dislikeBox.attr('hits')) + 1);
				} else {
				    dislikeBox.show();
				    dislikeNum.text(1);
				    dislikeBox.attr('hits', 1);
				}
			    }
			}
		    });
		} else {

		    like.addClass("active");
		    if (likeNum.text() > 0) {
			likeNum.text(parseInt(likeNum.text()) + 1);
			likeBox.attr('hits', parseInt(likeBox.attr('hits')) + 1);
		    } else {
			likeBox.show();
			likeNum.text(1);
			likeBox.attr('hits', 1);
		    }

		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/comments/modify.php",
			data: 'id=' + targetId + '&do=like',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				like.removeClass("active");
				if (likeNum.text() > 1) {
				    likeNum.text(parseInt(likeNum.text()) - 1);
				    likeBox.attr('hits', parseInt(likeBox.attr('hits')) - 1);
				} else {
				    likeBox.hide();
				    likeNum.text(0);
				    likeBox.attr('hits', 0);
				}
			    }
			}
		    });
		}
	    }
    );

    $('.doDislikeComment').click('click',
	    function() {

		var dislike = $(this);
		var like = $(this).prev();

		// check comment or reply
		if ($(this).parents('.commentContainer').length > 0) {
		    var targetId = $(this).parents('.commentContainer').attr('id');
		    var dislikeBox = $('#' + targetId + '.commentContainer').find('.whoDislikeComment');
		} else {
		    var targetId = $(this).parents('.dataContainer:first').attr('id');
		    var dislikeBox = $('#' + targetId + '.dataContainer').find('.whoDislikeComment:first');
		}

		var dislikeNum = dislikeBox.find('span.text');
		var likeBox = dislikeBox.prev();
		var likeNum = likeBox.find('span.text');

		if (dislike.hasClass('active')) {
		    return false;
		}

		if (like.hasClass("active")) {

		    like.removeClass("active");
		    if (likeNum.text() > 1) {
			likeNum.text(parseInt(likeNum.text()) - 1);
			likeBox.attr('hits', parseInt(likeBox.attr('hits')) - 1);
		    } else {
			likeBox.hide();
			likeNum.text(0);
			likeBox.attr('hits', 0);
		    }

		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/comments/modify.php",
			data: 'id=' + targetId + '&do=unlike',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				like.addClass("active");
				if (likeNum.text() > 0) {
				    likeNum.text(parseInt(likeNum.text()) + 1);
				    likeBox.attr('hits', parseInt(likeBox.attr('hits')) + 1);
				} else {
				    likeBox.show();
				    likeNum.text(1);
				    likeBox.attr('hits', 1);
				}
			    }
			}
		    });
		} else {

		    dislike.addClass("active");
		    if (dislikeNum.text() > 0) {
			dislikeNum.text(parseInt(dislikeNum.text()) + 1);
			dislikeBox.attr('hits', parseInt(dislikeBox.attr('hits')) + 1);
		    } else {
			dislikeBox.show();
			dislikeNum.text(1);
			dislikeBox.attr('hits', 1);
		    }

		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/comments/modify.php",
			data: 'id=' + targetId + '&do=dislike',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				dislike.removeClass("active");
				if (dislikeNum.text() > 1) {
				    dislikeNum.text(parseInt(dislikeNum.text()) - 1);
				    dislikeBox.attr('hits', parseInt(dislikeBox.attr('hits')) - 1);
				} else {
				    dislikeBox.hide();
				    dislikeNum.text(0);
				    dislikeBox.attr('hits', 0);
				}
			    }
			}
		    });
		}
	    }
    );

    $('.whoLikeComment, .whoDislikeComment').click('click',
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

    $('.doSpamComment, .doSpamReply').click('click',
	    function(event) {

		event.preventDefault();

		if ($(this).hasClass('doSpamComment')) {
		    var continer = 'dataContainer';
		    var undo = 'doUnSpamComment';
		} else {
		    var continer = 'commentContainer';
		    var undo = 'doUnSpamReply';
		}

		var button = $(this);
		var targetDiv = $(this).parents('.' + continer);
		var targetId = targetDiv.attr('id');
		var msg = '<div class="' + continer + '" id="' + targetId + '"><div class="pt5 pb5 pl10"><p><strong>' + translate['Thanks for Your Help'] + '</strong></p><p>' + translate['Your feedback helps us keep site clear of spam'] + '. <span class="uiButtonText ' + undo + '">Undo</span></p></div></div>';

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

    $('.doUnSpamComment, .doUnSpamReply').click('click',
	    function() {

		if ($(this).hasClass('doUnSpamComment')) {
		    var continer = '.dataContainer';
		} else {
		    var continer = '.commentContainer';
		}

		var button = $(this);
		var targetDiv = $(this).parents(continer);
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
			    $('div#' + targetId + continer + ':hidden').show();
			    targetDiv.remove();
			} else {
			    $.popups.alert({message: data.value, title: data.title});
			}
		    }
		});

	    }
    );

    $('.doRemoveComment, .doRemoveReply').click('click',
	    function() {

		if ($(this).hasClass('doRemoveComment')) {
		    var target = $(this).parents('.dataContainer');
		    var node = translate['comment'];
		} else {
		    var target = $(this).parents('.commentContainer');
		    var node = translate['reply'];
		}

		$.popups.confirm(translate['Are you sure you want to delete this'] + ' ' + node + '?', '400',
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

    $('body').delegate('.addComment', 'click',
	    function() {
		$('.postComment').show();
		$('.postComment').find('textarea').focus();
	    }
    );

    $('.addReply').click('click',
	    function() {
		$(this).parents('.dataContainer').find('.postReply').show();
		$(this).parents('.dataContainer').find('textarea').focus();
	    }
    );

    $('body').delegate('.addAnswer', 'click',
	    function() {
		$('.postAnswer').show();
		$('.postAnswer').find('textarea').focus();
	    }
    );

    $('.addNote').click('click',
	    function() {
		$(this).parents('.dataContainer').find('.postNote').show();
		$(this).parents('.dataContainer').find('textarea').focus();
	    }
    );

    $('body').delegate('.postComment', 'submit',
	    function(event) {

		event.preventDefault();

		var button = $(this).find('input');
		var loading = button.next();
		var textarea = $(this).find('textarea');
		var targetId = $('.dataContainer:first').attr('id');
		var hook = $('ul#streamComments');

		// check inputs values
		if (!textarea.hasClass('active')) {
		    return;
		}

		button.hide();
		loading.show();
		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/comments/post.php",
		    data: 'id=' + targetId + '&text=' + encodeURIComponent(textarea.val()) + '&type=qcomment',
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			button.show();
			loading.hide();
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    textarea.val('').focus();
			    hook.append(data.value);
			    $("html, body").animate({scrollTop: $(document).height()}, 'slow');
			    $('.whoComment').each(function() {
				var num = (isNaN($(this).text())) ? 0 : parseInt($(this).text());
				$(this).text(num + 1);
			    });
			}
		    }
		});

		event.stopPropagation();
	    }
    );

    $('.postReply').click('submit',
	    function(event) {

		event.preventDefault();

		var button = $(this).find('input');
		var loading = button.next();
		var textarea = $(this).find('textarea');
		var targetId = $(this).parents('.dataContainer:first').attr('id');
		var postId = $('.dataContainer:first').attr('id');
		var hook = $(this).prev();

		// check inputs values
		if (!textarea.hasClass('active')) {
		    return;
		}

		button.hide();
		loading.show();
		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/comments/post.php",
		    data: 'id=' + targetId + '&text=' + encodeURIComponent(textarea.attr('value')) + '&type=reply' + '&pid=' + postId,
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			button.show();
			loading.hide();
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    textarea.val('').focus();
			    hook.append(data.value);
			    $('.whoComment').each(function() {
				$(this).text(parseInt($(this).text()) + 1);
			    });
			}
		    }
		});

		event.stopPropagation();
	    }
    );

    $('body').delegate('.postAnswer', 'submit',
	    function(event) {

		event.preventDefault();

		var button = $(this).find('input');
		var loading = button.next();
		var textarea = $(this).find('textarea');
		var targetId = $('.answer_main_div').attr('id');
		var type = 'answer';
		var hook = $('ul#streamAnswers');

		// check inputs values
		if (!textarea.hasClass('active')) {
		    return;
		}

		button.hide();
		loading.show();
		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/answers/post.php",
		    data: 'id=' + targetId + '&text=' + encodeURIComponent(textarea.val()) + '&type=answer',
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			button.show();
			loading.hide();
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    textarea.val('').focus();
			    hook.append(data.value);
			    $("html, body").animate({scrollTop: $(document).height()}, 'slow');
			    $('.whoAnswer').each(function() {
				$(this).text(parseInt($(this).text()) + 1);
			    });
			}
		    }
		});

		event.stopPropagation();
	    }
    );

    $('.postNote').click('submit',
	    function(event) {

		event.preventDefault();

		var button = $(this).find('input');
		var loading = button.next();
		var textarea = $(this).find('textarea');
		var targetId = $(this).parents('.dataContainer').attr('id');
		var hook = $(this).prev();

		// check inputs values
		if (!textarea.hasClass('active')) {
		    return;
		}

		button.hide();
		loading.show();
		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/answers/post.php",
		    data: 'id=' + targetId + '&text=' + encodeURIComponent(textarea.attr('value')) + '&type=note',
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			button.show();
			loading.hide();
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    textarea.val('').focus();
			    hook.append(data.value);
			}
		    }
		});

		event.stopPropagation();
	    }
    );

    $('.pollBtn, .pollRadioBtn, .pollResultsBar').click('click',
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
		    dataType: "json",
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
				radioBtn.attr('checked', true);
			    } else {
				radioBtn.attr('checked', false);
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

    $(".whoVoted").click('click',
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

});
