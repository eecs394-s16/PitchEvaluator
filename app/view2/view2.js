'use strict';
angular
  .module('PitchEvaluator')
  .controller('View2Ctrl', function($scope, $firebaseObject, $firebaseArray) {
  	var teamsRef = new Firebase("https://pitchevaluator.firebaseio.com/teams");
  	//Pulling the FirebaseArray into scope
	$scope.teamList = $firebaseArray(teamsRef);

	$scope.curTeamName;
	$scope.curTeamIndex;
	$scope.curTeamKey;
	var curTeamObject;

	$scope.onSubmit = function() {
		$scope.curTeamName = document.getElementById("team-select").value;
		// console.log($scope.curteamList;
		$scope.q1 = $('input[name="q1radio"]:checked').val();
		$scope.q2 = $('input[name="q2radio"]:checked').val();
		$scope.q3 = $('input[name="q3radio"]:checked').val();
		$scope.q4 = $('input[name="q4radio"]:checked').val();

		$scope.cmt1 = document.getElementById("q1textarea").value;
		$scope.cmt2 = document.getElementById("q2textarea").value;
		$scope.cmt3 = document.getElementById("q3textarea").value;
		$scope.cmt4 = document.getElementById("q4textarea").value;
		
		for (var i = 0; i < $scope.teamList.length; i++) {
			if ($scope.teamList[i].name == $scope.curTeamName) {
				$scope.curTeamIndex = i;
				//console.log(i);
				$scope.curTeamKey = $scope.teamList.$keyAt($scope.curTeamIndex);

				var curTeamObject = $firebaseObject(teamsRef.child($scope.curTeamKey));

				curTeamObject.$bindTo($scope, "curTeam").then(function() {
				//console.log($scope.curTeam);
				$scope.curTeam.q1Comment = $scope.cmt1;
				$scope.curTeam.q2Comment = $scope.cmt2;
				$scope.curTeam.q3Comment = $scope.cmt3;
				$scope.curTeam.q4Comment = $scope.cmt4;
				$scope.curTeam.q1Val = $scope.q1;
				$scope.curTeam.q2Val = $scope.q2;
				$scope.curTeam.q3Val = $scope.q3;
				$scope.curTeam.q4Val = $scope.q4;
			});
			}
		};
		//$scope.curTeamObject = $scope.teamList.$getRecord($scope.curTeamKey);
		

//		console.log($scope.curTeamObject);
		


		// console.log(document.getElementById("q1textarea").value);
	};
	

  })
