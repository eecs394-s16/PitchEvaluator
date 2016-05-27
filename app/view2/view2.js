'use strict';
angular
.module('PitchEvaluator')
.controller('View2Ctrl', function($rootScope, $scope, $firebaseObject, $firebaseArray, $location, teamService, loggedinCheck) {

	loggedinCheck.check();

	$scope.loadingTeams = true;
	var teamsRef = new Firebase($rootScope.sessionRef+"/teams");
	var teamList = $firebaseArray(teamsRef);
	teamList.$loaded(function() {
	    $scope.loadingTeams = false;
	    $scope.teams = teamList;
	});
	$scope.selectedTeam=null;
	var curTeamName, curTeamIndex, curTeamKey, curTeamObject, curTeamRef;
	var q1, q2, q3, q4, q5, cmt1, cmt2, cmt3, cmt4, cmt5;
	var graderName, teamCheck;
	var valid = false;

	if (teamService.get()) {
		teamList.$loaded(function() {
			$scope.selectedTeam=teamService.get();
			teamService.set(null);
			getData($scope.selectedTeam);
		});
	}

	$scope.$watch(function(scope) {return scope.selectedTeam},
		function(oldValue, newValue) {
			getData(newValue);
		});

	var commentShowings = {
		1: false,
		2: false,
		3: false,
		4: false,
		5: false
	}
	$scope.checkComment = function(num) {
		return commentShowings[num];
	}
	$scope.showComment = function(num) {
		commentShowings[num] = true;
	}

	function getData(name) {
		//@TODO: Change this user to the correct one
		var user = $rootScope.user;
		var booly = false;
		for (let team of teamList) {
			if (team.name==$scope.selectedTeam) {
				let teamRef = new Firebase($rootScope.sessionRef+"/teams/"+team.$id);
				if (teamRef.child('reviews')) {
					var reviews = $firebaseArray(teamRef.child('reviews'));
					reviews.$loaded(function() {
						for (let review of reviews) {
							if (review.user == user) {
								// console.log(review);
								updateValues(review);
								booly = true;
								return review;
							}
						}
					});
				}
				if (!booly) {
					resetValues();
				}
				break;
			}
		}
	}

	function resetValues() {
		$("#q1slider").slider( "option", "value", 0 );
		$("#q2slider").slider( "option", "value", 0 );
		$("#q3slider").slider( "option", "value", 0 );
		$("#q4slider").slider( "option", "value", 0 );

		$('input[name="q5radio"]').val([null]);

		document.getElementById("q1textarea").value = null;
		document.getElementById("q2textarea").value = null;
		document.getElementById("q3textarea").value = null;
		document.getElementById("q4textarea").value = null;
		document.getElementById("q5textarea").value = null;

	}
	function updateValues(review) {
		$("#q1slider").slider( "option", "value", review.q1 );
		$("#q2slider").slider( "option", "value", review.q2 );
		$("#q3slider").slider( "option", "value", review.q3 );
		$("#q4slider").slider( "option", "value", review.q4 );

		$('input[name="q5radio"]').val([review.q5]);

		document.getElementById("q1textarea").value = review.cmt1;
		document.getElementById("q2textarea").value = review.cmt2;
		document.getElementById("q3textarea").value = review.cmt3;
		document.getElementById("q4textarea").value = review.cmt4;
		document.getElementById("q5textarea").value = review.cmt5;
	}


	var reviewUpdate = function (team, q1, cmt1, q2, cmt2, q3, cmt3, q4, cmt4, q5, cmt5) {
		if (q1 != 0) {
			team.update({q1: q1});
		}
		if (q2 != 0) {
			team.update({q2: q2});
		}
		if (q3 != 0) {
			team.update({q3: q3});
		}
		if (q4 != 0) {
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
		if (q1 != 0 && q2 != 0 && q3 != 0 && q4 != 0) {
			var teamavg = (parseFloat(q1) + parseFloat(q2) + parseFloat(q3) + parseFloat(q4))/4.0;
			teamavg = teamavg.toFixed(2);
			team.update({teamavgval: teamavg});
		}
	}


	$("#q1slider").slider({
		min: 0,
		step: 1,
		max: 7,
		value: 0
	}).each(function() {
		var opt = $(this).data().uiSlider.options;
		var vals = opt.max - opt.min;
		for (var i = 0; i <= vals; i++) {
			var el = $('<label>' + (i + opt.min) + '</label>').css('left', (i/vals*100) + '%');
			$("#q1slider").append(el);
		}
	});

	$("#q2slider").slider({
		min: 0,
		step: 1,
		max: 7,
		value: 0
	}).each(function() {
		var opt = $(this).data().uiSlider.options;
		var vals = opt.max - opt.min;
		for (var i = 0; i <= vals; i++) {
			var el = $('<label>' + (i + opt.min) + '</label>').css('left', (i/vals*100) + '%');
			$("#q2slider").append(el);
		}
	});

	$("#q3slider").slider({
		min: 0,
		step: 1,
		max: 7,
		value: 0
	}).each(function() {
		var opt = $(this).data().uiSlider.options;
		var vals = opt.max - opt.min;
		for (var i = 0; i <= vals; i++) {
			var el = $('<label>' + (i + opt.min) + '</label>').css('left', (i/vals*100) + '%');
			$("#q3slider").append(el);
		}
	});

	$("#q4slider").slider({
		min: 0,
		step: 1,
		max: 7,
		value: 0
	}).each(function() {
		var opt = $(this).data().uiSlider.options;
		var vals = opt.max - opt.min;
		for (var i = 0; i <= vals; i++) {
			var el = $('<label>' + (i + opt.min) + '</label>').css('left', (i/vals*100) + '%');
			$("#q4slider").append(el);
		}
	});



	var calcAvg = function(team) {
		var q1, q2, q3, q4;
		var q1sum = 0;
		var q2sum = 0;
		var q3sum = 0;
		var q4sum = 0;
		var teamavg = 0;

		var reviewArray = $firebaseArray(team.child('reviews'));

		reviewArray.$loaded().then(function() {
			for (var i = 0; i < reviewArray.length; i++) {
				q1sum += parseFloat(reviewArray[i].q1);
				q2sum += parseFloat(reviewArray[i].q2);
				q3sum += parseFloat(reviewArray[i].q3);
				q4sum += parseFloat(reviewArray[i].q4);
			};

			q1 = q1sum/reviewArray.length;
			q2 = q2sum/reviewArray.length;
			q3 = q3sum/reviewArray.length;
			q4 = q4sum/reviewArray.length;

			teamavg = (q1 + q2 + q3 + q4)/4.0;

			q1 = q1.toFixed(2);
			q2 = q2.toFixed(2);
			q3 = q3.toFixed(2);
			q4 = q4.toFixed(2);
			teamavg = teamavg.toFixed(2);

			team.update({
				q1Val: q1,
				q2Val: q2,
				q3Val: q3,
				q4Val: q4,
				ovrAvg: teamavg
			});

		});

	}

	var checkZero = function(q1, q2, q3, q4, q5) {
		if (q1 != 0 && q2 != 0 && q3 != 0 && q4 != 0 && q5 != undefined) {
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
		curTeamName = $scope.selectedTeam;

		q1 = $("#q1slider").slider("option", "value");
		q2 = $("#q2slider").slider("option", "value");
		q3 = $("#q3slider").slider("option", "value");
		q4 = $("#q4slider").slider("option", "value");
		q5 = $('input[name="q5radio"]:checked').val();

		cmt1 = document.getElementById("q1textarea").value;
		cmt2 = document.getElementById("q2textarea").value;
		cmt3 = document.getElementById("q3textarea").value;
		cmt4 = document.getElementById("q4textarea").value;
		cmt5 = document.getElementById("q5textarea").value;

		// graderName = document.getElementById("grader-name-input").value;
		graderName = $rootScope.user;

		if (curTeamName == null && graderName != "") {
			$("#slide-text1").slideDown();
			return;
		}
		else {
			$("#slide-text1").hide();
		}
	    //@TODO: implemented user auth
	    var user = graderName;

	    var evaluation = new Evaluation(user, curTeamName, q1, cmt1, q2, cmt2, q3, cmt3, q4, cmt4, q5, cmt5);
	    var submit_alert;



		for (var i = 0; i < teamList.length; i++) {
			if (teamList[i].name == curTeamName) {
		        var teamRef = teamsRef + "/" + teamList[i].$id;
		        var team = new Firebase(teamRef);
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
		        		calcAvg(team);
		        		$location.path('#/view1');
		        	}
		        	else {
		        		//check that (no radios) || (all comments) == null
		        		if (checkZero(q1, q2, q3, q4, q5)) { //not all radios completed
		        			//throw an error
				        	$("#slide-text2").slideDown();
		        		}
		        		else if (isCmtsBlank(cmt1, cmt2, cmt3, cmt4, cmt5)) { //no comments
		        			$("#slide-text2").hide();
							submit_alert = confirm("You didn't type in any comments/ Are you sure you want to submit the form?");
		        			if (submit_alert) {
		        				reviews.push(evaluation);
				        		calcAvg(team);
		        				$location.path('#/view1');
		        			}
		        		}
		        		else {
		        			reviews.push(evaluation);
			        		calcAvg(team);
		        			$location.path('#/view1');
		        		}
		        	}
	        	});
		    }
	    } //this closes the for
	} //this closes onSubmit
});
