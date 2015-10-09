angular.module('GroupEffort.controllers')

.controller('FriendsCtrl', function( $rootScope, $scope, $state, Popup, Friends, friends ) {
	
	$scope.newFriendData = {};	
	
	$scope.searchUsers = function() {
				
		var searchTerm = $scope.newFriendData.searchTerm;
		console.info( searchTerm );
		
		Friends.searchUsers( searchTerm ).then( function( result ) {
			
			if ( result.success) {
				console.info( result.data );
				$scope.searchResults = result.data;
				
			} else {
				
				$rootScope.error = result.reason;
				
			}
			
		});
		
	};
	
	$scope.addFriend = function( friend ) {
				
		//var email = $scope.newFriendData.email;
		
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
  
  $scope.friends = {};
	
	$scope.friends.requestSent = [];
	
	$scope.friends.requestReceived = [];
		
	$scope.friends.requestAccepted = [];
	
	$scope.friends.ids = [];
  
  for( var i = 0, x = friends.length; i < x; i++ ) {
		
		$scope.friends.ids.push( parseInt( friends[i]["ID"] ) );
    	
		if ( friends[i].status == "Request Sent" ) {
			
			$scope.friends.requestSent.push( friends[i] );			
			
		} else if ( friends[i].status == "Request Received" ) {
			
			$scope.friends.requestReceived.push( friends[i] );
			
		} else if ( friends[i].status == "Invitation Sent" ) {
			
			$scope.friends.invitationSent.push( friends[i] );
			
		} else if ( friends[i].status == "Request Accepted" ) {
			
			$scope.friends.requestAccepted.push( friends[i] );
			
		}
		
	}	
		  
});