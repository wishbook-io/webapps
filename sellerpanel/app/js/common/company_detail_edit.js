
(function() {
    'use strict';

    angular
        .module('app.salesorders')
        .controller('CompanyDetailEditController', CompanyDetailEditController);

    CompanyDetailEditController.$inject = ['$resource', '$filter', '$scope', 'Company', 'LastShippingAddress', 'Address', 'BankDetails', 'kyc', 'State', 'City', 'Country', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', '$cookies', '$localStorage'];
    function CompanyDetailEditController($resource, $filter,  $scope, Company, LastShippingAddress, Address, BankDetails, kyc, State, City, Country, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, $cookies, $localStorage) {
        
        CheckAuthenticated.check();
     
        
        var vm = this;
        vm.states = State.query();
          
        vm.GetCity =  function(state) { 
            vm.cities = City.query({ state: state });
        }
        $scope.company = {};
        $scope.address = {};
        $scope.editmode = false;
        Country.query().$promise.then(function(success){
                $scope.countries = success;
                $scope.company.country  = 1;
        });  

        $scope.company_id = 0;
        if(localStorage.hasOwnProperty("company")){
            $scope.company_id = localStorage.getItem('company');
        }
        
        $scope.address_update_flag = true;
        Company.get({"id":$scope.companyId, "expand":"true"},
        function (success){
            $scope.company = success;
            if(success.address){
                $scope.address = success.address;
                $scope.address_update_flag = true;
            }
            else{
                $scope.address_update_flag = false;
            }
            vm.GetCity($scope.company.state);

            //$(".modelform6").removeClass(progressLoader()); 
        });
        
        $scope.last_shipping_address = "";
        $scope.show_last_shipping_add = false;
        LastShippingAddress.get({company: $scope.companyId }, function(success){
            console.log(success);
            if(success.address_id != null){
                Address.get({'id': success.address_id}, function(data){
                    console.log(data);
                    if(data.street_address){
                        $scope.last_shipping_address = $scope.last_shipping_address + data.street_address +", "; 
                    }
                    if(data.city.city_name){
                        $scope.last_shipping_address = $scope.last_shipping_address + data.city.city_name +", "; 
                    }
                    if(data.state.state_name){
                        $scope.last_shipping_address = $scope.last_shipping_address + data.state.state_name +", "; 
                    }
                    if(data.country.name){
                        $scope.last_shipping_address = $scope.last_shipping_address + data.country.name +", "; 
                    }
                    if(data.pincode){
                        $scope.last_shipping_address = $scope.last_shipping_address + data.pincode; 
                    }
                    $scope.show_last_shipping_add = true;
                    console.log($scope.last_shipping_address);
                });
            }
        });
        $scope.bankdetails_added = "No";
        BankDetails.query({'cid': $scope.companyId, 'company': $scope.companyId }, function(success){
                  console.log(success);
                  if(success.length > 0){
                    $scope.bankdetails_added = "Yes";
                  }
                  else
                  {
                    $scope.bankdetails_added = "No";
                  }
        });
        $scope.gstdetails_added = "No";
        kyc.query({'cid': $scope.companyId, 'company': $scope.companyId }, function(success){
                  console.log(success);
                  if(success.length > 0){
                        if(success[0].gstin != null){
                            $scope.gstdetails_added = "Yes";
                        }
                        else{
                            $scope.gstdetails_added = "No";     
                        }
                  }
                  else
                  {
                    $scope.gstdetails_added = "No";
                  }
        });

        $scope.submitCompanyDetails = function(){
            $(".modelform").addClass(progressLoader());
            Company.patch({"id":$scope.companyId, 'name': $scope.company.name, 'email': $scope.company.email, 'country': $scope.company.country, 'phone_number': $scope.company.phone_number, 'cod_verified': $scope.company.cod_verified },
            function (success){
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Company details updated successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    
                    if($scope.address_update_flag){
                        Address.patch({'id': $scope.address.id, 'street_address': $scope.address.street_address, 'state': $scope.address.state.id, 'city': $scope.address.city.id, 'pincode': $scope.address.pincode},function(data){
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Address updated successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            ngDialog.close();
                        });
                    }
                    else
                    {
                        Address.save({'company': $scope.companyId, 'street_address': $scope.address.street_address, 'state': $scope.address.state.id, 'city': $scope.address.city.id, 'pincode': $scope.address.pincode},function(data){
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Address saved successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            ngDialog.close();
                        });

                    }
                

                $(".modelform").removeClass(progressLoader()); 
            });
        
        }
    }
})();
