/*start - form wizard */
(function() {
    'use strict';
    angular
        .module('app.salesorders')
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
        .module('app.salesorders')
        .controller('SalesorderslistController', SalesorderslistController);

    SalesorderslistController.$inject = ['$http','$resource', '$filter', '$scope', 'SalesOrders', 'OrderInvoice', 'MultiOrder', 'Company', 'Buyers', 'Catalog', 'Product', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', '$cookies', '$localStorage', 'BuyerList', 'Upload', 'Warehouse'];
    function SalesorderslistController($http, $resource, $filter,  $scope, SalesOrders, OrderInvoice, MultiOrder, Company, Buyers, Catalog, Product, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, $cookies, $localStorage, BuyerList, Upload, Warehouse) {
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
        $scope.flag_retailer = localStorage.getItem("flag_retailer");
        if($scope.flag_retailer == "true"){
            $state.go('app.browse');
        }
        //createorder start
        vm.CloseDialog = function() {
            ngDialog.close();
        };
        
        vm.order_type = null
        vm.buyers = null
        vm.agents = null
        vm.full_catalog_orders_only = null
        vm.order = {}
        vm.order.products = []
        
        $http.get('app/json/orderstatus.json').then(
        function(success){
            $scope.order_statuses = success.data;
        });
        $scope.warehouses = Warehouse.query();

        $scope.openCreateOrderConfirm = function () {
            ngDialog.openConfirm({
              template: 'createorder',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            })
        };
        
        vm.CreateOrderForm = function (order_type){
            vm.order_type = order_type
            
            vm.order_ids = []
            
            var true_count = 0;
            vm.true_key = ""
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    vm.true_key = vm.true_key+key+",";
                    vm.order_ids[true_count] = parseInt(key);
                    true_count++;
                }
            })
            vm.true_key = vm.true_key.slice(0,-1)
            //alert(vm.order_ids);
            if(true_count > 0)
            {
                
                MultiOrder.query({'salesorder': vm.true_key}).$promise.then(function(result){
                    //vm.agents = Company.query({'id':$scope.company_id, 'sub_resource':'brokers'});
                    
                    //vm.order_title = result.title;
                    
                    vm.order = {}
                    //vm.order.catalog = vm.true_key;
                    
                    vm.order.products = [];
                    //vm.full_catalog_orders_only = result.full_catalog_orders_only;
                    
                    /*if(vm.order_type == 'sales_order'){
                        vm.buyers = BuyerList.query({'cid':$scope.company_id});
                    }else{
                        //vm.suppliers = SupplierList.query({'cid':$scope.company_id});
                        CatalogRes.get({'id': vm.true_key, 'cid':$scope.company_id, 'sub_resource':'suppliers'}).$promise.then(function(result){
                            vm.order.supplier = result.selling_company;
                            
                            Company.get({'id':result.selling_company}).$promise.then(function(result){
                                vm.supplier_title = result.name
                            })
                            
                        })
                    }*/
                    //if(result.length>0){
                        var no = 0
                        for(var i=0; i<(result.length); i++){
                            for(var j=0; j<(result[i].catalogs.length); j++){
                                for(var k=0; k<(result[i].catalogs[j].products.length); k++){
                                    var product = result[i].catalogs[j].products[k];
                                    
                                    vm.order.products[no] = {id:product.id, price:product.selling_company[0].price, quantity:product.quantity, image:product.image.thumbnail_small, sku:product.sku, suppliers:product.selling_company, selling_company:product.selling_company[0].id, is_select:true};
                                    no = no + 1
                                }
                            }
                        }
                        $scope.openCreateOrderConfirm();
                    /*}else{
                        alert("You can not back order on your own products.")
                    }*/
                });
              }
              else
              {
                    vm.errortoaster = {
                        type:  'error',
                        title: 'Failed',
                        text:  'Please select one row'
                    };
                    console.log(vm.errortoaster);
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
              }
         
        };
        
        vm.ChangePrice = function(product) {
            var suppliers = product.suppliers;
            var selling_company = product.selling_company;
            
            for(var i=0; i<(suppliers.length); i++){
                if (suppliers[i].id == selling_company){
                    product.price = suppliers[i].price;
                }
            }
        }
        
        vm.removeProduct = function(idx){
            vm.order.products.splice(idx, 1);
        }
        
        vm.changeQty = function(qty){
            if (vm.full_catalog_orders_only == true){
                for(var i=0; i<(vm.order.products.length); i++){
                    var product = vm.order.products[i];
                    product.quantity = qty;
                }
            }
        }
        
        vm.CreateOrder= function () {
            if(vm.orderForm.$valid) {
                $(".modelform").addClass(progressLoader()); 
                vm.items = []
                var itemno = 0;
                
                for(var i=0; i<(vm.order.products.length); i++){
                    var product = vm.order.products[i];
                    
                    if(product.is_select){
                        vm.items[itemno] = {product:product.id, rate:product.price, quantity:product.quantity, selling_company:product.selling_company};
                        itemno++;
                    }
                
                }
                //alert(vm.order_ids);
                var jsondata = {order_number:vm.order.order_number, company:$scope.company_id, items:vm.items, backorders:vm.order_ids};//customer_status:vm.order.customer_status, 
                MultiOrder.save(jsondata,
                function(success){
                    $(".modelform").removeClass(progressLoader());
                    
                    vm.successtoaster = {
                        type:  'success', 
                        title: 'Success',
                        text:  'Order has been created successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    ngDialog.close();
                    $scope.reloadData();
                });
                
            }
            else 
            {
                vm.orderForm.order_number.$dirty = true;
                vm.orderForm.buyer.$dirty = true;
            }
        }
        //createorder end
        

        /*vm.OpenDialog = function () {
            ngDialog.open({
                template: 'addorders',
                scope: $scope,
                className: 'ngdialog-theme-default'
            });
        };*/
        
        vm.OpenDialog = function () {
            ngDialog.open({
                template: 'createbulkorder',
                scope: $scope,
                className: 'ngdialog-theme-default'
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
        
        $scope.OpenCancelDialog = function () {
            ngDialog.open({
                template: 'cancelorder',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        $scope.OpenVerifyPaymentDialog = function () {
            ngDialog.open({
                template: 'verifypayment',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        vm.CloseDialog = function() {
            ngDialog.close();
        };
        vm.OpenOrder = function (){
            vm.OpenDialog();
            /*vm.buyers = Buyers.query({status : "approved", cid:$scope.company_id});
            vm.catalogs = Catalog.query();
             vm.order.cat_sel = "yes"; */
        }
       
        vm.GetProducts = function (catalogId){
           
            vm.products = Product.query({catalog: catalogId});

        }
        var order = new SalesOrders();
        order.items = [];
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
                SalesOrders.save(vm.order,
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
                $http.get('app/json/orderproccessingstatus.json').then(
                function(success){
                    $scope.proc_statuses = success.data;
                });

                /*$http.get('app/json/orderstatus.json').then(
                function(success){
                    $scope.order_statuses = success.data;
                });*/
          
                SalesOrders.get({'id': vm.true_key, 'cid':$scope.company_id}).$promise.then(function(result){
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
                SalesOrders.patch({"id":$scope.orderId, "processing_status": $scope.order.processing_status, "cid":$scope.company_id },//"customer_status":$scope.order.customer_status, 
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

        

        $scope.OpenDispatch = function(invoiceId){
            if($scope.warehouses.length == 1){
                $scope.order.warehouse = $scope.warehouses[0].id;
            }
            $scope.OpenTrackingDetails();
            $scope.invoice_id = invoiceId;
        }
        
        /*$scope.OpenBuyerDetail = function () {
            ngDialog.open({
                template: 'buyerdetails',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        $scope.OpenBuyer = function(orderId){
            $(".modelform6").addClass(progressLoader()); 
            SalesOrders.get({"id":orderId, "cid":$scope.company_id},
            function (success){
                Buyers.query({"company":success.company, "cid":$scope.company_id, "expand":"true"},
                function (success){
                    $scope.buyer = success[0]
                    $scope.OpenBuyerDetail();
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

        $scope.order.dispatch_date = new Date();
        
        /*vm.SaveDispatch = function(){
            var dis_date = $scope.formatDate($scope.order.dispatch_date);
          //  alert($scope.order.dispatch_date);
            if(vm.saveDispatchForm.$valid) {
                $(".modelform3").addClass(progressLoader()); 
                SalesOrders.patch({"id":$scope.order.id, "processing_status": "Dispatched", "tracking_details": $scope.order.tracking_details, "dispatch_date": dis_date, "cid":$scope.company_id },
                function(success){
                        $(".modelform3").removeClass(progressLoader());
                        ngDialog.close();
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Order dispatched successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $scope.reloadData();
                        $scope.order = {};
                  })
            }
            else
            {
                vm.saveDispatchForm.dispatch_date.$dirty = true; 
                vm.saveDispatchForm.tracking_details.$dirty = true;

            }
        }*/
        vm.SaveDispatch = function(){
            var dis_date = $scope.formatDate($scope.order.dispatch_date);
          //  alert($scope.order.dispatch_date);
            if(vm.saveDispatchForm.$valid) {
                $(".modelform3").addClass(progressLoader()); 
                //OrderInvoice.save({"id":$scope.order.id, "processing_status": "Dispatched", "mode":$scope.order.mode, "tracking_number":$scope.order.tracking_number, "tracking_details": $scope.order.tracking_details, "dispatch_date": dis_date, "cid":$scope.company_id , "sub_resource":"dispatched", "transporter_courier":$scope.order.transporter_courier},
                OrderInvoice.save({"id":$scope.invoice_id, "processing_status": "Dispatched", "mode":$scope.order.mode, "tracking_number":$scope.order.tracking_number, "tracking_details": $scope.order.tracking_details, "dispatch_date": dis_date, "cid":$scope.company_id , "sub_resource":"dispatched", "transporter_courier":$scope.order.transporter_courier,  "warehouse": $scope.order.warehouse},
                function(success){
                        $(".modelform3").removeClass(progressLoader());
                        ngDialog.close();
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Order dispatched successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $scope.reloadData();
                        $scope.order = {};
                        $state.go($state.current, {}, {reload: true});
                  })
            }
            else
            {
                vm.saveDispatchForm.dispatch_date.$dirty = true; 
            }
        }
        
        

        $scope.OpenCancelOrder = function(orderId){
            $scope.OpenCancelDialog();
            $scope.order.id = orderId;
        }
        
        $scope.OpenCloseOrder = function(orderId){
            $scope.order.id = orderId;
            
            SalesOrders.patch({"id":$scope.order.id, "processing_status": "Closed", "cid":$scope.company_id },
            function(success){
                    $(".modelform-cancel").removeClass(progressLoader());
                    ngDialog.close();
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Order closed successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    $scope.reloadData();
              });
        }

    /*    vm.CancelOrder = function(){
            if(vm.cancelOrderForm.$valid) {
                $(".modelform4").addClass(progressLoader()); 
                SalesOrders.patch({"id":$scope.order.id, "processing_status": "Cancelled", "supplier_cancel": $scope.order.supplier_cancel, "cid":$scope.company_id },
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
                vm.cancelOrderForm.supplier_cancel.$dirty = true;           
            }
        } */

        $scope.Accept = function(id){
            $(".datatable-loader").addClass(progressLoader()); 
                SalesOrders.patch({"id": id, "processing_status": "Accepted", "cid":$scope.company_id},
                function(success){
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Order is Accepted'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $(".datatable-loader").removeClass(progressLoader()); 
                        $scope.reloadData();
                  });
        }

       /* $scope.OpenVerifyPayment = function(orderId){
            $scope.OpenVerifyPaymentDialog();
            $scope.order.id = orderId;
        }*/

        $scope.VerifyPayment = function(id){
              //  $(".modelform5").addClass(progressLoader()); 
                SalesOrders.patch({"id": id, "customer_status": "Payment Confirmed", "cid":$scope.company_id},
                function(success){
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Payment Confirmed successfully.'
                        };
                //        $(".modelform5").removeClass(progressLoader());
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $scope.reloadData();
                  });
        }
        
        $scope.OpenInvoiceDetails = function () {
            ngDialog.open({
                template: 'invoicedetails',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        $scope.showhide = function(id) {
          var div = document.getElementById("catalog-"+id);
          var button = document.getElementById("expbtn-"+id);
          if (div.style.display !== "none") {
              div.style.display = "none";
              button.value = "Expand";
          }
          else {
              div.style.display = "block";
              button.value = "Collapse";
          }
        }
        
        $scope.GenerateInvoice = function(id){
            SalesOrders.get({'id': id, 'cid':$scope.company_id, "sub_resource":"catalogwise"}).$promise.then(function(result){
                $scope.order_title = result.order_number;
                
                $scope.order = {}
                $scope.order.id = id;
                //$scope.order.catalog = vm.true_key;
                
                $scope.order.products = [];
                //$scope.full_catalog_orders_only = result.full_catalog_orders_only;
               /* var idx = 0;
                for(var c=0; c<(result.catalogs.length); c++){
                    for(var i=0; i<(result.catalogs[c].products.length); i++){
                        var item = result.catalogs[c].products[i];
                        
                        var product_quantity = item.pending_quantity;
                        $scope.order.products[idx] = {id:item.id, price:item.rate, quantity:product_quantity, image:item.product_image, sku:item.product_sku, is_select:false, max:product_quantity};//, is_select:true
                        if(product_quantity > 0)
                            $scope.order.products[idx]['is_select'] = true;

                        idx += 1;
                    }
                }*/
                $scope.orderedcatalogs = [];
                //$scope.full_catalog_orders_only = result.full_catalog_orders_only;
               
                for(var c=0; c<(result.catalogs.length); c++){
                    var catalog = {};
                    catalog.id = result.catalogs[c].id;
                    catalog.name = result.catalogs[c].name;
                    catalog.brand = result.catalogs[c].brand;
                    var idx = 0;
                    for(var i=0; i<(result.catalogs[c].products.length); i++){
                        var item = result.catalogs[c].products[i];
                        
                        var product_quantity = item.pending_quantity;

                        $scope.order.products[idx] = {id:item.id, price:item.rate, quantity:product_quantity, image:item.product_image, sku:item.product_sku, is_select:false, max:product_quantity};//, is_select:true
                        if(product_quantity > 0)
                            $scope.order.products[idx]['is_select'] = true;

                        idx += 1;
                    }
                    catalog.products = $scope.order.products;
                    $scope.order.products = [];
                    $scope.orderedcatalogs.push(catalog);
                }
                console.log($scope.orderedcatalogs);


                //alert($scope.order.products);
                console.log($scope.warehouses.length);
                console.log($scope.warehouses[0].id);
                if($scope.warehouses.length == 1){
                    $scope.order.warehouse = $scope.warehouses[0].id;
                }
                $scope.OpenInvoiceDetails();
            });
            //$scope.order.id = orderId;
        }
        
      /*  vm.CreateInvoice = function () {
            if(vm.invoiceForm.$valid) {
                $(".modelform").addClass(progressLoader()); 
                vm.items = []
                var itemno = 0;
                
                for(var i=0; i<(vm.order.products.length); i++){
                    var product = vm.order.products[i];
                    
                    if(product.is_select){
                        vm.items[itemno] = {order_item:product.id, qty:product.quantity};
                        itemno++;
                    }
                }
                
                var jsondata = {order:vm.order.id, invoiceitem_set:vm.items, cid:$scope.company_id};
                
                OrderInvoice.save(jsondata,
                function(success){
                    $(".modelform").removeClass(progressLoader());
                    
                    vm.successtoaster = {
                        type:  'success', 
                        title: 'Success',
                        text:  'Invoice has been created successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    ngDialog.close();
                    $scope.reloadData();
                });
                
            }
            else 
            {
                alert("CreateInvoice error");
            }
        } */
        
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
                window.open('/#/pages/printorder/?salesorder='+vm.true_key,'_blank');
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
        
        
        $scope.OpenTransferDialog = function () {
            ngDialog.open({
                template: 'transfer-form',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        $scope.transfer = {};
        $scope.OpenTransfer = function(id){
            $(".datatable-loader").addClass(progressLoader());
            $scope.buyerId = id;
            $scope.buyers = BuyerList.query({'cid':$scope.company_id}, function(success){
                $(".datatable-loader").removeClass(progressLoader());
                $scope.OpenTransferDialog();
            });
        };
        
        
       /* $scope.Transfer = function (){
            if(vm.transferForm.$valid) {
                $(".modelform2").addClass(progressLoader()); 
                SalesOrders.save({'id': $scope.buyerId, 'cid':$scope.company_id, 'seller_company':$scope.transfer.buyer, 'sub_resource':'transfer'}).$promise.then(function(result){
                    $(".modelform2").removeClass(progressLoader());
                    ngDialog.close();
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Sales order has been transfered.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    $scope.reloadData();
                    $scope.transfer = {};
                });
            }
            else 
            {
                vm.transferForm.buyer.$dirty = true;
            }
        } */
        
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
        $scope.uploadFiles = function (files) {
            $scope.file = files;
   //         angular.forEach(files, function(file, key) {
                console.log($scope.file);
     //       });      
        };
        
        vm.UploadSalesOrderCsv = function() {
  //          $scope.buyers = {};
            if(vm.uploadcsv.$valid) {
                $(".modelform3").addClass(progressLoader());
              //  console.log($scope.file);
                Upload.upload({
                            url: 'api/v1/importcsvorder/',
                            headers: {
                              'optional-header': 'header-value'
                            },
                            data: {"sales_order_csv":$scope.file}
                      }).then(function (response) {
                                /*var uri = 'data:application/csv;charset=UTF-8,' + encodeURIComponent(response.data);
                                window.open(uri, 'buyer_error.csv');*/
                                var headers = response.headers();
                                //alert(headers['content-type']);
                                
                                
                                if(headers['content-type'] == "text/csv"){
                                    var hiddenElement = document.createElement('a');

                                    hiddenElement.href = 'data:attachment/csv,' + encodeURI(response.data);
                                    hiddenElement.target = '_blank';
                                    hiddenElement.download = 'salesorder_error.csv';
                                    hiddenElement.click();
                                    
                                    vm.successtoaster = {
                                        type:  'warning',
                                        title: 'Warning',
                                        text:  'File uploaded successfully and please fix issues found on salesorder_error.csv and reupload'
                                    };
                                }
                                else{
                                    vm.successtoaster = {
                                        type:  'success',
                                        title: 'Success',
                                        text:  'Orders have been created successfully.'
                                    };
                                }
                                
                                $(".modelform3").removeClass(progressLoader());
                                ngDialog.close();
                                
                                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                $scope.reloadData();
                        });
            }
            else
            {
                vm.uploadcsv.buyer_csv.$dirty = true;
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
          return '<a href="#/app/order-detail/?type=salesorders&id='+full[0]+'&name='+full[1]+'">'+full[1]+'</a>';
        }
        
        function BuyerDetail(data, type, full, meta){
          //return '<div class="col-md-6"><a ng-click="OpenBuyer('+full[0]+')">'+full[3]+'</a></div>';
          if(full[11]['buying_company_id'] == null || full[11]['is_invited'] == false){
              return full[3];
          }
          else{
            return '<a href="#/app/buyer-detail/?id='+full[11]['buying_company_id']+'&name='+full[3]+'">'+full[3]+'</a>';
          }
        }
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/salesorderdatatables1/',
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
                            //4 : { "type" : "text"},
                            //5 : { "type" : "numberRange"},
                            9 : { "type" : "select", values:[{"value":"Pending","label":"Pending"}, {"value":"Placed","label":"Placed"}, {"value":"Paid","label":"Paid"}, {"value":"Payment Confirmed","label":"Payment Confirmed"}, {"value":"Cancelled","label":"Cancelled"}]},
                            10 : { "type" : "select", values:[{"value":"Pending","label":"Pending"}, {"value":"Accepted","label":"Accepted"}, {"value":"In Progress","label":"In Progress"}, {"value":"Dispatched","label":"Dispatched"}, {"value":"Delivered","label":"Delivered"}, {"value":"Cancelled","label":"Cancelled"}, {"value":"Transferred","label":"Transferred"}, {"value":"Closed","label":"Closed"}]},
                            //8 : { "width" : "10px"},
                            
                        })
                        .withButtons([
                            /* {
                                text: 'Back Order',
                                key: '1',
                                className: 'orange',
                                action: function (e, dt, node, config) {
                                    vm.CreateOrderForm('purchase_order');
                                }
                            }, */
                            
                           /* {
                                text: 'Create Sales Order',
                                key: '1',
                                className: 'green',
                                action: function (e, dt, node, config) {
                                    vm.order = {};
                                    $scope.catalogstobeorder = [];
                                    vm.OpenOrder();
                                }
                            }, */
                            /*{
                                text: 'Update Status',
                                key: '1',
                                className: 'orange',
                                action: function (e, dt, node, config) {
                                    vm.OpenUpdateStatus();
                                }
                            }, */
                            {
                                text: 'Upload Orders',
                                key: '1',
                                className: 'blue',
                                action: function (e, dt, node, config) {
                                    
                                    vm.OpenUploadCsv();
                                }
                            },  
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
                                    localStorage.removeItem('DataTables_' + 'salesorders-datatables');
                                    $state.go($state.current, {}, {reload: true});
                                  }
                            },
                            /*'copy',
                            'print',
                            'excel'*/
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
                        .withOption('scrollX', '100%')
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
            DTColumnDefBuilder.newColumnDef(2).withTitle('Date & Time'),//.renderWith(filterDate),
            //DTColumnDefBuilder.newColumnDef(2).notVisible(),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Buyer').renderWith(BuyerDetail),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Buyer Number').notVisible(),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Total Qty').notSortable(),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Total (Rs.)').notSortable(),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Tax').notSortable(),
            DTColumnDefBuilder.newColumnDef(8).withTitle('Shipping Charge').notSortable(),
            DTColumnDefBuilder.newColumnDef(9).withTitle('Payment Status'),
            DTColumnDefBuilder.newColumnDef(10).withTitle('Processing Status'),
   /*             .renderWith(function(data, type, full, meta) {
                    if(full[7] == 'Dispatched')
                    {
                        return full[7]+'<br>'+full[8];
                    }
                })
            ,*/
//            DTColumnDefBuilder.newColumnDef(8).withTitle('Tracking Details'),

            DTColumnDefBuilder.newColumnDef(11).withTitle('Action').notSortable()//.withOption('width', '25%')
                .renderWith(function(data, type, full, meta) {
                   // alert(full[7]);
                    //vm.selected[full[0]] = false;
                    //return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                    if(full[10].indexOf('Delivered') > -1 || full[10].indexOf('Cancelled') > -1 || full[9].indexOf('Cancelled') > -1)//full[8].indexOf('Dispatched') > -1  || 
                    {
                        return '&nbsp;';
                    }
                    
                    var htmlbutton = ''
                    if(full[10] == 'Pending')
                    {
                        htmlbutton += '<div><button type="button" ng-click="Accept('+full[0]+')" class="btn btn-block btn-primary mt-lg">Accept</button></div>';
                        htmlbutton += '<div><button type="button" ng-click="OpenTransfer('+full[0]+')" class="btn btn-block btn-primary mt-lg">Transfer</button></div>'
                        //<div><button type="button" ng-click="OpenCancelOrder('+full[0]+', \'sales\')" class="btn btn-block btn-danger mt-lg">Cancel</button></div>
                    }
                    
                                      
                    if((full[10] == 'Accepted' || full[10] == 'In Progress') && (full[11]['total_pending_quantity'] > 0))
                    {
                        htmlbutton += '<div><button type="button" ng-click="GenerateInvoice('+full[0]+')" class="btn btn-block btn-primary mt-lg orange-button">Dispatch</button></div>';
                        //<div><button type="button" ng-click="OpenCancelOrder('+full[0]+')" class="btn btn-block btn-danger mt-lg">Cancel</button></div>
                    }
                    /*console.log(full[7])
                    console.log(full[8])
                    console.log(full[9]['invoices'].length)*/
                    if(full[10] == 'Accepted' && full[11]['invoices'].length == 1)
                    {
                        htmlbutton += '<div><button type="button" ng-click="OpenDispatch('+full[11]['invoices'][0]+')" class="btn btn-block btn-primary mt-lg orange-button">Dispatch Invoice</button></div>';
                    }
                    
                    if(full[10] == 'In Progress')
                    {
                        htmlbutton +=  '<div><button type="button" ng-click="OpenCloseOrder('+full[0]+')" class="btn btn-block btn-danger mt-lg">Close</button></div>';
                    }
                    
                    if(full[10] == 'Pending' || full[10] == 'Accepted')
                    {
                        
                       // htmlbutton += '<div><button type="button" ng-click="OpenCancelOrder('+full[0]+', \'sales\')" class="btn btn-block btn-danger mt-lg">Cancel</button></div>'
                    }
                    
                    /*if(full[7] == 'Partially Dispatched')
                    {
                        htmlbutton += '<div><button type="button" ng-click="GenerateInvoice('+full[0]+')" class="btn btn-block btn-primary mt-lg">Invoice</button></div> ';
                    }*/
                   
                   // verify payment button removed : WB-1032
                   /* if(full[7].indexOf('Paid') > -1){
                        htmlbutton += '<div><button type="button" ng-click="VerifyPayment('+full[0]+')" class="btn btn-block btn-primary mt-lg">Verify Payment</button></div>'
                    }  */

                    
                    if(htmlbutton == '')
                        return '&nbsp;';
                    else
                        return htmlbutton;

                    
                    
                    /*if(full[7] == 'Accepted' && full[6].indexOf('Paid') > -1 )
                    {
                        return '<div><button type="button" ng-click="OpenDispatch('+full[0]+')" class="btn btn-block btn-primary mt-lg">Dispatch</button></div><div><button type="button" ng-click="OpenCancelOrder('+full[0]+')" class="btn btn-block btn-danger mt-lg">Cancel</button></div><div><button type="button" ng-click="VerifyPayment('+full[0]+')" class="btn btn-block btn-primary mt-lg">Verify Payment</button></div><div><button type="button" ng-click="GenerateInvoice('+full[0]+')" class="btn btn-block btn-primary mt-lg">Invoice</button></div> ';     
                        
                    }
                    else if(full[7] == 'Accepted')
                    {
                        return '<div><button type="button" ng-click="OpenDispatch('+full[0]+')" class="btn btn-block btn-primary mt-lg">Dispatch</button></div><div><button type="button" ng-click="OpenCancelOrder('+full[0]+')" class="btn btn-block btn-danger mt-lg">Cancel</button></div><div><button type="button" ng-click="GenerateInvoice('+full[0]+')" class="btn btn-block btn-primary mt-lg">Invoice</button></div> ';
                    }
                    else
                    {
                        return '&nbsp;';
                    }*/
                    
                    
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
