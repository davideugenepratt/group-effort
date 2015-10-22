angular.module('GroupEffort.controllers')

.controller('TabCtrl', function( $rootScope, $scope, $state, $ionicPopup, $ionicHistory, $ionicLoading, Authenticate, loggedIn ) {		
	
	if ( !loggedIn ) {
		
		$state.go( 'login' );
			
	}
	
  
  
	$scope.goForward = function () {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1) {
            $ionicTabsDelegate.select(selected + 1);
        }
    }

    $scope.goBack = function () {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1 && selected != 0) {
            $ionicTabsDelegate.select(selected - 1);
        }
    }		
	
	$scope.goToEfforts = function() {
	
		$state.go( 'tab.efforts' );
			
	};
	
	$scope.goToEffort = function( id ) {
	
		$state.go( 'effort-detail' , { 'effortId' : id } );	
	
	};
	
	$scope.goToFriends = function() {
	
		$state.go( 'tab.friends' );	
	
	};
	
	$scope.goToFriend = function( id ) {
	
		$state.go( 'tab.friends-detail' , { 'friendID' : id } );	
	
	};
	
	$scope.goToAccount = function() {
	
		$state.go( 'tab.account' );	
	
	};
	
	$rootScope.tabs = true;		
	
	// This will show a loading screen while a request is made
	$rootScope.$on('loading:show', function () {
		$ionicLoading.show({
			templateUrl: 'templates/loading.html',
			delay: 300
		})
	});

	$rootScope.$on('loading:hide', function () {
		$ionicLoading.hide();
	});
	
	$rootScope.$on('$stateChangeStart', function () {
		$rootScope.$broadcast('loading:show');
	});
	
	$rootScope.$on('$stateChangeSuccess', function () {
		$rootScope.$broadcast('loading:hide');
	});
	
});
