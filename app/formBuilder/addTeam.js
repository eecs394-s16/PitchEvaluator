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
      }
      parse() {
        var temp = {
          name: this.name,
          product: this.product,
          desc: this.desc
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
