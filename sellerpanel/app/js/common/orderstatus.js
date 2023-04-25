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
        .controller('OrderStatusController', OrderStatusController);

    OrderStatusController.$inject = ['$resource', '$filter', '$scope', 'SalesOrders', 'PurchaseOrders', 'OrderInvoice', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', '$cookies', '$localStorage'];
    function OrderStatusController($resource, $filter,  $scope, SalesOrders, PurchaseOrders, OrderInvoice, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, $cookies, $localStorage) {

        CheckAuthenticated.check();


        var vm = this;

        $scope.company_id = localStorage.getItem('company');
        //$scope.is_staff = localStorage.getItem('is_staff'); //pass user type admin or not
        $scope.is_staff = localStorage.hasOwnProperty("is_staff");


        $scope.modes = ['NEFT','Cheque', 'Zaakpay', 'Other'];

     /*   function base64toHEX(base64) {

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


        $scope.modeChanged = function(mode){
            $scope.order.mode = mode;
            //console.log(mode);
            if(mode == 'Zaakpay'){

               var checksum_string = "amount=" + $scope.zaakpay.amount +"&buyerEmail=" + $scope.zaakpay.buyerEmail +"&buyerPhoneNumber=" + $scope.zaakpay.buyerPhoneNumber +"&currency=" + $scope.zaakpay.currency +"&merchantIdentifier=" + $scope.zaakpay.merchantIdentifier +"&orderId=" + $scope.zaakpay.orderId + "&returnUrl=" + $scope.zaakpay.returnUrl + "&";
               var zaakpay_key = $scope.zaakpay.merchantkey;

               console.log(checksum_string);
               $scope.zaakpay.checksum_value = $scope.CalculateChecksum(checksum_string,zaakpay_key);
            }
        }  */


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

        $scope.CloseDialog = function() {
            ngDialog.close();
        };


        /* Start: Sales order Action   */
     /*   $scope.Accept = function(id){
               SalesOrders.patch({"id": id, "processing_status": "Accepted", "cid":$scope.company_id},
                function(success){
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Order is Accepted'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $scope.reloadData();
                  });
        }  moved to order details and salesorders */

        $scope.processingNoteAdmin = function(){
            if($scope.processingNoteForm.$valid) {
                $(".modelform-cancel").addClass(progressLoader());
             //   SalesOrders.patch({"id":$scope.order.id, "note": $scope.order.processing_note, "cid":$scope.company_id },
                SalesOrders.patch({"id":$scope.order.id, "processing_note": $scope.order.processing_note, "cid":$scope.company_id },
                function(success){
                        $(".modelform-cancel").removeClass(progressLoader());
                        ngDialog.close();
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Note Added successfully.'
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
                $scope.processingNoteForm.processing_note.$dirty = true;
            }
        }


        $scope.CancelOrder = function(){
            if($scope.cancelOrderForm.$valid) {
                $(".modelform-cancel").addClass(progressLoader());
                SalesOrders.patch({"id":$scope.order.id, "processing_status": "Cancelled", "supplier_cancel": $scope.order.supplier_cancel, "cid":$scope.company_id },
                function(success){
                        $(".modelform-cancel").removeClass(progressLoader());
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
                $scope.cancelOrderForm.supplier_cancel.$dirty = true;
            }
        }

        $scope.order.dispatch_date = new Date();

        $scope.CreateInvoice = function () {
            if(vm.invoiceForm.$valid) {
                $(".modelform-invoice").addClass(progressLoader());
                $scope.items = []
                var itemno = 0;

                /*
                for(var i=0; i<($scope.order.products.length); i++){
                    var product = $scope.order.products[i];

                    if(product.is_select){
                        if(product.quantity > 0){
                            $scope.items[itemno] = {order_item:product.id, qty:product.quantity};
                            itemno++;
                        }
                        else{
                            $scope.order.products[i].is_select = false;
                        }
                    }
                }  */
                for(var j = 0; j < ($scope.orderedcatalogs.length); j++){
                    for(var i=0; i<($scope.orderedcatalogs[j].products.length); i++){
                        var product = $scope.orderedcatalogs[j].products[i];

                        if(product.is_select){
                            if(product.quantity > 0){
                                $scope.items[itemno] = {order_item:product.id, qty:product.quantity};
                                itemno++;
                            }
                            /* else{
                                $scope.order.products[i].is_select = false;
                            } */
                        }
                    }
                }
                if($scope.items.length == 0){
                    $(".modelform-invoice").removeClass(progressLoader());

                    vm.errortoaster = {
                        type:  'error',
                        title: 'Failed',
                        text:  'Please select product with minimum quantity of 1'
                    };

                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    return
                }

                var dis_date = $scope.formatDate($scope.order.dispatch_date);

                var jsondata = {order:$scope.order.id, invoiceitem_set:$scope.items,
                    cid:$scope.company_id, invoice_number:$scope.order.invoice_number};
                /*,mode:$scope.order.mode, tracking_number:$scope.order.tracking_number, tracking_details: $scope.order.tracking_details,
                    dispatch_date: dis_date, transporter_courier:$scope.order.transporter_courier*/
                OrderInvoice.save(jsondata,
                function(success){
                    OrderInvoice.save({"id":success.id, "processing_status": "Dispatched", "mode":$scope.order.mode, "tracking_number":$scope.order.tracking_number, "tracking_details": $scope.order.tracking_details, "dispatch_date": dis_date, "cid":$scope.company_id , "sub_resource":"dispatched", "transporter_courier":$scope.order.transporter_courier, "warehouse": $scope.order.warehouse},
                        function(success){
                            $(".modelform-invoice").removeClass(progressLoader());
                            ngDialog.close();
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Order dispatched successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            ngDialog.close();
                            $scope.reloadData();
                    })

                    /*$(".modelform-invoice").removeClass(progressLoader());

                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Invoice has been created successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    ngDialog.close();
                    $scope.reloadData();*/
                    //console.log($state.current)
                    if($state.current.name == 'app.order_detail')
                    {
                     $state.go($state.current, {}, {reload: true});
                    }
                });

            }
            else
            {
                vm.invoiceForm.invoice_number.$dirty = true;
            }
        }



        $scope.transfer = {};
        $scope.Transfer = function (){
           if($scope.transferForm.$valid) {
              $(".modelform-transfer").addClass(progressLoader());
                SalesOrders.save({'id': $scope.buyerId, 'cid':$scope.company_id, 'seller_company':$scope.transfer.buyer, 'sub_resource':'transfer'}).$promise.then(function(result){
                    $(".modelform-transfer").removeClass(progressLoader());
                    ngDialog.close();
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Sales order has been transfered.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    $scope.reloadData();
                    $scope.transfer = {};
                    if($state.current.name == 'app.order_detail')
                    {
                     $state.go($state.current, {}, {reload: true});
                    }
                });
            }
            else
            {
                $scope.transferForm.buyer.$dirty = true;
            }
        }
        /* End: Sales order Action   */

     /* Start: Purchase order Action   */

     $scope.CancelPurchaseOrder = function(){
            if($scope.cancelPurchaseOrderForm.$valid) {
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

                $scope.cancelPurchaseOrderForm.buyer_cancel.$dirty = true;
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
        }

      /* End: Purchase order Action   */

    }
})();
