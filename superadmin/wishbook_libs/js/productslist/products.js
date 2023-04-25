 /*start - form wizard */
(function() {
    'use strict';
    angular
        .module('app.product')
        
        //   .controller('CompanyFormController', CompanyFormController)
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
        .module('app.product')
        .controller('productController', productController);

    productController.$inject = ['$resource', 'Catalog', 'Product', 'v2Products', 'v2ProductsPhotos', 'v2ProductsMyDetails', 'EnumGroup', 'ngDialog', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', 'Upload', '$cookies', '$localStorage', 'SweetAlert', '$stateParams','CatalogUploadOptions'];
    function productController($resource, Catalog, Product, v2Products, v2ProductsPhotos, v2ProductsMyDetails, EnumGroup, ngDialog, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, Upload, $cookies, $localStorage, SweetAlert, $stateParams, CatalogUploadOptions) {
        CheckAuthenticated.check();
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
        
        var vm = this;
        $scope.product_type = "";
        
        
        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
        $scope.flag_retailer = localStorage.getItem("flag_retailer");
        $scope.is_staff = localStorage.getItem("is_staff") || false;
        if($scope.flag_retailer == "true"){
            $state.go('app.browse');
        }

       
        
        function blobImageRenameForExtenstion(final_image, assing_to, newname) {
        var cropblob = Upload.dataUrltoBlob(final_image, assing_to);
        var fileFromBlob = new File([cropblob], newname, { type: "image/jpeg", lastModified: Date.now() });
        return fileFromBlob
        }
    
        vm.selected = {};
        vm.selectedFullJson = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        $scope.update_flag = false;
        $scope.updateUI_called = false;
        $scope.product = {};
        
        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';


        //get catalog details

        if ($stateParams.id != null)
        {

            $scope.catalog_id = $stateParams.id;
            console.log($scope.catalog_id);
            
            Catalog.get({ 'id': $stateParams.id, 'cid': $scope.company_id }, function (success) {
                $scope.product_type = success.catalog_type;
                $scope.product_details = success;
                console.log(success);
                
            });
        }

        
        function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);

            UpdateCheckBoxUI();
        }

        function callback(json) {
            console.log(json);
            if(json.recordsTotal > 0 && json.data.length == 0){
                //vm.dtInstance.rerender();
                $state.go($state.current, {}, {reload: true});
            }
        }
        
        $scope.uploadProductImage = function (file) {
            var fr = new FileReader();
            fr.readAsDataURL(file);
            var blob;
            fr.onload = function () {
                var image = new Image();
                image.src = fr.result;
                
                var blob = dataURItoBlob(image.src);
                console.log(blob);
                
                $scope.product.uncropped = image.src;//target_img; 
                $scope.product.image = blob;
            }
        };
        
        $scope.allowCrop = function(cropallow){
            if(cropallow){
                $scope.product.cropallow = false;
            }else{
                $scope.product.cropallow = true;
            }
        }
        
        $scope.view_permission = "push";
        
        $scope.ChangeViewPermission = function(catalog)
        {
            for (var i = 0; i < $scope.catalogs.length; i++) { 
                if($scope.catalogs[i]["id"] == catalog){
                    $scope.view_permission = $scope.catalogs[i]["view_permission"]
                }
            }
            console.log('catalog to be updated is if product.catalog ised is' + catalog);
            
        }
        

        $scope.OpenUpdateProductForm = function (index)
        {

            $scope.product = {};
            $scope.product.dont_allow_crop = false;
            $scope.product.cropallow = !$scope.product.dont_allow_crop;
            $scope.update_flag = true;
                          
            //Product.get({'id': vm.true_key}).$promise.then(function(result){
            v2Products.get({'id': index}).$promise.then(function(result)
            {
                // $scope.product = result;
                // $scope.product.image = result.image.full_size;
                console.log(result);
                
                $scope.product.title = result.title;
                $scope.product.sku = result.sku;

                if (result.product_type == 'set' || result.product_type == 'quality') // so that we get nlu set list in update aciion
                {
                    $scope.product_type = 'set';
                }

                /*  if(result.fabric != null){
                    console.log(result.fabric.split(','));
                    var fab_arr = result.fabric.split(',');
                    $scope.product.fabric = fab_arr;
                }
                if(result.work != null){
                    $scope.product.work = result.work.split(',');
                }  */
                $scope.product.price = parseInt(result.price);
                $scope.product.public_price = parseInt(result.public_price);
                $scope.product.single_piece_price = parseInt(result.single_piece_price);
                
                
                $scope.product.catalog = result.catalog;
                console.log($scope.catalog_id);
                $scope.productId = result.id;
                $scope.productImage = result.image.thumbnail_medium;
                vm.OpenProductForm();
                //console.log($scope.product.image);
            });
        };

        vm.OpenProductForm = function (action)
        {
            if ($stateParams.id) {
                $scope.product.catalog = parseInt($stateParams.id);
            } /* https://wishbook.atlassian.net/browse/WB-4627*/
            console.log($stateParams.id);

            console.log($scope.product_type);
            $scope.action = action;
            console.log($scope.action);
            if (action == 'addproduct') {
                CatalogUploadOptions.query({ 'catalog': $stateParams.id },
                    function (success) {
                        console.log(success);

                        if (success.length != 0) {
                            if (success[0].public_single_price || success[0].private_single_price) {
                                $scope.product.price = parseInt(success[0].public_single_price) || parseInt(success[0].private_single_price);
                            }
                        }

                    })
            }

            $scope.openConfirm();
            
            /*if ($scope.product_details.company == $scope.company_id  || $scope.is_staff) {
               
            }
            else {
                vm.successtoaster = {
                    type: 'Failled',
                    title: 'Failed',
                    text: 'You cannot add products as you are not original seller'
                };
                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                console.log(vm.successtoaster);

            }

            if (action != 'addproduct')
            {
                $(".modelform").addClass(progressLoader());
               
                //$scope.catalogs = Catalog.query({cid:$scope.company_id, view_type:'mycatalogs', id:"dropdown"});
                 DROPDOWN REMOVED
                
                v2Products.query({ cid: $scope.company_id, 'view_type': 'mycatalogs', 'product_type': $scope.product_type }).$promise.then(function (success) {

                    $(".modelform").removeClass(progressLoader());
                    $scope.catalogs = success;
                    $scope.ChangeViewPermission($scope.product.catalog);
                });

                 EnumGroup.query({type:"fabric"}).$promise.then(function(success){
                $scope.fabrics = success;
                });
                EnumGroup.query({type:"work"}).$promise.then(function(success){
                $scope.works = success;
                }); 

            }*/

        };

        $scope.openConfirm = function () {

            ngDialog.openConfirm({
                template: 'addproduct',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            })
        };
        
        $scope.SubmitProduct = function() {
            console.log($scope.catalog_id);
            if($scope.update_flag)
            {
                vm.UpdateProduct();
            }
            else
            {
                vm.AddProduct();
            }
        }

        

        vm.AddProduct = function()
        {
            console.log("product == ", $scope.product);
            //$scope.product.image = Upload.dataUrltoBlob($scope.product.croppedImage, $scope.product.image); //$scope.image; //
            $scope.product.image = blobImageRenameForExtenstion($scope.product.croppedImage, $scope.product.image, $scope.product.sku+".jpg");
            delete $scope.product.croppedImage;
            delete $scope.product.uncropped
            $(".modelform").addClass(progressLoader()); 
            //$scope.catalogs = Catalog.get({cid:$scope.company_id, id:$scope.product.catalog});
            
               /*if($scope.product.work == null)
                {
                    $scope.product.work = '';
                }
                if($scope.product.fabric == null)
                {
                    $scope.product.fabric = '';
                } */
                

                $scope.product.catalog = $scope.catalog_id ;//$scope.product.catalog;                
                //Catalog.get({cid:$scope.company_id, id:$scope.product.catalog}).$promise.then(function(result){
                  
                  //added because now we are not asking public price from user
                  //if(result.view_permission == "public"){
                    $scope.product.public_price = $scope.product.price;
                  //} 
                  
                  v2Products.save($scope.product,
                     function(success){
                            $(".modelform").removeClass(progressLoader());
                            ngDialog.close();
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Product added successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            reloadData();
                            $scope.product = {};
                      });
              //  })
        };

        vm.UpdateProduct = function()
        {
            console.log("product == ", $scope.product);
            $(".modelform").addClass(progressLoader()); 
            console.log($scope.product.catalog + ' ' + $scope.catalog_id);
            
            
            //$scope.params = {"id": $scope.productId, "title":$scope.product.title,"price":$scope.product.price, "single_piece_price":$scope.product.single_piece_price, "catalog":$scope.product.catalog};
            $scope.params = { "id": $scope.productId, "title": $scope.product.title, "price": $scope.product.price, "catalog": $scope.catalog_id};
            if ($scope.product.sku != null){
                $scope.params['sku'] = $scope.product.sku;
            }
            /* if ($scope.product.work != null){
                $scope.params['work'] = $scope.product.work;
            }
            if ($scope.product.fabric != null){
                $scope.params['fabric'] = $scope.product.fabric;
            } */
            
            /*if($scope.product.image != null)
            {
                $scope.image = Upload.dataUrltoBlob($scope.product.croppedImage, $scope.product.image);
                $scope.params['image'] = $scope.image;
                
            }*/
            
            if(!$scope.product.cropallow && $scope.product.image != null){
                //$scope.params["image"] = Upload.dataUrltoBlob($scope.product.uncropped, $scope.product.image);
                $scope.params["image"] = blobImageRenameForExtenstion($scope.product.uncropped, $scope.product.image, $scope.product.title+".jpg");
            }
            else if($scope.product.image != null){
                //$scope.params["image"] = Upload.dataUrltoBlob($scope.product.croppedImage, $scope.product.image);
                $scope.params["image"] = blobImageRenameForExtenstion($scope.product.croppedImage, $scope.product.image, $scope.product.title+".jpg");
            }
            
            /* Catalog.get({cid:$scope.company_id, id:$scope.product.catalog}).$promise.then(function(result){
                if(result.view_permission == "public"){
                    $scope.params['public_price'] = $scope.product.public_price;
                }  */
                $scope.params['public_price'] = $scope.product.price;
                //Product.patch($scope.params,
                v2Products.patch($scope.params,
                     function(success){
                            $(".modelform").removeClass(progressLoader());
                            ngDialog.close();
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Product updated successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            reloadData();
                            $scope.product = {};
                      },
                  function(error){
                      //$scope.product.catalog = $scope.product.catalog[0];                  
                })
            //});
        };

        vm.DeleteProduct = function (){
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
        } 
        
        $scope.ProductsImages = function () {
            ngDialog.open({
                template: 'productimages',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        $scope.OpenProductsImages = function(id)
        {
            var pswpElement = document.querySelectorAll('.pswp')[0];
            $(".modelform3").addClass(progressLoader()); 
            $scope.slides = [];
            v2Products.get({"id":id},
            function (result)
            {
                $scope.catalog_id = result.catalog;
                Catalog.get({"id":$scope.catalog_id, "cid":$scope.company_id},
                function (result)
                {
                    var supplier_name = result.supplier_name;
                    var bundle_product_id = result.product_id;
                    console.log(bundle_product_id);

                    Catalog.get({"id": $scope.catalog_id, "expand":"true", "cid":$scope.company_id},
                    function (success)
                    {
                        var products = success.products;

                        v2ProductsMyDetails.get({ "id": bundle_product_id },function (response)
                        {
                           
                            var productprices = response.products;
                            console.log(productprices);
                            var singleprices = {};

                            for (var i = 0; i < productprices.length; i++)
                            {
                                //console.log(productprices[i].price + ' , '+productprices[i].id);
                                singleprices[productprices[i].id] = parseInt(productprices[i].price);
                            }
                            console.log(singleprices);

                            //$scope.productimg = []
                            var start_index = 0;
                            for (var i = 0; i < products.length; i++)
                            {
                                if (products[i].id == id) {
                                    start_index = i;
                                }
                                /*$scope.slides.push({
                                id: products[i].id,
                                image: products[i].image.thumbnail_medium,
                                text: products[i].sku,
                                }); */
                                var data = '';
                                if (products[i].sku != null && products[i].sku != "") {
                                    var data = '<strong>SKU: </strong>' + products[i].sku;
                                }
                                if (response.price != null && response.price != "") {
                                    var data = data + '<br><strong>Price: &#8377;</strong>' + response.price;
                                }
                                if (success.sell_full_catalog == false) {
                                    var data = data + '<br><strong>Singe piece price: &#8377;</strong>' + singleprices[products[i].id];
                                }
                                if (success.title != null && success.title != "") {
                                    var data = data + '<br><strong>Catalog: </strong>' + success.title;
                                }
                                if (success.brand != null) {
                                    if (success.brand.name != null && success.brand.name != "") {
                                        var data = data + '<br><strong>Brand: </strong>' + success.brand.name;
                                    }
                                }
                                if (products[i].fabric != null && products[i].fabric != "") {
                                    var data = data + '<br><strong>Fabric: </strong>' + products[i].fabric;
                                }
                                if (products[i].work != null && products[i].work != "") {
                                    var data = data + '<br><strong>Work: </strong>' + products[i].work;
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
                                closeOnScroll: false,
                                shareEl: false,
                                preloaderEl: true,
                                showAnimationDuration: 0,
                                hideAnimationDuration: 0
                            };

                            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, $scope.slides, options);
                            gallery.init();
                            //    console.log(i);
                            //  $scope.ProductsImages();
                            $(".modelform3").removeClass(progressLoader());
                        });
                    });

                       
                });
            });
        }

     
        
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
                        v2Products.save({'id': key, 'cid':$scope.company_id, "sub_resource":"disable"}).$promise.then(function(result){
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
                
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
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
                        v2Products.save({'id': key, 'cid':$scope.company_id, "sub_resource":"enable"}).$promise.then(function(result){
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
        
        vm.UploadProductCsv = function() {
            if(vm.uploadcsv.$valid) {
                $(".modelform3").addClass(progressLoader());
              //  console.log($scope.file);
                Upload.upload({
                            url: 'api/v1/importcsvproduct/',
                            headers: {
                              'optional-header': 'header-value'
                            },
                            data: {"product_csv":$scope.csv_file}
                      }).then(function (response) {
                                var headers = response.headers();
                                
                                if(headers['content-type'] == "text/csv"){
                                    var hiddenElement = document.createElement('a');

                                    hiddenElement.href = 'data:attachment/csv,' + encodeURI(response.data);
                                    hiddenElement.target = '_blank';
                                    hiddenElement.download = 'product_error.csv';
                                    hiddenElement.click();
                                    
                                    vm.successtoaster = {
                                        type:  'warning',
                                        title: 'Warning',
                                        text:  'File uploaded successfully and please fix issues found on product_error.csv and reupload'
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

        vm.SoftDelete = function (){
          var true_count = 0;

            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                }
            });

            if(true_count > 0 ){
                angular.forEach(vm.selected, function(value, key) {
                    if(value==true){
                        v2Products.patch({"cid": $scope.company_id, 'id': key, "deleted": true },function(success){
                            vm.successtoaster = {
                                        type:  'success',
                                        title: 'Success',
                                        text:  'Products soft deleted successfully.'
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
                      text:  'Please select atleast one row.'
                  };
                  console.log(vm.errortoaster);
                  toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }
        }
        vm.CloseDialog = function () {
          ngDialog.close();
        }
        $scope.uploadProductPhotos = function (files) {
          console.log(files);
          $scope.products_photos = [];
          var files_length = files.length;
          $scope.max_limit_error = false;
          console.log(files_length +"-----"+ $scope.allow_max_images)
          if(files_length > $scope.allow_max_images){
            $scope.max_limit_error = true; 
            // vm.errortoaster = {
            //     type:  'error',
            //     title: 'Failed',
            //     text:  'Please select only '+$scope.allow_max_images+' image(s).'
            // };
            // console.log(vm.errortoaster);
            // toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            $scope.productimages = [];
            return;
          }
          
          var order_no = 1;
          ////$scope.files = files;
          
          var first_upload = false;
          // alert($scope.products.length)
          if ($scope.product_images.length == 0) {
              order_no = 1;
              first_upload = true;
          }
          else {
              order_no = $scope.product_images.length + 1;
          }
          angular.forEach(files, function (file, key) {

              var fr = new FileReader();
              fr.readAsDataURL(file);
              //console.log(fr);
              //var blob;
              fr.onload = function (evt) {
                  //var blob = dataURItoBlob(image.src);
                  var blob = dataURItoBlob(evt.target.result);
                  console.log("url blob=");
                  console.log(blob);

                  var product = {};
                  product.image = blob;
                  product.uncropped = evt.target.result //image.src; //target_img; //
                  //product.cropallow = !$scope.product.dont_allow_crop;
                  // var filename = file.name.replace('.jpg', '').replace('.JPG', '').replace('.png', '').replace('.PNG', '').replace('.jpeg', '').replace('.JPEG', '').replace(',', '');
                  // filename = filename.replace(/^[0!@#$%&*<>?()=]+/, '').replace(' ', '').replace(';', '').replace('\"', '').replace('\'', '');   

                  product.sort_order = order_no;

                  $scope.products_photos.push(product);
                  $scope.$apply();

                  order_no = order_no + 1;

                  /* if ($scope.products_photos.length == files_length && first_upload == true) {
                      order_no = $scope.order_no_live;
                      
                      for (var i = 0; i < $scope.products_photos.length; i++) {
                          $scope.products_photos[i].sort_order = order_no; //i+1;
                          order_no = order_no + 1;
                      }
                      console.log($scope.products_photos);
                  } */
                  console.log($scope.products_photos);

              }

          });

          vm.products_count = files_length;  
        }
        
        vm.submitAddMoreImages = function (){
          var total_photos_uploaded_successfully = 0;
            console.log($scope.products_photos);
            $(".modelform3").addClass(progressLoader());
            for (var j = 0; j < $scope.products_photos.length; j++) {
                var temp_product = {};

                temp_product.product = $scope.product_id;
                // if (j == 0)
                //     temp_product.set_default = true;
                // else
                //     temp_product.set_default = false;
                temp_product.sort_order = $scope.products_photos[j].sort_order;

                temp_product.image = blobImageRenameForExtenstion($scope.products_photos[j].uncropped, $scope.products_photos[j].image, temp_product.sort_order + ".jpg");

                v2ProductsPhotos.save(temp_product,
                    function (success_productphoto) {

                        total_photos_uploaded_successfully += 1

                        console.log("total_photos_uploaded_successfully " + total_photos_uploaded_successfully + " total_photos = " + $scope.products_photos.length);
                        
                        if (total_photos_uploaded_successfully == $scope.products_photos.length) {
                            
                            $(".modelform3").removeClass(progressLoader());
                            vm.successtoaster = {
                                type: 'success',
                                title: 'Success',
                                text: 'Product photos added successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            ngDialog.close();
                            reloadData();
                        }

                    });
            }
        }
        
        $scope.openAddMoreImages = function (productid) {
          $scope.product_id = productid;
          console.log(productid);
          console.log(vm.selectedFullJson[productid]);
          $scope.product_images = vm.selectedFullJson[productid][1]['images'];
          $scope.product_main_image = vm.selectedFullJson[productid][2];
          // $scope.products_photos = [];
          if($scope.product_images.length == 0){
            $scope.allow_max_images = 3 - $scope.product_images.length; 
          }
          else {
            $scope.allow_max_images = 4 - $scope.product_images.length; 
          }
          $scope.max_limit_error = false;
          ngDialog.open({
              template: 'addmoreimages',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
          });
        }
        $scope.DeleteProductImage = function (photoid,index) {
          console.log(photoid);
          $(".modelform3").addClass(progressLoader());
          v2ProductsPhotos.delete({'id': photoid},function (success) {
            $(".modelform3").removeClass(progressLoader());
            vm.successtoaster = {
                type: 'success',
                title: 'Success',
                text: 'Product photo deleted successfully.'
            };
            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
            reloadData();
            //$scope.product_images = vm.selectedFullJson[$scope.product_id][1]['images'];
            $scope.product_images.splice(index+1,1);
            $scope.max_limit_error = false;
            $scope.allow_max_images = $scope.allow_max_images + 1;
            console.log($scope.product_images);
          });
        }
        function skuAddImageAction(data, type, full, meta){
          var col_text = full[3];
          if(full[1]['images'].length > 1)
          {
            col_text = col_text + '<br/><span style="font-weight: bold;">'+full[1]['images'].length+' images</span>';
            col_text = col_text + '<br/>'+ '<a href="" ng-click="openAddMoreImages('+full[1]['product_id']+')">Add more images</a>';
          }
          else {
            col_text = col_text + '<br/>'+ '<a href="" ng-click="openAddMoreImages('+full[1]['product_id']+')">Add images</a>';
          }
          
          return col_text;
        }

        function IDText(data, type, full, meta){
          return full[1]['product_id'];
        }
        function imageHtml(data, type, full, meta)
        {
            if(!$scope.updateUI_called)
            {
                UpdateCheckBoxUI();
                $scope.updateUI_called = true;              
            }
            if ($scope.product_type == 'set')
            {
                //console.log('single pc prc');

                $("tr td:nth-child(9)").css('display', "none");
                $("tr th:nth-child(9)").css('display', "none");
            }
            $('.contextAction ').fadeOut();
            $('.singlecontextAction').fadeOut();

            return '<a ng-click="OpenProductsImages(' + full[0] +')" class="hvr-grow"><img class="loading" src="'+full[2]+'" style="width: 100px; height: 100px"/></a>';
        }
        function sizeHtml(data, type, full, meta) {
            if( Boolean(full[6]) )
            {
                return full[6];
            }
            else
            {
                return '<span>N/A</span>'
            }
        }
        
        var url = 'api/productdatatables1/'
        if($stateParams.type != null && $stateParams.id != null){
            url = 'api/productdatatables1/?type='+$stateParams.type+'&id='+$stateParams.id;
        }

        vm.tableButtons = [
                            {
                                text: 'Reset Filter',
                                key: '1',
                                className: 'buttonSecondary',
                                action: function (e, dt, node, config) {
                                    //localStorage.removeItem('DataTables_' + 'products-datatables');
                                    $state.go($state.current, {}, { reload: true });
                                }
                            },
                            //'copy',
                            'print',
                    
                            {
                                text: 'Upload CSV',
                                key: '1',
                                className: 'buttonPrimary',
                                action: function (e, dt, node, config) {
                                    vm.OpenUploadCsv();
                                }
                            },
                            {
                                text: 'Add Product',
                                key: '1',
                                className: 'buttonPrimary addProduct',
                                action: function (e, dt, node, config) {
                                    $scope.product = {};
                                    $scope.product.dont_allow_crop = false;
                                    $scope.product.cropallow = !$scope.product.dont_allow_crop;
                                    $scope.update_flag = false;
                                    vm.OpenProductForm('addproduct');
                                }
                            },
                           /* {
                                text: 'Update Product',
                                key: '1',
                                className: 'buttonPrimary singlecontextAction',
                                action: function (e, dt, node, config) {
                                    $scope.product = {};
                                    $scope.product.dont_allow_crop = false;
                                    $scope.product.cropallow = !$scope.product.dont_allow_crop;
                                    $scope.update_flag = true;
                                    $scope.OpenUpdateProductForm();
                                }
                            },
                            {
                            text: 'Delete',
                            key: '1',
                            className: 'red',
                            action: function (e, dt, node, config) {
                            
                                vm.DeleteProduct();
                            }
                            },*/
                            /*{
                                text: 'Disable',
                                key: '1',
                                className: 'orange',
                                action: function (e, dt, node, config) {
                                 // alert(JSON.stringify(vm.selected));
                                    vm.DisableProduct();
                                }
                            },
                            {
                                  text: 'Enable',
                                  key: '1',
                                  className: 'orange',
                                  action: function (e, dt, node, config) {
                                     // alert(JSON.stringify(vm.selected));
                                        vm.EnableProduct();
                                  }
                            },*/
                            
                            //'excel',
                            /*
                            {
                            text: 'Filter Clear',
                            key: '1',
                            className: 'orange',
                            action: function (e, dt, node, config) {
                                vm.filterClear();
                            }, */
                        ];

        vm.soft_delete_btn = {
                text: 'Soft Delete',
                key: '1',
                className: 'buttonSecondary softdelete',
                action: function (e, dt, node, config) {
                    vm.SoftDelete();
                }
            }

        if($scope.is_staff == true || $scope.is_staff =='true'){
            vm.tableButtons.push(vm.soft_delete_btn);
        }
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: url,
                            type: 'GET',
                        })
                        .withDOM('rtipl')
                        .withOption('stateSave', false)
                        
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
                            4 : { "type" : "text"},
                            5 : { "type" : "text"},
                            6 : { "type" : "text"},
                            7 : { "type" : "numberRange"},
                            8 : { "type" : "numberRange"},
                            9 : { "type" : "numberRange"},
                            10 : { "type" : "text"},
                            //11: { "type": "select", values: [{ "value": 1, "label": "Enable" }, { "value": 0, "label": "Disable" }] },
                            12: { "type": "select", values: [{ "value": 1, "label": "Full Available" }, { "value": 0, "label": "Singles Available" }] }
                        })
                        
                        .withOption('processing', true)
                        .withOption('serverSide', true)
                        /*.withOption('stateSave', true)
                        //.withOption('stateLoadParams', false)
                        //.withOption('stateSaveParams', false)
                        .withOption('stateSaveCallback', function(settings, data) {
                            //console.log(JSON.stringify(settings));
                            data = datatablesStateSaveCallback(data);
                            localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));
                        })
                        .withOption('stateLoadCallback', function(settings) {
                            return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance ))
                        })*/
                        
                        .withOption('iDisplayLength', 10)
                        //.withOption('responsive', true)
                        .withOption('scrollX', true)
                        .withOption('scrollY', getDataTableHeight())
                        //.withOption('scrollCollapse', true)
                        .withOption('aaSorting', [10, 'asc']) //Sort by ID Desc
                        
                        .withPaginationType('full_numbers')
                        
                        .withButtons(vm.tableButtons);
       
        if ($scope.is_staff != "true" && $scope.is_staff != true)
        {
    
            vm.dtColumnDefs = [ 
                DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
                .renderWith(function(data, type, full, meta) {
                    vm.selected[full[0]] = false;
                    vm.selectedFullJson[full[0]] = full;
                    return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                }),
                DTColumnDefBuilder.newColumnDef(1).withTitle('ID').renderWith(IDText),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Image').renderWith(imageHtml).notSortable(),
                DTColumnDefBuilder.newColumnDef(3).withTitle('S.K.U').renderWith(skuAddImageAction),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Fabric').notSortable(),
                DTColumnDefBuilder.newColumnDef(5).withTitle('Work').notSortable(),
                DTColumnDefBuilder.newColumnDef(6).withTitle('Size').renderWith(sizeHtml).notSortable(),
                DTColumnDefBuilder.newColumnDef(7).withTitle('Price').notVisible(),
                DTColumnDefBuilder.newColumnDef(8).withTitle('FullBillingPrice'),
                DTColumnDefBuilder.newColumnDef(9).withTitle('SingleBillingPrice'), //.notVisible(),
                DTColumnDefBuilder.newColumnDef(10).withTitle('Catalogs').notSortable(),
                DTColumnDefBuilder.newColumnDef(11).withTitle('Enabled').notSortable(),
                DTColumnDefBuilder.newColumnDef(12).withTitle('SingleAvailable').notSortable(),
                DTColumnDefBuilder.newColumnDef(13).withTitle('Actions').notSortable().renderWith(function (data, type, full, meta) {
                    var htmlbutton = '';

                    if (full[1]['catalog_company_id'] == $scope.company_id)
                    {
                        if (full[1]['product_type'] == 'set')
                        {
                            $scope.product_type = 'set';
                            $('.addProduct').css('display', 'none');
                            htmlbutton += '<div style="padding-bottom:5px;"><button type="button" ng-click="OpenUpdateProductForm(' + full[0] + ')" class="linkButton" style="line-height: 16px !important;" >Update Set</button></div>';
                        }
                        else {
                            htmlbutton += '<div style="padding-bottom:5px;"><button type="button" ng-click="OpenUpdateProductForm(' + full[0] + ')" class="linkButton" style="line-height: 16px !important;" >Update Product</button></div>';
                        }
                    }
                    else {
                        $('.addProduct').css('display','none');
                    }

                    return htmlbutton;
                })
            ];
        }
        else
        {
            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
                    .renderWith(function (data, type, full, meta) {
                        vm.selected[full[0]] = false;
                        vm.selectedFullJson[full[0]] = full;
                        return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                    }),
                DTColumnDefBuilder.newColumnDef(1).withTitle('ID').renderWith(IDText),
                DTColumnDefBuilder.newColumnDef(2).withTitle('Image').renderWith(imageHtml).notSortable().withOption('sWidth', '10%'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('SKU').renderWith(skuAddImageAction),
                DTColumnDefBuilder.newColumnDef(4).withTitle('Fabric'),
                DTColumnDefBuilder.newColumnDef(5).withTitle('Work'),
                DTColumnDefBuilder.newColumnDef(6).withTitle('Size').renderWith(sizeHtml).notSortable(),
                DTColumnDefBuilder.newColumnDef(7).withTitle('Price').notVisible(),
                DTColumnDefBuilder.newColumnDef(8).withTitle('FullBillingPrice'),
                DTColumnDefBuilder.newColumnDef(9).withTitle('SingleBillingPrice'),
                DTColumnDefBuilder.newColumnDef(10).withTitle('Catalogs').notSortable(),
                DTColumnDefBuilder.newColumnDef(11).withTitle('Enabled').notSortable(),
                DTColumnDefBuilder.newColumnDef(12).withTitle('SingleAvailable').notSortable(),
                DTColumnDefBuilder.newColumnDef(13).withTitle('Actions').notSortable().renderWith(function (data, type, full, meta)
                {
                    var htmlbutton = '';

                    $scope.company_id = full[1]['catalog_company_id']
                    if (full[1]['product_type'] == 'set')
                    {
                        $scope.product_type = 'set';
                        $('.addProduct').css('display', 'none');
                        htmlbutton += '<div style="padding-bottom:5px;"><button type="button" ng-click="OpenUpdateProductForm(' + full[0] + ')" class="linkButton" style="line-height: 16px !important;" >Update Set</button></div>';
                    }
                    else
                    {
                        htmlbutton += '<div style="padding-bottom:5px;"><button type="button" ng-click="OpenUpdateProductForm(' + full[0] + ')" class="linkButton" style="line-height: 16px !important;" >Update Product</button></div>';
                    } 
                    
                    return htmlbutton;
                })
            ];
        }

        
        function toggleAll(selectAll, selectedItems) {

            if (selectAll) {
                $('.contextAction').fadeIn();
            }
            else {
                $('.contextAction').fadeOut();
            }

            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    selectedItems[id] = selectAll;
                }
            }
        }

        function toggleOne(selectedItems) {
            //console.log(selectedItems);
            var ctr = 0;

            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    //console.log(Boolean(selectedItems[id]));
                    if (Boolean(selectedItems[id])) {
                        ctr = ctr + 1;
                    }
                }
            }
            if (ctr > 0) {
                $('.contextAction').fadeIn();
            }
            else {
                $('.contextAction').fadeOut();
            }

            if (ctr == 1) {
                $('.singlecontextAction').fadeIn();
            }
            else {
                $('.singlecontextAction').fadeOut();
            }

            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    if (!selectedItems[id]) {
                        vm.selectAll = false;
                        return;
                    }
                }
            }

            vm.selectAll = true;

        }

        $(document).ready(function ()
        {
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

                $("table").css('margin-left', "-6px");
                console.log('UpdateCheckBoxUI() attached')

            }, 3000);
        });











        // mot use methods



        /*vm.filterClear = function (){
            //vm.dtInstance.DataTable.search("").draw();
            vm.dtInstance.DataTable.reset()
        }*/

    

        /*  $scope.OpenProductsImages = function(id){
            $(".modelform-slider").addClass(progressLoader()); 
            $scope.slides = [];
            Product.get({"id":id},
            function (result){
                  $scope.catalog_id = result.catalog;
                  Catalog.get({"id": $scope.catalog_id, "expand":"true", "cid":$scope.company_id},
                  function (success){
                      var products = success.products;
                      //$scope.productimg = []
                      var start_index = 0;
                      for (var i = 0; i < products.length; i++) {
                          if(products[i].id == id) {
                            start_index = i+1;
                              $scope.slides.push({
                                id: products[i].id,
                                image: products[i].image.thumbnail_medium,
                                text: products[i].sku,
                                active: start_index
                                
                              });
                          }
                          else
                          {
                            $scope.slides.push({
                              id: products[i].id,
                              image: products[i].image.thumbnail_medium,
                              text: products[i].sku,
                              
                            });
                          }
  
                      }
                      console.log(i);
                      $scope.ProductsImages();
                      
                      $(".modelform-slider").removeClass(progressLoader());  
                  });
                
            });
        }  */

        /*$scope.UploadProductImage = function (files) {
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
        
    }
})();
