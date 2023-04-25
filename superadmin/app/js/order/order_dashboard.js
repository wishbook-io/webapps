
(function() {
    'use strict';

    angular
        .module('app.orderdashboard')
        .controller('OrderDashboardController', OrderDashboardController);

    OrderDashboardController.$inject = ['$resource',  'toaster', 'ngDialog', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', 'SalesOrders'];
    function OrderDashboardController($resource, toaster, ngDialog, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state,  $filter, SalesOrders) {
        CheckAuthenticated.check();        
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
        var vm = this;
        
        $scope.company_id = 0;
        if(localStorage.hasOwnProperty("company")){
            $scope.company_id = localStorage.getItem('company');
        }
        
        $scope.reports = SalesOrders.query({cid:$scope.company_id, sub_resource:"report"});
        
        
    }
})();

