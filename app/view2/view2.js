'use strict';
angular
.module('PitchEvaluator')
.controller('View2Ctrl', function($scope, $firebaseObject, $firebaseArray, $location) {
	var teamsRef = new Firebase("https://pitchevaluator.firebaseio.com/teams");
  	$scope.loadingTeams = true;
	var teamList = $firebaseArray(teamsRef);
	teamList.$loaded(function() {
	    $scope.loadingTeams = false;
	    $scope.teams = teamList;
	});

	var curTeamName, curTeamIndex, curTeamKey, curTeamObject, curTeamRef;
	var q1, q2, q3, q4, q5, cmt1, cmt2, cmt3, cmt4, cmt5;
	var graderName;
	var valid = false;

	var reviewUpdate = function (team, q1, cmt1, q2, cmt2, q3, cmt3, q4, cmt4, q5, cmt5) {
		if (q1 != undefined) {
			team.update({q1: q1});
		}
		if (q2 != undefined) {
			team.update({q2: q2});
		}
		if (q3 != undefined) {
			team.update({q3: q3});
		}
		if (q4 != undefined) {
			team.update({q4: q4});
		}
		if (q5 != undefined) {
			team.update({q5: q5});
		}
		if (cmt1 != "") {
			team.update({cmt1: cmt1});
		}
		if (cmt2 != "") {
			team.update({cmt2: cmt2});
		}
		if (cmt3 != "") {
			team.update({cmt3: cmt3});
		}
		if (cmt4 != "") {
			team.update({cmt4: cmt4});
		}
		if (cmt5 != "") {
			team.update({cmt5: cmt5});
		}
		if (q1 != undefined && q2 != undefined && q3 != undefined && q4 != undefined) {
			var teamavg = (parseFloat(q1) + parseFloat(q2) + parseFloat(q3) + parseFloat(q4))/4.0;
			teamavg = teamavg.toFixed(2);
			team.update({teamavgval: teamavg});
		}
	}

	var calcAvg = function(team) {
		var teamavg = (parseFloat(team.q1) + parseFloat(team.q2) + parseFloat(team.q3) + parseFloat(team.q4))/4.0;
		teamavg = teamavg.toFixed(2);
		team.update({teamavgval: teamavg});
	}

	var checkNull = function(q1, q2, q3, q4, q5) {
		if (q1 != undefined && q2 != undefined && q3 != undefined && q4 != undefined && q5 != undefined) {
			return false;
		}
		return true;
	}

	var isCmtsBlank= function(cmt1, cmt2, cmt3, cmt4, cmt5) {
		if(cmt1 == "" && cmt2 == "" && cmt3 == "" && cmt4 == "" && cmt5 == ""){
	    	return true;
	    }
	    return false;
	}

	class Evaluation {
	    constructor(user, teamName, q1, cmt1, q2, cmt2, q3, cmt3, q4, cmt4, q5, cmt5) {
		    this.user = user;
		    this.teamName = teamName;
		    this.q1 = q1;
		    this.cmt1 = cmt1;
		    this.q2 = q2;
		    this.cmt2 = cmt2;
		    this.q3 = q3;
		    this.cmt3 = cmt3;
		    this.q4 = q4;
		    this.cmt4 = cmt4;
		    this.q5 = q5;
		    this.cmt5 = cmt5;
	    }
	}

	$scope.onSubmit = function() {
		curTeamName = document.getElementById("team-select").value;

		q1 = $('input[name="q1radio"]:checked').val();
		q2 = $('input[name="q2radio"]:checked').val();
		q3 = $('input[name="q3radio"]:checked').val();
		q4 = $('input[name="q4radio"]:checked').val();
		q5 = $('input[name="q5radio"]:checked').val();

		cmt1 = document.getElementById("q1textarea").value;
		cmt2 = document.getElementById("q2textarea").value;
		cmt3 = document.getElementById("q3textarea").value;
		cmt4 = document.getElementById("q4textarea").value;
		cmt5 = document.getElementById("q5textarea").value;

		graderName = document.getElementById("grader-name").value;

	    //@TODO: implemented user auth
	    var user = graderName;

	    var evaluation = new Evaluation(user, curTeamName, q1, cmt1, q2, cmt2, q3, cmt3, q4, cmt4, q5, cmt5);
	    var submit_alert;

		for (var i = 0; i < teamList.length; i++) {
			if (teamList[i].name == curTeamName) {
		        var teamRef = teamsRef + "/" + teamList[i].$id;
		        var team = new Firebase(teamRef);
		        if (team.reviews) {
		        	console.log('Woot');
		        }
		        else {
		        	var reviews = team.child('reviews');
		        	var reviewID;
		        	var reviewToEdit;
		        	var reviewArray = $firebaseArray(reviews);
		        	reviewArray.$loaded().then(function() {
		        		var userExists = false;
			        	for (var i = 0; i < reviewArray.length; i++) {
			        		if (reviewArray[i].user == evaluation.user && !userExists) {
			        			userExists = true;
			        			reviewID = reviewArray[i].$id;
			        		}
			        	}
			        	if (userExists) {
			        		reviewToEdit = reviews.child(reviewID);
			        		reviewUpdate(reviewToEdit, q1, cmt1, q2, cmt2, q3, cmt3, q4, cmt4, q5, cmt5);
			        		$location.path('#/view1');
			        	}
			        	else {
			        		//check that (no radios) || (all comments) == null
			        		if (checkNull(q1, q2, q3, q4, q5)) { //not all radios completed
			        			//throw an error
					        	$("#slide-text").slideDown();
			        		}
			        		else if (isCmtsBlank(cmt1, cmt2, cmt3, cmt4, cmt5)) { //no comments
			        			submit_alert = confirm("You didn't type in any comments/ Are you sure you want to submit the form?");
			        			if (submit_alert) {
			        				reviews.push(evaluation);
			        				$location.path('#/view1');
			        			}
			        		}
			        		else {
			        			reviews.push(evaluation);
			        			$location.path('#/view1');
			        		}
			        	}
		        	});
		        }
		    }
	    } //this closes the for
	} //this closes onSubmit
});