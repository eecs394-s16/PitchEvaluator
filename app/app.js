'use strict';

angular
  .module('PitchEvaluator', ['ngRoute'])
  .config(function($routeProvider) {
  $routeProvider
    .when('/view1', {
      templateUrl: 'view1/view1.html',
      controller: 'View1Ctrl'
    })
    .when('/view2', {
      templateUrl: 'view2/view2.html',
      controller: 'View2Ctrl'
    })
    .otherwise({
      redirectTo: 'view1'
    });
});
