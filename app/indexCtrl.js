'use strict';
angular
.module('PitchEvaluator')
.controller('indexCtrl', function($rootScope, $scope, $location, userService, loggedinCheck) {

	// loggedinCheck.check();

	// // TESTING PURPOSES..........
	// $rootScope.user = 'Admin';
	// $rootScope.role = 'Admin';
	// $rootScope.session = "Test Session";
	// $rootScope.sessionRef = "https://pitchevaluator.firebaseio.com/sessions/-KIdcRUghsu2TwybVf5L";
	// $rootScope.loggedin = true;
	// userService.set('Admin');
	// // END

	$scope.logOut = function() {
		userService.set(null);
		$rootScope.user = null;
		$rootScope.loggedin = false;
		$rootScope.session = null;
		$rootScope.role = null;
		$rootScope.sessionRef = null;
		$location.path('login');
	}

	$scope.tabs = [
      { link : '/view1', label : 'Overview' },
      { link : '/view2', label : 'Review' },
      { link : '/addTeam', label : 'Add Team' },
      // { link : '/judgeInfo', label : 'judgeInfo' },
      // { link : '/judgeLogin', label : 'judgeLogin' },
      // { link : '/profLogin', label : 'profLogin' },
      // { link : '/teamLogin', label : 'teamLogin' },
      // { link : '/teamSummary', label : 'teamSummary' },
			{ link : '/newSession', label : 'Create Session'},
			// { link : '/login', label : 'Login' }
    ];

  $scope.isActive = function(route) {
        return route === $location.path();
    };

	// $scope.isLogged = function(label) {
	// 	if (label=="Login") {
	// 		if ($rootScope.loggedin) return false;
	// 		else return true;
	// 	}
	// 	else {
	// 		return true;
	// 	}
	// }

	// if (!userService.get()) {
	// 	$rootScope.loggedin = false;
	// 	$rootScope.user = null;
	// 	$location.path('login')
	// }
	// else (
	// 	$rootScope.loggedin = true;
	// )

 });
