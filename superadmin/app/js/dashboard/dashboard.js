(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$timeout', 'djangoAuth', '$state', 'CheckAuthenticated', 'toaster'];
    function DashboardController($scope, $timeout, djangoAuth, $state, CheckAuthenticated, toaster) {
    	CheckAuthenticated.check();
        var vm = this;
       // alert(" 4444444 ");
		/*djangoAuth.authenticationStatus(true).then(function(){
          alert("authenticated resolve");
            //deferred.resolve();
        },function(data){
          alert("authenticated redirect");
            $state.go('page.login');
        });*/
		
    }
})();