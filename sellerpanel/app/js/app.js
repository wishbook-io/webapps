/*!
 *
 * Angle - Bootstrap Admin App + AngularJS
 *
 * Version: 3.2.0
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 *
 */

// APP START
// -----------------------------------

// Start: google analytics code

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-71323896-2', 'auto');
  ga('send', 'pageview');

// End: google analytics code


(function() {
    'use strict';

    angular
        .module('wishbook', [
            'app.core',
            'app.routes',
            'app.sidebar',
            'app.navsearch',
            'app.preloader',
            'app.loadingbar',
            'app.translate',
            'app.settings',
            'app.icons',
            'app.flatdoc',
            'app.notify',
            'app.bootstrapui',
            'app.elements',
            'app.panels',
            //'app.charts',
            'app.forms',
            'app.locale',
            //'app.maps',
            //'app.tables',
            'app.extras',
            //'app.mailbox',
            'app.utils',
            'app.dashboard',
            'app.auth',
            'app.companies',
            'app.mirror',
            'app.becomeseller',
            'app.deeplink',
            'app.marketing',
            'app.seller_statistic',
            'app.orderdashboard',
            'app.merge',
            'app.companies_buyer_supplier',
            'app.order',
            'app.cart',
            'app.products_detail',
            'app.brand_catalogs',
            'app.order_detail',
            'app.cart_detail',
            'app.company',
            'app.companyprofile',
            'app.gst',
            'app.bankdetails',
            'app.discount',
            'app.brandwisediscount',
            'app.userprofile',
            'app.jobs',
            'app.inventoryjobs',
            'app.changepassword',
            'app.contactus',
            'app.brands',
            'app.catalog',
            'app.screens',
            'app.noncatalog',
            'app.browse',
            'app.product',
            'app.setmatchingdetails',
            'app.buyers',
            'app.suppliers',
            'app.buyerenquiry',
            'app.supplierenquiry',
            'app.myenquiry',
            'app.shares',
            'app.salespersons',
            'app.administrators',
            'app.salesorders',
            'app.purchaseorders',
            'app.shipment_Invoices',
            'app.manifests',
            'app.brokerageorders',
            'app.salesordersinvoice',
            'app.rrcrequests',
            'app.refundrequests',
            'app.purchaseordersinvoice',
            'app.skumap',
            'app.inventory',
            'app.registrations',
            'app.companyaccounts',
            'app.salesmanlocation',
            'app.salesmanindividual',
        ]);
})();

(function() {
    'use strict';

    angular
        .module('app.dashboard', []);
})();
(function() {
    'use strict';

    angular
        .module('app.auth', []);
})();

(function() {
    'use strict';

    angular
        .module('app.companies', []);
})();

(function() {
    'use strict';

    angular
        .module('app.mirror', []);
})();
(function() {
    'use strict';

    angular
        .module('app.becomeseller', []);
})();
(function() {
    'use strict';

    angular
        .module('app.deeplink', []);
})();
(function() {
    'use strict';

    angular
        .module('app.marketing', []);
})();
(function() {
    'use strict';

    angular
        .module('app.seller_statistic', []);
})();
(function() {
    'use strict';

    angular
        .module('app.orderdashboard', []);
})();
(function() {
    'use strict';

    angular
        .module('app.merge', []);
})();

(function() {
    'use strict';

    angular
        .module('app.companies_buyer_supplier', []);
})();

(function() {
    'use strict';

    angular
        .module('app.order', []);
})();
(function() {
    'use strict';

    angular
        .module('app.cart', []);
})();

(function() {
    'use strict';
    angular
        .module('app.products_detail', []);
})();

(function () {
    'use strict';

    angular
        .module('app.setmatchingdetails', []);
})();


(function() {
    'use strict';

    angular
        .module('app.brand_catalogs', []);
})();

(function() {
    'use strict';

    angular
        .module('app.order_detail', []);
})();

(function() {
    'use strict';

    angular
        .module('app.cart_detail', []);
})();

(function() {
    'use strict';

    angular
        .module('app.company', []);
})();

(function() {
    'use strict';

    angular
        .module('app.companyprofile', []);
})();

(function() {
    'use strict';

    angular
        .module('app.gst', []);
})();
(function() {
    'use strict';

    angular
        .module('app.bankdetails', []);
})();

(function() {
    'use strict';

    angular
        .module('app.discount', []);
})();

(function () {
    'use strict';

    angular
        .module('app.brandwisediscount', []);
})();

(function() {
    'use strict';

    angular
        .module('app.userprofile', []);
})();

(function() {
    'use strict';

    angular
        .module('app.jobs', []);
})();
(function() {
    'use strict';

    angular
        .module('app.inventoryjobs', []);
})();

(function() {
    'use strict';

    angular
        .module('app.changepassword', []);
})();
(function() {
    'use strict';

    angular
        .module('app.contactus', []);
})();

(function() {
    'use strict';

    angular
        .module('app.brands', []);
})();

(function() {
    'use strict';

    angular
        .module('app.catalog', ['ngSanitize']);
})();
(function() {
    'use strict';

    angular
        .module('app.screens', ['ngSanitize']);
})();
(function() {
    'use strict';

    angular
        .module('app.noncatalog', ['ngSanitize']);
})();
(function() {
    'use strict';

    angular
        .module('app.browse', ['ngSanitize']);
})();
(function() {
    'use strict';

    angular
        .module('app.product', []);
})();

(function() {
    'use strict';

    angular
        .module('app.skumap', []);
})();

(function() {
    'use strict';

    angular
        .module('app.inventory', []);
})();

(function() {
    'use strict';

    angular
        .module('app.buyers', []);
})();

(function() {
    'use strict';

    angular
        .module('app.suppliers', []);
})();

(function() {
    'use strict';

    angular
        .module('app.buyerenquiry', []);
})();

(function() {
    'use strict';

    angular
        .module('app.myleads', []);
})();

(function() {
    'use strict';

    angular
        .module('app.myfollowers', []);
})();

(function () {
    'use strict';

    angular
        .module('app.myviewers', []);
})();

(function() {
    'use strict';

    angular
        .module('app.supplierenquiry', []);
})();

(function() {
    'use strict';

    angular
        .module('app.myenquiry', []);
})();


(function() {
    'use strict';

    angular
        .module('app.shares', []);
})();

(function() {
    'use strict';

    angular
        .module('app.salespersons', []);
})();

(function() {
    'use strict';

    angular
        .module('app.administrators', []);
})();

(function() {
    'use strict';

    angular
        .module('app.registrations', []);
})();

(function() {
    'use strict';

    angular
        .module('app.companyaccounts', []);
})();

(function() {
    'use strict';

    angular
        .module('app.salesmanlocation', []);
})();

(function() {
    'use strict';

    angular
        .module('app.salesmanindividual', []);
})();

(function() {
    'use strict';

    angular
        .module('app.salesorders', []);
})();

(function() {
    'use strict';

    angular
        .module('app.purchaseorders', []);
})();

(function() {
    'use strict';

    angular
        .module('app.brokerageorders', []);
})();

(function() {
    'use strict';

    angular
        .module('app.salesordersinvoice', []);
})();

(function () {
    'use strict';

    angular
        .module('app.shipment_Invoices', []);
})();

(function () {
    'use strict';

    angular
        .module('app.manifests', []);
})();

(function() {
    'use strict';

    angular
        .module('app.rrcrequests', []);
})();

(function() {
    'use strict';

    angular
        .module('app.refundrequests', []);
})();

(function() {
    'use strict';

    angular
        .module('app.purchaseordersinvoice', []);
})();

(function() {
    'use strict';

    angular
        .module('app.bootstrapui', []);
})();
/*
(function() {
    'use strict';

    angular
        .module('app.charts', []);
})();*/
(function() {
    'use strict';

    angular
        .module('app.colors', []);
})();
(function() {
    'use strict';

    angular
        .module('app.core', [
            'ngRoute',
            'ngAnimate',
            'ngStorage',
            'ngCookies',
            'pascalprecht.translate',
            'ui.bootstrap',
            'ui.router',
            'oc.lazyLoad',
            'cfp.loadingBar',
            'ngSanitize',
            'ngResource',
            'tmh.dynamicLocale',
            'ui.utils'
        ]);
})();

(function() {
    'use strict';

    angular
        .module('app.elements', []);
})();
(function() {
    'use strict';

    angular
        .module('app.flatdoc', []);
})();
(function() {
    'use strict';

    angular
        .module('app.extras', []);
})();
(function() {
    'use strict';

    angular
        .module('app.forms', []);
})();
(function() {
    'use strict';

    angular
        .module('app.icons', []);
})();
(function() {
    'use strict';

    angular
        .module('app.lazyload', []);
})();
(function() {
    'use strict';

    angular
        .module('app.loadingbar', []);
})();
(function() {
    'use strict';

    angular
        .module('app.locale', []);
})();/*
(function() {
    'use strict';

    angular
        .module('app.mailbox', []);
})();/*
(function() {
    'use strict';

    angular
        .module('app.maps', []);
})();*/
(function() {
    'use strict';

    angular
        .module('app.navsearch', []);
})();
(function() {
    'use strict';

    angular
        .module('app.notify', []);
})();

(function() {
    'use strict';

    angular
        .module('app.panels', []);
})();
(function() {
    'use strict';

    angular
        .module('app.preloader', []);
})();


(function() {
    'use strict';

    angular
        .module('app.routes', [
            'app.lazyload',
            'toaster'
        ]);
})();
(function() {
    'use strict';

    angular
        .module('app.settings', []);
})();/*
(function() {
    'use strict';

    angular
        .module('app.tables', []);
})();*/
(function() {
    'use strict';

    angular
        .module('app.sidebar', []);
})();
(function() {
    'use strict';

    angular
        .module('app.translate', []);
})();
(function() {
    'use strict';

    angular
        .module('app.utils', [
          'app.colors'
          ]);
})();


(function() {
    'use strict';

    angular
        .module('app.bootstrapui')
        .config(bootstrapuiConfig);

    bootstrapuiConfig.$inject = ['$uibTooltipProvider'];
    function bootstrapuiConfig($uibTooltipProvider){
      $uibTooltipProvider.options({appendToBody: true});
    }
})();


/**=========================================================
 * Module: demo-datepicker.js
 * Provides a simple demo for bootstrap datepicker
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.bootstrapui')
        .controller('DatepickerDemoCtrl', DatepickerDemoCtrl);

    function DatepickerDemoCtrl() {
        var vm = this;

        activate();

        ////////////////

        function activate() {
          vm.today = function() {
            vm.dt = new Date();
          };
          vm.today();

          vm.clear = function () {
            vm.dt = null;
          };

          // Disable weekend selection
          vm.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
          };

          vm.toggleMin = function() {
            vm.minDate = vm.minDate ? null : new Date();
          };
          vm.toggleMin();

          vm.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
          };

          vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
          };

          vm.initDate = new Date('2019-10-20');
          vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
          vm.format = vm.formats[0];
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.colors')
        .constant('APP_COLORS', {
          'primary':                '#5d9cec',
          'success':                '#27c24c',
          'info':                   '#23b7e5',
          'warning':                '#ff902b',
          'danger':                 '#f05050',
          'inverse':                '#131e26',
          'green':                  '#37bc9b',
          'pink':                   '#f532e5',
          'purple':                 '#7266ba',
          'dark':                   '#3a3f51',
          'yellow':                 '#fad732',
          'gray-darker':            '#232735',
          'gray-dark':              '#3a3f51',
          'gray':                   '#dde6e9',
          'gray-light':             '#e4eaec',
          'gray-lighter':           '#edf1f2'
        })
        ;
})();
/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.colors')
        .service('Colors', Colors);

    Colors.$inject = ['APP_COLORS'];
    function Colors(APP_COLORS) {
        this.byName = byName;

        ////////////////

        function byName(name) {
          return (APP_COLORS[name] || '#fff');
        }
    }

})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .config(coreConfig);

    coreConfig.$inject = ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$animateProvider'];
    function coreConfig($controllerProvider, $compileProvider, $filterProvider, $provide, $animateProvider){

      var core = angular.module('app.core');
      // registering components after bootstrap
      core.controller = $controllerProvider.register;
      core.directive  = $compileProvider.directive;
      core.filter     = $filterProvider.register;
      core.factory    = $provide.factory;
      core.service    = $provide.service;
      core.constant   = $provide.constant;
      core.value      = $provide.value;

      // Disables animation on items with class .ng-no-animation
      $animateProvider.classNameFilter(/^((?!(ng-no-animation)).)*$/);

    }

})();
/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('APP_MEDIAQUERY', {
          'desktopLG':             1200,
          'desktop':                992,
          'tablet':                 768,
          'mobile':                 480
        })
      ;

})();
(function() {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    appRun.$inject = ['$rootScope', '$state', '$stateParams',  '$window', '$templateCache', '$cacheFactory' ,'Colors'];

    function appRun($rootScope, $state, $stateParams, $window, $templateCache, $cacheFactory, Colors) {

      // Set reference to access them from any scope
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.$storage = $window.localStorage;

    /*  $rootScope.$on('$viewContentLoaded', function() {
          $templateCache.removeAll();
          alert("cache removed");
       });*/

       /* $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (typeof(current) !== 'undefined'){
            $templateCache.remove(current.templateUrl);
            alert("cleared");
        }
        });*/

       /* $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          if (typeof(toState) !== 'undefined'){
           // $templateCache.remove(toState.templateUrl);
            //alert(toState.templateUrl);
           // $cacheFactory(toState.templateUrl).removeAll();
            $templateCache.removeAll();
          }
        });*/

      // Uncomment this to disable template cache
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          if (typeof(toState) !== 'undefined'){
             $templateCache.remove(toState.templateUrl);
             //alert(toState.templateUrl);
          }
      });




      // Allows to use branding color with interpolation
      // {{ colorByName('primary') }}
      $rootScope.colorByName = Colors.byName;

      // cancel click event easily
      $rootScope.cancel = function($event) {
        $event.stopPropagation();
      };

      // Hooks Example
      // -----------------------------------

      // Hook not found
      $rootScope.$on('$stateNotFound',
        function(event, unfoundState/*, fromState, fromParams*/) {
            console.log(unfoundState.to); // "lazy.state"
            console.log(unfoundState.toParams); // {a:1, b:2}
            console.log(unfoundState.options); // {inherit:false} + default options
        });
      // Hook error
      $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error){
          console.log(error);
        });
      // Hook success
      $rootScope.$on('$stateChangeSuccess',
        function(/*event, toState, toParams, fromState, fromParams*/) {
          // display new view from top
          $window.scrollTo(0, 0);
          // Save the route title
          $rootScope.currTitle = $state.current.title;
        });

      // Load a title dynamically
      $rootScope.currTitle = $state.current.title;
      $rootScope.pageTitle = function() {
        var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
        document.title = title;
        return title;
      };

    }

})();



/**=========================================================
 * Module: demo-dialog.js
 * Demo for multiple ngDialog Usage
 * - ngDialogProvider for default values not supported
 *   using lazy loader. Include plugin in base.js instead.
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.elements')
        .controller('DialogIntroCtrl', DialogIntroCtrl)
        .controller('DialogMainCtrl', DialogMainCtrl)
        .controller('InsideCtrl', InsideCtrl)
        .controller('SecondModalCtrl', SecondModalCtrl);

    DialogIntroCtrl.$inject = ['$scope', 'ngDialog', 'tpl'];
    // Called from the route state. 'tpl' is resolved before
    function DialogIntroCtrl($scope, ngDialog, tpl) {

        activate();

        ////////////////

        function activate() {
          // share with other controllers
          $scope.tpl = tpl;
          // open dialog window
          ngDialog.open({
            template: tpl.path,
            // plain: true,
            className: 'ngdialog-theme-default'
          });
        }
    }

    DialogMainCtrl.$inject = ['$scope', '$rootScope', 'ngDialog'];
    // Loads from view
    function DialogMainCtrl($scope, $rootScope, ngDialog) {

        activate();

        ////////////////

        function activate() {
          $rootScope.jsonData = '{"foo": "bar"}';
          $rootScope.theme = 'ngdialog-theme-default';

          $scope.directivePreCloseCallback = function (value) {
            if(confirm('Close it? MainCtrl.Directive. (Value = ' + value + ')')) {
              return true;
            }
            return false;
          };

          $scope.preCloseCallbackOnScope = function (value) {
            if(confirm('Close it? MainCtrl.OnScope (Value = ' + value + ')')) {
              return true;
            }
            return false;
          };

          $scope.open = function () {
            ngDialog.open({ template: 'firstDialogId', controller: 'InsideCtrl', data: {foo: 'some data'} });
          };

          $scope.openDefault = function () {
            ngDialog.open({
              template: 'firstDialogId',
              controller: 'InsideCtrl',
              className: 'ngdialog-theme-default'
            });
          };

          $scope.openDefaultWithPreCloseCallbackInlined = function () {
            ngDialog.open({
              template: 'firstDialogId',
              controller: 'InsideCtrl',
              className: 'ngdialog-theme-default',
              preCloseCallback: function(value) {
                if (confirm('Close it?  (Value = ' + value + ')')) {
                  return true;
                }
                return false;
              }
            });
          };

          $scope.openConfirm = function () {
            ngDialog.openConfirm({
              template: 'modalDialogId',
              className: 'ngdialog-theme-default'
            }).then(function (value) {
              console.log('Modal promise resolved. Value: ', value);
            }, function (reason) {
              console.log('Modal promise rejected. Reason: ', reason);
            });
          };

          $scope.openConfirmWithPreCloseCallbackOnScope = function () {
            ngDialog.openConfirm({
              template: 'modalDialogId',
              className: 'ngdialog-theme-default',
              preCloseCallback: 'preCloseCallbackOnScope',
              scope: $scope
            }).then(function (value) {
              console.log('Modal promise resolved. Value: ', value);
            }, function (reason) {
              console.log('Modal promise rejected. Reason: ', reason);
            });
          };

          $scope.openConfirmWithPreCloseCallbackInlinedWithNestedConfirm = function () {
            ngDialog.openConfirm({
              template: 'dialogWithNestedConfirmDialogId',
              className: 'ngdialog-theme-default',
              preCloseCallback: function(/*value*/) {

                var nestedConfirmDialog = ngDialog.openConfirm({
                  template:
                      '<p>Are you sure you want to close the parent dialog?</p>' +
                      '<div>' +
                        '<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">No' +
                        '<button type="button" class="btn btn-primary" ng-click="confirm(1)">Yes' +
                      '</button></div>',
                  plain: true,
                  className: 'ngdialog-theme-default'
                });

                return nestedConfirmDialog;
              },
              scope: $scope
            })
            .then(function(value){
              console.log('resolved:' + value);
              // Perform the save here
            }, function(value){
              console.log('rejected:' + value);

            });
          };

          $scope.openInlineController = function () {
            $rootScope.theme = 'ngdialog-theme-default';

            ngDialog.open({
              template: 'withInlineController',
              controller: ['$scope', '$timeout', function ($scope, $timeout) {
                var counter = 0;
                var timeout;
                function count() {
                  $scope.exampleExternalData = 'Counter ' + (counter++);
                  timeout = $timeout(count, 450);
                }
                count();
                $scope.$on('$destroy', function () {
                  $timeout.cancel(timeout);
                });
              }],
              className: 'ngdialog-theme-default'
            });
          };

          $scope.openTemplate = function () {
            $scope.value = true;

            ngDialog.open({
              template: $scope.tpl.path,
              className: 'ngdialog-theme-default',
              scope: $scope
            });
          };

          $scope.openTemplateNoCache = function () {
            $scope.value = true;

            ngDialog.open({
              template: $scope.tpl.path,
              className: 'ngdialog-theme-default',
              scope: $scope,
              cache: false
            });
          };

          $scope.openTimed = function () {
            var dialog = ngDialog.open({
              template: '<p>Just passing through!</p>',
              plain: true,
              closeByDocument: false,
              closeByEscape: false
            });
            setTimeout(function () {
              dialog.close();
            }, 2000);
          };

          $scope.openNotify = function () {
            var dialog = ngDialog.open({
              template:
                '<p>You can do whatever you want when I close, however that happens.</p>' +
                '<div><button type="button" class="btn btn-primary" ng-click="closeThisDialog(1)">Close Me</button></div>',
              plain: true
            });
            dialog.closePromise.then(function (data) {
              console.log('ngDialog closed' + (data.value === 1 ? ' using the button' : '') + ' and notified by promise: ' + data.id);
            });
          };

          $scope.openWithoutOverlay = function () {
            ngDialog.open({
              template: '<h2>Notice that there is no overlay!</h2>',
              className: 'ngdialog-theme-default',
              plain: true,
              overlay: false
            });
          };

          $rootScope.$on('ngDialog.opened', function (e, $dialog) {
            console.log('ngDialog opened: ' + $dialog.attr('id'));
          });

          $rootScope.$on('ngDialog.closed', function (e, $dialog) {
            console.log('ngDialog closed: ' + $dialog.attr('id'));
          });

          $rootScope.$on('ngDialog.closing', function (e, $dialog) {
            console.log('ngDialog closing: ' + $dialog.attr('id'));
          });
        }

    } // DialogMainCtrl


    InsideCtrl.$inject = ['$scope', 'ngDialog'];
    function InsideCtrl($scope, ngDialog) {

        activate();

        ////////////////

        function activate() {
          $scope.dialogModel = {
            message : 'message from passed scope'
          };
          $scope.openSecond = function () {
            ngDialog.open({
              template: '<p class="lead m0"><a href="" ng-click="closeSecond()">Close all by click here!</a></h3>',
              plain: true,
              closeByEscape: false,
              controller: 'SecondModalCtrl'
            });
          };
        }
    }

    SecondModalCtrl.$inject = ['$scope', 'ngDialog'];
    function SecondModalCtrl($scope, ngDialog) {

        activate();

        ////////////////

        function activate() {
          $scope.closeSecond = function () {
            ngDialog.close();
          };
        }

    }


})();






/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.elements')
        .controller('AbnTestController', AbnTestController);

    AbnTestController.$inject = ['$timeout', '$resource'];
    function AbnTestController($timeout, $resource) {
        var vm = this;

        activate();

        ////////////////

        /*jshint -W106*/
        function activate() {
          vm.my_tree_handler = function(branch) {

            vm.output = 'You selected: ' + branch.label;

            if (branch.data && branch.data.description) {
              vm.output += '(' + branch.data.description + ')';
              return vm.output;
            }
          };

          // onSelect event handlers
          var apple_selected = function(branch) {
            vm.output = 'APPLE! : ' + branch.label;
            return vm.output;
          };

          var treedata_avm = [
            {
              label: 'Animal',
              children: [
                {
                  label: 'Dog',
                  data: {
                    description: 'man\'s best friend'
                  }
                }, {
                  label: 'Cat',
                  data: {
                    description: 'Felis catus'
                  }
                }, {
                  label: 'Hippopotamus',
                  data: {
                    description: 'hungry, hungry'
                  }
                }, {
                  label: 'Chicken',
                  children: ['White Leghorn', 'Rhode Island Red', 'Jersey Giant']
                }
              ]
            }, {
              label: 'Vegetable',
              data: {
                definition: 'A plant or part of a plant used as food, typically as accompaniment to meat or fish, such as a cabbage, potato, carrot, or bean.',
                data_can_contain_anything: true
              },
              onSelect: function(branch) {
                vm.output = 'Vegetable: ' + branch.data.definition;
                return vm.output;
              },
              children: [
                {
                  label: 'Oranges'
                }, {
                  label: 'Apples',
                  children: [
                    {
                      label: 'Granny Smith',
                      onSelect: apple_selected
                    }, {
                      label: 'Red Delicous',
                      onSelect: apple_selected
                    }, {
                      label: 'Fuji',
                      onSelect: apple_selected
                    }
                  ]
                }
              ]
            }, {
              label: 'Mineral',
              children: [
                {
                  label: 'Rock',
                  children: ['Igneous', 'Sedimentary', 'Metamorphic']
                }, {
                  label: 'Metal',
                  children: ['Aluminum', 'Steel', 'Copper']
                }, {
                  label: 'Plastic',
                  children: [
                    {
                      label: 'Thermoplastic',
                      children: ['polyethylene', 'polypropylene', 'polystyrene', ' polyvinyl chloride']
                    }, {
                      label: 'Thermosetting Polymer',
                      children: ['polyester', 'polyurethane', 'vulcanized rubber', 'bakelite', 'urea-formaldehyde']
                    }
                  ]
                }
              ]
            }
          ];

          var treedata_geography = [
            {
              label: 'North America',
              children: [
                {
                  label: 'Canada',
                  children: ['Toronto', 'Vancouver']
                }, {
                  label: 'USA',
                  children: ['New York', 'Los Angeles']
                }, {
                  label: 'Mexico',
                  children: ['Mexico City', 'Guadalajara']
                }
              ]
            }, {
              label: 'South America',
              children: [
                {
                  label: 'Venezuela',
                  children: ['Caracas', 'Maracaibo']
                }, {
                  label: 'Brazil',
                  children: ['Sao Paulo', 'Rio de Janeiro']
                }, {
                  label: 'Argentina',
                  children: ['Buenos Aires', 'Cordoba']
                }
              ]
            }
          ];

          vm.my_data = treedata_avm;
          vm.try_changing_the_tree_data = function() {
            if (vm.my_data === treedata_avm) {
              vm.my_data = treedata_geography;
            } else {
              vm.my_data = treedata_avm;
            }
            return vm.my_data;
          };

          var tree;
          // This is our API control variable
          vm.my_tree = tree = {};
          vm.try_async_load = function() {

            vm.my_data = [];
            vm.doing_async = true;

            // Request tree data via $resource
            var remoteTree = $resource('server/treedata.json');

            return remoteTree.get(function(res){

              vm.my_data = res.data;

              vm.doing_async = false;

              return tree.expand_all();

            // we must return a promise so the plugin
            // can watch when it's resolved
            }).$promise;
          };

          // Adds a new branch to the tree
          vm.try_adding_a_branch = function() {
            var b;
            b = tree.get_selected_branch();
            return tree.add_branch(b, {
              label: 'New Branch',
              data: {
                something: 42,
                'else': 43
              }
            });
          };

        }
    }
})();



