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


/*angular.module('app.catalog').directive('uiSelectRequired', function () { return { require: 'ngModel', link: function (scope, elm, attrs, ctrl) { ctrl.$validators.uiSelectRequired = function (modelValue, viewValue) {
            var determineVal;
            if (angular.isArray(modelValue)) {
                determineVal = modelValue;
            } else if (angular.isArray(viewValue)) {
                determineVal = viewValue;
            } else {
                return false;
            }

            return determineVal.length > 0;
        };
    }
};
});*/

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


    CatalogAddUpdateController.$inject = ['$http', '$resource', 'v2ProductsMyDetails', 'v2BulkUpdateProductSeller', 'v2CategoryEavAttribute', 'v2brandwisediscount', 'Promotions',  'Brand' ,'Catalog', 'v2Products', 'v2ProductsPhotos', 'CatalogUploadOptions', 'Product', 'v2Category', 'Company', 'BuyerList', 'SalesOrders', 'toaster', 'ngDialog', '$scope', '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', 'Upload', '$filter', '$cookies', '$localStorage', 'SweetAlert', 'sharedProperties'];
    function CatalogAddUpdateController($http, $resource, v2ProductsMyDetails, v2BulkUpdateProductSeller, v2CategoryEavAttribute, v2brandwisediscount, Promotions, Brand, Catalog, v2Products, v2ProductsPhotos, CatalogUploadOptions, Product, v2Category, Company, BuyerList, SalesOrders, toaster, ngDialog, $scope, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, Upload, $filter, $cookies, $localStorage, SweetAlert, sharedProperties) {
        CheckAuthenticated.check();        
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
        var vm = this;

        $scope.catalog.dont_allow_crop = false;
        $scope.catalog.sell_full_catalog = true;
        $scope.catalog.cropallow = !$scope.catalog.dont_allow_crop;
        $scope.CatNonCtalogUploaded = false;
        $scope.catalog.noOfDesigns = 3;
        console.log($scope.CatNonCtalogUploaded);

        vm.single_piece_price_percentage = 0;
        vm.single_piece_price = 0;
        vm.is_percentage = true;
        vm.max_margin_percentage = 10;
        vm.max_margin_rs = 60;
        $scope.catalog.number_pcs_design_per_set = 1;

        $scope.show_size_flag = false;
        $scope.show_stitching_flag = false;
        $scope.show_numberpcs_flag = false;
        $scope.attribute_list = [];

        $scope.single_pc_discount = 0;
        $scope.full_catalog_discount = 0;

        
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

        $scope.cataloguploadoptions_isadded = true;
        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
        $scope.is_staff   = localStorage.getItem('is_staff');
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

                    if ($scope.catalog.price_type == 'single')
                    {
                        product.price = $scope.catalog.price;
                    }
                    
                    
                    //product.public_price = $scope.catalog.public_price;
                    product.public_price = $scope.catalog.price;
                    /* product.work = $scope.catalog.work;
                    product.fabric = $scope.catalog.fabric; */
                    product.catalog = $scope.catalogId;
                    product.sort_order = order_no;
                    
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
          
        $scope.uploadCatalogImage = function (file)
        {
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
                  
                  //var fileFromBlob = new File([blob], $scope.catalog.title+".jpg", { type: "image/jpeg", lastModified: Date.now() });
                  //console.log('catalog image file',fileFromBlob);
                  
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
            console.log(selectedbrand);
            v2brandwisediscount.query({ 'cid': $scope.company_id },
            function (success)
            {
                $scope.discountRuleList = success;

                if (success.length > 0)
                {
                    for (var index = 0; index < $scope.discountRuleList.length; index++)
                    {
                        console.log($scope.discountRuleList[index].brands);

                        if ($scope.discountRuleList[index].brands.indexOf(selectedbrand) >=0)
                        {
                            $scope.single_pc_discount = parseFloat($scope.discountRuleList[index].single_pcs_discount);
                            $scope.full_catalog_discount = parseFloat($scope.discountRuleList[index].cash_discount);

                            console.log($scope.single_pc_discount + ' , ' + $scope.full_catalog_discount);
                            
                        }
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
                    /*$scope.show_size_flag = false;
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
                    }  */

                    // Mavaji - added below code to generalize get eavdata to update catalog form
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

        $scope.uploadSetFiles = function (files,set_index)
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
            if($scope.products.length == 0){
            order_no = $scope.order_no_live;
            first_upload = true;
            }
            angular.forEach(files, function(file, key) {
               
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
                    var filename = file.name.replace('.jpg','').replace('.JPG','').replace('.png','').replace('.PNG','').replace('.jpeg','').replace('.JPEG','').replace(',','');
                    
                    //var filename = file.name.replace('.jpg','').replace('.JPG','').replace('.png','').replace('.PNG','').replace('.jpeg','').replace('.JPEG','').replace(/^[0!@#$%&*<>?()=]+/,'').replace(' ','').replace(',','').replace(';','').replace('\"','').replace('\'','');
                    filename = filename.replace(/^[0!@#$%&*<>?()=]+/,'').replace(' ','').replace(';','').replace('\"','').replace('\'','');
                    /*
                    product.title = filename
                    product.sku =  filename;
                    product.sku_order = product.sku;
                    
                    product.price = $scope.catalog.price;
                    
                    product.public_price = $scope.catalog.price;
                    product.catalog = $scope.catalogId;  */
                    product.sort_order = order_no;
                    
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
                        console.log(set_index);
                        $scope.setTobeAdded[set_index].products = $scope.products; 
                    }
                    
                }

            });
            
            vm.products_count = files_length;
        };

        $scope.setTobeAdded2 = JSON.parse(localStorage.getItem('setTobeAdded2')) || "";

        if($scope.setTobeAdded2.length > 0)
        {
            $scope.setTobeAdded = $scope.setTobeAdded2;
            console.log($scope.setTobeAdded2);

            localStorage.setItem('setTobeAdded2', JSON.stringify([]));
        }
        else
        {
            //console.log($scope.setTobeAdded2);
            $scope.setTobeAdded = [{ 'title': null, 'enable_duration': null }];
        }
          

        $scope.AddAnotherSet  = function()
        {
            var tempset = {};
            var l = $scope.setTobeAdded.length;
            if(l < 1){
                $scope.setTobeAdded = [{'title': null, 'enable_duration': null }];
            }
            console.log($scope.setTobeAdded[l-1]);
            if($scope.catalog.multi_set_type == 'color_set'){
                if($scope.setTobeAdded[l-1].title && $scope.setTobeAdded[l-1].color && $scope.setTobeAdded[l-1].enable_duration && $scope.setTobeAdded[l-1].thumbnails)
                {
                tempset.title = '';
                tempset.enable_duration ='';
                $scope.setTobeAdded.push(tempset);
                console.log($scope.setTobeAdded);
                }
            }
            else{
                if($scope.setTobeAdded[l-1].title && $scope.setTobeAdded[l-1].enable_duration && $scope.setTobeAdded[l-1].thumbnails)
                {
                tempset.title = '';
                tempset.enable_duration ='';
                $scope.setTobeAdded.push(tempset);
                console.log($scope.setTobeAdded);
                } 
            }
        }

        $scope.deleteSet = function(index)
        {
        $scope.setTobeAdded.splice(index,1);
        console.log($scope.setTobeAdded);
        }

        $scope.AddSetMatching = function()
        {
            //$scope.catalog.catalog_type = 'noncatalog';
            $scope.catalog.set_type = 'multi_set';

            //console.log($scope.catalog);
            console.log($scope.setTobeAdded);
            var set_length = $scope.setTobeAdded.length;
            if(set_length < 1)
            {
            vm.errortoaster = {
                        type:  'error',
                        title: 'Set',
                        text:  'Please enter set details.'
                    };
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
                    return;
            }
            else
            {
            if($scope.catalog.multi_set_type == 'color_set'){
                if(!$scope.setTobeAdded[set_length-1].color || !$scope.setTobeAdded[set_length-1].title || !$scope.setTobeAdded[set_length-1].enable_duration  || !$scope.setTobeAdded[set_length-1].thumbnails){
                vm.errortoaster = {
                        type:  'error',
                        title: 'Set',
                        text:  'Please complete set details.'
                    };
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
                    return;
                }
            }
            else{
                if(!$scope.setTobeAdded[set_length-1].title || !$scope.setTobeAdded[set_length-1].enable_duration  || !$scope.setTobeAdded[set_length-1].thumbnails){
                vm.errortoaster = {
                        type:  'error',
                        title: 'Set',
                        text:  'Please complete set details.'
                    };
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
                    return;
                }
            }
            }
            $scope.catalog.eav = {};
            for (var i = 0; i < $scope.attribute_list.length; i++)
            {
                //console.log($scope.attribute_list[i].attribute_slug);
                //console.log($scope.catalog[$scope.attribute_list[i].attribute_slug]); //required or not is decided dynamically
                /*if ($scope.attribute_list[i].attribute_slug == 'style')
                {
                    continue;
                }*/
                // if ($scope.attribute_list[i].attribute_slug == 'size' && !$scope.catalog.sell_full_catalog) {
                // in setmatching - need to ask size when adding catalog details
                 /*if ($scope.attribute_list[i].attribute_slug == 'size') {
                    continue;
                }
                else*/ if ($scope.catalog[$scope.attribute_list[i].attribute_slug] && $scope.catalog[$scope.attribute_list[i].attribute_slug].length > 0) {
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
            
            if($scope.catalog.other)
                $scope.catalog.eav["other"] = $scope.catalog.other;

            /*if($scope.catalog.style)
                $scope.catalog.eav["style"] = $scope.catalog.style;*/

            $scope.catalog.eav = JSON.stringify($scope.catalog.eav);
            //    console.log($scope.catalog.eav);
    
            $(".modelform").addClass(progressLoader()); 
            
            vm.set_params = {"cid":$scope.company_id, "title":$scope.catalog.title,"brand":$scope.catalog.brand, "category": $scope.catalog.category,  "view_permission": $scope.catalog.view_permission, "catalog_type": 'noncatalog', "eav": $scope.catalog.eav, 'set_type': $scope.catalog.set_type, 'multi_set_type': $scope.catalog.multi_set_type, 'photoshoot_type': $scope.catalog.photoshoot_type, 'price_per_design': $scope.catalog.price_per_design, 'no_of_pcs_per_design': $scope.catalog.no_of_pcs_per_design };
            
            if($scope.catalog.catalog_type != 'catalog' && $scope.catalog.brand == undefined){
                delete vm.set_params["brand"];
            }
            
            console.log(vm.set_params);
            
            var total_photos = 0;
            var total_photos_uploaded_successfully = 0;
            for(i = 0; i < $scope.setTobeAdded.length; i++)
            {
				total_photos += $scope.setTobeAdded[i].products.length
			}
						
            
            Catalog.save(vm.set_params,function(success)
            {
                    $scope.catalogId = success.id; 
                    $scope.catalogData = success;                  
                    $scope.order_no_live = 1;
                    var i = 0;
                    var k = 0;
                    var m = 0;
                    $scope.newset = [];
                    for(i = 0; i < $scope.setTobeAdded.length; i++)
                    {
                        var today = new Date(); 
                        var expiry_date = today.setDate(today.getDate() + $scope.setTobeAdded[i].enable_duration);
                        expiry_date = formatDate(expiry_date) + "T23:59:59Z"
                        
                        var temp = {};
                        temp.sku = $scope.setTobeAdded[i].title;
                        temp.title = $scope.setTobeAdded[i].title;
                        temp.sort_order = i+1;
                        temp.product_type = "set";
                        // Mavaji - don't ask sizes while adding catalog details (eav) - as per Jay Patel's mail of Feb 19, 2019, 3:32 PM
                        temp.available_sizes = $scope.catalog.size;
                        if($scope.catalog.multi_set_type == 'color_set'){
                            temp.set_type_details = $scope.setTobeAdded[i].color;
                        }
                        temp.catalog = $scope.catalogId;
                        if($scope.setTobeAdded[i].products.length > 0){
                            temp.image = blobImageRenameForExtenstion($scope.setTobeAdded[i].products[0].uncropped, $scope.setTobeAdded[i].products[0].image, temp.sort_order+".jpg");
                        }
                        temp.expiry_date = expiry_date;
                        
                        console.log(temp);
                        
                        var temp_json = {};
                        //$scope.newset[k].products = $scope.setTobeAdded[i].products;
                        temp_json.products = $scope.setTobeAdded[i].products;
                        $scope.newset.push(temp_json);
                        //console.log($scope.newset[k]);
                        
                        v2Products.save(temp,
                            function(success_product){
                                $scope.productId = success_product.id;
                                console.log("iiiiiiiiiiiii  kkkkkkkkkk = " + i +"   "+ k);
                                $scope.l = $scope.newset[k].products.length;
                                //console.log($scope.l);
                                for(var j = 0; j < $scope.newset[k].products.length; j++){
                                    var temp_product = {};
                                    
                                    temp_product.product = $scope.productId;
                                    if(j == 0)
                                    temp_product.set_default = true;
                                    else
                                    temp_product.set_default = false;
                                    temp_product.sort_order = j+1;
                                
                                    temp_product.image = blobImageRenameForExtenstion($scope.newset[k].products[j].uncropped, $scope.newset[k].products[j].image, temp_product.sort_order+".jpg");
                        
                                    v2ProductsPhotos.save(temp_product,
                                    function(success_productphoto){
                    
                                        $scope.l = $scope.l - 1;
                                        //console.log("lllllllll "+$scope.l);
                                        if($scope.l == 0){
                                        m++;
                                        }
                                        
                                        total_photos_uploaded_successfully += 1
                                        
                                        console.log("total_photos_uploaded_successfully " + total_photos_uploaded_successfully + " total_photos = "+total_photos);
										//if($scope.setTobeAdded.length == i && j == success_productphoto.sort_order)
										if(total_photos_uploaded_successfully == total_photos){
											var t = i+1;
											$(".modelform").removeClass(progressLoader());
											vm.successtoaster = {
												type:  'success', 
												title: 'Success',
												text:  'Set detail '+t+' added successfully.'
											};
											toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
											ngDialog.close();
											$scope.reloadData();
										}
											
                                    });
                                } 
                                k++;
                        });
                        //console.log("mmmmmmmmmmmm: " + m + "   "+$scope.setTobeAdded.length);
                        //  if($scope.setTobeAdded.length == m){
                            /*var t = i+1;
                            $(".modelform").removeClass(progressLoader());
                            vm.successtoaster = {
                                type:  'success', 
                                title: 'Success',
                                text:  'Set detail '+t+' added successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            ngDialog.close();
                            $scope.reloadData();*/
                        //  }
                    }
                   
                });  

          }


        $scope.AddSettoScreen = function ()
        {
        
            $scope.catalog.set_type = 'multi_set';
            //console.log($scope.catalog);
            console.log($scope.setTobeAdded);
            var set_length = $scope.setTobeAdded.length;
            if (set_length < 1)
            {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Set',
                    text: 'Please enter set details.'
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                return;
            }
            else
            {
                if ($scope.catalog.multi_set_type == 'color_set')
                {
                    if(!$scope.setTobeAdded[set_length - 1].color || !$scope.setTobeAdded[set_length - 1].title || !$scope.setTobeAdded[set_length - 1].enable_duration || !$scope.setTobeAdded[set_length - 1].thumbnails) {
                        vm.errortoaster = {
                            type: 'error',
                            title: 'Set',
                            text: 'Please complete set details.'
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                        return;
                    }
                }
                else
                {
                    if(!$scope.setTobeAdded[set_length - 1].title || !$scope.setTobeAdded[set_length - 1].enable_duration || !$scope.setTobeAdded[set_length - 1].thumbnails) {
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

            var i = 0;
            var k = 0;
            var m = 0;
            $scope.newset = [];
            for (i = 0; i < $scope.setTobeAdded.length; i++)
            {

                var today = new Date();
                var expiry_date = today.setDate(today.getDate() + $scope.setTobeAdded[i].enable_duration);
                expiry_date = formatDate(expiry_date) + "T23:59:59Z"

                var temp = {};
                temp.sku = $scope.setTobeAdded[i].title;
                temp.title = $scope.setTobeAdded[i].title;
                temp.sort_order = i + 1;
                temp.product_type = "set";
                if ($scope.catalog.multi_set_type == 'color_set')
                {
                    temp.set_type_details = $scope.setTobeAdded[i].color;
                }
                temp.catalog = $scope.catalogId;
                if ($scope.setTobeAdded[i].products.length > 0) {
                    temp.image = blobImageRenameForExtenstion($scope.setTobeAdded[i].products[0].uncropped, $scope.setTobeAdded[i].products[0].image, temp.sort_order + ".jpg");
                }
                temp.expiry_date = expiry_date;

                console.log(temp);

                var temp_json = {};
                //$scope.newset[k].products = $scope.setTobeAdded[i].products;
                temp_json.products = $scope.setTobeAdded[i].products;
                $scope.newset.push(temp_json);
                console.log($scope.newset[k]);
                v2Products.save(temp,function (success_product)
                {
                    $scope.productId = success_product.id;
                    console.log("iiiiiiiiiiiii  kkkkkkkkkk = " + i + "   " + k);
                    $scope.l = $scope.newset[k].products.length;
                    console.log($scope.l);
                    for (var j = 0; j < $scope.newset[k].products.length; j++)
                    {

                        var temp_product = {};

                        temp_product.product = $scope.productId;
                        if (j == 0)
                            temp_product.set_default = true;
                        else
                            temp_product.set_default = false;
                        temp_product.sort_order = j + 1;

                        temp_product.image = blobImageRenameForExtenstion($scope.newset[k].products[j].uncropped, $scope.newset[k].products[j].image, temp_product.sort_order + ".jpg");

                        v2ProductsPhotos.save(temp_product,
                            function (success_productphoto)
                            {

                                $scope.l = $scope.l - 1;
                                console.log("lllllllll " + $scope.l);
                                if ($scope.l == 0) {
                                    m++;
                                }
                            });
                    }
                    k++;
                });
                console.log("mmmmmmmmmmmm: " + m + "   " + $scope.setTobeAdded.length);
                
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

        }

        $scope.UpdateSettoScreen = function ()
        {
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
            else
            {
                //validation removed in update set https://wishbook.atlassian.net/browse/WB-4706
            }
            console.log($scope.catalogId);
            console.log($scope.setId);

            $(".modelform2").addClass(progressLoader());

            var i = 0;
            var k = 0;
            var m = 0;
            $scope.newset = [];
            for (i = 0; i < $scope.setTobeAdded.length; i++)
            {
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

                if ($scope.setTobeAdded[i].products)
                {
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

               
                v2Products.patch(temp, function (success_product)
                {
                    console.log($scope.setTobeAdded[i]);
                    
                    if (temp_json)
                    {
                        $scope.productId = success_product.id;
                        console.log("iiiiiiiiiiiii  kkkkkkkkkk = " + i + "   " + k);
                        $scope.l = $scope.newset[k].products.length;
                        console.log($scope.l);
                        for (var j = 0; j < $scope.newset[k].products.length; j++)
                        {
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
                    else
                    {
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
            /*if($scope.product_price_type == 'single'){
                vm.catalogoption_params['private_single_price'] = $scope.catalog.price;
                vm.catalogoption_params['public_single_price'] = $scope.catalog.price;
              
            }
            else {
                vm.catalogoption_params['private_single_price'] = null;
                vm.catalogoption_params['public_single_price'] = null;
            }

            console.log($scope.catalog);
                if($scope.catalog.fabric == '' || $scope.catalog.fabric == null){
                
                vm.errortoaster = {
                    type:  'error',
                    title: 'Fabric',
                    text:  'Please select fabric.'
                };
                
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
                
                return;
            }
            if($scope.catalog.work == '' || $scope.catalog.work == null){
                
                vm.errortoaster = {
                    type:  'error',
                    title: 'Work',
                    text:  'Please select work.'
                };    
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                return;
            }*/
            //vm.catalogoption_params['without_sku'] = $scope.without_sku;
            /*   if($scope.catalog.work != null){
                vm.catalogoption_params['work'] = $scope.catalog.work.toString();
            }
            if($scope.catalog.fabric != null){
                vm.catalogoption_params['fabric'] = $scope.catalog.fabric.toString();
            }*/

            
            
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
            
            

            /*$scope.catalog.eav = {"fabric": $scope.catalog.fabric, "work": $scope.catalog.work};

            if($scope.show_size_flag == true){
                if($scope.catalog.size == '' || $scope.catalog.size == null){  
                vm.errortoaster = {
                    type:  'error',
                    title: 'Size',
                    text:  'Please select size.'
                };    
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                return;
                }
                $scope.catalog.eav["size"] = $scope.catalog.size;
            }

            if($scope.show_stitching_flag == true){
                if($scope.catalog.stitching_type == '' || $scope.catalog.stitching_type == null){  
                vm.errortoaster = {
                    type:  'error',
                    title: 'Stitching Type',
                    text:  'Please select stitching type.'
                };    
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                return;
                }
                $scope.catalog.eav["stitching_type"] = $scope.catalog.stitching_type;
            }

            if($scope.show_numberpcs_flag == true){
                if($scope.catalog.number_pcs_design_per_set == '' || $scope.catalog.number_pcs_design_per_set == null){  
                vm.errortoaster = {
                    type:  'error',
                    title: 'Pieces/Designs',
                    text:  'Please select pieces/design.'
                };    
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                return;
                }
                $scope.catalog.eav["number_pcs_design_per_set"] = $scope.catalog.number_pcs_design_per_set;

            }*/


            $scope.catalog.eav = {};
            for(var i = 0; i < $scope.attribute_list.length; i++)
            {
                console.log($scope.attribute_list[i].attribute_slug);
                console.log($scope.catalog[$scope.attribute_list[i].attribute_slug]); //required or not is decided dynamically
                
               // if ($scope.attribute_list[i].attribute_slug == 'size' && !$scope.catalog.sell_full_catalog)
               // Mavaji - don't ask sizes while adding catalog details (eav) - as per Jay Patel's mail of Feb 19, 2019, 3:32 PM
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
            vm.params = {"cid":$scope.company_id, "title":$scope.catalog.title,"brand":$scope.catalog.brand, "category": $scope.catalog.category, "sell_full_catalog":  $scope.catalog.sell_full_catalog, "view_permission": $scope.catalog.view_permission, "catalog_type": $scope.catalog.catalog_type, "eav": $scope.catalog.eav, "expiry_date": expiry_date};
            if($scope.catalog.dispatch_date){
                vm.params['dispatch_date'] = dispatchdate;
            }
            if(!$scope.catalog.cropallow)
            {
                //vm.params["thumbnail"] = Upload.dataUrltoBlob($scope.catalog.uncropped, $scope.catalog.thumbnail);
                vm.params["thumbnail"] = blobImageRenameForExtenstion($scope.catalog.uncropped, $scope.catalog.thumbnail, $scope.catalog.title+".jpg");
                console.log('uncropped file',  vm.params["thumbnail"]);
            }
            else
            {
                //vm.params["thumbnail"] = Upload.dataUrltoBlob(vm.croppedDataUrl, $scope.catalog.thumbnail);
                vm.params["thumbnail"] = blobImageRenameForExtenstion(vm.croppedDataUrl, $scope.catalog.thumbnail, $scope.catalog.title+".jpg");
                console.log('crop file',  vm.params["thumbnail"]);
            }

            // WB-3817  Seller panel : remove set single pc margin when become seller, add and update catalog etc  
            /* if($scope.catalog.sell_full_catalog == false){
                if($scope.catalog.is_percentage == true){
                    vm.params["single_piece_price_percentage"] = $scope.catalog.single_piece_price_percentage;
                }
                else{
                    vm.params["single_piece_price"] = $scope.catalog.single_piece_price; 
                }
            }*/
            if($scope.catalog.catalog_type == 'noncatalog' && $scope.catalog.brand == undefined){
                delete vm.params["brand"];
            }
            console.log(JSON.stringify(vm.params));
            Catalog.save(vm.params,
            function(success)
            {
                    $(".modelform").removeClass(progressLoader());
                    
                    $scope.CatNonCtalogUploaded = true;
                    $scope.catalogId = success.id; 
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
                    $scope.reloadData();

                    setTimeout(function(){ 
                        $('.nexttoproduct').trigger('click');
                        $scope.update_flag = true;
                 }, 1000);
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

        /* $rootScope.$on("CallUpdateCatalogForm", function(){
           $scope.UpdateCatalogForm();
        }); */
        
        $scope.UpdateCatalogForm = function ()
        {
            console.log($scope.catalog_id);
            //alert(JSON.stringify(vm.selected));
            vm.catalog_products = [];
           
                Catalog.get({'id': $scope.catalog_id, 'cid':$scope.company_id, 'expand': true}).$promise.then(function(result)
                {
                    // Catalog.get({'id': vm.true_key, 'cid':$scope.company_id}).$promise.then(function(result){
                    //vm.catalog = result;
                    $scope.catalog.title = result.title;
                    //$scope.catalog.brand = result.brand;
                    if(result.brand != null)
                    {
                        $scope.catalog.brand = result.brand.id;
                    }
                    $scope.getBrandDiscount($scope.catalog.brand);

                    $scope.catalog.category = result.category;
                    $scope.catalog.sell_full_catalog=  result.sell_full_catalog;
                    $scope.catalog.view_permission =  result.view_permission;
                    $scope.catalog_eav_data  = result.eavdata;
                    $scope.CategoryChanged(result.category);  

                    // Mavaji - commented below code, because added generalize code to  get eavdata to update catalog form in 'CategoryChanged'

                    /*$scope.catalog.work = result.eavdata.work;
                    $scope.catalog.fabric = result.eavdata.fabric;
                    $scope.catalog.occasion_wear = result.eavdata.occasion_wear;
                    $scope.catalog.style = result.eavdata.style;
                    $scope.catalog.size = result.eavdata.size;
                    $scope.catalog.stitching_type = result.eavdata.stitching_type;
                    $scope.catalog.number_pcs_design_per_set = result.eavdata.number_pcs_design_per_set; */
                    $scope.catalog.other = result.eavdata.other;
                    
                    $scope.catalog.single_piece_price = result.single_piece_price;
                    $scope.catalog.single_piece_price_percentage = result.single_piece_price_percentage;
                    if(result.dispatch_date != null){
                      $scope.catalog.dispatch_date = new Date(result.dispatch_date);
                      $scope.catalog.dispatch_date = formatDate($scope.catalog.dispatch_date);
                    }
                    $scope.catalog.catalog_type = result.catalog_type;
                    if($scope.catalog.single_piece_price_percentage == null)
                    {
                        $scope.catalog.is_percentage = false;
                        vm.is_percentage = false;
                        $scope.catalog.single_piece_price = parseFloat(result.single_piece_price);
                        vm.single_piece_price = parseFloat(result.single_piece_price);
                    }
                    else{
                        $scope.catalog.is_percentage = true;
                        vm.is_percentage = true;
                        $scope.catalog.single_piece_price_percentage = parseFloat(result.single_piece_price_percentage);
                        vm.single_piece_price_percentage = parseFloat(result.single_piece_price_percentage);
                    }

                    if(result.price_range.indexOf('-') > 0){
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

                    

                    $scope.catalogImage = result.thumbnail.thumbnail_medium;

                    vm.products = result.products;
                    var i = 0;
                    for(i = 0; i < vm.products.length; i++ )
                    {
                        //  if($scope.catalog.view_permission == 'push')
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

                    console.log(vm.catalog_products);

                    $scope.order_no_live = result.max_sort_order + 1;
                
                    //$scope.image = result.thumbnail.full_size;
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
                    function(success)
                    {
                        if(success.length != 0){
                            if (success[0].public_single_price)
                            {
                                $scope.catalog.price_type = 'single';
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
                    //$scope.OpenCatalogForm(catArr);
                });
        };


        $scope.UpdateCatalog = function () {
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
            /*  if($scope.catalog.fabric == '' || $scope.catalog.fabric == null){
                
                vm.errortoaster = {
                    type:  'error',
                    title: 'Fabric',
                    text:  'Please select fabric.'
                };
                
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
                
                return;
            }
            if($scope.catalog.work == '' || $scope.catalog.work == null){
                
                vm.errortoaster = {
                    type:  'error',
                    title: 'Work',
                    text:  'Please select work.'
                };    
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                return;
            }*/


            /* if($scope.catalog.single_piece_price_percentage == undefined &&  $scope.catalog.sell_full_catalog == false && $scope.catalog.is_percentage == true){
               vm.errortoaster = {
                       type:  'error',
                       title: 'Percentage Margin',
                       text:  'Please set margin below 20%.'
                   };   
                   toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                   return;
             }*/
            ////$scope.category = $('#tree_2').jstree('get_bottom_checked');
            //console.log($scope.catalog.thumbnail);
            /*if($scope.catalog.thumbnail != null){
               alert("save image");
              $scope.params = {"cid":$scope.company_id, "id": $scope.catalogId, "title":$scope.catalog.title,"brand":$scope.catalog.brand,"thumbnail": Upload.dataUrltoBlob(vm.croppedDataUrl, $scope.catalog.thumbnail), "category": $scope.category, "sell_full_catalog":  $scope.catalog.sell_full_catalog}; //$scope.image
            }
            else{
              $scope.params = {"cid":$scope.company_id, "id": $scope.catalogId, "title":$scope.catalog.title,"brand":$scope.catalog.brand,"category": $scope.category, "sell_full_catalog":  $scope.catalog.sell_full_catalog};
            }*/

            /*  $scope.catalog.eav = {"fabric": $scope.catalog.fabric, "work": $scope.catalog.work};

            if($scope.show_size_flag == true){
              if($scope.catalog.size == '' || $scope.catalog.size == null){  
                vm.errortoaster = {
                    type:  'error',
                    title: 'Size',
                    text:  'Please select size.'
                };    
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                return;
              }
              $scope.catalog.eav["size"] = $scope.catalog.size;
            }

            if($scope.show_stitching_flag == true){
              if($scope.catalog.stitching_type == '' || $scope.catalog.stitching_type == null){  
                vm.errortoaster = {
                    type:  'error',
                    title: 'Stitching Type',
                    text:  'Please select stitching type.'
                };    
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                return;
              }
              $scope.catalog.eav["stitching_type"] = $scope.catalog.stitching_type;
            }

            if($scope.show_numberpcs_flag == true){
              if($scope.catalog.number_pcs_design_per_set == '' || $scope.catalog.number_pcs_design_per_set == null){  
                vm.errortoaster = {
                    type:  'error',
                    title: 'Pieces/Designs',
                    text:  'Please select pieces/design.'
                };    
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                return;
              }
              $scope.catalog.eav["number_pcs_design_per_set"] = $scope.catalog.number_pcs_design_per_set;

            }*/
            $scope.catalog.eav = {};

            for (var i = 0; i < $scope.attribute_list.length; i++)
            {
                console.log($scope.attribute_list[i].attribute_slug);
                console.log($scope.catalog[$scope.attribute_list[i].attribute_slug]);
                /*if ($scope.attribute_list[i].attribute_slug == 'style') required or not is decided dynamically
                {
                    continue;
                }*/
                //if ($scope.attribute_list[i].attribute_slug == 'size' && !$scope.catalog.sell_full_catalog)
                if ($scope.attribute_list[i].attribute_slug == 'size') {
                    continue;
                }
                else if (($scope.attribute_list[i].attribute_datatype == 'float' || $scope.attribute_list[i].attribute_datatype == 'int') && $scope.catalog[$scope.attribute_list[i].attribute_slug] && $scope.catalog[$scope.attribute_list[i].attribute_slug] > 0) {
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
                //$scope.catalog.eav["style"] = "";
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
                /*if($scope.catalogData.view_permission == 'public'){
                  vm.catalogoption_params['public_single_price'] = $scope.catalog.public_price;
                } */
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
            /* if($scope.catalog.sell_full_catalog == false){
                if($scope.catalog.is_percentage == true){
                    vm.params["single_piece_price_percentage"] = $scope.catalog.single_piece_price_percentage;
                }
                else{
                    vm.params["single_piece_price"] = $scope.catalog.single_piece_price; 
                }
            }*/
            console.log($scope.catalog.brand);
            if ($scope.catalog.catalog_type == 'noncatalog' && $scope.catalog.brand == undefined) {
                delete vm.params["brand"];
            }
            $(".modelform").addClass(progressLoader());
            Catalog.patch(vm.params,
                function (success) {

                    var i = 0;
                    if (vm.catalog_products)
                    {
                        for (i = 0; i < vm.catalog_products.length; i++) {
                            if ($scope.catalog.price_type == 'single') {
                                vm.catalog_products[i].price = $scope.catalog.price;
                                vm.catalog_products[i].public_price = $scope.catalog.price;
                                /* if($scope.catalog.view_permission == 'public'){
                                  vm.catalog_products[i].public_price = $scope.catalog.public_price;
                                } */
                            }
                            else {
                                vm.catalog_products[i].public_price = vm.catalog_products[i].price
                            }

                            Product.patch(vm.catalog_products[i],
                                function (success) {
                                    
                                });
                        }
                        
                    }

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






        $scope.UpdateQualityForm = function (qualityid, bundleid) {
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

      
        $scope.UpdateInventorySubmit = function(){
            console.log($scope.catalog_id);
            //{ "products":[{"product_id":21819, "available_sizes": "S,M,L,XL", "is_enable":true}] }
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
                    $scope.params = { "products":[{"product_id":$scope.catalog_id, "available_sizes": $scope.available_sizes, "is_enable": $scope.is_enable}] };
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
                    
                    $scope.params = { "products": $scope.bulk_products }
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
                    $scope.params = { "products":[{"product_id":$scope.catalog_id, "is_enable": $scope.is_enable}] }
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
                    
                    $scope.params = { "products": $scope.bulk_products }
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

            $scope.UpdateInventorySubmit()
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
       
          
    $scope.product = {};

    $scope.catalog.price_type = 'single';
    $scope.product_price_type = 'single';

    $scope.product.dont_allow_crop = false;
    $scope.without_sku = false;
    $scope.singleprice = false;
    //$scope.without_price = false;

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

    $scope.singlePriceChanged = function()
    {
        for (var i = $scope.products.length - 1; i >= 0; i--)
        {
            $scope.products[i].price = $scope.catalog.price;
            $scope.products[i].newsinglepcPric = $scope.catalog.price;
        }
    }

    $scope.applyMarginToallpcs = function ()
    {
        for (var i = $scope.products.length - 1; i >= 0; i--)
        {
            if ($scope.product_price_type === 'individual' && $scope.product_price_type == 'single' && $scope.catalog.price)
            {
                $scope.products[i].price = $scope.catalog.price;
            }

            if (vm.is_percentage == true) {
                $scope.products[i].newsinglepcPric = ($scope.products[i].price + ($scope.products[i].price * vm.single_piece_price_percentage) / 100 - ($scope.products[i].price * $scope.single_pc_discount) / 100).toFixed(2);
            }
            else if (vm.is_percentage == false) {
                $scope.products[i].newsinglepcPric = ($scope.products[i].price + vm.single_piece_price - ($scope.products[i].price * $scope.single_pc_discount) / 100).toFixed(2);
            }
            $scope.products[i].newFullcatalogPric = ($scope.products[i].price - ($scope.products[i].price * $scope.full_catalog_discount) / 100).toFixed(2);

            console.log($scope.products[i].newsinglepcPric);
            console.log($scope.products[i].newFullcatalogPric);

        }
    }

    $scope.setNewPrice_Limit = function (price,index)
    {
        console.log(price+' '+index);
        
        if ($scope.products[0].price)
        {
            vm.current_price1 = parseFloat($scope.products[0].price);
            //vm.current_price2 = parseFloat($scope.products[$scope.products.length-1].price);
            vm.max_margin_rs = Math.max(vm.current_price1 * 0.10, 60);
            vm.max_margin_percentage = ((vm.max_margin_rs * 100) / vm.current_price1).toFixed(2);
        }
        console.log('margin limits are : '+vm.max_margin_rs + ' or ' + vm.max_margin_percentage);

        if (vm.is_percentage == true && vm.single_piece_price_percentage)
        {
            $scope.products[index].newsinglepcPric = (price + (price * vm.single_piece_price_percentage)/100 - (price * $scope.single_pc_discount) / 100).toFixed(2);
        }
        else if (vm.is_percentage == false && vm.single_piece_price)
        {
            $scope.products[index].newsinglepcPric = (price + vm.single_piece_price - (price * $scope.single_pc_discount) / 100).toFixed(2);
        }
        $scope.products[index].newFullcatalogPric = (price - (price * $scope.full_catalog_discount) / 100).toFixed(2);

        console.log($scope.products[index].newsinglepcPric);
        console.log($scope.products[index].newFullcatalogPric);
        
        
    }
    
    /*$scope.withoutPrice = function(flag){
    $scope.without_price = flag;
    }*/
    vm.CloseDialog = function () {
        ngDialog.close();
    };
    $scope.show_progress_text = false;
    $scope.AddProducts = function ()
    {
        
        if ($scope.products.length >0 && (vm.addproduct.$valid || $scope.without_sku == true))
        {    
            $scope.show_progress_text = true;
            $scope.size_mandatory = false;
            
            if ($scope.catalogId == undefined)
            {
                vm.errortoaster = {
                    type:  'error',
                    title: 'Failed',//toTitleCase(key),//
                    text:  "Please Upload Product first"
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                return;
            }
            
            if ($scope.products.length < $scope.catalog.noOfDesigns && !$scope.update_flag && $scope.catalog.catalog_type == 'catalog')
            {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Failed',//toTitleCase(key),//
                    text: "Please select " + $scope.catalog.noOfDesigns+" designs"
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                return;
            }

            for (var i = 0; i < $scope.attribute_list.length; i++)
            {
                console.log($scope.attribute_list[i].attribute_slug);
                console.log($scope.catalog[$scope.attribute_list[i].attribute_slug]);
                if ($scope.attribute_list[i].attribute_slug == 'size' && ($scope.attribute_list[i].is_required == true || $scope.attribute_list[i].is_required == 'true')) {
                    $scope.size_mandatory = true;
                }
            }

            if (!$scope.catalog.sell_full_catalog)
            { 
               
                if ($scope.size_mandatory)
                {
                    for (var i = 0; i < $scope.products.length; i++)
                    {
                        if (!$scope.products[i]["available_sizes"] || $scope.products[i]["available_sizes"].length < 1)
                        {
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

            }
            else{

                if ($scope.size_mandatory && $scope.update_flag == false)
                {
                    for (var i = 0; i < $scope.products.length; i++)
                    {
                       if (!$scope.catalog.size || $scope.catalog.size.length < 1)
                        {
                            vm.errortoaster = {
                                type: 'error',
                                title: 'Failed',
                                text: "Please select one or more sizes"
                            };
                            toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                            return;
                        }
                        else{
                          $scope.products[i]["available_sizes"] = $scope.catalog.size;
                        }
                    }

                }
            }

           
            if (!$scope.update_flag)
            {
                vm.params2 = { "cid": $scope.company_id };
                vm.params2['id'] = $scope.catalogId;

                if ($scope.catalog.sell_full_catalog == false && vm.is_percentage == false && vm.single_piece_price != undefined && vm.single_piece_price != null) {
                    vm.params2['single_piece_price'] = vm.single_piece_price;
                    //vm.params2['single_piece_price_percentage'] = 0;
                }
                if ($scope.catalog.sell_full_catalog == false && vm.is_percentage == true && vm.single_piece_price_percentage != undefined && vm.single_piece_price_percentage != null) {
                    vm.params2['single_piece_price_percentage'] = vm.single_piece_price_percentage;
                    //vm.params2['single_piece_price'] = 0;
                }
                console.log(vm.params2);
                Catalog.patch(vm.params2,
                    function (success) {
                        console.log(success);
                    });
            }
            
            //  BulkProduct.save($scope.products);
          $(".modelform2").addClass(progressLoader());

          vm.count = 0;
          vm.success_count = 0;
          vm.catalogoption_params = {};
          if($scope.product_price_type == 'single')
          {
            vm.catalogoption_params['private_single_price'] = $scope.catalog.price;
            vm.catalogoption_params['public_single_price'] = $scope.catalog.price;
            /* if($scope.catalogData.view_permission == 'public'){
              vm.catalogoption_params['public_single_price'] = $scope.catalog.public_price;
            } */ 
          }
          else
          {
            vm.catalogoption_params['private_single_price'] = null;
            vm.catalogoption_params['public_single_price'] = null;
          }
          vm.catalogoption_params['without_sku'] = $scope.without_sku;
        
          /* if($scope.catalog.work != null){
            vm.catalogoption_params['work'] = $scope.catalog.work.toString();
          }
          if($scope.catalog.fabric != null){
            vm.catalogoption_params['fabric'] = $scope.catalog.fabric.toString();
          } */

          vm.catalogoption_params['catalog'] = $scope.catalogId;
          if($scope.cataloguploadoptions_isadded == true)
          {
            vm.catalogoption_params['id'] = $scope.cataloguploadoptions_id;
          }

          //angular.forEach($scope.products, function(product, index) {
            for (var i = $scope.products.length - 1; i >= 0; i--)
            {
                vm.params =  {"title":$scope.products[i].sku, "catalog": [$scope.catalogId], "sort_order":$scope.products[i].sort_order} ;//"sku":$scope.products[i].sku, 
                if(!$scope.products[i].cropallow){
                    //vm.params["image"] = Upload.dataUrltoBlob($scope.products[i].uncropped, $scope.products[i].image);
                    vm.params["image"] = blobImageRenameForExtenstion($scope.products[i].uncropped, $scope.products[i].image, $scope.products[i].sort_order+".jpg");
                }
                else{
                    //vm.params["image"] = Upload.dataUrltoBlob($scope.products[i].imageCroped, $scope.products[i].image);
                    vm.params["image"] = blobImageRenameForExtenstion($scope.products[i].imageCroped, $scope.products[i].image, $scope.products[i].sort_order+".jpg");
                }
                
                if ($scope.without_sku==false)
                {
                    vm.params["sku"] = $scope.products[i].sku;
                }


                if ($scope.size_mandatory)
                {
                    vm.params["available_sizes"] = $scope.products[i].available_sizes;
                }
                
                if($scope.catalog.sell_full_catalog && $scope.update_flag){
                    delete vm.params["available_sizes"]; 
                }

                
                if(typeof $scope.products[i].price != "undefined"){
                    vm.params["price"] = $scope.products[i].price;
                    vm.params["public_price"] = $scope.products[i].price;
                }

                /*   if ($scope.products[i].work != null){
                    vm.params["work"] = $scope.products[i].work;
                }
                if ($scope.products[i].fabric != null){
                    vm.params["fabric"] = $scope.products[i].fabric;
                } */
                
                /*if($scope.catalogData.view_permission == "public" && typeof $scope.products[i].public_price != "undefined" && $scope.product_price_type != 'withoutprice'){//$scope.without_price==false
                    vm.params["public_price"] = $scope.products[i].public_price;
                } */
              
              $scope.totalproducts = $scope.products.length;
              $scope.completedproducts = 0;
                v2Products.save(vm.params,
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
            if(vm.addproduct.sku.$dirty)
            {
              vm.errortoaster = {
                        type:  'error',
                        title: 'Failed',
                        text:  'SKU is required & has character limit of 30.'
                    };
                    console.log(vm.errortoaster);
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
            } 
            else if ($scope.products.length == 0)
            {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Failed',
                    text: 'Select one or more products'
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
          
    }
})();
