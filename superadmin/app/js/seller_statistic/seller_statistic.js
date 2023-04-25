
(function() {
    'use strict';

    angular
        .module('app.seller_statistic')
        .controller('SellerStatisticController', SellerStatisticController);

    SellerStatisticController.$inject = ['$resource',  'toaster', 'ngDialog', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter'];
    function SellerStatisticController($resource, toaster, ngDialog, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state,  $filter) {
        CheckAuthenticated.check();        
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
        var vm = this;
               
        
        
        $scope.reloadData  = function () {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);
        }
        
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        $scope.update_flag = false;
        
        $scope.alrt = function () {alert("called");};

        
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
          return '<img src="'+full[2]+'" style="width: 100px; height: 100px"/>';
        }
        
        function TitleLink(data, type, full, meta){
          return '<a target="_blank" href="#/app/companies-buyer-supplier/'+full[26]["company"]+'">'+full[1]+'</a>';
        }
        
        $scope.OpenCompany = function(companyId){
            $scope.companyId = companyId;
            
            ngDialog.open({
                template: 'companydetails',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        
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
        
        var today = new Date(); 
        var last30dayDate = today.setDate(today.getDate() - 30);
        last30dayDate = formatDate(last30dayDate)
        
        var last30dayCatalogSellerDate = today.setDate(today.getDate() - 15)
        last30dayCatalogSellerDate = formatDate(last30dayCatalogSellerDate)
        
        function SupplierDetail(data, type, full, meta){
          //return '<div class="col-md-6"><a ng-click="OpenCompany('+full[26]["company"]+')">'+full[1]+'</a></div>';
          return '<div class="col-md-6"><a ng-click="OpenCompanyEdit('+full[26]["company"]+')">'+full[1]+'</a></div>';
        }
        
        
        function CatalogsUploaded(data, type, full, meta){
          return '<div class="col-md-6"><a href="/api/admin/api/catalog/?company='+full[26]["company"]+'&created_at__gte='+last30dayDate+'" target="_blank">'+full[7]+'</a></div>';
        }
        
        function CatalogsSeller(data, type, full, meta){
          return '<div class="col-md-6"><a href="/api/admin/api/catalogseller/?selling_type__exact=Public&selling_company='+full[26]["company"]+'&expiry_date__gte='+last30dayCatalogSellerDate+'" target="_blank">'+full[8]+'</a></div>';
        }
        
        function LastCatalogName(data, type, full, meta){
          return '<div class="col-md-6"><a href="/api/admin/api/catalog/?q='+full[12]+'" target="_blank">'+full[12]+'</a></div>';
        }
        
        
        function EnquiryReceived(data, type, full, meta){
          return '<div class="col-md-6"><a href="/api/admin/api/buyer/?created_type__exact=Enquiry&selling_company='+full[26]["company"]+'&created_at__gte='+last30dayDate+'" target="_blank">'+full[13]+'</a></div>';
        }
        
        function EnquiryConverted(data, type, full, meta){
          return '<div class="col-md-6"><a href="/api/admin/api/buyer/?created_type__exact=Enquiry&buyer_type__exact=Relationship&selling_company='+full[26]["company"]+'&created_at__gte='+last30dayDate+'" target="_blank">'+full[14]+'</a></div>';
        }
        
        function EnquiryPending(data, type, full, meta){
          return '<div class="col-md-6"><a href="/api/admin/api/buyer/?created_type__exact=Enquiry&buyer_type__exact=Enquiry&selling_company='+full[26]["company"]+'&created_at__gte='+last30dayDate+'" target="_blank">'+full[15]+'</a></div>';
        }
        
        function OrderValues(data, type, full, meta){
          return '<div class="col-md-6"><a href="/api/admin/api/salesorder/?seller_company='+full[26]["company"]+'&created_at__gte='+last30dayDate+'" target="_blank">'+full[18]+'</a></div>';
        }
   
        vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: 'api/sellerstatisticdatatables/',
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
                          2 : { "type" : "text"},
                          3 : { "type" : "text"},
                          4 : { "type" : "text"},
                          5 : { "type" : "text"},
                          6 : { "type" : "dateRange"},
                          7 : { "type" : "text"},
                          8 : { "type" : "text"},
                          9 : { "type" : "text"},
                          10 : { "type" : "dateRange"},
                          11 : { "type" : "dateRange"},
                          12 : { "type" : "text"},
                          13 : { "type" : "text"},
                          14 : { "type" : "text"},
                          15 : { "type" : "text"},
                          16 : { "type" : "text"},
                          17 : { "type" : "text"},
                          18 : { "type" : "text"},
                          19 : { "type" : "text"},
                          20 : { "type" : "text"},
                          21 : { "type" : "text"},
                          22 : { "type" : "text"},
                          23 : { "type" : "text"},
                          24 : { "type" : "text"},
                          25 : { "type" : "text"},
                          
                      })
                      
                      .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
                      .withOption('processing', true)
                      .withOption('serverSide', true)
                      .withOption('iDisplayLength', -1)
                      //.withOption('responsive', true)
                      .withOption('scrollX', true)
                      .withOption('scrollY', getDataTableHeight())
                      //.withOption('scrollCollapse', true)
                      .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
                      
                      .withPaginationType('full_numbers')
                      
                      .withButtons([
                          'copy',
                          'print',
                          'excel',
                          'csv',
                          //'pdf',
                          
                      ]);
                          
                      vm.dtColumnDefs = [
                          DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
                          .renderWith(function(data, type, full, meta) {
                              vm.selected[full[0]] = false;
                              return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                          }),
                          DTColumnDefBuilder.newColumnDef(1).withTitle('Name').renderWith(SupplierDetail),
                          DTColumnDefBuilder.newColumnDef(2).withTitle('Salesman'),
                          DTColumnDefBuilder.newColumnDef(3).withTitle('Types'),
                          DTColumnDefBuilder.newColumnDef(4).withTitle('City'),
                          DTColumnDefBuilder.newColumnDef(5).withTitle('Phone Number'),
                          DTColumnDefBuilder.newColumnDef(6).withTitle('Last Login'),
                          
                          DTColumnDefBuilder.newColumnDef(7).withTitle('Catalogs Uploaded').renderWith(CatalogsUploaded),
                          DTColumnDefBuilder.newColumnDef(8).withTitle('Catalogs Seller').renderWith(CatalogsSeller),
                          DTColumnDefBuilder.newColumnDef(9).withTitle('Enable Catalogs'),
                          DTColumnDefBuilder.newColumnDef(10).withTitle('Last Catalog Uploaded Date'),
                          DTColumnDefBuilder.newColumnDef(11).withTitle('Last Seller Date'),
                          DTColumnDefBuilder.newColumnDef(12).withTitle('Last Catalolg Name').renderWith(LastCatalogName),
                          
                          DTColumnDefBuilder.newColumnDef(13).withTitle('Enquiry Received').renderWith(EnquiryReceived),
                          DTColumnDefBuilder.newColumnDef(14).withTitle('Enquiry Converted').renderWith(EnquiryConverted),
                          DTColumnDefBuilder.newColumnDef(15).withTitle('Enquiry Pending').renderWith(EnquiryPending),
                          DTColumnDefBuilder.newColumnDef(16).withTitle('Enquiry Values'),
                          DTColumnDefBuilder.newColumnDef(17).withTitle('Enquiry Handling Time'),
                          
                          DTColumnDefBuilder.newColumnDef(18).withTitle('Order Values').renderWith(OrderValues),
                          DTColumnDefBuilder.newColumnDef(19).withTitle('Pending Order Values'),
                          DTColumnDefBuilder.newColumnDef(20).withTitle('Pre-Paid Order Values'),
                          DTColumnDefBuilder.newColumnDef(21).withTitle('Pre-Paid Cancelled Order Values'),
                          DTColumnDefBuilder.newColumnDef(22).withTitle('Avg Dispatch Time'),
                          
                          DTColumnDefBuilder.newColumnDef(23).withTitle('Enquiry Not Handled'),
                          DTColumnDefBuilder.newColumnDef(24).withTitle('Total Pending Order'),
                          DTColumnDefBuilder.newColumnDef(25).withTitle('Prepaid Order Cancellation Rate'),
                          
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

