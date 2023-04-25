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

    CatalogController.$inject = ['$http', '$resource', 'CategoryEavAttribute', 'EnumGroup', 'Promotions',  'Brand' ,'Catalog', 'CatalogUploadOptions', 'Product', 'Category', 'Company', 'BuyerList', 'SalesOrders', 'toaster', 'ngDialog', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', 'Upload', '$filter', '$cookies', '$localStorage', 'SweetAlert'];
    function CatalogController($http, $resource, CategoryEavAttribute, EnumGroup, Promotions, Brand, Catalog, CatalogUploadOptions, Product, Category, Company, BuyerList, SalesOrders, toaster, ngDialog, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, Upload, $filter, $cookies, $localStorage, SweetAlert) {
        CheckAuthenticated.check();        
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
        var vm = this;
        $scope.cataloguploadoptions_isadded = true;


        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
        $scope.flag_retailer = localStorage.getItem("flag_retailer");
        if($scope.flag_retailer == "true"){
            $state.go('app.browse');
        }
      /*  vm.catalogs = Catalog.query({cid:$scope.company_id, id:"dropdown"});
        vm.buyers = BuyerList.query({'cid':$scope.company_id});
        vm.agents = Company.query({'id':$scope.company_id, 'sub_resource':'brokers'});
        $scope.cdata = {}
        $scope.CatalogArray = function() {
            console.log(JSON.stringify(vm.order));
        }  */

     //   console.log($scope.company_id);

        /*vm.colors = ['#fc0003', '#f70008', '#f2000d', '#ed0012', '#e80017', '#e3001c', '#de0021', '#d90026', '#d4002b', '#cf0030', '#c90036', '#c4003b', '#bf0040', '#ba0045', '#b5004a', '#b0004f', '#ab0054', '#a60059', '#a1005e', '#9c0063', '#960069', '#91006e', '#8c0073', '#870078', '#82007d', '#7d0082', '#780087', '#73008c', '#6e0091', '#690096', '#63009c', '#5e00a1', '#5900a6', '#5400ab', '#4f00b0', '#4a00b5', '#4500ba', '#4000bf', '#3b00c4', '#3600c9', '#3000cf', '#2b00d4', '#2600d9', '#2100de', '#1c00e3', '#1700e8', '#1200ed', '#0d00f2', '#0800f7', '#0300fc'];

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
        //addSlide(vm.slides6, 'http://aks.b2bapi.com/media/__sized__/product_image/blob_om4J3os-thumbnail-400x562-100.jpg');
        //addSlide(vm.slides6, 'http://aks.b2bapi.com/media/__sized__/product_image/blob_om4J3os-thumbnail-400x562-100.jpg');

        vm.addSlide = function(at) {
          if(at==='head') {
              vm.slides6.unshift(getSlide(vm.slides6, 'http://aks.b2bapi.com/media/__sized__/product_image/blob_9j2VgBd-thumbnail-700x980-100.jpg'));
          } else {
              vm.slides6.push(getSlide(vm.slides6, 'http://aks.b2bapi.com/media/__sized__/product_image/blob_9j2VgBd-thumbnail-700x980-100.jpg'));
          }
        };*/
        
        function blobImageRenameForExtenstion(final_image, assing_to, newname) {
			var cropblob = Upload.dataUrltoBlob(final_image, assing_to);
			var fileFromBlob = new File([cropblob], newname, { type: "image/jpeg", lastModified: Date.now() });
			return fileFromBlob
		}

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
      
        $scope.orderByFunction = function(product){
            if (isNaN(product.sku_order) == true){
                return product.sku_order;
            }
            else{
                return parseInt(product.sku_order);
            }
        };
      
        $scope.products = [];
        //$scope.productsArr = [];
        var order_no = 1;
        $scope.order_no_live = 1;
      
        $scope.uploadFiles = function (files) {
              ////$scope.files = files;
              var files_length = files.length;
              /*$scope.products = [];
              $scope.productsArr = [];*/
              var first_upload = false;
              if($scope.products.length == 0){
                order_no = $scope.order_no_live;
                first_upload = true;
              }
              
              angular.forEach(files, function(file, key) {
                    //alert(JSON.stringify(fr.readAsDataURL(file)))
                   // product.price = 1240;
                    //product.catalog = [168];
                    /*var objectURL = URL.createObjectURL(file);
                    console.log(objectURL);*/
                    
                    var fr = new FileReader();
                    fr.readAsDataURL(file);
                    //console.log(fr);
                    //var blob;
                    fr.onload = function (evt) {
                    
                        //~ var image = new Image();
                        //~ image.src = evt.target.result; //fr.result;
                      
                      
                        /*console.log('over sized image '+file.size);
                        var quality =  (1000000/file.size)*100; 
                        // output file format (jpg || png)
                        var output_format = 'jpg';
                        //This function returns an Image Object
                        var target_img = jic.compress(image,quality,output_format).src;
                        // console.log('compressed');
                        //console.log(file.path); // disabled to not to reduce image quality
                        */
                        
                        
                        //var blob = dataURItoBlob(image.src);
                        var blob = dataURItoBlob(evt.target.result);
                        console.log("url blob=");
                        console.log(blob);
                        
                        var product = {};
                //      product.image = file;
                        product.image = blob;
                        product.uncropped = evt.target.result //image.src; //target_img; //
                        product.cropallow = !$scope.product.dont_allow_crop;
                        
                        // var filename = file.name.replace('.jpg','').replace('.JPG','').replace('.png','').replace('.PNG','').replace('.jpeg','').replace('.JPEG','').replace(/[^\w\s]/gi,'').replace(' ','');  to reomve all special characters from sku
                        var filename = file.name.replace('.jpg','').replace('.JPG','').replace('.png','').replace('.PNG','').replace('.jpeg','').replace('.JPEG','').replace(',','');
                        product.title = filename
                        //var filename = file.name.replace('.jpg','').replace('.JPG','').replace('.png','').replace('.PNG','').replace('.jpeg','').replace('.JPEG','').replace(/^[0!@#$%&*<>?()=]+/,'').replace(' ','').replace(',','').replace(';','').replace('\"','').replace('\'','');
                        filename = filename.replace(/^[0!@#$%&*<>?()=]+/,'').replace(' ','').replace(';','').replace('\"','').replace('\'','');
                        product.sku =  filename;
                        product.sku_order = product.sku;
                        
                        product.price = vm.catalog.price;
                        //product.public_price = vm.catalog.public_price;
                        product.public_price = vm.catalog.price;
                       /* product.work = vm.catalog.work;
                        product.fabric = vm.catalog.fabric; */
                        product.catalog = $scope.catalogId;
                        product.sort_order = order_no;
                        
                        //$scope.productsArr.push(product);
                        $scope.products.push(product);
                        $scope.$apply();
                        
                        order_no = order_no + 1;
                        
                        
                        if($scope.products.length == files_length && first_upload == true){
                            //console.log("sort start");
                            $scope.products = $filter('orderBy')($scope.products, 'sku_order');                            
                            //console.log("sort end");
                            
                            order_no = $scope.order_no_live;
                            //console.log(order_no);
                            //console.log("sort2 start");
                            for(var i=0; i<$scope.products.length; i++){
                                $scope.products[i].sort_order = order_no; //i+1;
                                order_no = order_no + 1;
                                //console.log( $scope.products[i].sku);
                            }
                            //console.log("sort2 end");
                            
                        }
                        
                        //addSlide(vm.slides6, 'http://aks.b2bapi.com/media/__sized__/product_image/blob_om4J3os-thumbnail-400x562-100.jpg');
                        //addSlide(vm.slides6, window.URL.createObjectURL(blob));
                    }

                //  console.log($scope.products);
                  
              });
              //$scope.products = $scope.productsArr
              vm.products_count = files_length;
              
               /* if(first_upload == true){
                    
                    order_no = $scope.order_no_live;
                    
                    for(var i=0; i<$scope.products.length-1; i++){
                        $scope.products[i].sort_order = order_no; //i+1;
                        order_no = order_no + 1;
                    }
                
                }*/
              
              //$(".mic").addClass("cropArea");
              //$(".cropArea").cropArea();
              
              /*for (var i=0; i < $scope.products.legth; i++) {
                  addSlide(target, style);
              }*/

        };
        
        $scope.uploadCatalogImage = function (file) {
            var fr = new FileReader();
            fr.readAsDataURL(file);
            var blob;
            fr.onload = function () {
                var image = new Image();
                image.src = fr.result;
                
                /*console.log('over sized image '+file.size);
                var quality =  (1000000/file.size)*100; 
                // output file format (jpg || png)
                var output_format = 'jpg';
                //This function returns an Image Object
                var target_img = jic.compress(image,quality,output_format).src;
                // console.log('compressed');
                //console.log(file.path); // disabled to not to reduce image quality
                */
                
                var blob = dataURItoBlob(image.src);
                console.log(blob);
                
                //var fileFromBlob = new File([blob], vm.catalog.title+".jpg", { type: "image/jpeg", lastModified: Date.now() });
				//console.log('catalog image file',fileFromBlob);
                
                vm.catalog.uncropped = image.src;//target_img; //
                vm.catalog.thumbnail = blob; //fileFromBlob; //
            }
        };
        
        $scope.allowCrop = function(cropallow){
            for (var i = $scope.products.length - 1; i >= 0; i--) {
                if(cropallow){
                    $scope.products[i].cropallow = false;
                }else{
                    $scope.products[i].cropallow = true;
                }
            }
        }
        
        $scope.allowCatalogCrop = function(cropallow){
            
            if(cropallow){
                vm.catalog.cropallow = false;
            }else{
                vm.catalog.cropallow = true;
            }
        }
        
        $scope.allowCropProduct = function(product){
            if(product.cropallow){
                product.cropallow = false;
            }else{
                product.cropallow = true;
            }
        }
      
        $scope.remove = function(product){
            $scope.products.splice($scope.products.indexOf(product), 1);
        }
        
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
          return '<div style="text-align: center;"><a ng-click="OpenProductsImages('+full[0]+','+full[8]+')"><img class="loading" src="'+full[2]+'" style="height: 100px; width: 100px;"/></a></div>';
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
            return '<a href="#/app/product/?type=mycatalog&id='+full[0]+'&name='+full[1]+'">'+full[1]+'</a>';
          }
        }

        function BrandTitleLink(data, type, full, meta){
          return '<a href="#/app/brand-catalogs/?brand='+full[10]['brand']+'&name='+full[3]+'">'+full[3]+'</a>';
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

          $scope.OpenCatalogForm = function(tempArr) {
              $scope.brands = Brand.query({cid:$scope.company_id, type:"my", sub_resource:"dropdown"});
              EnumGroup.query({type:"fabric"}).$promise.then(function(success){
                $scope.fabrics = success;
              });
              
              EnumGroup.query({type:"work"}).$promise.then(function(success){
                $scope.works = success;
              });
              EnumGroup.query({type:"style"}).$promise.then(function(success){
                $scope.styles = success;
              });
              /*$scope.categories = Category.query({parent: 10}, //parent: "null"
                function (success){
                    categoryTree(tempArr);
                    $scope.openConfirm();
                }
              );*/
              $scope.categories = Category.query({parent: 10});
              $scope.openConfirm();
          };


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
          vm.catalog = {};
          vm.catalog.enable_duration = 30;
          vm.catalog.is_percentage = true;
          vm.catalog.single_piece_price_percentage = 0;
          vm.catalog.single_piece_price = 0;
          vm.catalog.view_permission = 'public';
          vm.catalog.catalog_type = 'catalog';

          $scope.dt = new Date();
          vm.catalog.dispatch_date = formatDate($scope.dt);

          $scope.format = 'yyyy-MM-dd';
          $scope.dateOptions = {
              formatYear: 'yy',
              startingDay: 1
          };
          $scope.opened = false; 
          $scope.open = function($event) {
              $event.preventDefault();
              $event.stopPropagation();

              $scope.opened = true;
          };
          
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

          $scope.show_size_flag = false;
          $scope.show_stitching_flag = false;
          $scope.show_numberpcs_flag = false;
          $scope.CategoryChanged  = function(catid){
            console.log(catid);
            CategoryEavAttribute.query({"category": catid},
              function(data){
                  console.log(data);
                  $scope.show_size_flag = false;
                  $scope.show_stitching_flag = false;
                  $scope.show_numberpcs_flag = false;

                  for(var i = 0; i < data.length; i++){
                      if(data[i].attribute_name == 'size'){
                        $scope.sizes = data[i].attribute_values;
                        $scope.show_size_flag = true;
                      }

                      if(data[i].attribute_name == 'stitching_type'){
                        $scope.stitching_types = data[i].attribute_values;
                        $scope.show_stitching_flag = true;
                      }

                      if(data[i].attribute_name == 'number_pcs_design_per_set'){
                        $scope.show_numberpcs_flag = true;
                      }
                     
                      console.log(data[i].attribute_name);
                      console.log($scope.show_numberpcs_flag);
                  }
              });
          }  

          vm.catalog.number_pcs_design_per_set = 1;
          vm.AddCatalog = function() {
                
                 if(vm.catalog.fabric == '' || vm.catalog.fabric == null){
                    
                    vm.errortoaster = {
                        type:  'error',
                        title: 'Fabric',
                        text:  'Please select fabric.'
                    };
                    
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
                    
                    return;
                }
                if(vm.catalog.work == '' || vm.catalog.work == null){
                    
                    vm.errortoaster = {
                        type:  'error',
                        title: 'Work',
                        text:  'Please select work.'
                    };    
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                    return;
                }
                if(vm.catalog.thumbnail == '' || vm.catalog.thumbnail == null){
                    
                    vm.errortoaster = {
                        type:  'error',
                        title: 'Image',
                        text:  'Please upload catalog image.'
                    };   
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                    return;
                }

                vm.catalogoption_params = {};
                if($scope.product_price_type == 'single'){
                  vm.catalogoption_params['private_single_price'] = vm.catalog.price;
                  vm.catalogoption_params['public_single_price'] = vm.catalog.price;
                  /*if(vm.catalog.view_permission == 'public'){
                    vm.catalogoption_params['public_single_price'] = vm.catalog.public_price;
                  }*/
                }
                else {
                  vm.catalogoption_params['private_single_price'] = null;
                  vm.catalogoption_params['public_single_price'] = null;
                }
                //vm.catalogoption_params['without_sku'] = $scope.without_sku;
                if(vm.catalog.work != null){
                  vm.catalogoption_params['work'] = vm.catalog.work.toString();
                }
                if(vm.catalog.fabric != null){
                  vm.catalogoption_params['fabric'] = vm.catalog.fabric.toString();
                }

                
                
                ////$scope.category = $('#tree_2').jstree('get_bottom_checked');
                /*if($scope.category=='' || $scope.category ==null){
                    
                    vm.errortoaster = {
                        type:  'error',
                        title: 'Category',
                        text:  'Please select category'
                    };
                    
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
                    
                    return;
                }*/
                
                

                vm.catalog.eav = {"fabric": vm.catalog.fabric, "work": vm.catalog.work};

                if($scope.show_size_flag == true){
                  if(vm.catalog.size == '' || vm.catalog.size == null){  
                    vm.errortoaster = {
                        type:  'error',
                        title: 'Size',
                        text:  'Please select size.'
                    };    
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                    return;
                  }
                  vm.catalog.eav["size"] = vm.catalog.size;
                }

                if($scope.show_stitching_flag == true){
                  if(vm.catalog.stitching_type == '' || vm.catalog.stitching_type == null){  
                    vm.errortoaster = {
                        type:  'error',
                        title: 'Stitching Type',
                        text:  'Please select stitching type.'
                    };    
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                    return;
                  }
                  vm.catalog.eav["stitching_type"] = vm.catalog.stitching_type;
                }

                if($scope.show_numberpcs_flag == true){
                  if(vm.catalog.number_pcs_design_per_set == '' || vm.catalog.number_pcs_design_per_set == null){  
                    vm.errortoaster = {
                        type:  'error',
                        title: 'Pieces/Designs',
                        text:  'Please select pieces/design.'
                    };    
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                    return;
                  }
                  vm.catalog.eav["number_pcs_design_per_set"] = vm.catalog.number_pcs_design_per_set;

                }

                if(vm.catalog.other)
                    vm.catalog.eav["other"] = vm.catalog.other;

                if(vm.catalog.style)
                    vm.catalog.eav["style"] = vm.catalog.style;

                console.log(vm.catalog.eav);
                vm.catalog.eav = JSON.stringify(vm.catalog.eav);
                console.log(vm.catalog.eav);
                var today = new Date(); 
                var expiry_date = today.setDate(today.getDate() + vm.catalog.enable_duration);
               // console.log(today);
                expiry_date = formatDate(expiry_date) + "T23:59:59Z"
                console.log(expiry_date);
            //if(vm.addcatalogform.$valid) {
                var dispatchdate = formatDate(vm.catalog.dispatch_date);
                $(".modelform").addClass(progressLoader()); 
                
                //vm.params =  {"cid":$scope.company_id, "id": $scope.catalogId, "title":vm.catalog.title,"brand":vm.catalog.brand,"category": $scope.category, "sell_full_catalog":  vm.catalog.sell_full_catalog};
                vm.params = {"cid":$scope.company_id, "title":vm.catalog.title,"brand":vm.catalog.brand, "category": vm.catalog.category, "sell_full_catalog":  vm.catalog.sell_full_catalog, "view_permission": vm.catalog.view_permission, "catalog_type": vm.catalog.catalog_type, "eav": vm.catalog.eav, "expiry_date": expiry_date, 'dispatch_date': dispatchdate};
                if(!vm.catalog.cropallow){
                    //vm.params["thumbnail"] = Upload.dataUrltoBlob(vm.catalog.uncropped, vm.catalog.thumbnail);
                    vm.params["thumbnail"] = blobImageRenameForExtenstion(vm.catalog.uncropped, vm.catalog.thumbnail, vm.catalog.title+".jpg");
                    console.log('uncropped file',  vm.params["thumbnail"]);
                }
                else{
                    //vm.params["thumbnail"] = Upload.dataUrltoBlob(vm.croppedDataUrl, vm.catalog.thumbnail);
                    vm.params["thumbnail"] = blobImageRenameForExtenstion(vm.croppedDataUrl, vm.catalog.thumbnail, vm.catalog.title+".jpg");
                    console.log('crop file',  vm.params["thumbnail"]);
                }
                if(vm.catalog.sell_full_catalog == false){
                    if(vm.catalog.is_percentage == true){
                        vm.params["single_piece_price_percentage"] = vm.catalog.single_piece_price_percentage;
                    }
                    else{
                        vm.params["single_piece_price"] = vm.catalog.single_piece_price; 
                    }
                }
                console.log(JSON.stringify(vm.params));
                Catalog.save(vm.params,
                 function(success){
                            $(".modelform").removeClass(progressLoader());
                            
                       //     ngDialog.close();
                            $scope.catalogId = success.id; 
                            $scope.catalogData = success;                  
                            $scope.order_no_live = 1;
                            vm.catalogoption_params['catalog'] = $scope.catalogId;
                            
                            CatalogUploadOptions.save(vm.catalogoption_params,
                              function(result){
                                console.log('onsave: '+result.id);
                                $scope.cataloguploadoptions_id = result.id;
                                console.log('catalog options saved');
                              });

                            vm.successtoaster = {
                                type:  'success', 
                                title: 'Success',
                                text:  'Catalog added successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            $scope.reloadData();
                            setTimeout(function(){ $('.nexttoproduct').trigger('click'); }, 1000);
                            //wizard.go(3);
                      });  
            /*}
            else
            {
                vm.addcatalogform.title.$dirty = true;
                vm.addcatalogform.category.$dirty = true;
                vm.addcatalogform.thumbnail.$dirty = true;
            }*/
          };


        
        vm.UpdateCatalogForm = function (){
            //alert(JSON.stringify(vm.selected));
            vm.catalog_products = [];
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
                else{
                    Catalog.get({'id': vm.true_key, 'cid':$scope.company_id, 'expand': true}).$promise.then(function(result){
               // Catalog.get({'id': vm.true_key, 'cid':$scope.company_id}).$promise.then(function(result){
                            //vm.catalog = result;
                            vm.catalog.title = result.title;
                            //vm.catalog.brand = result.brand;
                            if(result.brand != null){
                              vm.catalog.brand = result.brand.id;
                            }
                            vm.catalog.category = result.category;
                            vm.catalog.sell_full_catalog=  result.sell_full_catalog;
                            vm.catalog.view_permission =  result.view_permission;
                            vm.catalog.work = result.eavdata.work;
                            vm.catalog.fabric = result.eavdata.fabric;
                            vm.catalog.style = result.eavdata.style;
                            $scope.CategoryChanged(result.category);
                            vm.catalog.size = result.eavdata.size;
                            vm.catalog.stitching_type = result.eavdata.stitching_type;
                            vm.catalog.number_pcs_design_per_set = result.eavdata.number_pcs_design_per_set;
                            vm.catalog.other = result.eavdata.other;
                            vm.catalog.single_piece_price = result.single_piece_price;
                            vm.catalog.single_piece_price_percentage = result.single_piece_price_percentage;
                            vm.catalog.dispatch_date = new Date(result.dispatch_date);
                            vm.catalog.dispatch_date = formatDate(vm.catalog.dispatch_date);
                            if(vm.catalog.single_piece_price_percentage == null){
                              vm.catalog.is_percentage = false;
                              vm.catalog.single_piece_price = parseFloat(result.single_piece_price);
                            }
                            else{
                              vm.catalog.is_percentage = true; 
                              vm.catalog.single_piece_price_percentage = parseFloat(result.single_piece_price_percentage);
                            }

                            
                            var expiry_date = new Date(result.expiry_date);
                            console.log(expiry_date);
                            var today = new Date(); 

                            var expiry_date_ms = expiry_date.getTime();
                            var today_date_ms = today.getTime();
                            console.log(expiry_date_ms);
                            var diff_date = expiry_date_ms - today_date_ms;
                            var dayms = 1000*60*60*24;
                            var enable_duration_days = Math.round(diff_date/dayms);
                            console.log(enable_duration_days);
                            vm.catalog.enable_duration = enable_duration_days;

                            

                            $scope.catalogImage = result.thumbnail.thumbnail_medium;

                            vm.products = result.products;
                            var i = 0;
                            for(i = 0; i < vm.products.length; i++ ){
                              //  if(vm.catalog.view_permission == 'push')
                              //  {
                                  var cp = {}
                                  cp['id'] = vm.products[i].id;
                                  cp['sku'] = vm.products[i].sku;
                                  cp['thumbimage'] = vm.products[i].image.thumbnail_small;
                                  cp['price'] = vm.products[i].price;
                                  cp['public_price'] = vm.products[i].price;
                                  vm.catalog_products.push(cp);
                              /*  }
                                else
                                {
                                  var cp = {}
                                  cp['id'] = vm.products[i].id;
                                  cp['sku'] = vm.products[i].sku;
                                  cp['thumbimage'] = vm.products[i].image.thumbnail_small;
                                  cp['price'] = vm.products[i].price;
                                  cp['public_price'] = vm.products[i].public_price;
                                  vm.catalog_products.push(cp);
                                } */
                            } 

                            $scope.order_no_live = result.max_sort_order + 1;
                        
                  //          $scope.image = result.thumbnail.full_size;
                            //$('.thumb').attr("src",result.thumbnail.full_size);
                            $scope.catalogId = result.id;
                            $scope.catalogData = result;
                           var catArr = [];
                           catArr.push(result.category);
                           /*for(var i=0;i < result.category.length;i++)
                           {
                              catArr.push(result.category[i]);
                           }*/
                           CatalogUploadOptions.query({'catalog': $scope.catalogId},

                            function(success){
                              if(success.length != 0){
                                  if (success[0].public_single_price) {
                                      $scope.product.price_type = 'single';
                                      //vm.catalog.public_price = parseInt(success[0].public_single_price);
                                      vm.catalog.price = parseInt(success[0].private_single_price);
                                      //vm.catalog.view_permission = 'public';
                                  }
                                  else if (success[0].private_single_price) {
                                      $scope.product.price_type = 'single';
                                      $scope.product_price_type = 'single';
                                      vm.catalog.price = parseInt(success[0].private_single_price);
                                      //vm.catalog.view_permission = 'push'; 
                                  } 
                                  else {
                                      $scope.product.price_type = 'individual'; 
                                      $scope.product_price_type = 'individual';
                                  }
                                  $scope.cataloguploadoptions_id = success[0].id;
                                  $scope.without_sku = success[0].without_sku;
                                  console.log($scope.cataloguploadoptions_id);
                                  $scope.cataloguploadoptions_isadded = true;
                              }
                              else{
                                $scope.cataloguploadoptions_isadded = false;
                              }
                              

                            })
                           $scope.OpenCatalogForm(catArr);
                        });
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
         
        };
        
        
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

        vm.UpdateCatalog = function() {
            if(vm.catalog.fabric == '' || vm.catalog.fabric == null){
                
                vm.errortoaster = {
                    type:  'error',
                    title: 'Fabric',
                    text:  'Please select fabric.'
                };
                
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
                
                return;
            }
            if(vm.catalog.work == '' || vm.catalog.work == null){
                
                vm.errortoaster = {
                    type:  'error',
                    title: 'Work',
                    text:  'Please select work.'
                };    
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                return;
            }
            
           ////$scope.category = $('#tree_2').jstree('get_bottom_checked');
            //console.log(vm.catalog.thumbnail);
           /*if(vm.catalog.thumbnail != null){
               alert("save image");
              $scope.params = {"cid":$scope.company_id, "id": $scope.catalogId, "title":vm.catalog.title,"brand":vm.catalog.brand,"thumbnail": Upload.dataUrltoBlob(vm.croppedDataUrl, vm.catalog.thumbnail), "category": $scope.category, "sell_full_catalog":  vm.catalog.sell_full_catalog}; //$scope.image
           }
           else{
              $scope.params = {"cid":$scope.company_id, "id": $scope.catalogId, "title":vm.catalog.title,"brand":vm.catalog.brand,"category": $scope.category, "sell_full_catalog":  vm.catalog.sell_full_catalog};
           }*/
            
            vm.catalog.eav = {"fabric": vm.catalog.fabric, "work": vm.catalog.work};

            if($scope.show_size_flag == true){
              if(vm.catalog.size == '' || vm.catalog.size == null){  
                vm.errortoaster = {
                    type:  'error',
                    title: 'Size',
                    text:  'Please select size.'
                };    
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                return;
              }
              vm.catalog.eav["size"] = vm.catalog.size;
            }

            if($scope.show_stitching_flag == true){
              if(vm.catalog.stitching_type == '' || vm.catalog.stitching_type == null){  
                vm.errortoaster = {
                    type:  'error',
                    title: 'Stitching Type',
                    text:  'Please select stitching type.'
                };    
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                return;
              }
              vm.catalog.eav["stitching_type"] = vm.catalog.stitching_type;
            }

            if($scope.show_numberpcs_flag == true){
              if(vm.catalog.number_pcs_design_per_set == '' || vm.catalog.number_pcs_design_per_set == null){  
                vm.errortoaster = {
                    type:  'error',
                    title: 'Pieces/Designs',
                    text:  'Please select pieces/design.'
                };    
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                return;
              }
              vm.catalog.eav["number_pcs_design_per_set"] = vm.catalog.number_pcs_design_per_set;

            }

            if(vm.catalog.other)
                    vm.catalog.eav["other"] = vm.catalog.other;
            else
                    vm.catalog.eav["other"] = "";

            if(vm.catalog.style){
                    vm.catalog.eav["style"] = vm.catalog.style;
            }
            else{
                    //vm.catalog.eav["style"] = "";
                    delete vm.catalog.eav["style"];
            }

            console.log(vm.catalog.eav);
            vm.catalog.eav = JSON.stringify(vm.catalog.eav);
            console.log(vm.catalog.eav);  
            
            var today = new Date(); 
            var expiry_date = today.setDate(today.getDate() + vm.catalog.enable_duration);
           // console.log(today);
            expiry_date = formatDate(expiry_date) + "T23:59:59Z"
            console.log(vm.enable_duration);
            console.log(expiry_date);

            var dispatchdate = formatDate(vm.catalog.dispatch_date);
            vm.params =  {"cid":$scope.company_id, "id": $scope.catalogId, "title":vm.catalog.title,"brand":vm.catalog.brand,"category": vm.catalog.category, "sell_full_catalog":vm.catalog.sell_full_catalog, "view_permission":vm.catalog.view_permission, "eav": vm.catalog.eav, "expiry_date": expiry_date, 'dispatch_date': dispatchdate};
            if(!vm.catalog.cropallow && vm.catalog.thumbnail != null){
                //vm.params["thumbnail"] = Upload.dataUrltoBlob(vm.catalog.uncropped, vm.catalog.thumbnail)
                vm.params["thumbnail"] = blobImageRenameForExtenstion(vm.catalog.uncropped, vm.catalog.thumbnail, vm.catalog.title+".jpg");
            }
            else if(vm.catalog.thumbnail != null){
                //vm.params["thumbnail"] = Upload.dataUrltoBlob(vm.croppedDataUrl, vm.catalog.thumbnail)
                vm.params["thumbnail"] = blobImageRenameForExtenstion(vm.croppedDataUrl, vm.catalog.thumbnail, vm.catalog.title+".jpg");
            }
            console.log(vm.catalog_products);

            vm.catalogoption_params = {};
            if($scope.product_price_type == 'single'){
              vm.catalogoption_params['private_single_price'] = vm.catalog.price;
              vm.catalogoption_params['public_single_price'] = vm.catalog.price;
              /*if($scope.catalogData.view_permission == 'public'){
                vm.catalogoption_params['public_single_price'] = vm.catalog.public_price;
              } */
            }
            else {
              // individual price
              vm.catalogoption_params['private_single_price'] = null;
              vm.catalogoption_params['public_single_price'] = null;
            }
            //vm.catalogoption_params['catalog'] = $scope.catalogId;
            //console.log($scope.cataloguploadoptions_id)
            if($scope.cataloguploadoptions_isadded == true){
              vm.catalogoption_params['id'] = $scope.cataloguploadoptions_id;
            }
            if(vm.catalog.work != null){
              vm.catalogoption_params['work'] = vm.catalog.work.toString();
            }
            if(vm.catalog.fabric != null){
              vm.catalogoption_params['fabric'] = vm.catalog.fabric.toString();
            }
             if(vm.catalog.sell_full_catalog == false){
                if(vm.catalog.is_percentage == true){
                    vm.params["single_piece_price_percentage"] = vm.catalog.single_piece_price_percentage;
                }
                else{
                    vm.params["single_piece_price"] = vm.catalog.single_piece_price; 
                }
            }
            $(".modelform").addClass(progressLoader());
            Catalog.patch(vm.params,
            function(success){
                    
                    var i = 0;
                    for(i=0; i < vm.catalog_products.length; i++){
                      if($scope.product.price_type == 'single'){
                          vm.catalog_products[i].price = vm.catalog.price;
                          vm.catalog_products[i].public_price = vm.catalog.price;
                          /* if(vm.catalog.view_permission == 'public'){
                            vm.catalog_products[i].public_price = vm.catalog.public_price;
                          } */
                      }
                      else
                      {
                          vm.catalog_products[i].public_price = vm.catalog_products[i].price
                      }

                      Product.patch(vm.catalog_products[i],
                        function(success){
                       /*   vm.successtoaster = {
                              type:  'success',
                              title: 'Success',
                              text:  'Product updated successfully.'
                          };
                          toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);      */
                        });
                    }

                    vm.catalogoption_params['catalog'] = $scope.catalogId;
                    if($scope.cataloguploadoptions_isadded == true){
                      CatalogUploadOptions.patch(vm.catalogoption_params,
                        function(result){
                           console.log('catalog options updated');
                        });
                    }
                    else{
                      CatalogUploadOptions.save(vm.catalogoption_params,
                        function(result){
                           console.log('catalog options added');
                        });
                    }

                    $(".modelform").removeClass(progressLoader());
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Catalog updated successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                   // ngDialog.close();
                    $scope.reloadData();
            }); 
               /* Catalog.patch(vm.params,
                function(success){
                        $(".modelform").removeClass(progressLoader());
                        ngDialog.close();
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Catalog updated successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $scope.reloadData();
                }); */
          };

  /*      vm.SubmitCatalog = function (){
            alert($scope.update_flag);
            if($scope.update_flag)
            {
              vm.UpdateCatalog();
            }
            else
            {
              vm.AddCatalog();
            }


        }*/


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
                            if(vm.selectedFullJson[key][10]["catalog_type"] == "catalogseller"){
                                toaster.pop("error", "Failed", vm.selectedFullJson[key][1]+" catalog can't be deleted because you are a seller"); 
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
        
        
      vm.OpenEnableCatalog = function (){
          var true_count = 0;
          angular.forEach(vm.selected, function(value, key) {
              if(value==true){
                  true_count++;
                  vm.true_key = key;
              }
          })
          if(true_count > 0)
          {
            vm.enable_duration = 30;
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
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })
            
            var today = new Date(); 
            var expiry_date = today.setDate(today.getDate() + vm.enable_duration);
           // console.log(today);
            expiry_date = formatDate(expiry_date) + "T23:59:59Z"
            console.log(vm.enable_duration);
            console.log(expiry_date);
            
            if(true_count > 0)
            {
                
                angular.forEach(vm.selected, function(value, key) {
                    if(value==true){
                        $(".modelform3").addClass(progressLoader());
                        Catalog.save({'id': key, 'cid':$scope.company_id, 'sub_resource':"enable", 'expire_date': expiry_date }).$promise.then(function(result){
                            $(".modelform3").removeClass(progressLoader());
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Catalog has been enabled.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            $scope.reloadData();
                            ngDialog.close();
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

      $scope.product = {};

      $scope.product.price_type = 'individual';
      //$scope.product.dont_allow_crop = false;
      $scope.product.dont_allow_crop = false;
      $scope.without_sku = false;
      //$scope.without_price = false;
      $scope.singleprice = false;

      $scope.single = function(){
        $scope.product_price_type = 'single';
      }
      $scope.individual = function(){
        //$scope.singleprice = false;
        $scope.product_price_type = 'individual';
      }
      $scope.withoutprice = function(){
        //$scope.singleprice = false;
        $scope.product_price_type = 'withoutprice';
      }
      
      $scope.withoutSku = function(flag){
        $scope.without_sku = flag;
      }
      
      /*$scope.withoutPrice = function(flag){
        $scope.without_price = flag;
      }*/
      
      
      
     
      
      
      
      $scope.show_progress_text = false;
      $scope.AddProducts = function () {
        
        if(vm.addproduct.$valid || $scope.without_sku == true) {    
          $scope.show_progress_text = true;
            if ($scope.catalogId == undefined){
                vm.errortoaster = {
                    type:  'error',
                    title: 'Failed',//toTitleCase(key),//
                    text:  "Please add catalog"
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                return;
            }
            
            if($scope.products.length < 1){
                return;
            }
            
       //  BulkProduct.save($scope.products);
          $(".modelform2").addClass(progressLoader());
          //alert(progressLoader());
          vm.count = 0;
          vm.success_count = 0;
          vm.catalogoption_params = {};
          if($scope.product_price_type == 'single'){
            vm.catalogoption_params['private_single_price'] = vm.catalog.price;
            vm.catalogoption_params['public_single_price'] = vm.catalog.price;
           /* if($scope.catalogData.view_permission == 'public'){
              vm.catalogoption_params['public_single_price'] = vm.catalog.public_price;
            } */ 
          }
          else{
            vm.catalogoption_params['private_single_price'] = null;
            vm.catalogoption_params['public_single_price'] = null;
          }
          vm.catalogoption_params['without_sku'] = $scope.without_sku;
        
        /*  if(vm.catalog.work != null){
            vm.catalogoption_params['work'] = vm.catalog.work.toString();
          }
          if(vm.catalog.fabric != null){
            vm.catalogoption_params['fabric'] = vm.catalog.fabric.toString();
          } */

          vm.catalogoption_params['catalog'] = $scope.catalogId;
          if($scope.cataloguploadoptions_isadded == true){
            vm.catalogoption_params['id'] = $scope.cataloguploadoptions_id;
          }

          //angular.forEach($scope.products, function(product, index) {
            for (var i = $scope.products.length - 1; i >= 0; i--) {
              vm.params =  {"title":$scope.products[i].sku, "catalog": [$scope.catalogId], "sort_order":$scope.products[i].sort_order} ;//"sku":$scope.products[i].sku, 
              if(!$scope.products[i].cropallow){
                //vm.params["image"] = Upload.dataUrltoBlob($scope.products[i].uncropped, $scope.products[i].image);
                vm.params["image"] = blobImageRenameForExtenstion($scope.products[i].uncropped, $scope.products[i].image, $scope.products[i].sort_order+".jpg");
              }
              else{
                //vm.params["image"] = Upload.dataUrltoBlob($scope.products[i].imageCroped, $scope.products[i].image);
                vm.params["image"] = blobImageRenameForExtenstion($scope.products[i].imageCroped, $scope.products[i].image, $scope.products[i].sort_order+".jpg");
              }
              
              if ($scope.without_sku==false){
                vm.params["sku"] = $scope.products[i].sku;
              }
           /*   if ($scope.products[i].work != null){
                vm.params["work"] = $scope.products[i].work;
              }
              if ($scope.products[i].fabric != null){
                vm.params["fabric"] = $scope.products[i].fabric;
              } */
              
              if(typeof $scope.products[i].price != "undefined"){
                vm.params["price"] = $scope.products[i].price;
                vm.params["public_price"] = $scope.products[i].price;
              }
              
              /*if($scope.catalogData.view_permission == "public" && typeof $scope.products[i].public_price != "undefined" && $scope.product_price_type != 'withoutprice'){//$scope.without_price==false
                vm.params["public_price"] = $scope.products[i].public_price;
              } */
              
              $scope.totalproducts = $scope.products.length;
              $scope.completedproducts = 0;
              Product.save(vm.params,
                   function(success){
                        //$scope.products.splice(i, 1);
                        //alert(success.sort_order);

                        for (var j = $scope.products.length - 1; j >= 0; j--) {
                            /*if ($scope.products[j].sku == success.sku){
                                //alert(success.sku);
                                $scope.products.splice(j, 1);
                            }*/
                            if ($scope.products[j].sort_order == success.sort_order){
                                //alert(success.sku);
                                $scope.products.splice(j, 1);
                                $scope.completedproducts++;
                            }
                        }
                        
                          /*vm.success_count++ ;
                          vm.count++;
                          if(vm.products_count == vm.count)
                          {
                            $(".modelform2").removeClass(progressLoader());
                            //ngDialog.close();
                            vm.successtoaster = {
                                              type:  'success',
                                              title: 'Success',
                                              text:  vm.success_count+' out of '+vm.products_count+' Product added successfully.'
                                          };
                                          toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            //$scope.products = {};
                          }*/
                        
                        if(i == 0){
                            $(".modelform2").removeClass(progressLoader());
                        }
                        
                        if($scope.products.length == 0){
                            
                            $scope.completedproducts = 0;
                            $scope.show_progress_text = false;
                            if($scope.cataloguploadoptions_isadded == true){
                              CatalogUploadOptions.patch(vm.catalogoption_params,
                                function(result){
                                   console.log('catalog options updated');
                                });
                            }
                            else{
                              CatalogUploadOptions.save(vm.catalogoption_params,
                                function(result){
                                   console.log('catalog options added');
                                });
                            }
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Products are uploaded successfully.'
                            };
                            ngDialog.close();
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            $scope.reloadData();
                        }
                        
                    }, function(error) {
                        if(i == 0){
                            $(".modelform2").removeClass(progressLoader());
                        }
                      // Error handler code
                    })
                
                /*if(i == 0){
                    alert(i);
                    $(".modelform2").removeClass(progressLoader());
                }*/
            
          
            }
            //});
        }
        else
        {
            //vm.addproduct.sku.$dirty = true;
            if(vm.addproduct.sku.$dirty){
              vm.errortoaster = {
                        type:  'error',
                        title: 'Failed',
                        text:  'SKU has character limit of 30.'
                    };
                    console.log(vm.errortoaster);
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
            }
            else 
            { 
              vm.errortoaster = {
                          type:  'error',
                          title: 'Failed',
                          text:  'Fill all required fields.'
                      };
                      console.log(vm.errortoaster);
              toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
           }
        }
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

                if(vm.selectedFullJson[$scope.true_key][6] == "Enable"){
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
        
        vm.CsvDialog = function () {
            ngDialog.open({
                template: 'uploadcsv',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        vm.OpenUploadCsv = function() {
            vm.CsvDialog();
        };
        
        $scope.uploadCSVFiles = function (files) {
            $scope.csv_file = files;
            console.log($scope.file);
        };
        
        vm.UploadCatalogCsv = function() {
            if(vm.uploadcsv.$valid) {
                $(".modelform3").addClass(progressLoader());
              //  console.log($scope.file);
                Upload.upload({
                            url: 'api/v1/importcsvcatalog/',
                            headers: {
                              'optional-header': 'header-value'
                            },
                            data: {"catalog_csv":$scope.csv_file}
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
        };
      
        /*var calcDataTableHeight = function() {
          return $(window).height() * 42 / 100;
        };*/

      vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: 'api/catalogdatatables1/',
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
                          5 : { "type" : "select", values:[{"value":"public","label":"Public"}, {"value":"push","label":"Private"}]},
                          6 : { "type" : "select", values:[{"value":"Enable","label":"Enable"}, {"value":"Disable","label":"Disable"}]},
                         7 : { "type" : "dateRange", width: '100%'},
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
                              text: 'Add Catalog',
                              key: '1',
                              className: 'green',
                              action: function (e, dt, node, config) {
                                  $scope.catalogId = null;
                                  vm.catalog = {};
                                  vm.catalog.enable_duration = 30;
                                  vm.catalog.sell_full_catalog = true;
                                  vm.catalog.dont_allow_crop = false;
                                  vm.catalog.cropallow = !vm.catalog.dont_allow_crop;

                                  vm.catalog.is_percentage = true;
                                  vm.catalog.single_piece_price_percentage = 0;
                                  vm.catalog.single_piece_price = 0;
                                  vm.catalog.view_permission = 'public';
                                  vm.catalog.catalog_type = 'catalog';
                                  
                                  $scope.dt = new Date();
                                  vm.catalog.dispatch_date = formatDate($scope.dt);
                                  //$scope.category = {};
                                  var tempArr = [];
                                  $scope.update_flag = false;
                                  $scope.products = [];
                                  $scope.OpenCatalogForm(tempArr);

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
                                  vm.UpdateCatalogForm();
                              }
                          },
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
                      /*    {
                              text: 'Delete',
                              key: '1',
                              className: 'red',
                              action: function (e, dt, node, config) {
                                 // alert(JSON.stringify(vm.selected));
                                    vm.DeleteCatalog();
                              }
                          }, */
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
                                    vm.OpenEnableCatalog();
                              }
                          },
                       /*   {
                              text: 'Sales Order',
                              key: '1',
                              className: 'orange',
                              action: function (e, dt, node, config) {
                                  vm.CreateOrderForm('sales_order');
                                  $scope.catalogstobeorder = [];
                              }
                          },*/
                          {
                                text: 'Upload CSV',
                                key: '1',
                                className: 'blue',
                                action: function (e, dt, node, config) {
                                    vm.OpenUploadCsv();
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
                          //'copy',
                          'print',
                          //'excel',
                          
                      ]);
                          
                      vm.dtColumnDefs = [
                          DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
                          .renderWith(function(data, type, full, meta) {
                              vm.selected[full[0]] = false;
                              vm.selectedFullJson[full[0]] = full;
                              return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                          }),
                          DTColumnDefBuilder.newColumnDef(1).withTitle('Title').renderWith(TitleLink),
                          DTColumnDefBuilder.newColumnDef(2).withTitle('Image').renderWith(imageHtml).notSortable(),
                          DTColumnDefBuilder.newColumnDef(3).withTitle('Brand').renderWith(BrandTitleLink),
                          DTColumnDefBuilder.newColumnDef(4).withTitle('Category'),
                          DTColumnDefBuilder.newColumnDef(5).withTitle('View Type'),
                          DTColumnDefBuilder.newColumnDef(6).withTitle('Status').notSortable(),
                          DTColumnDefBuilder.newColumnDef(7).withTitle('Expiry Date'),
                          DTColumnDefBuilder.newColumnDef(8).withTitle('Designs').notSortable().withOption('sWidth','5%'),
                          DTColumnDefBuilder.newColumnDef(9).withTitle('Views').notSortable().withOption('sWidth','5%'),
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
        
        
    }
})();

