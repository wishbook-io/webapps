(function() {
    'use strict';

    angular
        .module('app.cart_detail')
        .controller('CartDetailController', CartDetailController);

    CartDetailController.$inject = ['$resource', 'toaster', '$scope', 'Suppliers', 'Carts', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', '$stateParams', 'SweetAlert', 'ngDialog', 'sharedProperties','Address','State', 'City','Warehouse'];
    function CartDetailController($resource, toaster, $scope, Suppliers, Carts, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, $filter, $stateParams, SweetAlert, ngDialog, sharedProperties, Address,State, City,Warehouse) {
        CheckAuthenticated.check();
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/

        $scope.company_id = localStorage.getItem('company');
        var vm = this;

        $scope.formatDate = formatDate;
        $scope.is_staff   = localStorage.getItem('is_staff')

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

        var cartid = parseInt($stateParams.id);
        $scope.cartdetail = {};
        $scope.supplierslist = "";
        if(cartid){
            Carts.get({'id': cartid, 'cid': $scope.company_id, 'sub_resource':'catalogwise'},function(success){
                $scope.cartdetail = success;
                if(success.ship_to != null){
                  Address.get({ "id": success.ship_to}, function(data){
                    $scope.cartdetail.ship_to = data;
                  });
                }
                for(var i=0; i < $scope.cartdetail.catalogs.length; i++)
                {
                    if($scope.supplierslist.indexOf($scope.cartdetail.catalogs[i].selling_company_name) < 0)
                        $scope.supplierslist = $scope.supplierslist+" "+ $scope.cartdetail.catalogs[i].selling_company_name+"("+$scope.cartdetail.catalogs[i].selling_company_phone_number+")"
                }
            });
        }

        $scope.catalogdropdown = [];

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
        $scope.OpenShipPay = function(cartId){
            sharedProperties.setProperty(cartId);
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
            if($scope.cartdetail.payment_status.indexOf('Paid') < 0){
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
                    $scope.item_ids = [];
                    $scope.item_ids.push(id);
                    Carts.save({'id': parseInt($stateParams.id), 'cid': $scope.company_id, 'item_ids': $scope.item_ids, 'sub_resource': 'delete-items'},
                    function(success){
                        $(".modelform3").removeClass(progressLoader());
                        //$scope.dtInstance.reloadData();
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Item removed from cart successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $scope.reloadData();
                        $state.go($state.current, {}, {reload: true});
                    });
                    //SweetAlert.swal('Deleted!', 'Selected rows has been deleted.', 'success');
                  }
                });    
            }
            else{
                vm.errortoaster = {
                                        type:  'error',
                                        title: 'Error',
                                        text:  "You can not delete item from Paid order."
                                    };
                                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }
            
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
        function BrandNameLink(data, type, full, meta){
          return '<a href="#/app/brand-catalogs/?brand='+full[11]['brand']+'&name='+full[4]+'">'+full[4]+'</a>';
        }

        function CatalogTitleLink(data, type, full, meta){
          if(full[11]['catalog_type']=='received')  {
            return '<a href="#/app/products-detail/?type=receivedcatalog&id='+full[11]['catalog']+'&name='+full[3]+'">'+full[3]+'</a>';
          }
          else if (full[11]['catalog_type'] == 'mycatalog') {
            return '<a href="#/app/product/?type=mycatalog&id='+full[11]['catalog']+'&name='+full[3]+'">'+full[3]+'</a>';
          }
          else {
             return '<a href="#/app/products-detail/?type=publiccatalog&id='+full[11]['catalog']+'&name='+full[3]+'">'+full[3]+'</a>';
          }
        }

        vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: 'api/cartdetaildatatables/?id='+$stateParams.id,
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
                          3 : { "type" : "text"},
                          //4 : { "type" : "select", values:$scope.catalogdropdown},
                          4 : { "type" : "text"},
                          5 : { "type" : "text"},
                          6 : { "type" : "text"},
                          8 : { "type" : "text"},
                          
                          9 : { "type" : "select", values:[{"value":"Box","label":"Box"}, {"value":"Naked","label":"Naked"}]},
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
                        DTColumnDefBuilder.newColumnDef(1).withTitle('Json').notVisible(),
						DTColumnDefBuilder.newColumnDef(2).withTitle('Image').renderWith(imageHtml).notSortable(),
						DTColumnDefBuilder.newColumnDef(3).withTitle('SKU'),
						DTColumnDefBuilder.newColumnDef(4).withTitle('Catalog'),
						DTColumnDefBuilder.newColumnDef(5).withTitle('Brand'),
                        DTColumnDefBuilder.newColumnDef(6).withTitle('Supplier'),
						DTColumnDefBuilder.newColumnDef(7).withTitle('Ordered Qty'),
						DTColumnDefBuilder.newColumnDef(8).withTitle('Price'),
						DTColumnDefBuilder.newColumnDef(9).withTitle('Packing Type'),
						DTColumnDefBuilder.newColumnDef(10).withTitle('Note'),
                        
                        DTColumnDefBuilder.newColumnDef(11).withTitle('Action').notSortable()
                            .renderWith(function(data, type, full, meta) {
                             //   if(full[1]['payment_status'].indexOf('Paid') < 0 )
                                    return '<div><button type="button" ng-click="DeleteItem('+full[0]+')" class="btn btn-primary mt-lg">Delete Item</button></div>';
                                    //return full[1]['payment_status'].indexOf('taid');
                                
                            }),  
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
          if($scope.order_type == 'brokerage'){
              Address.save($scope.address,
              function(success){
                vm.broker_addresses = Address.query();
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
          {
            Address.save($scope.address,
                function(success){
                  vm.addresses = Address.query();
                  SalesOrders.patch({"id": orderid,"cid": $scope.company_id,"ship_to" : success.id},
                  function(success){
                    console.log(success.ship_to);
                    SalesOrders.get({"id": orderid, "cid": $scope.company_id, "expand":"true"},
                    function (success){
                        // console.log(JSON.stringify(success));
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
          }
        }

    }
})();
