(function() {
    'use strict';

    angular
        .module('app.myviewers')
        .controller('MyViewerlistController', MyViewerlistController)
        //.directive('imageloaded', imageloaded); // required by demo

    MyViewerlistController.$inject = ['$http', '$resource', '$scope', 'toaster', 'Viewers', 'ngDialog', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', 'City', 'State', '$cookies', '$localStorage'];
    function MyViewerlistController($http, $resource, $scope, toaster, Viewers, ngDialog, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, City, State, $cookies, $localStorage) {
        CheckAuthenticated.check();
        
        var vm = this;
        
        $scope.company_id = localStorage.getItem('company');// $cookies.get('company');
        //$scope.category_filter_options = JSON.parse(localStorage.getItem('category_filter_options'));
        //console.log($scope.category_filter_options);
        
       
        $scope.search_form = {};
        $scope.searchjson = {};
        $scope.states = [];
        $scope.cityList = [];
        $scope.viewerlist =[];
        $scope.myText = "";

        $scope.seenTime = [];
        $scope.limit = 15;
        $scope.offset = 0;
        $scope.no_more_records = false;
        $scope.offset_que = [];


        State.query().$promise.then(function(result)
        {
            $scope.states = result;
        });

        $scope.getCity = function (stateid)
        {
            $scope.cityList = City.query({ state: stateid }, function (succees)
            {
                $scope.search_form.city = $scope.cityList[0].city_name;
                console.log($scope.search_form.city);

            }, function (error) { });

        }
        
        
        $scope.getViewerlist = function(params)
        {
            params['limit'] = $scope.limit;
            params['offset'] = $scope.offset;
            params['cid'] = $scope.company_id;
            console.log(params);
            //console.log("offset index = " + $scope.offset_que.indexOf($scope.offset));

            if ($scope.offset_que.indexOf($scope.offset) >= 0)
            {
                console.log("offset return");
                return;
            }
            $scope.offset_que.push($scope.offset);
            //console.log("offset ajax call");


            $(".modelform4").addClass(progressLoader()); 

            Viewers.query(params).$promise.then(function (success)
            {
                $(".modelform4").removeClass(progressLoader());

                $scope.viewerlist = $scope.viewerlist.concat(success); 
                
                if(success.length == 0)
                {
                    alert("No more records.");
                }
                if (success.length < $scope.limit)
                {
                    $scope.no_more_records = true;
                }

                for (var i = 0 ; i < success.length; i++)
                {
                    //var seentime = $scope.CalculateTime($scope.viewerlist[i].created_at);
                     //$scope.seenTime.push(seentime);

                    $scope.viewerlist[$scope.offset + i].created_at = $scope.CalculateTime($scope.viewerlist[$scope.offset + i].created_at);
                }
                console.log($scope.viewerlist)

                $scope.offset = $scope.offset+ $scope.limit;

            });
        
        }; 

        $scope.getViewerlist($scope.searchjson);


        function resetPagination()
        {
            $scope.offset = 0;
            $scope.no_more_records = false;
            $scope.offset_que = [];
            vm.photos = [];
        }

        resetPagination();
        $scope.Calculate = function ()
        {
            console.log("blabla");
        }


        $scope.CalculateTime = function(createdDateTime)
        {
            var CreatedDateTime = new Date(createdDateTime);
            console.log(CreatedDateTime);

            var today = new Date(); //getTime give a refrenced time in milliseconds from 1 jan 1970 

            var diffInSeconds = (today.getTime() / 1000) - (CreatedDateTime.getTime() / 1000);

            //console.log(diffInSeconds);
            if (diffInSeconds >= 0) {

                var TimeElapsed = "";
                if (diffInSeconds >= 86400) {
                    TimeElapsed = Math.floor(diffInSeconds / 86400) + " days ago";
                }
                else if (diffInSeconds < 86400 && diffInSeconds >= 3600) {
                    TimeElapsed = Math.floor(diffInSeconds / 3600) + " hours ago";
                }
                else if (diffInSeconds < 3600 && diffInSeconds >= 60) {
                    TimeElapsed = Math.floor(diffInSeconds / 60) + " minutes ago";
                }
                else {
                    TimeElapsed = " a minute ago";
                }

                console.log(TimeElapsed);
                return TimeElapsed;
            }
            else {
                console.log("created time is ahead of current time");
            }

        }

        //CalculateTime('2019-01-18T10:17:34.209046Z')
        

        $scope.Search = function ()
        {
            vm.searchjson = { "cid": $scope.company_id };

            vm.searchjson['view_type'] = $scope.search_form.catalog_type;

            if ($scope.search_form.name != "") {
                vm.searchjson['title'] = $scope.search_form.name;
            }
            if ($scope.search_form.brand != "") {
                vm.searchjson['brand'] = $scope.search_form.brand;
            }
            //if($scope.search_form.min_price >= 0 && $scope.search_form.max_price > 0){
            if ($scope.search_form.min_price >= 0 || $scope.search_form.max_price > 0) {
                vm.searchjson['min_price'] = $scope.search_form.min_price;
                vm.searchjson['max_price'] = $scope.search_form.max_price;
            }
            if ($scope.search_form.work != "") {
                vm.searchjson['work'] = $scope.search_form.work;
            }
            if ($scope.search_form.fabric != "") {
                vm.searchjson['fabric'] = $scope.search_form.fabric;
            }
            if ($scope.search_form.trusted_seller == true) {
                vm.searchjson['trusted_seller'] = $scope.search_form.trusted_seller;
            }


            resetPagination();
            $scope.getViewerlist($scope.searchjson);
        }

        $scope.ShowMore = function ()
        {
            if ($scope.no_more_records == false)
                $scope.getViewerlist($scope.searchjson);
        }

 
        vm.CloseDialog = function () {
            ngDialog.close();
        };
        
        function reloadData()
        {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);

            UpdateCheckBoxUI();
        }

        

        function imageloaded()
        {
            var directive = {
                link: link,
                restrict: 'A'
            };
            return directive;

            function link(scope, element, attrs) {
                var cssClass = attrs.loadedclass;

                element.bind('load', function () {
                    angular.element(element).addClass(cssClass);
                });
            }
        }



        //not used methods 

      
        /*
        $scope.datasource =
        {
        "data": [
                    {
                        "id": 860,
                        "firstName": "Superman",
                        "lastName": "Yoda"
                    },
                    {
                        "id": 870,
                        "firstName": "Foo",
                        "lastName": "Whateveryournameis"
                    },
                    {
                        "id": 590,
                        "firstName": "Toto",
                        "lastName": "Titi"
                    }
                ]
        };

        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};

        UpdateCheckBoxUI();

        vm.dtOptions =
            //DTOptionsBuilder.fromSource($scope.datasource)
            DTOptionsBuilder.fromSource('app/js/myviews/data.json')
            //.newOptions()
            .withOption('processing', true)
            .withOption('serverSide', true)
            .withOption('iDisplayLength', 10)
            //.withOption('responsive', true)
            .withOption('scrollX', true)
            .withOption('scrollY', getDataTableHeight())
            //.withOption('scrollCollapse', true)
            .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc

            .withPaginationType('full_numbers')

        vm.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID'),
            DTColumnBuilder.newColumn('firstName').withTitle('First name'),
            DTColumnBuilder.newColumn('lastName').withTitle('Last name')
        ];

            */
        
       
    }
})();
