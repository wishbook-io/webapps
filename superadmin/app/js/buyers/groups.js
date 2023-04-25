(function() {
    'use strict';

    angular
        .module('app.buyers')
        .controller('GroupslistController', GroupslistController);

    GroupslistController.$inject = ['$resource', '$filter', 'BuyerSegmentation', 'grouptype', 'City', 'State', 'Category', 'BuyerList', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', 'toaster', '$state', 'CheckAuthenticated', 'ngDialog', '$cookies', '$localStorage', 'SweetAlert'];
    function GroupslistController($resource, $filter, BuyerSegmentation, grouptype, City, State, Category, BuyerList, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, toaster, $state, CheckAuthenticated, ngDialog, $cookies, $localStorage, SweetAlert) {
        CheckAuthenticated.check();
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
        var vm = this;
        $scope.update_flag = false;
        $scope.company_id = localStorage.getItem('company');
  /*      function creatingData(node, tempArr)
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
            $scope.categories = Category.query({parent: 10},
            function(success) {
                    console.log(tempArr);
                 
                   for(var i=0; i < $scope.categories.length; i++)
                    {
                      var temp = {};
                      temp = creatingData($scope.categories[i],tempArr);
                       $scope.data.push(temp);
                    }

                    vm.treeData = $scope.data;

                    vm.treeConfig = {
                        core : {
                            multiple : true,
                            animation: true,
                            error : function(error) {
                                console.log('treeCtrl: error from js tree - ' + angular.toJson(error));
                            },
                            check_callback : true,
                            worker : true
                        },
                        version : 1,
                        
                        plugins : ['wholerow','types','checkbox'],
                        checkbox: {
                                    tie_selection: false
                                  }

                    };   
            }); 

      }  */

      

        $scope.OpenDialog = function () {
            ngDialog.open({
                template: 'creategroup',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        vm.DeleteGroup = function() {
            var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })
            
            if(true_count > 0)
            {
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
                }, function(isConfirm){  
                  if (isConfirm) {
                    angular.forEach(vm.selected, function(value, key) {
                        if(value==true){
                            $(".modelform3").addClass(progressLoader());
                            BuyerSegmentation.delete({'id':key, 'cid':$scope.company_id},
                            function(success){
                                $(".modelform3").removeClass(progressLoader());
                                //$scope.dtInstance.reloadData();
                                vm.successtoaster = {
                                    type:  'success',
                                    title: 'Success',
                                    text:  'Group deleted successfully.'
                                };
                                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                                reloadData();
                            });
                        }
                    })
                    //SweetAlert.swal('Deleted!', 'Selected rows has been deleted.', 'success');   
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
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 
                
            }
            
        };

        $scope.group = {};
        vm.OpenCreateGroup = function(tempArr) {
            $scope.OpenDialog();
            $scope.group.buyer_grouping_type = "Location Wise";
            
            $scope.groupType = grouptype.query();

            $scope.states = State.query();
            
            $scope.GetCity =  function(state) { 
                //alert(state);
                $scope.group.city = [];
                var state = state.toString()
                $scope.cities = City.query({ state: state });
            }
            
            $scope.buyers = BuyerList.query({"status":"approved", "cid":$scope.company_id});

            //$scope.categories = Category.query({parent: "null"},

            $scope.categories = Category.query({parent: 10},  // to show sub category of women ethnic wear only
               function (success){
                     //   alert($scope.categories.length);
                    //    var tempArr = [];
                        categoryTree(tempArr);
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
                                    multiple : true,
                                    animation: true,
                                    error : function(error) {
                                        console.log('treeCtrl: error from js tree - ' + angular.toJson(error));
                                    },
                                    check_callback : true,
                                    worker : true
                                },
                                version : 1,
                                
                                plugins : ['checkbox'],
                                checkbox: {
                                            tie_selection: false
                                          }

                            };     
                      }
                
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
               });
              
        }
        

        $scope.CreateGroup = function () {
            $(".modelform").addClass(progressLoader()); 
            $scope.category = $('#tree_2').jstree('get_bottom_checked');
   //         console.log($scope.category);
   //         console.log($scope.group);
            var bsjson = {"cid":$scope.company_id, "segmentation_name": $scope.group.segmentation_name, "buyer_grouping_type": $scope.group.buyer_grouping_type}; //, "group_type": $scope.group.group_type, "state": $scope.group.state, "city": $scope.group.city, "category": $scope.category
            
            
            //alert(JSON.stringify(bsjson));
            if($scope.update_flag ==  false){
                if($scope.group.group_type != null){
                bsjson['group_type'] = $scope.group.group_type;
                }
                if($scope.group.state != null){
                    bsjson['state'] = $scope.group.state;
                }
                if(typeof $scope.group.city != "undefined"){
                    bsjson['city'] = $scope.group.city;
                }
                else{
                    bsjson['city'] = [];
                }
                if(typeof $scope.category != "undefined"){
                    bsjson['category'] = $scope.category;
                }
                else{
                    bsjson['category'] = [];
                }
                
                if(typeof $scope.group.buyers != "undefined"){
                    bsjson['buyers'] = $scope.group.buyers;
                }
                else{
                    bsjson['buyers'] = [];
                }

                BuyerSegmentation.save(bsjson, 
                    function(success){
                        $(".modelform").removeClass(progressLoader());
                        
                        ngDialog.close();
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Group created successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        reloadData();
                    });
            }
            else{

                if($scope.group.group_type != null){
                  bsjson['group_type'] = $scope.group.group_type;
                }

                if($scope.group.state != null){
                    bsjson['state'] = $scope.group.state;
                }
                if(typeof $scope.group.city != "undefined"){
                    bsjson['city'] = $scope.group.city;
                }
                else{
                    bsjson['city'] = [];
                }
                if(typeof $scope.category != "undefined"){
                    bsjson['category'] = $scope.category;
                }
                else{
                    bsjson['category'] = [];
                }

                if(typeof $scope.group.buyers != "undefined"){
                    bsjson['buyers'] = $scope.group.buyers;
                }
                else{
                    bsjson['buyers'] = [];
                }
                
                bsjson['id'] = $scope.groupId;
                BuyerSegmentation.patch(bsjson, 
                    function(success){
                        $(".modelform").removeClass(progressLoader());
                        
                        ngDialog.close();
                        vm.successtoaster = {
                            type:  'success',
                            title: 'Success',
                            text:  'Group updated successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        reloadData();
                    });
            }
        }

        $scope.OpenUpdateGroup = function(gid) {
          $scope.group = {};
       //   $scope.categories = {};
      //    var tempArr = [];
          $scope.update_flag = true;
        //vm.OpenUpdateGroup = function() {
         /*  var true_count = 0;
            angular.forEach(vm.selected, function(value, key) {
                if(value==true){
                    true_count++;
                    vm.true_key = key;
                }
            })
            
            if(true_count == 1)
            {  */
              
                $scope.group.buyer_grouping_type = "Location Wise";
                
                $scope.groupType = grouptype.query();

                $scope.states = State.query();
                $scope.cities = City.query();
                $scope.GetCity =  function(state) { 
                    //alert(state);
                    $scope.group.city = [];
                    var state = state.toString()
                    $scope.cities = City.query({ state: state });
                }
                
                $scope.buyers = BuyerList.query({"status":"approved", "cid":$scope.company_id});

                $scope.categories = Category.query({parent: 10});

                BuyerSegmentation.get({"id": gid, "cid":$scope.company_id},
                    function(success){
                        $scope.group = success;
                        $scope.groupId = success.id;
                        var catArr = [];
                        catArr = success.category;
                        categoryTree(catArr);
                      function categoryTree(catArr){
                            $scope.data = [];
                           for(var i=0; i<$scope.categories.length; i++)
                            {
                              var temp = {};
                              temp = creatingData($scope.categories[i],catArr);
                              $scope.data.push(temp);
                            }
                       //     alert(JSON.stringify($scope.data));
                            vm.treeData = $scope.data;

                            vm.treeConfig = {
                                core : {
                                    multiple : true,
                                    animation: true,
                                    error : function(error) {
                                        console.log('treeCtrl: error from js tree - ' + angular.toJson(error));
                                    },
                                    check_callback : true,
                                    worker : true
                                },
                                version : 1,
                                
                                plugins : ['checkbox'],
                                checkbox: {
                                            tie_selection: false
                                          }

                            };     
                      }
                
                      function creatingData(node, catArr)
                      {
                              var temp = {};
                              var length;
                              temp.id = node.id;
                              //alert(catArr);
                              if(catArr != null)
                              {
                                if(catArr.indexOf(node.id) != -1)
                                {
                                  //console.log(catArr);
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
                                  var child = creatingData(node.child_category[i], catArr);
                                  temp.children.push(child);
                                }
                              }
                           //   alert(JSON.stringify(temp));
                              return temp;
                        
                      }
                    });
                 
                $scope.OpenDialog();
          /*  }
            else{
                vm.errortoaster = {
                                    type:  'error',
                                    title: 'Failed',//toTitleCase(key),//
                                    text:  "Please select one row"
                                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }  */
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
        //    console.log(json);
            if(json.recordsTotal > 0 && json.data.length == 0){
                //vm.dtInstance.rerender();
                $state.go($state.current, {}, {reload: true});
            }
        }
        
        function imageHtml(data, type, full, meta){
            return '<img src="'+full[3]+'" style="width: 100px; height: 100px"/>';
        }
        
        function filterDate (row, data, full, meta) {
            return $filter('date')(row, 'yyyy-MM-dd')+" : "+$filter('date')(row, 'h: mm a');
        }
        
        function collapseCity(data, type, full, meta){
            //return '<p title="'+full[3]+'" style="white-space: nowrap; overflow: hidden;text-overflow: ellipsis;  max-width: 130px; cursor: pointer;">'+full[3]+'</p>';
            var substr = customSubString(full[3]);
            return '<p title="'+full[3]+'" style="cursor: pointer;">'+substr+'</p>';
        }
        
        function collapseCategory(data, type, full, meta){
            //return '<p title="'+full[4]+'" style="white-space: nowrap; overflow: hidden;text-overflow: ellipsis;  max-width: 130px; cursor: pointer;">'+full[4]+'</p>';
            var substr = customSubString(full[4]);
            return '<p title="'+full[4]+'" style="cursor: pointer;">'+substr+'</p>';
        }
    
        
        function collapseBuyers(data, type, full, meta){
            //return '<p title="'+full[5]+'" style="white-space: nowrap; overflow: hidden;text-overflow: ellipsis;  max-width: 130px; cursor: pointer;">'+full[5]+'</p>';
            var substr = customSubString(full[5]);
            return '<p title="'+full[5]+'" style="cursor: pointer;">'+substr+'</p>';
        }
    


        //$scope.dtOptions2 
        vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: 'api/segmentationdatatables1/',
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
            7 : { "type" : "dateRange"},        
        })
        
        //.withDOM('frtip')
        .withButtons([
            {
                text: 'Create Group',
                key: '1',
                className: 'green',
                action: function (e, dt, node, config) {
                    $scope.group = {};
                    
                    var tempArr = [];
                    $scope.categories = {};
                    $scope.update_flag = false;
                    vm.OpenCreateGroup(tempArr);
                }
            },
       /*     {
                text: 'Update Group',
                key: '1',
                className: 'orange',
                action: function (e, dt, node, config) {
                    $scope.group = {};
                    $scope.categories = {};
                    var tempArr = [];
                    $scope.update_flag = true;
                    vm.OpenUpdateGroup();
                }
            }, */
            {
                text: 'Delete',
                key: '1',
                className: 'red',
                action: function (e, dt, node, config) {
                    vm.DeleteGroup();
                    
                    
                }
            },
            {
                  text: 'Reset Filter',
                  key: '1',
                  className: 'green',
                  action: function (e, dt, node, config) {
                    //localStorage.removeItem('DataTables_' + 'products-datatables');
                    $state.go($state.current, {}, {reload: true});
                  }
            },
            'copy',
            'print',
            'excel'
        ])
        
     /*   .withColReorder()
        // Set order
        //.withColReorderOrder([0, 2, 1, 3, 4, 5, 6, 7])
        //.withColReorderOption('iFixedColumnsRight', 1)
        .withColReorderOption('iFixedColumnsLeft', 1)
        .withColReorderCallback(function() {
            console.log('Columns order has been changed with: ' + this.fnOrder());
        })*/
        
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withOption('iDisplayLength', 10)
        //.withOption('responsive', true)
        .withOption('scrollX', true)
        .withOption('scrollY', getDataTableHeight())
        //.withOption('scrollCollapse', true)
        .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
        
        .withPaginationType('full_numbers');

        //$scope.dtColumnDefs2
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
                .renderWith(function(data, type, full, meta) {
                    
                    vm.selected[full[0]] = false;
                    return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                }),
          
            DTColumnDefBuilder.newColumnDef(1).withTitle('Name'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Type').notSortable(),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Cities').renderWith(collapseCity).notSortable(),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Categories').renderWith(collapseCategory).notSortable(),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Buyers').renderWith(collapseBuyers).notSortable(),
            DTColumnDefBuilder.newColumnDef(6).withTitle('Active Buyers').notSortable(),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Last Generated'),//.renderWith(filterDate),
            DTColumnDefBuilder.newColumnDef(8).withTitle('Shares').notSortable(),
            DTColumnDefBuilder.newColumnDef(9).withTitle('Actions').notSortable()
              .renderWith(function(data, type, full, meta) {
                return '<div><button type="button" ng-click="OpenUpdateGroup('+full[0]+')" class="btn btn-block btn-default mt-lg">Update Group</button></div>' ;
              })
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
