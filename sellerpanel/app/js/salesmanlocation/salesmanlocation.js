(function() {
    'use strict';

    angular
        .module('app.salesmanlocation')
        .controller('SalesmanLocationController', SalesmanLocationController);
	
    SalesmanLocationController.$inject = ['$resource', '$filter', '$http', '$scope', 'Users', 'State', 'City', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', 'SalesmanLocation', 'Company'];
    function SalesmanLocationController($resource, $filter, $http, $scope, Users, State, City, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, SalesmanLocation, Company) {
        CheckAuthenticated.check();
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
		
        var vm = this;
        $scope.update_flag = false;
        $scope.company_id = localStorage.getItem('company');
        
        var buttons = []
        
		Company.get({id: $scope.company_id}).$promise.then(function(result) {
			if(result.buyers_assigned_to_salesman == true && result.salesman_mapping == "Location"){
				buttons.push({
                            text: 'Assign Location',
                            key: '1',
                            className: 'green',
                            action: function (e, dt, node, config) {
                                vm.assignlocation = {};
                                $scope.update_flag = false;
                                vm.OpenAssignLocation();
                            }
                        },
                        {
                            text: 'Update Assigned Location',
                            key: '1',
                            className: 'green',
                            action: function (e, dt, node, config) {
                                vm.assignlocation = {};
                                $scope.update_flag = true;
                                vm.OpenUpdateAssignLocation();
                            }
                        });
			}
		});
		
        vm.OpenDialog = function () {
            ngDialog.open({
                template: 'assignlocation',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        vm.CloseDialog = function() {
            ngDialog.close();
        };
        
        vm.OpenAssignLocation = function (){
            
            $scope.users = Users.query({type:"salesperson"});
            $scope.states = State.query();
            
            //$scope.cities = City.query({ state: state });
            if($scope.update_flag == true){
				var stateids = vm.assignlocation.state.toString();
				$scope.cities = City.query({state:stateids});
			}else{
				$scope.cities = []; //City.query();
			}
			
			vm.OpenDialog();
            
        }
        
        $scope.GetCity =  function() { 
			var stateids = vm.assignlocation.state.toString();
			//alert(stateids);
			if(stateids != ""){
				$scope.cities = City.query({state:stateids});
			}
			else{
				$scope.cities = [];
				vm.assignlocation.city = [];
			}
		}
        
        vm.AddAssignLocation = function () {
            
            if(vm.assignlocationform.$valid) {
                console.log(vm.assignlocation);
                $(".modelform").addClass(progressLoader()); 
                
                SalesmanLocation.save(vm.assignlocation,
                    function(success){
                            $(".modelform").removeClass(progressLoader());
                            ngDialog.close();
                            vm.successtoaster = {
                                type:  'success', 
                                title: 'Success',
                                text:  'Salesman location added successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            reloadData();
                      });
            }
            else {
              vm.assignlocationform.salesman.$dirty = true;
              vm.assignlocationform.state.$dirty = true;
              vm.assignlocationform.city.$dirty = true;
            }
        };
        
        vm.OpenUpdateAssignLocation = function (){
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })
            
            if(true_count == 1)
            {
                SalesmanLocation.get({'id': vm.true_key}).$promise.then(function(result){
                    vm.assignlocation = result;
                    $scope.pkid = result.id;
                    
                    vm.OpenAssignLocation();
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
        
        vm.UpdateAssignLocation = function () {
            
            if(vm.assignlocationform.$valid) {
                console.log(vm.assignlocation);
                $(".modelform").addClass(progressLoader()); 
                
                vm.id = $scope.pkid;
                SalesmanLocation.patch(vm.assignlocation,
                    function(success){
                            $(".modelform").removeClass(progressLoader());
                            ngDialog.close();
                            vm.successtoaster = {
                                type:  'success', 
                                title: 'Success',
                                text:  'Salesman location updated successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            reloadData();
                });
            }
            else {
              vm.assignlocationform.salesman.$dirty = true;
              vm.assignlocationform.state.$dirty = true;
              vm.assignlocationform.city.$dirty = true;
            }
        };
        
        $scope.SubmitAssignLocation = function() {
            if($scope.update_flag)
            {
                vm.UpdateAssignLocation();
            }
            else
            {
                vm.AddAssignLocation();
            }
        }
        
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
        
        buttons.push('print');
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('ajax', {
                        url: 'api/salesmanlocationdatatables/',
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
                    })
                    
                    .withButtons(buttons)
                    
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
            DTColumnDefBuilder.newColumnDef(1).withTitle('Salesman'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Assigned Location'),
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
