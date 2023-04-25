(function() {
    'use strict';

    angular
        .module('app.brandwisediscount')
        .controller('discountruleactionController', discountruleactionController);


    discountruleactionController.$inject = ['$http', '$resource', 'Brand', 'brandwisediscount', 'Promotions',  'Brand' ,'Catalog', 'v2Products', 'v2ProductsPhotos', 'CatalogUploadOptions', 'Product', 'v2Category', 'Company', 'BuyerList', 'SalesOrders', 'toaster', 'ngDialog', '$scope', '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', 'Upload', '$filter', '$cookies', '$localStorage', 'sharedProperties'];
    function discountruleactionController($http, $resource, Brand, brandwisediscount, Promotions, Catalog, v2Products, v2ProductsPhotos, CatalogUploadOptions, Product, v2Category, Company, BuyerList, SalesOrders, toaster, ngDialog, $scope, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, Upload, $filter, $cookies, $localStorage, sharedProperties) {
        //CheckAuthenticated.check();        
      
        var vm = this;

        /*$scope.company_id = localStorage.getItem('company');// $cookies.get('company');
        $scope.discountRuleListempty = false;
        $scope.discountRuleList = [];
        $scope.discountRule = {};
        $scope.brandDictionary = {};
        $scope.filteredbrands = [];
        $scope.alreadyApplied = [];

        var vm = this;


        $scope.CloseDialog = function ()
        {
            ngDialog.close();
        };

        $scope.reload = function () {
            console.log('page reloaded');
            $state.go($state.current, {}, { reload: true });
        }


        $scope.getDiscountRulelist = function ()
        {
            $(".modelform3").addClass(progressLoader());
            brandwisediscount.query({ 'cid': $scope.company_id },
                function (success)
                {
                    $(".modelform3").removeClass(progressLoader());
                    $scope.discountRuleList = success;

                    if(success.length > 0)
                    {
                        for (var index = 0; index < $scope.discountRuleList.length; index++)
                        {
                            //console.log($scope.discountRuleList[index].brands);
                            $scope.alreadyApplied = $scope.alreadyApplied.concat($scope.discountRuleList[index].brands);

                        };
                        console.log($scope.alreadyApplied);

                        Brand.query({ cid: $scope.company_id, sub_resource: "dropdown" },
                            function (success) {
                                $scope.brands = success;
                                for (var index = 0; index < $scope.brands.length; index++)
                                {
                                    if (!$scope.alreadyAddedBrandFilter($scope.brands[index]))
                                    {
                                        $scope.filteredbrands.push($scope.brands[index]);
                                    }

                                    $scope.discountRule[$scope.brands[index].id] = $scope.brands[index].name;

                                }
                                console.log($scope.filteredbrands);
                                //console.log($scope.discountRule);

                            });
                    }
                    else {
                        $scope.discountRuleListempty = true;
                    }
                });
        }
        $scope.alreadyAddedBrandFilter = function (item) {
            //console.log($scope.alreadyApplied.indexOf(item.id) > -1)
            if ($scope.alreadyApplied.indexOf(item.id) > -1) {
                return true;
            }
            else {
                return false;
            }

        };


       
        $scope.SaveDiscountRule = function (ruleid)
        {
            $scope.params = {
                "all_brands": false,
                "name": $scope.discountRule.discountrulename,
                "cash_discount": $scope.discountRule.fullcatalogDiscount,
                "credit_discount": 0,
                "single_pcs_discount": $scope.discountRule.singlePcDiscount,
                "discount_type": "Public",
                "buyer_segmentations": [],
                "brands": $scope.discountRule.brandlist
            };
            console.log($scope.params)

            if ($scope.discountRule.brandlist == undefined || $scope.discountRule.brandlist.length < 1) {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Select one or more brands',
                    text: 'This list can not be empty.'
                };

                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                return;
            }
            if (!$scope.discountRule.discountrulename)
            {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Failed',
                    text: 'Enter Name for this Discount Rule'
                };

                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                return;
            }

            if ($scope.ruleid)
            {
                $scope.params.id = $scope.ruleid;

                $(".modelform3").addClass(progressLoader());
                brandwisediscount.patch($scope.params).$promise.then(function (result) {
                    $(".modelform3").removeClass(progressLoader());
                    console.log(result);

                    $scope.getDiscountRulelist();
                    $scope.CloseDialog();

                    $scope.discountRule = {};


                });

            }
            else {
                $(".modelform3").addClass(progressLoader());
                brandwisediscount.save($scope.params).$promise.then(function (result) {
                    $(".modelform3").removeClass(progressLoader());
                    console.log(result);

                    $scope.getDiscountRulelist();
                    $scope.CloseDialog();

                });
            }


        }

       
        $scope.DeleteDiscountRule = function () {
            $(".modelform3").addClass(progressLoader());
            brandwisediscount.delete({ 'id': $scope.ruleid }).$promise.then(function (result) {
                $(".modelform3").removeClass(progressLoader());
                console.log(result);

                $scope.getDiscountRulelist();
                $scope.CloseDialog();

            });

        };*/

        

          
    }
})();