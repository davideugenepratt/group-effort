angular.module('GroupEffort.factories')

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
        
        assignedTasks[i].title = tasks[i].title;
        
        assignedTasks[i].finished = tasks[i].finished;
				
			} else if ( ( tasks[i].dibs == '' ) || ( tasks[i].dibs == null ) ) {
				
				assignedTasks[ i ].dibs = false;
				
				assignedTasks[i].available = true;
        
        assignedTasks[i].title = tasks[i].title;
        
        assignedTasks[i].finished = tasks[i].finished;
				
			} else {
				
				assignedTasks[i].available = false;
				
				assignedTasks[i].title = tasks[i].title;
        
        assignedTasks[i].finished = tasks[i].finished;
				
			}
				
		}	
		
		tasks.finished = {};
				
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
    * @desc Deletes the specified task for the specified effort.
    * @params var id (int) = the id of the effort that the task belongs to.
    * @params var task (int) = the index of the task that is to be changed.
    * @params var title (string) = the title of the task to be deleted
    * @return bool - returns true or false as well as sets $rootScope.loggedIn and $rootScope.user
    */
    
    var deleteTask = function( id, task , title ) {
        
        return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=delete_task&" +
                                                "id=" + encodeURIComponent( id )  +
                                                "&effort_task=" + encodeURIComponent( task ) +
                                                "&title=" + encodeURIComponent( title )
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
    * @desc Deletes the specified task for the specified effort.
    * @params var id (int) = the id of the effort that the task belongs to.
    * @params var task (int) = the index of the task that is to be changed.
    * @params var title (string) = the title of the task to be deleted
    * @return bool - returns true or false as well as sets $rootScope.loggedIn and $rootScope.user
    */
    
    var changeTask = function( id, task , title ) {
        
        if ( title != undefined ) {
        
            return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=change_task&" +
                                                "id=" + encodeURIComponent( id )  +
                                                "&effort_task=" + encodeURIComponent( task ) +
                                                "&title=" + encodeURIComponent( title )
                                                )
                                                
            .then( function( response ) {
            
                return response.data;
            
            },
        
            function( result ) {
            
                $rootScope.error = 'Could Not Connect';
            
                return false;   
            
            });
        
        };
                
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
  deleteTask : deleteTask,
  changeTask : changeTask,
	getEffortComments : getEffortComments,
	addEffortComment : addEffortComment

  }
  
});