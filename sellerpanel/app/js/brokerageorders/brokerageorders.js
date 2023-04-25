/*start - form wizard */
(function() {
    'use strict';
    angular
        .module('app.brokerageorders')
        .directive('formWizard', formWizard);

         formWizard.$inject = ['$parse'];
   
    function formWizard ($parse) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: true
        };
        return directive;

        function link(scope, element, attrs) {
          var validate = $parse(attrs.validateSteps)(scope),
              wiz = new Wizard(attrs.steps, !!validate, element);
          scope.wizard = wiz.init();
        }

        function Wizard (quantity, validate, element) {
          
          var self = this;
          self.quantity = parseInt(quantity,10);
          self.validate = validate;
          self.element = element;
          
          self.init = function() {
            self.createsteps(self.quantity);
            self.go(1); // always start at fist step
            return self;
          };

          self.go = function(step) {
            
            if ( angular.isDefined(self.steps[step]) ) {

              if(self.validate && step !== 1) {
                var form = $(self.element),
                    group = form.children().children('div').get(step - 2);

                if (false === form.parsley().validate( group.id )) {
                  return false;
                }
              }

              self.cleanall();
              self.steps[step] = true;
            }
          };

          self.active = function(step) {
            return !!self.steps[step];
          };

          self.cleanall = function() {
            for(var i in self.steps){
              self.steps[i] = false;
            }
          };

          self.createsteps = function(q) {
            self.steps = [];
            for(var i = 1; i <= q; i++) self.steps[i] = false;
          };

        }
    }
})();

/* End - form wizard */


