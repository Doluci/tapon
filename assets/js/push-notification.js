var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
	
	// Bind Event Listeners
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("backbutton", this.onBackKeyPress, false);
    },
	
	  onBackKeyPress: function() {
      e.preventDefault();
	  window.location.href = "index.html";
      },

    // deviceready Event Handler
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        var pushNotification = window.plugins.pushNotification;
		//Register device for push notification if not already registered
		if (localStorage.getItem("tapon_gcm_regId") === null) {
			pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"773889567837","ecb":"app.onNotificationGCM"});
		}	
        
    },
 
	// Update DOM on a Received Event
    receivedEvent: function(id) {
          console.log('Received Event: ' + id);
    },
 
	// result contains any message sent from the plug-in call
    successHandler: function(result) {
	//       alert('Callback Success! Result = '+result);
    },
	
    errorHandler:function(error) {
        alert(error);
    },
	
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
			//	console.log("Regid " + e.regid);
			//      alert('registration id = '+e.regid);
				localStorage.setItem('tapon_gcm_regId', e.regid); 
					$.ajax({
					  url: 'http://54.85.29.26/tapon/push_register.php',
					  type: 'post',
					  data: {'name': localStorage.getItem("taponDEVICEGUID"), 'email': localStorage.getItem("taponDEVICENUMBER"), 'regId' : e.regid},
					  success: function(data) {
				//		alert(data);
					  },
					  error: function(xhr, desc, err) {
						console.log(xhr);
						console.log("Details: " + desc + "\nError:" + err);
				//		alert(xhr+" Details: " + desc + "\nError:" + err);
					  }
					}); // end ajax call
				
                }
                break;

            case 'message':
                // this is the actual push notification. its format depends on the data model from the push server
			//	alert('message = '+e.message+' msgcnt = '+e.msgcnt);
				window.location.href = "tapon_poptap_screen.html";
			//	if (e.message['taps'] > 0) {
			//	window.location.href = "tapon_poptap_screen.html";
			//	}
         
                break;

            case 'error':
                alert('GCM error = '+e.msg);
                break;

            default:
                alert('An unknown GCM event has occurred');
                break;
        }
    }

};
