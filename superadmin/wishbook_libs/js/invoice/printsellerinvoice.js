(function() {
    'use strict';

    angular
        .module('app.auth')
        .controller('PrintInvoiceController', PrintInvoiceController);

    PrintInvoiceController.$inject = ['$http', '$state', '$stateParams', 'djangoAuth', 'toaster', 'OrderInvoice', '$scope'];
    function PrintInvoiceController($http, $state, $stateParams, djangoAuth, toaster, OrderInvoice, $scope) {
        //CheckAuthenticated.check();

        var vm = this;
        $scope.company_id = localStorage.getItem('company');
        console.log("PrintInvoiceController");
        
        $scope.awbavail = false;
        if($stateParams.invoice != null){
            OrderInvoice.get({'id': $stateParams.invoice, 'cid':$scope.company_id, 'expand':'true'}).$promise.then(function(result){
                vm.invoice = result;
                vm.invoice.invoice_number = result.invoice_number;
                if(vm.invoice.shipments.length > 0) {
                    if (vm.invoice.shipments[0].tracking_number != null && vm.invoice.shipments[0].tracking_number != ""){
                        $scope.awbavail = true;
                        console.log(vm.invoice.shipments[0].tracking_number);
                        // JsBarcode("#awb-barcode", vm.invoice.shipments[0].tracking_number, {
                        //     height: 40
                        // });
                    }
                    else{
                        $scope.awbavail = false;
                    }
                }
                
                vm.invoice.datetime = formatDate(vm.invoice.datetime);
                
                vm.products = [];
                var no = 1
                vm.subtotal = 0;
                vm.totalqty = 0;
                vm.payableamt = 0;
                /*vm.tax = 0;
                vm.grand_total = 0;*/
                
                if(vm.invoice.reseller_order != true)
                {
                    vm.SGST = [];
                    vm.CGST = [];
                    vm.IGST = [];
                    vm.UTGST = [];
                    
                    for(var i=0; i<(result.items.length); i++){
                        var item = result.items[i];
                        /*var tax = parseFloat(parseFloat(item.total_amount)-parseFloat(item.amount));
                        tax = tax.toFixed( 2 )*/
                        var tax = item.rate * item.qty;
                        var title = item.order_item.product_category
                        var sku = ""
                        var hsn = ""
    					          title += " : "+item.order_item.product_catalog
                        
                        if(item.order_item.product_sku != null && item.order_item.product_sku != "" && item.order_item.product_sku != "null")
                            title += " ("+item.order_item.product_sku+")"
                            //sku = item.order_item.product_sku
                        
                        if(item.tax_class_1 != null)
    						            hsn = item.tax_class_1.tax_code.tax_code
                            //sku += " ("+item.tax_class_1.tax_code.tax_code+")"
                        vm.products[i] = {no:no, id:item.id, rate:item.rate, quantity:item.qty, discount:item.discount, image:item.order_item.product_image, sku:sku, title:title, tax:tax, total_amount:item.total_amount, hsn:hsn};
                        
                        if(item.tax_class_1 != null){
                            if(item.tax_class_1.tax_name == "SGST")
                                vm.SGST[i] = item.tax_value_1
                            else if(item.tax_class_1.tax_name == "CGST")
                                vm.CGST[i] = item.tax_value_1
                            else if(item.tax_class_1.tax_name == "IGST")
                                vm.IGST[i] = item.tax_value_1
                            else if(item.tax_class_1.tax_name == "UTGST")
                                vm.UTGST[i] = item.tax_value_1
                        }
                        if(item.tax_class_2 != null){
                            if(item.tax_class_2.tax_name == "SGST")
                                vm.SGST[i] = item.tax_value_2
                            else if(item.tax_class_2.tax_name == "CGST")
                                vm.CGST[i] = item.tax_value_2
                            else if(item.tax_class_2.tax_name == "IGST")
                                vm.IGST[i] = item.tax_value_2
                            else if(item.tax_class_2.tax_name == "UTGST")
                                vm.UTGST[i] = item.tax_value_2
                        }
                        no += 1;
                        vm.subtotal += parseFloat(item.total_amount);
                        vm.totalqty += item.qty;
                    }
                    //vm.payableamt = vm.subtotal + parseFloat(vm.invoice.shipping_charges)
                    vm.subtotal = vm.subtotal.toFixed( 2 );
                    vm.payableamt = vm.invoice.total_amount; //vm.payableamt.toFixed( 2 )
                    vm.payableamtinword = toWords(vm.payableamt);
                    /*vm.tax = vm.subtotal * 18 / 100;
                    vm.grand_total = vm.subtotal // + vm.tax
                    */
                }
                else {  
                    vm.SGST = [];
                    vm.CGST = [];
                    vm.IGST = [];
                    vm.UTGST = [];
                    vm.Taxes = [];
                    
                    for(var i=0; i<(result.items.length); i++){
                        var item = result.items[i];
                        /*var tax = parseFloat(parseFloat(item.total_amount)-parseFloat(item.amount));
                        tax = tax.toFixed( 2 )*/
                        var tax = item.rate * item.qty;
                        
                        var title = item.order_item.product_category
                        var sku = ""
                        var hsn = ""
                        
                        title += " : "+item.order_item.product_catalog
                        
                        if(item.order_item.product_sku != null && item.order_item.product_sku != "" && item.order_item.product_sku != "null")
                            title += " ("+item.order_item.product_sku+")"
                            //sku = item.order_item.product_sku
                        
                        if(item.tax_class_1 != null)
                        hsn = item.tax_class_1.tax_code.tax_code
                            //sku += " ("+item.tax_class_1.tax_code.tax_code+")"
                            
                        var display_amount = 0;
                        if (parseFloat(item.order_item.display_amount) > 0){
                            display_amount = parseFloat(item.order_item.display_amount);
                        }
                        else{
                            display_amount = parseFloat(item.total_amount)*1.5;
                        }
                        
                       // var new_rate = parseFloat(display_amount / item.qty);

                        var tax_percentage = 0;
                        if(item.tax_class_1 != null){
                            tax_percentage = parseFloat(item.tax_class_1.percentage) ;
                        }

                        if(item.tax_class_2 != null){
                            if (parseFloat(item.tax_class_2.percentage) > 0 )
                            {
                                tax_percentage = tax_percentage + parseFloat(item.tax_class_2.percentage) ;
                            }
                        }
                       var new_rate = (display_amount*100)/(100+tax_percentage)/item.qty;

                        vm.Taxes[i]  = new_rate*tax_percentage/100*item.qty;
                
                       // vm.products[i] = {no:no, id:item.id, rate:item.rate, quantity:item.qty, discount:item.discount, image:item.order_item.product_image, sku:sku, title:title, tax:tax, total_amount:item.total_amount, hsn:hsn};
                       display_amount = display_amount.toFixed(2);
                        new_rate = new_rate.toFixed(2);
                         vm.Taxes[i]  = vm.Taxes[i].toFixed(2);

                        vm.products[i] = {no:no, id:item.id, rate:new_rate, quantity:item.qty, discount:item.discount, image:item.order_item.product_image, sku:sku, title:title, tax:tax, total_amount:item.total_amount, hsn:hsn, display_amount: display_amount};
                        no += 1;
                        //vm.subtotal += parseFloat(item.total_amount);
                        vm.subtotal += parseFloat(display_amount);
                        vm.totalqty += item.qty;
                    }
                    
                    //vm.payableamt = vm.subtotal + parseFloat(vm.invoice.shipping_charges)
                    
                    vm.subtotal = vm.subtotal.toFixed(2);
                    //vm.payableamt = vm.invoice.total_amount; //vm.payableamt.toFixed( 2 )
                    
                    vm.payableamtinword = toWords(vm.payableamt);
                    
                    /*vm.tax = vm.subtotal * 18 / 100;
                    
                    vm.grand_total = vm.subtotal // + vm.tax
                    */
                }
            });
        }
    }
})();
