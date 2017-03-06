'use strict';
angular
  .module('PitchEvaluator')
  .controller('newSessionCtrl', function($rootScope, $scope, permissionsService, $firebaseObject, $firebaseArray, $location, db_url, loggedinCheck) {

    loggedinCheck.check();
    if (!permissionsService.isPermitted('newSession')) {
      $location.path('view1');
    }

    $scope.name = "";
    $scope.desc = "";
    $scope.judgePass = "";

    class Session {
      constructor(name, desc, judgePass) {
        this.name = name;
        this.desc = desc;
        this.judgePass = judgePass;
      }
    }
    $scope.createSession = function() {


      var refSessions=firebase.database().ref('sessions');
      //var refSessions = new Firebase(db_url + "/sessions");
      var newSession = new Session($scope.name,$scope.desc,$scope.judgePass);
      var refNew = refSessions.push(newSession);
      console.log(refNew.toString());
      var refSessionList=firebase.database().ref('sessionList');
      //var refSessionList = new Firebase(db_url + "/sessionList");
      if(refNew.path.o.length==2) refSessionList.push({name: $scope.name, ref: refNew.path.o[0]+"/"+refNew.path.o[1]});

      $rootScope.session = $scope.name;
      $rootScope.sessionRef = refNew.toString();
      $location.path('view1');

      // console.log($scope.name);
      // console.log($scope.desc);
      // console.log($scope.judgePass);
    }

  });
