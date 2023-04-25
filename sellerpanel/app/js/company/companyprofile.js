
(function() {
    'use strict';

    angular
        .module('app.companyprofile')
        .controller('CompanyprofileFormController', CompanyprofileFormController);

    CompanyprofileFormController.$inject = ['$resource', '$state', '$http', 'djangoAuth', 'kyc', 'City', 'Country', 'State', 'Brand', 'Company', 'Category', 'CompanyPhoneAlias', 'CompanyPricelist', 'CompanyBuyergroupRule', 'BrandDistributor', 'grouptype', '$scope', 'CheckAuthenticated', 'toaster', '$location', 'SidebarLoader', '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', 'ngDialog', '$cookies', '$localStorage'];
    function CompanyprofileFormController($resource, $state, $http, djangoAuth, kyc, City, Country, State, Brand, Company, Category, CompanyPhoneAlias, CompanyPricelist, CompanyBuyergroupRule, BrandDistributor, grouptype, $scope, CheckAuthenticated, toaster, $location, SidebarLoader, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, ngDialog, $cookies, $localStorage) {
        CheckAuthenticated.check();
        $scope.app.offsidebarOpen = false;

        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
     
        var vm = this;

        vm.states = State.query();
        
        vm.GetCity =  function(state) { 
        vm.cities = City.query({ state: state });
        }
        vm.phonealias = {};
        
        Country.query().$promise.then(function(success){
            $scope.countries = success;
            vm.phonealias.country  = 1;
        });          
        
        $scope.kyc = {};
        kyc.query({ 'cid' : $scope.company_id },
        function(success){
            if(success != ''){
            $scope.kyc.pan = success[0].pan;
            console.log(success[0].id);
            $scope.kyc.id = success[0].id;
            $scope.kyc_update_flag = true;
            }
            else
            {
            $scope.kyc_update_flag = false;
            }
        });
        vm.panForm = '';


        $scope.openTab = function(evt, tabName)
        {
            // Declare all variables
            var i, tabcontent, tablinks;

            // Get all elements with class="tabcontent" and hide them
            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }

            // Get all elements with class="tablinks" and remove the class "active"
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }

            // Show the current tab, and add an "active" class to the button that opened the tab
            document.getElementById(tabName).style.display = "block";
            console.log(evt)
            evt.currentTarget.className += " active";
        }


        $scope.SubmitPan = function()
        {
            if(vm.panForm.$valid) {
                if($scope.kyc_update_flag == false){
                    kyc.save({ 'cid' : $scope.company_id, 'pan': $scope.kyc.pan },
                    function (success){
                        vm.successtoaster = {
                                            type:  'success', 
                                            title: 'Success',
                                            text:  'PAN Details added successfully.'
                                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $scope.kyc_update_flag = true;
                        $scope.kyc.id = success.id;
                    });
                }
                else{
                    kyc.patch({ 'cid' : $scope.company_id, 'pan': $scope.kyc.pan, "id" : $scope.kyc.id  },
                    function (success){
                        vm.successtoaster = {
                                            type:  'success', 
                                            title: 'Success',
                                            text:  'PAN Details updated successfully.'
                                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    });
                }
            }
            else{
                vm.panForm.pan.$dirty = true;
            }
        }
        $scope.company = {};
        
        //$scope.brand = {};
        //$scope.company.brand = [];

        $(document).ready(function () {
            setTimeout(() =>
            {
                console.log($("#defaultOpen"));
                $("#defaultOpen").click();
            }, 1000);
        });
          
        djangoAuth.profile().then(function(data)
        {
            $scope.user = data; 
            $scope.phone_number = data.userprofile.phone_number;
            $scope.email = data.userprofile.email;

            if(data.companyuser != null)
            {
                $scope.companyId = data.companyuser.company;
                if(data.companyuser.company_type ==="manufacturer")
                {
                $scope.manufacturer = true;
                $scope.nonmanufacturer = false;
                } 
                else
                {
                $scope.manufacturer = false;
                $scope.nonmanufacturer = true;
                }
                Company.get({id: $scope.companyId, 'expand': true}).$promise.then(function(result)
                {
                    
                    
                    $scope.company = result;
                    $scope.company.thumbnail1 = result.thumbnail;
                    $scope.company.thumbnail = null;

                    $scope.companyPhone = result.phone_number;
                    $scope.companyCountry = result.country;

                    $scope.company.street_address = result.address.street_address;
                    $scope.company.state = result.address.state.id;
                    $scope.company.city = result.address.city.id;
                    $scope.company.pincode = result.address.pincode;

                    vm.catArr = [];
                    
                    document.getElementById("connections_preapproved").checked = $scope.company.connections_preapproved;
                    document.getElementById("no_suppliers").checked = $scope.company.no_suppliers;
                    document.getElementById("have_salesmen").checked = $scope.company.have_salesmen;
                    document.getElementById("sell_all_received_catalogs").checked = $scope.company.sell_all_received_catalogs;
                    document.getElementById("sell_shared_catalogs").checked = $scope.company.sell_shared_catalogs;
                    vm.GetCity($scope.company.state);

                      
                  });
                  
                    //if(data.companyuser.brand_added_flag == "yes")
                    // removed brand_added_flag  checking because "Add my new brand" not working in company profile when no brand added
                    //{
                    //    $state.go('app.catalog');
                    /* Brand.query({mycompany: true}).$promise.then(function(result){
                        alert(JSON.stringify(result));
                        $scope.brandId  = result[0].id;
                        $scope.brand = result[0];
                        $scope.brand.image = result[0].image.full_size;
                        
                    });*/
                      vm.tempArrBrandsDeleted = [];

                     // $scope.compBrands = Brand.query({mycompany: "true"});
                      /*Brand.query({mycompany: true, cid:$scope.company_id}).$promise.then(function(result){
                           $scope.compBrands = result;
                           //$scope.brandId  = result[0].id;
                          // console.log($scope.brandId);
                       });*/
                      
                        $scope.addBrands = function()
                        {
                            //$scope.compBrands.length = $scope.compBrands.length +1;
                            var temp = new Brand;
                            $scope.compBrands.push(temp);
                        }
                        $scope.deleteBrand = function(index)
                        {
                            
                            var temp = $scope.compBrands[index];
                            if(temp.id != null)
                            {
                            Brand.delete({id:temp.id, cid:$scope.company_id}, function(data){
                                $scope.compBrands.splice(index, 1);
                            })
                            }
                            else
                            {
                            if($scope.compBrands[index].id != null)
                            {
                                //alert($scope.compBrands[index].id); 
                                vm.tempArrBrandsDeleted.push($scope.compBrands[index].id);
                            }
                            $scope.compBrands.splice(index, 1);
                            }
                        }
                    //}
                }
              
        });
          
          //$scope.brands = Brand.query({showall: true, cid:$scope.company_id});
          
        $scope.OpenOtpDialogForCompany = function () {
        $scope.otp = {};
        ngDialog.openConfirm({
            template: 'otpformforcompany',
            scope: $scope,
            className: 'ngdialog-theme-default',
            closeByDocument: false
        });
        };
        

        vm.SubmitCompany = function()
        {
            djangoAuth.profile().then(function(data){
                vm.updateCompany(data.companyuser.company);
            });
        };

        //    $scope.company.push_downstream = "yes";
        //    $scope.company.company_type = "nonmanufacturer";      
        vm.updateCompany = function(id)
        {
            $(".modelform").addClass(progressLoader()); 
            $scope.company.id = id;
        
            $scope.category = $('#tree_2').jstree('get_bottom_checked');
            
            vm.params = {"id" : $scope.company.id, "name":$scope.company.name,"street_address":$scope.company.street_address,"state": $scope.company.state,"city": $scope.company.city ,"pincode": $scope.company.pincode, 
                        "push_downstream": $scope.company.push_downstream, "company_type": $scope.company.company_type , "email":$scope.company.email, "category": $scope.category, 
                        "connections_preapproved": $scope.company.connections_preapproved, "no_suppliers": $scope.company.no_suppliers, "have_salesmen": $scope.company.have_salesmen, "sell_all_received_catalogs": $scope.company.sell_all_received_catalogs, 
                        "sell_shared_catalogs": $scope.company.sell_shared_catalogs, "buyers_assigned_to_salesman": $scope.company.buyers_assigned_to_salesman, "default_catalog_lifetime": $scope.company.default_catalog_lifetime };
            
            if($scope.company.thumbnail !=  null){
                vm.params["thumbnail"] = $scope.company.thumbnail
            }
            if(vm.params["pincode"] == null)
            {
                delete vm.params.pincode
            }
            /*if($scope.company.thumbnail ==  null)
            {
                vm.params = { "id" : $scope.company.id, "name":$scope.company.name,"street_address":$scope.company.street_address,"state": $scope.company.state,"city": $scope.company.city ,"pincode": $scope.company.pincode, 
                    "push_downstream": $scope.company.push_downstream, "company_type": $scope.company.company_type , "email":$scope.company.email, "category": $scope.category, 
                    "connections_preapproved": $scope.company.connections_preapproved, "no_suppliers": $scope.company.no_suppliers, "have_salesmen": $scope.company.have_salesmen, "sell_all_received_catalogs": $scope.company.sell_all_received_catalogs, "sell_shared_catalogs": $scope.company.sell_shared_catalogs };
            }
            else
            {
                vm.params = { "id" : $scope.company.id, "name":$scope.company.name,"street_address":$scope.company.street_address,"state": $scope.company.state,"city": $scope.company.city ,"pincode": $scope.company.pincode, 
                    "push_downstream": $scope.company.push_downstream, "company_type": $scope.company.company_type , "thumbnail": $scope.company.thumbnail,  "email":$scope.company.email, "category": $scope.category, 
                    "connections_preapproved": $scope.company.connections_preapproved, "no_suppliers": $scope.company.no_suppliers, "have_salesmen": $scope.company.have_salesmen, "sell_all_received_catalogs": $scope.company.sell_all_received_catalogs, "sell_shared_catalogs": $scope.company.sell_shared_catalogs };
            }*/

            Company.patch(vm.params,
                function(success){
                    if(success.company_type ==="manufacturer")
                    {
                        $scope.manufacturer = true;
                        $scope.nonmanufacturer = false;
                    } 
                    else
                    {
                        $scope.manufacturer = false;
                        $scope.nonmanufacturer = true;
                    }
                    $(".modelform").removeClass(progressLoader());
                    
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Company updated successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
            })

            if( $scope.company.phone_number != $scope.companyPhone || $scope.company.country != $scope.companyCountry )
            {
                Company.patch({"id" : $scope.company.id, "sub_resource":"phone_number", "phone_number":$scope.company.phone_number, "country":$scope.company.country},
                function(success){
                    $scope.OpenOtpDialogForCompany();
                    $(".modelform").removeClass(progressLoader());
                })
                
                /*$http
                    .post('api/registrationopt/', {phone_number: $scope.company.phone_number, country: $scope.company.country })
                    .then(function(response){
                            $scope.OpenOtpDialogForCompany();
                            $(".modelform").removeClass(progressLoader());
                    });*/
            }
        } 

          vm.UpdateCompanyWithPhone = function() {
            if(vm.otpFormForCompany.$valid) 
            {
                $(".modelformOtpForCompany").addClass(progressLoader());
                Company.patch({"id" : $scope.company.id, "sub_resource":"phone_number", "phone_number":$scope.company.phone_number, "country":$scope.company.country, "otp":$scope.company.otp},
                function(success){
                    $(".modelformOtpForCompany").removeClass(progressLoader());
                    ngDialog.close();
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Company updated successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                })
                
               
               /*$http
                  .post('api/checkotpandmobile/', {otp: $scope.company.otp, phone_number: $scope.company.phone_number, country: $scope.company.country  })
                  .then(function(response){
                        //alert(JSON.stringify(response));
                        if($scope.company.thumbnail ==  null)
                        {
                            vm.params = { "id" : $scope.company.id, "name":$scope.company.name,"street_address":$scope.company.street_address,"state": $scope.company.state,"city": $scope.company.city ,"pincode": $scope.company.pincode, 
                                  "push_downstream": $scope.company.push_downstream, "company_type": $scope.company.company_type , "email":$scope.company.email, "category": $scope.category, 
                                  "connections_preapproved": $scope.company.connections_preapproved, "no_suppliers": $scope.company.no_suppliers, "have_salesmen": $scope.company.have_salesmen, "sell_all_received_catalogs": $scope.company.sell_all_received_catalogs, "sell_shared_catalogs": $scope.company.sell_shared_catalogs, "phone_number": $scope.company.phone_number, "country": $scope.company.country };
                        }
                        else
                        {
                            vm.params = { "id" : $scope.company.id, "name":$scope.company.name,"street_address":$scope.company.street_address,"state": $scope.company.state,"city": $scope.company.city ,"pincode": $scope.company.pincode, 
                                  "push_downstream": $scope.company.push_downstream, "company_type": $scope.company.company_type , "thumbnail": $scope.company.thumbnail,  "email":$scope.company.email, "category": $scope.category, 
                                  "connections_preapproved": $scope.company.connections_preapproved, "no_suppliers": $scope.company.no_suppliers, "have_salesmen": $scope.company.have_salesmen, "sell_all_received_catalogs": $scope.company.sell_all_received_catalogs, "sell_shared_catalogs": $scope.company.sell_shared_catalogs, "phone_number": $scope.company.phone_number, "country": $scope.company.country };
                        }
                        Company.patch(vm.params,
                            function(success){
                                 if(success.company_type ==="manufacturer")
                                 {
                                    $scope.manufacturer = true;
                                    $scope.nonmanufacturer = false;
                                 } 
                                 else
                                 {
                                    $scope.manufacturer = false;
                                    $scope.nonmanufacturer = true;
                                 }
                                  $(".modelformOtpForCompany").removeClass(progressLoader());
                                  ngDialog.close();
                                  vm.successtoaster = {
                                      type:  'success',
                                      title: 'Success',
                                      text:  'Company updated successfully.'
                                  };
                                  toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            })

                    });*/
            }
            else {
                vm.otpFormForCompany.otp.$dirty = true;
            }
          }

 
          /*vm.submitBrand = function() {
              console.log(vm.tempArrBrandsDeleted.length);
              for(var i=0;i<$scope.compBrands.length;i++)
              {
                  if($scope.compBrands[i].id == undefined)
                  {
                    console.log($scope.compBrands[i].image_temp);
                      Brand.save({"cid":$scope.company_id, "name":$scope.compBrands[i].name, "company" : $scope.companyId, "image": $scope.compBrands[i].image_temp },
                      function(success){
                              Company.patch({ "id" : $scope.companyId, "brand_added_flag" : "yes"},
                                  function(success){
                             
                                        $(".modelform2").removeClass(progressLoader());
                                        
                                        vm.successtoaster = {
                                            type:  'success',
                                            title: 'Success',
                                            text:  'Brand i own is added successfully.'
                                        };
                                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                        
                                        SidebarLoader.getMenu;
                                //        $state.go('app.catalog',{ reload: true });
                                        location.reload();

                                  })                        
                        });

                  }
                  else 
                  {
                    console.log($scope.compBrands[i].image_temp);
                    if($scope.compBrands[i].image_temp != null)
                    {
                      $scope.params = {"cid":$scope.company_id, "id": $scope.compBrands[i].id, "name":$scope.compBrands[i].name, "company" : $scope.companyId, "image": $scope.compBrands[i].image_temp }
                    }
                    else
                    {
                      $scope.params = {"cid":$scope.company_id, "id": $scope.compBrands[i].id, "name":$scope.compBrands[i].name, "company" : $scope.companyId }          
                    }

                    Brand.patch($scope.params,
                      function(success){
                            $(".modelform").removeClass(progressLoader());
                            
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Brand updated successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            //$state.go('app.catalog');
                                               
                      });
                  }     
             }
             for(var i=0; i< vm.tempArrBrandsDeleted.length;i++)
              {
                Brand.delete({cid:$scope.company_id, id: vm.tempArrBrandsDeleted[i]})
                .$promise.then(function() {
              //    console.log("delete");
                  vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Brand deleted successfully.'
                            };
                  toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                })
              }
                   
          }; 

          vm.submitBrandDistributor = function (){
               BrandDistributor.query({company: $scope.companyId, cid:$scope.company_id}).$promise.then(function(bd){
                       //  alert(bd[0].brand);
                          if(bd.length == 0)
                          {
                            vm.createBrandDistributor();
                          }
                          else
                          {
                            $scope.BrandDistributorId = bd[0].id;
                            vm.updateBrandDistributor($scope.BrandDistributorId);
                          }
                    });
          }*/

          /*vm.createBrandDistributor = function (){
               BrandDistributor.save({"company" : $scope.companyId , "brand":$scope.company.brand, "cid":$scope.company_id},
                        function(success){

                                Company.patch({ "id" : $scope.companyId, "brand_added_flag" : "yes"},
                            function(success){
                               
                                 $(".modelform2").removeClass(progressLoader());
                                  vm.successtoaster = {
                                      type:  'success',
                                      title: 'Success',
                                      text:  'Brands I Sell added successfully.'
                                  };
                                  toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                  
                                  SidebarLoader.getMenu;
                                  $state.go('app.catalog',{ reload: true });
                                  location.reload();
                                  

                            }) 
                          
                        }); 
          }

          vm.updateBrandDistributor = function (id){
                $scope.BrandDistributorId = id;
               BrandDistributor.patch({"id":$scope.BrandDistributorId, "company" : $scope.companyId , "brand":$scope.company.brand, "cid":$scope.company_id},
                  function(success){
                        $(".modelform").removeClass(progressLoader());
                        
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Brands I Sell updated successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        
                  });   
          }*/
          
          
          
        $scope.openConfirm = function () {
            $scope.otp = {};
            ngDialog.openConfirm({
              template: 'otpform',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            });
        };

        $scope.OpenRemoveDialog = function () {
            ngDialog.open({
                template: 'removealias',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        $scope.OpenRuleDialog = function () {
            ngDialog.open({
                template: 'ruledialog',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        vm.CloseDialog = function() {
            ngDialog.close();
        };
        
        
        vm.SubmitPhoneNumberAlias = function() {
          if(vm.phoneNumberAliasForm.$valid) { 
             $(".modelform3").addClass(progressLoader());
             
              CompanyPhoneAlias.save({"cid":$scope.company_id, "country":vm.phonealias.country, "alias_number" : vm.phonealias.phone_number },
                      function(success){
                            $(".modelform3").removeClass(progressLoader());
                            
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Company phone alias added successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            vm.AliasId = success.id;
                            reloadData();
                            $scope.openConfirm();
                           // vm.phonealias.phone_number = null;
                      }/*,
                      function(error){
                          $(".modelform3").removeClass(progressLoader());
                            angular.forEach(error.data, function(value, key) {
                            vm.errortoaster = {
                                type:  'error',
                                title: toTitleCase(key),//'Failed',//
                                text:  value.toString()
                               };
                              toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                            })
                  }*/); 
          }
          else {
              vm.phoneNumberAliasForm.phone_number.$dirty = true;
              vm.phoneNumberAliasForm.country.$dirty = true;
          }    
        }

        vm.ApproveAlias = function () {
      //     console.log(vm.AliasId);
          if(vm.otpForm.$valid) {  
            $(".modelformOtp").addClass(progressLoader());
            
            CompanyPhoneAlias.patch({"id": vm.AliasId, "cid":$scope.company_id, "otp":$scope.otp.value}).$promise.then(function(result){
                vm.successtoaster = {
                    type:  'success',
                    title: 'Success',
                    text:  'Company phone alias approved successfully.'
                };
                $(".modelformOtp").removeClass(progressLoader());
                ngDialog.close();
                reloadData();
                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
            });
            
            /*$http
              .post('api/checkotpandalias/', {otp: $scope.otp.value, id: vm.AliasId })
              .then(function(response) {  
                     vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Company phone alias approved successfully.'
                    };
                    $(".modelformOtp").removeClass(progressLoader());
                    ngDialog.close();
                    reloadData();
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);

              }, function(error) {
                    $(".modelformOtp").removeClass(progressLoader());
                    angular.forEach(error.data, function(value, key) {
                      vm.errortoaster = {
                          type:  'error',
                          title: toTitleCase(key),//'Failed',//
                          text:  value.toString()
                         };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    })
              });*/
          }
          else {
              vm.otpForm.otp.$dirty = true;
          }    
        }

        $scope.ResendOtp = function(id) {
          CompanyPhoneAlias.patch({"id": id, "cid":$scope.company_id }).$promise.then(function(result){
                $scope.openConfirm();
                vm.AliasId = id;
                          
           //     console.log(result);
                /*$http
                  .post('api/registrationopt/', {phone_number: result.alias_number, country: result.country })
                  .then(function(response){
                          
                  }, function(error) {
                     $(".modelform").removeClass(progressLoader());
                    angular.forEach(error.data, function(value, key) {
                        
                      vm.errortoaster = {
                          type:  'error',
                          title: toTitleCase(key),//'Failed',//
                          text:  value.toString()
                         };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    })
                });*/
          });
        }

        $scope.OpenRemoveAlias = function(id){
            $scope.OpenRemoveDialog();
            vm.AliasId = id;
        }

        $scope.RemoveAlias = function(){
          $(".modelformremove").addClass(progressLoader());
           CompanyPhoneAlias.delete({'id': vm.AliasId, "cid":$scope.company_id},
              function(success){
                  
                  vm.successtoaster = {
                      type:  'success',
                      title: 'Success',
                      text:  'Company phone alias deleted successfully.'
                  };
                  $(".modelformremove").removeClass(progressLoader());
                  ngDialog.close();
                  reloadData();
                  toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
              }/*,
              function(error){
                  
                  angular.forEach(error.data, function(value, key) {
                      vm.errortoaster = {
                          type:  'error',
                          title: 'Failed',//toTitleCase(key),//
                          text:  value.toString()
                      };
                      toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                      $(".modelformremove").removeClass(progressLoader());
                  })
                  
              }*/);
        }
        
    /*    $scope.pricelist = {};
        $scope.pricelist.number_pricelists = 2;*/

        CompanyPricelist.query({"cid":$scope.company_id}).$promise.then(function(result){
            //    console.log(result[0]);
            if(result[0] != null)
            {
                $scope.pricelist = result[0];
                if($scope.pricelist.number_pricelists == 2)
                {
                  $scope.secondpricelist = true;
                  document.getElementById("second_pricelist").checked = true;
                }
            }
        });

        
        $scope.ChangePricelist = function(value){
            if( value == 2)
            {
              $scope.secondpricelist = true;
              document.getElementById("second_pricelist").checked = true;
            }
            else
            {
              $scope.secondpricelist = false;
            }
        }
        
        /*vm.SubmitBuyerSplit = function(){
            
            vm.params = {"id" : $scope.company.id, "buyers_assigned_to_salesman":$scope.company.buyers_assigned_to_salesman,"salesman_mapping":$scope.company.salesman_mapping};
            
            Company.patch(vm.params,
            function(success){
                 
                  vm.successtoaster = {
                      type:  'success',
                      title: 'Success',
                      text:  'Company updated successfully.'
                  };
                  toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
            })
            
        }*/

        vm.SubmitPricelist = function(){
            CompanyPricelist.query({"cid":$scope.company_id}).$promise.then(function(result){
                if(result[0] == null)
                {
                  vm.AddPricelist();
                }
                else
                {
                  vm.UpdatePricelist(result[0].id);
                }
            });
        }

        vm.AddPricelist = function(){
          if(vm.pricelistForm.$valid) { 
              $(".modelform4").addClass(progressLoader());
              if($scope.pricelist.number_pricelists == 2)
              {
                vm.params = {"cid":$scope.company_id, "number_pricelists":$scope.pricelist.number_pricelists, "pricelist2_multiplier" : $scope.pricelist.pricelist2_multiplier };
              }
              else
              {
                vm.params = {"cid":$scope.company_id, "number_pricelists":$scope.pricelist.number_pricelists}; 
              }
              CompanyPricelist.save(vm.params,
                      function(success){
                            $(".modelform4").removeClass(progressLoader());
                            
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Pricelist added successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            
                      }/*,
                      function(error){
                          $(".modelform4").removeClass(progressLoader());
                            angular.forEach(error.data, function(value, key) {
                            vm.errortoaster = {
                                type:  'error',
                                title: toTitleCase(key),//'Failed',//
                                text:  value.toString()
                               };
                              toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                            })
                  }*/); 
          }
          else {
              vm.pricelistForm.number_pricelists.$dirty = true;
          } 
        }

        vm.UpdatePricelist = function(id){
          if(vm.pricelistForm.$valid) { 
            $(".modelform4").addClass(progressLoader());
            if($scope.pricelist.number_pricelists == 2)
            {
              vm.params = {"cid":$scope.company_id, "id": id, "number_pricelists":$scope.pricelist.number_pricelists, "pricelist2_multiplier" : $scope.pricelist.pricelist2_multiplier };
            }
            else
            {
              vm.params = {"cid":$scope.company_id, "id": id, "number_pricelists":$scope.pricelist.number_pricelists}; 
            }
            CompanyPricelist.patch(vm.params,
                      function(success){
                            $(".modelform4").removeClass(progressLoader());
                            
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Pricelist updated successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            
                      }/*,
                      function(error){
                          $(".modelform4").removeClass(progressLoader());
                            angular.forEach(error.data, function(value, key) {
                            vm.errortoaster = {
                                type:  'error',
                                title: toTitleCase(key),//'Failed',//
                                text:  value.toString()
                               };
                              toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                            })
                  }*/); 
          }
          else {
              vm.pricelistForm.number_pricelists.$dirty = true;
          } 
        }

        $scope.EditRule = function(id){
          $scope.pricelists = CompanyPricelist.query({"cid":$scope.company_id});
          $scope.groupType = grouptype.query();
          CompanyBuyergroupRule.get({"id": id, "cid":$scope.company_id}).$promise.then(function(result){
              $scope.OpenRuleDialog();
              $scope.buyergrouprule = result;
          });
        }
        
        vm.SubmitRule = function(id) {
            
            CompanyBuyergroupRule.patch({"id": id, "cid":$scope.company_id, "buyer_type":$scope.buyergrouprule.buyer_type, "price_list":$scope.buyergrouprule.price_list, "payment_duration":$scope.buyergrouprule.payment_duration, "discount":$scope.buyergrouprule.discount, "cash_discount":$scope.buyergrouprule.cash_discount},
              function(success){
                    $(".modelform4").removeClass(progressLoader());
                    
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Group type updated successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    ngDialog.close();
                    
              });
            
        };



        vm.count = 1;
        vm.dtInstance = {};
        vm.dtInstance2 = {};
       
        function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);
        }

        function reloadDataOfBuyerGroups() {
            var resetPaging = false;
            vm.dtInstance2.reloadData(callback, resetPaging);
        }

        function callback(json) {
           // console.log(json);
            if(json.recordsTotal > 0 && json.data.length == 0){
                //vm.dtInstance.rerender();
                $state.go($state.current, {}, {reload: true});
            }
        }
        
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/companyphonealiasdatatables1/',
                            type: 'GET',
                            
                        })
                        
                        .withOption('createdRow', function(row, data, dataIndex) {
                            // Recompiling so we can bind Angular directive to the DT
                            $compile(angular.element(row).contents())($scope);
                        })
                        .withOption('headerCallback', function(header) {
                            if (!vm.headerCompiled) {
                                // Use this headerCompiled field to only compile header once
                                vm.headerCompiled = true;
                                $compile(angular.element(header).contents())($scope);
                            }
                        })
                        .withOption('fnPreDrawCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                            vm.count = vm.count+1;
                            //alert(JSON.stringify(vm.selected));
                            if((vm.count%2) == 0)
                            {
                                vm.selected = {};
                                vm.selectAll = false;
                                //alert(JSON.stringify(vm.selected));
                            }
                            return true;
                        })
                        
                        .withDataProp('data')
                   
        /*                .withColReorder()
                        // Set order
                        //.withColReorderOrder([0, 2, 1, 3, 4, 5, 6, 7])
                        //.withColReorderOption('iFixedColumnsRight', 1)
                        .withColReorderOption('iFixedColumnsLeft', 1)
                        .withColReorderCallback(function() {
                            console.log('Columns order has been changed with: ' + this.fnOrder());
                        })*/
                        
                        .withOption('processing', true)
                        .withOption('serverSide', true)
                        .withOption('iDisplayLength', 10)
                        //.withOption('responsive', true)
                        .withOption('scrollX', true)
                        .withOption('scrollY', getDataTableHeight())
                        .withOption('scrollCollapse', true)
                        .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
                        
                        .withPaginationType('full_numbers');

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle('ID').notVisible(),          
            DTColumnDefBuilder.newColumnDef(1).withTitle('Phone.'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Status'),

            DTColumnDefBuilder.newColumnDef(3).withTitle('Action').notSortable()
                .renderWith(function(data, type, full, meta) {
                   // alert(full[7]);
                    //vm.selected[full[0]] = false;
                    //return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                    if(full[2] == 'Approved')      
                    {
                        return '<div class="col-md-4"><button type="button" ng-click="OpenRemoveAlias('+full[0]+')" class="btn btn-block btn-danger ">Remove</button></div>';
                    }
                    else
                    {
                        return '<div class="col-md-4"><button type="button" ng-click="ResendOtp('+full[0]+')" class="btn btn-block btn-primary ">Resend OTP</button></div><div class="col-md-4"><button type="button" ng-click="OpenRemoveAlias('+full[0]+')" class="btn btn-block btn-danger">Remove</button></div>';
                    }
                })
        ];



        vm.dtOptions2 = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/companybuyergroupdatatables1/',
                            type: 'GET',
                            
                        })
                        
                        .withOption('createdRow', function(row, data, dataIndex) {
                            // Recompiling so we can bind Angular directive to the DT
                            $compile(angular.element(row).contents())($scope);
                        })
                        .withOption('headerCallback', function(header) {
                            if (!vm.headerCompiled) {
                                // Use this headerCompiled field to only compile header once
                                vm.headerCompiled = true;
                                $compile(angular.element(header).contents())($scope);
                            }
                        })
                        .withOption('fnPreDrawCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                            vm.count = vm.count+1;
                            //alert(JSON.stringify(vm.selected));
                            if((vm.count%2) == 0)
                            {
                                vm.selected = {};
                                vm.selectAll = false;
                                //alert(JSON.stringify(vm.selected));
                            }
                            return true;
                        })
                        
                        .withDataProp('data')
                   
        /*                .withColReorder()
                        // Set order
                        //.withColReorderOrder([0, 2, 1, 3, 4, 5, 6, 7])
                        //.withColReorderOption('iFixedColumnsRight', 1)
                        .withColReorderOption('iFixedColumnsLeft', 1)
                        .withColReorderCallback(function() {
                            console.log('Columns order has been changed with: ' + this.fnOrder());
                        })*/
                        
                        .withOption('processing', true)
                        .withOption('serverSide', true)
                        .withOption('iDisplayLength', 10)
                        //.withOption('responsive', true)
                        .withOption('scrollX', true)
                        .withOption('scrollY', getDataTableHeight())
                        .withOption('scrollCollapse', true)
                        .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
                        
                        .withPaginationType('full_numbers');

        vm.dtColumnDefs2 = [
            DTColumnDefBuilder.newColumnDef(0).withTitle('ID').notVisible(),          
            DTColumnDefBuilder.newColumnDef(1).withTitle('Buyer Group.'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Applicable Pricing'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Payment Duration'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Credit Discount'),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Cash Discount'),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Action').notSortable()
                .renderWith(function(data, type, full, meta) {
                   
                    return '<div class="col-md-10"><button type="button" ng-click="EditRule('+full[0]+')" class="btn btn-block btn-primary">Edit</button></div>';
                   
                })
        ];
        
  

    }
})();
