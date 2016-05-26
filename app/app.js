'use strict';

angular
  .module('PitchEvaluator', ['ngRoute', 'firebase'])
  .constant('db_url', "https://pitchevaluator.firebaseio.com/")
  .config(function($routeProvider) {
    $routeProvider
      .when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl',
        css: 'view1/view1.css'
      })
      .when('/view2', {
        templateUrl: 'view2/view2.html',
        controller: 'View2Ctrl',
        css : 'view2/view2.css'
      })
      .when('/addTeam', {
        templateUrl: 'addTeam/addTeam.html',
        controller: 'addTeamCtrl',
        css: 'addTeam.css'
      })
      .when('/judgeInfo', {
        templateUrl: 'judgeInfo/judgeInfo.html',
        controller: 'judgeInfoCtrl',
        css: 'judgeInfo.css'
      })
      .when('/judgeLogin', {
        templateUrl: 'judgeLogin/judgeLogin.html',
        controller: 'judgeLoginCtrl',
        css: 'judgeLogin.css'
      })
      .when('/profLogin', {
        templateUrl: 'profLogin/profLogin.html',
        controller: 'profLoginCtrl',
        css: 'profLogin.css'
      })
      .when('/teamLogin', {
        templateUrl: 'teamLogin/teamLogin.html',
        controller: 'teamLoginCtrl',
        css: 'teamLogin.css'
      })
      .when('/teamSummary', {
        templateUrl: 'teamSummary/teamSummary.html',
        controller: 'teamSummaryCtrl',
        css: 'teamSummary.css'
      })
      .when('/login', {
        templateUrl: 'login/login.html',
        controller: 'loginCtrl',
        css: 'login.css'
      })
      .when('/newSession', {
        templateUrl: 'newSession/newSession.html',
        controller: 'newSessionCtrl',
        css: 'newSession.css'
      })
      .otherwise({
        redirectTo: 'view1'
      });
  });
