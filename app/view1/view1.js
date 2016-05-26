'use strict';
angular
  .module('PitchEvaluator')
  .controller('View1Ctrl', function($rootScope, $scope, $firebaseObject, $firebaseArray, $location, teamService, userService, db_url) {

    // if (!userService.get()) {
  	// 	$rootScope.loggedin = false;
  	// 	$rootScope.user = null;
  	// 	$location.path('login')
  	// }

    var sessListRef = new Firebase(db_url+"/sessionList");
    var temp = new $firebaseArray(sessListRef);
    temp.$loaded(function() {
      temp.forEach(function(session) {
        if (session.name==$rootScope.session) {
          $scope.teamList = $firebaseArray(new Firebase(session.ref+"/teams"));
          $scope.teamList.$loaded(function() {
            $scope.teamList.sort(function(a,b) {return a.rank-b.rank});
          })
        }
      });
    });

  	// $scope.teamList = $firebaseArray(teamsRef);
    // $scope.teamList.$loaded(function() {
    //   $scope.teamList.sort(function(a,b) {return a.rank-b.rank});
    // })


    //Function to store the team in the teamService
    $scope.saveTeam = function(teamName) {
      teamService.set(teamName);
      $location.path('view2');
    }

    $scope.setSelectedTab = function(tab) {
      $location.path(tab);
    }

    $scope.dragStart = function(e, ui) {
      ui.item.data('start', ui.item.index());
       console.log(ui.item.index());

    }// create a temporary attribute on the element with old index
    $scope.dragEnd = function(e, ui) {
      var start = ui.item.data('start'),
          end = ui.item.index();//get the new and old index

      if (start<end) {
        $scope.teamList[start].rank = end+1;
        for (let i=start+1; i<=end;i++) {
          $scope.teamList[i].rank-=1;
        }
      }
      else {
        $scope.teamList[start].rank = end+1;
        for (let i=end; i<start;i++) {
          $scope.teamList[i].rank+=1;
        }
      }
      for (let i=0; i<$scope.teamList.length;i++) {
        $scope.teamList.$save(i);
      }
      $scope.teamList.sort(function(a,b) {return a.rank-b.rank})
      // for (let i=0; i<$scope.teamList.length;i++) {
      //   console.log($scope.teamList[i].name, $scope.teamList[i].rank);
      // }
    }

    $('#sortable').sortable({
      start: $scope.dragStart,
      update: $scope.dragEnd
    });

});
