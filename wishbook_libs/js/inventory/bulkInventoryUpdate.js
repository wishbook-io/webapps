(function() {
    'use strict';

    angular
        .module('app.inventoryjobs')
        .controller('bulkInventoryUpdateController', bulkInventoryUpdateController);

    bulkInventoryUpdateController.$inject = ['$resource', '$filter', '$scope', 'Upload', 'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', '$cookies', '$localStorage', 'sharedProperties'];
    function bulkInventoryUpdateController($resource, $filter, $scope, Upload, ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, $cookies, $localStorage, sharedProperties) {
      
      var vm = this;
      $scope.company_id = localStorage.getItem('company');
      
      $scope.CloseDialog = function () {
        ngDialog.close();
      }
      $scope.csvFileSource = function (link) {
          return window.location.origin+'/api/v2/companies/' + $scope.company_id+'/get-pending-item-csv/'
      }
      
      $scope.loadCSV = function (file) {
          $scope.inventory_csv = file;
          console.log($scope.inventory_csv);
          console.log($scope.uploadInventoryCsvForm);
      };

      $scope.UploadInventoryCSV = function ()
      { 
          console.log($scope.inventory_csv.length);
          if($scope.inventory_csv.length < 1){
            vm.successtoaster = {
                type: 'error',
                title: 'Warning',
                text: 'Please select file'
            };
            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
            return;
          }

          $(".modelform3").addClass(progressLoader());

          Upload.upload({
              url: 'api/v2/companies/' + $scope.company_id +'/seller-inventory-csv-upload/',
              headers: {
                  'optional-header': 'header-value'
              },
              data: { "upload_csv": $scope.inventory_csv }
          }).then(function (response)
          {
              var headers = response.headers();

              if (headers['content-type'] == "text/csv") {
                  var hiddenElement = document.createElement('a');

                  hiddenElement.href = 'data:attachment/csv,' + encodeURI(response.data);
                  hiddenElement.target = '_blank';
                  hiddenElement.download = 'inventory_error.csv';
                  hiddenElement.click();

                  vm.successtoaster = {
                      type: 'warning',
                      title: 'Warning',
                      text: 'File uploaded successfully and please fix issues found on inventory_error.csv and reupload'
                  };
              }
              else {
                  vm.successtoaster = {
                      type: 'success',
                      title: 'Success',
                      text: 'Inventory update Job is Scheduled. Please check Jobs table in settings for status.'
                  };
              }

              $(".modelform3").removeClass(progressLoader());
              ngDialog.close();

              toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
              $scope.reloadData();
          });

      }
      
    }  // end :  function bulkInventoryUpdateController
})();
      
      