'use strict';
angular
  .module('PitchEvaluator')
  .controller('View1Ctrl', function($scope, $firebaseObject, $firebaseArray, $location, teamService) {
  	var teamsRef = new Firebase("https://pitchevaluator.firebaseio.com/teams");
  	$scope.teamList = $firebaseArray(teamsRef);
    $scope.teamList.$loaded(function() {
      console.log('hi');
      $scope.teamList.sort(function(a,b) {return a.rank-b.rank});
    })

<<<<<<< Updated upstream
    $scope.saveTeam = function(teamName) {
      teamService.set(teamName);
      $location.path('view2');
    }


  	$scope.changeRanking = function(id, valueStr) {
      var value = Number(valueStr);
      var index;
      for (let i=0; i<$scope.teamList.length;i++) {
        if ($scope.teamList[i].$id==id) {
          index=i;
=======
 //  	$scope.changeRanking = function(id, valueStr) {
 //      var value = Number(valueStr);
 //      var index;
 //      for (let i=0; i<$scope.teamList.length;i++) {
 //        if ($scope.teamList[i].$id==id) {
 //          index=i;
 //        }
 //        // console.log($scope.teamList[i].name, $scope.teamList[i].rank);
 //      }
 //      if (value>0 && value<=$scope.teamList.length) {
 //        console.log($scope.teamList);

 //        if (index<value-1) {
 //          // console.log("First case");
 //          // console.log("index",index);
 //          // console.log("value",value);
 //          $scope.teamList[index].rank = value;
 //          for (let i=index+1; i<value;i++) {
 //            $scope.teamList[i].rank-=1;
 //          }
 //        }
 //        else {
 //          // console.log("Second case");
 //          // console.log("index",index);
 //          // console.log("value",value);
 //          $scope.teamList[index].rank = value;
 //          for (let i=value-1; i<index;i++) {
 //            $scope.teamList[i].rank+=1;
 //          }
 //        }

 //        for (let i=0; i<$scope.teamList.length;i++) {
 //          $scope.teamList.$save(i);
 //        }
 //        $scope.teamList.sort(function(a,b) {return a.rank-b.rank})
 //        // console.log($scope.teamList);
 //      }
 //      else {
 //        console.log('Invalid rank value');
 //        $scope.teamList[index].rank = index+1;
 //      }
 //    }

	// // var selectedTeam = teamsRef + "/" + teamList[i].$id;
 //    $scope.allowDrop = function(ev) {
 //      ev.preventDefault();
 //    }
 //    $scope.drag = function(ev) {
 //      console.log(ev)
 //      ev.dataTransfer.setData("text", ev.target.id);
 //    }
 //  })


    

    // $scope.teamList.$loaded(function() {

      $scope.dragStart = function(e, ui) {
        ui.item.data('start', ui.item.index());
         console.log(ui.item.index());

      }// create a temporary attribute on the element with old index
      $scope.dragEnd = function(e, ui) {
        var start = ui.item.data('start'),
            end = ui.item.index();//get the new and old index
        
        console.log('start=',start);
        console.log('end=',end);
        for (let i=0; i<$scope.teamList.length;i++) {
          console.log($scope.teamList[i].name, $scope.teamList[i].rank);
>>>>>>> Stashed changes
        }

        if (start<end) {
          // console.log("First case");
          // console.log("start=",start);
          // console.log("end=",end);
          $scope.teamList[start].rank = end+1;
          for (let i=start+1; i<=end;i++) {
            $scope.teamList[i].rank-=1;
          }
        }
        else {
          // console.log("Second case");
          // console.log("index",index);
          // console.log("value",value);
          $scope.teamList[start].rank = end+1;
          for (let i=end; i<start;i++) {
            $scope.teamList[i].rank+=1;
          }
        }

        for (let i=0; i<$scope.teamList.length;i++) {
          $scope.teamList.$save(i);
        }
        $scope.teamList.sort(function(a,b) {return a.rank-b.rank})
        

        for (let i=0; i<$scope.teamList.length;i++) {
          console.log($scope.teamList[i].name, $scope.teamList[i].rank);
        }

      }

      
      $('#sortable').sortable({
        start: $scope.dragStart,
        update: $scope.dragEnd
      });

});


    
    
        
    














