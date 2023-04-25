(function() {
    'use strict';

    angular
        .module('app.companies')
        .controller('MapsDetailController', MapsDetailController);

    MapsDetailController.$inject = ['$resource', 'Meeting', 'toaster', '$scope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', 'CheckAuthenticated', '$compile', '$state', '$filter', '$stateParams'];
    function MapsDetailController($resource, Meeting, toaster, $scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, CheckAuthenticated, $compile, $state, $filter, $stateParams) {
        CheckAuthenticated.check();        
        /*$.ajaxSetup({
            headers : {
              'Authorization' : 'Bearer '+$auth.getToken()
            }
        });*/
        var vm = this;
        
		//var meeting_markers = [];
		//$scope.initialize  = function () {
			//alert("ini");
	/*	Meeting.query({user: $stateParams.id}, function(data){
			var data = data;
			//alert(data.length);
			if(data.length < 1){
				alert("No meetings found for this user!");
			}
			else{
				for(var i=0;i< data.length; i++)
				{
					//console.log(data[i]);
					//meeting_markers = [];
					var temp = {};
					//console.log(data[i]);
					// temp.title = (i+1)+" Meeting ";
                    temp.title = (i+1) +". "+ data[i].buying_company_name + " ";
					temp.lat =data[i].start_lat;
					temp.lng =data[i].start_long;
					temp.description = " " + $filter('date')(data[i].start_datetime, 'd/M/yy h:mm a');
                    //temp.description = '';
                    if(data[i].note != null){
                        temp.description = temp.description +" "+ data[i].note;
                    }
					meeting_markers.push(temp);
				
				}
				//console.log(meeting_markers);
				var meeting_mapOptions = {
					center: new google.maps.LatLng(meeting_markers[0].lat, meeting_markers[0].lng),
					zoom: 10,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				var map = new google.maps.Map(document.getElementById("meetingsdvMap"), meeting_mapOptions);
				var meeting_infoWindow = new google.maps.InfoWindow();
				var lat_lng = new Array();
				var latlngbounds = new google.maps.LatLngBounds();
				for (i = 0; i < meeting_markers.length; i++) {
					var data = meeting_markers[i]
					var myLatlng = new google.maps.LatLng(data.lat, data.lng);
					lat_lng.push(myLatlng);
					var meeting_marker = new google.maps.Marker({
						position: myLatlng,
						map: map,
						title: data.title,
						label: String(1+i)
					});
					latlngbounds.extend(meeting_marker.position);
					(function (marker, data) {
						google.maps.event.addListener(meeting_marker, "click", function (e) {
							meeting_infoWindow.setContent(data.title + "-" + data.description);
							meeting_infoWindow.open(map, meeting_marker);
						});
					})(meeting_marker, data);
				}
				map.setCenter(latlngbounds.getCenter());
				map.fitBounds(latlngbounds); */
		 
				//***********ROUTING****************//
		 
				
				/*var ii = 0
				//Loop and Draw Path Route between the Points on MAP
				for (var i = 0; i < lat_lng.length; i++) {
					if ((i + 1) < lat_lng.length) {
						
						//Initialize the Path Array
						var path = new google.maps.MVCArray();
				 
						//Initialize the Direction Service
						var service = new google.maps.DirectionsService();
				 
						//Set the Path Stroke Color
						var poly = new google.maps.Polyline({ map: map, strokeColor: '#4986E7' });
						
						var src = lat_lng[ii + i];
						var des = lat_lng[ii + i + 1];
						path.push(src);
						poly.setPath(path);
						service.route({
							origin: src,
							destination: des,
							travelMode: google.maps.DirectionsTravelMode.DRIVING
						}, function (result, status) {
							if (status == google.maps.DirectionsStatus.OK) {
								for (var j = 0, len = result.routes[0].overview_path.length; j < len; j++) {
									path.push(result.routes[0].overview_path[j]);
								}
							}
						});
					}
				}*/
		/*	}
		});  */
			
			
		//}

        var meeting_markers = [];
        $scope.renderMap = function(data){
            console.log(data);
            meeting_markers = [];
            if(data.length >0 ){
                    for(var i=0;i< data.length; i++)
                    {
                        //console.log(data[i]);
                        //meeting_markers = [];
                        var temp = {};
                        //console.log(data[i]);
                        // temp.title = (i+1)+" Meeting ";
                        temp.id = 
                        temp.title = (i+1) +". "+ data[i][1] + " ";
                        temp.lat = data[i][5].start_lat;
                        temp.lng = data[i][5].start_long;
                        temp.description = " " + $filter('date')(data[i][2], 'd/M/yy h:mm a');
                        //temp.description = '';
                        if(data[i][4] != null){
                            temp.description = temp.description +" "+ data[i][4];
                        }
                        meeting_markers.push(temp);
                    }
                    //console.log(meeting_markers);
                    var meeting_mapOptions = {
                        center: new google.maps.LatLng(meeting_markers[0].lat, meeting_markers[0].lng),
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById("meetingsdvMap"), meeting_mapOptions);
                    var meeting_infoWindow = new google.maps.InfoWindow();
                    var lat_lng = new Array();
                    var latlngbounds = new google.maps.LatLngBounds();
                    
                    $scope.createMarker = function(mdata){
                       // var mdata = meeting_markers[i]
                        var myLatlng = new google.maps.LatLng(mdata.lat, mdata.lng);
                        lat_lng.push(myLatlng);
                        var meeting_marker = new google.maps.Marker({
                            position: myLatlng,
                            map: map,
                            title: mdata.title,
                            label: String(1+i)
                        });
                        if(meeting_markers.length == 1){
                                //google.maps.event.trigger(meeting_marker, 'click');
                                meeting_infoWindow.setContent(mdata.title + "-" + mdata.description);
                                meeting_infoWindow.open(map, meeting_marker);

                        }
                        latlngbounds.extend(meeting_marker.position);
                        (function (marker, mdata) {
                            google.maps.event.addListener(meeting_marker, "click", function (e) {
                                meeting_infoWindow.setContent(mdata.title + "-" + mdata.description);
                                meeting_infoWindow.open(map, meeting_marker);
                                // map.setZoom();
                                // map.setCenter(marker.getPosition());
                               // map.panTo(this.getPosition());
                            });
                        })(meeting_marker, mdata);
                    }
                    for (i = 0; i < meeting_markers.length; i++) {
                        $scope.createMarker(meeting_markers[i]);
                    }
                    //commented below two lines , because zoom level not working.
                    //map.setCenter(latlngbounds.getCenter());
                    //map.fitBounds(latlngbounds); 
                    

            }
            else {
                vm.errortoaster = {
                        type:  'error',
                        title: 'No Meetings',
                        text:  'No meetings found for this search criteria or user!'
                };
                    
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text); 

            }
        }
        

        //$scope.global.uname = $stateParams.name;
        //alert($scope.uname);
        
        
        vm.selected = {};
        vm.selectedFullJson = {};
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
        $scope.focusMarker = function(id){
            console.log('called');
          //  console.log(vm.selectedFullJson[id]);
            var marker_array = [];
            marker_array.push(vm.selectedFullJson[id]);
            $scope.renderMap(marker_array);
        }
        function CompanyLinkiWithMap(data, type, full, meta){
            //console.log(full);
            //var full_id = full[0];
          if(full[1] == ""){
              return '[<a ng-click="focusMarker('+full[0]+')">View on Map</a>]';
          }
          else{
            if (full[5]['buying_company_id'] != null){
                return '<a href="#/app/buyer-detail/?id='+full[5]['buying_company_id']+'&name='+full[1]+'">'+full[1]+'</a>' + '<br>[<a ng-click="focusMarker('+full[0]+')">View on Map</a>]';
            }
            else{
               return full[1]+'<br>[<a ng-click="focusMarker('+full[0]+')">View on Map</a>]'; 
            }
          }
        }

        vm.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('ajax', {
                        url: 'api/meetingdatatables1/?user='+$stateParams.id,
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
                        //2 : { "type" : "text"},
                        2 : { "type" : "dateRange", width: '100%'},
                        //4 : { "type" : "text"}
                    })
                    .withOption('processing', true)
                    .withOption('serverSide', true)
                    //.withOption('stateLoadParams', false)
                    //.withOption('stateSaveParams', false)
                    .withOption('stateSave', true)
                    .withOption('stateSaveCallback', function(settings, data) {
                        //console.log(settings.json.data);
                        //console.log("stateSaveCallback");
                        $scope.renderMap(settings.json.data);
                        data = datatablesStateSaveCallback(data);
                        localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));
                    })
                    .withOption('stateLoadCallback', function(settings) {
                         return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance ))
                    })
                    
                    .withButtons([
                        'copy',
                        'print',
                        'excel',
                        {
                              text: 'Reset',
                              key: '1',
                              className: 'green',
                              action: function (e, dt, node, config) {
                                //$('table thead tr:eq(1) :input').val('').trigger('change'); // Don't forget to trigger
                                //$('#catalog-datatables').DataTable().ajax.reload();
                                localStorage.removeItem('DataTables_' + 'map-datatables');
                                $state.go($state.current, {}, {reload: true});
                              }
                          }
                        
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
                    vm.selectedFullJson[full[0]] = full;
                    return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
                }).notVisible(),
            DTColumnDefBuilder.newColumnDef(1).withTitle('Company Name').renderWith(CompanyLinkiWithMap),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Date Time'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('Duration'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Notes'),
          /*  DTColumnDefBuilder.newColumnDef(4).withTitle('No Of Orders').notSortable(),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Legend No').notSortable() */
       
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
