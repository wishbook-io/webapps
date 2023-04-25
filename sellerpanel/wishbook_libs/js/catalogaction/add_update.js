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


angular.module('app.catalog').filter('customSplitString', function() {
    return function(input) {
      var arr = input.split(',');
      return arr;
    };
  });

(function() {
    'use strict';

    angular
        .module('app.catalog')
        .controller('CatalogAddUpdateController', CatalogAddUpdateController);


    CatalogAddUpdateController.$inject = ['$http', '$resource', 'BecomeASeller', 'v2ProductsMyDetails', 'v2BulkUpdateProductSeller', 'v2CategoryEavAttribute', 'v2brandwisediscount', 'Promotions',  'Brand' ,'Catalog', 'v2Products', 'v2ProductsPhotos', 'CatalogUploadOptions', 'Product', 'v2Category', 'Company', 'BuyerList', 'SalesOrders', 'toaster', 'ngDialog', '$scope', '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', 'Upload', '$filter', '$cookies', '$localStorage', 'SweetAlert', 'sharedProperties'];
    function CatalogAddUpdateController($http, $resource, BecomeASeller, v2ProductsMyDetails, v2BulkUpdateProductSeller, v2CategoryEavAttribute, v2brandwisediscount, Promotions, Brand, Catalog, v2Products, v2ProductsPhotos, CatalogUploadOptions, Product, v2Category, Company, BuyerList, SalesOrders, toaster, ngDialog, $scope, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, Upload, $filter, $cookies, $localStorage, SweetAlert, sharedProperties)
    {
        CheckAuthenticated.check();        
   
        var vm = this;

        $scope.catalog.dont_allow_crop = false;
        $scope.catalog.sell_full_catalog = true;
        $scope.catalog.cropallow = !$scope.catalog.dont_allow_crop;
        
        if($scope.catalog.catalog_type == "catalog"){
          $scope.catalog.noOfDesigns = 3;
          $scope.catalog.minnoOfDesigns = 3;
        }
        else {
          $scope.catalog.noOfDesigns = 1;
          $scope.catalog.minnoOfDesigns = 1;
        }

        vm.single_piece_price_percentage = 0;
        vm.single_piece_price_fix = 0;
        vm.is_percentage = true;
        vm.max_margin_percentage = 10;
        vm.max_margin_rs = 60;
        $scope.catalog.number_pcs_design_per_set = 1;

        $scope.show_size_flag = false;
        $scope.show_stitching_flag = false;
        $scope.show_numberpcs_flag = false;
        $scope.attribute_list = [];
        $scope.current_companies = [];

        $scope.single_pc_discount = 0;
        $scope.full_catalog_discount = 0;
        $scope.discountNotSet = false;

        $scope.product = {};

        $scope.catalog.price_type = 'single';
        $scope.product_price_type = 'single';

        $scope.product.dont_allow_crop = false;
        $scope.without_sku = false;
        $scope.singleprice = false;
        $scope.show_size_forFullcatalog = true;

        $scope.show_progress_text = false;
        vm.enable_duration = 30;

        
        //UpdateCheckBoxUI();
        UpdateCheckBoxUICustom();

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

        vm.CloseDialog = function () {
            ngDialog.close();
        };
        $scope.catalogTypeChanged = function (catalog_type) {
          if(catalog_type == "catalog"){
            $scope.catalog.noOfDesigns = 3;
            $scope.catalog.minnoOfDesigns = 3;
          }
          else {
            $scope.catalog.noOfDesigns = 1;
            $scope.catalog.minnoOfDesigns = 1;
          }
        }
        $scope.slectCompany = function (company) {
            console.log(company);
            $scope.company_id = company;
            $scope.selling_company = company;
            v2ProductsMyDetails.get({"id": $scope.bundle_product_id, 'selling_company': $scope.company_id },function(result) {
              $scope.catalog.is_owner = result.is_owner;
              $scope.catalog_seller_id = result.catalog_seller_id;
              $scope.ToggleSell_full_catalog();
            })
            BecomeASeller.query({'cid': $scope.company_id, 'catalog': $scope.catalogId, 'selling_company': $scope.company_id },function(success){
              if(success.length > 0){
                $scope.catalog.sell_full_catalog = success[0].sell_full_catalog;
                
                if(parseFloat(success[0].single_piece_price_percentage)){
                  
                  vm.single_piece_price_percentage = parseFloat(success[0].single_piece_price_percentage);
                  vm.is_percentage = true;
                }
                else {
                  console.log("fixxxxxxxxxx: "+parseFloat(success[0].single_piece_price_fix));
                  vm.single_piece_price_fix = parseFloat(success[0].single_piece_price_fix);
                  vm.is_percentage = false;
                }
              }
            });
            $scope.getBrandDiscount($scope.catalog.brand);
           
        };

        $scope.cataloguploadoptions_isadded = true;
        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
        $scope.is_staff   = localStorage.getItem('is_staff');

        if ($scope.is_staff)
        {
            $scope.current_companies = JSON.parse(localStorage.getItem('current_companies'));
            console.log($scope.current_companies);
            if($scope.current_companies)
            {
              if ($scope.current_companies.length == 1)
              {
                  $scope.company_id = $scope.current_companies[0].id;
                  $scope.catalog.current_company_id = $scope.current_companies[0].id;
              }
            }
            console.log($scope.company_id);
        }
        function blobImageRenameForExtenstion(final_image, assing_to, newname)
        {
            //console.log(final_image);
            //console.log(assing_to);
            console.log(newname);
            var cropblob = Upload.dataUrltoBlob(final_image, assing_to);
            var fileFromBlob = new File([cropblob], newname, { type: "image/jpeg", lastModified: Date.now() });
            console.log(fileFromBlob);

            return fileFromBlob
        }
        
        $scope.orderByFunction = function(product)
        {
            if (isNaN(product.sku_order) == true)
            {
                return product.sku_order;
            }
            else{
                return parseInt(product.sku_order);
            }
        };
        
        $scope.uploadProductPhotos = function (files,pindex) {
      //    console.log($scope.products);
      //    console.log(currentproduct);
        //  var pindex = $scope.products.indexOf(currentproduct);
          console.log("pindex: "+ pindex);
        //  console.log(files);
          $scope.products_photos = [];
          var files_length = files.length;
          $scope.products[pindex].max_limit_error = false;
          console.log("files_length = "+files_length)
          if(files_length > 3){
            $scope.products[pindex].max_limit_error = true; 
            $scope.productimages = [];
            return;
          }
          
          var order_no = 1;
          ////$scope.files = files;
          
          var first_upload = false;
        
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

                  product.sort_order = order_no;

                  $scope.products_photos.push(product);
                  $scope.$apply();

                  order_no = order_no + 1;
                  console.log($scope.products_photos.length +' == '+files_length)
                   if ($scope.products_photos.length == files_length) {
                      order_no = $scope.order_no_live;
                      //var pindex = $scope.products.indexOf(currentproduct);
                      //console.log("pindex: "+ pindex);
                      $scope.products[pindex].products_photos = $scope.products_photos;
                      setTimeout(function () {
                        $scope.$apply(function(){
                            $scope.displayErrorMsg = false;
                        });
                      }, 1000);  
                      console.log($scope.products_photos);
                  } 
              }
          });
        }
        
        $scope.DeleteProductImage = function (pindex, index) {
          console.log(pindex + " "+index)
          $scope.products[pindex].products_photos.splice(index,1);
          $scope.products[pindex].max_limit_error = false;
        }
        
        $scope.products = [];
        var order_no = 1;
        $scope.order_no_live = 1;
      
        $scope.uploadFiles = function (files)
        {
            ////$scope.files = files;
            var files_length = files.length;
         
            var first_upload = false;
            if($scope.products.length == 0){
            order_no = $scope.order_no_live;
            first_upload = true;
            }
            
            angular.forEach(files, function(file, key)
            {
               
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
                    product.uploaded = false;
                    if ($scope.catalog.price_type == 'single')
                    {
                        product.price = $scope.catalog.same_price;
                    }
                    
                    
                    //product.public_price = $scope.catalog.public_price;
                    product.public_price = $scope.catalog.price;
                   
                    product.catalog = $scope.catalogId;
                    product.sort_order = order_no;
                    product.available_sizes = [];
                    
                    //$scope.productsArr.push(product);
                    $scope.products.push(product);
                    $scope.$apply();
                    
                    order_no = order_no + 1;
                    
                    
                    if($scope.products.length == files_length && first_upload == true)
                    {
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

                        if ($scope.update_flag && $scope.catalog.price) {
                            $scope.setNewPriceAndLimit($scope.catalog.price);
                        }

                        
                        $scope.applyMarginToallpcs();  // to 
                    }
                    $scope.ToggleSell_full_catalog();
                }
                //  console.log($scope.products);
            
            });
            //$scope.products = $scope.productsArr
            vm.products_count = files_length;
            
         
        };
          
        $scope.uploadCatalogImage = function (file)
        {
              var fr = new FileReader();
              fr.readAsDataURL(file);
              var blob;
              fr.onload = function () {
                  var image = new Image();
                  image.src = fr.result;
                
                  var blob = dataURItoBlob(image.src);
                  console.log(blob);
                  
                  $scope.catalog.uncropped = image.src;//target_img; //
                  $scope.catalog.thumbnail = blob; //fileFromBlob; //
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
                $scope.catalog.cropallow = false;
            }else{
                $scope.catalog.cropallow = true;
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
          console.log($scope.products.indexOf(product));
            $scope.products.splice($scope.products.indexOf(product), 1);
        }



        $scope.workFilter = function (item) { 
            return item.attribute_slug === 'work'; 
        };
        $scope.fabricFilter = function (item) {
        return item.attribute_slug === 'fabric';
        };
        $scope.sizeFilter = function (item) {
        return item.attribute_slug === 'size';
        };
        $scope.multiExceptWorkFabricSizeFilter = function (item)
        {
            return item.attribute_datatype === 'multi' && item.attribute_slug != 'work' && item.attribute_slug != 'fabric' && item.attribute_slug != 'size'; 
        };
        $scope.enumStyleFilter = function (item) { 
            return item.attribute_datatype === 'enum' && item.attribute_slug == 'style'; 
        };
        $scope.enumExceptStyleFilter = function (item) { 
            return item.attribute_datatype === 'enum' && item.attribute_slug != 'style'; 
        };

        $scope.floatFilter = function (item) {
            return item.attribute_datatype === 'float';
        };

        $scope.intFilter = function (item) {
        return item.attribute_datatype === 'int';
        };

        $scope.getBrandDiscount = function (selectedbrand)
        {
            $scope.discountRuleList =[];
            $scope.single_pc_discount = 0; //default values
            $scope.full_catalog_discount = 0;
            console.log(selectedbrand);
            var marginedprice1, marginedprice2;

            v2brandwisediscount.query({ 'cid': $scope.company_id, 'selling_company': $scope.company_id},
            function (success)
            {
                $scope.discountRuleList = success;

                if (success.length > 0)
                {
                    for (var index = 0; index < $scope.discountRuleList.length; index++)
                    {
                        //console.log($scope.discountRuleList[index].brands);

                        if ($scope.discountRuleList[index].brands.indexOf(selectedbrand) >=0)
                        {
                            $scope.single_pc_discount = parseFloat($scope.discountRuleList[index].single_pcs_discount);
                            $scope.full_catalog_discount = parseFloat($scope.discountRuleList[index].cash_discount);

                            console.log($scope.single_pc_discount + ' , ' + $scope.full_catalog_discount);
                            
                        }
                        else if ($scope.discountRuleList[index].all_brands ==  true){
                            $scope.single_pc_discount = parseFloat($scope.discountRuleList[index].single_pcs_discount);
                            $scope.full_catalog_discount = parseFloat($scope.discountRuleList[index].cash_discount);

                            console.log($scope.single_pc_discount + ' , ' + $scope.full_catalog_discount);
                        }
                    }
                }
                if($scope.single_pc_discount == 0 && $scope.full_catalog_discount == 0) {
                    $scope.discountNotSet = true;
                }
                else
                {
                    $scope.discountNotSet = false;
                }
                
                if (vm.catalog_products) {
                    console.log("catalogproductsssssss - "+JSON.stringify(vm.catalog_products));
                    for (var j = 0; j < vm.catalog_products.length; j++) {

                        if (vm.is_percentage == true && (vm.single_piece_price_percentage || vm.single_piece_price_percentage === 0)) {
                            vm.catalog_products[j].fullCatalog_billingprice = vm.catalog_products[j].mwp_price - Math.ceil((vm.catalog_products[j].mwp_price * $scope.full_catalog_discount) / 100);

                            marginedprice1 = vm.catalog_products[j].mwp_price + (vm.catalog_products[j].mwp_price * vm.single_piece_price_percentage) / 100
                            vm.catalog_products[j].singlePc_billingprice = marginedprice1 - Math.ceil((marginedprice1 * $scope.single_pc_discount) / 100);

                        }
                        else if (vm.is_percentage == false && (vm.single_piece_price_fix || vm.single_piece_price_fix === 0)) {
                            vm.catalog_products[j].fullCatalog_billingprice = vm.catalog_products[j].mwp_price - (vm.catalog_products[j].mwp_price * $scope.full_catalog_discount) / 100;

                            marginedprice2 = vm.catalog_products[j].mwp_price + vm.single_piece_price_fix;
                            vm.catalog_products[j].singlePc_billingprice = marginedprice2 - Math.ceil((marginedprice2 * $scope.single_pc_discount) / 100);
                        }

                        console.log(vm.catalog_products[j].mwp_price + ' + ' + marginedprice1 + ' or ' + marginedprice2 + ' - ' + Math.ceil((marginedprice1 * $scope.single_pc_discount) / 100) + " or " + Math.ceil((marginedprice2 * $scope.single_pc_discount) / 100));
                        //console.log(vm.single_piece_price_percentage + ' ' + vm.single_piece_price_fix);

                        //console.log(vm.catalog_products[j].fullCatalog_billingprice);
                        //console.log(vm.catalog_products[j].singlePc_billingprice);

                        //console.log(vm.catalog_products[j]);
                    }
                }

                
            });
        };

        $scope.CategoryChanged  = function(catid)
        {
            console.log(catid);
            console.log($scope.catalog.catalog_type);
            
            if($scope.catalog.catalog_type == 'setmatching')
            {
                console.log($scope.new_categories_with_set_type);
                
                var catindex = $scope.new_categories_with_set_type.map(function (obj)
                { return obj.id; }).indexOf(catid);

                console.log(catindex);
                var category_name_with_set_type = $scope.new_categories_with_set_type[catindex].category_name;
                
                if(category_name_with_set_type.indexOf("size set") > -1 ){
                  $scope.catalog.multi_set_type = "size_set";
                }
                else{
                  $scope.catalog.multi_set_type = "color_set"; 
                }
                console.log($scope.catalog.multi_set_type);
            }

            v2CategoryEavAttribute.query({"category": catid},
            function(data)
            {
               
                $scope.attribute_list = data;
                $scope.attribute_values = [];
                
                if($scope.update_flag == true)
                {
                    console.log($scope.catalog_eav_data);
                    for (var i = 0; i < $scope.attribute_list.length; i++)
                    {
                        if($scope.catalog_eav_data[$scope.attribute_list[i].attribute_name])
                        {
                            if($scope.attribute_list[i].attribute_type)
                            {
                                if($scope.attribute_list[i].attribute_datatype == 'float')
                                {
                                    $scope.catalog[$scope.attribute_list[i].attribute_slug] = parseFloat($scope.catalog_eav_data[$scope.attribute_list[i].attribute_name].replace($scope.attribute_list[i].attribute_type,"").trim());  
                                }
                                else if($scope.attribute_list[i].attribute_datatype == 'int')
                                {
                                    $scope.catalog[$scope.attribute_list[i].attribute_slug] = parseInt($scope.catalog_eav_data[$scope.attribute_list[i].attribute_name].replace($scope.attribute_list[i].attribute_type,"").trim());
                                }
                                else
                                {
                                    $scope.catalog[$scope.attribute_list[i].attribute_slug] = $scope.catalog_eav_data[$scope.attribute_list[i].attribute_name].replace($scope.attribute_list[i].attribute_type,"").trim();
                                }
                            }
                            else
                            {
                                $scope.catalog[$scope.attribute_list[i].attribute_slug] = $scope.catalog_eav_data[$scope.attribute_list[i].attribute_name];
                            }
                        }
                    };
                    console.log($scope.catalog); 

                    $("#modelform5").removeClass(progressLoader());
                }


                for (var i = 0; i < $scope.attribute_list.length; i++)
                {
                    //console.log($scope.attribute_list[i]);
                    
                    if ($scope.attribute_list[i].attribute_slug === 'size')
                    {
                        $scope.attribute_values = $scope.attribute_list[i].attribute_values;
                        console.log($scope.attribute_values);
                        console.log($scope.attribute_list[i]);

                        $scope.ToggleSell_full_catalog();
                    }
                };

            });
        }


        $scope.TopCategoryChanged = function (pid) {
            $scope.categories = v2Category.query({ parent: pid });
            v2Category.query({ parent: pid }, function (success) {

                console.log($scope.categories);
                $scope.new_categories_with_set_type = success;

                console.log($scope.new_categories_with_set_type);
                console.log($scope.new_categories_with_set_type.length);
                for (var i = 0; i < $scope.new_categories_with_set_type.length; i++) {
                    var set_type = " (color set)";

                    for (var j = 0; j < $scope.all_category_eav_data.length; j++) {
                        if ($scope.all_category_eav_data[j].attribute_slug == "size" && $scope.all_category_eav_data[j].category == $scope.new_categories_with_set_type[i].id) {
                            set_type = " (size set)";
                        }
                    }
                    $scope.new_categories_with_set_type[i].category_name = $scope.new_categories_with_set_type[i].category_name + set_type;
                    //console.log($scope.new_categories_with_set_type[i]);
                }
                console.log($scope.categories);
                if ($scope.atype == 'updatequality') {
                    $scope.CategoryChanged($scope.quality.category);
                }
            });

        }

        $scope.ToggleSell_full_catalog = function () {
            $scope.sell_full_catalog = $scope.catalog.sell_full_catalog;
            console.log($scope.sell_full_catalog);
            $scope.all_sizes = [];
            $scope.catalog.all_sizes = [];
            console.log("attributevaluesssssssssss");
            console.log($scope.attribute_values);
            if ($scope.attribute_values && $scope.attribute_values.length > 0) {
                $scope.catalog_with_size = true;

                if ($scope.sell_full_catalog == true) {
                    for (var i = 0; i < $scope.attribute_values.length; i++) {
                        var temp = {};
                        temp.value = $scope.attribute_values[i].value;
                        temp.selected = false;
                        $scope.all_sizes.push(temp);
                    }
                    $scope.catalog.all_sizes = $scope.all_sizes;
                }
                else {
                    $scope.sell_full_catalog = false;
                    for (var j = 0; j < $scope.products.length; j++) {

                        $scope.all_sizes = [];
                        for (var i = 0; i < $scope.attribute_values.length; i++) {

                            var temp = {};
                            temp.value = $scope.attribute_values[i].value;
                            temp.selected = false;
                            $scope.all_sizes.push(temp);

                        }
                        $scope.products[j].all_sizes = $scope.all_sizes;
                        //$scope.products[j].selectAll = false;
                        console.log($scope.products[j]);
                    }
                }

                //for Update to show size inventory of previous designs -Dhiren

                if (vm.catalog_products && vm.catalog_products.length > 1)
                {
                    $scope.mysizes = [];

                    Catalog.get({ "id": $scope.catalog_id, "cid": $scope.company_id },function (result)
                    {
                        $scope.catalogdata = result;
                        var bundle_product_id = result.product_id;
                        console.log(result);
                        

                        if ($scope.is_staff == "true") {
                            $scope.selling_company = $scope.catalog.current_company_id;
                            $scope.params = { 'id': bundle_product_id, 'selling_company': $scope.catalog.current_company_id };
                        }
                        else {
                            $scope.params = { 'id': bundle_product_id };
                        }
                    
                
                    v2ProductsMyDetails.get($scope.params, function (data)
                    {
                        $scope.inventory_data = data;
                        
                        console.log("sell_full: " + $scope.inventory_data.i_am_selling_sell_full_catalog);
                        $scope.full_set_only = $scope.inventory_data.i_am_selling_sell_full_catalog;
                        
                        if ($scope.full_set_only == true)
                        {
                            if ($scope.inventory_data.available_sizes) {
                                $scope.mysizes = $scope.inventory_data.available_sizes.split(',');
                            }

                            $scope.all_sizes = [];

                            for (var i = 0; i < $scope.attribute_values.length; i++) {
                                if ($scope.mysizes.indexOf($scope.attribute_values[i].value) < 0) {
                                    var temp = {};
                                    temp.value = $scope.attribute_values[i].value;
                                    temp.selected = false;
                                    $scope.all_sizes.push(temp);
                                }
                                else {
                                    var temp = {};
                                    temp.value = $scope.attribute_values[i].value;
                                    temp.selected = true;
                                    $scope.all_sizes.push(temp);
                                }
                            }

                            for (var j = 0; j < vm.catalog_products.length; j++) //all designs to have same size
                            {
                                vm.catalog_products[j].all_sizes = $scope.all_sizes;
                                console.log($scope.products[j]);
                            }

                            
                        }
                        else
                        {
                            $scope.full_set_only = false;

                            for (var j = 0; j <  vm.catalog_products.length; j++)
                            {
                                for (var k = 0; k < $scope.inventory_data.products.length; k++)
                                {
                                    if ( vm.catalog_products[j].id == $scope.inventory_data.products[k].id) {
                                        
                                        if ($scope.inventory_data.products[k].available_sizes) {
                                            $scope.mysizes = $scope.inventory_data.products[k].available_sizes.split(',');
                                        }
                                        else {
                                            $scope.mysizes = [];
                                        }
                                        break;
                                    }
                                }
                                $scope.all_sizes = [];
                
                                for (var i = 0; i < $scope.attribute_values.length; i++) {
                                    //console.log($scope.mysizes.indexOf($scope.attribute_values[i].value));

                                    if ($scope.mysizes.indexOf($scope.attribute_values[i].value) < 0) {
                                        var temp = {};
                                        temp.value = $scope.attribute_values[i].value;
                                        temp.selected = false;
                                        $scope.all_sizes.push(temp);
                                    }
                                    else {
                                        var temp = {};
                                        temp.value = $scope.attribute_values[i].value;
                                        temp.selected = true;
                                        $scope.all_sizes.push(temp);
                                    }
                                }
                                
                                vm.catalog_products[j].all_sizes = $scope.all_sizes;
                                console.log(vm.catalog_products[j]);
                            }
                        }
                                
                    });
                    });
                }
                  
            }

        }

        

       
        $scope.AddCatalog = function()
        {
            if($scope.catalog.thumbnail == '' || $scope.catalog.thumbnail == null){
                
                vm.errortoaster = {
                    type:  'error',
                    title: 'Image',
                    text:  'Please upload catalog image.'
                };   
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                return;
            }

            if($scope.catalog.catalog_type == 'catalog'){
                if($scope.catalog.brand == '' || $scope.catalog.brand == null || $scope.catalog.brand == undefined){
                    vm.errortoaster = {
                        type:  'error',
                        title: 'Brand',
                        text:  'Please select brand.'
                    };   
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                    return;
                }
            }


            vm.catalogoption_params = {};

            $scope.catalog.eav = {};
            for(var i = 0; i < $scope.attribute_list.length; i++)
            {
                console.log($scope.attribute_list[i].attribute_slug);
                console.log($scope.catalog[$scope.attribute_list[i].attribute_slug]); //required or not is decided dynamically
                
                if ($scope.attribute_list[i].attribute_slug == 'size')
                {
                    continue;
                }
                else if (($scope.attribute_list[i].attribute_datatype == 'float' || $scope.attribute_list[i].attribute_datatype == 'int') && $scope.catalog[$scope.attribute_list[i].attribute_slug]  && $scope.catalog[$scope.attribute_list[i].attribute_slug] > 0)
                {
                    $scope.catalog.eav[$scope.attribute_list[i].attribute_slug] = $scope.catalog[$scope.attribute_list[i].attribute_slug];
                }
                else if($scope.catalog[$scope.attribute_list[i].attribute_slug] && $scope.catalog[$scope.attribute_list[i].attribute_slug].length > 0)
                {
                    //console.log($scope.attribute_list[i].attribute_slug);
                    //console.log(!$scope.catalog.sell_full_catalog);
                   
                    $scope.catalog.eav[$scope.attribute_list[i].attribute_slug] = $scope.catalog[$scope.attribute_list[i].attribute_slug];
                }
                else
                {
                    if ($scope.attribute_list[i].is_required == true || $scope.attribute_list[i].is_required == 'true')
                    {
                        vm.errortoaster = {
                            type: 'error',
                            title: $scope.attribute_list[i].attribute_slug,
                            text: 'Please select ' + $scope.attribute_list[i].attribute_slug
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                        return;
                    }
                   
                }
                console.log($scope.catalog.eav);
            }

            if($scope.catalog.other)
                $scope.catalog.eav["other"] = $scope.catalog.other;


            console.log($scope.catalog.eav);
            $scope.catalog.eav = JSON.stringify($scope.catalog.eav);
            console.log($scope.catalog.eav);
            var today = new Date(); 
            var expiry_date = today.setDate(today.getDate() + $scope.catalog.enable_duration);
            // console.log(today);
            expiry_date = formatDate(expiry_date) + "T23:59:59Z"
            console.log(expiry_date);
           
            var dispatchdate = formatDate($scope.catalog.dispatch_date);
            $(".modelform").addClass(progressLoader()); 
            
            //vm.params =  {"cid":$scope.company_id, "id": $scope.catalogId, "title":$scope.catalog.title,"brand":$scope.catalog.brand,"category": $scope.category, "sell_full_catalog":  $scope.catalog.sell_full_catalog};
            vm.params = {"cid":$scope.company_id, "title":$scope.catalog.title,"brand":$scope.catalog.brand, "category": $scope.catalog.category, "view_permission": $scope.catalog.view_permission, "catalog_type": $scope.catalog.catalog_type, "eav": $scope.catalog.eav, "expiry_date": expiry_date};

            if($scope.catalog.dispatch_date){
                vm.params['dispatch_date'] = dispatchdate;
            }
            if(!$scope.catalog.cropallow)
            {
                vm.params["thumbnail"] = blobImageRenameForExtenstion($scope.catalog.uncropped, $scope.catalog.thumbnail, $scope.catalog.title+".jpg");
                console.log('uncropped file',  vm.params["thumbnail"]);
            }
            else
            {
                vm.params["thumbnail"] = blobImageRenameForExtenstion(vm.croppedDataUrl, $scope.catalog.thumbnail, $scope.catalog.title+".jpg");
                console.log('crop file',  vm.params["thumbnail"]);
            }

            if($scope.catalog.catalog_type == 'noncatalog' && $scope.catalog.brand == undefined){
                delete vm.params["brand"];
            }
            console.log(JSON.stringify(vm.params));
            Catalog.save(vm.params,function(success)
            {
                $(".modelform").removeClass(progressLoader());
                
                $scope.CatNonCtalogUploaded = true;
                $scope.catalogId = success.id; 
                $scope.bundle_product_id = success.product_id;
                $scope.catalogData = success;                  
                $scope.order_no_live = 1;
                vm.catalogoption_params['catalog'] = $scope.catalogId;
                
                CatalogUploadOptions.save(vm.catalogoption_params,
                function(result)
                {
                    console.log('onsave: '+result.id);
                    $scope.cataloguploadoptions_id = result.id;
                    console.log('catalog options saved');
                });

                if ($scope.catalog.catalog_type == 'noncatalog')
                {
                    vm.successtoaster = {
                        type: 'success',
                        title: 'Success',
                        text: 'Noncatalog uploaded successfully.'
                    };
                }
                else {
                    vm.successtoaster = {
                        type: 'success',
                        title: 'Success',
                        text: 'Catalog uploaded successfully.'
                    };
                }
                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                //$scope.reloadData();

                setTimeout(function(){ 
                    $('.nexttoproduct').trigger('click');
                    $scope.update_flag = true;
                }, 1000);   //wizard.go(3);
                   
            });  
           
        };

        $scope.AddProducts = function () {
            console.log(vm.addDesigns);
            //if ($scope.products.length > 0 && (vm.addDesigns.$valid || $scope.without_sku == true)) {
            if ($scope.products.length > 0 && vm.addDesigns.$valid ) {
                $scope.show_progress_text = true;
                $scope.size_mandatory = false;

                if ($scope.catalogId == undefined) {
                    vm.errortoaster = {
                        type: 'error',
                        title: 'Failed',
                        text: "Please Upload Product first"
                    };
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    return;
                }

                if ($scope.products.length != $scope.catalog.noOfDesigns && $scope.catalog.catalog_type == 'catalog') {
                    vm.errortoaster = {
                        type: 'error',
                        title: 'Failed',
                        text: "Please select " + $scope.catalog.noOfDesigns + " designs"
                    };
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    return;
                }

                for (var i = 0; i < $scope.attribute_list.length; i++) {
                    console.log($scope.attribute_list[i].attribute_slug);
                    console.log($scope.catalog[$scope.attribute_list[i].attribute_slug]);
                    if ($scope.attribute_list[i].attribute_slug == 'size' && ($scope.attribute_list[i].is_required == true || $scope.attribute_list[i].is_required == 'true')) {
                        $scope.size_mandatory = true;
                    }
                }

                if (!$scope.catalog.sell_full_catalog && $scope.size_mandatory)
                {

                    for (var i = 0; i < $scope.products.length; i++)
                    {
                        var sizes = [];
                        for (let j = 0; j < $scope.products[i].all_sizes.length; j++)
                        {
                            if ($scope.products[i].all_sizes[j].selected == true) {
                                sizes.push($scope.products[i].all_sizes[j].value);
                            }
                        }
                        console.log(sizes);
                        

                        if (sizes.length < 1) {
                            vm.errortoaster = {
                                type: 'error',
                                title: 'Failed',
                                text: "Please select one or more sizes for each design"
                            };
                            toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                            return;
                        }
                    }

                }
                else {
                    if ($scope.size_mandatory && $scope.show_size_forFullcatalog)
                    {
                        var sizes = [];
                        for (var i = 0; i < $scope.catalog.all_sizes.length; i++)
                        {
                            if ($scope.catalog.all_sizes[i].selected == true) {
                                sizes.push($scope.all_sizes[i].value);
                            }
                        }
                        if (sizes.length < 1) {
                            toaster.pop('error', 'No size selected', 'Please select one or more sizes');
                            return;
                        }

                        for (var i = 0; i < $scope.products.length; i++) {
                            $scope.products[i]["available_sizes"] = sizes ;
                            console.log($scope.products[i]["available_sizes"]);
                        }
                        

                    }
                }


              
                vm.params2 = { "cid": $scope.company_id, "sell_full_catalog": $scope.catalog.sell_full_catalog };
                vm.params2['id'] = $scope.catalogId;

                console.log(vm.params2);
                Catalog.patch(vm.params2,function (success)
                {
                    console.log(success);
                    console.log('catalog options updated');
                });
                vm.cs_params = { "cid": $scope.company_id};
                
                if ($scope.catalog.sell_full_catalog == false && vm.is_percentage == false && vm.single_piece_price_fix != undefined && vm.single_piece_price_fix != null) {
                    vm.cs_params['single_piece_price_fix'] = vm.single_piece_price_fix;
                    vm.cs_params['single_piece_price_percentage'] = 0;
                }
                if ($scope.catalog.sell_full_catalog == false && vm.is_percentage == true && vm.single_piece_price_percentage != undefined && vm.single_piece_price_percentage != null) {
                    vm.cs_params['single_piece_price_percentage'] = vm.single_piece_price_percentage;
                    vm.cs_params['single_piece_price_fix'] = 0;
                }
                
                v2ProductsMyDetails.get({"id": $scope.bundle_product_id},function(success) {
                  vm.cs_params['id'] = success.catalog_seller_id;
                  BecomeASeller.patch(vm.cs_params,function(result) {
                    
                  });
                });
              
                $(".modelform2").addClass(progressLoader());

                vm.count = 0;
                vm.success_count = 0;
                vm.catalogoption_params = {};
                console.log($scope.catalog.price_type + ' ' + $scope.product_price_type);
                
                if ($scope.product_price_type == 'single' || $scope.catalog.price_type == 'single') {
                    vm.catalogoption_params['private_single_price'] = $scope.catalog.price;
                    vm.catalogoption_params['public_single_price'] = $scope.catalog.price;
                    
                }
                else {
                    vm.catalogoption_params['private_single_price'] = null;
                    vm.catalogoption_params['public_single_price'] = null;
                }
                vm.catalogoption_params['without_sku'] = $scope.without_sku;

                vm.catalogoption_params['catalog'] = $scope.catalogId;
                if ($scope.cataloguploadoptions_isadded == true) {
                    vm.catalogoption_params['id'] = $scope.cataloguploadoptions_id;
                }

                var temp_i = $scope.products.length - 1;
                $scope.product_ids = [];
                for (var i = 0; i < $scope.products.length; i++)
                {
                    vm.params = { "title": $scope.products[i].sku, "catalog": [$scope.catalogId], "sort_order": $scope.products[i].sort_order };//"sku":$scope.products[i].sku, 
                    if (!$scope.products[i].cropallow) {
                        //vm.params["image"] = Upload.dataUrltoBlob($scope.products[i].uncropped, $scope.products[i].image);
                        vm.params["image"] = blobImageRenameForExtenstion($scope.products[i].uncropped, $scope.products[i].image, $scope.products[i].sort_order + ".jpg");
                    }
                    else {
                        //vm.params["image"] = Upload.dataUrltoBlob($scope.products[i].imageCroped, $scope.products[i].image);
                        vm.params["image"] = blobImageRenameForExtenstion($scope.products[i].imageCroped, $scope.products[i].image, $scope.products[i].sort_order + ".jpg");
                    }

                    if ($scope.without_sku == false) {
                        vm.params["sku"] = $scope.products[i].sku;
                    }


                    if ($scope.size_mandatory && !$scope.catalog.sell_full_catalog)
                    {
                        var sizes = [];
                        for (let j = 0; j < $scope.products[i].all_sizes.length; j++) {
                            if ($scope.products[i].all_sizes[j].selected == true) {
                                sizes.push($scope.products[i].all_sizes[j].value);
                                console.log(sizes);
                                
                            }
                        }
                        vm.params["available_sizes"] = sizes //$scope.products[i].available_sizes;
                    }
                    else if ($scope.size_mandatory && $scope.catalog.sell_full_catalog && $scope.show_size_forFullcatalog)
                    {
                        vm.params["available_sizes"] = $scope.products[i].available_sizes ;
                    }

                    if (typeof $scope.products[i].price != "undefined") {
                        vm.params["price"] = $scope.products[i].price;
                        vm.params["public_price"] = $scope.products[i].price;
                    }


                    $scope.totalproducts = $scope.products.length;
                    $scope.completedproducts = 0;
                    if($scope.products[i].uploaded == false){
                      $scope.UploadProductAndProductPhotos(vm.params,i);
                    }

                }

            }
            else {
                //vm.addDesigns.sku.$dirty = true;
                if (vm.addDesigns.sku.$dirty) {
                    vm.errortoaster = {
                        type: 'error',
                        title: 'Failed',
                        text: 'SKU is required & has character limit of 30.'
                    };
                    console.log(vm.errortoaster);
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                }
                else if ($scope.products.length == 0) {
                    vm.errortoaster = {
                        type: 'error',
                        title: 'Failed',
                        text: 'Select one or more products'
                    };
                    console.log(vm.errortoaster);
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                }
                else {
                    vm.errortoaster = {
                        type: 'error',
                        title: 'Failed',
                        text: 'Fill all required fields.'
                    };
                    console.log(vm.errortoaster);
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                }
            }
        }
        
        $scope.UploadProductAndProductPhotos = function (params,i) {
            v2Products.save(params, function (success) {
                //$scope.products.splice(i, 1);
                //alert(success.sort_order);
                $scope.product_id = success.id;
                
              //  console.log(JSON.stringify($scope.products));
                var total_photos_uploaded_successfully = 0;
                if($scope.products[i].products_photos && $scope.products[i].products_photos.length > 0)
                {   
                    $scope.products[i].uploaded = true;
                    for (var m = 0; m < $scope.products[i].products_photos.length; m++) {
                        var temp_product = {};
                        temp_product.product = $scope.product_id;
                        temp_product.sort_order = $scope.products[i].products_photos[m].sort_order;
                        temp_product.image = blobImageRenameForExtenstion($scope.products[i].products_photos[m].uncropped, $scope.products[i].products_photos[m].image, temp_product.sort_order + ".jpg");
                        v2ProductsPhotos.save(temp_product,
                            function (success_productphoto) {
                                total_photos_uploaded_successfully += 1;
                                console.log("total_photos_uploaded_successfully " + total_photos_uploaded_successfully + " total_photos = " + $scope.products[i].products_photos.length);
                                if(total_photos_uploaded_successfully == $scope.products[i].products_photos.length)
                                {
                                  $scope.completedproducts++;
                                  console.log($scope.completedproducts+",tp: "+$scope.products.length);
                                  
                                  if ($scope.completedproducts == $scope.products.length) {
                                      $(".modelform2").removeClass(progressLoader());
                                      vm.successtoaster = {
                                          type: 'success',
                                          title: 'Success',
                                          text: 'Products are uploaded successfully.'
                                      };
                                      ngDialog.close();
                                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                      $scope.reloadData();
                                      $('.contextAction').css('display','none');
                                      $('.singlecontextAction').css('display','none');
                                      $('.nocontextAction').css('display','block');
                                  }
                                }
                            });
                    }
                    setTimeout(function () {
                      $scope.$apply(function(){
                          $scope.displayErrorMsg = false;
                      });
                    }, 2000);  
                }
                else 
                {
                  $scope.completedproducts++;
                  console.log($scope.completedproducts+",tp: "+$scope.products.length);
                  $scope.products[i].uploaded = true;
                  if ($scope.completedproducts == $scope.products.length) {
                      $(".modelform2").removeClass(progressLoader());
                      vm.successtoaster = {
                          type: 'success',
                          title: 'Success',
                          text: 'Products are uploaded successfully.'
                      };
                      ngDialog.close();
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                      $scope.reloadData();
                      $('.contextAction').css('display','none');
                      $('.singlecontextAction').css('display','none');
                      $('.nocontextAction').css('display','block');
                  }
                }
                // for (var j = $scope.products.length - 1; j >= 0; j--) {
                // 
                //     if ($scope.products[j].sort_order == success.sort_order) {
                //         //alert(success.sku);
                //       //  $scope.products.splice(j, 1);
                //         $scope.completedproducts++;
                //         console.log("complted products:: "+$scope.completedproducts);
                //     }
                // }
                

                // if ($scope.products.length == 0) {
                // 
                //     $scope.completedproducts = 0;
                //     $scope.show_progress_text = false;
                //     if ($scope.cataloguploadoptions_isadded == true) {
                //         CatalogUploadOptions.patch(vm.catalogoption_params,
                //             function (result) {
                //                 console.log('catalog options updated');
                //             });
                //     }
                //     else {
                //         CatalogUploadOptions.save(vm.catalogoption_params,
                //             function (result) {
                //                 console.log('catalog options added');
                //             });
                //     }
                //     vm.successtoaster = {
                //         type: 'success',
                //         title: 'Success',
                //         text: 'Products are uploaded successfully.'
                //     };
                //     ngDialog.close();
                //     toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                //     $scope.reloadData();
                // }
                  
            }, function (error) {
                if (i == 0) {
                    //$(".modelform2").removeClass(progressLoader());
                }
            });
        }
        $scope.updateProducts = function (){
            $(".modelform").addClass(progressLoader());
            console.log(vm.catalog_products);
            console.log(vm.single_piece_price_percentage);
            console.log(vm.single_piece_price_fix);
            console.log($scope.catalog_seller_id);
            vm.cs_params = {};
            vm.cs_params.id = $scope.catalog_seller_id;
            vm.cs_params.cid = $scope.company_id;
            if(vm.is_percentage){
              vm.cs_params.single_piece_price_percentage = vm.single_piece_price_percentage;
              vm.cs_params.single_piece_price_fix = 0;
            }
            else {
              vm.cs_params.single_piece_price_fix = vm.single_piece_price_fix;
              vm.cs_params.single_piece_price_percentage = 0;
            }
            console.log(vm.cs_params);
            BecomeASeller.patch(vm.cs_params,function(success) {
            
            });
          /*  var completed_products = 0;
            angular.forEach(vm.catalog_products,function(product){
                vm.product_params = {};
                vm.product_params.id = product.id;
                vm.product_params.mwp_price = product.mwp_price;
                v2Products.patch(vm.product_params,function(success){
                  completed_products++;
                  if(vm.catalog_products.length == completed_products){
                    vm.successtoaster = {
                        type: 'success',
                        title: 'Success',
                        text: 'Designs updated successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    ngDialog.close();
                    $scope.reloadData();
                  }
                });
            }); */
            
            $scope.bulk_products = [];
            if($scope.catalog_with_size ==  true) {
                for (var j = 0; j < vm.catalog_products.length; j++) {
                    var sizes = [];
                    for (var i = 0; i < vm.catalog_products[j].all_sizes.length; i++) {
                      if(vm.catalog_products[j].all_sizes[i].selected == true){
                        sizes.push(vm.catalog_products[j].all_sizes[i].value);
                      }
                    }
                    var temp = {};
                    temp.product_id = vm.catalog_products[j].id;
                    temp.mwp_price = vm.catalog_products[j].mwp_price;
                    temp.available_sizes = sizes.toString();
                    if(temp.available_sizes.length > 0){
                      temp.is_enable = true;
                    }
                    else{
                      temp.is_enable = false; 
                    }
                    $scope.bulk_products.push(temp);
                }
            }
            else {
              for (var j = 0; j < vm.catalog_products.length; j++) {
                  var temp = {};
                  temp.product_id = vm.catalog_products[j].id;
                  temp.mwp_price = vm.catalog_products[j].mwp_price;
                  temp.is_enable = true;
                  $scope.bulk_products.push(temp);
              }
            }
            
            $scope.params = { "products": $scope.bulk_products };
            if($scope.is_staff == "true"){
              $scope.params['selling_company'] =  $scope.selling_company;
            }
            console.log($scope.params);
            
            v2BulkUpdateProductSeller.save($scope.params, function(success){
                  $(".modelform").removeClass(progressLoader());
                  vm.successtoaster = {
                      type:  'success',
                      title: 'Success',
                      text:  'Catalog Products updated successfully.'
                  };
                  toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  ngDialog.close();
                  $scope.reloadData();
            });
        }
        
        $scope.UpdateCatalogForm = function ()
        {
            console.log($scope.catalog_id);
            $scope.catalogId = $scope.catalog_id;
            $scope.catalog.noOfDesigns = 1;
            $scope.catalog.minnoOfDesigns = 1;
            $scope.show_size_forFullcatalog = false;
            vm.catalog_products = [];
            console.log($scope.company_id);
            
           
                //Catalog.get({'id': $scope.catalog_id, 'cid':$scope.company_id, 'expand': true}).$promise.then(function(result)
                v2Products.get({'id': $scope.bundle_product_id, 'cid':$scope.company_id, 'expand': true, "view_type" : "mycatalogs"}).$promise.then(function(result)
                {
                   
                    $scope.catalog.title = result.title;

                    $scope.catalog.category = result.category;
                    $scope.catalog.sell_full_catalog=  result.sell_full_catalog;
                    $scope.catalog.view_permission =  result.view_permission;
                    $scope.catalog_eav_data  = result.eavdata;
                    if($scope.is_staff == "true"){
                      $scope.selling_company = result.supplier;
                    }
                    vm.products = result.products;
                    if (vm.products.length == 0) //if 3rd step details were not filled up
                    {
                        $scope.show_size_forFullcatalog = true;
                        $scope.catalog.sell_full_catalog = true;
                        if($scope.catalog.catalog_type == "catalog"){
                          $scope.catalog.noOfDesigns = 3;
                          $scope.catalog.minnoOfDesigns = 3;
                        }
                        else {
                          $scope.catalog.noOfDesigns = 1;
                          $scope.catalog.minnoOfDesigns = 1;
                        }
                        
                        $scope.ToggleSell_full_catalog();
                    }
                    console.log($scope.show_size_forFullcatalog);
                    $scope.catalog.price_type = 'single';
                    var i = 0;
                    for (i = 0; i < vm.products.length; i++) {
                        var cp = {}
                        cp['id'] = vm.products[i].id;
                        cp['sku'] = vm.products[i].sku;
                        cp['thumbimage'] = vm.products[i].image.thumbnail_small;
                        cp['price'] = vm.products[i].price;
                        cp['public_price'] = vm.products[i].price;
                        cp['mwp_price'] = vm.products[i].mwp_price;
                        if(i == 0){
                          var temp_price = vm.products[i].mwp_price;
                          $scope.catalog.same_price = temp_price;
                        }
                        if(temp_price != vm.products[i].mwp_price && $scope.catalog.price_type != 'individual'){
                            $scope.catalog.price_type = 'individual';
                        }
                        vm.catalog_products.push(cp);
                    }

                    if (result.brand != null) {
                        $scope.catalog.brand = result.brand.id;
                    }
                    // moved to on success of product my detail so can get correct margin
                    //$scope.getBrandDiscount($scope.catalog.brand);
                    
                    $scope.CategoryChanged(result.category);

                   
                    $scope.catalog.other = result.eavdata.other;
                    $scope.catalog.catalog_type = result.catalog_type;
                    

                    if(result.dispatch_date != null){
                      $scope.catalog.dispatch_date = new Date(result.dispatch_date);
                      $scope.catalog.dispatch_date = formatDate($scope.catalog.dispatch_date);
                    }
                   
                    // if (Boolean(result.single_piece_price_fix))
                    // {
                    //     vm.is_percentage = false;
                    //     vm.single_piece_price_fix = parseFloat(result.single_piece_price_fix) || 0;
                    // }
                    // else{
                    //     vm.is_percentage = true;
                    //     vm.single_piece_price_percentage = parseFloat(result.single_piece_price_percentage) || 0;
                    // }

                    if(result.price_range && result.price_range.indexOf('-') > 0){
                        var prices = result.price_range.split('-');
                        vm.current_price1 =  parseFloat(prices[0]);
                        vm.current_price2 =  parseFloat(prices[1]);
                        vm.max_margin_rs = vm.current_price2*0.20;
                    }
                    else
                    {
                        vm.current_price1 = parseFloat(result.price_range);
                        vm.max_margin_rs = vm.current_price1*0.20;
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
                    $scope.catalog.enable_duration = enable_duration_days;

                   //$scope.catalogImage = result.thumbnail.thumbnail_medium;
                    $scope.catalogImage = result.image.thumbnail_medium;
                    console.log(vm.catalog_products);
                    $scope.order_no_live = result.max_sort_order + 1;
                
                    $scope.catalogId = result.catalog_id;
                    $scope.catalogData = result;
                    var catArr = [];
                    catArr.push(result.category);
                    
                    CatalogUploadOptions.query({'catalog': $scope.catalogId},
                    function(success)
                    {
                        if(success.length != 0){
                        /*    if (success[0].public_single_price)
                            {
                                $scope.catalog.price_type = 'single';
                                $scope.product_price_type = 'single';
                                //$scope.catalog.public_price = parseInt(success[0].public_single_price);
                                $scope.catalog.price = parseInt(success[0].private_single_price);
                                //$scope.catalog.view_permission = 'public';
                            }
                            else if (success[0].private_single_price) {
                                $scope.catalog.price_type = 'single';
                                $scope.product_price_type = 'single';
                                $scope.catalog.price = parseInt(success[0].private_single_price);
                                //$scope.catalog.view_permission = 'push'; 
                            } 
                            else {
                                $scope.catalog.price_type = 'individual'; 
                                $scope.product_price_type = 'individual';
                            }*/
                            $scope.cataloguploadoptions_id = success[0].id;
                            $scope.without_sku = success[0].without_sku;
                            console.log($scope.cataloguploadoptions_id);
                            $scope.cataloguploadoptions_isadded = true;
                        }
                        else{
                        $scope.cataloguploadoptions_isadded = false;
                        }
                        
                    })
                    //$scope.OpenCatalogForm(catArr);
                    v2ProductsMyDetails.get({id: $scope.bundle_product_id },function(success){
                      if(success.single_piece_price_percentage){
                        vm.single_piece_price_percentage = success.single_piece_price_percentage;
                        vm.is_percentage = true;
                      }
                      else {
                        vm.single_piece_price_fix = success.single_piece_price_fix;
                        vm.is_percentage = false;
                      }
                      $scope.catalog_seller_id = success.catalog_seller_id;
                      $scope.catalog.is_owner = success.is_owner;
                      $scope.getBrandDiscount($scope.catalog.brand);
                    });
                });
        };


        $scope.UpdateCatalog = function ()
        {
            if ($scope.catalog.catalog_type == 'catalog') {
                if ($scope.catalog.brand == '' || $scope.catalog.brand == null || $scope.catalog.brand == undefined) {
                    vm.errortoaster = {
                        type: 'error',
                        title: 'Brand',
                        text: 'Please select brand.'
                    };
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    return;
                }
            }

            $scope.catalog.eav = {};

            for (var i = 0; i < $scope.attribute_list.length; i++)
            {
                console.log($scope.attribute_list[i].attribute_slug);
                console.log($scope.catalog[$scope.attribute_list[i].attribute_slug]);
              
                if ($scope.attribute_list[i].attribute_slug == 'size') {
                    continue;
                }
                else if (($scope.attribute_list[i].attribute_datatype == 'float' || $scope.attribute_list[i].attribute_datatype == 'int') && $scope.catalog[$scope.attribute_list[i].attribute_slug] && $scope.catalog[$scope.attribute_list[i].attribute_slug] > 0) {
                    $scope.catalog.eav[$scope.attribute_list[i].attribute_slug] = $scope.catalog[$scope.attribute_list[i].attribute_slug];
                }
                else if ($scope.catalog[$scope.attribute_list[i].attribute_slug] && $scope.catalog[$scope.attribute_list[i].attribute_slug].length > 0) {
                    //console.log($scope.attribute_list[i].attribute_slug);
                    //console.log(!$scope.catalog.sell_full_catalog);

                    $scope.catalog.eav[$scope.attribute_list[i].attribute_slug] = $scope.catalog[$scope.attribute_list[i].attribute_slug];
                }
                else {
                    if ($scope.attribute_list[i].is_required == true || $scope.attribute_list[i].is_required == 'true') {
                        vm.errortoaster = {
                            type: 'error',
                            title: $scope.attribute_list[i].attribute_slug,
                            text: 'Please select ' + $scope.attribute_list[i].attribute_slug
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                        return;
                    }

                }
                console.log($scope.catalog.eav);
            }

            if ($scope.catalog.other)
                $scope.catalog.eav["other"] = $scope.catalog.other;
            else
                $scope.catalog.eav["other"] = "";

            if ($scope.catalog.style) {
                $scope.catalog.eav["style"] = $scope.catalog.style;
            }
            else {
                delete $scope.catalog.eav["style"];
            }

            console.log($scope.catalog.eav);
            $scope.catalog.eav = JSON.stringify($scope.catalog.eav);
            console.log($scope.catalog.eav);

            var today = new Date();
            var expiry_date = today.setDate(today.getDate() + $scope.catalog.enable_duration);
            // console.log(today);
            expiry_date = formatDate(expiry_date) + "T23:59:59Z"
            console.log(vm.enable_duration);
            console.log(expiry_date);

            var dispatchdate = formatDate($scope.catalog.dispatch_date);
            // vm.params =  {"cid":$scope.company_id, "id": $scope.catalogId, "title":$scope.catalog.title,"brand":$scope.catalog.brand,"category": $scope.catalog.category, "sell_full_catalog":$scope.catalog.sell_full_catalog, "view_permission":$scope.catalog.view_permission, "eav": $scope.catalog.eav, "expiry_date": expiry_date};
            vm.params = { "cid": $scope.company_id, "id": $scope.catalogId, "title": $scope.catalog.title, "brand": $scope.catalog.brand, "category": $scope.catalog.category, "view_permission": $scope.catalog.view_permission, "eav": $scope.catalog.eav };
            if ($scope.catalog.dispatch_date) {
                vm.params['dispatch_date'] = dispatchdate;
            }
            if (!$scope.catalog.cropallow && $scope.catalog.thumbnail != null) {
                //vm.params["thumbnail"] = Upload.dataUrltoBlob($scope.catalog.uncropped, $scope.catalog.thumbnail)
                vm.params["thumbnail"] = blobImageRenameForExtenstion($scope.catalog.uncropped, $scope.catalog.thumbnail, $scope.catalog.title + ".jpg");
            }
            else if ($scope.catalog.thumbnail != null) {
                //vm.params["thumbnail"] = Upload.dataUrltoBlob(vm.croppedDataUrl, $scope.catalog.thumbnail)
                vm.params["thumbnail"] = blobImageRenameForExtenstion(vm.croppedDataUrl, $scope.catalog.thumbnail, $scope.catalog.title + ".jpg");
            }
            console.log(vm.catalog_products);

            vm.catalogoption_params = {};
            if ($scope.product_price_type == 'single') {
                vm.catalogoption_params['private_single_price'] = $scope.catalog.price;
                vm.catalogoption_params['public_single_price'] = $scope.catalog.price;
               
            }
            else {
                // individual price
                vm.catalogoption_params['private_single_price'] = null;
                vm.catalogoption_params['public_single_price'] = null;
            }
            //vm.catalogoption_params['catalog'] = $scope.catalogId;
            //console.log($scope.cataloguploadoptions_id)
            if ($scope.cataloguploadoptions_isadded == true) {
                vm.catalogoption_params['id'] = $scope.cataloguploadoptions_id;
            }
            if ($scope.catalog.work != null) {
                vm.catalogoption_params['work'] = $scope.catalog.work.toString();
            }
            if ($scope.catalog.fabric != null) {
                vm.catalogoption_params['fabric'] = $scope.catalog.fabric.toString();
            }
           
            console.log($scope.catalog.brand);
            if ($scope.catalog.catalog_type == 'noncatalog' && $scope.catalog.brand == undefined) {
                delete vm.params["brand"];
            }
            $(".modelform").addClass(progressLoader());
            Catalog.patch(vm.params,
                function (success) {

                    var i = 0;
                  // Mavaji - WB-5158 - commented below code to update price because it moved to 3rd tab of dialog where adding/updating products
                  /*  if (vm.catalog_products)
                    {
                        for (i = 0; i < vm.catalog_products.length; i++) {
                            if ($scope.catalog.price_type == 'single') {
                                vm.catalog_products[i].price = $scope.catalog.price;
                                vm.catalog_products[i].public_price = $scope.catalog.price;
                            
                            }
                            else {
                                vm.catalog_products[i].public_price = vm.catalog_products[i].price
                            }

                            Product.patch(vm.catalog_products[i],
                                function (success) {
                                    
                                });
                        }
                        
                    } */

                    vm.catalogoption_params['catalog'] = $scope.catalogId;
                    if ($scope.cataloguploadoptions_isadded == true) {
                        CatalogUploadOptions.patch(vm.catalogoption_params,
                            function (result) {
                                console.log('catalog options updated');
                            });
                    }
                    else {
                        CatalogUploadOptions.save(vm.catalogoption_params,
                            function (result) {
                                console.log('catalog options added');
                            });
                    }

                    $(".modelform").removeClass(progressLoader());

                    if ($scope.catalog.catalog_type == 'noncatalog') {
                        vm.successtoaster = {
                            type: 'success',
                            title: 'Success',
                            text: 'Noncatalog updated successfully.'
                        };
                    }
                    else {
                        vm.successtoaster = {
                            type: 'success',
                            title: 'Success',
                            text: 'Catalog updated successfully.'
                        };
                    }

                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    // ngDialog.close();
                    //$scope.reloadData(); let it update after 3rd step as size buttons ui getting disturbed
                });
           
        };


        /////////////////////Quality & set///////////////////////////





        $scope.uploadSetFiles = function (files, set_index)
        {
            $scope.products = [];
            //$scope.productsArr = [];
            var order_no = 1;
            $scope.order_no_live = 1;
            ////$scope.files = files;
            var files_length = files.length;
            /*$scope.products = [];
            $scope.productsArr = [];*/
            // console.log(set_index);
            var first_upload = false;
            // alert($scope.products.length)
            if ($scope.products.length == 0) {
                order_no = $scope.order_no_live;
                first_upload = true;
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
                    product.cropallow = !$scope.product.dont_allow_crop;

                    // var filename = file.name.replace('.jpg','').replace('.JPG','').replace('.png','').replace('.PNG','').replace('.jpeg','').replace('.JPEG','').replace(/[^\w\s]/gi,'').replace(' ','');  to reomve all special characters from sku
                    var filename = file.name.replace('.jpg', '').replace('.JPG', '').replace('.png', '').replace('.PNG', '').replace('.jpeg', '').replace('.JPEG', '').replace(',', '');

                    //var filename = file.name.replace('.jpg','').replace('.JPG','').replace('.png','').replace('.PNG','').replace('.jpeg','').replace('.JPEG','').replace(/^[0!@#$%&*<>?()=]+/,'').replace(' ','').replace(',','').replace(';','').replace('\"','').replace('\'','');
                    filename = filename.replace(/^[0!@#$%&*<>?()=]+/, '').replace(' ', '').replace(';', '').replace('\"', '').replace('\'', '');

                    product.sort_order = order_no;

                    //$scope.productsArr.push(product);
                    $scope.products.push(product);
                    $scope.$apply();

                    order_no = order_no + 1;

                    if ($scope.products.length == files_length && first_upload == true) {
                        //console.log("sort start");
                        $scope.products = $filter('orderBy')($scope.products, 'sku_order');
                        //console.log("sort end");

                        order_no = $scope.order_no_live;
                        //console.log(order_no);
                        //console.log("sort2 start");
                        for (var i = 0; i < $scope.products.length; i++) {
                            $scope.products[i].sort_order = order_no; //i+1;
                            order_no = order_no + 1;
                            //console.log( $scope.products[i].sku);
                        }
                        console.log(set_index);
                        $scope.setTobeAdded[set_index].products = $scope.products;
                    }

                }

            });

            vm.products_count = files_length;
        };

        $scope.setTobeAdded2 = JSON.parse(localStorage.getItem('setTobeAdded2')) || "";

        if ($scope.setTobeAdded2.length > 0) {
            $scope.setTobeAdded = $scope.setTobeAdded2;
            console.log($scope.setTobeAdded2);

            localStorage.setItem('setTobeAdded2', JSON.stringify([]));
        }
        else {
            //console.log($scope.setTobeAdded2);
            $scope.setTobeAdded = [{ 'title': null, 'enable_duration': null }];
        }


        $scope.AddAnotherSet = function () {
            var tempset = {};
            var l = $scope.setTobeAdded.length;
            if (l < 1) {
                $scope.setTobeAdded = [{ 'title': null, 'enable_duration': null }];
            }
            console.log($scope.setTobeAdded[l - 1]);
            if ($scope.catalog.multi_set_type == 'color_set') {
                if ($scope.setTobeAdded[l - 1].title && $scope.setTobeAdded[l - 1].color && $scope.setTobeAdded[l - 1].enable_duration && $scope.setTobeAdded[l - 1].thumbnails) {
                    tempset.title = '';
                    tempset.enable_duration = '';
                    $scope.setTobeAdded.push(tempset);
                    console.log($scope.setTobeAdded);
                }
            }
            else {
                if ($scope.setTobeAdded[l - 1].title && $scope.setTobeAdded[l - 1].enable_duration && $scope.setTobeAdded[l - 1].thumbnails) {
                    tempset.title = '';
                    tempset.enable_duration = '';
                    $scope.setTobeAdded.push(tempset);
                    console.log($scope.setTobeAdded);
                }
            }
        }

        $scope.deleteSet = function (index) {
            $scope.setTobeAdded.splice(index, 1);
            console.log($scope.setTobeAdded);
        }

        $scope.AddSetMatching = function ()
        {
            //$scope.catalog.catalog_type = 'noncatalog';
            $scope.catalog.set_type = 'multi_set';

            //console.log($scope.catalog);
            console.log($scope.setTobeAdded);
            var set_length = $scope.setTobeAdded.length;
            if (set_length < 1) {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Set',
                    text: 'Please enter set details.'
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                return;
            }
            else {
                if ($scope.catalog.multi_set_type == 'color_set') {
                    if (!$scope.setTobeAdded[set_length - 1].color || !$scope.setTobeAdded[set_length - 1].title || !$scope.setTobeAdded[set_length - 1].enable_duration || !$scope.setTobeAdded[set_length - 1].thumbnails) {
                        vm.errortoaster = {
                            type: 'error',
                            title: 'Set',
                            text: 'Please complete set details.'
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                        return;
                    }
                }
                else {
                    if (!$scope.setTobeAdded[set_length - 1].title || !$scope.setTobeAdded[set_length - 1].enable_duration || !$scope.setTobeAdded[set_length - 1].thumbnails) {
                        vm.errortoaster = {
                            type: 'error',
                            title: 'Set',
                            text: 'Please complete set details.'
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                        return;
                    }
                }
            }
            $scope.catalog.eav = {};
            for (var i = 0; i < $scope.attribute_list.length; i++)
            {
               if ($scope.catalog[$scope.attribute_list[i].attribute_slug] && $scope.catalog[$scope.attribute_list[i].attribute_slug].length > 0) {
                    //console.log($scope.attribute_list[i].attribute_slug);
                    //console.log(!$scope.catalog.sell_full_catalog);

                    $scope.catalog.eav[$scope.attribute_list[i].attribute_slug] = $scope.catalog[$scope.attribute_list[i].attribute_slug];
                }
		else if ($scope.attribute_list[i].attribute_datatype == 'float' && $scope.catalog[$scope.attribute_list[i].attribute_slug] > 0) 	       {
                    $scope.catalog.eav[$scope.attribute_list[i].attribute_slug] = $scope.catalog[$scope.attribute_list[i].attribute_slug];
                }
                else if ($scope.attribute_list[i].attribute_datatype == 'int' && $scope.catalog[$scope.attribute_list[i].attribute_slug] > 0) {
                    $scope.catalog.eav[$scope.attribute_list[i].attribute_slug] = $scope.catalog[$scope.attribute_list[i].attribute_slug];
                }
                else {
                    if ($scope.attribute_list[i].is_required == true || $scope.attribute_list[i].is_required == 'true') {
                        vm.errortoaster = {
                            type: 'error',
                            title: $scope.attribute_list[i].attribute_slug,
                            text: 'Please select ' + $scope.attribute_list[i].attribute_slug
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                        return;
                    }

                }
                console.log($scope.catalog.eav);
            }

            if ($scope.catalog.other)
                $scope.catalog.eav["other"] = $scope.catalog.other;

            /*if($scope.catalog.style)
                $scope.catalog.eav["style"] = $scope.catalog.style;*/

            $scope.catalog.eav = JSON.stringify($scope.catalog.eav);
            //    console.log($scope.catalog.eav);

            vm.set_params = { "cid": $scope.company_id, "title": $scope.catalog.title, "brand": $scope.catalog.brand, "category": $scope.catalog.category, "view_permission": $scope.catalog.view_permission, "catalog_type": 'noncatalog', "eav": $scope.catalog.eav, 'set_type': $scope.catalog.set_type, 'multi_set_type': $scope.catalog.multi_set_type, 'photoshoot_type': $scope.catalog.photoshoot_type, 'price_per_design': $scope.catalog.price_per_design, 'no_of_pcs_per_design': $scope.catalog.no_of_pcs_per_design };

            if ($scope.catalog.catalog_type != 'catalog' && $scope.catalog.brand == undefined) {
                delete vm.set_params["brand"];
            }

            console.log(vm.set_params);

            $(".modelform").addClass(progressLoader());
            Catalog.save(vm.set_params, function (success) {
                $scope.catalogId = success.id;
                $scope.catalogData = success;
                $scope.order_no_live = 1;

                uploadProductWithSet();
            });

        }

        function uploadProductWithSet() {
            var total_photos = 0;
            var total_photos_uploaded_successfully = 0;
            for (i = 0; i < $scope.setTobeAdded.length; i++) {
                total_photos += $scope.setTobeAdded[i].products.length
            }

            var i = 0;
            var k = 0;
            var m = 0;
            $scope.newset = [];
            for (i = 0; i < $scope.setTobeAdded.length; i++) {
                var today = new Date();
                var expiry_date = today.setDate(today.getDate() + $scope.setTobeAdded[i].enable_duration);
                expiry_date = formatDate(expiry_date) + "T23:59:59Z"

                var temp = {};
                temp.sku = $scope.setTobeAdded[i].title;
                temp.title = $scope.setTobeAdded[i].title;
                temp.sort_order = i + 1;
                temp.product_type = "set";
                // Mavaji - don't ask sizes while adding catalog details (eav) - as per Jay Patel's mail of Feb 19, 2019, 3:32 PM
                temp.available_sizes = $scope.catalog.size;
                if ($scope.catalog.multi_set_type == 'color_set') {
                    temp.set_type_details = $scope.setTobeAdded[i].color;
                }
                temp.catalog = $scope.catalogId;
                if ($scope.setTobeAdded[i].products.length > 0) {
                    temp.image = blobImageRenameForExtenstion($scope.setTobeAdded[i].products[0].uncropped,
                        $scope.setTobeAdded[i].products[0].image, temp.sort_order + ".jpg");
                }
                temp.expiry_date = expiry_date;

                console.log(temp);

                var temp_json = {};
                //$scope.newset[k].products = $scope.setTobeAdded[i].products;
                temp_json.products = $scope.setTobeAdded[i].products;
                $scope.newset.push(temp_json);
                //console.log($scope.newset[k]);

                v2Products.save(temp,
                    function (success_product) {
                        $scope.productId = success_product.id;
                        var arr_index = success_product.sort_order - 1;
                        //console.log("iiiiiiiiiiiii  kkkkkkkkkk = " + i +"   "+ k);
                        console.log("$scope.productId  arr_index = " + $scope.productId + "   " + arr_index);
                        $scope.l = $scope.newset[arr_index].products.length;
                        //console.log($scope.l);
                        for (var j = 0; j < $scope.newset[arr_index].products.length; j++) {
                            var temp_product = {};

                            temp_product.product = $scope.productId;
                            if (j == 0)
                                temp_product.set_default = true;
                            else
                                temp_product.set_default = false;
                            temp_product.sort_order = j + 1;

                            temp_product.image = blobImageRenameForExtenstion($scope.newset[arr_index].products[j].uncropped, $scope.newset[arr_index].products[j].image, temp_product.sort_order + ".jpg");

                            v2ProductsPhotos.save(temp_product,
                                function (success_productphoto) {

                                    $scope.l = $scope.l - 1;
                                    //console.log("lllllllll "+$scope.l);
                                    if ($scope.l == 0) {
                                        m++;
                                    }

                                    total_photos_uploaded_successfully += 1

                                    console.log("total_photos_uploaded_successfully " + total_photos_uploaded_successfully + " total_photos = " + total_photos);
                                    //if($scope.setTobeAdded.length == i && j == success_productphoto.sort_order)
                                    if (total_photos_uploaded_successfully == total_photos) {
                                        var t = i + 1;
                                        $(".modelform").removeClass(progressLoader());
                                        vm.successtoaster = {
                                            type: 'success',
                                            title: 'Success',
                                            text: 'Set detail ' + t + ' added successfully.'
                                        };
                                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                        ngDialog.close();
                                        $scope.reloadData();
                                    }

                                });
                        }
                        k++;
                    });
            }
        }

        $scope.AddSettoScreen = function () {

            $scope.catalog.set_type = 'multi_set';
            //console.log($scope.catalog);
            //console.log($scope.setTobeAdded);
            var set_length = $scope.setTobeAdded.length;
            if (set_length < 1) {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Set',
                    text: 'Please enter set details.'
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                return;
            }
            else {
                if ($scope.catalog.multi_set_type == 'color_set') {
                    if (!$scope.setTobeAdded[set_length - 1].color || !$scope.setTobeAdded[set_length - 1].title || !$scope.setTobeAdded[set_length - 1].enable_duration || !$scope.setTobeAdded[set_length - 1].thumbnails) {
                        vm.errortoaster = {
                            type: 'error',
                            title: 'Set',
                            text: 'Please complete set details.'
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                        return;
                    }
                }
                else {
                    if (!$scope.setTobeAdded[set_length - 1].title || !$scope.setTobeAdded[set_length - 1].enable_duration || !$scope.setTobeAdded[set_length - 1].thumbnails) {
                        vm.errortoaster = {
                            type: 'error',
                            title: 'Set',
                            text: 'Please complete set details.'
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                        return;
                    }
                }
            }
            console.log($scope.catalogId);

            $(".modelform").addClass(progressLoader());
            uploadProductWithSet();

        }

        $scope.UpdateSettoScreen = function () {
            $scope.catalog.set_type = 'multi_set';
            console.log($scope.update_flag);
            console.log($scope.setTobeAdded);
            var set_length = $scope.setTobeAdded.length;
            if (set_length < 1) {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Set',
                    text: 'Please enter set details.'
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                return;
            }
            else {
                //validation removed in update set https://wishbook.atlassian.net/browse/WB-4706
            }
            console.log($scope.catalogId);
            console.log($scope.setId);

            $(".modelform2").addClass(progressLoader());

            var i = 0;
            var k = 0;
            var m = 0;
            $scope.newset = [];
            for (i = 0; i < $scope.setTobeAdded.length; i++) {
                var temp = {};
                var today = new Date();
                var expiry_date = today.setDate(today.getDate() + $scope.setTobeAdded[i].enable_duration);
                expiry_date = formatDate(expiry_date) + "T23:59:59Z";
                temp.expiry_date = expiry_date;


                temp.sku = $scope.setTobeAdded[i].title;
                temp.title = $scope.setTobeAdded[i].title;
                temp.sort_order = i + 1;
                temp.product_type = "set";
                if ($scope.catalog.multi_set_type == 'color_set') {
                    temp.set_type_details = $scope.setTobeAdded[i].color;
                }
                temp.id = $scope.setId;
                temp.catalog = $scope.catalog_id;

                if ($scope.setTobeAdded[i].products) {
                    if ($scope.setTobeAdded[i].products.length > 0) {
                        temp.image = blobImageRenameForExtenstion($scope.setTobeAdded[i].products[0].uncropped, $scope.setTobeAdded[i].products[0].image, temp.sort_order + ".jpg");
                    }
                    var temp_json = {};
                    //$scope.newset[k].products = $scope.setTobeAdded[i].products;
                    temp_json.products = $scope.setTobeAdded[i].products;
                    $scope.newset.push(temp_json);
                    console.log($scope.newset[k]);
                }

                console.log(temp);
                console.log($scope.setTobeAdded[i]);


                v2Products.patch(temp, function (success_product) {
                    console.log($scope.setTobeAdded[i]);

                    if (temp_json) {
                        $scope.productId = success_product.id;
                        console.log("iiiiiiiiiiiii  kkkkkkkkkk = " + i + "   " + k);
                        $scope.l = $scope.newset[k].products.length;
                        console.log($scope.l);
                        for (var j = 0; j < $scope.newset[k].products.length; j++) {
                            var temp_product = {};

                            temp_product.product = $scope.productId;
                            if (j == 0)
                                temp_product.set_default = true;
                            else
                                temp_product.set_default = false;
                            temp_product.sort_order = j + 1;

                            temp_product.image = blobImageRenameForExtenstion($scope.newset[k].products[j].uncropped, $scope.newset[k].products[j].image, temp_product.sort_order + ".jpg");

                            v2ProductsPhotos.save(temp_product,
                                function (success_productphoto) {

                                    $scope.l = $scope.l - 1;
                                    console.log("lllllllll " + $scope.l);
                                    if ($scope.l == 0) {
                                        m++;
                                    }
                                });


                            if (k == $scope.setTobeAdded.length && j == $scope.newset[k].products.length) {

                                $(".modelform2").removeClass(progressLoader());
                                vm.successtoaster = {
                                    type: 'success',
                                    title: 'Success',
                                    text: 'Set detail ' + t + ' added successfully.'
                                };
                                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                ngDialog.close();
                                $scope.reloadData();

                            }
                        }
                    }
                    else {
                        $(".modelform2").removeClass(progressLoader());
                        vm.successtoaster = {
                            type: 'success',
                            title: 'Success',
                            text: 'Set detail ' + t + ' added successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        ngDialog.close();
                        $scope.reloadData();
                    }
                    k++;
                });
                console.log("mmmmmmmmmmmm: " + m + "   " + $scope.setTobeAdded.length);

                var t = i + 1;
            }
        }




        $scope.UpdateQualityForm = function (qualityid, bundleid)
        {
            console.log(qualityid + ' , ' + bundleid);
            $scope.qualityid = qualityid;
            $scope.bundle_id = bundleid;
            $(".modelform").addClass(progressLoader());


            Catalog.get({ 'id': qualityid, 'cid': $scope.company_id, 'expand': true }, function (quality) {
                console.log(quality);
                $scope.quality = quality;

                console.log(quality.brand);

                if (quality.brand != null) {
                    $scope.quality.brand = quality.brand.id;
                }
                $scope.catalog.catalog_type = 'setmatching';
                $scope.catalog_eav_data = quality.eavdata;

                console.log($scope.catalog_eav_data);
                $scope.products = quality.products;


                $scope.topcategories = v2Category.query({ parent: 1 });
                $scope.catalog.topcategory = 4;
                v2CategoryEavAttribute.query(function (success) {
                    $scope.all_category_eav_data = success;
                    $scope.TopCategoryChanged(4);

                });

                /*fabric work style etc is obtained by CategoryChanged() add_update.js using catalog_eav_data*/


                CatalogUploadOptions.query({ 'catalog': $scope.qualityid },
                    function (success) {
                        if (success.length != 0) {
                            $scope.cataloguploadoptions_id = success[0].id;
                            $scope.cataloguploadoptions_isadded = true;
                        }
                        else {
                            $scope.cataloguploadoptions_isadded = false;
                        }


                    })

            });

        };

        $scope.UpdateQualitySubmit = function () {

            $scope.catalog.eav = {};
            for (var i = 0; i < $scope.attribute_list.length; i++) {
                console.log($scope.attribute_list[i].attribute_slug);
                console.log($scope.catalog[$scope.attribute_list[i].attribute_slug]);

                if (($scope.attribute_list[i].attribute_datatype == 'float' || $scope.attribute_list[i].attribute_datatype == 'int') && $scope.catalog[$scope.attribute_list[i].attribute_slug] && $scope.catalog[$scope.attribute_list[i].attribute_slug] > 0) {
                    $scope.catalog.eav[$scope.attribute_list[i].attribute_slug] = $scope.catalog[$scope.attribute_list[i].attribute_slug];
                }
                else if ($scope.catalog[$scope.attribute_list[i].attribute_slug] && $scope.catalog[$scope.attribute_list[i].attribute_slug].length > 0) {
                    console.log($scope.attribute_list[i].attribute_slug);
                    console.log(!$scope.catalog.sell_full_catalog);

                    $scope.catalog.eav[$scope.attribute_list[i].attribute_slug] = $scope.catalog[$scope.attribute_list[i].attribute_slug];
                }
                else {
                    if ($scope.attribute_list[i].is_required == true || $scope.attribute_list[i].is_required == 'true') {
                        vm.errortoaster = {
                            type: 'error',
                            title: $scope.attribute_list[i].attribute_slug,
                            text: 'Please select ' + $scope.attribute_list[i].attribute_slug
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                        return;
                    }

                }
                console.log($scope.catalog.eav);
            }

            if ($scope.catalog.other)
                $scope.catalog.eav["other"] = $scope.catalog.other;
            else
                $scope.catalog.eav["other"] = "";

            if ($scope.catalog.style) {
                $scope.catalog.eav["style"] = $scope.catalog.style;
            }
            else {
                delete $scope.catalog.eav["style"];
            }

            console.log($scope.catalog.eav);
            $scope.catalog.eav = JSON.stringify($scope.catalog.eav);


            vm.params = { "cid": $scope.company_id, "id": $scope.qualityid, "title": $scope.quality.title, "category": $scope.quality.category, "eav": $scope.catalog.eav, 'price_per_design': $scope.catalog.price_per_design, 'no_of_pcs_per_design': $scope.catalog.no_of_pcs_per_design };

            vm.catalogoption_params = {};

            if ($scope.cataloguploadoptions_isadded == true) {
                vm.catalogoption_params['id'] = $scope.cataloguploadoptions_id;
            }
            if ($scope.catalog.work != null) {
                vm.catalogoption_params['work'] = $scope.catalog.work.toString();
            }
            if ($scope.catalog.fabric != null) {
                vm.catalogoption_params['fabric'] = $scope.catalog.fabric.toString();
            }

            console.log($scope.quality.brand);
            if ($scope.quality.brand) {
                vm.params["brand"] = $scope.quality.brand;
            }

            $(".modelform").addClass(progressLoader());
            Catalog.patch(vm.params, function (success) {

                vm.catalogoption_params['catalog'] = $scope.qualityid;

                if ($scope.cataloguploadoptions_isadded == true) {
                    CatalogUploadOptions.patch(vm.catalogoption_params,
                        function (result) {
                            console.log('catalog options updated');
                        });
                }
                else {
                    CatalogUploadOptions.save(vm.catalogoption_params,
                        function (result) {
                            console.log('catalog options added');
                        });
                }


                for (var i = 0; i < $scope.attribute_list.length; i++) {
                    console.log($scope.attribute_list[i].attribute_slug);
                    console.log($scope.catalog[$scope.attribute_list[i].attribute_slug]);
                    if ($scope.attribute_list[i].attribute_slug == 'size' && ($scope.attribute_list[i].is_required == true || $scope.attribute_list[i].is_required == 'true')) {
                        $scope.size_mandatory = true;

                    }
                }

                if ($scope.size_mandatory) {
                    vm.params = { id: $scope.bundle_id };
                    vm.params["available_sizes"] = $scope.catalog.size;;

                    v2Products.patch(vm.params, function (success) {
                        $(".modelform").removeClass(progressLoader());
                        vm.successtoaster = {
                            type: 'success',
                            title: 'Success',
                            text: 'Quality updated successfully.'
                        };

                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        vm.CloseDialog();

                        $scope.reloadData();

                    });
                }


            });

        };





        ////////////////////////////////////////inventory Dhiren////////////////////////////


     

        $scope.GetCatalogStartStop = function(id,selling_company)
        {
            $scope.all_sizes = [];
            $scope.mysizes = [];
            $scope.catalog_id = id;
            $(".inventory_dialog").addClass(progressLoader());
            if($scope.is_staff == "true"){
                $scope.selling_company = selling_company;
                $scope.params = {'id': $scope.catalog_id, 'selling_company': $scope.selling_company };
            }
            else
            {
                $scope.params = {'id': $scope.catalog_id}; 
            }
            //v2Products.get({'cid': $scope.company_id, 'id': $scope.catalog_id, 'expand': true, "show_all_products" : true}, function(success){
            v2Products.get({'cid': $scope.company_id, 'id': $scope.catalog_id, 'expand': true, "view_type" : "mycatalogs"}, function(success)
            {
                $scope.catalog_inv = success;
                v2ProductsMyDetails.get($scope.params, function(data)
                {  
                    $scope.inventory_data = data;  
                    v2CategoryEavAttribute.query({"category": success.category, "attribute_slug" : "size"},
                    function(result)
                    {
                        //UpdateCheckBoxUI();
                       
                        console.log(result);
                        $scope.attribute_data = result; 
                        console.log("sell_full: "+$scope.inventory_data.i_am_selling_sell_full_catalog);
                        $scope.full_set_only = $scope.inventory_data.i_am_selling_sell_full_catalog;
                        if($scope.attribute_data.length > 0)
                        { 
                            $scope.catalog_with_size = true;
                            if($scope.full_set_only ==  true)
                            {
                                var ctr= 0;
                                if($scope.inventory_data.available_sizes)
                                {
                                $scope.mysizes = $scope.inventory_data.available_sizes.split(',');
                                }
                                for(var i = 0; i < $scope.attribute_data[0].attribute_values.length; i++){
                                    if($scope.mysizes.indexOf($scope.attribute_data[0].attribute_values[i].value) < 0 )
                                    {
                                        var temp = {};
                                        temp.value = $scope.attribute_data[0].attribute_values[i].value;
                                        temp.selected = false;
                                        $scope.all_sizes.push(temp);
                                    }
                                    else
                                    {
                                        var temp = {};
                                        temp.value = $scope.attribute_data[0].attribute_values[i].value;
                                        temp.selected = true;
                                        $scope.all_sizes.push(temp);
                                        ctr+=1;
                                    }

                                }
                                if(ctr>0)
                                {
                                    $scope.catalog_inv.selectAll = true;
                                }
                            }
                            else
                            {
                                $scope.full_set_only = false; 
                                for (var j = 0; j < $scope.catalog_inv.products.length; j++) 
                                {
                                    for (var k = 0; k < $scope.inventory_data.products.length; k++) 
                                    {
                                        if($scope.catalog_inv.products[j].id == $scope.inventory_data.products[k].id)
                                        {
                                            //console.log($scope.inventory_data.products[k].available_sizes);
                                            if($scope.inventory_data.products[k].available_sizes)
                                            {
                                                $scope.mysizes = $scope.inventory_data.products[k].available_sizes.split(',');
                                            }
                                            else
                                            {
                                                $scope.mysizes = [];
                                            }
                                            break;
                                        }  
                                    }
                                    $scope.all_sizes = [];
                                    var ctr= 0;
                                    for(var i = 0; i < $scope.attribute_data[0].attribute_values.length; i++)
                                    {
                                        //console.log($scope.mysizes.indexOf($scope.attribute_data[0].attribute_values[i].value));
                                        
                                        if($scope.mysizes.indexOf($scope.attribute_data[0].attribute_values[i].value) < 0 )
                                        {
                                            var temp = {};
                                            temp.value = $scope.attribute_data[0].attribute_values[i].value;
                                            temp.selected = false;
                                            $scope.all_sizes.push(temp);
                                        }
                                        else
                                        {
                                            var temp = {};
                                            temp.value = $scope.attribute_data[0].attribute_values[i].value;
                                            temp.selected = true;
                                            $scope.all_sizes.push(temp);
                                            ctr+= 1;
                                        }
                                    }
                                    if (ctr>0){
                                        $scope.catalog_inv.products[j].selectAll = true;
                                    }
                                    $scope.catalog_inv.products[j].all_sizes =  $scope.all_sizes;
                                    console.log($scope.catalog_inv.products[j]);
                                }
                            }
                        } // end if : catalog with size ($scope.attribute_data.length > 0) 
                        else
                        {

                            $scope.catalog_with_size = false;
                            
                            if($scope.full_set_only ==  true)
                            {
                                $scope.catalog_inv.selectAll = Boolean($scope.inventory_data.currently_selling);
                                
                                for (var j = 0; j < $scope.catalog_inv.products.length; j++) 
                                {
                                    console.log($scope.catalog_inv.products[j].title +": " +$scope.inventory_data.currently_selling);
                                    $scope.catalog_inv.products[j].selected = $scope.inventory_data.currently_selling;    
                                }
                            }
                            else
                            {
                                $scope.catalog_inv.selectAll = Boolean($scope.inventory_data.currently_selling);
                                console.log($scope.catalog_inv.selectAll);

                                for (var j = 0; j < $scope.catalog_inv.products.length; j++) 
                                {
                                    for (var k = 0; k < $scope.inventory_data.products.length; k++) 
                                    {
                                        if($scope.catalog_inv.products[j].id == $scope.inventory_data.products[k].id)
                                        {
                                        console.log($scope.catalog_inv.products[j].title +": " +$scope.inventory_data.products[k].currently_selling);
                                        $scope.catalog_inv.products[j].selected = $scope.inventory_data.products[k].currently_selling;      
                                        break;
                                        }  
                                    } 
                                    console.log($scope.catalog_inv.products[j]);
                                }
                            }
                        
                        } // end else : i.e catalog without size

                        UpdateCheckBoxUICustom();

                        $(".inventory_dialog").removeClass(progressLoader());
                    }); // end : v2CategoryEavAttribute
                });  // end: v2ProductsMyDetails
            }); // end : v2Products
        }

       

      
        $scope.UpdateInventorySubmit = function()
        {
            console.log($scope.catalog_id);
            console.log(vm.enable_duration);
            if(!vm.enable_duration || vm.enable_duration < 10){
              vm.errortoaster = {
                  type:  'error',
                  title: 'Enable Duration',
                  text:  'Enable duration should be greater than 10'
              };   
              toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
              return;
            }
            var today = new Date();
            var expiry_date = today.setDate(today.getDate() + vm.enable_duration);
            expiry_date = formatDate(expiry_date) + "T23:59:59Z"
            console.log(expiry_date);

            if($scope.catalog_with_size ==  true)
            {
                if($scope.full_set_only ==  true)
                {
                    console.log($scope.all_sizes);
                    var sizes = [];
                    for (var i = 0; i < $scope.all_sizes.length; i++) {
                      if($scope.all_sizes[i].selected == true){
                        sizes.push($scope.all_sizes[i].value);
                      }
                    }               
                    $scope.available_sizes = sizes.toString();
                    if($scope.available_sizes.length > 0){
                      $scope.is_enable = true;
                    }
                    else{
                      $scope.is_enable = false; 
                    }


                    $scope.params = { "products": [{ "product_id": $scope.catalog_id, "available_sizes": $scope.available_sizes, "is_enable": $scope.is_enable }], 'expiry_date': expiry_date };
                    if($scope.is_staff == "true"){
                      $scope.params['selling_company'] =  $scope.selling_company;
                    }
                    console.log($scope.params);
                    $(".modelform2").addClass(progressLoader());
                    v2BulkUpdateProductSeller.save($scope.params, function(success){
                          $(".modelform2").removeClass(progressLoader());
                          vm.successtoaster = {
                              type:  'success',
                              title: 'Success',
                              text:  'Inventory updated successfully.'
                          };
                          toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                          ngDialog.close();
                          $scope.reloadData();
                    });
                } // end if : full_set_only == true
                else
                {
                    $scope.bulk_products = [];
                    for (var j = 0; j < $scope.catalog_inv.products.length; j++) {
                        var sizes = [];
                        for (var i = 0; i < $scope.catalog_inv.products[j].all_sizes.length; i++) {
                          if($scope.catalog_inv.products[j].all_sizes[i].selected == true){
                            sizes.push($scope.catalog_inv.products[j].all_sizes[i].value);
                          }
                        }
                        var temp = {};
                        temp.product_id = $scope.catalog_inv.products[j].id
                        temp.available_sizes = sizes.toString();
                        if(temp.available_sizes.length > 0){
                          temp.is_enable = true;
                        }
                        else{
                          temp.is_enable = false; 
                        }
                        $scope.bulk_products.push(temp);
                    }
                    
                    $scope.params = { "products": $scope.bulk_products, 'expiry_date': expiry_date }
                    if($scope.is_staff == "true"){
                      $scope.params['selling_company'] =  $scope.selling_company;
                    }
                    console.log($scope.params);
                    $(".modelform2").addClass(progressLoader());
                    v2BulkUpdateProductSeller.save($scope.params, function(success){
                          $(".modelform2").removeClass(progressLoader());
                          vm.successtoaster = {
                              type:  'success',
                              title: 'Success',
                              text:  'Inventory updated successfully.'
                          };
                          toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                          ngDialog.close();
                          $scope.reloadData();
                    });
                }// end else : full_set_only == false
            } // end if : catalog_with_size == true
            else
            {
                if($scope.full_set_only ==  true)
                {
                    if($scope.catalog_inv.selectAll == true){
                      $scope.is_enable = true;
                    }
                    else{
                      $scope.is_enable = false; 
                    }
                    $scope.params = { "products": [{ "product_id": $scope.catalog_id, "is_enable": $scope.is_enable }], 'expiry_date': expiry_date }
                    if($scope.is_staff == "true"){
                      $scope.params['selling_company'] =  $scope.selling_company;
                    }
                    console.log($scope.params);
                    $(".modelform2").addClass(progressLoader());
                    v2BulkUpdateProductSeller.save($scope.params, function(success){
                          $(".modelform2").removeClass(progressLoader());
                          vm.successtoaster = {
                              type:  'success',
                              title: 'Success',
                              text:  'Inventory updated successfully.'
                          };
                          toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                          ngDialog.close();
                          $scope.reloadData();
                    });
                } // end if : full_set_only == true
                else
                {
                    $scope.bulk_products = [];
                    for (var j = 0; j < $scope.catalog_inv.products.length; j++) {
                        var temp = {};
                        temp.product_id = $scope.catalog_inv.products[j].id
                        if($scope.catalog_inv.products[j].selected ==  true){
                          temp.is_enable = true;
                        }
                        else{
                          temp.is_enable = false; 
                        }
                        $scope.bulk_products.push(temp);
                    }
                    
                    $scope.params = { "products": $scope.bulk_products, 'expiry_date': expiry_date }
                    if($scope.is_staff == "true"){
                      $scope.params['selling_company'] =  $scope.selling_company;
                    }
                    console.log($scope.params);
                    $(".modelform2").addClass(progressLoader());
                    v2BulkUpdateProductSeller.save($scope.params, function(success){
                          $(".modelform2").removeClass(progressLoader());
                          vm.successtoaster = {
                              type:  'success',
                              title: 'Success',
                              text:  'Inventory updated successfully.'
                          };
                          toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                          ngDialog.close();
                          $scope.reloadData();
                    });
                }// end else : full_set_only == false

            } // end else : catalog_with_size == false
        }

        $scope.atype = sharedProperties.getType();
        console.log($scope.atype);
        if ($scope.atype == 'update') {
            $scope.UpdateCatalogForm();
            $scope.update_flag = true;
        }
        else {
            $scope.update_flag = false;
        }

        if ($scope.atype == 'update1') {
            $scope.updateflag = true;
        }
        else
        {
            $scope.updateflag = false;
        }


        if ($scope.atype == 'startstop' && $scope.is_staff != "true") {
            console.log($scope.catalog_id);
            $scope.GetCatalogStartStop($scope.catalog_id);
        }

        if ($scope.atype == 'updatequality') {
            $scope.update_flag = true;
            $scope.UpdateQualityForm($scope.catalog_id, $scope.bundle_product_id );
        }


        vm.checkAllCatalog = function(value){
            console.log(value);
            for (var i = 0; i < $scope.all_sizes.length; i++) {
              $scope.all_sizes[i].selected = value;
            }
        }
        vm.toggleCheckAllCatalog = function () {
            for (var i = 0; i < $scope.all_sizes.length; i++) {
                if ($scope.all_sizes[i].selected == true) {
                    $scope.catalog_inv.selectAll = true;
                    return;
                }
            }
            $scope.catalog_inv.selectAll = false;
        }

        vm.checkAllProduct = function(value,index){
            for (var i = 0; i < $scope.catalog_inv.products[index].all_sizes.length; i++) {
              $scope.catalog_inv.products[index].all_sizes[i].selected = value;
            }
        }
        vm.toggleCheckAllProduct = function (index) {
            for (var i = 0; i < $scope.catalog_inv.products[index].all_sizes.length; i++) {
                if ($scope.catalog_inv.products[index].all_sizes[i].selected == true) {
                    $scope.catalog_inv.products[index].selectAll = true;
                    return;
                }
            }
            $scope.catalog_inv.products[index].selectAll = false;
        }


        vm.checkAllCatalogWithoutSize = function(value,index){
            for (var i = 0; i < $scope.catalog_inv.products.length; i++) {
              $scope.catalog_inv.products[i].selected = value;
            }
        }
        vm.toggleCheckAllCatalogWithoutSize = function(){  
            for (var i = 0; i < $scope.catalog_inv.products.length; i++) {
                if($scope.catalog_inv.products[i].selected == false){
                  $scope.catalog_inv.selectAll = false;
                  return;
                }
            }
            $scope.catalog_inv.selectAll = true;
        }

        vm.OpenDiscountSettings = function () {
            console.log(window.location);
            vm.CloseDialog();
            //window.open(window.location.origin + '/#/app/brandwisediscount')
            //window.location.href = window.location.origin + '/#/app/brandwisediscount';
	    OpenDiscountSettings();
        };

        $scope.AddSizeToProduct = function (index,value)
        {
            console.log($scope.products[index]['all_sizes']);
        }

        $scope.stopSellingAllDesign = function ()
        {
            console.log('stopSellingAllDesign');
            $scope.catalog_inv.selectAll = false;
            
            $scope.UpdateInventorySubmit()
        }

        $scope.startSellingAllDesign = function ()
        {
            console.log('startSellingAllDesign');
            $scope.catalog_inv.selectAll = true;

            $scope.UpdateInventorySubmit();
        }
        $scope.selectAllitems = function (index)
        {
            console.log('selectAllitems');

            vm.checkAllProduct(true, index)

        }
        $scope.unselectAllitems = function (index) {
            console.log('unselectAllitems');

            vm.checkAllProduct(false, index)

        }

        $scope.selectfullCatalog = function () {
            console.log('selectfullCatalog');

            vm.checkAllCatalog(true);

        }
        $scope.unselectfullCatalog = function () {
            console.log('unselectfullCatalog');

            vm.checkAllCatalog(false);

        }

        function UpdateCheckBoxUICustom() {
            setTimeout(function () 
            {
                var output = $(".customUI input[type=checkbox]");
                console.log(output);
                var j=1000;
                output.each(function (i) {
                    //console.log(i);
                    $(this).attr("id", j);
                    $(this).after("<label for='" + j + "'></label");
                    j++;
                });

            }, 400);
        }
       
   

    $scope.single = function(){
    $scope.product_price_type = 'single';
    $scope.catalog.price_type = 'single';
    }
    $scope.individual = function(){
    //$scope.singleprice = false;
    $scope.product_price_type = 'individual';
    $scope.catalog.price_type = 'individual';
    }
    $scope.withoutprice = function(){
    //$scope.singleprice = false;
    $scope.product_price_type = 'withoutprice';
    }
    
    $scope.withoutSku = function(flag){
    $scope.without_sku = flag;
    }

   

    $scope.applyMarginToallpcs = function ()
    {
        var marginedprice; //round up as per WB-4953
        for (var i = $scope.products.length - 1; i >= 0; i--)
        {
            // if ( $scope.product_price_type == 'single' && $scope.catalog.price)
            // {
            //     $scope.products[i].mwp_price = $scope.catalog.price;
            // }

            if (vm.is_percentage == true && (vm.single_piece_price_percentage || vm.single_piece_price_percentage === 0)) {
                marginedprice = $scope.products[i].price + ($scope.products[i].price * vm.single_piece_price_percentage) / 100;
                $scope.products[i].newsinglepcPric = marginedprice - Math.ceil((marginedprice * $scope.single_pc_discount) / 100);
                //$scope.products[i].newsinglepcPric = ($scope.products[i].price + ($scope.products[i].price * vm.single_piece_price_percentage) / 100 - ($scope.products[i].price * $scope.single_pc_discount) / 100).toFixed(2);
            }
            else if (vm.is_percentage == false && (vm.single_piece_price_fix || vm.single_piece_price_fix === 0)) {
                marginedprice = $scope.products[i].price + vm.single_piece_price_fix;
                $scope.products[i].newsinglepcPric = marginedprice - Math.ceil((marginedprice * $scope.single_pc_discount) / 100)
                //$scope.products[i].newsinglepcPric = ($scope.products[i].price + vm.single_piece_price_fix - ($scope.products[i].price * $scope.single_pc_discount) / 100).toFixed(2);
            }
            //$scope.products[i].newFullcatalogPric = ($scope.products[i].price - ($scope.products[i].price * $scope.full_catalog_discount) / 100).toFixed(2);
            $scope.products[i].newFullcatalogPric = Math.ceil($scope.products[i].price - ($scope.products[i].price * $scope.full_catalog_discount) / 100);

            console.log($scope.products[i].newsinglepcPric);
            console.log($scope.products[i].newFullcatalogPric);
        }

        var marginedprice1, marginedprice2; // show applied margin to previous designs also from Gaurav-Dhiren

        for (var j = 0; j < vm.catalog_products.length; j++) {

            if (vm.is_percentage == true && (vm.single_piece_price_percentage || vm.single_piece_price_percentage === 0)) {
                vm.catalog_products[j].fullCatalog_billingprice = vm.catalog_products[j].mwp_price - Math.ceil((vm.catalog_products[j].mwp_price * $scope.full_catalog_discount) / 100);

                marginedprice1 = vm.catalog_products[j].mwp_price + (vm.catalog_products[j].mwp_price * vm.single_piece_price_percentage) / 100
                vm.catalog_products[j].singlePc_billingprice = marginedprice1 - Math.ceil((marginedprice1 * $scope.single_pc_discount) / 100);

            }
            else if (vm.is_percentage == false && (vm.single_piece_price_fix || vm.single_piece_price_fix === 0)) {
                vm.catalog_products[j].fullCatalog_billingprice = vm.catalog_products[j].mwp_price - (vm.catalog_products[j].mwp_price * $scope.full_catalog_discount) / 100;

                marginedprice2 = vm.catalog_products[j].mwp_price + vm.single_piece_price_fix;
                vm.catalog_products[j].singlePc_billingprice = marginedprice2 - Math.ceil((marginedprice2 * $scope.single_pc_discount) / 100);
            }

            console.log(vm.catalog_products[j].mwp_price + ' + ' + marginedprice1 + ' or ' + marginedprice2 + ' - ' + Math.ceil((marginedprice1 * $scope.single_pc_discount) / 100) + " or " + Math.ceil((marginedprice2 * $scope.single_pc_discount) / 100));
            console.log(vm.single_piece_price_percentage + ' ' + vm.single_piece_price_fix);
            
            vm.catalog_products[j].fullCatalog_billingprice = parseFloat(vm.catalog_products[j].fullCatalog_billingprice).toFixed(2);
            vm.catalog_products[j].singlePc_billingprice = parseFloat(vm.catalog_products[j].singlePc_billingprice).toFixed(2);
            console.log(vm.catalog_products[j].fullCatalog_billingprice);
            console.log(vm.catalog_products[j].singlePc_billingprice);

            console.log(vm.catalog_products[j]);
        }
    }

    $scope.setNewPriceAndLimit = function (price,index)
    {
        console.log(price+' '+index);
        var marginedprice;

        /* for (var i = 0; i < $scope.products.length; i++)
        {
            if ($scope.products[i].price && $scope.products[i].price !== price)
            {
                console.log('$scope.catalog.price_type made individual');
                
                $scope.product_price_type = 'individual';
                $scope.catalog.price_type = 'individual';
                break;
            }
        } */
        
        if ($scope.products[0].price)
        {
            vm.current_price1 = parseFloat($scope.products[0].price);
            //vm.current_price2 = parseFloat($scope.products[$scope.products.length-1].price);
            vm.max_margin_rs = Math.max(vm.current_price1 * 0.10, 60);
            vm.max_margin_percentage = ((vm.max_margin_rs * 100) / vm.current_price1).toFixed(2);
        }
        console.log('margin limits are : '+vm.max_margin_rs + 'rs or ' + vm.max_margin_percentage+'%');


        if (price && $scope.catalog.price_type == 'single')
        {
            $scope.catalog.price = price;
            console.log($scope.catalog.price);

            for (var i = $scope.products.length - 1; i >= 0; i--) {
                $scope.products[i].price = $scope.catalog.price;
                $scope.products[i].newsinglepcPric = $scope.catalog.price - ($scope.products[i].price * $scope.single_pc_discount) / 100;
                $scope.products[i].newFullcatalogPric = $scope.catalog.price - ($scope.products[i].price * $scope.full_catalog_discount) / 100;

                console.log($scope.products[i].newsinglepcPric + ' ' + $scope.products[i].newFullcatalogPric);
            }

        }
        else if (!price && $scope.products[0].price && $scope.catalog.price_type == 'single')
        {
            $scope.catalog.price = parseFloat($scope.products[0].price);;
            console.log($scope.catalog.price);

            for (var i = $scope.products.length - 1; i >= 0; i--) {
                $scope.products[i].price = $scope.catalog.price;
                $scope.products[i].newsinglepcPric = $scope.catalog.price - ($scope.products[i].price * $scope.single_pc_discount) / 100;
                $scope.products[i].newFullcatalogPric = $scope.catalog.price - ($scope.products[i].price * $scope.full_catalog_discount) / 100;

                console.log($scope.products[i].newsinglepcPric + ' ' + $scope.products[i].newFullcatalogPric);
            }
        }
        else if (index != undefined || index != null ) // if individual price radio button is selected
        {
            if (vm.is_percentage == true) {
                marginedprice = price + (price * vm.single_piece_price_percentage) / 100;
                $scope.products[index].newsinglepcPric = marginedprice - Math.ceil((marginedprice * $scope.single_pc_discount) / 100);
            }
            else if (vm.is_percentage == false) {
                marginedprice = price + vm.single_piece_price_fix;
                $scope.products[index].newsinglepcPric = marginedprice - Math.ceil((marginedprice * $scope.single_pc_discount) / 100);
            }
            $scope.products[index].newFullcatalogPric = Math.ceil(price - (price * $scope.full_catalog_discount) / 100);


            console.log(price + ' + ' + vm.single_piece_price_percentage + "% or " + vm.single_piece_price_fix + 'rs - ' + (price * $scope.single_pc_discount) / 100 + ' = ' + $scope.products[index].newsinglepcPric);
            console.log($scope.products[index].newFullcatalogPric);
        }
        
        
    }
    

   
          
}
})();
