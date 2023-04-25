/*start - form wizard */
(function() {
    'use strict';
    angular
        .module('app.marketing')
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
        .module('app.marketing')
        .controller('MarketingController', MarketingController);

    MarketingController.$inject = ['$resource', '$http','$httpParamSerializer', 'toaster', 'ngDialog', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', 'State', 'City', 'Marketing', 'Category'];
    function MarketingController($resource, $http, $httpParamSerializer, toaster, ngDialog, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state,  $filter, State, City, Marketing, Category) {
        CheckAuthenticated.check();
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
        var vm = this;

        vm.OpenDialog = function () {
            ngDialog.open({
                template: 'marketing_form',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        vm.CloseDialog = function() {
            ngDialog.close();
        };

        $scope.file = null;
        $scope.uploadFiles = function (files) {
            $scope.file = files;
            //console.log($scope.file);
            //dest.specific_no_file = files;
            //console.log(dest.specific_no_file);
        };

        vm.marketing = {};
        vm.form_action = "";
        vm.OpenMarketing = function (){
            vm.form_action = "Add";
            $scope.file = null;
            vm.marketing = {};
            $scope.total_receiver = {}
            vm.marketing.company_number_type_all = true;

            $scope.states = State.query();
            $scope.GetCity =  function(state) {
                //alert(state);
                vm.marketing.city = [];
                var state = state.toString()
                if(state != "")
					state = state + ",38"
                $scope.cities = City.query({ state: state });
            }

            $scope.categories = Category.query({parent: 10})
            vm.OpenDialog();
        }


        vm.UpdateMarketing = function (){
            vm.form_action = "Update";
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })

            if(true_count == 1)
            {
                $scope.file = null;
                vm.marketing = {};
                $scope.total_receiver = {}
                vm.marketing.company_number_type_all = true;

                $scope.states = State.query();
                $scope.GetCity =  function(state) {
                    //alert(state);
                    vm.marketing.city = [];
                    var state = state.toString()
                    if(state != "")
						state = state + ",38"
                    $scope.cities = City.query({ state: state });
                }

                $scope.categories = Category.query({parent: 10})


                Marketing.get({'id': vm.true_key}).$promise.then(function(result){

                  console.log(result);
                    vm.marketing.campaign_name = result.campaign_name;
                    vm.marketing.campaign_text = result.campaign_text;
                    vm.marketing.campaign_html = result.campaign_html;
                    vm.marketing.to = result.to;
                    vm.marketing.state = result.state;
                    vm.marketing.city = result.city;
                    vm.marketing.categories = result.categories
                    vm.marketing.minimum_category_views = parseInt(result.minimum_category_views)
                    //vm.marketing.specific_numbers_csv = result.specific_numbers_csv;
                    vm.marketing.company_number_type_all = true;
                    vm.marketing.company_number_type_retailers = result.company_number_type_retailers;
                    vm.marketing.company_number_type_wholesalers_agents = result.company_number_type_wholesalers_agents;
                    vm.marketing.company_number_type_manufactures = result.company_number_type_manufactures;
                    vm.marketing.company_number_type_online_retailer_reseller = result.company_number_type_online_retailer_reseller;
                    vm.marketing.company_number_type_broker = result.company_number_type_broker;
                    vm.marketing.company_number_type_guestusers = result.company_number_type_guestusers;
                    vm.marketing.company_number_type_inphonebook = result.company_number_type_inphonebook;

                    vm.marketing.by_sms = result.by_sms;
                    vm.marketing.by_flash_sms = result.by_flash_sms;
                    vm.marketing.login_url_in_sms = result.login_url_in_sms
                    vm.marketing.by_in_app_notifications = result.by_in_app_notifications;

                    //vm.marketing.image = result.image;

                    vm.marketing.pk_id = result.id;

                    if(result.app_version != null)
                        vm.marketing.app_version = result.app_version;
                    if(result.last_login_platform != null)
                        vm.marketing.last_login_platform = result.last_login_platform;
                    if(result.deep_link != null)
                        vm.marketing.deep_link = result.deep_link;
                    if(result.test_users != null)
                        vm.marketing.test_users_ids = result.test_users.join(",");


                    if(vm.marketing.state.length > 0){
                        City.query({state:vm.marketing.state.join(",")}).$promise.then(function(success){
                            $scope.cities = success;
                            vm.OpenDialog();
                        });
                    }else{
                        vm.OpenDialog();
                    }

                });
            }
            else
            {
                vm.errortoaster = {
                    type:  'error',
                    title: 'Failed',
                    text:  'Please select one row'
                };
                console.log(vm.errortoaster);
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }
        }

        vm.SelectAllCity = function() {
            var cityarr = [];

			for(var i = 0; i < $scope.cities.length; i++) {
				cityarr.push($scope.cities[i].id)
			}

			vm.marketing.city = cityarr;
        };

        $scope.total_receiver = {}

        vm.SubmitMarketing= function(action_for="save") {
            if(vm.marketingForm.$valid) {
                $(".modelform").addClass(progressLoader());

                var jsondata = vm.marketing;

                if($scope.file != null){
                    jsondata['specific_no_file'] = $scope.file[0];
                }

                if(jsondata['image'] == null){
                    delete jsondata['image'];
                }

                /*if(vm.marketing['test_users'] == ""){
                    //delete vm.marketing['test_users'];
                    vm.marketing['test_users'] = [];
                }*/
                if(jsondata['minimum_category_views'] == null)
                {
                  jsondata['minimum_category_views'] = 0
                }

                if(vm.marketing['test_users_ids'] != "" && vm.marketing['test_users_ids'] != null){
                    jsondata['test_users'] = [vm.marketing['test_users_ids']];
                }
                else{
                    jsondata['test_users'] = [];
                }


                if(action_for=="save"){
                    if(vm.form_action == "Add"){

                        console.log("Add")
                        console.log(jsondata)

                        Marketing.save(jsondata,
                        function(success){
                            $(".modelform").removeClass(progressLoader());
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Marketing started successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            $scope.reloadData();
                            vm.CloseDialog();

                        });
                    }
                    else if(vm.form_action == "Update"){
                        jsondata["id"] = vm.marketing.pk_id;

                        console.log("Update")
                        console.log(jsondata)

                        Marketing.patch(jsondata,
                        function(success){
                            $(".modelform").removeClass(progressLoader());
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Marketing started successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            $scope.reloadData();
                            vm.CloseDialog();

                        });
                    }
                }else if(action_for=="csvdownload"){
					$http.post('/api/v1/marketing-csv/',jsondata).then(
					function(response){
						$(".modelform").removeClass(progressLoader());
						console.log(response);
						var headers = response.headers();
						//alert(headers['content-type']);


						if(headers['content-type'] == "text/csv"){
							var hiddenElement = document.createElement('a');
							hiddenElement.href = 'data:attachment/csv,' + encodeURI(response.data);
							hiddenElement.target = '_blank';
							hiddenElement.download = 'order.csv';
							hiddenElement.click();
						  }
						  $scope.reloadData();
					});
					
				}else{ //action_for==count
                    //var jsondata = vm.marketing;
                    jsondata["sub_resource"] = "total_receiver";

                    //vm.marketing.pk_id

                    /*if(jsondata.hasOwnProperty('pk_id')){
                        delete jsondata["id"]
                    }
                    if(jsondata.hasOwnProperty('test_users')){
                        jsondata["test_users"] = jsondata["test_users"].join(",")
                    }*/

                    console.log("count")
                    console.log(jsondata)

                    Marketing.save(jsondata,
                    function(success){
                        $(".modelform").removeClass(progressLoader());
                        //alert(success);
                        $scope.total_receiver = success;
                        $scope.total_receiver.show = true;

                    });
                    delete jsondata["sub_resource"];

                }

            }
            else
            {
                vm.marketingForm.campaign_name.$dirty = true;
                vm.marketingForm.campaign_text.$dirty = true;
                vm.marketingForm.campaign_html.$dirty = true;
                vm.marketingForm.to.$dirty = true;
                vm.marketingForm.specific_numbers_csv.$dirty = true;
                //vm.marketingForm.state.$dirty = true;
            }
        }


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
          return '<a target="_blank" href="#/app/companies-buyer-supplier/'+full[0]+'">'+full[1]+'</a>';
        }

      vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: 'api/marketingdatatables/',
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
                          1 : { "type" : "dateRange"},
                          2 : { "type" : "text"},
                          3 : { "type" : "text"},
                          4 : { "type" : "text"},

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
                            text: 'Add Campaign',
                            key: '1',
                            className: 'green',
                            action: function (e, dt, node, config) {
                                vm.OpenMarketing();
                            }
                          },
                          {
                              text: 'Update Campaign',
                              key: '1',
                              className: 'green',
                              action: function (e, dt, node, config) {
                                  vm.UpdateMarketing();
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
                          DTColumnDefBuilder.newColumnDef(1).withTitle('Created At'),
                          DTColumnDefBuilder.newColumnDef(2).withTitle('Name'),
                          DTColumnDefBuilder.newColumnDef(3).withTitle('To'),
                          DTColumnDefBuilder.newColumnDef(4).withTitle('Created By'),
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
