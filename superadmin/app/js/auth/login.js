/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
    'use strict';
    angular
        .module('app.auth')
        .controller('LoginFormController', LoginFormController);

    LoginFormController.$inject = ['$http', '$state', '$scope', 'CheckAuthenticated', 'djangoAuth', 'Country', 'Users', '$location', 'ToDashboard', 'Company', 'toaster', '$stateParams', '$cookies', 'ngDialog', '$localStorage'];
    function LoginFormController($http, $state, $scope, CheckAuthenticated, djangoAuth, Country, Users, $location, ToDashboard, Company, toaster, $stateParams, $cookies, ngDialog, $localStorage) {

        ToDashboard.check();
        
        var vm = this;
        $scope.is_username = false;
        vm.isUsername = function(){
          var login_string = document.getElementById('loginusername').value;
          //console.log(login_string);
            //if(/^[a-zA-Z]+$/.test(login_string))
            if(login_string.match(/[a-zA-Z]/i))
            {
              $scope.is_username = true;
            }
            else
            {
              $scope.is_username = false; 
            }
        }
        if($stateParams.registration=="success"){
            setTimeout(function(){
                vm.successtoaster = {
                    type:  'success',
                    title: 'Success',
                    text:  'Thank You !! You are registered successfully.'
                };
                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
            }, 1000);
        }
        

        vm.account = {};
        
        Country.query().$promise.then(function(success){
                $scope.countries = success;
                vm.account.country  = 1;
        });
                
        $scope.openConfirm = function () {
            $scope.otp = {};
            ngDialog.openConfirm({
              template: 'otpform',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            });
        };
        
        $scope.loginFunction = function (name_or_number, country, password, otp) {
            
            djangoAuth.login(name_or_number, country, password, otp)
              .then(function(response) {
                  djangoAuth.profile().then(function(data){
                      
                        console.log("djangoauth login page");
                        console.log(data);
                        //alert(data.is_staff);
                        
                        
                        $(".modelformOtp").removeClass(progressLoader());
                        ngDialog.close();
                         if(data.is_staff == true){
                           localStorage.setItem('is_staff', true);
                           $state.go('app.companies');
                        }
                        else {
                            localStorage.removeItem('is_staff');
                            alert("Only Super admin can login this panel.");
                            djangoAuth.logout();
                        }

                        //$state.go('app.catalog', {}, {reload: true});
                        /*if(data.is_staff == true){
                            localStorage.setItem('is_staff', true);
                            $state.go('app.companies');
                          }
                        else
                        {
                            //$state.go('app.catalog');
                            localStorage.removeItem('is_staff');
                            $state.go('app.browse');
                            //location.reload();
                        }
                        return;*/

                  })
                    
                    
                    /* Start: Applogic Chat */
                 /*   window.applozic.init({

                          appId: '1a79888ef6d0fa76c522ea56a251b4fb9',      //Get your application key from https://www.applozic.com
                          userId: 'mavajih',                     //Logged in user's id, a unique identifier for user
                          userName: 'Mavaji',                 //User's display name
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
                          googleMapScriptLoaded : true,   // true if your app already loaded google maps script
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

                      $applozic.fn.applozic('loadTab', '');  */

                    /* End: Applogic Chat */

                    //~ return;
                    
                    /*========================= check company code start =======================*/
                    /*
                    djangoAuth.profile().then(function(data){
                        $cookies.put('username_webapp', data.username);
                   // $rootScope.sidebar = true;
                      
                      //  $rootScope.app.offsidebarOpen = false;
                        if (data.is_staff == true){
                            
                            $state.go('app.companies');
                            return;
                        }
                        
                        if(data.companyuser != null)
                        {
                            //$cookies.put('company', data.companyuser.company);
                            localStorage.setItem('company', data.companyuser.company);
                            
                          Company.get({id: data.companyuser.company},function(result) {
                              
                         
                              if(result.brand_added_flag == "no")
                              {
                                //$rootScope.sidebar = false;
                               // $rootScope.app.offsidebarOpen = false;
                                $state.go('app.company');
                                return;

                              }
                              else
                              {
                                $state.go('app.catalog');
                                return;
                              }
                            
                          })
                        }
                        else{
                            //$rootScope.sidebar = false;
                           // $rootScope.app.offsidebarOpen = false;
                            //alert("no company")
                            $state.go('app.company');
                            return;

                        }
                       
                    })
                    $state.go('app.company');
                    return;*/
                  /*========================= check company code end =======================*/
                  
                  //location.reload();
               
              }, 
              function(error) {
                 $(".modelform").removeClass(progressLoader());
                  angular.forEach(error, function(value, key) {
                        if(value == "Phone number is not verified."){
                            $scope.openConfirm();
                        }
                  })

              });
        };
        
        vm.login = function(otp_value) {
          if(vm.loginForm.$valid) {
            $(".modelform").addClass(progressLoader());
            $scope.loginFunction(vm.account.name_or_number, vm.account.country, vm.account.password, otp_value);

            /*if(vm.account.username == null)
            {
                Users.get({'phone_number': vm.account.phone_number, 'country': vm.account.country, 'field':'get_userdetail'}).$promise.then(function(response){
                
                //$http.post('api/getusernamefromno/',{'phone_number': vm.account.phone_number, 'country': vm.account.country})
                //.success(function(response)
                //{
                    alert(JSON.stringify(response));
                    vm.account.username = response.username;
                    $scope.loginFunction(vm.account.username, vm.account.password, otp_value);  
                })
            }
            else
            {
                $scope.loginFunction(vm.account.username, vm.account.password, otp_value);
            }*/
          }
          else {
            vm.loginForm.account_nameornumber.$dirty = true;
            vm.loginForm.account_password.$dirty = true;
          }
        };  // login end
        
        
        $scope.registerUser  = function (){
               //alert(".modelform");
            if(vm.otpForm.$valid) {
                $(".modelformOtp").addClass(progressLoader());
                vm.login(vm.otp.value);
                /*$http
                  .post('api/checkotpanduser/', {otp: vm.otp.value, 'username': vm.account.username })
                  .then(function(response){
                      $(".modelformOtp").removeClass(progressLoader());
                        ngDialog.close();
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'OTP has been verified'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  });*/
            }else {
                vm.otpForm.otp.$dirty = true;
            }
        };
        
        
        $scope.regenerateOtp = function (){
            $(".modelformOtp").addClass(progressLoader());
            vm.login("");
            $(".modelformOtp").removeClass(progressLoader());
            
            /*$http
            .post('api/resendotp/', {"username":vm.account.username})
              .then(function(response){
                  $(".modelformOtp").removeClass(progressLoader());
                 // alert("s");
                //vm.openConfirm();
              });*/
        };
        
    }
})();
