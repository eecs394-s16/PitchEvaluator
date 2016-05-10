'use strict';
angular
  .module('PitchEvaluator')
  .controller('addTeamCtrl', function($scope, $firebaseObject, $firebaseArray, $location) {
  	var ref = new Firebase("https://pitchevaluator.firebaseio.com/");
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
        return temp
      }
    }
    $scope.addTeam = function() {
      var teamsRef = new Firebase("https://pitchevaluator.firebaseio.com/teams");
      // var newTeam = new Team($scope.name,$scope.product,$scope.desc);

      // $firebaseArray(teamsRef).$add(newTeam.parse())
      // teamsRef.child($scope.name).set()
      var team = teamsRef.child($scope.name);
      team.child('name').set($scope.name);
      team.child('product').set($scope.product);
      team.child('desc').set($scope.desc);
      console.log($scope.name);
      console.log($scope.product);
      console.log($scope.desc);
      $location.path('#/view1');
    }

  })
