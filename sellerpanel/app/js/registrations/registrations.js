(function() {
    'use strict';

    angular
        .module('app.companies')
        .controller('RegistrationsController', RegistrationsController);

    RegistrationsController.$inject = ['$resource', 'Country', 'State', 'City', 'Users', 'Company', 'Buyers', 'grouptype', 'UserRegistration', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', '$stateParams'];
    function RegistrationsController($resource, Country, State, City, Users, Company, Buyers, grouptype, UserRegistration, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, $filter, $stateParams) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        $scope.company_id = localStorage.getItem('company');
        
        vm.account = {};
        $scope.otp = {};
        
		Country.query().$promise.then(function(success){
			$scope.countries = success;
			vm.account.country  = 1;
		});

		vm.states = State.query();

		vm.GetCity =  function(state) { 
			vm.cities = City.query({ state: state });
		}
		
		vm.groupType = grouptype.query();
		
		vm.agent = Company.query({id:$scope.company_id, sub_resource:'brokers'});
		
		
	vm.register = function() {
            //  $scope.openConfirm();
//            vm.authMsg = '';
                     
            if(vm.registerForm.$valid) {
		$(".modelform").addClass(progressLoader());
		if (vm.account.email == null || vm.account.email == "") 
		{
		vm.account.email = vm.account.phone_number+'@wishbooks.io';
		}
		Users.get({'phone_number': vm.account.phone_number, 'country': vm.account.country, 'field':'is_exist'}).$promise.then(function(response){
		
		vm.params = {'company_name':vm.account.company_name,'username':vm.account.phone_number,'password1':vm.account.password,'password2':vm.account.password, 'email':vm.account.email, 'phone_number':vm.account.phone_number, 'country':vm.account.country, 'state' :vm.account.state, 'city' :vm.account.city, 'invite_as':'buyer', 'group_type':vm.account.buyer_type, 'agent':vm.account.agent, 'send_user_detail':'yes', 'address':vm.account.address, 'logistics':vm.account.logistics} //'number_verified':'yes', 
		UserRegistration.save(vm.params,
		function(success){
		    //alert(vm.account.deputed_salesperson_name);
		    vm.successtoaster = {
			  type:  'success',
			  title: 'Success',
			  text:  'Thank You !! User registered and sent request successfully.'
		    };
		  
		    if(vm.account.deputed_salesperson_name != '' &&  vm.account.deputed_salesperson_name != undefined){
			//alert("in second store");
			Buyers.query({'company_name': vm.account.company_name, 'cid':$scope.company_id}).$promise.then(function(result){
			    
			    var buyer = result[0].buying_company
			    
			    Users.get({'phone_number': vm.account.deputed_phonenumber, 'country': vm.account.deputed_country, 'field':'is_exist'}).$promise.then(function(response){
				
				vm.params = {'company_name':vm.account.deputed_salesperson_name, 'username':vm.account.deputed_phonenumber,'password1':vm.account.deputed_password,'password2':vm.account.deputed_password, 'email':vm.account.email, 'phone_number':vm.account.deputed_phonenumber, 'country':vm.account.deputed_country, 'state' :vm.account.state, 'city' :vm.account.city, 'send_user_detail':'yes', 'usertype':'salesperson', 'company':buyer, 'deputed_from':'yes', 'address':vm.account.address, 'logistics':vm.account.logistics}
				UserRegistration.save(vm.params,
				function(success){
				      vm.account = {};
				      $(".modelform").removeClass(progressLoader());
				      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
				}, 
				function(error) {
					$(".modelform").removeClass(progressLoader());
				});
			    }, 
			    function(error) {
				$(".modelform").removeClass(progressLoader());
			    });
			})
		    
		    }else{
			//vm.account = {'company_name':'','username':'','password1':'','password2':'','email':'', 'phone_number':'', 'country':'', 'state':'', 'city':''};
			vm.account = {}
			vm.registerForm.$setPristine();
			
			$(".modelform").removeClass(progressLoader());
			toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
		    }
		
		
		}, 
		function(error) {
		    $(".modelform").removeClass(progressLoader());
		});
                });
            }
            else {
              vm.registerForm.account_company_name.$dirty = true;
              vm.registerForm.state.$dirty = true;
              vm.registerForm.city.$dirty = true;
              vm.registerForm.account_phonenumber.$dirty = true;
              vm.registerForm.account_email.$dirty = true;
              
              vm.registerForm.account_password.$dirty = true;
              //vm.registerForm.account_password_confirm.$dirty = true;
              
              //vm.registerForm.address.$dirty = true;
              //vm.registerForm.agent.$dirty = true;
              vm.registerForm.buyer_type.$dirty = true;
	      
              //vm.registerForm.deputed_salesperson_name.$dirty = true;
              //vm.registerForm.deputed_phonenumber.$dirty = true;
            }
        };

        
    }
})();
