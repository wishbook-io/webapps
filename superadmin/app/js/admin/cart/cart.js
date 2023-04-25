/*start - form wizard */
(function() {
    'use strict';
    angular
        .module('app.cart')
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
        .module('app.order')
        .controller('CartController', CartController);

    CartController.$inject = ['$resource','$http','$httpParamSerializer',  'toaster', 'ngDialog', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', 'SalesOrders', 'Company', 'PurchaseOrders', 'Warehouse', 'OrderInvoice', 'sharedProperties', '$stateParams','Notification','NotificationEntity','NotificationTemplate'];
    function CartController($resource, $http, $httpParamSerializer, toaster, ngDialog, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state,  $filter, SalesOrders, Company, PurchaseOrders, Warehouse, OrderInvoice, sharedProperties, $stateParams,Notification,NotificationEntity,NotificationTemplate) {
        CheckAuthenticated.check();
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
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


        $scope.company_id = 0;
        if(localStorage.hasOwnProperty("company")){
            $scope.company_id = localStorage.getItem('company');
        }
        $scope.is_staff = localStorage.hasOwnProperty("is_staff");

        console.log($scope.company_id);
        console.log($scope.is_staff);

        //createorder start
        vm.CloseDialog = function() {
            ngDialog.close();
        };

        $scope.order = {};

        $scope.Accept = function(id){
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

        $scope.PlaceToShipRocket = function(id, combine_multiple, ids){
          $scope.order.id = id;
          $scope.combine_multiple = combine_multiple;
          $scope.order_ids = ids;
          console.log(id);
          $scope.matrix = {
            'length': '',
            'breadth': '',
            'height': '',
            'weight': '',
          }
          $scope.service = false
          $scope.service_detail = null
          console.log($scope.matrix);
          SalesOrders.save({'id': $scope.order.id,"order_ids" : $scope.order_ids, 'cid':$scope.company_id,"pickup": true, "sub_resource":"placetoship"}).$promise.then(function(result){
                if (result.status_code == 500) {
                                    vm.errortoaster = {
                                        type:  'error',
                                        title: 'Failed',
                                        text:  result.message
                                    };
                                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                }
                else {
                  // $scope.piclupLocationList = result.data.shipping_address;
                  $scope.piclupLocationList = result.pickup_locations.data.shipping_address;
                  console.log(result);
                  vm.pickup_location = $scope.piclupLocationList[0]
                  $scope.value_list  = result.name_value_list
                  $scope.OpenPlaceToShipRocketDialog();
                }
          });
        }
        $scope.OpenPlaceToShipRocketDialog = function () {
            ngDialog.open({
                template: 'placeorderonshiprocket',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        }


        vm.placeorderonshiprocket = function(){
          console.log($scope.pickup_location);
            if(vm.ShipForm.$valid) {
                $(".modelform4").addClass(progressLoader());
                console.log($scope.matrix);
                console.log($scope.matrix.length);
                if (!vm.pickup_location) {
                  $(".modelform4").removeClass(progressLoader());
                  vm.errortoaster = {
                               type:  'error',
                               title: 'Medium',
                               text:  'Please Select a Pickup Location'
                           };
                 toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                  return
                }
                    SalesOrders.save({'id': $scope.order.id,
                      "order_ids" : $scope.order_ids,
                      'cid':$scope.company_id,
                      "length": $scope.matrix.length,
                      "breadth": $scope.matrix.breadth,
                      "height": $scope.matrix.height,
                      "weight":$scope.matrix.weight,
                      "awb_creation": false,
                      "combine_multiple" : $scope.combine_multiple,
                      "pickup_location" : vm.pickup_location,
                      "value_list": $scope.value_list,
                      "sub_resource":"placetoship"
                    },
                    function(success){
                            $(".modelform4").removeClass(progressLoader());
                            ngDialog.close();
                            if (success.status_code == 500) {
                              vm.errortoaster = {
                                  type:  'error',
                                  title: 'Failed',
                                  text:  success.message
                              };
                              toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                            }
                            else
                            {
                                vm.successtoaster = {
                                    type:  'success',
                                    title: 'Success',
                                    text:  'Order Created successfully on ShipRocket.'
                                };
                                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                $scope.service            = true;
                                $scope.ship_order_id      = success.ship_order_id;
                                $scope.order_shipment_id  = success.order_shipment_id;
                                $scope.service_detail     = success.data;
                                if ($scope.service_detail) {
                                  vm.courierid              = $scope.service_detail.recommended_courier_company_id;
                                }
                                console.log(success);
                                if (success.status == 404) {
                                  vm.errortoaster = {
                                      type:  'error',
                                      title: 'Failed',
                                      text:  success.message
                                  };
                                  toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                                }
                                else {
                                  ngDialog.open({
                                    template: 'shiprocketcourierdetails',
                                    scope: $scope,
                                    className: 'ngdialog-theme-default',
                                    closeByDocument: false
                                  });
                                }
                            }

                            // $scope.reloadData();
                      });
            }
            else
            {
              vm.errortoaster = {
                  type:  'error',
                  title: 'Failed',
                  text:  'Some error occured!'
              };
              toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }
        }
        vm.ShipAWB = function(courierid,order_id){
          $(".modelform4").addClass(progressLoader());
          console.log("hello");
          console.log($scope.order_id);
          console.log(order_id);
          console.log($scope.ship_order_id);
          console.log($scope.order_shipment_id);
          console.log(courierid);
          console.log($scope.combine_multiple);
          console.log($scope.order_ids);
          SalesOrders.save({'id': $scope.order.id,"order_ids" : $scope.order_ids,"courierid": courierid, 'cid':$scope.company_id,"ship_order_id":$scope.ship_order_id, "order_shipment_id": $scope.order_shipment_id ,"awb_creation": true,"combine_multiple" : $scope.combine_multiple,"sub_resource":"placetoship"},
          function(success){
            console.log(success);

                  $(".modelform4").removeClass(progressLoader());
                  ngDialog.close();
                  vm.successtoaster = {
                      type:  'success',
                      title: 'Success',
                      text:  'AWB number is successfully generated on ShipRocket and Invoice is Dispatched.'
                  };
                  toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  var hiddenElement1 = document.createElement('a');
                  hiddenElement1.href = success.label_url;
                  hiddenElement1.target = '_blank';
                  hiddenElement1.download = 'label.pdf';
                  hiddenElement1.click();
                  if (success.manifest_url) {
                    var hiddenElement2 = document.createElement('a');
                    hiddenElement2.href = success.manifest_url;
                    hiddenElement2.target = '_blank';
                    hiddenElement2.download = 'manifest.pdf';
                    hiddenElement2.click();
                  }
                  if (success.invoice_url) {
                    var hiddenElement3 = document.createElement('a');
                    hiddenElement3.href = success.invoice_url;
                    hiddenElement3.target = '_blank';
                    hiddenElement3.download = 'invoice.pdf';
                    hiddenElement3.click();
                  }
                  $scope.reloadData();
            });
        }

        $scope.GenerateInvoice = function(id){
            $scope.warehouses = Warehouse.query({"supplier":vm.selectedFullJson[id][1]['selling_company_id']});
            SalesOrders.get({'id': id, 'cid':$scope.company_id, "sub_resource":"catalogwise"}).$promise.then(function(result){
                $scope.order_title = result.order_number;

                $scope.order = {}
                $scope.order.id = id;

                $scope.order.products = [];

                $scope.orderedcatalogs = [];

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

                console.log($scope.warehouses.length);
                console.log($scope.warehouses[0].id);
                if($scope.warehouses.length == 1){
                    $scope.order.warehouse = $scope.warehouses[0].id;
                }
                $scope.OpenInvoiceDetails();
            });
        }



        $scope.order_type = null;
        $scope.OpenCancelOrder = function(orderId, order_type){
            $scope.OpenCancelDialog();
            $scope.order.id = orderId;
            $scope.order_type = order_type;
            //alert(order_type);
        }

        $scope.OpenCancelDialog = function () {
            ngDialog.open({
                template: 'cancelorderfromadmin',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        vm.CancelOrderFromAdmin = function(){
            if(vm.cancelOrderForm.$valid) {
                $(".modelform4").addClass(progressLoader());
                //alert($scope.order_type);
                if ($scope.order_type == "sales"){
                    //alert("sales");
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
                if ($scope.order_type == "purchase"){
                    //alert("purchase");
                    PurchaseOrders.patch({"id":$scope.order.id, "processing_status": "Cancelled", "buyer_cancel": $scope.order.buyer_cancel, "cid":$scope.company_id },
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
            }
            else
            {
                vm.cancelOrderForm.supplier_cancel.$dirty = true;
            }
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

        $scope.OpenTrackingDetails = function () {
            ngDialog.open({
                template: 'trackingdetails',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        $scope.OpenDispatch = function(invoiceId, idx){
            $scope.warehouses = Warehouse.query({"supplier":vm.selectedFullJson[idx][1]['selling_company_id']});
            if($scope.warehouses.length == 1){
                $scope.order.warehouse = $scope.warehouses[0].id;
            }
            $scope.OpenTrackingDetails();
            $scope.invoice_id = invoiceId;
        }

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

        vm.SaveDispatch = function(){
            var dis_date = $scope.formatDate($scope.order.dispatch_date);
          //  alert($scope.order.dispatch_date);
            if(vm.saveDispatchForm.$valid) {
                $(".modelform3").addClass(progressLoader());
                //SalesOrders.patch({"id":$scope.invoice_id, "processing_status": "Dispatched", "tracking_details": $scope.order.tracking_details, "dispatch_date": dis_date, "cid":$scope.company_id },
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
                  })
            }
            else
            {
                vm.saveDispatchForm.dispatch_date.$dirty = true;

            }
        }

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

        $scope.Finalize = function(id){

            PurchaseOrders.patch({"id": id, "customer_status": "Placed", "cid":$scope.company_id},
            function(success){
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Order finalized successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    $scope.reloadData();
                    $scope.order = {};
              })
        }

        $scope.OpenPay = function(orderId){
            $scope.OpenPayDialog();
            $scope.order.id = orderId;
        }

        $scope.OpenPayDialog = function () {
            ngDialog.open({
                template: 'pay',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        $scope.order.payment_date = new Date();

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



        $scope.OpenShipPay = function(orderId){
            sharedProperties.setOrderType('purchase');
            sharedProperties.setProperty(orderId);
            vm.openShippingPaymentModal();
        }

        vm.openShippingPaymentModal = function () {
            ngDialog.open({
                template: 'shippingpaymentmodal',
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        vm.ExportToShip = function() {
          console.log(vm.selected);
          var ids = []
          angular.forEach(vm.selected, function(value, key) {
              if(value==true){
                  ids.push(key)
              }
          });
          if (ids.length > 0) {
            $http.get('/api/v1/export-order/',{ params:{"order_id" : ids}}).then(
            function(response){
                console.log(response);
                var headers = response.headers();
                //alert(headers['content-type']);


                if(headers['content-type'] == "text/csv"){
                    var hiddenElement = document.createElement('a');
                    hiddenElement.href = 'data:attachment/csv,' + encodeURI(response.data);
                    hiddenElement.target = '_blank';
                    hiddenElement.download = 'order.csv';
                    hiddenElement.click();
                  }
                  $scope.reloadData();
            });
          }
          else {
              vm.errortoaster = {
                  type:  'error',
                  title: 'Failed',
                  text:  'Please select atleast one row'
              };
              toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
          }
        };



        $scope.splitExtra =  function(extra_notifiers) {
          $scope.extra_count = extra_notifiers.split(',').length
        }
        $scope.GetLables =  function(entity) {
          console.log(entity);
          if (entity) {
            NotificationTemplate.query({ entity: entity.id }).$promise.then(function(success){
              $scope.notification_labels = success;
            });
          }
        }

        $scope.SetMessage   =  function(label) {
          console.log(label);
          if (label) {
            vm.notification_title   = label.display;
            vm.notification_message = label.sms_temp.replace("<Order ID>",$scope.order_id_n);
          }
        }

        $scope.Notify = function(order_id) {
          $scope.order_id_n   = order_id;
          vm.seller_no  = true;
          vm.buyer_no   = true;
          $scope.notifiers_users = []
          $scope.seller_company  = vm.selectedFullJson[order_id][1]['selling_company_data'];
          $scope.buyer_company   = vm.selectedFullJson[order_id][1]['buying_company_data'];
          NotificationEntity.query({type: 'salesorder'}).$promise.then(function(success){
              vm.notification_entities = success;
          });
          console.log($scope.seller_data);
          console.log($scope.entities);
          $scope.catalog_tab = false;
          vm.notification_label = '';
          vm.notification_message = '';
          vm.notification_entity = '';
          vm.notification_entity = '';
          vm.extra_sellers = '';
          vm.extra_sellers = '';
          vm.notify_to = '';
          vm.seller_data = '';
          vm.notification_note = '';
          vm.way = {
            'by_sms' : false,
            'by_noti' : false
          };
          $scope.NotifyDailog()

        };


        $scope.NotifyDailog = function () {
            ngDialog.open({
                template: 'notifydailog',
                className: 'ngdialog-theme-default',
                scope: $scope,
                closeByDocument: false
            });
        };
        vm.sendNotify = function () {
            console.log("on sumbit");
            console.log(vm.notification_label);
            console.log(vm.notification_message);
            console.log(vm.notification_entity);
            console.log(vm.notification_entity);
            console.log(vm.extra_sellers);
            console.log(vm.notify_to);
            console.log(vm.seller_data);

            if(vm.NotifyForm.$valid) {
                $(".modelform4").addClass(progressLoader());
                if (!vm.way.by_sms && !vm.way.by_noti) {
                  $(".modelform4").removeClass(progressLoader());
                  vm.errortoaster = {
                               type:  'error',
                               title: 'Medium',
                               text:  'Please Select a Medium.'
                           };
                 toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                  return
                }
                if (!vm.notification_entity) {
                  $(".modelform4").removeClass(progressLoader());
                  vm.errortoaster = {
                               type:  'error',
                               title: 'Medium',
                               text:  'Please Select an Entity'
                           };
                 toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                  return
                }
                if (!vm.notification_label) {
                  $(".modelform4").removeClass(progressLoader());
                  vm.errortoaster = {
                               type:  'error',
                               title: 'Medium',
                               text:  'Please Select a Label'
                           };
                 toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                  return
                }
                if (!vm.seller_no && !vm.buyer_no) {
                  $(".modelform4").removeClass(progressLoader());
                  vm.errortoaster = {
                               type:  'error',
                               title: 'Medium',
                               text:  'Please Select atleast one reciever.'
                           };
                 toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                  return
                }
                var notifiers = []
                if (vm.seller_no) {
                  notifiers.push({"company_id": $scope.seller_company.seller_company_id,"phone_number" : $scope.seller_company.seller_company_no})
                }
                if (vm.buyer_no) {
                  notifiers.push({"company_id": $scope.buyer_company.buyer_company_id,"phone_number" : $scope.buyer_company.buyer_company_no})
                }
                Notification.save({
                                   "notice_template": vm.notification_label.id,
                                   "message":vm.notification_message,
                                   "notifier_users" : JSON.stringify(notifiers),
                                   "extra_ids" : vm.extra_sellers,
                                   "object_id" : $scope.order_id_n,
                                   "content_type" : vm.notification_entity.content_type,
                                   "by_noti" : vm.way.by_noti || false,
                                   "by_sms"  : vm.way.by_sms || false,
                                   "title" : vm.notification_title,
                                   "note" : vm.notification_note
                                },
                function(success){
                        $(".modelform4").removeClass(progressLoader());
                        ngDialog.close();
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Notification Queued successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $scope.reloadData();
                        $scope.order = {};
                  })
            }
            else
            {
              vm.errortoaster = {
                           type:  'error',
                           title: 'Error',
                           text:  'Some Error Occured!'
                       };
             toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);

            }

        };


        vm.selected = {};
        vm.selectedFullJson = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        $scope.update_flag = false;

        $scope.alrt = function () {alert("called");};


        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';

        /*function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);
        }*/

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
          return '<img src="'+full[5]+'" style="width: 100px; height: 100px"/>';
        }

        function TitleLink(data, type, full, meta){
          return '<a href="#/app/cart-detail/?id='+full[0]+'" target=_blank>'+full[0]+'</a>';
        }

        function DataFormating(data, type, full, meta){


          return '<p style="cursor: pointer;">'+data+'</p>';
        }
        /*$scope.OpenCompanyDetail = function () {
            ngDialog.open({
                template: 'companydetails',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };*/

        $scope.OpenCompany = function(companyId){
            $scope.companyId = companyId;
            /*$(".modelform6").addClass(progressLoader());
            Company.get({"id":companyId, "expand":"true"},
            function (success){
                $scope.company = success
                $scope.OpenCompanyDetail();
                $(".modelform6").removeClass(progressLoader());
            });*/
            ngDialog.open({
                template: 'companydetails',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });

        }
        $scope.OpenCompanyEdit = function(companyId){
            $scope.companyId = companyId;
            /*$(".modelform6").addClass(progressLoader());
            Company.get({"id":companyId, "expand":"true"},
            function (success){
                $scope.company = success
                $scope.OpenCompanyDetail();
                $(".modelform6").removeClass(progressLoader());
            });*/
            ngDialog.open({
                template: 'companydetails_edit',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });

        }

        /* function SupplierDetail(data, type, full, meta){
          return '<div class="col-md-6"><a ng-click="OpenCompany('+full[1]['selling_company_id']+')">'+full[6]+'</a></div>';
        }  */

        function BuyerDetail(data, type, full, meta){
          //return '<div class="col-md-6"><a ng-click="OpenCompany('+full[1]['buying_company_id']+')">'+full[6]+'</a></div>';
          return '<div class="col-md-6"><a ng-click="OpenCompanyEdit('+full[1]['buying_company_id']+')">'+full[6]+'</a></div>';
        }

        vm.datatables_url = 'api/cartdatatables/';

        vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: vm.datatables_url,
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
                            2 : { "type" : "text"},
                            3 : { "type" : "text"},
                            4 : { "type" : "dateRange"},
                            5 : { "type" : "text"},
                            6 : { "type" : "text"},
                            7 : { "type" : "text"},
                            //5 : { "type" : "numberRange"},
                            10 : { "type" : "select", selected:$stateParams.order_type, values:[{"value":"Credit","label":"Credit"}, {"value":"Prepaid","label":"Prepaid"}]},

                            12 : { "type" : "select", selected:$stateParams.processing_status, values:[{"value":"Cart","label":"Cart"}, {"value":"Draft","label":"Draft"}, {"value":"Pending","label":"Pending"}, {"value":"COD Verification Pending","label":"COD Verification Pending"}]},
                            13 : { "type" : "dateRange"},


                      })

					  .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
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
                          //'copy',
                          //'print',
                          //'excel',
                          //'csv',
							{
								extend: 'copy',
								title: 'Orders',
								exportOptions: {
									columns: "thead th:not(.noExport)"
								}
							},{
								extend: 'print',
								title: 'Orders',
								exportOptions: {
									columns: "thead th:not(.noExport)"
								}
							},{
								extend: 'pdf',
								title: 'Orders',
								exportOptions: {
									columns: "thead th:not(.noExport)"
								}
							},{
								extend: 'excel',
								title: 'Orders',
								exportOptions: {
									columns: "thead th:not(.noExport)"
								}
							}, {
								extend: 'csv',
								title: 'Orders',
								exportOptions: {
									columns: "thead th:not(.noExport)"
									//columns: ':visible'
								}
							},

              ]);

                      vm.dtColumnDefs = [
                            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable().withClass('noExport')
                            .renderWith(function(data, type, full, meta) {
                              vm.selected[full[0]] = false;
                              vm.selectedFullJson[full[0]] = full;
                              return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                            }),
                            DTColumnDefBuilder.newColumnDef(1).withTitle('Json').notVisible(),
                            DTColumnDefBuilder.newColumnDef(2).withTitle('Cart ID').renderWith(TitleLink),

                            DTColumnDefBuilder.newColumnDef(3).withTitle('Order No.').notVisible(),
                            DTColumnDefBuilder.newColumnDef(4).withTitle('Date & Time'),//.renderWith(filterDate),
                            DTColumnDefBuilder.newColumnDef(5).withTitle('Suppliers').notSortable().withOption('sWidth','20%'),
                            DTColumnDefBuilder.newColumnDef(6).withTitle('Buyer').renderWith(BuyerDetail),
                            DTColumnDefBuilder.newColumnDef(7).withTitle('Catalog Name').notSortable().withOption('sWidth','30%'),
                            DTColumnDefBuilder.newColumnDef(8).withTitle('No. of Items').notSortable(),
                            DTColumnDefBuilder.newColumnDef(9).withTitle('Total (Rs.)').notSortable(),
                            DTColumnDefBuilder.newColumnDef(10).withTitle('Order Type'),
                            DTColumnDefBuilder.newColumnDef(11).withTitle('Payment Status'),
                            DTColumnDefBuilder.newColumnDef(12).withTitle('Processing Status'),
                            DTColumnDefBuilder.newColumnDef(13).withTitle('CartConverted/ payment date')

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
