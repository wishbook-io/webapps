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
        
        
        $scope.update_flag = false;
        
        $scope.tagHandler = function (tag){
            return null;
        }
 

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
                console.log($scope.companyid);
                $(".modelform3").addClass(progressLoader());
                BrandDistributor.query({company: $scope.companyid, cid:$scope.companyid}).$promise.then(function(bd){
                      if(bd.length != 0)
                      {
                        $scope.company.brand = bd[0].brand;
                      }
                });

                $scope.brands = Brand.query({showall: true, cid:$scope.companyid, sub_resource:"dropdown"},
                  function(success){
                        $(".modelform3").removeClass(progressLoader());           
                });                
        }
        

        vm.AddBrandIown = function() {
          console.log($scope.brand.name);
          console.log($scope.brand.image_temp);
            if(vm.brandiownForm.$valid) {
                $(".modelform").addClass(progressLoader());
       //         alert(JSON.stringify($scope.buyer));
				Brand.save({"cid":$scope.companyid, "name":$scope.brand.name, "company" : $scope.companyid, "image": $scope.brand.image_temp },
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
            if($scope.company.brand == undefined || $scope.company.brand.length < 1){
                  vm.errortoaster = {
                      type:  'error',
                      title: 'Brand I sell',
                      text:  'This list may not be empty.'
                  };   
                  toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);     
                  return;
            }
          
             $(".modelform3").addClass(progressLoader());
               BrandDistributor.query({company: $scope.companyid, cid:$scope.companyid}).$promise.then(function(bd){
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
               BrandDistributor.save({"company" : $scope.companyid , "brand":$scope.company.brand, "cid":$scope.companyid},
                        function(success){

                                Company.patch({ "id" : $scope.companyid, "brand_added_flag" : "yes"},
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
               BrandDistributor.patch({"id":$scope.BrandDistributorId, "company" : $scope.companyid , "brand":$scope.company.brand, "cid":$scope.companyid},
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
              $scope.params = {"cid":$scope.companyid, "id": $scope.brand.id, "name":$scope.brand.name, "company" : $scope.companyid, "image": $scope.brand.image_new }
            }
            else
            {
              $scope.params = {"cid":$scope.companyid, "id": $scope.brand.id, "name":$scope.brand.name, "company" : $scope.companyid }          
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
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    //$state.go('app.catalog');
              });
        }

     

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
                Brand.get({ id: id, cid: $scope.companyid }).$promise.then(function(result){
                      
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

    }
})();
