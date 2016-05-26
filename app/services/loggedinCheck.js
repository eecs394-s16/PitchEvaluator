"use strict";
angular
  .module('PitchEvaluator')
  .factory('loggedinCheck', function($rootScope, userService, $location) {
    function check() {
      if (!userService.get()) {
        console.log('wth');
        $rootScope.loggedin = false;
        $rootScope.user = null;
        $location.path('login')
      }
    }
    return {
      check: check
    }

  })
