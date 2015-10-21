angular.module('GroupEffort.controllers')

.controller('FriendsCtrl', function( $rootScope, $scope, $state, Popup, Friends, friends ) {
	
	$scope.newFriendData = {};	
	
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
  
  $scope.friends = friends;
		  
});