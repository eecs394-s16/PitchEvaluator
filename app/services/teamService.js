angular
  .module('PitchEvaluator')
  .factory('teamService', function() {
   var savedTeam = null;
   function set(team) {
     savedTeam = team;
   }
   function get() {
    return savedTeam;
   }

   return {
    set: set,
    get: get
   }

  });
