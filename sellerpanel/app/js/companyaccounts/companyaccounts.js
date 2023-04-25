(function() {
    'use strict';

    angular
        .module('app.companyaccounts')
        .controller('CompanyAccountController', CompanyAccountController);

    CompanyAccountController.$inject = ['$resource', 'ngDialog', 'Company', 'CompanyAccount', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', 'Upload'];
    function CompanyAccountController($resource, ngDialog, Company, CompanyAccount, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, Upload) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        
        $scope.uploadFiles = function (files) {
			$scope.file = files;
			console.log($scope.file);
        };
        
		vm.UploadCompanyAccountCsv = function() {
            if(vm.uploadcsv.$valid) {
			$(".modelform3").addClass(progressLoader());
			
			Upload.upload({
				url: 'api/v1/importcsvcompanymap/',
				headers: {
				  'optional-header': 'header-value'
				},
				data: {"companymap_csv":$scope.file}
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
					download: 'companymap_error.csv'
				    })[0].click();

				    anchor.remove(); // Clean it up afterwards
					
					vm.successtoaster = {
						type:  'warning',
						title: 'Warning',
						text:  'File uploaded successfully and please fix issues found on companymap_error.csv'
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
                vm.uploadcsv.companymap_csv.$dirty = true;
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
        
        vm.CloseDialog = function() {
            ngDialog.close();
        };
        
        
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        $scope.update_flag = false;
        
        $scope.OpenDialog = function () {
            ngDialog.open({
                template: 'addmapping',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        vm.CloseDialog = function() {
            ngDialog.close();
        };
        
        $scope.mapping = {};
        vm.AddAccountMapping = function() {
            if(vm.mappingForm.$valid) {
                $(".modelform").addClass(progressLoader());
       //         alert(JSON.stringify($scope.buyer));
				CompanyAccount.save({buyer_company:$scope.mapping.company, mapped_accout_ref:$scope.mapping.mapped_accout_ref},
                function(success){
                    $(".modelform").removeClass(progressLoader());
                    
                    ngDialog.close();
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Accounting Mapping added successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    reloadData();
                });
            }
            else
            {
                vm.mappingForm.company.$dirty = true;
                vm.mappingForm.buyername.$dirty = true;
            }
        };
        
        vm.OpenAddAccountMapping = function() {
            $scope.OpenDialog();
            $scope.company = Company.query({sub_resource:"dropdown", relation_type:"buyer_suppliers"});
        };
        
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
                            url: 'api/companyaccountdatatables/',
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
                                text: 'Add Account Mapping',
                                key: '1',
                                className: 'green',
                                action: function (e, dt, node, config) {
                                    $scope.mapping = {};
                                    vm.OpenAddAccountMapping();
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
            DTColumnDefBuilder.newColumnDef(1).withTitle('Company Name'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Mapped Account'),
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
