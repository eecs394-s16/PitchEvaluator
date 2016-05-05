'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'TeamListCtrl'
  });
}])

/*.controller('View1Ctrl', [function() {

}]);*/


//mine
.controller('TeamListCtrl', function ($scope) {
	$scope.teams = [
		{'name': 'Team Blue',
		'product': 'CrowdStorm',
		'score' : '7'},
		{'name': 'Team Gold',
		'product': 'PottyPointr',
		'score' : '8'},
		{'name': 'Team Red',
		'product': 'Geovibes',
		'score' : '9'}
	];
});