# Applozic-Web-Plugin


### Overview         

Open source Chat and Messaging SDK that lets you add real time chat and messaging in your mobile (android, iOS) applications and website.


Signup at [https://www.applozic.com/signup.html](https://www.applozic.com/signup.html?utm_source=github&utm_medium=readme&utm_campaign=web) to get the application key.

Documentation: [Applozic Web (Javascript) Chat & Messaging Plugin Documentation](https://docs.applozic.com/docs/web-javascript-chat-plugin)

Applozic comes with 2 ready to use UI layout

## 1. Full view 

<img align="middle" src="https://raw.githubusercontent.com/AppLozic/Applozic-Web-Plugin/master/public/plugin/sample/fullview.png" />




## 2. Sidebox 
<img align="middle" src="https://raw.githubusercontent.com/AppLozic/Applozic-Web-Plugin/master/public/plugin/sample/sidebox.png" />



#### Applozic One to One and Group Chat SDK


##### Features:

 One to one and Group Chat
 
 Image capture
 
 Photo sharing
 
 File attachment
 
 Location sharing
 
 Push notifications
 
 In-App notifications
 
 Online presence
 
 Last seen at 
 
 Unread message count
 
 Typing indicator
 
 Message sent, delivery report
 
 Offline messaging
 
 Multi Device sync
 
 Application to user messaging
 
 Customized chat bubble
 
 UI Customization Toolkit
 
 Cross Platform Support (iOS, Android & Web)



### Getting Started       

Applozic messaging jQuery plugin

A jQuery plugin to integrate messaging into your web page for real time communication between users via Applozic messaging platform and also to see your latest conversations and past chat history. Add Applozic messaging plugin into your web application :


### Overview      

Integrate messaging into your mobile apps and website without developing or maintaining any infrastructure.

Signup at [https://www.applozic.com/signup.html](https://www.applozic.com/signup.html?utm_source=github&utm_medium=readme&utm_campaign=web) to get the application key.

#### Step 1: Add Plugin
Add the Applozic Chat plugin script before closing of ```</body>``` into your web page            

```
<script type="text/javascript">
   (function(d, m){var s, h;       
   s = document.createElement("script");
   s.type = "text/javascript";
   s.async=true;
   s.src="https://apps.applozic.com/sidebox.app";
   h=document.getElementsByTagName('head')[0];
   h.appendChild(s);
   window.applozic=m;
   m.init=function(t){m._globals=t;}})(document, window.applozic || {});
</script>
```
 
#### Step 2: Login/Register user
Login or Register with userId and username
Applozic will create a new user if the user doesn't exists.
userId is the unique identifier for any user, it can be anything like email, phone number or uuid from your database.
Add the below code just after Step 1.

``` 
<script type="text/javascript">
  window.applozic.init({
    appId: applozicApplicationKey,      //Get your application key from https://www.applozic.com
    userId: userId,                     //Logged in user's id, a unique identifier for user
    userName: username,                 //User's display name
    imageLink : '',                     //User's profile picture url
    email : '',                         //optional
    contactNumber: '',                  //optional, pass with internationl code eg: +13109097458
    desktopNotification: true,
    source: '1',                          // optional, WEB(1),DESKTOP_BROWSER(5), MOBILE_BROWSER(6)
    notificationIconLink: 'https://www.applozic.com/favicon.ico',    //Icon to show in desktop notification, replace with your icon
    authenticationTypeId: 1,          //1 for password verification from Applozic server and 0 for access Token verification from your server
    accessToken: '',                    //optional, leave it blank for testing purpose, read this if you want to add additional security by verifying password from your server https://www.applozic.com/docs/configuration.html#access-token-url
    locShare: true,
    googleApiKey: "AIzaSyDKfWHzu9X7Z2hByeW4RRFJrD9SizOzZt4",   // your project google api key 
    mapStaticAPIkey: "AIzaSyCWRScTDtbt8tlXDr6hiceCsU83aS2UuZw",
    googleMapScriptLoaded : false,   // true if your app already loaded google maps script
    autoTypeSearchEnabled : true,     // set to false if you don't want to allow sending message to user who is not in the contact list
    loadOwnContacts : false, //set to true if you want to populate your own contact list (see Step 4 for reference)
    onInit : function(response) {
       if (response === "success") {
          // login successful, perform your actions if any, for example: load contacts, getting unread message count, etc
       } else {
          // error in user login/register (you can hide chat button or refresh page)
       }
   },
   contactDisplayName: function(otherUserId) {
         //return the display name of the user from your application code based on userId.
         return "";
   },
   contactDisplayImage: function(otherUserId) {
         //return the display image url of the user from your application code based on userId.
         return "";
   },
   onTabClicked: function(response) {
         // write your logic to execute task on tab load
         //   object response =  {
         //    tabId : userId or groupId,
         //    isGroup : 'tab is group or not'
         //  }
   }
  });
</script>
```    

It can also be called from any event, for example: on click of a button.

**Note** :

**1)** desktopNotification support only for chrome browser, notificationIconLink will be displayed in desktop notification.

**2)** By Default source is set to WEB(1).


#### Step 3: Initiate Chat

To initiate chat with another user using userId:
``` 
  $applozic.fn.applozic('loadTab', otherUserId);
```

Alternatively, you can add a chat button inside your web page using a tag and use 'userId' of the other user for data attribute "data-mck-id"

``` 
  <a href="#" class="applozic-launcher" data-mck-id="PUT_OTHER_USERID_HERE" data-mck-name="PUT_OTHER_USER_DISPLAY_NAME_HERE">CHAT BUTTON</a>
``` 

To open the chat list:
``` 
  $applozic.fn.applozic('loadTab', '');
``` 


#### Step 4: Populate contact list

Javascript code to load contacts

```

// Contacts Array
 var contactsJSON = [{"userId": "USER_1", "displayName": "Devashish",
                          "imageLink": "https://www.applozic.com/resources/images/applozic_icon.png", // image url (optional)
                          "imageData" :"Base64 encoded image data"  // or image data (optional)
                          },
                         {"userId": "USER_2", "displayName": "Adarsh",
                          "imageLink": "https://www.applozic.com/resources/images/applozic_icon.png", // image url (optional)
                          "imageData" :"Base64 encoded image data"  // or image data (optional)
                         },
                         {"userId": "USER_3", "displayName": "Shanki",
                          "imageLink": "https://www.applozic.com/resources/images/applozic_icon.png",  // image url (optional)
                          "imageData" :"Base64 encoded image data"  // or image data (optional)
                         }
                      ];
                      
 // Function calling inside onInit(from #Step 2) after plugin initialize successfully
    onInit : function(response) {
       if (response === "success") {
          // calling function load contacts
           $applozic.fn.applozic('loadContacts', {"contacts":contactsJSON});
       } else {
          // error in user login/register (you can hide chat button or refresh page)
       }
   }
   
   //Set loadOwnContacts to true from Step 2
   loadOwnContacts : true,

```

**NOTE**- Call **loadContacts** function only after plugin initialize callback (see Step 2 onInit function for reference).


#### Step 5: Group Messaging
Group have 2 identifiers:
groupId: Auto generated by Applozic
clientGroupId (optional): In case if you already have group identifier on your applicaiton side, use clientGroupId in all functions.

##### Open group chat

```
 $applozic.fn.applozic('loadGroupTab', groupId);  // group Id returned in response to group create api  
 ``` 
 
Open group chat using Client Group Id
 
```
 $applozic.fn.applozic('loadGroupTabByClientGroupId',{'clientGroupId':clientGroupId});
```


##### Create Group
 
 ```
$applozic.fn.applozic('createGroup', {'groupName' : groupName,   // required
                                       'type' : 1,                // 1 for private , 2 for public, 5 for broadcast (required)
                                       'clientGroupId' : '',      // optional
                                       'users': [{ userId:userId1, 
                                                   displayName:'',
                                                   groupRole : 3  // (optional)  USER(0), ADMIN(1), MODERATOR(2), MEMBER(3)
                                                 },
                                                 { userId:userId2,
                                                   displayName:'',
                                                   groupRole :3  // (optional)  USER(0), ADMIN(1), MODERATOR(2), MEMBER(3)
                                                 }
                                                ],
                                                'callback' : function(response){console.log(response);}}); 
 ``` 
Access level based on role of users in group :-

```
USER(0),               - Chat
ADMIN(1),              - Full access
MODERATOR(2)           - Add/remove users + Group Info update
MEMBER(3)              - Group Info update 

```

##### Add User to Group (only for Group Admin)
 ```
$applozic.fn.applozic('addGroupMember',{'groupId': groupId,
                                        'clientGroupId': clientGroupId, //use either groupId or clientGroupId
                                        'userId': userIdToAdd,
                                        'role' :  3,  // (optional)  USER(0), ADMIN(1), MODERATOR(2), MEMBER(3)
                                        'callback': function(response) {console.log(response);}
                                        });
 ``` 
 
##### Remove User from Group (only for Group Admin)
 ```
$applozic.fn.applozic('removeGroupMember',{'groupId': groupId,
                                          'clientGroupId' : clientGroupId, //use either groupId or clientGroupId
                                          'userId': userIdToRemove,         
                                          'callback': function(response) {console.log(response);}
                                          });
 ```  
 
##### Leave Group
 ```
$applozic.fn.applozic('leaveGroup', {'groupId' : groupId,
                                     'clientGroupId' : clientGroupId, //use either groupId or clientGroupId
                                     'callback' :function(response){console.log(response);}
                                     });
 ``` 
  
##### Update Group 
 ```
$applozic.fn.applozic('updateGroupInfo', {'groupId' : groupId
                                     'clientGroupId' : clientGroupId, //use either groupId or clientGroupId,
                                     'name' : groupName, // optional
                                     'imageUrl' : '',  //optional
                                     'users': [                      // required only if want to update user role
                                              {
                                                userId:userIdToUpdate, // required
                                                role:3,  // (required)    USER(0), ADMIN(1), MODERATOR(2), MEMBER(3)
                                              }],
                                     'callback' : function(response){console.log(response);}});
 ```  
  
##### Get group list
 
 ```
 $applozic.fn.applozic('getGroupList', {'callback':function (response) { //write your logic}});   
 ``` 
 
Sample response:

```
           {'status' : 'success' ,                 // or error
            'data': [ {'id': groupId,
                       'name' : groupName',
                       'type' : '2',               // 1,2 or 5   (private, public or broadcast)
                       'memberName':[],           // Array of group member ids
                       'adminName': '',           // Put group admin's userId
                       'removedMembersId' [],     // Array including removed or left members Id  
                       'unreadCount' : '10'       // total unread count of messages for current logged in user
                        }]    
                     }]
           }
```

  
#### Step 6: Context (Topic) based Chat
 
 Add the following in window.applozic.init call:
 
 ```
  topicBox: true,
  getTopicDetail: function(topicId) {
         //Based on topicId, return the following details from your application
         return {'title': 'topic-title',      // Product title
                     'subtitle': 'sub-title',     // Product subTitle or Product Id
                     'link' :'image-link',        // Product image link
                     'key1':'key1' ,              // Small text anything like Qty (Optional)
                     'value1':'value1',           // Value of key1 ex-10 (number of quantity) Optional
                     'key2': 'key2',              // Small text anything like MRP (product price) (Optional)
                     'value2':'value2'            // Value of key2 ex-$100  (Optional)
                  };
  }
 ```
 
 Add a chat button inside your web page using ```a``` tag and add the following:
 
 ```
 Class Attribute - applozic-wt-launcher 
 Data Attriutes  - mck-id, mck-name and mck-topicid
```

```
 mck-id      :  User Id of the user with whom to initiate the chat
 mck-name    :  Display name of the user with whom to initiate the chat
 mck-topicId :  Unique identifier for the topic/product 
 ```
 
 ```
 <a href="#" class="applozic-wt-launcher" data-mck-id="PUT_USERID_HERE" data-mck-name="PUT_DISPLAYNAME_HERE" data-mck-topicid="PUT_TOPICID_HERE">CHAT ON TOPIC</a>
 ```
 
 ## File Structure
```
Applozic-Web-Plugin
  |--public
    |-- plugin
        |-- js
            |-- app  
                |-- sidebox  
                    |-- applozic.sidebox.js
                |-- fullview   
                    |-- applozic.fullview.js           
                |-- modules           
                    |-- api         
                        |-- applozic.api.js            - Backend chat Apis
                    |-- file
                        |-- applozic.file.js           - file related ui code
                    |-- group
                        |-- applozic.group.js          - group ui code
                    |-- message
                        |-- applozic.message.js        - message ui code
                    |-- notification
                        |-- applozic.notification.js   - notification ui code
                    |-- user
                        |-- applozic.user.js           - user ui code
                    |-- socket   
                        |--  applozic.socket.js        - Mqtt socket connection
                    |-- storage
                        |-- applozic.storage.js        - caching data
                    |-- video
                        |-- applozic.calling.js        - audio/videocall library
                |-- call
                    |-- mck-ringtone-service.js       - to play ringtone            
                    
                |-- applozic.aes.js                   - external library for Encryption
                |-- applozic.emojis.min.js            - external library for emojis
                |-- applozic.socket.min.js            - external library for socket
                |-- applozic.widget.min.js            - external library for widgets
                |-- jquery.min.js                     - external library for jquery
                |-- locationpicker.jquery.min.js      - external library for location
                |-- twilio-video.js                   - audio/videocall library
                |-- viewer.js                         - external library files for Image/Video Preview
        |-- css
           |-- app
                |-- fullview 
                   |-- applozic.fullview.css          - fullview ui css 
                |-- sidebox   
                   |-- applozic.sidebox.css           - sidebox plugin css
                       
                |-- videocall.css   
       |-- images                                     - icons used in chat interface 
       |-- sample    
         |-- fullview.html                            - sample ui for fullview plugin
         |-- sidebox.html                             - sample ui for sidebox plugin
         
    |-- applozic.chat.min.js                            - minified file of applozic modules
|-- README.md
```
Note: Do not edit external libraries. 


### Documentation:

For UI customization, visit: 
[Applozic Web (Javascript) Chat & Messaging Plugin Documentation](https://docs.applozic.com/docs/web-javascript-chat-theme-and-customization)


### Help

We provide support over at [StackOverflow](http://stackoverflow.com/questions/tagged/applozic) when you tag using applozic, ask us anything.

Applozic is the best jquery chat plugin for instant messaging, still not convinced? Write to us at github@applozic.com and we will be happy to schedule a demo for you.

### Free Javascript (jQuery) Chat Plugin
Special plans for startup and open source contributors, write to us at github@applozic.com 

## Github projects

Android Chat SDK https://github.com/AppLozic/Applozic-Android-SDK

Web Chat Plugin https://github.com/AppLozic/Applozic-Web-Plugin

iOS Chat SDK https://github.com/AppLozic/Applozic-iOS-SDK
