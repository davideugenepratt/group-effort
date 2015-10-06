angular.module('GroupEffort.services', [])

/**  
  * @desc this factory holds functions for error alerts, alert dialogues, and confirmation dialogues
  * Popup.errorWindow(); Popup.alertPrompt(); Popup.confirmPrompt();
  * @author David Eugene Pratt - david@davideugenepratt.com
*/  

.factory( 'Popup' , function( $rootScope, $ionicPopup ) {
	
	/** 
	  * @desc opens a modal window to display the error message stored in $rootScope.error
	  * @return bool - returns false to prevent error'd action from continuing 
	*/ 	
	
	var errorWindow = function() {
		
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
	
	var alertPrompt = function( title, message ) {
		
		var alertPopup = $ionicPopup.show({
			template: message,
			title: title,
			scope: $rootScope,
			buttons: [ { text: 'OK' } ]
		});
		
		return alertPopup;  		
		  			  
	};
	
	/** 
	  * @desc opens a modal window to display a confirmation dialogue
	  * @params title, message
	  * @return bool - returns false to prevent error'd action from continuing 
	*/	
	
	var confirmPrompt = function( title , message ) {
		
		   var confirmPopup = $ionicPopup.confirm({
			 title: title,
			 template: message
		   });
		   
		   return confirmPopup.then( function(res) {
			   
			 return res;
			 
		   });
		   
	 };	 	 
	
	return {
		errorWindow : errorWindow,
		confirmPrompt : confirmPrompt,
		alertPrompt : alertPrompt
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
				
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=authenticate" )
		
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
				
				console.log( response.data.reason );
				
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
	
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=all_efforts" )
		
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
		
		return $http.get( $rootScope.baseURL + 	"wp-admin/admin-ajax.php?action=group_effort&task=add_effort" + 
												"&title=" + encodeURIComponent( title ) +
												"&contributors=" + encodeURIComponent( JSON.stringify( contributors ) ) 
												)
												
		.then( function( response ) {
			
			console.log( response.data );
			
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
	
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=leave_effort&" +
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
		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=get_effort&" +
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
		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=get_effort_tasks&" +
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
		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=add_effort_task" +
												"&id=" + encodeURIComponent( id ) +
												"&effort_task=" + encodeURIComponent( JSON.stringify( task ) ) )
												
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

		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=dibs" +
												"&id=" + encodeURIComponent( id ) +
												"&effort_task=" + encodeURIComponent( task ) 
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
		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=change_task_status&" +
												"id=" + encodeURIComponent( id )  +
												"&effort_task=" + encodeURIComponent( task ) +
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
		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=get_effort_comments&" +
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

		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=add_effort_comment" +
												"&id=" + encodeURIComponent( id ) +
												"&comment=" + encodeURIComponent( comment ) )
												
		.then( function( response ) {
			
			return response.data;
			
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
	
	var editContributors = function( id , data ) {		
		
		data = JSON.stringify( data );
		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=edit_contributors"+
												"&id="+ encodeURIComponent( id ) +
												"&contributors="+ encodeURIComponent( data )
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
	
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=all_friends" )
		
		.then( function( response ) {
			
			return response.data.data;
			
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
}).factory( 'Account' , function( $rootScope, $http, Popup ) {
  
  var changePhoto = function() {
		
		var options =   {			
            quality: 100,
            destinationType: 1,
            sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
            encodingType: 0,    // 0=JPG 1=PNG
			cameraDirection: 1,
			targetWidth: 100,
			targetHeight: 100,
			allowEdit: true,
			saveToPhotoAlbum: true
        }
				
		var onSuccess = function( FILE_URI ) {				
			
			var myImg = FILE_URI;
			
			var options = new FileUploadOptions();
			
			options.fileKey="file";
			
			options.chunkedMode = false;
			
			var ft = new FileTransfer();			
					
			ft.upload( 
				
				myImg, 
				
				encodeURI( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=upload_photo" ), 
				
				function( response ) {
					
					var x = JSON.parse( response.response );	
										
					$rootScope.user.face = x.data + "?" + new Date().getTime();
																			
				},
				
				function() {
							
					$rootScope.error = "Sorry, looks like there was a problem uploading your photo";
								
				}, 
				
				options
				
			);
						
		};
		
		var onFail = function(e) {
			
			$rootScope.error = "Sorry, looks like there was a problem using your photo";
			
		};
		
		navigator.camera.getPicture( onSuccess , onFail , options );  
	  
  };
  
  var updateProfile = function( data ) {
	  	  
	  return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=update_profile" +
	  				  
					  "&data=" + encodeURI( JSON.stringify( data ) )			  	
					  
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
    
	changePhoto : changePhoto,
	
	updateProfile : updateProfile
	
  }
	
});
