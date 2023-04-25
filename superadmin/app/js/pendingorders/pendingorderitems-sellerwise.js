(function() {
'use strict';

angular
    .module('app.pendingorderitems-sellerwise')
    .controller('pendingorderitemssellerwiseController', pendingorderitemssellerwiseController);
    pendingorderitemssellerwiseController.$inject = ['$state', 'NotificationTemplate', 'Notification', '$stateParams', 'SalesOrders', 'Upload', 'SalesOrdersforInvoice', 'PendingOrderItemsAction', 'Category', 'CompanyPhoneAlias', 'CompanyPricelist', 'CompanyBuyergroupRule', 'BrandDistributor', 'grouptype', '$scope', 'CheckAuthenticated', 'toaster', '$location', 'SidebarLoader', '$rootScope', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', 'ngDialog', '$cookies', '$localStorage'];
    function pendingorderitemssellerwiseController($state, NotificationTemplate, Notification, $stateParams, SalesOrders, Upload, SalesOrdersforInvoice, PendingOrderItemsAction, Category, CompanyPhoneAlias, CompanyPricelist, CompanyBuyergroupRule, BrandDistributor, grouptype, $scope, CheckAuthenticated, toaster, $location, SidebarLoader, $rootScope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, ngDialog, $cookies, $localStorage)
{
    CheckAuthenticated.check();
    var vm = this;

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


    vm.CloseDialog = function () {
        ngDialog.close();
    };


    //UpdateCheckBoxUI();


    var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
    function SupplierDetail(data, type, full, meta) {
        return '<div class="col-md-6"><a ng-click="OpenCompanyEdit(' + full[0] + ')">' + full[3] + '</a></div>';
    }

    function POlinks(data, type, full, meta) {
        var htmlbutton = '';
        var POids = full[4];
        if (POids.length > 0) {
            console.log(POids);
            for (var index = 0; index < POids.length; index++) {
                htmlbutton += '<div><a href="#/app/order-detail/?type=salesorders&id=' + POids[index]['id'] + '&name=' + POids[index]['id'] + '" target=_blank >' + POids[index]['order_number'] + '</a></div>';
            }
        }

        return htmlbutton;
    }


    function callback(json)
    {
        console.log(json);
        if (json.recordsTotal >0 && json.data.length == 0) {
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

    $scope.OpenCompanyEdit = function (companyId)
    {
        $scope.companyId = companyId;

        ngDialog.open({
            template: 'companydetails_edit',
            scope: $scope,
            className: 'ngdialog-theme-default',
            closeByDocument: false
        });

    }

    $scope.Notifyseller = function (company_id, sellernumber) {

        $scope.notifiers_users = []
        $scope.seller_company_id = company_id;
        $scope.seller_company_no = sellernumber;
        $scope.sellerdetails = vm.selectedFullJson[company_id]
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

            if ($scope.notification_label)
            {
                //vm.notification_title = $scope.notification_label.label.replace("{{order_number}}", "");
                vm.notification_title = $scope.notification_label.display;
                console.log(vm.notification_title);
                vm.notification_message = $scope.notification_label.sms_temp.replace("{{seller_name}}", $scope.sellerdetails[3] );
                vm.notification_message = vm.notification_message.replace("{{pending_items_count}}", $scope.sellerdetails[6]);
            }
            else
            {
                vm.notification_title = 'You have pending items to mark for Processing';
                vm.notification_message = "ALERT! there are some pending items that require action. Please process them from the seller panel so that orders related to you can be processed at the earliest."

            }

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
                });
        }
        else
        {
            vm.errortoaster = {
                type: 'error',
                title: 'Error',
                text: 'Enter all the details'
            };
            toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);

        }

    };

    $scope.ShowDetailedPendency = function (company_id)
    {
        var sellername = vm.selectedFullJson[company_id][3];
        console.log(company_id+' , '+ sellername);
        window.location.href = "#/app/pendingorderitems-sellerspecific/?company_id=" + company_id + "&company_name="+sellername;
    }



    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: 'api/sellerwisependingorderdatatables/',
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
            2: { "type": "text" },
            3: { "type": "text" },
            4: { "type": "text" },
            8: { "type": "text" },
            9: { "type": "text" }
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
            localStorage.setItem('DataTables_' + 'pendingorderitemssellerwise', JSON.stringify(data));
        })
        .withOption('stateLoadCallback', function (settings) {
            return JSON.parse(localStorage.getItem('DataTables_' + 'pendingorderitemssellerwise'))
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
                    localStorage.removeItem('DataTables_' + 'pendingorderitemssellerwise');
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
        DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable().notVisible()
            .renderWith(function (data, type, full, meta) {
                vm.selected[full[0]] = false;
                vm.selectedFullJson[full[0]] = full;
                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
            }),
        DTColumnDefBuilder.newColumnDef(1).withTitle('Json').notVisible(),
        DTColumnDefBuilder.newColumnDef(2).withTitle('Comapny id').notSortable(),
        DTColumnDefBuilder.newColumnDef(3).withTitle('Seller').renderWith(SupplierDetail).notSortable(),
        DTColumnDefBuilder.newColumnDef(4).withTitle('P.O Number').renderWith(POlinks).notSortable(),
        DTColumnDefBuilder.newColumnDef(5).withTitle('Oldest pending since').notSortable(),


        DTColumnDefBuilder.newColumnDef(6).withTitle('Pending Qty')
            .renderWith(function (data, type, full, meta) {
                var htmlbutton = '';

                var qty_text = fullSetQtyText(full[6], full[1]['no_of_pcs'])

                htmlbutton += '<div>' + qty_text + '</div>';

                return htmlbutton;
            }),


        DTColumnDefBuilder.newColumnDef(7).withTitle('Ready Qty')
            .renderWith(function (data, type, full, meta) {
                var htmlbutton = '';

                var qty_text = fullSetQtyText(full[7], full[1]['no_of_pcs'])

                if( (parseInt(full[1]['qty'].ready_to_ship_qty)+ parseInt(full[1]['qty'].unavailable_qty) ) >= parseInt(full[1]['qty'].pending_quantity)) {
                    htmlbutton += '<div>' + qty_text + ' </div>';
                }
                else {
                    htmlbutton += '<div>' + qty_text + ' <a href="" ng-click="openUpdateItemAvailability(' + full[0] + ',\'ready_qty_update\')" > Change </a></div>';
                }

                return htmlbutton;
            }),


        DTColumnDefBuilder.newColumnDef(8).withTitle('Seller phone').notSortable(),
        DTColumnDefBuilder.newColumnDef(9).withTitle('Address').notSortable(),
        DTColumnDefBuilder.newColumnDef(10).withTitle('Actions').notSortable()
            .renderWith(function (data, type, full, meta) {
                var htmlbutton = '';

                htmlbutton += '<div><button type="button" ng-click="Notifyseller('+ full[0] + ',' + full[8] + ')" class="styledButtonblue" style="line-height:18px">Notify seller</button></div>';
                htmlbutton += '<div><button type="button" ng-click="ShowDetailedPendency(' + full[0] + ')" class="styledButtongreen" style="line-height:18px">show detailed pendency</button></div>';

                return htmlbutton;
            })

    ];


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

        }, 3000);
    });


    //Not used Methods








}
})();
