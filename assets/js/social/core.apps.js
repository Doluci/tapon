/**
 * core apps
 * 
 * @package Sngine JSL
 * @author Zamblek
 */

function getPosts(app, get, replace, page) {

    if (get == 'new') {
	if ($('#dataSort').val() !== 'Most Recent')
	    return;
	if ($('ul#livefeeds').find('.stopCronJobs').length > 0)
	    return;
	if (app == 'photos' || app == 'videos')
	    return;
    }

    page = (page === undefined) ? 1 : page;

    var startPoint = $('.firstNode:first').attr('id');

    $.ajax({
	url: SITE_URL + 'ajax/posts/get.php',
	type: 'GET',
	data: 'app=' + app + '&get=' + get + '&filter=' + $('#dataFilter').val() + '&sort=' + $('#dataSort').val() + '&startPoint=' + startPoint + '&page=' + page,
	success: function(data) {
	    if (data) {
		if (replace || app == 'photos' || app == 'videos') {
		    $('ul#livefeeds').html(data).fadeIn();
		} else {
		    $('ul#livefeeds').prepend($(data).fadeIn('slow'));
		}
		$("textarea[class*=expand]").TextAreaExpander();
		$('.viewMorePosts').remove();
		if ($('.stopCronJobs').length == 0 && app != 'photos' && app != 'videos') {
		    $('ul#livefeeds').after('<div class="viewMore viewMorePosts"><div class="right hidden"><img src="' + spinner['small'] + '" /></div>' + translate['View More'] + '</div>');
		}
	    }
	}
    });
}

function loadLeftAndTop() {
    $.ajax({
	url: SITE_URL + 'ajax/layout/left_and_top.php',
	type: 'GET',
	dataType: "json",
	success: function(data) {
	    if (data.status == 'success') {
		$('#main_navigation').html(data.left_navigation);
		$('#top_user_profile').html(data.top_user_profile)
	    }
	}
    });
}

function initGetPost() {
    getPosts($('body').attr('page'), 'all', true);
    setInterval("getPosts($('body').attr('page'), 'new', false, 1)", 10000);
    loadAndInitEssentials();
}

function loadAndInitEssentials() {
    loadLeftAndTop();
    liveMessages('all');
    liveNotifications('all');
    setInterval("liveMessages('new')", 10000);
    setInterval("liveNotifications('new')", 10000);
    setInterval("getMessages('new', 1, true)", 10000);
    setInterval("getMessage()", 10000);

}


$(function() {

    $(window).load(function() {
	//getPosts($('body').attr('page'), 'all', true);
    });

    $(document).ready(function() {
	//setInterval("getPosts($('body').attr('page'), 'new', false, 1)", 10000);
    });

    $('body').delegate('.doFilter', 'change',
	    function() {
		$('ul#livefeeds').html('<div class="pt10 pb10 pl10 pr10 tcenter"><img src="' + spinner['larg'] + '" /></div>');
		getPosts($('body').attr('page'), 'all', true);
	    }
    );

    $('body').delegate('.doSort', 'change',
	    function() {
		$('ul#livefeeds').html('<div class="pt10 pb10 pl10 pr10 tcenter"><img src="' + spinner['larg'] + '" /></div>');
		getPosts($('body').attr('page'), 'all', true);
	    }
    );

    $('body').delegate('.pagerButton', 'click',
	    function() {
		getPosts($('body').attr('page'), 'all', true, $(this).attr('id'));
	    }
    );

    $('body').delegate('.viewMorePosts', 'click',
	    function() {

		var viewmore = $(this);
		var loading = $(this).find('div.hidden');
		var startPoint = $('li.lastNode:last').attr('id');

		loading.show();
		$.ajax({
		    url: SITE_URL + 'ajax/posts/get.php',
		    type: 'GET',
		    data: 'app=' + $('body').attr('page') + '&get=' + 'old' + '&filter=' + $('#dataFilter').val() + '&sort=' + $('#dataSort').val() + '&startPoint=' + startPoint,
		    success: function(data) {
			loading.hide();
			if (data) {
			    $('ul#livefeeds').append(data);
			} else {
			    viewmore.addClass('disactive').text(translate['There are no more posts to show']);
			}
		    }
		});
	    }

    );

});
