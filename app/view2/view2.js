'use strict';
angular
.module('PitchEvaluator')
.controller('View2Ctrl', function($scope, $firebaseObject, $firebaseArray) {
  	var teamsRef = new Firebase("https://pitchevaluator.firebaseio.com/teams");

	var teamList = $firebaseArray(teamsRef);
	$scope.teams = teamList;

	var curTeamName, curTeamIndex, curTeamKey, curTeamObject, curTeamRef;
	var q1, q2, q3, q4, cmt1, cmt2, cmt3, cmt4;

	$scope.onSubmit = function() {
		curTeamName = document.getElementById("team-select").value;
		
		q1 = $('input[name="q1radio"]:checked').val();
		q2 = $('input[name="q2radio"]:checked').val();
		q3 = $('input[name="q3radio"]:checked').val();
		q4 = $('input[name="q4radio"]:checked').val();

		cmt1 = document.getElementById("q1textarea").value;
		cmt2 = document.getElementById("q2textarea").value;
		cmt3 = document.getElementById("q3textarea").value;
		cmt4 = document.getElementById("q4textarea").value;
		
		for (var i = 0; i < teamList.length; i++) {
			if (teamList[i].name == curTeamName) {
				curTeamIndex = i;
				curTeamKey = teamList.$keyAt(curTeamIndex);
				curTeamObject = $firebaseObject(teamsRef.child(curTeamKey))
				//Updating a Team:
					//Create a reference to the team:
				curTeamRef = teamsRef.child(curTeamKey);

					//Utilize the "update()" function
				curTeamRef.update({ q1Val: q1,
									q1cmt: cmt1,
									q2Val: q2,
									q2cmt: cmt2,
									q3Val: q3,
									q3cmt: cmt3,
									q4Val: q4,
									q4cmt: cmt4
								 });
			}
		}
	};
});
