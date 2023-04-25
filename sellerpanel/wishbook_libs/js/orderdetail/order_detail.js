(function() {
    'use strict';

    angular
        .module('app.order_detail')
        .controller('OrderDetailController', OrderDetailController);

    OrderDetailController.$inject = ['$resource', 'toaster', '$scope', 'Suppliers', 'SalesOrders','PurchaseOrders', 'SalesOrderItems', 'BuyerList', 'OrderInvoice', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', '$stateParams', 'SweetAlert', 'ngDialog', 'sharedProperties','Address','State', 'City','Warehouse'];
    function OrderDetailController($resource, toaster, $scope, Suppliers, SalesOrders, PurchaseOrders,SalesOrderItems, BuyerList, OrderInvoice, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, $filter, $stateParams, SweetAlert, ngDialog, sharedProperties, Address,State, City,Warehouse) {
        CheckAuthenticated.check();
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/

        $scope.company_id = localStorage.getItem('company');
        var vm = this;

        $scope.formatDate = formatDate;
        $scope.is_staff   = localStorage.getItem('is_staff');
        $scope.facility_type = localStorage.getItem('facility_type');
        console.log($scope.facility_type);
        $scope.dropship_constant = '"dropship"';
        


        $scope.OpenUpdateItem = function () {
            ngDialog.open({
                template: 'itemview',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        vm.CloseDialog = function() {
            ngDialog.close();
        };

        var orderid = parseInt($stateParams.id);
        console.log(orderid);
        var zaakpay_status = $stateParams.status;
        console.log(zaakpay_status);
        if(zaakpay_status == 1){
            ngDialog.open({
                template: 'zaakpay-success',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        }
        if(zaakpay_status == 0){
             ngDialog.open({
                template: 'zaakpay-fail',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        }
        //  console.log(orderid);
        $scope.orderdetail = {};
        $scope.catalogdropdown = [];

        $scope.warehouses = Warehouse.query();
        if($stateParams.type == 'purchaseorders')
        {
            /*PurchaseOrders.get({"id": orderid, "cid": $scope.company_id},
            function (success){
                //console.log(JSON.stringify(success));
                $scope.orderdetail = success;
            });*/

            PurchaseOrders.get({"id": orderid, "cid": $scope.company_id, "expand":"true"},
            function (success){
                //console.log(JSON.stringify(success));
                $scope.orderdetail = success;
            });
            PurchaseOrders.query({"id": orderid, "cid": $scope.company_id, "sub_resource":"catalogs"},
            function (success){
                for (var i = 0; i < success.length; i++) {
                    var json = {};
                    json['value'] = success[i].title;
                    json['label'] = success[i].title;
                    $scope.catalogdropdown.push(json);
                }
            });
        }
        else
        {
            /*SalesOrders.get({"id": orderid, "cid": $scope.company_id},
            function (success){
                //console.log(JSON.stringify(success));
                $scope.orderdetail = success;
            });*/

            SalesOrders.get({"id": orderid, "cid": $scope.company_id, "expand":"true"},
            function (success){
                // console.log(JSON.stringify(success));
                $scope.orderdetail = success;
                $scope.orderdetail.seller_extra_discount_percentage = parseFloat(success.seller_extra_discount_percentage);
            });
            SalesOrders.query({"id": orderid, "cid": $scope.company_id, "sub_resource":"catalogs"},
            function (success){
                for (var i = 0; i < success.length; i++) {
                    var json = {};
                    json['value'] = success[i].title;
                    json['label'] = success[i].title;
                    $scope.catalogdropdown.push(json);
                }
            });
        }

        /* Start:  Sales order Action */
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
                        console.log($state.current)
                        if($state.current.name == 'app.order_detail')
                        {
                          $state.go($state.current, {}, {reload: true});
                        }
                  });
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

        $scope.OpenCancelDialog = function () {
            ngDialog.open({
                template: 'cancelorder',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        $scope.order = {};
        $scope.OpenCancelOrder = function(orderId){
            $scope.OpenCancelDialog();
            $scope.order.id = orderId;
        }


        $scope.OpenInvoiceDetails = function () {
            ngDialog.open({
                template: 'invoicedetails',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        /*  $scope.GenerateInvoice = function(id){
            SalesOrders.get({'id': id, 'cid':$scope.company_id, "sub_resource":"catalogwise"}).$promise.then(function(result){
                $scope.order_title = result.order_number;

                $scope.order = {};
                $scope.order.id = id;
                //$scope.order.catalog = vm.true_key;

                $scope.order.products = [];
                //$scope.full_catalog_orders_only = result.full_catalog_orders_only;
                var idx = 0;
                for(var c=0; c<(result.catalogs.length); c++){
                    for(var i=0; i<(result.catalogs[c].products.length); i++){
                        var item = result.catalogs[c].products[i];

                        var product_quantity = item.pending_quantity;

                        $scope.order.products[idx] = {id:item.id, price:item.rate, quantity:product_quantity, image:item.product_image, sku:item.product_sku, is_select:false, max:product_quantity};//, is_select:true
                        if(product_quantity > 0)
                            $scope.order.products[idx]['is_select'] = true;

                        idx += 1;
                    }
                }
                //alert($scope.order.products);
                $scope.OpenInvoiceDetails();
            });
            //$scope.order.id = orderId;
        }  */

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

                $scope.order = {};
                $scope.order.id = id;
                //$scope.order.catalog = vm.true_key;

                $scope.order.products = [];
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
                console.log($scope.warehouses.length);
                console.log($scope.warehouses[0].id);
                if($scope.warehouses.length == 1){
                    $scope.order.warehouse = $scope.warehouses[0].id;
                }
                //alert($scope.order.products);
                $scope.OpenInvoiceDetails();
            });
            //$scope.order.id = orderId;
        }

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
            $scope.buyerId = id;
            $scope.buyers = BuyerList.query({'cid':$scope.company_id});
            $scope.OpenTransferDialog();
        };


        /*  Start : Purchase order actions*/
         $scope.OpenCancelPurchaseOrderDialog = function () {
            ngDialog.open({
                template: 'cancelorder-purchase',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        $scope.OpenCancelPurchaseOrder = function(orderId){
            $scope.OpenCancelPurchaseOrderDialog();
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

        $scope.order = {};
        $scope.OpenPay = function(orderId){
            /*$scope.OpenPayDialog();
            $scope.order.id = orderId;*/
            PurchaseOrders.get({'id': orderId, 'cid':$scope.company_id, "sub_resource":"catalogwise"}).$promise.then(function(result){
                $scope.products = [];
                var itemno = 0;

                for(var c=0; c<(result.catalogs.length); c++){
                    for(var i=0; i<(result.catalogs[c].products.length); i++){
                        var item = result.catalogs[c].products[i];

                        var product_quantity = item.pending_quantity;
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
                    $scope.modes = ['NEFT','Cheque','PayTM','Mobikwik','Zaakpay','Other'];
                    $scope.order.invoice_id = success.id;
                    $scope.order.invoice_amount = success.amount;
                });
            });
        }

        vm.openShippingPaymentModal = function () {
            ngDialog.open({
                template: 'shippingpaymentmodal',
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        $scope.OpenShipPay = function(orderId){
            sharedProperties.setOrderType('purchase');
            sharedProperties.setType('shipping');
            sharedProperties.setProperty(orderId);
            vm.openShippingPaymentModal();
        }
        $scope.OpenShipPay2 = function(orderId){
            sharedProperties.setOrderType('purchase');
            sharedProperties.setType('payment');
            sharedProperties.setProperty(orderId);
            vm.openShippingPaymentModal();
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





        $scope.UpdateItem = function(id){
            $(".modelform3").addClass(progressLoader());

            SalesOrderItems.get({"id":id},
            function (success){
                $scope.itemdetail = success;

                $scope.OpenUpdateItem();
                $(".modelform3").removeClass(progressLoader());

            });
        }

        $scope.SubmitUpdateItem = function (id){
            if(vm.updateItem.$valid) {
                $(".modelform2").addClass(progressLoader());
                SalesOrderItems.patch({"id":id, "quantity": $scope.itemdetail.quantity},
                    function(success){
                        $(".modelform2").removeClass(progressLoader());
                        ngDialog.close();
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Item quantity updated successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $scope.reloadData();
                        $scope.order = {};
                    })
            }
            else
            {
                vm.updateItem.quantity.$dirty = true;
            }

        }

        $scope.DeleteItem = function(id){
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
                $(".modelform3").addClass(progressLoader());
                SalesOrderItems.delete({'id':id},
                function(success){
                    $(".modelform3").removeClass(progressLoader());
                    //$scope.dtInstance.reloadData();
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Item removed from order successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    $scope.reloadData();
                });
                //SweetAlert.swal('Deleted!', 'Selected rows has been deleted.', 'success');
              }
            });
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
                    if($state.current.name == 'app.order_detail')
                    {
                      $state.go($state.current, {}, {reload: true});
                    }
              });
        }

        $scope.MarkDelivered = function(orderId){
            $scope.order.id = orderId;

            SalesOrders.patch({"id":$scope.order.id, "processing_status": "Delivered", "cid":$scope.company_id },
            function(success){
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Order mark as delivered successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    $scope.reloadData();
                    if($state.current.name == 'app.order_detail')
                    {
                      $state.go($state.current, {}, {reload: true});
                    }
              });
        }


        $scope.getTrackingDeatails = function(orderId,awb_code){
          $scope.order.id = orderId;
          SalesOrders.save({'id': $scope.order.id, 'cid':$scope.company_id,"awb_code" : awb_code,"tracking": true, "sub_resource":"placetoship"},
          function(data){

              if(data.tracking_data.track_status == 0)
              {
                  $scope.isTracking = 'false';
                  $scope.tracking = "No Data Available";
              }
              else
              {
                  $scope.isTracking = 'true';
                  $scope.tracking = data.tracking_data.shipment_track_activities;
                  $scope.tracking.reverse();
                  var length = $scope.tracking.length;
                  var comp=[], gt=[];
                  for (var i = 0; i < length; i++)
                  {
                      var date = $scope.tracking[i].date.split(' ');
                      var time = date[1].split('.')
                      comp[i] = date[0];
                      gt[i] = date[0];

                      $scope.tracking[i].formattedDate = date[0];
                      $scope.tracking[i].time = time[0];
                  }

                  $scope.a=[];
                  $scope.a=comp;
                  for (var i = length-1;i>0;i--){
                      if(comp[i]==comp[i-1]){
                          $scope.a[i]=0;
                      }
                  }
              }
            });
        }
        $scope.openAdditionalDiscount = function () {
            ngDialog.open({
                template: 'add-discount-form',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
            $scope.discount = 0.0;
            Suppliers.query({'company': $scope.orderdetail.seller_company, 'buying_company': $scope.orderdetail.company, 'cid': $scope.company_id},function(data){
                if(data.length > 0){
                    if($scope.orderdetail.order_type == "Credit"){
                        $scope.discount = data[0].discount.toFixed(2);
                    }
                    else{
                        $scope.discount = data[0].cash_discount.toFixed(2);
                    }
                }
            });
        };
        $scope.submitAdditionalDiscount = function(){
            console.log($scope.orderdetail.seller_extra_discount_percentage);
            SalesOrders.patch({'cid': $scope.company_id, 'id': $scope.orderdetail.id, 'seller_extra_discount_percentage': $scope.orderdetail.seller_extra_discount_percentage }, function(success){
                    ngDialog.close();
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Additional discount updated successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    $scope.reloadData();
                    if($state.current.name == 'app.order_detail')
                    {
                      $state.go($state.current, {}, {reload: true});
                    }
            });
        }

        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        $scope.update_flag = false;

        $scope.alrt = function () {alert("called");};

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
          return '<div style="text-align:center;"><img class="loading" src="'+full[2]+'" style="height: 100px; "/></div>';
        }
        function SKUTitle(data, type, full, meta){
		  if((full[3].toLowerCase().indexOf('full catalog order') > -1) | (full[3].toLowerCase().indexOf('full set order') > -1)){
			  return full[3].bold()
		  }else{
			  return full[3]
		  }
        }
        function BrandNameLink(data, type, full, meta){
          return '<a href="#/app/brand-catalogs/?brand='+full[1]['brand']+'&name='+full[5]+'">'+full[5]+'</a>';
        }

        function CatalogTitleLink(data, type, full, meta){
          /*if(full[11]['catalog_type']=='received')  {
            return '<a href="#/app/products-detail/?type=receivedcatalog&id='+full[11]['catalog']+'&name='+full[3]+'">'+full[3]+'</a>';
          }
          else if (full[11]['catalog_type'] == 'mycatalog') {*/
            return '<a href="#/app/product/?type=mycatalog&id='+full[1]['catalog']+'&name='+full[4]+'">'+full[4]+'</a>';
        /*  }
          else {
             return '<a href="#/app/products-detail/?type=publiccatalog&id='+full[11]['catalog']+'&name='+full[3]+'">'+full[3]+'</a>';
          }*/
        }

        vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: 'api/orderdetaildatatables1/?id='+$stateParams.id+'&type='+$stateParams.type,
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
                          //1 : { "type" : "text"},
                          3 : { "type" : "text"},
                          //3 : { "type" : "text"},
                          4 : { "type" : "select", values:$scope.catalogdropdown},
                          5 : { "type" : "text"},
                          6 : { "type" : "text"},
                          7 : { "type" : "text"},
                          8 : { "type" : "text"},
                          9 : { "type" : "text"},
                          10 : { "type" : "text"},
                          11 : { "type" : "select", values:[{"value":"Box","label":"Box"}, {"value":"Naked","label":"Naked"}]},
                          12 : { "type" : "text"},

                      })

                      .withOption('processing', true)
                      .withOption('serverSide', true)

                      .withOption('iDisplayLength', 10) ////set 6 line comments to hide all datatables options
                      .withOption('scrollX', true)
                      .withOption('scrollY', getDataTableHeight())
                      .withOption('scrollCollapse', true)
                      .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
                      .withPaginationType('full_numbers') ////

                      /*.withOption('lengthChange', false) ////remove 4 line comments to hide all datatables options
                      .withOption('paging', false)
                      .withOption('searching', false)
                      .withOption('bInfo', false);*/

                      vm.dtColumnDefs = [
						DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
						.renderWith(function(data, type, full, meta) {
						  vm.selected[full[0]] = false;
						  return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
						}).notVisible(),
						DTColumnDefBuilder.newColumnDef(1).withTitle('json').notVisible(),
						DTColumnDefBuilder.newColumnDef(2).withTitle('Image').renderWith(imageHtml).notSortable(),
						DTColumnDefBuilder.newColumnDef(3).withTitle('SKU').renderWith(SKUTitle),
						DTColumnDefBuilder.newColumnDef(4).withTitle('Catalog').renderWith(CatalogTitleLink),
						DTColumnDefBuilder.newColumnDef(5).withTitle('Brand').renderWith(BrandNameLink),
						DTColumnDefBuilder.newColumnDef(6).withTitle('Ordered Qty'),
						DTColumnDefBuilder.newColumnDef(7).withTitle('Dispatch Qty'),
						DTColumnDefBuilder.newColumnDef(8).withTitle('Pending Qty'),
						DTColumnDefBuilder.newColumnDef(9).withTitle('Cancel Qty'),
						DTColumnDefBuilder.newColumnDef(10).withTitle('Price'),
						DTColumnDefBuilder.newColumnDef(11).withTitle('Packing Type'),
						DTColumnDefBuilder.newColumnDef(12).withTitle('Note'),
                       /* DTColumnDefBuilder.newColumnDef(7).withTitle('Action').notSortable()
                            .renderWith(function(data, type, full, meta) {
                                if(full[7].indexOf('Dispatched') > -1  || full[7].indexOf('Delivered') > -1 || full[7].indexOf('Cancelled') > -1 ){
                                    return '&nbsp;';
                                }
                                else{
                                    return '<div><button type="button" ng-click="UpdateItem('+full[0]+')" class="btn btn-primary mt-lg">Update</button></div><div><button type="button" ng-click="DeleteItem('+full[0]+')" class="btn btn-danger mt-lg">Remove</button></div>';
                                }
                            }),  */
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
        $scope.update_address_flag = true;
        console.log($scope.update_address_flag);
        console.log($scope.orderdetail);
        $scope.addaddress = false;
        vm.addNewAddress = function(){

          console.log($scope.orderdetail);
          if ($scope.update_address_flag) {
            console.log($scope.update_address_flag);
            console.log($scope.orderdetail);
            vm.GetCity($scope.orderdetail.ship_to.state.id)
            $scope.address.street_address = $scope.orderdetail.ship_to.street_address
            $scope.address.state = $scope.orderdetail.ship_to.state.id
            $scope.address.city =  $scope.orderdetail.ship_to.city.id
            $scope.address.pincode = $scope.orderdetail.ship_to.pincode
            $scope.address.company = $scope.orderdetail.company;

          }
          $scope.addaddress = true;
        }

        // processing note dialog
        $scope.OpenProcessingNoteDialog = function () {
            ngDialog.open({
                  template: 'processingnote',
                  scope: $scope,
                  className: 'ngdialog-theme-default',
                  closeByDocument: false
            });
        };

        $scope.processingNote = function(orderId){
            $scope.OpenProcessingNoteDialog();
            $scope.order.id = orderId;
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
     /*     if($scope.order_type == 'brokerage'){
              Address.save($scope.address,
              function(success){
                //vm.broker_addresses = Address.query();
                $scope.addaddress = false;
                SalesOrders.patch({"id": orderid,"cid": $scope.company_id,"ship_to" : success.id},
                function(success){
                  console.log(success.ship_to);
                  SalesOrders.get({"id": orderid, "cid": $scope.company_id, "expand":"true"},
                  function (success){
                      // console.log(JSON.stringify(success));
                      $scope.orderdetail = success;
                  });
                });
                console.log(success);
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
          {*/
            $(".address_dialog").addClass(progressLoader());
            Address.save($scope.address,
                function(success){
                  //vm.addresses = Address.query();
                  SalesOrders.patch({"id": orderid,"cid": $scope.company_id,"ship_to" : success.id},
                  function(success){
                    console.log(success.ship_to);
                    SalesOrders.get({"id": orderid, "cid": $scope.company_id, "expand":"true"},
                    function (success){
                        // console.log(JSON.stringify(success));
                        $(".address_dialog").removeClass(progressLoader());
                        $scope.orderdetail = success;
                    });
                  });
                  $scope.addaddress  = false;
                  $scope.address     = {};
                  vm.successtoaster  = {
                                type:  'success',
                                title: 'Success',
                                text:  'Address has been added successfully.'
                            };
                  toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                });
         // }
        }

    }
})();
