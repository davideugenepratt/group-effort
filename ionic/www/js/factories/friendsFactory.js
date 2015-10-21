angular.module('GroupEffort.factories')


/**  
  * @desc this factory holds functions for adding and manipulating friends
  * Authenticate.authenticate(); Authenticate.authenticate.check(); Authenticate.authenticate();
  * @author David Eugene Pratt - david@davideugenepratt.com
*/  

.factory('Friends', function( $rootScope, $http, $state, Popup ) {
	
  /** 
  * @desc Sends a friend request to the specified email address
  * @params var email (string) - The email of the eprson to send to.
  * @return bool - returns true or false as well as sets $rootScope.loggedIn and $rootScope.user
  */
	
  var addFriend = function( email ) {
	  
	  return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=add_friend&" +
												"email=" + encodeURIComponent( email ) )
												
		.then( function( response ) {
			
			return response.data;		
				
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;	
			
		});
			
  };
  
  /** 
  * @desc Accepts an awaiting request from a user
  * @params var email (string) - The email of the person of whos request to accept.
  */  
  
  var acceptRequest = function( email ) {
	  
	  return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=accept_request&" +
													"email=" + encodeURIComponent( email ) )
													
		.then( function( response ) {
			
			return response.data;		
				
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;
				
		});
	  
  };
  
  /** 
  * @desc Denys an awaiting request from a user or removes them from the existing list.
  * @params var email (string) - The email of the person to remove.
  * @return bool - returns the response from the server.
  */ 
  
  var denyRequest = function( email ) {
	  
	  return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=remove_friend&" +
													"email=" + encodeURIComponent( email ) )
													
		.then( function( response ) {
			
			return response.data;	
					
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;	
			
		});
	  
  };
	
  /** 
  * @desc Provides a list of all the current users friends.
  * @return (object) of all the current users friends.
  */ 	
	
	var allFriends = function() {	
	  
    var sortFriends = function( friends ) {
      
      newFriends = {};
      
      newFriends.friends = friends;
      
      newFriends.requestSent = [];
      
      newFriends.requestReceived = [];
        
      newFriends.requestAccepted = [];
      
      newFriends.ids = [];
      
      for( var i = 0, x = friends.length; i < x; i++ ) {
                
        newFriends.ids.push( parseInt( friends[i]["ID"] ) );
          
        if ( friends[i].status == "Request Sent" ) {
          
          newFriends.requestSent.push( friends[i] );			
          
        } else if ( friends[i].status == "Request Received" ) {
          
          newFriends.requestReceived.push( friends[i] );
          
        } else if ( friends[i].status == "Invitation Sent" ) {
          
          newFriends.invitationSent.push( friends[i] );
          
        } else if ( friends[i].status == "Request Accepted" ) {
          
          newFriends.requestAccepted.push( friends[i] );
          
        }
        
      } 
      
      return newFriends;
      
    }
    
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=all_friends" )
		
		.then( function( response ) {
			
			return sortFriends( response.data.data );
			
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;
				
		});
		
	};    
	
	var getFriend = function( id ) {
		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=get_friend&" + 
											   "friendId=" + encodeURIComponent( id )
												 )
		
		.then( function( response ) {
			
			return response.data.data;
			
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;
				
		});
		
	};
	
	var searchUsers = function( searchTerm ) {
		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=search_users&" + 
											   "query=" + encodeURIComponent( searchTerm )
												 )
		
		.then( function( response ) {
			
			return response.data;
			
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;
				
		});
		
	};

  return {
    allFriends : allFriends,
    addFriend : addFriend,
    acceptRequest : acceptRequest,
    denyRequest : denyRequest,
    getFriend : getFriend,
    searchUsers : searchUsers
  }
  
});