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
        .controller('CatalogController', CatalogController);

    CatalogController.$inject = ['$http', '$resource', 'CategoryEavAttribute', 'v2CategoryEavAttribute', 'v2Category', 'EnumGroup', 'Promotions',  'Brand' ,'Catalog', 'CatalogUploadOptions', 'Product', 'Category', 'Company', 'BuyerList', 'SalesOrders', 'toaster', 'ngDialog', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', 'Upload', '$filter', '$cookies', '$localStorage', 'SweetAlert','Notification','NotificationEntity','NotificationTemplate', 'sharedProperties'];
    function CatalogController($http, $resource, CategoryEavAttribute, v2CategoryEavAttribute, v2Category, EnumGroup, Promotions, Brand, Catalog, CatalogUploadOptions, Product, Category, Company, BuyerList, SalesOrders, toaster, ngDialog, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, Upload, $filter, $cookies, $localStorage, SweetAlert,Notification,NotificationEntity,NotificationTemplate, sharedProperties) {
        CheckAuthenticated.check();
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
        var vm = this;
        $scope.cataloguploadoptions_isadded = true;


        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');

      /*  vm.catalogs = Catalog.query({cid:$scope.company_id, id:"dropdown"});
        vm.buyers = BuyerList.query({'cid':$scope.company_id});
        vm.agents = Company.query({'id':$scope.company_id, 'sub_resource':'brokers'});
        $scope.cdata = {}
        $scope.CatalogArray = function() {
            console.log(JSON.stringify(vm.order));
        }  */

     //   console.log($scope.company_id);

        /*vm.colors = ['#fc0003'];

        function getSlide(target, style) {
          var i = target.length;
          return {
              id: (i + 1),
              label: 'slide #' + (i + 1),
              //img: 'http://lorempixel.com/1200/500/' + style + '/' + ((i + 1) % 10) ,
              //img: 'http://aks.b2bapi.com/media/__sized__/product_image/blob_om4J3os-thumbnail-400x562-100.jpg' ,
              img: style,
              color: vm.colors[ (i*10) % vm.colors.length],
              odd: (i % 2 === 0)
          };
        }

        function addSlide(target, style) {
          target.push(getSlide(target, style));
        }

       function addSlides(target, style, qty) {
          for (var i=0; i < qty; i++) {
              addSlide(target, style);
          }
        }

        vm.slides6 = [];
        vm.carouselIndex6 = 0;
        //addSlides(vm.slides6, 'sports', 10);
        //addSlide(vm.slides6, 'http://aks.b2bapi.com/media/__sized__/product_image/-thumbnai.jpg');
        //addSlide(vm.slides6, 'http://aks.b2bapi.com/media/__sized__/product_image/-thumbnail.jpg');

        vm.addSlide = function(at) {
          if(at==='head') {
              vm.slides6.unshift(getSlide(vm.slides6, 'http://aks.b2bapi.com/media/__sized__/product_image/humbnail.jpg'));
          } else {
              vm.slides6.push(getSlide(vm.slides6, 'http://aks.b2bapi.com/media/__sized__/product_image/thumbnail.jpg'));
          }
        };*/

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

       /* function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);
        }  */

        $scope.reloadData  = function () {
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
        $scope.ProductsImages = function () {
            ngDialog.open({
                template: 'productimages',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

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


 /*       $scope.EmptyCatalogDialog = function () {
            ngDialog.open({
                template: 'emptycatalog',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };


        vm.myInterval = 5000;

        vm.slides = [];


        $scope.OpenProductsImages = function(id,prod_count){
          if(prod_count == 0)
          {
            $scope.EmptyCatalogDialog();
          }
          else {
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
          }
        }  */

        function imageHtml(data, type, full, meta){
          return '<div style="text-align: center;"><a ng-click="OpenProductsImages('+full[0]+','+full[10]+')"><img class="loading" src="'+full[4]+'" style="height: 100px; width: 100px;"/></a></div>';
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
          if(full[10] == 0){
              return '<a ng-click="OpenNoProductsAlert()">'+full[3]+'</a>';
          }
          else{
            return '<a href="#/app/product/?type=mycatalog&id='+full[0]+'&name='+full[3]+'" target=_blank>'+full[3]+'</a>';
          }
        }

        function IDHtml(data, type, full, meta){
          return full[0];
        }

        function DataFormating(data, type, full, meta){
          var fullstr = data.toString()
          fullstr = fullstr.replace(/,/g, ",\n")

          var substr = ""
          for (var i = 0; i < data.length; i++) {
              //if(data[i] != ""){
              if (i == data.length -1) {
                substr += data[i].substring(0,15);
                continue;
              }
                substr += data[i].substring(0,15) + ",<br>";
          }

          return '<p title="'+fullstr+'" style="cursor: pointer;">'+substr+'</p>';
        }

        function SellerFormating(data, type, full, meta) {
          var substr = ""
          for (var i = 0; i < data.length; i++) {
				substr += data[i].name.substring(0,15) + ", "+data[i].sell_full_catalog + "(" + '<a ng-click="OpenCompanyEdit('+data[i].id+')">'+data[i].id+'</a>' +" )";
                if (i != data.length -1) {
                    substr += ",<br>";
                }

              /*if (i == data.length -1) {
               // substr += data[i].name.substring(0,15) + "(" + '<a ng-click="OpenCompany('+data[i].id+')">'+data[i].id+'</a>' +" )";
                substr += data[i].name.substring(0,15) + "(" + '<a ng-click="OpenCompanyEdit('+data[i].id+')">'+data[i].id+'</a>' +" )";
                continue;
              }
                //substr += data[i].name.substring(0,15) + "(" + '<a ng-click="OpenCompany('+data[i].id+')">'+data[i].id+'</a>' +" ),<br>";
                substr += data[i].name.substring(0,15) + "(" + '<a ng-click="OpenCompanyEdit('+data[i].id+')">'+data[i].id+'</a>' +" ),<br>";
              */
          }
          return '<p style="cursor: pointer;">'+substr+'</p>';
        }

        function PreferredSeller(data, type, full, meta) {
          var substr = ""
          for (var i = 0; i < data.length; i++) {
                substr += data[i].preferred_seller__name.substring(0,15) + "-" +data[i].discount + "%,"+data[i].sell_full_catalog+"(" + '<a ng-click="OpenCompanyEdit('+data[i].preferred_seller+')">'+data[i].preferred_seller+'</a>' +" )";
                if (i != data.length -1) {
                    substr += ",<br>";
                }
          }
          return '<p style="cursor: pointer;">'+substr+'</p>';
        }



        function BrandTitleLink(data, type, full, meta){
          return '<a href="#/app/brand-catalogs/?brand='+full[1]['brand']+'&name='+full[4]+'">'+full[4]+'</a>';
        }

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

         $scope.openConfirm = function () {

            ngDialog.openConfirm({
              template: 'addcatalog',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            })
          };


          function creatingData(node, tempArr)
          {

                  var temp = {};
                  var length;
                  temp.id = node.id;
                  //alert(tempArr);
                  if(tempArr != null)
                  {
                    if(tempArr.indexOf(node.id) != -1)
                    {
                      //console.log(tempArr);
                      temp.state = {};
                      //temp.state.selected = true;
                      temp.state.checked = true;
                      temp.state.opened = false;
                    }
                  }
                  temp.text = node.category_name;
                  if(node.child_category != null)
                  {
                    temp.children =[];
                    length = node.child_category.length;
                    for(var i=0;i<length;i++)
                    {
                      var child = creatingData(node.child_category[i], tempArr);
                      temp.children.push(child);
                    }
                  }
               //   alert(JSON.stringify(temp));
                  return temp;

          }


      function categoryTree(tempArr){

                $scope.data = [];
               for(var i=0; i<$scope.categories.length; i++)
                {
                  var temp = {};
                  temp = creatingData($scope.categories[i],tempArr);
                  $scope.data.push(temp);
                }

           //     alert(JSON.stringify($scope.data));
                vm.treeData = $scope.data;

                vm.treeConfig = {
                    core : {
                        multiple : false,
                        animation: true,
                        error : function(error) {
                            console.log('treeCtrl: error from js tree - ' + angular.toJson(error));
                        },
                        check_callback : true,
                        worker : true,
                    },
                    rule: {
                        multiple: false
                    },
                    version : 1,

                    plugins : ['checkbox'],//'wholerow','types',
                    checkbox: {
                                tie_selection: false,
                                multiple : false,
                                //keep_selected_style: false
                              }

                };
          }

     /*     $scope.OpenCatalogForm = function(tempArr) {
              //alert(vm.catalog.company);
              $scope.brands = Brand.query({cid: vm.catalog.company, company: vm.catalog.company, type:"my", sub_resource:"dropdown"});
              EnumGroup.query({type:"fabric"}).$promise.then(function(success){
                $scope.fabrics = success;
              });

              EnumGroup.query({type:"work"}).$promise.then(function(success){
                $scope.works = success;
              });
              EnumGroup.query({type:"style"}).$promise.then(function(success){
                $scope.styles = success;
              });

              $scope.categories = Category.query({parent: 10});
              $scope.openConfirm();
          };  */


      /*  $scope.getSelectedCategories = function() {

              alert('test');
              var selected_nodes = $scope.treeInstance.jstree(true).get_checked(true);
              console.log(selected_nodes);
          }; */
       //  var selected_nodes = $scope.treeInstance.jstree(true).get_selected();
      // $scope.selected_nodes =   $('#tree_2').jstree('get_bottom_checked');

            /*$scope.uploadCatImage = function (files) {
              $scope.files = files;
              console.log($scope.files);
              angular.forEach(files, function(file, key) {

                    var fr = new FileReader();
                    fr.readAsDataURL(file);
                    var blob;
                    fr.onload = function () {

                        var image = new Image();
                        image.src = fr.result;
                             console.log('over sized image '+file.size);
                        var quality =  (1000000/file.size)*100;
                        // output file format (jpg || png)
                        var output_format = 'jpg';
                        //This function returns an Image Object
                        var target_img = jic.compress(image,quality,output_format).src;
                        // console.log('compressed');
                        // console.log(target_img);
                        var blob = dataURItoBlob(target_img);
                        console.log(blob);
                        $scope.image = blob;
                        $scope.$apply();
                    }
              });

          };*/

          //document.getElementById("sell_full_catalog").checked = true;

            /*vm.catalog.thumbnail = '';
            vm.croppedDataUrl = '';

            var handleFileSelect=function(evt) {
              var file=evt.currentTarget.files[0];
              var reader = new FileReader();
              reader.onload = function (evt) {
                $scope.$apply(function($scope){
                  vm.catalog.thumbnail=evt.target.result;
                });
              };
              reader.readAsDataURL(file);
            };
            angular.element(document.querySelector('#thumbnail')).on('change',handleFileSelect);*/


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
              template: 'createbulkorder',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            })
        };

        $scope.OpenEnableCatalogPopup = function () {
            ngDialog.openConfirm({
              template: 'openenablemodal',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            })
        };

        $scope.OpenDisableCatalogPopup = function () {
            ngDialog.openConfirm({
              template: 'opendisablemodal',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            })
        };

        vm.CreateOrderForm = function (order_type){
            vm.order_type = order_type

            $scope.true_key = [];
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){

                    $scope.true_key[true_count] = key;
                    true_count++;
                }
            });

          /*  var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })

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
                        vm.buyers = BuyerList.query({'cid':$scope.company_id});
                    }else{
                        //vm.suppliers = SupplierList.query({'cid':$scope.company_id});
                        CatalogRes.get({'id': vm.true_key, 'cid':$scope.company_id, 'sub_resource':'suppliers'}).$promise.then(function(result){
                            vm.order.supplier = result.selling_company;

                            Company.get({'id':result.selling_company}).$promise.then(function(result){
                                vm.supplier_title = result.name
                            })

                        })
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
                       // vm.order.products[i] = {id:product.id, price:product.price, public_price:product.public_price, quantity:1, image:product.image.thumbnail_small, sku:product.sku, is_select:true};
                        if(vm.order_type == 'sales_order'){
                            vm.order.products[i] = {id:product.id, selling_price:product.selling_price, quantity:1, image:product.image.thumbnail_small, sku:product.sku, is_select:true};
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
         $scope.openCreateOrderConfirm();
        };

        /*vm.removeProduct = function(idx){
            vm.order.products.splice(idx, 1);
        } */

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
                vm.orderForm.buyer.$dirty = true;

            }
        }
        //createorder end



        vm.DeleteCatalog = function (){
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
                            if(vm.selectedFullJson[key][1]["catalog_type"] == "catalogseller"){
                                toaster.pop("error", "Failed", vm.selectedFullJson[key][0]+" catalog can't be deleted because you are a seller");
                            }
                            else{
                                $(".modelform3").addClass(progressLoader());
                                Catalog.delete({'id':key, 'cid':$scope.company_id},
                                function(success){
                                    $(".modelform3").removeClass(progressLoader());
                                    //$scope.dtInstance.$scope.reloadData();
                                    vm.successtoaster = {
                                        type:  'success',
                                        title: 'Success',
                                        text:  'Catalog deleted successfully.'
                                    };
                                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                    $scope.reloadData();
                                });

                            }
                        }
                    });
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
        }





      $scope.to_enable = []

      vm.OpenEnableCatalog = function (){
          var true_count = 0;
          angular.forEach(vm.selected, function(value, key) {
              if(value==true){
                  true_count++;
                  vm.true_key = key;
              }
          })
          if(true_count == 1)
          {
            $scope.to_enable = []

            $scope.all_sellers_data = vm.selectedFullJson[vm.true_key][1]["all_sellers_data"];

            for(var i=0; i < $scope.all_sellers_data.length; i++){
                if($scope.all_sellers_data[i].status == "Disable"){
                    $scope.all_sellers_data[i].duration = 30;
                    $scope.all_sellers_data[i].is_select = true;
                    $scope.to_enable.push($scope.all_sellers_data[i]);
                }
            }
            console.log($scope.to_enable);
            $scope.OpenEnableCatalogPopup();
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
            for(var i=0; i < $scope.to_enable.length; i++){
                var formvalue = $scope.to_enable[i];
                if(formvalue.is_select == true){
                    var today = new Date();
                    var expiry_date = today.setDate(today.getDate() + formvalue.duration);

                    expiry_date = formatDate(expiry_date) + "T23:59:59Z"

                    Catalog.save({'id': vm.true_key, 'cid':$scope.company_id, 'sub_resource':"enable", 'expire_date': expiry_date, "company":formvalue.company_id }).$promise.then(function(result){
                        $(".modelform3").removeClass(progressLoader());
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Catalog has been enabled.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);

                    });
                    $scope.reloadData();
                }
            }

            setTimeout(function() {
                $scope.reloadData();
            }, 1000);

            ngDialog.close();
        }






        $scope.to_disable = []

      vm.OpenDisableCatalog = function (){
          var true_count = 0;
          angular.forEach(vm.selected, function(value, key) {
              if(value==true){
                  true_count++;
                  vm.true_key = key;
              }
          })
          if(true_count == 1)
          {
            $scope.to_disable = []

            $scope.all_sellers_data = vm.selectedFullJson[vm.true_key][1]["all_sellers_data"];

            for(var i=0; i < $scope.all_sellers_data.length; i++){
                if($scope.all_sellers_data[i].status == "Enable"){
                    $scope.all_sellers_data[i].is_select = true;
                    $scope.to_disable.push($scope.all_sellers_data[i]);
                }
            }
            console.log($scope.to_disable);
            $scope.OpenDisableCatalogPopup();
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

      vm.DisableCatalog = function (){
            for(var i=0; i < $scope.to_disable.length; i++){
                var formvalue = $scope.to_disable[i];
                if(formvalue.is_select == true){
                    Catalog.save({'id': vm.true_key, 'cid':$scope.company_id, 'sub_resource':"disable", "company":formvalue.company_id }).$promise.then(function(result){
                        $(".modelform3").removeClass(progressLoader());
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Catalog has been disabled.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);

                    });
                    $scope.reloadData();
                }
            }

            setTimeout(function() {
                $scope.reloadData();
            }, 1000);

            ngDialog.close();
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
                }

            })

            if(true_count == 1 )
            {

                if(vm.selectedFullJson[$scope.true_key][7] == "Enable"){
                  $scope.OpenShareDialog();
                  $scope.share.catalog = parseInt($scope.true_key);
                }
                else{
                  vm.errortoaster = {
                      type:  'error',
                      title: 'Failed',
                      text:  'Disable catalog can not be share.'
                  };
                  console.log(vm.errortoaster);
                  toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                }
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
            }
      }
      vm.MarkAsNoncatalog = function (){
          var true_count = 0;

            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                }
            });

            if(true_count > 0 )
            {
                angular.forEach(vm.selected, function(value, key) {
                    if(value==true){
                        Catalog.patch({"cid": $scope.company_id, 'id': key, "catalog_type": "noncatalog"},function(success){
                            vm.successtoaster = {
                                        type:  'success',
                                        title: 'Success',
                                        text:  'Catalogs marked as Non-Catalog successfully.'
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
                      text:  'Please select atleast one row.'
                  };
                  console.log(vm.errortoaster);
                  toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }
      }
      vm.MarkAsCatalog = function (){
          var true_count = 0;

            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                }
            });

            if(true_count > 0 )
            {
                angular.forEach(vm.selected, function(value, key) {
                    if(value==true){
                        Catalog.patch({"cid": $scope.company_id, 'id': key, "catalog_type": "catalog"},function(success){
                            vm.successtoaster = {
                                        type:  'success',
                                        title: 'Success',
                                        text:  'Non-Catalog marked as Catalog successfully.'
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
                      text:  'Please select atleast one row.'
                  };
                  console.log(vm.errortoaster);
                  toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }
      }
      vm.SoftDelete = function (){
          var true_count = 0;

            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                }
            });

            if(true_count > 0 )
            {
                angular.forEach(vm.selected, function(value, key) {
                    if(value==true){
                        Catalog.patch({"cid": $scope.company_id, 'id': key, "deleted": true },function(success){
                            vm.successtoaster = {
                                        type:  'success',
                                        title: 'Success',
                                        text:  'Catalogs soft deleted successfully.'
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
                      text:  'Please select atleast one row.'
                  };
                  console.log(vm.errortoaster);
                  toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }
      }
      vm.CsvDialog = function () {
            ngDialog.open({
                template: 'catalogbulkuploadcsv',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        vm.OpenUploadCsv = function() {
            vm.set_bulk = false
            vm.CsvDialog();
        };

        $scope.uploadCSVFiles = function (files) {
            $scope.csv_file = files;
            console.log($scope.csv_file);
        };
        vm.UploadBulkCatalogCsv = function() {
            if(vm.uploadcsv.$valid) {
                $(".modelform3").addClass(progressLoader());
              //  console.log($scope.file);
              var up_data = {"catalog_csv":$scope.csv_file}
              if (vm.set_bulk) {
                up_data['set_bulk'] = vm.set_bulk
              }
                Upload.upload({
                            url: 'api/v1/importbulkcsvcatalog/',
                            headers: {
                              'optional-header': 'header-value'
                            },
                            data: up_data
                      }).then(function (response) {
                                var headers = response.headers();

                                if(headers['content-type'] == "text/csv"){
                                    var hiddenElement = document.createElement('a');

                                    hiddenElement.href = 'data:attachment/csv,' + encodeURI(response.data);
                                    hiddenElement.target = '_blank';
                                    hiddenElement.download = 'catalog_error.csv';
                                    hiddenElement.click();

                                    vm.successtoaster = {
                                        type:  'warning',
                                        title: 'Warning',
                                        text:  'File uploaded successfully and please fix issues found on catalog_error.csv and reupload'
                                    };
                                }
                                else{
                                    vm.successtoaster = {
                                        type:  'success',
                                        title: 'Success',
                                        text:  'Job is Scheduled. Please check Jobs table in settings for status.'
                                    };
                                }

                                $(".modelform3").removeClass(progressLoader());
                                ngDialog.close();

                                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                $scope.reloadData();
                        });
            }
            else
            {
                vm.uploadcsv.catalog_csv.$dirty = true;
            }

            //  console.log($scope.file);
              // Upload.upload({
              //             url: 'api/v1/importcsvcatalog/',
              //             headers: {
              //               'optional-header': 'header-value'
              //             },
              //             data: {"catalog_csv":$scope.csv_file}
              //       }).then(function (response) {
              //                 var headers = response.headers();
              //
              //                 if(headers['content-type'] == "text/csv"){
              //                     var hiddenElement = document.createElement('a');
              //
              //                     hiddenElement.href = 'data:attachment/csv,' + encodeURI(response.data);
              //                     hiddenElement.target = '_blank';
              //                     hiddenElement.download = 'catalog_error.csv';
              //                     hiddenElement.click();
              //
              //                     vm.successtoaster = {
              //                         type:  'warning',
              //                         title: 'Warning',
              //                         text:  'File uploaded successfully and please fix issues found on catalog_error.csv and reupload'
              //                     };
              //                 }
              //                 else{
              //                     vm.successtoaster = {
              //                         type:  'success',
              //                         title: 'Success',
              //                         text:  'Job is Scheduled. Please check Jobs table in settings for status.'
              //                     };
              //                 }
              //
              //                 $(".modelform3").removeClass(progressLoader());
              //                 ngDialog.close();
              //
              //                 toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
              //                 $scope.reloadData();
              //         });
          //     var reader = new FileReader();
          //     reader.onload = function () {
          //         console.log(reader.result);
          //         ReadCSV(reader)
          //         $(".modelform3").removeClass(progressLoader());
          //     };
          //     // start reading the file. When it is done, calls the onload event defined above.
          //     reader.readAsBinaryString($scope.csv_file[0]);
          // }
          // else
          // {
          //     vm.uploadcsv.catalog_csv.$dirty = true;
          // }

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
            vm.notification_title     = label.display;
            vm.notification_message   = label.sms_temp.replace("<catalog name>",vm.selectedFullJson[$scope.catalog_id][3].toString());
          }
        }
        $scope.ChangeSortOrder = function(catalog_id){
          $scope.catalog_id = catalog_id;
          //vm.catalog.sort_order = catalog_id;
          $(".modelform-sortorder").addClass(progressLoader());
          Catalog.get({ 'cid': $scope.company_id, 'id': $scope.catalog_id},function(success){
            vm.sort_order = success.sort_order;
            $(".modelform-sortorder").removeClass(progressLoader());
          });
          $scope.SortOrderDialog();
        }
        $scope.SortOrderDialog = function () {
            ngDialog.open({
                template: 'sort_order_dialog',
                className: 'ngdialog-theme-default',
                scope: $scope,
                closeByDocument: false
            });
        };
        vm.submitSortOrder = function(){
          $(".modelform-sortorder").addClass(progressLoader());
          console.log($scope.catalog_id+" "+vm.sort_order);
          Catalog.patch({ 'cid': $scope.company_id, 'id': $scope.catalog_id, 'sort_order': vm.sort_order},function(success){
                vm.successtoaster = {
                                        type:  'success',
                                        title: 'Success',
                                        text:  'Sort Order changed successfully.'
                                    };
                                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                    $scope.reloadData();
                                    ngDialog.close();
                                    $(".modelform-sortorder").removeClass(progressLoader());
          });
        }
        $scope.Notify = function(catalog_id) {
          $scope.catalog_id = catalog_id;
          $scope.seller_data  = vm.selectedFullJson[catalog_id][8];
          NotificationEntity.query({type: 'catalog'}).$promise.then(function(success){
              vm.notification_entities = success;
          });
          // vm.notify_to = true;
          $scope.catalog_tab = true;
          console.log($scope.seller_data);
          console.log($scope.entities);
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
        $scope.getPreviousNotification = function(catalog_id)
        {

          $scope.noti_data = vm.selectedFullJson[catalog_id][1]["noti"]["data"]
          $scope.NotifyPreviousDailog();
        }
        $scope.NotifyPreviousDailog = function () {
            ngDialog.open({
                template: 'notifypreviousdailog',
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
                Notification.save({
                                   "notice_template": vm.notification_label.id,
                                   "message":vm.notification_message,
                                   "notifier_users" : JSON.stringify(vm.seller_data),
                                   "extra_ids" : vm.extra_sellers,
                                   "object_id" : $scope.catalog_id,
                                   "content_type" : vm.notification_entity.content_type,
                                   "by_noti" : vm.way.by_noti,
                                   "by_sms"  : vm.way.by_sms,
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

        $scope.reviveCatalog = function(catalog_id)
        {
          Catalog.patch({"cid": $scope.company_id, 'id': catalog_id, "deleted": false,"sub_resource" : "revive_catalog"},function(success){
              vm.successtoaster = {
                          type:  'success',
                          title: 'Success',
                          text:  'Catalog Revived successfully.'
                      };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                      $scope.reloadData();
          });
        }

        /*var calcDataTableHeight = function() {
          return $(window).height() * 42 / 100;
        };*/
      $scope.TopCategoryChanged = function(pid){
            $scope.categories = v2Category.query({parent: pid});
            v2Category.query({parent: pid},function(success){

              console.log($scope.categories);
              $scope.new_categories_with_set_type = success;
              //$scope.new_categories_with_set_type = success.toString();

              console.log($scope.new_categories_with_set_type);
              console.log($scope.new_categories_with_set_type.length);
              for(var i = 0; i < $scope.new_categories_with_set_type.length; i++){
                  var set_type = " (color set)";

                  for (var j = 0; j < $scope.all_category_eav_data.length; j++) {
                      if($scope.all_category_eav_data[j].attribute_slug == "size" && $scope.all_category_eav_data[j].category == $scope.new_categories_with_set_type[i].id)
                      {
                        set_type = " (size set)";
                      }
                  }
                  $scope.new_categories_with_set_type[i].category_name = $scope.new_categories_with_set_type[i].category_name + set_type;
                  console.log($scope.new_categories_with_set_type[i]);
              }
              console.log($scope.categories);
            });

        }

      $scope.openUpdateCatalogForm = function() {
        var true_count = 0;
        angular.forEach(vm.selected, function(value, key) {
            if(value==true){
                true_count++;
                vm.true_key = key;
            }
        })

        if(true_count == 1)
        {
            if(vm.selectedFullJson[vm.true_key][10]["catalog_type"] == "catalogseller"){
                toaster.pop("error", "Failed", "Can not update a catalog that you are a seller");
            }
            else
            {
                console.log('openupdate called');
                sharedProperties.setType('update');
                $scope.catalog_id = vm.true_key;
                $scope.bundle_product_id = vm.selectedFullJson[vm.true_key][2];
                localStorage.setItem('current_companies', JSON.stringify(vm.selectedFullJson[vm.true_key][8]));

                ngDialog.openConfirm({
                    template: 'addcatalog',
                    scope: $scope,
                    className: 'ngdialog-theme-default',
                    closeByDocument: false
                });
                //$scope.brands = Brand.query({cid:$scope.company_id, type:"my", sub_resource:"dropdown"});
                //$scope.brands = Brand.query({cid: vm.catalog.company, company: vm.catalog.company, type:"my", sub_resource:"dropdown"});
                Catalog.get({'id': $scope.catalog_id, 'cid':$scope.company_id}, function(data){
                    if(data.company_id){
                    $scope.brands = Brand.query({cid: data.company_id, company: data.company_id, type:"my", sub_resource:"dropdown"});
                    }
                });
           /*   EnumGroup.query({type:"fabric"}).$promise.then(function(success){
                $scope.fabrics = success;
              });

              EnumGroup.query({type:"work"}).$promise.then(function(success){
                $scope.works = success;
              });
              EnumGroup.query({type:"style"}).$promise.then(function(success){
                $scope.styles = success;
              });*/
              /*$scope.categories = Category.query({parent: 10}, //parent: "null"
                function (success){
                    categoryTree(tempArr);
                    $scope.openConfirm();
                }
              );*/
            //  $scope.categories = Category.query({parent: 10});
              /*start: after v2 changes  */
              $scope.topcategories = v2Category.query({parent: 1});
              $scope.catalog.topcategory = 4;
            //  $scope.categories = v2Category.query({parent: 5});
              v2CategoryEavAttribute.query(function(success){
                $scope.all_category_eav_data = success;
                $scope.TopCategoryChanged(4);
              });
              $scope.photoshoot_types = [{"id":1, "photoshoot_type": "Live Model Photoshoot"}, {"id":2, "photoshoot_type": "White Background or Face-cut"}, {"id":3, "photoshoot_type": "Photos without Model"},]
              /*start: end v2 changes  */
              //$rootScope.$broadcast("CallUpdateCatalogForm", {});
            }
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
      $scope.category_filter_options = [];
      v2Category.query(
        function(catdata){
          for(var i = 0; i < catdata.length; i++ ){
            var temp = {};
            temp.value = catdata[i].category_name;
            temp.label = catdata[i].category_name;
            $scope.category_filter_options.push(temp);
          }
        });
      $scope.StartStopSelling = function(id,cid){
            $scope.catalog = {};
            sharedProperties.setType('startstop');
            $scope.catalog_id = id;
            console.log(vm.selectedFullJson[cid][8]);
            $scope.catalogs_sellers = vm.selectedFullJson[cid][8];

            //UpdateCheckBoxUI();
            ngDialog.open({
                template: 'inventory_update',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
      }
      vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: 'api/catalogadmindatatables/',
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
                          2 : { "type" : "text"},
                          3 : { "type" : "text"},
                          5 : { "type" : "text"},
                        //  5 : { "type" : "text"},
                          6 : { "type" : "select", values: $scope.category_filter_options},
                          7 : { "type" : "select", values:[{"value":"public","label":"Public"}, {"value":"push","label":"Private"}]},
                          8 : { "type" : "text"},
                          9 : { "type" : "select", values:[{"value":"Enable","label":"Enable"}, {"value":"Disable","label":"Disable"}]},
                          11 : { "type" : "select", values:[{"value":"catalog","label":"catalog"}, {"value":"noncatalog","label":"noncatalog"}]},
                          12 : { "type" : "select", values:[{"value":true,"label":"True"}, {"value":false,"label":"False"}]},
                          13 : { "type" : "text"},
                          14 : { "type" : "numberRange", width: '100%'},
                          //6 : { "type" : "select", values:[{"value":"Enable","label":"Enable"}, {"value":"Disable","label":"Disable"}]},
                          17 : { "type" : "dateRange", width: '100%'},
                          //18 : { "type" : "text"},
                      })

                      .withOption('processing', true)
                      .withOption('serverSide', true)
                      //.withOption('stateLoadParams', false)
                      //.withOption('stateSaveParams', false)
                      .withOption('stateSave', true)
                      .withOption('stateSaveCallback', function(settings, data) {
                          //console.log(JSON.stringify(settings));
                          data = datatablesStateSaveCallback(data);
                          localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));
                      })
                      .withOption('stateLoadCallback', function(settings) {
                         return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance ))
                      })

                      .withOption('iDisplayLength', 10)
                      //.withOption('responsive', true)
                      .withOption('scrollX', true)
                     // .withOption('scrollY', '55vh')
                      .withOption('scrollY', getDataTableHeight())
                      //.withOption('scrollCollapse', true)
                      .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc

                      .withPaginationType('full_numbers')


                      .withButtons([
                          {
                              text: 'Disable',
                              key: '1',
                              className: 'orange',
                              action: function (e, dt, node, config) {
                                 // alert(JSON.stringify(vm.selected));
                                    //vm.DisableCatalog();
                                    vm.OpenDisableCatalog();
                              }
                          },
                          {
                              text: 'Soft Delete',
                              key: '1',
                              className: 'orange',
                              action: function (e, dt, node, config) {
                                 // alert(JSON.stringify(vm.selected));
                                    //vm.DisableCatalog();
                                    vm.SoftDelete();
                              }
                          },
                          {
                              text: 'Enable',
                              key: '1',
                              className: 'orange',
                              action: function (e, dt, node, config) {
                                 // alert(JSON.stringify(vm.selected));
                                    vm.OpenEnableCatalog();
                              }
                          },
                          {
                              text: 'Update Catalog/Upload More Products',
                              key: '1',
                              className: 'green',
                              action: function (e, dt, node, config) {
                             //     alert(JSON.stringify(vm.selected));
                                  $scope.catalogId = null;
                                  vm.catalog = {};
                                  vm.catalog.dont_allow_crop = false;
                                  vm.catalog.cropallow = !vm.catalog.dont_allow_crop;
                                  //vm.catalog.sell_full_catalog = false;
                                  $scope.update_flag = true;
                                  $scope.products = [];
                                  $scope.catalog = {};
                                  $scope.catalog.enable_duration = 30;
                                  $scope.catalog.is_percentage = true;
                                  $scope.catalog.single_piece_price_percentage = 0;
                                  $scope.catalog.single_piece_price = 0;
                                  $scope.catalog.view_permission = 'public';
                                  $scope.catalog.catalog_type = 'catalog';
                                  $scope.openUpdateCatalogForm();
                              }
                          },
                          {
                              text: 'Mark as Non-Catalog',
                              key: '1',
                              className: 'orange',
                              action: function (e, dt, node, config) {
                                  console.log(JSON.stringify(vm.selected));
                                  vm.catalog = {};
                                  vm.MarkAsNoncatalog();
                              }
                          },
                          {
                              text: 'Mark as Catalog',
                              key: '1',
                              className: 'orange',
                              action: function (e, dt, node, config) {
                                  console.log(JSON.stringify(vm.selected));
                                  vm.catalog = {};
                                  vm.MarkAsCatalog();
                              }
                          },
                          {
                              text: 'Reset Filter',
                              key: '1',
                              className: 'green',
                              action: function (e, dt, node, config) {
                                //$('table thead tr:eq(1) :input').val('').trigger('change'); // Don't forget to trigger
                                //$('#catalog-datatables').DataTable().ajax.reload();
                                localStorage.removeItem('DataTables_' + 'catalogs-datatables');
                                $state.go($state.current, {}, {reload: true});
                              }
                          },
                          {
                                text: 'Bulk Upload CSV',
                                key: '1',
                                className: 'blue',
                                action: function (e, dt, node, config) {
                                    vm.OpenUploadCsv();
                                }
                          },
                      ]);

                      vm.dtColumnDefs = [
                          DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
                          .renderWith(function(data, type, full, meta) {
                              vm.selected[full[0]] = false;
                              vm.selectedFullJson[full[0]] = full;
                              return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                          }),
                          DTColumnDefBuilder.newColumnDef(1).withTitle('Id').renderWith(IDHtml),
                          DTColumnDefBuilder.newColumnDef(2).withTitle('ProductId'),
                          DTColumnDefBuilder.newColumnDef(3).withTitle('Title').renderWith(TitleLink).withOption('sWidth','5%'),
                          DTColumnDefBuilder.newColumnDef(4).withTitle('Image').renderWith(imageHtml).notSortable(),
                          DTColumnDefBuilder.newColumnDef(5).withTitle('Brand'),//.renderWith(BrandTitleLink)
                          DTColumnDefBuilder.newColumnDef(6).withTitle('Category'),
                          DTColumnDefBuilder.newColumnDef(7).withTitle('View Type'),
                          DTColumnDefBuilder.newColumnDef(8).withTitle('AllSellers-Isfullcatalog').renderWith(SellerFormating).notSortable().withOption('sWidth','20%'),
                          DTColumnDefBuilder.newColumnDef(9).withTitle('Status').renderWith(DataFormating).notSortable().withOption('sWidth','5%'),
                          DTColumnDefBuilder.newColumnDef(10).withTitle('Expired On').renderWith(DataFormating).notSortable().withOption('sWidth','10%'),
                          DTColumnDefBuilder.newColumnDef(11).withTitle('Catalog Type'),
                          //DTColumnDefBuilder.newColumnDef(9).withTitle('Designs').notSortable().withOption('sWidth','5%'),
                          //DTColumnDefBuilder.newColumnDef(10).withTitle('Views').notSortable().withOption('sWidth','5%'),
                          DTColumnDefBuilder.newColumnDef(12).withTitle('Deleted'),
                          DTColumnDefBuilder.newColumnDef(13).withTitle('PrefSeller-Discount-Isfullcatalog').notVisible(), //.renderWith(PreferredSeller).notSortable().withOption('sWidth','20%'),
                          DTColumnDefBuilder.newColumnDef(14).withTitle('Public Price Range').notSortable(),
                          DTColumnDefBuilder.newColumnDef(15).withTitle('SinglePiece Price Range').notSortable(),
                          DTColumnDefBuilder.newColumnDef(16).withTitle('Wholesale Price').notSortable(),
                          DTColumnDefBuilder.newColumnDef(17).withTitle('CreatedDate'),
                          DTColumnDefBuilder.newColumnDef(18).withTitle('Uploaded by').notSortable(),
                          DTColumnDefBuilder.newColumnDef(19).withTitle('Action').notSortable().withClass('noExport')//.withOption('width', '25%')
                              .renderWith(function(data, type, full, meta) {
                                    var htmlbutton = ''
                                    htmlbutton += '<div><button type="button" ng-click="Notify('+full[0]+')" class="btn btn-block btn-primary mt-lg">Notify</button></div>';
                                    htmlbutton += '<div><button type="button" ng-click="ChangeSortOrder('+full[0]+')" class="btn btn-block btn-primary mt-lg">Change SortOrder</button></div>';
                                    if (vm.selectedFullJson[full[0]][1]["noti"]['check']) {
                                        htmlbutton += '<div class="col-md-6"><a ng-click="getPreviousNotification('+full[0]+')">Previous</a></div>';
                                    }
                                    if (full[12]) {
                                        htmlbutton += '<div><button type="button" ng-click="reviveCatalog('+full[0]+')" class="btn btn-block btn-primary mt-lg">Revive</button></div>';
                                    }
                                    htmlbutton += '<div style="padding-bottom:5px;"><button type="button" ng-click="StartStopSelling(' + full[2] +','+ full[0] +')" class="styledButtonblue" style="line-height: 20px !important;" >Start/Stop Selling</button></div>';
                                    return htmlbutton;
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
    }
})();
