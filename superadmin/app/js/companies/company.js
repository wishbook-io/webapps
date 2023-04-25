/*start - form wizard */
(function() {
    'use strict';
    angular
        .module('app.companies')
        .directive('formWizard', formWizard);

         formWizard.$inject = ['$parse'];
   
    function formWizard ($parse) {
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

/* End - form wizard */





(function() {
    'use strict';

    angular
        .module('app.companies')
        .controller('CompanyController', CompanyController);

    CompanyController.$inject = ['$resource',  'toaster', 'SweetAlert', 'kyc', 'BankDetails', 'Company', 'ngDialog', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'DisableAllCatalogs', 'CheckAuthenticated', '$compile', '$state', '$filter'];
    function CompanyController($resource, toaster, SweetAlert, kyc, BankDetails, Company, ngDialog, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, DisableAllCatalogs, CheckAuthenticated, $compile, $state,  $filter) {
        CheckAuthenticated.check();        
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
        var vm = this;
        
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        $scope.update_flag = false;
        $scope.company = {};
        $scope.bank_details = {};
        
        $scope.alrt = function () {alert("called");};
        $scope.UpdateGSTDialog = function () {
            ngDialog.open({
                template: 'updategst',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        $scope.update_gst_flag = false;
        vm.openUpdateGST = function(){
          var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;

                }
            })

            if(true_count == 1)
            {
              $scope.companyid = vm.true_key;
              kyc.query({'cid': $scope.companyid, 'company': $scope.companyid }, function(success){
                  console.log(success);
                  if(success.length > 0){
                    $scope.company.gstin = success[0].gstin;
                    $scope.company.pan = success[0].pan;
                    $scope.kyc_id = success[0].id;
                    $scope.update_gst_flag = true;
                  }
                  else
                  {
                    $scope.update_gst_flag = false;
                  }
              });
              Company.get({'id': $scope.companyid}, function(data){
                  
                    $scope.company.paytm_phone_number = data.paytm_phone_number;
                  
              });
              $scope.UpdateGSTDialog();
            }
            else
            {
                    vm.errortoaster = {
                        type:  'error',
                        title: 'Failed',
                        text:  'Please select one row at a time.'
                    };
                    
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
            }
        }

        $scope.submitGstDetails = function(){
            if($scope.update_gst_flag == false)
            {
              $(".modelform-gst").addClass(progressLoader());
              kyc.save({'cid': $scope.companyid, 'gstin': $scope.company.gstin, 'pan': $scope.company.pan, 'company': $scope.companyid}, function(success){
                    $(".modelform-gst").removeClass(progressLoader());
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'GST/PAN number added successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    $scope.company = {};
                    ngDialog.close();
              })
            }
            else
            {
              $(".modelform-gst").addClass(progressLoader());
              kyc.patch({'cid': $scope.companyid, 'id': $scope.kyc_id, 'pan': $scope.company.pan, 'gstin': $scope.company.gstin}, function(success){
                    $(".modelform-gst").removeClass(progressLoader());
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'GST/PAN number updated successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    $scope.company = {};
                    ngDialog.close();
              })
            }
        }

        $scope.SubmitPaytmNumber = function(){
          $(".modelform-gst").addClass(progressLoader());
          Company.patch({'id': $scope.companyid, 'paytm_phone_number': $scope.company.paytm_phone_number}, function(data){
                $(".modelform-gst").removeClass(progressLoader());
                vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  'Paytm number updated successfully.'
                };
                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                ngDialog.close();
          });
        }

        $scope.UpdateBankDetailsDialog = function () {
            ngDialog.open({
                template: 'updatebankdetails',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        $scope.update_bank_flag = false;
        vm.openUpdateBankDetails = function(){
          var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;

                }
            })

            if(true_count == 1)
            {
              $scope.companyid = vm.true_key;
              BankDetails.query({'cid': $scope.companyid, 'company': $scope.companyid }, function(success){
                  console.log(success);
                  if(success.length > 0){
                    $scope.bank_details = success[0];
                    //$scope.kyc_id = success[0].id;
                    $scope.update_gst_flag = true;
                  }
                  else
                  {
                    $scope.update_gst_flag = false;
                  }
              })
              $scope.UpdateBankDetailsDialog();
            }
            else
            {
                    vm.errortoaster = {
                        type:  'error',
                        title: 'Failed',
                        text:  'Please select one row at a time.'
                    };
                    
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
            }
        }

        $scope.submitBankDetails = function(){
          console.log(vm.bankForm)
          if(vm.bankForm.$valid)
          {
              if($scope.update_gst_flag == false)
              {
                $(".modelform-bank").addClass(progressLoader());
                BankDetails.save({'cid': $scope.companyid, 'company': $scope.companyid, 'bank_name': $scope.bank_details.bank_name, 'account_number': $scope.bank_details.account_number, 'ifsc_code': $scope.bank_details.ifsc_code, 'account_type': $scope.bank_details.account_type, 'account_name': $scope.bank_details.account_name}, function(success){
                      $(".modelform-bank").removeClass(progressLoader());
                      vm.successtoaster = {
                          type:  'success',
                          title: 'Success',
                          text:  'Bank details added successfully.'
                      };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                      ngDialog.close();
                })
              }
              else
              {
                $(".modelform-bank").addClass(progressLoader());
                BankDetails.patch({'cid': $scope.companyid, 'id': $scope.bank_details.id, 'bank_name': $scope.bank_details.bank_name, 'account_number': $scope.bank_details.account_number, 'ifsc_code': $scope.bank_details.ifsc_code, 'account_type': $scope.bank_details.account_type, 'account_name': $scope.bank_details.account_name}, function(success){
                      $(".modelform-bank").removeClass(progressLoader());
                      vm.successtoaster = {
                          type:  'success',
                          title: 'Success',
                          text:  'Bank details updated successfully.'
                      };
                      toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                      ngDialog.close();
                })
              }
          }
        }

        vm.DisableAllCatalogs = function(){
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;

                }
            })
            if(true_count == 1)
            {
               SweetAlert.swal({   
                  title: 'Are you sure?',   
                  text: 'You will not be able to recover!',   
                  type: 'warning',   
                  showCancelButton: true,   
                  confirmButtonColor: '#DD6B55',   
                  confirmButtonText: 'Yes, Disable it!',   
                  cancelButtonText: 'No, cancel it!',   
                  closeOnConfirm: true,   
                  closeOnCancel: true 
                }, function(isConfirm){  
                  if (isConfirm) {
                            $(".modelform3").addClass(progressLoader());
                            DisableAllCatalogs.save({'id':vm.true_key},
                            function(success){
                                $(".modelform3").removeClass(progressLoader());
                                //$scope.dtInstance.$scope.reloadData();
                                vm.successtoaster = {
                                    type:  'success',
                                    title: 'Success',
                                    text:  'Catalogs disabled successfully.'
                                };
                                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                $scope.reloadData();
                            });
                    //SweetAlert.swal('Deleted!', 'Selected rows has been deleted.', 'success');   
                  }
                });
            }
            else
            {
              vm.errortoaster = {
                        type:  'error',
                        title: 'Failed',
                        text:  'Please select one row at a time.'
                    };
                    
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
            }
        }
        $scope.OpenDialog = function () {
            ngDialog.open({
                template: 'addbrand',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        vm.OpenAddBrand = function() {
          $scope.company = {};
          $scope.brand = {};
          var true_count = 0;
          angular.forEach(vm.selected, function(value, key) {
              if(value==true){
                  true_count++;
                  vm.true_key = key;

              }
          });
          if(true_count == 1)
          {
            $scope.companyid = vm.true_key;
            $scope.OpenDialog();

          }
          else
          {
            vm.errortoaster = {
                      type:  'error',
                      title: 'Failed',
                      text:  'Please select one row at a time.'
                  };     
                  toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
          }
          

            
        };

        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
        
        function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);
        }

        function callback(json) {
            console.log(json);
            if(json.recordsTotal > 0 && json.data.length == 0){
                //vm.dtInstance.rerender();
                $state.go($state.current, {}, {reload: true});
            }
        }

        $scope.OpenCompanyEdit = function(companyId){
            $scope.companyId = companyId;
            /*$(".modelform6").addClass(progressLoader());
            Company.get({"id":companyId, "expand":"true"},
            function (success){
                $scope.company = success
                $scope.OpenCompanyDetail();
                $(".modelform6").removeClass(progressLoader());
            });*/
            ngDialog.open({
                template: 'companydetails_edit',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });

        }
        
        function imageHtml(data, type, full, meta){
          return '<img src="'+full[2]+'" style="width: 100px; height: 100px"/>';
        }
        
        function TitleLink(data, type, full, meta){
          return '<a target="_blank" href="#/app/companies-buyer-supplier/'+full[0]+'">'+full[1]+'</a> (<a ng-click="OpenCompanyEdit('+full[0]+')">'+full[0]+'</a>)';
        }
      
      vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: 'api/companydatatables1/',
                          type: 'GET',
                      })
                      
                      .withOption('createdRow', function(row, data, dataIndex) {
                          // Recompiling so we can bind Angular directive to the DT
                          $compile(angular.element(row).contents())($scope);
                      })
                      .withOption('headerCallback', function(header) {
                          if (!vm.headerCompiled) {
                              // Use this headerCompiled field to only compile header once
                              vm.headerCompiled = true;
                              $compile(angular.element(header).contents())($scope);
                          }
                      })
                      .withOption('fnPreDrawCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                          vm.count = vm.count+1;
                          //alert(JSON.stringify(vm.selected));
                          if((vm.count%2) == 0)
                          {
                              vm.selected = {};
                              vm.selectAll = false;
                              //alert(JSON.stringify(vm.selected));
                          }
                          return true;
                      })
                      
                      .withDataProp('data')
                      .withLightColumnFilter({
                          1 : { "type" : "text"},
                          3 : { "type" : "text"},
                          5 : { "type" : "text"},
                          6 : { "type" : "text"},
                          
                      })
                      
                      .withOption('processing', true)
                      .withOption('serverSide', true)
                      .withOption('iDisplayLength', 10)
                      //.withOption('responsive', true)
                      .withOption('scrollX', true)
                      .withOption('scrollY', getDataTableHeight())
                      //.withOption('scrollCollapse', true)
                      .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
                      
                      .withPaginationType('full_numbers')
                      
                      .withButtons([
                          {
                              text: 'Update Bank Details',
                              key: '1',
                              className: 'green',
                              action: function (e, dt, node, config) {
                                    $scope.bank_details = {};
                                    vm.openUpdateBankDetails();
                              }
                          }, 
                          {
                              text: 'Update GST/PAN',
                              key: '1',
                              className: 'green',
                              action: function (e, dt, node, config) {
                                    $scope.company = {};
                                    vm.openUpdateGST();
                              }
                          },
                          {
                                text: 'Add Brand',
                                key: '1',
                                className: 'green',
                                action: function (e, dt, node, config) {
                                    vm.OpenAddBrand();
                                }
                          }, 
                          {
                              text: 'Disable All Catalogs',
                              key: '1',
                              className: 'orange',
                              action: function (e, dt, node, config) {
                                 // alert(JSON.stringify(vm.selected));
                                    vm.DisableAllCatalogs();
                              }
                          },
                          'copy',
                          'print',
                          'excel',
                          
                      ]);
                          
                      vm.dtColumnDefs = [
                          DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
                          .renderWith(function(data, type, full, meta) {
                              vm.selected[full[0]] = false;
                              return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                          }),
                          DTColumnDefBuilder.newColumnDef(1).withTitle('Title').renderWith(TitleLink),
                          //DTColumnDefBuilder.newColumnDef(2).withTitle('Image').renderWith(imageHtml).notSortable(),
                          DTColumnDefBuilder.newColumnDef(2).withTitle('Brand'),
                          DTColumnDefBuilder.newColumnDef(3).withTitle('Phone Number'),
                          DTColumnDefBuilder.newColumnDef(4).withTitle('Invoice Credit').notSortable(),
                          DTColumnDefBuilder.newColumnDef(5).withTitle('State'),
                          DTColumnDefBuilder.newColumnDef(6).withTitle('City'),
                          
                          DTColumnDefBuilder.newColumnDef(7).withTitle('Buyer Invited').notSortable(),
                          DTColumnDefBuilder.newColumnDef(8).withTitle('Buyer Registered').notSortable(),
                          DTColumnDefBuilder.newColumnDef(9).withTitle('Buyer Accepted').notSortable(),
                          DTColumnDefBuilder.newColumnDef(10).withTitle('Supplier Invited').notSortable(),
                          DTColumnDefBuilder.newColumnDef(11).withTitle('Supplier Registered').notSortable(),
                          DTColumnDefBuilder.newColumnDef(12).withTitle('Supplier Accepted').notSortable(),
                      ];
        
        function toggleAll (selectAll, selectedItems) {
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    selectedItems[id] = selectAll;
                }
            }
        }
        
        function toggleOne (selectedItems) {
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    if(!selectedItems[id]) {
                        vm.selectAll = false;
                        return;
                    }
                }
            }
            vm.selectAll = true;
        }
        
        
    }
})();

