angular.module('GroupEffort.controllers')

.controller('AuthenticateCtrl', function( $rootScope, $scope, $state, Authenticate ) {
	
	$rootScope.tabs = false;
		
	if ( $rootScope.loggedIn ) {
		
		$state.go( 'tab.efforts' );
		
		$rootScope.tabs = true;
			
	}
		
	$scope.data = {};
	
	$scope.data.submitted = false;
	
	$scope.login = function() {
		
		$scope.data.submitted = true;
				
		var username = $scope.data.username;
		
    	var password = $scope.data.password;
				
		Authenticate.login( username, password ).then( function(result ) {
			
			if ( result ) {
				
				$rootScope.loggedIn = true;								
				
				$state.go( 'tabs' , { 'tabId' : 0 } );
				
				$rootScope.tabs = true;
								
			} else {
				
				$rootScope.loggedIn = false;
				
				$scope.data.submitted = false;
								
			}
			
		});
		
	};
	
	$scope.goToLogin = function() {

		$state.go( 'login' );	
	
	};
	
	$rootScope.tabs = false;
	
	$scope.data = {};
	
	$scope.data.submitted = false;
	
	$scope.register = function() {
		$scope.data.submitted = true;
		var email = $scope.data.email;
		var phone = $scope.data.phone;
		var username = $scope.data.username;
    	var password = $scope.data.password;
		Authenticate.register( email, username , password ).then( function( result ) {			
			if ( result ) {
				$rootScope.loggedIn = true;
				$rootScope.user = result;
				$state.go('tab.account');	
			} else {
				$rootScope.loggedIn = false;
				$scope.data.submitted = false;
			}
		});		
	};
});