/*start - form wizard */
(function() {
    'use strict';
    angular
        .module('app.rrcrequests')
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
        .module('app.rrcrequests')
        .controller('RrcRequestsController', RrcRequestsController);

    RrcRequestsController.$inject = ['$resource','$http','$httpParamSerializer',  'toaster', 'ngDialog', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', 'SalesOrders', 'Company', 'PurchaseOrders', 'Warehouse', 'OrderInvoice', 'sharedProperties', '$stateParams','RRC'];
    function RrcRequestsController($resource, $http, $httpParamSerializer, toaster, ngDialog, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state,  $filter, SalesOrders, Company, PurchaseOrders, Warehouse, OrderInvoice, sharedProperties, $stateParams,RRC) {
        CheckAuthenticated.check();
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
        var vm = this;
        vm.dt = new Date();
        vm.format = 'dd-MMMM-yyyy';
        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        vm.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        };


        $scope.company_id = 0;
        if(localStorage.hasOwnProperty("company")){
            $scope.company_id = localStorage.getItem('company');
        }
        $scope.is_staff = localStorage.hasOwnProperty("is_staff");

        console.log($scope.company_id);
        console.log($scope.is_staff);

        //createorder start
        vm.CloseDialog = function() {
            ngDialog.close();
        };

        $scope.order = {};



        $scope.formatDate = function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }

        $scope.order.dispatch_date = new Date();


        $scope.splitExtra =  function(extra_notifiers) {
          $scope.extra_count = extra_notifiers.split(',').length
        }


        vm.selected = {};
        vm.selectedFullJson = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        $scope.update_flag = false;

        $scope.alrt = function () {alert("called");};


        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';

        /*function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);
        }*/

        $scope.reloadData = function() {
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
          return '<img src="'+full[5]+'" style="width: 100px; height: 100px"/>';
        }

        function TitleLink(data, type, full, meta){
          return '<a href="#/app/cart-detail/?id='+full[0]+'" target=_blank>'+full[0]+'</a>';
        }

        function DataFormating(data, type, full, meta){


          return '<p style="cursor: pointer;">'+data+'</p>';
        }
        $scope.ViewRRCImages = function (rid) {
          $(".datatable-loader").addClass(progressLoader());
          RRC.get({'id': rid}, function(success) {
            $scope.rrc_id = success.id;
            $scope.rrc_images = success.rrc_images;
            $(".datatable-loader").removeClass(progressLoader());
            ngDialog.open({
                template: 'rrcimages',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
          });
        }
        $scope.openChangeRequestType = function (rid,order_id) {
          $scope.rrc = {};
          $scope.rrc.id = rid;
          $scope.rrc.order = order_id;
          ngDialog.open({
              template: 'change-request-type',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
          });
        }
        vm.submitChangeRequestType = function () {
          console.log($scope.rrc);
          if(!$scope.rrc.request_type){
            vm.errortoaster = {
                type:  'error',
                title: 'Request Type',
                text:  'Please select Request Type.'
            };   
            toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            return;
          }
          if($scope.rrc.request_type == 'return' && !$scope.rrc.return_type){
            vm.errortoaster = {
                type:  'error',
                title: 'Return Type',
                text:  'Please select Return Type.'
            };   
            toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            return;
          }
          $(".modelform-rrc").addClass(progressLoader());
          if($scope.rrc.request_type != 'return'){
            $scope.rrc.return_type = "";
          }
          RRC.patch({'id': $scope.rrc.id, 'request_type': $scope.rrc.request_type, 'return_type': $scope.rrc.return_type, 'order': $scope.rrc.order}, function(success){
              vm.successtoaster = {
                          type:  'success',
                          title: 'Success',
                          text:  'Request type changed successfully.'
                      };
              toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
              $scope.reloadData();
              ngDialog.close();
              $(".modelform-rrc").removeClass(progressLoader());
          });
        }
        $scope.DoRRCAction = function(rid,user_action,order_id){

          $scope.rrcrequest_id = rid;
          $scope.user_action = "approved";
          $scope.order_id = order_id;
          $scope.rrcrequest_type = vm.selectedFullJson[rid][3];
          if ($scope.rrcrequest_type != 'replacement') {
            $scope.rrcrequest_type = 'return'
          }

          if (user_action == 1) {
            $scope.user_action = "rejected";
          }
            ngDialog.open({
                template: 'confirmation-dialog-rrc-reject-approve',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        }

        $scope.SubmitRrcAction = function(){
          $(".reject-dialog").addClass(progressLoader());
          var action_text = 'Rrc request rejected successfully.'
          if ($scope.user_action == 'approved') {
            action_text = 'Rrc request approved successfully.'
          }
              RRC.patch({'id': $scope.rrcrequest_id,'request_type': $scope.rrcrequest_type,'order': $scope.order_id, 'request_status': $scope.user_action }, function(success){
                  vm.successtoaster = {
                              type:  'success',
                              title: 'Success',
                              text:  action_text
                          };
                  toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  $scope.reloadData();
                  ngDialog.close();
                  $(".reject-dialog").removeClass(progressLoader());
              });
        }



        /*$scope.OpenCompanyDetail = function () {
            ngDialog.open({
                template: 'companydetails',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };*/



        /* function SupplierDetail(data, type, full, meta){
          return '<div class="col-md-6"><a ng-click="OpenCompany('+full[1]['selling_company_id']+')">'+full[6]+'</a></div>';
        }  */


        vm.datatables_url = 'api/rrcdatatables/';

        vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: vm.datatables_url,
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
                            2 : { "type" : "text"},
                            3 : { "type" : "select", values:[{"value":"return","label":"return(customer return)"},{"value":"rto","label":"return(rto)"}, {"value":"replacement","label":"replacement"}, {"value":"cancellation","label":"cancellation"}]},
                            5 : { "type" : "text"},
                            6 : { "type" : "select", selected:$stateParams.processing_status, values:[{"value":"Cart","label":"Cart"}, {"value":"Draft","label":"Draft"}, {"value":"Pending","label":"Pending"}, {"value":"COD Verification Pending","label":"COD Verification Pending"}]},
                            11 : { "type" : "select", values:[{"value":"requested","label":"requested"}, {"value":"approved","label":"approved"}, {"value":"rejected","label":"rejected"}, {"value":"return scheduled","label":"return scheduled"}, {"value":"return received","label":"return received"}, {"value":"request cancelled","label":"request cancelled"}]},

                        })

					  .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
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
                          //'copy',
                          //'print',
                          //'excel',
                          //'csv',
							{
								extend: 'copy',
								title: 'Orders',
								exportOptions: {
									columns: "thead th:not(.noExport)"
								}
							},{
								extend: 'print',
								title: 'Orders',
								exportOptions: {
									columns: "thead th:not(.noExport)"
								}
							},{
								extend: 'pdf',
								title: 'Orders',
								exportOptions: {
									columns: "thead th:not(.noExport)"
								}
							},{
								extend: 'excel',
								title: 'Orders',
								exportOptions: {
									columns: "thead th:not(.noExport)"
								}
							}, {
								extend: 'csv',
								title: 'Orders',
								exportOptions: {
									columns: "thead th:not(.noExport)"
									//columns: ':visible'
								}
							},

              ]);
//'id','id','request_type','order_id', 'order__processing_status', 'items','request_reason__display','request_reason_text','request_status'
                      vm.dtColumnDefs = [
                            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable().withClass('noExport')
                            .renderWith(function(data, type, full, meta) {
                              vm.selected[full[0]] = false;
                              vm.selectedFullJson[full[0]] = full;
                              return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                            }),
                            DTColumnDefBuilder.newColumnDef(1).withTitle('json').notVisible(),
                            DTColumnDefBuilder.newColumnDef(2).withTitle('ID'),
                            DTColumnDefBuilder.newColumnDef(3).withTitle('Request Type'),
                            DTColumnDefBuilder.newColumnDef(4).withTitle('Created Date'),
                            DTColumnDefBuilder.newColumnDef(5).withTitle('Order ID.'),
                            DTColumnDefBuilder.newColumnDef(6).withTitle('Processing Status'),//.renderWith(filterDate),
                            DTColumnDefBuilder.newColumnDef(7).withTitle('Delivered Date'),
                            DTColumnDefBuilder.newColumnDef(8).withTitle('Items').notSortable().withOption('sWidth','20%'),
                            DTColumnDefBuilder.newColumnDef(9).withTitle('Reason Display'),
                            DTColumnDefBuilder.newColumnDef(10).withTitle('Reason Text').notSortable().withOption('sWidth','30%'),
                            DTColumnDefBuilder.newColumnDef(11).withTitle('Request Status'),
                            DTColumnDefBuilder.newColumnDef(12).withTitle('Actions').notSortable().withClass('noExport')//.withOption('width', '25%')
                              .renderWith(function(data, type, full, meta) {
                                  var htmlbutton = '';
                                  if(full[11] == 'requested' && (full[3].indexOf('return') != -1 || full[3] == 'replacement')){
                                    htmlbutton += '<div><button type="button" ng-click="DoRRCAction('+full[0]+','+ 1 +','+ full[5] +')" class="btn btn-block btn-danger mt-lg">Reject</button></div>';
                                    htmlbutton += '<div><button type="button" ng-click="DoRRCAction('+full[0]+','+ 2 +','+ full[5] +')" class="btn btn-block btn-primary mt-lg">Approve</button></div>';
                                  }
                                  htmlbutton += '<div><button type="button" ng-click="ViewRRCImages('+full[0]+')" class="btn btn-block btn-primary mt-lg">View Images</button></div>';
                                  if(full[11] == 'requested'){
                                    htmlbutton += '<div><button type="button" ng-click="openChangeRequestType('+full[0] + ','+ full[5] +')" class="btn btn-block btn-primary mt-lg">Change Request Type</button></div>';
                                  }
                                  return htmlbutton;
                          }),

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
