/**
 * core publisher
 * 
 * @package Sngine JSL
 * @author Zamblek
 */

function getPublisher(targetId) {

    var openedId = $('.publisher:visible').attr('id');
    var loading = $('#publisherLoading');

    loading.show();
    $.ajax({
	type: "GET",
	url: SITE_URL + "ajax/publisher/get.php",
	data: 'get=' + targetId,
	success: function(data) {
	    loading.hide();

	    // disactive opened publisher
	    $('#' + openedId + '.openPublisher').find('i.arrow').hide();
	    $('#' + openedId + '.openPublisher').removeClass("active");

	    // active target publisher
	    $('#' + targetId + '.openPublisher').find('i.arrow').show();
	    $('#' + targetId + '.openPublisher').addClass("active");

	    // attach target publisher
	    $('.publisher').html(data);
	    $('.publisher').attr('id', targetId);
	}
    });
}

function getSubPublisher(targetId) {

    var loading = $('#publisherLoading');

    loading.show();
    $.ajax({
	type: "GET",
	url: SITE_URL + "ajax/publisher/get.php",
	data: 'get=' + targetId,
	success: function(data) {
	    loading.hide();
	    $('.publisher').html(data);
	}
    });
}

function handleResponse(key, status, error, img, thumbnail) {
    if (status === '0') {
	$('#uploader').html('<div>' + error + '</div>');
    } else if (status === '1') {
	$('#uploader').html('<div>' + translate['Upload Successful'] + '</div>');
	$("input[name='photo[src]']").val(img);
	$("input[name='photo[thumbnail]']").val(thumbnail);
	$('.publisher button[type=submit]').removeAttr("disabled");
    }
}

