(function() {
    'use strict';

    angular
        .module('app.shipment_Invoices')
        .controller('shipment_InvoicesController', shipment_InvoicesController);

    shipment_InvoicesController.$inject = ['$window', '$http', '$resource',  '$scope', '$stateParams', 'Manifest', 'DropshipOrderInvoice', 'Shipments', 'SalesOrders', 'PurchaseOrders', 'OrderInvoice', 'MultiOrder', 'Company',  'ngDialog', 'toaster', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'DTColumnBuilder', '$compile', '$state', 'CheckAuthenticated', '$cookies', '$localStorage', 'Upload'];
    function shipment_InvoicesController($window, $http, $resource,  $scope, $stateParams, Manifest, DropshipOrderInvoice, Shipments, SalesOrders, PurchaseOrders, OrderInvoice, MultiOrder, Company,  ngDialog, toaster, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $compile, $state, CheckAuthenticated, $cookies, $localStorage, Upload) {
        CheckAuthenticated.check();

        var vm = this;
        vm.selected = {};
        vm.selectAll = false;
        vm.toggleAll = toggleAll;
        vm.toggleOne = toggleOne;
        vm.count = 1;
        vm.dtInstance = {};
        vm.selectedFullJson = {};
        $scope.fileNotLoaded = true;
        $scope.shippingProviders = ["Expressbees" ];


        $scope.update_flag = false;
        $scope.company_id = localStorage.getItem('company');
        //$scope.company_id = localStorage.getItem('facility_type');
        console.log($scope.company_id);


        vm.CloseDialog = function() {
            ngDialog.close();
        };
        $scope.openPrintSellerInvoice = function (invoiceid,invoicenumber)
        {
            console.log(invoiceid+","+invoicenumber);
            $scope.invoice = {};
            $scope.invoice.id = invoiceid;
            if($scope.invoice.id != parseInt(invoicenumber)){
              $scope.invoice.number = invoicenumber;
            }
            //$scope.shipment = vm.selectedFullJson[shipmentid];
            ngDialog.open({
                template: 'printsellerinoice',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };
        
        $scope.SubmitPrintSellerInoice = function ()
        {
            console.log('invoiceid:'+ $scope.invoice.id + "   invoice_number:"+ $scope.invoice.number);
            $(".modelform3").addClass(progressLoader());
            DropshipOrderInvoice.patch({'id': $scope.invoice.id, 'invoice_number': $scope.invoice.number, 'cid': $scope.company_id }, function(success){
                $(".modelform3").removeClass(progressLoader());
                ngDialog.close();
                reloadData();
                $window.open('#/pages/printsellerinvoice/?invoice='+$scope.invoice.id,'_blank');
            });
        }
        function TitleLink(data, type, full, meta)
        {
            // if (!$scope.updateUI_called) {
            //     UpdateCheckBoxUI();
            //     $scope.updateUI_called = true;
            // }
            UpdateCheckBoxUI();
            return '<a href="#/app/order-detail/?type=salesorders&id=' + full[5] + '&name=' + full[5] + '">' + full[5] + '</a>';
        }

        $scope.openUploadAttachments = function (shipmentid, filetype)
        {
            console.log(shipmentid);
            $scope.shipment_id = shipmentid;
            $scope.shipment = vm.selectedFullJson[shipmentid];
            $scope.fileNotLoaded = true;

            if (filetype == 'seller_invoice')
            {
                $scope.filetype = 'Seller invoice';
            }
            else if (filetype == 'acknowledgement_copy')
            {
                $scope.filetype = 'Manifest/Acknowledgement copy';
            }
            else
            {
                $scope.filetype = 'Shipping Label';
            }
            console.log($scope.filetype);


            $scope.invoiceImage = null;
            $scope.invoiceImagethumbnail = null;
            $scope.invoicepdffile = null;

            $scope.ackCopyImage = null;
            $scope.ackCopyImagethumbnail = null;
            $scope.ackCopypdffile = null;

            $scope.shippingLabelPdffile = null;
            $scope.shippingLabelImage = null;
            $scope.shippingLabelthumbnail = null;
            console.log($scope.shippingProviders);
            $scope.shipmentDetails = {};



            var params = { 'id': $scope.shipment_id, 'cid': $scope.company_id };
            Shipments.get(params).$promise.then(function (result) {

                $scope.shipmentDetails = result
                console.log($scope.shipmentDetails);

                $scope.shipmentDetails.AWBnumber = result.tracking_number || null;
                $scope.shipmentDetails.logistics_provider = result.logistics_provider || null;
                $scope.shipmentDetails.transporter_courier = result.transporter_courier || null;

            });

            ngDialog.open({
                template: 'UploadAttachments',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        $scope.PrintAttachments = function (shipmentid, filetype)
        {
            console.log(shipmentid);
            $scope.shipment_id = shipmentid;

            $scope.shipmentDetails = {};

            var params = { 'id': $scope.shipment_id, 'cid': $scope.company_id };
            Shipments.get(params).$promise.then(function (result)
            {
                if (filetype == 'shipping_label' && Boolean(result.shipment_lable)) {
                    $scope.shipmentDetails.link = result.shipment_lable;
                    $scope.openInNewTab($scope.shipmentDetails.link)
                }
                else if (filetype == 'seller_invoice' && Boolean(result.seller_invoice))
                {
                    $scope.shipmentDetails.link = result.seller_invoice;
                    $scope.openInNewTab($scope.shipmentDetails.link)
                }
                else
                {
                    vm.errortoaster = {
                        type: 'error',
                        title: 'Shipping Label',
                        text: 'Shipping label has not been uploaded yet'
                    };
                    toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                }

            });
        };

        $scope.loadAttachments = function (file)
        {
            console.log(file);

            if (file.type == 'application/pdf')
            {
                if ($scope.filetype == 'Shipping Label')
                {
                    $scope.shippingLabelPdffile = file;
                    console.log($scope.shippingLabelPdffile);
                }
                else if ($scope.filetype == 'Manifest/Acknowledgement copy')
                {
                    $scope.ackCopypdffile = file;
                    console.log($scope.ackCopypdffile);
                }
                else
                {
                    $scope.invoicepdffile = file;
                    console.log($scope.invoicepdffile);
                }
                $scope.fileNotLoaded = false;

            }
            else
            {
                $(".modelform3").addClass(progressLoader());
                var fr = new FileReader();
                fr.readAsDataURL(file);
                var blob;
                fr.onload = function (evt) {
                    var image = new Image();
                    image.src = fr.result;

                    var blob = dataURItoBlob(evt.target.result);
                    var blob2 = dataURItoBlob(image.src);


                    if ($scope.filetype == 'Shipping Label') {
                        $scope.shippingLabelImage = evt.target.result;
                        $scope.shippingLabelthumbnail = blob;
                    }
                    else if ($scope.filetype == 'Manifest/Acknowledgement copy')
                    {
                      $scope.ackCopyImage = evt.target.result;
                      $scope.ackCopyImagethumbnail = blob;
                    }
                    else {
                        $scope.invoiceImage = evt.target.result;
                        $scope.invoiceImagethumbnail = blob;

                    }
                    $scope.fileNotLoaded = false;

                    $(".modelform3").removeClass(progressLoader());
                }
            }


        };

        $scope.UploadAttachment = function () {

            if ($scope.filetype == 'Seller invoice' && !$scope.invoiceImage && !$scope.invoicepdffile)
            {
                vm.errortoaster = {
                    type: 'error',
                    title: 'shipping Invoice',
                    text: 'Please select shipping invoice '
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                return;
            }
            if ($scope.filetype == 'Manifest/Acknowledgement copy' && !$scope.ackCopyImage && !$scope.ackCopypdffile)
            {
                vm.errortoaster = {
                    type: 'error',
                    title: 'Manifest/Acknowledgement copy',
                    text: 'Please select Manifest/Acknowledgement copy '
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                return;
            }
            if ($scope.filetype == 'Shipping Label' && !$scope.shippingLabelImage && !$scope.shippingLabelPdffile) {
                vm.errortoaster = {
                    type: 'error',
                    title: 'shipping Label',
                    text: 'Please select shipping label'
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
                return;
            }


            var params = { 'id': $scope.shipment_id, 'cid': $scope.company_id, 'invoice': $scope.shipmentDetails.invoice };

            if ($scope.filetype == 'Shipping Label')
            {
                if ($scope.shippingLabelImage) {
                    var invoiceimage = blobImageRenameForExtenstion($scope.shippingLabelImage, $scope.shippingLabelthumbnail, "shippinglabel.jpg");
                    params['shipment_lable'] = invoiceimage;

                }
                else if ($scope.shippingLabelPdffile) {
                    params['shipment_lable'] = $scope.shippingLabelPdffile;
                }
            }
            else if ($scope.filetype == 'Manifest/Acknowledgement copy')
            {
                if ($scope.ackCopyImage) {
                    var acknowledgement_copy_image = blobImageRenameForExtenstion($scope.ackCopyImage, $scope.ackCopyImagethumbnail, "acknowledgement_copy.jpg");
                    params['acknowledgement_copy'] = acknowledgement_copy_image;

                }
                else if ($scope.ackCopypdffile) {
                    params['acknowledgement_copy'] = $scope.ackCopypdffile;
                }
            }
            else if ($scope.filetype == 'Seller invoice')
            {
                if ($scope.invoiceImage) {
                    var invoiceimage = blobImageRenameForExtenstion($scope.invoiceImage, $scope.invoiceImagethumbnail, "sellerinvoice.jpg");
                    params['seller_invoice'] = invoiceimage;

                }
                else if ($scope.invoicepdffile) {
                    params['seller_invoice'] = $scope.invoicepdffile;
                }
            }

            console.log(params);
            $(".modelform3").addClass(progressLoader());

            Shipments.save(params).$promise.then(function (result)
            {
                $(".modelform3").removeClass(progressLoader());
                if ($scope.filetype == 'Shipping Label')
                {
                    vm.successtoaster = {
                        type: 'success',
                        title: 'Success',
                        text: 'shipping Label has been uploaded.'
                    };
                }
                else if ($scope.filetype == 'Manifest/Acknowledgement copy')
                {
                    vm.successtoaster = {
                        type: 'success',
                        title: 'Success',
                        text: 'Manifest/Acknowledgement copy has been uploaded.'
                    };
                }
                else
                {
                    vm.successtoaster = {
                        type: 'success',
                        title: 'Success',
                        text: 'shipping Invoice has been uploaded.'
                    };
                }


                vm.CloseDialog();

                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                reloadData();

            }, function (error) {
                    $(".modelform3").removeClass(progressLoader());
                    vm.successtoaster = {
                        type: 'error',
                        title: 'Success',
                        text: 'shipping Invoice couldn upload because of'+ error
                    };
                }
            );

        };




        function blobImageRenameForExtenstion(final_image, assing_to, newname) {
            //console.log(final_image);
            //console.log(assing_to);
            //console.log(newname);
            var cropblob = Upload.dataUrltoBlob(final_image, assing_to);
            var fileFromBlob = new File([cropblob], newname, { type: "image/jpeg", lastModified: Date.now() });
            console.log(fileFromBlob);
            return fileFromBlob
        }

        $scope.openInNewTab = function (link) {
            window.open(link, "seller Invoice");
        }


        $scope.openUpdateDimensions = function (shipmentid)
        {
            console.log(shipmentid);
            $scope.shipment_id = shipmentid;
            $scope.dimensions = {};
            //$scope.shipment = vm.selectedFullJson[shipmentid];

            var params = { 'id': $scope.shipment_id, 'cid': $scope.company_id };
            Shipments.get(params).$promise.then(function (result) {

                $scope.shipmentDetails = result;
                console.log($scope.shipmentDetails);
                $scope.dimensions.length = parseFloat($scope.shipmentDetails.length);
                $scope.dimensions.width = parseFloat($scope.shipmentDetails.width);
                $scope.dimensions.height = parseFloat($scope.shipmentDetails.height);
                $scope.dimensions.weight = parseFloat($scope.shipmentDetails.weight);

            });

            ngDialog.open({
                template: 'UpdateDimensions',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };

        $scope.updateDimensions = function () {

            var params = { 'id': $scope.shipment_id, 'cid': $scope.company_id };
            params.length = $scope.dimensions.length
            params.width = $scope.dimensions.width;
            params.height = $scope.dimensions.height;
            params.weight = $scope.dimensions.weight ;
            console.log(params);


            $(".modelform3").addClass(progressLoader());

            Shipments.patch(params).$promise.then(function (result) {

                $(".modelform3").removeClass(progressLoader());
                $scope.shipmentDetails = result;
                console.log($scope.shipmentDetails);

                vm.successtoaster = {
                    type: 'success',
                    title: 'Success',
                    text: 'Shipment dimensions have been updated.'
                };
                vm.CloseDialog();

                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                reloadData();

            });

        };




        $scope.openDispatchShipment = function (shipmentid)
        {
            console.log(shipmentid);
            $scope.shipment_id = shipmentid;

            ngDialog.open({
                template: 'DispatchShipment',
                scope: $scope,
                className: 'ngdialog-theme-default',
                closeByDocument: false
            });
        };



        $scope.DispatchShipment = function () {

            var params = { 'id': $scope.shipment_id, 'cid': $scope.company_id, "status": 'Dispatched' };
            console.log(params);


            $(".modelform3").addClass(progressLoader());

            Shipments.patch(params).$promise.then(function (result)
            {
                $(".modelform3").removeClass(progressLoader());
                $scope.shipmentDetails = result;
                console.log($scope.shipmentDetails);

                vm.successtoaster = {
                    type: 'success',
                    title: 'Success',
                    text: 'Shipment Dispatched successfully.'
                };
                vm.CloseDialog();

                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                reloadData();

            });

        };
        vm.CreateManifest = function () {
            var true_count = 0;
            $scope.selectedShipments = [];
            angular.forEach(vm.selected, function (value, key) {
                if (value == true) {
                    true_count++;
                    $scope.selectedShipments.push(key);
                }
            })

            if (true_count > 0)
            {
                console.log($scope.selectedShipments);
                Manifest.save({ 'cid': $scope.company_id, 'sub_resource': "generate", "shipments": $scope.selectedShipments }, 
                function (success)
                {
                  vm.successtoaster = {
                      type: 'success',
                      title: 'Success',
                      text: 'Manifest created successfully.'
                  };
                  
                  toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                  reloadData();
                });
            }
            else {
              $.notify({
                  title: "Failed",
                  message: "Please select one or more row",
              }, {
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
        



        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';

        function reloadData() {
            var resetPaging = false;
            vm.dtInstance.reloadData(callback, resetPaging);
            UpdateCheckBoxUI();
        }

        function callback(json) {
            console.log(json);
            if(json.recordsTotal > 0 && json.data.length == 0){
                //vm.dtInstance.rerender();
                $state.go($state.current, {}, {reload: true});
            }
        }
        $scope.status = "";
        console.log($stateParams.status);
        if($stateParams.status == 1){
          $scope.status = "Ready to Ship";
        }
        vm.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('ajax', {
                            url: '/api/ordershipmentdatatables/',
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
                            2 : { "type":  "text"},
                            3 : { "type": "text" },
                            4 : { "type": "select", values: [{ "value": "dropship", "label": "Dropship" }, { "value": "Warehouse", "label": "Warehouse" }, { "value": "Dropship_backorder", "label": "Dropship backorder" }, { "value": "Warehouse_backorder", "label": "Warehouse backorder" }, { "value": "WBAHMEDABAD", "label": "WB Ahemdabad" }] },
                            5 : { "type" : "text"},
                              7: { "type": "select", selected: $scope.status , values: [{ "value": "Created", "label": "Created" }, { "value": "Ready to Ship", "label": "Ready to Ship" }, { "value": "Manifested", "label": "Manifested" }, { "value": "Dispatched", "label": "Dispatched" }, { "value": "Returned", "label": "Returned" }, { "value": "Delivered", "label": "Delivered" }]},
                            //8: { "type": "select", values: [{ "value": "0", "label": "No" }, { "value":"1","label":"Yes"}]},
                            8: { "type": "text" },
                            9: { "type": "text" },
                            10: { "type": "text" },
                            11: { "type": "text" }
                        })

                        .withOption('processing', true)
                        .withOption('serverSide', true)
                        .withOption('stateSave', true)
                        .withOption('stateSaveCallback', function (settings, data) {
                            //console.log(JSON.stringify(settings));
                            //console.log(settings);
                            data = datatablesStateSaveCallback(data);
                            //localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));
                            localStorage.setItem('DataTables_' + 'shipment_invoices', JSON.stringify(data));
                        })
                        .withOption('stateLoadCallback', function (settings) {
                            return JSON.parse(localStorage.getItem('DataTables_' + 'shipment_invoices'))
                        })
                        .withOption('iDisplayLength', 10)
                        //.withOption('responsive', true)
                        .withOption('scrollX', true)
                        .withOption('scrollY', getDataTableHeight())
                        //.withOption('scrollCollapse', true)
                        .withOption('aaSorting', [0, 'desc']) //Sort by ID Desc

                        .withPaginationType('full_numbers')

                        .withButtons([
                            {
                                text: 'Shipments',
                                key: '1',
                                className: 'tableHeading',
                            },
                            {
                                text: 'Reset Filter',
                                key: '1',
                                className: 'buttonSecondary nocontextAction',
                                action: function (e, dt, node, config) {
                                //localStorage.removeItem('DataTables_' + 'products-datatables');
                                $state.go($state.current, {}, {reload: true});
                                }
                            },
                            'copy',
                            'print',
                            'excel',
                            {
                                text: 'Create Manifest',
                                key: '1',
                                className: 'buttonPrimary',
                                action: function (e, dt, node, config) {
                                    vm.CreateManifest();
                                }
                            },

                        ]);

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle(titleHtml).notSortable()
            .renderWith(function(data, type, full, meta) {
                vm.selected[full[0]] = false;
                vm.selectedFullJson[full[0]] = full;
                return '<input type="checkbox" ng-model="showCase.selected[' + full[0] + ']" ng-click="showCase.toggleOne(showCase.selected)">';
            }),
            DTColumnDefBuilder.newColumnDef(1).withTitle('Json').notVisible(),
            DTColumnDefBuilder.newColumnDef(2).withTitle('Invoice number'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('facility City').notVisible(),
            DTColumnDefBuilder.newColumnDef(4).withTitle('Type').notSortable().notVisible(),
            DTColumnDefBuilder.newColumnDef(5).withTitle('Order number').renderWith(TitleLink),
            DTColumnDefBuilder.newColumnDef(6).withTitle('S.O No.').notVisible(),
            DTColumnDefBuilder.newColumnDef(7).withTitle('Status').notSortable(),
            DTColumnDefBuilder.newColumnDef(8).withTitle('Seller').notVisible(),
            DTColumnDefBuilder.newColumnDef(9).withTitle('Quantity'),
            DTColumnDefBuilder.newColumnDef(10).withTitle('Weight'),
            DTColumnDefBuilder.newColumnDef(11).withTitle('Uniware shipment'),
            DTColumnDefBuilder.newColumnDef(12).withTitle('Tracking details').notSortable(),
            DTColumnDefBuilder.newColumnDef(13).withTitle('Action').notSortable()
            .renderWith(function(data, type, full, meta) {

                var htmlbutton = ''

                if (full[4] === 'dropship')
                {
                    if (full[1].status == 'Created' || full[1].status == 'Ready to Ship' || full[1].status == 'Manifested') {
                        htmlbutton += '<div><button type="button" ng-click="openUpdateDimensions(' + full[0] + ')" class="linkButton">Update Dimensions</button></div>'

                        if (full[1].shipment_lable_url) {
                            htmlbutton += '<div><button type="button" ng-click="PrintAttachments(' + full[0] + ',\'shipping_label\')" class="linkButton">Print shipping label</button></div>'
                        }
                    }

                   /*  if (full[1].status == 'Ready to Ship' && full[1].shipment_lable_url) {
                        htmlbutton += '<div><button type="button" ng-click="openDispatchShipment(' + full[0] + ')" class="linkButton">Dispatch</button></div>'
                    } */
                  /*  if (full[1].shipment_lable_url) {
                        htmlbutton += '<div><button type="button" ng-click="openUploadAttachments(' + full[0] + ',\'acknowledgement_copy\')" class="linkButton">Upload manifest/acknowledgement copy</button></div>'
                    }*/
                    htmlbutton += '<div><button type="button" ng-click="openUploadAttachments(' + full[0] + ',\'seller_invoice\')" class="linkButton">Upload/print sellerInvoice</button></div>'
                    htmlbutton += '<div><button type="button" ng-click="openPrintSellerInvoice(' + full[1]['invoice_id'] + ',\''+ full[2] +'\')" class="linkButton">Print Seller Invoice</button></div>'
                    if (full[1].shipment_lable_url) {
                      htmlbutton += '<div><button type="button" class="linkButton"><a class="linkButton" target="_blank" href="/#/pages/printinvoice/?invoice='+full[1].buyer_invoice_id+'">Print Shipping Invoice</a></button></div>'
                    }
                }

                if(htmlbutton == '')
                    return '&nbsp;';
                else
                    return htmlbutton;
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





        //unused methods

        $scope.UpdateProvider_shippingLabel = function () {
            var params = { 'id': $scope.shipment_id, 'cid': $scope.company_id };
            params.tracking_number = $scope.shipmentDetails.AWBnumber;
            params.logistics_provider = $scope.shipmentDetails.shippingProvider;
            params.transporter_courier = $scope.shipmentDetails.shippingProvider;

            console.log(params);


            $(".modelform3").addClass(progressLoader());

            Shipments.patch(params).$promise.then(function (result) {

                $(".modelform3").removeClass(progressLoader());
                $scope.shipmentDetails = result;
                console.log($scope.shipmentDetails);

                vm.successtoaster = {
                    type: 'success',
                    title: 'Success',
                    text: 'Shipment Provider details updated.'
                };
                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                vm.CloseDialog();

            });


            if (!$scope.shippingLabelImage && !$scope.shippingLabelPdffile) {
                vm.errortoaster = {
                    type: 'error',
                    title: 'shipping Label',
                    text: 'shipping label hasn\'t been uploaded'
                };
                toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
            }


            if ($scope.shippingLabelImage || $scope.shippingLabelPdffile) {
                var labelparams = { 'id': $scope.shipment_id, 'cid': $scope.company_id, 'invoice': $scope.shipmentDetails.invoice };
                if ($scope.shippingLabelImage) {
                    var invoiceimage = blobImageRenameForExtenstion($scope.shippingLabelImage, $scope.shippingLabelthumbnail, "shippinglabel.jpg");
                    labelparams['shipment_lable'] = invoiceimage;

                }
                else if ($scope.shippingLabelPdffile) {
                    labelparams['shipment_lable'] = $scope.shippingLabelPdffile;
                }


                console.log(labelparams);
                $(".modelform3").addClass(progressLoader());

                Shipments.save(labelparams).$promise.then(function (result) {
                    $(".modelform3").removeClass(progressLoader());
                    vm.successtoaster = {
                        type: 'success',
                        title: 'Success',
                        text: 'shipping Invoice has been uploaded.'
                    };
                    vm.CloseDialog();

                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                    reloadData();

                }, function (error) {
                    $(".modelform3").removeClass(progressLoader());
                    vm.successtoaster = {
                        type: 'error',
                        title: 'Success',
                        text: 'shipping Invoice couldnt upload because of' + error
                    };
                    toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                }
                );
            }
            else {
                reloadData();
            }

        };
    }
})();
