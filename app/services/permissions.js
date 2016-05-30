angular
  .module('PitchEvaluator')
  .factory('permissionsService', function($rootScope) {
    function isPermitted(action) {
      if ($rootScope.role == 'Admin') {
        if (action=='Review') return false;
        else return true;
      }
      else if ($rootScope.role == 'Judge') {
        if (action=='JudgeView' || action=='Review' || action=="TeamView") {
          return true;
        }
        else return false;
      }
      else if ($rootScope.role == 'Team') {
        if (action=='TeamView') return true;
      }
      else return false;
    }

    return {
      isPermitted: isPermitted
    }
  });
