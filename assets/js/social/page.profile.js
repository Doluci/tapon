/**
 * page profile
 * 
 * @package Sngine JSL
 * @author Zamblek
 */
var my_profile_panel_id;
function getPeople(id, tab) {

//    if ($(my_profile_panel_id + ' .dataNullState').length > 0)
//	return;

    var startPoint = $(my_profile_panel_id + ' li.lastNode:last').attr('id');
    startPoint = (startPoint === startPoint) ? 0 : startPoint;

    $.ajax({
	url: SITE_URL + 'ajax/users/people.php',
	type: 'GET',
	data: 'id=' + id + '&get=' + tab + '&sp=' + startPoint,
	success: function(data) {
	    if (data) {
		$(my_profile_panel_id + ' ul#livefeeds').html(data).fadeIn();
		$(my_profile_panel_id + ' .viewMorePeople').remove();
		$(my_profile_panel_id + ' ul#livefeeds').after('<div class="viewMore viewMorePeople"><div class="right hidden"><img src="' + spinner['small'] + '" /></div>' + translate['View More'] + '</div>');
	    } else {
		//$(my_profile_panel_id).html('');
	    }
	}
    });
}

function getFollowings() {
    my_profile_panel_id = '#panel_following';
    $('.my-profile').attr('tab', 'followings');
    
    var tab = $('.my-profile').attr('tab');
    var id = $('.my-profile').attr('id');
    getPeople(id, tab);
}

function getFollowers() {
    my_profile_panel_id = '#panel_followers';
    $('.my-profile').attr('tab', 'followers');
    
    var tab = $('.my-profile').attr('tab');
    var id = $('.my-profile').attr('id');
    getPeople(id, tab);
    
}



$(function() {

//    $(window).load(function() {
//
//	var view = $('.contentWrapper').attr('view');
//	var tab = $('.contentWrapper').attr('tab');
//	var id = $('.contentWrapper').attr('id');
//
//	if (view == 'people') {
//	    getPeople(id, tab);
//	} else if ((view == 'photos' || view == 'videos') && tab == 'albums') {
//	    getAlbums(id, view);
//	} else {
//	    view = (view == 'wall') ? 'home' : view;
//	    getPosts(view, 'all', true);
//	}
//
//    });


    $('body').delegate('.viewMorePeople', 'click',
	    function() {

		var tab = $('.my-profile').attr('tab');
		var id = $('.my-profile').attr('id');

		var viewmore = $(this);
		var loading = $(this).find('div.hidden');
		var startPoint = $(my_profile_panel_id + ' li.lastNode:last').attr('id');

		loading.show();
		$.ajax({
		    url: SITE_URL + 'ajax/users/people.php',
		    type: 'GET',
		    data: 'id=' + id + '&get=' + tab + '&sp=' + startPoint,
		    success: function(data) {
			loading.hide();
			if (data) {
			    $(my_profile_panel_id + ' ul#livefeeds').append(data);
			} else {
			    viewmore.addClass('disactive').text(translate['There are no more people to show']);
			}
		    }
		});
	    }
    );

});
