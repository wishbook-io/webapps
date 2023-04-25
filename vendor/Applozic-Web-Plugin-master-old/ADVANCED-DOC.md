####  Send message

Send message from logged in user to another user
 ```
$applozic.fn.applozic('sendMessage', {
                                      'to': otherUserId,            // userId of the receiver
                                      'message' : messageText,       // message to send    
                                      'type' : 0                     //(optional) DEFAULT(0), TEXT_HTML(3)
                                    });
 ```

Response contains message key.


Send message from logged in user to group
 ```
$applozic.fn.applozic('sendGroupMessage', {
                                      'groupId' : 'GROUP_ID',       
                                      'clientGroupId' : 'CLIENT_GROUP_ID',   // use either groupId or clientGroupId
                                      'message' : messageText       //message to send           
                                    });
 ```

Response contains message key.



Send message visible only to the receiver.
 ```
$applozic.fn.applozic('sendMessage', {
                                      "to": otherUserId,            //userId of the receiver
                                      "message" : messageText,       //message to send    
                                      "type" : 12
                                    }); 
```

 
#### Messages list    

```
  $applozic.fn.applozic('messageList', {'id': 'Group Id or User Id',     
                                        'isGroup': false,               // True in case of group 
                                        'clientGroupId' : 'CLIENT_GROUP_ID', // use either groupId or clientGroupId
                                        'callback': function(response){ 
                                        // write your logic
                                        } 
                                        });
```        

 
Sample response:           

 ```
 response = {'status' : 'success',                     // or error
             'messages' :[{'key': "MESSAGE_IDENTIFIER",
                          'from': "SENDER_USERID",         
                          'to': 'RECEIVER_USERID',
                          'message': "MESSAGE_TEXT",
                          'type': 'inbox or outbox',
                          'status': "MESSAGE__CURRENT_STATUS",        // For outbox message  (sent, delivered or read)
                                                                    // For inbox messsage (read, unread)
                          'timeStamp': 'MESSAGE_CREATED_TIMESTAMP'          
                         }]                
           }
```


####  User Details
Get details of all users present in user's contact list.

```
  $applozic.fn.applozic('getUserDetail', {callback: function(response) {
        if(response.status === 'success') {
           // write your logic
        }
     }
  });
```

Sample response:

```
           {'status' : 'success' ,                     // or error
            'data':  {'totalUnreadCount': 15           // total unread count for user          
                     'users':                          // Array of other users detail
                        [{"userId":"USERID_1","connected":false,"lastSeenAtTime":1453462368000,"createdAtTime":1452150981000,"unreadCount":3}, 
                        {"userId":"USERID_2","connected":false,"lastSeenAtTime":1452236884000,"createdAtTime":1452236884000,"unreadCount":1}]    
                     }
           }
```


#### Events subscription

Using events callback, you can subscribe to the following events.

```
$applozic.fn.applozic('subscribeToEvents', {
                 onConnect: function () {
                       //User subscribed successfully
                 },
                 onConnectFailed: function () {
                       //connection failed
                 },
                 onMessageDelivered: function (obj) {
                       //message delivered obj json: {'messageKey': 'delivered-message-key'}
                 },
                 onMessageRead: function (obj) {
                       //message read obj json: {'messageKey': 'read-message-key'}
                 },
                 onMessageReceived: function (obj) {
                       //message received
                 },
                 onMessageSent: function (obj) {
                       //message sent
                 },
                 onMessageSentUpdate: function (obj) {
                       //message sent confirmation: {'messageKey': 'sent-message-key'}
                 },
                 onMessageDeleted: function (obj) {
                       //message delete obj json : {'messageKey': 'deleted-message-key'}
                 },
                 onConversationDeleted: function (obj) {
                       //all messages deleted obj json : {'userId': userId}
                 },
                 onUserConnect: function (obj) {
                       //user from the contact list came online: {'userId': 'connected-user-Id'}
                 },
                 onUserDisconnect: function (obj) {
                       //user from the contact list went offline: {'userId': 'connected-user-Id'}
                 },
                 onUserBlocked: function (obj) {
                       //user blocks someone or gets blocked by someone: {'status': 'BLOCKED_TO or BLOCKED_BY', 'userId': userId}
                 },
                 onUserUnblocked: function (obj) {
                       //user unblocks someone or get unblocked by someone: {'status': 'BLOCKED_TO or BLOCKED_BY', 'userId': userId}
                 },
                 onUserActivated: function () {
                       //user is activated by app admin
                 },
                 onUserDeactivated: function () {
                       //user is deactivated by app admin
                 }
               });
```

#### Video Calling

Video Call is available at Github:
https://github.com/AppLozic/Applozic-Web-Plugin

Open src/sample/sidebox.html file as a reference and add all scripts and html in your web page in the same order as given in sidebox.html

Files you can modify: CSS:https://github.com/AppLozic/Applozic-Web-Plugin/blob/master/src/css/app/sidebox/applozic.sidebox.css
JS: https://github.com/AppLozic/Applozic-Web-Plugin/blob/master/src/js/app/sidebox/applozic.sidebox.js

You can modify css and js files based on your design, files are present under src/css/app/ and src/js folders.
