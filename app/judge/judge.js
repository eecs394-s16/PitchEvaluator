'use strict';
angular
  .module('PitchEvaluator')
  .controller('JudgeCtrl', function($timeout, $rootScope, $scope, permissionsService, $firebaseObject, $firebaseArray, $location, loggedinCheck, teamService, userService, db_url) {

    loggedinCheck.check();

    if (!permissionsService.isPermitted('JudgeView')) {
      if ($rootScope.role == 'Team'){
          $location.path('team');
      }
    }

    $scope.teamClasses = [];
    $scope.saveTeam = function(teamName) {
      teamService.set(teamName);
      $location.path('view2');
    }

    function rankings() {
      var count = 0;
      for (var i=0; i<$scope.reviewedTeams.length; i++) {
        if ($scope.reviewedTeams[i].rank!=-1) {
          count+=1;
        }
      }
      for (var i=0; i<$scope.reviewedTeams.length; i++) {
        if ($scope.reviewedTeams[i].rank==-1) {
          count += 1;
          $scope.reviewedTeams[i].rank = count;
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
      teamList.forEach(function(team, index) {
        var reviews = $firebaseArray(new Firebase($rootScope.sessionRef+"/teams/"+team.$id+"/reviews"));
        var alreadyReviewed = false;
        reviews.$loaded(function() {
          for (var review of reviews) {
            if (review.user==$rootScope.user) {
              alreadyReviewed = true;
              var cont;
              if (review.q8 == 0) {
                cont = "No";
              } else {
                cont = "Yes";
              }
              var temp = {
                teamID: team.$id,
                reviewID: review.$id,
                name: team.name,
                q1Val: review.q1,
                q2Val: review.q2,
                q3Val: review.q3,
                q4Val: review.q4,
                q5Val: review.q5,
                q6Val: review.q6,
                q7Val: review.q7,
                cont: cont,
                rank: review.rank,
                ovrAvg: team.ovrAvg
              }
              $scope.reviewedTeams.push(temp);
              $scope.teamClasses.push(null);
              break;
            }
          }
          if (!alreadyReviewed) {
            $scope.notReviewedTeams.push(team);
          }
          rankings();
          if (index==($scope.reviewedTeams.length-1)) {
            $scope.reviewedTeams.sort(function(a,b) {return a.rank-b.rank});
          }
        });

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
        for (var i=0; i<start;i++) {
          $scope.teamClasses[i] = null;
        }
        for (var i=end+1; i<$scope.reviewedTeams.length;i++) {
          $scope.teamClasses[i] = null;
        }

        $scope.reviewedTeams[start].rank = end+1;
        $scope.teamClasses[start] = 'green';
        for (var i=start+1; i<=end;i++) {
          $scope.reviewedTeams[i].rank-=1;
          $scope.teamClasses[i] = 'red';
        }
      }
      else {
        for (var i=0; i<end;i++) {
          $scope.teamClasses[i] = null;
        }
        for (var i=start+1; i<$scope.reviewedTeams.length;i++) {
          $scope.teamClasses[i] = null;
        }
        $scope.reviewedTeams[start].rank = end+1;
        $scope.teamClasses[start] = 'red';
        for (var i=end; i<start;i++) {
          $scope.reviewedTeams[i].rank+=1;
          $scope.teamClasses[i] = 'green';
        }
      }


      // for (var i=0; i<$scope.reviewedTeams.length;i++) {
      //   console.log($scope.reviewedTeams[i].name, $scope.reviewedTeams[i].rank);
      // }
      // console.log($scope.reviewedTeams);
      for (var team of $scope.reviewedTeams) {
        var revRef = (new Firebase($rootScope.sessionRef+"/teams/"+team.teamID+"/reviews/" + team.reviewID));
        revRef.update({rank: team.rank});
        
        var team = new Firebase($rootScope.sessionRef+"/teams/"+team.teamID);
        calcAvgRank(team);      
      }

      $scope.reviewedTeams.sort(function(a,b) {return a.rank-b.rank})
      $timeout(function() {
        for (var i=0; i<$scope.teamClasses.length;i++) {
          $scope.teamClasses[i] = null;
        }
      }, 2500);
      // for (var i=0; i<$scope.reviewedTeams.length;i++) {
      //   console.log($scope.reviewedTeams[i].name, $scope.reviewedTeams[i].rank);
      // }
    }

    $('#sortable').sortable({
      start: $scope.dragStart,
      update: $scope.dragEnd
    });

    var calcAvgRank = function(team) {
      var rank;
      var ranksum = 0;

      var reviewArray = $firebaseArray(team.child("reviews"));

      reviewArray.$loaded().then(function() {
        console.log(reviewArray);
        for (var i = 0; i < reviewArray.length; i++) {
          ranksum += parseFloat(reviewArray[i].rank);
        }

        console.log(ranksum);

        rank = ranksum/reviewArray.length;
        rank = rank.toFixed(2);

        team.update({
          rank: rank
        })

      });

    }

  })
