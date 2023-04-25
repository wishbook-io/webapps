/*start - form wizard */
(function () {
    'use strict';
    angular
        .module('app.noncatalog')
        .directive('formWizard', formWizard);

    formWizard.$inject = ['$parse'];

    function formWizard($parse) {
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

        function Wizard(quantity, validate, element) {

            var self = this;
            self.quantity = parseInt(quantity, 10);
            self.validate = validate;
            self.element = element;

            self.init = function () {
                self.createsteps(self.quantity);
                self.go(1); // always start at fist step
                return self;
            };

            self.go = function (step) {

                if (angular.isDefined(self.steps[step])) {

                    if (self.validate && step !== 1) {
                        var form = $(self.element),
                            group = form.children().children('div').get(step - 2);

                        if (false === form.parsley().validate(group.id)) {
                            return false;
                        }
                    }

                    self.cleanall();
                    self.steps[step] = true;
                }
            };

            self.active = function (step) {
                return !!self.steps[step];
            };

            self.cleanall = function () {
                for (var i in self.steps) {
                    self.steps[i] = false;
                }
            };

            self.createsteps = function (q) {
                self.steps = [];
                for (var i = 1; i <= q; i++) self.steps[i] = false;
            };

        }
    }
})();

/* End - form wizard */


(function () {
    'use strict';

    angular
        .module('app.noncatalog')
        .controller('CatalogController', CatalogController);

    CatalogController.$inject = ['$http', '$resource', 'v2CategoryEavAttribute', 'v2ProductsMyDetails', '$stateParams', 'Brand', 'Catalog', 'v2Products', 'CatalogUploadOptions', 'Product', 'v2Category', 'v2BulkUpdateProductSeller', '$timeout', 'SalesOrders', 'toaster', 'ngDialog', '$scope', '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', 'Upload', '$filter', '$cookies', '$localStorage', 'SweetAlert', 'sharedProperties'];
    function CatalogController($http, $resource, v2CategoryEavAttribute, v2ProductsMyDetails, $stateParams, Brand, Catalog, v2Products, CatalogUploadOptions, Product, v2Category, v2BulkUpdateProductSeller, $timeout, SalesOrders, toaster, ngDialog, $scope, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, Upload, $filter, $cookies, $localStorage, SweetAlert, sharedProperties) {
        CheckAuthenticated.check();

        var vm = this;
        $scope.cataloguploadoptions_isadded = true;


        $scope.company_id = localStorage.getItem('company');

        vm.selected = {};
        vm.selectedFullJson = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};
        $scope.selectedProducts = [];

        $scope.update_flag = false;
        $scope.updateUI_called = false;

        $scope.category_filter_options = JSON.parse(localStorage.getItem('category_filter_options'));
        console.log($scope.category_filter_options);

        $scope.alrt = function () { alert("called"); };


        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';


        $scope.reloadData = function () {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);

            //UpdateCheckBoxUI();
            console.log('reload');
            UpdateCheckBoxUIfilters();
        }

        function callback(json) {
            console.log(json);
            if (json.recordsTotal > 0 && json.data.length == 0) {
                //vm.dtInstance.rerender();
                $state.go($state.current, {}, { reload: true });
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

        $scope.OpenProductsImages = function (id, prod_count,index) {
            $(".modelform3").addClass(progressLoader());
            $scope.catid = id;
            $scope.prod_count = prod_count;
            if (prod_count == 0) {
                $scope.OpenNoProductsAlert($scope.catid,index);
            }
            else {
                Catalog.get({ "id": id, "cid": $scope.company_id },
                    function (result)
                    {
                        $scope.catalogdata = result;
                        var bundle_product_id = result.product_id;

                        Catalog.get({ "id": id, "expand": "true", "cid": $scope.company_id },
                        function (success)
                        {
                            v2ProductsMyDetails.get({ "id": bundle_product_id },
                            function (response)
                            {
                                var productprices = response.products;
                                console.log(productprices);
                                var prices = {};
                                prices.fullprice = response.price;

                                for (var i = 0; i < productprices.length; i++)
                                {
                                    prices[productprices[i].id] = parseInt(productprices[i].price);
                                }

                                $(".modelform3").removeClass(progressLoader());
                                openPhotoSwipe($scope.catalogdata, success, prices);
                            });

                           
                        });
                    });

            }
        }

        $scope.OpenNoProductsAlert = function () {
            vm.errortoaster = {
                type: 'error',
                title: 'Empty Catalog',
                text: 'This catalog has no products. Please Add products'
            };

            toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            $(".modelform3").removeClass(progressLoader());

            //vm.selectedFullJson[vm.true_key][1]["catalog_id"];
            if (vm.selectedFullJson[index][1]["catalog_type"] != "mycatalog")
            {
                toaster.pop("error", "Failed", "Can not update a catalog that you are a seller");
            }
            else
            {
                //initiallizations
                $scope.catalogId = null;
                vm.catalog = {};
                vm.catalog.dont_allow_crop = false;
                vm.catalog.cropallow = !vm.catalog.dont_allow_crop;
                $scope.update_flag = true;
                $scope.products = [];
                $scope.catalog = {};
                $scope.catalog.enable_duration = 30;
                $scope.catalog.is_percentage = true;
                $scope.catalog.single_piece_price_percentage = 0;
                $scope.catalog.single_piece_price = 0;
                $scope.catalog.view_permission = 'public';
                $scope.catalog.catalog_type = 'catalog';


                console.log('openupdate called');
                sharedProperties.setType('update');
                $scope.catalog_id = catid
                ngDialog.openConfirm({
                    template: 'addcatalog',
                    scope: $scope,
                    className: 'ngdialog-theme-default',
                    closeByDocument: false
                });
                $scope.brands = Brand.query({ cid: $scope.company_id, type: "my", sub_resource: "dropdown" });
                $scope.topcategories = v2Category.query({ parent: 1 });
                $scope.catalog.topcategory = 10;
                v2CategoryEavAttribute.query(function (success) {
                    $scope.all_category_eav_data = success;
                    $scope.TopCategoryChanged(10);
                });
                $scope.photoshoot_types = [{ "id": 1, "photoshoot_type": "Live Model Photoshoot" }, { "id": 2, "photoshoot_type": "White Background or Face-cut" }, { "id": 3, "photoshoot_type": "Photos without Model" },]

            }

        }


        function imageHtml(data, type, full, meta)
        {
            if (!$scope.updateUI_called)
            {
                console.log('UpdateCheckBoxUI called');
                 
                UpdateCheckBoxUI();
                $('.contextAction ').css('display', 'none');
                $('.singlecontextAction').css('display', 'none');
                $('.buttons-print').addClass("nocontextAction");
                $scope.updateUI_called = true;
            }
            return '<div style="text-align: center;"><a ng-click="OpenProductsImages(' + full[1]['catalog_id'] + ',' + full[10] + ',' + full[0]+ ')" class="hvr-grow"><img class="loading" src="' + full[4] + '" /></a></div>';
        }
        
        function TitleLink(data, type, full, meta) {
           /* if (full[10] == 0) {
                return '<a ng-click="OpenNoProductsAlert()">' + full[3] + '</a>';
            }
            else {*/
                return '<a href="#/app/product/?type=mycatalog&id=' + full[1]['catalog_id'] + '&name=' + full[3] + '">' + full[3] + '</a>';
            //}
        }

        function BrandTitleLink(data, type, full, meta) {
            if (full[5] != null) {
                return '<a href="#/app/brand-catalogs/?brand=' + full[1]['brand_id'] + '&name=' + full[5] + '">' + full[5] + '</a>';
            }
            else {
                return '';
            }
        }

        $scope.openConfirm = function () {

            ngDialog.openConfirm({
                template: 'addcatalog',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };


       

        $scope.OpenCatalogForm = function (tempArr)
        {
            $scope.brands = Brand.query({ cid: $scope.company_id, type: "my", sub_resource: "dropdown" });
            /* EnumGroup.query({type:"fabric"}).$promise.then(function(success){
               $scope.fabrics = success;
             });
             
             EnumGroup.query({type:"work"}).$promise.then(function(success){
               $scope.works = success;
             });
             EnumGroup.query({type:"style"}).$promise.then(function(success){
               $scope.styles = success;
             });
             $scope.categories = Category.query({parent: 10}, //parent: "null"
               function (success){
                   categoryTree(tempArr);
                   $scope.openConfirm();
               }
             );
             $scope.categories = Category.query({parent: 10});  */
            /*start: after v2 changes  */
            $scope.topcategories = v2Category.query({ parent: 1 });
            $scope.catalog.topcategory = 10;
            //  $scope.categories = v2Category.query({parent: 5});  
            v2CategoryEavAttribute.query(function (success) {
                $scope.all_category_eav_data = success;
                $scope.TopCategoryChanged(10);
            });
            $scope.photoshoot_types = [{ "id": 1, "photoshoot_type": "Live Model Photoshoot" }, { "id": 2, "photoshoot_type": "White Background or Face-cut" }, { "id": 3, "photoshoot_type": "Photos without Model" },]
            /*end: after v2 changes  */
            sharedProperties.setType('create');
            $scope.openConfirm();
        };

        $scope.TopCategoryChanged = function (pid)
        {
            $scope.categories = v2Category.query({ parent: pid });

            v2Category.query({ parent: pid }, function (success)
            {
                console.log($scope.categories);
                $scope.new_categories_with_set_type = success;
                //$scope.new_categories_with_set_type = success.toString();

                console.log($scope.new_categories_with_set_type);
                console.log($scope.new_categories_with_set_type.length);
                for (var i = 0; i < $scope.new_categories_with_set_type.length; i++)
                {
                    var set_type = " (color set)";

                    for (var j = 0; j < $scope.all_category_eav_data.length; j++) {
                        if ($scope.all_category_eav_data[j].attribute_slug == "size" && $scope.all_category_eav_data[j].category == $scope.new_categories_with_set_type[i].id) {
                            set_type = " (size set)";
                        }
                    }
                    $scope.new_categories_with_set_type[i].category_name = $scope.new_categories_with_set_type[i].category_name + set_type;
                    console.log($scope.new_categories_with_set_type[i]);
                }
                console.log($scope.categories);
            });

        }


        vm.CloseDialog = function () {
            ngDialog.close();
        };





        vm.CsvDialog = function () {
            ngDialog.open({
                template: 'uploadcsv',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        vm.OpenUploadCsv = function () {
            vm.CsvDialog();
        };

        $scope.uploadCSVFiles = function (files) {
            $scope.csv_file = files;
            console.log($scope.file);
        };

        vm.UploadCatalogCsv = function () {
            if (vm.uploadcsv.$valid) {
                $(".modelform3").addClass(progressLoader());
                //  console.log($scope.file);
                Upload.upload({
                    url: 'api/v1/importcsvcatalog/',
                    headers: {
                        'optional-header': 'header-value'
                    },
                    data: { "catalog_csv": $scope.csv_file }
                }).then(function (response) {
                    var headers = response.headers();

                    if (headers['content-type'] == "text/csv") {
                        var hiddenElement = document.createElement('a');

                        hiddenElement.href = 'data:attachment/csv,' + encodeURI(response.data);
                        hiddenElement.target = '_blank';
                        hiddenElement.download = 'catalog_error.csv';
                        hiddenElement.click();

                        vm.successtoaster = {
                            type: 'warning',
                            title: 'Warning',
                            text: 'File uploaded successfully and please fix issues found on catalog_error.csv and reupload'
                        };
                    }
                    else {
                        vm.successtoaster = {
                            type: 'success',
                            title: 'Success',
                            text: 'Job is Scheduled. Please check Jobs table in settings for status.'
                        };
                    }

                    $(".modelform3").removeClass(progressLoader());
                    ngDialog.close();

                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    $scope.reloadData();
                });
            }
            else {
                vm.uploadcsv.catalog_csv.$dirty = true;
            }
        };

        /*var calcDataTableHeight = function() {
          return $(window).height() * 42 / 100;
        };*/

        $scope.openUpdateCatalogForm = function () {
            var true_count = 0;
            angular.forEach(vm.selected, function (value, key) {

                if (value == true) {
                    true_count++;
                    vm.true_key = key;

                    console.log(key);
                    console.log(vm.selectedFullJson[vm.true_key][1]["catalog_id"]);
                }
            })

            if (true_count == 1) {
                if (vm.selectedFullJson[vm.true_key][1]["catalog_type"] != "mycatalog") {
                    //toaster.pop("error", "Failed", "Can not update a catalog that you are a seller");
                    $.notify({
                        title: "Failed",
                        message: "Can not update a catalog that you are not a seller",
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
                else {
                    console.log('openupdate called');
                    sharedProperties.setType('update');
                    //$scope.catalog_id = vm.true_key;
                    $scope.catalog_id = vm.selectedFullJson[vm.true_key][1]["catalog_id"];
                    $scope.bundle_product_id = vm.true_key;
                    ngDialog.openConfirm({
                        template: 'addcatalog',
                        scope: $scope,
                        className: 'ngdialog-theme-default',
                        closeByDocument: false
                    });
                    $scope.brands = Brand.query({ cid: $scope.company_id, type: "my", sub_resource: "dropdown" });
                    /*EnumGroup.query({type:"fabric"}).$promise.then(function(success){
                      $scope.fabrics = success;
                    });
                    
                    EnumGroup.query({type:"work"}).$promise.then(function(success){
                      $scope.works = success;
                    });
                    EnumGroup.query({type:"style"}).$promise.then(function(success){
                      $scope.styles = success;
                    });
                    $scope.categories = Category.query({parent: 10});*/

                    /*start: after v2 changes  */
                    $scope.topcategories = v2Category.query({ parent: 1 });
                    $scope.catalog.topcategory = 10;
                    //  $scope.categories = v2Category.query({parent: 5});  
                    v2CategoryEavAttribute.query(function (success) {
                        $scope.all_category_eav_data = success;
                        $scope.TopCategoryChanged(10);
                    });
                    $scope.photoshoot_types = [{ "id": 1, "photoshoot_type": "Live Model Photoshoot" }, { "id": 2, "photoshoot_type": "White Background or Face-cut" }, { "id": 3, "photoshoot_type": "Photos without Model" },]
                    /* end v2 changes  */

                    //$rootScope.$broadcast("CallUpdateCatalogForm", {});
                }
            }
            else {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Failed',
                    text: 'Please select one Catalog'
                };
                console.log(vm.errortoaster);
                //toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
                //toaster.pop('error', 'Failed', 'Please select one row'); 

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


        $scope.StartStopSelling = function(id)
        {
            $scope.catalog = {};
            sharedProperties.setType('startstop');
            $scope.catalog_id = id;

            //UpdateCheckBoxUI();
            ngDialog.open({
                template: 'inventory_update',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        }
        

        $scope.OpenSellAllDesignsDialog = function ()
        {
            var true_count = 0;
            $scope.selectedProducts = [];
            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {
                    true_count++;
                    vm.true_key = key;
                }
            })

            if (true_count > 0) {
                ngDialog.open({
                    template: 'sell_all_designs',
                    scope: $scope,
                    className: 'ngdialog-theme-default',
                    closeByDocument: false
                });


                angular.forEach(vm.selected, function (value, key) {
                    if (value == true) {
                        console.log("selected" + key);
                        $scope.catalog_id = key;
                        var temp = {};
                        temp['id'] = $scope.catalog_id;

                        v2Products.get({ 'cid': $scope.company_id, 'id': $scope.catalog_id, 'expand': true, "view_type": "mycatalogs" }, function (success) {
                            $scope.catalog_inv = success;
                            temp['catalog_inv'] = $scope.catalog_inv;

                            v2ProductsMyDetails.get({ 'id': key }, function (data) {
                                $scope.inventory_data = data;
                                v2CategoryEavAttribute.query({ "category": success.category, "attribute_slug": "size" },
                                    function (result) {
                                        //console.log(result);
                                        $scope.attribute_data = result;
                                        $scope.full_set_only = $scope.inventory_data.i_am_selling_sell_full_catalog;

                                        if ($scope.attribute_data.length > 0)
                                        {
                                            $scope.catalog_with_size = true;
                                            temp['attribute_data'] = $scope.attribute_data;
                                        }
                                        else {
                                            $scope.catalog_with_size = false;
                                            temp['inventory_data'] = $scope.inventory_data;
                                        }

                                        temp['catalog_with_size'] = $scope.catalog_with_size;
                                        temp['full_set_only'] = $scope.full_set_only;


                                        $scope.selectedProducts.push(temp);
                                        console.log($scope.selectedProducts);


                                    }); // end : v2CategoryEavAttribute
                            });  // end: v2ProductsMyDetails
                        }); // end : v2Products

                    }
                });


            }
            else {
                $.notify({
                    title: "Failed",
                    message: "Please select one or more row",
                }, {
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

        vm.SellAllDesigns = function () {
            $(".sell_all_designs").addClass(progressLoader());
            $scope.counter = 0;
            $scope.show_progress_text = true;
            for (let index = 0; index < $scope.selectedProducts.length; index++)
            {
                const product = $scope.selectedProducts[index];
                console.log(product);

                if (product.catalog_with_size == true)
                {
                    if (product.full_set_only == true)
                    {
                        var all_sizes = product.attribute_data[0].attribute_values;
                        var sizes=[];
                        for (var i = 0; i < all_sizes.length; i++) {
                            sizes.push(all_sizes[i].value);
                        }
                        var available_sizes = sizes.toString();
                        var is_enable = true;

                        var params = { "products": [{ "product_id": product.id, "available_sizes": available_sizes, "is_enable": is_enable }] };
                        /* if (product.is_staff == "true") {
                            params['selling_company'] = product.selling_company;
                        } */
                        console.log(params);

                        v2BulkUpdateProductSeller.save(params, function (success) {
                            $scope.counter += 1;
                            vm.showMessageIfsuccess('You have successfully started selling all designs of the selected Catalogs');

                        });
                    }
                    else
                    {
                        var bulk_products = [];
                        for (var j = 0; j < product.catalog_inv.products.length; j++)
                        {       
                            var all_sizes = product.attribute_data[0].attribute_values;
                            var sizes = [];
                            for (var i = 0; i < all_sizes.length; i++) {
                                sizes.push(all_sizes[i].value);
                            }
                            var temp = {};
                            temp.product_id = product.catalog_inv.products[j].id
                            temp.available_sizes = sizes.toString();
                            temp.is_enable = true;

                            bulk_products.push(temp);
                        }

                        var params = { "products": bulk_products }
                        /* if (product.is_staff == "true") {
                            params['selling_company'] = product.selling_company;
                        } */
                        console.log(params);
                        v2BulkUpdateProductSeller.save(params, function (success) {
                            $scope.counter += 1;
                            vm.showMessageIfsuccess('You have successfully started selling all designs of the selected Catalogs');
                        });
                    }// end else : full_set_only == false
                } // end if : catalog_with_size == true
                else
                {
                    if (product.full_set_only == true)
                    {
                        var is_enable = true;
                        var params = { "products": [{ "product_id": product.id, "is_enable": is_enable }] }
                        /*  if (product.is_staff == "true") {
                            params['selling_company'] = product.selling_company;
                        } */
                        console.log(params);
                        v2BulkUpdateProductSeller.save(params, function (success) {
                            $scope.counter += 1;
                            vm.showMessageIfsuccess('You have successfully started selling all designs of the selected Catalogs');
                        });
                    }
                    else
                    {
                        var bulk_products = [];
                        for (var j = 0; j < product.catalog_inv.products.length; j++) {
                            var temp = {};
                            temp.product_id = product.catalog_inv.products[j].id
                            temp.is_enable = true;
                            bulk_products.push(temp);
                        }

                        var params = { "products": bulk_products };
                        /* if (product.is_staff == "true") {
                            params['selling_company'] = product.selling_company;
                        } */
                        console.log(params);
                        v2BulkUpdateProductSeller.save(params, function (success) {
                            $scope.counter += 1;
                            vm.showMessageIfsuccess('You have successfully started selling all designs of the selected Catalogs');
                        });
                    }// end else : full_set_only == false

                } // end else : catalog_with_size == false

            }

        }


        $scope.OpenStopCompletelyDialog = function ()
        {
            var true_count = 0;
            $scope.selectedProducts = [];
            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {
                    true_count++;
                    vm.true_key = key;
                }
            })

            if (true_count > 0)
            {
                ngDialog.open({
                    template: 'Stop_completely',
                    scope: $scope,
                    className: 'ngdialog-theme-default',
                    closeByDocument: false
                });


                angular.forEach(vm.selected, function (value, key){
                    if (value == true)
                    {
                        console.log("selected" + key);
                        $scope.catalog_id = key;
                        var temp = {};
                        temp['id'] = $scope.catalog_id;

                        v2Products.get({ 'cid': $scope.company_id, 'id': $scope.catalog_id, 'expand': true, "view_type": "mycatalogs" }, function (success)
                        {
                            $scope.catalog_inv = success;
                            temp['catalog_inv'] = $scope.catalog_inv;

                            v2ProductsMyDetails.get({ 'id': key }, function (data) {
                                $scope.inventory_data = data;
                                v2CategoryEavAttribute.query({ "category": success.category, "attribute_slug": "size" },
                                    function (result)
                                    {
                                        console.log(result);
                                        $scope.attribute_data = result;
                                        $scope.full_set_only = $scope.inventory_data.i_am_selling_sell_full_catalog;

                                        if ($scope.attribute_data.length > 0) {
                                            $scope.catalog_with_size = true;
                                        } 
                                        else {
                                            $scope.catalog_with_size = false;
                                        }
                                        
                                        temp['catalog_with_size'] = $scope.catalog_with_size;
                                        temp['full_set_only'] = $scope.full_set_only;
                                       
                                        

                                        $scope.selectedProducts.push(temp);

                                        console.log($scope.selectedProducts);
                                    

                                    }); // end : v2CategoryEavAttribute
                            });  // end: v2ProductsMyDetails
                        }); // end : v2Products

                    }
                });
                
                
            }
            else {
                $.notify({
                    title: "Failed",
                    message: "Please select one or more row",
                }, {
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

       

        vm.StopSellingCompletely = function ()
        {
            $(".Stopcompletely").addClass(progressLoader());
            $scope.counter = 0;
            $scope.show_progress_text = true;
            for (let index = 0; index < $scope.selectedProducts.length; index++)
            {
                const product = $scope.selectedProducts[index];
                console.log(product);

                if (product.catalog_with_size == true)
                {
                    if (product.full_set_only == true)
                    {
                        var sizes = [];
                        var available_sizes = sizes.toString();
                        var is_enable = false;

                        var params = { "products": [{ "product_id": product.id, "available_sizes": available_sizes, "is_enable": is_enable }] };
                        /* if (product.is_staff == "true") {
                            params['selling_company'] = product.selling_company;
                        } */
                        console.log(params);
                        
                        v2BulkUpdateProductSeller.save(params, function (success)
                        {
                            $scope.counter += 1;
                            vm.showMessageIfsuccess('You have successfully stopped selling all the selected products');

                        });
                    }
                    else
                    {
                        var bulk_products = [];
                        for (var j = 0; j < product.catalog_inv.products.length; j++)
                        {
                            var sizes = [];
                            var temp = {};
                            temp.product_id = product.catalog_inv.products[j].id
                            temp.available_sizes = sizes.toString();
                            temp.is_enable = false;

                            bulk_products.push(temp);
                        }

                        var params = { "products": bulk_products }
                        /* if (product.is_staff == "true") {
                            params['selling_company'] = product.selling_company;
                        } */
                        console.log(params);
                        v2BulkUpdateProductSeller.save(params, function (success)
                        {
                            $scope.counter += 1;
                            vm.showMessageIfsuccess('You have successfully stopped selling all the selected products');
                        });
                    }// end else : full_set_only == false
                } // end if : catalog_with_size == true
                else
                {
                    if (product.full_set_only == true)
                    {
                        var is_enable = false;
                        
                        var params = { "products": [{ "product_id": product.id, "is_enable": is_enable }] }
                        /*  if (product.is_staff == "true") {
                            params['selling_company'] = product.selling_company;
                        } */
                        console.log(params);
                        v2BulkUpdateProductSeller.save(params, function (success){
                            $scope.counter += 1;
                            vm.showMessageIfsuccess('You have successfully stopped selling all the selected products');
                        });
                    }
                    else
                    {
                        var bulk_products = [];
                        for (var j = 0; j < product.catalog_inv.products.length; j++)
                        {
                            var temp = {};
                            temp.product_id = product.catalog_inv.products[j].id
                            temp.is_enable = false;
                            bulk_products.push(temp);
                        }

                        var params = { "products": bulk_products };
                        /* if (product.is_staff == "true") {
                            params['selling_company'] = product.selling_company;
                        } */
                        console.log(params);
                        v2BulkUpdateProductSeller.save(params, function (success) {
                            $scope.counter += 1;
                            vm.showMessageIfsuccess('You have successfully stopped selling all the selected products');
                        });
                    }// end else : full_set_only == false

                } // end else : catalog_with_size == false

            }

        }

        vm.showMessageIfsuccess = function (string) {
            console.log($scope.counter == $scope.selectedProducts.length);
            if ($scope.counter == $scope.selectedProducts.length) {
                $scope.show_progress_text = false;
                $(".Stopcompletely").removeClass(progressLoader());
                vm.successtoaster = {
                    type: 'success',
                    title: 'Success',
                    text: string
                };
                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                ngDialog.close();
                $scope.reloadData();

                toggleAll(false);
            }
        }

        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('ajax', {
                url: 'api/mycatalogdatatables/',
                type: 'GET',
            })
            .withDOM('rtipl')
            .withOption('createdRow', function (row, data, dataIndex) {
                // Recompiling so we can bind Angular directive to the DT
                $compile(angular.element(row).contents())($scope);


            })
            .withOption('headerCallback', function (header) {
                if (!vm.headerCompiled) {
                    // Use this headerCompiled field to only compile header once
                    vm.headerCompiled = true;
                    $compile(angular.element(header).contents())($scope);
                }
            })
            .withOption('fnPreDrawCallback', function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                vm.count = vm.count + 1;
                //alert(JSON.stringify(vm.selected));
                if ((vm.count % 2) == 0) {
                    vm.selected = {};
                    vm.selectAll = false;
                    //alert(JSON.stringify(vm.selected));
                }
                return true;
            })

            .withDataProp('data')
            .withLightColumnFilter({
                2: { "type": "text", },
                3: { "type": "text", },
                5: { "type": "text", },
                6: { "type": "select", values: $scope.category_filter_options, },
                7: { "type": "select", selected: $stateParams.status, values: [{"value": 1,"label":"Enable"}, {"value":0,"label":"Disable"}] },
                8: { "type": "select", values: [{ "value": 1, "label": "Full Available" }, { "value": 0, "label": "Singles Available" }] },
                9: { "type": "dateRange", width: '100%' },
               
                //5 : { "type" : "select", values:[{"value":"public","label":"Public"}, {"value":"push","label":"Private"}]},
               
            })

            .withOption('processing', true)
            .withOption('serverSide', true)
            //.withOption('stateLoadParams', false)
            //.withOption('stateSaveParams', false)
            .withOption('stateSave', true)
            .withOption('stateSaveCallback', function (settings, data) {
                //console.log(JSON.stringify(settings));
                data = datatablesStateSaveCallback(data);
                localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));


            })
            .withOption('stateLoadCallback', function (settings) {
                return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance))

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
                    text: 'Catalogs',
                    key: '1',
                    className: 'tableHeading', 
                },
                
                //'copy',
                {
                    text: 'Reset Filter',
                    key: '1',
                    className: 'buttonSecondary nocontextAction',
                    action: function (e, dt, node, config) {
                        //$('table thead tr:eq(1) :input').val('').trigger('change'); // Don't forget to trigger
                        //$('#catalog-datatables').DataTable().ajax.reload();
                        localStorage.removeItem('DataTables_' + 'catalogs-datatables');
                        $state.go($state.current, {}, { reload: true });

                        //$scope.reloadData();
                    }
                },

                'print',
                
                {
                    text: 'Upload CSV',
                    key: '1',
                    className: 'buttonSecondary nocontextAction',
                    action: function (e, dt, node, config) {
                        vm.OpenUploadCsv();
                    }
                },
                
                {
                    text: 'Add Catalog',
                    key: '1',
                    className: 'buttonPrimary nocontextAction',
                    action: function (e, dt, node, config) {
                        $scope.catalogId = null;
                        vm.catalog = {};
                        vm.catalog.sell_full_catalog = true;
                        vm.catalog.dont_allow_crop = false;
                        vm.catalog.cropallow = !vm.catalog.dont_allow_crop;
                       
                        $scope.catalog = {};
                        $scope.catalog.enable_duration = 30;
                        $scope.catalog.is_percentage = true;
                        $scope.catalog.single_piece_price_percentage = 0;
                        $scope.catalog.single_piece_price = 0;
                        $scope.catalog.view_permission = 'public';
                        $scope.catalog.catalog_type = 'catalog';
                        $scope.dt = new Date();
                        //   $scope.catalog.dispatch_date = formatDate($scope.dt);

                        //$scope.category = {};
                        var tempArr = [];
                        $scope.update_flag = false;
                        $scope.products = [];
                        $scope.OpenCatalogForm(tempArr);

                    }
                },
                {
                    text: 'Sell All Designs',
                    key: '1',
                    className: 'buttonPrimary contextAction',
                    action: function (e, dt, node, config) {
                        
                        $scope.OpenSellAllDesignsDialog();
                    }
                },
                {
                    text: 'Stop Completely',
                    key: '1',
                    className: 'buttonPrimary contextAction',
                    action: function (e, dt, node, config) {
                        //     alert(JSON.stringify(vm.selected));
                      

                        $scope.OpenStopCompletelyDialog();
                    }
                },
                {
                    text: 'Update/Add Designs',
                    key: '1',
                    className: 'buttonPrimary singlecontextAction',
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
                }
                
                /*{
                      text: 'Share',
                      key: '1',
                      className: 'buttonPrimary',
                      action: function (e, dt, node, config) {
                          $scope.share = {};
                          $scope.share.item_type = 'catalog';
                          $scope.share.dispatch_date = new Date();
                          $scope.share.full_catalog_orders_only = false;
                          $scope.OpenShareCatalog();
                      }
                },*/
                /*    {
                        text: 'Delete',
                        key: '1',
                        className: 'red',
                        action: function (e, dt, node, config) {
                           // alert(JSON.stringify(vm.selected));
                              vm.DeleteCatalog();
                        }
                    }, 
                {
                    text: 'Disable',
                    key: '1',
                    className: 'buttonSecondary contextAction',
                    action: function (e, dt, node, config) {
                        // alert(JSON.stringify(vm.selected));
                        vm.DisableCatalog();
                    }
                },
                {
                    text: 'Enable',
                    key: '1',
                    className: 'buttonSecondary contextAction',
                    action: function (e, dt, node, config) {
                        // alert(JSON.stringify(vm.selected));
                        vm.OpenEnableCatalog();
                    }
                },*/
                /*   {
                       text: 'Sales Order',
                       key: '1',
                       className: 'buttonSecondary',
                       action: function (e, dt, node, config) {
                           vm.CreateOrderForm('sales_order');
                           $scope.catalogstobeorder = [];
                       }
                   },*/
                
                //'excel',

            ]);

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
                .renderWith(function (data, type, full, meta) {
                    vm.selected[full[0]] = false;
                    vm.selectedFullJson[full[0]] = full;
                    return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                }),

            DTColumnDefBuilder.newColumnDef(1).withTitle('json').notVisible(),
            DTColumnDefBuilder.newColumnDef(2).withTitle('ProductTitle').notVisible(),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Title').renderWith(TitleLink),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Image').renderWith(imageHtml).notSortable(),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Brand').renderWith(BrandTitleLink),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Category').notSortable(),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Enabled').notSortable(),
            DTColumnDefBuilder.newColumnDef(8).withTitle('Full Available').notSortable(),
            DTColumnDefBuilder.newColumnDef(9).withTitle('Expiry Date'),
            DTColumnDefBuilder.newColumnDef(10).withTitle('Designs').notSortable().withOption('sWidth', '5%'),
            DTColumnDefBuilder.newColumnDef(11).withTitle('Views').notSortable().notVisible(),
            DTColumnDefBuilder.newColumnDef(12).withTitle('Actions').notSortable()
            .renderWith(function(data, type, full, meta) {
                    var htmlbutton = '';

                    /*if(full[1]['catalog_type'] != 'mycatalog'){
                        if(full[1]['i_am_selling_this'] != true && $scope.flag_retailer != 'true' && full[10] != 'noncatalog'){
                            htmlbutton += '<div style="padding-bottom:5px;"><button type="button" ng-click="BecomeSeller(' + full[0] + ',' + full[1]['brand'] + ',' + full[1]['sell_full_catalog'] +')" class="styledButtonbuttonSecondary" style="line-height: 20px !important;" >Become a Seller</button></div>';
                        }
                    }*/
                    if(full[1]['catalog_view_permission'] == 'public'){
                        htmlbutton += '<div style="padding-bottom:5px;"><button type="button" ng-click="StartStopSelling(' + full[0] +')" class="linkButton" >Update available inventory</button></div>';
                    }
                                        
                    if(htmlbutton == '')
                        return '&nbsp;';
                    else
                        return htmlbutton;
                }),

            /*DTColumnDefBuilder.newColumnDef(1).withTitle('Title').renderWith(TitleLink),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Image').renderWith(imageHtml).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Brand').renderWith(BrandTitleLink),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Category'),
            DTColumnDefBuilder.newColumnDef(5).withTitle('View Type'),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Status').notSortable(),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Expiry Date'),
            DTColumnDefBuilder.newColumnDef(8).withTitle('Designs').notSortable().withOption('sWidth','5%'),
            DTColumnDefBuilder.newColumnDef(9).withTitle('Views').notSortable().withOption('sWidth','5%'),
            //DTColumnDefBuilder.newColumnDef(5).withTitle('Past Shares').notSortable()*/
        ];

        function toggleAll(selectAll, selectedItems)
        {
  
            if(selectAll)
            {
                $('.contextAction').css('display','block');
                $('.nocontextAction').css('display','none');
                $('.singlecontextAction').css('display', 'none');
            }
            else {
                $('.contextAction').css('display','none');
                $('.nocontextAction').css('display','block');
                $('.singlecontextAction').css('display', 'none');
            }

            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    selectedItems[id] = selectAll;
                }
            }
        }

        function toggleOne(selectedItems)
        {
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
            console.log(ctr);

            if (ctr > 0) {
                $('.contextAction').css('display','block');
            }
            else {
                $('.contextAction').css('display','none');
            }

            if (ctr == 1) {
                $('.singlecontextAction').css('display','block');
            }
            else {
                $('.singlecontextAction').css('display','none');
            }

            if (ctr == 0) {
                $('.nocontextAction').css('display','block');
            }
            else {
                $('.nocontextAction').css('display','none');
            }
           
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id))
                {
                    if (!selectedItems[id]) {
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
                console.log('UpdateCheckBoxUI() attached');

                $('.contextAction').css('display','none');
                $('.singlecontextAction').css('display','none');
                $('.nocontextAction').css('display','block');
                
            }, 2000);
        });























    // Methods those are not used







    function creatingData(node, tempArr) {

        var temp = {};
        var length;
        temp.id = node.id;
        //alert(tempArr);
        if (tempArr != null) {
            if (tempArr.indexOf(node.id) != -1) {
                //console.log(tempArr);
                temp.state = {};
                //temp.state.selected = true;
                temp.state.checked = true;
                temp.state.opened = false;
            }
        }
        temp.text = node.category_name;
        if (node.child_category != null) {
            temp.children = [];
            length = node.child_category.length;
            for (var i = 0; i < length; i++) {
                var child = creatingData(node.child_category[i], tempArr);
                temp.children.push(child);
            }
        }
        //   alert(JSON.stringify(temp));
        return temp;

    }


    function categoryTree(tempArr) {

        $scope.data = [];
        for (var i = 0; i < $scope.categories.length; i++) {
            var temp = {};
            temp = creatingData($scope.categories[i], tempArr);
            $scope.data.push(temp);
        }

        //     alert(JSON.stringify($scope.data));
        vm.treeData = $scope.data;

        vm.treeConfig = {
            core: {
                multiple: false,
                animation: true,
                error: function (error) {
                    console.log('treeCtrl: error from js tree - ' + angular.toJson(error));
                },
                check_callback: true,
                worker: true,
            },
            rule: {
                multiple: false
            },
            version: 1,

            plugins: ['checkbox'],//'wholerow','types',
            checkbox: {
                tie_selection: false,
                multiple: false,
                //keep_selected_style: false
            }

        };
    }



        vm.DisableCatalog = function () {
            var true_count = 0;
            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {
                    true_count++;
                    vm.true_key = key;
                }
            })

            if (true_count > 0) {

                angular.forEach(vm.selected, function (value, key) {
                    if (value == true) {
                        console.log(key);
                        $(".modelform3").addClass(progressLoader());
                        v2Products.save({ 'id': key, 'cid': $scope.company_id, "sub_resource": "disable" }).$promise.then(function (result) {
                            $(".modelform3").removeClass(progressLoader());
                            vm.successtoaster = {
                                type: 'success',
                                title: 'Success',
                                text: 'Catalog has been disabled.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            $scope.reloadData();
                        });
                    }
                });
            }
            else {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Failed',
                    text: 'Please select one row'
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


        vm.OpenEnableCatalog = function () {
            var true_count = 0;
            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {
                    true_count++;
                    vm.true_key = key;
                }
            })
            if (true_count > 0) {
                vm.enable_duration = 30;
                $scope.OpenEnableCatalogPopup();
            }
            else {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Failed',
                    text: 'Please select one row'
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

        $scope.OpenEnableCatalogPopup = function () {
            ngDialog.openConfirm({
                template: 'openenablemodal',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            })
        };



        vm.EnableCatalog = function () {
            var true_count = 0;
            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {
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

            if (true_count > 0) {

                angular.forEach(vm.selected, function (value, key) {
                    if (value == true) {
                        $(".modelform3").addClass(progressLoader());
                        v2Products.save({ 'id': key, 'cid': $scope.company_id, 'sub_resource': "enable", 'expire_date': expiry_date }).$promise.then(function (result) {
                            $(".modelform3").removeClass(progressLoader());
                            vm.successtoaster = {
                                type: 'success',
                                title: 'Success',
                                text: 'Catalog has been enabled.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            $scope.reloadData();
                            ngDialog.close();
                        });
                    }
                });
            }
            else {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Failed',
                    text: 'Please select one row'
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

            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {
                    true_count++;
                    $scope.true_key = key;
                    //  $scope.share.catalog = vm.true_key;
                }

            })

            if (true_count == 1) {

                if (vm.selectedFullJson[$scope.true_key][6] == "Enable") {
                    $scope.OpenShareDialog();
                    $scope.share.catalog = parseInt($scope.true_key);
                }
                else {
                    vm.errortoaster = {
                        type: 'error',
                        title: 'Failed',
                        text: 'Disable catalog can not be share.'
                    };
                    console.log(vm.errortoaster);
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                }
            }
            else {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Failed',
                    text: 'Please select one row'
                };
                console.log(vm.errortoaster);
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }
        }



    /*$scope.category_filter_options = [];
     v2Category.query(
         function (catdata) {
             for (var i = 0; i < catdata.length; i++) {
                 var temp = {};
                 temp.value = catdata[i].category_name;
                 temp.label = catdata[i].category_name;
                 $scope.category_filter_options.push(temp);
             }
             console.log($scope.category_filter_options)

         });*/

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


        //createorder start

        vm.order_type = null
        vm.buyers = null
        vm.agents = null
        vm.full_catalog_orders_only = null
        vm.order = {}
        vm.order.products = []



     
        vm.CreateOrderForm = function (order_type)
        {
            vm.order_type = order_type

            $scope.true_key = [];
            var true_count = 0;
            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {

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

        vm.changeQty = function (qty) {
            if (vm.full_catalog_orders_only == true) {
                for (var i = 0; i < (vm.order.products.length); i++) {
                    var product = vm.order.products[i];
                    product.quantity = qty;
                }
            }
        }

        vm.CreateOrder = function () {
            if (vm.orderForm.$valid) {
                $(".modelform").addClass(progressLoader());
                vm.items = []
                var itemno = 0;

                for (var i = 0; i < (vm.order.products.length); i++) {
                    var product = vm.order.products[i];

                    if (product.is_select) {
                        if (vm.order_type == 'sales_order') {
                            vm.items[itemno] = { product: product.id, rate: product.selling_price, quantity: product.quantity };
                            itemno++;
                        }
                        else {
                            vm.items[itemno] = { product: product.id, rate: product.final_price, quantity: product.quantity };
                            itemno++;
                        }
                    }
                }

                if (vm.items.length == 0) {
                    $(".modelform").removeClass(progressLoader());

                    vm.errortoaster = {
                        type: 'error',
                        title: 'Failed',
                        text: 'Please select product'
                    };

                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    return
                }

                if (vm.order_type == 'sales_order') {
                    var jsondata = { order_number: vm.order.order_number, company: vm.order.buyer, seller_company: $scope.company_id, cid: $scope.company_id, items: vm.items, customer_status: "Placed", broker_company: vm.order.agent };
                    SalesOrders.save(jsondata,
                        function (success) {
                            $(".modelform").removeClass(progressLoader());

                            vm.successtoaster = {
                                type: 'success',
                                title: 'Success',
                                text: 'Order has been created successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            ngDialog.close();
                            $scope.reloadData();
                        });
                }
                else {
                    var jsondata = { order_number: vm.order.order_number, company: $scope.company_id, seller_company: vm.order.supplier, cid: $scope.company_id, items: vm.items, customer_status: "Placed", broker_company: vm.order.agent };
                    PurchaseOrders.save(jsondata,
                        function (success) {
                            $(".modelform").removeClass(progressLoader());

                            vm.successtoaster = {
                                type: 'success',
                                title: 'Success',
                                text: 'Order has been created successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            ngDialog.close();
                            $scope.reloadData();
                        });
                }

            }
            else {
                vm.orderForm.order_number.$dirty = true;
                vm.orderForm.buyer.$dirty = true;

            }
        }
        //createorder end



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


        vm.DeleteCatalog = function () {
            var true_count = 0;
            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {
                    true_count++;
                    vm.true_key = key;
                }
            })

            if (true_count > 0) {
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
                }, function (isConfirm) {
                    if (isConfirm) {
                        angular.forEach(vm.selected, function (value, key) {
                            if (value == true) {
                                if (vm.selectedFullJson[key][1]["catalog_type"] == "catalogseller") {
                                    toaster.pop("error", "Failed", vm.selectedFullJson[key][1] + " catalog can't be deleted because you are a seller");
                                }
                                else {
                                    $(".modelform3").addClass(progressLoader());
                                    Catalog.delete({ 'id': key, 'cid': $scope.company_id },
                                        function (success) {
                                            $(".modelform3").removeClass(progressLoader());
                                            //$scope.dtInstance.$scope.reloadData();
                                            vm.successtoaster = {
                                                type: 'success',
                                                title: 'Success',
                                                text: 'Catalog deleted successfully.'
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
            else {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Failed',
                    text: 'Please select one row'
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


    }
})();

