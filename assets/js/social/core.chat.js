/**
 * core chat
 * 
 * @package Sngine JSL
 * @author Zamblek
 */

var windowFocus = true;
var chatHeartbeatCount = 0;
var minChatHeartbeat = 1000;
var maxChatHeartbeat = 33000;
var chatHeartbeatTime = minChatHeartbeat;
var blinkOrder = 0;

var chatboxFocus = new Array();
var newMessages = new Array();
var newMessagesWin = new Array();
var chatBoxes = new Array();

function showChatDiv() {
    $('.main-content-div').hide();
    $('#chat-main-content').show();
}

// re-arrange chatboxes
function restructureChatBoxes() {
    align = 0;
    newChatBoxes = new Array();
    for (x in chatBoxes) {
	id = chatBoxes[x];
	if ($("#chatbox_" + id).length > 0) {
	    if (align == 0) {
		$("#chatbox_" + id).css('right', '270px');
	    } else {
		width = (align) * (225 + 10) + 270;
		$("#chatbox_" + id).css('right', width + 'px');
	    }
	    align++;
	    newChatBoxes.push(id);
	}
    }
    chatBoxes = newChatBoxes;
}

// create new chatbox
function createChatBox(id, title) {
    $('.chatBox ').hide();
    // if chatbox already opend before
    if ($("#chatbox_" + id).length > 0) {
	if (!$("#chatbox_" + id).is(":visible")) {
	    $("#chatbox_" + id).show();
	}
	if (!$("#chatbox_" + id).find('.chatBoxContent').is(":visible")) {
	    $("#chatbox_" + id).find('.chatBoxContent').show();
	}
	$("#chatbox_" + id + " textarea").focus();
	return;
    }

    // prepare the position
    chatBoxeslength = 0;
    for (x in chatBoxes) {
	if ($("#chatbox_" + chatBoxes[x]).length > 0) {
	    chatBoxeslength++;
	}
    }

    // create new chatbox
    var div = '<div id="chatbox_' + id + '" class="chatBox col-sm-12 main-content-div panel panel-default"><div class="chatBoxHead panel-heading"><i class="clip-bubble-4"></i>' + title + '<div class="panel-tools"><a href="javascript://" onclick="javascript:closeChatBox(' + id + ')" class="btn btn-xs btn-link panel-close"><i class="fa fa-times"></i></a></div></div><div class="chatBoxContent panel-body"><div class="chatBoxConversation"><ul class="discussion"></ul></div><div class="chatBoxInput"><textarea onkeydown="javascript:return checkChatBoxInputKey(event,this,' + id + ');" class="form-control"></textarea></div></div></div>';
    $("#chat-main-content").after(div);
    $('.main-content-div').hide();
    $("#chatbox_" + id).show();

    // set the position
//    if (chatBoxeslength == 0) {
//	$("#chatbox_" + id).css('right', '270px');
//    } else {
//	width = (chatBoxeslength) * (225 + 10) + 270;
//	$("#chatbox_" + id).css('right', width + 'px');
//    }

    chatBoxes.push(id);

    chatboxFocus[id] = false;

    $("#chatbox_" + id + " textarea").blur(function() {
	chatboxFocus[id] = false;
    }).focus(function() {
	chatboxFocus[id] = true;
	newMessages[id] = false;
	$('#chatbox_' + id + ' .chatBoxHead').removeClass('chatBoxHeadNew');
    });

    $("#chatbox_" + id).click(function() {
	$("#chatbox_" + id + " textarea").focus();
    });
}

// close chatbox and end its session
function closeChatBox(id) {
    $('#chatbox_' + id).remove();
    restructureChatBoxes();
    $.post(SITE_URL + "ajax/messages/chat/close.php", {id: id});
}

// textarea event listner
function checkChatBoxInputKey(event, textarea, to) {
    // check enter & !(shift + enter = new line) & send the message
    if (event.keyCode == 13 && event.shiftKey == 0) {
	message = $(textarea).val();
	$(textarea).val('');
	$(textarea).focus();
	$(textarea).css('height', '44px');
	if (message != '') {
	    $.ajax({
		type: "POST",
		url: SITE_URL + "ajax/messages/chat/send.php",
		data: 'to=' + encodeURIComponent(to) + '&message=' + encodeURIComponent(message),
		dataType: "json",
		cache: false,
		success: function(data) {
		    if (data.status == 'error') {
			$.popups.alert({message: data.value, title: data.title});
		    } else {
			$("#chatbox_" + to + " ul").append($(data.value).fadeIn('slow'));
			$("#chatbox_" + to + " .chatBoxConversation").scrollTop($("#chatbox_" + to + " .chatBoxConversation")[0].scrollHeight);
			chatHeartbeatTime = minChatHeartbeat;
			chatHeartbeatCount = 1;
		    }
		}
	    });
	}
	return false;
    }
    // adjust textare hieght and scroll bar
    var adjustedHeight = textarea.clientHeight;
    var maxHeight = 94;
    if (maxHeight > adjustedHeight) {
	adjustedHeight = Math.max(textarea.scrollHeight, adjustedHeight);
	if (maxHeight) {
	    adjustedHeight = Math.min(maxHeight, adjustedHeight);
	}
	if (adjustedHeight > textarea.clientHeight) {
	    $(textarea).css('height', adjustedHeight + 8 + 'px');
	}
    } else {
	$(textarea).css('overflow', 'auto');
    }
}

