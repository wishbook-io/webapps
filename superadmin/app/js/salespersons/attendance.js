(function() {
    'use strict';

    angular
        .module('app.companies')
        .controller('AttendanceController', AttendanceController);

    AttendanceController.$inject = ['$resource', 'Attendance', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', '$stateParams'];
    function AttendanceController($resource, Attendance, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, $filter, $stateParams) {
        CheckAuthenticated.check();        
        
        var vm = this;
        

    // below code is moved to salesperson_details.js to solve map load issue in tab view of sales person detail page
       /* var markers = [];
		Attendance.query({user: $stateParams.id}, function(data){
			var data = data;
			if(data.length < 1){
				alert("No attendance found for this user!");
			}
			else{
				for(var i=0;i< data.length; i++)
				{
					//console.log(data[i]);
					//markers = [];
					var temp = {};
					//console.log(data[i]);
					temp.title = (i+1)+" Attendance ";
					temp.lat =data[i].att_lat;
					temp.lng =data[i].att_long;
					temp.description = $filter('date')(data[i].date_time, 'd/M/yy h:mm a');
					markers.push(temp);
					
				}
				//console.log(markers);
				var mapOptions = {
					center: new google.maps.LatLng(markers[0].lat, markers[0].lng),
					zoom: 10,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				var map = new google.maps.Map(document.getElementById("attendanceMap"), mapOptions);
				var infoWindow = new google.maps.InfoWindow();
				var lat_lng = new Array();
				var latlngbounds = new google.maps.LatLngBounds();
				for (i = 0; i < markers.length; i++) {
					var data = markers[i]
					var myLatlng = new google.maps.LatLng(data.lat, data.lng);
					lat_lng.push(myLatlng);
					var marker = new google.maps.Marker({
						position: myLatlng,
						map: map,
						title: data.title,
						label: String(1+i)
					});
					latlngbounds.extend(marker.position);
					(function (marker, data) {
						google.maps.event.addListener(marker, "click", function (e) {
							infoWindow.setContent(data.title + "-" + data.description);
							infoWindow.open(map, marker);
						});
					})(marker, data);
				}
				map.setCenter(latlngbounds.getCenter());
				map.fitBounds(latlngbounds);
			}
		});   */
        
        var attendance_markers = [];
        $scope.renderMap = function(data){
            attendance_markers = [];
            if(data.length >0 ){
                    for(var i=0;i< data.length; i++)
                    {
                        //console.log(data[i]);
                        //attendance_markers = [];
                        var temp = {};
                        //console.log(data[i]);
                        
                        temp.title = (i+1) +". "+ data[i][1] + " ";
                        temp.lat = data[i][5].att_lat;
                        temp.lng = data[i][5].att_long;
                        temp.description = " " + $filter('date')(data[i][2], 'd/M/yy h:mm a');
                        
                        /*if(data[i][4] != null){
                            temp.description = temp.description +" "+ data[i][4];
                        } */
                        attendance_markers.push(temp);
                    }
                   // console.log(attendance_markers);
                    var attendance_mapOptions = {
                        center: new google.maps.LatLng(attendance_markers[0].lat, attendance_markers[0].lng),
                        zoom: 10,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById("attendanceMap"), attendance_mapOptions);
                    var attendance_infoWindow = new google.maps.InfoWindow();
                    var lat_lng = new Array();
                    var latlngbounds = new google.maps.LatLngBounds();
                    

                    $scope.createMarker = function(mdata) {
                        //var data = attendance_markers[i]
                        var myLatlng = new google.maps.LatLng(mdata.lat, mdata.lng);
                        lat_lng.push(myLatlng);
                        var attendance_marker = new google.maps.Marker({
                            position: myLatlng,
                            map: map,
                            title: mdata.title,
                            label: String(1+i)
                        });
                        latlngbounds.extend(attendance_marker.position);
                        (function (marker, data) {
                            google.maps.event.addListener(attendance_marker, "click", function (e) {
                                attendance_infoWindow.setContent(mdata.title + "<br>" + mdata.description);
                                attendance_infoWindow.open(map, attendance_marker);
                            });
                        })(attendance_marker, data);
                    }

                    for (i = 0; i < attendance_markers.length; i++) {
                        $scope.createMarker(attendance_markers[i]);
                    }
                    map.setCenter(latlngbounds.getCenter());
                    map.fitBounds(latlngbounds); 
            }
            else {
                vm.errortoaster = {
                        type:  'error',
                        title: 'No Attendance',
                        text:  'No Attendance found for this search criteria or user!'
                };
                    
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 

            }
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
            console.log(json);
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
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('ajax', {
                        url: 'api/attendancedatatables/?user='+$stateParams.id,
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
                        2 : { "type" : "dateRange", width: '100%'},
                    })
                    .withOption('processing', true)
                    .withOption('serverSide', true)
                    //.withOption('stateLoadParams', false)
                    //.withOption('stateSaveParams', false)
                    .withOption('stateSave', true)
                    .withOption('stateSaveCallback', function(settings, data) {
                        //console.log(settings.json.data);
                     //   console.log("stateSaveCallback");
                        $scope.renderMap(settings.json.data);
                        data = datatablesStateSaveCallback(data);
                        localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));
                    })
                    .withButtons([
                        'copy',
                        'print',
                        'excel'
                        
                    ])
                    
                    .withOption('processing', true)
                    .withOption('serverSide', true)
                    .withOption('iDisplayLength', 10)
                    //.withOption('responsive', true)
                    .withOption('scrollX', true)
                    .withOption('scrollY', getDataTableHeight())
                    //.withOption('scrollCollapse', true)
                    .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc
                    
                    .withPaginationType('full_numbers');

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
                .renderWith(function(data, type, full, meta) {
                    vm.selected[full[0]] = false;
                    return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                }).notVisible(),
            DTColumnDefBuilder.newColumnDef(1).withTitle('Company').notSortable(),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Date Time').notSortable(),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Action').notSortable(),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Legend No').notSortable()
       
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
