(function() {
    'use strict';

    angular
        .module('app.brands')
        .controller('BrandsController', BrandsController);

    BrandsController.$inject = ['$resource', 'ngDialog', 'Company', 'Brand', 'BrandDistributor', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$localStorage'];
    function BrandsController($resource, ngDialog, Company, Brand, BrandDistributor,  toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, $localStorage) {
        CheckAuthenticated.check();
        $scope.company_id = localStorage.getItem('company');

        var vm = this;
        
        
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};
        $scope.InitialbrandList = [];

        UpdateCheckBoxUI();

        $scope.update_flag = false;


        
        
        $scope.tagHandler = function (tag){
            return null;
        }
        $scope.OpenDialog = function () {
            ngDialog.open({
                template: 'addbrand',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        $scope.OpenUpdateBrandDialog = function () {
            ngDialog.open({
                template: 'updatebrand',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        vm.CloseDialog = function() {
            ngDialog.close();
        };

        $scope.brandiown = function(){
            $scope.brand_type = 'iown';
            vm.brand_type = 'iown';
            console.log($scope.brand_type);
        }
        $scope.brandisell = function(){
            $scope.brand_type = 'isell';
            vm.brand_type = 'isell';
            console.log($scope.brand_type);
            
            $(".modelform3").addClass(progressLoader());
            BrandDistributor.query({'company': $scope.company_id, 'cid':$scope.company_id}).$promise.then(function(bd){
                            if(bd.length != 0)
                            {
                                $scope.company.brand = bd[0].brand;
                                $scope.InitialbrandList = bd[0].brand;

                                console.log($scope.company.brand);
                            }
                    });

                $scope.brands = Brand.query({showall: true, cid:$scope.company_id, sub_resource:"dropdown"},
                function(success){
                    $(".modelform3").removeClass(progressLoader());     
                    
                });
                
        }
        

        vm.AddBrandIown = function() {
            if(vm.brandiownForm.$valid) {
                $(".modelform").addClass(progressLoader());
               
				Brand.save({"cid":$scope.company_id, "name":$scope.brand.name, "company" : $scope.company_id, "image": $scope.brand.image_temp },
                function(success){
                    $(".modelform").removeClass(progressLoader());
                    
                    ngDialog.close();
                    $scope.brand_type = '';
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Brand i own added successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);

                    ngDialog.open({
                        template: 'setDeiscountMessage',
                        scope: $scope,
                        className: 'ngdialog-theme-default',
                        closeByDocument: false
                    }); 

                    reloadData();
                });
            }
            else
            {
                vm.brandiownForm.name.$dirty = true;
                vm.brandiownForm.image.$dirty = true;
            }
        };


        vm.submitBrandDistributor = function (){
            console.log($scope.company.brand);
            if($scope.company.brand == undefined || $scope.company.brand.length < 1)
            {
                vm.errortoaster = {
                    type:  'error',
                    title: 'Brand I sell',
                    text:  'This list may not be empty.'
                };   
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                return;
            }
          
            $(".modelform3").addClass(progressLoader());
                BrandDistributor.query({company: $scope.company_id, cid:$scope.company_id}).$promise.then(function(bd){
                    //  alert(bd[0].brand);
                    if(bd.length == 0)
                    {
                    vm.createBrandDistributor();
                    }
                    else
                    {
                    $scope.BrandDistributorId = bd[0].id;
                    vm.updateBrandDistributor($scope.BrandDistributorId);
                    }
                });
        }

        vm.createBrandDistributor = function ()
        {
            BrandDistributor.save({"company" : $scope.company_id , "brand":$scope.company.brand, "cid":$scope.company_id},
                function(success){

                Company.patch({ "id" : $scope.company_id, "brand_added_flag" : "yes"},
                function(success)
                {
                    $(".modelform3").removeClass(progressLoader());
                    ngDialog.close();
                    $scope.brand_type = '';
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Brands I Sell added successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);

                    if ($scope.company.brand.length > $scope.InitialbrandList.length)
                    {
                        ngDialog.open({
                            template: 'setDeiscountMessage',
                            scope: $scope,
                            className: 'ngdialog-theme-default',
                            closeByDocument: false
                        });    
                    }

                    reloadData();
                        
                },function(error){
                        $(".modelform2").removeClass(progressLoader());
                        vm.errortoaster = {
                            type:  'error',
                            title: 'Failed',
                            text:  'Brand added flag is not updated.'
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    });
                    
                }/*,
                function(error){
                        $(".modelform2").removeClass(progressLoader());
                        vm.errortoaster = {
                            type:  'error',
                            title: 'Failed',
                            text:  'Brands I Sell is not added.'
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }*/); 
          }

        vm.updateBrandDistributor = function (id)
        {
            $scope.BrandDistributorId = id;
            BrandDistributor.patch({"id":$scope.BrandDistributorId, "company" : $scope.company_id , "brand":$scope.company.brand, "cid":$scope.company_id},
            function(success){
                    $(".modelform3").removeClass(progressLoader());
                    ngDialog.close();
                    $scope.brand_type = '';
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Brands I Sell updated successfully.'
                    };
                    
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);

                    if ($scope.company.brand.length > $scope.InitialbrandList.length) {
                        ngDialog.open({
                            template: 'setDeiscountMessage',
                            scope: $scope,
                            className: 'ngdialog-theme-default',
                            closeByDocument: false
                        });
                    }
                    reloadData();
                    
                }/*,
                function(error){
                    vm.errortoaster = {
                            type:  'error',
                            title: 'Failed',
                            text:  'Brands I Sell is not updated.'
                    };
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }*/);   
        }

        vm.UpdateBrandIown = function()  {
            $(".modelform2").addClass(progressLoader());
            if($scope.brand.image_new != null)
            {
              $scope.params = {"cid":$scope.company_id, "id": $scope.brand.id, "name":$scope.brand.name, "company" : $scope.company_id, "image": $scope.brand.image_new }
            }
            else
            {
              $scope.params = {"cid":$scope.company_id, "id": $scope.brand.id, "name":$scope.brand.name, "company" : $scope.company_id }          
            }

            Brand.patch($scope.params,
              function(success){
                    $(".modelform2").removeClass(progressLoader());
                    ngDialog.close();
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Brand I Own updated successfully.'
                    };
                    reloadData();
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    //$state.go('app.catalog');
                                       
              });
        }

        vm.OpenAddBrand = function() {

            $scope.OpenDialog(); 
            $scope.company = {};
            $scope.brand = {};
            
         //   $scope.company = Company.query({sub_resource:"dropdown", relation_type:"buyer_suppliers"});
        };

        vm.OpenDiscountSettings = function ()
        {
            console.log(window.location);
            ngDialog.close();
            //window.location.href = window.location.origin +'/#/app/brandwisediscount';
            //window.location.assign(window.location.origin +'/#/app/brandwisediscount');
            //window.open(window.location.origin +'/#/app/brandwisediscount');

            OpenDiscountSettings();

        };

        $scope.OpenUpdateBrandIown = function(id) {

            console.log('test');
            Brand.get({ id: id, cid: $scope.company_id }).$promise.then(function(result){
                    
                $scope.brand = {};
                $scope.brand.id = result.id;
                $scope.brand.image = result.image.full_size;
                $scope.brand.name = result.name;
                
                $scope.OpenUpdateBrandDialog();
    
            });
            
        };
        
        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';

        function imageHtml(data, type, full, meta){
            return '<a href="#/app/brand-catalogs/?brand=' + full[0] + '&name=' + full[1] +'" class="hvr-grow"><img src="'+full[2]+'" class="loading"/></a>';
        }

        function TitleLink(data, type, full, meta)
        {
            var htmlbutton = '<div style="text-align:center"><label>' + full[1] +'</label></div>';

            if (full[3] != 'Brand I Sell') {
                htmlbutton += '<div><button type="button" ng-click="OpenUpdateBrandIown(' + full[0] + ')" class="linkButton" >Update</button></div>';
            }
            return htmlbutton;
        }
        
        function reloadData()
        {
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

        


        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/brandownsaledatatables/',
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
                            1 : { "type" : "text"},
                            3 : { "type" : "select", values:[{"value":"Brand I Own","label":"Brand I Own"}, {"value":"Brand I Sell","label":"Brand I Sell"}]},
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
                                text: 'My Brands',
                                key: '1',
                                className: 'tableHeading', 
                            },
							
                            {
                                  text: 'Reset Filter',
                                  key: '1',
                                  className: 'buttonSecondary',
                                  action: function (e, dt, node, config) {
                                    localStorage.removeItem('DataTables_' + 'brands-datatables');
                                    $state.go($state.current, {}, {reload: true});
                                  }
                            },
                            /* {
                                text: 'Update Brand I Own',
                                key: '1',
                                className: 'buttonPrimary',
                                action: function (e, dt, node, config) {
                                    $scope.mapping = {};
                                    vm.OpenUpdateBrandIown();
                                }
                            }, */
                            'print',
                            'excel',
                            {
                                text: 'Add Brand',
                                key: '1',
                                className: 'buttonPrimary',
                                action: function (e, dt, node, config) {
                                    $scope.mapping = {};
                                    vm.OpenAddBrand();
                                }
                            },
                            {
                                text: 'Discount settings',
                                key: '1',
                                className: 'buttonPrimary',
                                action: function (e, dt, node, config) {
                                    
                                    vm.OpenDiscountSettings();
                                }
                            }
                            
                        ]);
            
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
            .renderWith(function(data, type, full, meta) {
                vm.selected[full[0]] = false;
                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
            }).notVisible(),
            DTColumnDefBuilder.newColumnDef(1).withTitle('Title').renderWith(TitleLink),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Image').renderWith(imageHtml).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Brand I Own / Sell'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Discount').notSortable()
            .renderWith(function(data, type, full, meta)
            {
                var htmlbutton = '';
                if (full[4].single_discount || full[4].full_discount)
                {
                    htmlbutton += '<p>Single ' + full[4].single_discount + '%</p><p>Full ' + full[4].full_discount + '%</p>';
                    htmlbutton += '<div><button type="button" onclick="OpenAddEditDiscountRule(' + full[4].discount_rule_id + ')" class="linkButton" style="width:unset">Update</button></div>';
                }
                else
                {
                    htmlbutton += '<div><button type="button" onclick="OpenAddEditDiscountRule(' + full[4].discount_rule_id + ')" class="linkButton" style="width:unset">Add Discount rule</button></div>'
                }
                
                return htmlbutton;
            }),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Live Catalogs').notSortable()
                .renderWith(function (data, type, full, meta) {
                    var htmlbutton = '';

                    //console.log(full[5]);

                    if (full[5] >0) 
                    {
                        htmlbutton += ' <p>' + full[5] + ' Live Catalogs</p> <a href="#/app/brand-catalogs/?brand=' + full[0] + '&name=' + full[1] +'">view</a>';
                    }
                    else
                    {
                        htmlbutton += '<span>' + full[5] + ' Live Catalogs</span>';
                    }
                    return htmlbutton;
                })
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

        $(document).ready(function () {
            setTimeout(function () {
                var paginationbuttons = document.getElementsByClassName('paging_full_numbers')
                var i = paginationbuttons.length;
                while (i--) {
                    paginationbuttons[i].addEventListener("click", function () {
                        UpdateCheckBoxUI();
                    });
                }
                var tableheaders = document.getElementsByTagName('th');
                var j = tableheaders.length;
                while (j--) {
                    tableheaders[j].addEventListener("click", function () {
                        UpdateCheckBoxUI();
                    });
                    tableheaders[j].addEventListener("keydown", function () {
                        UpdateCheckBoxUI();
                    });
                }
                console.log('UpdateCheckBoxUI() attached')

            }, 3000);
        });
        
        
    }
})();
