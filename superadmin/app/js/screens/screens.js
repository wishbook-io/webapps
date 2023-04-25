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

    ScreensController.$inject = ['$http', '$resource', 'v2CategoryEavAttribute', 'EnumGroup', 'Promotions', 'Brand', 'Catalog', 'v2Products','v2ProductsPhotos', 'CatalogUploadOptions', 'Product', 'v2Category', 'Company', 'BuyerList', 'SalesOrders', 'toaster', 'ngDialog', '$scope', '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', 'Upload', '$filter', '$cookies', '$localStorage', 'SweetAlert', 'Notification','NotificationEntity','NotificationTemplate', 'sharedProperties'];
    function ScreensController($http, $resource, v2CategoryEavAttribute, EnumGroup, Promotions, Brand, Catalog, v2Products, v2ProductsPhotos, CatalogUploadOptions, Product, v2Category, Company, BuyerList, SalesOrders, toaster, ngDialog, $scope, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, Upload, $filter, $cookies, $localStorage, SweetAlert, Notification,NotificationEntity,NotificationTemplate, sharedProperties) {
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
        
        $scope.alrt = function () {alert("called");};
        //UpdateCheckBoxUI();

        
        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
        
      

        $scope.reloadData  = function () {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);

            //UpdateCheckBoxUI();
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
               /* Catalog.get({"id":id, "cid":$scope.company_id},
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
            return '<div style="text-align: center;"><a ng-click="OpenProductsImages(' + full[0] + ',' + full[15] +')" class="hvr-grow"><img class="loading" src="'+full[5]+'" style="height: 100px; width: 100px;"/></a></div>';
        }
        $scope.OpenNoProductsAlert = function() {
           vm.errortoaster = {
                        type:  'error',
                        title: 'Empty Set',
                        text:  'This set has no products photos.'
                    };
                    
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
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
        function PreferredSeller(data, type, full, meta) {
          var substr = ""
          for (var i = 0; i < data.length; i++) {
                substr += data[i].preferred_seller__name.substring(0,15) + "-" +data[i].discount + "%,"+data[i].sell_full_catalog+"(" + '<a ng-click="OpenCompanyEdit('+data[i].preferred_seller+')">'+data[i].preferred_seller+'</a>' +" )";
                if (i != data.length -1) {
                    substr += ",<br>";
                }
          }
          return '<p style="cursor: pointer;">'+substr+'</p>';
        }
        function SellerDetails(data, type, full, meta) {
          var substr = ""
          
          substr += full[1]["company_name"].substring(0,15) +"(" + '<a ng-click="OpenCompanyEdit('+full[1]["company_id"]+')">'+full[1]["company_id"]+'</a>' +" )";
          
          return '<p style="cursor: pointer;">'+substr+'</p>';
        }
        function TitleLink(data, type, full, meta){
          if(full[8] == 0){
              return '<a ng-click="OpenNoProductsAlert()">'+full[1]+'</a>';
          }
          else{
            return '<a href="#/app/product/?type=mycatalog&id='+full[0]+'&name='+full[1]+'">'+full[1]+'</a>';
          }
        }

        function setMatchingTitleLink(data, type, full, meta) {
            if (full[9] == 0) {
                return '<a ng-click="OpenNoProductsAlert()">' + full[4] + '</a>';
            }
            else {
                return '<a href="#/app/product/?type=mycatalog&id=' + full[1]['catalog_id'] + '&name=' + full[4] + '">' + full[4] + '</a>';
            }
        }

        function BrandTitleLink(data, type, full, meta){
          if(full[3] != null ){
            return '<a href="#/app/brand-catalogs/?brand='+full[10]['brand']+'&name='+full[3]+'">'+full[3]+'</a>';
          }
          else{
            return '';
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
              $scope.catalog.topcategory = 4;
              //  $scope.categories = v2Category.query({parent: 5});  
              v2CategoryEavAttribute.query(function(success){
                $scope.all_category_eav_data = success;
                $scope.TopCategoryChanged(4);
              });
              $scope.photoshoot_types = [{"id":1, "photoshoot_type": "Live Model Photoshoot"}, {"id":2, "photoshoot_type": "White Background or Face-cut"}, {"id":3, "photoshoot_type": "Photos without Model"},]
              sharedProperties.setType('create');
              $scope.openConfirm();
          };
          
          $scope.TopCategoryChanged = function(pid)
          {
            $scope.categories = v2Category.query({parent: pid});
            v2Category.query({parent: pid},function(success)
            {
               
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
                    toaster.pop("error", "Failed", "Can not update a set that you are not a seller");
                }
                else
                {
                    console.log('Edit set called');
                    sharedProperties.setType('update1');
                    $scope.setId = vm.true_key;
                    console.log($scope.setId);
                    $scope.catalog_id = vm.selectedFullJson[vm.true_key][1]["catalog_id"];
                    console.log($scope.catalog_id);

                    $scope.update_flag = true;
                    


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

       /*Start: Notify action code*/  
       $scope.splitExtra =  function(extra_notifiers) {
          $scope.extra_count = extra_notifiers.split(',').length
        }
        $scope.GetLables =  function(entity) {
          console.log(entity);
          if (entity) {
            NotificationTemplate.query({ entity: entity.id }).$promise.then(function(success){
              $scope.notification_labels = success;
            });
          }
        }

        $scope.SetMessage   =  function(label) {
          console.log(label);
          if (label) {
            vm.notification_title     = label.display;
            vm.notification_message   = label.sms_temp.replace("<catalog name>",vm.selectedFullJson[$scope.product_id][3].toString());
          }
        }
       $scope.Notify = function(catalog_id,product_id) {
          $scope.catalog_id = catalog_id;
          $scope.product_id = product_id;
          $scope.seller_data = [];
          //console.log(vm.selectedFullJson[product_id][1]["catpresellers"][0]);
          var temp = {};
          temp.id  = vm.selectedFullJson[product_id][1]["company_id"];//[0].preferred_seller;
          temp.name  = vm.selectedFullJson[product_id][1]["company_name"];//[0].preferred_seller__name;
          temp.phone_number = vm.selectedFullJson[product_id][1]["company_phone_number"];//[0].preferred_seller__phone_number;
          
          $scope.seller_data.push(temp);
          NotificationEntity.query({type: 'catalog'}).$promise.then(function(success){
              vm.notification_entities = success;
          });
          // vm.notify_to = true;
          $scope.catalog_tab = true;
          console.log($scope.seller_data);
          console.log($scope.entities);
          vm.notification_label = '';
          vm.notification_message = '';
          vm.notification_entity = '';
          vm.notification_entity = '';
          vm.extra_sellers = '';
          vm.extra_sellers = '';
          vm.notify_to = '';
          vm.seller_data = '';
          vm.notification_note = '';
          vm.way = {
            'by_sms' : false,
            'by_noti' : false
          };
          $scope.NotifyDailog()

        };


        $scope.NotifyDailog = function () {
            ngDialog.open({
                template: 'notifydailog',
                className: 'ngdialog-theme-default',
                scope: $scope,
                closeByDocument: false
            });
        };
        $scope.getPreviousNotification = function(catalog_id)
        {

          $scope.noti_data = vm.selectedFullJson[catalog_id][1]["noti"]["data"]
          $scope.NotifyPreviousDailog();
        }
        $scope.NotifyPreviousDailog = function () {
            ngDialog.open({
                template: 'notifypreviousdailog',
                className: 'ngdialog-theme-default',
                scope: $scope,
                closeByDocument: false
            });
        };
        vm.sendNotify = function () {
            console.log("on sumbit");
            console.log(vm.notification_label);
            console.log(vm.notification_message);
            console.log(vm.notification_entity);
            console.log(vm.notification_entity);
            console.log(vm.extra_sellers);
            console.log(vm.notify_to);
            console.log(vm.seller_data);
            if(vm.NotifyForm.$valid) {
                $(".modelform4").addClass(progressLoader());
                if (!vm.way.by_sms && !vm.way.by_noti) {
                  $(".modelform4").removeClass(progressLoader());
                  vm.errortoaster = {
                               type:  'error',
                               title: 'Medium',
                               text:  'Please Select a Medium.'
                           };
                 toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                  return
                }
                if (!vm.notification_entity) {
                  $(".modelform4").removeClass(progressLoader());
                  vm.errortoaster = {
                               type:  'error',
                               title: 'Medium',
                               text:  'Please Select an Entity'
                           };
                 toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                  return
                }
                if (!vm.notification_label) {
                  $(".modelform4").removeClass(progressLoader());
                  vm.errortoaster = {
                               type:  'error',
                               title: 'Medium',
                               text:  'Please Select a Label'
                           };
                 toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                  return
                }
                Notification.save({
                                   "notice_template": vm.notification_label.id,
                                   "message":vm.notification_message,
                                   "notifier_users" : JSON.stringify(vm.seller_data),
                                   "extra_ids" : vm.extra_sellers,
                                   "object_id" : $scope.catalog_id,
                                   "content_type" : vm.notification_entity.content_type,
                                   "by_noti" : vm.way.by_noti,
                                   "by_sms"  : vm.way.by_sms,
                                   "title" : vm.notification_title,
                                   "note" : vm.notification_note

                                },
                function(success){
                        $(".modelform4").removeClass(progressLoader());
                        ngDialog.close();
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Notification Queued successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $scope.reloadData();
                        $scope.order = {};
                  })
            }
            else
            {
              vm.errortoaster = {
                           type:  'error',
                           title: 'Error',
                           text:  'Some Error Occured!'
                       };
             toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);

            }

        };
       /*End: Notify action code*/   

       /*Start: set soft delete code */
       vm.SoftDelete = function (){
          var true_count = 0;

            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                }
            });

            if(true_count > 0 ){
                angular.forEach(vm.selected, function(value, key) {
                    if(value==true){
                        v2Products.patch({"cid": $scope.company_id, 'id': key, "deleted": true },function(success){
                            vm.successtoaster = {
                                        type:  'success',
                                        title: 'Success',
                                        text:  'Set soft deleted successfully.'
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
                      text:  'Please select atleast one row.'
                  };
                  console.log(vm.errortoaster);
                  toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }
      }

        vm.OpenUpdateQuality = function ()
        {
            var true_count = 0;
            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {
                    true_count++;
                    vm.true_key = key;
                }
            })

            if (true_count == 1)
            {
                
                console.log('Edit Quality called');
                sharedProperties.setType('updatequality');

                $scope.setId = vm.true_key;
                console.log($scope.setId);
                $scope.catalog_id = vm.selectedFullJson[vm.true_key][1]["catalog_id"];
                console.log($scope.catalog_id);
                
                $scope.company_id = vm.selectedFullJson[vm.true_key][1]["company_id"];
                console.log($scope.company_id);

                $scope.bundle_product_id = vm.selectedFullJson[vm.true_key][1]["bundle_product_id"];


                $scope.brands = Brand.query({ cid: $scope.company_id, 'company': $scope.company_id, type: "my", sub_resource: "dropdown" });


                v2Products.get({ 'id': $scope.catalog_id }, function (result)
                {
                    console.log(result);
                    /*fabric work style etc is obtained by CategoryChanged() add_update.js*/
                    $scope.catalog = result;

                });


                ngDialog.open({
                    template: 'updateQuality',
                    scope: $scope,
                    className: 'ngdialog-theme-default',
                    closeByDocument: false
                });


                
            }
            else
            {
                console.log('please select one row');
                $.notify({
                    title: "Failed",
                    message: "Please select one row",
                },{   type: 'info',
                        placement: {
                            from: 'bottom',
                            align: 'right'
                        }
                    });

            }


        }
      /*Start: set soft delete code */
       vm.TableButtons = [
                            {
                                text: 'Update Quality',
                                key: '1',
                                className: 'orange',
                                action: function (e, dt, node, config)
                                {
                                    $scope.catalogId = null;
                                    vm.catalog = {};
                                    $scope.catalog = {};
                                    $scope.quality = {};
                                    vm.catalog.dont_allow_crop = false;
                                    vm.catalog.cropallow = !vm.catalog.dont_allow_crop;
                                    $scope.update_flag = true;
                                    $scope.products = [];
                                    $scope.catalog.enable_duration = 30;
                                    $scope.catalog.is_percentage = true;
                                    $scope.catalog.single_piece_price_percentage = 0;
                                    $scope.catalog.single_piece_price = 0;
                                    $scope.catalog.view_permission = 'public';
                                    $scope.catalog.catalog_type = 'setmatching';
                                    
                                    vm.OpenUpdateQuality();
                                }
                            },
                            {
                                text: 'Add Set Matchings',
                                key: '1',
                                className: 'green',
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
                              text: 'Add set',
                              key: '1',
                              className: 'green',
                              action: function (e, dt, node, config)
                              {
                                 
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
                              className: 'orange',
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
                          },
                          {
                              text: 'Enable',
                              key: '1',
                              className: 'blue',
                              action: function (e, dt, node, config) {
                                 // alert(JSON.stringify(vm.selected));
                                    vm.OpenEnableCatalog();
                              }
                          },
                          {
                              text: 'Disable',
                              key: '1',
                              className: 'orange',
                              action: function (e, dt, node, config) {
                                  // alert(JSON.stringify(vm.selected));
                                  vm.DisableCatalog();
                              }
                          },
                          {
                              text: 'Reset Filter',
                              key: '1',
                              className: 'green',
                              action: function (e, dt, node, config) {
                                //$('table thead tr:eq(1) :input').val('').trigger('change'); // Don't forget to trigger
                                //$('#catalog-datatables').DataTable().ajax.reload();
                                localStorage.removeItem('DataTables_' + 'catalogs-datatables');
                                $state.go($state.current, {}, {reload: true});
                              }
                          },
                          {
                              text: 'Soft Delete',
                              key: '1',
                              className: 'orange',
                              action: function (e, dt, node, config) {
                                  vm.SoftDelete();
                              }
                          },
                          'print',
                         
                          
                      ];
                  $scope.flag_is_staff = localStorage.getItem("is_staff");
                  if($scope.flag_is_staff == "true"){
                      vm.TableButtons.splice(1,1);
                  }
                  vm.dtOptions = DTOptionsBuilder.newOptions()
                      .withOption('ajax', {
                          url: 'api/catalogscreensadmindatatables/',
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
                          3 : { "type" : "text"},
                          4 : { "type" : "text"},
                          6 : { "type" : "text"},
                          7 : { "type" : "text"},
                          8 : { "type" : "select", values:[{"value":"Enable","label":"Enable"}, {"value":"Disable","label":"Disable"}]},
                          9 : { "type" : "dateRange", width: '100%'},
                          10 : { "type" : "select", values:[{"value":true,"label":"True"}, {"value":false,"label":"False"}]},
                          11 : { "type" : "text"},
                          12 : { "type" : "numberRange", width: '100%'},
                          13 : { "type" : "numberRange", width: '100%'},
                          14 : { "type" : "dateRange", width: '100%'},

                      })
                      
                      .withOption('processing', true)
                      .withOption('serverSide', true)
                      //.withOption('stateLoadParams', false)
                      //.withOption('stateSaveParams', false)
                      .withOption('stateSave', true)
                      .withOption('stateSaveCallback', function(settings, data) {
                          //console.log(JSON.stringify(settings));
                          data = datatablesStateSaveCallback(data);
                          localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));
                      })
                      .withOption('stateLoadCallback', function(settings) {
                         return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance ))
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
                          DTColumnDefBuilder.newColumnDef(2).withTitle('ID'),
                          DTColumnDefBuilder.newColumnDef(3).withTitle('SetTitle'),
                          DTColumnDefBuilder.newColumnDef(4).withTitle('Quality').renderWith(setMatchingTitleLink),
                          DTColumnDefBuilder.newColumnDef(5).withTitle('Image').renderWith(imageHtml).notSortable(),
                          DTColumnDefBuilder.newColumnDef(6).withTitle('Brand'),//.renderWith(BrandTitleLink),
                          DTColumnDefBuilder.newColumnDef(7).withTitle('Category'),
                          DTColumnDefBuilder.newColumnDef(8).withTitle('Status').notSortable(),
                          DTColumnDefBuilder.newColumnDef(9).withTitle('Expiry Date'),
                          DTColumnDefBuilder.newColumnDef(10).withTitle('Deleted'),
                          DTColumnDefBuilder.newColumnDef(11).withTitle('Seller').renderWith(SellerDetails).notSortable().withOption('sWidth','20%'),
                          DTColumnDefBuilder.newColumnDef(12).withTitle('Public Price Range').notSortable(),
                          DTColumnDefBuilder.newColumnDef(13).withTitle('SinglePiece Price Range').notSortable(),
                          DTColumnDefBuilder.newColumnDef(14).withTitle('CreatedDate'),
                          DTColumnDefBuilder.newColumnDef(15).withTitle('Pcs/set').notSortable().withOption('sWidth','5%'),
                          DTColumnDefBuilder.newColumnDef(16).withTitle('Action').notSortable().withClass('noExport')//.withOption('width', '25%')
                              .renderWith(function(data, type, full, meta) {
                                  var htmlbutton = ''
                                  htmlbutton += '<div><button type="button" ng-click="Notify('+full[1]['catalog_id']+','+full[0]+')" class="btn btn-block btn-primary mt-lg">Notify</button></div>';
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


        /*$(document).ready(function () {
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
        });*/
        

        //Methods that are not used
        
  /*      $scope.openUpdateCatalogForm = function () {
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
        }*/

    }
})();

