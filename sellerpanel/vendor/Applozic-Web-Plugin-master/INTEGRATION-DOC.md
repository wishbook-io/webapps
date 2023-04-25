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
    googleMapScriptLoaded : false,   // true if your app already loaded google maps script
    mapStaticAPIkey: "AIzaSyCWRScTDtbt8tlXDr6hiceCsU83aS2UuZw",
    autoTypeSearchEnabled : true,     // set to false if you don't want to allow sending message to user who is not in the contact list
    loadOwnContacts : false, //set to true if you want to populate your own contact list (see Step 4 for reference)
    olStatus: false,         //set to true for displaying a green dot in chat screen for users who are online
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
                                       'type' : 1, //(required) 1:private, 2:public, 5:broadcast,7:GroupofTwo
                                       
                                       'groupIcon' : group display image // optional
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
$applozic.fn.applozic('updateGroupInfo', {'groupId' : groupId,
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
                       'type' : '2',               // 1,2,5 or 7   (private, public, broadcast or GroupofTwo)
                       'memberName':[],           // Array of group member ids
                       'adminName': '',           // Put group admin's userId
                       'removedMembersId' [],     // Array including removed or left members Id  
                       'unreadCount' : '10'       // total unread count of messages for current logged in user
                        }]    
                     }]
           }
```

  
#### Step 6: Context (Topic) based Chat
Context based chat (chat about any particular listing/offering/product..) for eg. online marketplace for new and used cars, if you wish to chat about any particular car with the dealer and so on.

![contextual-chat](https://raw.githubusercontent.com/AppLozic/Applozic-Web-Plugin/master/img/contextchat.png)     

 Add 'topicBox' and 'getTopicDetail' in 'window.applozic.init' call:
 
 ```
  window.applozic.init({
    appId: applozicApplicationKey,      //Get your application key from https://www.applozic.com
    userId: userId,                     //Logged in user's id, a unique identifier for user
    userName: username,                 //User's display name
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
  });
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
