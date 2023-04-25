(function() {
    'use strict';

    angular
        .module('app.auth')
        .controller('PrintManifestController', PrintManifestController);

    PrintManifestController.$inject = ['$http', '$state', '$stateParams', 'djangoAuth', 'toaster', 'Manifest', '$scope'];
    function PrintManifestController($http, $state, $stateParams, djangoAuth, toaster, Manifest, $scope) {
        //CheckAuthenticated.check();

        var vm = this;
        $scope.company_id = localStorage.getItem('company');
        
        $scope.awbavail = false;
        if($stateParams.id != null){
            Manifest.get({'id': $stateParams.id, 'cid':$scope.company_id}).$promise.then(function(result){
              $scope.manifest_data = result;
              $scope.manifest_data.created_date = formatDate(result.created);
            });
        }
    }
})();
