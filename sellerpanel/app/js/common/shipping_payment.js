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
        .controller('ShippingPaymentController', ShippingPaymentController);

    ShippingPaymentController.$inject = ['$resource', '$filter', '$scope', 'Address', 'wbMondeyLogDashboard', 'v2ShippingCharge', 'State', 'City', 'Catalog', 'SupplierList', 'Company', 'PurchaseOrders', 'OrderInvoice', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', '$cookies', '$localStorage', 'sharedProperties', 'PaymentMethod', 'CreditApprovedLine', 'Suppliers', 'buyerdiscount', 'BrokerageOrders'];
    function ShippingPaymentController($resource, $filter, $scope, Address, wbMondeyLogDashboard, v2ShippingCharge, State, City, Catalog, SupplierList, Company, PurchaseOrders, OrderInvoice, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, $cookies, $localStorage, sharedProperties, PaymentMethod, CreditApprovedLine, Suppliers, buyerdiscount, BrokerageOrders) {
        
        CheckAuthenticated.check();
     
        
        var vm = this;
        
        $scope.company_id = localStorage.getItem('company');
        $scope.is_staff   = localStorage.getItem('is_staff');
        $scope.order = {};
        $scope.zaakpay = {};

        console.log(sharedProperties.getProperty());
        $scope.order_id = sharedProperties.getProperty();
        
        $scope.order_type = sharedProperties.getOrderType()

        //alert($scope.order_type);
        console.log($scope.order_type);


        //$scope.zaakpay.merchantIdentifier = "b19e8f103bce406cbd3476431b6b7973";  // staging
        $scope.zaakpay.merchantIdentifier = "0870060b6fde4b2499a88fe222c518af";  // live

        //$scope.zaakpay.merchantkey = '0678056d96914a8583fb518caf42828a';  //staging
        $scope.zaakpay.merchantkey = '5762bfef22e04d2db83a6617edb6e256';  //live

        $scope.zaakpay.currency = "INR";
        $scope.zaakpay.returnUrl = "https://web.wishbook.io/api/v1/zaakpay/response/";

        
        Company.get({ id: $scope.company_id}, function(cmpdata){
            $scope.zaakpay.buyerEmail = cmpdata.email;
            $scope.zaakpay.buyerPhoneNumber = cmpdata.phone_number;
            $scope.zaakpay.buyerFirstName = cmpdata.name;
            $scope.zaakpay.buyerLastName = " ";
        });    
        /* User.get({ id: $scope.user_id}, function(usrdata){
              $scope.zaakpay.buyerEmail = usrdata.email;
              $scope.zaakpay.buyerPhoneNumber = usrdata.userprofile.phone_number;
          });  */

   /*     if($scope.order_type != 'brokerage'){
          vm.addresses = Address.query();
        } 
        else
        {
          vm.broker_addresses = Address.query();
        }    */ 
        
        console.log(vm.addresses);
        $scope.addaddress = false;
        vm.addNewAddress = function(){
          $scope.addaddress = true;
        }
        vm.CancelAddress = function(){
          $scope.addaddress = false;
        }

        vm.states = State.query();
          
        vm.GetCity =  function(state) { 
          vm.cities = City.query({ state: state });
        }
        $scope.address = {};
        $scope.broker_address_flag = 0;
        vm.SubmitNewAddress = function(){
          console.log($scope.address);
          if($scope.order_type == 'brokerage'){
              Address.save($scope.address, 
              function(success){
               // vm.broker_addresses = Address.query();
               vm.addresses = Address.query({ company: $scope.address.company});
                $scope.addaddress = false;
                $scope.address = {};
                vm.successtoaster = {
                              type:  'success', 
                              title: 'Success',
                              text:  'Address has been added successfully.'
                          };
                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
              });
          }
          else
          {
            Address.save($scope.address, 
                function(success){
                  //vm.addresses = Address.query();
                  vm.addresses = Address.query({ company: $scope.address.company});
                  $scope.addaddress = false;
                  $scope.address = {};
                  vm.successtoaster = {
                                type:  'success', 
                                title: 'Success',
                                text:  'Address has been added successfully.'
                            };
                  toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                });
          }          
        }

        $scope.address_selected = false;
        $scope.shippingcharge = 0;
        $scope.shippingcharge_added = false;
        $scope.shipping_methods = [];
        $scope.wbOnly = false;
        vm.setAddress = function(addressid){
            $scope.order_address_id = addressid;
        /*  if($scope.order_type == 'brokerage'){
            $scope.address_selected = true;
            BrokerageOrders.patch({cid: $scope.company_id, id: $scope.order_id, ship_to: addressid },function(data){
            //  console.log(data);
              v2ShippingCharge.get({ order: $scope.order_id },function(data){
                  //if(data.shipping_charge){
                    $scope.shippingpartner = 'wishbook';
                    document.getElementById("wishbook").checked = true;
                    document.getElementById("wishbook").disabled = false;
                    $scope.shippingcharge = data.shipping_charge;
                    $scope.wbOnly = data.only_wishbook_shipping;
                    $scope.stored_shipcharge = $scope.shippingcharge
                    console.log(data);
                    $scope.shipingModeChanged('wishbook');
                  //}
                }, function(error){
                    $scope.shippingpartner = 'other';
                    $scope.wbOnly = false;
                    console.log('other');
                    document.getElementById("other").checked = true;
                    document.getElementById("wishbook").disabled = true;
                    $scope.shipingModeChanged('other');
                  
                });
              }); 
          }
          else
          {  */
            $scope.address_selected = true;
            PurchaseOrders.patch({cid: $scope.company_id, id: $scope.order_id, ship_to: addressid },function(data){
            //  console.log(data);
             /* v2ShippingCharge.get({ order: $scope.order_id },function(data){
                
                 // if(data.shipping_charge){
                    $scope.shippingpartner = 'wishbook';
                    document.getElementById("wishbook").checked = true;
                    document.getElementById("wishbook").disabled = false;
                    $scope.shippingcharge = data.shipping_charge;
                    $scope.wbOnly = data.only_wishbook_shipping;    
                    $scope.stored_shipcharge = $scope.shippingcharge
                    console.log(data);
                    $scope.shipingModeChanged('wishbook');
                  //}
                }, function(error){
                    $scope.shippingpartner = 'other';
                    $scope.wbOnly = false;
                    console.log('other');
                    document.getElementById("other").checked = true;
                    document.getElementById("wishbook").disabled = true;
                    $scope.shipingModeChanged('other'); 
                });*/

                v2ShippingCharge.query({ order: $scope.order_id },function(data){
                    $scope.shipping_methods = data;
                    for(var i = 0; i < $scope.shipping_methods.length; i++){
                      if($scope.shipping_methods[i].is_default == true){
                        $scope.shippingmethod = $scope.shipping_methods[i].shipping_method_id;
                        $scope.shippingcharge = $scope.shipping_methods[i].shipping_charge;
                        $scope.shippingMethodChanged($scope.shippingmethod);
                      }
                    }
                }, function(error){
                    console.log('error');
                });
                //$scope.stored_shipcharge = $scope.shippingcharge
              });
        //  }
        
        }

  /*      $scope.shipingModeChanged = function(shipping_partner){
          console.log($scope.shippingcharge_added);
          $(".modelform-shippingpayment").addClass(progressLoader());
          if(shipping_partner == 'wishbook'){
              
              //if($scope.shippingcharge_added == false){
            //    alert($scope.stored_shipcharge);
                $scope.shippingcharge = $scope.stored_shipcharge;
                //$scope.order.total_amount = parseFloat($scope.order.total_amount) + $scope.shippingcharge;
                //$scope.order.calculated_total_amount = $scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount + $scope.shippingcharge;
                //$scope.zaakpay.amount = $scope.zaakpay.amount + $scope.shippingcharge*100;
                //$scope.zaakpay.amount = parseInt(($scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount  + $scope.shippingcharge)*100);
                $scope.shippingcharge_added = true;
                PurchaseOrders.patch({cid: $scope.company_id, id: $scope.order_id, ship_to: $scope.order_address_id, shipping_charges: $scope.shippingcharge },function(data){
                    OrderInvoice.get({cid: $scope.company_id, id: $scope.order.invoice_id}, function(success){
                      console.log(success);
                      $scope.shippingcharge = parseFloat(success.shipping_charges);
                      $scope.order.discount = parseFloat(success.seller_discount);
                      $scope.order.pending_amount = parseFloat(success.pending_amount);
                      $scope.order.calculated_total_amount = parseFloat(success.pending_amount);
                      $scope.zaakpay.amount = parseInt((success.pending_amount)*100);
                      $(".modelform-shippingpayment").removeClass(progressLoader());
                    });
                });
              //}
          }
          else{
           //   if($scope.shippingcharge_added == true){
                //$scope.order.total_amount = parseFloat($scope.order.total_amount) - $scope.shippingcharge;
                //$scope.order.calculated_total_amount = $scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount;
                //$scope.zaakpay.amount = $scope.zaakpay.amount - $scope.shippingcharge*100;
                //$scope.zaakpay.amount = parseInt(($scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount)*100);
                $scope.shippingcharge = 0;
                $scope.shippingcharge_added = false;
                PurchaseOrders.patch({cid: $scope.company_id, id: $scope.order_id, ship_to: $scope.order_address_id, shipping_charges: $scope.shippingcharge },function(data){
                    OrderInvoice.get({cid: $scope.company_id, id: $scope.order.invoice_id}, function(success){
                      console.log(success);
                      $scope.shippingcharge = parseFloat(success.shipping_charges);
                      $scope.order.discount = parseFloat(success.seller_discount);
                      $scope.order.pending_amount = parseFloat(success.pending_amount);
                      //$scope.order.calculated_total_amount = parseFloat(success.total_amount);
                      $scope.order.calculated_total_amount = parseFloat(success.pending_amount);
                      $scope.zaakpay.amount = parseInt((success.pending_amount)*100);
                      $(".modelform-shippingpayment").removeClass(progressLoader());
                    });
                });
                
            //  }
          }
       }*/

       $scope.shippingMethodChanged = function(method_id){
        console.log(method_id);
        //console.log($scope.shipping_methods);
         for(var i = 0; i < $scope.shipping_methods.length; i++){
            if($scope.shipping_methods[i].shipping_method_id == method_id){
              $scope.shippingcharge = $scope.shipping_methods[i].shipping_charge;
            }
          }
        console.log($scope.shippingcharge);
        console.log($scope.shippingcharge_added);
          $(".modelform-shippingpayment").addClass(progressLoader());
                //alert($scope.stored_shipcharge);
                //$scope.shippingcharge = $scope.stored_shipcharge;
                //$scope.order.total_amount = parseFloat($scope.order.total_amount) + $scope.shippingcharge;
                //$scope.order.calculated_total_amount = $scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount + $scope.shippingcharge;
                //$scope.zaakpay.amount = $scope.zaakpay.amount + $scope.shippingcharge*100;
                //$scope.zaakpay.amount = parseInt(($scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount  + $scope.shippingcharge)*100);
                $scope.shippingcharge_added = true;
                PurchaseOrders.patch({cid: $scope.company_id, id: $scope.order_id, ship_to: $scope.order_address_id, shipping_charges: $scope.shippingcharge, shipping_method_id: method_id },function(data){
                    OrderInvoice.get({cid: $scope.company_id, id: $scope.order.invoice_id}, function(success){
                      console.log(success);
                      $scope.shippingcharge = parseFloat(success.shipping_charges);
                      $scope.order.discount = parseFloat(success.seller_discount);
                      $scope.order.pending_amount = parseFloat(success.pending_amount);
                      $scope.order.calculated_total_amount = parseFloat(success.pending_amount);
                      $scope.zaakpay.amount = parseInt((success.pending_amount)*100);
                      $(".modelform-shippingpayment").removeClass(progressLoader());
                    });
                });
       }

       $scope.order.discount = 0;
       $scope.order.seller_extra_discount_percentage = 0;
       $scope.order.extra_discount_amount = 0;
       $scope.cashDiscountAmount = 0;
       $scope.crDiscountAmount = 0;
       $scope.order.discount_type = "Cash";
    /*   if($scope.order_type == 'brokerage'){
          // if Brokerage order
           BrokerageOrders.get({'id': $scope.order_id, 'cid':$scope.company_id, "sub_resource":"catalogwise"})
           .$promise.then(function(result){

                    vm.addresses = Address.query({"company": result.company});
                    $scope.address.company = result.company;
                    $scope.products = [];
                    var itemno = 0;
                    $scope.ordered_catalogs = [];
                    for(var c=0; c<(result.catalogs.length); c++){
                        var catalogsprice = 0;
                        var catalogspcs = 0;
                        for(var i=0; i<(result.catalogs[c].products.length); i++){
                            var item = result.catalogs[c].products[i];
                            
                            //var product_quantity = item.pending_quantity;
                            var product_quantity = item.quantity;
                            $scope.products[itemno] = {order_item:item.id, qty:product_quantity};
                            itemno++;

                            //to show on Shipping payment popup
                            catalogsprice = catalogsprice + item.rate * item.quantity;
                            catalogspcs = catalogspcs + item.quantity;
                        }

                        $scope.ordered_catalogs[c] = { title: result.catalogs[c].name, pcs: catalogspcs , catalogsprice: catalogsprice  };

                    }
                    var jsondata = {order: $scope.order_id, invoiceitem_set:$scope.products, cid:$scope.company_id};

                    //PaymentMethod.query({supplier: result.seller_company , buyer: result.company },function(data){

                    BrokerageOrders.get({"id": $scope.order_id, "cid": $scope.company_id, "expand":"true"},
                        function (result){
                            //console.log(JSON.stringify(success));
                            $scope.orderdetail = result;
                            $scope.order_invoice = result.invoice;
                            if(result.ship_to != null){
                              vm.orderaddress = result.ship_to.id;
                              vm.setAddress(result.ship_to.id);
                            }
                          //  if($scope.order_invoice.length == 0 ){
                                OrderInvoice.save(jsondata,
                                function(success){
                                    
                                    $scope.order.id = $scope.order_id;
                                   
                                    $scope.order.invoice_id = success.id;
                                    $scope.order.amount = parseFloat(success.amount);
                       
                                   // $scope.order.discount = parseFloat(success.seller_discount); 
                                    $scope.extra_discount_amount = (parseFloat($scope.order.amount) * parseFloat($scope.order.seller_extra_discount_percentage))/100;
                                    $scope.order.tax_lable1 = success.tax_class_1;
                                    $scope.order.tax_lable2 = success.tax_class_2;

                                    $scope.order.tax_value1 = parseFloat(success.total_tax_value_1);
                                    $scope.order.tax_value2 = parseFloat(success.total_tax_value_2);
                                    
                                    
                                     // Start: Zaakpay  
                                    
                                    $scope.zaakpay.orderId = success.id;
                            

                                     // End: Zaakpay  
                                    Suppliers.query({cid: $scope.company_id, company: result.seller_company, buying_company: result.company }, function(data){
                                          console.log(data);
                                          if(data.length == 0){

                                              console.log("buyer relationship not found");
                                              buyerdiscount.query({supplier: result.seller_company }, function(data){
                                              console.log(data);

                                              angular.forEach(data, function(value, key) {
                                                        
                                                      if(value.buyer_type == "Public"){
                                                            if(value.cash_discount !=  null){
                                                              $scope.supplierCashDiscount = value.cash_discount;
                                                            }
                                                            else
                                                            {
                                                              $scope.supplierCashDiscount = 0;
                                                            }

                                                            if(value.discount != null){
                                                              $scope.supplierCreditDiscount = value.discount;
                                                            }
                                                            else{
                                                              $scope.supplierCreditDiscount = 0;
                                                            }
                                                            
                                                            
                                                            $scope.crDiscountAmount = (parseFloat($scope.order.amount) * parseFloat($scope.supplierCreditDiscount))/100;
                                                            $scope.cashDiscountAmount = (parseFloat($scope.order.amount) * parseFloat($scope.supplierCashDiscount))/100;
                                                            
                                                            $scope.order.discount = $scope.cashDiscountAmount;
                                                            $scope.order.discount_type = "Cash";
                                                          //  $scope.crPayableAmount = $scope.order.amount  + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.crDiscountAmount;

                                                            console.log($scope.order.amount + " " + $scope.order.tax_value1 + " " + $scope.order.tax_value2 + " " + $scope.order.discount + " " );
                                                            //console.log("crPayableAmount: "+$scope.crPayableAmount);
                                                            
                                                            $scope.order.calculated_total_amount = $scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount + $scope.shippingcharge;
                                                            $scope.zaakpay.amount = parseInt(($scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount  + $scope.shippingcharge)*100);
                                                            console.log('amount calculated:')
                                                            console.log($scope.order.calculated_total_amount);
                                                            console.log($scope.zaakpay.amount);
                                                      }
                                                    });
                                            });  //end : buyerdiscount query
                                          }
                                          else{
                                                console.log("buyer relationship found");
                                                if(data[0].cash_discount != null){
                                                  $scope.supplierCashDiscount = data[0].cash_discount;
                                                }
                                                else{
                                                  $scope.supplierCashDiscount = 0;
                                                }

                                                if(data[0].discount != null){
                                                  $scope.supplierCreditDiscount = data[0].discount;
                                                }
                                                else{
                                                  $scope.supplierCreditDiscount = 0;
                                                }

                                                console.log(data[0]);

                                                
                                                $scope.crDiscountAmount = (parseFloat($scope.order.amount) * parseFloat($scope.supplierCreditDiscount))/100;
                                                $scope.cashDiscountAmount = (parseFloat($scope.order.amount) * parseFloat($scope.supplierCashDiscount))/100;
                                                $scope.order.discount = $scope.cashDiscountAmount;
                                                $scope.order.discount_type = "Cash";
                                               // $scope.crPayableAmount = parseFloat($scope.order.amount)  + parseFloat($scope.order.tax_value1) + parseFloat($scope.order.tax_value2) - parseFloat($scope.crDiscountAmount);
                                                
                                                console.log($scope.order.amount + " " + $scope.order.tax_value1 + " " + $scope.order.tax_value2 + " " + $scope.order.discount + " " );
                                              //  console.log("crPayableAmount: "+$scope.crPayableAmount);
                                                $scope.order.calculated_total_amount = $scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount + $scope.shippingcharge;
                                                $scope.zaakpay.amount = parseInt(($scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount  + $scope.shippingcharge)*100);
                                                console.log('amount calculated:')
                                                console.log($scope.order.calculated_total_amount);
                                                console.log($scope.zaakpay.amount);
                                          }
                                      });  //end : Suppliers query
                                          console.log($scope.order.amount + " " + $scope.order.tax_value1 + " " + $scope.order.tax_value2 + " " + $scope.order.discount + " " );
                                          $scope.order.calculated_total_amount = $scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount + $scope.shippingcharge;
                                          $scope.zaakpay.amount = parseInt(($scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount  + $scope.shippingcharge)*100);
                                          console.log('amount calculated:')
                                          console.log($scope.order.calculated_total_amount);
                                          console.log($scope.zaakpay.amount);
                                }); // end : invoice.save
                          // } // end if: invoice is not created
                          // else: was taking and showing data from already created invoice, now need to post/create invoice everytime.


                        }); //end : Brokerageorder get expand true
                }); //end : Brokerageorder get catalogwise

       }
       else 
       {   */   
            // else Purchase order   
            PurchaseOrders.get({'id': $scope.order_id, 'cid':$scope.company_id, "sub_resource":"catalogwise"})
           .$promise.then(function(result){
                    wbMondeyLogDashboard.get({'cid': $scope.company_id, 'company': result.company},function(success){
                       console.log(success);
                       $scope.available_wbmoney = success.total_available;
                    });
                    $scope.products = [];
                    var itemno = 0;
                    $scope.ordered_catalogs = [];
                    $scope.order.seller_extra_discount_percentage = result.seller_extra_discount_percentage;
                    for(var c=0; c<(result.catalogs.length); c++){
                        var catalogsprice = 0;
                        var catalogspcs = 0;
                        for(var i=0; i<(result.catalogs[c].products.length); i++){
                            var item = result.catalogs[c].products[i];
                            
                            //var product_quantity = item.pending_quantity;
                            var product_quantity = item.quantity;
                            $scope.products[itemno] = {order_item:item.id, qty:product_quantity};
                            itemno++;

                            //to show on Shipping payment popup
                            catalogsprice = catalogsprice + item.rate * item.quantity;
                            catalogspcs = catalogspcs + item.quantity;
                        }

                        $scope.ordered_catalogs[c] = { title: result.catalogs[c].name, pcs: catalogspcs , catalogsprice: catalogsprice  };

                    }
                    var jsondata = {order: $scope.order_id, invoiceitem_set:$scope.products, cid:$scope.company_id};

                   // PaymentMethod.query({supplier: result.seller_company , buyer: $scope.company_id},function(data){
                    

                    PurchaseOrders.get({"id": $scope.order_id, "cid": $scope.company_id, "expand":"true"},
                        function (result){
                            //console.log(JSON.stringify(success));
                            $scope.orderdetail = result;
                            $scope.supplierCashDiscount = parseFloat(result.current_discount);
                            $scope.address.company = $scope.orderdetail.company;
                            $scope.order_invoice = result.invoice;
                         /*   vm.addresses = Address.query({ company: $scope.orderdetail.company},function(success){
                                if(result.ship_to != null){
                                  vm.orderaddress = result.ship_to.id;
                                  vm.setAddress(result.ship_to.id);
                                }
                            });  */
                            
                       //  if($scope.order_invoice.length == 0 )   {
                              OrderInvoice.save(jsondata,
                                function(success){
                                    
                                    $scope.order.id = $scope.order_id;
                                   
                                    $scope.order.invoice_id = success.id;
                                    vm.addresses = Address.query({ company: $scope.orderdetail.company},function(data){
                                        if($scope.orderdetail.ship_to != null){
                                          vm.orderaddress = $scope.orderdetail.ship_to.id;
                                          vm.setAddress($scope.orderdetail.ship_to.id);
                                        }
                                    });
                                    $scope.order.amount = parseFloat(success.amount);
                                    $scope.extra_discount_amount = (parseFloat($scope.order.amount) * parseFloat($scope.order.seller_extra_discount_percentage))/100;
                                    $scope.order.total_amount = parseFloat(success.total_amount);
                                    $scope.order.pending_amount = parseFloat(success.pending_amount);
                     

                                    $scope.order.tax_lable1 = success.tax_class_1;
                                    $scope.order.tax_lable2 = success.tax_class_2;

                                    $scope.order.tax_value1 = parseFloat(success.total_tax_value_1);
                                    $scope.order.tax_value2 = parseFloat(success.total_tax_value_2);
                                    
                                    //$scope.order.calculated_total_amount = $scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount + $scope.shippingcharge;
                                    $scope.shippingcharge = parseFloat(success.shippingcharge);
                                    $scope.order.discount = parseFloat(success.seller_discount);

                                    $scope.order.calculated_total_amount = $scope.order.pending_amount;
                                    $scope.zaakpay.amount = parseInt(($scope.order.pending_amount)*100);
                                    /* Start: Zaakpay  */
                                    
                                    $scope.zaakpay.orderId = success.id;
                                    

                                    /* End: Zaakpay  */
                                  /*  Suppliers.query({cid: $scope.company_id, company: result.seller_company}, function(data){
                                    console.log(data);
                                    if(data.length == 0){

                                        console.log("buyer relationship not found");
                                        buyerdiscount.query({supplier: result.seller_company }, function(data){
                                        console.log(data);

                                        angular.forEach(data, function(value, key) {
                                                  
                                                if(value.buyer_type == "Public"){
                                                      if(value.cash_discount !=  null){
                                                        $scope.supplierCashDiscount = value.cash_discount;
                                                      }
                                                      else
                                                      {
                                                        $scope.supplierCashDiscount = 0;
                                                      }

                                                      if(value.discount != null){
                                                        $scope.supplierCreditDiscount = value.discount;
                                                      }
                                                      else{
                                                        $scope.supplierCreditDiscount = 0;
                                                      }
                                                      
                                                      
                                                      $scope.crDiscountAmount = (parseFloat($scope.order.amount) * parseFloat($scope.supplierCreditDiscount))/100;
                                                      $scope.cashDiscountAmount = (parseFloat($scope.order.amount) * parseFloat($scope.supplierCashDiscount))/100;
                                                      //$scope.cashDiscountAmount = parseFloat($scope.order_invoice[0].seller_discount);

                                                      $scope.order.discount = $scope.cashDiscountAmount;
                                                      $scope.order.discount_type = "Cash";

                                                     // $scope.crPayableAmount = $scope.order.amount  + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.crDiscountAmount;

                                                      console.log($scope.order.amount + " " + $scope.order.tax_value1 + " " + $scope.order.tax_value2 + " " + $scope.order.discount + " " );
                                                     // console.log("crPayableAmount: "+$scope.crPayableAmount);
                                                      
                                                      $scope.order.calculated_total_amount = $scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount + $scope.shippingcharge;
                                                      $scope.zaakpay.amount = parseInt(($scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount  + $scope.shippingcharge)*100);
                                                      console.log('amount calculated:')
                                                      console.log($scope.order.calculated_total_amount);
                                                      console.log($scope.zaakpay.amount);
                                                }
                                              });
                                      });  //end : buyerdiscount query
                                    }
                                    else{
                                          console.log("buyer relationship found");
                                          if(data[0].cash_discount != null){
                                            $scope.supplierCashDiscount = data[0].cash_discount;
                                          }
                                          else{
                                            $scope.supplierCashDiscount = 0;
                                          }

                                          if(data[0].discount != null){
                                            $scope.supplierCreditDiscount = data[0].discount;
                                          }
                                          else{
                                            $scope.supplierCreditDiscount = 0;
                                          }

                                          console.log(data[0]);

                                          
                                          $scope.crDiscountAmount = (parseFloat($scope.order.amount) * parseFloat($scope.supplierCreditDiscount))/100;
                                          $scope.cashDiscountAmount = (parseFloat($scope.order.amount) * parseFloat($scope.supplierCashDiscount))/100;
                                          $scope.order.discount = $scope.cashDiscountAmount;
                                          $scope.order.discount_type = "Cash";
                                         // $scope.crPayableAmount = parseFloat($scope.order.amount)  + parseFloat($scope.order.tax_value1) + parseFloat($scope.order.tax_value2) - parseFloat($scope.crDiscountAmount);
                                          
                                          console.log($scope.order.amount + " " + $scope.order.tax_value1 + " " + $scope.order.tax_value2 + " " + $scope.order.discount + " " );
                                         // console.log("crPayableAmount: "+$scope.crPayableAmount);
                                          $scope.order.calculated_total_amount = $scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount + $scope.shippingcharge;
                                          $scope.zaakpay.amount = parseInt(($scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount  + $scope.shippingcharge)*100);
                                          console.log('amount calculated:')
                                          console.log($scope.order.calculated_total_amount);
                                          console.log($scope.zaakpay.amount);
                                    }
                                }); */ //end : Suppliers query
                                  /*  console.log($scope.order.amount + " " + $scope.order.tax_value1 + " " + $scope.order.tax_value2 + " " + $scope.order.discount + " " );
                                    $scope.order.calculated_total_amount = $scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount + $scope.shippingcharge;
                                    $scope.zaakpay.amount = parseInt(($scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.order.discount - $scope.extra_discount_amount  + $scope.shippingcharge)*100);
                                    console.log('amount calculated:')
                                    console.log($scope.order.calculated_total_amount);
                                    console.log($scope.zaakpay.amount);  */

                                });  // end :  OrderInvoice.save
                           // } // end if: invoice is not created
                           // else: was taking and showing data from already created invoice, now need to post/create invoice everytime.

                             
                        }); //end : Purchaseroder get expand true
                }); //end : Purchaseroder get catalogwise
         //   } // end else : purchaser order
            $scope.patchWBmoney = function(wbm_amount){
              $(".modelform-shippingpayment").addClass(progressLoader());
              OrderInvoice.patch({'id': $scope.order.invoice_id, 'cid':$scope.company_id, 'wbmoney_points_used': wbm_amount },function(success){
                      $scope.shippingcharge = parseFloat(success.shipping_charges);
                      $scope.order.discount = parseFloat(success.seller_discount);
                      $scope.order.pending_amount = parseFloat(success.pending_amount);
                      $scope.order.wbmoney_points_used = parseInt(success.wbmoney_points_used);
                      $scope.order.calculated_total_amount = parseFloat(success.pending_amount);
                      $scope.zaakpay.amount = parseInt((success.pending_amount)*100);
                      $(".modelform-shippingpayment").removeClass(progressLoader());
              });
            }
            $scope.wbMoneySelected = function(){
              console.log($scope.order.wbmoney);
              if($scope.order.wbmoney){
                if($scope.available_wbmoney > $scope.order.pending_amount)
                {
                  $scope.patchWBmoney(Math.round($scope.order.pending_amount));
                }
                else{
                  $scope.patchWBmoney($scope.available_wbmoney);
                }
              }
              else
              {
                $scope.patchWBmoney(0);
              }
            }
            $scope.creditline = {};
            $scope.updateOrder =  function(){
              /*if($scope.shippingpartner == 'wishbook'){
                $scope.shipping_provider = "WB Provided";
              }
              else{
                $scope.shipping_provider = "Buyer Suggested"; 
              }*/
              // WB-3832 SuperAdmin: On Mark as Paid - support multiple shipping charges
              $scope.shipping_provider = "WB Provided";
              if($scope.order_type == 'brokerage'){
                BrokerageOrders.patch({cid: $scope.company_id, id : $scope.order_id , preffered_shipping_provider: $scope.shipping_provider, shipping_charges : $scope.shippingcharge},function(data){
                    console.log(data);
                  },
                  function(error){
                    console.log(error);
                  });
              }
              else
              {
                PurchaseOrders.patch({cid: $scope.company_id, id : $scope.order_id , preffered_shipping_provider: $scope.shipping_provider, shipping_charges : $scope.shippingcharge},function(data){
                    console.log(data);
                  },
                  function(error){
                    console.log(error);
                  });
              }

              PaymentMethod.query({order: $scope.order_id}, function(data){
                      $scope.paymentMethod = data;
                      $scope.credit = false;
                      $scope.online = false;
                      $scope.offline = false;
                      $scope.COD = false;
                      $scope.wishbookcredit = false;
                      $scope.wcdisable = false;
                      for(var i=0;i<$scope.paymentMethod.length;i++)
                        {
                          if($scope.paymentMethod[i].payment_type == 'Offline')
                          {
                            $scope.offline = true;
                          }
                          if($scope.paymentMethod[i].payment_type == 'Online')
                          {
                            $scope.online = true;
                          }
                          if($scope.paymentMethod[i].payment_type == 'Credit')
                          {
                            $scope.credit = true;
                          }
                          if($scope.paymentMethod[i].payment_type == 'Cash on Delivery')
                          {
                            $scope.COD = true;
                          }
                        }
                      console.log(data);
                      CreditApprovedLine.query({'cid': $scope.company_id, 'company': $scope.orderdetail.company},function(result){
                        console.log(result);
                        if(result.length > 0){
                          $scope.creditline.approved_line = parseFloat(result[0].approved_line);
                          $scope.creditline.used_line = parseFloat(result[0].used_line);
                          $scope.creditline.available_line = parseFloat(result[0].available_line);
                          $scope.wishbookcredit = true;
                          if($scope.creditline.available_line < $scope.order.calculated_total_amount){
                            $scope.wcdisable = true;
                          }
                        }
                      });
                    }); //end : paymentmethod query   

              
            }
            
            $scope.dt = new Date();

            $scope.order.payment_date = $scope.dt;

            $scope.format = 'yyyy-MM-dd';
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
            $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };
            
            $scope.CloseDialog = function() {
                ngDialog.close();
            };
            /*$scope.reloadData = function() {
                var resetPaging = false;
                vm.dtInstance.reloadData(callback, resetPaging);
            } */
            function base64toHEX(base64) {
              var raw = atob(base64);
              var HEX = '';
              for (var i = 0; i < raw.length; i++ ) {
                var _hex = raw.charCodeAt(i).toString(16)
                HEX += (_hex.length==2?_hex:'0'+_hex);
              }
              return HEX;
            }

            $scope.CalculateChecksum = function(checksumstr, key){
                var hash = CryptoJS.HmacSHA256(checksumstr, key);
                var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
                console.log(hash);
                console.log(hashInBase64);
                console.log(base64toHEX(hashInBase64));
                return base64toHEX(hashInBase64);
            }

            $scope.prepaidAmountChanged = function(){
               $scope.order.pending_amount = $scope.order.calculated_total_amount - $scope.order.prepaid_amount;
               $scope.order.pending_amount = $scope.order.pending_amount.toFixed(2);
               console.log($scope.order.pending_amount);
            }
            $scope.paymentmethodChanged = function(mode){
                $scope.order.mode = mode;
                //console.log(mode);
                if(mode == 'Zaakpay'){

                   var checksum_string = "amount=" + $scope.zaakpay.amount 
                                        + "&buyerEmail=" + $scope.zaakpay.buyerEmail 
                                        +"&buyerFirstName=" + $scope.zaakpay.buyerFirstName 
                                        + "&buyerLastName=" + $scope.zaakpay.buyerLastName 
                                        +"&buyerPhoneNumber=" + $scope.zaakpay.buyerPhoneNumber 
                                        +"&currency=" + $scope.zaakpay.currency 
                                        +"&merchantIdentifier=" + $scope.zaakpay.merchantIdentifier 
                                        +"&orderId=" + $scope.zaakpay.orderId 
                                        + "&returnUrl=" + $scope.zaakpay.returnUrl + "&";
                   var zaakpay_key = $scope.zaakpay.merchantkey;

                   console.log(checksum_string);
                   console.log(zaakpay_key);
                   $scope.zaakpay.checksum_value = $scope.CalculateChecksum(checksum_string,zaakpay_key);
                   
                   $scope.order.calculated_total_amount = parseFloat($scope.order.pending_amount);
                   $scope.zaakpay.amount = parseInt(($scope.order.pending_amount)*100);
                }
                if(mode == 'COD'){
                  //$scope.order.discount = parseFloat($scope.cashDiscountAmount);
                  //console.log($scope.order.discount);
                  $scope.order.discount_type = "Cash";
                  //$scope.order.calculated_total_amount = $scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.cashDiscountAmount + $scope.shippingcharge;
                  $scope.order.calculated_total_amount =  $scope.order.prepaid_amount;
                 
                  $scope.zaakpay.amount = parseInt(($scope.order.pending_amount)*100);
                }
                if(mode == 'Credit'){
                  //$scope.order.discount = parseFloat($scope.crDiscountAmount);
                 
                  $scope.order.discount_type = "Credit";
                 
                 // $scope.order.calculated_total_amount = $scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.crDiscountAmount - $scope.extra_discount_amount + $scope.shippingcharge;
                 // $scope.zaakpay.amount = parseInt(($scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.crDiscountAmount - $scope.extra_discount_amount  + $scope.shippingcharge)*100);
                  $scope.order.calculated_total_amount = parseFloat($scope.order.pending_amount + $scope.order.discount);
                  $scope.zaakpay.amount = parseInt(($scope.order.pending_amount - $scope.order.discount)*100);
                  //$scope.order.discount = 0;
                }
                else 
                {
                  //console.log($scope.cashDiscountAmount);
                 // $scope.order.discount = parseFloat($scope.cashDiscountAmount);
                  //console.log($scope.order.discount);
                  $scope.order.discount_type = "Cash";
                  //$scope.order.total_amount = parseFloat($scope.cashPayableAmount) + $scope.shippingcharge;
                  $scope.order.calculated_total_amount = parseFloat($scope.order.pending_amount);
                  $scope.zaakpay.amount = parseInt(($scope.order.pending_amount)*100);
                  //$scope.zaakpay.amount = parseInt(($scope.order.amount + $scope.order.tax_value1 + $scope.order.tax_value2 - $scope.cashDiscountAmount - $scope.extra_discount_amount  + $scope.shippingcharge)*100);
                }
            }

            $scope.savePay = function(){         

              if($scope.order.paymentmethod == 'Credit'){

                  $(".modelform-shippingpayment").addClass(progressLoader());
                  
                  var jsondata = {cid: $scope.company_id, id : $scope.order_id ,payment_details: 'BUY ON CREDIT'}
                  if($scope.orderdetail.processing_status == "Cart" | $scope.orderdetail.processing_status == "Draft"){
          jsondata['processing_status'] = 'Pending'
          }
                  
                  if($scope.order_type == 'brokerage'){
                      BrokerageOrders.patch(jsondata).$promise.then(
                    function(success){
                          $(".modelform-shippingpayment").removeClass(progressLoader());
                          ngDialog.close();
                          vm.successtoaster = {
                              type:  'success',
                              title: 'Success',
                              text:  'Payment details saved successfully.'
                          };
                          toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                          //$scope.order.payment_date = new Date();
                          //$scope.order.payment_details = ""
                          //$scope.reloadData();
                          $scope.order = {};
                          console.log($state.current.name);
                          if($state.current.name == 'app.order_detail')
                          {
                           $state.go($state.current, {}, {reload: true});
                          }
                    });
                  }
                  else
                  {
                      PurchaseOrders.patch(jsondata).$promise.then(
                    function(success){
                          $(".modelform-shippingpayment").removeClass(progressLoader());
                          ngDialog.close();
                          vm.successtoaster = {
                              type:  'success',
                              title: 'Success',
                              text:  'Payment details saved successfully.'
                          };
                          toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                          //$scope.order.payment_date = new Date();
                          //$scope.order.payment_details = ""
                        //  $scope.reloadData();
                          $scope.order = {};
                          if($state.current.name == 'app.order_detail')
                          {
                           $state.go($state.current, {}, {reload: true});
                          }
                    });
                  }
                
              }
              else if($scope.order.paymentmethod == 'COD'){
                   if(vm.shippingPaymentForm.$valid) {
                      $(".modelform-shippingpayment").addClass(progressLoader());
                      var paydate = formatDate($scope.order.payment_date);
                      
                      //PurchaseOrders.patch({"id":$scope.order.id, "customer_status": "Paid", 'payment_details': $scope.order.payment_details, 'payment_date': paydate, 'cid':$scope.company_id},
                      //OrderInvoice.save({"id": $scope.order.invoice_id, "amount":$scope.order.total_amount, 'mode': $scope.order.paymentmethod, 'details': $scope.order.payment_details, 'date': paydate, 'cid':$scope.company_id, 'sub_resource':'payment'},
                      OrderInvoice.save({"id": $scope.order.invoice_id, "amount":$scope.order.prepaid_amount, 'mode': $scope.order.paymentmethod, 'details': $scope.order.payment_details, 'date': paydate, 'cid':$scope.company_id, 'sub_resource':'payment'},
                      
                      function(success){
                              $(".modelform-shippingpayment").removeClass(progressLoader());
                              ngDialog.close();
                              vm.successtoaster = {
                                  type:  'success',
                                  title: 'Success',
                                  text:  'Payment details saved successfully.'
                              };
                              toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                              //$scope.order.payment_date = new Date();
                              //$scope.order.payment_details = ""
                              //$scope.reloadData();
                              console.log($state.current.name);
                              $scope.order = {};
                              if($state.current.name == 'app.order_detail')
                              {
                               $state.go($state.current, {}, {reload: true});
                              }
                        })
                  }
                  else
                  {
                      vm.shippingPaymentForm.payment_date.$dirty = true;           
                      vm.shippingPaymentForm.paymentmethod.$dirty = true;           
                     // $scope.shippingPaymentForm.payment_details.$dirty = true;           
                  }  
              }
              else{
                  
                  if($scope.order.paymentmethod == 'Cheque'){
                    $scope.order.payment_details = "Bank Name: "+ $scope.order.bank_name + "\nCheque Number: " + $scope.order.cheque_number;
                  }
                   if($scope.order.paymentmethod == 'NEFT'){
                    $scope.order.payment_details = "Transcation ID: "+ $scope.order.transcation_id;
                  }
                 // console.log($scope.order.invoice_id);
                  if(vm.shippingPaymentForm.$valid) {
                      $(".modelform-shippingpayment").addClass(progressLoader());
                      var paydate = formatDate($scope.order.payment_date);
                      
                      //PurchaseOrders.patch({"id":$scope.order.id, "customer_status": "Paid", 'payment_details': $scope.order.payment_details, 'payment_date': paydate, 'cid':$scope.company_id},
                      //OrderInvoice.save({"id": $scope.order.invoice_id, "amount":$scope.order.total_amount, 'mode': $scope.order.paymentmethod, 'details': $scope.order.payment_details, 'date': paydate, 'cid':$scope.company_id, 'sub_resource':'payment'},
                      OrderInvoice.save({"id": $scope.order.invoice_id, "amount":$scope.order.calculated_total_amount, 'mode': $scope.order.paymentmethod, 'details': $scope.order.payment_details, 'date': paydate, 'cid':$scope.company_id, 'sub_resource':'payment'},
                      
                      function(success){
                              $(".modelform-shippingpayment").removeClass(progressLoader());
                              ngDialog.close();
                              vm.successtoaster = {
                                  type:  'success',
                                  title: 'Success',
                                  text:  'Payment details saved successfully.'
                              };
                              toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                              //$scope.order.payment_date = new Date();
                              //$scope.order.payment_details = ""
                              //$scope.reloadData();
                              $scope.order = {};
                              if($state.current.name == 'app.order_detail')
                              {
                               $state.go($state.current, {}, {reload: true});
                              }
                        })
                  }
                  else
                  {
                      vm.shippingPaymentForm.payment_date.$dirty = true;           
                      vm.shippingPaymentForm.paymentmethod.$dirty = true;           
                     // $scope.shippingPaymentForm.payment_details.$dirty = true;           
                  }  
              }          
          }

    }  // end :  function ShippingPaymentController
})();