(function() {
    'use strict';

    angular
        .module('app.brokerageorders')
        .controller('BrokerageorderslistController', BrokerageorderslistController);

    BrokerageorderslistController.$inject = ['$http','$resource', '$filter', '$scope', 'Company', 'BrokerageOrders', 'Suppliers', 'Buyers', 'Catalog', 'Product', 'OrderInvoice', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', 'editableOptions', 'editableThemes', '$cookies', '$localStorage'];
    function BrokerageorderslistController($http, $resource, $filter,  $scope, Company, BrokerageOrders, Suppliers, Buyers, Catalog, Product, OrderInvoice, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, editableOptions, editableThemes, $cookies, $localStorage) {
        CheckAuthenticated.check();

        var vm = this;
        
        vm.dt = new Date();
        vm.format = 'dd-MMMM-yyyy';
        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        vm.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        };
        
        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
        $scope.user_id = localStorage.getItem('userid');


        vm.openBulkBrokerageOrder = function () {
            ngDialog.open({
                template: 'createbulkbrokerageorder',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };    
  
        vm.CloseDialog = function() {
            ngDialog.close();
        };

       $scope.formatDate = function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }

  
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};
        
        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
        
        /* function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);
        }  */

        $scope.reloadData = function() {
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
        
       /* function TitleLink(data, type, full, meta){
          return '<a href="#/app/order-detail/?type=purchaseorders&id='+full[0]+'&name='+full[1]+'">'+full[1]+'</a>';
        } */
        
        function SupplierDetail(data, type, full, meta){
          //return '<div class="col-md-6"><a ng-click="OpenSupplier('+full[0]+')">'+full[3]+'</a></div>';
          if(full[12]['selling_company_id'] == null){
              return full[3];
          }
          else{
            return '<a href="#/app/supplier-detail/?id='+full[12]['selling_company_id']+'&name='+full[3]+'">'+full[3]+'</a>';
          }
        }

        function BuyerDetail(data, type, full, meta){
          //return '<div class="col-md-6"><a ng-click="OpenSupplier('+full[0]+')">'+full[3]+'</a></div>';
          if(full[12]['buying_company_id'] == null){
              return full[4];
          }
          else{
            return '<a href="#/app/buyer-detail/?id='+full[12]['buying_company_id']+'&name='+full[4]+'">'+full[4]+'</a>';
          }
        }

        function ChatLink(data, type, full, meta){
          if(full[12]['selling_company_id'] == null || full[12]['buying_company_id'] == null){
              return '';
          }
          else{
            return '<a href="#" target="_self" class="applozic-launcher btn btn-default mt-lg" data-mck-id="'+full[12]['buying_company_chat_user']+'" data-mck-name="'+full[12]['buying_company_name']+'">Chat With Buyer</a> <a href="#" target="_self" class="applozic-launcher btn btn-default mt-lg" data-mck-id="'+full[12]['selling_company_chat_user']+'" data-mck-name="'+full[12]['selling_company_name']+'">Chat With Supplier</a>';
          }
        }
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/brokerageorderdatatables/',
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
                            2 : { "type" : "dateRange"},
                            3 : { "type" : "text"},
                            4 : { "type" : "text"},
                            //5 : { "type" : "numberRange"},
                            10 : { "type" : "select", values:[{"value":"Pending","label":"Pending"}, {"value":"Placed","label":"Placed"}, {"value":"Paid","label":"Paid"}, {"value":"Payment Confirmed","label":"Payment Confirmed"}]},//{"value":"Draft","label":"Draft"}, {"value":"Cancelled","label":"Cancelled"}
                            11 : { "type" : "select", values:[{"value":"Pending","label":"Pending"}, {"value":"Accepted","label":"Accepted"}, {"value":"In Progress","label":"In Progress"}, {"value":"Dispatched","label":"Dispatched"}, {"value":"Delivered","label":"Delivered"}, {"value":"Cancelled","label":"Cancelled"}, {"value":"Closed","label":"Closed"}]},
                            //8 : { "type" : "text"},
                            
                        })
                        .withButtons([
                            {
                                text: 'Create Brokerage Order',
                                key: '1',
                                className: 'green',
                                action: function (e, dt, node, config) {
                                    vm.order = {};
                                  //  vm.OpenOrder();
                                    vm.openBulkBrokerageOrder();
                                }
                            },
                            {
                                  text: 'Reset Filter',
                                  key: '1',
                                  className: 'green',
                                  action: function (e, dt, node, config) {
                                    localStorage.removeItem('DataTables_' + 'purchaseorders-datatables');
                                    $state.go($state.current, {}, {reload: true});
                                  }
                            },
                            'copy',
                            'print',
                            'excel'
                        ])
                        
        /*                .withColReorder()
                        // Set order
                        //.withColReorderOrder([0, 2, 1, 3, 4, 5, 6, 7])
                        //.withColReorderOption('iFixedColumnsRight', 1)
                        .withColReorderOption('iFixedColumnsLeft', 1)
                        .withColReorderCallback(function() {
                            console.log('Columns order has been changed with: ' + this.fnOrder());
                        })*/
                        
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
                }),
          
            //DTColumnDefBuilder.newColumnDef(1).withTitle('Order No.').renderWith(TitleLink),
            DTColumnDefBuilder.newColumnDef(1).withTitle('Order No.'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Date & Time'),//.renderWith(filterDate),
            //DTColumnDefBuilder.newColumnDef(2).notVisible(),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Supplier').renderWith(SupplierDetail),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Buyer').renderWith(BuyerDetail),
            DTColumnDefBuilder.newColumnDef(5).withTitle('No. of Items').notSortable(),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Total (Rs.)').notSortable(),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Tax').notSortable(),
            DTColumnDefBuilder.newColumnDef(8).withTitle('Shipping Charge').notSortable(),
            DTColumnDefBuilder.newColumnDef(9).withTitle('Brokerage Amount').notSortable(),
            DTColumnDefBuilder.newColumnDef(10).withTitle('Payment Status'),
            DTColumnDefBuilder.newColumnDef(11).withTitle('Processing Status'),
       

            DTColumnDefBuilder.newColumnDef(12).withTitle('Action').renderWith(ChatLink).notSortable().notVisible(),
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
