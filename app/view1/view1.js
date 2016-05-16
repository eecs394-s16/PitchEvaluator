'use strict';

angular
  .module('PitchEvaluator')
  .controller('View1Ctrl', function($scope, $firebaseObject, $firebaseArray) {
  	var ref = new Firebase("https://pitchevaluator.firebaseio.com/");

	$scope.teamList = $firebaseArray(ref.child('teams'));

  })

