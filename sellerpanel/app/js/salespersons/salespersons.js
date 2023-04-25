(function() {
    'use strict';

    angular
        .module('app.salespersons')
        .controller('SalespersonslistController', SalespersonslistController);

    SalespersonslistController.$inject = ['$resource', '$filter', '$http', '$scope', 'Users', 'Country', 'AssignGroups', 'BuyerSegmentation', 'Company', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', 'BuyerList'];
    function SalespersonslistController($resource, $filter, $http, $scope, Users, Country, AssignGroups, BuyerSegmentation, Company, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, BuyerList) {
        CheckAuthenticated.check();
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
      
        var vm = this;
        $scope.update_flag = false;
        $scope.company_id = localStorage.getItem('company');

        UpdateCheckBoxUI();
        
        var buttons = [{
                            text: 'Add Salesperson',
                            key: '1',
                            className: 'green',
                            action: function (e, dt, node, config) {
                                vm.salesperson = {};
                                vm.salesperson.userprofile = {};
                                $scope.update_flag = false;
                                vm.OpenAddSalesperson();
                            }
                        },
                        {
                            text: 'Update Salesperson',
                            key: '1',
                            className: 'green',
                            action: function (e, dt, node, config) {
                                vm.salesperson = {};
                                vm.salesperson.userprofile = {};
                                $scope.update_flag = true;
                                vm.OpenUpdateSalesperson();
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
                                localStorage.removeItem('DataTables_' + 'salespersons-datatables');
                                $state.go($state.current, {}, {reload: true});
                              }
                        },
                    
                    ];
        
        Company.get({id: $scope.company_id}).$promise.then(function(result) {
			if(result.buyers_assigned_to_salesman == true){
				buttons.push({
                            text: 'Assign Groups',
                            key: '1',
                            className: 'orange',
                            action: function (e, dt, node, config) {
                                vm.OpenAssignGroups();
                            }
                        });
			}
		});
        
        /*buttons.push('copy',
                    'print',
                    'excel'
                    );*/
        
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
        
        vm.AddSalesperson = function () {
            vm.salesperson.groups = [2];
            
            if(vm.addSalespersonForm.$valid) {
                console.log(vm.salesperson);
                $(".modelform").addClass(progressLoader()); 
                if (vm.salesperson.email == null || vm.salesperson.email == "") 
                {
                    vm.salesperson.email = vm.salesperson.userprofile.phone_number+'@wishbooks.io';
                }
                //alert(JSON.stringify(vm.salesperson));
                Users.save(vm.salesperson,
                    function(success){
                            $(".modelform").removeClass(progressLoader());
                            ngDialog.close();
                            vm.successtoaster = {
                                type:  'success', 
                                title: 'Success',
                                text:  'Salesperson added successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            reloadData();
                      },
                  function(error){
                        $(".modelform").removeClass(progressLoader());
                        
                        vm.addSalespersonForm.email.$unq = false;
                        vm.addSalespersonForm.username.$unq = false;
                        if(error.data.email){
                            if(error.data.email[0] == "This field must be unique."){
                                vm.addSalespersonForm.email.$unq = true;
                                $(".sp-email").addClass("ng-dirty ng-invalid");
                                $(".sp-email").removeClass("ng-valid");
                                //console.log("test" + error.data.email[0]);
                            }
                        }
                        else
                        {
                            $(".sp-email").addClass("ng-valid")
                        }

                        if(error.data.username){
                            if(error.data.username[0] == "Username is already taken."){
                                vm.addSalespersonForm.username.$unq = true;
                                $(".sp-username").addClass("ng-dirty ng-invalid");
                                $(".sp-username").removeClass("ng-valid");
                                //console.log("test" + error.data.username[0]);
                            }
                        }
                        else
                        {
                            $(".sp-username").addClass("ng-valid");
                        }
                        angular.forEach(error.data, function(value, key) {

                            if(key=='userprofile')
                            {   console.log(value);
                                angular.forEach(value, function(value, key) {
                                    vm.errortoaster = {
                                        type:  'error',
                                        title: toTitleCase(key),
                                        text:  value.toString()
                                    };
                                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                                    console.log(value);
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
              vm.addSalespersonForm.phone_number.$dirty = true;
              vm.addSalespersonForm.password.$dirty = true;
            }
        };
        
        vm.OpenUpdateSalesperson = function (){
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
                    vm.salesperson = result;
                    vm.salesperson.userprofile = result.userprofile;
                    vm.salesperson.deputed_to = result.companyuser.deputed_to;
                    $scope.userId = result.id;
                    
                    vm.OpenAddSalesperson();
                });
              }
              else   
              {
                    vm.errortoaster = {
                        type:  'error',
                        title: 'Failed',//toTitleCase(key),//
                        text:  "Please select one row"
                    };
                    //toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);

                    $.notify({
                        title: "Failed",
                        message: "Please select one row",
                    },
                        {
                            type: 'info',
                            placement: {
                                from: 'bottom',
                                align: 'right'
                            }
                        });

                    setTimeout(function () {
                        $('.uk-notify').fadeout();
                    }, 1000);
              } 
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
              vm.addSalespersonForm.username.$dirty = true;
              vm.addSalespersonForm.first_name.$dirty = true;
              vm.addSalespersonForm.last_name.$dirty = true;
              vm.addSalespersonForm.email.$dirty = true;
              //vm.addSalespersonForm.alternate_email.$dirty = true;
              
              if ($scope.update_flag == false){
                vm.addSalespersonForm.phone_number.$dirty = true;
                vm.addSalespersonForm.password.$dirty = true;
              }
            }
        };
        
        $scope.SubmitSalesPerson = function() {
            if($scope.update_flag)
            {
                vm.UpdateSalesperson();
            }
            else
            {
                vm.AddSalesperson();
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
                //toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);


                $.notify({
                    title: "Failed",
                    message: "Please select one row",
                },
                    {
                        type: 'info',
                        placement: {
                            from: 'bottom',
                            align: 'right'
                        }
                    });

                setTimeout(function () {
                    $('.uk-notify').fadeout();
                }, 1000);
            
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
        
        
        $scope.OpenAssignGroupsDialog = function () {
            ngDialog.open({
                template: 'assigngroupsform',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        vm.OpenAssignGroups = function (){
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                    $scope.userId = key;
                }
            })
            
            if(true_count > 0)
            {
                $scope.assigngroups = {}
                $scope.groups = BuyerSegmentation.query({"cid":$scope.company_id});
                AssignGroups.query({"user":$scope.userId},
                    function (success){
                        $scope.assigngroups.groups = success[0].groups;
                    }
                );
                
                $scope.OpenAssignGroupsDialog();
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
        
        $scope.AssignGroup = function () {
            
            if(vm.assignGroups.$valid) {
                $(".modelform2").addClass(progressLoader()); 
                
                AssignGroups.save({user:$scope.userId, groups:$scope.assigngroups.groups},
                    function(success){
                            $(".modelform2").removeClass(progressLoader());
                            ngDialog.close();
                            vm.successtoaster = {
                                type:  'success', 
                                title: 'Success',
                                text:  'Groups assigned successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            reloadData();
                      });
            }
            else {
               // alert("eee")
              vm.assignGroups.groups.$dirty = true;
            }
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
        
        function TitleLink(data, type, full, meta){
          return '<a href="#/app/salesperson-detail/?id='+full[0]+'&name='+full[2]+'">'+full[2]+'</a>';
        }
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('ajax', {
                        url: 'api/salespersondatatables1/',
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
                        2 : { "type" : "text"},
                        3 : { "type" : "text", width: '100%'},
                        4 : { "type" : "text"},
                        5 : { "type" : "select", values:[{"value":"Approved","label":"Approved"}, {"value":"Pending","label":"Pending"}]},
                        6 : { "type" : "text"},
                        7 : { "type" : "text"},
                    })
                    
                    .withButtons(buttons)
                    
                    .withOption('processing', true)
                    .withOption('serverSide', true)
                    
                    .withOption('stateSave', true)
                    .withOption('stateSaveCallback', function(settings, data) {
                          data = datatablesStateSaveCallback(data);
                          localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));
                      })
                      .withOption('stateLoadCallback', function(settings) {
                         return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance ))
                      })
                      
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
                   // return '<input type="radio" name="salesperson" value="' + full[0] + '" ng-model="showCase.selected[' + full[0] + ']"  ng-click="showCase.toggleOne(showCase.selected)" >';
                }),
            DTColumnDefBuilder.newColumnDef(1).withTitle('Company'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Username').renderWith(TitleLink),
            DTColumnDefBuilder.newColumnDef(3).withTitle('First Name'),
            //DTColumnDefBuilder.newColumnDef(3).withTitle('Last Name'),
            //DTColumnDefBuilder.newColumnDef(4).withTitle('Email'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Phone No.'),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Approval Status'),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Deputed To'),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Assigned Groups').notSortable(),
            DTColumnDefBuilder.newColumnDef(8).withTitle('Todays Meetings').notSortable(),
            DTColumnDefBuilder.newColumnDef(9).withTitle('This Week Meetings').notSortable(),
           /* DTColumnDefBuilder.newColumnDef(8).withTitle('Map').notSortable()
            .renderWith(function(data, type, full, meta) {
                //return '<div><button type="button" ng-click="MapView('+full[0]+')" class="btn btn-primary mt-lg">Map View</button></div>';
                return '<div><a class="btn btn-default mt-lg" href="#/app/map/'+full[0]+'/'+full[2]+'">Meeting</a></div><div><a class="btn btn-primary mt-lg" href="#/app/attendance/'+full[0]+'/'+full[2]+'">Attendance</a></div>';
            }),  */
       
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

        $(document).ready(function () {
            setTimeout(function () {
                var paginationbuttons = document.getElementsByClassName('paging_full_numbers')
                var i = paginationbuttons.length;
                while (i--) {
                    paginationbuttons[i].addEventListener("click", function () {
                        UpdateCheckBoxUI();
                    });
                }
                var tableheaders = document.getElementsByTagName('th');
                var j = tableheaders.length;
                while (j--) {
                    tableheaders[j].addEventListener("click", function () {
                        UpdateCheckBoxUI();
                    });
                    tableheaders[j].addEventListener("keydown", function () {
                        UpdateCheckBoxUI();
                    });
                }
                console.log('UpdateCheckBoxUI() attached')

            }, 3000);
        });
   
    }
})();
