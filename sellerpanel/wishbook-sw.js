// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('webpush/firebase-app.js');
importScripts('webpush/firebase-messaging.js');
importScripts('webpush/web_push_common.js');
firebase.initializeApp({
  'messagingSenderId': '479030482746'
});

const messaging = firebase.messaging();

/**
 * Here is is the code snippet to initialize Firebase Messaging in the Service
 * Worker when your app is not hosted on Firebase Hosting.

 // [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here, other Firebase libraries
 // are not available in the service worker.
 importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

 // Initialize the Firebase app in the service worker by passing in the
 // messagingSenderId.
 firebase.initializeApp({
   'messagingSenderId': 'YOUR-SENDER-ID'
 });

 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 // [END initialize_firebase_in_sw]
 **/


// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var data = payload.data;


   

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




  addToDB(newmsg);


  var url = notificationURLGenerator(newmsg);

 

  var notificationTitle = 'Wishbook Notification';
  var icon = 'media/logo-single.png';

  if(data.title){
    notificationTitle = data.title;
  }

 
  if(data.image && data.image != ''){
    icon = data.image;
  }
  
  const notificationOptions = {
    body: data.message,
    icon: icon,
    data: url
  }     

  console.log(notificationOptions);
                    

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});


// [END background_handler]


self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification.tag);
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();



  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then(function(clientList) {

    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url === '/' && 'focus' in client) {
        return client.focus();
      }
    }

    if (clients.openWindow) {
      return clients.openWindow('/'+event.notification.data);
    }
  }));
});


