'use strict';
angular
.module('PitchEvaluator')
.controller('View2Ctrl', function($rootScope, $scope, permissionsService, $firebaseObject, $firebaseArray, $location, teamService, loggedinCheck) {

	loggedinCheck.check();

	if (!permissionsService.isPermitted('Review')) {
		$location.path('view1');
	}

	$scope.toggleText= [];
	for (var i=0; i<9; i++) {
		$scope.toggleText.push('Add Comment');
	}

	$scope.loadingTeams = true;
	var teamsRef = new Firebase($rootScope.sessionRef+"/teams");
	var teamList = $firebaseArray(teamsRef);
	teamList.$loaded(function() {
	    $scope.loadingTeams = false;
	    $scope.teams = teamList;
	});
	$scope.selectedTeam=null;
	var curTeamName, curTeamIndex, curTeamKey, curTeamObject, curTeamRef;
	var q1, q2, q3, q4, q5, q6, q7, q8, cmt1, cmt2, cmt3, cmt4, cmt5, cmt6, cmt7, cmt8;
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
		5: false,
		6: false,
		7: false,
		8: false,
	}

	$scope.checkComment = function(num) {
		return commentShowings[num];
	}

	$scope.showComment = function(num) {
		commentShowings[num] = commentShowings[num] === false ? true: false;

		$scope.toggleText[num] = commentShowings[num] ? 'Hide Comment' : 'Add Comment';
	}

	function getData(name) {
		//@TODO: Change this user to the correct one
		var user = $rootScope.user;
		var booly = false;
		for (var team of teamList) {
			if (team.name==$scope.selectedTeam) {
				var teamRef = new Firebase($rootScope.sessionRef+"/teams/"+team.$id);
				if (teamRef.child('reviews')) {
					var reviews = $firebaseArray(teamRef.child('reviews'));
					reviews.$loaded(function() {
						for (var review of reviews) {
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
		$("#q5slider").slider( "option", "value", 0 );
		$("#q6slider").slider( "option", "value", 0 );
		$("#q7slider").slider( "option", "value", 0 );

		$('input[name="q8radio"]').val([null]);

		document.getElementById("q1textarea").value = null;
		document.getElementById("q2textarea").value = null;
		document.getElementById("q3textarea").value = null;
		document.getElementById("q4textarea").value = null;
		document.getElementById("q5textarea").value = null;
		document.getElementById("q6textarea").value = null;
		document.getElementById("q7textarea").value = null;
		document.getElementById("q8textarea").value = null;
	}

	function updateValues(review) {
		$("#q1slider").slider( "option", "value", review.q1 );
		$("#q2slider").slider( "option", "value", review.q2 );
		$("#q3slider").slider( "option", "value", review.q3 );
		$("#q4slider").slider( "option", "value", review.q4 );
		$("#q5slider").slider( "option", "value", review.q5 );
		$("#q6slider").slider( "option", "value", review.q6 );
		$("#q7slider").slider( "option", "value", review.q7 );

		$('input[name="q8radio"]').val([review.q8]);

		document.getElementById("q1textarea").value = review.cmt1;
		document.getElementById("q2textarea").value = review.cmt2;
		document.getElementById("q3textarea").value = review.cmt3;
		document.getElementById("q4textarea").value = review.cmt4;
		document.getElementById("q5textarea").value = review.cmt5;
		document.getElementById("q6textarea").value = review.cmt6;
		document.getElementById("q7textarea").value = review.cmt7;
		document.getElementById("q8textarea").value = review.cmt8;
	}


	var reviewUpdate = function (review, q1, cmt1, q2, cmt2, q3, cmt3, q4, cmt4, q5, cmt5, q6, cmt6, q7, cmt7, q8, cmt8) {
		review.parent().parent().update({
			reviewed: true
		});
		if (q1 != 0) {
			review.update({q1: q1});
		}
		if (q2 != 0) {
			review.update({q2: q2});
		}
		if (q3 != 0) {
			review.update({q3: q3});
		}
		if (q4 != 0) {
			review.update({q4: q4});
		}
		if (q5 != 0) {
			review.update({q5: q5});
		}
		if (q6 != 0) {
			review.update({q6: q6});
		}
		if (q7 != 0) {
			review.update({q7: q7});
		}
		if (q8 != undefined) {
			review.update({q8: q8});
		}
		if (cmt1 != "") {
			review.update({cmt1: cmt1});
		}
		if (cmt2 != "") {
			review.update({cmt2: cmt2});
		}
		if (cmt3 != "") {
			review.update({cmt3: cmt3});
		}
		if (cmt4 != "") {
			review.update({cmt4: cmt4});
		}
		if (cmt5 != "") {
			review.update({cmt5: cmt5});
		}
		if (cmt6 != "") {
			review.update({cmt6: cmt6});
		}
		if (cmt7 != "") {
			review.update({cmt7: cmt7});
		}
		if (cmt8 != "") {
			review.update({cmt8: cmt8});
		}
		if (q1 != 0 && q2 != 0 && q3 != 0 && q4 != 0 && q5 != 0 && q6 != 0 && q7 != 0) {
			var teamavg = (parseFloat(q1) + parseFloat(q2) + parseFloat(q3) + parseFloat(q4) + parseFloat(q5) + parseFloat(q6) + parseFloat(q7))/7.0;
			teamavg = teamavg.toFixed(2);
			review.update({teamavgval: teamavg});
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

	$("#q5slider").slider({
		min: 0,
		step: 1,
		max: 7,
		value: 0
	}).each(function() {
		var opt = $(this).data().uiSlider.options;
		var vals = opt.max - opt.min;
		for (var i = 0; i <= vals; i++) {
			var el = $('<label>' + (i + opt.min) + '</label>').css('left', (i/vals*100) + '%');
			$("#q5slider").append(el);
		}
	});
	
	$("#q6slider").slider({
		min: 0,
		step: 1,
		max: 7,
		value: 0
	}).each(function() {
		var opt = $(this).data().uiSlider.options;
		var vals = opt.max - opt.min;
		for (var i = 0; i <= vals; i++) {
			var el = $('<label>' + (i + opt.min) + '</label>').css('left', (i/vals*100) + '%');
			$("#q6slider").append(el);
		}
	});
	
	$("#q7slider").slider({
		min: 0,
		step: 1,
		max: 7,
		value: 0
	}).each(function() {
		var opt = $(this).data().uiSlider.options;
		var vals = opt.max - opt.min;
		for (var i = 0; i <= vals; i++) {
			var el = $('<label>' + (i + opt.min) + '</label>').css('left', (i/vals*100) + '%');
			$("#q7slider").append(el);
		}
	});

	var calcAvg = function(team) {
		var q1, q2, q3, q4, q5, q6, q7, q8, rank, teamavg;
		var q1sum = 0;
		var q2sum = 0;
		var q3sum = 0;
		var q4sum = 0;
		var q5sum = 0;
		var q6sum = 0;
		var q7sum = 0;
		var q8sum = 0;
		var ranksum = 0;

		var reviewArray = $firebaseArray(team.child('reviews'));

		reviewArray.$loaded().then(function() {
			for (var i = 0; i < reviewArray.length; i++) {
				q1sum += parseFloat(reviewArray[i].q1);
				q2sum += parseFloat(reviewArray[i].q2);
				q3sum += parseFloat(reviewArray[i].q3);
				q4sum += parseFloat(reviewArray[i].q4);
				q5sum += parseFloat(reviewArray[i].q5);
				q6sum += parseFloat(reviewArray[i].q6);
				q7sum += parseFloat(reviewArray[i].q7);
				q8sum += parseFloat(reviewArray[i].q8);
				ranksum += parseFloat(reviewArray[i].rank);
			};

			q1 = q1sum/reviewArray.length;
			q2 = q2sum/reviewArray.length;
			q3 = q3sum/reviewArray.length;
			q4 = q4sum/reviewArray.length;
			q5 = q5sum/reviewArray.length;
			q6 = q6sum/reviewArray.length;
			q7 = q7sum/reviewArray.length;
			q8 = q8sum/reviewArray.length;
			rank = ranksum/reviewArray.length;

			teamavg = (q1 + q2 + q3 + q4 + q5 + q6 + q7)/7.0;

			q1 = q1.toFixed(2);
			q2 = q2.toFixed(2);
			q3 = q3.toFixed(2);
			q4 = q4.toFixed(2);
			q5 = q5.toFixed(2);
			q6 = q6.toFixed(2);
			q7 = q7.toFixed(2);
			q8 = q8.toFixed(2);
			rank = rank.toFixed(2);
			teamavg = teamavg.toFixed(2);

			team.update({
				q1Val: q1,
				q2Val: q2,
				q3Val: q3,
				q4Val: q4,
				q5Val: q5,
				q6Val: q6,
				q7Val: q7,
				q8Val: q8,
				rank: rank,
				ovrAvg: teamavg
			});

			calcOvrAvg(team);

		});

	}

	var calcOvrAvg = function(team) {
		var q1sum = 0;
		var q2sum = 0;
		var q3sum = 0;
		var q4sum = 0;
		var q5sum = 0;
		var q6sum = 0;
		var q7sum = 0;
		var q8sum = 0;
		var ovrsum = 0;

		var q1, q2, q3, q4, q5, q6, q7, q8, ovr;

		var teamsArray = $firebaseArray(team.parent());

		teamsArray.$loaded().then(function() {
			var reviewedCount = 0;

			for (var i = 0; i < teamsArray.length; i++) {
				if (teamsArray[i].q1Val != undefined) {
					q1sum+= parseFloat(teamsArray[i].q1Val);
					q2sum+= parseFloat(teamsArray[i].q2Val);
					q3sum+= parseFloat(teamsArray[i].q3Val);
					q4sum+= parseFloat(teamsArray[i].q4Val);
					q5sum+= parseFloat(teamsArray[i].q5Val);
					q6sum+= parseFloat(teamsArray[i].q6Val);
					q7sum+= parseFloat(teamsArray[i].q7Val);
					q8sum+= parseFloat(teamsArray[i].q8Val);
					ovrsum+= parseFloat(teamsArray[i].ovrAvg);
				}

				if (teamsArray[i].reviewed == true) {
					reviewedCount++;
				}					
			};

			q1 = q1sum/reviewedCount;
			q2 = q2sum/reviewedCount;
			q3 = q3sum/reviewedCount;
			q4 = q4sum/reviewedCount;
			q5 = q5sum/reviewedCount;
			q6 = q6sum/reviewedCount;
			q7 = q7sum/reviewedCount;
			q8 = q8sum/reviewedCount;
			ovr = ovrsum/reviewedCount;

			q1 = q1.toFixed(2);
			q2 = q2.toFixed(2);
			q3 = q3.toFixed(2);
			q4 = q4.toFixed(2);
			q5 = q5.toFixed(2);
			q6 = q6.toFixed(2);
			q7 = q7.toFixed(2);
			q8 = q8.toFixed(2);
			ovr = ovr.toFixed(2);

			team.parent().parent().child("averages").update({
				q1avg: q1,
				q2avg: q2,
				q3avg: q3,
				q4avg: q4,
				q5avg: q5,
				q6avg: q6,
				q7avg: q7,
				q8avg: q8,
				ovrAvg: ovr
			});

		});
	}

	// var calcJudgeAvg = function(team) {
	// 	var q1sum = 0;
	// 	var q2sum = 0;
	// 	var q3sum = 0;
	// 	var q4sum = 0;
	// 	var q5sum = 0;
	// 	var q6sum = 0;
	// 	var q7sum = 0;
	// 	var q8sum = 0;
	// 	var ovrsum = 0;
	// 	var reviewCounter = 0;
	// 	var reviewer;

	// 	var q1, q2, q3, q4, q5, q6, q7, q8, ovr;

	// 	var teamsArray = $firebaseArray(team.parent());
	// 	var reviewArray = $firebaseArray(team.child('reviews'));

	// 	teamsArray.$loaded().then(function() {
	// 		for (var i = 0; i < teamsArray.length; i++) {
	// 			var reviews = $firebaseArray(new Firebase($rootScope.sessionRef+"/teams/"+teamsArray[i].$id+"/reviews"));
	// 			reviews.$loaded().then(function() {
	// 				for (var review of reviews) {
	// 					if (review.user == $rootScope.user) {
	// 						console.log(review);
	// 						q1sum += parseFloat(review.q1);
	// 						q2sum += parseFloat(review.q2);
	// 						q3sum += parseFloat(review.q3);
	// 						q4sum += parseFloat(review.q4);
	// 						q5sum += parseFloat(review.q5);
	// 						q6sum += parseFloat(review.q6);
	// 						q7sum += parseFloat(review.q7);
	// 						q8sum += parseFloat(review.q8);

	// 						console.log("q1: " + q1sum);
	// 						console.log("q2: " + q2sum);
	// 						console.log("q3: " + q3sum);
	// 						console.log("q4: " + q4sum);
	// 						console.log("q5: " + q5sum);
	// 						console.log("q6: " + q6sum);
	// 						console.log("q7: " + q7sum);
	// 						console.log("q8: " + q8sum);

	// 						var ovravg = (review.q1+review.q2+review.q3+review.q4+review.q5+review.q6+review.q7)/7;
	// 						ovrsum += ovravg;
	// 						console.log("ovr: " + ovrsum);

	// 						reviewCounter++;	

	// 						reviewer = review.user;

	// 						var userAvgRef = team.parent().parent().child('averages').child(reviewer);
	// 						userAvgRef.update({reviewCounter: reviewCounter});

	// 					}
	// 				}

	// 			});

	// 			var averagesRef = team.parent().parent().child('averages').child('users');

	// 			var userAvg = averagesRef.child($rootScope.user);

	// 			reviewCounter = userAvg.reviewCounter;
	// 			console.log("is it still 0? " + reviewCounter);

	// 			q1 = q1sum/reviewCounter;
	// 			q2 = q2sum/reviewCounter;
	// 			q3 = q3sum/reviewCounter;
	// 			q4 = q4sum/reviewCounter;
	// 			q5 = q5sum/reviewCounter;
	// 			q6 = q6sum/reviewCounter;
	// 			q7 = q7sum/reviewCounter;
	// 			q8 = q8sum/reviewCounter;
	// 			ovr = ovrsum/reviewCounter;

	// 			q1 = q1.toFixed(2);
	// 			q2 = q2.toFixed(2);
	// 			q3 = q3.toFixed(2);
	// 			q4 = q4.toFixed(2);
	// 			q5 = q5.toFixed(2);
	// 			q6 = q6.toFixed(2);
	// 			q7 = q7.toFixed(2);
	// 			q8 = q8.toFixed(2);
	// 			ovr = ovr.toFixed(2);

	// 			usrAvg.update({
	// 				q1avg: q1,
	// 				q2avg: q2,
	// 				q3avg: q3,
	// 				q4avg: q4,
	// 				q5avg: q5,
	// 				q6avg: q6,
	// 				q7avg: q7,
	// 				q8avg: q8,
	// 				ovravg: ovr
	// 			});

	// 		};

	// 	});

	// }

	var checkZero = function(q1, q2, q3, q4, q5, q6, q7, q8) {
		if (q1 != 0 && q2 != 0 && q3 != 0 && q4 != 0 && q5 != 0 && q6 != 0 && q7 != 0 && q8 != undefined) {
			return false;
		}
		return true;
	}

	var isCmtsBlank= function(cmt1, cmt2, cmt3, cmt4, cmt5, cmt6, cmt7, cmt8) {
		if(cmt1 == "" && cmt2 == "" && cmt3 == "" && cmt4 == "" && cmt5 == "" && cmt6 == "" && cmt7 == "" && cmt8 == ""){
	    	return true;
	    }
	    return false;
	}

	class Evaluation {
	    constructor(user, teamName, q1, cmt1, q2, cmt2, q3, cmt3, q4, cmt4, q5, cmt5, q6, cmt6, q7, cmt7, q8, cmt8) {
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
			this.q6 = q6;
		    this.cmt6 = cmt6;
		    this.q7 = q7;
		    this.cmt7 = cmt7;
		    this.q8 = q8;
		    this.cmt8 = cmt8;
			this.rank = -1;
	    }
	}

	$scope.onSubmit = function() {
		curTeamName = $scope.selectedTeam;

		q1 = $("#q1slider").slider("option", "value");
		q2 = $("#q2slider").slider("option", "value");
		q3 = $("#q3slider").slider("option", "value");
		q4 = $("#q4slider").slider("option", "value");
		q5 = $("#q5slider").slider("option", "value");
		q6 = $("#q6slider").slider("option", "value");
		q7 = $("#q7slider").slider("option", "value");
		q8 = $('input[name="q8radio"]:checked').val();

		cmt1 = document.getElementById("q1textarea").value;
		cmt2 = document.getElementById("q2textarea").value;
		cmt3 = document.getElementById("q3textarea").value;
		cmt4 = document.getElementById("q4textarea").value;
		cmt5 = document.getElementById("q5textarea").value;
		cmt6 = document.getElementById("q6textarea").value;
		cmt7 = document.getElementById("q7textarea").value;
		cmt8 = document.getElementById("q8textarea").value;

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

	    var evaluation = new Evaluation(user, curTeamName, q1, cmt1, q2, cmt2, q3, cmt3, q4, cmt4, q5, cmt5, q6, cmt6, q7, cmt7, q8, cmt8);
	    var submit_alert;


		function redirect() {
			var role = $rootScope.role;
			if (role=="Admin") {
				$location.path('view1')
			}
			else if (role=="Judge") {
				$location.path('judge')
			}
			else if (role=="Team") {
				$location.path('team')
			}
		}
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
		        		reviewUpdate(reviewToEdit, q1, cmt1, q2, cmt2, q3, cmt3, q4, cmt4, q5, cmt5, q6, cmt6, q7, cmt7, q8, cmt8);
		        		calcAvg(team);
						redirect();
		        	}
		        	else {
		        		//check that (no radios) || (all comments) == null
		        		if (checkZero(q1, q2, q3, q4, q5, q6, q7, q8)) { //not all radios completed
		        			//throw an error
				        	$("#slide-text2").slideDown();
		        		}
		        		else if (isCmtsBlank(cmt1, cmt2, cmt3, cmt4, cmt5, cmt6, cmt7, cmt8)) { //no comments
		        			$("#slide-text2").hide();
							submit_alert = confirm("You didn't type in any comments/ Are you sure you want to submit the form?");
		        			if (submit_alert) {
		        				reviews.push(evaluation);
		        				reviews.parent().update({reviewed: true});
				        		calcAvg(team);
		        				redirect();
		        			}
		        		}
		        		else {
		        			reviews.push(evaluation);
			        		calcAvg(team);
		        			redirect();
		        		}
		        	}
	        	});
		    }
	    } //this closes the for
	} //this closes onSubmit
});
