angular
  .module('PitchEvaluator')
  .factory('userService', function() {
   var savedUser = null;
   function set(user) {
     savedUser = user;
   }
   function get() {
    return savedUser;
   }

   return {
    set: set,
    get: get
   }

  });
