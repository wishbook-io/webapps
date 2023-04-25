/*start - form wizard */
(function () {
    'use strict';
    angular
        .module('app.pendingorderitems-itemwise')
        .directive('formWizard', formWizard);

    formWizard.$inject = ['$parse'];

    function formWizard($parse) {
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

        function Wizard(quantity, validate, element) {

            var self = this;
            self.quantity = parseInt(quantity, 10);
            self.validate = validate;
            self.element = element;

            self.init = function () {
                self.createsteps(self.quantity);
                self.go(1); // always start at fist step
                return self;
            };

            self.go = function (step) {

                if (angular.isDefined(self.steps[step])) {

                    if (self.validate && step !== 1) {
                        var form = $(self.element),
                            group = form.children().children('div').get(step - 2);

                        if (false === form.parsley().validate(group.id)) {
                            return false;
                        }
                    }

                    self.cleanall();
                    self.steps[step] = true;
                }
            };

            self.active = function (step) {
                return !!self.steps[step];
            };

            self.cleanall = function () {
                for (var i in self.steps) {
                    self.steps[i] = false;
                }
            };

            self.createsteps = function (q) {
                self.steps = [];
                for (var i = 1; i <= q; i++) self.steps[i] = false;
            };

        }
    }
})();



(function() {
'use strict';

angular
    .module('app.pendingorderitems-itemwise')
    .controller('pendingorderitemsitemwiseController', pendingorderitemsitemwiseController);
    pendingorderitemsitemwiseController.$inject = ['$state', 'NotificationTemplate', 'Notification', '$stateParams', 'SalesOrders', 'Upload', 'SalesOrdersforInvoice', 'PendingOrderItemsAction', 'Category', 'CompanyPhoneAlias', 'CompanyPricelist', 'CompanyBuyergroupRule', 'BrandDistributor', 'grouptype', '$scope', 'CheckAuthenticated', 'toaster', '$location', 'SidebarLoader', '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', 'ngDialog', '$cookies', '$localStorage'];
    function pendingorderitemsitemwiseController($state, NotificationTemplate, Notification, $stateParams, SalesOrders, Upload, SalesOrdersforInvoice, PendingOrderItemsAction, Category, CompanyPhoneAlias, CompanyPricelist, CompanyBuyergroupRule, BrandDistributor, grouptype, $scope, CheckAuthenticated, toaster, $location, SidebarLoader, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, ngDialog, $cookies, $localStorage)
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

    $scope.dropship_markedUnavailable = false;

    $scope.expepectedDateforNextitemRequired = false;
    $scope.illegal = false;
    $scope.nochange = false;
    $scope.isNotInPeicesMultiple = false;


    vm.CloseDialog = function () {
        ngDialog.close();
    };


    //UpdateCheckBoxUI();


    var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';

    function imageHtml(data, type, full, meta) {
        return '<div style="text-align: center;"><a ng-click="" class="hvr-grow"><img class="loading" src="' + full[2] + '" style="height: 100px; width: 100px;"/></a></div>';
    }

    function SupplierDetail(data, type, full, meta) {
        return '<div class="col-md-6"><a ng-click="OpenCompanyEdit(' + full[1]['seller_company_id'] + ')">' + full[3] + '</a></div>';
    }

    function POlinks(data, type, full, meta)
    {
        var htmlbutton = '';

        var POids = full[4];
        if (POids.length > 0)
        {
            //console.log(POids);
            for (var index = 0; index < POids.length; index++)
            {
                htmlbutton += '<div><a href="#/app/order-detail/?type=salesorders&id=' + POids[index]['id'] + '&name=' + POids[index]['id'] + '" target=_blank >' + POids[index]['order_number'] + '</a></div>';
            }
        }
        //console.log(POids);

        return htmlbutton;
    }

    function callback(json)
    {
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

        //UpdateCheckBoxUI();
    }

    $scope.OpenCompanyEdit = function (companyId) {
        $scope.companyId = companyId;

        ngDialog.open({
            template: 'companydetails_edit',
            scope: $scope,
            className: 'ngdialog-theme-default',
            closeByDocument: false
        });
    }


    $scope.openUpdateItemAvailability = function (id, action_type)
    {
        $scope.orderitem = vm.selectedFullJson[id];
        $scope.actiontype = action_type;
        //console.log($scope.orderitem);

        $scope.expepectedDateforNextitemRequired = false;
        $scope.illegal = false;
        $scope.nochange = false;
        $scope.isNotInPeicesMultiple = false;

        $scope.orderitem.facility_type = $scope.orderitem[1].facility_type;

        $scope.orderitem.readyQty = $scope.orderitem[1]["qty"].ready_to_ship_qty;
        $scope.orderitem.cancelledQty = $scope.orderitem[1]["qty"].unavailable_qty;
        $scope.orderitem.unmarked = parseInt($scope.orderitem[1]["qty"].pending_quantity) - (parseInt($scope.orderitem[1]["qty"].ready_to_ship_qty) + parseInt($scope.orderitem[1]["qty"].unavailable_qty)); // new leogic as per Arvind Shubhanga/Naveen
        $scope.orderitem.pending_quantity = $scope.orderitem[1]["qty"].pending_quantity;

        $scope.orderitem.ready_Qty = $scope.orderitem[1]["qty"].ready_to_ship_qty;
        $scope.orderitem.cancelled_Qty = $scope.orderitem[1]["qty"].unavailable_qty;

        if ($scope.actiontype == 'mark_unavailable') {
            $scope.orderitem.cancelledQty = $scope.orderitem.unmarked;
            $scope.orderitem.readyQty = 0

        }
        else if ($scope.actiontype == 'ready_qty_update') {
            $scope.orderitem.readyQty = $scope.orderitem.unmarked;
            $scope.orderitem.cancelledQty = 0;

        }
        else if ($scope.actiontype == 'expected_date_update') {
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


    };

    $scope.UpdateItemAvailability = function ()
    {
        var item = {};
        $scope.pendingOrderItemsTobeUpdated = [];
        item['order_item_ids'] = $scope.orderitem[1].order_item_ids;
        item['id'] = $scope.orderitem[0];
        item['seller_company_id'] = $scope.orderitem[1].seller_company_id;
        item['product_id'] = $scope.orderitem[10];
        item['size'] = $scope.orderitem[8];


        //item['order_qty'] = $scope.orderitem.order_qty;

        if ($scope.orderitem.readyQty > 0) {
            item['ready_to_ship_qty'] = $scope.orderitem.readyQty;
        }
        if ($scope.orderitem.cancelledQty > 0) {
            item['unavailable_qty'] = $scope.orderitem.cancelledQty;
        }
        if ($scope.orderitem.expectedDate) {
            item['expected_date'] = formatDate($scope.orderitem.expectedDate);
        }
        if ($scope.orderitem.expectedDate && $scope.orderitem.cancelledQty == 0 && $scope.orderitem.readyQty == 0){
            item['unavailable_qty'] = 0;
            item['ready_to_ship_qty'] = 0;
            item['expected_date'] = formatDate($scope.orderitem.expectedDate);
        }
        console.log(item);

        $scope.pendingOrderItemsTobeUpdated.push(item);

        var params = { 'action_type': "bulk_update", 'items': $scope.pendingOrderItemsTobeUpdated };
        console.log(params);

        $(".modelform2").addClass(progressLoader());
        PendingOrderItemsAction.save(params).$promise.then(function (result) {
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

        if (parseInt($scope.orderitem.readyQty) + parseInt($scope.orderitem.cancelledQty) <= unmarked) {
            $scope.illegal = false;

        }
        else {
            $scope.illegal = true;
            $scope.expepectedDateforNextitemRequired = false;

        }

        console.log($scope.illegal + ' , ' + $scope.expepectedDateforNextitemRequired);

        if (parseInt($scope.orderitem.readyQty) == 0 && parseInt($scope.orderitem.cancelledQty) == 0 && $scope.actiontype != 'expected_date_update') {
            $scope.nochange = true;
        }
        else {
            $scope.nochange = false;
        }

        if (parseInt($scope.orderitem[9]) > 1)
        {
            if (parseInt($scope.orderitem.readyQty)%parseInt($scope.orderitem[9]) != 0 || parseInt($scope.orderitem.cancelledQty)%parseInt($scope.orderitem[9]) != 0 )
            {
                $scope.isNotInPeicesMultiple = true;
            }
            else
            {
                $scope.isNotInPeicesMultiple = false;
            }
        }

    }






    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: 'api/pendingorderitemsadmindatatables/',
            type: 'GET',
        })
        .withOption('lengthMenu',[10, 25, 50, 100, 500, 1000])
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
            7: { "type": "text" },
            8: { "type": "text" },
            10: { "type": "text" },
            15: { "type": "dateRange" }


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
            {
                extend: 'csv',
                title: 'Orders',
                exportOptions: {
                    columns: "thead th:not(.noExport)",
                    modifier: { page: 'all', search: 'none' }
                    //columns: ':visible'
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
        DTColumnDefBuilder.newColumnDef(2).withTitle('Image').renderWith(imageHtml).notSortable(),
        DTColumnDefBuilder.newColumnDef(3).withTitle('Seller').renderWith(SupplierDetail),
        DTColumnDefBuilder.newColumnDef(4).withTitle('P.O Number').renderWith(POlinks),
        DTColumnDefBuilder.newColumnDef(5).withTitle('Brand'),
        DTColumnDefBuilder.newColumnDef(6).withTitle('Catalog').notSortable(),
        DTColumnDefBuilder.newColumnDef(7).withTitle('Design No'),
        DTColumnDefBuilder.newColumnDef(8).withTitle('Sizes'),//
        DTColumnDefBuilder.newColumnDef(9).withTitle('No of pieces'),//
        DTColumnDefBuilder.newColumnDef(10).withTitle('Product Code'),//.notSortable(),
        DTColumnDefBuilder.newColumnDef(11).withTitle('Pending since'),
        //DTColumnDefBuilder.newColumnDef(12).withTitle('Pending Qty'),
        DTColumnDefBuilder.newColumnDef(12).withTitle('Pending Qty')
            .renderWith(function (data, type, full, meta) {
                var htmlbutton = '';

                var qty_text = fullSetQtyText(full[12], full[1]['no_of_pcs'])

                htmlbutton += '<div>' + qty_text + '</div>';

                return htmlbutton;
            }),


        DTColumnDefBuilder.newColumnDef(13).withTitle('Ready Qty')
            .renderWith(function (data, type, full, meta) {
                var htmlbutton = '';

                var qty_text = fullSetQtyText(full[13], full[1]['no_of_pcs'])

                if( (parseInt(full[1]['qty'].ready_to_ship_qty)+ parseInt(full[1]['qty'].unavailable_qty) ) >= parseInt(full[1]['qty'].pending_quantity)) {
                    htmlbutton += '<div>' + qty_text + ' </div>';
                }
                else {
                    htmlbutton += '<div>' + qty_text + ' <a href="" ng-click="openUpdateItemAvailability(' + full[0] + ',\'ready_qty_update\')" > Change </a></div>';
                }

                return htmlbutton;
            }),

        DTColumnDefBuilder.newColumnDef(14).withTitle('Unavailable Qty')
            .renderWith(function (data, type, full, meta) {
                var htmlbutton = '';

                var qty_text = fullSetQtyText(full[14], full[1]['no_of_pcs'])

                htmlbutton += '<div>' + qty_text + '</div>';



                return htmlbutton;
            }),





        DTColumnDefBuilder.newColumnDef(15).withTitle('Expected Date').notSortable()
            .renderWith(function (data, type, full, meta) {
                var htmlbutton = '';

                var today = new Date();
                var expctedDate = new Date(full[15]);
                if ((parseInt(full[1]['qty'].ready_to_ship_qty) + parseInt(full[1]['qty'].unavailable_qty)) >= parseInt(full[1]['qty'].pending_quantity))
                {
                    htmlbutton += '<div >' + full[15] + '</div>';
                }
                else if (expctedDate <= today) {
                    htmlbutton += '<div class="changerequired" >' + full[15] + ' <a href="" ng-click="openUpdateItemAvailability(' + full[0] + ',\'expected_date_update\')" > Change required</a></div>';
                }
                else {
                    htmlbutton += '<div >' + full[15] + ' <a href="" ng-click="openUpdateItemAvailability(' + full[0] + ',\'expected_date_update\')" > Change </a></div>';
                }

                return htmlbutton;
            }),
        DTColumnDefBuilder.newColumnDef(16).withTitle('Seller phone').notSortable(),
        DTColumnDefBuilder.newColumnDef(17).withTitle('Other Sellers').notSortable().notVisible(),
        DTColumnDefBuilder.newColumnDef(18).withTitle('Actions').notSortable()
            .renderWith(function (data, type, full, meta) {
                var htmlbutton = '';

                if ( (parseInt(full[1]['qty'].ready_to_ship_qty) + parseInt(full[1]['qty'].unavailable_qty)) >= parseInt(full[1]['qty'].pending_quantity)) {
                    htmlbutton += '<div><button type="button" ng-disabled="true" ng-click="openUpdateItemAvailability(' + full[0] + ',\'mark_unavailable\')" class="styledButtonblue">Mark Unavailable</button></div>';
                }
                else {
                    htmlbutton += '<div><button type="button" ng-click="openUpdateItemAvailability(' + full[0] + ',\'mark_unavailable\')" class="styledButtonblue">Mark Unavailable</button></div>';
                }

                return htmlbutton;
            })

    ];



    /*vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: 'api/pendingorderadmindatatables/',
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
            3: { "type": "text" },
            4: { "type": "select", selected: $stateParams.order_status, values: [{ "value": "Pending", "label": "Pending" }, { "value": "Accepted", "label": "Accepted" }, { "value": "Dispatched", "label": "Dispatched" }, { "value": "Partially Dispatched", "label": "Partially Dispatched" }, { "value": "Delivered", "label": "Delivered"}] },
            6: { "type": "select", selected: $stateParams.facility_status, values: [{ "value": "warehouse", "label": "Warehouse" }, { "value": "dropship", "label": "Dropship" }] },
            7: { "type": "text" },
            8: { "type": "text" }

        })

        .withOption('processing', true)
        .withOption('serverSide', true)
        //.withOption('stateLoadParams', false)
        //.withOption('stateSaveParams', false)
        .withOption('stateSave', true)
        .withOption('stateSaveCallback', function (settings, data) {
            //console.log(JSON.stringify(settings));
            data = datatablesStateSaveCallback(data);
            localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));
        })
        .withOption('stateLoadCallback', function (settings) {
            return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance))
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
                    localStorage.removeItem('DataTables_' + 'catalogs-datatables');
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

        ]);

    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
            .renderWith(function (data, type, full, meta) {
                vm.selected[full[0]] = false;
                vm.selectedFullJson[full[0]] = full;
                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
            }),
        DTColumnDefBuilder.newColumnDef(1).withTitle('Json').notVisible(),
        DTColumnDefBuilder.newColumnDef(2).withTitle('Order No.').renderWith(TitleLink),
        DTColumnDefBuilder.newColumnDef(3).withTitle('P.O No.'),
        DTColumnDefBuilder.newColumnDef(4).withTitle('Status').notSortable(),
        DTColumnDefBuilder.newColumnDef(5).withTitle('Pending since'),
        DTColumnDefBuilder.newColumnDef(6).withTitle('facility type').notSortable(),
        DTColumnDefBuilder.newColumnDef(7).withTitle('Seller Name'),
        DTColumnDefBuilder.newColumnDef(8).withTitle('Seller Number'),
        DTColumnDefBuilder.newColumnDef(9).withTitle('Pending Qty'),
        DTColumnDefBuilder.newColumnDef(10).withTitle('Ready Qty'),
        DTColumnDefBuilder.newColumnDef(11).withTitle('Unavailable Qty'),
        DTColumnDefBuilder.newColumnDef(12).withTitle('Shipment & Invoices').renderWith(Shipmentlink).notSortable(),
        DTColumnDefBuilder.newColumnDef(13).withTitle('Actions').notSortable()
        .renderWith(function (data, type, full, meta)
        {
            var htmlbutton = '';

            htmlbutton += '<div><button type="button" ng-click="Notifyseller(' + full[0] + ',' + full[1].seller_company_id + ',' + full[8] + ')" class="btn btn-block btn-primary mt-lg">Notify seller</button></div>';

            if (full[1].facility_type == 'dropship')
            {
                htmlbutton += '<div><button type="button" ng-click="openCreateShipment(' + full[0] + ',\'create_shipment\')" class="btn btn-block btn-primary mt-lg" >Create Shipment</button></div>';
            }
            else
            {
                //$scope.ordertype = "warehouse";
                htmlbutton += '<div><button type="button" ng-click="openCreateShipment(' + full[0] + ',\'mark_ready_to_ship\')" class="btn btn-block btn-primary mt-lg" >Mark ready to ship</button></div>'
                htmlbutton += '<div><button type="button" ng-click="openCreateShipment(' + full[0] + ',\'mark_unavailable\')" class="btn btn-block btn-primary mt-lg" >Mark unavailable</button></div>';
                htmlbutton += '<div><button type="button" ng-click="openCreateShipment(' + full[0] + ',\'show_shipment\')" class="btn btn-block btn-primary mt-lg" >View Shipment</button></div>';
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

    $(document).ready(function () {
        setTimeout(function () {
            $(".changerequired").parent().parent().css('background', "#f0505030");

            $("table").css('margin-left', "-10px");

        }, 3000);
    });

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

        $("tr td:nth-child(9)").css('width', "18% !important");
        $("tr th:nth-child(7)").css('width', "18% !important");
    });*/


    //Not used Methods


        function blobImageRenameForExtenstion(final_image, assing_to, newname) {
            //console.log(final_image);
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

                    //var blob = dataURItoBlob(image.src);
                    var blob = dataURItoBlob(evt.target.result);
                    var blob2 = dataURItoBlob(image.src);
                    console.log(blob);
                    console.log(blob2);

                    //$scope.invoiceImage = image.src;
                    $scope.invoiceImage = evt.target.result;
                    $scope.invoiceImagethumbnail = blob; //fileFromBlob; //
                    //$scope.cropallow = true;
                    //console.log($scope.invoiceImage);
                    $(".modelform2").removeClass(progressLoader());
                }
            }

        };

        $scope.uploadShippinglable = function (file) {
            console.log(file);

            if (file.type == 'application/pdf') {
                $scope.labelpdffile = file;
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
                    console.log(blob);

                    $scope.labelImage = evt.target.result;
                    $scope.labelImagethumbnail = blob;

                    $(".modelform2").removeClass(progressLoader());
                }
            }

        };


        function TitleLink(data, type, full, meta) {
            return '<a href="#/app/order-detail/?type=salesorders&id=' + full[0] + '&name=' + full[2] + '" target=_blank>' + full[2] + '</a>';
        }

        function Shipmentlink(data, type, full, meta) {
            var htmlbutton = '';
            if (full[1].facility_type == 'dropship') {
                var shipmentids = full[12];
                for (var index = 0; index < shipmentids.length; index++) {
                    //const element = array[index];
                    htmlbutton += '<div><a href="" ng-click="openViewShipment(' + full[0] + ',\'view_created_shipment\',' + shipmentids[index] + ')" >' + shipmentids[index] + '</a></div>';
                }
            }
            else {
                htmlbutton = '&nbsp;';
            }
            return htmlbutton;
        }



        $scope.UnmarkedQty = function (item) {
            //console.log(item);
            var unmarked = parseInt(item.order_item__quantity) - (parseInt(item.ready_to_ship_qty) + parseInt(item.canceled_qty));
            //console.log(unmarked);

            return unmarked;
        }


        $scope.showmessage = function (item, index) {
            console.log(item);
            var unmarked, ctr = 0;

            if (item.is_full_catalog == true || item.is_full_catalog == 'true') {
                unmarked = parseInt($scope.pendingOrderItems222[index].pending_quantity) / parseInt($scope.pendingOrderItems222[index].no_of_pcs);

            }
            else {
                unmarked = parseInt($scope.pendingOrderItems222[index].quantity) - (parseInt($scope.pendingOrderItems222[index].ready_to_ship_qty) + parseInt($scope.pendingOrderItems222[index].canceled_qty));
            }
            console.log(unmarked);
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
            });

            if ($scope.pendingOrderItems.length == ctr) {
                $scope.dropship_markedUnavailable = true;
                console.log('dropship_markedUnavailable ' + $scope.dropship_markedUnavailable);
            }
            else {
                $scope.dropship_markedUnavailable = false;
            }

            console.log($scope.pendingOrderItems);
            //console.log($scope.dimensions);
        }


        $scope.openCreateShipment = function (orderid, action_type) {

            var true_count = 0;
            console.log(orderid);
            $scope.orderid = orderid;
            $scope.actiontype = action_type;
            console.log(action_type);
            $scope.pendingOrderItems = [];
            $scope.pendingOrderItems222 = [];
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
                            obj.ready_to_ship_qty = (parseInt(obj.pending_quantity) / parseInt(obj.no_of_pcs));
                        }
                        else {
                            obj.ready_to_ship_qty = parseInt(obj.pending_quantity);
                        }
                        obj.canceled_qty = 0;

                        console.log(obj);
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

            //console.log($scope.pendingOrderItems);
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
                    var invoiceimage = blobImageRenameForExtenstion($scope.invoiceImage, $scope.invoiceImagethumbnail, "selleinvoiceN.jpg");
                    params['seller_invoice'] = invoiceimage;

                }
                else if ($scope.invoicepdffile) {
                    params['seller_invoice'] = $scope.invoicepdffile;
                }

                if ($scope.labelImage) {
                    var labelimage = blobImageRenameForExtenstion($scope.labelImage, $scope.labelImagethumbnail, "shippinglabelN.jpg");
                    params['shipment_lable'] = labelimage;

                }
                else if ($scope.labelpdffile) {
                    params['shipment_lable'] = $scope.labelpdffile;
                }

                if (!$scope.dropship_markedUnavailable) {
                    params['measures'] = $scope.dimensions;
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
            //var true_count = 0;
            console.log(orderid);
            $scope.orderid = orderid;
            $scope.actiontype = action_type;
            console.log(action_type);
            $scope.shipment_id = shipment_id
            //$scope.invoicepdffile = null;
            //$scope.invoiceImage = null;
            //$scope.invoiceImagethumbnail = null;
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
                /*$scope.invoice = result.seller_invoice;
                if($scope.invoice)
                {
                    console.log($scope.invoice.slice($scope.invoice.length - 3, $scope.invoice.length) );
                    if ($scope.invoice.slice($scope.invoice.length - 3, $scope.invoice.length) == 'pdf')
                    {
                        $scope.invoicepdffile = $scope.invoice;
                    }
                    else
                    {
                        $scope.invoiceImage = $scope.invoice;
                    }
                }*/

                //console.log($scope.invoiceImage);
                //console.log($scope.invoicepdffile);


            });

            ngDialog.openConfirm({
                template: 'view_created_shipment',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });


        };


        $scope.OpenDeleteAttachmentsDialog = function (item) {
            ngDialog.openConfirm({
                template: 'DeleteattAchmentDialog',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });

            $scope.toBeDeletedItem = item;

        }


        $scope.DeleteAttachments = function () {
            var item = $scope.toBeDeletedItem;
            console.log(item);

            $(".modelform3").addClass(progressLoader());

            var params = { 'id': $scope.orderid, 'cid': $scope.company_id, "sub_resource": "pending-order-action", "action_type": "upload_file", 'shipment_id': $scope.shipment_id };
            if (item == 'sellerinvoice') {
                params['seller_invoice'] = null;
                params['remove_invoice'] = true;

            }
            else if (item == 'shippinglabel') {
                params['shipment_lable'] = null;
                params['remove_shipment'] = true;
            }
            console.log(params);


            SalesOrders.save(params).$promise.then(function (result) {
                $(".modelform3").removeClass(progressLoader());
                vm.successtoaster = {
                    type: 'success',
                    title: 'Success',
                    text: 'Invoice has been uploaded.'
                };

                vm.CloseDialog();

                toaster.pop('success', 'Success', 'Attachments have has been uploaded');
                $scope.openViewShipment($scope.orderid, 'view_created_shipment', $scope.shipment_id);

                $scope.reloadData();
            });

        };

        $scope.UploadAttachments = function () {
            $(".modelform3").addClass(progressLoader());

            var params = { 'id': $scope.orderid, 'cid': $scope.company_id, "sub_resource": "pending-order-action", "action_type": "upload_file", 'shipment_id': $scope.shipment_id };
            if ($scope.invoiceImage) {
                var invoiceimage = blobImageRenameForExtenstion($scope.invoiceImage, $scope.invoiceImagethumbnail, "invoiceImage.jpg");
                params['seller_invoice'] = invoiceimage;

            }
            else if ($scope.invoicepdffile) {
                params['seller_invoice'] = $scope.invoicepdffile;
            }

            if ($scope.labelImage) {
                var labelimage = blobImageRenameForExtenstion($scope.labelImage, $scope.labelImagethumbnail, "shippinglabelN.jpg");
                params['shipment_lable'] = labelimage;

            }
            else if ($scope.labelpdffile) {
                params['shipment_lable'] = $scope.labelpdffile;
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

                toaster.pop('success', 'Success', 'Attachments have has been uploaded');
                $scope.reloadData();
            });

        };

        $scope.openInNewTab = function (link) {
            window.open(link, "shipping Label/seller Invoice");
        }

        $scope.Divide = function (x) {
            if (x.is_full_catalog == true || x.is_full_catalog == 'true') {
                var qty = parseInt(x.quantity) / parseInt(x.no_of_pcs);
                //console.log('diveded'+qty);
                return qty;
            }
            else {
                return x.quantity
            }

        }



        $scope.Notifyseller = function (order_id, company_id, sellernumber) {
            $scope.order_id_n = order_id;

            $scope.notifiers_users = []
            $scope.seller_company_id = company_id;
            $scope.seller_company_no = sellernumber;
            vm.notifiers = []
            vm.notifiers.push({ "company_id": $scope.seller_company_id, "phone_number": $scope.seller_company_no })


            vm.notification_label = '';
            vm.notification_message = '';
            vm.notification_entity = '';
            vm.extra_sellers = '';
            vm.extra_sellers = '';
            vm.notify_to = '';
            vm.seller_data = '';
            vm.notification_note = '';
            vm.way = {
                'by_sms': false,
                'by_noti': false
            };

            $(".modelform4").addClass(progressLoader());
            NotificationTemplate.query({ entity_name: "pending_order" }).$promise.then(function (success) {
                $(".modelform4").removeClass(progressLoader());
                $scope.notification_label = success[0];

                vm.notification_title = $scope.notification_label.label.replace("{{order_number}}", $scope.order_id_n);
                console.log(vm.notification_title);
                vm.notification_message = $scope.notification_label.sms_temp.replace("{{order_number}}", $scope.order_id_n);

                ngDialog.open({
                    template: 'notifysellerdailog',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    closeByDocument: false
                });

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

            if (vm.NotifyForm.$valid) {
                $(".modelform4").addClass(progressLoader());
                if (!vm.way.by_sms && !vm.way.by_noti) {
                    $(".modelform4").removeClass(progressLoader());
                    vm.errortoaster = {
                        type: 'error',
                        title: 'Medium',
                        text: 'Please Select a Medium.'
                    };
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    return;
                }
                if (vm.notifiers.length < 1) {
                    $(".modelform4").removeClass(progressLoader());
                    vm.errortoaster = {
                        type: 'error',
                        title: 'Medium',
                        text: 'There should be atleast one reciever.'
                    };
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                    return;
                }


                Notification.save({
                    "notice_template": $scope.notification_label.id,
                    "message": vm.notification_message,
                    "notifier_users": JSON.stringify(vm.notifiers),
                    "extra_ids": vm.extra_sellers,
                    "object_id": $scope.order_id_n,
                    "content_type": vm.notification_entity.content_type,
                    "by_noti": vm.way.by_noti || false,
                    "by_sms": vm.way.by_sms || false,
                    "title": vm.notification_title,
                    "note": vm.notification_note
                },
                    function (success) {
                        $(".modelform4").removeClass(progressLoader());
                        ngDialog.close();
                        vm.successtoaster = {
                            type: 'success',
                            title: 'Success',
                            text: 'Notification Queued successfully.'
                        };
                        toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                        $scope.reloadData();
                        $scope.order = {};
                    });
            }
            else {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Error',
                    text: 'Enter all the details'
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);

            }

        };




}
})();
