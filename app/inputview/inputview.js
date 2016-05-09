'use strict';

angular.module('pitchEvaluator.inputview', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/inputview', {
    templateUrl: 'inputview/inputview.html',
    controller: 'InputCtrl'
  });
}])

.controller('InputCtrl', function ($scope, $firebaseObject) {

	

});