/**=========================================================
 * Module: scroll.js
 * Make a content box scrollable
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.elements')
        .directive('scrollable', scrollable);

    function scrollable () {
        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;

        function link(scope, element, attrs) {
          var defaultHeight = 250;
          element.slimScroll({
              height: (attrs.height || defaultHeight)
          });
        }
    }

})();


/**=========================================================
 * Module: sweetalert.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.elements')
        .controller('SweetAlertController', SweetAlertController);

    SweetAlertController.$inject = ['SweetAlert'];
    function SweetAlertController(SweetAlert) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
          vm.demo1 = function() {
            SweetAlert.swal('Here\'s a message');
          };

          vm.demo2 = function() {
            SweetAlert.swal('Here\'s a message!', 'It\'s pretty, isn\'t it?');
          };

          vm.demo3 = function() {
            SweetAlert.swal('Good job!', 'You clicked the button!', 'success');
          };

          vm.demo4 = function() {
            SweetAlert.swal({
              title: 'Are you sure?',
              text: 'Your will not be able to recover this imaginary file!',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#DD6B55',
              confirmButtonText: 'Yes, delete it!',
              closeOnConfirm: false
            },  function(){
              SweetAlert.swal('Booyah!');
            });
          };

          vm.demo5 = function() {
            SweetAlert.swal({
              title: 'Are you sure?',
              text: 'Your will not be able to recover this imaginary file!',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#DD6B55',
              confirmButtonText: 'Yes, delete it!',
              cancelButtonText: 'No, cancel plx!',
              closeOnConfirm: false,
              closeOnCancel: false
            }, function(isConfirm){
              if (isConfirm) {
                SweetAlert.swal('Deleted!', 'Your imaginary file has been deleted.', 'success');
              } else {
                SweetAlert.swal('Cancelled', 'Your imaginary file is safe :)', 'error');
              }
            });
          };

          vm.demo6 = function() {
            SweetAlert.swal({
              title: 'Sweet!',
              text: 'Here\'s a custom image.',
              imageUrl: 'http://oitozero.com/img/avatar.jpg'
            });
          };
        }
    }
})();

/**=========================================================
 * Module: demo-toaster.js
 * Demos for toaster notifications
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.elements')
        .controller('ToasterDemoCtrl', ToasterDemoCtrl);

    ToasterDemoCtrl.$inject = ['toaster'];
    function ToasterDemoCtrl(toaster) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
          vm.toaster = {
              type:  'success',
              title: 'Title',
              text:  'Message'
          };

          vm.pop = function() {
            toaster.pop(vm.toaster.type, vm.toaster.title, vm.toaster.text);
          };
        }
    }
})();


/**=========================================================
 * Module: calendar-ui.js
 * This script handle the calendar demo with draggable
 * events and events creations
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.extras')
        .directive('calendar', calendar);

    calendar.$inject = ['$rootScope'];
    function calendar ($rootScope) {
        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;

        function link(scope, element) {

          if(!$.fn.fullCalendar) return;

          // The element that will display the calendar
          var calendar = element;

          var demoEvents = createDemoEvents();

          initExternalEvents(calendar);

          initCalendar(calendar, demoEvents, $rootScope.app.layout.isRTL);
        }
    }


    // global shared var to know what we are dragging
    var draggingEvent = null;


    /**
     * ExternalEvent object
     * @param jQuery Object elements Set of element as jQuery objects
     */
    function ExternalEvent(elements) {

        if (!elements) return;

        elements.each(function() {
            var $this = $(this);
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var calendarEventObject = {
                title: $.trim($this.text()) // use the element's text as the event title
            };

            // store the Event Object in the DOM element so we can get to it later
            $this.data('calendarEventObject', calendarEventObject);

            // make the event draggable using jQuery UI
            $this.draggable({
                zIndex: 1070,
                revert: true, // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            });

        });
    }

    /**
     * Invoke full calendar plugin and attach behavior
     * @param  jQuery [calElement] The calendar dom element wrapped into jQuery
     * @param  EventObject [events] An object with the event list to load when the calendar displays
     */
    function initCalendar(calElement, events, isRTL) {

        // check to remove elements from the list
        var removeAfterDrop = $('#remove-after-drop');

        calElement.fullCalendar({
            isRTL: isRTL,
            header: {
                left:   'prev,next today',
                center: 'title',
                right:  'month,agendaWeek,agendaDay'
            },
            buttonIcons: { // note the space at the beginning
                prev:    ' fa fa-caret-left',
                next:    ' fa fa-caret-right'
            },
            buttonText: {
                today: 'today',
                month: 'month',
                week:  'week',
                day:   'day'
            },
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar
            drop: function(date, allDay) { // this function is called when something is dropped

                var $this = $(this),
                    // retrieve the dropped element's stored Event Object
                    originalEventObject = $this.data('calendarEventObject');

                // if something went wrong, abort
                if(!originalEventObject) return;

                // clone the object to avoid multiple events with reference to the same object
                var clonedEventObject = $.extend({}, originalEventObject);

                // assign the reported date
                clonedEventObject.start = date;
                clonedEventObject.allDay = allDay;
                clonedEventObject.backgroundColor = $this.css('background-color');
                clonedEventObject.borderColor = $this.css('border-color');

                // render the event on the calendar
                // the last `true` argument determines if the event "sticks"
                // (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                calElement.fullCalendar('renderEvent', clonedEventObject, true);

                // if necessary remove the element from the list
                if(removeAfterDrop.is(':checked')) {
                  $this.remove();
                }
            },
            eventDragStart: function (event/*, js, ui*/) {
              draggingEvent = event;
            },
            // This array is the events sources
            events: events
        });
    }

    /**
     * Inits the external events panel
     * @param  jQuery [calElement] The calendar dom element wrapped into jQuery
     */
    function initExternalEvents(calElement){
      // Panel with the external events list
      var externalEvents = $('.external-events');

      // init the external events in the panel
      new ExternalEvent(externalEvents.children('div'));

      // External event color is danger-red by default
      var currColor = '#f6504d';
      // Color selector button
      var eventAddBtn = $('.external-event-add-btn');
      // New external event name input
      var eventNameInput = $('.external-event-name');
      // Color switchers
      var eventColorSelector = $('.external-event-color-selector .circle');

      // Trash events Droparea
      $('.external-events-trash').droppable({
        accept:       '.fc-event',
        activeClass:  'active',
        hoverClass:   'hovered',
        tolerance:    'touch',
        drop: function(event, ui) {

          // You can use this function to send an ajax request
          // to remove the event from the repository

          if(draggingEvent) {
            var eid = draggingEvent.id || draggingEvent._id;
            // Remove the event
            calElement.fullCalendar('removeEvents', eid);
            // Remove the dom element
            ui.draggable.remove();
            // clear
            draggingEvent = null;
          }
        }
      });

      eventColorSelector.click(function(e) {
          e.preventDefault();
          var $this = $(this);

          // Save color
          currColor = $this.css('background-color');
          // De-select all and select the current one
          eventColorSelector.removeClass('selected');
          $this.addClass('selected');
      });

      eventAddBtn.click(function(e) {
          e.preventDefault();

          // Get event name from input
          var val = eventNameInput.val();
          // Dont allow empty values
          if ($.trim(val) === '') return;

          // Create new event element
          var newEvent = $('<div/>').css({
                              'background-color': currColor,
                              'border-color':     currColor,
                              'color':            '#fff'
                          })
                          .html(val);

          // Prepends to the external events list
          externalEvents.prepend(newEvent);
          // Initialize the new event element
          new ExternalEvent(newEvent);
          // Clear input
          eventNameInput.val('');
      });
    }

    /**
     * Creates an array of events to display in the first load of the calendar
     * Wrap into this function a request to a source to get via ajax the stored events
     * @return Array The array with the events
     */
    function createDemoEvents() {
      // Date for the calendar events (dummy data)
      var date = new Date();
      var d = date.getDate(),
          m = date.getMonth(),
          y = date.getFullYear();

      return  [
                {
                    title: 'All Day Event',
                    start: new Date(y, m, 1),
                    backgroundColor: '#f56954', //red
                    borderColor: '#f56954' //red
                },
                {
                    title: 'Long Event',
                    start: new Date(y, m, d - 5),
                    end: new Date(y, m, d - 2),
                    backgroundColor: '#f39c12', //yellow
                    borderColor: '#f39c12' //yellow
                },
                {
                    title: 'Meeting',
                    start: new Date(y, m, d, 10, 30),
                    allDay: false,
                    backgroundColor: '#0073b7', //Blue
                    borderColor: '#0073b7' //Blue
                },
                {
                    title: 'Lunch',
                    start: new Date(y, m, d, 12, 0),
                    end: new Date(y, m, d, 14, 0),
                    allDay: false,
                    backgroundColor: '#00c0ef', //Info (aqua)
                    borderColor: '#00c0ef' //Info (aqua)
                },
                {
                    title: 'Birthday Party',
                    start: new Date(y, m, d + 1, 19, 0),
                    end: new Date(y, m, d + 1, 22, 30),
                    allDay: false,
                    backgroundColor: '#00a65a', //Success (green)
                    borderColor: '#00a65a' //Success (green)
                },
                {
                    title: 'Open Google',
                    start: new Date(y, m, 28),
                    end: new Date(y, m, 29),
                    url: '//google.com/',
                    backgroundColor: '#3c8dbc', //Primary (light-blue)
                    borderColor: '#3c8dbc' //Primary (light-blue)
                }
            ];
    }

})();

/**=========================================================
 * Module: masked,js
 * Initializes the masked inputs
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.forms')
        .directive('masked', masked);

    function masked () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          var $elem = $(element);
          if($.fn.inputmask)
            $elem.inputmask();
        }
    }

})();


/**=========================================================
 * Module: tags-input.js
 * Initializes the tag inputs plugin
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.forms')
        .directive('tagsinput', tagsinput);

    tagsinput.$inject = ['$timeout'];
    function tagsinput ($timeout) {
        var directive = {
            link: link,
            require: 'ngModel',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs, ngModel) {
          element.on('itemAdded itemRemoved', function(){
            // check if view value is not empty and is a string
            // and update the view from string to an array of tags
            if(ngModel.$viewValue && ngModel.$viewValue.split) {
              ngModel.$setViewValue( ngModel.$viewValue.split(',') );
              ngModel.$render();
            }
          });

          $timeout(function(){
            element.tagsinput();
          });
        }
    }

})();


/**=========================================================
 * Module: validate-form.js
 * Initializes the validation plugin Parsley
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.forms')
        .directive('validateForm', validateForm);

    function validateForm () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          var $elem = $(element);
          if($.fn.parsley)
            $elem.parsley();
        }
    }

})();

/**=========================================================
 * Module: skycons.js
 * Include any animated weather icon from Skycons
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.icons')
        .directive('skycon', skycon);

    function skycon () {

        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
          var skycons = new Skycons({'color': (attrs.color || 'white')});

          element.html('<canvas width="' + attrs.width + '" height="' + attrs.height + '"></canvas>');

          skycons.add(element.children()[0], attrs.skycon);

          skycons.play();
        }
    }

})();

(function() {
    'use strict';

    angular
        .module('app.lazyload')
        .config(lazyloadConfig);

    lazyloadConfig.$inject = ['$ocLazyLoadProvider', 'APP_REQUIRES'];
    function lazyloadConfig($ocLazyLoadProvider, APP_REQUIRES){

      // Lazy Load modules configuration
      $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: APP_REQUIRES.modules
      });

    }
})();
(function() {
    'use strict';

    angular
        .module('app.lazyload')
        .constant('APP_REQUIRES', {
          // jQuery based and standalone scripts
          scripts: {
            'whirl':              ['vendor/whirl/dist/whirl.css'],
            'classyloader':       ['vendor/jquery-classyloader/js/jquery.classyloader.min.js'],
            'animo':              ['vendor/animo.js/animo.js'],
            'fastclick':          ['vendor/fastclick/lib/fastclick.js'],
            'modernizr':          ['vendor/modernizr/modernizr.custom.js'],
            'animate':            ['vendor/animate.css/animate.min.css'],
            'skycons':            ['vendor/skycons/skycons.js'],
            'icons':              ['vendor/fontawesome/css/font-awesome.min.css',
                                   'vendor/simple-line-icons/css/simple-line-icons.css'],
            'weather-icons':      ['vendor/weather-icons/css/weather-icons.min.css',
                                   'vendor/weather-icons/css/weather-icons-wind.min.css'],
            'sparklines':         ['vendor/sparkline/index.js'],
            'wysiwyg':            ['vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                                   'vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
            'slimscroll':         ['vendor/slimScroll/jquery.slimscroll.min.js'],
            'screenfull':         ['vendor/screenfull/dist/screenfull.js'],
            'vector-map':         ['vendor/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
                                   'vendor/ika.jvectormap/jquery-jvectormap-1.2.2.css'],
            'vector-map-maps':    ['vendor/ika.jvectormap/jquery-jvectormap-world-mill-en.js',
                                   'vendor/ika.jvectormap/jquery-jvectormap-us-mill-en.js'],
            'loadGoogleMapsJS':   ['vendor/load-google-maps/load-google-maps.js'],
            'flot-chart':         ['vendor/Flot/jquery.flot.js'],
            'flot-chart-plugins': ['vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
                                   'vendor/Flot/jquery.flot.resize.js',
                                   'vendor/Flot/jquery.flot.pie.js',
                                   'vendor/Flot/jquery.flot.time.js',
                                   'vendor/Flot/jquery.flot.categories.js',
                                   'vendor/flot-spline/js/jquery.flot.spline.min.js'],
                                  // jquery core and widgets
            'jquery-ui':          ['vendor/jquery-ui/ui/core.js',
                                   'vendor/jquery-ui/ui/widget.js'],
                                   // loads only jquery required modules and touch support
            'jquery-ui-widgets':  ['vendor/jquery-ui/ui/core.js',
                                   'vendor/jquery-ui/ui/widget.js',
                                   'vendor/jquery-ui/ui/mouse.js',
                                   'vendor/jquery-ui/ui/draggable.js',
                                   'vendor/jquery-ui/ui/droppable.js',
                                   'vendor/jquery-ui/ui/sortable.js',
                                   'vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'],
            'moment' :            ['vendor/moment/min/moment-with-locales.min.js'],
            'inputmask':          ['vendor/jquery.inputmask/dist/jquery.inputmask.bundle.js'],
            'flatdoc':            ['vendor/flatdoc/flatdoc.js'],
            'codemirror':         ['vendor/codemirror/lib/codemirror.js',
                                   'vendor/codemirror/lib/codemirror.css'],
            // modes for common web files
            'codemirror-modes-web': ['vendor/codemirror/mode/javascript/javascript.js',
                                     'vendor/codemirror/mode/xml/xml.js',
                                     'vendor/codemirror/mode/htmlmixed/htmlmixed.js',
                                     'vendor/codemirror/mode/css/css.js'],
            'taginput' :          ['vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
                                   'vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'],
            'filestyle':          ['vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
            'parsley':            ['vendor/parsleyjs/dist/parsley.min.js'],
            'fullcalendar':       ['vendor/fullcalendar/dist/fullcalendar.min.js',
                                   'vendor/fullcalendar/dist/fullcalendar.css'],
            'gcal':               ['vendor/fullcalendar/dist/gcal.js'],
            'chartjs':            ['vendor/Chart.js/Chart.js'],
            'morris':             ['vendor/raphael/raphael.js',
                                   'vendor/morris.js/morris.js',
                                   'vendor/morris.js/morris.css'],
            'loaders.css':          ['vendor/loaders.css/loaders.css'],
            'spinkit':              ['vendor/spinkit/css/spinkit.css']
          },
          // Angular based script (use the right module name)
          modules: [
            {name: 'toaster',                   files: ['vendor/angularjs-toaster/toaster.js',
                                                       'vendor/angularjs-toaster/toaster.css']},
            {name: 'localytics.directives',     files: ['vendor/chosen_v1.2.0/chosen.jquery.min.js',
                                                       'vendor/chosen_v1.2.0/chosen.min.css',
                                                       'vendor/angular-chosen-localytics/chosen.js']},
            {name: 'ngDialog',                  files: ['vendor/ngDialog/js/ngDialog.min.js',
                                                       'vendor/ngDialog/css/ngDialog.min.css',
                                                       'vendor/ngDialog/css/ngDialog-theme-default.min.css'] },
            {name: 'ngWig',                     files: ['vendor/ngWig/dist/ng-wig.min.js'] },
            {name: 'ngTable',                   files: ['vendor/ng-table/dist/ng-table.min.js',
                                                        'vendor/ng-table/dist/ng-table.min.css']},
            {name: 'ngTableExport',             files: ['vendor/ng-table-export/ng-table-export.js']},
            {name: 'angularBootstrapNavTree',   files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                                                        'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css']},
            {name: 'htmlSortable',              files: ['vendor/html.sortable/dist/html.sortable.js',
                                                        'vendor/html.sortable/dist/html.sortable.angular.js']},
            {name: 'xeditable',                 files: ['vendor/angular-xeditable/dist/js/xeditable.js',
                                                        'vendor/angular-xeditable/dist/css/xeditable.css']},
            {name: 'angularFileUpload',         files: ['vendor/angular-file-upload/dist/angular-file-upload.js']},

            {name: 'ngFileUpload',              files: [//'vendor/ng-file-upload-master/dist/ng-file-upload-shim.js',
                                                        'vendor/ng-file-upload-master/dist/ng-file-upload-shim.min.js',
                                                        'vendor/ng-file-upload-master/dist/ng-file-upload.min.js'
                                                    ]},
            {name: 'ngImgCrop',                 files: [//'vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
                                                        //'vendor/ng-img-crop/compile/unminified/ng-img-crop.css'

                                                        'vendor/ngImgCropFullExtended-master/compile/minified/ng-img-crop.js?1',
                                                        'vendor/ngImgCropFullExtended-master/compile/minified/ng-img-crop.css',
                                                        ]},
            {name: 'uiCropper',                 files: ['vendor/ui-cropper-master/compile/minified/ui-cropper.js?1',
                                                        'vendor/ui-cropper-master/compile/minified/ui-cropper.css',
                                                        ]},
            {name: 'ui.select',                 files: ['vendor/angular-ui-select/dist/select.js',
                                                        'vendor/angular-ui-select/dist/select.css']},
            {name: 'ui.codemirror',             files: ['vendor/angular-ui-codemirror/ui-codemirror.js']},
            {name: 'angular-carousel',          files: ['vendor/angular-carousel/dist/angular-carousel.css',
                                                        'vendor/angular-carousel/dist/angular-carousel.js']},
            {name: 'infinite-scroll',           files: ['vendor/ngInfiniteScroll/build/ng-infinite-scroll.js']},
            {name: 'ui.bootstrap-slider',       files: ['vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                                                        'vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
                                                        'vendor/angular-bootstrap-slider/slider.js']},
            {name: 'ui.grid',                   files: ['vendor/angular-ui-grid/ui-grid.min.css',
                                                        'vendor/angular-ui-grid/ui-grid.min.js']},
            {name: 'textAngular',               files: ['vendor/textAngular/dist/textAngular.css',
                                                        'vendor/textAngular/dist/textAngular-rangy.min.js',
                                                        'vendor/textAngular/dist/textAngular-sanitize.js',
                                                        'vendor/textAngular/src/globals.js',
                                                        'vendor/textAngular/src/factories.js',
                                                        'vendor/textAngular/src/DOM.js',
                                                        'vendor/textAngular/src/validators.js',
                                                        'vendor/textAngular/src/taBind.js',
                                                        'vendor/textAngular/src/main.js',
                                                        'vendor/textAngular/dist/textAngularSetup.js'
                                                        ], serie: true},
            {name: 'angular-rickshaw',          files: ['vendor/d3/d3.min.js',
                                                        'vendor/rickshaw/rickshaw.js',
                                                        'vendor/rickshaw/rickshaw.min.css',
                                                        'vendor/angular-rickshaw/rickshaw.js'], serie: true},
            {name: 'angular-chartist',          files: ['vendor/chartist/dist/chartist.min.css',
                                                        'vendor/chartist/dist/chartist.js',
                                                        'vendor/angular-chartist.js/dist/angular-chartist.js'], serie: true},
            {name: 'ui.map',                    files: ['vendor/angular-ui-map/ui-map.js']},
            {name: 'datatables',                files: ['vendor/datatables/media/css/jquery.dataTables.css',
                                                        /*'vendor/datatables/media/js/jquery.dataTables.js',*/
                                                        'vendor/angular-datatables/dist/angular-datatables.js'], serie: true},



            {name: 'angular-datatables',        files: [//'vendor/angular-datatables-master/vendor/datatables/media/js/jquery.js',
                                                        'vendor/angular-datatables-master/vendor/datatables/media/js/jquery.dataTables.js',
                                                        'vendor/angular-datatables-master/vendor/datatables/media/css/jquery.dataTables.min.css',
                                                        //'vendor/angular-datatables-master/dist/angular-datatables.min.js',
                                                        'vendor/angular-datatables-master/dist/angular-datatables.js',

                                                        'vendor/bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css',
                                                        'vendor/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',

                                                        //'vendor/angular-datatables-master/dist/plugins/bootstrap/datatables.bootstrap.min.css',
                                                        //'vendor/angular-datatables-master/dist/plugins/bootstrap/angular-datatables.bootstrap.min.js',

                                                        'vendor/angular-datatables-master/vendor/datatables-light-columnfilter/dist/dataTables.lightColumnFilter.js',
                                                        'vendor/angular-datatables-master/vendor/datatables-light-columnfilter/dist/dataTables.lcf.datepicker.fr.js',
                                                        'vendor/angular-datatables-master/vendor/datatables-light-columnfilter/dist/dataTables.lcf.bootstrap3.js',
                                                        'vendor/angular-datatables-master/dist/plugins/light-columnfilter/angular-datatables.light-columnfilter.min.js',


                                                        //'vendor/angular-datatables-master/vendor/datatables-columnfilter/js/dataTables.columnFilter.js',
                                                        //'vendor/angular-datatables-master/dist/plugins/columnfilter/angular-datatables.columnfilter.min.js',

                                                    /*    'vendor/angular-datatables-master/vendor/datatables-colreorder/css/dataTables.colReorder.css',
                                                        'vendor/angular-datatables-master/vendor/datatables-colreorder/js/dataTables.colReorder.js',
                                                        'vendor/angular-datatables-master/dist/plugins/colreorder/angular-datatables.colreorder.js',

                                                        'vendor/angular-datatables-master/vendor/datatables-responsive/css/dataTables.responsive.css',
                                                        'vendor/angular-datatables-master/vendor/datatables-responsive/js/dataTables.responsive.js',*/

                                                        'vendor/angular-datatables-master/vendor/datatables-buttons/css/buttons.dataTables.css',
                                                        'vendor/angular-datatables-master/vendor/datatables-buttons/js/dataTables.buttons.js',
                                                        ////'vendor/angular-datatables-master/vendor/datatables-buttons/js/buttons.bootstrap.js',
                                                        ////'vendor/angular-datatables-master/vendor/datatables-buttons/js/buttons.jqueryui.js',
                                                        //'vendor/angular-datatables-master/vendor/datatables-buttons/js/buttons.colVis.js',
                                                        'vendor/angular-datatables-master/vendor/datatables-buttons/js/buttons.flash.js',
                                                        'vendor/angular-datatables-master/vendor/datatables-buttons/js/buttons.html5.js',
                                                        'vendor/angular-datatables-master/vendor/datatables-buttons/js/buttons.print.js',
                                                        'vendor/angular-datatables-master/dist/plugins/buttons/angular-datatables.buttons.min.js',

                                                        //'vendor/angular-datatables-master/dist/plugins/colreorder/angular-datatables.colreorder.min.js'

                                                        ], serie: true},

            {name: 'angular-jqcloud',           files: ['vendor/jqcloud2/dist/jqcloud.css',
                                                        'vendor/jqcloud2/dist/jqcloud.js',
                                                        'vendor/angular-jqcloud/angular-jqcloud.js']},
            {name: 'angularGrid',               files: ['vendor/ag-grid/dist/styles/ag-grid.css',
                                                        'vendor/ag-grid/dist/ag-grid.js',
                                                        'vendor/ag-grid/dist/styles/theme-dark.css',
                                                        'vendor/ag-grid/dist/styles/theme-fresh.css']},
            {name: 'ng-nestable',               files: ['vendor/ng-nestable/src/angular-nestable.js',
                                                        'vendor/nestable/jquery.nestable.js']},
            {name: 'akoenig.deckgrid',          files: ['vendor/angular-deckgrid/angular-deckgrid.js']},
            {name: 'oitozero.ngSweetAlert',     files: ['vendor/sweetalert/dist/sweetalert.css',
                                                        'vendor/sweetalert/dist/sweetalert.min.js',
                                                        'vendor/angular-sweetalert/SweetAlert.js']},
            {name: 'bm.bsTour',                 files: ['vendor/bootstrap-tour/build/css/bootstrap-tour.css',
                                                        'vendor/bootstrap-tour/build/js/bootstrap-tour-standalone.js',
                                                        'vendor/angular-bootstrap-tour/dist/angular-bootstrap-tour.js'], serie: true},
            {name: 'ui.knob',                   files: ['vendor/angular-knob/src/angular-knob.js',
                                                        'vendor/jquery-knob/dist/jquery.knob.min.js']},
            {name: 'easypiechart',              files: ['vendor/jquery.easy-pie-chart/dist/angular.easypiechart.min.js']},
            {name: 'colorpicker.module',        files: ['vendor/angular-bootstrap-colorpicker/css/colorpicker.css',
                                                        'vendor/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js']},

            /*{name: 'jstree',        files: ['vendor/jstree/dist/themes/default/style.min.css',
                                            'vendor/jstree/dist/jstree.min.js',
                                           ]},*/

            {name: 'ngJstree',        files: ['vendor/jstree/dist/themes/default/style.min.css',
                                          //    'http://code.jquery.com/jquery-1.12.1.js',
                                              'vendor/jstree/dist/jstree.min.js',
                                              'vendor/ngJsTree-master/dist/ngJsTree.min.js'

                                              ]},
            /*{name: 'ng_jcrop',        files:["https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css",
                                            'vendor/jcrop/css/jquery.Jcrop.css',
                                            //"https://cdnjs.cloudflare.com/ajax/libs/jquery-jcrop/0.9.12/css/jquery.Jcrop.min.css",
                                            'vendor/jcrop/js/jquery.Jcrop.js',
                                            //"https://cdnjs.cloudflare.com/ajax/libs/jquery-jcrop/0.9.12/js/jquery.Jcrop.min.js",
                                            'vendor/ng-jcrop/ng-jcrop.js'
                                            ]},*/
            {name: 'imageCompressor',        files: ['vendor/J-I-C-master/src/JIC.js']},
            {name: 'loginCtlr',        files: ['app/js/auth/login.js']},
            {name: 'registerCtlr',        files: ['app/js/auth/register.js']},
            {name: 'recoverCtlr',        files: ['app/js/auth/recover.js']},
            {name: 'passwordresetCtlr',        files: ['app/js/auth/passwordreset.js']},
            //{name: 'logoutCtlr',        files: ['app/js/auth/logout.js']},
            { name: 'DashboardController',        files: ['app/js/dashboard/dashboard.js',
                                                          'wishbook_libs/js/inventory/bulkInventoryUpdate.js']}, 
            {name: 'companyCtlr',        files: ['app/js/company/company.js']},
            {name: 'companyprofileCtlr',        files: ['app/js/company/companyprofile.js'
                                                        , 'app/js/company/gst.js'
                                                        , 'app/js/company/bankdetails.js'
                                                        ]},
            {name: 'ContactusController', files: ['app/js/company/contactus.js'] },
            {name: 'gstCtlr',        files: ['app/js/company/gst.js']},
            {name: 'bankdetailsCtlr',        files: ['app/js/company/bankdetails.js']},
            {name: 'discountCtlr',        files: ['app/js/company/discount.js']},
            {name: 'brandwisediscountCtlr', files: ['app/js/company/brandwisediscount.js',
                                                    'wishbook_libs/js/discountruleactions/discountruleaction.js']},
            {name: 'userprofileCtlr',        files: ['app/js/auth/userprofile.js']},
            {name: 'jobsCtlr',        files: ['app/js/jobs/jobs.js']},
            {name: 'inventoryJobsCtlr',        files: ['app/js/jobs/inventoryJobs.js',
                                                       'wishbook_libs/js/inventory/bulkInventoryUpdate.js']}, 
            {name: 'changepasswordCtlr',        files: ['app/js/auth/changepassword.js']},
            {name: 'brandsCtlr',        files: ['app/js/catalog/brands.js']},
            {name: 'catalogCtlr',        files: ['app/js/catalog/catalogs.js',
                                                'app/js/common/imageslider.js',
                                                'app/js/common/order_modal.js',
                                                'app/js/shares/share_form.js',
                                                'wishbook_libs/js/catalogaction/add_update.js']},
            {name: 'screensCtlr',        files: ['wishbook_libs/js/screens/screens.js',
                                                 'wishbook_libs/js/catalogaction/add_update.js']},
            {name: 'noncatalogsCtlr',        files: ['wishbook_libs/js/noncatalogs/noncatalogs.js',
                                                 'wishbook_libs/js/catalogaction/add_update.js']},
            {name: 'catalogAdminCtlr',        files: ['app/js/admin/catalog/catalogs.js',
                                                'app/js/common/imageslider.js',
                                              'app/js/common/company_detail.js',
                                              'app/js/common/company_detail_edit.js']},
            {name: 'browseCtlr',        files: ['app/js/browse/catalogs.js',
                                                'app/js/common/imageslider.js']},
            {name: 'productCtlr',        files: ['wishbook_libs/js/productslist/products.js']},
            { name: 'setmatchingdetailsCtlr', files: ['wishbook_libs/js/productslist/setMatchingDetails.js',
                                                    'wishbook_libs/js/catalogaction/add_update.js'] },
            {name: 'skumapCtlr',        files: ['app/js/catalog/skumap.js']},
            {name: 'inventoryCtlr',        files: ['app/js/inventory/inventory.js']},
            {name: 'warehouseCtlr',        files: ['app/js/inventory/warehouse.js']},
            {name: 'adjustmentCtlr',        files: ['app/js/inventory/adjustment.js']},
            {name: 'openingstockCtlr',        files: ['app/js/inventory/openingstock.js']},
            {name: 'receivedcatalogCtlr',        files: ['vendor/hmac-sha256/hmac-sha256.js',
                                                          'app/js/catalog/receivedcatalogs.js',
                                                          'app/js/common/order_modal.js',
                                                          'app/js/common/purchase_order_modal.js',
                                                          'app/js/common/brokerage_order_modal.js',
                                                          'wishbook_libs/js/shippingpayment/shipping_payment.js',
                                                         'vendor/hmac-sha256/enc-base64-min.js',
                                                          'app/js/common/imageslider.js',
                                                          'app/js/shares/share_form.js']},
            {name: 'publiccatalogCtlr',        files: ['vendor/hmac-sha256/hmac-sha256.js',
                                                      'app/js/catalog/publiccatalogs.js',
                                                      'app/js/common/purchase_order_modal.js',
                                                      'wishbook_libs/js/shippingpayment/shipping_payment.js',
                                                     'vendor/hmac-sha256/enc-base64-min.js',
                                                      'app/js/common/imageslider.js']},
            {name: 'receivedselectionCtlr',        files: ['app/js/catalog/receivedselections.js',
                                                          'app/js/common/imageslider.js']},
            {name: 'selectionsCtlr',        files: ['app/js/catalog/selections.js',
                                                    'app/js/common/imageslider.js']},
            {name: 'buyerslistCtlr',        files: ['app/js/buyers/list.js']},
            {name: 'groupslistCtlr',        files: ['app/js/buyers/groups.js']},
            {name: 'supplierslistCtlr',        files: ['app/js/suppliers/suppliers.js']},
            {name: 'buyerenquirylistCtlr',        files: ['app/js/buyers/enquiry.js',
                                                          'app/js/common/order_modal.js',
                                                          ]},
            {name: 'myleadslistCtlr',               files: ['app/js/buyers/myleads.js',
                                                            'app/js/common/order_modal.js',
                                                          ]},
            {name: 'myfollowerslistCtlr',           files: ['app/js/myviews/myfollowers.js'
                                                          ]},
            {name: 'myViewerlistCtlr',           files: ['app/js/myviews/myviewers.js'
                                                        ,'app/js/common/imageslider.js']},
            {name: 'supplierenquirylistCtlr',       files: ['app/js/suppliers/enquiry.js',
                                                             'app/js/common/purchase_order_modal.js'
                                                            ]},
            {name: 'myenquirylistCtlr',             files: ['app/js/suppliers/myenquiry.js',
                                                             'vendor/hmac-sha256/hmac-sha256.js',
                                                             'wishbook_libs/js/shippingpayment/shipping_payment.js',
                                                             'app/js/common/purchase_order_modal.js',
                                                             'vendor/hmac-sha256/enc-base64-min.js',
                                                            ]},
            {name: 'shareslistCtlr',        files: ['app/js/shares/shares.js',
                                                    'app/js/shares/share_form.js']},
            {name: 'shareDetailCtlr',        files: ['app/js/shares/share_detail.js']},
            {name: 'shareDesignViewCtlr',        files: ['app/js/shares/share_design_view.js']},
            {name: 'salespersonslistCtlr',  files: ['app/js/salespersons/salespersons.js']},
            {name: 'salesorderslistCtlr',  files: ['app/js/salesorders/salesorders.js',
                                                   'wishbook_libs/js/shipment/create_shipment.js',
                                                   'app/js/common/order_modal.js',
                                                   'app/js/common/orderstatus.js']},
            {name: 'purchaseorderslistCtlr',  files: ['vendor/hmac-sha256/hmac-sha256.js',
                                                      'app/js/purchaseorders/purchaseorders.js',
                                                      'wishbook_libs/js/shippingpayment/shipping_payment.js',
                                                      'app/js/common/purchase_order_modal.js',
                                                      'vendor/hmac-sha256/enc-base64-min.js',
                                                      'app/js/common/orderstatus.js']},

            {name: 'brokerageorderslistCtlr',  files: ['vendor/hmac-sha256/hmac-sha256.js',
                                                       'app/js/brokerageorders/brokerageorders.js',
                                                       'wishbook_libs/js/shippingpayment/shipping_payment.js',
                                                       'app/js/common/brokerage_order_modal.js',
                                                       'vendor/hmac-sha256/enc-base64-min.js',]},
            {name: 'salesordersinvoicelistCtlr',  files: ['app/js/invoice/salesordersinvoice.js']},
            { name: 'shipment_InvoicesCtlr', files: ['app/js/Shipment_Invoices/shipment_Invoices.js'] },
            { name: 'manifestsCtlr', files: ['app/js/Shipment_Invoices/manifests.js'] },
            {name: 'rrcrequestsCtlr',  files: ['app/js/admin/rrc/rrcrequests.js']},
            {name: 'refundrequestsCtlr',  files: ['app/js/admin/rrc/refundrequests.js']},
            {name: 'purchaseordersinvoicelistCtlr',  files: ['app/js/invoice/purchaseordersinvoice.js']},
            {name: 'administratorslistCtlr',  files: ['app/js/administrators/administrators.js']},
            {name: 'registrationsCtlr',  files: ['app/js/registrations/registrations.js']},
            {name: 'companiesCtlr',        files: ['app/js/companies/company.js']},
            {name: 'orderCtlr',        files: ['app/js/order/order.js',
                                               'app/js/common/orderstatus.js',
                                               'wishbook_libs/js/shippingpayment/shipping_payment.js',
                                               'app/js/common/company_detail.js',
                                               'app/js/common/company_detail_edit.js']},
            {name: 'cartCtlr',        files: ['app/js/admin/cart/cart.js',
                                               'app/js/common/company_detail.js',
                                               'app/js/common/company_detail_edit.js']},
            {name: 'mirrorCtlr',        files: ['app/js/mirror/mirror.js']},
            {name: 'becomesellerCtlr',        files: ['app/js/becomeseller/becomeseller.js']},
            {name: 'deeplinkCtlr',        files: ['app/js/deeplink/deeplink.js']},
            {name: 'marketingCtlr',        files: ['app/js/marketing/marketing.js']},
            {name: 'sellerStatisticCtlr',        files: ['app/js/seller_statistic/seller_statistic.js',
                                                        'app/js/common/company_detail.js',
                                                        'app/js/common/company_detail_edit.js']},
            {name: 'orderDashboardCtlr',        files: ['app/js/order/order_dashboard.js']},
            {name: 'mergeCtlr',        files: ['app/js/merge/merge.js']},
            {name: 'companiesBuyerSupplierCtlr',        files: ['app/js/companies/companies_buyer_supplier.js']},
            {name: 'productsDetailCtlr',        files: ['vendor/hmac-sha256/hmac-sha256.js',
                                                      'app/js/catalog/products_detail.js',
                                                      'app/js/common/purchase_order_modal.js',
                                                      'wishbook_libs/js/shippingpayment/shipping_payment.js',
                                                     'vendor/hmac-sha256/enc-base64-min.js']},
            {name: 'salespersonDetailCtlr',        files: ['app/js/salespersons/salesperson_detail.js',
                                                           'app/js/salespersons/map.js',
                                                           'app/js/salespersons/attendance.js',
                                                           'app/js/salespersons/salesorders.js']},
            {name: 'buyerDetailCtlr',        files: ['app/js/buyers/buyer_detail.js',
                                                     'app/js/buyers/buyer_salesorders.js',
                                                     'app/js/buyers/meeting.js']},
            {name: 'supplierDetailCtlr',        files: ['app/js/suppliers/supplier_detail.js']},
            {name: 'brandcatalogsCtlr',        files: ['app/js/catalog/brand_catalogs.js']},
            {name: 'orderDetailCtlr',        files: ['vendor/hmac-sha256/hmac-sha256.js',
                                                     'wishbook_libs/js/orderdetail/order_detail.js',
                                                     'wishbook_libs/js/shippingpayment/shipping_payment.js',
                                                     'vendor/hmac-sha256/enc-base64-min.js',
                                                     'app/js/common/orderstatus.js']},
            {name: 'cartDetailCtlr',        files: ['vendor/hmac-sha256/hmac-sha256.js',
                                                     'app/js/admin/cart/cart_detail.js',
                                                     'app/js/common/cart_shipping_payment.js',
                                                     'vendor/hmac-sha256/enc-base64-min.js']},
            {name: 'mapsDetailCtlr',  files: ['app/js/salespersons/map.js']},
            {name: 'attendancesDetailCtlr',  files: ['app/js/salespersons/attendance.js']},
            {name: 'companyAccountCtlr',  files: ['app/js/companyaccounts/companyaccounts.js']},
            {name: 'salesmanLocationCtlr',  files: ['app/js/salesmanlocation/salesmanlocation.js']},
            {name: 'salesmanIndividualCtlr',  files: ['app/js/salesmanindividual/salesmanindividual.js']},
            {name: 'printOrderCtlr',  files: ['app/js/order/printorder.js']},
            {name: 'printInvoiceCtlr',  files: ['vendor/JsBarcode-master/dist/JsBarcode.all.min.js',
                                                'wishbook_libs/js/invoice/printinvoice.js']},
            {name: 'printSellerInvoiceCtlr',  files: ['vendor/JsBarcode-master/dist/JsBarcode.all.min.js',
                                                     'wishbook_libs/js/invoice/printsellerinvoice.js']},
            {name: 'printmanifestCtlr',  files: ['wishbook_libs/js/invoice/printmanifest.js']},
                                                     
            {name: 'photoSwipe',  files: [// 'vendor/photoswipe-master/dist/photoswipe.css', added to index.html to hide arrow buttons
                                          'vendor/photoswipe-master/dist/default-skin/default-skin.css',
                                          'vendor/photoswipe-master/dist/photoswipe.js',
                                          'vendor/photoswipe-master/dist/photoswipe-ui-default.js',

                                            ]},

          ]
        })
        ;

})();

