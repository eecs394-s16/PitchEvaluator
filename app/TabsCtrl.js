'use strict';
angular
.module('PitchEvaluator')
.controller('TabsCtrl', function($scope, $location) {
	$scope.tabs = [
      { link : '/view1', label : 'View1' },
      { link : '/view2', label : 'View2' },
      { link : '/addTeam', label : 'addTeam' },
      { link : '/judgeInfo', label : 'judgeInfo' },
      { link : '/judgeLogin', label : 'judgeLogin' },
      { link : '/profLogin', label : 'profLogin' },
      { link : '/teamLogin', label : 'teamLogin' },
      { link : '/teamSummary', label : 'teamSummary' }
    ];

  $scope.isActive = function(route) {
        return route === $location.path();
        console.log(route);
    };

 });
