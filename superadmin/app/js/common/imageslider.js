(function() {
    'use strict';

    angular
        .module('app.catalog')
        .controller('ImageSliderController', ImageSliderController);

    ImageSliderController.$inject = ['$resource', '$filter', '$scope', 'Catalog', 'Selection', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', '$cookies', '$localStorage'];
    function ImageSliderController($resource, $filter,  $scope, Catalog, Selection, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, $cookies, $localStorage) {
        
        CheckAuthenticated.check();
     
        
        var vm = this;
        
        vm.CloseDialog = function() {
            ngDialog.close();
        };
        
        $scope.myInterval = 5000;
         $scope.slides = [];
        
  //      $scope.OpenProductsImages = function(id,prod_count){
          $scope.emptycatalogflag = false;
          if($scope.prod_count == 0)
          {
            $scope.emptycatalogflag = true
          }
          else {
            if($scope.selection_flag == true)
            {
                $(".modelform3").addClass(progressLoader()); 
                $scope.slides = [];
                Selection.get({"id":$scope.catid, "expand":"true", "cid":$scope.company_id},
                function (success){
                    var products = success.products;
                    //$scope.productimg = []
                    for (var i = 0; i < products.length; i++) {
                        ////addSlide(vm.slides6, products[i].image.thumbnail_medium);
                        //$scope.productimg[i] = products[i].image.thumbnail_medium;
                        
                         $scope.slides.push({
                          id: products[i].id,
                          image: products[i].image.thumbnail_medium,
                          text: products[i].sku
                        });
                        
                    }
                   // $scope.ProductsImages();
                    $(".modelform3").removeClass(progressLoader()); 
                });
            }
            else {
                $(".modelform3").addClass(progressLoader()); 



                $scope.slides = [];
                Catalog.get({"id": $scope.catid, "expand":"true", "cid":$scope.company_id},
                function (success){
                    var products = success.products;
                    //$scope.productimg = []
                    for (var i = 0; i < products.length; i++) {
                        ////addSlide(vm.slides6, products[i].image.thumbnail_medium);
                        //$scope.productimg[i] = products[i].image.thumbnail_medium;
                        
                         $scope.slides.push({
                          id: products[i].id,
                          image: products[i].image.thumbnail_medium,
                          text: products[i].sku
                        });
                        
                    }
                   // $scope.ProductsImages();
                    $(".modelform3").removeClass(progressLoader()); 
                });
            }
          }  
      //  }
       
    }
})();
