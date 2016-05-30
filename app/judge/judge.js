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

    function rankings(teams) {
      var count = 0;
      for (var i=0; i<teams.length; i++) {
        if (teams[i].rank!=-1) {
          count+=1;
        }
      }
      for (var i=0; i<teams.length; i++) {
        if (teams[i].rank==-1) {
          count += 1;
          teams[i].rank = count;
        }
      }
    }
    $scope.reviewedTeams = [];
    $scope.notReviewedTeams = [];
    var teamsRef = new Firebase($rootScope.sessionRef+"/teams");
    var averagesRef = teamsRef.parent().child("averages");
    $scope.averagesArray = $firebaseArray(averagesRef);
    var teamList = $firebaseArray(teamsRef);
    teamList.$loaded(function() {
      //teamList.sort(function(a,b) {return a.rank-b.rank});
      teamList.forEach(function(team) {
        //console.log(team);
        var reviews = $firebaseArray(new Firebase($rootScope.sessionRef+"/teams/"+team.$id+"/reviews"));
        var alreadyReviewed = false;
        reviews.$loaded(function() {
          for (var review of reviews) {
            if (review.user==$rootScope.user) {
              alreadyReviewed = true;
              var temp = {
                teamID: team.$id,
                reviewID: review.$id,
                name: team.name,
                q1Val: review.q1,
                q2Val: review.q2,
                q3Val: review.q3,
                q4Val: review.q4,
                rank: review.rank,
                ovrAvg: team.ovrAvg
              }
              $scope.reviewedTeams.push(temp);
              rankings($scope.reviewedTeams);
              $scope.reviewedTeams.sort(function(a,b) {return a.rank-b.rank});
              break;
            }
          }
          if (!alreadyReviewed) {
            $scope.notReviewedTeams.push(team);
          }
        })

      });


    }) //end teamList.$loaded



    $scope.dragStart = function(e, ui) {
      ui.item.data('start', ui.item.index());
       //console.log(ui.item.index());

    }// create a temporary attribute on the element with old index
    $scope.dragEnd = function(e, ui) {
      var start = ui.item.data('start'),
          end = ui.item.index();//get the new and old index

      if (start<end) {
        $scope.reviewedTeams[start].rank = end+1;
        for (let i=start+1; i<=end;i++) {
          $scope.reviewedTeams[i].rank-=1;
        }
      }
      else {
        $scope.reviewedTeams[start].rank = end+1;
        for (let i=end; i<start;i++) {
          $scope.reviewedTeams[i].rank+=1;
        }
      }

      // for (let i=0; i<$scope.reviewedTeams.length;i++) {
      //   console.log($scope.reviewedTeams[i].name, $scope.reviewedTeams[i].rank);
      // }
      // console.log($scope.reviewedTeams);
      for (let team of $scope.reviewedTeams) {
        var teamref = (new Firebase($rootScope.sessionRef+"/teams/"+team.teamID+"/reviews/" + team.reviewID));
        teamref.update({rank: team.rank});
      }

      $scope.reviewedTeams.sort(function(a,b) {return a.rank-b.rank})
      // for (let i=0; i<$scope.reviewedTeams.length;i++) {
      //   console.log($scope.reviewedTeams[i].name, $scope.reviewedTeams[i].rank);
      // }
    }

    $('#sortable').sortable({
      start: $scope.dragStart,
      update: $scope.dragEnd
    });

  })
