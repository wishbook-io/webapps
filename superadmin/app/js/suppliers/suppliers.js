(function() {
    'use strict';

    angular
        .module('app.suppliers')
        .controller('SupplierslistController', SupplierslistController);

    SupplierslistController.$inject = ['$http', '$resource', '$scope', 'toaster', 'grouptype', 'Suppliers', 'Country', 'ngDialog', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', 'Upload', 'resendsupplier', '$cookies', '$localStorage'];
    function SupplierslistController($http, $resource,  $scope, toaster, grouptype, Suppliers, Country, ngDialog,  DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, Upload, resendsupplier, $cookies, $localStorage) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
        
        $scope.OpenDialog = function () {
            
             ngDialog.open({
              template: 'addsupplier',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            });
        };

        $scope.OpenStatusDialog = function () {
            ngDialog.open({
                template: 'updatestatus',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        vm.CsvDialog = function () {
            ngDialog.open({
                template: 'uploadcsv',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        vm.OpenAddSupplier = function() {
              $scope.OpenDialog();
              $scope.groupType = grouptype.query();
              Country.query().$promise.then(function(success){
                $scope.countries = success;
                $scope.supplier.country = 1;
              });
              
        };
        vm.CloseDialog = function() {
              ngDialog.close();
          };
          

        
        vm.OpenUploadCsv = function() {
            vm.CsvDialog();
        };
        
        $scope.uploadFiles = function (files) {
            $scope.file = files;
   //         angular.forEach(files, function(file, key) {
                console.log($scope.file);
     //       });      


        };


        vm.UploadSupplierCsv = function() {
  //          $scope.buyers = {};
            if(vm.uploadcsv.$valid) {
                $(".modelform3").addClass(progressLoader());
              //  console.log($scope.file);
                Upload.upload({
                            url: 'api/v1/companies/'+$scope.company_id+'/suppliers/',
                            headers: {
                              'optional-header': 'header-value'
                            },
                            data: {"supplier_csv":$scope.file}
                      }).then(function (response) {
                                var headers = response.headers();
                                //alert(headers['content-type']);
                                
                                
                                if(headers['content-type'] == "text/csv"){
                                    var hiddenElement = document.createElement('a');

                                    hiddenElement.href = 'data:attachment/csv,' + encodeURI(response.data);
                                    hiddenElement.target = '_blank';
                                    hiddenElement.download = 'supplier_error.csv';
                                    hiddenElement.click();
                                    
                                    vm.successtoaster = {
                                        type:  'warning',
                                        title: 'Warning',
                                        text:  'File uploaded successfully and please fix issues found on supplier_error.csv and reupload'
                                    };
                                }
                                else{
                                    vm.successtoaster = {
                                        type:  'success',
                                        title: 'Success',
                                        text:  'Job is Scheduled. Please check Jobs table in settings for status.'
                                    };
                                }
                                
                                $(".modelform3").removeClass(progressLoader());
                                ngDialog.close();
                                
                                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                reloadData();
                        });
            }
            else
            {
                vm.uploadcsv.supplier_csv.$dirty = true;
            }
        };

        $scope.supplier = {};
        vm.AddSupplier = function() {
            if(vm.addsupplierForm.$valid) {
                $(".modelform").addClass(progressLoader());
                
               // addsupplierusingnumber.save({'supplier_name':vm.suppliername, 'supplier_number': vm.phonenumber, 'group_type':vm.grouptype},
                Suppliers.save({supplier_name:$scope.supplier.supplier_name, group_type:$scope.supplier.group_type, country:$scope.supplier.country, supplier_number:$scope.supplier.supplier_number, cid:$scope.company_id},
                function(success){
                    $(".modelform").removeClass(progressLoader());
                    
                    ngDialog.close();
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  success.success //'Supplier invited successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    reloadData();
                });
            }
            else
            {
                vm.addsupplierForm.suppliername.$dirty = true;
                vm.addsupplierForm.grouptype.$dirty = true;
                vm.addsupplierForm.phone_number.$dirty = true;
            }
        };
        
         $scope.OpenUpdateStatus = function (id){
          
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })

            if(true_count == 1) {  

                Suppliers.get({'id': vm.true_key, 'cid':$scope.company_id},function(result){
                    $scope.supplierId = result.id;
                    if(result.status == 'buyer_pending' || result.status == 'approved'  || result.status == 'rejected')
                    {
                        $scope.supplier = result;
                        if(result.status == 'approved')
                        {
                            $scope.statusflag = true;
                        }
                        else
                        {
                            $scope.statusflag = false;
                        }
                        $scope.OpenStatusDialog();
                    }
                    else
                    {
                        vm.errortoaster = {
                                    type:  'error',
                                    title: 'Failed',//toTitleCase(key),//
                                    text:  "You can update only if status is buyer pending"
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    }
                });
              }
              else   
              {
                  vm.errortoaster = {
                                    type:  'error',
                                    title: 'Failed',//toTitleCase(key),//
                                    text:  "Please select one row"
                                };
                                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
              } 
        };

        vm.StatusChange = function (status){
            if(status == 'approved')
            {
                $scope.statusflag = true;
            }
            else
            {
                $scope.statusflag = false;
            }

        }
        $scope.UpdateStatus = function (){
            if(vm.updateStatusForm.$valid) {
                $(".modelform2").addClass(progressLoader()); 
                if($scope.supplier.status == 'approved')
                {
                    $scope.params = {"cid":$scope.company_id, "id":$scope.supplierId, "status": $scope.supplier.status, "fix_amount":$scope.supplier.fix_amount, "percentage_amount":$scope.supplier.percentage_amount };
                }
                else
                {
                    $scope.params = {"cid":$scope.company_id, "id":$scope.supplierId, "status": $scope.supplier.status};   
                }
                Suppliers.patch($scope.params,
                    function(success){
                            $(".modelform2").removeClass(progressLoader());
                            ngDialog.close();
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Supplier status updated successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            reloadData();
                            $scope.buyer = {};
                      }/*,
                  function(error){
                        vm.errortoaster = {
                              type:  'error',
                              title: 'Failed',
                              text:  'Supplier status is not updated.'
                          };
                          toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                  }*/)
            }
            else
            {
                vm.updateStatusForm.status.$dirty = true;
                vm.updateStatusForm.fix_amount.$dirty = true;
                vm.updateStatusForm.percentage_amount.$dirty = true;
            }

        }


        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};
        
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
        
        function imageHtml(data, type, full, meta){
          return '<img src="'+full[3]+'" style="width: 100px; height: 100px"/>';
        }
        
        vm.resendSupplier = function(){
            var ids = [];
            $(".modelform4").addClass(progressLoader());
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    ids.push(key);
                }
            });
            if(ids.length>0){
                resendsupplier.save({"suppliers":ids, "cid":$scope.company_id},
                function(success){
                    $(".modelform4").removeClass(progressLoader());
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  success.success
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                });
            }
            else{
                $(".modelform4").removeClass(progressLoader());
                vm.errortoaster = {
                    type:  'error',
                    title: 'Failed',//
                    text:  'Please select one row'
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }
        }

        $scope.grouptype_data = [];
        grouptype.query().$promise.then(function(result){
                $scope.grouptypes = result;
                console.log($scope.grouptypes.length);
                for (var i = 0; i < $scope.grouptypes.length; i++) {
                    var json = {};

                    json['value'] = $scope.grouptypes[i].name;
                    json['label'] = $scope.grouptypes[i].name;
                    $scope.grouptype_data.push(json);
                }
              /*  if(i == $scope.grouptypes.length) {
                    console.log(JSON.stringify($scope.grouptype_data));
                } */
        })
        
        function SupplierDetail(data, type, full, meta){
          //return '<div class="col-md-6"><a ng-click="OpenSupplier('+full[0]+')">'+full[3]+'</a></div>';
          if(full[6] == "Supplier Registration Pending"){
              return full[1];
          }
          else{
            return '<a href="#/app/supplier-detail/?id='+full[7]+'&name='+full[1]+'">'+full[1]+'</a>';
          }
        }
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/sellerdatatables1/',
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
                            1 : { "type" : "text", width: '100%'},
                            2 : { "type" : "text"},
                            3 : { "type" : "text"},
                            //4 : { "type" : "text"},
                            4 : { "type" : "text"},
                            //5 : { "type" : "text"},
                            5 : { "type" : "select", values: $scope.grouptype_data },
                            6 : { "type" : "select", values:[{"value":"supplier_registrationpending","label":"Supplier Registration Pending"}, {"value":"buyer_pending","label":"Buyer Pending"}, {"value":"supplier_pending","label":"Supplier Pending"}, {"value":"approved","label":"Approved"}, {"value":"rejected","label":"Rejected"}]},
                        })
                        
                        .withOption('processing', true)
                        .withOption('serverSide', true)
                        
                        .withOption('stateSave', true)
                          .withOption('stateSaveCallback', function(settings, data) {
                              //console.log(JSON.stringify(settings));
                              data = datatablesStateSaveCallback(data);
                              localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));
                          })
                          .withOption('stateLoadCallback', function(settings) {
                             return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance ))
                          })
                          
                        //.withOption('aLengthMenu', [[10, 50, 100, -1], [10, 50, 100, "All"]])
                        .withOption('iDisplayLength', 10)
                        //.withOption('responsive', true)
                        .withOption('scrollX', true)
                        .withOption('scrollY', getDataTableHeight())
                        //.withOption('scrollCollapse', true)
                        .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
                        
                        .withPaginationType('full_numbers')
                        .withButtons([
                            //'columnsToggle',
                            //'colvis',.
                            {
                                text: 'Add Supplier',
                                key: '1',
                                className: 'green',
                                action: function (e, dt, node, config) {
                                    $scope.supplier = {};
                                    vm.OpenAddSupplier();
                                }
                            },
                            {
                                text: 'Approve/Reject',
                                key: '1',
                                className: 'orange',
                                action: function (e, dt, node, config) {
                                    //alert(JSON.stringify(vm.selected));
                                    $scope.OpenUpdateStatus();
                                }
                            }, 
                            /*{
                                text: 'Upload CSV',
                                key: '1',
                                className: 'blue',
                                action: function (e, dt, node, config) {
                                    vm.OpenUploadCsv();
                                }
                            },*/
                            {
                                text: 'Resend Request',
                                key: '1',
                                className: 'purple',
                                action: function (e, dt, node, config) {
                                    vm.resendSupplier()
                                }
                            },
                            {
                                  text: 'Reset Filter',
                                  key: '1',
                                  className: 'green',
                                  action: function (e, dt, node, config) {
                                    localStorage.removeItem('DataTables_' + 'suppliers-datatables');
                                    $state.go($state.current, {}, {reload: true});
                                  }
                            },
                            'copy',
                            'print',
                            'excel'
                            
                        ]);
            
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
            .renderWith(function(data, type, full, meta) {
                vm.selected[full[0]] = false;
                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
            }),
            
            DTColumnDefBuilder.newColumnDef(1).withTitle('Name').renderWith(SupplierDetail),
            
            DTColumnDefBuilder.newColumnDef(2).withTitle('State'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('City'),
            //DTColumnDefBuilder.newColumnDef(4).withTitle('Category'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Phone Number').notVisible(),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Type'),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Status'),
            /*DTColumnDefBuilder.newColumnDef(7).withTitle('Action').notSortable()//.withOption('width', '25%')
                .renderWith(function(data, type, full, meta) {
                    var htmlbutton = ''
                    
                    if(full[6] == 'Buyer Pending')
                    {
                        htmlbutton += '<div><button type="button" ng-click="OpenUpdateStatus('+full[0]+')" class="btn btn-block btn-primary orange-button">Approve/Reject</button></div>';
                    }
                    if(full[6] == 'Approved' || full[6] == 'Rejected')
                    {
                        htmlbutton += '<div><button type="button" ng-click="OpenUpdateStatus('+full[0]+')" class="btn btn-block btn-primary" >Update</button></div>';
                    }
                    
                    if(htmlbutton == '')
                        return '&nbsp;';
                    else
                        return htmlbutton;
                })*/ 
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
