(function() {
    'use strict';

    angular
        .module('app.panels')
        .controller('DraggablePanelController', DraggablePanelController);

    DraggablePanelController.$inject = ['$timeout', '$localStorage'];
    function DraggablePanelController($timeout, $localStorage) {
        var vm = this;
        var storageKeyName = 'portletState';

        activate();

        ////////////////

        function activate() {

            // https://github.com/angular-ui/ui-sortable
            vm.sortablePortletOptions = {
                connectWith:          '.portlet-connect',
                handler:              '.panel-heading',
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
            };

            function savePortletOrder(event) {
                var self = event.target;
                var data = angular.fromJson($localStorage[storageKeyName]);

                if (!data) {
                    data = {};
                }

                data[self.id] = $(self).sortable('toArray');

                if (data) {
                    $timeout(function() {
                        $localStorage[storageKeyName] = angular.toJson(data);
                    });
                }
            }

            function loadPortletOrder(event) {
                var self = event.target;
                var data = angular.fromJson($localStorage[storageKeyName]);

                if (data) {

                    var porletId = self.id,
                        panels = data[porletId];

                    if (panels) {
                        var portlet = $('#' + porletId);

                        $.each(panels, function(index, value) {
                            $('#' + value).appendTo(portlet);
                        });
                    }
                }
            }

        }
    }
})();