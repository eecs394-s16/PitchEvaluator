'use strict';

angular
  .module('PitchEvaluator')
  .controller('View1Ctrl', function($scope, $firebaseObject, $firebaseArray) {
  	var teamsRef = new Firebase("https://pitchevaluator.firebaseio.com/teams");
	$scope.teamList = $firebaseArray(teamsRef);

	

	// var selectedTeam = teamsRef + "/" + teamList[i].$id;

  })

