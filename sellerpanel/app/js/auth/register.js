/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/



(function() {
    'use strict';

    angular
        .module('app.auth')
        .controller('RegisterFormController', RegisterFormController);

    RegisterFormController.$inject = ['$http', '$state','djangoAuth', 'Country', 'Users', 'ngDialog','toaster','$scope', 'State', 'City', 'TNC', '$cookies', 'Company'];
    function RegisterFormController($http, $state, djangoAuth, Country, Users, ngDialog, toaster, $scope, State, City, TNC, $cookies, Company) {
        var vm = this;

          vm.account = {};
          $scope.otp = {};
            
          Country.query().$promise.then(function(success){
                $scope.countries = success;
                vm.account.country  = 1;
          });
          
          vm.states = State.query();

          vm.GetCity =  function(state) { 
            vm.cities = City.query({ state: state });
          }
          
          /*vm.account.connections_preapproved = true;
          vm.account.discovery_ok = true;
          vm.account.newsletter_subscribe = true;*/

          $scope.openConfirm = function () {
            $scope.otp = {};
            ngDialog.openConfirm({
              template: 'otpform',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            });
          };

          vm.TncPopup = function () {
            
            TNC.get({},function(result) {
                $scope.tnc_data = result;
                ngDialog.openConfirm({
                  template: 'tncpopup',
                  scope: $scope,
                  className: 'ngdialog-theme-default',
                  closeByDocument: false
                });
            })
          
            
          };
          
          $scope.loginFunction = function (username, country, password, otp="") {
            
            djangoAuth.login(username, country, password, otp)
              .then(function(response) {
                    $(".modelformOtp").removeClass(progressLoader());
                    ngDialog.close();
                    
                    /*========================= check company code start =======================*/
                    djangoAuth.profile().then(function(data){
                        $cookies.put('username_webapp', data.username);
                        if (data.is_staff == true){
                            
                            $state.go('app.companies');
                            return;
                        }
                        
                        if(data.companyuser != null)
                        {
                            $cookies.put('company', data.companyuser.company);
                          Company.get({id: data.companyuser.company},function(result) {
                              
                         
                              if(result.brand_added_flag == "no")
                              {
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
                            $state.go('app.company');
                            return;

                        }
                       
                    })
                  $state.go('app.company');
                  return;
                 
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

          $scope.registerUser  = function (){
               //alert(".modelform");
            if(vm.otpForm.$valid) {
               $(".modelformOtp").addClass(progressLoader());
               $scope.loginFunction(vm.account.username, vm.account.country, vm.account.password, $scope.otp.value);
               /*$http
                  .post('api/checkotpanduser/', {otp: $scope.otp.value, username: vm.account.username})
                  .then(function(response){
                        ngDialog.close()
                        $state.go('page.login',{"registration":"success"});
                  });*/
              }
              else {

                  vm.otpForm.otp.$dirty = true;
              }
          };
          
          $scope.regenerateOtp = function (){
              $scope.loginFunction(vm.account.username, vm.account.country, vm.account.password);
               /*$http
               .post('api/registrationopt/', {phone_number: vm.account.phone_number, 'country': vm.account.country })
                      .then(function(response){
                         // alert("s");
                        //vm.openConfirm();
                      });*/
          };

          vm.register = function() {
              //alert("register call");
            //  $scope.openConfirm();
//            vm.authMsg = '';
                     
            if(vm.registerForm.$valid) {
              $(".modelform").addClass(progressLoader());
              if (vm.account.email == null || vm.account.email == "") 
              {
                vm.account.email = vm.account.phone_number+'@wishbooks.io';
              }

              /*$http
                .post('api/checkuserexist/', {email: vm.account.email, username: vm.account.username})
                .then(function(response) {*/
                    Users.get({'phone_number': vm.account.phone_number, 'country': vm.account.country, 'field':'is_exist'}).$promise.then(function(response){
                    /*$http
                    .post('api/checkphonenoexist/', {phone_number: vm.account.phone_number, country: vm.account.country})
                    .then(function(response) {*/
                      vm.account.username = vm.account.phone_number;
                        // djangoAuth.register(vm.account.username,vm.account.company_name,vm.account.password,vm.account.password_confirm, vm.account.email, vm.account.phone_number, vm.account.country, vm.account.state, vm.account.city, vm.account.tnc_agreed, 'no')//vm.account.connections_preapproved, vm.account.discovery_ok, vm.account.newsletter_subscribe, 
                        djangoAuth.register(vm.account.username,vm.account.first_name, vm.account.last_name, vm.account.company_name,vm.account.password,vm.account.password_confirm, vm.account.email, vm.account.phone_number, vm.account.country, vm.account.state, vm.account.city, vm.account.tnc_agreed, 'no')//vm.account.connections_preapproved, vm.account.discovery_ok, vm.account.newsletter_subscribe, 
                        .then(function(response) {
                            
                            $scope.openConfirm();
                          
                  // Start: Google Code for Conversions Conversion Page 
                          /* <![CDATA[ */
                          var google_conversion_id = 936767031;
                          var google_conversion_language = "en";
                          var google_conversion_format = "3";
                          var google_conversion_color = "ffffff";
                          var google_conversion_label = "GGxkCIvRuWMQt9zXvgM";
                          var google_remarketing_only = false;
                          /* ]]> */
                          
                  //      <script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">      </script>
                        
                          $.getScript("//www.googleadservices.com/pagead/conversion.js", function(){
                              console.log("Google conversion script loaded.");
                          });

                       /*   <noscript>
                          <div style="display:inline;">
                          <img height="1" width="1" style="border-style:none;" alt="" src="//www.googleadservices.com/pagead/conversion/936767031/?label=GGxkCIvRuWMQt9zXvgM&amp;guid=ON&amp;script=0"/>
                          </div>
                          </noscript>*/
                          var g_code = "<img height='1' width='1' style='border-style:none;' alt='' src='//www.googleadservices.com/pagead/conversion/936767031/?label=GGxkCIvRuWMQt9zXvgM&amp;guid=ON&amp;script=0'/>";
                          $("#google_conversion").html(g_code);
                  // End : google conversion code

                  // Start: google re-marketing code
                        /* <script type="text/javascript">
                        <![CDATA[ */
                        var google_conversion_id = 936767031;
                        var google_custom_params = window.google_tag_params;
                        var google_remarketing_only = true;
                        /* ]]> 
                        </script>*/
                        //<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
                        //</script>
                         $.getScript("//www.googleadservices.com/pagead/conversion.js", function(){
                              console.log("Google re-marketing script loaded.");
                          });

                      /*  <noscript>
                        <div style="display:inline;">
                        <img height="1" width="1" style="border-style:none;" alt="" src="//googleads.g.doubleclick.net/pagead/viewthroughconversion/936767031/?value=0&amp;guid=ON&amp;script=0"/>
                        </div>
                        </noscript>*/
                        var gm_code = "<img height='1' width='1' style='border-style:none;' alt='' src='//googleads.g.doubleclick.net/pagead/viewthroughconversion/936767031/?value=0&amp;guid=ON&amp;script=0'/>";
                          $("#google_remarketing").html(gm_code);
                    // End: google re-marketing code

                      // Facebook tracking code
                        fbq('track', 'Lead');
                        fbq('track', 'CompleteRegistration');
                      // Facebook tracking code 
                          $(".modelformOtp").removeClass(progressLoader());
                          vm.successtoaster = {
                              type:  'success',
                              title: 'Success',
                              text:  'Thank You !! You are registered successfully.'
                          };
                          toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                           
                          //ngDialog.close()
                          //$state.go('page.login',{"registration":"success"});

                        }, 
                        function(error) {
                            $(".modelform").removeClass(progressLoader());
                        });
                    });    
                  // assumes if ok, response is an object with some data, if not, a string with error
                  // customize according to your api
                 
                 //   $state.go('app.dashboard');
                       
                    /*$http
                      .post('api/registrationopt/', {phone_number: vm.account.phone_number, 'country': vm.account.country })
                      .then(function(response){
                          //alert("s");
                              $scope.openConfirm();
                      });*/
                //});
            }
            else {
             // vm.registerForm.account_username.$dirty = true;
              vm.registerForm.company_name.$dirty = true;
              vm.registerForm.state.$dirty = true;
              vm.registerForm.city.$dirty = true;
              vm.registerForm.account_phonenumber.$dirty = true;
              vm.registerForm.first_name.$dirty = true;
              vm.registerForm.last_name.$dirty = true;
              vm.registerForm.account_password.$dirty = true;
              vm.registerForm.account_password_confirm.$dirty = true;
              vm.registerForm.tnc_agreed.$dirty = true;
              
            }
          };
      
    }
})();
