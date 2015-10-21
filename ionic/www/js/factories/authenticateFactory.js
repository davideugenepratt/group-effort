angular.module('GroupEffort.factories')

/**  
  * @desc this factory holds functions for the authentication of users
  * Authenticate.authenticate(); 
  * Authenticate.authenticate.check(); 
  * Authenticate.authenticate();
  * @author David Eugene Pratt - david@davideugenepratt.com
*/  

.factory( 'Authenticate' , function( $rootScope , $http, $location, $state ) {		
	
	/** 
	  * @desc determines whether or not the current user is logged in or not.
	  * @params No params.
	  * @return bool - returns true or false as well as sets $rootScope.loggedIn and $rootScope.user.
	*/	
	
	var authenticate = function() {
				
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=authenticate" )
		
		.then( function( response ) {
			
			if ( false == response.data.success ) {
				
				if ( !$rootScope.loggedIn ) {
					
					if ( "/login" == $location.path() ) {
								
						return false;
				
					}
					
				}
													
				$rootScope.loggedIn = false;
								
				// "Not logged in. Going from /tab/account to login screen"
				
				if ( "/login" != $location.path() ) {
								
					$state.go( 'login' );
				
				}
				
				return false;
				
			} else {
									
				$rootScope.loggedIn = true;
				
				$rootScope.user = response.data.data;
								
				return true;
				
			}	
												
		},
		
		function( result ) {
			
			$rootScope.error = "Could Not Connect";
			
			return false;	
			
		});						
							  
	};
						
	/** 
	* @desc Logs the user into the WordPress System.
	* @params var username (string) - the username
	* @params var password (string) - the password
	* @return bool - returns true or false as well as sets $rootScope.loggedIn and $rootScope.user
	*/	
	
	var login = function( username , password ) {
		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=login&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password) )
		
		.then( function( response ) {
									
			if ( false == response.data.success ) {	
								
				$rootScope.error = response.data.reason;
								
				return false;
				
			} else {		
					
				$rootScope.loggedIn = true;
				
				$rootScope.user = response.data.data;
				
				return true;
				
			}					
								
		},
		
		function( result ) {
			
			$rootScope.loggedIn = false;
			
			$rootScope.error = 'Could Not Connect';
			
			return false;	
			
		});
		
	};
	
	/** 
	* @desc Logs the current user out.
	* @params
	* @return bool - returns true or false as well as sets $rootScope.loggedIn and $rootScope.user
	*/
	
	var logout = function() {
				
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=logout" )
		
		.then( function( response ) {
			
			$rootScope.loggedIn = false;
			
			return true;
											
		},
		
		function( result ) {
						
			$rootScope.error = 'Could Not Connect';
			
			return false;	
			
		});
		
	};
	
	/** 
	* @desc registers user as a new user.
	* @params var fullname (string) - Users full name
	* @params var email (string) - Users email address
	* @params var password (string) - Users password
	* @params var username (string) - Users desired username
	* @return var response.data - array( "success" => (string) "true" or "false", "reason" => the reason [success] is false, "user" => the user array if true. )
	*/
	
	var register = function( email, username , password ) {
		
		return $http.get( 	$rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=register" +
						"&email=" + encodeURIComponent(email) + 
						"&username=" + encodeURIComponent(username) + 
						"&password=" + encodeURIComponent(password) 						
						)
						
			.then( function( response ) {
								
				if ( response.data.success ) {	
				
					$rootScope.loggedIn = true;	
								
					return response.data.data;
					
				} else {
					
					$rootScope.error = response.data.reason;
					
					return false;
					
				}		
												
			},
					
			function( result ) {
				
				$rootScope.error = 'Could Not Connect';
				
				return false;	
				
			});
			
	};
	
	return {
		authenticate : authenticate,
		login : login,
		register : register,
		logout : logout
	};

});