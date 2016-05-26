'use strict';
angular
  .module('PitchEvaluator')
  .controller('loginCtrl', function($location, $rootScope, $scope, $firebaseObject, $firebaseArray, userService, db_url) {
    $scope.loading = false;
    $scope.roles = ['Admin', 'Judge', 'Team'];
    $scope.adminFlag = false;
    $scope.role = null;
    $scope.user = "";
    $scope.pass = "";
    $scope.session = "";
    $scope.warning = false;
    $scope.loadingSessions = true;
    if ($rootScope.loggedin) {
      $location.path('view1');
    }
    var sessRef = new Firebase(db_url + "/sessionList");
    var sessArr = $firebaseArray(sessRef);
    sessArr.$loaded(function(data) {
      // console.log(data);
      $scope.sessionsArr = data;
      $scope.loadingSessions = false;
      // $scope.sessionsArr.$add('newSess');
    });

    $scope.$watch(function(scope) { return scope.role },
        function(newValue, oldValue) {
            if (newValue=='Admin') {
              $scope.adminFlag = true;
            }
            else {
              $scope.adminFlag = false;
            }
        }
     );

    $scope.login = function() {
      // console.log("user:",$scope.user);
      // console.log("pass:",$scope.pass);
      if (!$scope.session) {
        console.log('Please select a session');
        return;
      }

      $scope.loading = true;
      if ($scope.role=='Admin') {
        var passRef = new Firebase(db_url+"/adminpassword");
        var password = new $firebaseObject(passRef);
        password.$loaded(function(data) {
          checkPassword(data.$value);
        });
      }
      else if ($scope.role=='Judge') {
        var sessListRef = new Firebase(db_url+"/sessionList");
        var temp = new $firebaseArray(sessListRef);
        temp.$loaded(function() {
          temp.forEach(function(session) {
            if (session.name==$scope.session) {
              var ref = new Firebase(session.ref+'/judgePass');
              var password = new $firebaseObject(ref);
              password.$loaded(function(data) {
                checkPassword(data.$value);
              });
            }
          });
        });
      }
      else if ($scope.role=='Team') {
        var sessListRef = new Firebase(db_url+"/sessionList");
        var temp = new $firebaseArray(sessListRef);
        temp.$loaded(function() {
          temp.forEach(function(session) {
            if (session.name==$scope.session) {
              var ref = new Firebase(session.ref+'/teams');
              var teams = new $firebaseArray(ref);
              teams.$loaded(function() {
                console.log(teams);
                var booly = false;
                teams.forEach(function(team) {
                  if (booly) return;
                  if (team.name == $scope.user) {
                    checkPassword(team.teamPass);
                    booly = true;
                    return;
                  }
                });

              });
            }
          });
        });
      }

      function checkPassword(password) {
        if ($scope.pass == password) {
          $scope.warning = false;
          userService.set($scope.user);
          $rootScope.user = $scope.user;
          $rootScope.loggedin = true;
          $rootScope.session = $scope.session;
          $rootScope.role = $scope.role;
          var sessListRef = new Firebase(db_url+"/sessionList");
          var temp = new $firebaseArray(sessListRef);
          temp.$loaded(function() {
            temp.forEach(function(session) {
              if (session.name== $scope.session) {
                $rootScope.sessionRef = session.ref;
                console.log($rootScope.sessionRef);
                password = null;
                $scope.loading = false;
                $location.path('view1');
              }
            });
          });
        }
        else {
          $scope.warning = true;
          $scope.loading = false;
        }
      }
    }
})