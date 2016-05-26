'use strict';
angular
  .module('PitchEvaluator')
  .controller('addTeamCtrl', function($rootScope, $scope, $firebaseObject, $firebaseArray, $location, db_url) {
    // var ref = new Firebase("https://pitchevaluator.firebaseio.com/team");
    $scope.name = "";
    $scope.product = "";
    $scope.desc = "";
    $scope.teamPass = ""
    $scope.warning = true;

    class Team {
      constructor(name,product,desc, teamPass) {
        this.name=name;
        this.product=product;
        this.desc=desc;
        this.teamPass = teamPass;
        this.avg1 = 0;
        this.avg2 = 0;
        this.avg3 = 0;
        this.avg4 = 0;
        this.avgYes = 0;
        this.ovrAvg = 0;
        this.rank = 0;
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

      if (!$rootScope.session) {
        $scope.warning = true;
        document.querySelector("#warning").innerHTML = "*Invalid or No Session";
        throw new Error('Invalid or No Session');
        // return;
      }
      var newTeam = new Team($scope.name,$scope.product,$scope.desc, $scope.teamPass);
      var ref = new Firebase($rootScope.sessionRef);
      ref.once("value", function(snapshot) {
        var count = snapshot.child("teams").numChildren();
        newTeam.rank = count+1;
        var refTeams = new Firebase($rootScope.sessionRef + "/teams")
        var teams = new $firebaseArray(refTeams);
        teams.$loaded(function() {
          var exists = false;
          teams.forEach(function(team) {
            if (exists) return;
            if (team.name==$scope.name) {
              exists = true;
              return;
            }
          });
          if (exists) {
            document.querySelector("#warning").innerHTML = "*Team already exists";
            throw new Error('Team already exists');
            // return;
          }
          else {
            $scope.warning = false;
            ref.child('teams').push(newTeam);
            $location.path('#/view1');
          }
        });
      });



      // var ref = new Firebase(db_url + "/sessions");
      // var sessArr = new $firebaseArray(ref);

      // sessArr.$loaded(function() {
      //   sessArr.forEach(function(session) {
      //     if (session.name == $rootScope.session) {
      //       var newTeam = new Team($scope.name,$scope.product,$scope.desc);
      //
      //       var key = sessArr.$keyAt(session);
      //       var specificSession = new Firebase(ref + "/" + key);
      //       specificSession.child('teams').push(newTeam);
      //       $location.path('#/view1');
      //     }
      //   });
      // });

      // console.log($scope.name);
      // console.log($scope.product);
      // console.log($scope.desc);
      // $location.path('#/view1');
    }

  });
