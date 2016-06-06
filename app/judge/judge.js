'use strict';
angular
  .module('PitchEvaluator')
  .controller('JudgeCtrl', function($timeout, $rootScope, $scope, permissionsService, $firebaseObject, $firebaseArray, $location, loggedinCheck, teamService, userService, db_url) {
    $scope.checking = false;
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

    // check what mobile device or pc browser
    

  window.mobileAndTabletcheck = function() {
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))$scope.checking = true})(navigator.userAgent||navigator.vendor||window.opera);
  return $scope.checking;
  console.log($scope.checking);
  }






    function rankings() {
      // console.log('RANKINGSSSS');
      // for (var i=0; i<$scope.reviewedTeams.length; i++) {
      //   console.log(i,'=',$scope.reviewedTeams[i].rank);
      // }
      var count = 0;
      for (var i=0; i<$scope.reviewedTeams.length; i++) {
        if ($scope.reviewedTeams[i].rank!='none') {
          // console.log('Assigned');
          count+=1;
        }
      }
      // console.log('count=', count);
      for (var i=0; i<$scope.reviewedTeams.length; i++) {
        if ($scope.reviewedTeams[i].rank=='none') {
          // console.log('NotAssigned');
          count += 1;
          $scope.reviewedTeams[i].rank = count;
        }
      }
      // console.log('count=', count);
      for (var team of $scope.reviewedTeams) {
        var revRef = (new Firebase($rootScope.sessionRef+"/teams/"+team.teamID+"/reviews/" + team.reviewID));
        revRef.update({rank: team.rank});
      }
    }

    $scope.reviewedTeams = [];
    $scope.notReviewedTeams = [];
    var teamsRef = new Firebase($rootScope.sessionRef+"/teams");
    var averagesRef = teamsRef.parent().child("averages");
    $scope.averagesArray = $firebaseArray(averagesRef);
    var teamList = $firebaseArray(teamsRef);
    var teamsLoadedCount = 0;
    teamList.$loaded(function() {
      //teamList.sort(function(a,b) {return a.rank-b.rank});
      teamList.forEach(function(team, index) {
        var reviews = $firebaseArray(new Firebase($rootScope.sessionRef+"/teams/"+team.$id+"/reviews"));
        var alreadyReviewed = false;
        reviews.$loaded(function() {
          teamsLoadedCount+=1;
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
                avgrank: team.rank,
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
          if (teamsLoadedCount==teamList.length) {
            rankings();
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
        for (var i=start+1; i<=end;i++) {
          $scope.reviewedTeams[i].rank-=1;
        }

        $scope.teamClasses[end] = 'red';
        for (var i=start; i<end;i++) {
          $scope.teamClasses[i] = 'green';
        }
      }
      else {
        // console.log('start>end');
        for (var i=0; i<end;i++) {
          $scope.teamClasses[i] = null;
        }
        for (var i=start+1; i<$scope.reviewedTeams.length;i++) {
          $scope.teamClasses[i] = null;
        }
        $scope.reviewedTeams[start].rank = end+1;
        for (var i=end; i<start;i++) {
          $scope.reviewedTeams[i].rank+=1;
        }

        $scope.teamClasses[end] = 'green';
        for (var i=end+1; i<=start;i++) {
          $scope.teamClasses[i] = 'red';
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
