'use strict';

angular
  .module('PitchEvaluator')
  .controller('addTeamCtrl', function($scope, $firebaseObject, $firebaseArray, $location) {
    // var ref = new Firebase("https://pitchevaluator.firebaseio.com/team");
    $scope.name = "";
    $scope.product = "";
    $scope.desc = "";

    class Team {
      constructor(name,product,desc) {
        this.name=name;
        this.product=product;
        this.desc=desc;
        this.avg1 = 0;
        this.avg2 = 0;
        this.avg3 = 0;
        this.avg4 = 0;
        this.avgYes = 0;
        this.ovrAvg = 0;
      }
      parse() {
        var temp = {
          name: this.name,
          product: this.product,
          desc: this.desc,
          avg1: this.avg1,
          avg2: this.avg2,
          avg3: this.avg3,
          avg4: this.avg4,
          avgYes: this.avgYes,
          ovrAvg: this.ovrAvg
        }
        return temp;
      }
    }
    $scope.addTeam = function() {
      
      var teamsRef = new Firebase("https://pitchevaluator.firebaseio.com/teams");
      var newTeam = new Team($scope.name,$scope.product,$scope.desc);

      teamsRef.push(newTeam);


      console.log($scope.name);
      console.log($scope.product);
      console.log($scope.desc);
      $location.path('#/view1');
    }

  });
