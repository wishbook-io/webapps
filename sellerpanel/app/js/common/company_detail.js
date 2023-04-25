
(function() {
    'use strict';

    angular
        .module('app.salesorders')
        .controller('CompanyDetailController', CompanyDetailController);

    CompanyDetailController.$inject = ['$resource', '$filter', '$scope', 'Company', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', '$cookies', '$localStorage'];
    function CompanyDetailController($resource, $filter,  $scope, Company, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, $cookies, $localStorage) {
        
        CheckAuthenticated.check();
     
        
        var vm = this;
        
        $scope.company_id = 0;
        if(localStorage.hasOwnProperty("company")){
            $scope.company_id = localStorage.getItem('company');
        }
        
        Company.get({"id":$scope.companyId, "expand":"true"},
        function (success){
            $scope.company = success
            //$(".modelform6").removeClass(progressLoader()); 
        });
        

    }
})();
