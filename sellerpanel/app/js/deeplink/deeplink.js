
(function() {
    'use strict';

    angular
        .module('app.deeplink')
        .controller('DeeplinkController', DeeplinkController);

    DeeplinkController.$inject = ['$resource', '$http', '$scope', 'State', 'Upload', 'toaster', 'Brand', 'Category', 'EnumGroup', 'ngDialog', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', 'resendbuyer', '$cookies', '$localStorage'];
    function DeeplinkController($resource, $http, $scope, State, Upload, toaster, Brand, Category, EnumGroup, ngDialog, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, resendbuyer, $cookies, $localStorage) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
        
	
        $scope.brands = Brand.query({showall: true, cid:$scope.company_id, sub_resource:"dropdown"});
        $scope.categories = Category.query({parent: 10});
        vm.states = State.query();
         EnumGroup.query({type:"fabric"}).$promise.then(function(success){
            $scope.fabrics = success;
          });
          
          EnumGroup.query({type:"work"}).$promise.then(function(success){
            $scope.works = success;
          });

          EnumGroup.query({type:"style"}).$promise.then(function(success){
            $scope.styles = success;
          });
        $scope.link0 = 'https://app.wishbook.io/?type=catalog&ctype=public';
        $scope.finallink = $scope.link0;
        $scope.category = '';
        $scope.state = '';
        $scope.catalog_type = '';
        $scope.style = '';
        $scope.brand = {};
        $scope.work = {};
        $scope.fabric = {};
        $scope.min_price = '';
        $scope.max_price = '';
        $scope.sellers = '';
        $scope.is_supplier_approved = '';
        $scope.trusted_seller = '';
        $scope.full_catalog = true;
        $scope.single_piece = true;
        vm.full_catalog = true;
        vm.single_piece = true;
        $scope.link = '';
        $scope.catalog_count = -1;
        
	    vm.updateLink = function(value,type) {
            $scope.link0 = 'https://app.wishbook.io/?type=catalog&ctype=public';
            $scope.link = '';
            if(type=='category'){
                $scope.category = value;
                vm.generateLink();
            }
            if(type=='state'){
                $scope.state = value;
                vm.generateLink();
            }
            if(type=='catalog_type'){
                $scope.catalog_type = value;
                vm.generateLink();
            }
            if(type == 'style'){
                $scope.style = value;
                vm.generateLink();
            }
            if(type == 'brand'){
                $scope.brand = value;
                vm.generateLink();
            }
            if(type == 'work'){
                $scope.work = value;
                vm.generateLink();
            }
            if(type == 'fabric'){
                $scope.fabric = value;
                vm.generateLink();
            }
            if(type=='min_price'){
                $scope.min_price = value;
                vm.generateLink();
            }
            if(type=='max_price'){
                $scope.max_price = value;
                vm.generateLink();
            }
            if(type=='is_supplier_approved'){
                $scope.is_supplier_approved = value;
                vm.generateLink();
            }
            if(type=='trusted_seller'){
                $scope.trusted_seller = value;
                vm.generateLink();
            }
            if(type=='full_catalog'){
                $scope.full_catalog = value;
                vm.generateLink();
            }
            if(type=='single_piece'){
                $scope.single_piece = value;
                vm.generateLink();
            }
            if(type=='sellers'){
                //alert("selers");
                $scope.sellers = value;
                vm.generateLink();
            }
        }

        vm.generateLink = function(){
            if($scope.category !='' && $scope.category != undefined){
                $scope.link = $scope.link + '&category=' + $scope.category;
               // console.log($scope.link);
            }
            if($scope.state !='' && $scope.state != undefined){
                $scope.link = $scope.link + '&supplier_state=' + $scope.state;
               // console.log($scope.link);
            }
            if($scope.catalog_type !='' && $scope.catalog_type != undefined){
                $scope.link = $scope.link + '&catalog_type=' + $scope.catalog_type;
               // console.log($scope.link);
            }
            if($scope.style !='' && $scope.style != undefined){
                $scope.link = $scope.link + '&style=' + $scope.style;
               // console.log($scope.link);
            }
            if($scope.brand.length > 0){
                $scope.link = $scope.link + '&brand=' + $scope.brand.toString();
                //console.log($scope.link);
            }
            if($scope.work.length > 0){
                $scope.link = $scope.link + '&work=' + $scope.work.toString();
                //console.log($scope.link);
            }
            if($scope.fabric.length > 0){
               // console.log($scope.fabric);
                //console.log("len "+$scope.fabric.length);
                $scope.link = $scope.link + '&fabric=' + $scope.fabric.toString();
                //console.log($scope.link);
            }
            if($scope.min_price !=''  && $scope.min_price > 100 ){
                $scope.link = $scope.link + '&min_price=' + $scope.min_price;
                //console.log($scope.link);
            }
            if($scope.max_price !='' && $scope.max_price > 100 ){
                $scope.link = $scope.link + '&max_price=' + $scope.max_price;
                //console.log($scope.link);
            }
            if($scope.is_supplier_approved !='' && $scope.is_supplier_approved == true ){
                $scope.link = $scope.link + '&is_supplier_approved=' + $scope.is_supplier_approved;
                //console.log($scope.link);
            }
            if($scope.trusted_seller !='' && $scope.trusted_seller == true ){
                $scope.link = $scope.link + '&trusted_seller=' + $scope.trusted_seller;
                //console.log($scope.link);
            }
            if($scope.full_catalog == true && $scope.single_piece == false){
                $scope.link = $scope.link + '&sell_full_catalog=true';
               // console.log($scope.link);
            }
            if($scope.full_catalog == false && $scope.single_piece == true){
                $scope.link = $scope.link + '&sell_full_catalog=false';
                //console.log($scope.link);
            }
            if($scope.sellers !=''){
                var sellersids = $scope.sellers.replace(/,\s*$/, "");
                //~ if ($scope.sellers.substr(-1) == ","){
                    //~ sellersids
                //~ }
                
                $scope.link = $scope.link + '&sellers=' + sellersids;
                //console.log($scope.link);
            }
            console.log($scope.link);
            $scope.finallink = $scope.link0 + $scope.link;
            $scope.finallink = encodeURI($scope.finallink);

            var check_link = "api/v1/catalogs/dropdown/?view_type=public"+$scope.link;
            check_link = check_link.replace("&is_supplier_approved=true","");
            console.log(check_link);
            $(".deeplink-modal").addClass(progressLoader()); 
            $http.get(check_link)
                .success(function(data) {
                    console.log(data);
                    console.log(data.length);
                    $scope.catalog_count = data.length;
                    $(".deeplink-modal").removeClass(progressLoader());
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
        $scope.tagHandler = function (tag){
            return null;
        }
        vm.resetLink = function() {
            $scope.link0 = 'https://app.wishbook.io/?type=catalog&ctype=public';
            $scope.finallink = $scope.link0;
            $scope.link = '';
            vm.category = '';
            vm.state = '';
            vm.catalog_type = '';
            vm.style = '';
            vm.brand = {};
            vm.work = {};
            vm.fabric = {};
            vm.min_price = '';
            vm.max_price = '';
            vm.sellers = '';
            vm.is_supplier_approved = false;
            vm.trusted_seller = false;
            vm.full_catalog = true;
            vm.single_piece = true;

            $scope.category = '';
            $scope.state = '';
            $scope.catalog_type = '';
            $scope.style = '';
            $scope.brand = {};
            $scope.work = {};
            $scope.fabric = {};
            $scope.min_price = '';
            $scope.max_price = '';
            $scope.sellers = '';
            $scope.is_supplier_approved = '';
            $scope.trusted_seller = '';
            $scope.full_catalog = true;
            $scope.single_piece = true;
            $scope.catalog_count = -1;

          //  vm.generateLink();
        }
		
	    
    }
})();
