(function() {
    'use strict';

    angular
        .module('app.inventory')
        .controller('warehouseController', warehouseController);

    warehouseController.$inject = ['$resource', 'SyncOICSV', 'Warehouse', 'Inventory', 'SupplierList', 'User', 'Brand', 'Catalog', 'ngDialog', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', 'Upload'];
    function warehouseController($resource, SyncOICSV, Warehouse, Inventory, SupplierList, User, Brand, Catalog, ngDialog, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, Upload) {
        CheckAuthenticated.check();
        
        var vm = this;
		
		$scope.company_id = localStorage.getItem('company');
		$scope.update_flag = false;
		
		$scope.OpenAddDialog = function () {
            ngDialog.openConfirm({
              template: 'adddialogform',
              scope: $scope,
              className: 'ngdialog-theme-default',
			  closeByDocument: false
            })
        };
        
        vm.CloseDialog = function() {
            ngDialog.close();
        };
        
		vm.openAddForm = function() {
			$scope.suppliers = SupplierList.query({'cid':$scope.company_id});
			$scope.salespersons = User.query({id:'dropdown', type:'salesperson'});
			$scope.OpenAddDialog();
        };
        
        vm.openUpdateForm = function() {
              var true_count = 0;
			  angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
              })
            
              if(true_count == 1)
              {
                Warehouse.get({'id': vm.true_key}).$promise.then(function(result){
					$scope.form = result;
					
					vm.openAddForm();
					
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
        
        vm.Add = function() {
			$(".modelform").addClass(progressLoader());
			Warehouse.save($scope.form,
			function(success){
				$(".modelform").removeClass(progressLoader());
				
				ngDialog.close();
				vm.successtoaster = {
					type:  'success',
					title: 'Success',
					text:  'Warehouse added successfully.'
				};
				toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
				
				reloadData();
			});
		
        };
        
        vm.Update = function() {
			$(".modelform").addClass(progressLoader());
			//console.log($scope.form);
			Warehouse.patch($scope.form,
			function(success){
				$(".modelform").removeClass(progressLoader());
				
				ngDialog.close();
				vm.successtoaster = {
					type:  'success',
					title: 'Success',
					text:  'Warehouse updated successfully.'
				};
				toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
				
				reloadData();
			});
		
        };
        
        vm.SubmitForm = function() {
			if(vm.addForm.$valid) {
				if($scope.update_flag)
				{
					vm.Update();
				}
				else
				{
					vm.Add();
				}
			}
			else
			{
				vm.addForm.name.$dirty = true;
				vm.addForm.supplier.$dirty = true;
				vm.addForm.salesmen.$dirty = true;
				
			}
		};
        
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        $scope.update_flag = false;
        
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
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/warehousedatatables/',
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
                            3 : { "type" : "text"},
                            4 : { "type" : "text"},
                        })
                        
                        .withOption('processing', true)
                        .withOption('serverSide', true)
                        .withOption('iDisplayLength', 10)
                        //.withOption('responsive', true)
                        .withOption('scrollX', true)
                        .withOption('scrollY', getDataTableHeight())
                        //.withOption('scrollCollapse', true)
                        .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
                        
                        .withPaginationType('full_numbers')
                        
                        .withButtons([
                            {
                                text: 'Add Warehouse',
                                key: '1',
                                className: 'green',
                                action: function (e, dt, node, config) {
                                    $scope.update_flag = false;
                                    $scope.form = {};
                                    vm.openAddForm();
                                }
                            },
                            {
                                text: 'Update Warehouse',
                                key: '1',
                                className: 'orange',
                                action: function (e, dt, node, config) {
                                    $scope.update_flag = true;
                                    $scope.form = {}
                                    vm.openUpdateForm();
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
                            'excel',
                            
                        ]);
            
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
            .renderWith(function(data, type, full, meta) {
                vm.selected[full[0]] = false;
                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
            }),
            DTColumnDefBuilder.newColumnDef(1).withTitle('Company'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Name'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Dedicated Suppliers').notSortable(),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Assigned Salesmen').notSortable(),
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
