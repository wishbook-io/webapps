/*start - form wizard */
(function() {
    'use strict';
    angular
        .module('app.catalog')
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
        .module('app.catalog')
        .controller('ReceivedcatalogController', ReceivedcatalogController);

    ReceivedcatalogController.$inject = ['$http', 'Suppliers', 'CatalogRes', 'Catalog', 'BuyerList', 'SupplierList', 'SalesOrders', 'PurchaseOrders', 'Company', '$resource', 'toaster', 'ngDialog', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', '$localStorage', '$filter'];
    function ReceivedcatalogController($http, Suppliers, CatalogRes, Catalog, BuyerList, SupplierList, SalesOrders, PurchaseOrders, Company, $resource, toaster, ngDialog, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, $localStorage, $filter) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        $scope.company_id = localStorage.getItem('company');        
        
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
        
        /*$http.get('app/json/orderstatus.json').then(
        function(success){
            $scope.order_statuses = success.data;
        });*/
        
        $scope.openCreateOrderConfirm = function () {
            ngDialog.openConfirm({
              template: 'createbulkpurchaseorder',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            })
        };
        $scope.openCreateBulkOrderConfirm = function () {
            ngDialog.openConfirm({
              template: 'createbulkorder',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            })
        };
        $scope.openBulkBrokerageOrder = function () {
            ngDialog.open({
                template: 'createbulkbrokerageorder',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        }; 

        $scope.catalog_supplier = null;
        vm.CreateOrderForm = function (order_type,full){
            vm.order_type = order_type
            
            if(vm.order_type == 'sales_order')
            {
                $scope.true_key = [];
                var true_count = 0;
                angular.forEach(vm.selected, function(value, key) {
                    if(value==true){
                        
                        $scope.true_key[true_count] = key;
                        true_count++;
                    }
                });
                $scope.openCreateBulkOrderConfirm();
            }
            else if(vm.order_type == 'brokerage_order'){
                    $scope.true_key = [];
                    var true_count = 0;
                    var keepGoing = true;
                    angular.forEach(vm.selected, function(value, key) {
                        if(keepGoing){
                            if(value==true){
                                $scope.true_key[true_count] = key;
                                $scope.catalogid = $scope.true_key[true_count];
                                $scope.catalog_supplier = vm.selectedFullJson[$scope.catalogid][10]['selling_company'];
                                console.log(vm.selectedFullJson[$scope.catalogid][10]['selling_company']);
                                true_count++;
                                keepGoing = false;
                            }
                        }
                    });
                    $scope.openBulkBrokerageOrder();
            }
            else {
                    $scope.true_key = [];
                    var true_count = 0;
                    var keepGoing = true;
                    angular.forEach(vm.selected, function(value, key) {
                        if(keepGoing){
                            if(value==true){
                                $scope.true_key[true_count] = key;
                                $scope.catalogid = $scope.true_key[true_count];
                                $scope.catalog_name = vm.selectedFullJson[$scope.catalogid][1];
                                $scope.catalog_supplier = vm.selectedFullJson[$scope.catalogid][10]['selling_company'];
                                $scope.catalog_supplier_name = vm.selectedFullJson[$scope.catalogid][5];
                                console.log(vm.selectedFullJson[$scope.catalogid][10]['selling_company']);
                                true_count++;
                                keepGoing = false;
                            }
                        }
                    });
                    $scope.openCreateOrderConfirm();
                   /* var true_count = 0;
                    angular.forEach(vm.selected, function(value, key) {
                        if(value==true){
                            true_count++;
                            vm.true_key = key;
                        }
                    });
                    
                    if(true_count == 1)
                    {
                        
                        Catalog.get({'id': vm.true_key, 'cid':$scope.company_id, "expand":true}).$promise.then(function(result){
                            vm.agents = Company.query({'id':$scope.company_id, 'sub_resource':'brokers'});
                            
                            vm.order_title = result.title;
                            
                            vm.order = {}
                            vm.order.catalog = vm.true_key;
                            
                            vm.order.products = [];
                            vm.full_catalog_orders_only = result.full_catalog_orders_only;
                            
                            if(vm.order_type == 'sales_order'){
                                //vm.buyers = BuyerList.query({'cid':$scope.company_id});
                            }else{
                                //vm.suppliers = SupplierList.query({'cid':$scope.company_id});
                                CatalogRes.get({'id': vm.true_key, 'cid':$scope.company_id, 'sub_resource':'suppliers'}).$promise.then(function(result){
                                    vm.order.supplier = result.selling_company;
                                    
                                    Company.get({'id':result.selling_company}).$promise.then(function(result){
                                        vm.supplier_title = result.name
                                    })
                                    
                                });
                            }
                            
                            if(result.products.length == 0){
                                vm.errortoaster = {
                                    type:  'error',
                                    title: 'Failed',
                                    text:  'There are no products in this catalog'
                                };
                                
                                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
                                return
                            }
                            
                            for(var i=0; i<(result.products.length); i++){
                                var product = result.products[i];
                                if(vm.order_type == 'sales_order'){
                             //       vm.order.products[i] = {id:product.id, selling_price:product.selling_price, quantity:1, image:product.image.thumbnail_small, sku:product.sku, is_select:true};
                                }
                                else{
                                    vm.order.products[i] = {id:product.id, final_price:product.final_price, quantity:1, image:product.image.thumbnail_small, sku:product.sku, is_select:true};
                                }
                            }
                           
                            $scope.openCreateOrderConfirm();
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
                      }  */
                }
         
        };
                
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
                      if(vm.order_type == 'sales_order'){
                        vm.items[itemno] = {product:product.id, rate:product.selling_price, quantity:product.quantity};
                        itemno++;
                      }
                      else{
                        vm.items[itemno] = {product:product.id, rate:product.final_price, quantity:product.quantity};
                        itemno++;
                      }
                    }
                }
                
                if(vm.items.length == 0){
                    $(".modelform").removeClass(progressLoader());
                    
                    vm.errortoaster = {
                        type:  'error',
                        title: 'Failed',
                        text:  'Please select product'
                    };
                    
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
                    return
                }
                
                if(vm.order_type == 'sales_order'){
                    var jsondata = {order_number:vm.order.order_number, company:vm.order.buyer, seller_company:$scope.company_id, cid:$scope.company_id, items:vm.items, customer_status:"Placed", broker_company:vm.order.agent};
                    SalesOrders.save(jsondata,
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
                else{
                    var jsondata = {order_number:vm.order.order_number, company:$scope.company_id, seller_company:vm.order.supplier, cid:$scope.company_id, items:vm.items, customer_status:"Placed", broker_company:vm.order.agent};
                    PurchaseOrders.save(jsondata,
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
                
            }
            else 
            {
                vm.orderForm.order_number.$dirty = true;
                //vm.orderForm.buyer.$dirty = true;
            }
        }
        //createorder end
        
        vm.DisableCatalog = function (){
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })
            
            if(true_count > 0)
            {
                
                angular.forEach(vm.selected, function(value, key) {
                    if(value==true){
                        $(".modelform3").addClass(progressLoader());
                        Catalog.get({'id': key, 'cid':$scope.company_id, "sub_resource":"disable"}).$promise.then(function(result){
                            $(".modelform3").removeClass(progressLoader());
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Catalog has been disabled.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            $scope.reloadData();
                        });
                    }
                });
            }
            else
            {
                vm.errortoaster = {
                    type:  'error',
                    title: 'Failed',
                    text:  'Please select one row'
                };
                
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
            }
        }
        
        
        vm.EnableCatalog = function (){
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                   // alert(vm.selectedFullJson[vm.true_key])
                }
            })
            
            if(true_count > 0)
            {
                
                angular.forEach(vm.selected, function(value, key) {
                    if(value==true){
                        $(".modelform3").addClass(progressLoader());
                        Catalog.get({'id': key, 'cid':$scope.company_id, "sub_resource":"enable"}).$promise.then(function(result){
                            $(".modelform3").removeClass(progressLoader());
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Catalog has been enabled.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            $scope.reloadData();
                        });
                    }
                });
            }
            else
            {
                vm.errortoaster = {
                    type:  'error',
                    title: 'Failed',
                    text:  'Please select one row'
                };
                
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
            }
        }
        
       /* $scope.ProductsImages = function () {
            ngDialog.open({
                template: 'productimages',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        $scope.OpenProductsImages = function(id,prod_count){
            $scope.ProductsImages();
            $scope.catid = id;
            $scope.prod_count = prod_count;
        }  */
        $scope.OpenProductsImages = function(id,prod_count){
            $scope.catid = id;
            $scope.prod_count = prod_count;
            if(prod_count == 0)
            {
                $scope.OpenNoProductsAlert();
            }
            else {
                  Catalog.get({"id":id, "cid":$scope.company_id},
                   function (result){
                      $scope.catalogdata = result;
                      Catalog.get({"id":id, "expand":"true", "cid":$scope.company_id},
                      function (success){
                           openPhotoSwipe($scope.catalogdata,success); 
                      });
                   });

            }
        }

      /*  $scope.OpenProductsImages = function(id){
             $(".modelform3").addClass(progressLoader()); 
            ////vm.slides6 = [];
            vm.slides = [];
            Catalog.get({"id":id, "expand":"true", "cid":$scope.company_id},
            function (success){
                var products = success.products;
                //$scope.productimg = []
                for (var i = 0; i < products.length; i++) {
                    ////addSlide(vm.slides6, products[i].image.thumbnail_medium);
                    //$scope.productimg[i] = products[i].image.thumbnail_medium;
                    
                    vm.slides.push({
                      id: products[i].id,
                      image: products[i].image.thumbnail_medium,
                      text: products[i].sku
                    });
                    
                }
                
                $scope.ProductsImages();
                $(".modelform3").removeClass(progressLoader()); 
                
            }); 
        } */
        function imageHtml(data, type, full, meta){
          return '<a ng-click="OpenProductsImages('+full[0]+','+full[7]+')"><img class="loading" src="'+full[2]+'" style="width: 100px; height: 100px"/></a>';
        }
        
        $scope.OpenShareDialog = function () {
            ngDialog.open({
                template: 'share',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

          $scope.OpenShareCatalog = function () {
             var true_count = 0;
             
                angular.forEach(vm.selected, function(value, key) {
                    if(value==true){
                        true_count++;

                        $scope.true_key = key;

                      //  $scope.share.catalog = vm.true_key;
                     //   console.log(value);
                       // console.log($scope.true_key);
                    }
                    
                })
                
                if(true_count == 1 )
                {
                    
                    $scope.OpenShareDialog();
                    $scope.share.catalog = parseInt($scope.true_key);
                  // $scope.share.catalog = 444;
                    
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
                      //toaster.pop('error', 'Failed', 'Please select one row'); 
                }
          }
        
        
        vm.selected = {};
        vm.selectedFullJson = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};
        
        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';

        $scope.reloadData = function () {
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
        
        /*function imageHtml(data, type, full, meta){
          return '<img class="loading" src="'+full[2]+'" style="width: 100px; height: 100px"/>';
        }*/
        
         $scope.OpenNoProductsAlert = function() {
           vm.errortoaster = {
                        type:  'error',
                        title: 'Empty Catalog',
                        text:  'This catalog has no products.'
                    };
                    
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
        }
        function TitleLink(data, type, full, meta){
          if(full[7] == 0){
              return '<a ng-click="OpenNoProductsAlert()">'+full[1]+'</a>';
          }
          else{
            return '<a href="#/app/products-detail/?type=receivedcatalog&id='+full[0]+'&name='+full[1]+'">'+full[1]+'</a>';
          }
        }
        
        function SupplierLink(data, type, full, meta){
          if(full[10]['selling_company'] == null){
              return full[5];
          }
          else{
            return '<a href="#/app/supplier-detail/?id='+full[10]['selling_company']+'&name='+full[5]+'">'+full[5]+'</a>';
          }
        }
        
        function SupplierChatLink(data, type, full, meta){
          if(full[10]['selling_company'] == null){
              return '';
          }
          else{
            // return '<a href="#/app/supplier-detail/?id='+full[9]+'&name='+full[5]+'">'+full[5]+'</a>';
            return '<a href="#" target="_self" class="applozic-launcher btn btn-default mt-lg" data-mck-id="'+full[10]['selling_company_chat_user']+'" data-mck-name="'+full[10]['selling_company_name']+'">Chat With Supplier</a>';
          }
        }
        
        vm.TableButtons = [
            {
                text: 'Share',
                key: '1',
                className: 'green',
                action: function (e, dt, node, config) {
                    $scope.share = {};
                    $scope.share.item_type = 'catalog';
                    $scope.share.dispatch_date = new Date();
                    $scope.share.full_catalog_orders_only = false;
                    $scope.OpenShareCatalog();
                }
            },
    /*        {
                text: 'Sales Order',
                key: '1',
                className: 'orange',
                action: function (e, dt, node, config, full) {
                    vm.CreateOrderForm('sales_order',full);
                }
            },*/
            {
                text: 'Purchase Order',
                key: '1',
                className: 'orange',
                action: function (e, dt, node, config,full) {
                    vm.CreateOrderForm('purchase_order',full);
                }
            },
            {
                text: 'Disable',
                key: '1',
                className: 'orange',
                action: function (e, dt, node, config) {
                 // alert(JSON.stringify(vm.selected));
                    vm.DisableCatalog();
                }
            },
            {
                text: 'Enable',
                key: '1',
                className: 'orange',
                action: function (e, dt, node, config) {
                 // alert(JSON.stringify(vm.selected));
                    vm.EnableCatalog();
                }
            },
            {
                  text: 'Reset Filter',
                  key: '1',
                  className: 'green',
                  action: function (e, dt, node, config) {
                    localStorage.removeItem('DataTables_' + 'receivedcatalogs-datatables');
                    $state.go($state.current, {}, {reload: true});
                  }
            },
            //'copy',
            'print',
            //'excel'
        ];
        vm.brokerflag = localStorage.getItem('flag_broker');
        vm.retailerflag = localStorage.getItem('flag_retailer');

   /*     vm.BrokerOrderButton = 
            {
                text: 'Brokerage Order',
                key: '1',
                className: 'orange',
                action: function (e, dt, node, config,full) {
                    vm.CreateOrderForm('brokerage_order',full);
                }
            };
        
        if(vm.brokerflag == 'true'){
            vm.TableButtons.splice(3, 0, vm.BrokerOrderButton);
        }
        if(vm.retailerflag == 'true'){
            vm.TableButtons.splice(0, 2);
        }*/

        vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: 'api/receivedcatalogdatatables1/',
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
            3 : { "type" : "text"},
            4 : { "type" : "text"},
            5 : { "type" : "text"},
            8 : { "type" : "select", values:[{"value":"1","label":"Yes"}, {"value":"0","label":"No"}]},
            9 : { "type" : "select", values:[{"value":"Enable","label":"Enable"}, {"value":"Disable","label":"Disable"}]},
        })
        
        .withButtons(vm.TableButtons)
        
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
        //.withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
        .withOption('aaSorting', []) //default Sort
        
        .withPaginationType('full_numbers');
            
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
            .renderWith(function(data, type, full, meta) {
                vm.selected[full[0]] = false;
                vm.selectedFullJson[full[0]] = full;
                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
            }),
            DTColumnDefBuilder.newColumnDef(1).withTitle('Title').renderWith(TitleLink),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Image').renderWith(imageHtml).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Brand'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Category'),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Sold by').renderWith(SupplierLink).notSortable().notVisible(),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Received Date').notSortable(),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Designs').notSortable().withOption('sWidth','5%'),
            DTColumnDefBuilder.newColumnDef(8).withTitle('Trusted Seller').notSortable().notVisible(),
            DTColumnDefBuilder.newColumnDef(9).withTitle('Status').notSortable(),
            DTColumnDefBuilder.newColumnDef(10).withTitle('Actions').renderWith(SupplierChatLink).notSortable().notVisible(),

            //DTColumnDefBuilder.newColumnDef(5).withTitle('Share')
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
