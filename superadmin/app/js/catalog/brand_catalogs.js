(function() {
    'use strict';

    angular
        .module('app.companies')
        .controller('BrandCatalogsController', BrandCatalogsController);

    BrandCatalogsController.$inject = ['$resource', 'Catalog',  'ngDialog', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', '$stateParams', 'SweetAlert', 'Suppliers'];
    function BrandCatalogsController($resource, Catalog, ngDialog, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, $filter, $stateParams, SweetAlert, Suppliers) {
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

        $scope.ProductsImages = function () {
            ngDialog.open({
                template: 'productimages',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        $scope.alrt = function () {alert("called");};
        
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
        
   /*     $scope.OpenProductsImages = function(id){
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
        }  */


        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
        function imageHtml(data, type, full, meta){
          return '<a ng-click="OpenProductsImages('+full[0]+','+full[6]+')"><img class="loading" src="'+full[2]+'" style="width: 100px; height: 100px"/></a>';
        }
        $scope.OpenNoProductsAlert = function() {
           vm.errortoaster = {
                        type:  'error',
                        title: 'Empty Catalog',
                        text:  'This catalog has no products.'
                    };
                    
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
        }
        function TitleLink(data, type, full, meta){
          if(full[8] == 0){
              return '<a ng-click="OpenNoProductsAlert()">'+full[1]+'</a>';
          }
          else if(full[8]=='received')  {
            return '<a href="#/app/products-detail/?type=receivedcatalog&id='+full[0]+'&name='+full[1]+'">'+full[1]+'</a>';
          }
          else if (full[8] == 'mycatalog') {
            return '<a href="#/app/product/?type=mycatalog&id='+full[0]+'&name='+full[1]+'">'+full[1]+'</a>';
          }
          else {
             return '<a href="#/app/products-detail/?type=publiccatalog&id='+full[0]+'&name='+full[1]+'">'+full[1]+'</a>';
          }
        }
        
        function reloadData() {
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
      
        
     /*   var buttons = []
        if($stateParams.type == 'publiccatalog'){
            buttons.push({
                text: 'Send Enquiry',
                key: '1',
                className: 'orange',
                action: function (e, dt, node, config) {
                    vm.CreateEnquiry();
                }
            });
        }else{
            buttons.push({
                    text: 'Disable',
                    key: '1',
                    className: 'orange',
                    action: function (e, dt, node, config) {
                        vm.DisableProduct();
                    }
                },
                {
                    text: 'Enable',
                    key: '1',
                    className: 'orange',
                    action: function (e, dt, node, config) {
                    vm.EnableProduct();
                }
            });
        } */
        
    //    buttons.push('print');
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: 'api/brandscatalogdatatables/?brand='+$stateParams.brand,
                         // url: 'api/brandscatalogdatatables/?brand=241',
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
                      })
                      
                      .withOption('processing', true)
                      .withOption('serverSide', true)
                      .withOption('iDisplayLength', 10)
                      //.withOption('responsive', true)
                      .withOption('scrollX', true)
                      .withOption('scrollY', getDataTableHeight())
                      .withOption('scrollCollapse', true)
                      .withOption('aaSorting', [0, 'asc']) //Sort by ID Desc
                      
                      .withPaginationType('full_numbers')
                      
                      //.withButtons(buttons);
                      /*.withButtons([
                          {
                            text: 'Delete',
                            key: '1',
                            className: 'red',
                            action: function (e, dt, node, config) {
                            
                                vm.DeleteProduct();
                            }
                          },
                          'print',
                          
                      ]);*/
                          
            vm.dtColumnDefs = [
      					DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
      					.renderWith(function(data, type, full, meta) {
      					  vm.selected[full[0]] = false;
      					  return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
      					}),
                DTColumnDefBuilder.newColumnDef(1).withTitle('Name').renderWith(TitleLink),
      					DTColumnDefBuilder.newColumnDef(2).withTitle('Image').renderWith(imageHtml).notSortable(),
      					DTColumnDefBuilder.newColumnDef(3).withTitle('Brand'),
      					DTColumnDefBuilder.newColumnDef(4).withTitle('Category'),
      					DTColumnDefBuilder.newColumnDef(5).withTitle('Sold by').notVisible(),
      					DTColumnDefBuilder.newColumnDef(6).withTitle('No. of Designs').notSortable(),
                DTColumnDefBuilder.newColumnDef(7).withTitle('Status').notSortable(),
                     
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
