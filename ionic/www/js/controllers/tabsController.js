angular.module('GroupEffort.controllers')

.controller('TabsCtrl', function( $rootScope, $scope, $state, $stateParams, $location, $ionicPopup, $ionicLoading, $ionicSlideBoxDelegate, Authenticate, Account, Efforts, Friends, loggedIn, efforts, friends ) {		
	  
	if ( !loggedIn ) {
		
		$state.go( 'login' );
			
	}
  
  $ionicLoading.hide();  	
	
  $scope.slideTo = function( index ) {
        
    $ionicSlideBoxDelegate.slide( index );
                
    $scope.newFriendData = {};
      
  }    
  
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
  
  $scope.currentSlide = $stateParams.tabId;
  
  $scope.efforts = efforts;
	
  
  
  $scope.friends = friends;      	
  
  $scope.newFriendData = {};
  
  $scope.data = {};
  
  $scope.data.efforts = {};
    
	$scope.data.self = $rootScope.user;
	
  $scope.goToEffort = function( id ) {
	
		$state.go( 'effort-detail' , { 'effortId' : id } );	
	
	};
  
	$scope.addEffort = function() {
		    
		$scope.data.efforts.submitted = true;
    
    
    
    $scope.efforts.push( $scope.data.efforts );
    
    console.info( $scope.efforts );
    
    var title = $scope.data.efforts.title;
    
    $scope.data.efforts.title = "";

		Efforts.addEffort( title , $scope.data.friends ).then( function( result ) {
			
      $scope.data.efforts.submitted = false;
      
      $scope.efforts = result.data;
      			
		});
		
	};
  
  $scope.updateProfile = function() {
		
    console.info( "Updating Profile Now" );
    				
		Account.updateProfile( $scope.data.self ).then( function( result ) {
						
			if ( result.success ) {
								
								
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
	
	$scope.searchUsers = function() {   
    		
		var searchTerm = $scope.newFriendData.searchTerm;

		Friends.searchUsers( searchTerm ).then( function( result ) {
			
			if ( result.success) {
         				
        $scope.searchResults = result.data;
				
			} else {
				
				$rootScope.error = result.reason;
				
			}
			
		});
		
	};
	
	$scope.addFriend = function( friend ) {
						
		Friends.addFriend( friend.email ).then( function( result ) {
			
			if ( result.success) {								
				
				$scope.friends.ids.push( friend.id );
				$scope.friends.requestSent.push( friend )
								
			} else {
				
				$rootScope.error = result.reason;
				
			}
			
		});
		
	};
	
	$scope.acceptRequest = function( index , friend ) {
		
		$scope.data = { submitted: true };
		
		Friends.acceptRequest( friend.email ).then( function( result ) {						
			
      $scope.data = { submitted: false };
      				
      $scope.friends.requestReceived.splice( index , 1 );	
      
      $scope.friends.requestAccepted.push( friend );	
										
		});
		
	};
	
	$scope.denyRequest = function( index , friend ) {
		
		$scope.data = { submitted: true };
				
		Friends.denyRequest( friend.email ).then( function( result ) {
										
      $scope.friends.requestReceived.splice( index , 1 );	          
      
    });
		
	};
					
	$scope.removeFriend = function( index , email ) {
		
		$scope.data = { submitted: true };
				
    Friends.denyRequest( email ).then( function( response ) {
                
      $scope.friends.requestAccepted.splice( index , 1 );				
      
    });
		
	};
	
  
});
