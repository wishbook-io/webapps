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
        .controller('PubliccatalogController', PubliccatalogController);

    PubliccatalogController.$inject = ['v2brandwisediscount', 'hasBrandPermission', 'BecomeASeller', 'Suppliers', 'v2CategoryEavAttribute', 'Catalog', '$stateParams', 'v2Products', 'SalesOrders', 'PurchaseOrders', 'v2BulkUpdateProductSeller', 'BrandDistributor', 'Company', 'toaster', 'ngDialog', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', '$localStorage'];
    function PubliccatalogController(v2brandwisediscount, hasBrandPermission, BecomeASeller, Suppliers, v2CategoryEavAttribute, Catalog, $stateParams, v2Products, SalesOrders, PurchaseOrders, v2BulkUpdateProductSeller, BrandDistributor,Company, toaster, ngDialog, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, $localStorage) {
        CheckAuthenticated.check();

        var vm = this;

        $scope.company_id = localStorage.getItem('company');

       
        vm.CloseDialog = function() {
            ngDialog.close();
        };

        vm.order_type = null
        vm.buyers = null
        vm.agents = null
        vm.full_catalog_orders_only = null
        vm.order = {}
        vm.order.products = [];
        $scope.sell_full_catalog = true;

        $scope.updateUI_called = false;

        $scope.single_pc_discount = 0;
        $scope.full_catalog_discount = 0;
        $scope.discountNotSet = false;
        $scope.brandsIsell = [];


        vm.selected = {};
        vm.selectedFullJson = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};


        vm.enable_duration = 30;

        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';

        function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);
            UpdateCheckBoxUIfilters();
        }

        function callback(json) {
            console.log(json);
            if (json.recordsTotal > 0 && json.data.length == 0) {
                //vm.dtInstance.rerender();
                $state.go($state.current, {}, { reload: true });
            }
        }

        function TitleLink(data, type, full, meta) {
            /*  if(full[8] == 0){
                  return '<a ng-click="OpenNoProductsAlert()">'+full[2]+'</a>';
              }
              else{
                  //return '<a href="#/app/products-detail/?type=publiccatalog&id='+full[1]['catalog_id']+'&name='+full[1]+'">'+full[1]+'</a>';
    
                  if(full[1]['catalog_type']=='received')  {
                    return '<a href="#/app/products-detail/?type=receivedcatalog&id='+full[1]['catalog_id']+'&name='+full[2]+'">'+full[2]+'</a>';
                  }
                  else if (full[1]['catalog_type'] == 'mycatalog') {
                    return '<a href="#/app/product/?type=mycatalog&id='+full[1]['catalog_id']+'&name='+full[2]+'">'+full[2]+'</a>';
                  }
                  else {*/
            return '<a href="#/app/products-detail/?type=publiccatalog&id=' + full[1]['catalog_id'] + '&name=' + full[2] + '">' + full[2] + '</a>';
            /*    }
            }*/
        }

        function BrandTitleLink(data, type, full, meta) {
            if (full[1]['brand'] != null) {
                return '<a href="#/app/brand-catalogs/?brand=' + full[1]['brand'] + '&name=' + full[4] + '">' + full[4] + '</a>';
            }
            else {
                return '';
            }
        }

        function UpdateCheckBoxUICustom()
        {
            setTimeout(function () //call after 1seconds
            {
                var output = $(".customUI input[type=checkbox]");
                //console.log(output);
                output.each(function (i) {
                    //console.log(i);
                    $(this).attr("id", i);
                    $(this).after("<label for='" + i + "'></label");
                });

            }, 100);
        }

        $scope.flag_retailer = localStorage.getItem("flag_retailer");
        $scope.flag_manufacturer = localStorage.getItem("flag_manufacturer");


        console.log($state.current);

        function imageHtml(data, type, full, meta) {
            if (!$scope.updateUI_called) {
                console.log('UpdateCheckBoxUI called');

                UpdateCheckBoxUI();
                $('.contextAction ').css('display', 'none');
                $('.singlecontextAction').css('display', 'none');
                $('.buttons-print').addClass("nocontextAction");
                $scope.updateUI_called = true;
            }
            return '<a ng-click="OpenProductsImages(' + full[1]['catalog_id'] + ',' + full[8] +')" class="hvr-grow"><img class="loading" src="' + full[3] + '" style="width: 100px; height: 100px"/></a>';
        }


       

        $scope.ProductsImages = function () {
            ngDialog.open({
                template: 'productimages',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        $scope.OpenProductsImages = function(id,prod_count,productId){
            $(".modelform").addClass(progressLoader());
            $scope.catid = id;
            console.log(prod_count + ' ' + productId);
            $scope.prod_count = prod_count;
            if(prod_count == 0)
            {
                $scope.OpenNoProductsAlert();
            }
            else
            {
                ///vm.CloseDialog();
                $('.ngdialog').css('z-index','200');
                Catalog.get({"id":id, "cid":$scope.company_id},
                function (result)
                {
                    $scope.catalogdata = result;
                    Catalog.get({"id":id, "expand":"true", "cid":$scope.company_id},
                    function (success){
                        $(".modelform").removeClass(progressLoader());
                        openPhotoSwipe($scope.catalogdata, success, productId);
                    });
                });

            }
        }

        $scope.applyMarginToallDesigns = function ()
        {
            var marginedprice1, marginedprice2;
            for (var j = 0 ; j< $scope.catalogDetails.products.length; j++)
            {
                if (vm.is_percentage == true && (vm.single_piece_price_percentage || vm.single_piece_price_percentage === 0))
                {
                    $scope.catalogDetails.products[j].fullCatalog_billingprice = $scope.catalogDetails.products[j].public_price - Math.ceil(($scope.catalogDetails.products[j].public_price * $scope.full_catalog_discount) / 100);

                    marginedprice1 = $scope.catalogDetails.products[j].public_price + ($scope.catalogDetails.products[j].public_price * vm.single_piece_price_percentage) / 100
                    $scope.catalogDetails.products[j].singlePc_billingprice = marginedprice1 - Math.ceil((marginedprice1 * $scope.single_pc_discount) / 100);
                    
                }
                else if (vm.is_percentage == false && (vm.single_piece_price || vm.single_piece_price === 0))
                {
                    $scope.catalogDetails.products[j].fullCatalog_billingprice = $scope.catalogDetails.products[j].public_price - ($scope.catalogDetails.products[j].public_price * $scope.full_catalog_discount) / 100;

                    marginedprice2 = $scope.catalogDetails.products[j].public_price + vm.single_piece_price;
                    $scope.catalogDetails.products[j].singlePc_billingprice = marginedprice2 - Math.ceil((marginedprice2 * $scope.single_pc_discount) / 100);
                }

                console.log($scope.catalogDetails.products[j].public_price + ' + ' + marginedprice1 + ' or ' + marginedprice2 + ' - ' + Math.ceil((marginedprice1 * $scope.single_pc_discount) / 100) + " or " + Math.ceil((marginedprice2 * $scope.single_pc_discount) / 100));
                console.log(vm.single_piece_price_percentage + ' ' + vm.single_piece_price);

                console.log($scope.catalogDetails.products[j].fullCatalog_billingprice);
                console.log($scope.catalogDetails.products[j].singlePc_billingprice);
            }
            console.log($scope.catalogDetails.products);
            
        }

        $scope.getBrandDiscount = function (selectedbrand) {
            $scope.discountRuleList = [];
            $scope.single_pc_discount = 0; //default values
            $scope.full_catalog_discount = 0;
            console.log(selectedbrand);
            v2brandwisediscount.query({ 'cid': $scope.company_id },
                function (success) {
                    $scope.discountRuleList = success;

                    if (success.length > 0) {
                        for (var index = 0; index < $scope.discountRuleList.length; index++) {
                            //console.log($scope.discountRuleList[index].brands);

                            if ($scope.discountRuleList[index].brands.indexOf(selectedbrand) >= 0) {
                                $scope.single_pc_discount = parseFloat($scope.discountRuleList[index].single_pcs_discount);
                                $scope.full_catalog_discount = parseFloat($scope.discountRuleList[index].cash_discount);

                                console.log($scope.single_pc_discount + ' , ' + $scope.full_catalog_discount);
                            }
                        }
                    }
                    if ($scope.single_pc_discount == 0 && $scope.full_catalog_discount == 0) {
                        $scope.discountNotSet = true;
                    }
                    else {
                        $scope.discountNotSet = false;
                    }
                    for (var j = 0; j < $scope.catalogDetails.products.length; j++) {

                        $scope.catalogDetails.products[j].fullCatalog_billingprice = $scope.catalogDetails.products[j].public_price - ($scope.catalogDetails.products[j].public_price * $scope.full_catalog_discount) / 100;;
                        $scope.catalogDetails.products[j].singlePc_billingprice = $scope.catalogDetails.products[j].public_price - ($scope.catalogDetails.products[j].public_price * $scope.single_pc_discount) / 100;;

                        console.log($scope.catalogDetails.products[j]);
                    }
                });
        };


        $scope.ToggleSell_full_catalog = function (bool)
        {
            $scope.sell_full_catalog = Boolean(bool);
            console.log($scope.sell_full_catalog);
            $scope.all_sizes = [];
            
            if ($scope.attribute_data.length > 0) {
                $scope.catalog_with_size = true;

                if ($scope.sell_full_catalog == true) {
                    for (var i = 0; i < $scope.attribute_data[0].attribute_values.length; i++) {
                        var temp = {};
                        temp.value = $scope.attribute_data[0].attribute_values[i].value;
                        temp.selected = false;
                        $scope.all_sizes.push(temp);
                    }
                    $scope.catalogDetails.selectAll = false;
                }
                else {
                    $scope.sell_full_catalog = false;
                    for (var j = 0; j < $scope.catalogDetails.products.length; j++)
                    {

                        $scope.all_sizes = [];
                        for (var i = 0; i < $scope.attribute_data[0].attribute_values.length; i++) {

                            var temp = {};
                            temp.value = $scope.attribute_data[0].attribute_values[i].value;
                            temp.selected = false;
                            $scope.all_sizes.push(temp);

                        }
                        $scope.catalogDetails.products[j].all_sizes = $scope.all_sizes;
                        $scope.catalogDetails.products[j].selectAll = false;
                        console.log($scope.catalogDetails.products[j]);
                    }
                }
            }
            else
            {
                $scope.catalog_with_size = false;
                
                if ($scope.sell_full_catalog == true)
                {
                    $scope.catalogDetails.selectAll = true;
                }
                else
                {
                    $scope.catalogDetails.selectAll = false;
                    
                    //vm.checkAllCatalogWithoutSize($scope.catalogDetails.selectAll);
                    for (var j = 0; j < $scope.catalogDetails.products.length; j++) {
                        $scope.catalogDetails.products[j].selected = false;
                    }
                }

               
                console.log($scope.catalogDetails.products);

            }
            UpdateCheckBoxUICustom();
            
        }

       

        $scope.BecomeSeller = function(productid,catid,brandid,sell_full_catalog)
        {
            console.log(catid);
            console.log(brandid);
            $scope.brand_id = brandid;
            $scope.cat_id = catid;
            $scope.product_id = productid;
            $scope.sell_full_catalog = Boolean(sell_full_catalog);
            // $scope.sell_full_catalog = true; https://wishbook.atlassian.net/browse/WB-4145
            vm.single_piece_price_percentage = 0;
            vm.single_piece_price = 0;
            vm.is_percentage = true;
            $scope.all_sizes = [];
            $scope.catalogDetails = {};
            $scope.attribute_data = [];

            v2Products.get({ 'cid': $scope.company_id, 'id': $scope.product_id, 'expand': true },
            function (success) {
                console.log(success);
                var data = success;
                $scope.catalogDetails = success;

                $scope.getBrandDiscount($scope.brand_id);

                v2CategoryEavAttribute.query({ "category": success.category, "attribute_slug": "size" },
                function (result) {
                    console.log(result);
                    $scope.attribute_data = result;

                    $scope.ToggleSell_full_catalog();

                }); // end : v2CategoryEavAttribute
                
                //console.log(data);
                if(data.price_range.indexOf('-') > 0)
                {
                    var prices = data.price_range.split('-');
                    vm.current_price1 =  parseFloat(prices[0]);
                    vm.current_price2 =  parseFloat(prices[1]);
                    vm.max_margin_rs = Math.max( vm.current_price1*0.10, 60);
                    vm.max_margin_percentage = ((vm.max_margin_rs * 100) / vm.current_price1).toFixed(2);
                }
                else
                {
                    vm.current_price1 = parseFloat(data.price_range);
                    vm.max_margin_rs = Math.max(vm.current_price1 * 0.10, 60);
                    vm.max_margin_percentage = ((vm.max_margin_rs * 100) / vm.current_price1).toFixed(2);
                }
                console.log(vm.max_margin_rs + ' , '+vm.max_margin_percentage);


                hasBrandPermission.save({'cid': parseInt($scope.company_id), 'brand': brandid.toString() },
                function(success){
                    console.log(success);
                    $scope.add_brand_flag = false;
                    ngDialog.open({
                        template: 'enabledurationdialog',
                        scope: $scope,
                        className: 'ngdialog-theme-default',
                        closeByDocument: false
                    });
                    UpdateCheckBoxUICustom(); // both case we need check box
                },
                function(error){
                    $scope.add_brand_flag = true;
                    console.log(error);
                    $scope.brandconfirmtext = error.data.brand;

                    BrandDistributor.query({ 'company': $scope.company_id, 'cid': $scope.company_id }).$promise.then(function (bd)
                    {
                        if (bd.length != 0)
                        {
                            $scope.brandsIsell = bd[0].brand;
                            console.log($scope.brandsIsell);
                        }
                    });

                    ngDialog.open({
                        template: 'brandisellconfirm',
                        scope: $scope,
                        className: 'ngdialog-theme-default custom-width-30',
                        closeByDocument: false
                    });
                });
            });

        }

        $scope.AddtoBrandIsell = function () 
        {
            console.log($scope.brand_id);
            $scope.brandsIsell = $scope.brandsIsell.concat($scope.brand_id);

            if (!$scope.brand_id)
            {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Brand I sell',
                    text: 'this cannnot be added to seeling brands'
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                return;
            } 

            $(".modelform").addClass(progressLoader());

            BrandDistributor.query({ 'company': $scope.company_id, 'cid': $scope.company_id }).$promise.then(function (bd)
            {
                console.log($scope.brandsIsell);
                
                if (bd.length == 0) {
                    vm.createBrandDistributor();
                }
                else {
                    $scope.BrandDistributorId = bd[0].id;
                    vm.updateBrandDistributor($scope.BrandDistributorId);
                }
            });

        }


        vm.createBrandDistributor = function ()
        {
            BrandDistributor.save({ "company": $scope.company_id, "brand": $scope.brandsIsell, "cid": $scope.company_id },
                function (success)
                {
                    Company.patch({ "id": $scope.company_id, "brand_added_flag": "yes" },
                        function (success) 
                        {
                            $(".modelform").removeClass(progressLoader());
                            
                            vm.successtoaster = {
                                type: 'success',
                                title: 'Success',
                                text: 'Brands I Sell added successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);

                            $scope.openEnableDurationDialog();

                        });
                });
        }

        vm.updateBrandDistributor = function (id) 
        {
            $scope.BrandDistributorId = id;
            BrandDistributor.patch({ "id": $scope.BrandDistributorId, "company": $scope.company_id, "brand": $scope.brandsIsell, "cid": $scope.company_id },
                function (success) {
                    $(".modelform").removeClass(progressLoader());

                    vm.successtoaster = {
                        type: 'success',
                        title: 'Success',
                        text: 'Brands I Sell updated successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);

                    $scope.openEnableDurationDialog();

                });
        }




        $scope.submitBecomeSeller = function ()
        {

            console.log(vm.enable_duration + ' ' + $scope.brand_id + ' ' + $scope.cat_id + ' ' +  $scope.sell_full_catalog);
            var today = new Date();
            var expiry_date = today.setDate(today.getDate() + vm.enable_duration);
            expiry_date = formatDate(expiry_date) + "T23:59:59Z"
            console.log(expiry_date);


            $scope.params = { "cid": $scope.company_id, "catalog": $scope.cat_id, "expiry_date": expiry_date, "selling_type": "Public", "sell_full_catalog":  $scope.sell_full_catalog };
            if ($scope.add_brand_flag){
                $scope.params['add_brand'] = $scope.brand_id;
            }
            // WB-4145 Seller panel : add single pc margin when become seller, add and update catalog etc
            if ($scope.sell_full_catalog == false && vm.is_percentage == false && vm.single_piece_price != undefined && vm.single_piece_price != null)
            {
                $scope.params['single_piece_price_fix'] = vm.single_piece_price;
            }
            if ( $scope.sell_full_catalog == false && vm.is_percentage == true && vm.single_piece_price_percentage != undefined && vm.single_piece_price_percentage != null){
                $scope.params['single_piece_price_percentage'] = vm.single_piece_price_percentage;
            }


            if ($scope.sell_full_catalog == false && vm.is_percentage == true){
                if (vm.single_piece_price_percentage == undefined) {
                    vm.errortoaster = {
                        type: 'error',
                        title: 'Percentage Margin',
                        text: ' Please enter your price margin in %.'
                    };
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    return;
                }
                if (vm.single_piece_price_percentage > vm.max_margin_percentage ){
                    vm.errortoaster = {
                          type:  'error',
                          title: 'Percentage Margin',
                          text: 'You can not add margin more than ' + vm.max_margin_percentage+'%.'
                      };
                      toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    return;
                }
               
            }
            if ($scope.sell_full_catalog == false && vm.is_percentage == false){
                if (vm.single_piece_price == undefined) {
                    vm.errortoaster = {
                        type: 'error',
                        title: 'Rupees Margin',
                        text: 'Please enter your price margin in Rupees.'
                    };
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    return;
                }
                if(vm.single_piece_price > vm.max_margin_rs || vm.single_piece_price == undefined){
                    vm.errortoaster = {
                          type:  'error',
                          title: 'Rupees Margin',
                          text: 'You can not add margin more than ' + vm.max_margin_percentage + '%.'
                      };
                      toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    return;
                }
            }


            //validation for Inventory

            if ($scope.catalog_with_size == true){
                if ($scope.sell_full_catalog == true)
                {
                    var sizes = [];
                    for (var i = 0; i < $scope.all_sizes.length; i++) {
                        if ($scope.all_sizes[i].selected == true) {
                            sizes.push($scope.all_sizes[i].value);
                        }
                    }
                    if (sizes.length <= 0) {
                        toaster.pop('error', 'No size selected', 'Please select 1 or more sizes which you have for the Product');
                        return;
                    }

                } // end if : sell_full_catalog == true
                else
                {
                    $scope.bulk_products = [];
                    var ctr = 0;
                    for (var j = 0; j < $scope.catalogDetails.products.length; j++)
                    {
                        var sizes = [];
                        for (var i = 0; i < $scope.catalogDetails.products[j].all_sizes.length; i++) {
                            if ($scope.catalogDetails.products[j].all_sizes[i].selected == true) {
                                sizes.push($scope.catalogDetails.products[j].all_sizes[i].value);
                            }
                        }
                        if (sizes.length <= 0) {
                            ctr = ctr+ 1;
                        }
                    }
                    if (ctr == $scope.catalogDetails.products.length)
                    {
                        toaster.pop('error', 'No size selected', 'Please select 1 or more sizes for atleast one Design of the Product');
                        return;
                    }
                }
            }
            else
            {
                if ($scope.sell_full_catalog == false)
                {
                    $scope.bulk_products = [];
                    var ctr = 0;
                    for (var j = 0; j < $scope.catalogDetails.products.length; j++) {
                        if ($scope.catalogDetails.products[j].selected == false) {
                            ctr = ctr + 1;
                        }
                    }
                    if (ctr == $scope.catalogDetails.products.length) {
                        toaster.pop('error', 'Design not selected', 'Please select at least 1 Design of the Product you want to sell');
                        return;
                    }
                    
                } // end if : sell_full_catalog == true
                else
                {
                    if ($scope.catalogDetails.selectAll == false) {
                        toaster.pop('error', 'Product not selected', 'Please select the Product you want to sell');
                        return;
                    }
                    

                }// end else : sell_full_catalog == false

            }

            $(".modelform-ed").addClass(progressLoader());

            console.log($scope.params);
            BecomeASeller.save($scope.params,function (success)
            {
                $scope.params = {};
                if ($scope.catalog_with_size == true)
                {
                    if ($scope.sell_full_catalog == true)
                    {
                        console.log($scope.all_sizes);
                        var sizes = [];
                        for (var i = 0; i < $scope.all_sizes.length; i++) {
                            if ($scope.all_sizes[i].selected == true) {
                                sizes.push($scope.all_sizes[i].value);
                            }
                        }
                        $scope.available_sizes = sizes.toString();
                        if ($scope.available_sizes.length > 0) {
                            $scope.is_enable = true;
                        }
                        else {
                            $scope.is_enable = false;
                           
                        }
                        $scope.params = { "products": [{ "product_id": $scope.product_id, "available_sizes": $scope.available_sizes, "is_enable": $scope.is_enable, 'expiry_date': expiry_date }] };
                        $scope.UpdateProductSeller_ShowSuccessMessage();

                    } // end if : sell_full_catalog == true
                    else {
                        $scope.bulk_products = [];
                        for (var j = 0; j < $scope.catalogDetails.products.length; j++) {
                            var sizes = [];
                            for (var i = 0; i < $scope.catalogDetails.products[j].all_sizes.length; i++) {
                                if ($scope.catalogDetails.products[j].all_sizes[i].selected == true) {
                                    sizes.push($scope.catalogDetails.products[j].all_sizes[i].value);
                                }
                            }
                            var temp = {};
                            temp.product_id = $scope.catalogDetails.products[j].id
                            temp.available_sizes = sizes.toString();
                            if (temp.available_sizes.length > 0) {
                                temp.is_enable = true;
                            }
                            else {
                                temp.is_enable = false;
                            }
                            $scope.bulk_products.push(temp);
                        }

                        $scope.params = { "products": $scope.bulk_products, 'expiry_date': expiry_date }
                        $scope.UpdateProductSeller_ShowSuccessMessage();
                    }// end else : sell_full_catalog == false
                } // end if : catalog_with_size == true
                else
                {
                    $scope.catalogDetails.selectAll = true;
                    if ($scope.sell_full_catalog == true) {
                        if ($scope.catalogDetails.selectAll == true) {
                            $scope.is_enable = true;
                        }
                        else {
                            $scope.is_enable = false;
                        }
                        $scope.catalogDetails.selectAll = true;
                        $scope.params = { "products": [{ "product_id": $scope.product_id, "is_enable": $scope.is_enable, 'expiry_date': expiry_date }] }
                        $scope.UpdateProductSeller_ShowSuccessMessage();

                    } // end if : sell_full_catalog == true
                    else {
                        $scope.bulk_products = [];
                        for (var j = 0; j < $scope.catalogDetails.products.length; j++) {
                            var temp = {};
                            temp.product_id = $scope.catalogDetails.products[j].id
                            if ($scope.catalogDetails.products[j].selected == true) {
                                temp.is_enable = true;
                            }
                            else {
                                temp.is_enable = false;
                            }
                            $scope.bulk_products.push(temp);
                        }

                        $scope.params = { "products": $scope.bulk_products, 'expiry_date': expiry_date };
                        $scope.UpdateProductSeller_ShowSuccessMessage();
                        
                    }// end else : sell_full_catalog == false

                }
            });
        }

        $scope.openEnableDurationDialog = function () {

            console.log($scope.brand_id);
            ngDialog.close();
            ngDialog.open({
                template: 'enabledurationdialog',
                scope: $scope,
                className: 'ngdialog-theme-default ',
                closeByDocument: false
            });

            UpdateCheckBoxUICustom();
        }

        $scope.UpdateProductSeller_ShowSuccessMessage = function ()
        {
            console.log($scope.params);
            v2BulkUpdateProductSeller.save($scope.params, function (success) {
                console.log(success);
                vm.successtoaster = {
                    type: 'success',
                    title: 'Success',
                    text: 'You have become a seller of this brand and catalog.'
                };
                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                ngDialog.close();
                reloadData();
                $(".modelform-ed").removeClass(progressLoader());
            });
            
        }

        $scope.OpenNoProductsAlert = function () {
            vm.errortoaster = {
                type: 'error',
                title: 'Empty Catalog',
                text: 'This catalog has no products.'
            };

            toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
        }

        vm.OpenDiscountSettings = function () {
            console.log(window.location);
            vm.CloseDialog();
            //window.open(window.location.origin + '/#/app/brandwisediscount')
            //window.location.href = window.location.origin + '/#/app/brandwisediscount';
            //OpenDiscountSettings();

            OpenAddEditDiscountRule()
        };
        
        vm.TableButtons = [
            {
                text: 'All Products',
                key: '1',
                className: 'tableHeading', 
            },
            {
                text: 'Reset Filter',
                key: '1',
                className: 'buttonSecondary',
                action: function (e, dt, node, config) {
                localStorage.removeItem('DataTables_' + 'publiccatalogs-datatables');

                window.location.href = "#/app/publiccatalog/?type=all"
                //$state.go('app.publiccatalog', {}, {reload: true});

                // reloadData();
                }
            },
            /*{
                text: 'Purchase Order',
                key: '1',
                className: 'orange',
                action: function (e, dt, node, config,full) {
                    vm.CreateOrderForm('purchase_order',full);
                }
            },*/

            //'copy',
            'print',
            //'excel'
        ];

        if($scope.flag_manufacturer == "true"){
            vm.TableButtons.splice(1,1);
        }

        vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
         //   url: 'api/publiccatalogdatatables1/',
            url: 'api/publicproductdatatables/',
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
            4 : { "type" : "text"},
            5 : { "type" : "text"},
            6 : { "type" : "text"},
            7 : { "type" : "dateRange", width: '100%'},
            9 : { "type" : "select", values:[{"value":"1","label":"Yes"}, {"value":"0","label":"No"}]},
            10: { "type": "select", selected: $stateParams.type, values:[{"value":"set","label":"set"}, {"value":"catalog","label":"Catalog"}, {"value":"noncatalog","label":"NonCatalog"},{"value":"become_a_seller","label":"Become A Seller"}]},
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
            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable().notVisible()
            .renderWith(function(data, type, full, meta) {
                vm.selected[full[0]] = false;
                vm.selectedFullJson[full[0]] = full;
                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
            }),
            DTColumnDefBuilder.newColumnDef(1).withTitle('json').notVisible(),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Title').renderWith(TitleLink),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Image').renderWith(imageHtml).notSortable(),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Brand').renderWith(BrandTitleLink),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Category'),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Sold by').notVisible(),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Date'),
            DTColumnDefBuilder.newColumnDef(8).withTitle('Designs').notSortable().withOption('sWidth','5%'),
            DTColumnDefBuilder.newColumnDef(9).withTitle('Trusted Seller').notVisible(),
            DTColumnDefBuilder.newColumnDef(10).withTitle('Product Type'),
            DTColumnDefBuilder.newColumnDef(11).withTitle('Actions').notSortable()
            .renderWith(function(data, type, full, meta) {
                    var htmlbutton = '';

                    if(full[1]['catalog_type'] != 'mycatalog'){
                        // if(full[1]['is_invited'] != true)
                        // {
                        //     htmlbutton += '<div style="padding-bottom:5px;"><button type="button" ng-click="SendEnquiry('+full[1]['catalog_id']+')" class="btn btn-block btn-primary">Send Enquiry</button></div>';
                        // }
                        /*   if(full[1]['is_connected'] == true) {
                            htmlbutton += '<a  style="margin-bottom:5px;" href="#" target="_self" class="applozic-launcher btn btn-default mt-lg" data-mck-id="'+full[1]['selling_company_chat_user']+'" data-mck-name="'+full[1]['selling_company_name']+'">Chat With Supplier</a>';
                        }  */

                        //if(full[1]['i_am_selling_this'] != true && $scope.flag_retailer != 'true' && full[10] != 'noncatalog'){
                        if(full[1]['i_am_selling_this'] != true && $scope.flag_retailer != 'true' && full[10] == 'catalog'){
                            htmlbutton += '<div style="padding-bottom:5px;"><button type="button" ng-click="BecomeSeller(' + full[0] + ',' + full[1]['catalog_id'] + ',' + full[1]['brand'] + ',' + full[1]['sell_full_catalog'] +')" class="linkButton" style="line-height: 20px !important;" >Become a Seller</button></div>';
                        }
                    }

                   /* if(full[7] == 'Supplier Pending' || full[7] == 'References Filled')
                    {
                        htmlbutton += '<div><button type="button" ng-click="OpenTransferBuyer('+full[1]['catalog_id']+')" class="btn btn-block btn-default mt-lg">Transfer</button></div> ';
                        htmlbutton += '<div><button type="button" ng-click="AskReference('+full[1]['catalog_id']+')" class="btn btn-block btn-primary mt-lg">Ask Reference</button></div> ';
                    }  */

                    if(htmlbutton == '')
                        return '&nbsp;';
                    else
                        return htmlbutton;
                }),

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

        // togglr methods for Become a seller inventory

        vm.checkAllCatalog = function (value) {
            console.log(value);
            for (var i = 0; i < $scope.all_sizes.length; i++) {
                $scope.all_sizes[i].selected = value;
            }
        }
        vm.toggleCheckAllCatalog = function () {
            for (var i = 0; i < $scope.all_sizes.length; i++) {
                if ($scope.all_sizes[i].selected == true) {
                    $scope.catalogDetails.selectAll = true;
                    return;
                }
            }
            $scope.catalogDetails.selectAll = false;
        }

        vm.checkAllProduct = function (value, index) {
            for (var i = 0; i < $scope.catalogDetails.products[index].all_sizes.length; i++) {
                $scope.catalogDetails.products[index].all_sizes[i].selected = value;
            }
        }
        vm.toggleCheckAllProduct = function (index) {
            for (var i = 0; i < $scope.catalogDetails.products[index].all_sizes.length; i++) {
                if ($scope.catalogDetails.products[index].all_sizes[i].selected == true) {
                    $scope.catalogDetails.products[index].selectAll = true;
                    return;
                }
            }
            $scope.catalogDetails.products[index].selectAll = false;
        }


        vm.checkAllCatalogWithoutSize = function (value, index) {
            for (var i = 0; i < $scope.catalogDetails.products.length; i++) {
                $scope.catalogDetails.products[i].selected = value;
            }
        }
        vm.toggleCheckAllCatalogWithoutSize = function () {
            for (var i = 0; i < $scope.catalogDetails.products.length; i++) {
                if ($scope.catalogDetails.products[i].selected == false) {
                    $scope.catalogDetails.selectAll = false;
                    return;
                }
            }
            $scope.catalogDetails.selectAll = true;
        }

        $scope.stopSellingAllDesign = function () {
            console.log('stopSellingAllDesign');
            $scope.catalogDetails.selectAll = false;

            $scope.UpdateInventorySubmit()
        }

        $scope.selectAllitems = function (index) {
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




        









        // not used methods




        $scope.openCreateOrderConfirm = function () {
            ngDialog.openConfirm({
                template: 'createbulkpurchaseorder',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            })
        };

        $scope.OpenEnquiryDialog = function () {

            ngDialog.openConfirm({
                template: 'addenquiry',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            })

        };

        $scope.SendEnquiry = function (id) {
            $scope.catalog_id = id;
            $scope.OpenEnquiryDialog();
        };

        vm.CreateEnquiry = function () {
            if (vm.addEnquiryForm.$valid) {
                $(".modelform").addClass(progressLoader());

                var supplierjson = {
                    'details': '{"catalog":' + $scope.catalog_id + '}', 'cid': $scope.company_id
                    , 'buyer_type': 'Enquiry', 'enquiry_catalog': $scope.catalog_id
                    , 'enquiry_item_type': vm.enquiry.enquiry_item_type, 'enquiry_quantity': vm.enquiry.enquiry_quantity
                };

                Suppliers.save(supplierjson).$promise.then(function (result) {
                    $(".modelform").removeClass(progressLoader());

                    vm.successtoaster = {
                        type: 'success',
                        title: 'Success',
                        text: result.success //'Enquiry has been sent successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    ngDialog.close();
                    reloadData();

                });
            }
            else {
                vm.addEnquiryForm.enquiry_item_type.$dirty = true;
                vm.addEnquiryForm.enquiry_quantity.$dirty = true;
            }
        };

        $scope.catalog_supplier = null;
        vm.CreateOrderForm = function (order_type, full) {
            vm.order_type = order_type
            var true_counts = 0;
            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {
                    true_counts++;
                    vm.true_key = key;
                }
            })

            if (true_counts == 1) {
                $scope.true_key = [];
                var true_count = 0;
                var keepGoing = true;
                angular.forEach(vm.selected, function (value, key) {
                    if (keepGoing) {
                        if (value == true) {
                            $scope.true_key[true_count] = key;
                            $scope.catalogid = $scope.true_key[true_count];
                            $scope.catalog_name = vm.selectedFullJson[$scope.catalogid][2];
                            $scope.catalog_supplier = vm.selectedFullJson[$scope.catalogid][1]['selling_company'];
                            $scope.catalog_supplier_name = vm.selectedFullJson[$scope.catalogid][1]['selling_company_name'];
                            console.log(vm.selectedFullJson[$scope.catalogid][1]['selling_company']);
                            true_count++;
                            keepGoing = false;
                        }
                    }
                });
                $scope.openCreateOrderConfirm();

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

        };

       
        vm.removeProduct = function (idx) {
            vm.order.products.splice(idx, 1);
        }

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
                        vm.items[itemno] = { product: product.id, rate: product.price, quantity: product.quantity };
                        itemno++;
                    }
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
                            reloadData();
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
                            reloadData();
                        });
                }

            }
            else {
                vm.orderForm.order_number.$dirty = true;
                vm.orderForm.buyer.$dirty = true;
            }
        }
        //createorder end


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


    }
})();
