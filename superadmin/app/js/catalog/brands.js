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
        }
        $scope.brandisell = function(){
                $scope.brand_type = 'isell';
                
                $(".modelform3").addClass(progressLoader());
                BrandDistributor.query({company: $scope.company_id, cid:$scope.company_id}).$promise.then(function(bd){
                              if(bd.length != 0)
                              {
                                $scope.company.brand = bd[0].brand;
                              }
                        });

                $scope.brands = Brand.query({showall: true, cid:$scope.company_id, sub_resource:"dropdown"},
                function(success){
                        $(".modelform3").removeClass(progressLoader());     
                        
                    }
                  );
                
        }
        

        vm.AddBrandIown = function() {
            if(vm.brandiownForm.$valid) {
                $(".modelform").addClass(progressLoader());
       //         alert(JSON.stringify($scope.buyer));
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

          vm.createBrandDistributor = function (){
               BrandDistributor.save({"company" : $scope.company_id , "brand":$scope.company.brand, "cid":$scope.company_id},
                        function(success){

                                Company.patch({ "id" : $scope.company_id, "brand_added_flag" : "yes"},
                            function(success){
                                 $(".modelform3").removeClass(progressLoader());
                                 ngDialog.close();
                                 $scope.brand_type = '';
                                 vm.successtoaster = {
                                      type:  'success',
                                      title: 'Success',
                                      text:  'Brands I Sell added successfully.'
                                  };
                                  toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                  /*
                                  SidebarLoader.getMenu;
                                  $state.go('app.catalog',{ reload: true }); 
                                  location.reload(); */
                                  

                            }/*,
                            function(error){
                                 $(".modelform2").removeClass(progressLoader());
                                  vm.errortoaster = {
                                        type:  'error',
                                        title: 'Failed',
                                        text:  'Brand added flag is not updated.'
                                    };
                                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                            }*/) 
                          
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

          vm.updateBrandDistributor = function (id){
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
                        reloadData();
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        
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

        $scope.OpenUpdateBrandIown = function(id) {

            /*var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })
            
            if(true_count == 1)
            {  */
                console.log('test');
                Brand.get({ id: id, cid: $scope.company_id }).$promise.then(function(result){
                      
                //        if (result.company == $scope.company_id) {
                          
                            $scope.brand = {};
                            $scope.brand.id = result.id;
                            $scope.brand.image = result.image.full_size;
                            $scope.brand.name = result.name;
                            
                            $scope.OpenUpdateBrandDialog();                            

              /*          } 
                        else
                        {
                            vm.errortoaster = {
                                type:  'error',
                                title: 'Failed',
                                text:  'You can not update Brand I Sell.'
                            };
                            console.log(vm.errortoaster);
                            toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
                         
                        }   */
                         
                        });
           /*   }
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
            //$scope.OpenDialog();
            
            
            
        };
        
        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';

        function imageHtml(data, type, full, meta){
          return '<a ng-click="OpenProductsImages('+full[0]+')"><img src="'+full[2]+'" style="width: 100px; height: 100px"/></a>';
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
                            url: 'api/brandownsaledatatables/',
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
                                text: 'Add Brand',
                                key: '1',
                                className: 'green',
                                action: function (e, dt, node, config) {
                                    $scope.mapping = {};
                                    vm.OpenAddBrand();
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
            DTColumnDefBuilder.newColumnDef(1).withTitle('Title').renderWith(TitleLink),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Image').renderWith(imageHtml).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Brand I Own / Sell'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Action').notSortable()
                            .renderWith(function(data, type, full, meta) {
                                if(full[3] == 'Brand I Sell'){
                                    return '&nbsp;';
                                }
                                else{
                                    return '<div><button type="button" ng-click="OpenUpdateBrandIown('+full[0]+')" class="btn btn-primary mt-lg">Update Brand I Own</button></div>';
                                }
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
