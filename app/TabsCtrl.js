'use strict';
angular
.module('PitchEvaluator')
.controller('TabsCtrl', function($rootScope, $scope, $location) {
	$scope.tabs = [
      { link : '/view1', label : 'Summary' },
      { link : '/view2', label : 'Evaluation Form' },
      { link : '/addTeam', label : 'Add Team' },
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

	$rootScope.user = "JohnDoe";
 });