(function() {
    'use strict';

    angular
        .module('app.loadingbar')
        .config(loadingbarConfig)
        ;
    loadingbarConfig.$inject = ['cfpLoadingBarProvider'];
    function loadingbarConfig(cfpLoadingBarProvider){
      cfpLoadingBarProvider.includeBar = true;
      cfpLoadingBarProvider.includeSpinner = false;
      cfpLoadingBarProvider.latencyThreshold = 500;
      cfpLoadingBarProvider.parentSelector = '.wrapper > section';
    }
})();
(function() {
    'use strict';

    angular
        .module('app.loadingbar')
        .run(loadingbarRun)
        ;
    loadingbarRun.$inject = ['$rootScope', '$timeout', 'cfpLoadingBar'];
    function loadingbarRun($rootScope, $timeout, cfpLoadingBar){

      // Loading bar transition
      // -----------------------------------
      var thBar;
      $rootScope.$on('$stateChangeStart', function() {
          if($('.wrapper > section').length) // check if bar container exists
            thBar = $timeout(function() {
              cfpLoadingBar.start();
            }, 0); // sets a latency Threshold
      });
      $rootScope.$on('$stateChangeSuccess', function(event) {
          event.targetScope.$watch('$viewContentLoaded', function () {
            $timeout.cancel(thBar);
            cfpLoadingBar.complete();
          });
      });

    }

})();
(function() {
    'use strict';

    angular
        .module('app.locale')
        .config(localeConfig)
        ;
    localeConfig.$inject = ['tmhDynamicLocaleProvider'];
    function localeConfig(tmhDynamicLocaleProvider){

      tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');
      // tmhDynamicLocaleProvider.useStorage('$cookieStore');

    }
})();
/**=========================================================
 * Module: locale.js
 * Demo for locale settings
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.locale')
        .controller('LocalizationController', LocalizationController);

    LocalizationController.$inject = ['$rootScope', 'tmhDynamicLocale', '$locale'];
    function LocalizationController($rootScope, tmhDynamicLocale, $locale) {

        activate();

        ////////////////

        function activate() {
          $rootScope.availableLocales = {
            'en': 'English',
            'es': 'Spanish',
            'de': 'German',
            'fr': 'French',
            'ar': 'Arabic',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese'};

          $rootScope.model = {selectedLocale: 'en'};

          $rootScope.$locale = $locale;

          $rootScope.changeLocale = tmhDynamicLocale.set;
        }
    }
})();

/**=========================================================
 * Module: notify.js
 * Directive for notify plugin
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.notify')
        .directive('notify', notify);

    notify.$inject = ['$window', 'Notify'];
    function notify ($window, Notify) {

        var directive = {
            link: link,
            restrict: 'A',
            scope: {
              options: '=',
              message: '='
            }
        };
        return directive;

        function link(scope, element) {

          element.on('click', function (e) {
            e.preventDefault();
            Notify.alert(scope.message, scope.options);
          });
        }

    }

})();


/**=========================================================
 * Module: notify.js
 * Create a notifications that fade out automatically.
 * Based on Notify addon from UIKit (http://getuikit.com/docs/addons_notify.html)
 =========================================================*/

(function() {
    'use strict';
    angular
        .module('app.notify')
        .service('Notify', Notify);

    Notify.$inject = ['$timeout'];
    function Notify($timeout) {

        this.alert = notifyAlert;

        ////////////////

        function notifyAlert(msg, opts) {
            if ( msg ) {
                $timeout(function(){
                    $.notify(msg, opts || {});
                });
            }
        }
    }

})();

/*
 * Notify Addon definition as jQuery plugin
 * Adapted version to work with Bootstrap classes
 * More information http://getuikit.com/docs/addons_notify.html
 */
(function($){
    'use strict';
    var containers = {},
        messages   = {},
        notify     =  function(options){
            if ($.type(options) === 'string') {
                options = { message: options };
            }
            if (arguments[1]) {
                options = $.extend(options, $.type(arguments[1]) === 'string' ? {status:arguments[1]} : arguments[1]);
            }
            return (new Message(options)).show();
        },
        closeAll  = function(group, instantly){
            var id;
            if(group) {
                for(id in messages) { if(group===messages[id].group) messages[id].close(instantly); }
            } else {
                for(id in messages) { messages[id].close(instantly); }
            }
        };
    var Message = function(options){
        // var $this = this;
        this.options = $.extend({}, Message.defaults, options);
        this.uuid    = 'ID'+(new Date().getTime())+'RAND'+(Math.ceil(Math.random() * 100000));
        this.element = $([
            // @geedmo: alert-dismissable enables bs close icon
            '<div class="uk-notify-message alert-dismissable">',
                '<a class="close">&times;</a>',
                '<div>'+this.options.message+'</div>',
            '</div>'
        ].join('')).data('notifyMessage', this);
        // status
        if (this.options.status) {
            this.element.addClass('alert alert-'+this.options.status);
            this.currentstatus = this.options.status;
        }
        this.group = this.options.group;
        messages[this.uuid] = this;
        if(!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-'+this.options.pos+'"></div>').appendTo('body').on('click', '.uk-notify-message', function(){
                $(this).data('notifyMessage').close();
            });
        }
    };
    $.extend(Message.prototype, {
        uuid: false,
        element: false,
        timout: false,
        currentstatus: '',
        group: false,
        show: function() {
            if (this.element.is(':visible')) return;
            var $this = this;
            containers[this.options.pos].show().prepend(this.element);
            var marginbottom = parseInt(this.element.css('margin-bottom'), 10);
            this.element.css({'opacity':0, 'margin-top': -1*this.element.outerHeight(), 'margin-bottom':0}).animate({'opacity':1, 'margin-top': 0, 'margin-bottom':marginbottom}, function(){
                if ($this.options.timeout) {
                    var closefn = function(){ $this.close(); };
                    $this.timeout = setTimeout(closefn, $this.options.timeout);
                    $this.element.hover(
                        function() { clearTimeout($this.timeout); },
                        function() { $this.timeout = setTimeout(closefn, $this.options.timeout);  }
                    );
                }
            });
            return this;
        },
        close: function(instantly) {
            var $this    = this,
                finalize = function(){
                    $this.element.remove();
                    if(!containers[$this.options.pos].children().length) {
                        containers[$this.options.pos].hide();
                    }
                    delete messages[$this.uuid];
                };
            if(this.timeout) clearTimeout(this.timeout);
            if(instantly) {
                finalize();
            } else {
                this.element.animate({'opacity':0, 'margin-top': -1* this.element.outerHeight(), 'margin-bottom':0}, function(){
                    finalize();
                });
            }
        },
        content: function(html){
            var container = this.element.find('>div');
            if(!html) {
                return container.html();
            }
            container.html(html);
            return this;
        },
        status: function(status) {
            if(!status) {
                return this.currentstatus;
            }
            this.element.removeClass('alert alert-'+this.currentstatus).addClass('alert alert-'+status);
            this.currentstatus = status;
            return this;
        }
    });
    Message.defaults = {
        message: '',
        status: 'normal',
        timeout: 5000,
        group: null,
        pos: 'top-center'
    };

    $.notify          = notify;
    $.notify.message  = Message;
    $.notify.closeAll = closeAll;

    return notify;
}(jQuery));




/**=========================================================
 * Collapse panels * [panel-collapse]
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('panelCollapse', panelCollapse);

    function panelCollapse () {
        var directive = {
            controller: Controller,
            restrict: 'A',
            scope: false
        };
        return directive;
    }

    Controller.$inject = ['$scope', '$element', '$timeout', '$localStorage'];
    function Controller ($scope, $element, $timeout, $localStorage) {
      var storageKeyName = 'panelState';

      // Prepare the panel to be collapsible
      var $elem   = $($element),
          parent  = $elem.closest('.panel'), // find the first parent panel
          panelId = parent.attr('id');

      // Load the saved state if exists
      var currentState = loadPanelState( panelId );
      if ( typeof currentState !== 'undefined') {
        $timeout(function(){
            $scope[panelId] = currentState; },
          10);
      }

      // bind events to switch icons
      $element.bind('click', function(e) {
        e.preventDefault();
        savePanelState( panelId, !$scope[panelId] );

      });

      // Controller helpers
      function savePanelState(id, state) {
        if(!id) return false;
        var data = angular.fromJson($localStorage[storageKeyName]);
        if(!data) { data = {}; }
        data[id] = state;
        $localStorage[storageKeyName] = angular.toJson(data);
      }
      function loadPanelState(id) {
        if(!id) return false;
        var data = angular.fromJson($localStorage[storageKeyName]);
        if(data) {
          return data[id];
        }
      }
    }

})();

/**=========================================================
 * Dismiss panels * [panel-dismiss]
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('panelDismiss', panelDismiss);

    function panelDismiss () {

        var directive = {
            controller: Controller,
            restrict: 'A'
        };
        return directive;

    }

    Controller.$inject = ['$scope', '$element', '$q', 'Utils'];
    function Controller ($scope, $element, $q, Utils) {
      var removeEvent   = 'panel-remove',
          removedEvent  = 'panel-removed';

      $element.on('click', function (e) {
        e.preventDefault();

        // find the first parent panel
        var parent = $(this).closest('.panel');

        removeElement();

        function removeElement() {
          var deferred = $q.defer();
          var promise = deferred.promise;

          // Communicate event destroying panel
          $scope.$emit(removeEvent, parent.attr('id'), deferred);
          promise.then(destroyMiddleware);
        }

        // Run the animation before destroy the panel
        function destroyMiddleware() {
          if(Utils.support.animation) {
            parent.animo({animation: 'bounceOut'}, destroyPanel);
          }
          else destroyPanel();
        }

        function destroyPanel() {

          var col = parent.parent();
          parent.remove();
          // remove the parent if it is a row and is empty and not a sortable (portlet)
          col
            .filter(function() {
            var el = $(this);
            return (el.is('[class*="col-"]:not(.sortable)') && el.children('*').length === 0);
          }).remove();

          // Communicate event destroyed panel
          $scope.$emit(removedEvent, parent.attr('id'));

        }

      });
    }
})();



/**=========================================================
 * Refresh panels
 * [panel-refresh] * [data-spinner="standard"]
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('panelRefresh', panelRefresh);

    function panelRefresh () {
        var directive = {
            controller: Controller,
            restrict: 'A',
            scope: false
        };
        return directive;

    }

    Controller.$inject = ['$scope', '$element'];
    function Controller ($scope, $element) {
      var refreshEvent   = 'panel-refresh',
          whirlClass     = 'whirl',
          defaultSpinner = 'standard';

      // catch clicks to toggle panel refresh
      $element.on('click', function (e) {
        e.preventDefault();

        var $this   = $(this),
            panel   = $this.parents('.panel').eq(0),
            spinner = $this.data('spinner') || defaultSpinner
            ;

        // start showing the spinner
        panel.addClass(whirlClass + ' ' + spinner);

        // Emit event when refresh clicked
        $scope.$emit(refreshEvent, panel.attr('id'));

      });

      // listen to remove spinner
      $scope.$on('removeSpinner', removeSpinner);

      // method to clear the spinner when done
      function removeSpinner (ev, id) {
        if (!id) return;
        var newid = id.charAt(0) === '#' ? id : ('#'+id);
        angular
          .element(newid)
          .removeClass(whirlClass);
      }
    }
})();



/**=========================================================
 * Module panel-tools.js
 * Directive tools to control panels.
 * Allows collapse, refresh and dismiss (remove)
 * Saves panel state in browser storage
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('paneltool', paneltool);

    paneltool.$inject = ['$compile', '$timeout'];
    function paneltool ($compile, $timeout) {
        var directive = {
            link: link,
            restrict: 'E',
            scope: false
        };
        return directive;

        function link(scope, element, attrs) {

          var templates = {
            /* jshint multistr: true */
            collapse:'<a href="#" panel-collapse="" uib-tooltip="Collapse Panel" ng-click="{{panelId}} = !{{panelId}}"> \
                        <em ng-show="{{panelId}}" class="fa fa-plus ng-no-animation"></em> \
                        <em ng-show="!{{panelId}}" class="fa fa-minus ng-no-animation"></em> \
                      </a>',
            dismiss: '<a href="#" panel-dismiss="" uib-tooltip="Close Panel">\
                       <em class="fa fa-times"></em>\
                     </a>',
            refresh: '<a href="#" panel-refresh="" data-spinner="{{spinner}}" uib-tooltip="Refresh Panel">\
                       <em class="fa fa-refresh"></em>\
                     </a>'
          };

          var tools = scope.panelTools || attrs;

          $timeout(function() {
            element.html(getTemplate(element, tools )).show();
            $compile(element.contents())(scope);

            element.addClass('pull-right');
          });

          function getTemplate( elem, attrs ){
            var temp = '';
            attrs = attrs || {};
            if(attrs.toolCollapse)
              temp += templates.collapse.replace(/{{panelId}}/g, (elem.parent().parent().attr('id')) );
            if(attrs.toolDismiss)
              temp += templates.dismiss;
            if(attrs.toolRefresh)
              temp += templates.refresh.replace(/{{spinner}}/g, attrs.toolRefresh);
            return temp;
          }
        }// link
    }

})();

/**=========================================================
 * Module: demo-panels.js
 * Provides a simple demo for panel actions
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .controller('PanelsCtrl', PanelsCtrl);

    PanelsCtrl.$inject = ['$scope', '$timeout'];
    function PanelsCtrl($scope, $timeout) {

        activate();

        ////////////////

        function activate() {

          // PANEL COLLAPSE EVENTS
          // -----------------------------------

          // We can use panel id name for the boolean flag to [un]collapse the panel
          $scope.$watch('panelDemo1',function(newVal){

              console.log('panelDemo1 collapsed: ' + newVal);

          });


          // PANEL DISMISS EVENTS
          // -----------------------------------

          // Before remove panel
          $scope.$on('panel-remove', function(event, id, deferred){

            console.log('Panel #' + id + ' removing');

            // Here is obligatory to call the resolve() if we pretend to remove the panel finally
            // Not calling resolve() will NOT remove the panel
            // It's up to your app to decide if panel should be removed or not
            deferred.resolve();

          });

          // Panel removed ( only if above was resolved() )
          $scope.$on('panel-removed', function(event, id){

            console.log('Panel #' + id + ' removed');

          });


          // PANEL REFRESH EVENTS
          // -----------------------------------

          $scope.$on('panel-refresh', function(event, id) {
            var secs = 3;

            console.log('Refreshing during ' + secs +'s #'+id);

            $timeout(function(){
              // directive listen for to remove the spinner
              // after we end up to perform own operations
              $scope.$broadcast('removeSpinner', id);

              console.log('Refreshed #' + id);

            }, 3000);

          });

          // PANELS VIA NG-REPEAT
          // -----------------------------------

          $scope.panels = [
            {
              id: 'panelRepeat1',
              title: 'Panel Title 1',
              body: 'Nulla eget lorem leo, sit amet elementum lorem. '
            },
            {
              id: 'panelRepeat2',
              title: 'Panel Title 2',
              body: 'Nulla eget lorem leo, sit amet elementum lorem. '
            },
            {
              id: 'panelRepeat3',
              title: 'Panel Title 3',
              body: 'Nulla eget lorem leo, sit amet elementum lorem. '
            }
          ];
        }

    } //PanelsCtrl

})();


/**=========================================================
 * Drag and drop any panel based on jQueryUI portlets
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('portlet', portlet);

    portlet.$inject = ['$timeout', '$localStorage'];
    function portlet ($timeout, $localStorage) {
      var storageKeyName = 'portletState';

      return {
        restrict: 'A',
        link: link
      };

      /////////////

      function link(scope, element) {

        // not compatible with jquery sortable
        if(!$.fn.sortable) return;

        element.sortable({
          connectWith:          '[portlet]', // same like directive
          items:                'div.panel',
          handle:               '.portlet-handler',
          opacity:              0.7,
          placeholder:          'portlet box-placeholder',
          cancel:               '.portlet-cancel',
          forcePlaceholderSize: true,
          iframeFix:            false,
          tolerance:            'pointer',
          helper:               'original',
          revert:               200,
          forceHelperSize:      true,
          update:               savePortletOrder,
          create:               loadPortletOrder
        });

      }


      function savePortletOrder(event/*, ui*/) {
        var self = event.target;
        var data = angular.fromJson($localStorage[storageKeyName]);

        if(!data) { data = {}; }

        data[self.id] = $(self).sortable('toArray');

        if(data) {
          $timeout(function() {
            $localStorage[storageKeyName] = angular.toJson(data);
          });
        }
      }

      function loadPortletOrder(event) {
        var self = event.target;
        var data = angular.fromJson($localStorage[storageKeyName]);

        if(data) {

          var porletId = self.id,
              panels   = data[porletId];

          if(panels) {
            var portlet = $('#'+porletId);

            $.each(panels, function(index, value) {
               $('#'+value).appendTo(portlet);
            });
          }

        }
      }

    }

})();

