/**
 * page register
 * 
 * @package Sngine JSL
 * @author Zamblek
 */

$(function() {
    $('.startRegistration').submit(
	    function(event) {

		event.preventDefault();

		var loading = $('#formLoading');
		var button = $(this).find('input[type=submit]');

		// prepare request data
		var data = 'firstname=' + encodeURIComponent($(this).find('input[name=firstname]').val()) + '&lastname=' + encodeURIComponent($(this).find('input[name=lastname]').val()) + '&username=' + encodeURIComponent($(this).find('input[name=username]').val()) + '&email=' + encodeURIComponent($(this).find('input[name=email]').val()) + '&confirm=' + encodeURIComponent($(this).find('input[name=confirm]').val()) + '&password=' + encodeURIComponent($(this).find('input[name=password]').val()) + '&sex=' + encodeURIComponent($(this).find('select[name=sex]').val());
		data += '&month=' + encodeURIComponent($(this).find('select[name=month]').val()) + '&day=' + encodeURIComponent($(this).find('select[name=day]').val()) + '&year=' + encodeURIComponent($(this).find('select[name=year]').val()) + '&recaptcha=' + encodeURIComponent($('input[name=recaptcha_challenge_field]').val()) + '&response=' + encodeURIComponent($('input[name=recaptcha_response_field]').val());

		loading.show();
		button.attr("disabled", 'disabled');
		$.ajax({
		    type: "POST",
		    url: SITE_URL + "ajax/users/register.php",
		    data: data,
		    cache: false,
		    success: function(data) {
			if (data) {
			    loading.hide();
			    button.removeAttr("disabled");
			    $('.signup-error').html(data).fadeIn('slow');
			} else {
			    window.location.reload();
			}
		    }
		});

		event.stopPropagation();

	    }
    );

});
