// [START get_messaging_object]
  // Retrieve Firebase Messaging object.
  const messaging = firebase.messaging();
  // [END get_messaging_object]

  // IDs of divs that display Instance ID token UI or request permission UI.
  const tokenDivId = 'token_div';
  const permissionDivId = 'permission_div';

  // [START refresh_token]
  // Callback fired if Instance ID token is updated.
  messaging.onTokenRefresh(function() {
    messaging.getToken()
    .then(function(refreshedToken) {
      console.log('Token refreshed.');
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
      setTokenSentToServer(false);
      // Send Instance ID token to app server.
      sendTokenToServer(refreshedToken);
      // [START_EXCLUDE]
      // Display new Instance ID token and clear UI of all previous messages.
      resetUI();
      // [END_EXCLUDE]
    })
    .catch(function(err) {
      console.log('Unable to retrieve refreshed token ', err);
      showToken('Unable to retrieve refreshed token ', err);
    });
  });
  // [END refresh_token]

  // [START receive_message]
  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a sevice worker
  //   `messaging.setBackgroundMessageHandler` handler.
  messaging.onMessage(function(payload) {
    console.log("Message received. ", payload);





      var data = payload.data;
                   if(localStorage.getItem("push_que") == null)
                        { var a = [];
                             //alert('blank');
                        }
                         else{
                         var a = JSON.parse(localStorage.getItem("push_que"));
                          //alert('notblank'+JSON.stringify(a));

                         } 
                                             
                        var newmsg = {
                         
                                    "image":data.image ,
                                    "message":data.message ,
                                    "title":data.title ,
                                    "name":data.name ,
                                    "type":data.push_type,
                                    "pid":data.push_id,
                                    "com_img":data.company_image, 
                                    "comId":data.table_id, 
                                    // "request_type":data.request_type, 
                                    "company_name":data.message, 
                                    "logo": data.image,
                                    "read" : false,
                                    "notId": parseInt(data.notId)
                                     
                                  }
             



                         a.push(newmsg);
                         //alert('stack'+JSON.stringify(a));
                         console.log(a.length);
                         if(a.length > 20)
                         {
                            a.shift();
                         }

                           


                          console.log(JSON.parse(localStorage.getItem("push_que")));
                         localStorage.setItem('push_que', JSON.stringify(a));
                         console.log(JSON.parse(localStorage.getItem("push_que")));
                         createNotificationList();

                         var url = notificationURLGenerator(newmsg);


    // [START_EXCLUDE]
    // Update the UI to include the received message.

  var data = payload.data;
  var notificationTitle = 'Wishbook Notification';
  var icon = '';

  if(data.title)
    notificationTitle = data.title;

  if(data.image)
    icon = data.image;
    
  const notificationOptions = {
    body: data.message,
    icon: icon,
  }
      var notification = new Notification(notificationTitle,notificationOptions);
        notification.onclick = function(event) {
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
            window.open(url , '_self');
            notification.close();
        }
    // [END_EXCLUDE]
  });
  // [END receive_message]


  function resetUI() {
  //  clearMessages();
  //  showToken('loading...');
    // [START get_token]
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken()
    .then(function(currentToken) {
      if (currentToken) {
        console.log('token: '+currentToken);
        sendTokenToServer(currentToken);
      //  updateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        requestPermission()
     //   updateUIForPushPermissionRequired();
        setTokenSentToServer(false);
      }
    })
    .catch(function(err) {
      console.log('An error occurred while retrieving token. ', err);
      showToken('Error retrieving Instance ID token. ', err);
      setTokenSentToServer(false);
    });
  }
  // [END get_token]

  function showToken(currentToken) {
    // Show token in console and UI.
  //  var tokenElement = document.querySelector('#token');
  //  tokenElement.textContent = currentToken;
  }

  // Send the Instance ID token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
  function sendTokenToServer(currentToken) {


    if(currentToken ==  'rejected')
    {

        console.log('in rejected');

        var userData = {};
        userData.userprofile = {};
        userData.userprofile.browser_notification_disable = true; 
        var data = JSON.stringify(userData);

        var userid = localStorage.getItem('userid');
        var url = 'api/v1/users/'+userid+'/';

        var xhttp = new XMLHttpRequest();
        xhttp.open("PATCH", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(data);
    }

    else {
      console.log(isTokenSentToServer());
      if (!isTokenSentToServer()) {
        console.log('Sending token to server...');
        // TODO(developer): Send the current token to your server.
        var gcmJson = {};
        gcmJson.registration_id = currentToken;
        gcmJson.active = true;
        var data = JSON.stringify(gcmJson);

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "api/device/gcm/", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.onload = function(e) {
                      console.log('response', this);
                      if (this.status == 201 || this.status == 200) {
                        console.log('response', this.response); // JSON response  
                        setTokenSentToServer(true);
                      }
                    };
        xhttp.send(data);
        //setTokenSentToServer(true);
      } else {
        console.log('Token already sent to server so won\'t send it again ' +
            'unless it changes');
      }
    }
  }

  function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') == 1;
  }

  function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? 1 : 0);
  }

  function showHideDiv(divId, show) {
    const div = document.querySelector('#' + divId);
    if (show) {
      div.style = "display: visible";
    } else {
      div.style = "display: none";
    }
  }

  function requestPermission() {
    console.log('Requesting permission...');
    // [START request_permission]
    messaging.requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // [START_EXCLUDE]
      // In many cases once an app has been granted notification permission, it
      // should update its UI reflecting this.
      resetUI();
      // [END_EXCLUDE]
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
      sendTokenToServer('rejected');
    });
    // [END request_permission]
  }

  function deleteToken() {
    // Delete Instance ID token.
    // [START delete_token]
    messaging.getToken()
    .then(function(currentToken) {
      messaging.deleteToken(currentToken)
      .then(function() {
        console.log('Token deleted.');
        setTokenSentToServer(false);
        // [START_EXCLUDE]
        // Once token is deleted update UI.
        resetUI();
        // [END_EXCLUDE]
      })
      .catch(function(err) {
        console.log('Unable to delete token. ', err);
      });
      // [END delete_token]
    })
    .catch(function(err) {
      console.log('Error retrieving Instance ID token. ', err);
      showToken('Error retrieving Instance ID token. ', err);
    });

  }

  // Add a message to the messages element.
  function appendMessage(payload) {
    const messagesElement = document.querySelector('#messages');
    const dataHeaderELement = document.createElement('h5');
    const dataElement = document.createElement('pre');
    dataElement.style = 'overflow-x:hidden;'
    dataHeaderELement.textContent = 'Received message:';
    dataElement.textContent = JSON.stringify(payload, null, 2);
    messagesElement.appendChild(dataHeaderELement);
    messagesElement.appendChild(dataElement);
  }

  // Clear the messages element of all children.
  function clearMessages() {
    const messagesElement = document.querySelector('#messages');
    while (messagesElement.hasChildNodes()) {
      messagesElement.removeChild(messagesElement.lastChild);
    }
  }

  function updateUIForPushEnabled(currentToken) {
    showHideDiv(tokenDivId, true);
    showHideDiv(permissionDivId, false);
    showToken(currentToken);
  }

  function updateUIForPushPermissionRequired() {
    showHideDiv(tokenDivId, false);
    showHideDiv(permissionDivId, true);
  }
