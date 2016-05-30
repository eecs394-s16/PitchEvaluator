'use strict';
angular
  .module('PitchEvaluator')
  .controller('JudgeCtrl', function($rootScope, $scope, permissionsService, $firebaseObject, $firebaseArray, $location, loggedinCheck, teamService, userService, db_url) {

    loggedinCheck.check();

    if (!permissionsService.isPermitted('JudgeView')) {
      if ($rootScope.role == 'Team'){
          $location.path('team');
      }
    }

    $scope.saveTeam = function(teamName) {
      teamService.set(teamName);
      $location.path('view2');
    }

    $scope.reviewedTeams = [];
    $scope.notReviewedTeams = [];
    var teamsRef = new Firebase($rootScope.sessionRef+"/teams");
    var teamList = $firebaseArray(teamsRef);
    teamList.$loaded(function() {
      //teamList.sort(function(a,b) {return a.rank-b.rank});
      teamList.forEach(function(team) {
        var reviews = $firebaseArray(new Firebase($rootScope.sessionRef+"/teams/"+team.$id+"/reviews"));
        var alreadyReviewed = false;
        reviews.$loaded(function() {
          for (var review of reviews) {
            if (review.user==$rootScope.user) {
              alreadyReviewed = true;
              var temp = {
                name: team.name,
                q1Val: review.q1,
                q2Val: review.q2,
                q3Val: review.q3,
                q4Val: review.q4,
                ovrAvg: team.ovrAvg
              }
              $scope.reviewedTeams.push(temp);
              break;
            }
          }
          if (!alreadyReviewed) {
            $scope.notReviewedTeams.push(team);
          }
        })

      });


    }) //end teamList.$loaded

  })
