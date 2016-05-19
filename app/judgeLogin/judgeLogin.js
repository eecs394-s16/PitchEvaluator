'use strict';

angular
  .module('PitchEvaluator')
  .controller('judgeLoginCtrl', function($rootScope, $scope, $firebaseObject, $firebaseArray, userService) {
    $scope.userLog = "";

    $scope.login = function() {
      console.log($scope.userLog);
      userService.set($scope.userLog);
      $rootScope.user = $scope.userLog;
      console.log(userService.get())
    }
})
