'use strict';

angular
  .module('PitchEvaluator')
  .controller('View1Ctrl', function($scope, $firebaseObject, $firebaseArray) {
  	var ref = new Firebase("https://pitchevaluator.firebaseio.com/");
    $scope.hello = 'hello world';
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

//Creating the Teams Array in Firebase
//	ref.child('teams').set($scope.teams);

//Adding a team to the FirebaseArray
	/*$firebaseArray(ref.child('teams')).$add({'name': 'Team Green',
		'product': 'BestProduct',
		'score' : '10'});*/

//Pulling the FirebaseArray into scope

	$scope.teamList = $firebaseArray(ref.child('teams'));
  })
