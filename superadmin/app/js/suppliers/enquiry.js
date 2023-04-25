(function() {
    'use strict';

    angular
        .module('app.supplierenquiry')
        .controller('SupplierEnquirylistController', SupplierEnquirylistController);

    SupplierEnquirylistController.$inject = ['$http', '$resource', '$scope', 'toaster', 'grouptype', 'Company', 'BuyerList', 'Suppliers', 'Country', 'ngDialog', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', 'Upload', 'resendsupplier', '$cookies', '$localStorage'];
    function SupplierEnquirylistController($http, $resource,  $scope, toaster, grouptype, Company, BuyerList, Suppliers, Country, ngDialog,  DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, Upload, resendsupplier, $cookies, $localStorage) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
        
        vm.CloseDialog = function() {
            ngDialog.close();
        };
        
        $scope.buyer = {};
        
        $scope.OpenFillReferenceDialog = function () {
            ngDialog.open({
                template: 'fillreference',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        $scope.buyerId = null
        
        $scope.OpenFillReference = function(id){
            Suppliers.get({'id': id, 'cid':$scope.company_id}).$promise.then(function(result){
                $scope.buyerId = result.id;
                $scope.buyer = result;
                $scope.OpenFillReferenceDialog();
            });
            
        };

        $scope.openCreateOrderConfirm = function () {
            ngDialog.openConfirm({
              template: 'createbulkpurchaseorder',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            })
        };

        $scope.enquired_catalog_id = null;
        $scope.enquired_buying_company_id = null;
        $scope.CreatePurchaseOrder = function (catalog_id,selling_company_id) {
            console.log(catalog_id);
            $scope.enquired_catalog_id = catalog_id;
            $scope.enquired_selling_company_id = selling_company_id;
            $scope.openCreateOrderConfirm();
        }
        
        $scope.FillReference = function (){
            $(".modelform2").addClass(progressLoader()); 
            
            var json_details = $scope.buyer.details;
            json_details = json_details.replace(/'/g, '"');
            json_details = JSON.parse(json_details);
            
            var details = {'catalog':json_details.catalog, 'references':$scope.buyer.references};// 'transfer_id':$scope.buyer.details.transfer_id,
            console.log(details);
            Suppliers.patch({'id': $scope.buyerId, 'cid':$scope.company_id, 'details':details, 'status': 'References Filled'}).$promise.then(function(result){
                $(".modelform2").removeClass(progressLoader());
                ngDialog.close();
                vm.successtoaster = {
                    type:  'success',
                    title: 'Success',
                    text:  'Buyer updated successfully.'
                };
                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                reloadData();
                $scope.buyer = {};
            });
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
          return '<img src="'+full[8]+'" style="width: 100px; height: 100px"/>';
        }
        
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/sellerenquirydatatables1/',
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
                            1 : { "type" : "text", width: '100%'},
                            2 : { "type" : "text"},
                            3 : { "type" : "text"},
                            //4 : { "type" : "text"},
                            4 : { "type" : "text"},
                            5 : { "type" : "text"},
                            6 : { "type" : "dateRange", width: '100%'},
                            7 : { "type" : "select", values:[{"value":"buyer_registrationpending","label":"Buyer Registration Pending"}, {"value":"buyer_pending","label":"Buyer Pending"}, {"value":"supplier_pending","label":"Supplier Pending"}, {"value":"approved","label":"Approved"}, {"value":"rejected","label":"Rejected"}, {"value":"Pending References","label":"Pending References"}, {"value":"Transferred","label":"Transferred"}, {"value":"References Filled","label":"References Filled"}]},
                        })
                        
                        .withOption('processing', true)
                        .withOption('serverSide', true)
                        //.withOption('aLengthMenu', [[10, 50, 100, -1], [10, 50, 100, "All"]])
                        .withOption('iDisplayLength', 10)
                        //.withOption('responsive', true)
                        .withOption('scrollX', true)
                        .withOption('scrollY', getDataTableHeight())
                        //.withOption('scrollCollapse', true)
                        .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
                        
                        .withPaginationType('full_numbers')
                        .withButtons([
                            //'columnsToggle',
                            //'colvis',.
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
                            
                        ]);
            
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
            .renderWith(function(data, type, full, meta) {
                vm.selected[full[0]] = false;
                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
            }),
            
            DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
            
            DTColumnDefBuilder.newColumnDef(2).withTitle('State'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('City'),
            //DTColumnDefBuilder.newColumnDef(4).withTitle('Category'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Phone Number'),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Type').notVisible(),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Date'),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Status'),
            DTColumnDefBuilder.newColumnDef(8).withTitle('Image').renderWith(imageHtml).notSortable(),
            DTColumnDefBuilder.newColumnDef(9).withTitle('Catalog').notSortable(),
            DTColumnDefBuilder.newColumnDef(10).withTitle('Action').notSortable()//.withOption('width', '25%')
                .renderWith(function(data, type, full, meta) {
                    var htmlbutton = ''
                    
                    if(full[7] == 'Pending References')
                    {
                        htmlbutton += '<div><button type="button" ng-click="OpenFillReference('+full[0]+')" class="btn btn-block btn-primary">Fill Reference</button></div>';
                    }
                    else{
                        htmlbutton += '<div style="padding-bottom: 7%;" ><a href="#" target="_self" class="applozic-launcher btn btn-default mt-lg" data-mck-id="'+full[10]['selling_company_chat_user']+'" data-mck-name="'+full[10]['selling_company_name']+'">Chat With Supplier</a></div>';
                    }

                    if(full[7] == 'Approved')
                    {
                        htmlbutton += '<div><button type="button" ng-click="CreatePurchaseOrder('+full[10]['catalog_id']+','+full[10]['selling_company']+')" class="btn btn-block btn-primary">Create Purchase Order</button></div>';
                    }
                    
                    if(htmlbutton == '')
                        return '&nbsp;';
                    else
                        return htmlbutton;
                }) 
            
            
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
