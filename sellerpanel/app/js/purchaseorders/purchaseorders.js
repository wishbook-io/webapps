/*start - form wizard */
(function() {
    'use strict';
    angular
        .module('app.purchaseorders')
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
        .module('app.purchaseorders')
        .controller('PurchaseorderslistController', PurchaseorderslistController);

    PurchaseorderslistController.$inject = ['$http','$resource', '$filter', '$scope', 'Company', 'PurchaseOrders', 'Suppliers', 'Buyers', 'Catalog', 'Product', 'OrderInvoice', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', 'editableOptions', 'editableThemes', '$cookies', '$localStorage', 'sharedProperties'];
    function PurchaseorderslistController($http, $resource, $filter,  $scope, Company, PurchaseOrders, Suppliers, Buyers, Catalog, Product, OrderInvoice, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, editableOptions, editableThemes, $cookies, $localStorage, sharedProperties) {
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

  /*      editableOptions.theme = 'bs3';

          editableThemes.bs3.inputClass = 'input-sm';
          editableThemes.bs3.buttonsClass = 'btn-sm';
          editableThemes.bs3.submitTpl = '<button type="submit" class="btn btn-success"><span class="fa fa-check"></span></button>';
          editableThemes.bs3.cancelTpl = '<button type="button" class="btn btn-default" ng-click="$form.$cancel()">'+
                                           '<span class="fa fa-times text-muted"></span>'+
                                         '</button>';*/

        vm.OpenDialog = function () {
            ngDialog.open({
                template: 'addorders',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        vm.openBulkPurchaseOrder = function () {
            ngDialog.open({
                template: 'createbulkpurchaseorder',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };       
        
        $scope.OpenStatusDialog = function () {
            ngDialog.open({
                template: 'updatestatus',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        $scope.OpenTrackingDetails = function () {
            ngDialog.open({
                template: 'trackingdetails',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        $scope.OpenCancelPurchaseOrderDialog = function () {
            ngDialog.open({
                template: 'cancelorder-purchase',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        $scope.OpenPayDialog = function () {
            ngDialog.open({
                template: 'pay',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        vm.openShippingPaymentModal = function () {
            ngDialog.open({
                template: 'shippingpaymentmodal',
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        vm.CloseDialog = function() {
            ngDialog.close();
        };
        vm.OpenOrder = function (){
            vm.OpenDialog();
            vm.buyers = Buyers.query({status : "approved", cid:$scope.company_id});
            vm.catalogs = Catalog.query();
            vm.order.cat_sel = "yes";
        }
        //vm.products = Product.query({catalog: 168});
        vm.GetProducts = function (catalogId){
           
            vm.products = Product.query({catalog: catalogId});

        }
      //  var order = new PurchaseOrders();
//        order.items = [];
        var temp = {};

        vm.getChecked = function(id)
        {
            temp.product = id;
            order.items.push(temp);
        }        


       $scope.order = {};
       vm.AddOrder= function () {
            alert(JSON.stringify(vm.order));
          
   /*         angular.forEach(vm.order.items.product, function(value,key) {
              //  console.log(value);
              //  console.log(key);
                if(value)
                {
                    console.log(key);
                    temp.product = key;
                    order.items.push(temp);
                    //vm.temp.rate = vm.order.items.rate[key];
                    //vm.temp.quantity = vm.order.items.quantity[key];
                }
               
                    //vm.temp.product = key;

                
                //vm.order.items.product = 
               
            });*/
           alert(JSON.stringify(order.items));
            
           /*  if(vm.orderForm.$valid) {
            vm.order.processing_status = 'ordered';
            alert(JSON.stringify(vm.order));

            /*    $(".modelform").addClass(progressLoader()); 
                PurchaseOrders.save(vm.order,
                    function(success){
                        $(".modelform").removeClass(progressLoader());
                        ngDialog.close();
                        vm.successtoaster = {
                            type:  'success', 
                            title: 'Success',
                            text:  'Your order has been created successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $scope.reloadData();
                    },
                    function(error){
                        $(".modelform").removeClass(progressLoader());
                        angular.forEach(error.data, function(value, key) {
                            vm.errortoaster = {
                                type:  'error',
                                title: toTitleCase(key),//'Failed',//
                                text:  value.toString()
                            };
                            toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                        })
                });
            }
            else 
            {
                vm.orderForm.company.$dirty = true;
                vm.orderForm.order_number.$dirty = true;
                vm.orderForm.cat_sel.$dirty = true;
            }*/
            
        };

        vm.OpenUpdateStatus = function (){
          
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })

              if(true_count == 1)
              {
                /*$http.get('app/json/orderproccessingstatus.json').then(
                function(success){
                    $scope.proc_statuses = success.data;
                });*/

                $http.get('app/json/orderstatus.json').then(
                function(success){
                    $scope.order_statuses = success.data;
                });
          
                PurchaseOrders.get({'id': vm.true_key, 'cid':$scope.company_id}).$promise.then(function(result){
                    $scope.orderId = result.id;
                   
                        $scope.order = result;
          //              console.log(result.processing_status);
                        $scope.order.processing_status = result.processing_status
                        $scope.order.customer_status = result.customer_status;
                                               
                        $scope.OpenStatusDialog();
                   
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

        $scope.UpdateStatus = function (){
            if(vm.updateStatusForm.$valid) {
                $(".modelform2").addClass(progressLoader()); 
                PurchaseOrders.patch({"id":$scope.orderId, "processing_status": $scope.order.processing_status, "customer_status":$scope.order.customer_status, "cid":$scope.company_id },
                    function(success){
                            $(".modelform2").removeClass(progressLoader());
                            ngDialog.close();
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Order status updated successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            $scope.reloadData();
                            $scope.order = {};
                      })
            }
            else
            {
                vm.updateStatusForm.processing_status.$dirty = true;
                vm.updateStatusForm.customer_status.$dirty = true;            
            }

        }
       
        $scope.PlaceOrder = function(id){
            
            PurchaseOrders.patch({"id": id, "processing_status": "Pending", "cid":$scope.company_id},
            function(success){                    
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Order placed successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    $scope.reloadData();
                    $scope.order = {};
              })
        }

        $scope.OpenCancelPurchaseOrder = function(orderId){
            $scope.OpenCancelPurchaseOrderDialog();
            $scope.order.id = orderId;
        }

    /*    vm.CancelOrder = function(){
            if(vm.cancelOrderForm.$valid) {
                $(".modelform4").addClass(progressLoader()); 
                PurchaseOrders.patch({"id":$scope.order.id, "customer_status": "Cancelled", "buyer_cancel": $scope.order.buyer_cancel, "cid":$scope.company_id },
                function(success){
                        $(".modelform4").removeClass(progressLoader());
                        ngDialog.close();
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Order cancelled successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $scope.reloadData();
                  });
            }
            else
            {
                vm.cancelOrderForm.buyer_cancel.$dirty = true;           
            }
        } */
        $scope.OpenShipPay = function(orderId){
            sharedProperties.setOrderType('purchase');
            sharedProperties.setProperty(orderId);
            vm.openShippingPaymentModal();
        }
        $scope.OpenPay = function(orderId){
            PurchaseOrders.get({'id': orderId, 'cid':$scope.company_id, "sub_resource":"catalogwise"}).$promise.then(function(result){
                $scope.products = [];
                var itemno = 0;
                
                for(var c=0; c<(result.catalogs.length); c++){
                    for(var i=0; i<(result.catalogs[c].products.length); i++){
                        var item = result.catalogs[c].products[i];
                        
                        //var product_quantity = item.pending_quantity;
                        var product_quantity = item.quantity;
                        $scope.products[itemno] = {order_item:item.id, qty:product_quantity};
                        itemno++;
                    }
                }

                var jsondata = {order:orderId, invoiceitem_set:$scope.products, cid:$scope.company_id};
                OrderInvoice.save(jsondata,
                function(success){
                    
                    $scope.OpenPayDialog();
                    $scope.order = {};
                    $scope.order.id = orderId;
                    //$scope.modes = ['NEFT','Cheque','PayTM','Mobikwik','Zaakpay','Other'];
                    $scope.modes = ['NEFT','Cheque','Other'];
                    $scope.order.invoice_id = success.id;
                    $scope.order.invoice_amount = success.total_amount;

                    /* Start: Zaakpay  */
                 /*   $scope.zaakpay = {};
                    $scope.zaakpay.orderId = success.id;
                    //$scope.zaakpay.orderId = 793;
                    console.log(success.total_amount);
                    $scope.zaakpay.amount = parseInt(success.total_amount * 100);
                    console.log($scope.zaakpay.amount);
                    //$scope.zaakpay.amount = 208528;
                    
                    $scope.zaakpay.merchantIdentifier = "b19e8f103bce406cbd3476431b6b7973";  // staging
                    //$scope.zaakpay.merchantIdentifier = "0870060b6fde4b2499a88fe222c518af";  // live

                    $scope.zaakpay.merchantkey = '0678056d96914a8583fb518caf42828a';  //staging
                    // $scope.zaakpay.merchantkey = '5762bfef22e04d2db83a6617edb6e256';  //live
                   
                    $scope.zaakpay.currency = "INR";
                    
                    //$scope.zaakpay.returnUrl = "http://b2b.trivenilabs.com/api/v1/zaakpay/response/";
                    $scope.zaakpay.returnUrl = "http://my.wishbooks.io/api/v1/zaakpay/response/";

                    $scope.zaakpay.merhantUrl = "http://zaakpaystaging.centralindia.cloudapp.azure.com:8080/api/paymentTransact/V7"; //staging
                    //$scope.zaakpay.merhantUrl = "https://api.zaakpay.com/api/paymentTransact/V7"; // live

                    Company.get({ id: $scope.company_id}, function(cmpdata){
                        $scope.zaakpay.buyerEmail = cmpdata.email;
                        $scope.zaakpay.buyerPhoneNumber = cmpdata.phone_number;
                    });    */
                    /* User.get({ id: $scope.user_id}, function(usrdata){
                          $scope.zaakpay.buyerEmail = usrdata.email;
                          $scope.zaakpay.buyerPhoneNumber = usrdata.userprofile.phone_number;
                      });  */

                    /* End: Zaakpay  */

                });
            });
            
        }
        
        /*$scope.OpenSupplierDetail = function () {
            ngDialog.open({
                template: 'supplierdetails',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        $scope.OpenSupplier = function(orderId){
            $(".modelform6").addClass(progressLoader()); 
            PurchaseOrders.get({"id":orderId, "cid":$scope.company_id},
            function (success){
                Suppliers.query({"company":success.seller_company, "cid":$scope.company_id, "expand":"true"},
                function (success){
                    $scope.buyer = success[0]
                    $scope.OpenSupplierDetail();
                    $(".modelform6").removeClass(progressLoader()); 
                });
                
            });
        }*/

       $scope.formatDate = function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }

    /*    $scope.order.payment_date = new Date();
        
        vm.Pay = function(){         
            if(vm.paymentForm.$valid) {
                $(".modelform4").addClass(progressLoader()); 
                var paydate = $scope.formatDate($scope.order.payment_date);
                PurchaseOrders.patch({"id":$scope.order.id, "customer_status": "Paid", 'payment_details': $scope.order.payment_details, 'payment_date': paydate, 'cid':$scope.company_id},
                function(success){
                        $(".modelform4").removeClass(progressLoader());
                        ngDialog.close();
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Payment details saved successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        //$scope.order.payment_date = new Date();
                        //$scope.order.payment_details = ""
                        $scope.reloadData();
                        $scope.order = {};
                  })
            }
            else
            {
                vm.paymentForm.payment_date.$dirty = true;           
                vm.paymentForm.payment_details.$dirty = true;           
            }            
        }  */
        
        vm.OpenPrintOrder = function (){
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })

            if(true_count == 1)
            {
                window.open('/#/pages/printorder/?purchaseorder='+vm.true_key,'_blank');
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
        
        function TitleLink(data, type, full, meta){
          return '<a href="#/app/order-detail/?type=purchaseorders&id='+full[0]+'&name='+full[1]+'">'+full[1]+'</a>';
        }
        
        function SupplierDetail(data, type, full, meta){
          //return '<div class="col-md-6"><a ng-click="OpenSupplier('+full[0]+')">'+full[3]+'</a></div>';
          if(full[10]['selling_company_id'] == null){
              return full[3];
          }
          else{
            return '<a href="#/app/supplier-detail/?id='+full[10]['selling_company_id']+'&name='+full[3]+'">'+full[3]+'</a>';
          }
        }
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/purchaseorderdatatables1/',
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
                            //4 : { "type" : "text"},
                            //5 : { "type" : "numberRange"},
                            8 : { "type" : "select", values:[{"value":"Pending","label":"Pending"}, {"value":"Placed","label":"Placed"}, {"value":"Paid","label":"Paid"}, {"value":"Payment Confirmed","label":"Payment Confirmed"}]},//{"value":"Draft","label":"Draft"}, {"value":"Cancelled","label":"Cancelled"}
                            9 : { "type" : "select", values:[{"value":"Pending","label":"Pending"}, {"value":"Accepted","label":"Accepted"}, {"value":"In Progress","label":"In Progress"}, {"value":"Dispatched","label":"Dispatched"}, {"value":"Delivered","label":"Delivered"}, {"value":"Cancelled","label":"Cancelled"}, {"value":"Closed","label":"Closed"}]},
                            //8 : { "type" : "text"},
                            
                        })
                        .withButtons([
                           /* {
                                text: 'Create Purchase Order',
                                key: '1',
                                className: 'green',
                                action: function (e, dt, node, config) {
                                    vm.order = {};
                                  //  vm.OpenOrder();
                                    vm.openBulkPurchaseOrder();
                                }
                            }, */
                           /* {
                                text: 'Update Status',
                                key: '1',
                                className: 'orange',
                                action: function (e, dt, node, config) {
                                    vm.OpenUpdateStatus();
                                }
                            }, */
                            {
                                text: 'Print Order',
                                key: '1',
                                className: 'orange',
                                action: function (e, dt, node, config) {
                                    vm.OpenPrintOrder();
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
          
            DTColumnDefBuilder.newColumnDef(1).withTitle('Order No.').renderWith(TitleLink),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Date Time').withOption('sWidth','3%'),//.renderWith(filterDate),
            //DTColumnDefBuilder.newColumnDef(2).notVisible(),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Supplier').renderWith(SupplierDetail),
            DTColumnDefBuilder.newColumnDef(4).withTitle('No. of Items').notSortable(),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Total (Rs.)').notSortable(),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Tax').notSortable(),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Shipping Charge').notSortable(),
            DTColumnDefBuilder.newColumnDef(8).withTitle('Payment Status'),
            DTColumnDefBuilder.newColumnDef(9).withTitle('Processing Status'),
       

            DTColumnDefBuilder.newColumnDef(10).withTitle('Action').notSortable()//.withOption('width', '25%')
                .renderWith(function(data, type, full, meta) {
                   // alert(full[7]);
                    //vm.selected[full[0]] = false;
                    //return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                    
                    /*if(full[6] == 'Draft')
                    {
                        return '<div><button type="button" ng-click="Finalize('+full[0]+')" class="btn btn-block btn-primary mt-lg">Finalize</button></div><div><button type="button" ng-click="OpenCancelOrder('+full[0]+')" class="btn btn-block btn-danger mt-lg">Cancel</button></div>';     
                    } 
                    else if(full[6] == 'Placed' )
                    {
                        return '<div><button type="button" ng-click="OpenPay('+full[0]+')" class="btn btn-block btn-primary mt-lg">Pay</button></div><div><button type="button" ng-click="OpenCancelOrder('+full[0]+')" class="btn btn-block btn-danger mt-lg">Cancel</button></div> ';     
                        
                    }
                    else if(full[6].indexOf('Paid') > -1)
                    {
                        return '<div><button type="button" ng-click="OpenCancelOrder('+full[0]+')" class="btn btn-block btn-danger mt-lg">Cancel</button></div> ';
                    }
                    else
                    {
                        return '&nbsp;';
                    }*/
                    
                    if(full[9].indexOf('Cancelled') > -1 || full[8].indexOf('Cancelled') > -1)//full[8].indexOf('Dispatched') > -1  || 
                    {
                        return '&nbsp;';
                    }
                    
                    var htmlbutton = ''
                    if(full[9] == 'Draft')
                    {
                      //  htmlbutton += '<div><button type="button" ng-click="PlaceOrder('+full[0]+')" class="btn btn-block btn-primary mt-lg">Place Order</button></div>';     
                    }
                    //if(full[7] == 'Placed')
                    

                    /*if(full[8] == 'Placed')
                    {
                        htmlbutton += '<div><button type="button" ng-click="OpenCancelPurchaseOrder('+full[0]+', \'purchase\')" class="btn btn-block btn-danger mt-lg">Cancel</button></div> ';
                    } */
                    if((full[8] == 'Placed' || full[8] == 'Pending') && full[10]['invoices'].length < 2)
                    {
                        // htmlbutton += '<div><button type="button" ng-click="OpenPay('+full[0]+')" class="btn btn-block btn-primary mt-lg">Pay</button></div>';
                        htmlbutton += '<div><button type="button" ng-click="OpenShipPay('+full[0]+')" class="btn btn-block btn-primary mt-lg">Pay</button></div>';     
                    }
                    
                    // changed below condition for: WB-2787
                    //if(full[8] == 'Pending' || full[9] == 'Pending' || full[9] == 'Accepted')
                    if((full[8] == 'Pending' || full[9] == 'Pending' || full[9] == 'Accepted' || full[8] == 'Placed') && (full[8].indexOf('Paid') == -1) )
                    {
                        htmlbutton += '<div><button type="button" ng-click="OpenCancelPurchaseOrder('+full[0]+', \'purchase\')" class="btn btn-block btn-danger mt-lg">Cancel</button></div> ';
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
