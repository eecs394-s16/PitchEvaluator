'use strict';
angular
.module('PitchEvaluator')
.controller('indexCtrl', function($rootScope, $scope, $location, userService, loggedinCheck, permissionsService) {

	// loggedinCheck.check();
	userService.set(null);
	$rootScope.user = null;
	$rootScope.loggedin = false;
	$rootScope.session = null;
	$rootScope.role = null;
	$rootScope.sessionRef = null;

	// // TESTING PURPOSES..........
	// $rootScope.user = 'Admin';
	// $rootScope.role = 'Admin';
	// $rootScope.session = "Test Session";
	// $rootScope.sessionRef = "https://pitchevaluator.firebaseio.com/sessions/-KIdcRUghsu2TwybVf5L";
	// $rootScope.loggedin = true;
	// userService.set('Admin');
	// // END

	// // TESTING PURPOSES..........
	// $rootScope.user = 'Me';
	// $rootScope.role = 'Judge';
	// $rootScope.session = "Test Session";
	// $rootScope.sessionRef = "https://pitchevaluator.firebaseio.com/sessions/-KIzGu8j1-UDUYTj795B";
	// $rootScope.loggedin = true;
	// userService.set('Me');
	// // END

	$rootScope.$watch(function(rootScope) {return rootScope.role},
		function() {
			if ($rootScope.role == 'Admin') {
				$scope.tabs = [
			      { link : '/view1', label : 'Overview' },
			      { link : '/view2', label : 'Review' },
			      { link : '/addTeam', label : 'Add Team' },
						{ link : '/newSession', label : 'Create Session'},
			    ];
			}
			else if ($rootScope.role == 'Judge') {
				$scope.tabs = [
			      { link : '/judge', label : 'Overview' },
			      { link : '/view2', label : 'Review Teams' },
						{ link : '/view1', label : 'Summary' }
			    ];
			}
			else {
				$scope.tabs = [{ link : '/login', label : 'TemViewNotImplemented' }];
			}
		});

	$scope.adminFlag = false;

	$scope.logOut = function() {
		userService.set(null);
		$rootScope.user = null;
		$rootScope.loggedin = false;
		$rootScope.session = null;
		$rootScope.role = null;
		$rootScope.sessionRef = null;
		$location.path('login');
	}

  	$scope.isActive = function(route) {
        return route === $location.path();
    };

    $scope.onLogin = function() {
    	if ($location.path() == "/login") {
    		return true;
    	}
    	return false;
    }

    $scope.$watch(function(scope) { return scope.role },
        function(newValue, oldValue) {
            if (newValue=='Admin') {
              $scope.adminFlag = true;
              $scope.user = 'Admin';
            }
            else {
              $scope.adminFlag = false;
            }
        }
     );

 });
