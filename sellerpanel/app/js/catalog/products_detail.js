(function() {
    'use strict';

    angular
        .module('app.companies')
        .controller('ProductsDetailController', ProductsDetailController);

    ProductsDetailController.$inject = ['$resource', 'Catalog', 'Product', 'v2Products', 'v2CategoryEavAttribute', 'ngDialog', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', '$stateParams', 'SweetAlert', 'Suppliers'];
    function ProductsDetailController($resource, Catalog, Product, v2Products, v2CategoryEavAttribute, ngDialog, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, $filter, $stateParams, SweetAlert, Suppliers) {
        CheckAuthenticated.check();        
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
        var vm = this;
        $scope.company_id = localStorage.getItem('company'); 
        
        
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        $scope.update_flag = false;
        $scope.updateUI_called = false;
        
        $scope.alrt = function () {alert("called");};

        
        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
        
        function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);
        }
        function sizeHtml(data, type, full, meta) {
            if (Boolean(full[5])) {
                return full[5];
            }
            else {
                return '<span>N/A</span>'
            }
        }

        function callback(json) {
            console.log(json);
            if(json.recordsTotal > 0 && json.data.length == 0){
                //vm.dtInstance.rerender();
                $state.go($state.current, {}, {reload: true});
            }
        }
        $scope.openCreateOrderConfirm = function () {
            ngDialog.openConfirm({
              template: 'createbulkpurchaseorder',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            })
        };
        $scope.OpenPurchaseOrder = function(){
           $(".modelform3").addClass(progressLoader());
          $scope.catalogid = $stateParams.id;
          Catalog.get({'cid': $scope.company_id, 'id': $scope.catalogid}, function(success){
              $scope.catalog_name = success.title;
              $scope.catalog_supplier = success.supplier;
              $scope.catalog_supplier_name = success.supplier_name;
              $scope.openCreateOrderConfirm();
              $(".modelform3").removeClass(progressLoader());
          });
        }

        $scope.ProductsImages = function () {
            ngDialog.open({
                template: 'productimages',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        $scope.OpenProductsImages = function(id) {
          var pswpElement = document.querySelectorAll('.pswp')[0];
            $(".modelform3").addClass(progressLoader()); 
            $scope.slides = [];
            Product.get({"id":id},
            function (result){
                  $scope.catalog_id = result.catalog;
                  Catalog.get({"id":$scope.catalog_id, "cid":$scope.company_id},
                      function (result){
                          var supplier_name = result.supplier_name;
                          Catalog.get({"id": $scope.catalog_id, "expand":"true", "cid":$scope.company_id},
                          function (success){
                              var products = success.products;
                              //$scope.productimg = []
                              var start_index = 0;
                              for (var i = 0; i < products.length; i++) {
                                  if(products[i].id == id) {
                                    start_index = i;
                                  }
                                  /*$scope.slides.push({
                                    id: products[i].id,
                                    image: products[i].image.thumbnail_medium,
                                    text: products[i].sku,
                                  }); */
                                  var data = '';
                                  if(products[i].sku != null && products[i].sku != ""){
                                    var data = '<strong>SKU: </strong>' + products[i].sku;
                                  }
                                  if(products[i].selling_price != null && products[i].selling_price != "") {
                                    var data = data + '<br><strong>Price: &#8377;</strong>' + products[i].selling_price ;
                                  }
                                  if(success.sell_full_catalog == false){
                                    var data = data + '<br><strong>Singe piece price: &#8377;</strong>' + products[i].single_piece_price;
                                  }
                                  if(success.title != null && success.title != ""){
                                    var data = data + '<br><strong>Catalog: </strong>' + success.title;
                                  }
                                  if(success.brand != null){
                                    if(success.brand.name != null && success.brand.name != ""){
                                      var data = data + '<br><strong>Brand: </strong>' + success.brand.name;
                                    }  
                                  }
                                  if(products[i].fabric != null && products[i].fabric != "" ) {
                                    var data = data + '<br><strong>Fabric: </strong>' + products[i].fabric ;
                                  }
                                  if(products[i].work != null && products[i].work != "") {
                                    var data = data + '<br><strong>Work: </strong>' + products[i].work ;
                                  }
                                  /*if(supplier_name != null && supplier_name != "") {
                                    var data = data + '<br><strong>Sold by: </strong>' + supplier_name ;
                                  }*/
                                  $scope.slides.push({
                                    id: products[i].id,
                                    src: products[i].image.thumbnail_medium,
                                    title: data,
                                    w: 850,
                                    h: 980
                                  }); 
                                  

                              }

                              var options = {
                         // history & focus options are disabled on CodePen        
                                  history: false,
                                  index: start_index,
                                  focus: false,
                                  closeOnScroll:false, 
                                  shareEl: false,
                                  preloaderEl: true,
                                  showAnimationDuration: 0,
                                  hideAnimationDuration: 0
                                  
                              };
                              
                              var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, $scope.slides, options);
                              gallery.init();
                          //    console.log(i);
                            //  $scope.ProductsImages();
                              $(".modelform3").removeClass(progressLoader());  
                          });
                    });
            });
        }
  
  /*      $scope.OpenProductsImages = function(id){
            $(".modelform3").addClass(progressLoader()); 
            ////vm.slides6 = [];
            vm.slides = [];
            Product.get({"id":id},
            function (result){
                $scope.catalog_id = result.catalog;
                  Catalog.get({"id": $scope.catalog_id, "expand":"true", "cid":$scope.company_id},
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
            });
        }  */
        
        vm.DisableProduct = function (){
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
                        Product.get({'id': key, 'cid':$scope.company_id, "sub_resource":"disable"}).$promise.then(function(result){
                            $(".modelform3").removeClass(progressLoader());
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Product has been disabled.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            reloadData();
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
                
                //toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);

                $.notify({
                    title: "Failed",
                    message: "Please select one row",
                },
                    {
                        type: 'info',
                        placement: {
                            from: 'bottom',
                            align: 'right'
                        }
                    });

                setTimeout(function () {
                    $('.uk-notify').fadeout();
                }, 1000);
            }
        }
        
        vm.EnableProduct = function (){
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
                        Product.get({'id': key, 'cid':$scope.company_id, "sub_resource":"enable"}).$promise.then(function(result){
                            $(".modelform3").removeClass(progressLoader());
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Product has been enabled.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            reloadData();
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
                
                //toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                $.notify({
                    title: "Failed",
                    message: "Please select one row",
                },
                    {
                        type: 'info',
                        placement: {
                            from: 'bottom',
                            align: 'right'
                        }
                    });

                setTimeout(function () {
                    $('.uk-notify').fadeout();
                }, 1000);
            }
        }
        $scope.catalog_with_size = false;
        if($stateParams.id != null){
            Catalog.get({'id': $stateParams.id, 'cid': $scope.company_id}, function(success){
              v2CategoryEavAttribute.query({"category": success.category, "attribute_slug" : "size"},
                function(result){
                    $scope.attribute_data = result; 
                    if($scope.attribute_data.length > 0)
                    { 
                      $scope.catalog_with_size = true;
                      console.log("true");
                    }
                    else
                    {
                      $scope.catalog_with_size = false;
                      console.log("false");
                      /*window.setTimeout(function () {
                          $("tr td:nth-child(6)").css('display', "none");
                          $("tr th:nth-child(6)").css('display', "none");
                      }, 100)*/
                    }
                });
            });
        }
        function imageHtml(data, type, full, meta){
            if (!$scope.updateUI_called) {
                UpdateCheckBoxUI();
                $scope.updateUI_called = true;
            }
            /*if($scope.catalog_with_size == false)  {
                window.setTimeout(function () {
                    $("tr td:nth-child(6)").css('display', "none");
                    $("tr th:nth-child(6)").css('display', "none");
                }, 1000)
            }*/
            return '<a ng-click="OpenProductsImages(' + full[0] +')" class="hvr-grow"><img class="loading" src="'+full[1]+'" style="width: 100px; height: 100px"/></a>';
        }
        
        
        vm.CloseDialog = function() {
            ngDialog.close();
        };
        
        $scope.OpenEnquiry = function () {
            ngDialog.openConfirm({
              template: 'addenquiry',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            })
        };
        
        vm.CreateEnquiry = function (){
            if(vm.addEnquiryForm.$valid) {
                $(".modelform").addClass(progressLoader()); 
                
                var supplierjson = {'details': '{"catalog":'+$stateParams.id+'}', 'cid':$scope.company_id
                    , 'buyer_type': 'Enquiry', 'enquiry_catalog':parseInt($stateParams.id)
                    , 'enquiry_item_type':vm.enquiry.enquiry_item_type, 'enquiry_quantity':vm.enquiry.enquiry_quantity};
                
                Suppliers.save(supplierjson).$promise.then(function(result){
                    $(".modelform").removeClass(progressLoader());
                    
                    vm.successtoaster = {
                        type:  'success', 
                        title: 'Success',
                        text:  result.success //'Enquiry has been sent successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    reloadData();
                    ngDialog.close();
                });
            }
            else 
            {
                vm.addEnquiryForm.enquiry_item_type.$dirty = true; 
                vm.addEnquiryForm.enquiry_quantity.$dirty = true; 
            }
        };
        
        var buttons = [];
     /*   buttons.push({
                text: 'Purchase Order',
                key: '1',
                className: 'orange',
                action: function (e, dt, node, config) {
                    $scope.OpenPurchaseOrder();
                }
            });  */
    /*    if($stateParams.type == 'publiccatalog'){
            buttons.push({
                text: 'Send Enquiry',
                key: '1',
                className: 'orange',
                action: function (e, dt, node, config) {
                    $scope.OpenEnquiry();
                }
            }); 
        }else{  */
        buttons.push({
            text: 'Reset Filter',
            key: '1',
            className: 'buttonSecondary',
            action: function (e, dt, node, config) {
                //localStorage.removeItem('DataTables_' + 'products-datatables');
                $state.go($state.current, {}, { reload: true });
            }
        
        });
      //  }
        
        buttons.push('print');
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: 'api/productsdetaildatatables1/?type='+$stateParams.type+'&id='+$stateParams.id,
                          type: 'GET',
                      })
                      .withDOM('rtipl')
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
                        4 : { "type" : "text"},
                        6 : { "type" : "numberRange"},
                        7: { "type": "select", values: [{ "value": 1, "label": "Enable" }, { "value": 0, "label": "Disable" }] },
                        8: { "type": "select", values: [{ "value": 1, "label": "Full Available" }, { "value": 0, "label": "Singles Available" }]}
                      })
                      
                      .withOption('processing', true)
                      .withOption('serverSide', true)
                      .withOption('iDisplayLength', 10)
                      //.withOption('responsive', true)
                      .withOption('scrollX', true)
                      .withOption('scrollY', getDataTableHeight())
                      .withOption('scrollCollapse', true)
                      .withOption('aaSorting', [2, 'asc']) //Sort by ID Desc
                      
                      .withPaginationType('full_numbers')
                      
                      .withButtons(buttons);
                     
                      vm.dtColumnDefs = [
                          DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable().notVisible()
                            .renderWith(function(data, type, full, meta) {
                                vm.selected[full[0]] = false;
                                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                            }),
                            DTColumnDefBuilder.newColumnDef(1).withTitle('Image').renderWith(imageHtml).notSortable(),
                            DTColumnDefBuilder.newColumnDef(2).withTitle('SKU'),
                            DTColumnDefBuilder.newColumnDef(3).withTitle('Fabric').notSortable(),
                            DTColumnDefBuilder.newColumnDef(4).withTitle('Work').notSortable(),
                            DTColumnDefBuilder.newColumnDef(5).withTitle('Size').renderWith(sizeHtml).notSortable(),,
                            DTColumnDefBuilder.newColumnDef(6).withTitle('Price'),
                            DTColumnDefBuilder.newColumnDef(7).withTitle('Enabled').notSortable(),
                            DTColumnDefBuilder.newColumnDef(8).withTitle('Single Available').notSortable(),
                            DTColumnDefBuilder.newColumnDef(9).withTitle('Sort Order').notVisible()
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

        $(document).ready(function () {
            setTimeout(function () {
                var paginationbuttons = document.getElementsByClassName('paging_full_numbers')
                var i = paginationbuttons.length;
                while (i--) {
                    paginationbuttons[i].addEventListener("click", function () {
                        UpdateCheckBoxUIfilters();
                    });
                }
                var tableheaders = document.getElementsByTagName('th');
                var j = tableheaders.length;
                while (j--) {
                    tableheaders[j].addEventListener("click", function () {
                        UpdateCheckBoxUIfilters();
                    });
                    tableheaders[j].addEventListener("keydown", function () {
                        UpdateCheckBoxUIfilters();
                    });
                }
                console.log('UpdateCheckBoxUI() attached')

            }, 3000);
        });



           /*vm.DeleteProduct = function (){
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })
            
            if(true_count > 0)
            {
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
                    angular.forEach(vm.selected, function(value, key) {
                        if(value==true){
                            $(".modelform3").addClass(progressLoader());
                            Product.delete({'id':key},
                            function(success){
                                $(".modelform3").removeClass(progressLoader());
                                //$scope.dtInstance.reloadData();
                                vm.successtoaster = {
                                    type:  'success',
                                    title: 'Success',
                                    text:  'Product deleted successfully.'
                                };
                                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                reloadData();
                            });
                        }
                    })
                    //SweetAlert.swal('Deleted!', 'Selected rows has been deleted.', 'success');   
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
        } */
        
    }
})();
