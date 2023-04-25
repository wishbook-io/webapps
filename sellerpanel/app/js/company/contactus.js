(function () {
    'use strict';

    angular
        .module('app.companyprofile')
        .controller('ContactusController', ContactusController);

    ContactusController.$inject = ['$resource', '$state', '$http', 'Whatsappgrouplink', '$scope', 'CheckAuthenticated', 'toaster', '$location', 'SidebarLoader', '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$localStorage'];
    function ContactusController($resource, $state, $http, Whatsappgrouplink, $scope, CheckAuthenticated, toaster, $location,$rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder,  $localStorage) {
        CheckAuthenticated.check();
        $scope.app.offsidebarOpen = false;

        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');

        var vm = this;

        vm.GetWhatsappgrouplink = function ()
        {
            Whatsappgrouplink.query(
            function (success)
            {
                console.log(success);
                if(success.length > 0)
                {
                    angular.forEach(success, function (obj)
                    {
                        if(obj.key == "RETAILER_WHATSAPP_GROUP")
                        {
                            $scope.RETAILER_WHATSAPP_GROUP = obj.value;
                            console.log($scope.RETAILER_WHATSAPP_GROUP);

                        }
                        if (obj.key == "RESELLER_WHATSAPP_GROUP")
                        {
                            $scope.RESELLER_WHATSAPP_GROUP = obj.value;
                            console.log($scope.RESELLER_WHATSAPP_GROUP);
                        }
                        
                    });
                }
                else
                {
                    vm.errortoaster = {
                        type: 'error',
                        title: 'Reseller Retailer',
                        text: 'Whatsapp group is full'
                    };
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    console.log(vm.errortoaster);
                }
            });
        }

        vm.GetWhatsappgrouplink();









    }
})();

