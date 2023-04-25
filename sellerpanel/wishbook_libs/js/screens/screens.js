/*start - form wizard */
(function() {
    'use strict';
    angular
        .module('app.screens')
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
        .module('app.screens')
        .controller('ScreensController', ScreensController);

    ScreensController.$inject = ['$http', '$resource', 'v2CategoryEavAttribute', 'EnumGroup', '$stateParams', 'Brand', 'Catalog', 'v2Products','v2ProductsPhotos', 'CatalogUploadOptions', 'Product', 'v2Category', 'Company', 'BuyerList', 'SalesOrders', 'toaster', 'ngDialog', '$scope', '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', 'Upload', '$filter', '$cookies', '$localStorage', 'SweetAlert', 'sharedProperties'];
    function ScreensController($http, $resource, v2CategoryEavAttribute, EnumGroup, $stateParams, Brand, Catalog, v2Products, v2ProductsPhotos, CatalogUploadOptions, Product, v2Category, Company, BuyerList, SalesOrders, toaster, ngDialog, $scope, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, Upload, $filter, $cookies, $localStorage, SweetAlert, sharedProperties) {
        CheckAuthenticated.check();        
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
        var vm = this;
        $scope.cataloguploadoptions_isadded = true;


        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
       /* $scope.flag_retailer = localStorage.getItem("flag_retailer");
        if($scope.flag_retailer == "true"){
            $state.go('app.browse');
        }  */

        vm.selected = {};
        vm.selectedFullJson = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        $scope.update_flag = false;
        $scope.updateUI_called = false;
        
        $scope.alrt = function () {alert("called");};

        
        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
        
        $scope.reloadData  = function () {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);

            UpdateCheckBoxUIfilters();
        }

        function callback(json) {
            console.log(json);
            if(json.recordsTotal > 0 && json.data.length == 0){
                //vm.dtInstance.rerender();
                $state.go($state.current, {}, {reload: true});
            }
        }
        $scope.ProductsImages = function () {
            ngDialog.open({
                template: 'productimages',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        $scope.OpenProductsImages = function(id,prod_count){
            $(".modelform3").addClass(progressLoader()); 
            $scope.catid = id;
            $scope.prod_count = prod_count;
            if(prod_count == 0)
            {
                $scope.OpenNoProductsAlert();
            }
            else
            {
               /*Catalog.get({"id":id, "cid":$scope.company_id},
                function (result){
                    $scope.catalogdata = result;
                    Catalog.get({"id":id, "expand":"true", "cid":$scope.company_id},
                    function (success){
                        $(".modelform3").removeClass(progressLoader());
                        openPhotoSwipe($scope.catalogdata,success); 
                    });
                });*/
                v2Products.get({"id":id, "expand":"true", "cid":$scope.company_id},
                function (success){
                    $(".modelform3").removeClass(progressLoader());
                    if(success.photos.length  > 0){
                      openPhotoSwipe(success,success,'set'); 
                    }
                    else
                    {
                      $scope.OpenNoProductsAlert();
                    }
                });
            }
        }
        

 
        
        function imageHtml(data, type, full, meta){
            if (!$scope.updateUI_called) {
                console.log('chekboxcall');
                UpdateCheckBoxUI();
                $('.contextAction ').css('display', 'none');
                $('.singlecontextAction').css('display', 'none');
                $('.buttons-print').addClass("nocontextAction");
                $scope.updateUI_called = true;
            }

            if (full[9] <=  1)
            {
                return '<div style="text-align: center;"><a ng-click="OpenProductsImages(' + full[0] + ',' + full[9] + ')" class="hvr-grow"><img class="loading" src="' + full[4] + '" /></a></div>';
            }
            else if (full[9] == 2)
            {
                return '<div style="text-align: center;"><a ng-click="OpenProductsImages(' + full[0] + ',' + full[9] + ')"  class="hvr-grow"><img class="loading multiple2" src="' + full[4] + '" /></a></div>';
            }
            else if (full[9] == 3) {
                return '<div style="text-align: center;"><a ng-click="OpenProductsImages(' + full[0] + ',' + full[9] + ')"  class="hvr-grow"><img class="loading multiple3" src="' + full[4] + '" /></a></div>';
            }
            else
            {
                return '<div style="text-align: center;"><a ng-click="OpenProductsImages(' + full[0] + ',' + full[9] + ')"  class="hvr-grow"><img class="loading multiplemorethan3" src="' + full[4] + '" /></a></div>';
            }
            
            
        }
        $scope.OpenNoProductsAlert = function() {
           vm.errortoaster = {
                        type:  'error',
                        title: 'Empty Catalog',
                        text:  'This catalog has no products.'
                    };
                    
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
        }
        
        function setMatchingTitleLink(data, type, full, meta) {
            if (full[9] == 0) {
                return '<a ng-click="OpenNoProductsAlert()">' + full[3] + '</a>';
            }
            else {
                return '<a href="#/app/setmatchingdetails/?type=mycatalog&id=' + full[1]['catalog_id'] + '&name=' + full[3] + '">' + full[3] + '</a>';
            }
        }

        function setDetailsTitleLink(data, type, full, meta){
            if (full[9] == 0) {
                return '<a ng-click="OpenNoProductsAlert()">' + full[2] + '</a>';
            }
            else {
                return '<a href="#/app/product/?type=mycatalog&id=' + full[0] + '&name=' + full[2] + ' from ' + full[3] + '">' + full[2] + '</a>';
            }
        }
        
        $scope.openConfirm = function ()
        {
           
            ngDialog.openConfirm({
              template: 'addcatalog',
              scope: $scope,
              className: 'ngdialog-theme-default',
              closeByDocument: false
            })
          };
          
          
          function creatingData(node, tempArr)
          {
            
                  var temp = {};
                  var length;
                  temp.id = node.id;
                  //alert(tempArr);
                  if(tempArr != null)
                  {
                    if(tempArr.indexOf(node.id) != -1)
                    {
                      //console.log(tempArr);
                      temp.state = {};
                      //temp.state.selected = true;
                      temp.state.checked = true;
                      temp.state.opened = false;
                    }
                  } 
                  temp.text = node.category_name;
                  if(node.child_category != null)
                  {
                    temp.children =[];
                    length = node.child_category.length;
                    for(var i=0;i<length;i++)
                    {
                      var child = creatingData(node.child_category[i], tempArr);
                      temp.children.push(child);
                    }
                  }
               //   alert(JSON.stringify(temp));
                  return temp;
            
          }
          
          
      function categoryTree(tempArr){
         
                $scope.data = [];
               for(var i=0; i<$scope.categories.length; i++)
                {
                  var temp = {};
                  temp = creatingData($scope.categories[i],tempArr);
                  $scope.data.push(temp);
                }

           //     alert(JSON.stringify($scope.data));
                vm.treeData = $scope.data;

                vm.treeConfig = {
                    core : {
                        multiple : false,
                        animation: true,
                        error : function(error) {
                            console.log('treeCtrl: error from js tree - ' + angular.toJson(error));
                        },
                        check_callback : true,
                        worker : true,
                    },
                    rule: {
                        multiple: false
                    },
                    version : 1,
                    
                    plugins : ['checkbox'],//'wholerow','types',
                    checkbox: {
                                tie_selection: false,
                                multiple : false,
                                //keep_selected_style: false
                              }

                };     
          }

          $scope.OpenCatalogForm = function(tempArr)
          {
              $scope.brands = Brand.query({cid:$scope.company_id, type:"my", sub_resource:"dropdown"});
            
              $scope.topcategories = v2Category.query({parent: 1});
              //$scope.catalog.topcategory = 4;
              $scope.catalog.topcategory = 10;
              //  $scope.categories = v2Category.query({parent: 5});  
              v2CategoryEavAttribute.query(function(success){
                $scope.all_category_eav_data = success;
                $scope.TopCategoryChanged(10);
              });
              $scope.photoshoot_types = [{"id":1, "photoshoot_type": "Live Model Photoshoot"}, {"id":2, "photoshoot_type": "White Background or Face-cut"}, {"id":3, "photoshoot_type": "Photos without Model"},]
              sharedProperties.setType('create');
              $scope.openConfirm();
          };
          
          $scope.TopCategoryChanged = function(pid){
            $scope.categories = v2Category.query({parent: pid});
            v2Category.query({parent: pid},function(success){
               
              console.log($scope.categories);
              $scope.new_categories_with_set_type = success;
              //$scope.new_categories_with_set_type = success.toString();

              console.log($scope.new_categories_with_set_type);
              console.log($scope.new_categories_with_set_type.length);
              for(var i = 0; i < $scope.new_categories_with_set_type.length; i++){
                  var set_type = " (color set)";
                 
                  for (var j = 0; j < $scope.all_category_eav_data.length; j++) {
                      if($scope.all_category_eav_data[j].attribute_slug == "size" && $scope.all_category_eav_data[j].category == $scope.new_categories_with_set_type[i].id)
                      {
                        set_type = " (size set)";
                      }
                  }
                  $scope.new_categories_with_set_type[i].category_name = $scope.new_categories_with_set_type[i].category_name + set_type;
                  console.log($scope.new_categories_with_set_type[i]);
              }
              console.log($scope.categories);
            }); 
           
          }


     
        
        //createorder start
        vm.CloseDialog = function() {
            ngDialog.close();
        };
        
        vm.order_type = null
        vm.buyers = null
        vm.agents = null
        vm.full_catalog_orders_only = null
        vm.order = {}
        vm.order.products = []
        
    
        
        
        vm.changeQty = function(qty){
            if (vm.full_catalog_orders_only == true){
                for(var i=0; i<(vm.order.products.length); i++){
                    var product = vm.order.products[i];
                    product.quantity = qty;
                }
            }
        }
        
       
        
      
        vm.DisableCatalog = function (){
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })
            
            if(true_count > 0)
            {
                
                angular.forEach(vm.selected, function(value, key) {
                    if(value==true){
                        $(".modelform3").addClass(progressLoader());
                        v2Products.save({'id': key, 'cid':$scope.company_id, "sub_resource":"disable"}).$promise.then(function(result){
                            $(".modelform3").removeClass(progressLoader());
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Catalog has been disabled.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            $scope.reloadData();
                        });
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
                
                //toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                console.log(vm.errortoaster);

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


        $scope.OpenEnableCatalogPopup = function () {
            ngDialog.openConfirm({
                template: 'openenablemodal',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            })
        };

        
        
        vm.OpenEnableCatalog = function ()
        {
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })
            if(true_count > 0)
            {
                vm.enable_duration = 30;
                $scope.OpenEnableCatalogPopup();
            }
            else
            {
                vm.errortoaster = {
                    type:  'error',
                    title: 'Failed',
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

        vm.EnableCatalog = function ()
        {
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key)
            {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })
            
            var today = new Date(); 
            var expiry_date = today.setDate(today.getDate() + vm.enable_duration);
            // console.log(today);
            expiry_date = formatDate(expiry_date) + "T23:59:59Z"
            console.log(vm.enable_duration);
            console.log(expiry_date);
            
            if(true_count > 0)
            {
                
                angular.forEach(vm.selected, function(value, key) {
                    if(value==true){
                        console.log(key);
                        $(".modelform3").addClass(progressLoader());
                        v2Products.save({'id': key, 'cid':$scope.company_id, 'sub_resource':"enable", 'expire_date': expiry_date }).$promise.then(function(result){
                            $(".modelform3").removeClass(progressLoader());
                            vm.successtoaster = {
                                type:  'success',
                                title: 'Success',
                                text:  'Catalog has been enabled.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            $scope.reloadData();
                            ngDialog.close();
                        });
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


        $scope.OpenShareDialog = function () {
            ngDialog.open({
                template: 'share',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

       
        

        $scope.OpenAddsetForm = function (tempArr)
        {
            
            var true_count = 0;
            angular.forEach(vm.selected, function (value, key)
            {
                if (value == true) {
                    true_count++;
                    vm.true_key = key;
                    console.log(key);
                    //$scope.catalogId = key;
                }
            })

            if(true_count == 1)
            {
                if (vm.selectedFullJson[vm.true_key][1]["catalog_type"] == "catalogseller")
                {
                    toaster.pop("error", "Failed", "Can not update a catalog that you are a seller");
                }
                else
                {
                    console.log('Addset to screen called');
                    sharedProperties.setType('update2');
                    
                    $scope.catalogId = vm.selectedFullJson[vm.true_key][1]["catalog_id"]; //set gets added to that specific catalog

                    $scope.setId = vm.true_key;
                    console.log($scope.setId);


                    v2Products.get({ 'id': $scope.setId }, function (response_set)
                    {
                        console.log(response_set);

                        $scope.catalog.multi_set_type = response_set.multi_set_type;
                        console.log($scope.catalogId + ',' + $scope.catalog.multi_set_type);
                        ngDialog.openConfirm({
                            template: 'AddUpdateSetdialog',
                            scope: $scope,
                            className: 'ngdialog-theme-default',
                            closeByDocument: false
                        })
                    });
                }
            }
            else
            {
                console.log('please select one row');
                //toaster.pop('error', 'Failed', 'Please select one row');

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


        

        $scope.openEditSetForm = function ()
        {
            var true_count = 0;
            angular.forEach(vm.selected, function (value, key)
            {
                if (value == true) {
                    true_count++;
                    vm.true_key = key;
                }
            })

            if(true_count == 1)
            {
                if (vm.selectedFullJson[vm.true_key][1]["catalog_type"] == "catalogseller") {
                    toaster.pop("error", "Failed", "Can not update a catalog that you are not a seller");
                }
                else
                {
                    console.log('Edit set called');
                    sharedProperties.setType('update1');
                    $scope.setId = vm.true_key;
                    console.log($scope.setId);
                    $scope.catalog_id = vm.selectedFullJson[vm.true_key][1]["catalog_id"];
                    console.log($scope.catalog_id);
                    


                    v2Products.get({ 'id': $scope.setId}, function (response_set)
                    {
                        console.log(response_set);
                        //$scope.productId = response_set.id;
                        $scope.catalog.multi_set_type = response_set.multi_set_type;

                        

                        var today = new Date();
                        var expiryDate = new Date(response_set.expiry_date);
                        var diffInSeconds = (expiryDate.getTime()/1000) - (today.getTime()/1000);
                        var enable_duration = Math.floor(diffInSeconds/86400);

                        console.log(enable_duration);


                        localStorage.setItem('setTobeAdded2', JSON.stringify([{ 'title': response_set.title, 'enable_duration': enable_duration, 'products': response_set.photos }]));


                        ngDialog.openConfirm({
                            template: 'AddUpdateSetdialog',
                            scope: $scope,
                            className: 'ngdialog-theme-default',
                            closeByDocument: false
                        });

                        
                    });
                    

                }
            }
            else
            { 
                console.log('please select one row');
                //toaster.pop('error', 'Failed', 'Please select one row'); 

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
        vm.TableButtons = [
                        {
                            text: 'Set Matchings',
                            key: '1',
                            className: 'tableHeading', 
                        },
                
                        'print', 
                        {
                            text: 'Reset Filter',
                            key: '1',
                            className: 'buttonSecondary nocontextAction',
                            action: function (e, dt, node, config) {
                            //$('table thead tr:eq(1) :input').val('').trigger('change'); // Don't forget to trigger
                            //$('#catalog-datatables').DataTable().ajax.reload();
                            localStorage.removeItem('DataTables_' + 'catalogs-datatables');
                            $state.go($state.current, {}, {reload: true});
                            }
                        },
                        {
                            text: 'Add Quality',
                            key: '1',
                            className: 'buttonPrimary nocontextAction',
                            action: function (e, dt, node, config) {
                                $scope.catalogId = null;
                                $scope.catalog = {};
                                $scope.catalog.enable_duration = 30;
                                $scope.catalog.is_percentage = true;
                                $scope.catalog.single_piece_price_percentage = 0;
                                $scope.catalog.single_piece_price = 0;
                                $scope.catalog.view_permission = 'public';
                                $scope.catalog.catalog_type = 'setmatching';
                                $scope.dt = new Date();
                                //$scope.catalog.dispatch_date = formatDate($scope.dt);

                                //$scope.category = {};
                                var tempArr = [];
                                $scope.update_flag = false;
                                $scope.products = [];
                                $scope.OpenCatalogForm(tempArr);

                            }
                        },

                        {
                            text: 'Enable ',
                            key: '1',
                            className: 'buttonSecondary contextAction',
                            action: function (e, dt, node, config) {
                                // alert(JSON.stringify(vm.selected));
                                vm.OpenEnableCatalog();
                            }
                        },
                        {
                            text: 'Disable',
                            key: '1',
                            className: 'buttonSecondary contextAction',
                            action: function (e, dt, node, config) {
                                // alert(JSON.stringify(vm.selected));
                                vm.DisableCatalog();
                            }
                        },
                        {
                            text: 'Add set',
                            key: '1',
                            className: 'buttonPrimary singlecontextAction',
                            action: function (e, dt, node, config) {

                                vm.catalog = {};
                                vm.catalog.dont_allow_crop = false;
                                vm.catalog.cropallow = !vm.catalog.dont_allow_crop;

                                $scope.catalogId = null;
                                $scope.catalog = {};
                                $scope.catalog.enable_duration = 30;

                                $scope.catalog.view_permission = 'public';
                                $scope.catalog.catalog_type = 'setmatching';
                                $scope.dt = new Date();

                                //vm.catalog.sell_full_catalog = false;
                                $scope.update_flag = false;
                                $scope.products = [];
                                $scope.OpenAddsetForm();
                            }
                        },
                        {
                            text: 'Edit set',
                            key: '1',
                            className: 'buttonPrimary singlecontextAction',
                            action: function (e, dt, node, config) {

                                vm.catalog = {};
                                vm.catalog.dont_allow_crop = false;
                                vm.catalog.cropallow = !vm.catalog.dont_allow_crop;

                                $scope.catalogId = null;
                                $scope.catalog = {};
                                $scope.catalog.enable_duration = 30;
                                $scope.catalog.is_percentage = true;
                                $scope.catalog.single_piece_price_percentage = 0;
                                $scope.catalog.single_piece_price = 0;
                                $scope.catalog.view_permission = 'public';
                                $scope.catalog.catalog_type = 'setmatching';
                                $scope.dt = new Date();


                                $scope.update_flag = true;
                                $scope.products = [];
                                $scope.openEditSetForm();
                            }
                        }
                        //  'print',
                         
                          
                      ];
                  $scope.flag_is_staff = localStorage.getItem("is_staff");
                  if($scope.flag_is_staff == "true"){
                      vm.TableButtons.splice(0,1);
                  }
                  vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: 'api/catalogscreensdatatables/',
                          type: 'GET',
                      })
                      .withDOM('rtipl')
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
                          3 : { "type" : "text"},
                          5 : { "type" : "text"},
                          6 : { "type" : "text"},
                          7 : { "type": "select", selected: $stateParams.status, values:[{"value":"Enable","label":"Enable"}, {"value":"Disable","label":"Disable"}]},
                          8 : { "type" : "dateRange", width: '100%'},
                      })
                      
                      .withOption('processing', true)
                      .withOption('serverSide', true)
                      //.withOption('stateLoadParams', false)
                      //.withOption('stateSaveParams', false)
                      .withOption('stateSave', true)
                      .withOption('stateSaveCallback', function(settings, data) {
                          //console.log(JSON.stringify(settings));
                          data = datatablesStateSaveCallback(data);
                          localStorage.setItem('DataTables_' + 'screens', JSON.stringify(data));
                      })
                      .withOption('stateLoadCallback', function(settings) {
                         return JSON.parse(localStorage.getItem('DataTables_' + 'screens' ))
                      })
                    
                      .withOption('iDisplayLength', 10)
                      //.withOption('responsive', true)
                      .withOption('scrollX', true)
                     // .withOption('scrollY', '55vh')
                      .withOption('scrollY', getDataTableHeight())
                      //.withOption('scrollCollapse', true)
                      .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
                      
                      .withPaginationType('full_numbers')
                      
                      
                      .withButtons(vm.TableButtons);
                          
                      vm.dtColumnDefs = [
                            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
                            .renderWith(function(data, type, full, meta) {
                                vm.selected[full[0]] = false;
                                vm.selectedFullJson[full[0]] = full;
                                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                            }),
                            DTColumnDefBuilder.newColumnDef(1).withTitle('json').notVisible(),
                            DTColumnDefBuilder.newColumnDef(2).withTitle('Title'),
                            DTColumnDefBuilder.newColumnDef(3).withTitle('Quality').renderWith(setMatchingTitleLink),
                            DTColumnDefBuilder.newColumnDef(4).withTitle('Image').renderWith(imageHtml).notSortable(),
                            DTColumnDefBuilder.newColumnDef(5).withTitle('Brand'),//.renderWith(BrandTitleLink),
                            DTColumnDefBuilder.newColumnDef(6).withTitle('Category').notSortable(),
                            DTColumnDefBuilder.newColumnDef(7).withTitle('Status').notSortable(),
                            DTColumnDefBuilder.newColumnDef(8).withTitle('Expiry Date'),
                            DTColumnDefBuilder.newColumnDef(9).withTitle('Pcs/set').notSortable().withOption('sWidth','5%'),
                            // DTColumnDefBuilder.newColumnDef(10).withTitle('Views').notSortable().notVisible()
                          
                      ];

        function toggleAll (selectAll, selectedItems)
        {

            if (selectAll) {
                $('.contextAction').css('display', 'block');
                $('.nocontextAction').css('display', 'none');
                $('.singlecontextAction').css('display', 'none');
            }
            else {
                $('.contextAction').css('display', 'none');
                $('.nocontextAction').css('display', 'block');
                $('.singlecontextAction').css('display', 'none');
            }

            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    selectedItems[id] = selectAll;
                }
            }
        }
        
        function toggleOne (selectedItems)
        {
            //console.log(selectedItems);
            var ctr = 0;

            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    //console.log(Boolean(selectedItems[id]));
                    if (Boolean(selectedItems[id])) {
                        ctr = ctr + 1;
                    }
                }
            }
            if (ctr > 0) {
                $('.contextAction').css('display', 'block');
            }
            else {
                $('.contextAction').css('display', 'none');
            }

            if (ctr == 1) {
                $('.singlecontextAction').css('display', 'block');
            }
            else {
                $('.singlecontextAction').css('display', 'none');
            }

            if (ctr == 0) {
                $('.nocontextAction').css('display', 'block');
            }
            else {
                $('.nocontextAction').css('display', 'none');
            }

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
                        UpdateCheckBoxUIfilters();
                    });
                }
                var tableheaders = document.getElementsByTagName('th');
                var j = tableheaders.length;
                while (j--) {
                    tableheaders[j].addEventListener("click", function () {
                        UpdateCheckBoxUIfilters();
                    });
                    tableheaders[j].addEventListener("keydown", function () {
                        UpdateCheckBoxUIfilters();
                    });
                }
                console.log('UpdateCheckBoxUI() attached')
                $('.contextAction').css('display','none');
                $('.singlecontextAction').css('display','none');
                $('.nocontextAction').css('display','block');
            }, 2000);
        });
        












        //Methods that are not used
        









        $scope.openUpdateCatalogForm = function () {
            var true_count = 0;
            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {
                    true_count++;
                    vm.true_key = key;
                }
            })

            if (true_count == 1) {
                if (vm.selectedFullJson[vm.true_key][10]["catalog_type"] == "catalogseller") {
                    toaster.pop("error", "Failed", "Can not update a catalog that you are a seller");
                }
                else {
                    console.log('openupdate called');
                    sharedProperties.setType('update');
                    $scope.catalog_id = vm.true_key;
                    ngDialog.openConfirm({
                        template: 'addcatalog',
                        scope: $scope,
                        className: 'ngdialog-theme-default',
                        closeByDocument: false
                    });
                    $scope.brands = Brand.query({ cid: $scope.company_id, type: "my", sub_resource: "dropdown" });
                    EnumGroup.query({ type: "fabric" }).$promise.then(function (success) {
                        $scope.fabrics = success;
                    });

                    EnumGroup.query({ type: "work" }).$promise.then(function (success) {
                        $scope.works = success;
                    });
                    EnumGroup.query({ type: "style" }).$promise.then(function (success) {
                        $scope.styles = success;
                    });
                    /*$scope.categories = Category.query({parent: 10}, //parent: "null"
                      function (success){
                          categoryTree(tempArr);
                          $scope.openConfirm();
                      }
                    );*/
                    $scope.categories = v2Category.query({ parent: 10 });

                    //$rootScope.$broadcast("CallUpdateCatalogForm", {});
                }
            }
            else {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Failed',
                    text: 'Please select one row'
                };
                console.log(vm.errortoaster);
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                //toaster.pop('error', 'Failed', 'Please select one row'); 
            }

        }

        /*$http.get('app/json/orderstatus.json').then(
        function(success){
            $scope.order_statuses = success.data;
        });*/

        $scope.openCreateOrderConfirm = function () {
            ngDialog.openConfirm({
                template: 'createbulkorder',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            })
        };

        vm.CreateOrder = function ()
        {
            if (vm.orderForm.$valid) {
                $(".modelform").addClass(progressLoader());
                vm.items = []
                var itemno = 0;

                for (var i = 0; i < (vm.order.products.length); i++) {
                    var product = vm.order.products[i];

                    if (product.is_select) {
                        if (vm.order_type == 'sales_order') {
                            vm.items[itemno] = { product: product.id, rate: product.selling_price, quantity: product.quantity };
                            itemno++;
                        }
                        else {
                            vm.items[itemno] = { product: product.id, rate: product.final_price, quantity: product.quantity };
                            itemno++;
                        }
                    }
                }

                if (vm.items.length == 0) {
                    $(".modelform").removeClass(progressLoader());

                    vm.errortoaster = {
                        type: 'error',
                        title: 'Failed',
                        text: 'Please select product'
                    };

                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    return
                }

                if (vm.order_type == 'sales_order') {
                    var jsondata = { order_number: vm.order.order_number, company: vm.order.buyer, seller_company: $scope.company_id, cid: $scope.company_id, items: vm.items, customer_status: "Placed", broker_company: vm.order.agent };
                    SalesOrders.save(jsondata,
                        function (success) {
                            $(".modelform").removeClass(progressLoader());

                            vm.successtoaster = {
                                type: 'success',
                                title: 'Success',
                                text: 'Order has been created successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            ngDialog.close();
                            $scope.reloadData();
                        });
                }
                else {
                    var jsondata = { order_number: vm.order.order_number, company: $scope.company_id, seller_company: vm.order.supplier, cid: $scope.company_id, items: vm.items, customer_status: "Placed", broker_company: vm.order.agent };
                    PurchaseOrders.save(jsondata,
                        function (success) {
                            $(".modelform").removeClass(progressLoader());

                            vm.successtoaster = {
                                type: 'success',
                                title: 'Success',
                                text: 'Order has been created successfully.'
                            };
                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                            ngDialog.close();
                            $scope.reloadData();
                        });
                }

            }
            else {
                vm.orderForm.order_number.$dirty = true;
                vm.orderForm.buyer.$dirty = true;

            }
        }
        //createorder end




        vm.DeleteCatalog = function () {
            var true_count = 0;
            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {
                    true_count++;
                    vm.true_key = key;
                }
            })

            if (true_count > 0) {
                SweetAlert.swal({
                    title: 'Are you sure?',
                    text: 'Your will not be able to recover!',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'No, cancel it!',
                    closeOnConfirm: true,
                    closeOnCancel: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        angular.forEach(vm.selected, function (value, key) {
                            if (value == true) {
                                if (vm.selectedFullJson[key][10]["catalog_type"] == "catalogseller") {
                                    toaster.pop("error", "Failed", vm.selectedFullJson[key][1] + " catalog can't be deleted because you are a seller");
                                }
                                else {
                                    $(".modelform3").addClass(progressLoader());
                                    Catalog.delete({ 'id': key, 'cid': $scope.company_id },
                                        function (success) {
                                            $(".modelform3").removeClass(progressLoader());
                                            //$scope.dtInstance.$scope.reloadData();
                                            vm.successtoaster = {
                                                type: 'success',
                                                title: 'Success',
                                                text: 'Catalog deleted successfully.'
                                            };
                                            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                            $scope.reloadData();
                                        });

                                }
                            }
                        });
                        //SweetAlert.swal('Deleted!', 'Selected rows has been deleted.', 'success');   
                    }
                });

            }
            else {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Failed',
                    text: 'Please select one row'
                };

                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }
        }



        $scope.OpenShareCatalog = function ()
        {


            var true_count = 0;

            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {
                    true_count++;
                    $scope.true_key = key;
                    //  $scope.share.catalog = vm.true_key;
                }

            })

            if (true_count == 1) {

                if (vm.selectedFullJson[$scope.true_key][6] == "Enable") {
                    $scope.OpenShareDialog();
                    $scope.share.catalog = parseInt($scope.true_key);
                }
                else {
                    vm.errortoaster = {
                        type: 'error',
                        title: 'Failed',
                        text: 'Disable catalog can not be share.'
                    };
                    console.log(vm.errortoaster);
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                }
            }
            else {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Failed',
                    text: 'Please select one row'
                };
                console.log(vm.errortoaster);
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }
        }

        vm.CsvDialog = function () {
            ngDialog.open({
                template: 'uploadcsv',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        vm.OpenUploadCsv = function () {
            vm.CsvDialog();
        };

        $scope.uploadCSVFiles = function (files) {
            $scope.csv_file = files;
            console.log($scope.file);
        };

        vm.UploadCatalogCsv = function () {
            if (vm.uploadcsv.$valid) {
                $(".modelform3").addClass(progressLoader());
                //  console.log($scope.file);
                Upload.upload({
                    url: 'api/v1/importcsvcatalog/',
                    headers: {
                        'optional-header': 'header-value'
                    },
                    data: { "catalog_csv": $scope.csv_file }
                }).then(function (response) {
                    var headers = response.headers();

                    if (headers['content-type'] == "text/csv") {
                        var hiddenElement = document.createElement('a');

                        hiddenElement.href = 'data:attachment/csv,' + encodeURI(response.data);
                        hiddenElement.target = '_blank';
                        hiddenElement.download = 'catalog_error.csv';
                        hiddenElement.click();

                        vm.successtoaster = {
                            type: 'warning',
                            title: 'Warning',
                            text: 'File uploaded successfully and please fix issues found on catalog_error.csv and reupload'
                        };
                    }
                    else {
                        vm.successtoaster = {
                            type: 'success',
                            title: 'Success',
                            text: 'Job is Scheduled. Please check Jobs table in settings for status.'
                        };
                    }

                    $(".modelform3").removeClass(progressLoader());
                    ngDialog.close();

                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    $scope.reloadData();
                });
            }
            else {
                vm.uploadcsv.catalog_csv.$dirty = true;
            }
        };


        vm.CreateOrderForm = function (order_type) {
            vm.order_type = order_type

            $scope.true_key = [];
            var true_count = 0;
            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {

                    $scope.true_key[true_count] = key;
                    true_count++;
                }
            });

           
            $scope.openCreateOrderConfirm();
        };

        /*vm.removeProduct = function(idx){
            vm.order.products.splice(idx, 1);
        } */


        /*  $scope.getSelectedCategories = function() {

              alert('test');
              var selected_nodes = $scope.treeInstance.jstree(true).get_checked(true);
              console.log(selected_nodes);
          }; */
        //  var selected_nodes = $scope.treeInstance.jstree(true).get_selected();
        // $scope.selected_nodes =   $('#tree_2').jstree('get_bottom_checked');
          
        /*$scope.uploadCatImage = function (files) {
            $scope.files = files;
            console.log($scope.files);
            angular.forEach(files, function(file, key) {
        
                var fr = new FileReader();
                fr.readAsDataURL(file);
                var blob;
                fr.onload = function () {
                
                    var image = new Image();
                    image.src = fr.result;
                            console.log('over sized image '+file.size);
                    var quality =  (1000000/file.size)*100; 
                    // output file format (jpg || png)
                    var output_format = 'jpg';
                    //This function returns an Image Object 
                    var target_img = jic.compress(image,quality,output_format).src;
                    // console.log('compressed');
                    // console.log(target_img);
                    var blob = dataURItoBlob(target_img);
                    console.log(blob);
                    $scope.image = blob;
                    $scope.$apply();
                }
            });

        };*/

        //document.getElementById("sell_full_catalog").checked = true;
        
        
        /*vm.catalog.thumbnail = '';
        vm.croppedDataUrl = '';
        
        var handleFileSelect=function(evt) {
            var file=evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
            $scope.$apply(function($scope){
                vm.catalog.thumbnail=evt.target.result;
            });
            };
            reader.readAsDataURL(file);
        };
        angular.element(document.querySelector('#thumbnail')).on('change',handleFileSelect);*/

          /*       $scope.EmptyCatalogDialog = function () {
            ngDialog.open({
                template: 'emptycatalog',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };


        vm.myInterval = 5000;

        vm.slides = [];
        

        $scope.OpenProductsImages = function(id,prod_count){
          if(prod_count == 0)
          {
            $scope.EmptyCatalogDialog();
          }
          else {
                $(".modelform3").addClass(progressLoader()); 
                ////vm.slides6 = [];
                vm.slides = [];
                Catalog.get({"id":id, "expand":"true", "cid":$scope.company_id},
                function (success){
                    var products = success.products;
                    //$scope.productimg = []
                    for (var i = 0; i < products.length; i++) {
                        ////addSlide(vm.slides6, products[i].image.thumbnail_medium);
                        //$scope.productimg[i] = products[i].image.thumbnail_medium;
                        
                        vm.slides.push({
                          id: products[i].id,
                          image: products[i].image.thumbnail_medium,
                          text: products[i].sku
                        });
                        
                    }
                    
                    $scope.ProductsImages();
                    $(".modelform3").removeClass(progressLoader()); 
                    
                });
          }
        }  */
        




        /*      vm.SubmitCatalog = function (){
              alert($scope.update_flag);
              if($scope.update_flag)
              {
                vm.UpdateCatalog();
              }
              else
              {
                vm.AddCatalog();
              }
  
  
          }*/
        
        
    }
})();

