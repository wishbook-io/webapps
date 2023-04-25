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
        .controller('CreateBrokerageOrderController', CreateBrokerageOrderController);

    CreateBrokerageOrderController.$inject = ['$resource', '$filter', '$scope', 'Catalog', 'BuyerList', 'SupplierList', 'Suppliers', 'Company', 'BrokerageOrders', 'OrderInvoice', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', '$cookies', '$localStorage', 'sharedProperties'];
    function CreateBrokerageOrderController($resource, $filter, $scope, Catalog, BuyerList, SupplierList, Suppliers, Company, BrokerageOrders, OrderInvoice, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, $cookies, $localStorage, sharedProperties) {
        
        CheckAuthenticated.check();
     
        
        var vm = this;
        vm.order = {};
        $scope.company_id = localStorage.getItem('company');
        
        vm.dt = new Date();
        vm.format = 'dd-MMMM-yyyy';
        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        vm.openShippingPaymentModal = function () {
            ngDialog.open({
                template: 'shippingpaymentmodal',
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };   

        vm.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        };
        
        $scope.CloseDialog = function() {
            ngDialog.close();
        };
        
        $scope.cdata = {};
        $scope.cdata.sets = 1;
        $scope.cdata.packingtype = "Naked";
        $scope.catalogstobeorder = [];

        
        $scope.order_id = 1591;

        
        $scope.supplierChange = function(supplierid){
          //console.log(supplierid);
          vm.catalogs = Catalog.query({cid:$scope.company_id, id:"dropdownwithbrand", company: supplierid },
          function(success){
              vm.buyers = BuyerList.query({'cid':$scope.company_id, 'selling_company': supplierid  });
              if($scope.true_key && $scope.true_key.length > 0){
                $scope.cdata.catalog = parseInt($scope.true_key[0]);
              }
              else if($scope.enquired_catalog_id != null){
                $scope.cdata.catalog = parseInt($scope.enquired_catalog_id); 
                //vm.order.buyer = $scope.buying_company_id;
              }
          });

          Suppliers.query({"cid": $scope.company_id,"company": supplierid}, 
            function(data){
              //console.log(data);
              vm.order.brokerage = parseFloat(data[0].brokerage_fees);
            }); 
        }

         

        vm.suppliers = SupplierList.query({'cid':$scope.company_id},
          function(success){
              if($scope.catalog_supplier != null){
                vm.order.supplier = $scope.catalog_supplier;
                $scope.supplierChange(vm.order.supplier);
              }
              else if($scope.enquired_selling_company_id != null){
                vm.order.supplier = $scope.enquired_selling_company_id;
                $scope.supplierChange(vm.order.supplier);
              }

          });

        if($state.current.name == 'app.publiccatalog'){
          $scope.publiccatalogflag = true;
          vm.order.supplier_name = $scope.catalog_supplier_name;
          //vm.order.supplier = $scope.catalog_supplier
          //$scope.supplierChange(vm.order.supplier);
          console.log($scope.publiccatalogflag);
        }
        else{
          $scope.publiccatalogflag = false;
        }


        
        vm.agents = Company.query({'id':$scope.company_id, 'sub_resource':'brokers'});

       
        $scope.catalogstobeorder = [];

       
        
        $scope.CatalogArray = function() {
            for(var i=0; i<($scope.catalogstobeorder.length); i++){
                if($scope.catalogstobeorder[i].id == $scope.cdata.catalog){
                    $scope.catalogstobeorder[i].sets += $scope.cdata.sets;
                    $scope.catalogstobeorder[i].qty = $scope.catalogstobeorder[i].sets*$scope.catalogstobeorder[i].total_products;
                    $scope.cdata = {};
                    $scope.cdata.sets = 1;
                    $scope.cdata.packingtype = "Naked";
                    return true;
                }
            }
            
            if($scope.cdata.catalog && $scope.cdata.packingtype && $scope.cdata.sets && vm.order.buyer ) {
                //console.log(JSON.stringify($scope.cdata));
                Catalog.get({"id":$scope.cdata.catalog, "cid":$scope.company_id},
                   function (result){
                      var catalog = {}
                      catalog.title = result.title;
                      catalog.id = result.id;
                      catalog.thumbimage = result.thumbnail.thumbnail_small;
                     // catalog.brand_name = result.brand_name;
                      catalog.sets = $scope.cdata.sets;
                      catalog.total_products = result.total_products;
                      catalog.qty = $scope.cdata.sets*result.total_products;
                      catalog.packingtype = $scope.cdata.packingtype;
                      catalog.note = $scope.cdata.note;

                      $scope.catalogstobeorder.push(catalog);
                      $scope.cdata = {};
                      $scope.cdata.sets = 1;
                      $scope.cdata.packingtype = "Naked";
                   });
            }
            else
            {
                vm.errortoaster = {
                            type:  'error',
                            title: 'Error',
                            text:  'Please fill all required fields.'
                        };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }
        }

        $scope.remove = function(catalog){
            $scope.catalogstobeorder.splice($scope.catalogstobeorder.indexOf(catalog), 1);
        }

        
        
       /* vm.order.products = [];
       
        function setProducts(catalogstobeorder){
            Catalog.get({'id': catalogstobeorder.id, 'cid':$scope.company_id, "expand":true}).$promise.then(function(result){
                var quantity  = catalogstobeorder.sets;
                var packingtype = catalogstobeorder.packingtype;
                var note  = catalogstobeorder.note;
                
                angular.forEach(result.products, function(product, key) {
                  var prod = {};
                  prod.id = product.id;
                  prod.selling_price = product.selling_price;
                  prod.quantity = quantity;
                  prod.packingtype = packingtype;
                  prod.note = note;
                  prod.image = product.image.thumbnail_small;
                  prod.sku = product.sku;
                  prod.is_select = true ;
                  vm.order.products.push(prod);
                });
            });
        }  */
        vm.order.products = [];
       var fullurl = window.location.href;
        //alert(window.location.href);

       // vm.order.catalogs = {}
        function setProducts(catalogstobeorder, j){
            $scope.catalog_params = {'id': catalogstobeorder.id, 'cid':$scope.company_id, "expand":true};
            if(fullurl.indexOf("received") > -1)
            {
                $scope.catalog_params['view_type'] = "myreceived"; 
            }
            else if(fullurl.indexOf("public") > -1)
            {
                $scope.catalog_params['view_type'] = "public"; 
            }
            //Catalog.get({'id': catalogstobeorder.id, 'cid':$scope.company_id, "expand":true}).$promise.then(function(result){
            Catalog.get($scope.catalog_params).$promise.then(function(result){
                var quantity  = catalogstobeorder.sets;
                var packingtype = catalogstobeorder.packingtype;
                var note  = catalogstobeorder.note;

                vm.order.products[j] = [];
                var catalogsprice = 0;
                angular.forEach(result.products, function(product, key) {
                  var prod = {};
                  prod.id = product.id;
                  prod.selling_price = product.selling_price;
                  prod.quantity = quantity;
                  catalogsprice = catalogsprice + product.selling_price * quantity;
                  prod.packingtype = packingtype;
                  if(note){
                    prod.note = note;
                  }
                  else{
                    prod.note = '';
                  }
                  prod.image = product.image.thumbnail_small;
                  prod.sku = product.sku;
                  prod.is_select = true ;
                  vm.order.products[j].push(prod);

                });
                $scope.catalogstobeorder[j]['catalogsproducts'] = vm.order.products[j];
                $scope.catalogstobeorder[j]['catalogstotalprice'] = catalogsprice;
                console.log($scope.catalogstobeorder[j]);
            });
        }

        $(document).on('click', '.prepareproducts', function () {
            vm.order.products = [];
            //vm.order.catalogs = {};
            console.log($scope.catalogstobeorder.length);
            if($scope.catalogstobeorder.length > 0){
              for(var j = 0; j < ($scope.catalogstobeorder.length); j++){
                  //setProducts($scope.catalogstobeorder[j]);
                  setProducts($scope.catalogstobeorder[j],j);
              }
            }
            else{
               vm.errortoaster = {
                        type:  'error',
                        title: 'Failed',
                        text:  'Please add catalog and then click on next.'
                    };
                    
               toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
            }
            
        });

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

        $scope.CreateOrder= function () {
        //   console.log($scope.catalogstobeorder);
          // console.log(vm.purchaseOrderForm.$valid);
          console.log(vm.purchaseOrderForm.$valid);
            if(vm.purchaseOrderForm.$valid) {
                $(".modelform-order").addClass(progressLoader()); 
                vm.items = []
                var itemno = 0;
                
              /*  for(var i=0; i<(vm.order.products.length); i++){
                    var product = vm.order.products[i];
                    console.log(i)
                    if(product.is_select){
                        vm.items[itemno] = {product:product.id, rate:product.selling_price, quantity:product.quantity, packing_type: product.packingtype, note: product.note};
                        itemno++;
                    }
                } */
                for(var j = 0; j < ($scope.catalogstobeorder.length); j++){
                    for(var i=0; i<($scope.catalogstobeorder[j].catalogsproducts.length); i++){
                        var product = $scope.catalogstobeorder[j].catalogsproducts[i];
                        //console.log(i)
                        if(product.is_select){
                            vm.items[itemno] = {product:product.id, rate:product.selling_price, quantity:product.quantity, packing_type: product.packingtype, note: product.note};
                            itemno++;
                        }
                    }  
                }

                
                
                if(vm.items.length == 0){
                    $(".modelform-order").removeClass(progressLoader());
                    
                    vm.errortoaster = {
                        type:  'error',
                        title: 'Failed',
                        text:  'Please select product'
                    };
                    
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
                    return
                }
                
             
                    
                    //var jsondata = {order_number:vm.order.order_number, company:$scope.company_id, seller_company:vm.order.supplier, cid:$scope.company_id, items:vm.items, processing_status: 'Draft', broker_company:vm.order.agent, note:vm.order.note};
                    //var jsondata = {order_number:vm.order.order_number, company: vm.order.buyer, seller_company:vm.order.supplier, cid:$scope.company_id, items:vm.items, processing_status: 'Draft', broker_company: $scope.company_id, 'note':vm.order.note, 'brokerage_fees': vm.order.brokerage};
                    var jsondata = {company: vm.order.buyer, seller_company:vm.order.supplier, cid:$scope.company_id, items:vm.items, processing_status: 'Draft', broker_company: $scope.company_id, 'note':vm.order.note, 'brokerage_fees': vm.order.brokerage};
                    console.log(jsondata);
                    BrokerageOrders.save(jsondata,
                    function(success){
                        $(".modelform-order").removeClass(progressLoader());
                        $scope.order_id = success.id;
                        
                        $scope.order_number = success.order_number;
                        $scope.suppliername = success.seller_company_name;
                        $scope.orderdate = success.date;

                      /*  PurchaseOrders.get({'id': orderId, 'cid':$scope.company_id, "sub_resource":"catalogwise"}).$promise.then(function(result){
                            
                            
                            for(var c=0; c<(result.catalogs.length); c++){
                                
                            }
                        });  */


                        $scope.invoiceitems = [];
                        //var j = 0;

                        for(var i=0; i < success.items.length; i++ ){
                          var item = {};
                          console.log(success.items[i].id);
                          item.order_item = success.items[i].id;
                          item.qty = success.items[i].quantity;
                          console.log(item);
                          $scope.invoiceitems.push(item);
                          //$scope.invoiceitems[i].order_item = success.items[0].id;
                          //$scope.invoiceitems[i].qty = success.items[0].qty;
                        } 
                        console.log($scope.invoiceitems);


                        vm.successtoaster = {
                            type:  'success', 
                            title: 'Success',
                            text:  'Order has been created successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        ngDialog.close();
                        sharedProperties.setProperty($scope.order_id);
                        sharedProperties.setOrderType('brokerage');
                        vm.openShippingPaymentModal();

                    }); 
 
                
            }
            else 
            {
                //vm.purchaseOrderForm.order_number.$dirty = true;
                vm.purchaseOrderForm.buyer.$dirty = true;
            }
        }


     /* Start: Purchase order Action   */    
     
   /*  $scope.CancelPurchaseOrder = function(){
            if($scope.cancelPurchasepurchaseOrderForm.$valid) {
                $(".modelform-cancel-purchase").addClass(progressLoader()); 
                PurchaseOrders.patch({"id":$scope.order.id, "processing_status": "Cancelled", "buyer_cancel": $scope.order.buyer_cancel, "cid":$scope.company_id },
                function(success){
                        $(".modelform-cancel-purchase").removeClass(progressLoader());
                        ngDialog.close();
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Order cancelled successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $scope.reloadData();
                        if($state.current.name == 'app.order_detail')
                        {
                         $state.go($state.current, {}, {reload: true});
                        }
                  });
            }
            else
            {

                $scope.cancelPurchasepurchaseOrderForm.buyer_cancel.$dirty = true;           
            }
        }

     $scope.order.payment_date = new Date();
        
        $scope.Pay = function(){         
            if($scope.paymentForm.$valid) {
                $(".modelform-pay").addClass(progressLoader()); 
                var paydate = formatDate($scope.order.payment_date);
                //PurchaseOrders.patch({"id":$scope.order.id, "customer_status": "Paid", 'payment_details': $scope.order.payment_details, 'payment_date': paydate, 'cid':$scope.company_id},
                OrderInvoice.save({"id":$scope.order.invoice_id, "amount":$scope.order.invoice_amount, 'mode': $scope.order.mode, 'details': $scope.order.payment_details, 'date': paydate, 'cid':$scope.company_id, 'sub_resource':'payment'},
                function(success){
                        $(".modelform-pay").removeClass(progressLoader());
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
                        if($state.current.name == 'app.order_detail')
                        {
                         $state.go($state.current, {}, {reload: true});
                        }
                  })
            }
            else
            {
                $scope.paymentForm.payment_date.$dirty = true;           
                $scope.paymentForm.mode.$dirty = true;           
                $scope.paymentForm.payment_details.$dirty = true;           
            }            
        } */

      /* End: Purchase order Action   */     
        
    }
})();
