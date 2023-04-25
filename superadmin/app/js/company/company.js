/**=========================================================
 * Module: access-company.js
 * Demo for company api
 =========================================================*/

(function() {
    'use strict';
    angular
        .module('app.company')
        .directive('formWizard', formWizard);

         formWizard.$inject = ['$parse', 'djangoAuth', 'toaster'];
   
    function formWizard ($parse,djangoAuth, toaster) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: true
        };
        return directive;

        function link(scope, element, attrs) {
          var validate = $parse(attrs.validateSteps)(scope),
              wiz = new Wizard(attrs.steps, !!validate, element);
          scope.wizard = wiz.init();
        }

        function Wizard (quantity, validate, element) {
          
       //   alert('wizaed');
          var self = this;
          self.quantity = parseInt(quantity,10);
          self.validate = validate;
          self.element = element;
          
          self.init = function() {
            self.createsteps(self.quantity);
            self.go(1); // always start at fist step
            return self;
          };
          self.go = function(step) {
            if(step ==2 )
            {
                  djangoAuth.profile().then(function(data){
               //   $scope.user = data; 
                      if(data.companyuser != null)
                      {
                            if ( angular.isDefined(self.steps[step]) ) {
                              if(self.validate && step !== 1) {
                                var form = $(self.element),
                                    group = form.children().children('div').get(step - 2);

                                if (false === form.parsley().validate( group.id )) {
                                  return false;
                                }
                              }

                              self.cleanall();
                              self.steps[step] = true;
                            }
                      }
                      else
                      {
                        //alert("Please Submit the form.");
                        self.errortoaster = {
                                  type:  'error',
                                  title: 'Failed',
                                  text:  'Please submit the company form.'
                              };
                              toaster.pop(self.errortoaster.type, self.errortoaster.title, self.errortoaster.text);
                        }
                   });
            }

            else {
              if ( angular.isDefined(self.steps[step]) ) {

                if(self.validate && step !== 1) {
                  var form = $(self.element),
                      group = form.children().children('div').get(step - 2);

                  if (false === form.parsley().validate( group.id )) {
                    return false;
                  }
                }

                self.cleanall();
                self.steps[step] = true;
              }
            }
          };

          self.active = function(step) {
            return !!self.steps[step];
          };

          self.cleanall = function() {
            for(var i in self.steps){
              self.steps[i] = false;
            }
          };

          self.createsteps = function(q) {
            self.steps = [];
            for(var i = 1; i <= q; i++) self.steps[i] = false;
          };

        }
    }
})();




