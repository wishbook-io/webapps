(function() {
    'use strict';

    angular
        .module('app.brandwisediscount')
        .controller('brandwisediscountController', brandwisediscountController);

    brandwisediscountController.$inject = ['$resource', 'ngDialog', 'Brand', 'v2brandwisediscount',  'BrandDistributor', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$localStorage'];
    function brandwisediscountController($resource, ngDialog, Brand, v2brandwisediscount, BrandDistributor,  toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, $localStorage) {
        CheckAuthenticated.check();
        $scope.company_id = localStorage.getItem('company');
        $scope.is_staff   = localStorage.getItem('is_staff');
        var vm = this;
        
        
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        $scope.update_flag = false;
        $scope.discountRuleListempty = false;
        $scope.discountRuleList = [];
        $scope.discountRule = {};
        $scope.brandDictionary = {};
        $scope.allbrandsDict = [];
        $scope.alreadyApplied = [];
        $scope.brandsiown = [];
        $scope.brandsisell =[];
        
        $scope.tagHandler = function (tag){
            return null;
        }
        $scope.CloseDialog = function () {
            ngDialog.close();
        };
        $scope.sellingCompanyChanged = function(){
            $scope.brands = [];
            $scope.allbrandsDict = [];
            $scope.alreadyApplied = [];
            $scope.brandsiown = [];
            $scope.brandsisell =[];
        }
        $scope.getDiscountRulelist = function (selling_company_id)
        {
            $(".modelform3").addClass(progressLoader());
            v2brandwisediscount.query({ 'cid': $scope.company_id, 'selling_company': selling_company_id },
                function (success)
                {
                    $(".modelform3").removeClass(progressLoader());
                    $scope.discountRuleList = success;

                    if (success.length > 0)
                    {
                        for (var index = 0; index < $scope.discountRuleList.length ; index++)
                        {
                            //console.log($scope.discountRuleList[index].brands);
                            if($scope.ruleid && $scope.ruleid == $scope.discountRuleList[index].id){
                                continue;
                            }
                            $scope.alreadyApplied = $scope.alreadyApplied.concat($scope.discountRuleList[index].brands);

                        };
                        console.log($scope.alreadyApplied);

                        /*Brand.query({ cid: $scope.company_id, company: selling_company_id, type: 'my', sub_resource: "dropdown" },
                        function (success)
                        {
                            $scope.brands = success;
                            for (var index = 0; index < $scope.brands.length; index++)
                            {
                                if(!$scope.alreadyAddedBrandFilter($scope.brands[index])) 
                                {
                                    $scope.brands[index].disabled = false;
                                }
                                else{
                                    $scope.brands[index].disabled = true;   
                                }

                                $scope.discountRule[$scope.brands[index].id] = $scope.brands[index].name;

                            }
                           
                            console.log($scope.brands);
                            //console.log($scope.discountRule);
                        });*/
                        Brand.query({ cid: $scope.company_id, company: selling_company_id, type: 'my', sub_resource: "dropdown", "mycompany": true },
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
                            });

                        Brand.query({ cid: $scope.company_id, company: selling_company_id, type: 'my', sub_resource: "dropdown", "type": 'brandisell' },
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
                    else
                    {
                        $scope.discountRuleListempty = true;

                        /*Brand.query({ cid: $scope.company_id, company: selling_company_id, type: 'my',  sub_resource: "dropdown" },
                            function (success) {
                                $scope.brands = success;
                                for (var index = 0; index < $scope.brands.length; index++) {
                                    if (!$scope.alreadyAddedBrandFilter($scope.brands[index])) {
                                        
                                        $scope.brands[index].disabled = false;
                                    }
                                    else{
                                        $scope.brands[index].disabled = true;   
                                    }

                                    $scope.discountRule[$scope.brands[index].id] = $scope.brands[index].name;

                                }
                               
                                console.log($scope.brands);
                                //console.log($scope.discountRule);

                            });*/
                        Brand.query({ cid: $scope.company_id, company: selling_company_id, type: 'my', sub_resource: "dropdown", "mycompany": true },
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

                        Brand.query({ cid: $scope.company_id, company: selling_company_id, type: 'my', sub_resource: "dropdown", "type": 'brandisell' },
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
                });
        }

        

       

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
        $scope.openAddEditDiscountRule = function (ruleid,selling_company_id)
        {
            console.log(ruleid);
            $scope.ruleid = ruleid;
            $scope.selling_company_id = selling_company_id;
            console.log($scope.selling_company_id);
            $scope.discountRule.brandlist = [];
            $scope.brandsiown = [];
            $scope.brandsisell = [];
            if(ruleid)
            {
                $scope.getDiscountRulelist($scope.selling_company_id);

                //Get previously stored orfder item details

                $(".modelform3").addClass(progressLoader());
                v2brandwisediscount.get({ 'id': $scope.ruleid }).$promise.then(function (result) {
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
                    var temp = [];

                    /*angular.forEach(result.brands, function (id)
                    {
                        var ob = {};
                        ob.id = id;
                        ob.name = $scope.discountRule[id];
                        temp.push(ob);
                    });*/

                    //$scope.discountRule.brandlist = temp;
                    console.log($scope.discountRule.brandlist);

                });

            }
            else {
                $scope.dialogtitle = 'Set Discount';
                $scope.discountRule = {};
                $scope.discountRule.brandlist = [];
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
                //"selling_company" : $scope.selling_company_id,
                "from_date" : $scope.discountRule.from_date,
                "selling_all_catalog" : $scope.discountRule.selling_all_catalog,
                "selling_all_catalog_as_single" : $scope.discountRule.selling_all_catalog_as_single
            };
            if ($scope.discountRule.brandlist.length == $scope.allbrandsDict.length && $scope.allbrandsDict.length > 1)
            {
                $scope.params.all_brands = true;
                $scope.params.brands = [];
            }


            console.log($scope.params)

            if($scope.is_staff == 'true' && !$scope.ruleid){
                $scope.params.selling_company = parseInt($scope.discountRule.selling_company_id);
            }
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

                $(".modelform2").addClass(progressLoader());
                v2brandwisediscount.patch($scope.params).$promise.then(function (result) {
                    $(".modelform2").removeClass(progressLoader());
                    console.log(result);

                    // $scope.getDiscountRulelist();
                    $scope.CloseDialog();
                    reloadData();
                    $scope.discountRule = {};


                });

            }
            else {
                $(".modelform2").addClass(progressLoader());
                v2brandwisediscount.save($scope.params).$promise.then(function (result) {
                    $(".modelform2").removeClass(progressLoader());
                    console.log(result);
                    reloadData();
                    $scope.discountRule = {};
                    $scope.CloseDialog();

                });
            }


        }
        
        vm.CloseDialog = function() {
            ngDialog.close();
        };

    
        
        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';

        function imageHtml(data, type, full, meta){
          return '<a ng-click="OpenProductsImages('+full[0]+')"><img src="'+full[4]+'" style="width: 100px; height: 100px"/></a>';
        }

        function TitleLink(data, type, full, meta){
          return '<a href="#/app/brand-catalogs/?brand='+full[0]+'&name='+full[1]+'">'+full[1]+'</a>';
        }
        
        function reloadData() {
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
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/brandwisediscountadmindatatables/',
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
                            2 : { "type" : "text"},
                            3 : { "type" : "text"},
                            6 : { "type" : "text"},
                            7 : { "type" : "text"},
                            8: { "type": "dateRange", width: '100%' },
                            9 : { "type" : "select", values:[{"value":"1","label":"true"}, {"value":"0","label":"false"}]},
                            10 : { "type" : "select", values:[{"value":"1","label":"true"}, {"value":"0","label":"false"}]},
                        })
                        
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
                        .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
                        
                        .withPaginationType('full_numbers')
                        
                        .withButtons([
							{
                                text: 'Add Discount Rule',
                                key: '1',
                                className: 'green',
                                action: function (e, dt, node, config) {
                                    $scope.mapping = {};
                                    $scope.openAddEditDiscountRule();
                                }
                            },
                            {
                                  text: 'Reset Filter',
                                  key: '1',
                                  className: 'green',
                                  action: function (e, dt, node, config) {
                                    localStorage.removeItem('DataTables_' + 'brands-datatables');
                                    $state.go($state.current, {}, {reload: true});
                                  }
                            },
                           /* {
                                text: 'Update Brand I Own',
                                key: '1',
                                className: 'green',
                                action: function (e, dt, node, config) {
                                    $scope.mapping = {};
                                    vm.OpenUpdateBrandIown();
                                }
                            }, */
                            'print',
                            'excel',
                            
                        ]);

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
            .renderWith(function(data, type, full, meta) {
                vm.selected[full[0]] = false;
                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
            }).notVisible(),
            DTColumnDefBuilder.newColumnDef(1).withTitle('json').notVisible(),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Company'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Rule Name'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Image').renderWith(imageHtml).notSortable(),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Brand I Own / Sell'),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Full Catalog Discount'),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Single Piece Discount'),
            DTColumnDefBuilder.newColumnDef(8).withTitle('From Date'),
            DTColumnDefBuilder.newColumnDef(9).withTitle('Selling all catalog'),
            DTColumnDefBuilder.newColumnDef(10).withTitle('Selling all catalog as single'),
            DTColumnDefBuilder.newColumnDef(11).withTitle('Action').notSortable()
                .renderWith(function(data, type, full, meta) {
                 
                        return '<div><button type="button" ng-click="openAddEditDiscountRule('+full[0]+','+full[1]['selling_company_id']+')" class="btn btn-primary mt-lg">Edit Rule</button></div>';
                
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
