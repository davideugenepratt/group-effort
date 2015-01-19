angular.module('GroupEffort.services', [])

/**  
  * @desc this factory holds functions for error alerts, alert dialogues, and confirmation dialogues
  * Popup.error(); Popup.alert(); Popup.confirm();
  * @author David Eugene Pratt - david@davideugenepratt.com
*/  

.factory( 'Popup' , function( $rootScope, $ionicPopup ) {
	
	/** 
	  * @desc opens a modal window to display the error message stored in $rootScope.error
	  * @return bool - returns false to prevent error'd action from continuing 
	*/ 	
	
	var error = function() {
		
		$rootScope.$watch( function(scope) { return scope.error } , function() {
			
			if ( $rootScope.error ) {
				
				var errorPopup = $ionicPopup.show({
					template: $rootScope.error,
					title: 'Uh Oh!',
					scope: $rootScope,
					buttons: [ { text: 'OK' } ]					  				  					
				  });
				  
				errorPopup.then( function(res) {
					
					$rootScope.error = undefined;
					
					return false;
					
				  }); 
				   		  			  
			}
			
		});
		
	};
	
	/** 
	  * @desc opens a modal window to display the message provided by @var message.
	  * @params tile, message
	  * @return bool - returns false to prevent error'd action from continuing 
	*/		
	
	var alert = function( title, message ) {
		
		var alertPopup = $ionicPopup.show({
			template: message,
			title: title,
			scope: $rootScope,
			buttons: [ { text: 'OK' } ]
		});
		
		alertPopup.then( function(res) { } );  		
		  			  
	};
	
	/** 
	  * @desc opens a modal window to display a confirmation dialogue
	  * @params title, message
	  * @return bool - returns false to prevent error'd action from continuing 
	*/	
	
	var confirm = function( title , message ) {
		
		   var confirmPopup = $ionicPopup.confirm({
			 title: title,
			 template: message
		   });
		   
		   return confirmPopup.then( function(res) {
			   
			 return res;
			 
		   });
		   
	 };	 	 
	
	return {
		error : error,
		confirm : confirm,
		alert : alert
	}
	
})

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
				
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_authenticate" )
		
		.then( function( response ) {
			
			if ( false == response.data.success ) {
				
				if ( !$rootScope.loggedIn ) {
					
					if ( "/login" == $location.path() ) {
								
						return false;
				
					}
					
				}
													
				$rootScope.loggedIn = false;
				
				console.log( 'Not logged in. Going from ' + $location.path() + ' to login screen' );
				
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
			
			$rootScope.error = 'Could Not Connect';
			
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
		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_login&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password) )
		
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
				
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_logout" )
		
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
	
	var register = function( fullname, email, username , password ) {
		
		return $http.get( 	$rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_register" +
						"&fullname=" + encodeURIComponent(fullname) + 
						"&email=" + encodeURIComponent(email) + 
						"&username=" + encodeURIComponent(username) + 
						"&password=" + encodeURIComponent(password) 						
						)
						
			.then( function( response ) {
				
				if ( "false" != response.data.success ) {	
				
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
	}
})

/**  
  * @desc this factory holds functions for all the function dealing with the efforts
  * Efforts.allEfforts();
  * Efforts.addEffort(); 
  * Efforts.leaveEffort(); 
  * Efforts.getEffort();
  * Efforts.getEffortTasks();
  * Efforts.addEffortTask();
  * Efforts.dibs();
  * Efforts.getEffortComments();
  * Efforts.addEffortComment();
  * Efforts.editContributors();
  * @author David Eugene Pratt - david@davideugenepratt.com
*/

.factory('Efforts', function( $rootScope, $http, $state ) {
 	
	/** 
	* @desc determines whether or not the current user is logged in or not.
	* @params no params
	* @return (array) - Returns an object of all tasks - array( array( 'ID' => Effort ID, 'activity' => Current user's last checked activity of effort, 'title' => The title of the effort.
	*/
	
 	var allEfforts = function() {	
	
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_allEfforts" )
		
		.then( function( response ) {
			
			return response.data.data;
			
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;
				
		});
		
	};
	
 	/** 
	* @desc Adds an effort to the current user's account.
	* @params var title (string) = The title of the effort to be added.
	* @params var contributors (array) = An indexed array of the contributors to be added.
	* @return (string) - returns the id of the created effort.
	*/
	
	var addEffort = function( title , contributors ) {	
		
		return $http.get( $rootScope.baseURL + 	"wp-admin/admin-ajax.php?action=ge_addEffort" + 
												"&title=" + encodeURIComponent( title ) +
												"&contributors=" + encodeURIComponent( JSON.stringify( contributors ) ) 
												)
												
		.then( function( response ) {
			
			return response.data;
			
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;	
			
		});
		
	};

	/** 
	* @desc Removes the effort from the current user's list. If current user is the only one the effort will be lost.
	* @params var id (int) = The ID of the effort to be removed.
	* @return (string) - returns "TRUE" if connection was made and the effort was removed and "FALSE" if not. 
	*/	
	
	var leaveEffort = function( id ) {	
	
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_leaveEffort&" +
												"id=" + encodeURIComponent( id ) )
												
		.then( function( response ) {
			
			return response.data;
			
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;	
			
		});
		
	};

	/** 
	* @desc Gets the specified effort.
	* @params var id (int) = The ID of the effort to be removed.
	* @return (string) - returns "TRUE" if connection was made and the effort was removed and "FALSE" if not. 
	*/	
	
	var getEffort = function( id ) {
		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_getEffort&" +
												"id="+id )
												
		.then( function( response ) {
			
			if ( response.data.success ) {
			
				return response.data.data;
			
			} else {
				
				$rootScope.error = response.data.reason;
				
				$state.go( 'tab.efforts' );
				
				return false;
				
			}
			
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;	
			
		});
		
	};
			
	/** 
	* @desc Gets all the tasks assigned to current effort.
	* @params var id (int) = The id of the effort to get tasks from.
	* @return (object) - returns an array of all task objects attached to the effort.
	* @return bool - returns false if there is an error connecting.
	*/
	
	var getEffortTasks = function( id ) {
		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_getEffortTasks&" +
												"id=" + encodeURIComponent( id ) )
												
		.then( function( response ) {
			
			return response.data.data;
			
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;
				
		});
		
	};
	
	/** 
	* @desc Adds a task to specified effort.
	* @params var id (int) = The id of the effort to get tasks from.
	* @params var task (array) = array( "title" => The task title, "deadline" => The deadline date if task has one, "schedule" => The task's scehdule data if scheduled.
	* @return bool - returns false if there is an error connecting.
	*/	
	
	var addEffortTask = function( id , task ) {
		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_addEffortTask" +
												"&id=" + encodeURIComponent( id ) +
												"&task=" + encodeURIComponent( JSON.stringify( task ) ) )
												
		.then( function( response ) {
			
			return response.data;
			
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;	
			
		});
		
	};
	
	/** 
	* @desc Allows current user to call dibs on a task.
	* @params var id (int) = The id of the effort the task belongs to
	* @params var task (int) = The index of the task the user is trying to call dibs on.
	* @return (string) - returns "TRUE" if the user was able to call dibs on it or the id of the user who already has dibs on it.
	*/
	
	var dibs = function( id , task ) {

		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_dibs" +
												"&id=" + encodeURIComponent( id ) +
												"&task=" + encodeURIComponent( task ) 
												)
												
		.then( function( response ) {
			
			return response.data;
			
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;	
			
		});
		
	};
	
	/** 
	* @desc Assigns the correct users to each task in the effort.
	* @params var tasks (array) = the list of tasks to assign the contributors to.
	* @params var effort (object) = the effort which has the tasks to be assigned.
	* @return (array) - returns a new array of all the tasks with the right users assigned.
	*/
	
	var assignTasks = function( tasks , effort ) {
		
		var assignedTasks = {};
		
		for ( var i = 0; i < tasks.length; i++ ) {
		
			assignedTasks[ i ] = {};
			
			if ( ( tasks[i].dibs == $rootScope.user.id ) ) {	
					
				assignedTasks[i].dibs = true;
				
				assignedTasks[i].available = true;
				
			} else if ( ( tasks[i].dibs == '' ) || ( tasks[i].dibs == null ) ) {
				
				assignedTasks[ i ].dibs = false;
				
				assignedTasks[i].available = true;
				
			} else {
				
				assignedTasks[i].available = false;
				
				for ( var a = 0; a < effort.contributors.length; a++) {
					
					if ( tasks[i].dibs == effort.contributors[a].id ) {
						
						assignedTasks[ i ].face = effort.contributors[a].face;
						
					}
					
				}
				
			}
				
		}	
		
		tasks.finished = {};
		
		tasks.unfinished = {};
		
		for ( var i = 0; i < assignedTasks.length; i++ ) {
			
			if ( 'finished' == assignedTasks[i].status ) {
				
				tasks.finished[i] = assignedTasks[i];
				
			} else {
				
				tasks.unfinished[i] = assignedTasks[i];
			
			}
				
		}
		
		return assignedTasks;
		
	};
	
	/** 
	* @desc Changes the status of the specified task for the specified effort.
	* @params var id (int) = the id of the effort that the task belongs to.
	* @params var task (int) = the index of the task that is to be changed.
	* @return bool - returns true or false as well as sets $rootScope.loggedIn and $rootScope.user
	*/
	
	var changeTaskStatus = function( id, task , finished ) {
		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_changeTaskStatus&" +
												"id=" + encodeURIComponent( id )  +
												"&task=" + encodeURIComponent( task ) +
												"&finished=" + encodeURIComponent( finished )
												)
												
		.then( function( response ) {
			
			return response.data;
			
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;	
			
		});
				
	};	

	/** 
	* @desc Gets all the comments of the specified effort.
	* @params var id (int) = the id of the effort that the task belongs to.
	* @return JSON Object - the response from the server
	*/
		
	var getEffortComments = function( id ) {
		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_getEffortComments&" +
												"id=" + encodeURIComponent( id )
												)
												
		.then( function( response ) {
							
			return response.data;
										
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;	
			
		});
		
	};
	
	/** 
	* @desc Adds a comment to the specified effort.
	* @params var id (int) = the id of the effort that the task belongs to.
	* @params var comment (string) = the id of the effort that the task belongs to.
	* @return JSON Object - the response from the server
	*/	
	
	var addEffortComment = function( id , comment ) {

		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_addEffortComment" +
												"&id=" + encodeURIComponent( id ) +
												"&comment=" + encodeURIComponent( comment ) )
												
		.then( function( response ) {
			
			return response;
			
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;	
			
		});
		
	};
	
	/** 
	* @desc Edits the contributors.
	* @params var id (int) = the id of the effort that the task belongs to.
	* @params var comment (string) = the id of the effort that the task belongs to.
	* @return JSON Object - the response from the server
	*/	
	
	var editContributors = function( id , contributors ) {		
		
		list = [];
		for ( var key in contributors ) {
			if ( contributors[key] == true ) {
				list.push( key );
			}
		}
		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_editContributors"+
												"&id="+ id +
												"&contributors="+ list 
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
  	addEffort : addEffort,
	leaveEffort : leaveEffort,
	getEffort : getEffort,
	allEfforts : allEfforts,
	editContributors : editContributors,
	getEffortTasks : getEffortTasks,
	addEffortTask : addEffortTask,
	assignTasks : assignTasks,
	dibs : dibs,
	changeTaskStatus : changeTaskStatus,
	getEffortComments : getEffortComments,
	addEffortComment : addEffortComment

  }
})

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
	  
	  return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_addFriend&" +
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
	  
	  return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_acceptRequest&" +
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
	  
	  return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_removeFriend&" +
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
	
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_allFriends" )
		
		.then( function( response ) {
			
			return response.data.data;
			
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
	denyRequest : denyRequest
  }
});
