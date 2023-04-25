(function() {
    'use strict';

    angular
        .module('app.administrators')
        .controller('AdministratorslistController', AdministratorslistController);

    AdministratorslistController.$inject = ['$resource', '$filter', '$http', '$scope', 'Users', 'Country', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated'];
    function AdministratorslistController($resource, $filter, $http, $scope, Users, Country, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated) {
        CheckAuthenticated.check();
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
      
        var vm = this;
        $scope.update_flag = false;
        
        vm.OpenDialog = function () {
            ngDialog.open({
                template: 'addadmin',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        vm.CloseDialog = function() {
            ngDialog.close();
        };

        vm.OpenAddAdmin = function (){
            vm.OpenDialog();
            Country.query().$promise.then(function(success){
                $scope.countries = success;
                vm.admin.userprofile.country = 1;
            });
        }

        
        vm.AddAdmin= function () {
            vm.admin.groups = [1];
            if(vm.addAdminForm.$valid) {
                $(".modelform").addClass(progressLoader()); 
                if (vm.admin.email == null || vm.admin.email == "") 
                {
                    vm.admin.email = vm.admin.userprofile.phone_number+'@wishbooks.io';
                }
                Users.save(vm.admin,
                    function(success){
                            $(".modelform").removeClass(progressLoader());
                            ngDialog.close();
                            vm.successtoaster = {
                                type:  'success', 
                                title: 'Success',
                                text:  'Admin added successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            reloadData();
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
              vm.addAdminForm.username.$dirty = true;
              vm.addAdminForm.first_name.$dirty = true;
              vm.addAdminForm.last_name.$dirty = true;
              vm.addAdminForm.email.$dirty = true;
              vm.addAdminForm.phone_number.$dirty = true;
              vm.addAdminForm.password.$dirty = true;
            }
        };
        
        vm.OpenUpdateAdmin = function (){
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })
            
            if(true_count == 1)
            {
                
                Users.get({'id': vm.true_key}).$promise.then(function(result){
                    vm.admin = result;
                    vm.admin.userprofile = result.userprofile;
                    $scope.userId = result.id;
                    
                    vm.OpenAddAdmin();
                });
              }
              else   
              {
                vm.errortoaster = {
                    type:  'error',
                    title: 'Failed',//toTitleCase(key),//
                    text:  "Please select one row"
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
              } 
        };
        
        vm.UpdateAdmin = function () {
            vm.admin.groups = [1];
            if(vm.addAdminForm.$valid) {
                $(".modelform").addClass(progressLoader()); 
                if (vm.admin.email == null || vm.admin.email == "") 
                {
                    vm.admin.email = vm.admin.userprofile.phone_number+'@wishbooks.io';
                }
                vm.id = $scope.userId
                Users.patch(vm.admin,
                    function(success){
                            $(".modelform").removeClass(progressLoader());
                            ngDialog.close();
                            vm.successtoaster = {
                                type:  'success', 
                                title: 'Success',
                                text:  'Admin updated successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            reloadData();
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
              vm.addAdminForm.username.$dirty = true;
              vm.addAdminForm.first_name.$dirty = true;
              vm.addAdminForm.last_name.$dirty = true;
              vm.addAdminForm.email.$dirty = true;
              
              if ($scope.update_flag == false){
                vm.addAdminForm.phone_number.$dirty = true;
                vm.addAdminForm.password.$dirty = true;
              }
            }
        };
        
        $scope.SubmitAdmin = function() {
            if($scope.update_flag)
            {
                vm.UpdateAdmin();
            }
            else
            {
                vm.AddAdmin();
            }
        }
        
        
        
        
        $scope.OpenStatusDialog = function () {
            ngDialog.open({
                template: 'updatestatus',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        $scope.toUpdate = [];
        vm.OpenUpdateStatus = function (){
            $scope.toUpdate = [];
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                    $scope.toUpdate.push(vm.true_key);
                }
            })
            
            if(true_count > 0)
            {
                console.log($scope.toUpdate);
                $scope.OpenStatusDialog();
            }
            else   
            {
                vm.errortoaster = {
                    type:  'error',
                    title: 'Failed',
                    text:  "Please select one row"
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
            }
              
        };
        
        $scope.userstatus = {};
        
        $scope.UpdateStatus = function (){

            $(".modelform2").addClass(progressLoader()); 
            angular.forEach($scope.toUpdate, function(userId) {
                  
                //Users.patch({"id":userId, "is_active": $scope.userstatus.status},
                Users.patch({"id":userId, "userprofile":{"user_approval_status": $scope.userstatus.status}},
                    function(success){
                            $(".modelform2").removeClass(progressLoader());
                            ngDialog.close();
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Status updated successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            reloadData();
                            $scope.userstatus = {};
                });

             })
        };

        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};
        
        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
        
        function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);
        }

        function callback(json) {
            console.log(json);
            if(json.recordsTotal > 0 && json.data.length == 0){
                //vm.dtInstance.rerender();
                $state.go($state.current, {}, {reload: true});
            }
        }
        
        function imageHtml(data, type, full, meta){
          return '<img src="'+full[3]+'" style="width: 100px; height: 100px"/>';
        }
        
        function filterDate (row, data, full, meta) {
          return $filter('date')(row, 'yyyy-MM-dd')+" : "+$filter('date')(row, 'h: mm a');
        }
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/adminisratordatatables1/',
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
                        .withLightColumnFilter({
                            1 : { "type" : "text"},
                            2 : { "type" : "text", width: '100%'},
                            3 : { "type" : "text"},
                            4 : { "type" : "text"},
                            5 : { "type" : "text"},
                            6 : { "type" : "select", values:[{"value":"Approved","label":"Approved"}, {"value":"Pending","label":"Pending"}]},
                        })
                        
                        .withButtons([
                            {
                                text: 'Add Admin',
                                key: '1',
                                className: 'green',
                                action: function (e, dt, node, config) {
                                    vm.admin = {};
                                    vm.admin.userprofile = {};
                                    $scope.update_flag = false;
                                    vm.OpenAddAdmin();
                                }
                            },
                            {
                                text: 'Update Admin',
                                key: '1',
                                className: 'green',
                                action: function (e, dt, node, config) {
                                    vm.admin = {};
                                    vm.admin.userprofile = {};
                                    $scope.update_flag = true;
                                    vm.OpenUpdateAdmin();
                                }
                            },
                            {
                                text: 'Update Status',
                                key: '1',
                                className: 'orange',
                                action: function (e, dt, node, config) {
                                    vm.OpenUpdateStatus();
                                }
                            },
                            {
                                  text: 'Reset Filter',
                                  key: '1',
                                  className: 'green',
                                  action: function (e, dt, node, config) {
                                    //localStorage.removeItem('DataTables_' + 'products-datatables');
                                    $state.go($state.current, {}, {reload: true});
                                  }
                            },
                            'copy',
                            'print',
                            'excel'
                        ])
                        
                        .withOption('processing', true)
                        .withOption('serverSide', true)
                        .withOption('iDisplayLength', 10)
                        //.withOption('responsive', true)
                        .withOption('scrollX', true)
                        .withOption('scrollY', getDataTableHeight())
                        //.withOption('scrollCollapse', true)
                        .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
                        
                        .withPaginationType('full_numbers');

                        vm.dtColumnDefs = [
                            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
                                .renderWith(function(data, type, full, meta) {
                                    vm.selected[full[0]] = false;
                                    return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                                }),
                            DTColumnDefBuilder.newColumnDef(1).withTitle('Username'),
                            DTColumnDefBuilder.newColumnDef(2).withTitle('First Name'),
                            DTColumnDefBuilder.newColumnDef(3).withTitle('Last Name'),
                            DTColumnDefBuilder.newColumnDef(4).withTitle('Email'),
                            DTColumnDefBuilder.newColumnDef(5).withTitle('Phone No.'),
                            DTColumnDefBuilder.newColumnDef(6).withTitle('Approval Status'),
                       
                        ];
        
        function toggleAll (selectAll, selectedItems) {
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    selectedItems[id] = selectAll;
                }
            }
        }
        
        function toggleOne (selectedItems) {
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    if(!selectedItems[id]) {
                        vm.selectAll = false;
                        return;
                    }
                }
            }
            vm.selectAll = true;
        }
   
    }
})();