// cronjob to get chatbox messages
function chatHeartbeat() {
    var itemsfound = 0;
    if (windowFocus == false) {
	var blinkNumber = 0;
	var titleChanged = 0;
	for (x in newMessagesWin) {
	    if (newMessagesWin[x] == true) {
		++blinkNumber;
		if (blinkNumber >= blinkOrder) {
		    document.title = 'you have new message';
		    titleChanged = 1;
		    break;
		}
	    }
	}
	if (titleChanged == 0) {
	    document.title = originalTitleWithCounter;
	    blinkOrder = 0;
	} else {
	    ++blinkOrder;
	}
    } else {
	for (x in newMessagesWin) {
	    newMessagesWin[x] = false;
	}
    }

    for (x in newMessages) {
	if (newMessages[x] == true) {
	    if (chatboxFocus[x] == false) {
		$('#chatbox_' + x + ' .chatBoxHead').toggleClass('chatBoxHeadNew');
	    }
	}
    }

    $.ajax({
	type: "GET",
	url: SITE_URL + "ajax/messages/chat/cron.php",
	cache: false,
	success: function(data) {

	    if (data) {
		data = jQuery.parseJSON(data);
		$.each(data, function(i, conversation) {
		    id = conversation.sender;
		    title = conversation.title;
		    if ($("#chatbox_" + id).length <= 0) {
			createChatBox(id, title);
		    }
		    $("#chatbox_" + id + " ul").html($(conversation.messages).fadeIn('slow'));
		    $("#chatbox_" + id + " .chatBoxConversation").scrollTop($("#chatbox_" + id + " .chatBoxConversation")[0].scrollHeight);
		    newMessages[id] = true;
		    newMessagesWin[id] = true;
		    itemsfound += 1;
		});
	    }

	    chatHeartbeatCount++;

	    if (itemsfound > 0) {
		chatHeartbeatTime = minChatHeartbeat;
		chatHeartbeatCount = 1;
	    } else if (chatHeartbeatCount >= 10) {
		chatHeartbeatTime *= 2;
		chatHeartbeatCount = 1;
		if (chatHeartbeatTime > maxChatHeartbeat) {
		    chatHeartbeatTime = maxChatHeartbeat;
		}
	    }

	    setTimeout('chatHeartbeat();', chatHeartbeatTime);

	}
    });

}

// get who is online
function whoOnline() {
    if ($('.stopCronJobs').length > 0)
	return;
    $.ajax({
	type: 'GET',
	url: SITE_URL + 'ajax/messages/chat/online.php',
	success: function(data) {
	    if (data) {
		$('#whoIsOnline').html(data);
		$('#onlineCounter').text($('.onlineCounter').attr('id')).fadeIn('fast');
		setTimeout('whoOnline();', minChatHeartbeat);
	    }
	}
    });
}

$(function() {

    $(document).ready(function() {

	// make chat not available at messages system
	var path = window.location.pathname;
	//if (path.indexOf("message") == -1 && $('body').attr('ub') == 'N') {

	// create online box
	var div = '<div class="onlineBox"><div class="onlineBoxContent" id="whoIsOnline"></div><div class="onlineBoxHead"><span class="icon"><i class="app_icon app_chatOn"></i></span><strong>' + translate['Chat'] + ' (<span id="onlineCounter">?</span>)</strong></div></div><div class="translationBox languageDialog"><i class="app_icon app_public"></i></div>';
	$("#chat-main-content").append(div);
	whoOnline();

	// start chat session
	$.ajax({
	    type: "GET",
	    url: SITE_URL + "ajax/messages/chat/session.php",
	    cache: false,
	    success: function(data) {
		if (data) {
		    data = jQuery.parseJSON(data);
		    $.each(data, function(i, conversation) {
			id = conversation.sender;
			title = conversation.title;
			if ($("#chatbox_" + id).length <= 0) {
			    createChatBox(id, title);
			}
			$("#chatbox_" + id + " ul").append($(conversation.messages));
			$("#chatbox_" + id + " .chatBoxConversation").scrollTop($("#chatbox_" + id + " .chatBoxConversation")[0].scrollHeight);
			$('#main-content').show();
			$("#chatbox_" + id).hide();

		    });
		}
		setTimeout('chatHeartbeat();', chatHeartbeatTime);
	    }
	});

	// change page tile when focus
	$([window, document]).blur(function() {
	    windowFocus = false;
	}).focus(function() {
	    windowFocus = true;
	    document.title = originalTitleWithCounter;
	});

	//}

    });

//    $('body').delegate('.onlineBoxHead', 'click',
//	    function(event) {
//		//$(".onlineBoxContent").toggle();
//		event.stopPropagation();
//	    }
//    );

    $('body').delegate('.chatWith', 'click',
	    function(event) {
		event.preventDefault();
		createChatBox($(this).attr('id'), $(this).attr('title'));
		$("#chatbox_" + $(this).attr('id') + " textarea").focus();
	    }
    );

    $('body').delegate('.chatBoxHead', 'click',
	    function() {
		$(this).next().toggle();
	    }
    );

});
