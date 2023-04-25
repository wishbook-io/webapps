$scope.splitExtra =  function(extra_notifiers) {
  $scope.extra_count = extra_notifiers.split(',').length
}
$scope.GetLables =  function(entity) {
  console.log(entity);
  NotificationTemplate.query({ entity: entity.id }).$promise.then(function(success){
        $scope.notification_labels = success;
    });
}

$scope.SetMessage   =  function(label) {
  console.log(label);
  if (label) {
    vm.notification_message  = label.sms_temp.replace("<catalog name>",vm.selectedFullJson[$scope.catalog_id][2].toString());
  }
}

$scope.Notify = function(catalog_id,is_catalog) {
  $scope.catalog_id = catalog_id;
  $scope.seller_data  = vm.selectedFullJson[catalog_id][7];
  NotificationEntity.query().$promise.then(function(success){
      vm.notification_entities = success;
  });
  console.log($scope.seller_data);
  console.log($scope.entities);
  vm.notification_label = '';
  vm.notification_message = '';
  vm.notification_entity = '';
  vm.notification_entity = '';
  vm.extra_sellers = '';
  vm.extra_sellers = '';
  vm.notify_to = '';
  vm.seller_data = '';
  vm.way = {
    'by_sms' : true,
    'by_noti' : false
  };
  $scope.NotifyDailog()

};


$scope.NotifyDailog = function () {
    ngDialog.open({
        template: 'notifydailog',
        className: 'ngdialog-theme-default',
        scope: $scope,
        closeByDocument: false
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
    if(vm.NotifyForm.$valid) {
        $(".modelform4").addClass(progressLoader());
        if (!vm.way.by_sms && !vm.way.by_noti) {
          $(".modelform4").removeClass(progressLoader());
          vm.errortoaster = {
                       type:  'error',
                       title: 'Medium',
                       text:  'Please Select a Medium.'
                   };
         toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);
          return
        }
        Notification.save({
                           "notice_template": vm.notification_label.id,
                           "message":vm.notification_message,
                           "notifier_users" : vm.seller_data.toString(),
                           "extra_ids" : vm.extra_sellers,
                           "object_id" : $scope.catalog_id,
                           "content_type" : 25,
                           "by_noti" : vm.way.by_noti || false,
                           "by_sms"  : vm.way.by_sms || false
                        },
        function(success){
                $(".modelform4").removeClass(progressLoader());
                ngDialog.close();
                vm.successtoaster = {
                    type:  'success',
                    title: 'Success',
                    text:  'Notification Send successfully.'
                };
                toaster.pop(vm.successtoaster.type, vm.successtoaster.title, vm.successtoaster.text);
                $scope.reloadData();
                $scope.order = {};
          })
    }
    else
    {
      vm.errortoaster = {
                   type:  'error',
                   title: 'Error',
                   text:  'Some Error Occured!'
               };
     toaster.pop(vm.errortoaster.type, vm.errortoaster.title, vm.errortoaster.text);

    }

};
