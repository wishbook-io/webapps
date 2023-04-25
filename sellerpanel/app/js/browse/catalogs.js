(function() {
    'use strict';

    angular
        .module('app.browse')
        .controller('BrowseController', BrowseController)
        .directive('imageloaded', imageloaded); // required by demo

    BrowseController.$inject = ['RouteHelpers', 'Catalog', 'Promotions', '$localStorage', '$scope', 'Brand', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$rootScope', '$stateParams', '$location', 'ngDialog', 'toaster', '$state'];
    function BrowseController(RouteHelpers, Catalog, Promotions, $localStorage, $scope, Brand, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $rootScope, $stateParams, $location, ngDialog, toaster, $state) {
        var vm = this;
        
        $scope.company_id = localStorage.getItem('company');
        $scope.search_form = {"catalog_type":$stateParams.catalog_type};

        vm.basepath = RouteHelpers.basepath;
        
        vm.searchjson = {}
        
        vm.photos = [];
        $scope.limit = 15;
        $scope.offset = 0;
        $scope.no_more_records = false;
        $scope.offset_que = [];
        
        function resetPagination(){
            $scope.offset = 0;
            $scope.no_more_records = false;
            $scope.offset_que = [];
            vm.photos = [];
        }
        
        
        function getGridUrl(id, name, supplier){
            var catalogptype;
            if($scope.search_form.catalog_type=="public"){
                if(supplier == $scope.company_id){
                  return '#/app/product/?type=mycatalog&id='+id+'&name='+name;
                }
                else{
                  catalogptype = 'publiccatalog';
                }
            }
            else if($scope.search_form.catalog_type=="myreceived"){
                catalogptype = 'receivedcatalog';
            }
            return '#/app/products-detail/?type='+catalogptype+'&id='+id+'&name='+name;
        }
        
        $scope.fetchCatalog = function (params) {
            params['limit'] = $scope.limit;
            params['offset'] = $scope.offset;
            //console.log(params);
            console.log("offset index = "+$scope.offset_que.indexOf($scope.offset));
            
            if($scope.offset_que.indexOf($scope.offset) >= 0){
                console.log("offset return");
                return;
            }
            $scope.offset_que.push($scope.offset);
            console.log("offset ajax call");
            
            Catalog.query(params,function (success)
            {
                if(success.length==0){
                    alert("No more records.");
                }
                if(success.length < $scope.limit){
                    $scope.no_more_records = true;
                }
                for (var i = 0; i < success.length; i++) {
                    var redirect_url = getGridUrl(success[i].id, success[i].title, success[i].supplier)
                    vm.photos.push({id: success[i].id, brand_name: success[i].brand_name, name: success[i].title, supplier_name: success[i].supplier_name, total_products: success[i].total_products, src: success[i].thumbnail.thumbnail_small, redirect_url:redirect_url, is_trusted_seller: success[i].is_trusted_seller, price_range: success[i].price_range});
                }
                $scope.offset += $scope.limit;
            });
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
        } */
        $scope.slides = [];
        $scope.myInterval = 4000;
        Promotions.query(
          function(result){
              var banners = result;
              
              for (var i = 0; i < banners.length; i++) {
                    var slide_url = '';
                    if(banners[i].landing_page_type == "Webview"){
                      slide_url = banners[i].landing_page;
                    }
                    else if (banners[i].landing_page_type == "Tab")
                    {
                       if(banners[i].landing_page.indexOf("catalogs") > -1)
                       {
                          slide_url = '#/app/catalog';
                       }
                       else if(banners[i].landing_page.indexOf("users") > -1)
                       {
                          slide_url = '#/app/buyers';
                       }
                       else if(banners[i].landing_page.indexOf("catalogs") > -1)
                       {
                          slide_url = '#/app/salesorders';
                       }
                       else if(banners[i].landing_page.indexOf("gst") > -1)
                       {
                          slide_url = '#/app/gst';
                       }
                    }
                    else{
                       slide_url = '';
                    }
                    
                      $scope.slides.push({
                        id: banners[i].id,
                        image: banners[i].image.banner,
                        url: slide_url,
                      });
              }
          });


   /*$scope.bannerclick = function (banner){
          console.log(banner);
          console.log(banner.landing_page_type);
              if(banner.landing_page_type == "Html"){

                showFAQbyTag(banner.landing_page);
              }
              else if(banner.landing_page_type == "faq"){

                showFAQbyTag(banner.landing_page);
              }
              else if(banner.landing_page_type == "Tab"){

                if(banner.landing_page.indexOf("catalogs") > -1)
                  mainTabs.setActiveTab(1);
                else if (banner.landing_page.indexOf( "users") > -1) 
                  mainTabs.setActiveTab(2);
                else if (banner.landing_page.indexOf( "orders") > -1)
                  mainTabs.setActiveTab(3);

              }
              else if(banner.landing_page_type == "Webview"){
                window.open(banner.landing_page);
              }
              else if(banner.landing_page_type == "support_chat"){

                showSupportChat();
              }
         }  */

        $scope.OpenProductsImages = function(id,prod_count){
            $(".modelform3").addClass(progressLoader()); 
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
                          $(".modelform3").removeClass(progressLoader());  
                          openPhotoSwipe($scope.catalogdata,success); 
                      });
                   });

            }
        }

        /*
        vm.slides = [];
        $scope.OpenProductsImages = function(id){
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

        /*vm.searchjson = {"cid":$scope.company_id, "view_type":$scope.search_form.catalog_type};
        $scope.fetchCatalog(vm.searchjson);*/
        
        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
        
        function imageHtml(data, type, full, meta){
          return '<a ng-click="OpenProductsImages('+full[0]+','+full[8]+')"><img class="loading" src="'+full[3]+'" style="width: 100px; height: 100px"/></a>';
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
          else{
            var catalogptype;
            if($scope.search_form.catalog_type=="public"){
                if (full[1]['catalog_type'] == 'mycatalog') {
                  return '<a href="#/app/product/?type=mycatalog&id='+full[0]+'&name='+full[2]+'">'+full[2]+'</a>';
                }
                else {
                  catalogptype = 'publiccatalog';
                  return '<a href="#/app/products-detail/?type='+catalogptype+'&id='+full[0]+'&name='+full[2]+'">'+full[2]+'</a>';
                }
            }
            else if($scope.search_form.catalog_type=="myreceived"){
                catalogptype = 'receivedcatalog';
                return '<a href="#/app/products-detail/?type='+catalogptype+'&id='+full[0]+'&name='+full[2]+'">'+full[2]+'</a>';
            }
            
          }

        }
        
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};
        
        vm.datatables_url = ''
        
        function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);
        }

        function callback(json) {
            if(json.recordsTotal > 0 && json.data.length == 0){
                //vm.dtInstance.rerender();
                $state.go($state.current, {}, {reload: true});
            }
        }
        
        
        //vm.list_view_type = $stateParams.view_type; //'grid';
        //$(".view_type_grid").addClass('buttonselected');
        
        
        
        $scope.changeCatalogType = function(catalog_type, use_ajax=true) {
            vm.searchjson = {"cid":$scope.company_id};
            vm.searchjson['view_type'] = catalog_type;
            $scope.search_form = {"catalog_type":catalog_type};
            
            $location.search('catalog_type', catalog_type);
            
            //$scope.offset = 0;
            //$scope.no_more_records = false;
            resetPagination();
            //vm.photos = [];
            $scope.fetchCatalog(vm.searchjson);	
            
            if(catalog_type=="public"){
                vm.datatables_url = "api/publiccatalogdatatables1/";
                $scope.brands = Brand.query({cid:$scope.company_id, 'type':'public', sub_resource:"dropdown"});
            }
            else if(catalog_type=="myreceived"){
                vm.datatables_url = 'api/receivedcatalogdatatables1/';
                $scope.brands = Brand.query({cid:$scope.company_id, sub_resource:"dropdown"});
            }
            
            if(use_ajax)
                vm.dtOptions.ajax.url = vm.datatables_url;
        };
        
        
        //vm.datatables_url = "api/publiccatalogdatatables1/";
        $scope.changeCatalogType($scope.search_form.catalog_type, false);
        
        $scope.viewType = function (vtype, use_reload=true) {
            vm.list_view_type = vtype;
            $location.search('view_type', vtype);
            
            if(vm.list_view_type=="grid"){
                $(".view_type_grid").addClass('buttonselected');
                $(".view_type_list").removeClass('buttonselected');
            }
            else if(vm.list_view_type=="list"){
                $(".view_type_list").addClass('buttonselected');
                $(".view_type_grid").removeClass('buttonselected');
                if(use_reload)
                    reloadData();
            }
            
        }

        $scope.changeTrustedSellerFlag = function(trustedflag){
          
          if(trustedflag ==  true){
            vm.searchjson['trusted_seller'] = trustedflag;
          }
          else{
           vm.searchjson['trusted_seller'] = null; 
          }
          resetPagination();
          $scope.fetchCatalog(vm.searchjson); 
        }
        
        $scope.Search = function () {
            vm.searchjson = {"cid":$scope.company_id};
            
            vm.searchjson['view_type'] = $scope.search_form.catalog_type;
            
            if($scope.search_form.name != ""){
                vm.searchjson['title'] = $scope.search_form.name;
            }
            if($scope.search_form.brand != ""){
                vm.searchjson['brand'] = $scope.search_form.brand;
            }
            //if($scope.search_form.min_price >= 0 && $scope.search_form.max_price > 0){
            if($scope.search_form.min_price >= 0 || $scope.search_form.max_price > 0){
                vm.searchjson['min_price'] = $scope.search_form.min_price;
                vm.searchjson['max_price'] = $scope.search_form.max_price;
            }
            if($scope.search_form.work != ""){
                vm.searchjson['work'] = $scope.search_form.work;
            }
            if($scope.search_form.fabric != ""){
                vm.searchjson['fabric'] = $scope.search_form.fabric;
            }
            if($scope.search_form.trusted_seller ==  true){
              vm.searchjson['trusted_seller'] = $scope.search_form.trusted_seller;
            }
                            
            //alert(JSON.stringify(searchjson));
            
            //$scope.offset = 0;
            //$scope.no_more_records = false;
            resetPagination();
            //vm.photos = [];
            $scope.fetchCatalog(vm.searchjson);	
        }
        
        $scope.ShowMore = function () {
            if($scope.no_more_records==false)
                $scope.fetchCatalog(vm.searchjson);	
        }
        
        
        
        
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
              /*1 : { "type" : "text"},
              3 : { "type" : "text"},
              5 : { "type" : "text"},
              4 : { "type" : "text"},
              8 : { "type" : "select", values:[{"value":"1","label":"Yes"}, {"value":"0","label":"No"}]}, */
            2 : { "type" : "text"},
            4 : { "type" : "text"},
            5 : { "type" : "text"},
            6 : { "type" : "text"},
            7 : { "type" : "dateRange", width: '100%'},
            9 : { "type" : "select", values:[{"value":"1","label":"Yes"}, {"value":"0","label":"No"}]},
            10 : { "type" : "select", values:[{"value":"catalog","label":"Catalog"}, {"value":"noncatalog","label":"NonCatalog"}]},
          })
          
          .withOption('processing', true)
          .withOption('serverSide', true)
          .withOption('iDisplayLength', 10)
          .withOption('responsive', true)
          .withOption('scrollX', true)
          .withOption('scrollY', getDataTableHeight())
          //.withOption('scrollCollapse', true)
          .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
          
          .withPaginationType('full_numbers')
          
          .withButtons([
              /*{
                  text: 'Reset Filter',
                  key: '1',
                  className: 'green',
                  action: function (e, dt, node, config) {
                    localStorage.removeItem('DataTables_' + 'receivedcatalogs-datatables');
                    localStorage.removeItem('DataTables_' + 'publiccatalogs-datatables');
                    $state.go($state.current, {}, {reload: true});
                  }
              },*/
              'copy',
              'print',
              'excel',
              
          ]);
              
          vm.dtColumnDefs = [
              DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
              .renderWith(function(data, type, full, meta) {
                  vm.selected[full[0]] = false;
                  return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
              }),
              DTColumnDefBuilder.newColumnDef(1).withTitle('json').notVisible(),
              DTColumnDefBuilder.newColumnDef(2).withTitle('Title').renderWith(TitleLink),
              DTColumnDefBuilder.newColumnDef(3).withTitle('Image').renderWith(imageHtml).notSortable(),
              DTColumnDefBuilder.newColumnDef(4).withTitle('Brand'),
              DTColumnDefBuilder.newColumnDef(5).withTitle('Category'),
              DTColumnDefBuilder.newColumnDef(6).withTitle('Sold by').notSortable().notVisible(),
              DTColumnDefBuilder.newColumnDef(7).withTitle('Date').notSortable().withOption('sWidth','10%'),
              DTColumnDefBuilder.newColumnDef(8).withTitle('Designs').notSortable().withOption('sWidth','5%'),
              DTColumnDefBuilder.newColumnDef(9).withTitle('Trusted Seller').notSortable().withOption('sWidth','8%').notVisible(),
              DTColumnDefBuilder.newColumnDef(10).withTitle('Type'),
              //DTColumnDefBuilder.newColumnDef(5).withTitle('Past Shares').notSortable()
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
        
        //$scope.brands = Brand.query({cid:$scope.company_id});
        
        
        
        $scope.viewType($stateParams.view_type, false);
        
    }

    function imageloaded () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
          var cssClass = attrs.loadedclass;

          element.bind('load', function () {
              angular.element(element).addClass(cssClass);
          });
        }
    }
    

})();
