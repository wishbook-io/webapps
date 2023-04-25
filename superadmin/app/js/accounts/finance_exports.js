(function() {
    'use strict';

    angular
        .module('app.accounts')
        .controller('FinanceExportsController', FinanceExportsController);

    FinanceExportsController.$inject = ['$resource', 'ngDialog', 'FinanceExport', 'Upload', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$localStorage', '$http'];
    function FinanceExportsController($resource, ngDialog, FinanceExport, Upload, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, $localStorage, $http) {
        CheckAuthenticated.check();
        $scope.company_id = localStorage.getItem('company');

        var vm = this;
        
        $scope.export = {};

        $scope.doExport = function (export_type){
            var daterange = $scope.export.from_date+'~'+$scope.export.to_date;
            console.log(daterange);
            if($scope.export.to_date && $scope.export.from_date && (new Date($scope.export.to_date).getTime() >= new Date($scope.export.from_date).getTime()))
            {
                $(".modelform").addClass(progressLoader());
                $http.get('/api/v1/finance-export/?date_range='+daterange+'&export_for='+export_type).then(
                function(response){
                  $(".modelform").removeClass(progressLoader());
                  //console.log(response);
                  var headers = response.headers();
                  //console.log(headers);
                  //alert(headers['content-type']);
                  var header = headers['content-disposition'];
                  //console.log(header);
                  var startIndex = header.indexOf("filename=") + 10; // Adjust '+ 10' if filename is not the right one.
                  var endIndex = header.length - 1; //Check if '- 1' is necessary
                  var filename = header.substring(startIndex, endIndex);
                  //console.log("filename: " + filename)

                  if(headers['content-type'] == "text/csv"){
                        /*var hiddenElement = document.createElement('a');
                        hiddenElement.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(response.data);
                        hiddenElement.target = '_blank';
                        hiddenElement.download = filename;
                        hiddenElement.click();*/
                        var anchor = angular.element('<a/>');
                        anchor.css({display: 'none'}); // Make sure it's not visible
                        angular.element(document.body).append(anchor); // Attach to document

                        anchor.attr({
                            href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response.data),
                            target: '_blank',
                            download: filename
                        })[0].click();
                        anchor.remove(); // Clean it up afterwards
                    }
                });
            }
            else
            {
                vm.errortoaster = {
                    type:  'error',
                    title: 'Failed',
                    text:  'Please select date - ToDate should be greater than FromDate'
                };
                console.log(vm.errortoaster);
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }
        }
        

        $scope.uploadSellerPaymentFiles = function (files) {
            $scope.SellerPaymentfile = files;
           // angular.forEach(files, function(file, key) {
                console.log($scope.SellerPaymentfile);
           // });      
        };

        vm.UploadSellerPaymentCsv = function() {
            console.log($scope.SellerPaymentfile);
            if(vm.importSellerPaymentForm.$valid) {
                $(".modelform2").addClass(progressLoader());
              //  console.log($scope.SellerPaymentfile);
                Upload.upload({
                            //url: 'api/v1/companies/'+$scope.company_id+'/buyers/',
                            headers: {
                              'optional-header': 'header-value'
                            },
                            data: {"buyer_csv":$scope.SellerPaymentfile}
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
                                
                                $(".modelform2").removeClass(progressLoader());
                       
                                
                                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            
                        });
            }
            else
            {
                vm.importSellerPaymentForm.seller_payment_csv.$dirty = true;
            }
        };

        $scope.uploadPaidInvoicesFiles = function (files) {
            $scope.PaidInvoicesfile = files;
            //angular.forEach(files, function(file, key) {
                console.log($scope.PaidInvoicesfile);
           // });      
        };

        vm.UploadPaidInvoicesCsv = function() {
          console.log($scope.PaidInvoicesfile);
            if(vm.importPaidInvoicesForm.$valid) {
                $(".modelform3").addClass(progressLoader());
              //  console.log($scope.PaidInvoicesfile);
                Upload.upload({
                            //url: 'api/v1/companies/'+$scope.company_id+'/buyers/',
                            headers: {
                              'optional-header': 'header-value'
                            },
                            data: {"buyer_csv":$scope.PaidInvoicesfile}
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
                     
                                
                                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                      
                        });
            }
            else
            {
                vm.importPaidInvoicesForm.paid_invoices_csv.$dirty = true;
            }
        };
        
        
    }
})();
