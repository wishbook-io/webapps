var ENV_URL= ":getBaseurl";

document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById("login-submit").onclick = function() {
        getUserData();
    };
    document.getElementById("logout").onclick = function() {
        logout();
    };

    var loginPassword = document.getElementById("loginPassword");
    loginPassword.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("login-submit").click();
        }
    });
});

function getUserData() { //loadScript();
    //pass user login credentials to chat plugin script
    var appId = document.getElementById("applicationId").value;
    var userId = document.getElementById("loginId").value;
    var pass = document.getElementById("loginPassword").value;
    intializeChat(appId, userId, pass);
}

function logout() {
    $applozic.fn.applozic('logout');
    location.reload();
    /*document.getElementById("login-form").classList.remove('n-vis');
    document.getElementById("login-form").classList.add('vis');
    document.getElementById("success-text").classList.add('n-vis');
    document.getElementById("success-text").classList.remove('vis');*/
}

 //this method logs in a user.

function intializeChat(appId, userId, pass) {

    var contactsJSON = [{
        "userId": "applozic",
        "displayName": "Applozic",
        "imageLink": "https://www.applozic.com/resources/images/applozic_icon.png", // image url (optional)
        "imageData": "Base64 encoded image data" // or image data (optional)
    }];


    (function(d, m) {
        var s, h;
        s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = ENV_URL+"/sidebox.app";
        h = document.getElementsByTagName('head')[0];
        h.appendChild(s);
        window.applozic = m;
        m.init = function(t) { m._globals = t; }
    })
    (document, window.applozic || {});

    window.applozic.init({
        baseUrl : ENV_URL,
        appId: appId, //Get your application key from https://www.applozic.com
        userId: userId, //Logged in user's id, a unique identifier for user
        userName: '', //User's display name
        imageLink: '', //User's profile picture url
        email: '', //optional
        contactNumber: '', //optional, pass with internationl code eg: +13109097458
        desktopNotification: true,
        source: '1', // optional, WEB(1),DESKTOP_BROWSER(5), MOBILE_BROWSER(6)
        notificationIconLink: 'https://www.applozic.com/favicon.ico', //Icon to show in desktop notification, replace with your icon
        authenticationTypeId: 1, //1 for password verification from Applozic server and 0 for access Token verification from your server
        accessToken: pass, //optional, leave it blank for testing purpose, read this if you want to add additional security by verifying password from your server https://www.applozic.com/docs/configuration.html#access-token-url
        locShare: true,
        googleApiKey: "AIzaSyDKfWHzu9X7Z2hByeW4RRFJrD9SizOzZt4", // your project google api key
        googleMapScriptLoaded: false, // true if your app already loaded google maps script
        //   mapStaticAPIkey: "AIzaSyCWRScTDtbt8tlXDr6hiceCsU83aS2UuZw",
        autoTypeSearchEnabled: true, // set to false if you don't want to allow sending message to user who is not in the contact list
        loadOwnContacts: true, //set to true if you want to populate your own contact list (see Step 4 for reference)
        olStatus: false, //set to true for displaying a green dot in chat screen for users who are online
        onInit: function(response) {
            if (response === "success") {

                document.getElementById("login-form").classList.add('n-vis');
                document.getElementById("success-text").classList.add('vis');
                document.getElementById("success-text").classList.remove('n-vis');

                $applozic.fn.applozic('loadTab', '');
                $applozic.fn.applozic('loadContacts', { "contacts": contactsJSON });
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
}