(function() {
    'use strict';

    angular
        .module('app.preloader')
        .directive('preloader', preloader);

    preloader.$inject = ['$animate', '$timeout', '$q'];
    function preloader ($animate, $timeout, $q) {

        var directive = {
            restrict: 'EAC',
            template:
              '<div class="preloader-progress">' +
                  '<div class="preloader-progress-bar" ' +
                       'ng-style="{width: loadCounter + \'%\'}"></div>' +
              '</div>'
            ,
            link: link
        };
        return directive;

        ///////

        function link(scope, el) {

          scope.loadCounter = 0;

          var counter  = 0,
              timeout;

          // disables scrollbar
          angular.element('body').css('overflow', 'hidden');
          // ensure class is present for styling
          el.addClass('preloader');

          appReady().then(endCounter);

          timeout = $timeout(startCounter);

          ///////

          function startCounter() {

            var remaining = 100 - counter;
            counter = counter + (0.015 * Math.pow(1 - Math.sqrt(remaining), 2));

            scope.loadCounter = parseInt(counter, 10);

            timeout = $timeout(startCounter, 20);
          }

          function endCounter() {

            $timeout.cancel(timeout);

            scope.loadCounter = 100;

            $timeout(function(){
              // animate preloader hiding
              $animate.addClass(el, 'preloader-hidden');
              // retore scrollbar
              angular.element('body').css('overflow', '');
            }, 600);
          }

          function appReady() {
            var deferred = $q.defer();
            var viewsLoaded = 0;
            // if this doesn't sync with the real app ready
            // a custom event must be used instead
            var off = scope.$on('$viewContentLoaded', function () {
              viewsLoaded ++;
              // we know there are at least two views to be loaded
              // before the app is ready (1-index.html 2-app*.html)
              if ( viewsLoaded === 2) {
                // with resolve this fires only once
                $timeout(function(){
                  deferred.resolve();
                }, 150);

                off();
              }

            });

            return deferred.promise;
          }

        } //link
    }

})();
/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.routes')
        .provider('RouteHelpers', RouteHelpersProvider)
        ;

    RouteHelpersProvider.$inject = ['APP_REQUIRES'];
    function RouteHelpersProvider(APP_REQUIRES) {

      /* jshint validthis:true */
      return {
        // provider access level
        basepath: basepath,
        resolveFor: resolveFor,
        // controller access level
        $get: function() {
          return {
            basepath: basepath,
            resolveFor: resolveFor
          };
        }
      };

      // Set here the base of the relative path
      // for all app views
      function basepath(uri) {
        return 'app/views/' + uri;
      }

      // Generates a resolve object by passing script names
      // previously configured in constant.APP_REQUIRES
      function resolveFor() {
        var _args = arguments;
        return {
          deps: ['$ocLazyLoad','$q', function ($ocLL, $q) {
            // Creates a promise chain for each argument
            var promise = $q.when(1); // empty promise
            for(var i=0, len=_args.length; i < len; i ++){
              promise = andThen(_args[i]);
            }
            return promise;

            // creates promise to chain dynamically
            function andThen(_arg) {
              // also support a function that returns a promise
              if(typeof _arg === 'function')
                  return promise.then(_arg);
              else
                  return promise.then(function() {
                    // if is a module, pass the name. If not, pass the array
                    var whatToLoad = getRequired(_arg);
                    // simple error check
                    if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                    // finally, return a promise
                    return $ocLL.load( whatToLoad );
                  });
            }
            // check and returns required data
            // analyze module items with the form [name: '', files: []]
            // and also simple array of script files (for not angular js)
            function getRequired(name) {
              if (APP_REQUIRES.modules)
                  for(var m in APP_REQUIRES.modules)
                      if(APP_REQUIRES.modules[m].name && APP_REQUIRES.modules[m].name === name)
                          return APP_REQUIRES.modules[m];
              return APP_REQUIRES.scripts && APP_REQUIRES.scripts[name];
            }

          }]};
      } // resolveFor

    }

})();


/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

/* =======================  Factory  ======================    */

angular.module('wishbook')
  .factory('Company', function ($state, $resource) {
      return $resource('api/v1/companies/:id/:sub_resource/?format=json', {id: '@id', sub_resource: '@sub_resource'}, {
            update: {
                    method: 'PUT'
            },
             patch: {
                    method: 'PATCH',
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data) {

                              if (data === undefined)
                                return data;

                              var fd = new FormData();
                              angular.forEach(data, function(value, key) {
                      //          alert(JSON.stringify(value));
                                if (value instanceof FileList) {
                                 //   alert('image');
                                    if (value.length == 1) {
                                 //     alert('append');
                                      fd.append(key, value[0]);
                                    }
                                }
                                else if(key == "category"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("category", value[i]);
                                  }
                                }
                                else {
                                fd.append(key, value);
                                }
                              });

                              return fd;
                              console.log(data);
                    }
            }
      });
});

/*angular.module('wishbook')
  .factory('CompanyUsers', function ($state, $resource) {
      return $resource('api/companyusers/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});*/

angular.module('wishbook')
  .factory('User', function ($state, $resource) {
      return $resource('api/v1/users/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});


angular.module('wishbook')
  .factory('CompanyPhoneAlias', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/aliases/:id/?format=json', {id: '@id', cid: '@cid'}, {
            save: {
                    method: 'POST'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('CompanyPricelist', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/price-list/:id/?format=json', {id: '@id', cid: '@cid'}, {
            save: {
                    method: 'POST'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('CompanyBuyergroupRule', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/group-types/:id/?format=json', {id: '@id', cid: '@cid'}, {
            save: {
                    method: 'POST'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('CompanyType', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/types/:id/?format=json', {id: '@id', cid: '@cid'}, {
            save: {
                    method: 'POST'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('CheckOtpAndChangePassword', function ($state, $resource) {
      return $resource('api/checkotpandchangepassword/:id/?format=json', {id: '@id'}, {
            save: {
                    method: 'POST'
            },
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('Brand', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/brands/:id/:sub_resource/?format=json', {id: '@id', cid: '@cid', sub_resource: '@sub_resource'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH',
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data) {
                         //     alert(JSON.stringify(data));
                              if (data === undefined)
                                return data;

                              var fd = new FormData();
                              angular.forEach(data, function(value, key) {
                      //          alert(JSON.stringify(value));
                                if (value instanceof FileList) {
                                 //   alert('image');
                                    if (value.length == 1) {
                                 //     alert('append');
                                      fd.append(key, value[0]);
                                    }
                                }
                               /* else if(key == "category"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("category", value[i]);
                                  }
                                }  */
                                else {
                                fd.append(key, value);
                                }
                              });

                              return fd;
                              console.log(data);
                    }
            },
            save:{
                    method: 'POST',
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data) {

                              if (data === undefined)
                                return data;

                              var fd = new FormData();
                              angular.forEach(data, function(value, key) {
                      //          alert(JSON.stringify(value));
                                if (value instanceof FileList) {
                                 //   alert('image');
                                    if (value.length == 1) {
                                 //     alert('append');
                                      fd.append(key, value[0]);
                                    }
                                }
                              /*  else if(key == "category"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("category", value[i]);
                                  }
                                }  */
                                else {
                                fd.append(key, value);
                                }
                              });

                              return fd;
                              console.log(data);
                    }
        }
      });
});

angular.module('wishbook')
  .factory('BrandDistributor', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/brand-distributor/:id/?format=json', {id: '@id', cid: '@cid'}, {
      //return $resource('api/branddistributor/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('hasBrandPermission', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/brands/has_permission/?format=json', {cid: '@cid'}, {
      //return $resource('api/branddistributor/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});


angular.module('wishbook')
  .factory('Category', function ($state, $resource) {
      return $resource('api/v1/category/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('City', function ($state, $resource) {
      return $resource('api/v1/city/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('Country', function ($state, $resource) {
      return $resource('api/v1/country/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('State', function ($state, $resource) {
      return $resource('api/v1/state/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
    .factory('Whatsappgrouplink', function ($state, $resource) {
        return $resource('api/v1/config/:id/?format=json', { id: '@id' }, {
            update: {
                method: 'PUT'
            },
            patch: {
                method: 'PATCH'
            }
        });
    });

angular.module('wishbook')
  .factory('CompanyList', function ($state, $resource) {
      return $resource('api/v1/companies/dropdown/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('BecomeASeller', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/catalog-seller/:id/?format=json', {id: '@id', cid: '@cid'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('CatalogSeller', function ($state, $resource) {
      return $resource('api/v1/catalog-seller-admin/:id/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('CatalogsAllSupplier', function ($state, $resource) {
      return $resource('api/v1/catalogs/:id/all_suppliers/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});
angular.module('wishbook')
  .factory('DisableAllCatalogs', function ($state, $resource) {
      return $resource('api/v1/companies/:id/disable-all-catalogs/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});
angular.module('wishbook')
  .factory('CatalogsToCheckDepplink', function ($state, $resource) {
      return $resource('api/v1/catalogs/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('DropdownCatalog', function ($state, $resource) {
      return $resource('api/v1/catalogs/stafdropdown/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('Meeting', function ($state, $resource) {
      return $resource('api/v1/meetings/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('SalesmanMeetings', function ($state, $resource) {
    return $resource('api/v1/users/:id/meetings/report/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('AssignCatalogToCompany', function ($state, $resource) {
      return $resource('api/v1/assigncatalogtocompany/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('CatalogRes', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/catalogs/:id/:sub_resource/?format=json', {id: '@id', cid:'@cid', sub_resource: '@sub_resource'}, {
            update: {
                    method: 'PUT'
            }
      });
});

angular.module('wishbook')
  .factory('Refund', function ($state, $resource) {
      return $resource('api/v1/wishbook-refunds/:id/:sub_resource/?format=json', {id: '@id', sub_resource: '@sub_resource'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('CatalogUploadOptions', function ($state, $resource) {
      return $resource('api/v1/catalog-upload-options/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('CategoryEavAttribute', function ($state, $resource) {
      return $resource('api/v1/category-eav-attribute/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('Catalog', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/catalogs/:id/:sub_resource/?format=json', {id: '@id', cid:'@cid', sub_resource: '@sub_resource'}, {

            patch: {
                    method: 'PATCH',
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data) {

                              if (data === undefined)
                                return data;

                              var fd = new FormData();
                              angular.forEach(data, function(value, key) {
                      //          alert(JSON.stringify(value));
                                if (value instanceof FileList) {
                                 //   alert('image');
                                    if (value.length == 1) {
                                 //     alert('append');
                                      fd.append(key, value[0]);
                                    }
                                }
                                /*else if(key == "category"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("category", value[i]);
                                  }
                                }*/
                                else {
                                fd.append(key, value);
                                }
                              });

                              return fd;
                              console.log(data);
                    }
            },
            save:{
                    method: 'POST',
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data) {

                              if (data === undefined)
                                return data;

                              var fd = new FormData();
                              angular.forEach(data, function(value, key) {
                      //          alert(JSON.stringify(value));
                                if (value instanceof FileList) {
                                 //   alert('image');
                                    if (value.length == 1) {
                                 //     alert('append');
                                      fd.append(key, value[0]);
                                    }
                                }
                                /*else if(key == "category"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("category", value[i]);
                                  }
                                }*/
                                else {
                                fd.append(key, value);
                                }
                              });

                             console.log("fd");
                              console.log(fd);

                              return fd;

                    }
        },
      });
});

/*angular.module('wishbook')
  .factory('CatalogApp', function ($state, $resource) {
      return $resource('api/catalogapponly/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            }
      });
});

angular.module('wishbook')
  .factory('CatalogApps', function ($state, $resource) {
      return $resource('api/catalogapp/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            }
      });
});*/

/*angular.module('wishbook')
  .factory('CatalogApp', function ($state, $resource) {
      return $resource('api/catalogapp/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            }
      });
});*/

angular.module('wishbook')
  .factory('Product', function ($state, $resource) {
      return $resource('api/v1/products/:id/:sub_resource/?format=json', {id: '@id', sub_resource: '@sub_resource'}, {

            patch: {
                    method: 'PATCH',
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data) {

                              if (data === undefined)
                                return data;

                              var fd = new FormData();
                              angular.forEach(data, function(value, key) {
                      //          alert(JSON.stringify(value));
                                if (value instanceof FileList) {
                                 //   alert('image');
                                    if (value.length == 1) {
                                 //     alert('append');
                                      fd.append(key, value[0]);
                                    }
                                }
                                /*else if(key == "catalog"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("catalog", value[i]);
                                  }
                                }*/
                                else {
                                fd.append(key, value);
                                }
                              });

                              return fd;
                              console.log(data);
                    }
            },
            save:{
                    method: 'POST',
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data) {

                              if (data === undefined)
                                return data;

                              var fd = new FormData();
                              angular.forEach(data, function(value, key) {
                      //          alert(JSON.stringify(value));
                                if (value instanceof FileList) {
                                 //   alert('image');
                                    if (value.length == 1) {
                                 //     alert('append');
                                      fd.append(key, value[0]);
                                    }
                                }
                                /*else if(key == "catalog"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("catalog", value[i]);
                                  }
                                }*/
                                else {
                                fd.append(key, value);
                                }
                              });

                              return fd;
                              console.log(data);
                    }
        },
      });
});


/*angular.module('wishbook')
  .factory('BulkProduct', function ($state, $resource) {
      return $resource('api/products/:id/?format=json', {id: '@id'}, {

            save:{
                    method: 'POST',
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data) {
                   alert(data.length);
                      var index=0;
                    //  var fd = {};
                    var fd = new FormData();
                        for (index = 0; index < data.length; index++) {
                          //  alert(JSON.stringify(data[index]));
                            if (data[index] === undefined)
                                return data[index];


                              angular.forEach(data[index], function(value, key) {
                      //          alert(JSON.stringify(value));
                                if (value instanceof FileList) {
                                 //   alert('image');
                                    if (value.length == 1) {
                                 //     alert('append');
                                      fd.append(key, value[0]);
                                    }
                                }
                                else if(key == "catalog"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("catalog", value[i]);
                                  }
                                }
                                else {
                                fd.append(key, value);
                                }
                              });
                          //    console.log(data[index]);
                            //  console.log("fd");
                              console.log(fd);

                        }
                        return fd;
                    }
        },
      });
});*/



angular.module('wishbook')
  .factory('BuyerSegmentation', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/buyer-groups/:id/?format=json', {id: '@id', cid:'@cid'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data) {

                              if (data === undefined)
                                return data;

                              var fd = new FormData();
                              angular.forEach(data, function(value, key) {
                      //          alert(JSON.stringify(value));
                                if (value instanceof FileList) {
                                 //   alert('image');
                                    if (value.length == 1) {
                                 //     alert('append');
                                      fd.append(key, value[0]);
                                    }
                                }
                                else if(key == "category"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("category", value[i]);
                                  }
                                }
                                else if(key == "city"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("city", value[i]);
                                  }
                                }
                                else if(key == "state"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("state", value[i]);
                                  }
                                }
                                else if(key == "buyers"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("buyers", value[i]);
                                  }
                                }
                                else if(key == "group_type"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("group_type", value[i]);
                                  }
                                }
                                else {
                                fd.append(key, value);
                                }
                              });

                              return fd;
                              console.log(data);
                    }
        }
      });
});



/*angular.module('wishbook')
  .factory('ReceivedCatalog', function ($state, $resource) {
    //alert('rc fact call');
      return $resource('api/catalogapp/:id/?format=json',{id: '@id',view_type:'myreceived'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});*/


angular.module('wishbook')
  .factory('Marketing', function ($state, $resource) {
      return $resource('api/v1/marketing/:id/:sub_resource/?format=json', {id: '@id', sub_resource: '@sub_resource'}, {

            patch: {
                    method: 'PATCH',
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data) {

                              if (data === undefined)
                                return data;

                              var fd = new FormData();
                              angular.forEach(data, function(value, key) {
                                //alert(JSON.stringify(value));
                                if (value instanceof FileList) {
                                    //alert('image');
                                    if (value.length == 1) {
                                        //alert('append');
                                        fd.append(key, value[0]);
                                    }
                                }
                                else if(key == "city"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("city", value[i]);
                                  }
                                }
                                else if(key == "state"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("state", value[i]);
                                  }
                                }
                                else if(key == "test_users"){
                                  //~ fvalue = value.split(",")
                                  //~ for(var i =0; i< fvalue.length;i++){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("test_users", value[i]);
                                  }
                                }
				else if(key == "categories"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("categories", value[i]);
                                  }
                                }
                                else {
                                fd.append(key, value);
                                }
                              });

                              return fd;
                              console.log(data);
                    }
            },
            save:{
                    method: 'POST',
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data) {

                              if (data === undefined)
                                return data;

                              var fd = new FormData();
                              angular.forEach(data, function(value, key) {
                                //alert(JSON.stringify(value));
                                if (value instanceof FileList) {
                                    //alert('image');
                                    if (value.length == 1) {
                                        //alert('append');
                                        fd.append(key, value[0]);
                                    }
                                }
                                else if(key == "city"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("city", value[i]);
                                  }
                                }
                                else if(key == "state"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("state", value[i]);
                                  }
                                }
                                else if(key == "test_users"){
                                  //~ fvalue = value.split(",")
                                  //~ for(var i =0; i< fvalue.length;i++){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("test_users", value[i]);
                                  }
                                }
				else if(key == "categories"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("categories", value[i]);
                                  }
                                }
                                else {
                                fd.append(key, value);
                                }
                              });

                              return fd;
                              console.log(data);
                    }
        },
      });
});


angular.module('wishbook')
  .factory('grouptype', function ($state, $resource) {
      return $resource('api/v1/group-types/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            }
      });
});

angular.module('wishbook')
  .factory('BuyerList', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/buyers/dropdown/:id/?format=json', {id: '@id', cid:'@cid'}, {
            update: {
                    method: 'PUT'
            }
      });
});


angular.module('wishbook')
    .factory('Viewers', function ($state, $resource) {
        return $resource('api/v1/companies/:cid/catalogs/my-viewers-live/:id/?format=json', { cid: '@cid' }, {
           
        });
    });


angular.module('wishbook')
  .factory('Buyers', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/buyers/:id/:sub_resource/?format=json', {id: '@id', cid:'@cid', sub_resource: '@sub_resource'}, {
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('SupplierList', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/suppliers/dropdown/:id/?format=json', {id: '@id', cid:'@cid'}, {
            update: {
                    method: 'PUT'
            }
      });
});

angular.module('wishbook')
  .factory('Suppliers', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/suppliers/:id/?format=json', {id: '@id', cid:'@cid'}, {
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('CatalogEnquiry', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/catalog-enquiries/:id/?format=json', {id: '@id', cid:'@cid'}, {
            patch: {
                    method: 'PATCH'
            }
      });
});

/*angular.module('wishbook')
  .factory('addbuyerusingnumber', function ($state, $resource) {
      return $resource('api/addbuyerusingnumber/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            }
      });
});*/

angular.module('wishbook')
  .factory('resendbuyer', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/buyers/resend/:id/?format=json', {id: '@id', cid:'@cid'}, {
      //return $resource('api/resendbuyer/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            }
      });
});

angular.module('wishbook')
  .factory('resendsupplier', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/suppliers/resend/:id/?format=json', {id: '@id', cid:'@cid'}, {
      //return $resource('api/resendsupplier/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            }
      });
});

/*angular.module('wishbook')
  .factory('addbuyerusingcsv', function ($state, $resource, Upload) {
      return {
              upload :function(url, file, dataName){
              console.log("in factory");
                  Upload.upload({
                        url: url,
                        method: 'POST',
                        file: file,
                        fileFormDataName: dataName
                  });
              }
      }
});  */

/*angular.module('wishbook')
  .factory('addbuyerusingcsv', function ($state, $resource) {
      return $resource('api/importcsvbuyernumber/:id/?format=json', {id: '@id'}, {
            save:{
                    method: 'POST',
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data) {

                              if (data === undefined)
                                return data;

                              var fd = new FormData();
                              angular.forEach(data, function(value, key) {
                              alert(JSON.stringify(value));
                              fd.append("BuyerCSV", value[0]);

                              });
                              console.log(data);
                              return data;

                    }
        }
      });
});
*/


