'use strict';
angular
  .module('PitchEvaluator')
  .controller('TeamCtrl', function($rootScope, $scope, permissionsService, $firebaseObject, $firebaseArray, $location, loggedinCheck, teamService, userService, db_url) {

    loggedinCheck.check();

    if (!permissionsService.isPermitted('TeamView')) {
      if ($rootScope.role == 'Admin'){
          $location.path('view1');
      }
      else if ($rootScope.role == 'Judge'){
          $location.path('judge');
      }
      else {
        $location.path('login');
      }
    }

    var ref = new Firebase($rootScope.sessionRef);
    var teamRef = new Firebase($rootScope.sessionRef + "/teams/" + $rootScope.teamID);
    var team = new $firebaseObject(teamRef);

    var reviewRef = new Firebase($rootScope.sessionRef + "/teams/" + $rootScope.teamID + "/reviews");
    $scope.reviews = $firebaseArray(reviewRef);

    $scope.avg = $firebaseArray(ref.child("averages"));

    $scope.cmts1 = [];
    $scope.cmts2 = [];
    $scope.cmts3 = [];
    $scope.cmts4 = [];
    $scope.cmts5 = [];
    $scope.cmts6 = [];
    $scope.cmts7 = [];
    $scope.cmts8 = [];

    $scope.teamAvg = {};
    team.$loaded(function() {
      $rootScope.teamName = team.name;
      $scope.teamAvg.q1 = team.q1Val;
      $scope.teamAvg.q2 = team.q2Val;
      $scope.teamAvg.q3 = team.q3Val;
      $scope.teamAvg.q4 = team.q4Val;
      $scope.teamAvg.q5 = team.q5Val;
      $scope.teamAvg.q6 = team.q6Val;
      $scope.teamAvg.q7 = team.q7Val;
      $scope.teamAvg.q8 = team.q8Val;
      $scope.teamAvg.rank = team.rank;
      $scope.teamAvg.ovrAvg = team.ovrAvg;
    });


    var check = function(str) {
      if (str != "") {
        return true;
      }
      return false;
    }

    $scope.reviews.$loaded(function() {
      $scope.reviews.forEach(function(review) {

        console.log(review.cmt1);
        console.log(check(review.cmt1));

        if (check(review.cmt1)) {
          console.log("pushing");
          $scope.cmts1.push(review.user + ": " + review.cmt1);
          console.log("pushed");
        }

        if (check(review.cmt2)) {
          $scope.cmts2.push(review.user + ": " + review.cmt2);
        }
       
        if (check(review.cmt3)) {
          $scope.cmts3.push(review.user + ": " + review.cmt3);
        } 

        if (check(review.cmt4)) {
          $scope.cmts4.push(review.user + ": " + review.cmt4);
        }

        if (check(review.cmt5)) {
          $scope.cmts5.push(review.user + ": " + review.cmt5);
        }

        if (check(review.cmt6)) {
          $scope.cmts6.push(review.user + ": " + review.cmt6);
        }

        if (check(review.cmt7)) {
          $scope.cmts7.push(review.user + ": " + review.cmt7);
        }

        if (check(review.cmt8)) {
          $scope.cmts8.push(review.user + ": " + review.cmt8);
        }

        var sum = (parseFloat(review.q1) + parseFloat(review.q2) + parseFloat(review.q3) + parseFloat(review.q4) + parseFloat(review.q5) + parseFloat(review.q6) + parseFloat(review.q7));
        review.ovr = sum/7.0;
        review.ovr = (review.ovr).toFixed(2);
 
        if (review.q8 == 1) {
          review.cont = "Yes";
        } else {
          review.cont = "No";
        }

      });
    });
  })
