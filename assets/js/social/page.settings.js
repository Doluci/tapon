/**
 * page setting
 * 
 * @package Sngine JSL
 * @author Zamblek
 */

function handleResponse(key, status, error, img, thumbnail) {
    if (status === '0') {
	$('.uploadStatus').html('<div>' + error + '</div>');
    } else if (status === '1') {
	$('.uploadStatus').html('<div>' + translate['Upload Successful'] + '</div>');
	$('img.changeAvatarImg').attr('src', img);
    }
}

function handleSettingsBasicResponse(status, error, statusElm) {
    if (status === '0') {
	$(statusElm).html('<div class="alert alert-danger">' + error + '</div>').show();
    } else if (status === '1') {
	$(statusElm).html('<div class="alert alert-success">' + translate['Update Successful'] + '</div>').show();
    }
}

$(function() {

    $('body').delegate('.doRemoveAvatar', 'click',
	    function() {

		$.popups.confirm(translate['Are you sure you want to delete your profile picture?'], '400',
			function(result) {
			    if (result) {

				$.ajax({
				    url: SITE_URL + 'ajax/users/picture/delete.php',
				    type: 'POST',
				    cache: false,
				    success: function(data) {
					if (!data) {
					    $('img.changeAvatarImg').attr('src', SITE_URL + 'content/themes/' + $theme + '/images/misc/no_avatar.jpg');
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

    $('body').delegate('#uploadFile', 'change',
	    function() {
		$('#uploadForm').submit();
		$('.uploadStatus').html('<div class="right"><img src="' + spinner['small'] + '" /></div>' + translate['Uploading'] + '...').show();
	    }
    );


});