angular.module('wishbook')
  .factory('Skumap', function ($state, $resource) {
      return $resource('api/v1/skumap/:id/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('Warehouse', function ($state, $resource) {
      return $resource('api/v1/warehouse/:id/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('Inventory', function ($state, $resource) {
      return $resource('api/v1/inventory/:id/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('InventoryAdjustment', function ($state, $resource) {
      return $resource('api/v1/inventoryadjustment/:id/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('SyncOICSV', function ($state, $resource) {
      return $resource('api/v1/syncopeninginventorycsv/?format=json', {
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('AppInstance', function ($state, $resource) {
      return $resource('api/v1/appinstance/:id/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            }
      });
});

/*angular.module('wishbook')
  .factory('addsupplierusingnumber', function ($state, $resource) {
      return $resource('api/addsupplierusingnumber/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            }
      });
});*/

angular.module('wishbook')
  .factory('Users', function ($state, $resource) {
      return $resource('api/v1/users/:id/:sub_resource/?format=json', {id: '@id', sub_resource: '@sub_resource'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('Shares', function ($state, $resource) {
      return $resource('api/v1/shares/:id/:sub_resource/?format=json', {id: '@id', sub_resource: '@sub_resource'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
    .factory('SalesOrders', function ($state, $resource) {
        return $resource('api/v1/companies/:cid/sales-orders/:id/:sub_resource/?format=json', { id: '@id', cid: '@cid', sub_resource: '@sub_resource' }, {
            patch: {
                method: 'PATCH'
            },
            save: {
                method: 'POST',
            }
        });
    });

angular.module('wishbook')
    .factory('DropshipOrderInvoice', function ($state, $resource) {
        return $resource('api/v1/companies/:cid/order-invoice/:id/?format=json', { id: '@id', cid: '@cid' }, {
            patch: {
                method: 'PATCH'
            },
            save: {
                method: 'POST',
            }
        });
    });

angular.module('wishbook')
    .factory('SalesOrdersforInvoice', function ($state, $resource) {
        return $resource('api/v1/companies/:cid/sales-orders/:id/:sub_resource/?format=json', { id: '@id', cid: '@cid', sub_resource: '@sub_resource' }, {
            patch: {
                method: 'PATCH'
            },
            save: {
                method: 'POST',
                headers: { 'Content-Type': undefined },
                transformRequest: function (data) {
                    if (data === undefined)
                        return data;

                    var fd = new FormData();
                    angular.forEach(data, function (value, key) {
                        console.log(JSON.stringify(value));
                        if (value instanceof FileList) {
                            console.log('image');
                            //if (value.length == 1)
                            //{
                            //alert('append');
                            fd.append(key, value[0]);
                            //}
                            console.log(value);
                        }
                        else if (key == "items") {
                            console.log('items');
                            var itemarray = [];
                            for (var i = 0; i < value.length; i++) {
                                itemarray.push(value[i]);

                            }
                            fd.append("items", JSON.stringify(itemarray));
                            //console.log(itemarray);
                            //fd.append("items", value[i]);
                        }
                        else if (key == "measures") {
                            console.log('measures');

                            fd.append("measures", JSON.stringify(value));
                            //console.log(itemarray);
                            //fd.append("items", value[i]);
                        }
                        else {
                            fd.append(key, value);
                            console.log('json type');
                        }
                        console.log(fd);
                    });

                    return fd;
                    console.log(data);
                }
            }

        });
    });


angular.module('wishbook')
  .factory('SalesOrderItems', function ($state, $resource) {
      return $resource('api/salesordersitems/:id/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
    .factory('PendingOrderItemsAction', function ($state, $resource) {
        return $resource('api/v1/products/pending-order-item-action/:id/?format=json', { id: '@id' },{
            patch: {
                method: 'PATCH'
            },
            save: {
                method: 'POST',
            }
        });
    });

angular.module('wishbook')
  .factory('PurchaseOrders', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/purchase-orders/:id/:sub_resource/?format=json', {id: '@id', cid:'@cid', sub_resource: '@sub_resource'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('BrokerageOrders', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/brokerage-orders/:id/:sub_resource/?format=json', {id: '@id', cid:'@cid', sub_resource: '@sub_resource'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('wbMondeyLogDashboard', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/wbmoney-log/dashboard/?format=json', {cid:'@cid'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
    .factory('sellerDashboard', function ($state, $resource) {
        return $resource('api/v1/seller-dashboard/?format=json', {
            patch: {
                method: 'PATCH'
            },
            save: {
                method: 'POST',
            }
        });
    });

angular.module('wishbook')
  .factory('Carts', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/carts/:id/:sub_resource/?format=json', {id: '@id', cid:'@cid', sub_resource: '@sub_resource'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('PaymentMethod', function ($state, $resource) {
      return $resource('api/v1/payment-method/?format=json', {}, {

      });
});

angular.module('wishbook')
  .factory('CreditApprovedLine', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/credits-approved-line/?format=json', {cid: '@cid'}, {

      });
});

angular.module('wishbook')
  .factory('PasswordReset', function ($state, $resource) {
      return $resource('api/v1/auth/password-reset/?format=json', {}, {
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('Selection', function ($state, $resource) {
      return $resource('api/v1/selections/:id/:sub_resource/?format=json', {id: '@id', sub_resource: '@sub_resource'}, {
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('Attendance', function ($state, $resource) {
      return $resource('api/v1/attendance/:id/?format=json', {id: '@id'}, {
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('MultiOrder', function ($state, $resource) {
      return $resource('api/v1/multiorder/?format=json', {}, {
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('TNC', function ($state, $resource) {
      return $resource('api/v1/tnc/?format=json', {}, {

      });
});

angular.module('wishbook')
  .factory('UserRegistration', function ($state, $resource) {
      return $resource('api/v1/auth/registration/?format=json', {}, {
          save:{
                    method: 'POST',
        }

      });
});

angular.module('wishbook')
  .factory('CompanyAccount', function ($state, $resource) {
      return $resource('api/v1/companyaccount/:id/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('Address', function ($state, $resource) {
      return $resource('api/v1/address/:id/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('LastShippingAddress', function ($state, $resource) {
      return $resource('api/v1/address/last-shipping-address/?format=json', {}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
    .factory('Shipments', function ($state, $resource) {
        return $resource('api/v1/companies/:cid/shipments/:id/?format=json', { id: '@id', cid: '@cid' }, {
            patch: {
                method: 'PATCH'
            },
            save: {
                method: 'PUT',
                headers: { 'Content-Type': undefined },
                transformRequest: function (data) {
                    if (data === undefined)
                        return data;

                    var fd = new FormData();
                    angular.forEach(data, function (value, key) {
                        console.log(JSON.stringify(value));
                        if (value instanceof FileList) {
                            console.log('image');

                            fd.append(key, value[0]);
                            //console.log(value);
                        }
                        else if (key == "measures") {
                            console.log('measures');

                            fd.append("measures", JSON.stringify(value));
                            //fd.append("items", value[i]);
                        }
                        else {
                            fd.append(key, value);
                            console.log('json type');
                        }
                        console.log(fd);
                    });

                    return fd;
                }
            }
        });
    });

angular.module('wishbook')
  .factory('Manifest', function ($state, $resource) {
      return $resource('api/v2/companies/:cid/manifests/:id/:sub_resource/?format=json', {id: '@id', cid: '@cid', sub_resource: '@sub_resource'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            },
            put: {
                method: 'POST',
                headers: { 'Content-Type': undefined },
                transformRequest: function (data) {
                    if (data === undefined)
                        return data;

                    var fd = new FormData();
                    angular.forEach(data, function (value, key) {
                        console.log(JSON.stringify(value));
                        if (value instanceof FileList) {
                            console.log('image');

                            fd.append(key, value[0]);
                            //console.log(value);
                        }
                        else if (key == "shipments") {
                            console.log('shipmentssssssssssssssss');
                            console.log(value)
                            fd.append("shipments", value);
                        }
                        else {
                            fd.append(key, value);
                            console.log('json type');
                        }
                        console.log(fd);
                    });

                    return fd;
                }
            }
      });
});
angular.module('wishbook')
  .factory('ManifestCopy', function ($state, $resource) {
      return $resource('api/v2/companies/:cid/manifests/:id/signed-copy/?format=json', {id: '@id', cid: '@cid'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            },
            put: {
                method: 'POST',
                headers: { 'Content-Type': undefined },
                transformRequest: function (data) {
                    if (data === undefined)
                        return data;

                    var fd = new FormData();
                    angular.forEach(data, function (value, key) {
                        console.log(JSON.stringify(value));
                        if (value instanceof FileList) {
                            console.log('image');

                            fd.append(key, value[0]);
                            //console.log(value);
                        }
                        else if (key == "shipments") {
                            console.log('shipmentssssssssssssssss');
                            console.log(value)
                            fd.append("shipments", value);
                        }
                        else {
                            fd.append(key, value);
                            console.log('json type');
                        }
                        console.log(fd);
                    });

                    return fd;
                }
            }
      });
});
    
angular.module('wishbook')
  .factory('ShippingCharge', function ($state, $resource) {
      return $resource('api/v1/shipping-charges/:id/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});


angular.module('wishbook')
  .factory('OrderInvoice', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/order-invoice/:id/:sub_resource/?format=json', {id: '@id', cid:'@cid', sub_resource: '@sub_resource'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('SalesmanLocation', function ($state, $resource) {
      return $resource('api/v1/salesmanlocation/:id/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('BuyerSalesmen', function ($state, $resource) {
      return $resource('api/v1/buyersalesmen/:id/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('AssignGroups', function ($state, $resource) {
      return $resource('api/v1/assigngroups/:id/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('Promotions', function ($state, $resource) {
      return $resource('api/v1/promotions/?show_on_webapp=True',  {

      });
});

angular.module('wishbook')
  .factory('EnumGroup', function ($state, $resource) {
      return $resource('api/v1/enumgroup/',  {

      });
});

angular.module('wishbook')
  .factory('kyc', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/kyc/:id/?format=json', {cid: '@cid',id: '@id'},  {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
  .factory('BankDetails', function ($state, $resource) {
      return $resource('api/v1/companies/:cid/bank-details/:id/?format=json', {cid: '@cid',id: '@id'},  {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

  angular.module('wishbook')
  .factory('buyerdiscount', function ($state, $resource) {
      return $resource('api/v1/buyer-discount/:id/?format=json',  {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});

angular.module('wishbook')
    .factory('brandwisediscount', function ($state, $resource) {
        return $resource('api/v1/discount-rule/:id/?format=json', { id: '@id' }, {
            patch: {
                method: 'PATCH'
            },
            save: {
                method: 'POST',
            }
        });
    });

// Notification factory for admin
angular.module('wishbook')
  .factory('Notification', function ($state, $resource) {
      return $resource('api/v1/notification/?format=json', {
        save: {
                method: 'POST'
        }
        // patch: {
        //         method: 'PATCH'
        // }
      });
});
angular.module('wishbook')
  .factory('NotificationEntity', function ($state, $resource) {
      return $resource('api/v1/notification-entity/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('NotificationTemplate', function ($state, $resource) {
      return $resource('api/v1/notification-entity-type/:id/?format=json', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

/* =======================  djangoAuth ====================    */

angular.module('wishbook')
  .service('djangoAuth', function djangoAuth($q, $http, $cookies, $rootScope, $state, $location, $localStorage, Suppliers, Buyers, CatalogEnquiry) {
   // AngularJS will instantiate a singleton by calling "new" on this function
    $rootScope.isInitialized = false;
    var service = {
        /* START CUSTOMIZATION HERE */
        // Change this to point to your Django REST Auth API
        // e.g. /api/rest-auth  (DO NOT INCLUDE ENDING SLASH)
        'API_URL': '/api/v1/auth',
        // Set use_session to true to use Django sessions to store security token.
        // Set use_session to false to store the security token locally and transmit it as a custom header.
        'use_session': true,
        /* END OF CUSTOMIZATION */
        'authenticated': null,
        'authPromise': null,
        'request': function(args) {

            // Let's retrieve the token from the cookie, if available
            /*if(localStorage.token){
                $http.defaults.headers.common.Authorization = 'Token ' + localStorage.token;
            }*/

            if($cookies.get('csrftoken')){
              //alert("csrf");
              $http.defaults.headers.post['X-CSRFToken'] = $cookies.get('csrftoken');
            }

            // Continue
            params = args.params || {}
            args = args || {};
            var deferred = $q.defer(),
                url = this.API_URL + args.url,
                method = args.method || "GET",
                params = params,
                data = args.data || {};
            // Fire the request, as configured.
            $http({
                url: url,
                withCredentials: this.use_session,
                method: method.toUpperCase(),
                headers: {'X-CSRFToken': $cookies.get('csrftoken')},
                params: params,
                data: data
            })
            .success(angular.bind(this,function(data, status, headers, config ) {
                //if(url.indexOf('/registration/') == '-1'){
               //   console.log(JSON.stringify(data));
               if(data.id){
                localStorage.setItem('userid', data.id);
              }


                if(data.companyuser != null)
                {
                    localStorage.setItem('company', data.companyuser.company);
                }






                if(document.getElementById('iconbadge'))
                {
                  createNotificationList();
                }


                /*localStorage.setItem('username', data.username);
                localStorage.setItem('firstname', data.first_name);
                localStorage.setItem('lastname', data.last_name);*/

                if(data.username != null && $rootScope.isInitialized == false && data.companyuser != null)
                {
                    var company_id = localStorage.getItem('company');
                    Buyers.query({cid : company_id, status : 'approved', fields: 'buying_company_name,buying_company_chat_user' },
                        function(buyerslist1){
                          $rootScope.chatContacts = [];
                          var contact = {
                            "userId": "WISHBOOK",
                            "displayName": "Wishbook Support",
                              "imageLink": "https://seller.wishbook.io/app/img/logo-single.png",
                          }
                          $rootScope.chatContacts.push(contact);
                         // console.log(JSON.stringify(buyerslist1));
                          angular.forEach(buyerslist1, function(buyer, key){
                              if(buyer.buying_company_chat_user && buyer.buying_company_name){
                                var contact = {
                                  "userId": buyer.buying_company_chat_user,
                                  "displayName": buyer.buying_company_name,
                                 // "imageLink": "https://app.wishbook.io/app/img/logo-single.png",
                                }
                                $rootScope.chatContacts.push(contact);
                              }
                          });
                          //console.log($rootScope.chatContacts);
                          Buyers.query({cid : company_id, status : 'enquiry', fields: 'buying_company_name,buying_company_chat_user' },
                          function(buyerslist2){

                           // console.log(JSON.stringify(buyerslist2));
                            angular.forEach(buyerslist2, function(buyer, key){
                                if(buyer.buying_company_chat_user && buyer.buying_company_name){
                                  var contact = {
                                    "userId": buyer.buying_company_chat_user,
                                    "displayName": buyer.buying_company_name,
                                   // "imageLink": "https://app.wishbook.io/app/img/logo-single.png",
                                  }
                                  $rootScope.chatContacts.push(contact);
                                }
                            });
                              Suppliers.query({cid : company_id, status : 'enquiry', fields: 'selling_company_chat_user,selling_company_name' },
                                    function(supplierslist1){


                                      angular.forEach(supplierslist1, function(supplier, key){
                                          if(supplier.selling_company_chat_user && supplier.selling_company_name){
                                            var contact = {
                                              "userId": supplier.selling_company_chat_user,
                                              "displayName": supplier.selling_company_name,
                                           //   "imageLink": "https://app.wishbook.io/app/img/logo-single.png",
                                            }
                                            $rootScope.chatContacts.push(contact);
                                          }
                                      });
                                  Suppliers.query({cid : company_id, status : 'approved', fields: 'selling_company_chat_user,selling_company_name' },
                                    function(supplierslist2){


                                      angular.forEach(supplierslist2, function(supplier, key){
                                          if(supplier.selling_company_chat_user && supplier.selling_company_name){
                                            var contact = {
                                              "userId": supplier.selling_company_chat_user,
                                              "displayName": supplier.selling_company_name,
                                           //   "imageLink": "https://app.wishbook.io/app/img/logo-single.png",
                                            }
                                            $rootScope.chatContacts.push(contact);
                                          }
                                      });
                                      //console.log($rootScope.chatContacts);
                                      $applozic.fn.applozic('loadContacts', {"contacts":$rootScope.chatContacts});
                                }); // end: Suppliers approved
                            });  //end : Suppliers enquiry
                          });  //end : Buyers enquiry
                    }); // end: Buyers approved
                 //   console.log(data.companyuser.companyname);
                     $applozic.fn
                      .applozic({
                        //baseUrl:"https://apps-test.applozic.com"
                        appId: '1a79888ef6d0fa76c522ea56a251b4fb9',      //Get your application key from https://www.applozic.com
                        userId: data.username,                     //Logged in user's id, a unique identifier for user
                      //  userName: data.first_name+" "+data.last_name,                 //User's display name
                       // displayName: data.first_name+" "+data.last_name,
                        userName: data.companyuser.companyname,
                        displayName: data.companyuser.companyname,
                        imageLink : '',                     //User's profile picture url
                        email : '',                         //optional
                        contactNumber: '',                  //optional, pass with internationl code eg: +13109097458
                        desktopNotification: true,
                        source: '1',                          // optional, WEB(1),DESKTOP_BROWSER(5), MOBILE_BROWSER(6)
                        notificationIconLink: 'https://www.applozic.com/favicon.ico',    //Icon to show in desktop notification, replace with your icon
                        authenticationTypeId: 1,          //1 for password verification from Applozic server and 0 for access Token verification from your server
                        accessToken: '',                    //optional, leave it blank for testing purpose, read this if you want to add additional security by verifying password from your server https://www.applozic.com/docs/configuration.html#access-token-url
                        locShare: true,
                        googleApiKey: "AIzaSyDKfWHzu9X7Z2hByeW4RRFJrD9SizOzZt4",   // your project google api key
                        googleMapScriptLoaded : true,   // true if your app already loaded google maps script
                        mapStaticAPIkey: "AIzaSyCWRScTDtbt8tlXDr6hiceCsU83aS2UuZw",
                        autoTypeSearchEnabled : true,     // set to false if you don't want to allow sending message to user who is not in the contact list
                        loadOwnContacts : true, //set to true if you want to populate your own contact list (see Step 4 for reference)
                        olStatus: false,
                        topicBox: true,
                      /*  getTopicDetail: function (topicId) {
                            console.log(topicId);
                            //Based on topicId, return the following details from your application
                            CatalogEnquiry.query({'cid': 1, 'applogic_conversation_id': topicId }, function(success){
                                console.log(success);
                                //if(success.length > 0){
                                    return  {
                                                'title': success[0].catalog_title,
                                                'subtitle': "Rs."+success[0].price_range+"/Pc, "+success[0].total_products+" Designs",
                                                'link': success[0].thumbnail
                                            };
                                //}

                            });
                            return {
                                'title': 'Test',      // Product title
                                'subtitle': 'some data',     // Product subTitle or Product Id
                                'link': 'image-link',        // Product image link
                                'key1': 'key1',         // Small text anything like Qty (Optional).
                                'value1': 'value1',     // Value of key1 ex-10 (number of quantity) Optional.
                                'key2': 'key2',        // Small text anything like MRP (product price) (Optional).
                                'value2': 'value2'      // Value of key2 ex-$100(Optional)
                            };
                        },  */
                        onInit : function(response) {
                                     // alert("fsd");
                                      if (response === "success") {
                                          console.log("Applozic Init SUCCESS");
                                       //   store.dispatch(initApplozicSuccess());
                                          $rootScope.isInitialized = true;

                                          //console.log('inapplog'+JSON.stringify($rootScope.chatContacts));
                                          //$applozic.fn.applozic('loadContacts', {"contacts":$rootScope.chatContacts});

                                          // login successful, perform your actions if any, for example: load contacts,
                                          // getting unread message count, etc
                                      } else {
                                          console.log("Applozic Init FAILURE");
                                          isInitialized = false;
                                       //   store.dispatch(initApplozicFailure("Unable to initialize applozic"));
                                          // error in user login/register (you can hide chat button or refresh page)
                                      }
                                 },
                      });
                     /* window.HotlineWidget.init({
                        token: "4ec63244-8307-4e7b-8af2-5305abc7a967",
                        host: "https://chat2.hotline.io",
                        externalId: data.username,     // user’s id unique to your system
                        name: data.first_name+" "+data.last_name,                // user’s name
                        email: "",    // user’s email address
                        phone: "",            // phone number without country code
                        phoneCountryCode: "+91"          // phone’s country code
                      });  */
                }

                deferred.resolve(data, status);

            }))
            .error(angular.bind(this,function(data, status, headers, config) {
                console.log("error syncing with: " + url);
                // Set request status
                if(data){
                    data.status = status;
                }
                if(status == 0){
                    if(data == ""){
                        data = {};
                        data['status'] = 0;
                        data['non_field_errors'] = ["Could not connect. Please try again."];
                    }
                    // or if the data is null, then there was a timeout.
                    if(data == null){
                        // Inject a non field error alerting the user
                        // that there's been a timeout error.
                        data = {};
                        data['status'] = 0;
                        data['non_field_errors'] = ["Server timed out. Please try again."];
                    }
                }
                deferred.reject(data, status, headers, config);
            }));
            return deferred.promise;
        },
        'register': function(username, first_name, last_name,  company_name, password1, password2, email, phone_number, country, state, city, tnc_agreed, number_verified, more){//connections_preapproved, discovery_ok, newsletter_subscribe,
      var data = {
                'username':username,
                'first_name': first_name,
                'last_name': last_name,
                'company_name': company_name,
                'password1':password1,
                'password2':password2,
                'email':email,
                'phone_number':phone_number,
                'country': country,
                'state' : state,
                'city' : city,
                'tnc_agreed': tnc_agreed,
                //'connections_preapproved': connections_preapproved,
                //'discovery_ok': discovery_ok,
                //'newsletter_subscribe': newsletter_subscribe,
                'number_verified':number_verified
               // 'company_name':company_name,
            }
            data = angular.extend(data,more);
            return this.request({
                'method': "POST",
                'url': "/registration/",
                'data' :data
            });
        },
        'login': function(name_or_number, coutry, password, otp){
            var djangoAuth = this;
            return this.request({
                'method': "POST",
                'url': "/login/",
                'data':{
                    'name_or_number':name_or_number,
                    'country':coutry,
                    'password':password,
                    'otp':otp,
                    'login_for':'webapp'
                }
            }).then(function(data){
                //var username = localStorage.getItem('username');


              if(!djangoAuth.use_session){
                ////$http.defaults.headers.common.Authorization = 'Token ' + data.key;
                //$cookies.token = data.key;
                ////localStorage.setItem("token", data.key);

              }
              djangoAuth.authenticated = true;
              $rootScope.$broadcast("djangoAuth.logged_in", data);
                $("#fc_frame").fadeIn();
            });
        },
        'logout': function(){
            var djangoAuth = this;
            return this.request({
                'method': "POST",
                'url': "/logout/"
            }).then(function(data){
                delete $http.defaults.headers.common.Authorization;

                localStorage.removeItem('sentToServer');
                localStorage.removeItem('push_que');
                localStorage.removeItem('is_staff');

                localStorage.clear();
                localStorage.setItem('company', 0);
                $("#fc_frame").fadeOut();

                //delete $cookies.token;
                ////localStorage.removeItem("token");//clear();
                djangoAuth.authenticated = false;
                $rootScope.$broadcast("djangoAuth.logged_out");
                //$state.go('page.login', {}, {reload: true});
                //$location.path("/login");
                $state.go('page.login');


                document.getElementById('mck-sidebox-launcher').style.display = "none";
                //$applozic.fn.applozic("logout");
               // $state.go('page.login', {}, {reload: true});
                $rootScope.app.offsidebarOpen = false;
                //location.reload();
            });
        },
        'changePassword': function(password1,password2){
            return this.request({
                'method': "POST",
                'url': "/password/change/",
                'data':{
                    'new_password1':password1,
                    'new_password2':password2
                }
            });
        },
        'resetPassword': function(email){
      return this.request({
                'method': "POST",
                'url': "/password/reset/",
                'data':{
                    'email':email
                }
            });
        },
        'profile': function(){
            return this.request({
                'method': "GET",
                'url': "/user/"
            });
        },
        'updateProfile': function(data){
            return this.request({
                'method': "PATCH",
                'url': "/user/",
                'data':data
            });
        },
        'verify': function(key){
            return this.request({
                'method': "POST",
                'url': "/registration/verify-email/",
                'data': {'key': key}
            });
        },
        'confirmReset': function(uid,token,password1,password2){
            return this.request({
                'method': "POST",
                'url': "/password/reset/confirm/",
                'data':{
                    'uid': uid,
                    'token': token,
                    'new_password1':password1,
                    'new_password2':password2
                }
            });
        },
        'authenticationStatus': function(restrict, force){
            // Set restrict to true to reject the promise if not logged in
            // Set to false or omit to resolve when status is known
            // Set force to true to ignore stored value and query API
            restrict = restrict || false;
            force = force || false;
            if(this.authPromise == null || force){
                this.authPromise = this.request({
                    'method': "GET",
                    'url': "/user/"
                })
            }
            var da = this;
            var getAuthStatus = $q.defer();
            if(this.authenticated != null && !force){
                // We have a stored value which means we can pass it back right away.
                if(this.authenticated == false && restrict){
                    getAuthStatus.reject("User is not logged in.");
                }else{
                    getAuthStatus.resolve();
                }
            }else{
                // There isn't a stored value, or we're forcing a request back to
                // the API to get the authentication status.
                this.authPromise.then(function(){
                    da.authenticated = true;
                    getAuthStatus.resolve();
                },function(){
                    da.authenticated = false;
                    if(restrict){
                        getAuthStatus.reject("User is not logged in.");
                    }else{
                        getAuthStatus.resolve();
                    }
                });
            }
            return getAuthStatus.promise;
        },
        'initialize': function(url, sessions){
            this.API_URL = url;
            this.use_session = sessions;
            return this.authenticationStatus();
        }

    }
    return service;
  });


angular.module('wishbook')
  .factory('CheckAuthenticated', function ($q, djangoAuth, $state) {
      //alert("CheckAuthenticated");
      return {
        check : function() {
            var deferred = $q.defer();
            /*alert("factory call====");
            dd=djangoAuth.authenticationStatus();
            alert(JSON.stringify(dd));
            alert(dd.$$state.status);*/

            djangoAuth.authenticationStatus(true).then(function(){
                //alert("authenticated resolve");
                deferred.resolve();



            },function(data){
                //alert("authenticated redirect");
                $state.go('page.login');
            });
         //   return deferred.promise;
        }
      };

});


angular.module('wishbook')
  .factory('ToDashboard', function ($q, djangoAuth, $state, Company) {


      return {

        check : function() {
            var deferred = $q.defer();
            djangoAuth.authenticationStatus(true).then(function(){
              //alert("toDashboard redirect");
                //$state.go('app.dashboard');
                djangoAuth.profile().then(function(data){
                    if (data.is_staff == true){
                        localStorage.setItem('is_staff', true);
                        //$state.go('app.companies');
                        $state.go('app.dashboard');
                    }
                    else{
                        localStorage.removeItem('is_staff');
                        $state.go('app.dashboard');
                        //$state.go('app.catalog');
                        //$state.go('app.browse');

                        /*if(data.companyuser != null){
                            Company.get({id: data.companyuser.company},function(result) {
                                if(result.brand_added_flag == "no")
                                {
                                    $state.go('app.company');
                                }
                                else
                                {
                                    $state.go('app.catalog');
                                }
                            })
                        }
                        else{
                            $state.go('app.catalog');
                        }*/
                    }
                })

            },function(data){
              //alert("toDashboard resolve");
                deferred.resolve();
            });
           // return deferred.promise;
        }

      };

});

/* ********************* Start:  Factory of API version v2 ******************* */
angular.module('wishbook')
  .factory('v2Category', function ($state, $resource) {
      return $resource('api/v2/category/:id/?format=json&parent=10', {id: '@id'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('v2CategoryEavAttribute', function ($state, $resource) {
      return $resource('api/v2/category-eav-attribute/:sub_resource/:id/?format=json', {id: '@id', sub_resource: '@sub_resource'}, {
            update: {
                    method: 'PUT'
            },
            patch: {
                    method: 'PATCH'
            }
      });
});

angular.module('wishbook')
  .factory('v2Products', function ($state, $resource) {
      return $resource('api/v2/products/:id/:sub_resource/?format=json', { id: '@id', sub_resource: '@sub_resource'}, {
            patch: {
                    method: 'PATCH',
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data) {

                              if (data === undefined)
                                return data;

                              var fd = new FormData();
                              angular.forEach(data, function(value, key) {
                      //          alert(JSON.stringify(value));
                                if (value instanceof FileList) {
                                 //   alert('image');
                                    if (value.length == 1) {
                                 //     alert('append');
                                      fd.append(key, value[0]);
                                    }
                                }
                                /*else if(key == "catalog"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("catalog", value[i]);
                                  }
                                }*/
                                else {
                                fd.append(key, value);
                                }
                              });

                              return fd;
                              console.log(data);
                    }
            },
            save:{
                    method: 'POST',
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data) {

                              if (data === undefined)
                                return data;

                              var fd = new FormData();
                              angular.forEach(data, function(value, key) {
                      //          alert(JSON.stringify(value));
                                if (value instanceof FileList) {
                                 //   alert('image');
                                    if (value.length == 1) {
                                 //     alert('append');
                                      fd.append(key, value[0]);
                                    }
                                }
                                /*else if(key == "catalog"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("catalog", value[i]);
                                  }
                                }*/
                                else {
                                fd.append(key, value);
                                }
                              });

                              return fd;
                              console.log(data);
                    }
            }
      });
});

angular.module('wishbook')
  .factory('v2ProductsPhotos', function ($state, $resource) {
      return $resource('api/v2/products-photos/:id/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH',
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data) {

                              if (data === undefined)
                                return data;

                              var fd = new FormData();
                              angular.forEach(data, function(value, key) {
                      //          alert(JSON.stringify(value));
                                if (value instanceof FileList) {
                                 //   alert('image');
                                    if (value.length == 1) {
                                 //     alert('append');
                                      fd.append(key, value[0]);
                                    }
                                }
                                /*else if(key == "catalog"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("catalog", value[i]);
                                  }
                                }*/
                                else {
                                fd.append(key, value);
                                }
                              });

                              return fd;
                              console.log(data);
                    }
            },
            save:{
                    method: 'POST',
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data) {

                              if (data === undefined)
                                return data;

                              var fd = new FormData();
                              angular.forEach(data, function(value, key) {
                      //          alert(JSON.stringify(value));
                                if (value instanceof FileList) {
                                 //   alert('image');
                                    if (value.length == 1) {
                                 //     alert('append');
                                      fd.append(key, value[0]);
                                    }
                                }
                                /*else if(key == "catalog"){
                                  for(var i =0; i< value.length;i++){
                                  fd.append("catalog", value[i]);
                                  }
                                }*/
                                else {
                                fd.append(key, value);
                                }
                              });

                              return fd;
                              console.log(data);
                    }
            }
      });
});  
  
angular.module('wishbook')
  .factory('v2ShippingCharge', function ($state, $resource) {
      return $resource('api/v2/shipping-charges/:id/?format=json', {id: '@id'}, {
            patch: {
                    method: 'PATCH'
            },
            save:{
                    method: 'POST',
            }
      });
});
angular.module('wishbook')
    .factory('v2brandwisediscount', function ($state, $resource) {
        return $resource('api/v2/discount-rule/:id/?format=json', { id: '@id' }, {
            patch: {
                method: 'PATCH'
            },
            save: {
                method: 'POST',
            }
        });
}); 
angular.module('wishbook')
    .factory('v2BulkUpdateProductSeller', function ($state, $resource) {
        return $resource('api/v2/products/bulk-update-product-seller/?format=json', {
            patch: {
                method: 'PATCH'
            },
            save: {
                method: 'POST',
            }
        });
});

angular.module('wishbook')
    .factory('v2ProductsMyDetails', function ($state, $resource) {
        return $resource('api/v2/products/:id/mydetails/?format=json', {id: '@id'},  {
            patch: {
                method: 'PATCH'
            },
            save: {
                method: 'POST',
            }
        });
}); 
    
/* ********************* End:  Factory of API version v2 ********************* */

(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(routesConfig)
        .run(function(djangoAuth, $state, $cookies, $http, $rootScope, $window, Buyers, Suppliers){

         // alert("1 time");
       /*   djangoAuth.authenticationStatus(true).then(function(){
           // alert("authenticated");
            djangoAuth.profile().then(function(data){
           // $rootScope.sidebar = true;
         //  alert("companytest 1");
            $rootScope.app.offsidebarOpen = false;
            if(data.companyuser != null)
            {
            //  alert("companytest 2");
              Company.get({id: data.companyuser.company},function(result) {
             //   alert(data.companyuser.company);
              //  alert("companytest");
                /*if(result.company_type == "manufacturer")
                {
                  if($scope.links != null)
                  {
                    for(var i =0; i< $scope.links.length; i++)
                    {
                      angular.forEach($scope.links[i], function(value, key) {
                          if((key == "name")&&(value == "Suppliers"))
                          {
                              $scope.links.splice(i, 1);
                          }
                        })
                    }
                  }
                }
                if(result.brand_added_flag == "no")
                {
                  //$rootScope.sidebar = false;
                  $rootScope.app.offsidebarOpen = false;
                  //$location.path('/company');
                  alert("brand no");

                }

              })


            }
            else{
                //$rootScope.sidebar = false;
                $rootScope.app.offsidebarOpen = false;
               // alert("no company")
                $state.go('app.company');
               // $location.path('/company');
            }

            })
          });*/

          $rootScope.online = navigator.onLine;
          $window.addEventListener("offline", function() {
            $rootScope.$apply(function() {
              $rootScope.online = false;
              alert("Check internet connection.");
            });
          }, false);

            /*var clickFunction = function (event) {
                //do some stuff here
                alert("Check internet connection.");
                window.removeEventListener('offline',clickFunction, false );

            };
            window.addEventListener("offline", clickFunction, false);*/

          //window.addEventListener("offline", function(e) {alert("Check internet connection.");}, false)

          /*$window.addEventListener("online", function() {
            $rootScope.$apply(function() {
              $rootScope.online = true;
              alert("online");
            });
          }, false);*/


          $http.defaults.headers.common['X-CSRFToken'] = $cookies.get('csrftoken');

          //djangoAuth.initialize(API_URL+'/rest-auth', false);
          djangoAuth.initialize('/api/v1/auth', true);

        });  // end: run()

    routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider', '$httpProvider'];
    function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper, $httpProvider){
        /*console.log(window.location);
        console.log(window.location.href);
        console.log(window.location.origin);*/
        /*console.log($stateProvider);
        console.log($locationProvider);
        console.log($urlRouterProvider);
        console.log($httpProvider);*/
        /*alert($location.search());
        alert($location.search().target);*/

        function getQueryParam(param) {
            var result =  window.location.href.match(
                new RegExp("(\\?|&)" + param + "(\\[\\])?=([^&]*)")
            );

            return result ? result[3] : false;
        }
        var fullurl = window.location.href;
        var catalogtype = '';
        var user_company_name = '';
      //  console.log(fullurl);

        fullurl = fullurl.toString();
      //  console.log(fullurl);

        if(fullurl.indexOf("type=") > -1){
            var id = getQueryParam("id");
            var name = getQueryParam("name");
            var status = getQueryParam("status");

            if(fullurl.indexOf("type=buyer") > -1){
                window.location= window.location.origin.toString()+"/#/app/buyers"
                //$state.go('app.buyers');
                /*$state.go('app.buyers', null, {
                    location: 'replace'
                })
                //$urlRouterProvider.otherwise('/app/buyers');
                $rootScope.$on('$routeChangeStart', function(next, current) {
                   //... you could trigger something here like replacing the actual url ...
                   //$location.path('/app/buyers').search('day='+day).replace();
                   $location.path('/app/buyers').replace();
                });*/
            }
            else if (fullurl.indexOf("type=supplier") > -1){
                window.location= window.location.origin.toString()+"/#/app/suppliers"
            }
            else if (fullurl.indexOf("type=sales") > -1){
                window.location= window.location.origin.toString()+"/#/app/order-detail/?type=salesorders&id="+id.toString()+"&name="+name.toString()
            }
            else if (fullurl.indexOf("type=purchase") > -1){
                window.location= window.location.origin.toString()+"/#/app/order-detail/?type=purchaseorders&id="+id.toString()+"&name="+name.toString()+"&status="+status.toString()
            }
            else if (fullurl.indexOf("type=catalog") > -1){
              var company_id = localStorage.getItem('company');
              var user_id = localStorage.getItem('userid');

              $.get('api/v1/users/'+ user_id +'/?format=json')
              .success(function(usrdata) {
                user_company_name = usrdata.companyuser.companyname;
              })
             .error(function(usrdata) {
                  console.log('Error: ' + usrdata);
              });

              $.get('api/v1/companies/'+ company_id +'/catalogs/'+id+'/?format=json')
              .success(function(data) {
                    console.log(data);
                    var catalogtitle = data.title;
                    if(user_company_name == data.company){
                      catalogtype = 'mycatalog';
                      window.location = window.location.origin.toString()+"#/app/product/?type=mycatalog&id="+id.toString()+"&name="+catalogtitle
                    }
                    else if(data.push_id != null)
                    {
                      catalogtype = 'receivedcatalog';
                      window.location = window.location.origin.toString()+"/#/app/products-detail/?type="+ catalogtype +"&id="+id.toString()+"&name="+catalogtitle
                    }
                    else
                    {
                      catalogtype = 'publiccatalog';
                      window.location = window.location.origin.toString()+"/#/app/products-detail/?type="+ catalogtype +"&id="+id.toString()+"&name="+catalogtitle
                    }
                    console.log(catalogtype);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });

                //#window.location= window.location.origin.toString()+"/#/app/catalog"
                //window.location= window.location.origin.toString()+"/#/app/products-detail/?type=receivedcatalog&id="+id.toString()

            }
        }

        var credential_error = 0;

        $httpProvider.interceptors.push(function($q, $location, $injector, $cookies, $rootScope, toaster) {
            //added toaster files and html tag in index.html and set dependency in 'app.routes'.
            return {
                /*'request': function(config) {
                    // request your $rootscope messaging should be here?
                    alert("request" + JSON.stringify(config));
                    return config;
                },*/
                // optional method
                /*'requestError': function(rejection) {
                    alert("requestError" + JSON.stringify(rejection));
                    return $q.reject(rejection);
                },*/
                /*'response': function(response) {
                    // response your $rootscope messagin should be here?
                    alert("response" + JSON.stringify(response));
                    $("."+progressLoaderSingleClass()).removeClass(progressLoader());

                    return response;
                },*/
                'responseError': function(rejection) {
                    //alert("responseError" + JSON.stringify(rejection));
                    $("."+progressLoaderSingleClass()).removeClass(progressLoader());

                    if(rejection.status == 502 || rejection.status == 500) {
                        var errortoaster = {
                                type:  'error',
                                title: 'Oops!!',
                                text:  'Server is Down for a while!! Please try again after sometime.'
                        };
                        toaster.pop(errortoaster.type, errortoaster.title, errortoaster.text);
                    }
                    else{
                        angular.forEach(rejection.data, function(value, key) {
                            if(key == 'non_field_errors' || key == 'detail')
                                var error_title = 'Failed'
                            else
                                var error_title = toTitleCase(key)
                            var errortoaster = {
                                type:  'error',
                                title: error_title,
                                text:  value.toString()
                            };

                            if(value.toString() == "Authentication credentials were not provided."){
                                if(credential_error == 0){
                                    credential_error = credential_error + 1;
                                    return $q.reject(rejection);
                                }
                            }

                            toaster.pop(errortoaster.type, errortoaster.title, errortoaster.text);
                        });
                    }
                    return $q.reject(rejection);
                }
            };
        });

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/auth/login');

        //
        // Application Routes
        // -----------------------------------
        $stateProvider
          .state('app', {
              url: '/app',
              abstract: true,
              templateUrl: helper.basepath('app.html'),
              resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'whirl')
          })

          .state('app.dashboard', {
              url: '/dashboard',
              title: 'Dashboard',
              templateUrl: helper.basepath('dashboard/dashboard.html'),
              resolve: angular.extend(
                  helper.resolveFor('DashboardController', 'parsley', 'ngFileUpload', 'ui.select', 'taginput', 'localytics.directives', 'toaster', 'ngJstree', 'angular-datatables', 'ngDialog', 'photoSwipe'), {
                authenticated : 'CheckAuthenticated'
               }
              )
              //authenticated:'Authenticated',
              //resolve: helper.resolveFor('dashboardCtlr')
          })

          .state('app.companies', {
              url: '/companies',
              title: 'Companies',
              templateUrl: helper.basepath('companies/company.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('companiesCtlr', 'parsley', 'ui.select','localytics.directives', 'toaster', 'angular-datatables','ngDialog', 'oitozero.ngSweetAlert'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

       /*   .state('app.mirror', {
              url: '/mirror',
              title: 'Mirror',
              templateUrl: helper.basepath('mirror/mirror.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('mirrorCtlr', 'parsley','ngFileUpload','ui.select','angular-datatables','ngDialog','localytics.directives', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          }) */

          .state('app.becomeseller', {
              url: '/becomeseller',
              title: 'Become a Seller',
              templateUrl: helper.basepath('becomeseller/becomeseller.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('becomesellerCtlr', 'parsley','ngFileUpload','ui.select','angular-datatables','ngDialog','localytics.directives', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.deeplink', {
              url: '/deeplink',
              title: 'Deeplink',
              templateUrl: helper.basepath('deeplink/deeplink.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('deeplinkCtlr', 'parsley','ngFileUpload','ui.select','angular-datatables','ngDialog','localytics.directives', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.marketing', {
              url: '/marketing',
              title: 'Marketing',
              templateUrl: helper.basepath('marketing/marketing.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('marketingCtlr', 'parsley','ngFileUpload','ui.select','angular-datatables','ngDialog','localytics.directives', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.seller_statistic', {
              url: '/seller-statistics',
              title: 'Seller Statistics',
              templateUrl: helper.basepath('seller_statistic/seller_statistic.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('sellerStatisticCtlr', 'parsley','ngFileUpload','ui.select','angular-datatables','ngDialog','localytics.directives', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.orderdashboard', {
              url: '/order-dashboard',
              title: 'Order Dashboard',
              templateUrl: helper.basepath('order/order_dashboard.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('orderDashboardCtlr', 'parsley','ngFileUpload','ui.select','angular-datatables','ngDialog','localytics.directives', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.merge', {
              url: '/merge',
              title: 'Merge',
              templateUrl: helper.basepath('merge/merge.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('mergeCtlr', 'parsley','ngFileUpload','ui.select','angular-datatables','ngDialog','localytics.directives', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.companies_buyer_supplier', {
              url: '/companies-buyer-supplier/:id',
              title: 'Companies',
              templateUrl: helper.basepath('companies/companies_buyer_supplier.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              params: { id: null, },
              resolve: angular.extend(
               helper.resolveFor('companiesBuyerSupplierCtlr', 'parsley', 'ui.select','localytics.directives', 'toaster', 'angular-datatables','ngDialog'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })
          .state('app.cart', {
              url: '/cart',
              title: 'Carts',
              templateUrl: helper.basepath('admin/cart/cart.html'),
              resolve: angular.extend(
               helper.resolveFor('cartCtlr', 'parsley', 'ui.select','localytics.directives', 'toaster', 'angular-datatables','ngDialog'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.order', {
              url: '/order/?:order_type&:order_status&:processing_status',
              title: 'Order',
              templateUrl: helper.basepath('order/order.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
             params: { order_type: null, order_status:null, processing_status:null},
              resolve: angular.extend(
               helper.resolveFor('orderCtlr', 'parsley', 'ui.select','localytics.directives', 'toaster', 'angular-datatables','ngDialog'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.products_detail', {
              url: '/products-detail/?:type&:id&:name',
              title: 'Products',
              templateUrl: helper.basepath('catalog/products_detail.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              params: { type: null, id:null, name:null},
              resolve: angular.extend(
               helper.resolveFor('productsDetailCtlr', 'parsley', 'localytics.directives', 'toaster', 'angular-datatables', 'ngDialog', 'oitozero.ngSweetAlert','photoSwipe'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })


          .state('app.salesperson_detail', {
              url: '/salesperson-detail/?:id&:name',
              title: 'Salesperson',
              templateUrl: helper.basepath('salespersons/salesperson_detail.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              params: { type: null, id:null, name:null},
              resolve: angular.extend(
               helper.resolveFor('salespersonDetailCtlr', 'parsley', 'localytics.directives', 'toaster', 'angular-datatables', 'ngDialog', 'oitozero.ngSweetAlert'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })


          .state('app.buyer_detail', {
              url: '/buyer-detail/?:id&:name',
              title: 'Buyer',
              templateUrl: helper.basepath('buyers/buyer_detail.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              params: { type: null, id:null, name:null},
              resolve: angular.extend(
               helper.resolveFor('buyerDetailCtlr', 'parsley', 'localytics.directives', 'toaster', 'angular-datatables', 'ngDialog', 'oitozero.ngSweetAlert'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.supplier_detail', {
              url: '/supplier-detail/?:id&:name',
              title: 'Supplier',
              templateUrl: helper.basepath('suppliers/supplier_detail.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              params: { type: null, id:null, name:null},
              resolve: angular.extend(
               helper.resolveFor('supplierDetailCtlr', 'parsley', 'localytics.directives', 'toaster', 'angular-datatables', 'ngDialog', 'oitozero.ngSweetAlert'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.brand_catalogs', {
              url: '/brand-catalogs/?:brand&:name&:type',
              title: 'Catalogs',
              templateUrl: helper.basepath('catalog/brand_catalogs.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              params: { type: null, id:null, name:null},
              resolve: angular.extend(
               helper.resolveFor('brandcatalogsCtlr', 'parsley', 'localytics.directives', 'toaster', 'angular-datatables', 'ngDialog', 'oitozero.ngSweetAlert', 'photoSwipe'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.map', {
              url: '/map/:id/:name',
              title: 'Map',
              templateUrl: helper.basepath('salespersons/map.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              params: { id:null, name:null},
              resolve: angular.extend(
               helper.resolveFor('mapsDetailCtlr', 'parsley', 'localytics.directives', 'toaster', 'angular-datatables'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.attendance', {
              url: '/attendance/:id/:name',
              title: 'Attendance',
              templateUrl: helper.basepath('salespersons/attendance.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              params: { id:null, name:null},
              resolve: angular.extend(
               helper.resolveFor('attendancesDetailCtlr', 'parsley', 'localytics.directives', 'toaster', 'angular-datatables'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

           .state('app.order_detail', {
              url: '/order-detail/?:type&:id&:name&:status',
              title: 'Order Detail',
              templateUrl: 'wishbook_libs/views/orderdetail/order_detail.html',
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              params: { id: null, name:null, type:null},
              resolve: angular.extend(
               helper.resolveFor('orderDetailCtlr', 'parsley', 'ui.select','localytics.directives', 'toaster', 'angular-datatables','ngDialog', 'oitozero.ngSweetAlert'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.cart_detail', {
              url: '/cart-detail/?:type&:id&:status',
              title: 'Cart Detail',
              templateUrl: helper.basepath('admin/cart/cart_detail.html'),
              params: { id: null, name:null, type:null},
              resolve: angular.extend(
               helper.resolveFor('cartDetailCtlr', 'parsley', 'ui.select','localytics.directives', 'toaster', 'angular-datatables','ngDialog', 'oitozero.ngSweetAlert'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.company', {
              url: '/company',
              title: 'Company',
              templateUrl: helper.basepath('company/company.html'),
           //   controller: 'CompanyFormController',
           //   controllerAs: 'cmp',
              resolve: angular.extend(
               helper.resolveFor('companyCtlr','parsley','ngFileUpload','ui.select','taginput','localytics.directives', 'toaster', 'ngJstree'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.companyprofile', {
              url: '/companyprofile',
              title: 'Company Profile',
              templateUrl: helper.basepath('company/companyprofile.html'),
             resolve: angular.extend(
               helper.resolveFor('companyprofileCtlr','parsley','ngFileUpload','ui.select','taginput','localytics.directives', 'toaster', 'ngJstree', 'angular-datatables', 'ngDialog'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

            .state('app.contactus', {
                url: '/contactus',
                title: 'Contact Us',
                templateUrl: helper.basepath('company/contactus.html'),
                resolve: angular.extend(
                    helper.resolveFor('ContactusController', 'parsley', 'ngFileUpload', 'ui.select', 'taginput', 'localytics.directives', 'toaster', 'ngJstree', 'angular-datatables', 'ngDialog'), {
                        authenticated: 'CheckAuthenticated'
                    }
                )
            })

          .state('app.gst', {
              url: '/gst',
              title: 'GST Details',
              templateUrl: helper.basepath('company/gst.html'),
             resolve: angular.extend(
               helper.resolveFor('gstCtlr','parsley','ngFileUpload','ui.select','taginput','localytics.directives', 'toaster', 'ngJstree', 'angular-datatables', 'ngDialog'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.bankdetails', {
              url: '/bankdetails',
              title: 'Bank Details',
              templateUrl: helper.basepath('company/bankdetails.html'),
             resolve: angular.extend(
               helper.resolveFor('bankdetailsCtlr','parsley','ngFileUpload','ui.select','taginput','localytics.directives', 'toaster', 'ngJstree', 'angular-datatables', 'ngDialog'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

            /*  .state('app.discount', {
              url: '/discount',
              title: 'Discount Settings',
              templateUrl: helper.basepath('company/discount.html'),
             resolve: angular.extend(
               helper.resolveFor('discountCtlr','parsley','ngFileUpload','ui.select','taginput','localytics.directives', 'toaster', 'ngJstree', 'angular-datatables', 'ngDialog'), {
                authenticated : 'CheckAuthenticated'
               }
              )
            }) */

        .state('app.brandwisediscount', {
            url: '/brandwisediscount/?:rule_id',
            title: 'Discount Settings',
            templateUrl: helper.basepath('company/brandwisediscount.html'),
            params: { rule_id: null },
           resolve: angular.extend(
             helper.resolveFor('brandwisediscountCtlr','parsley','ngFileUpload','ui.select','taginput','localytics.directives', 'toaster', 'ngJstree', 'angular-datatables', 'ngDialog'), {
              authenticated : 'CheckAuthenticated'
             }
            )
        })

          .state('app.userprofile', {
              url: '/userprofile',
              title: 'User Profile',
              templateUrl: helper.basepath('auth/userprofile.html'),
             resolve: angular.extend(
               helper.resolveFor('userprofileCtlr','parsley','ngFileUpload','ui.select','taginput','localytics.directives', 'toaster', 'ngDialog' ), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.jobs', {
              url: '/jobs',
              title: 'jobs',
              templateUrl: helper.basepath('jobs/jobs.html'),
             resolve: angular.extend(
               helper.resolveFor('jobsCtlr','ui.select','angular-datatables','ngDialog', 'toaster', 'localytics.directives'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })
          
          .state('app.inventoryjobs',{
            url: '/inventoryjobs',
            title: 'Inventory jobs',
            templateUrl: helper.basepath('jobs/inventoryjobs.html'),
           resolve: angular.extend(
             helper.resolveFor('inventoryJobsCtlr', 'ngFileUpload', 'ui.select','angular-datatables','ngDialog', 'toaster', 'localytics.directives'), {
              authenticated : 'CheckAuthenticated'
             }
            )
          })

          .state('app.changepassword', {
              url: '/changepassword',
              title: 'Change Password',
              templateUrl: helper.basepath('auth/changepassword.html'),
             resolve: angular.extend(
               helper.resolveFor('changepasswordCtlr','parsley','ngFileUpload','ui.select','taginput','localytics.directives', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.brands', {
              url: '/brands',
              title: 'Brands',
              templateUrl: helper.basepath('catalog/brands.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('brandsCtlr', 'parsley', 'ngFileUpload','ui.select','localytics.directives', 'toaster', 'ngJstree','angular-datatables','ngDialog','imageCompressor', 'angular-carousel', 'oitozero.ngSweetAlert'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.catalog', {
              url: '/catalog/?:status',
              title: 'Catalog',
              templateUrl: helper.basepath('catalog/catalogs.html'),
              params: { status: null },
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('catalogCtlr', 'parsley', 'ngFileUpload','uiCropper','ui.select','localytics.directives', 'toaster', 'ngJstree','angular-datatables','ngDialog','imageCompressor', 'angular-carousel', 'oitozero.ngSweetAlert', 'photoSwipe'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.screens', {
              url: '/screens/?:status',
              title: 'Screens',
              templateUrl: 'wishbook_libs/views/screens/screens.html',
              params: { status: null },
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('screensCtlr', 'parsley', 'ngFileUpload','uiCropper','ui.select','localytics.directives', 'toaster', 'ngJstree','angular-datatables','ngDialog','imageCompressor', 'angular-carousel', 'oitozero.ngSweetAlert', 'photoSwipe'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.noncatalog', {
              url: '/noncatalog/?:status',
              title: 'Non-catalogs',
              templateUrl: 'wishbook_libs/views/noncatalogs/noncatalogs.html',
              params: { status: null },
             // controller: 'CatalogFormController',&:name
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('noncatalogsCtlr', 'parsley', 'ngFileUpload','uiCropper','ui.select','localytics.directives', 'toaster', 'ngJstree','angular-datatables','ngDialog','imageCompressor', 'angular-carousel', 'oitozero.ngSweetAlert', 'photoSwipe'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.catalogadmin', {
              url: '/admin/catalog',
              title: 'Catalog',
              templateUrl: helper.basepath('admin/catalog/catalogs.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('catalogAdminCtlr', 'parsley', 'ngFileUpload','uiCropper','ui.select','localytics.directives', 'toaster', 'ngJstree','angular-datatables','ngDialog','imageCompressor', 'angular-carousel', 'oitozero.ngSweetAlert', 'photoSwipe'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.browse', {
              url: '/browse/?:view_type&:catalog_type',
              title: 'Catalog',
              templateUrl: helper.basepath('browse/catalogs.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              params: { view_type: "grid", catalog_type:"public"},
              reloadOnSearch: false,
              resolve: angular.extend(
               helper.resolveFor('browseCtlr', 'parsley', 'ngFileUpload', 'ui.select','localytics.directives', 'toaster', 'ngJstree','angular-datatables','ngDialog','imageCompressor', 'angular-carousel', 'oitozero.ngSweetAlert', 'spinkit', 'akoenig.deckgrid', 'photoSwipe'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.product', {
              url: '/product/?:type&:id&:name',
              title: 'Product',
              templateUrl: 'wishbook_libs/views/productslist/products.html',
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              params: { type: null, id:null, name:null},
              resolve: angular.extend(
               helper.resolveFor('productCtlr','parsley','ngFileUpload','uiCropper','ui.select','localytics.directives', 'toaster', 'angular-datatables','ngDialog','imageCompressor', 'oitozero.ngSweetAlert', 'photoSwipe'), { // 'ui.bootstrap-slider', 'ngWig', 'filestyle', 'textAngular','taginput','inputmask'
                authenticated : 'CheckAuthenticated'
               }
              )
          })

            .state('app.setmatchingdetails', {
                url: '/setmatchingdetails/?:type&:id&:name',
                title: 'Product',
                templateUrl: 'wishbook_libs/views/productslist/setMatchingDetails.html',

                params: { type: null, id: null, name: null },
                resolve: angular.extend(
                    helper.resolveFor('setmatchingdetailsCtlr', 'parsley', 'ngFileUpload', 'uiCropper', 'ui.select', 'localytics.directives', 'toaster', 'angular-datatables', 'ngDialog', 'imageCompressor', 'oitozero.ngSweetAlert', 'photoSwipe'), { // 'ui.bootstrap-slider', 'ngWig', 'filestyle', 'textAngular','taginput','inputmask'
                        authenticated: 'CheckAuthenticated'
                    }
                )
            })

          .state('app.skumap', {
              url: '/skumap',
              title: 'SKU-Map',
              templateUrl: helper.basepath('catalog/skumap.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('skumapCtlr','parsley','ui.select','taginput','inputmask','localytics.directives', 'ui.bootstrap-slider', 'ngWig', 'filestyle', 'textAngular', 'toaster', 'angular-datatables','ngDialog', 'ngFileUpload', 'oitozero.ngSweetAlert'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.inventory', {
              url: '/inventory',
              title: 'Inventory',
              templateUrl: helper.basepath('inventory/inventory.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('inventoryCtlr','parsley','ui.select','taginput','inputmask','localytics.directives', 'ui.bootstrap-slider', 'ngWig', 'filestyle', 'textAngular', 'toaster', 'angular-datatables','ngDialog', 'ngFileUpload'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.warehouse', {
              url: '/warehouse',
              title: 'Warehouse',
              templateUrl: helper.basepath('inventory/warehouse.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('warehouseCtlr','parsley','ui.select','taginput','inputmask','localytics.directives', 'ui.bootstrap-slider', 'ngWig', 'filestyle', 'textAngular', 'toaster', 'angular-datatables','ngDialog', 'ngFileUpload'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })


          .state('app.adjustment', {
              url: '/adjustment',
              title: 'Adjustment',
              templateUrl: helper.basepath('inventory/adjustment.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('adjustmentCtlr','parsley','ui.select','taginput','inputmask','localytics.directives', 'ui.bootstrap-slider', 'ngWig', 'filestyle', 'textAngular', 'toaster', 'angular-datatables','ngDialog', 'ngFileUpload'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })


          .state('app.openingstock', {
              url: '/openingstock',
              title: 'Opening Stock',
              templateUrl: helper.basepath('inventory/openingstock.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('openingstockCtlr','parsley','ui.select','taginput','inputmask','localytics.directives', 'ui.bootstrap-slider', 'ngWig', 'filestyle', 'textAngular', 'toaster', 'angular-datatables','ngDialog', 'ngFileUpload'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.receivedcatalog', {
              url: '/receivedcatalog',
              title: 'Received Catalog',
              templateUrl: helper.basepath('catalog/receivedcatalogs.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('receivedcatalogCtlr','angular-datatables', 'parsley', 'toaster', 'ngDialog', 'photoSwipe'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.publiccatalog', {
              url: '/publiccatalog/?:type',
              title: 'Public Catalog',
              templateUrl: helper.basepath('catalog/publiccatalogs.html'),
              params: { type: null },
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('publiccatalogCtlr','angular-datatables', 'parsley', 'toaster', 'ngDialog', 'photoSwipe'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

            .state('app.publiccatalogbecomeaseller', {
                url: '/publiccatalog/?:type',
                title: 'Public Catalog',
                templateUrl: helper.basepath('catalog/publiccatalogs.html'),
                params: { type: 'become_a_seller' },
                // controller: 'CatalogFormController',
                // controllerAs: 'cat',
                resolve: angular.extend(
                    helper.resolveFor('publiccatalogCtlr', 'angular-datatables', 'parsley', 'toaster', 'ngDialog', 'photoSwipe'), {
                        authenticated: 'CheckAuthenticated'
                    }
                )
            })

          .state('app.receivedselection', {
              url: '/receivedselection',
              title: 'Received Selection',
              templateUrl: helper.basepath('catalog/receivedselections.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('receivedselectionCtlr','angular-datatables', 'parsley', 'toaster', 'ngDialog', 'photoSwipe'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.selections', {
              url: '/selections',
              title: 'My Selections',
              templateUrl: helper.basepath('catalog/selections.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              resolve: angular.extend(
               helper.resolveFor('selectionsCtlr','angular-datatables', 'toaster', 'oitozero.ngSweetAlert', 'parsley', 'ngDialog', 'photoSwipe'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.buyers', {
              url: '/buyers',
              title: 'Buyers List',
              templateUrl: helper.basepath('buyers/list.html'),
           //   controller: 'BuyerslistController',
            //  controllerAs: 'cmp',
              resolve: angular.extend(
               helper.resolveFor('buyerslistCtlr','parsley','ngFileUpload','ui.select','angular-datatables','ngDialog','localytics.directives', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.suppliers', {
              url: '/suppliers',
              title: 'Suppliers',
              templateUrl: helper.basepath('suppliers/suppliers.html'),
            //  controller: 'SupplierslistController',
            //  controllerAs: 'cmp',
              resolve: angular.extend(
               helper.resolveFor('supplierslistCtlr','parsley','ngFileUpload','ui.select','angular-datatables','ngDialog','localytics.directives', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

            /* .state('app.buyerenquiry', {
              url: '/buyerenquiry',
              title: 'Enquiries',
              templateUrl: helper.basepath('buyers/enquiry.html'),
            //   controller: 'SupplierslistController',
            //  controllerAs: 'cmp',
              resolve: angular.extend(
               helper.resolveFor('buyerenquirylistCtlr','parsley','ngFileUpload','ui.select','angular-datatables','ngDialog','localytics.directives', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })  */

          .state('app.myleads', {
              url: '/myleads',
              title: 'My Leads',
              templateUrl: helper.basepath('buyers/myleads.html'),
              resolve: angular.extend(
               helper.resolveFor('myleadslistCtlr','parsley','ngFileUpload','ui.select','angular-datatables','ngDialog','localytics.directives', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.myfollowers', {
              url: '/myfollowers',
              title: 'My Followers',
              templateUrl: helper.basepath('myviews/myfollowers.html'),
              resolve: angular.extend(
               helper.resolveFor('myfollowerslistCtlr','parsley','ngFileUpload','ui.select','angular-datatables','ngDialog','localytics.directives', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.myviewers', {
                url: '/myViewers',
                title: 'My Viewers',
                templateUrl: helper.basepath('myviews/myviewers.html'),
                resolve: angular.extend(
                    helper.resolveFor('myViewerlistCtlr', 'parsley', 'ngFileUpload', 'ui.select', 'localytics.directives', 'toaster', 'ngJstree', 'angular-datatables', 'ngDialog', 'imageCompressor', 'angular-carousel', 'oitozero.ngSweetAlert', 'spinkit', 'akoenig.deckgrid', 'photoSwipe'), {
                        authenticated: 'CheckAuthenticated'
                    }
                )
            })

            /*state('app.supplierenquiry', {
                    url: '/supplierenquiry',
                    title: 'Enquiries',
                    templateUrl: helper.basepath('suppliers/enquiry.html'),
            //        controller: 'SupplierslistController',
                    //  controllerAs: 'cmp',
                    resolve: angular.extend(
                    helper.resolveFor('supplierenquirylistCtlr','parsley','ngFileUpload','ui.select','angular-datatables','ngDialog','localytics.directives', 'toaster'), {
                        authenticated : 'CheckAuthenticated'
                    }
                    )
                })  */

          .state('app.myenquiry', {
              url: '/myenquiry',
              title: 'Enquiries',
              templateUrl: helper.basepath('suppliers/myenquiry.html'),
            //controller: 'SupplierslistController',
            //  controllerAs: 'cmp',
              resolve: angular.extend(
               helper.resolveFor('myenquirylistCtlr','parsley','ngFileUpload','ui.select','angular-datatables','ngDialog','localytics.directives', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

           .state('app.groups', {
              url: '/groups',
              title: 'Buyers Groups',
              templateUrl: helper.basepath('buyers/groups.html'),
          //    controller: 'GroupslistController',
              resolve: angular.extend(
               helper.resolveFor('groupslistCtlr','parsley','ui.select','angular-datatables','ngDialog','taginput','localytics.directives', 'toaster','ngJstree', 'oitozero.ngSweetAlert'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

           .state('app.shares', {
              url: '/shares',
              title: 'Shares',
              templateUrl: helper.basepath('shares/shares.html'),
           //   controller: 'ShareslistController',
              resolve: angular.extend(
               helper.resolveFor('shareslistCtlr','ui.select','angular-datatables','ngDialog', 'toaster','localytics.directives'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.share_detail', {
              url: '/share-detail/?:id',
              title: 'Share',
              templateUrl: helper.basepath('shares/share_detail.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              params: { type: null, id:null, name:null},
              resolve: angular.extend(
               helper.resolveFor('shareDetailCtlr', 'parsley', 'ui.select','localytics.directives', 'toaster', 'angular-datatables','ngDialog', 'oitozero.ngSweetAlert'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.share_design_view', {
              url: '/share-design-view/?:id',
              title: 'Share',
              templateUrl: helper.basepath('shares/share_design_view.html'),
             // controller: 'CatalogFormController',
             // controllerAs: 'cat',
              params: { type: null, id:null, name:null},
              resolve: angular.extend(
               helper.resolveFor('shareDesignViewCtlr', 'parsley', 'ui.select','localytics.directives', 'toaster', 'angular-datatables','ngDialog', 'oitozero.ngSweetAlert'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

           .state('app.salespersons', {
              url: '/salespersons',
              title: 'Salespersons',
              templateUrl: helper.basepath('salespersons/salespersons.html'),
              controller: 'SalespersonslistController',
              resolve: angular.extend(
               helper.resolveFor('salespersonslistCtlr','ui.select','angular-datatables','ngDialog', 'toaster', 'localytics.directives'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })


          .state('app.administrators', {
              url: '/administrators',
              title: 'Administrators',
              templateUrl: helper.basepath('administrators/administrators.html'),
              controller: 'AdministratorslistController',
              resolve: angular.extend(
               helper.resolveFor('administratorslistCtlr','ui.select','angular-datatables','ngDialog', 'toaster', 'localytics.directives'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })


          .state('app.companyaccounts', {
              url: '/company-accounts',
              title: 'Company Accounts',
              templateUrl: helper.basepath('companyaccounts/companyaccounts.html'),
              controller: 'CompanyAccountController',
              resolve: angular.extend(
               helper.resolveFor('companyAccountCtlr','ui.select','angular-datatables','ngDialog', 'toaster', 'localytics.directives', 'ngFileUpload'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })


          .state('app.salesmanlocation', {
              url: '/salesman-location',
              title: 'Salesman Location',
              templateUrl: helper.basepath('salesmanlocation/salesmanlocation.html'),
              controller: 'SalesmanLocationController',
              resolve: angular.extend(
               helper.resolveFor('salesmanLocationCtlr','ui.select','angular-datatables','ngDialog', 'toaster', 'localytics.directives'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })


          .state('app.salesmanindividual', {
              url: '/salesman-individual',
              title: 'Salesman Individual',
              templateUrl: helper.basepath('salesmanindividual/salesmanindividual.html'),
              controller: 'SalesmanIndividualController',
              resolve: angular.extend(
               helper.resolveFor('salesmanIndividualCtlr','ngFileUpload','ui.select','angular-datatables','ngDialog', 'toaster', 'localytics.directives'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

       /*   .state('app.registrations', {
              url: '/registrations',
              title: 'Registrations',
              templateUrl: helper.basepath('registrations/registrations.html'),
              controller: 'RegistrationsController',
              resolve: angular.extend(
               helper.resolveFor('registrationsCtlr','ui.select','angular-datatables','ngDialog', 'toaster', 'localytics.directives'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          }) */

           .state('app.salesorders', {
              url: '/salesorders/?:status&:ftype',
              title: 'Sales Orders',
              templateUrl: helper.basepath('salesorders/salesorders.html'),
     //         controller: 'SalesorderslistController',
              resolve: angular.extend(
               helper.resolveFor('salesorderslistCtlr','ui.select','angular-datatables','ngDialog', 'toaster','localytics.directives', 'parsley', 'ngFileUpload'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.purchaseorders', {
              url: '/purchaseorders',
              title: 'Purchase Orders',
              templateUrl: helper.basepath('purchaseorders/purchaseorders.html'),
              resolve: angular.extend(
               helper.resolveFor('purchaseorderslistCtlr','ui.select','angular-datatables','ngDialog', 'toaster','localytics.directives', 'xeditable', 'parsley'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

       /*   .state('app.brokerageorders', {
              url: '/brokerageorders',
              title: 'Brokerage Orders',
              templateUrl: helper.basepath('brokerageorders/brokerageorders.html'),
              resolve: angular.extend(
               helper.resolveFor('brokerageorderslistCtlr','ui.select','angular-datatables','ngDialog', 'toaster','localytics.directives', 'xeditable', 'parsley'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          }) */
          .state('app.rrcrequests', {
              url: '/rrcrequests',
              title: 'RRC Requests',
              templateUrl: helper.basepath('admin/rrc/rrcrequests.html'),
              resolve: angular.extend(
               helper.resolveFor('rrcrequestsCtlr','ui.select','angular-datatables','ngDialog', 'toaster','localytics.directives', 'parsley', 'ngFileUpload'), {
                   //,'parsley','ui.select','taginput','inputmask','localytics.directives', 'ui.bootstrap-slider', 'ngWig', 'filestyle', 'textAngular', 'toaster', 'angular-datatables','ngDialog', 'ngFileUpload'
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.refundrequests', {
              url: '/refundrequests',
              title: 'Refund Requests',
              templateUrl: helper.basepath('admin/rrc/refundrequests.html'),
              resolve: angular.extend(
               helper.resolveFor('refundrequestsCtlr','ui.select','angular-datatables','ngDialog', 'toaster','localytics.directives', 'parsley', 'ngFileUpload'), {
                   //,'parsley','ui.select','taginput','inputmask','localytics.directives', 'ui.bootstrap-slider', 'ngWig', 'filestyle', 'textAngular', 'toaster', 'angular-datatables','ngDialog', 'ngFileUpload'
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.salesordersinvoice', {
              url: '/salesordersinvoice',
              title: 'Invoice',
              templateUrl: helper.basepath('invoice/salesordersinvoice.html'),
              resolve: angular.extend(
               helper.resolveFor('salesordersinvoicelistCtlr','ui.select','angular-datatables','ngDialog', 'toaster','localytics.directives', 'parsley', 'ngFileUpload'), {
                   //,'parsley','ui.select','taginput','inputmask','localytics.directives', 'ui.bootstrap-slider', 'ngWig', 'filestyle', 'textAngular', 'toaster', 'angular-datatables','ngDialog', 'ngFileUpload'
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.shipment_Invoices', {
                url: '/shipment_Invoices/?:status',
                title: 'shipment_Invoices',
                templateUrl: helper.basepath('Shipment_Invoices/shipment_Invoices.html'),
                resolve: angular.extend(
                    helper.resolveFor('shipment_InvoicesCtlr', 'ui.select', 'angular-datatables', 'ngDialog', 'toaster', 'localytics.directives', 'parsley', 'ngFileUpload'), {
                        //,'parsley','ui.select','taginput','inputmask','localytics.directives', 'ui.bootstrap-slider', 'ngWig', 'filestyle', 'textAngular', 'toaster', 'angular-datatables','ngDialog', 'ngFileUpload'
                        authenticated: 'CheckAuthenticated'
                    }
                )
            })
            
            .state('app.manifests', {
                url: '/manifests/',
                title: 'Manifests',
                templateUrl: helper.basepath('Shipment_Invoices/manifests.html'),
                resolve: angular.extend(
                    helper.resolveFor('manifestsCtlr', 'ui.select', 'angular-datatables', 'ngDialog', 'toaster', 'localytics.directives', 'parsley', 'ngFileUpload'), {
                        //,'parsley','ui.select','taginput','inputmask','localytics.directives', 'ui.bootstrap-slider', 'ngWig', 'filestyle', 'textAngular', 'toaster', 'angular-datatables','ngDialog', 'ngFileUpload'
                        authenticated: 'CheckAuthenticated'
                    }
                )
            })

          .state('app.purchaseordersinvoice', {
              url: '/purchaseordersinvoice',
              title: 'Invoice',
              templateUrl: helper.basepath('invoice/purchaseordersinvoice.html'),
              resolve: angular.extend(
               helper.resolveFor('purchaseordersinvoicelistCtlr','ui.select','angular-datatables','ngDialog', 'toaster','localytics.directives', 'parsley', 'ngFileUpload'), {
                   //,'parsley','ui.select','taginput','inputmask','localytics.directives', 'ui.bootstrap-slider', 'ngWig', 'filestyle', 'textAngular', 'toaster', 'angular-datatables','ngDialog', 'ngFileUpload'
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          .state('app.template', {
              url: '/template',
              title: 'Blank Template',
              templateUrl: helper.basepath('template.html')
          })

          //
          // Single Page Routes
          // -----------------------------------
          .state('page', {
              url: '/auth',
              templateUrl: 'app/views/auth/page.html',
              resolve: helper.resolveFor('modernizr', 'icons'),
              controller: ['$rootScope', function($rootScope) {
                  $rootScope.app.layout.isBoxed = false;
              }]
          })
          .state('page.login', {
              url: '/login',
              title: 'Login',
              templateUrl: 'app/views/auth/login.html',
              params: { registration: null, },
              resolve: angular.extend(
               helper.resolveFor('loginCtlr','ngDialog','toaster','localytics.directives'), {
                authenticated : 'ToDashboard'
               }
              )
              //resolve: helper.resolveFor('loginCtlr')
          })
        /*  .state('page.register', {
              url: '/register',
              title: 'Register',
              templateUrl: 'app/views/auth/register.html',
              resolve: helper.resolveFor('registerCtlr','ngDialog','toaster','localytics.directives')
          })*/
          .state('page.recover', {
              url: '/recover',
              title: 'Recover',
              templateUrl: 'app/views/auth/recover.html',
              resolve: helper.resolveFor('recoverCtlr', 'ngDialog', 'toaster', 'localytics.directives', 'ui.select')
          })

          .state('page.passwordreset', {
              url: '/passwordreset/{userToken}/{passwordResetToken}/',
              title: 'Passwordreset',
              templateUrl: 'app/views/auth/passwordreset.html',
              resolve: helper.resolveFor('passwordresetCtlr', 'toaster')
          })

          .state('page.lock', {
              url: '/lock',
              title: 'Lock',
              templateUrl: 'app/views/auth/lock.html'
          })
          /*.state('page.logout', {
              url: '/logout',
              title: 'Logout',
             // templateUrl: 'app/views/auth/login.html',
              resolve: helper.resolveFor('logoutCtlr')
          })*/
          .state('page.404', {
              url: '/404',
              title: 'Not Found',
              templateUrl: 'app/views/auth/404.html'
          })

          .state('pages', {
              url: '/pages',
              templateUrl: 'app/views/auth/page.html',
              resolve: helper.resolveFor('modernizr', 'icons'),
              controller: ['$rootScope', function($rootScope) {
                  $rootScope.app.layout.isBoxed = false;
              }]
          })
          .state('pages.printorder', {
              url: '/printorder/?:salesorder&:purchaseorder',
              title: 'Print Order',
              templateUrl: 'app/views/order/printorder.html', //order/printorder    invoice/printinvoice
              params: { salesorder: null, purchaseorder:null},
              resolve: angular.extend(
               helper.resolveFor('printOrderCtlr', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
              //resolve: helper.resolveFor('printOrderCtlr', 'toaster')
          })
          .state('pages.printinvoice', {
              url: '/printinvoice/?:invoice',
              title: 'Print Invoice',
              templateUrl: 'wishbook_libs/views/invoice/printinvoice.html',
              params: { salesorder: null, purchaseorder:null},
              resolve: angular.extend(
               helper.resolveFor('printInvoiceCtlr', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })
          
          .state('pages.printsellerinvoice', {
              url: '/printsellerinvoice/?:invoice',
              title: 'Print Seller Invoice',
              templateUrl: 'wishbook_libs/views/invoice/printsellerinvoice.html',
              params: { salesorder: null, purchaseorder:null},
              resolve: angular.extend(
               helper.resolveFor('printSellerInvoiceCtlr', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })
          .state('pages.printmanifest', {
              url: '/printmanifest/?:id',
              title: 'Print Manifest',
              templateUrl: 'wishbook_libs/views/invoice/printmanifest.html',
              params: { salesorder: null, purchaseorder:null},
              resolve: angular.extend(
               helper.resolveFor('printmanifestCtlr', 'toaster'), {
                authenticated : 'CheckAuthenticated'
               }
              )
          })

          //
          // CUSTOM RESOLVES
          //   Add your own resolves properties
          //   following this object extend
          //   method
          // -----------------------------------
          // .state('app.someroute', {
          //   url: '/some_url',
          //   templateUrl: 'path_to_template.html',
          //   controller: 'someController',
          //   resolve: angular.extend(
          //     helper.resolveFor(), {
          //     // YOUR RESOLVES GO HERE
          //     }
          //   )
          // })
          ;

    } // routesConfig

})();


(function() {
    'use strict';

    angular
        .module('app.settings')
        .run(settingsRun);

    settingsRun.$inject = ['$rootScope', '$localStorage'];

    function settingsRun($rootScope, $localStorage){

      // Global Settings
      // -----------------------------------
      $rootScope.app = {
        name: 'Wishbook',
        description: 'Catalog B2B Application',
        year: ((new Date()).getFullYear()),
        layout: {
          isFixed: true,
          isCollapsed: false,
          isBoxed: false,
          isRTL: false,
          horizontal: true,
          isFloat: false,
          asideHover: false,
          theme: null,
          asideScrollbar: false
        },
        useFullLayout: false,
        hiddenFooter: true,
        offsidebarOpen: false,
        asideToggled: false,
        viewAnimation: 'ng-fadeInUp'
      };

      // Setup the layout mode
      $rootScope.app.layout.horizontal = ( $rootScope.$stateParams.layout === 'app-h') ;

      // Restore layout settings
      if( angular.isDefined($localStorage.layout) )
        $rootScope.app.layout = $localStorage.layout;
      else
        $localStorage.layout = $rootScope.app.layout;

      $rootScope.$watch('app.layout', function () {
        $localStorage.layout = $rootScope.app.layout;
      }, true);

      // Close submenu when sidebar change from collapsed to normal
      $rootScope.$watch('app.layout.isCollapsed', function(newValue) {
        if( newValue === false )
          $rootScope.$broadcast('closeSidebarMenu');
      });

    }

})();

/**=========================================================
 * Module: sidebar-menu.js
 * Handle sidebar collapsible elements
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$rootScope', '$scope', '$state', 'SidebarLoader', 'Utils'];
    function SidebarController($rootScope, $scope, $state, SidebarLoader,  Utils) {

        activate();

        ////////////////

        function activate() {
          var collapseList = [];

          // demo: when switch from collapse to hover, close all items
          $rootScope.$watch('app.layout.asideHover', function(oldVal, newVal){
            if ( newVal === false && oldVal === true) {
              closeAllBut(-1);
            }
          });


          // Load menu from json file
          // -----------------------------------

          SidebarLoader.getMenu(sidebarReady);

          function sidebarReady(items) {
            $scope.menuItems = items;
          }

          // Handle sidebar and collapse items
          // ----------------------------------

          $scope.getMenuItemPropClasses = function(item) {
            return (item.heading ? 'nav-heading' : '') +
                   (isActive(item) ? ' active' : '') ;
          };

          $scope.addCollapse = function($index, item) {
            collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
          };

          $scope.isCollapse = function($index) {
            return (collapseList[$index]);
          };

          $scope.toggleCollapse = function($index, isParentItem) {

            // collapsed sidebar doesn't toggle drodopwn
            if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) return true;

            // make sure the item index exists
            if( angular.isDefined( collapseList[$index] ) ) {
              if ( ! $scope.lastEventFromChild ) {
                collapseList[$index] = !collapseList[$index];
                closeAllBut($index);
              }
            }
            else if ( isParentItem ) {
              closeAllBut(-1);
            }

            $scope.lastEventFromChild = isChild($index);

            return true;

          };

          // Controller helpers
          // -----------------------------------

            // Check item and children active state
            function isActive(item) {

              if(!item) return;

              if( !item.sref || item.sref === '#') {
                var foundActive = false;
                angular.forEach(item.submenu, function(value) {
                  if(isActive(value)) foundActive = true;
                });
                return foundActive;
              }
              else
                return $state.is(item.sref) || $state.includes(item.sref);
            }

            function closeAllBut(index) {
              index += '';
              for(var i in collapseList) {
                if(index < 0 || index.indexOf(i) < 0)
                  collapseList[i] = true;
              }
            }

            function isChild($index) {
              /*jshint -W018*/
              return (typeof $index === 'string') && !($index.indexOf('-') < 0);
            }

        } // activate
    }

})();

/**=========================================================
 * Module: sidebar.js
 * Wraps the sidebar and handles collapsed state
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .directive('sidebar', sidebar);

    sidebar.$inject = ['$rootScope', '$timeout', '$window', 'Utils'];
    function sidebar ($rootScope, $timeout, $window, Utils) {
        var $win = angular.element($window);
        var directive = {
            // bindToController: true,
            // controller: Controller,
            // controllerAs: 'vm',
            link: link,
            restrict: 'EA',
            template: '<nav class="sidebar" ng-transclude></nav>',
            transclude: true,
            replace: true
            // scope: {}
        };
        return directive;

        function link(scope, element, attrs) {

          var currentState = $rootScope.$state.current.name;
          var $sidebar = element;

          var eventName = Utils.isTouch() ? 'click' : 'mouseenter' ;
          var subNav = $();

          $sidebar.on( eventName, '.nav > li', function() {

            if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) {

              subNav.trigger('mouseleave');
              subNav = toggleMenuItem( $(this), $sidebar);

              // Used to detect click and touch events outside the sidebar
              sidebarAddBackdrop();

            }

          });

          scope.$on('closeSidebarMenu', function() {
            removeFloatingNav();
          });

          // Normalize state when resize to mobile
          $win.on('resize', function() {
            if( ! Utils.isMobile() )
          	asideToggleOff();
          });

          // Adjustment on route changes
          $rootScope.$on('$stateChangeStart', function(event, toState) {
            currentState = toState.name;
            // Hide sidebar automatically on mobile
            asideToggleOff();

            $rootScope.$broadcast('closeSidebarMenu');
          });

      	  // Autoclose when click outside the sidebar
          if ( angular.isDefined(attrs.sidebarAnyclickClose) ) {

            var wrapper = $('.wrapper');
            var sbclickEvent = 'click.sidebar';

            $rootScope.$watch('app.asideToggled', watchExternalClicks);

          }

          //////

          function watchExternalClicks(newVal) {
            // if sidebar becomes visible
            if ( newVal === true ) {
              $timeout(function(){ // render after current digest cycle
                wrapper.on(sbclickEvent, function(e){
                  // if not child of sidebar
                  if( ! $(e.target).parents('.aside').length ) {
                    asideToggleOff();
                  }
                });
              });
            }
            else {
              // dettach event
              wrapper.off(sbclickEvent);
            }
          }

          function asideToggleOff() {
            $rootScope.app.asideToggled = false;
            if(!scope.$$phase) scope.$apply(); // anti-pattern but sometimes necessary
      	  }
        }

        ///////

        function sidebarAddBackdrop() {
          var $backdrop = $('<div/>', { 'class': 'dropdown-backdrop'} );
          $backdrop.insertAfter('.aside-inner').on('click mouseenter', function () {
            removeFloatingNav();
          });
        }

        // Open the collapse sidebar submenu items when on touch devices
        // - desktop only opens on hover
        function toggleTouchItem($element){
          $element
            .siblings('li')
            .removeClass('open')
            .end()
            .toggleClass('open');
        }

        // Handles hover to open items under collapsed menu
        // -----------------------------------
        function toggleMenuItem($listItem, $sidebar) {

          removeFloatingNav();

          var ul = $listItem.children('ul');

          if( !ul.length ) return $();
          if( $listItem.hasClass('open') ) {
            toggleTouchItem($listItem);
            return $();
          }

          var $aside = $('.aside');
          var $asideInner = $('.aside-inner'); // for top offset calculation
          // float aside uses extra padding on aside
          var mar = parseInt( $asideInner.css('padding-top'), 0) + parseInt( $aside.css('padding-top'), 0);
          var subNav = ul.clone().appendTo( $aside );

          toggleTouchItem($listItem);

          var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
          var vwHeight = $win.height();

          subNav
            .addClass('nav-floating')
            .css({
              position: $rootScope.app.layout.isFixed ? 'fixed' : 'absolute',
              top:      itemTop,
              bottom:   (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
            });

          subNav.on('mouseleave', function() {
            toggleTouchItem($listItem);
            subNav.remove();
          });

          return subNav;
        }

        function removeFloatingNav() {
          $('.dropdown-backdrop').remove();
          $('.sidebar-subnav.nav-floating').remove();
          $('.sidebar li.open').removeClass('open');
        }
    }


})();


(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .service('SidebarLoader', SidebarLoader);

    SidebarLoader.$inject = ['$rootScope', '$http', 'djangoAuth', 'CompanyType'];
    function SidebarLoader($rootScope, $http, djangoAuth, CompanyType) {
        this.getMenu = getMenu;

        ////////////////

        function getMenu(onReady, onError) {
        //alert("SidebarLoader");
        djangoAuth.profile().then(function(data)
        {
            localStorage.setItem('flag_manufacturer', false);
            localStorage.setItem('flag_retailer', false);
            localStorage.setItem('flag_broker', false);
            localStorage.setItem('flag_wholesaler', false);
            var company_id = localStorage.getItem('company');
            if(data.is_staff == true)
            {
                var menuJson = 'app/json/sidebar-admin.json',
                    menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache

                onError = onError || function()
                {
                  //alert('Failure loading menu');
                  console.log('Failure loading menu');
                };

                $http
                  .get(menuURL)
                  .success(onReady)
                  .error(onError);
            }
            else if(data.companyuser != null)
            {
                if(data.companyuser.company_group_flag.manufacturer == true && data.companyuser.company_group_flag.wholesaler_distributor == false && data.companyuser.company_group_flag.broker == false && data.companyuser.company_group_flag.retailer == false && data.companyuser.company_group_flag.online_retailer_reseller == false)
                {
                    // manufacturer

                    $.getJSON("api/v1/seller-dashboard/?company_id="+company_id,
                    function (result)
                    {
                        //console.log(result);
                        var facility_type = result.facility_type;
                        localStorage.setItem('facility_type', JSON.stringify(facility_type));
                        console.log(result.facility_type);

                        if (facility_type == 'dropship') {
                            var menuJson = 'app/json/sidebar-menufacturer.json', //'app/json/sidebar-seller-warehouse.json'
                                menuURL = menuJson + '?v=' + (new Date().getTime()); // jumps cache
                        }
                        else
                        {
                            var menuJson = 'app/json/sidebar-menufacturer.json', //'app/json/sidebar-seller-warehouse.json'
                                menuURL = menuJson + '?v=' + (new Date().getTime()); // jumps cache
                        }

                        onError = onError || function () {
                            console.log('Failure loading menu');
                        };

                        $http
                            .get(menuURL)
                            .success(onReady)
                            .error(onError);
                    });
                    localStorage.setItem('flag_manufacturer', true);
                   
                }
                else if(  (data.companyuser.company_group_flag.manufacturer == false && data.companyuser.company_group_flag.wholesaler_distributor == false && data.companyuser.company_group_flag.broker == false && data.companyuser.company_group_flag.retailer == true && data.companyuser.company_group_flag.online_retailer_reseller == false) ||
                          (data.companyuser.company_group_flag.manufacturer == false && data.companyuser.company_group_flag.wholesaler_distributor == false && data.companyuser.company_group_flag.broker == false && data.companyuser.company_group_flag.retailer == false && data.companyuser.company_group_flag.online_retailer_reseller == true) ||
                          (data.companyuser.company_group_flag.manufacturer == false && data.companyuser.company_group_flag.wholesaler_distributor == false && data.companyuser.company_group_flag.broker == false && data.companyuser.company_group_flag.retailer == true && data.companyuser.company_group_flag.online_retailer_reseller == true)
                )
                {
                    // retailer
                    //var menuJson = 'app/json/sidebar-non-menufacturer.json',
                    var menuJson = 'app/json/sidebar-retailer.json',
                        menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache

                    onError = onError || function() {
                      console.log('Failure loading menu');
                    };

                    $http
                      .get(menuURL)
                      .success(onReady)
                      .error(onError);
                    localStorage.setItem('flag_retailer', true);
                }
                /*  else if (data.companyuser.company_group_flag.broker == true)
                {
                    // broker
                    var menuJson = 'app/json/sidebar-broker.json',
                          menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache

                      onError = onError || function() {
                        console.log('Failure loading menu');
                      };

                      $http
                        .get(menuURL)
                        .success(onReady)
                        .error(onError);
                    localStorage.setItem('flag_broker', true);
                } */
                else
                {
                    // wholesaler

                    $.getJSON("api/v1/seller-dashboard/?company_id=" + company_id,
                    function (result)
                    {
                        //console.log(result);
                        var facility_type = result.facility_type;
                        localStorage.setItem('facility_type', JSON.stringify(facility_type));
                        console.log(result.facility_type);
                        

                        if (facility_type == 'dropship') {
                            var menuJson =  'app/json/sidebar-non-menufacturer.json', //'app/json/sidebar-seller-warehouse.json'
                                menuURL = menuJson + '?v=' + (new Date().getTime()); // jumps cache
                        }
                        else {
                            var menuJson = 'app/json/sidebar-non-menufacturer.json', //'app/json/sidebar-seller-warehouse.json'
                                menuURL = menuJson + '?v=' + (new Date().getTime()); // jumps cache
                        }

                        
                        onError = onError || function () {
                            console.log('Failure loading menu');
                        };

                        $http
                            .get(menuURL)
                            .success(onReady)
                            .error(onError);
                        localStorage.setItem('flag_wholesaler', true);
                    });


                    
                }

                if(data.companyuser.company_group_flag.wholesaler_distributor == true){
                  localStorage.setItem('flag_wholesaler', true);
                }

                console.log(data);
                
                InitiallizeFreshChat(data.username, data.first_name, data.last_name, data.email, data.userprofile.phone_number);

                //var username1 = localStorage.getItem('freshchatrestotreId' + profile.username)
                //window.fcWidget.open({ name: "Order Status (Delivery/ Cashback/ Refunds/ Returns)" });
                //window.fcWidget.open({ name: "order_status" });

                /*  //if(data.companyuser.company_type == 'manufacturer' && data.companyuser.brand_added_flag == "yes")
               if(data.companyuser.company_type == 'manufacturer')
               {
                    var menuJson = 'app/json/sidebar-menufacturer.json',
                        menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache

                    onError = onError || function() {
                      //alert('Failure loading menu');
                      console.log('Failure loading menu');
                    };

                    $http
                      .get(menuURL)
                      .success(onReady)
                      .error(onError);
               }
               //else if(data.companyuser.company_type == 'nonmanufacturer' && data.companyuser.brand_added_flag == "yes")
               else if(data.companyuser.company_type == 'nonmanufacturer')
               {
                    var menuJson = 'app/json/sidebar-non-menufacturer.json',
                        menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache

                    onError = onError || function() {
                      //alert('Failure loading menu');
                      console.log('Failure loading menu');
                    };

                    $http
                      .get(menuURL)
                      .success(onReady)
                      .error(onError);
               }  */
            }

          });

        }

        $rootScope.getMenu = this.getMenu
    }
})();
(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .controller('UserBlockController', UserBlockController);

    UserBlockController.$inject = ['$rootScope', '$scope', 'djangoAuth', 'Company','$state'];
    function UserBlockController($rootScope, $scope, djangoAuth, Company, $state) {

        activate();

        ////////////////

        function activate() {
        $scope.userpicture = 'app/img/user/user.jpg'
        $scope.username = ""
        $scope.companytype = "";

        djangoAuth.profile().then(function(data){
            $scope.username = data.username;
      //      alert($rootScope.username);
            if(data.companyuser != null)
            {
            //  Company.get({id: data.companyuser.company},function(result) {
                  //$rootScope.companytype = data.companyuser.company_type;
                  $scope.companyname = data.companyuser.companyname;
             // });
            }
            if(data.userprofile.user_image != null)
            {
                $scope.userpicture = data.userprofile.user_image;
            }

        });
        /* $rootScope.user = {
            name:     'John',
            job:      'ng-developer',
            picture:  'app/img/user/02.jpg'
          };*/
         /* $rootScope.user = {

            name:     $rootScope.username,
            job:      $rootScope.companyname,
            picture:  'app/img/user/user.jpg'

          };*/

          // Hides/show user avatar on sidebar
          $rootScope.toggleUserBlock = function(){

            $rootScope.$broadcast('toggleUserBlock');
          };

         /* $rootScope.openApplozicChat = function(){
            console.log("called");
            $applozic.fn.applozic('loadTab', '');
          };  */

          $rootScope.logout = function(){
            /*djangoAuth.logout()
              .then(function(response) {
                  //$state.go('page.login', {}, {reload: true});
                  //$state.go($state.current, {}, {reload: true});
                  alert("logout s");
              }, function() {
                alert("logout e");
                //$state.go('page.login', {}, {reload: true});
                //$state.go($state.current, {}, {reload: true});
                //vm.authMsg = response;//'Server Request Error';
            });*/
            djangoAuth.logout();/*.then(function(){
              $state.go('page.login', {}, {reload: true});
            });*/

          };

          $rootScope.userBlockVisible = true;

          var detach = $rootScope.$on('toggleUserBlock', function(/*event, args*/) {

            $rootScope.userBlockVisible = ! $rootScope.userBlockVisible;

          });

          $scope.$on('$destroy', detach);
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.translate')
        .config(translateConfig)
        ;
    translateConfig.$inject = ['$translateProvider'];
    function translateConfig($translateProvider){

      $translateProvider.useStaticFilesLoader({
          prefix : 'app/i18n/',
          suffix : '.json'
      });

      $translateProvider.preferredLanguage('en');
      $translateProvider.useLocalStorage();
      $translateProvider.usePostCompiling(true);
      $translateProvider.useSanitizeValueStrategy('sanitizeParameters');

    }
})();
(function() {
    'use strict';

    angular
        .module('app.translate')
        .run(translateRun)
        ;
    translateRun.$inject = ['$rootScope', '$translate'];

    function translateRun($rootScope, $translate){

      // Internationalization
      // ----------------------

      $rootScope.language = {
        // Handles language dropdown
        listIsOpen: false,
        // list of available languages
        available: {
          'en':       'English',
          'es_AR':    'Español'
        },
        // display always the current ui language
        init: function () {
          var proposedLanguage = $translate.proposedLanguage() || $translate.use();
          var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config
          $rootScope.language.selected = $rootScope.language.available[ (proposedLanguage || preferredLanguage) ];
        },
        set: function (localeId) {
          // Set the new idiom
          $translate.use(localeId);
          // save a reference for the current language
          $rootScope.language.selected = $rootScope.language.available[localeId];
          // finally toggle dropdown
          $rootScope.language.listIsOpen = ! $rootScope.language.listIsOpen;
        }
      };

      $rootScope.language.init();

    }
})();
/**=========================================================
 * Module: animate-enabled.js
 * Enable or disables ngAnimate for element with directive
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('animateEnabled', animateEnabled);

    animateEnabled.$inject = ['$animate'];
    function animateEnabled ($animate) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
          scope.$watch(function () {
            return scope.$eval(attrs.animateEnabled, scope);
          }, function (newValue) {
            $animate.enabled(!!newValue, element);
          });
        }
    }

})();

/**=========================================================
 * Module: browser.js
 * Browser detection
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .service('Browser', Browser);

    Browser.$inject = ['$window'];
    function Browser($window) {
      return $window.jQBrowser;
    }

})();

/**=========================================================
 * Module: clear-storage.js
 * Removes a key from the browser storage via element click
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('resetKey', resetKey);

    resetKey.$inject = ['$state', '$localStorage'];
    function resetKey ($state, $localStorage) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
              resetKey: '@'
            }
        };
        return directive;

        function link(scope, element) {
          element.on('click', function (e) {
              e.preventDefault();

              if(scope.resetKey) {
                delete $localStorage[scope.resetKey];
                $state.go($state.current, {}, {reload: true});
              }
              else {
                $.error('No storage key specified for reset.');
              }
          });
        }
    }

})();

/**=========================================================
 * Module: fullscreen.js
 * Toggle the fullscreen mode on/off
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('toggleFullscreen', toggleFullscreen);

    toggleFullscreen.$inject = ['Browser'];
    function toggleFullscreen (Browser) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          // Not supported under IE
          if( Browser.msie ) {
            element.addClass('hide');
          }
          else {
            element.on('click', function (e) {
                e.preventDefault();

                if (screenfull.enabled) {

                  screenfull.toggle();

                  // Switch icon indicator
                  if(screenfull.isFullscreen)
                    $(this).children('em').removeClass('fa-expand').addClass('fa-compress');
                  else
                    $(this).children('em').removeClass('fa-compress').addClass('fa-expand');

                } else {
                  $.error('Fullscreen not enabled');
                }

            });
          }
        }
    }


})();

/**=========================================================
 * Module: load-css.js
 * Request and load into the current page a css file
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('loadCss', loadCss);

    function loadCss () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
          element.on('click', function (e) {
              if(element.is('a')) e.preventDefault();
              var uri = attrs.loadCss,
                  link;

              if(uri) {
                link = createLink(uri);
                if ( !link ) {
                  $.error('Error creating stylesheet link element.');
                }
              }
              else {
                $.error('No stylesheet location defined.');
              }

          });
        }

        function createLink(uri) {
          var linkId = 'autoloaded-stylesheet',
              oldLink = $('#'+linkId).attr('id', linkId + '-old');

          $('head').append($('<link/>').attr({
            'id':   linkId,
            'rel':  'stylesheet',
            'href': uri
          }));

          if( oldLink.length ) {
            oldLink.remove();
          }

          return $('#'+linkId);
        }
    }

})();

/**=========================================================
 * Module: now.js
 * Provides a simple way to display the current time formatted
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('now', now);

    now.$inject = ['dateFilter', '$interval'];
    function now (dateFilter, $interval) {
        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;

        function link(scope, element, attrs) {
          var format = attrs.format;

          function updateTime() {
            var dt = dateFilter(new Date(), format);
            element.text(dt);
          }

          updateTime();
          var intervalPromise = $interval(updateTime, 1000);

          scope.$on('$destroy', function(){
            $interval.cancel(intervalPromise);
          });

        }
    }

})();


/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .service('Utils', Utils);

    Utils.$inject = ['$window', 'APP_MEDIAQUERY'];
    function Utils($window, APP_MEDIAQUERY) {

        var $html = angular.element('html'),
            $win  = angular.element($window),
            $body = angular.element('body');

        return {
          // DETECTION
          support: {
            transition: (function() {
                    var transitionEnd = (function() {

                        var element = document.body || document.documentElement,
                            transEndEventNames = {
                                WebkitTransition: 'webkitTransitionEnd',
                                MozTransition: 'transitionend',
                                OTransition: 'oTransitionEnd otransitionend',
                                transition: 'transitionend'
                            }, name;

                        for (name in transEndEventNames) {
                            if (element.style[name] !== undefined) return transEndEventNames[name];
                        }
                    }());

                    return transitionEnd && { end: transitionEnd };
                })(),
            animation: (function() {

                var animationEnd = (function() {

                    var element = document.body || document.documentElement,
                        animEndEventNames = {
                            WebkitAnimation: 'webkitAnimationEnd',
                            MozAnimation: 'animationend',
                            OAnimation: 'oAnimationEnd oanimationend',
                            animation: 'animationend'
                        }, name;

                    for (name in animEndEventNames) {
                        if (element.style[name] !== undefined) return animEndEventNames[name];
                    }
                }());

                return animationEnd && { end: animationEnd };
            })(),
            requestAnimationFrame: window.requestAnimationFrame ||
                                   window.webkitRequestAnimationFrame ||
                                   window.mozRequestAnimationFrame ||
                                   window.msRequestAnimationFrame ||
                                   window.oRequestAnimationFrame ||
                                   function(callback){ window.setTimeout(callback, 1000/60); },
            /*jshint -W069*/
            touch: (
                ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
                (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
                (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
                (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
                false
            ),
            mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
          },
          // UTILITIES
          isInView: function(element, options) {
              /*jshint -W106*/
              var $element = $(element);

              if (!$element.is(':visible')) {
                  return false;
              }

              var window_left = $win.scrollLeft(),
                  window_top  = $win.scrollTop(),
                  offset      = $element.offset(),
                  left        = offset.left,
                  top         = offset.top;

              options = $.extend({topoffset:0, leftoffset:0}, options);

              if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
                  left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
                return true;
              } else {
                return false;
              }
          },

          langdirection: $html.attr('dir') === 'rtl' ? 'right' : 'left',

          isTouch: function () {
            return $html.hasClass('touch');
          },

          isSidebarCollapsed: function () {
            return $body.hasClass('aside-collapsed');
          },

          isSidebarToggled: function () {
            return $body.hasClass('aside-toggled');
          },

          isMobile: function () {
            return $win.width() < APP_MEDIAQUERY.tablet;
          }

        };
    }
})();

(function() {
    'use strict';

    angular
        .module('custom', [
            // request the the entire framework
            'wishbook',
            // or just modules
            'app.core',
            'app.sidebar'
            /*...*/
        ]);
})();

// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('custom')
        .controller('Controller', Controller);

    Controller.$inject = ['$log'];
    function Controller($log) {
        // for controllerAs syntax
        // var vm = this;

        activate();

        ////////////////

        function activate() {
          $log.log('I\'m a line from custom.js');
        }
    }
})();

/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

(function() {
    'use strict';

    angular
        .module('app.forms')
        .filter('propsFilter', propsFilter);

    function propsFilter() {
        return filterFilter;

        ////////////////
        function filterFilter(items, props) {
          var out = [];

          if (angular.isArray(items)) {
            items.forEach(function(item) {
              var itemMatches = false;

              var keys = Object.keys(props);
              for (var i = 0; i < keys.length; i++) {
                var prop = keys[i];
                var text = props[prop].toLowerCase();
                if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                  itemMatches = true;
                  break;
                }
              }

              if (itemMatches) {
                out.push(item);
              }
            });
          } else {
            // Let the output be the input untouched
            out = items;
          }

          return out;
        }
    }

})();
/**=========================================================
 * Module: tags-input.js
 * Initializes the tag inputs plugin
 =========================================================*/




//Plain javascript methods: Dhiren


function UpdateCheckBoxUI()
{

    setTimeout(function () //call after 1seconds
    {
        var output = $("input[type=checkbox]");
        //console.log(output);
        output.each(function (i) {
            //console.log(i);
            $(this).attr("id", i);
            $(this).after("<label for='" + i + "'></label");
        });

        //output.before("<div class='custom-control custom-checkbox'>");
        //output.after("<label for=""></label");
        //output.addClass("custom-control-input");

    }, 500);
}
function UpdateCheckBoxUIfilters() {
    console.log('UpdateCheckBoxUIfilters');
    setTimeout(function () //call after 1seconds
    {
        var output = $("input[type=checkbox]");
        //console.log(output);
        output.each(function (i) {
            //console.log(i);
            $(this).attr("id", i);
            $(this).after("<label for='" + i + "'></label");
        });
    }, 1300);
}

function APIrequests()
{

    // These requests made on on some pageInit i.e myCatalog ,Buyers  along with angulardata.tables fetch cause bulk select issue: solution-Caching 

    $.getJSON("api/v2/category/?format=json&parent=10",
    function (catdata)
    {
        var category_filter_options = [];
        for (var i = 0; i < catdata.length; i++) {
            var temp = {};
            temp.value = catdata[i].category_name;
            temp.label = catdata[i].category_name;
            category_filter_options.push(temp);
        }

        localStorage.setItem('category_filter_options', JSON.stringify(category_filter_options));
        //console.log(category_filter_options)
    });

    $.getJSON(" api/v1/state/?format=json",
        function (result)
        {
            var states_data = [];
            for (var i = 0; i < result.length; i++)
            {
                var json = {};
                json['value'] = result[i].state_name;
                json['label'] = result[i].state_name;
                states_data.push(json);
            }

            localStorage.setItem('states_data', JSON.stringify(states_data));
            //console.log(states_data)   http://seller.wishbook.io/ callback=?
        });

    $.getJSON("api/v1/group-types/",
        function (result)
        {
            var grouptype_data = [];
            for (var i = 0; i < result.length; i++)
            {
                var json = {};
                json['value'] = result[i].name;
                json['label'] = result[i].name;
                grouptype_data.push(json);
            }

            localStorage.setItem('grouptype_data', JSON.stringify(grouptype_data));
            //console.log(grouptype_data)
        });

}
APIrequests();


function OpenAddEditDiscountRule(ruleId) {
    console.log(ruleId);
    window.location.href = window.location.origin + '/#/app/brandwisediscount/?rule_id=' + ruleId;
}

function OpenDiscountSettings() {
    
    window.location.href = window.location.origin + '/#/app/brandwisediscount/';
}



function InitiallizeFreshChat(username, first_name, last_name, email, phone_number) {
        window.fcWidget.init({

            token: "4d1f51cc-687c-4e81-9ec9-e3d0105ede1d",
            host: "https://wchat.freshchat.com",
            externalId: username,     // user’s id unique to your system
            firstName: first_name,   // user’s first name
            lastName: last_name,    // user’s last name
            email: email,    // user’s email address
            phone: phone_number,  // phone number without country code
            phoneCountryCode: "+91",
            restoreId: localStorage.getItem('freshchatrestotreId' + username),
            config: {
                headerProperty:
                {
                    //Set Widget to be left to right.
                    direction: 'ltr'
                }
            }
        });

        window.fcWidget.user.get(function (resp) {
            var status = resp && resp.status,
                data = resp && resp.data;
            if (status !== 200) {
                window.fcWidget.user.setProperties({
                    firstName: first_name,   // user’s first name
                    lastName: last_name,    // user’s last name
                    email: email,    // user’s email address
                    phone: phone_number, // phone number without country code
                    phoneCountryCode: "+91",
                    plan: "Estate",                 // user's meta property 1
                    status: "Active",               // user's meta property 2
                });
                window.fcWidget.on('user:created', function (resp) {
                    var status = resp && resp.status,
                        data = resp && resp.data;

                    if (status === 200) {
                        if (data.restoreId) {
                            localStorage.setItem("freshchatrestotreId" + username, data.restoreId);// Update restoreId in your database
                        }
                    }
                });
            }
        });

        console.log('fresh chat initiallized ');

   
} //end of Freshchat



function toTitleCase(str)
{
    //str = str.toString();
    str = str.replace('_', ' ');
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function progressLoaderSingleClass()
{
    var whirlClass = 'whirl';
    return whirlClass;
}

function progressLoader()
{
    var whirlClass     = 'whirl',
        defaultSpinner = 'standard';
    return whirlClass+" "+defaultSpinner;
}
function dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
      else
          byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {type:mimeString});
}

function customSubString(str)
{
    var substr = str.substring(0,30);
    if(str.length > substr.length){
        substr += "..."
    }
    return substr;
}

function datatablesStateSaveCallback(data)
{

    data.search.search = "";
    for(var i=0; i<data.columns.length; i++){
        data.columns[i].search.search = "";
    }
    //console.log(JSON.stringify(data.columns));
    //delete data.search;
    //delete data.columns;
    return data;
}
function getDataTableHeight()
{
  return '60vh';
}

function formatDate(date) {
    var d = new Date(date);
    d.setMinutes(d.getMinutes()+d.getTimezoneOffset());
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}


function openPhotoSwipe(catalog, catalog_products, thirdparam)
{
    var pswpElement = document.querySelectorAll('.pswp')[0];
    //console.log(JSON.stringify(items));
    // console.log(catalog_products);
    
    //  console.log(products);
    var supplier_name = catalog.supplier_name;
    var slides = [];
    var start_index = 0;
    if (thirdparam == 'set')
    {
          var products = catalog_products.photos;
          for (var i = 0; i < products.length; i++) {
                var data = '';
                if(catalog.sku != null && catalog.sku != ""){
                  var data = '<strong>SKU: </strong>' + catalog.sku;
                }
                if(catalog.selling_price != null && catalog.selling_price != "") {
                  var data = data + '<br><strong>Price: &#8377;</strong>' + catalog.selling_price ;
                }
                if(catalog.sell_full_catalog == false){
                  var data = data + '<br><strong>Singe piece price: &#8377;</strong>' + catalog.single_piece_price;
                }
                if(catalog.brand != null){
                    if(catalog.brand.name != null && catalog.brand.name != ""){
                      var data = data + '<br><strong>Brand: </strong>' + catalog.brand.name;
                    }
                }
                if(catalog.eavdata.fabric){
                    if(catalog.eavdata.fabric.toString() != null && catalog.eavdata.fabric.toString() != "") {
                      var data = data + '<br><strong>Fabric: </strong>' + catalog.eavdata.fabric.toString() ;
                    }
                }
                if(catalog.eavdata.work){
                    if(catalog.eavdata.work.toString() != null && catalog.eavdata.work.toString() != "") {
                      var data = data + '<br><strong>Work: </strong>' + catalog.eavdata.work.toString() ;
                    }
                }
                if(supplier_name != null && supplier_name != "") {
                  var data = data + '<br><strong>Sold by: </strong>' + supplier_name ;
                }
                slides.push({
                  id: products[i].id,
                  src: products[i].image.thumbnail_medium,
                  title: data,
                  w: 850,
                  h: 980
                });
          }
          console.log(JSON.stringify(slides));
    }
    else
    {
        if (Array.isArray(thirdparam))
        {
            var prices = thirdparam;
        }
        else if (thirdparam)
        {
            var product_id = thirdparam;
        }
        
           
        console.log(prices + ' ' + product_id);
          
            var products = catalog_products.products;
            console.log(products);
            
            for (var i = 0; i < products.length; i++)
            {
                if (product_id == products[i].id) {
                    start_index = i;
                    console.log(start_index);
                }
                
                var data = '';
                if (products[i].sku != null && products[i].sku != "") {
                    var data = '<strong>SKU: </strong>' + products[i].sku;
                }
                if (products[i].selling_price != null && products[i].selling_price != "" && prices) {
                    var data = data + '<br><strong>Price: &#8377;</strong>' + prices.fullprice;
                }
                else
                {
                    var data = data + '<br><strong>Price: &#8377;</strong>' + products[i].selling_price ;
                }


                if (catalog.sell_full_catalog == false && prices) {
                    var data = data + '<br><strong>Singe piece price: &#8377;</strong>' + prices[products[i].id];
                }
                else
                {
                    var data = data + '<br><strong>Singe piece price: &#8377;</strong>' + products[i].single_piece_price;
                }
                if (catalog_products.title != null && catalog_products.title != "") {
                    var data = data + '<br><strong>Catalog: </strong>' + catalog_products.title;
                }
                if (catalog_products.brand != null) {
                    if (catalog_products.brand.name != null && catalog_products.brand.name != "") {
                        var data = data + '<br><strong>Brand: </strong>' + catalog_products.brand.name;
                    }
                }
                if (products[i].fabric != null && products[i].fabric != "") {
                    var data = data + '<br><strong>Fabric: </strong>' + products[i].fabric;
                }
                if (products[i].work != null && products[i].work != "") {
                    var data = data + '<br><strong>Work: </strong>' + products[i].work;
                }
                /*   if(supplier_name != null && supplier_name != "") {
                  var data = data + '<br><strong>Sold by: </strong>' + supplier_name ;
                } */
                /* var data = '<table>';
                if(products[i].sku != null && products[i].sku != ""){
                  var data = '<tr><td><strong>SKU: </strong>' + products[i].sku + '</td>';
                }
                else{
                  var data = '<tr><td><strong>SKU: </strong> &nbsp;</td>';
                }
                if(products[i].selling_price != null && products[i].selling_price != "") {
                  var data = data + '<td><strong>Price: &#8377;</strong>' + products[i].selling_price + '</td></tr>';
                }
                else
                {
                  var data = data + '<td>&nbsp;</td></tr>';
                }
                if(catalog_products.title != null && catalog_products.title != ""){
                  var data = data + '<tr><td><strong>Catalog: </strong>' + catalog_products.title + '</td>';
                }
                if(catalog_products.brand.name != null && catalog_products.brand.name != ""){
                  var data = data + '<td><strong>Brand: </strong>' + catalog_products.brand.name + '</td></tr>';
                }
                else
                {
                  var data = data + '<td>&nbsp;</td></tr>';
                }

                if(products[i].fabric != null && products[i].fabric != "" ) {
                  var data = data + '<tr><td><strong>Fabric: </strong>' + products[i].fabric + '</td>';
                }
                else
                {
                  var data = data + '<tr><td>&nbsp;</td>';
                }

                if(products[i].work != null && products[i].work != "") {
                  var data = data + '<td><strong>Work: </strong>' + products[i].work + '</td></tr>';
                }
                else
                {
                  var data = data + '<td>&nbsp;</td></tr>';
                }
                if(supplier_name != null && supplier_name != "") {
                  var data = data + '<tr><td><strong>Sold by: </strong>' + supplier_name + '</td></tr>';
                }
                var data = data + '</table>';  */


                /* var image = products[i].image;
                 var img = new Image();
 
                 img.onload = function() {
                  // alert(this.width + 'x' + this.height);
                   var width = this.width;
                   var height = this.height;
 
                   slides.push({
                   //  id: products[i].id,
                     src: image.thumbnail_medium,
                     title: data,
                     w: width,
                     h: height
                   });
                   console.log(slides);
                 }
                 console.log('out of onload: ' + slides);
                 img.src = image.thumbnail_medium; */

                slides.push({
                     id: products[i].id,
                    src: products[i].image.thumbnail_medium,
                    title: data,
                    w: 850,
                    h: 980,
                });


            } // end for
        //});

    } // end else

    // define options (if needed)
    var options = {
             // history & focus options are disabled on CodePen
        index: start_index || 0,
        history: false,
        focus: false,
        closeOnScroll:false,
        shareEl: false,
        preloaderEl: true,
        showAnimationDuration: 0,
        hideAnimationDuration: 0

    };

    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, slides, options);


  /* gallery.listen('imageLoadComplete', function(index, item) {
      //      alert(JSON.stringify(item));
          //  if (item.w < 1 || item.h < 1) { // unknown size
            var img = new Image();
          //  alert(index);
            img.onload = function() { // will get size after load
            item.w = this.width; // set image width
            item.h = this.height; // set image height
            alert(item.h);
               gallery.invalidateCurrItems(); // reinit Items
               gallery.updateSize(true); // reinit Items
       //     }
        img.src = item.src; // let's download image
        }
    });  */

    gallery.init();
};

    //openPhotoSwipe();
    //  document.getElementById('btn').onclick = openPhotoSwipe();



function toWords(s) {
    var th = ['', 'thousand', 'million', 'billion', 'trillion'];

    var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

    var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s)) return 'not a number';
    var x = s.indexOf('.');
    if (x == -1) x = s.length;
    if (x > 15) return 'too big';
    var n = s.split('');
    var str = '';
    var sk = 0;
    for (var i = 0; i < x; i++) {
        if ((x - i) % 3 == 2) {
            if (n[i] == '1') {
                str += tn[Number(n[i + 1])] + ' ';
                i++;
                sk = 1;
            } else if (n[i] != 0) {
                str += tw[n[i] - 2] + ' ';
                sk = 1;
            }
        } else if (n[i] != 0) {
            str += dg[n[i]] + ' ';
            if ((x - i) % 3 == 0) str += 'hundred ';
            sk = 1;
        }
        if ((x - i) % 3 == 1) {
            if (sk) str += th[(x - i - 1) / 3] + ' ';
            sk = 0;
        }
    }
    if (x != s.length) {
        var y = s.length;
        str += 'point ';
        for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
    }
    return str.replace(/\s+/g, ' ');

}


function copyToClipboard() {
  console.log('cc');
  var copyText = document.getElementById("copytoclip");
  console.log(copyText);
  copyText.select();
  document.execCommand("Copy");
}

function copyToClipboard1() {
  console.log('cc');
  var copyText = document.getElementById("copytoclip1");
  console.log(copyText);
  copyText.select();
  document.execCommand("Copy");
}

function copyToClipboard2() {
  console.log('cc');
  var copyText = document.getElementById("copytoclip2");
  console.log(copyText);
  copyText.select();
  document.execCommand("Copy");
}

function copyToClipboard3() {
  console.log('cc');
  var copyText = document.getElementById("copytoclip3");
  console.log(copyText);
  copyText.select();
  document.execCommand("Copy");
}
function copyToClipboard4() {
  console.log('cc');
  var copyText = document.getElementById("copytoclip4");
  console.log(copyText);
  copyText.select();
  document.execCommand("Copy");
}
function fullSetQtyText(qty, no_of_pcs){
  var qty_text = '';



  if( parseInt(no_of_pcs) > 1 && parseInt(qty) > 0) {
      qty_text = qty  + ' ( ' + parseInt(qty)/parseInt(no_of_pcs) + ' set of '+ no_of_pcs + ' singles) ';
  }
  else {
      qty_text = qty;
  }

  return qty_text
}
function capitalizeTxt(txt) {
  return txt.charAt(0).toUpperCase() + txt.slice(1); //or if you want lowercase the rest txt.slice(1).toLowerCase();
}
angular.module('app.purchaseorders', [])
    .service('sharedProperties', function () {
        var orderno = '';

        return {
            getProperty: function () {
                return order_id;
            },
            setProperty: function(value) {
                order_id = value;
                //console.log(order_id);
            },
            getOrderType: function () {
                return order_type;
            },
            setOrderType: function(type) {
                order_type = type;
                //console.log(order_id);
            },
            getType: function () {
                return type;
            },
            setType: function(type1) {
                type = type1;
                //console.log(order_id);
            }
        };
});


/* Start: Applozic code */
 /* (function(d, m){var s, h;
   s = document.createElement("script");
   s.type = "text/javascript";
   s.async=true;
   s.src="https://apps.applozic.com/sidebox.app";
   h=document.getElementsByTagName('head')[0];
   h.appendChild(s);
   window.applozic=m;
   m.init=function(t){m._globals=t;}})(document, window.applozic || {}); */



  /* window.applozic.init({

                        appId: '1a79888ef6d0fa76c522ea56a251b4fb9',      //Get your application key from https://www.applozic.com
                        userId: 'mavajih',                     //Logged in user's id, a unique identifier for user
                        userName: 'Mavaji',                 //User's display name
                        imageLink : '',                     //User's profile picture url
                        email : '',                         //optional
                        contactNumber: '',                  //optional, pass with internationl code eg: +13109097458
                        desktopNotification: true,
                        source: '1',                          // optional, WEB(1),DESKTOP_BROWSER(5), MOBILE_BROWSER(6)
                        notificationIconLink: 'https://www.applozic.com/favicon.ico',    //Icon to show in desktop notification, replace with your icon
                        authenticationTypeId: 1,          //1 for password verification from Applozic server and 0 for access Token verification from your server
                        accessToken: '',                    //optional, leave it blank for testing purpose, read this if you want to add additional security by verifying password from your server https://www.applozic.com/docs/configuration.html#access-token-url
                        locShare: true,
                        googleApiKey: "AIzaSyDKfWHzu9X7Z2hByeW4RRFJrD9SizOzZt4",   // your project google api key
                        googleMapScriptLoaded : true,   // true if your app already loaded google maps script
                        mapStaticAPIkey: "AIzaSyCWRScTDtbt8tlXDr6hiceCsU83aS2UuZw",
                        autoTypeSearchEnabled : true,     // set to false if you don't want to allow sending message to user who is not in the contact list
                        loadOwnContacts : false, //set to true if you want to populate your own contact list (see Step 4 for reference)
                        olStatus: false,         //set to true for displaying a green dot in chat screen for users who are online
                        onInit : function(response) {
                           // alert("fsd");
                            if (response === "success") {
                                console.log("Applozic Init SUCCESS");
                             //   store.dispatch(initApplozicSuccess());
                                isInitialized = true;
                                // login successful, perform your actions if any, for example: load contacts,
                                // getting unread message count, etc
                            } else {
                                console.log("Applozic Init FAILURE");
                             //   store.dispatch(initApplozicFailure("Unable to initialize applozic"));
                                // error in user login/register (you can hide chat button or refresh page)
                            }
                       },
                       contactDisplayName: function(otherUserId) {
                             //return the display name of the user from your application code based on userId.
                             return "";
                       },
                       contactDisplayImage: function(otherUserId) {
                             //return the display image url of the user from your application code based on userId.
                             return "";
                       },
                       onTabClicked: function(response) {
                             // write your logic to execute task on tab load
                             //   object response =  {
                             //    tabId : userId or groupId,
                             //    isGroup : 'tab is group or not'
                             //  }
                       }
                      });  */
/* End: Applozic code */
