
(function() {
    'use strict';

    angular
        .module('app.buyers')
        .controller('BuyerslistController', BuyerslistController);

    BuyerslistController.$inject = ['$resource', '$http', '$scope', 'Upload', 'toaster', 'grouptype', 'Country', 'State', 'Buyers', 'Company', 'ngDialog', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', 'resendbuyer', '$cookies', '$localStorage'];
    function BuyerslistController($resource, $http, $scope, Upload, toaster, grouptype, Country, State, Buyers, Company, ngDialog, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, resendbuyer, $cookies, $localStorage) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
        $scope.grouptype_data = JSON.parse(localStorage.getItem('grouptype_data'));
        console.log($scope.grouptype_data);
        $scope.states_data = JSON.parse(localStorage.getItem('states_data'));
        console.log($scope.states_data);
        
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        UpdateCheckBoxUI();
        
        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
        
        function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);

            UpdateCheckBoxUI();
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
        
        
        
       
        $scope.OpenDialog = function () {
            ngDialog.open({
                template: 'addbuyer',
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
        
        $scope.OpenUpdateDialog = function () {
            ngDialog.open({
                template: 'updatebuyer',
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
        vm.CloseDialog = function() {
            ngDialog.close();
        };

        vm.OpenAddBuyer = function() {
            $scope.OpenDialog();
            $scope.groupType = grouptype.query();
            Country.query().$promise.then(function(success){
                $scope.countries = success;
                $scope.buyer.country = 1;
            });
            
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

        vm.UploadBuyerCsv = function() {
  //          $scope.buyers = {};
            if(vm.uploadcsv.$valid) {
                $(".modelform3").addClass(progressLoader());
              //  console.log($scope.file);
                Upload.upload({
                            url: 'api/v1/companies/'+$scope.company_id+'/buyers/',//'api/importcsvbuyernumber/',
                            headers: {
                              'optional-header': 'header-value'
                            },
                            data: {"buyer_csv":$scope.file}
                      }).then(function (response) {
                                /*var uri = 'data:application/csv;charset=UTF-8,' + encodeURIComponent(response.data);
                                window.open(uri, 'buyer_error.csv');*/
                                var headers = response.headers();
                                //alert(headers['content-type']);
                                
                                
                                if(headers['content-type'] == "text/csv"){
                                    var hiddenElement = document.createElement('a');

                                    hiddenElement.href = 'data:attachment/csv,' + encodeURI(response.data);
                                    hiddenElement.target = '_blank';
                                    hiddenElement.download = 'buyer_error.csv';
                                    hiddenElement.click();
                                    
                                    vm.successtoaster = {
                                        type:  'warning',
                                        title: 'Warning',
                                        text:  'File uploaded successfully and please fix issues found on buyer_error.csv and reupload'
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
                vm.uploadcsv.buyer_csv.$dirty = true;
            }
        };

            
        $scope.buyer = {};
        vm.AddBuyer = function() {
            if(vm.addbuyerForm.$valid) {
                $(".modelform").addClass(progressLoader());
       //         alert(JSON.stringify($scope.buyer));
           //   addbuyerusingnumber.save({'buyer_name':vm.buyername, 'buyer_number': vm.phonenumber, 'group_type':vm.grouptype},
           Buyers.save({buyer_name:$scope.buyer.buyer_name, group_type:$scope.buyer.group_type, country:$scope.buyer.country, buyer_number:$scope.buyer.buyer_number, cid:$scope.company_id},
                function(success){
                    $(".modelform").removeClass(progressLoader());
                    
                    ngDialog.close();
                    vm.successtoaster = {
                        type:  'success',
                        title: 'Success',
                        text:  success.success //'Buyer invited successfully.'
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    reloadData();
                });
            }
            else
            {
                vm.addbuyerForm.buyername.$dirty = true;
                vm.addbuyerForm.grouptype.$dirty = true;
                vm.addbuyerForm.phone_number.$dirty = true;
            }
        };
        
        $scope.toUpdate = [];
        vm.OpenUpdateStatus = function (){
            $scope.toUpdate = [];
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                    $scope.toUpdate.push(vm.true_key);
                }
            })
            
            if(true_count > 0)
            {
                console.log($scope.toUpdate);
                $scope.OpenStatusDialog();
            }
            else   
            {
                vm.errortoaster = {
                    type:  'error',
                    title: 'Failed',//toTitleCase(key),//
                    text:  "Please select one row"
                };
                //toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);

                $.notify({
                    title: "Failed",
                    message: "Please select one row",
                },
                    {
                        type: 'info',
                        placement: {
                            from: 'bottom',
                            align: 'right'
                        }
                    });

                setTimeout(function () {
                    $('.uk-notify').fadeout();
                }, 1000);
            }
           /*     Buyers.get({'id': vm.true_key}).$promise.then(function(result){
                    $scope.buyerId = result.id;
                    if(result.status == 'supplier_pending' || result.status == 'approved')
                    {
                        $scope.OpenStatusDialog();
                    }
                    else
                    {
                        vm.errortoaster = {
                                    type:  'error',
                                    title: 'Failed',//toTitleCase(key),//
                                    text:  "You can update only if status is supplier pending"
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    }
                });*/
              
        };

        $scope.UpdateStatus = function (){

            $(".modelform2").addClass(progressLoader()); 
            angular.forEach($scope.toUpdate, function(buyerId) {
                Buyers.get({'id': buyerId, 'cid':$scope.company_id}).$promise.then(function(result){
                  if(result.status == 'supplier_pending' || result.status == 'approved' || result.status == 'rejected')
                  {  
                    Buyers.patch({"id":buyerId, "status": $scope.buyer.status, "cid":$scope.company_id},
                        function(success){
                                $(".modelform2").removeClass(progressLoader());
                                ngDialog.close();
                                vm.successtoaster = {
                                    type:  'success',
                                    title: 'Success',
                                    text:  'Buyer status updated successfully.'
                                };
                                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                reloadData();
                                $scope.buyer = {};
                          });
                }
                else
                {
                    $(".modelform2").removeClass(progressLoader());
                    vm.errortoaster = {
                                type:  'error',
                                title: 'Failed',//toTitleCase(key),//
                                text:  "Status is not updated. You can update only if status is supplier pending or rejected"
                    };
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                }
             })
         });
        }
        
        $scope.buyerId = null
        vm.OpenUpdate = function (){
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })
            
            if(true_count == 1)
            {
                Buyers.get({'id': vm.true_key, 'cid':$scope.company_id}).$promise.then(function(result){
                    $scope.buyerId = result.id;
                    if(result.status == 'buyer_pending' || result.status == 'supplier_pending' || result.status == 'approved')
                    {
                        $scope.buyer = result
                        $scope.brokers = Company.query({'id':$scope.company_id, 'sub_resource':'brokers'})
                        $scope.groupType = grouptype.query();
                        $scope.OpenUpdateDialog();
                    }
                    else
                    {
                        vm.errortoaster = {
                                    type:  'error',
                                    title: 'Failed',
                                    text:  "You can update only if supplier is registered."
                        };
                        toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    }
                });
            }
            else   
            {
                vm.errortoaster = {
                    type:  'error',
                    title: 'Failed',
                    text:  "Please select only one row"
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);

                $.notify({
                    title: "Failed",
                    message: "Please select one row",
                },
                    {
                        type: 'info',
                        placement: {
                            from: 'bottom',
                            align: 'right'
                        }
                    });

                setTimeout(function () {
                    $('.uk-notify').fadeout();
                }, 1000);
            }
            
        };
        
        $scope.UpdateBuyer = function (){
            $(".modelform2").addClass(progressLoader()); 
            Buyers.patch({'id': $scope.buyerId, 'cid':$scope.company_id, 'group_type':$scope.buyer.group_type, 'broker_company':$scope.buyer.broker_company, 'payment_duration':$scope.buyer.payment_duration, 'discount':$scope.buyer.discount}).$promise.then(function(result){
                $(".modelform2").removeClass(progressLoader());
                ngDialog.close();
                vm.successtoaster = {
                    type:  'success',
                    title: 'Success',
                    text:  'Buyer updated successfully.'
                };
                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                reloadData();
                $scope.buyer = {};
            });
        }
        
        vm.resendBuyer = function(){
            var ids = [];
            $(".modelform4").addClass(progressLoader());
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    ids.push(key);
                }
            });
            
            if(ids.length>0){
                resendbuyer.save({"buyers":ids, "cid":$scope.company_id},
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
                //toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                $.notify({
                    title: "Failed",
                    message: "Please select one row",
                },
                    {
                        type: 'info',
                        placement: {
                            from: 'bottom',
                            align: 'right'
                        }
                    });

                setTimeout(function () {
                    $('.uk-notify').fadeout();
                }, 1000);
            }
        }
        /*$scope.states_data = [];
        State.query().$promise.then(function(result){
                $scope.states = result;
              //  console.log($scope.states.length);
                for (var i = 0; i < $scope.states.length; i++) {
                    var json = {};

                    json['value'] = $scope.states[i].state_name;
                    json['label'] = $scope.states[i].state_name;
                    $scope.states_data.push(json);
                }
              
        });

        

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
    
        })*/
        
        function BuyerDetail(data, type, full, meta){
          //return '<div class="col-md-6"><a ng-click="OpenBuyer('+full[0]+')">'+full[3]+'</a></div>';
          if(full[7] == "Buyer Registration Pending"){
              return full[1];
          }
          else{
            return '<a href="#/app/buyer-detail/?id='+full[8]+'&name='+full[1]+'">'+full[1]+'</a>';
          }
        }

        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: 'api/buyerdatatables1/',
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
                            2 : { "type" : "text", width: '100%'},
                            3 : { "type" : "select", values: $scope.states_data },
                            4 : { "type" : "text"},
                            //4 : { "type" : "text"},
                            5 : { "type" : "text"},
                            6 : { "type" : "select", values: $scope.grouptype_data },
                            7 : { "type" : "select", values:[{"value":"buyer_registrationpending","label":"Buyer Registration Pending"}, {"value":"buyer_pending","label":"Buyer Pending"}, {"value":"supplier_pending","label":"Supplier Pending"}, {"value":"approved","label":"Approved"}, {"value":"rejected","label":"Rejected"}]},
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
                                text: 'Add Buyer',
                                key: '1',
                                className: 'green',
                                action: function (e, dt, node, config) {
                                    $scope.buyer = {};
                                    vm.OpenAddBuyer();
                                }
                            },
                            {
                                text: 'Approve/Reject',
                                key: '1',
                                className: 'orange',
                                action: function (e, dt, node, config) {
                                    //alert(JSON.stringify(vm.selected));
                                    vm.OpenUpdateStatus();
                                }
                            },
                            /*{
                                text: 'Update',
                                key: '1',
                                className: 'orange',
                                action: function (e, dt, node, config) {
                                    vm.OpenUpdate();
                                }
                            },*/
                            {
                                text: 'Upload CSV',
                                key: '1',
                                className: 'blue',
                                action: function (e, dt, node, config) {
                                    
                                    vm.OpenUploadCsv();
                                }
                            },
                            {
                                text: 'Resend Request',
                                key: '1',
                                className: 'purple',
                                action: function (e, dt, node, config) {
                                    vm.resendBuyer()
                                }
                            },
                            {
                              text: 'Reset Filter',
                              key: '1',
                              className: 'green',
                              action: function (e, dt, node, config) {
                                localStorage.removeItem('DataTables_' + 'buyers-datatables');
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
            
            DTColumnDefBuilder.newColumnDef(1).withTitle('Name').renderWith(BuyerDetail),
            
            DTColumnDefBuilder.newColumnDef(2).withTitle('Invite Name'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('State'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('City'),
            //DTColumnDefBuilder.newColumnDef(4).withTitle('Category'),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Phone Number').notVisible(),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Type'),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Status'),
            
            
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

        $(document).ready(function () {
            setTimeout(function () {
                var paginationbuttons = document.getElementsByClassName('paging_full_numbers')
                var i = paginationbuttons.length;
                while (i--) {
                    paginationbuttons[i].addEventListener("click", function () {
                        UpdateCheckBoxUI();
                    });
                }
                var tableheaders = document.getElementsByTagName('th');
                var j = tableheaders.length;
                while (j--) {
                    tableheaders[j].addEventListener("click", function () {
                        UpdateCheckBoxUI();
                    });
                    tableheaders[j].addEventListener("keydown", function () {
                        UpdateCheckBoxUI();
                    });
                }
                console.log('UpdateCheckBoxUI() attached')

            }, 3000);
        });
        
       
    }
})();

