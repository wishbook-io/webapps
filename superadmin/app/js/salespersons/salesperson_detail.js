(function() {
    'use strict';

   // angular.module('tabsDemoDynamicHeight', ['ngMaterial']);
 //  angular.module('app.material',['ngMaterial']);
    angular
        .module('app.salespersons')
        .controller('SalespersonDetailController', SalespersonDetailController);

    SalespersonDetailController.$inject = ['$resource', 'Meeting', 'SalesmanMeetings', 'Users', 'BuyerList', 'Country', 'ngDialog', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', '$stateParams', 'SweetAlert'];
    function SalespersonDetailController($resource, Meeting, SalesmanMeetings, Users, BuyerList, Country, ngDialog, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, $filter, $stateParams, SweetAlert) {
        CheckAuthenticated.check();        
        
        var vm = this;
        $scope.company_id = localStorage.getItem('company'); 

      //  $scope.reports = Meeting.query({id:"report",});
        $scope.reports = SalesmanMeetings.query({id: $stateParams.id });

         Users.get({'id': $stateParams.id }).$promise.then(function(result){

                    vm.salesperson = result;
                    /*vm.salesperson.userprofile = result.userprofile;
                    vm.salesperson.deputed_to = result.companyuser.deputed_to;
                    $scope.userId = result.id; */
                    console.log(result);
        });

        vm.OpenDialog = function () {
            ngDialog.open({
                template: 'addsalesperson',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        vm.CloseDialog = function() {
            ngDialog.close();
        };
        
        vm.OpenAddSalesperson = function (){
            vm.OpenDialog();
            Country.query().$promise.then(function(success){
                $scope.countries = success;
                vm.salesperson.userprofile.country = 1;
            });
            BuyerList.query({'cid':$scope.company_id}).$promise.then(function(success){
                $scope.buyers = success;
            });
        }

        vm.OpenUpdateSalesperson = function (){
        
            Users.get({'id': $stateParams.id}).$promise.then(function(result){
                vm.salesperson = result;
                vm.salesperson.userprofile = result.userprofile;
                vm.salesperson.deputed_to = result.companyuser.deputed_to;
                $scope.userId = result.id;
                
                vm.OpenAddSalesperson();
            });
              
        };

          vm.UpdateSalesperson = function () {
            vm.salesperson.groups = [2];
            
            if(vm.addSalespersonForm.$valid) {
                console.log(vm.salesperson);
                $(".modelform").addClass(progressLoader()); 
                if (vm.salesperson.email == null || vm.salesperson.email == "") 
                {
                    vm.salesperson.email = vm.salesperson.userprofile.phone_number+'@wishbooks.io';
                }
                if (vm.salesperson.deputed_to == null || vm.salesperson.deputed_to == "") 
                {
                    delete vm.salesperson.deputed_to;
                }
                //alert(JSON.stringify(vm.salesperson));
                vm.id = $scope.userId;
                Users.patch(vm.salesperson,
                    function(success){
                            $(".modelform").removeClass(progressLoader());
                            ngDialog.close();
                            vm.successtoaster = {
                                type:  'success', 
                                title: 'Success',
                                text:  'Salesperson updated successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                           // reloadData();
                      },
                  function(error){
                        $(".modelform").removeClass(progressLoader());
                        angular.forEach(error.data, function(value, key) {
                            if(key=='userprofile')
                            {
                                angular.forEach(value, function(value, key) {
                                    vm.errortoaster = {
                                        type:  'error',
                                        title: toTitleCase(key),
                                        text:  value.toString()
                                    };
                                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                                });
                            }
                        })
                });
            }
            else {
              vm.addSalespersonForm.username.$dirty = true;
              vm.addSalespersonForm.first_name.$dirty = true;
              vm.addSalespersonForm.last_name.$dirty = true;
              vm.addSalespersonForm.email.$dirty = true;
              //vm.addSalespersonForm.alternate_email.$dirty = true;
              
              /*if ($scope.update_flag == false){
                vm.addSalespersonForm.phone_number.$dirty = true;
                vm.addSalespersonForm.password.$dirty = true;
              } */
            }
        };


        $scope.attendanceMap = function(){
             $scope.templateURL = 'app/views/salespersons/attendance.html';
          
        }

        $scope.salesordersDatatable = function(){
             $scope.templateURL = 'app/views/salespersons/salesorders.html';
          
        }
        
    }
})();
