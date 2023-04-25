(function() {
    'use strict';

    angular
        .module('app.inventory')
        .controller('inventoryController', inventoryController);

    inventoryController.$inject = ['$resource', 'SyncOICSV', 'Warehouse', 'Inventory', 'InventoryAdjustment', 'Product', 'Brand', 'Catalog', 'ngDialog', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', 'Upload'];
    function inventoryController($resource, SyncOICSV, Warehouse, Inventory, InventoryAdjustment, Product, Brand, Catalog, ngDialog, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, Upload) {
        CheckAuthenticated.check();
        
        var vm = this;
		
	$scope.company_id = localStorage.getItem('company');
        
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
        
        $scope.update_flag = false;
        
        $scope.form = {}
	$scope.inventory = {}
	$scope.formatDate = function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }
        
        vm.AddInventory = function() {
		
			$(".modelform").addClass(progressLoader());
			
			var todayDate = $scope.formatDate(new Date())
			//Inventory.save($scope.form,
			var iajson = {date:todayDate, remark:"", inventoryadjustmentqty_set:[{quantity:$scope.form.in_stock, adjustment_type:"Add", product:$scope.form.product}]} //warehouse:$scope.form.warehouse, 
			InventoryAdjustment.save(iajson,
			function(success){
				$(".modelform").removeClass(progressLoader());
				
				ngDialog.close();
				vm.successtoaster = {
					type:  'success',
					title: 'Success',
					text:  'Inventory added successfully.'
				};
				toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
				
				reloadData();
			});
		
        };
        
        vm.UpdateInventory = function() {
		
			$(".modelform").addClass(progressLoader());
			
			Inventory.patch({"id":$scope.inventory_id ,"in_stock":$scope.form.in_stock},//, "warehouse":$scope.form.warehouse, "product":$scope.form.product
			function(success){
				$(".modelform").removeClass(progressLoader());
				
				ngDialog.close();
				vm.successtoaster = {
					type:  'success',
					title: 'Success',
					text:  'Inventory updated successfully.'
				};
				toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
				
				reloadData();
			},
			function(error){
				$(".modelform").removeClass(progressLoader());
				
				angular.forEach(error.data, function(value, key) {
					vm.errortoaster = {
						type:  'error',
						title: 'Failed',//toTitleCase(key),//
						text:  value.toString()
					};
					toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
				})
				
			});
		
        };
        
        vm.SubmitInventory = function() {
	    if(vm.addForm.$valid) {
		//vm.AddInventory();
		if($scope.update_flag)
		{
			vm.UpdateInventory();
		}
		else
		{
			vm.AddInventory();
		}
	    }
	    else
	    {
		vm.addForm.in_stock.$dirty = true;
		
		if($scope.update_flag == false){
		    //vm.addForm.warehouse.$dirty = true;
		    vm.addForm.product.$dirty = true;
		    vm.addForm.brand.$dirty = true;
		    vm.addForm.catalog.$dirty = true;
		}
	    }
	};
        
        $scope.OpenDialog = function () {
            ngDialog.openConfirm({
              template: 'addinventory',
              scope: $scope,
              className: 'ngdialog-theme-default',
	      closeByDocument: false
            })
        };
        
        
        vm.CloseDialog = function() {
            ngDialog.close();
        };
        
	$scope.GetCatalog =  function(brand) { 
	   $scope.catalogs = Catalog.query({brand:brand, cid:$scope.company_id, id:"dropdown"});
	}
	
	$scope.GetProduct =  function(catalog) { 
	   $scope.productList = Product.query({id:"dropdown", catalog:catalog});
	}
	
        vm.addInventory = function() {
              //$scope.productList = Product.query({id:"dropdown"});
              //$scope.warehouseList = Warehouse.query();
	      $scope.brands = Brand.query({cid:$scope.company_id, sub_resource:"dropdown"});
              $scope.OpenDialog();
        };
	
	$scope.OpenUpdateDialog = function () {
            ngDialog.openConfirm({
              template: 'updateinventory',
              scope: $scope,
              className: 'ngdialog-theme-default',
	      closeByDocument: false
            })
        };
        
        vm.updateInventory = function() {
              var true_count = 0;
			  angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
              })
            
              if(true_count == 1)
              {
                Inventory.get({'id': vm.true_key}).$promise.then(function(result){
					$scope.form.in_stock = result.in_stock;
					//$scope.form.warehouse = result.warehouse;
					$scope.form.product = result.product;
					
					$scope.inventory_id = result.id;
					
					//$scope.productList = Product.query({id:"dropdown"});
					//$scope.warehouseList = Warehouse.query();
					$scope.OpenUpdateDialog();
					//vm.addInventory();
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
        
        /*$scope.uploadFiles = function (files) {
	    $scope.file = files;
	    console.log($scope.file);
        };
        
	vm.UploadInventoryCsv = function() {
	    if($scope.inventory.inventory_path == null){
		//alert("in null");
	    
	    
		if(vm.uploadcsv.$valid) {
	    //	alert("ok");
		    $(".modelform3").addClass(progressLoader());
		    
		    Upload.upload({
			    url: $scope.upload_url+"?warehouse="+$scope.inventory.warehouse, //'api/v1/importcsvopeninginventory/',
			    headers: {
			      'optional-header': 'header-value'
			    },
			    data: {"inventory_csv":$scope.file}
		    }).then(function (response) {
			    
			    var headers = response.headers();
			    //alert(headers['content-type']);
			    
			    if(headers['content-type'] == "text/csv"){
				    
				    
				    //alert(hiddenElement);
				    
				    var anchor = angular.element('<a/>');
				    anchor.css({display: 'none'}); // Make sure it's not visible
				    angular.element(document.body).append(anchor); // Attach to document

				    anchor.attr({
					href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response.data),
					target: '_blank',
					download: 'inventory_error.csv'
				    })[0].click();

				    anchor.remove(); // Clean it up afterwards
				    
				    vm.successtoaster = {
					    type:  'warning',
					    title: 'Warning',
					    text:  'File uploaded successfully and please fix issues found on inventory_error.csv and reupload'
				    };
			    }
			    else{
				    vm.successtoaster = {
					    type:  'success',
					    title: 'Success',
					    text:  'File uploaded successfully'
				    };
			    }
			    
			    $(".modelform3").removeClass(progressLoader());
			    ngDialog.close();
			    
			    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
			    reloadData();
		    });
		    
		}
		else
		{
		    vm.uploadcsv.warehouse.$dirty = true;
		}
	    }
	    else{
		$(".modelform3").addClass(progressLoader());
		
		SyncOICSV.save({"inventory_path":$scope.inventory.inventory_path},
		function(success){
			$(".modelform3").removeClass(progressLoader());
			
			ngDialog.close();
			vm.successtoaster = {
				type:  'success',
				title: 'Success',
				text:  'Successfully sync csv.'
			};
			toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
			
			reloadData();
		});
	    }

	};
        
        vm.CsvDialog = function () {
            ngDialog.open({
                template: 'uploadcsv',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        vm.OpenUploadCsv = function() {
	    $scope.warehouseList = Warehouse.query();
            vm.CsvDialog();
        };*/
        
        /*vm.CsvAdjustmentDialog = function () {
            ngDialog.open({
                template: 'uploadadjustmentcsv',
                scope: $scope,
                className: 'ngdialog-theme-default'
            });
        };
        
        vm.OpenUploadAdjustmentCsv = function() {
            vm.CsvAdjustmentDialog();
        };*/
        
        
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
                            url: 'api/inventorydatatables1/',
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
                            5 : { "type" : "text"},
                            6 : { "type" : "text"},
                            7 : { "type" : "text"},
                            8 : { "type" : "text"},
                            9 : { "type" : "text"},
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
                                text: 'Add Inventory',
                                key: '1',
                                className: 'green',
                                action: function (e, dt, node, config) {
                                    $scope.update_flag = false;
                                    $scope.form = {};
				    $scope.brands = [];
				    $scope.catalogs = [];
				    $scope.productList = [];
                                    vm.addInventory();
                                }
                            },
                            {
                                text: 'Update Inventory',
                                key: '1',
                                className: 'orange',
                                action: function (e, dt, node, config) {
                                    $scope.update_flag = true;
                                    $scope.form = {}
                                    vm.updateInventory();
                                }
                            },
                            /*{
                                text: 'Upload Opening Inventory',
                                key: '1',
                                className: 'blue',
                                action: function (e, dt, node, config) {
                                    $scope.file = null;
				    $scope.inventory = {};
                                    $scope.upload_for = "opening"
                                    $scope.upload_url = 'api/v1/importcsvopeninginventory/';
                                    vm.OpenUploadCsv();
                                }
                            },
                            {
                                text: 'Upload Adjustment Inventory',
                                key: '1',
                                className: 'blue',
                                action: function (e, dt, node, config) {
                                    $scope.file = null;
				    $scope.inventory = {};
                                    $scope.upload_for = "adjustment"
                                    $scope.upload_url = 'api/v1/importcsvadjustmentinventory/';
                                    //vm.OpenUploadAdjustmentCsv();
                                    vm.OpenUploadCsv();
                                }
                            },*/
                            /*{
                                text: 'Delete',
                                key: '1',
                                className: 'red',
                                action: function (e, dt, node, config) {
                                
                                    vm.DeleteProduct();
                                }
                            },*/
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
            DTColumnDefBuilder.newColumnDef(1).withTitle('Warehouse').notVisible(),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Brand'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Catalog'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('SKU'),
            DTColumnDefBuilder.newColumnDef(5).withTitle('In Stock'),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Available'),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Blocked'),
            DTColumnDefBuilder.newColumnDef(8).withTitle('Open Sale'),
            DTColumnDefBuilder.newColumnDef(9).withTitle('Open Purchase'),
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