$(function() {

    $('body').delegate('.openPublisher', 'click',
	    function() {
		var publishers = ['newsPublisher', 'musicPublisher', 'photoPublisher', 'videoPublisher', 'questionPublisher', 'pollPublisher', 'linkPublisher'];
		if ($.inArray($(this).attr('id'), publishers) != -1) {
		    getPublisher($(this).attr('id'));
		}
	    }
    );

    $('body').delegate('.openPublisher', 'click',
	    function() {
		var publishers = ['photoPublisherSingle', 'photoPublisherAlbum', 'videoPublisherSingle', 'videoPublisherAlbum'];
		if ($.inArray($(this).attr('id'), publishers) != -1) {
		    getSubPublisher($(this).attr('id'));
		}
	    }
    );

    $('body').delegate('#uploadFile', 'change',
	    function() {
		$('#uploadForm').submit();
		$('#uploader').html('<div>' + translate['Uploading'] + '...</div>');
	    }
    );

    $('body').delegate('.sharePollOption:last', 'focus',
	    function() {
		var html = '<p class="mb10"><input class="uiInput sharePollOption form-control" type="text" value="+ ' + translate['Add an option'] + '..." /></p>';
		$(this).parents('div:first').append(html);
	    }
    );

    $('.linkThumbBtn').click('mousedown',
	    function() {
		if ($(this).hasClass('disactive')) {
		    return;
		}
		$(this).addClass("clicked");
		$(this).find('i').css({opacity: '1'});
	    }
    );

    $('.linkThumbBtn').click('mouseup',
	    function() {
		if ($(this).hasClass('disactive')) {
		    return;
		}
		$(this).removeClass("clicked");
		$(this).find('i').css({opacity: '0.3'});
	    }
    );

    $('.linkThumbBtn').click('click',
	    function() {

		var button = $(this);
		var recent = $('img.linkThumbnail:visible');
		var index = $('span.thumbnailId');
		var total = $('span.totalThumbnails');

		if ($(this).hasClass('disactive')) {
		    return;
		}

		if ($(this).hasClass('getNext')) {

		    if (index.text() == 1) {
			button.prev().removeClass('disactive');
		    }
		    if (index.text() == parseInt(total.text()) - 1) {
			button.addClass('disactive');
		    }

		    recent.hide();
		    recent.next().show();
		    index.text(parseInt(index.text()) + 1);

		    $("input[name='link[img]']").val(recent.next().attr('src'));

		} else if ($(this).hasClass('getPrev')) {

		    if (index.text() == total.text()) {
			button.next().removeClass('disactive');
		    }
		    if (index.text() == 2) {
			button.addClass('disactive');
		    }

		    recent.hide();
		    recent.prev().show();
		    index.text(parseInt(index.text()) - 1);

		    $("input[name='link[img]']").val(recent.prev().attr('src'));

		}

	    }
    );

    $('label.removeThumbnil').click('click',
	    function() {
		if ($(this).find('input').attr('checked')) {
		    $('.linkThumbControl, .dataLinkContent-thumbnail').hide();
		    $("input[name='link[img]']").val('');
		} else {
		    $('.linkThumbControl, .dataLinkContent-thumbnail').show();
		    $("input[name='link[img]']").val($('img.linkThumbnail:visible').attr('src'));

		}
	    }
    );

    $('body').delegate('.postNews', 'submit',
	    function(event) {

		event.preventDefault();

		var loading = $('#publisherLoading');
		var button = $(this).find('input[type=submit]');
		var textarea = $(this).find('textarea');

		// check inputs values
		if (!textarea.hasClass('active') || textarea.val() == '') {
		    return;
		}

		// check mention
		var mention = '';
		var page = $('body').attr('page');
		if (page == 'page') {
		    mention = ' @[p-' + $('.contentWrapper').attr('id') + ']';
		} else if (page == 'profile') {
		    mention = ' @[u-' + $('.contentWrapper').attr('id') + ']';
		}

		loading.show();
		button.attr("disabled", 'disabled');

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/posts/post.php",
		    data: 'app=news' + '&text=' + encodeURIComponent(textarea.val() + mention),
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			loading.hide();
			button.removeAttr("disabled");
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    $('ul#livefeeds').prepend($(data.value).fadeIn('slow'));
			    getPublisher('newsPublisher');
			}
		    }
		});

		event.stopPropagation();

	    }
    );

    $('body').delegate('.postMusic', 'submit',
	    function(event) {

		event.preventDefault();

		var loading = $('#publisherLoading');
		var button = $(this).find('input[type=submit]');
		var textarea = $(this).find('textarea');
		var id = $("input[name='music[id]']");
		var title = $("input[name='music[title]']");
		var description = $("input[name='music[description]']");

		// check inputs values
		if (!textarea.hasClass('active')) {
		    textarea.val('');
		}

		// check mention
		var mention = '';
		var page = $('body').attr('page');
		if (page == 'page') {
		    mention = ' @[p-' + $('.contentWrapper').attr('id') + ']';
		} else if (page == 'profile') {
		    mention = ' @[u-' + $('.contentWrapper').attr('id') + ']';
		}

		// prepare request data
		var data = '&text=' + encodeURIComponent(textarea.val() + mention) + '&id=' + encodeURIComponent(id.val()) + '&title=' + encodeURIComponent(title.val()) + '&description=' + encodeURIComponent(description.val());

		loading.show();
		button.attr("disabled", 'disabled');

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/posts/post.php",
		    data: 'app=music' + data,
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			loading.hide();
			button.removeAttr("disabled");
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    $('ul#livefeeds').prepend($(data.value).fadeIn('slow'));
			    getPublisher('newsPublisher');
			}
		    }
		});

		event.stopPropagation();

	    }
    );

    $('body').delegate('.postPhoto', 'submit',
	    function(event) {

		event.preventDefault();

		var loading = $('#publisherLoading');
		var button = $(this).find('button[type=submit]');
		var textarea = $(this).find('textarea');
		var src = $("input[name='photo[src]']");
		var thumbnail = $("input[name='photo[thumbnail]']");

		// check inputs values
		if (!textarea.hasClass('active')) {
		    textarea.val('');
		}

		// check mention
		var mention = '';
		var page = $('body').attr('page');
		if (page == 'page') {
		    mention = ' @[p-' + $('.contentWrapper').attr('id') + ']';
		} else if (page == 'profile') {
		    mention = ' @[u-' + $('.contentWrapper').attr('id') + ']';
		}

		// prepare request data
		var data = '&text=' + encodeURIComponent(textarea.val() + mention) + '&src=' + encodeURIComponent(src.val()) + '&thumbnail=' + encodeURIComponent(thumbnail.val());

		loading.show();
		button.attr("disabled", 'disabled');

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/posts/post.php",
		    data: 'app=photos' + data,
		    cache: false,
		    dataType: "json",
		    success: function(data) {
			loading.hide();
			button.removeAttr("disabled");
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    $('ul#livefeeds').prepend($(data.value).fadeIn('slow'));
			    getPublisher('newsPublisher');
			}
		    }
		});

		event.stopPropagation();

	    }
    );

    $('.postPhotoAlbum').click('submit',
	    function(event) {

		event.preventDefault();

		var loading = $('#publisherLoading');
		var button = $(this).find('input[type=submit]');
		var textarea = $(this).find('textarea');
		var title = $('.shareInput');

		// check inputs values
		if (!title.hasClass('active')) {
		    return;
		}
		if (!textarea.hasClass('active')) {
		    textarea.val('');
		}

		// check mention
		var mention = '';
		var page = $('body').attr('page');
		if (page == 'page') {
		    mention = ' @[p-' + $('.contentWrapper').attr('id') + ']';
		} else if (page == 'profile') {
		    mention = ' @[u-' + $('.contentWrapper').attr('id') + ']';
		}

		// prepare request data
		var data = '&title=' + encodeURIComponent(title.val()) + '&text=' + encodeURIComponent(textarea.val() + mention);

		loading.show();
		button.attr("disabled", 'disabled');

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/media/albums/post.php",
		    data: 'app=photos' + data,
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			loading.hide();
			button.removeAttr("disabled");
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    window.location.replace(SITE_URL + "editalbum/photos/" + data.value + "/add/");
			}
		    }
		});

		event.stopPropagation();

	    }
    );

    $('body').delegate('.postVideo', 'submit',
	    function(event) {

		event.preventDefault();

		var loading = $('#publisherLoading');
		var button = $(this).find('button[type=submit]');
		var textarea = $(this).find('textarea');
		var id = $("input[name='video[id]']");
		var type = $("input[name='video[type]']");
		var thumbnail = $("input[name='video[thumbnail]']");

		// check inputs values
		if (!textarea.hasClass('active')) {
		    textarea.val('');
		}

		// check mention
		var mention = '';
		var page = $('body').attr('page');
		if (page == 'page') {
		    mention = ' @[p-' + $('.contentWrapper').attr('id') + ']';
		} else if (page == 'profile') {
		    mention = ' @[u-' + $('.contentWrapper').attr('id') + ']';
		}

		// prepare request data
		var data = '&text=' + encodeURIComponent(textarea.val() + mention) + '&id=' + encodeURIComponent(id.val()) + '&type=' + encodeURIComponent(type.val()) + '&thumbnail=' + encodeURIComponent(thumbnail.val());

		loading.show();
		button.attr("disabled", 'disabled');

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/posts/post.php",
		    data: 'app=videos' + data,
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			loading.hide();
			button.removeAttr("disabled");
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    $('ul#livefeeds').prepend($(data.value).fadeIn('slow'));
			    getPublisher('newsPublisher');
			}
		    }
		});

		event.stopPropagation();

	    }
    );

    $('.postVideoAlbum').click('submit',
	    function(event) {

		event.preventDefault();

		var loading = $('#publisherLoading');
		var button = $(this).find('input[type=submit]');
		var textarea = $(this).find('textarea');
		var title = $('.shareInput');

		// check inputs values
		if (!title.hasClass('active')) {
		    return;
		}
		if (!textarea.hasClass('active')) {
		    textarea.val('');
		}

		// prepare request data
		var data = '&title=' + encodeURIComponent(title.val()) + '&text=' + encodeURIComponent(textarea.val());

		loading.show();
		button.attr("disabled", 'disabled');

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/media/albums/post.php",
		    data: 'app=videos' + data,
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			loading.hide();
			button.removeAttr("disabled");
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    window.location.replace(SITE_URL + "editalbum/videos/" + data.value + "/add/");
			}
		    }
		});

		event.stopPropagation();

	    }
    );

    $('body').delegate('.postQuestion', 'submit',
	    function(event) {

		event.preventDefault();

		var loading = $('#publisherLoading');
		var button = $(this).find('button[type=submit]');
		var textarea = $(this).find('textarea');
		var title = $('.shareInput');

		// check inputs values
		if (!title.hasClass('active')) {
		    return;
		}
		if (!textarea.hasClass('active')) {
		    textarea.val('');
		}

		// check mention
		var mention = '';
		var page = $('body').attr('page');
		if (page == 'page') {
		    mention = ' @[p-' + $('.contentWrapper').attr('id') + ']';
		} else if (page == 'profile') {
		    mention = ' @[u-' + $('.contentWrapper').attr('id') + ']';
		}

		// prepare request data
		var data = '&title=' + encodeURIComponent(title.val()) + '&text=' + encodeURIComponent(textarea.val() + mention);

		loading.show();
		button.attr("disabled", 'disabled');

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/posts/post.php",
		    data: 'app=questions' + data,
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			loading.hide();
			button.removeAttr("disabled");
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    $('ul#livefeeds').prepend($(data.value).fadeIn('slow'));
			    getPublisher('newsPublisher');
			}
		    }
		});

		event.stopPropagation();

	    }
    );

    $('body').delegate('.postPoll', 'submit',
	    function(event) {

		event.preventDefault();

		var loading = $('#publisherLoading');
		var button = $(this).find('button[type=submit]');
		var title = $('.shareInput');

		// check inputs values
		if (!title.hasClass('active')) {
		    return;
		}

		// prepare request data
		var data = '&title=' + encodeURIComponent(title.val());
		var length = 0;
		$('.sharePollOption').each(function(i) {
		    if ($(this).hasClass('active')) {
			data += '&opt' + i + '=' + encodeURIComponent($(this).val());
			length++
		    }
		});
		data += '&len=' + encodeURIComponent(length);

		// check mention
		var mention = '0';
		var page = $('body').attr('page');
		if (page == 'page') {
		    mention = '1&type=p&mid=' + encodeURIComponent($('.contentWrapper').attr('id'));
		} else if (page == 'profile') {
		    mention = '1&type=u&mid=' + encodeURIComponent($('.contentWrapper').attr('id'));
		}

		loading.show();
		button.attr("disabled", 'disabled');

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/posts/post.php",
		    data: 'app=polls' + data + '&mention=' + mention,
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			loading.hide();
			button.removeAttr("disabled");
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    $('ul#livefeeds').prepend($(data.value).fadeIn('slow'));
			    getPublisher('newsPublisher');
			}
		    }
		});

		event.stopPropagation();

	    }
    );

    $('body').delegate('.postLink', 'submit',
	    function(event) {

		event.preventDefault();

		var loading = $('#publisherLoading');
		var button = $(this).find('input[type=submit]');
		var textarea = $(this).find('textarea');
		var title = $("input[name='link[title]']");
		var url = $("input[name='link[url]']");
		var host = $("input[name='link[host]']");
		var description = $("input[name='link[description]']");
		var thumbnail = $("input[name='link[img]']");

		// check inputs values
		if (!textarea.hasClass('active')) {
		    textarea.val('');
		}

		// check mention
		var mention = '';
		var page = $('body').attr('page');
		if (page == 'page') {
		    mention = ' @[p-' + $('.contentWrapper').attr('id') + ']';
		} else if (page == 'profile') {
		    mention = ' @[u-' + $('.contentWrapper').attr('id') + ']';
		}

		// prepare request data
		var data = '&text=' + encodeURIComponent(textarea.val() + mention) + '&title=' + encodeURIComponent(title.val()) + '&url=' + encodeURIComponent(url.val()) + '&host=' + encodeURIComponent(host.val()) + '&description=' + encodeURIComponent(description.val()) + '&thumbnail=' + encodeURIComponent(thumbnail.val());

		loading.show();
		button.attr("disabled", 'disabled');

		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/posts/post.php",
		    data: 'app=links' + data,
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			loading.hide();
			button.removeAttr("disabled");
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    $('ul#livefeeds').prepend($(data.value).fadeIn('slow'));
			    getPublisher('newsPublisher');
			}
		    }
		});

		event.stopPropagation();

	    }
    );

    $(document).delegate('.attachLink', 'submit',
	    function(event) {

		event.preventDefault();

		var loading = $('#publisherLoading');
		var button = $(this).find('input[type=submit]');
		var input = $(this).find('input[type=text]');

		// check inputs values
		if (!input.hasClass('active')) {
		    return;
		}

		loading.show();
		button.attr("disabled", 'disabled');
		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/publisher/scraper.php",
		    data: 'url=' + encodeURIComponent(input.val()),
		    dataType: "json",
		    cache: false,
		    success: function(data) {
			loading.hide();
			button.removeAttr("disabled");
			if (data.status == 'error') {
			    $.popups.alert({message: data.value, title: data.title});
			} else {
			    $('.publisher').html(data.value);
			}
		    }
		});

		event.stopPropagation();

	    }
    );

    $(document).delegate('.button-fbShare, .button-twShare', 'click',
	    function() {

		var button = $(this);
		var connection = (button.hasClass('button-fbShare')) ? 'fb' : 'tw';

		if (button.hasClass("active")) {
		    button.removeClass("active");
		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/publisher/check.php",
			data: 'connection=' + connection + '&do=inactive',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				button.addClass("active");
			    }
			}
		    });
		} else {
		    button.addClass("active");
		    $.ajax({
			type: "POST",
			url: SITE_URL + "ajax/publisher/check.php",
			data: 'connection=' + connection + '&do=active',
			dataType: "json",
			cache: false,
			success: function(data) {
			    if (data) {
				$.popups.alert({message: data.value, title: data.title});
				button.removeClass("active");
			    }
			}
		    });
		}

	    }
    );

    $('#newsPublisher').trigger('click');

});
