(function() {
'use strict';

angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);
    DashboardController.$inject = ['$resource', '$state', 'PendingOrderItemsAction', '$stateParams', 'sellerDashboard', 'SalesOrders', 'Upload', 'SalesOrdersforInvoice', 'Catalog', 'Promotions', 'v2ProductsMyDetails', 'CompanyPricelist', 'CompanyBuyergroupRule', 'BrandDistributor', 'grouptype', '$scope', 'CheckAuthenticated', 'toaster', '$location', 'SidebarLoader', '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', 'ngDialog', '$cookies', '$localStorage'];
    function DashboardController($resource, $state, PendingOrderItemsAction, $stateParams, sellerDashboard, SalesOrders, Upload, SalesOrdersforInvoice, Catalog, Promotions, v2ProductsMyDetails, CompanyPricelist, CompanyBuyergroupRule, BrandDistributor, grouptype, $scope, CheckAuthenticated, toaster, $location, SidebarLoader, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, ngDialog, $cookies, $localStorage)
{
    CheckAuthenticated.check();
    var vm = this;

    $scope.company_id = localStorage.getItem('company');

    vm.selected = {};
    vm.selectedFullJson = {};
    vm.selectAll = false;
    vm.toggleAll = toggleAll;
    vm.toggleOne = toggleOne;
    vm.count = 1;
    vm.dtInstance = {};
    $scope.bool = false;
    $scope.pendingOrderItems = [];
    $scope.pendingOrderItems222 = [];
    $scope.dimensions = {};
    $scope.ordertype = "";
    $scope.actiontype = "";
    $scope.index = 0;

    $scope.pendingOrderItemsTobeUpdated = [];

    $scope.dropship_markedUnavailable = false;
    $scope.dont_createshipment = false;

    $scope.dashboard_data = {};

    $scope.expepectedDateforNextitemRequired = false;
    $scope.illegal = false;
    $scope.nochange = false;


    sellerDashboard.get({ 'company_id': $scope.company_id },
    function (success) {

        $scope.dashboard_data = success;
        console.log($scope.dashboard_data);
        $scope.cancellation_rate = $scope.dashboard_data.cancellation_rate;
        $scope.facility_type = $scope.dashboard_data.facility_type;
        //console.log($scope.cancellation_rate);
        /*if ($scope.facility_type != 'dropship')
        {
            $("tr td:nth-child(7)").css('display', "none");
            $("tr th:nth-child(7)").css('display', "none");
        }*/
    },
    function (error)
    {
        console.log(error);
        $scope.dashboard_data.cancellation_rate = "N/A";
        $scope.dashboard_data.avg_order_delay = "N/A";
        $scope.dashboard_data.pending_orders = "N/A";
        $scope.dashboard_data.live_catalogs = "N/A";
        $scope.dashboard_data.live_non_catalogs = "N/A";
        $scope.dashboard_data.live_sets = "N/A";
    });

    Promotions.query({ 'company_id': $scope.company_id },
        function (success) {
            $scope.banner = success[0];
            console.log(success);
        },
        function (error) {
            console.log(error);
            $scope.banner = "app/img/bg3.jpg";
        });


    vm.CloseDialog = function () {
        ngDialog.close();
    };


    UpdateCheckBoxUI();


    var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';

    function imageHtml(data, type, full, meta) {
        return '<div style="text-align: center;" ng-click="OpenProductsImages(' + full[1].catalog_id + ',' + full[1].product_id +')" ><a class="hvr-grow" ><img class="loading" src="' + full[2] + '" style="height: 100px; width: 100px;"/></a></div>';
    }

    function callback(json) {
        console.log(json);
        if (json.recordsTotal > 0 && json.data.length == 0) {
            //vm.dtInstance.rerender();
            $state.go($state.current, {}, { reload: true });
        }
    }

    $scope.reloadData = function ()
    {
        var resetPaging = false;
        vm.dtInstance.reloadData(callback, resetPaging);

        UpdateCheckBoxUI();
    }

    $scope.OpenProductsImages = function (id,product_id)
    {
        $(".modelform3").addClass(progressLoader());
        $scope.catid = id;
        console.log(id+' '+product_id);
        
      
        Catalog.get({ "id": id, "cid": $scope.company_id },
            function (result) {
                $scope.catalogdata = result;
                var bundle_product_id = result.product_id;

                Catalog.get({ "id": id, "expand": "true", "cid": $scope.company_id },
                    function (success) {
                        v2ProductsMyDetails.get({ "id": bundle_product_id },
                            function (response) {
                                var productprices = response.products;
                                console.log(productprices);
                                var prices = {};
                                prices.fullprice = response.price;

                                for (var i = 0; i < productprices.length; i++) {
                                    prices[productprices[i].id] = parseInt(productprices[i].price);
                                }

                                $(".modelform3").removeClass(progressLoader());
                                openPhotoSwipe($scope.catalogdata, success, prices);
                            });
                    });
            });
        
    }

    $scope.openUpdateItemAvailability = function (id, action_type)
    {
        $scope.orderitem = vm.selectedFullJson[id];
        $scope.actiontype = action_type;
        $scope.orderitem.facility_type = $scope.orderitem[1].facility_type;
        //console.log($scope.orderitem);
        $scope.expepectedDateforNextitemRequired = false;
        $scope.illegal = false;
        $scope.nochange = false;
        $scope.isNotInPeicesMultiple = false;

        $scope.orderitem.readyQty = $scope.orderitem[1]["qty"].ready_to_ship_qty;
        $scope.orderitem.cancelledQty = $scope.orderitem[1]["qty"].unavailable_qty;
        $scope.orderitem.unmarked = parseInt($scope.orderitem[1]["qty"].pending_quantity) - (parseInt($scope.orderitem[1]["qty"].ready_to_ship_qty) + parseInt($scope.orderitem[1]["qty"].unavailable_qty)); // new leogic as per Arvind Shubhanga/Naveen
        $scope.orderitem.pending_quantity = $scope.orderitem[1]["qty"].pending_quantity;

        $scope.orderitem.ready_Qty = $scope.orderitem[1]["qty"].ready_to_ship_qty;
        $scope.orderitem.cancelled_Qty = $scope.orderitem[1]["qty"].unavailable_qty;

        if ($scope.actiontype == 'mark_unavailable')
        {
            $scope.orderitem.cancelledQty = $scope.orderitem.unmarked;
            $scope.orderitem.readyQty = 0;
            $scope.expepectedDateforNextitemRequired = false;

        }
        else if ($scope.actiontype == 'ready_qty_update')
        {
            $scope.orderitem.readyQty = $scope.orderitem.unmarked;
            $scope.orderitem.cancelledQty = 0;
            $scope.expepectedDateforNextitemRequired = false;

        }
        else if ($scope.actiontype == 'expected_date_update')
        {
            $scope.orderitem.readyQty = 0;
            $scope.orderitem.cancelledQty = 0;
            $scope.expepectedDateforNextitemRequired = true;

        }

        ngDialog.openConfirm({
            template: 'update_pending_order_items',
            scope: $scope,
            className: 'ngdialog-theme-default',
            closeByDocument: false
        });

        //$scope.showErrorMessage();


    };

    $scope.UpdateItemAvailability = function ()
    {
        var item = {};
        $scope.pendingOrderItemsTobeUpdated = [];
        item['order_item_ids'] = $scope.orderitem[1].order_item_ids;
        item['id'] = $scope.orderitem[0];
        item['seller_company_id'] = $scope.orderitem[1].seller_company_id;
        item['product_id'] = $scope.orderitem[8];
        item['size'] = $scope.orderitem[6];
        //item['order_qty'] = $scope.orderitem.order_qty;

        if ($scope.orderitem.readyQty >0)
        {
            item['ready_to_ship_qty'] = $scope.orderitem.readyQty;
        }
        if ($scope.orderitem.cancelledQty > 0)
        {
            item['unavailable_qty'] = $scope.orderitem.cancelledQty;
        }
        if ($scope.orderitem.expectedDate)
        {
            item['expected_date'] = formatDate($scope.orderitem.expectedDate);
            /*if ($scope.orderitem.readyQty == 0 && $scope.orderitem.cancelledQty == 0)
            {item['only_expected'] = true;}*/
        }
        if ($scope.orderitem.expectedDate && $scope.orderitem.cancelledQty == 0 && $scope.orderitem.readyQty == 0) {
            item['unavailable_qty'] = 0;
            item['ready_to_ship_qty'] = 0;
            item['expected_date'] = formatDate($scope.orderitem.expectedDate);
        }
        console.log(item);

        $scope.pendingOrderItemsTobeUpdated.push(item);

        var params = { 'action_type': "bulk_update", 'items': $scope.pendingOrderItemsTobeUpdated };
        console.log(params);

        $(".modelform2").addClass(progressLoader());
        PendingOrderItemsAction.save(params).$promise.then(function (result)
        {
            $(".modelform2").removeClass(progressLoader());
            vm.successtoaster = {
                type: 'success',
                title: 'Success',
                text: 'Availability updated succesfully'
            };

            vm.CloseDialog();

            toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
            $scope.reloadData();
        });

    }

    $scope.showErrorMessage = function ()
    {
        var unmarked;

        unmarked = parseInt($scope.orderitem.unmarked);

        if (parseInt($scope.orderitem.readyQty) + parseInt($scope.orderitem.cancelledQty) == unmarked) {
            $scope.expepectedDateforNextitemRequired = false;
        }
        else {
            $scope.expepectedDateforNextitemRequired = true;
        }

        if (parseInt($scope.orderitem.readyQty) + parseInt($scope.orderitem.cancelledQty) <= unmarked)
        {
            $scope.illegal = false;

        }
        else {
            $scope.illegal = true;
            $scope.expepectedDateforNextitemRequired = false;

        }

        console.log($scope.illegal+' , '+$scope.expepectedDateforNextitemRequired);

        if (parseInt($scope.orderitem.readyQty) == 0 && parseInt($scope.orderitem.cancelledQty) == 0 && $scope.actiontype != 'expected_date_update')
        {
            $scope.nochange = true;
        }
        else
        {
            $scope.nochange = false;
        }

        if (parseInt($scope.orderitem[7]) > 1) {
            if (parseInt($scope.orderitem.readyQty) % parseInt($scope.orderitem[7]) != 0 || parseInt($scope.orderitem.cancelledQty) % parseInt($scope.orderitem[7]) != 0) {
                $scope.isNotInPeicesMultiple = true;
            }
            else {
                $scope.isNotInPeicesMultiple = false;
            }
        }

    }

  /*  $scope.loadCSV = function (file) {
        $scope.inventory_csv = file;
        console.log($scope.inventory_csv);
    };

    $scope.UploadInventoryCSV = function ()
    {

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

    }   */


    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: 'api/pendingorderitemsdatatables/',
            type: 'GET',
        })
        .withDOM('rtipl')
        .withOption('createdRow', function (row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        })
        .withOption('headerCallback', function (header) {
            if (!vm.headerCompiled) {
                // Use this headerCompiled field to only compile header once
                vm.headerCompiled = true;
                $compile(angular.element(header).contents())($scope);
            }
        })
        .withOption('fnPreDrawCallback', function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            vm.count = vm.count + 1;
            //alert(JSON.stringify(vm.selected));
            if ((vm.count % 2) == 0) {
                vm.selected = {};
                vm.selectAll = false;
                //alert(JSON.stringify(vm.selected));
            }
            return true;
        })

        .withDataProp('data')
        .withLightColumnFilter({
            3: { "type": "text" },
            4: { "type": "text" },
            5: { "type": "text" },
            6: { "type": "text" },
            8: { "type": "text" },
            13: { "type": "dateRange" }

        })

        .withOption('processing', true)
        .withOption('serverSide', true)
        //.withOption('stateLoadParams', false)
        //.withOption('stateSaveParams', false)
        .withOption('stateSave', true)
        .withOption('stateSaveCallback', function (settings, data) {
            //console.log(JSON.stringify(settings));
            //console.log(settings);
            data = datatablesStateSaveCallback(data);
            //localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));
            localStorage.setItem('DataTables_' + 'pendingorders', JSON.stringify(data));
        })
        .withOption('stateLoadCallback', function (settings) {
            return JSON.parse(localStorage.getItem('DataTables_' + 'pendingorders'))
        })

        .withOption('iDisplayLength', 10)
        //.withOption('responsive', true)
        .withOption('scrollX', true)
        // .withOption('scrollY', '55vh')
        .withOption('scrollY', getDataTableHeight())
        //.withOption('scrollCollapse', true)
        .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc

        .withPaginationType('full_numbers')

        .withButtons([
            {
                text: 'Pending Order Items',
                key: '1',
                className: 'tableHeading',
            },
            {
                text: 'Reset Filter',
                key: '1',
                className: 'buttonSecondary',
                action: function (e, dt, node, config) {
                    //$('table thead tr:eq(1) :input').val('').trigger('change'); // Don't forget to trigger
                    //$('#catalog-datatables').DataTable().ajax.reload();
                    localStorage.removeItem('DataTables_' + 'pendingorders');
                    $state.go($state.current, {}, { reload: true });
                }
            },
            {
                extend: 'csv',
                title: 'Orders',
                exportOptions: {
                    columns: "thead th:not(.noExport)"
                    //columns: ':visible'
                }
            },

            //'copy',
            'print',
            //'excel',
          /*  {
                text: 'Bulk Inventory update',
                key: '1',
                className: 'buttonPrimary',
                action: function (e, dt, node, config) {

                    ngDialog.openConfirm({
                        template: 'uploadInventoryCsv',
                        scope: $scope,
                        className: 'ngdialog-theme-default',
                        closeByDocument: false
                    });

                }
             }  */

        ]);

    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable().notVisible()
            .renderWith(function (data, type, full, meta) {
                vm.selected[full[0]] = false;
                vm.selectedFullJson[full[0]] = full;
                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
            }),
        DTColumnDefBuilder.newColumnDef(1).withTitle('Json').notVisible(),
        DTColumnDefBuilder.newColumnDef(2).withTitle('Image').renderWith(imageHtml).notSortable(),
        DTColumnDefBuilder.newColumnDef(3).withTitle('Brand'),
        DTColumnDefBuilder.newColumnDef(4).withTitle('Catalog').notSortable(),
        DTColumnDefBuilder.newColumnDef(5).withTitle('Design No'),
        DTColumnDefBuilder.newColumnDef(6).withTitle('Sizes').notSortable(),
        DTColumnDefBuilder.newColumnDef(7).withTitle('No of pieces'),
        DTColumnDefBuilder.newColumnDef(8).withTitle('Product Code'),
        DTColumnDefBuilder.newColumnDef(9).withTitle('Pending since').notSortable(),
        DTColumnDefBuilder.newColumnDef(10).withTitle('Pending Qty')
          .renderWith(function (data, type, full, meta) {
            var htmlbutton = '';

            var qty_text = fullSetQtyText(full[10], full[1]['no_of_pcs'])

            htmlbutton += '<div>' + qty_text + '</div>';

            return htmlbutton;
        }),
        DTColumnDefBuilder.newColumnDef(11).withTitle('Ready Qty')
            .renderWith(function (data, type, full, meta) {
                var htmlbutton = '';
                var qty_text = fullSetQtyText(full[11], full[1]['no_of_pcs']);

                if ((parseInt(full[1]['qty'].ready_to_ship_qty) + parseInt(full[1]['qty'].unavailable_qty) ) >= parseInt(full[1]['qty'].pending_quantity))
                {
                    htmlbutton += '<div>' + qty_text + '</div>';
                }
                else
                {
                    htmlbutton += '<div>' + qty_text + ' <a href="" ng-click="openUpdateItemAvailability(' + full[0] + ',\'ready_qty_update\')" > Change </a></div>';
                }

                return htmlbutton;
            }),
        DTColumnDefBuilder.newColumnDef(12).withTitle('Unavailable Qty')
        .renderWith(function (data, type, full, meta) {
            var htmlbutton = '';

            var qty_text = fullSetQtyText(full[12], full[1]['no_of_pcs'])

            htmlbutton += '<div>' + qty_text + '</div>';
            return htmlbutton;
        }),
        DTColumnDefBuilder.newColumnDef(13).withTitle('Expected Date').notSortable()
            .renderWith(function (data, type, full, meta,) {
                var htmlbutton = '';

                var today = new Date();
                var expctedDate = new Date(full[13]);
                if ((parseInt(full[1]['qty'].ready_to_ship_qty) + parseInt(full[1]['qty'].unavailable_qty)) >= parseInt(full[1]['qty'].pending_quantity))
                {
                    htmlbutton += '<div >' + full[13] + '</div>';
                }
                else if (expctedDate <= today)
                {
                    htmlbutton += '<div class="changerequired" >' + full[13] + ' <a href="" ng-click="openUpdateItemAvailability(' + full[0] + ',\'expected_date_update\')" > Change required</a></div>';
                }
                else
                {
                    htmlbutton += '<div >' + full[13] + ' <a href="" ng-click="openUpdateItemAvailability(' + full[0] + ',\'expected_date_update\')" > Change </a></div>';
                }

                return htmlbutton;
            }),
        DTColumnDefBuilder.newColumnDef(14).withTitle('Actions').notSortable()
            .renderWith(function (data, type, full, meta)
            {
                var htmlbutton = '';

                if(( parseInt(full[1]['qty'].ready_to_ship_qty) + parseInt(full[1]['qty'].unavailable_qty))  >= parseInt(full[1]['qty'].pending_quantity) )
                {
                    htmlbutton += '<div><button type="button" ng-disabled="true" ng-click="openUpdateItemAvailability(' + full[0] + ',\'mark_unavailable\')" class="linkButton">Mark Unavailable</button></div>';
                }
                else
                {
                    htmlbutton += '<div><button type="button" ng-click="openUpdateItemAvailability(' + full[0] + ',\'mark_unavailable\')" class="linkButton">Mark Unavailable</button></div>';
                }

                return htmlbutton;
            })

    ];



    /*vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: 'api/pendingorderdatatables/',
            type: 'GET',
        })

        .withOption('createdRow', function (row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        })
        .withOption('headerCallback', function (header) {
            if (!vm.headerCompiled) {
                // Use this headerCompiled field to only compile header once
                vm.headerCompiled = true;
                $compile(angular.element(header).contents())($scope);
            }
        })
        .withOption('fnPreDrawCallback', function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            vm.count = vm.count + 1;
            //alert(JSON.stringify(vm.selected));
            if ((vm.count % 2) == 0) {
                vm.selected = {};
                vm.selectAll = false;
                //alert(JSON.stringify(vm.selected));
            }
            return true;
        })

        .withDataProp('data')
        .withLightColumnFilter({
            2: { "type": "text" },
            3: { "type": "select", selected: $stateParams.order_status, values: [{ "value": "Pending", "label": "Pending" }, { "value": "Accepted", "label": "Accepted" }, { "value": "Dispatched", "label": "Dispatched" }, { "value": "Partially Dispatched", "label": "Partially Dispatched" }, { "value": "Delivered", "label": "Delivered" }] }

        })

        .withOption('processing', true)
        .withOption('serverSide', true)
        //.withOption('stateLoadParams', false)
        //.withOption('stateSaveParams', false)
        .withOption('stateSave', true)
        .withOption('stateSaveCallback', function (settings, data) {
            //console.log(JSON.stringify(settings));
            //console.log(settings);
            data = datatablesStateSaveCallback(data);
            //localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));
            localStorage.setItem('DataTables_' + 'pendingorders', JSON.stringify(data));
        })
        .withOption('stateLoadCallback', function (settings) {
            return JSON.parse(localStorage.getItem('DataTables_' + 'pendingorders'))
        })

        .withOption('iDisplayLength', 10)
        //.withOption('responsive', true)
        .withOption('scrollX', true)
        // .withOption('scrollY', '55vh')
        .withOption('scrollY', getDataTableHeight())
        //.withOption('scrollCollapse', true)
        .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc

        .withPaginationType('full_numbers')

        .withButtons([
            {
                text: 'Reset Filter',
                key: '1',
                className: 'green',
                action: function (e, dt, node, config) {
                    //$('table thead tr:eq(1) :input').val('').trigger('change'); // Don't forget to trigger
                    //$('#catalog-datatables').DataTable().ajax.reload();
                    localStorage.removeItem('DataTables_' + 'pendingorders');
                    $state.go($state.current, {}, { reload: true });
                }
            },
            //'copy',
            'print',
            //'excel',

        ]);

    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable().notVisible()
            .renderWith(function (data, type, full, meta) {
                vm.selected[full[0]] = false;
                vm.selectedFullJson[full[0]] = full;
                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
            }),
        DTColumnDefBuilder.newColumnDef(1).withTitle('Json').notVisible(),
        DTColumnDefBuilder.newColumnDef(2).withTitle('Order No.').renderWith(TitleLink),
        DTColumnDefBuilder.newColumnDef(3).withTitle('Status').notSortable(),
        DTColumnDefBuilder.newColumnDef(4).withTitle('Pending since'),
        DTColumnDefBuilder.newColumnDef(5).withTitle('Reseller').notVisible(),
        DTColumnDefBuilder.newColumnDef(6).withTitle('Pending Qty'),
        DTColumnDefBuilder.newColumnDef(7).withTitle('Ready Qty'),
        DTColumnDefBuilder.newColumnDef(8).withTitle('Unavailable Qty'),
        DTColumnDefBuilder.newColumnDef(9).withTitle('Shipment & Invoices').renderWith(Shipmentlink).notSortable(),
        DTColumnDefBuilder.newColumnDef(10).withTitle('Actions').notSortable()
        .renderWith(function (data, type, full, meta)
        {
            var htmlbutton = '';

            if (full[1].facility_type == 'dropship')
            {
                htmlbutton += '<div><button type="button" ng-click="openCreateShipment(' + full[0] + ',\'create_shipment\')" class="styledButtonblue">Create Shipment</button></div>';
            }
            else
            {
                //$scope.ordertype = "warehouse";
                htmlbutton += '<div><button type="button" ng-click="openCreateShipment(' + full[0] + ',\'mark_ready_to_ship\')" class="styledButtongreen" >Mark ready for pickup</button></div>'
                htmlbutton += '<div><button type="button" ng-click="openCreateShipment(' + full[0] + ',\'mark_unavailable\')" class="styledButtonblue">Mark unavailable</button></div>';
                htmlbutton += '<div><button type="button" ng-click="openCreateShipment(' + full[0] + ',\'show_shipment\')" class="styledButtonblue">View Shipment</button></div>';
            }

            if (htmlbutton == '')
                return '&nbsp;';
            else
                return htmlbutton;


        })

    ];*/

    function toggleAll(selectAll, selectedItems) {
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                selectedItems[id] = selectAll;
            }
        }
    }

    function toggleOne(selectedItems) {
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                if (!selectedItems[id]) {
                    vm.selectAll = false;
                    return;
                }
            }
        }
        vm.selectAll = true;
    }

    $(document).ready(function ()
    {
        setTimeout(function ()
        {
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

            //$("tr td:nth-child(8)").css('width', "18% !important");
            //$("tr th:nth-child(8)").css('width', "18% !important");

            $(".changerequired").parent().parent().css('background', "#f0505030");
            //console.log($(".dangerr").parent());

        }, 3000);



    });

    //console.log(api);
    console.log(window.location);


    $scope.openInNewTab = function (link) {
        window.open(link, "seller Invoice");
    }

    /* $scope.csvFileSource = function (link) {
        return window.location.origin+'/api/v2/companies/' + $scope.company_id+'/get-pending-item-csv/'
    }  */



    $scope.UploadInvoice = function () {

        $(".modelform3").addClass(progressLoader());

        var params = { 'id': $scope.orderid, 'cid': $scope.company_id, "sub_resource": "pending-order-action", "action_type": "upload_invoice", 'shipment_id': $scope.shipment_id };
        if ($scope.invoiceImage) {
            var invoiceimage = blobImageRenameForExtenstion($scope.invoiceImage, $scope.invoiceImagethumbnail, "1.jpg");
            params['seller_invoice'] = invoiceimage;

        }
        else if ($scope.invoicepdffile) {
            params['seller_invoice'] = $scope.invoicepdffile;
        }
        console.log(params);


        SalesOrdersforInvoice.save(params).$promise.then(function (result) {
            $(".modelform3").removeClass(progressLoader());
            vm.successtoaster = {
                type: 'success',
                title: 'Success',
                text: 'Invoice has been uploaded.'
            };

            vm.CloseDialog();

            toaster.pop('success', 'Success', 'Invoice has been uploaded');
            $scope.reloadData();
        });

    };


    //Not used Methods




    $scope.DivideQuantity = function (x) {
        if (x.is_full_catalog == true || x.is_full_catalog == 'true') {
            var qty = parseInt(x.quantity) / parseInt(x.no_of_pcs);
            //console.log(qty);
            return qty;
        }
        else {
            return x.quantity
        }
    }


    function blobImageRenameForExtenstion(final_image, assing_to, newname) {
        console.log(final_image);
        console.log(assing_to);
        console.log(newname);
        var cropblob = Upload.dataUrltoBlob(final_image, assing_to);
        var fileFromBlob = new File([cropblob], newname, { type: "image/jpeg", lastModified: Date.now() });
        console.log(fileFromBlob);
        return fileFromBlob
    }


    $scope.uploadInvoiceImage = function (file) {
        console.log(file);

        if (file.type == 'application/pdf') {
            $scope.invoicepdffile = file;
        }
        else {
            $(".modelform2").addClass(progressLoader());
            var fr = new FileReader();
            fr.readAsDataURL(file);
            var blob;
            fr.onload = function (evt) {
                var image = new Image();
                image.src = fr.result;

                var blob = dataURItoBlob(evt.target.result);
                var blob2 = dataURItoBlob(image.src);
                //console.log(blob);
                //console.log(blob2);

                //$scope.invoiceImage = image.src;
                $scope.invoiceImage = evt.target.result;
                $scope.invoiceImagethumbnail = blob; //fileFromBlob; //
                //$scope.cropallow = true;
                //console.log($scope.invoiceImage);
                $(".modelform2").removeClass(progressLoader());
            }
        }

    };


    function TitleLink(data, type, full, meta) {
        return '<a href="#/app/order-detail/?type=salesorders&id=' + full[0] + '&name=' + full[2] + '" target=_blank>' + full[0] + '</a>';
    }

    function Shipmentlink(data, type, full, meta) {
        var htmlbutton = '';
        if (full[1].facility_type == 'dropship') {
            var shipmentids = full[9];
            for (var index = 0; index < shipmentids.length; index++) {
                //const element = array[index];
                htmlbutton += '<div><a href="" ng-click="openViewShipment(' + full[0] + ',\'view_created_shipment\',' + shipmentids[index] + ')" >' + shipmentids[index] + '</a></div>';
            }
        }
        else {
            //htmlbutton += '<div><button type="button" ng-click="openCreateShipment(' + full[0] + ',\'show_shipment\')" class="styledButtonblue">View Shipment</button></div>';

            htmlbutton = '&nbsp;';
            window.setTimeout(function (params) {
                $("tr td:nth-child(7)").css('display', "none");
                $("tr th:nth-child(7)").css('display', "none");
                //console.log('call')

            }, 1000)

        }
        return htmlbutton;
    }

    $scope.UnmarkedQty = function (item, index) {
        console.log(item);
        var unmarked = parseInt(item.order_item__quantity) - (parseInt(item.ready_to_ship_qty) + parseInt(item.canceled_qty));

        return unmarked;
    }


    $scope.showmessage = function (item, index) {
        console.log(item);
        var unmarked, ctr = 0;
        var ctr2 = 0;
        $scope.dropship_markedUnavailable = false;
        $scope.dont_createshipment = false;

        if (item.is_full_catalog == true || item.is_full_catalog == 'true') {
            unmarked = parseInt($scope.pendingOrderItems222[index].pending_quantity) / parseInt($scope.pendingOrderItems222[index].no_of_pcs);
        }
        else {
            unmarked = parseInt($scope.pendingOrderItems222[index].quantity) - (parseInt($scope.pendingOrderItems222[index].ready_to_ship_qty) + parseInt($scope.pendingOrderItems222[index].canceled_qty));
        }

        if (parseInt(item.canceled_qty) + parseInt(item.ready_to_ship_qty) <= unmarked) {
            $scope.bool = false;
        }
        else {
            $scope.bool = true;
        }


        angular.forEach($scope.pendingOrderItems, function (obj) {
            if (obj.ready_to_ship_qty == 0) {
                ctr = ctr + 1;
            }
            if (obj.ready_to_ship_qty == 0 && obj.canceled_qty == 0) {
                ctr2 = ctr2 + 1;
            }
        });

        if ($scope.pendingOrderItems.length == ctr) {
            $scope.dropship_markedUnavailable = true;
            console.log('dropship_markedUnavailable ' + $scope.dropship_markedUnavailable);
        }
        else {
            $scope.dropship_markedUnavailable = false;
        }

        if ($scope.pendingOrderItems.length === ctr2) {
            $scope.dont_createshipment = true;
            console.log('dont_createshipment ' + $scope.dont_createshipment);
        }
        else {
            $scope.dont_createshipment = false;
            console.log('dont_createshipment ' + $scope.dont_createshipment);
        }



        console.log($scope.pendingOrderItems);
        console.log($scope.dimensions);
    }


    $scope.openCreateShipment = function (orderid, action_type) {

        var true_count = 0;
        console.log(orderid);
        $scope.orderid = orderid;
        $scope.actiontype = action_type;
        console.log(action_type);
        $scope.pendingOrderItems = [];
        $scope.dimensions = {};
        $scope.invoiceImage = null;
        $scope.invoiceImagethumbnail = null;
        $scope.invoicepdffile = null;
        //Get previously stored orfder item details

        $(".modelform3").addClass(progressLoader());
        SalesOrders.get({ 'id': orderid, 'cid': $scope.company_id, "sub_resource": "pending-order-action" }).$promise.then(function (result) {
            $(".modelform3").removeClass(progressLoader());
            console.log(result);

            $scope.pendingOrderItems = result.items;
            if ($scope.actiontype == 'mark_ready_to_ship') {
                angular.forEach($scope.pendingOrderItems, function (obj) {
                    //obj.ready_to_ship_qty = parseInt(obj.quantity) - (parseInt(obj.ready_to_ship_qty) + parseInt(obj.canceled_qty));
                    if (obj.is_full_catalog == true || obj.is_full_catalog == 'true') {
                        obj.ready_to_ship_qty = parseInt(obj.pending_quantity) / parseInt(obj.no_of_pcs);
                    }
                    else {
                        obj.ready_to_ship_qty = parseInt(obj.pending_quantity);
                    }
                    obj.canceled_qty = 0;

                });
            }
            else if ($scope.actiontype == 'mark_unavailable') {
                angular.forEach($scope.pendingOrderItems, function (obj) {
                    //obj.canceled_qty = parseInt(obj.quantity) - (parseInt(obj.ready_to_ship_qty) + parseInt(obj.canceled_qty));
                    if (obj.is_full_catalog == true || obj.is_full_catalog == 'true') {
                        obj.canceled_qty = parseInt(obj.pending_quantity) / parseInt(obj.no_of_pcs);
                    }
                    else {
                        obj.canceled_qty = parseInt(obj.pending_quantity);
                    }
                    obj.ready_to_ship_qty = 0;

                });
            }
            else if ($scope.actiontype == 'create_shipment') {

                angular.forEach($scope.pendingOrderItems, function (obj) {
                    //obj.ready_to_ship_qty = parseInt(obj.quantity) - (parseInt(obj.ready_to_ship_qty) + parseInt(obj.canceled_qty));
                    if (obj.is_full_catalog == true || obj.is_full_catalog == 'true') {
                        obj.ready_to_ship_qty = parseInt(obj.pending_quantity) / parseInt(obj.no_of_pcs);
                    }
                    else {
                        obj.ready_to_ship_qty = parseInt(obj.pending_quantity);
                    }
                    obj.canceled_qty = 0;

                });
            }
            else if ($scope.actiontype == 'show_shipment') {
                angular.forEach($scope.pendingOrderItems, function (obj) {
                    obj.canceled_qty = 0;
                    obj.ready_to_ship_qty = 0;

                });
            }




        }); // need to make multiple calls to make another tem array constant otherwise value will change in both of them

        SalesOrders.get({ 'id': orderid, 'cid': $scope.company_id, "sub_resource": "pending-order-action" }).$promise.then(function (result) {
            $scope.pendingOrderItems222 = result.items;
            angular.forEach($scope.pendingOrderItems222, function (obj) {

                if (obj.is_full_catalog == true || obj.is_full_catalog == 'true') {
                    obj.ready_to_ship_qty = parseInt(obj.ready_to_ship_qty) / parseInt(obj.no_of_pcs);
                    obj.canceled_qty = parseInt(obj.canceled_qty) / parseInt(obj.no_of_pcs);
                }

            });
        });

        ngDialog.openConfirm({
            template: 'CreateShipmentdialog',
            scope: $scope,
            className: 'ngdialog-theme-default',
            closeByDocument: false
        });


    };

    $scope.CreateShipment = function () {

        $(".modelform3").addClass(progressLoader());

        angular.forEach($scope.pendingOrderItems, function (obj) {
            if (obj.is_full_catalog == true || obj.is_full_catalog == 'true') {
                obj.ready_to_ship_qty = parseInt(obj.ready_to_ship_qty) * parseInt(obj.no_of_pcs);
                obj.canceled_qty = parseInt(obj.canceled_qty) * parseInt(obj.no_of_pcs);
            }

        });
        console.log($scope.pendingOrderItems);

        if ($scope.actiontype == 'create_shipment') {
            var params = { 'id': $scope.orderid, 'cid': $scope.company_id, "sub_resource": "pending-order-action", 'items': $scope.pendingOrderItems, 'action_type': "create_shipment" };
            if ($scope.invoiceImage) {
                var invoiceimage = blobImageRenameForExtenstion($scope.invoiceImage, $scope.invoiceImagethumbnail, "1.jpg");
                params['seller_invoice'] = invoiceimage;

            }
            else if ($scope.invoicepdffile) {
                params['seller_invoice'] = $scope.invoicepdffile;
            }

            if (!$scope.dropship_markedUnavailable) {
                params['measures'] = $scope.dimensions;
            }
            else {
                //$scope.dimensions = {height: 0.1,length: 0.1,weight: 0.1, width: 0.1};
                params['all_cancle'] = true;
            }
            console.log(params);


            SalesOrdersforInvoice.save(params).$promise.then(function (result) {
                $(".modelform3").removeClass(progressLoader());
                vm.successtoaster = {
                    type: 'success',
                    title: 'Success',
                    text: 'Shipment has been created.'
                };

                vm.CloseDialog();

                toaster.pop('success', 'Success', 'Shipment has been created.');
                $scope.reloadData();
            });
        }
        else {
            SalesOrders.save({ 'id': $scope.orderid, 'cid': $scope.company_id, "sub_resource": "pending-order-action", 'items': $scope.pendingOrderItems, 'action_type': $scope.actiontype }).$promise.then(function (result) {
                $(".modelform3").removeClass(progressLoader());

                if ($scope.actiontype == 'mark_unavailable') {
                    vm.successtoaster = {
                        type: 'success',
                        title: 'Update Success',
                        text: 'Items marked as Unavailable'
                    };
                }
                else {
                    vm.successtoaster = {
                        type: 'success',
                        title: 'Update Success',
                        text: 'Items marked as Ready to ship'
                    };
                }

                vm.CloseDialog();

                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                $scope.reloadData();
            });
        }


    }

    $scope.openViewShipment = function (orderid, action_type, shipment_id) {
        var true_count = 0;
        console.log(orderid);
        $scope.orderid = orderid;
        $scope.actiontype = action_type;
        console.log(action_type);
        $scope.shipment_id = shipment_id;
        // $scope.invoicepdffile = null;
        // $scope.invoiceImage = null;
        // $scope.invoiceImagethumbnail = null;
        $scope.sellerInvoice = null;
        $scope.shipmentLabel = null;

        //Get previously stored orfder item details get_shipment:true,shipment_id:""

        $(".modelform3").addClass(progressLoader());
        SalesOrders.get({ 'id': orderid, 'cid': $scope.company_id, "sub_resource": "pending-order-action", 'get_shipment': true, 'shipment_id': $scope.shipment_id }).$promise.then(function (result) {
            $(".modelform3").removeClass(progressLoader());
            console.log(result);

            $scope.receivedpendingOrderItems = result.items;
            $scope.dimensions = result.measures;
            $scope.sellerInvoice = result.seller_invoice;
            $scope.shipmentLabel = result.shipment_lable;

        });

        ngDialog.openConfirm({
            template: 'view_created_shipment',
            scope: $scope,
            className: 'ngdialog-theme-default',
            closeByDocument: false
        });


    };



    vm.markasreadytoship = function () {
        var true_count = 0;
        angular.forEach(vm.selected, function (value, key) {
            if (value == true) {
                true_count++;
                vm.true_key = key;
            }
        })

        if (true_count == 1) {

            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {
                    console.log(key);


                }
            });
        }
        else {
            vm.errortoaster = {
                type: 'error',
                title: 'Failed',
                text: 'Please select one row'
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


    /*
    {
    "text": "My Views",
    "sref": "",
    "icon": "icon-people",
    "label": "label label-info",
    "submenu": [
      {
        "text": "My Viewers",
        "sref": "app.myviewers"
      },
      {"text": "My Followers",    "sref": "app.myfollowers"}
    ]
  },
  {
    "text": "My Network",
    "sref": "",
    "icon": "fa fa-users",
    "label": "label label-info",
    "submenu": [
      {"text": "Buyers",       "sref": "app.buyers"},
      {"text": "Salespersons",       "sref": "app.salespersons"}
    ]
  }
   {
    "text": "Become a seller",
    "sref": "app.publiccatalogbecomeaseller",
    "icon": "fa fa-user",
    "label": "label label-success"
  },
    */


    /* minRTSerror and maxUNVerror not used

        if(item.ready_to_ship_qty < $scope.pendingOrderItems222[index].ready_to_ship_qty)
        {
            //$scope.minRTSerror = true;
            $scope.minRTSerror = false;
        }
        else
        {
            $scope.minRTSerror = false;
        }

        if (item.canceled_qty > $scope.pendingOrderItems222[index].canceled_qty)
        {
            //$scope.maxUNVerror = true;
            $scope.maxUNVerror = false;
        }
        else
        {
            $scope.maxUNVerror = false;
        }*/


}
})();
