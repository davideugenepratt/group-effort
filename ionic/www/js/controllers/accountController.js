angular.module('GroupEffort.controllers')

.controller('AccountCtrl', function( $rootScope, $scope, $state, $ionicLoading, Popup, Authenticate, Account ) {
    
	$scope.changePicture = function() {
	    		
        Account.changePhoto();
		
    };
	
    $scope.updateProfile = function() {
				
		$scope.data.submitted = true;
		
		Account.updateProfile( $scope.data ).then( function( result ) {
						
			if ( result.success ) {
				
				$scope.data.submitted = false;
				
				$state.go( 'tab.account' );
								
			} else {
				
				$rootScope.error = result.data;
				
			}
			
		});
		
	};
    
  $scope.logout = function() {
	  
	  Authenticate.logout().then( function( result ) {
		  
			if ( true == result ) {
				
				$rootScope.loggedIn = false;
				
				$state.go('login');	
				
				$ionicLoading.hide();
				
			} else {
								
			}
			
		});
		
  };
      
  $scope.self = $rootScope.user;
  $scope.self.face += "?" + new Date().getTime();
  $scope.data = $scope.self;
  
  $ionicLoading.hide();
  
});