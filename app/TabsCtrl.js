'use strict';
angular
.module('PitchEvaluator')
.controller('TabsCtrl', function($scope, $location) {
	$scope.tabs = [
      { link : '/view1', label : 'View1' },
      { link : '/view2', label : 'View2' },
      { link : '/formBuilder', label : 'formBuilder' }
    ]; 
    
  // $scope.selectedTab = $scope.tabs[0];    
  // $scope.setSelectedTab = function(tab) {
  //   $scope.selectedTab = tab;
  // }
  
  // $scope.tabClass = function(tab) {
  //   if ($scope.selectedTab == tab) {
  //     return "active";
  //   } else {
  //     return "";
  //   }
  //   console.log(tab);
  // }

  $scope.isActive = function(route) {
        return route === $location.path();
        console.log(route);
    };


 });