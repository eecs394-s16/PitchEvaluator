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
	$scope.login_background = null;
	$scope.hideUser = true;


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

	// // TESTING PURPOSES..........
	// $rootScope.user = 'New Team';
	// $rootScope.role = 'Team';
	// $rootScope.session = "Test Session";
	// $rootScope.sessionRef = "https://pitchevaluator.firebaseio.com/sessions/-KIzGu8j1-UDUYTj795B";
	// $rootScope.loggedin = true;
	// $rootScope.teamID = "-KIzGxTmvXpcgrwOl3Q_";
	// userService.set('New Team');
	// // END
    $rootScope.fbconfig = {
    apiKey: "AIzaSyD9XgBYtKYFzKFChf7R8ZT6RU4k4AcoG3s",
    authDomain: "pitchevaluator-e74d8.firebaseapp.com",
    databaseURL: "https://pitchevaluator-e74d8.firebaseio.com",
    storageBucket: "pitchevaluator-e74d8.appspot.com",
    messagingSenderId: "866109741450"
  };
    $rootScope.masterref = firebase.initializeApp($rootScope.fbconfig);


//  firebase.initializeApp(config);
	$rootScope.$watch(function(rootScope) {return rootScope.role},
		function() {
			if ($rootScope.role == 'Admin') {
				$scope.user = $rootScope.user;
				$scope.tabs = [
	      	{ link : '/view1', label : 'Overview' },
	      	{ link : '/addTeam', label : 'Add a Team' },
			{ link : '/newSession', label : 'Create a New Session'},
		    ];
			}
			else if ($rootScope.role == 'Judge') {
				$scope.user = $rootScope.user;
				$scope.tabs = [
	      	{ link : '/judge', label : 'Overview' },
	      	{ link : '/view2', label : 'Review Teams' },
					{ link : '/view1', label : 'Summary' }
		    ];
			}
			else {
				$scope.user = $rootScope.user;
				$scope.tabs = [
					{ link : '/login', label : 'Team Overview' }
				];
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
		$scope.adminFlag = false;
		$location.path('login');
	}


	$rootScope.$on('$locationChangeSuccess', function(event){
	  // console.log($location.path());
		if($location.path() === "/login"){
			$scope.login_background = {
				"background": "rgb(103, 58, 183)"
	    	}
	    	$scope.hideUser = true;
	    }
		if($location.path() != "/login"){
			$scope.login_background = {
				"background": "rgb(251, 247, 255)"
	    	}
	    	$scope.hideUser = false;
		}
	})


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
