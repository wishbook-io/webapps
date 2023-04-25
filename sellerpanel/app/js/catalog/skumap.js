(function() {
    'use strict';

    angular
        .module('app.skumap')
        .controller('skumapController', skumapController);

    skumapController.$inject = ['$resource', 'AppInstance', 'Skumap', 'Product', 'ngDialog', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', 'Upload', 'SweetAlert'];
    function skumapController($resource, AppInstance, Skumap, Product, ngDialog, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, Upload, SweetAlert) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
        
        /*vm.OpenAddBuyer = function() {
            $scope.OpenDialog();
            $scope.groupType = grouptype.query();
            Country.query().$promise.then(function(success){
                $scope.countries = success.data;
                $scope.buyer.country = 1;
            });
        };*/
        
        $scope.update_flag = false;
        
        $scope.form = {}
        
        vm.AddSkuMap = function() {
		
			$(".modelform").addClass(progressLoader());
			
			Skumap.save($scope.form,
			function(success){
				$(".modelform").removeClass(progressLoader());
				
				ngDialog.close();
				vm.successtoaster = {
					type:  'success',
					title: 'Success',
					text:  'Skumap added successfully.'
				};
				toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
				
				reloadData();
			});
		
        };
        
        vm.UpdateSkuMap = function() {
		
			$(".modelform").addClass(progressLoader());
			
			Skumap.patch({"id":$scope.skumap_id ,"external_sku":$scope.form.external_sku, "app_instance":$scope.form.app_instance, "product":$scope.form.product},
			function(success){
				$(".modelform").removeClass(progressLoader());
				
				ngDialog.close();
				vm.successtoaster = {
					type:  'success',
					title: 'Success',
					text:  'Skumap updated successfully.'
				};
				toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
				
				reloadData();
			});
		
        };
        
        vm.SubmitSkuMap = function() {
			if(vm.addSkuMapForm.$valid) {
				if($scope.update_flag)
				{
					vm.UpdateSkuMap();
				}
				else
				{
					vm.AddSkuMap();
				}
			}
            else
            {
                vm.addSkuMapForm.external_sku.$dirty = true;
                vm.addSkuMapForm.app_instance.$dirty = true;
                vm.addSkuMapForm.product.$dirty = true;
            }
		};
        
        $scope.OpenDialog = function () {
            ngDialog.openConfirm({
              template: 'addskumap',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            })
        };
        
        
        vm.CloseDialog = function() {
            ngDialog.close();
        };
        
        vm.addForm = function() {
              $scope.productList = Product.query({id:"dropdown"});
              $scope.appInstanceList = AppInstance.query();
              $scope.OpenDialog();
        };
        
        vm.updateForm = function() {
              var true_count = 0;
			  angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
              })
            
              if(true_count == 1)
              {
                Skumap.get({'id': vm.true_key}).$promise.then(function(result){
					$scope.form.external_sku = result.external_sku;
					$scope.form.app_instance = result.app_instance;
					$scope.form.product = result.product;
					
					$scope.skumap_id = result.id;
					
					vm.addForm();
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
        
        $scope.uploadFiles = function (files) {
			$scope.file = files;
			console.log($scope.file);
        };
        
		vm.UploadSKUMapCsv = function() {
            if(vm.uploadcsv.$valid) {
			$(".modelform3").addClass(progressLoader());
			
			Upload.upload({
				url: 'api/v1/importcsvskumap/',
				headers: {
				  'optional-header': 'header-value'
				},
				data: {"skumap_csv":$scope.file}
			}).then(function (response) {
				/*var uri = 'data:application/csv;charset=UTF-8,' + encodeURIComponent(response.data);
				window.open(uri, 'buyer_error.csv');*/
				var headers = response.headers();
				//alert(headers['content-type']);
				
				if(headers['content-type'] == "text/csv"){
					/*var hiddenElement = document.createElement('a');

					hiddenElement.href = 'data:attachment/csv,' + encodeURI(response.data);
					hiddenElement.target = '_blank';
					hiddenElement.download = 'skumap_error.csv';
					hiddenElement.click();*/
                    
                    var anchor = angular.element('<a/>');
				    anchor.css({display: 'none'}); // Make sure it's not visible
				    angular.element(document.body).append(anchor); // Attach to document

				    anchor.attr({
					href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response.data),
					target: '_blank',
					download: 'skumap_error.csv'
				    })[0].click();

				    anchor.remove(); // Clean it up afterwards
					
					vm.successtoaster = {
						type:  'warning',
						title: 'Warning',
						text:  'File uploaded successfully and please fix issues found on skumap_error.csv'
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
                vm.uploadcsv.skumap_csv.$dirty = true;
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
            vm.CsvDialog();
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
        
        
        vm.DeleteSkumap = function (){
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })
            
            if(true_count > 0)
            {
                SweetAlert.swal({   
                  title: 'Are you sure?',   
                  text: 'Your will not be able to recover!',   
                  type: 'warning',   
                  showCancelButton: true,   
                  confirmButtonColor: '#DD6B55',   
                  confirmButtonText: 'Yes, delete it!',   
                  cancelButtonText: 'No, cancel it!',   
                  closeOnConfirm: true,   
                  closeOnCancel: true 
                }, function(isConfirm){  
                  if (isConfirm) {
                    angular.forEach(vm.selected, function(value, key) {
                        if(value==true){
                            $(".modelform3").addClass(progressLoader());
                            Skumap.delete({'id':key},
                            function(success){
                                $(".modelform3").removeClass(progressLoader());
                                //$scope.dtInstance.reloadData();
                                vm.successtoaster = {
                                    type:  'success',
                                    title: 'Success',
                                    text:  'Skumap deleted successfully.'
                                };
                                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                reloadData();
                            });
                        }
                    })
                    //SweetAlert.swal('Deleted!', 'Selected rows has been deleted.', 'success');   
                  }
                });
                
            }
            else
            {
                vm.errortoaster = {
                    type:  'error',
                    title: 'Failed',
                    text:  'Please select one row'
                };
                
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
            }
        } 
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/skumapdatatables1/',
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
                                text: 'Add SKU-Map',
                                key: '1',
                                className: 'green',
                                action: function (e, dt, node, config) {
                                    $scope.update_flag = false;
                                    $scope.form = {}
                                    vm.addForm();
                                }
                            },
                            {
                                text: 'Update SKU-Map',
                                key: '1',
                                className: 'orange',
                                action: function (e, dt, node, config) {
                                    $scope.update_flag = true;
                                    $scope.form = {}
                                    vm.updateForm();
                                }
                            },
                            {
                                text: 'Upload CSV',
                                key: '1',
                                className: 'blue',
                                action: function (e, dt, node, config) {
                                    
                                    vm.OpenUploadCsv();
                                }
                            },
                            {
                                text: 'Delete',
                                key: '1',
                                className: 'red',
                                action: function (e, dt, node, config) {
                                
                                    vm.DeleteSkumap();
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
            DTColumnDefBuilder.newColumnDef(1).withTitle('Product SKU'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Maped SKU'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Catalog Title'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Maped Catalog'),
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