(function() {
    'use strict';

    angular
        .module('app.company')
        .controller('CompanyFormController', CompanyFormController);

    CompanyFormController.$inject = ['$resource', '$cookies', '$state', '$http', 'djangoAuth', 'City', 'State', 'Brand', 'Company', 'BrandDistributor', '$scope', 'CheckAuthenticated', 'toaster', '$location', 'SidebarLoader', '$rootScope', '$localStorage'];
    function CompanyFormController($resource, $cookies, $state, $http, djangoAuth, City, State, Brand, Company, BrandDistributor, $scope, CheckAuthenticated, toaster, formWizard, $location, SidebarLoader, $rootScope, $localStorage) {
      CheckAuthenticated.check();
        var vm = this;
        
          
          
          vm.states = State.query();
          
          vm.GetCity =  function(state) { 
            vm.cities = City.query({ state: state });
          }
          
          $scope.company_id = localStorage.getItem('company');// $cookies.get('company');

          vm.brands = Brand.query({showall: true, cid:$scope.company_id, sub_resource:"dropdown"});

          $scope.company = {};
          $scope.brand ={name:"",image:""};
          djangoAuth.profile().then(function(data){
              $scope.user = data; 
              $scope.phone_number = data.userprofile.phone_number;
              $scope.email = data.userprofile.email;

              if(data.companyuser != null)
              {
                  $scope.companyId = data.companyuser.company;
                  if(data.companyuser.company_type ==="manufacturer")
                 {
                    $scope.manufacturer = true;
                    $scope.nonmanufacturer = false;
                 } 
                 else
                 {
                    $scope.manufacturer = false;
                    $scope.nonmanufacturer = true;
                 }
                  Company.get({id: $scope.companyId}).$promise.then(function(result) {
                       $scope.company = result;
                       vm.GetCity($scope.company.state);
                  });
                  if(data.companyuser.brand_added_flag == "yes")
                  {
                    $state.go('app.catalog');
                   /* Brand.query({mycompany: true}).$promise.then(function(result){
                     //   alert(JSON.stringify(result));
                        $scope.brandId  = result[0].id;
                        $scope.brand = result[0];
                        
                        
                    });
                    BrandDistributor.query({company: $scope.companyId}).$promise.then(function(bd){
                       //  alert(bd[0].brand);
                         $scope.company.brand = bd[0].brand;
                    });*/
                  }
              }
              
          });


          vm.SubmitCompany = function(){
                 djangoAuth.profile().then(function(data){
                     if(data.companyuser != null)
                     {
                      // alert('update called');
                          vm.updateCompany(data.companyuser.company);
                     }
                     else
                     {
                          vm.createCompany();
                     }
                 });
             }; 

          $scope.company.push_downstream = "yes";
          //$scope.company.company_type = "nonmanufacturer";
          vm.createCompany = function() {
         //   formWizard.wizard.go(2);

            //if(vm.companyForm.$valid) {
         //      alert('company');
                  $(".modelform").addClass(progressLoader()); 
                  Company.save({"name":$scope.company.name,"street_address":$scope.company.street_address,"state": $scope.company.state,"city": $scope.company.city , "push_downstream": $scope.company.push_downstream, "company_type": "nonmanufacturer" , "email":$scope.email, "phone_number": $scope.phone_number, "category": []  },
                      function(success){
                          $scope.companyId = success.id;
                          if(success.company_type ==="manufacturer")
                           {
                              $scope.manufacturer = true;
                              $scope.nonmanufacturer = false;
                           } 
                           else
                           {
                              $scope.manufacturer = false;
                              $scope.nonmanufacturer = true;
                           }
                           $(".modelform").removeClass(progressLoader());
                              
                           vm.successtoaster = {
                                  type:  'success',
                                  title: 'Success',
                                  text:  'Company created successfully.'
                           };
                           toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                       /*     CompanyUsers.save({"company": $scope.companyId, "user": $scope.user.id },
                              function(success){
                                  $(".modelform").removeClass(progressLoader());
                                  
                                  vm.successtoaster = {
                                      type:  'success',
                                      title: 'Success',
                                      text:  'Company created successfully.'
                                  };
                                  toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                              },
                              function(error){
                                $(".modelform").removeClass(progressLoader());
                                  vm.errortoaster = {
                                      type:  'error',
                                      title: 'Failed',
                                      text:  'CompanyUsers update Failed.'
                                  };
                                  toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                              })*/
                      });/*,
                      function(error){
                        $(".modelform").removeClass(progressLoader());
                            vm.errortoaster = {
                                  type:  'error',
                                  title: 'Failed',
                                  text:  'Company is not created.'
                              };
                              toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                      }*/  
           /*       }
                  else
                  {
                      vm.companyForm.name.$dirty = true;
                      vm.companyForm.street_address.$dirty = true;
                      vm.companyForm.state.$dirty = true;
                      vm.companyForm.city.$dirty = true;
                      vm.companyForm.pincode.$dirty = true;
                      vm.companyForm.push_downstream.$dirty = true;
                      vm.companyForm.company_type.$dirty = true;
                  }   */   
          };   
          
          vm.updateCompany = function(id) {
              $(".modelform").addClass(progressLoader()); 
              $scope.company.id = id;
              //Company.patch({ "id" : $scope.company.id, "name":$scope.company.name,"street_address":$scope.company.street_address,"state": $scope.company.state,"city": $scope.company.city ,"pincode": $scope.company.pincode, "push_downstream": $scope.company.push_downstream, "company_type": $scope.company.company_type , "email":$scope.email, "phone_number": $scope.phone_number, "category": []},
              Company.patch({ "id" : $scope.company.id, "name":$scope.company.name,"street_address":$scope.company.street_address,"state": $scope.company.state,"city": $scope.company.city , "push_downstream": $scope.company.push_downstream, "company_type": "nonmanufacturer" ,  "phone_number": $scope.phone_number, "category": []},
                  function(success){
                       if(success.company_type ==="manufacturer")
                       {
                          $scope.manufacturer = true;
                          $scope.nonmanufacturer = false;
                       } 
                       else
                       {
                          $scope.manufacturer = false;
                          $scope.nonmanufacturer = true;
                       }
                        $(".modelform").removeClass(progressLoader());
                        
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Company updated successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  });/*,
                  function(error){
                        $(".modelform").removeClass(progressLoader());
                        vm.errortoaster = {
                              type:  'error',
                              title: 'Failed',
                              text:  'Company is not updated.'
                          };
                          toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                  }*/        
          }
          
      /*    vm.submitBrand = function() {
              djangoAuth.profile().then(function(data){
                 if(data.companyuser.brand_added_flag == "yes")
                 {
                      vm.updateBrand($scope.brandId);
                 }
                 else
                 {
                      vm.createBrand();
                 }
             });
 
          } */

          
          vm.createBrand = function() {
         //   formWizard.wizard.go(3);
             
           /*   console.log($scope.brand.image);
              alert($scope.company.brands); */
            //if(vm.brandForm.$valid) {  
            var bname = $scope.brand.name;
            if(bname.length > 0 && !vm.brandForm.$valid){
                vm.brandForm.image.$dirty = true;
            }
            else{

              console.log($scope.brand);
              $(".modelform2").addClass(progressLoader()); 
                
                if($scope.brand.name != ""){
                    Brand.save({"name":$scope.brand.name, "company" : $scope.companyId, "image": $scope.brand.image, "cid":$scope.company_id },
                    function(success){
                    });
                }

                if($scope.nonmanufacturer == true)
                {
                    if($scope.company.brand != undefined && $scope.company.brand != ""){
                    BrandDistributor.save({"company" : $scope.companyId , "brand":$scope.company.brand, "cid":$scope.company_id},
                        function(success){
                          
                        });
                    }
                }
                
                Company.patch({ "id" : $scope.companyId, "brand_added_flag" : "yes"},
                function(success){

                     $(".modelform2").removeClass(progressLoader());
                      vm.successtoaster = {
                          type:  'success',
                          title: 'Success',
                          text:  'Process done successfully.'
                      };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                      
                      SidebarLoader.getMenu;
                      $state.go('app.catalog',{ reload: true });
                      location.reload();
                });
            }
            /*else
            {
                if($scope.brand.name.length > 0){
                    vm.brandForm.image.$dirty = true;
                }
                else{
                    vm.brandForm.image.$dirty = false;
                }
                
                if($scope.nonmanufacturer)
                {
                    vm.brandForm.name.$dirty = true;
                }
                if($scope.nonmanufacturer)
                {
                    vm.brandForm.brand.$dirty = true;
                }
            };*/

          };   


 /*         vm.updateBrand = function(id) {
              $scope.brand.id = id;
              Brand.patch({"id": $scope.brand.id, "name":$scope.brand.name, "company" : $scope.companyId, "image": $scope.brand.image },
                  function(success){
                        $(".modelform").removeClass(progressLoader());
                        
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Brand updated successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $state.go('app.catalog');
                                           
                  },
                  function(error){
                        vm.errortoaster = {
                              type:  'error',
                              title: 'Failed',
                              text:  'Brand is not updated.'
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
              });

           /*   BrandDistributor.patch({"company" : $scope.companyId , "brand":$scope.company.brand},
                  function(success){
                        $(".modelform").removeClass(progressLoader());
                        
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Brands I Sell added successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        
                  },
                  function(error){
                        vm.errortoaster = {
                              type:  'error',
                              title: 'Failed',
                              text:  'Brands I Sell is not added.'
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
              });        
          }; */

                  
    }
})();
