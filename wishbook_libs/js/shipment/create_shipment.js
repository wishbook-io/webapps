(function() {
    'use strict';

    angular
        .module('app.salesorders')
        .controller('CreateShipmentController', CreateShipmentController);

    CreateShipmentController.$inject = ['$state', 'NotificationTemplate', 'Notification', '$stateParams', 'SalesOrders', 'Upload', 'SalesOrdersforInvoice', 'PendingOrderItemsAction', 'DropshipOrderInvoice', 'CompanyPhoneAlias', 'CompanyPricelist', 'CompanyBuyergroupRule', 'BrandDistributor', 'grouptype', '$scope', 'CheckAuthenticated', 'toaster', '$location', 'SidebarLoader', '$rootScope', '$compile', 'ngDialog', '$cookies', '$localStorage'];
    function CreateShipmentController($state, NotificationTemplate, Notification, $stateParams, SalesOrders, Upload, SalesOrdersforInvoice, PendingOrderItemsAction, DropshipOrderInvoice, CompanyPhoneAlias, CompanyPricelist, CompanyBuyergroupRule, BrandDistributor, grouptype, $scope, CheckAuthenticated, toaster, $location, SidebarLoader, $rootScope, $compile, ngDialog, $cookies, $localStorage) {
        
        CheckAuthenticated.check();
        
        var vm = this;
        
        $scope.company_id = localStorage.getItem('company');
        $scope.is_staff   = localStorage.getItem('is_staff');
        // $scope.order_id = sharedProperties.getProperty();      
        // $scope.order_type = sharedProperties.getOrderType()
        vm.CloseDialog = function() {
          ngDialog.close();
        }
        $scope.CreateShipment = function () {
            $(".modelform2").addClass(progressLoader());

            //console.log($scope.pendingOrderItems);
            var total_qty = 0
            angular.forEach($scope.pendingOrderItems, function (obj) {
				if (obj.ready_to_ship_qty > 0){
					$scope.invoiceitem_set.push({ 'order_item': obj.id, 'qty': obj.ready_to_ship_qty });
					total_qty += obj.ready_to_ship_qty;
				}
            });
            console.log($scope.pendingOrderItems);

           
            var params = { 'order': $scope.orderid, 'cid': $scope.company_id, "invoice_type": "Tax Invoice", 'invoiceitem_set': $scope.invoiceitem_set, 'total_qty': total_qty };
            if (!$scope.dropship_markedUnavailable) {
                params['dimensions'] = $scope.dimensions;
            }
            console.log(params);

            DropshipOrderInvoice.save(params).$promise.then(function (result) {
                $(".modelform2").removeClass(progressLoader());
                vm.successtoaster = {
                    type: 'success',
                    title: 'Success',
                    text: 'Shipment has been created.'
                };

                ngDialog.close();
                toaster.pop('success', 'Success', 'Shipment has been created.');
                $scope.reloadData();
            });

        } 

      /*  $scope.showmessage = function (item, index)
        {
            console.log(item);
            var ctr = 0;

            if ((item.is_full_catalog == true || item.is_full_catalog == 'true') && (item.ready_to_ship_qty > 1))
            {
                if (parseInt(item.ready_to_ship_qty) % parseInt(item.no_of_pcs) != 0 ) {
                    $scope.isNotInPeicesMultiple = true;
                }
                else {
                    $scope.isNotInPeicesMultiple = false;
                }
            }
            
            console.log(parseInt($scope.pendingOrderItems222[index].ready_to_ship_qty));

            if (parseInt(item.ready_to_ship_qty) <= parseInt($scope.pendingOrderItems222[index].ready_to_ship_qty)) {
                $scope.bool = false;
            }
            else {
                $scope.bool = true;
            }

            angular.forEach($scope.pendingOrderItems, function (obj) {
                if (obj.ready_to_ship_qty == 0) {
                    ctr = ctr + 1;
                }
            });

            if ($scope.pendingOrderItems.length == ctr) {
                $scope.dropship_markedUnavailable = true;
                console.log('dropship_markedUnavailable ' + $scope.dropship_markedUnavailable);
            }
            else {
                $scope.dropship_markedUnavailable = false;
            }

        } */

        $scope.showmessage = function (items)
        {
          var ctr = 0;
          for(var i = 0; i < items.length; i++)
          {
              console.log(items[i]);
              
              if (items[i].ready_to_ship_qty == 0) {
                  ctr = ctr + 1;
              }
              //    console.log(parseInt($scope.pendingOrderItems222[i].ready_to_ship_qty));
              if (parseInt(items[i].ready_to_ship_qty) <= parseInt($scope.pendingOrderItems222[i].ready_to_ship_qty)) {
                  $scope.bool = false;
              }
              else {
                  $scope.bool = true;
                  break;
              }
              
              //if ((items[i].is_full_catalog == true || items[i].is_full_catalog == 'true') && (items[i].ready_to_ship_qty > 1))
              if (items[i].is_full_catalog == true || items[i].is_full_catalog == 'true')
              {
                  console.log(parseInt(items[i].ready_to_ship_qty)+"%"+parseInt(items[i].no_of_pcs)+" = "+parseInt(items[i].ready_to_ship_qty) % parseInt(items[i].no_of_pcs));
                  
                  if (parseInt(items[i].ready_to_ship_qty) % parseInt(items[i].no_of_pcs) != 0 || parseInt(items[i].ready_to_ship_qty) % parseInt(items[i].no_of_pcs) == 1 ) {
                      $scope.isNotInPeicesMultiple = true;
                      break;
                  }
                  else {
                      $scope.isNotInPeicesMultiple = false;
                  }
              }  
          }
          if ($scope.pendingOrderItems.length == ctr) {
              $scope.dropship_markedUnavailable = true;
              console.log('dropship_markedUnavailable ' + $scope.dropship_markedUnavailable);
          }
          else {
              $scope.dropship_markedUnavailable = false;
          }
        }  

    }  // end :  function CreateShipmentController
})();
