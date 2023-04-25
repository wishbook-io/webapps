
(function () {
    'use strict';

    angular
        .module('app.brandwisediscount')
        .controller('brandwisediscountController', brandwisediscountController);

    brandwisediscountController.$inject = ['$resource', 'v2brandwisediscount', 'Brand', 'djangoAuth', '$state', '$scope', '$stateParams', 'toaster', 'CheckAuthenticated', 'SidebarLoader', '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', 'ngDialog', '$cookies', '$localStorage'];
    function brandwisediscountController($resource, v2brandwisediscount, Brand, djangoAuth, $state, $scope, $stateParams, toaster, CheckAuthenticated, SidebarLoader, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, ngDialog, $cookies, $localStorage) {
        //CheckAuthenticated.check();
        $scope.app.offsidebarOpen = false;

        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
        $scope.discountRuleListempty = false;
        $scope.discountRuleList = [];
        $scope.discountRule = {};
        $scope.brandDictionary = {};
        $scope.allbrandsDict = [];
        $scope.alreadyApplied = [];
        $scope.brandsiown = [];
        $scope.brandsisell =[];

        var vm = this;

        console.log($stateParams);
        
        

        $scope.CloseDialog = function () {
            ngDialog.close();
        };

        $scope.getDiscountRulelist = function ()
        {
            $scope.brands = [];
            $scope.alreadyApplied = [];
            $scope.brandsiown = [];
            $scope.brandsisell = [];
            $(".modelform3").addClass(progressLoader());
            v2brandwisediscount.query({ 'cid': $scope.company_id },
                function (success)
                {
                    $(".modelform3").removeClass(progressLoader());
                    $scope.discountRuleList = success;
                    console.log($scope.discountRuleList);

                    if (success.length > 0)
                    {
                        for (var index = 0; index < $scope.discountRuleList.length ; index++)
                        {
                            //console.log($scope.discountRuleList[index].brands);
                            if($scope.ruleid && $scope.ruleid == $scope.discountRuleList[index].id){
                                console.log($scope.ruleid);
                                continue;
                            }
                            else{
                                $scope.alreadyApplied = $scope.alreadyApplied.concat($scope.discountRuleList[index].brands);
                            }
                        };
                        console.log($scope.alreadyApplied);
                       
                        Brand.query({ cid: $scope.company_id, sub_resource: "dropdown", "mycompany": true },
                            function (success) {
                                $scope.brandsiown = success;
                                for (var index = 0; index < $scope.brandsiown.length; index++)
                                {
                                    if (!$scope.alreadyAddedBrandFilter($scope.brandsiown[index])) {
                                        $scope.brandsiown[index].disabled = false;
                                    }
                                    else {
                                        $scope.brandsiown[index].disabled = true;
                                    }

                                    $scope.discountRule[$scope.brandsiown[index].id] = $scope.brandsiown[index].name;
                                    $scope.allbrandsDict.push($scope.brandsiown[index]);

                                }
                                console.log($scope.allbrandsDict);
                                console.log($scope.brandsiown);
                                //console.log($scope.discountRule);
                                
                            });

                        Brand.query({ cid: $scope.company_id, sub_resource: "dropdown", "type": 'brandisell' },
                            function (success) {
                                $scope.brandsisell = success;
                                for (var index = 0; index < $scope.brandsisell.length; index++) {
                                    if (!$scope.alreadyAddedBrandFilter($scope.brandsisell[index])) {
                                        $scope.brandsisell[index].disabled = false;
                                    }
                                    else {
                                        $scope.brandsisell[index].disabled = true;
                                    }

                                    $scope.discountRule[$scope.brandsisell[index].id] = $scope.brandsisell[index].name;
                                    $scope.allbrandsDict.push($scope.brandsisell[index]);

                                }
                                console.log($scope.allbrandsDict);
                                console.log($scope.brandsisell);
                                //console.log($scope.discountRule);
                               
                            });
                    }
                    else
                    {
                        $scope.discountRuleListempty = true;

                        Brand.query({ cid: $scope.company_id, sub_resource: "dropdown", "mycompany": true },
                            function (success) {
                                $scope.brandsiown = success;
                                for (var index = 0; index < $scope.brandsiown.length; index++) {
                                    if (!$scope.alreadyAddedBrandFilter($scope.brandsiown[index])) {
                                        $scope.brandsiown[index].disabled = false;
                                    }
                                    else {
                                        $scope.brandsiown[index].disabled = true;
                                    }

                                    $scope.discountRule[$scope.brandsiown[index].id] = $scope.brandsiown[index].name;
                                    $scope.allbrandsDict.push($scope.brandsiown[index]);
                                }
                                console.log($scope.allbrandsDict);
                                console.log($scope.brandsiown);
                            });

                        Brand.query({ cid: $scope.company_id, sub_resource: "dropdown", "type": 'brandisell' },
                            function (success) {
                                $scope.brandsisell = success;
                                for (var index = 0; index < $scope.brandsisell.length; index++) {
                                    if (!$scope.alreadyAddedBrandFilter($scope.brandsisell[index])) {
                                        $scope.brandsisell[index].disabled = false;
                                    }
                                    else {
                                        $scope.brandsisell[index].disabled = true;
                                    }

                                    $scope.discountRule[$scope.brandsisell[index].id] = $scope.brandsisell[index].name;
                                    $scope.allbrandsDict.push($scope.brandsisell[index]);
                                }
                                console.log($scope.allbrandsDict);
                                console.log($scope.brandsisell);
                            });
                    }

                    UpdateCheckBoxUI();

                    console.log($stateParams);
                     if ($stateParams.rule_id) {
                        $scope.openAddEditDiscountRule($stateParams.rule_id)
                    } 
                });
        }

        $scope.getDiscountRulelist();


        $scope.alreadyAddedBrandFilter = function (item)
        {
            //console.log($scope.alreadyApplied.indexOf(item.id) > -1)
            if($scope.alreadyApplied.indexOf(item.id) > -1)
            {
                return true;
            }
            else
            {
                return false;
            }
        };

        $scope.reload = function ()
        {
            console.log('page reloaded');
            $state.go($state.current, {}, { reload: true });
        }

        $scope.OpenBrandspecificProducts = function (filter)
        {
            $scope.CloseDialog();
            if (filter) {
                window.location.href = window.location.origin + '/#/app/brand-catalogs/?brand=' + $scope.discountRule.brandlist[0] + '&name=' + $scope.discountRule[$scope.discountRule.brandlist[0]];
            }
            else
            {
                window.location.href = window.location.origin + '/#/app/brand-catalogs/?brand=' + $scope.discountRule.brandlist[0] + '&name=' + $scope.discountRule[$scope.discountRule.brandlist[0]] +'&type=public';
            }
        }


        $scope.openAddEditDiscountRule = function (ruleid)
        {
            console.log(ruleid);
            $scope.ruleid = ruleid;
            $scope.discountRule.brandlist =[];

            if (ruleid && ruleid != "null" && ruleid != "undefined")
            {

                $(".modelform3").addClass(progressLoader());
                v2brandwisediscount.get({ 'id': $scope.ruleid, 'cid': $scope.company_id }).$promise.then(function (result) {
                    $(".modelform3").removeClass(progressLoader());
                    console.log(result);

                    $scope.dialogtitle = result.name;
                    $scope.discountRule.discountrulename = result.name;
                    $scope.discountRule.fullcatalogDiscount = parseInt(result.cash_discount);
                    $scope.discountRule.singlePcDiscount = parseInt(result.single_pcs_discount);
                    $scope.discountRule.brandlist = result.brands;
                    $scope.discountRule.from_date = result.from_date;
                    $scope.discountRule.selling_all_catalog = result.selling_all_catalog.toString();
                    $scope.discountRule.selling_all_catalog_as_single = result.selling_all_catalog_as_single.toString();
                    

                    $scope.discountRule.minfullcatalogDiscount = parseInt(result.cash_discount);
                    $scope.discountRule.minsinglePcDiscount = parseInt(result.single_pcs_discount);

                    console.log($scope.discountRule.brandlist);

                    v2brandwisediscount.get({ 'id': $scope.ruleid, 'cid': $scope.company_id, 'expand': true }).$promise.then(function (success)
                    {
                        $scope.discountRule.all_catalogs_count = success.selling_catalog_count.all_catalogs_count;
                        $scope.discountRule.single_catalogs_count = success.selling_catalog_count.single_catalogs_count;
                    });

                });

            }
            else {
                $scope.dialogtitle = 'Add Discount rule';
                $scope.discountRule.brandlist = [];
 
                setTimeout(() => {
                    $('#inlineradio2').click();
                    $('#inlineradio4').click();
                }, 1000);
            }

            ngDialog.openConfirm({
                template: 'AddDiscountRuledialog',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        

        $scope.addbranditems = function (data, myE)
        {
            console.log(data);
            var index = $scope.discountRule.brandlist.indexOf(data.id);
            if (index !== -1) {
                $scope.discountRule.brandlist.splice(index, 1); //if already present remove fabric id
            }
            else {
                console.log($scope.discountRule.brandlist.length);
                $scope.discountRule.brandlist.push(data.id); //if not present add fabric.id to list

            }
            console.log($scope.discountRule.brandlist);
            console.log($scope.discountRule[data.id]);
            console.log($scope.discountRule);

            
        };

        $scope.addbranditemsbrandsyouown = function (data, myE)
        {
            if ($scope.brandDictionary.brandsyouown)
            {
                for (var index = 0; index < $scope.brandsiown.length; index++)
                {
                    if ($scope.discountRule.brandlist.indexOf($scope.brandsiown[index].id) < 0)
                    {
                        $scope.discountRule.brandlist.push($scope.brandsiown[index].id);
                    }
                }
            }
            else
            {
                
                for (var i = 0; i < $scope.discountRule.brandlist.length; i++)
                {
                    for (var index = 0; index < $scope.brandsiown.length; index++) {
                        //if ($scope.discountRule.brandlist.indexOf($scope.brandsiown[index].id) >= 0)
                        if ($scope.discountRule.brandlist[i] === $scope.brandsiown[index].id)
                        {
                            $scope.discountRule.brandlist.splice(i, 1);
                        }
                    }
                };
                
            }
            console.log($scope.discountRule.brandlist);
        }

        $scope.addbranditemsbrandsyousell = function ()
        {
            if ($scope.brandDictionary.brandsyousell) {
                for (var index = 0; index < $scope.brandsisell.length; index++) {
                    if ($scope.discountRule.brandlist.indexOf($scope.brandsisell[index].id) < 0) {
                        $scope.discountRule.brandlist.push($scope.brandsisell[index].id);
                    }
                }
            }
            else {
              
                for (var i = 0; i < $scope.discountRule.brandlist.length; i++)
                {
                    for (var index = 0; index < $scope.brandsisell.length; index++)
                    {
                        //if ($scope.discountRule.brandlist.indexOf($scope.brandsisell[index].id) >= 0) {
                        if ($scope.discountRule.brandlist[i] === $scope.brandsisell[index].id )
                        {
                        $scope.discountRule.brandlist.splice(i, 1);
                        }
                    }
                };
            }
            console.log($scope.discountRule.brandlist);
        }

        $scope.addbranditemsAllbrands = function ()
        {
            if ($scope.brandDictionary.allbrands)
            {
                for (var index = 0; index < $scope.allbrandsDict.length; index++) {
                    if ($scope.discountRule.brandlist.indexOf($scope.allbrandsDict[index].id) < 0)
                    {
                        $scope.discountRule.brandlist.push($scope.allbrandsDict[index].id);
                    }
                }
            }
            else {
                $scope.brandDictionary.brandsyousell = false;
                $scope.brandDictionary.brandsyouown = false;
                $scope.discountRule.brandlist = [];
            }
            console.log($scope.discountRule.brandlist);
        }


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
                "brands": $scope.discountRule.brandlist,
                "from_date" : $scope.discountRule.from_date,
                "selling_all_catalog" : $scope.discountRule.selling_all_catalog,
                "selling_all_catalog_as_single" : $scope.discountRule.selling_all_catalog_as_single
            };
            if ($scope.discountRule.brandlist.length == $scope.allbrandsDict.length && $scope.allbrandsDict.length > 1) {
                $scope.params.all_brands = true;
                $scope.params.brands = [];
            }
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

            if ($scope.ruleid && $scope.ruleid != 'null' )
            {
                $scope.params.id = $scope.ruleid;

                $(".modelform3").addClass(progressLoader());
                v2brandwisediscount.patch($scope.params).$promise.then(function (result) {
                    $(".modelform3").removeClass(progressLoader());
                    console.log(result);


                    $scope.CloseDialog();

                    $scope.discountRule = {};


                    if ($stateParams.rule_id)
                    {
                        OpenDiscountSettings(); //clear url
                    }
                    else
                    {
                        $scope.reload();
                    }


                });

            }
            else {
                $(".modelform3").addClass(progressLoader());
                v2brandwisediscount.save($scope.params).$promise.then(function (result) {
                    $(".modelform3").removeClass(progressLoader());
                    console.log(result);


                    $scope.CloseDialog();
                    $scope.discountRule = {};

                    if ($stateParams.rule_id) {
                        OpenDiscountSettings(); //clear url
                    }
                    else {
                        $scope.reload();
                    }

                });
            }


        }


       


        $scope.openDeleteDiscountRule = function (ruleid) {
            console.log(ruleid);
            $scope.ruleid = ruleid;

            ngDialog.openConfirm({
                template: 'DeleteDiscountRuledialog',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        $scope.DeleteDiscountRule = function () {
            $(".modelform3").addClass(progressLoader());
            v2brandwisediscount.delete({ 'id': $scope.ruleid }).$promise.then(function (result) {
                $(".modelform3").removeClass(progressLoader());
                console.log(result);

                $scope.getDiscountRulelist();
                $scope.CloseDialog();

            });

        };









    }
})();
