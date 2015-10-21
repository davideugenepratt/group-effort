<?php

/**  
  * @desc Group_Effort_Ajax holds functions for the AJAX requests from the Ionic App.
  * $this->loader->add_action( 'wp_ajax_nopriv_ge_authenticate', $ajax, 'group_effort_not_logged_in' );
  * response();
  * check_contributor();
  * add_activity();
  * group_effort_logged_in(); 
  * group_effort_login();
  * group_effort_logout(); 
  * group_effort_register' );
  * group_effort_all_efforts();
  * group_effort_add_effort();
  * group_effort_get_effort();
  * group_effort_edit_contributors();
  * group_effort_get_effort_comments();
  * group_effort_add_effort_comment();
  * group_effort_get_effort_tasks();
  * group_effort_add_effort_task();
  * group_effort_dibs();
  * group_effort_change_task_status();
  
  * group_effort_leave_effort();
  * group_effort_all_friends();
  * group_effort_add_friend();
  * group_effort_accept_request();
  * group_effort_remove_friend();

  * @author David Eugene Pratt - david@davideugenepratt.com
*/  

// require_once('../../FirePHPCore/fb.php');

class Group_Effort_Ajax {
		
	public function ajax_controller( ) {
					
		$formData = $_GET;
		
		$task = $formData['task'];
		
		$result = $this->$task( $formData );
		
		echo( json_encode( $result ) );
		
		die();
		
	}
    
    public function remove_flood_filter() {
        
        return false;
        
    }
	
	/** 
	* @desc Ensures the current user is listed in the list of an efforts contributors.
	* @params $effort (int) = The id number of the effort to check.
	* @return JSON - If not a member of the effort it returns a JSON error response and exits the script.
	*/	
	
	private function check_contributor( $effort ) {
		
		$user = wp_get_current_user();
		
		$contributors = get_post_meta( $effort, '_contributors', false ); 
		
		$exists = false;
		
		// Probably a better way to check to see if user is in the contributors meta
		
		foreach ( $contributors as $contributor ) {		
		
			if( $contributor["id"] == $user->ID ) {
				
				$exists = true;
				
				return true;
				
			}
			
		}				
		
		if ( !exists ) {			
		
			echo json_encode( array( "success" => false, "reason" => "You are not a part of this effort." ) );
		
			die();	
		
		}
	}
	
	/** 
	* @desc Adds the provided activity to an effort's log.
	* @params $effort {int) = The ID of the effort to which the activity is to be added.
	* @params $username (string) = The username of the user who is doing the activity.
	* @params $activity (string) = The activity that is to be added.
	* @params $comment (string) = Additional information regarding the activity.
	*/	
	
	private function add_activity( $effort , $username , $activity , $comment ) {
		
		$activity = array( 	'username' => $username,
							'activity' => $activity,
							'comment' => $comment,
							'time' => current_time( 'l, F jS, Y \a\t g:i A' )
						);
		
		add_post_meta( 	$effort, 
						'_activity',
						$activity,
						false );	
							
	} 
	
	private function current_user() {
		
		$current_user = wp_get_current_user();
		
		$profile = get_user_meta( $current_user->ID , "profile", true );
		
		$user = array(	
						'id' => $current_user->ID,
						'username' => $current_user->data->user_login,
						'email' => $current_user->data->user_email,
						'face' => get_user_meta( $current_user->ID, "avatar", true ),
						'phone' => $profile["phone"],
						'location' => $profile["location"]
						);
								
		return $user;
		
	} 
  
  private function get_task_by_guid( $tasks, $guid ) {
            
    foreach ( $tasks as $task ) {
                  
      if ( $task["guid"] == $guid ) {
       
         return $task;
        
      }
    
    }
    
  }
  
  // Helper functions for the class

	/** 
	* @desc Extends the users login cookie so that they don't have to keep logging in on their phone.
	* @return JSON - Returns a JSON error response and exits the script.
	*/

	public function extend_cookie( $expirein ) {
		return (60 * 60 * 24 * 365 * 10); // 10 years in seconds
	}

	/** 
	* @desc Is connected with the "_nopriv" ajax call so that if user is not logged in the login check will direct to here.
	* @return JSON - Returns a JSON error response and exits the script.
	*/
	
	public function not_logged_in() {	
		
		$formData = $_GET;
		
		$task = $formData['task'];
		
		if ( $task == "login" ) {
						
			$result = $this->$task( $formData );
			
			echo( json_encode( $result ) );
			
			die();
		
		} else if ( $task == "register" ) {
						
			$result = $this->$task( $formData );
			
			echo( json_encode( $result ) );
			
			die();
		
		}
		
		echo json_encode( array( "success" => false, "reason" => "The user is not logged in." ) );
		
		die();
		
	}

	/** 
	* @desc Is connected to the "authenticate" ajax action.
	* @return JSON - Returns a JSON success response with the current user's information.
	*/
	
	public function authenticate( $formData ) {
		
		$current_user = wp_get_current_user();
		
		$profile = get_user_meta( $current_user->ID , "profile", true );
		
		if ( !$profile != '' ) {
		
			add_user_meta( $current_user->ID , "profile" , array( "location" => "" , "phone" => "" , "avatar" => plugins_url( 'group-effort/img/avatar.jpg' ) ), true );
	
		}
								
		return array( "success" => true, "data" => $this->current_user() );
					
	}

	/** 
	* @desc Logs in user using information from login screen in Ionic App.
	* @params $formData["username"] (string) = The username.
	* @params $formData["password"] (string) = The password.
	* @return JSON - Returns a JSON error message if it could not log in or a JSON success message with the user data attached.
	*/
	
 	public function login( $formData ) {
		
		$creds = array();		
		$creds['user_login'] = $formData["username"];
		$creds['user_password'] = $formData["password"];
	 
		$user = wp_signon($creds, false);
		
		if ( is_wp_error( $user ) ) {
			
			return array( "success" => false, "reason" => "Incorrect username/password combination." );
						
		}
		
		$current_user = wp_get_current_user();
		
		var_dump( $current_user );
		
		$profile = get_user_meta( $current_user->ID , "profile", true );
		
		if ( !$profile != '' ) {
		
			add_user_meta( $current_user->ID  , "profile" , array( "location" => "" , "phone" => "" , "avatar" => plugins_url( 'group-effort/img/avatar.jpg' ) ), true );
	
		}		
		
		return array( "success" => true, "data" => $this->current_user() );
		
	}
	
	/** 
	* @desc Logs the current user out of the system.
	* @return JSON - returns a JSON success message.
	*/
	
	public function logout() {
		
		wp_clear_auth_cookie();
		
		wp_logout();
		
		return array( "success" => true );
				
	}

	/** 
	* @desc Registers a new user.
	* @params $formData["fullname"] (string) = The username.
	* @params $formData["email"] (string) = The username.
	* @params $formData["username"] (string) = The username.
	* @params $formData["password"] (string) = The password.
	* @return JSON - Returns a JSON error response if the username or email exists or a JSON success message with the created user data attached.
	*/
	
	public function register( $formData ) {
				
		$creds = array(	'email' => $formData["email"],
						'user_login' => $formData["username"],
						'user_password' => $formData["password"]
						);
		
		$user_id = username_exists( $creds['user_login'] );
		
		if ( $user_id ) {
			
			return array( 'success' => false, 'reason' => "User already exists." );
			
		} elseif ( email_exists( $creds['email'] ) == true ) {
			
			return array( 'success' => false, 'reason' => "Email already exists." );
			
		} else {
			
			$user_id = wp_create_user( $creds['user_login'], $creds['user_password'], $creds['email'] );
			
			wp_update_user( array( 'ID' => $user_id, 'show_admin_bar_front' => false, 'role' => 'group_effort' ) );	
			
			add_user_meta( $user_id , "avatar" , plugins_url( 'group-effort/img/avatar.jpg' ), true );
			
			add_user_meta( $user_id , "profile" , array( "location" => "" , "phone" => "" , "avatar" => plugins_url( 'group-effort/img/avatar.jpg' ) ), true );				
				 
			$user = wp_signon( $creds, false);
			
			wp_set_current_user( $user->ID );
														
			return array( 'success' => true, 'data' => $this->current_user() );
			
		}
				
	} // All the authentification functions

	/** 
	* @desc Returns all the efforts attached to the current user.
	* @return JSON - Returns a JSON success message with the current user's efforts attached.
	*/

	public function all_efforts( $formData ) {
		
		$current_user = wp_get_current_user(); // $current_user->ID
				
		return array( "success" => true, "data" => get_user_meta( $current_user->ID , '_efforts' , false) );
				
	}
	
	/** 
	* @desc Adds a new effort and attaches it to the current user.
	* @params $formData["contributors"] (string) = A comma seperated list of contributors to attach to effort.
	* @params $formData["title"] (string) = The title of the effort to be created.
	* @return JSON - Returns a JSON error response if the username or email exists or a JSON success message with the created user data attached.
	*/
	
	public function add_effort( $formData ) {
		
		$contributors = (array) json_decode( stripslashes( $formData["contributors"] ) );
		
		$post = array(
			'post_title' => $formData["title"],
			'post_status' => 'publish',
		  'post_type'      => 'group-effort'  // Default 'post'.
		);						 		
		
		$effort = wp_insert_post( $post );
		
		$current_user = wp_get_current_user();
				
		add_post_meta( $effort, '_contributors', array( 'id' => $current_user->ID, 'username' => $current_user->user_login, 'face' => get_user_meta( $current_user->ID, "avatar", true ), 'role' => 'admin' ), false ); 
		
		$this->add_activity( $effort , wp_get_current_user()->data->user_login , "created effort" , $formData["title"] );
		
    $new_effort = array(	'ID' => $effort,
                          'title' => $post['post_title'],
                          'activity' => 0 
                          );
    	
		add_user_meta( $current_user->ID, '_efforts', $new_effort, false ); 
						
		if ( is_array( $contributors ) ) {
			
			foreach( $contributors as $contributor => $status ) {
								
				if ( $status ) {
					
					$user = get_user_by( 'login', $contributor );		
							
					add_post_meta( $effort, '_contributors', array( 'id' => $user->ID, 'username' => $user->data->user_login, 'face' => get_user_meta( $user->ID, "avatar", true ), 'role' => 'contributor' ), false ); 
					
					add_user_meta( $user->ID, '_efforts', array(	'ID' => $effort,
																	'title' => $post['post_title'],
																	'activity' => 0 ),
																	false ); 
					
				}
				
			}
			
		}
						
		return array( "success" => true, "data" => get_user_meta( $current_user->ID , '_efforts' , false) );
				
	}
	
	/** 
	* @desc Removes current user from the specified effort.
	* @params $formData["id"] (int) = The id of the requested effort.
	* @return No response.
	*/	
	
	public function leave_effort( $formData ) {
				
		$current_user = wp_get_current_user();
		
		$efforts = get_user_meta( $current_user->ID , '_efforts' , false);
						
		foreach ( $efforts as $key => $effort ) {
			
			if ( $effort["ID"] == $formData["id"] ) {
				
				delete_user_meta( $current_user->ID, '_efforts', $effort );	
				
				$tasks = get_post_meta( $formData["id"], '_tasks', false );
				
				foreach ( $tasks as $task ) {
					
					if ( $task["dibs"] == $current_user->ID ) {
						
						$newTask = $task;
						
						$newTask["dibs"] = null;
						
						update_post_meta( $formData["id"], '_tasks', $newTask, $task );
						
					}
					
				}
				
				$contributors = get_post_meta( $formData["id"], '_contributors', false );
				
				foreach ( $contributors as $contributor ) {
					
					if ( $contributor["id"] == $current_user->ID ) {
						
						delete_post_meta( $formData["id"], '_contributors', $contributor );
						
					}
					
				}		
						
				$this->add_activity( $formData["id"] , wp_get_current_user()->data->user_login , "left effort" , '' );
								
			} 
			
		}
										
	}	

	/** 
	* @desc Gets the specified effort.
	* @params $formData["id"] (int) = The id of the requested effort.
	* @return JSON - Returns a JSON error response if the user does not belong to the effort or a JSON success message with the effort data.
	*/
	
	public function get_effort( $formData ) {
				
		$this->check_contributor( $formData["id"] );
		
		$post = get_post( $formData["id"] );
		
		$effort = array(
						'id' => $post->ID,
						'title' => $post->post_title,
						'contributors' => get_post_meta( $post->ID, '_contributors', false ),
						'activity' => get_post_meta( $post->ID, '_activity' )
						);
		
		return array( "success" => true, "data" => $effort );
				
	}

	/** 
	* @desc Edits the contributors of a specific effort.
	* @params $formData["id"] (int) = The id of the requested effort.
	* @params $formData["contributors"] (string) = A comma seperated list of all the contributors to be assigned to the effort.
	* @return JSON - Returns a JSON error response if the user does not belong to the effort or a JSON success message with the effort data.
	*/

	public function edit_contributors( $formData ) {	
	
		$this->check_contributor( $formData["id"] );
		
		$contributors =  (array) json_decode( stripslashes( $formData["contributors"] ) );
				
		$newList = array();
		
		$newContributors = array();
		
		if( count( $contributors ) != 0 ) {
		
			foreach ( $contributors as $key => $contributor ) {
				
				if ( $contributor->contributor == true ) {
					
					$newList[] = $key;
					
					$newContributors[ $key ] = $contributor;
				
				} 
				
			}
		
		}
		
		$post = get_post( $formData["id"] );					
		
		$oldContributors = get_post_meta( $formData["id"], '_contributors', false );
		
		foreach ( $oldContributors as $contributor ) {
			
			if ( $contributor["id"] == wp_get_current_user()->ID ) {
				
				$owner = $contributor;
				
			}
			
			$oldList[] = $contributor["username"];	
			
		}
				
		delete_post_meta( $formData["id"], '_contributors' );
		
		add_post_meta( $formData["id"], '_contributors', $owner , false );				
		
		$toRemove = array_diff(  $oldList , $newList , array( $owner["username"] ) );	
				
		if ( count( $toRemove ) != 0 ) {
			
			foreach( $toRemove as $oldUser ) {		
						
				$user = get_user_by( 'login', $oldUser );	
						
				$userEfforts = get_user_meta( $user->ID, '_efforts' );	
						
				foreach( $userEfforts as $effort ) { 
				
					if ( $effort["ID"] == $formData["id"] ) {
						
						delete_user_meta( $user->ID, '_efforts', $effort );
												
					}
					
				}
				
			}
			
		}
		
		$added = array();
		
		if 	( $formData["contributors"] != '' ) {
			
			foreach( $newContributors as $key => $contributor ) {
				
				$role = ( isset( $contributor->admin ) && $contributor->admin ) ? 'admin' : 'contributor';
				
				$user = get_user_by( 'login', $key );
							
				$userEfforts = get_user_meta( $user->ID, '_efforts' );	
						
				$hasEffort = false;
				
				foreach( $userEfforts as $effort ) { 
				
					if ( $effort["ID"] == $formData["id"] ) {
						
						$hasEffort = true;
						
					}
					
				}
				
				if ( $hasEffort == false ) {
					
					add_user_meta( 	$user->ID,
									'_efforts', 
									array(	'ID' => $formData["id"],
											'title' => $post->post_title,
											'activity' => 0 ),
											false );
										
					$added[] = 	$key;		
						
				}
								
				add_post_meta( $formData["id"], '_contributors', array( 'id' => $user->ID, 'username' => $user->user_login, 'face' => get_user_meta( $user->ID, "avatar", true ), 'role' => $role ) , false ); 
				
			}
			
		}
		
		if ( 0 != count( $toRemove ) ) {
				
			foreach ( $toRemove as $contributor ) {
	
				$user = get_user_by( 'login', $contributor );
								
				$tasks = get_post_meta( $formData["id"], '_tasks', false ); 	
				
				foreach ( $tasks as $task ) {
					
					if ( $task["dibs"] == $user->ID ) {
						
						$newTask = $task;
						
						$newTask["dibs"] = null;
						
						update_post_meta( $formData["id"], '_tasks', $newTask, $task );
						
					}
					
				}
			
			}
			
		}
		
		$removed = ( count( $toRemove ) > 0 ) ? "removed ".implode( ', ' , $toRemove ) : '';
		
		$added = ( ( count( $added ) > 0 ) && ( $added[0] != '' ) ) ? "added ".implode( ', ' , $added ) : '';
		
		$connector = ( ($removed != '' ) && ( $added != '' ) ) ? ' and ' : '';
		
		$comment = $removed.$connector.$added;
			
		$this->add_activity( $formData["id"] , wp_get_current_user()->data->user_login , "changed contributors;" , $comment );							
									
	}	
	
	/** 
	* @desc Gets the specified effort's tasks.
	* @params $formData["id"] (int) = The id of the requested effort.
	* @return JSON - Returns a JSON error response if the user does not belong to the effort or a JSON success message with the effort's tasks.
	*/	
	
	public function get_effort_tasks( $formData ) {
		
		$this->check_contributor( $formData["id"] );
		
		$tasks = get_post_meta( $formData["id"], '_tasks', false );
		
		return array( "success" => true, "data" => $tasks );
				
	}
	
	/** 
	* @desc Adds a task to the specified effort.
	* @params $formData["id"] (int) = The id of the requested effort.
	* @return No response..
	*/	
	
	public function add_effort_task( $formData ) {
		
		$this->check_contributor( $formData["id"] );
		
		$task = (array) json_decode( stripslashes( $formData["effort_task"] ) );	
    $task["guid"] = uniqid();	
						
		add_post_meta( $formData["id"], '_tasks', $task, false );
		
		$this->add_activity( $formData["id"] , wp_get_current_user()->data->user_login , "added a task:" , $task["title"] );
		                
        return $this->get_effort_Tasks( $formData );
        					
	}
	
	/** 
	* @desc Let's a user call "dibs" on the specified task.
	* @params $formData["id"] (int) = The id of the requested effort.
	* @params $formData["effort_task"] (int) = The index of the task that the user wants to call dibs on.
	* @return No response..
	*/		
	
	public function dibs( $formData ) {
		
		$this->check_contributor( $formData["id"] );
		
		$tasks = (array) get_post_meta( $formData["id"], '_tasks', false );		    
    
    $task = $this->get_task_by_guid( $tasks , $formData["effort_task"] );        
    
    $newTask = $task;
            		
		if ( ( !isset( $task['dibs'] ) || '' == $task['dibs'] ) ) {
			
			$newTask['dibs'] = wp_get_current_user()->ID;		
				
			update_post_meta( $formData["id"] , '_tasks' , $newTask, $task );
			
			$this->add_activity( $formData["id"] , wp_get_current_user()->data->user_login , "called dibs on" , $task["title"] );
			
			return array( "success" => true );
			
		} elseif ( $task['dibs'] == wp_get_current_user()->ID ) {
			
			$newTask['dibs'] = '';
			
			update_post_meta( $formData["id"] , '_tasks' , $newTask, $task );
			
			$this->add_activity( $formData["id"] , wp_get_current_user()->data->user_login , "no longer has dibs on" , $task["title"] );
			
			return array( "success" => true );
			
		} else {
			
			return array( "success" => false, "data" => $newTask );
				
		} 
    									
	}

	/** 
	* @desc Let's a user change the finished status of the task.
	* @params $formData["id"] (int) = The id of the requested effort.
	* @params $formData["effort_task"] (int) = The index of the task that the user wants to call dibs on.
	* @return JSON - A JSON success message with the task attached as data.
	*/
	
	public function change_task_status( $formData ) {
		
		$this->check_contributor( $formData["id"] );
		
		$tasks = get_post_meta( $formData["id"], '_tasks', false );
		
		$task = $this->get_task_by_guid( $tasks , $formData["effort_task"] );
    //$task = (array) $tasks[ $formData["effort_task"] ];
		    
		$newTask = $task;
		    
		$newTask['finished'] = 	json_decode( $formData["finished"] );			
		
		$action = ( $newTask['finished'] ) ? 'finished' : 'removed finished status of';
		
		$this->add_activity( $formData["id"] , wp_get_current_user()->data->user_login , $action.' the task' , $task["title"] );
		
		update_post_meta( $formData["id"] , '_tasks' , $newTask, $task );
    
    $tasks = get_post_meta( $formData["id"], '_tasks', false );
		
		return array( "success" => true, "data" => $tasks );
							
	}
	
	/** 
    * @desc Let's a user change the finished status of the task.
    * @params $formData["id"] (int) = The id of the requested effort.
    * @params $formData["effort_task"] (int) = The index of the task that the user wants to call dibs on.
    * @return JSON - A JSON success message with the task attached as data.
    */
    
    public function delete_task( $formData ) {
        
        $this->check_contributor( $formData["id"] );
        
        $tasks = get_post_meta( $formData["id"], '_tasks', false );
        
        $task = $this->get_task_by_guid( $tasks , $formData["effort_task"] );
        
        delete_post_meta( $formData["id"] , '_tasks' , $task );
        
        $tasks = get_post_meta( $formData["id"], '_tasks', false );
        
        return array( "success" => true, "data" => $tasks );
                            
	}
	
	/** 
    * @desc Let's a user change the finished status of the task.
    * @params $formData["id"] (int) = The id of the requested effort.
    * @params $formData["effort_task"] (int) = The index of the task that the user wants to call dibs on.
    * @return JSON - A JSON success message with the task attached as data.
    */
    
    public function change_task( $formData ) {
        
        $this->check_contributor( $formData["id"] );
        
        $tasks = get_post_meta( $formData["id"], '_tasks', false );
        
        $task = $this->get_task_by_guid( $tasks , $formData["effort_task"] );
        
        $newTask = $task;
        
        if ( $formData["title"] != "" ) {
        
            $newTask["title"] = $formData["title"];          
        
            $this->add_activity( $formData["id"] , wp_get_current_user()->data->user_login , 'Edited the task' , $task["title"] );
        
            update_post_meta( $formData["id"] , '_tasks' , $newTask, $task );
        
        }
        
		return array( "success" => true, "data" => $newTask );
                            
    }
	
	
	/** 
	* @desc Gets all the comments for the specified effort.
	* @params $formData["id"] (int) = The id of the requested effort.
	* @return JSON - A JSON success message with the task attached as data.
	*/
	
	public function get_effort_comments( $formData ) {
		
		$this->check_contributor( $formData["id"] );
		
		$comments = get_comments( 'post_id='.$formData["id"] );
		
		foreach ( $comments as $comment ) {
			
			$comment->comment_date = date( 'l, F jS, Y \a\t g:i A' , strtotime( $comment->comment_date ) );	
			
		}				
				
		return array( "success" => true , "data" => $comments );
				
	}

	/** 
	* @desc Gets all the comments for the specified effort.
	* @params $formData["id"] (int) = The id of the requested effort.
	* @params $formData["comment"] (string) = The comment to be added.
	* @return No response.
	*/
	
	public function add_effort_comment( $formData ) {
		
		$this->check_contributor( $formData["id"] );
		
		$current_user = wp_get_current_user();		
		
		$commentdata = array(
								'comment_post_ID' => $formData["id"],
								'comment_author' => $current_user->data->user_login, 
								'comment_author_email' => $current_user->data->user_email, 
								'comment_author_url' => get_user_meta( $current_user->ID, "avatar", true ),  
								'comment_content' => $formData["comment"],
								'comment_type' => '',
								'comment_parent' => '',
								'user_id' => $current_user->data->ID,
								'comment_author_IP' => ''
							);
		
		$this->add_activity( $formData["id"] , wp_get_current_user()->data->user_login , "commented" , ' on '.get_post( $formData["id"] )->post_title );
		
		$comment_id = wp_new_comment( $commentdata );
        
        return $this->get_effort_comments( $formData );
								
	} // All effort functions
	
	/**
	*
	*
	*
	*
	**/
	
	public function search( $formData ) {
		
		$users = get_users( array( "role" => "group_effort" ) );
		$term = $formData["term"];
		$result = array();
		
		$current_user = wp_get_current_user();
		$friends = get_user_meta( $current_user->ID , '_friends' , false );
		
		foreach ( $users as $key => $user ) {
						
			if ( strpos( $user->data->user_login , $term ) || strpos( $user->data->user_email , $term ) ) {
				/*
				$status = '';
				
				foreach ( $friends as $friend ) {
										
					if ( $friend['ID'] == $user->data->ID ) {
						
						$status = $friend['status'];
											
					} 
					
				}									
				
				if ( $status == "" ) {
					$result[] = array(	'ID' => $user->data->ID,
										'email' => $user->data->user_email,
										'username' => $user->data->user_login,
										'face' => get_user_meta( $user->ID, "avatar", true ),
										'status' => $status
										 );	
				}
                */
									 
			}			
		
		}
		
        return array( "success" => true, "data" => $friends );						
		// return array( "success" => true, "data" => array_slice( $result, 0, 6 ) );
		
	}
	
	/** 
	* @desc Sends a new request to the specified user.
	* @params $formData["email"] (string) = The username.
	* @return JSON - Returns a JSON error response if the user does not exist or if a request has already been sent or a JSON success message.
	*/
	
	public function add_friend( $formData ) {					
		
		$current_user = wp_get_current_user();
		
		$user = get_user_by( 'email', $formData["email"] );
		
		$friends = get_user_meta( $current_user->ID, '_friends', false );
		
		$is_friend = false;
		
		foreach ( $friends as $friend ) {
			
			if ( $friend['email'] == $formData["email"] ) {
				
				$is_friend = true;
				
			}
			
		}
		
		if ( !$user ) {
			
			return array( "success" => false, "reason" => "There is not a GroupEffort user with the email address ".$formData["email"] );
						
		} else if ( $is_friend ) {
			
			return array( "success" => false, "reason" => "You have already sent a request to ".$formData["email"] );
			
		} elseif ( $user && in_array( 'group_effort' , $user->roles ) ) {	
				
			add_user_meta( $current_user->ID, '_friends', array(	'ID' => $user->ID,
														'email' => $user->user_email,
														'username' => $user->user_login,
														'face' => get_user_meta( $user->ID, "avatar", true ),
														'status' => 'Request Sent' ),
														false ); 
														
			add_user_meta( $user->ID, '_friends', array(	'ID' => $current_user->ID,
														'email' => $current_user->user_email,
														'username' => $current_user->user_login,
														'face' => get_user_meta( $current_user->ID, "avatar", true ),
														'status' => 'Request Received' ),
														false );
																									
			return array( "success" => true );
			
		} 
				
	}

	/** 
	* @desc Accepts a request from the specified user.
	* @params $formData["email"] (string) = The email of the user whos request is to be accepted.
	* @return JSON - Returns a JSON error response if the user does not exist or if a request has already been sent or a JSON success message.
	*/
	
	public function accept_request( $formData ) {		
	
		$current_user = wp_get_current_user();
		
		$user = get_user_by( 'email', $formData["email"] );
			
		$debug = array();	
				
		foreach( get_user_meta( $current_user->ID, '_friends', false ) as $friend ) { // $friend will be the old meta info				
			
			if ( $friend["ID"] == $user->ID ) {
			
				$debug[] = update_user_meta( 	$current_user->ID, 
												'_friends', 
												array(	'ID' => $user->ID,
														'email' => $user->data->user_email,
														'username' => $user->data->user_login,
														'face' => get_user_meta( $user->ID, "avatar", true ),
														'status' => 'Request Accepted' ),
												$friend 
												); 		
														
			}
			
		}
		
		foreach( get_user_meta( $user->ID, '_friends', false ) as $friend ) { // $friend will be the old meta info				
			
			if ( $friend["ID"] == $current_user->ID ) {
			
				$debug[] = update_user_meta( $user->ID, '_friends', array(	'ID' => $current_user->data->ID,
														'email' => $current_user->data->user_email,
														'username' => $current_user->data->user_login,
														'face' => get_user_meta( $current_user->ID, "avatar", true ),
														'status' => 'Request Accepted' ),
														$friend);		
														
			}
			
		}			
																															
		return array( "success" => true , "debug" => $debug );	
			
	}

	/** 
	* @desc Removes a friend from the list of friends.
	* @params $formData["email"] (string) = The email of the user whos request is to be removed.
	* @return JSON - Returns a JSON error response if the user does not exist or if a request has already been sent or a JSON success message.
	*/

	public function remove_friend( $formData ) {
				
		$current_user = wp_get_current_user();
		
		$user = get_user_by( 'email', $formData["email"] );
		
		$friends = get_user_meta( $current_user->ID , '_friends' , false);	
					
		foreach ( $friends as $key => $friend ) {
			
			if ( $friend["email"] == $formData["email"] ) {
				
				delete_user_meta( $current_user->ID, '_friends', $friend );									
				
			}
			
		}
		
		$friends = get_user_meta( $user->ID , '_friends' , false);			
		
		foreach ( $friends as $key => $friend ) {
						
			if ( $friend["email"] == $current_user->data->user_email ) {
				
				delete_user_meta( $user->ID, '_friends', $friend );	
				
				if ( "Request Sent" == $friend["status"] ) {
					
					return array( "success" => true, "data" => "Request has been removed." );
					
				} else {
					
					return array( "success" => true, "data" => "User has been removed from your network." );	
					
				}
				
			}
			
		}		
				
	}
	
	/** 
	* @desc Retrieves all the friends for the current user.
	* @return JSON - Returns a JSON error response if the user does not exist or if a request has already been sent or a JSON success message.
	*/	
	
	public function all_friends( $formData ) {	
		
		$current_user = wp_get_current_user();
				
		return array( "success" => true, "data" => get_user_meta( $current_user->ID , '_friends' , false ) );
					
	}
	
	/** 
	* @desc Retrieves a specific friend for the current user.
	* @return JSON - Returns a JSON error response if the user does not exist or if a request has already been sent or a JSON success message.
	*/	
	
	public function get_friend( $formData ) {	
				
		$current_user = get_user_by( 'id' , $formData["friendId"] );
				  
		$profile = get_user_meta( $current_user->ID , "profile", true );
		
		$user = array(	
						'id' => $current_user->ID,
						'username' => $current_user->data->user_login,
						'email' => $current_user->data->user_email,
						'face' => get_user_meta( $current_user->ID, "avatar", true ),
						'phone' => $profile["phone"],
						'location' => $profile["location"]
						);
				
		return array( "success" => true, "data" => $user );
					
	}
	
	/** 
	* @desc Retrieves a specific friend for the current user.
	* @return JSON - Returns a JSON error response if the user does not exist or if a request has already been sent or a JSON success message.
	*/	
	
	public function search_users( $formData ) {	
		
		$current_user = wp_get_current_user();
						
		$results = get_users( array( 'search' => '*'.$formData["query"].'*' ) );
		
		$users = array();        
        
		if ( count( $results ) < 10 && $formData["query"] != "" ) {	
					  
			foreach( $results as $user ) {
				
				if ( $user->ID != $current_user->ID && isset( $user->caps["group_effort"] ) && $user->caps["group_effort"] ) {
                    
                    $friends = get_user_meta( $user->ID , "_friends" );
                    
                    $areFriends = false;
                    
                    foreach ( $friends as $friend ) {
                                              
                       if( $friend["ID"] == $current_user->ID && $friend["status"] == "Request Accepted" ) {
                       
                           $areFriends = true;
                                    
                       }
                     
                   }  

                   if( !$areFriends ) {
                   
                       $profile = get_user_meta( $user->ID , "profile", true ); 
                           
                       $profile["phone"] = ( isset( $profile["phone"] ) ) ? $profile["phone"] : "";
                       $profile["location"] = ( isset( $profile["location"] ) ) ? $profile["location"] : "";
                       
                       $users[] = array(	
                                'id' => $user->ID,
                                'username' => $user->data->user_login,
                                'email' => $user->data->user_email,
                                'face' => get_user_meta( $user->ID, "avatar", true ),
                                'phone' => $profile["phone"],
                                'location' => $profile["location"],
                                'friends' => $friends
                                );
                            
                   }
							
				}
				
			}
		
		}
		
				
		return array( "success" => true, "data" => $users );
					
	}
	
	/** 
	* @desc Retrieves all the friends for the current user.
	* @return JSON - Returns a JSON error response if the user does not exist or if a request has already been sent or a JSON success message.
	*/	
	
	public function upload_photo( $formData ) {	
				
		$new_image_name = wp_get_current_user()->ID.".jpg";
		
		$test = move_uploaded_file( $_FILES["file"]["tmp_name"] , plugin_dir_path( dirname( __FILE__ ) ) . 'img/users/' . $new_image_name ); 
		
		error_log( json_encode( $test ) , 3, plugin_dir_path( dirname( __FILE__ ) ) . "class-group-effort-ajax-errors.log");	
		
		update_user_meta( wp_get_current_user()->ID, "avatar", plugins_url( 'group-effort/img/users/' ).$new_image_name );
		
		return array( "success" => $test , "data" => plugins_url( 'group-effort/img/users/' ).$new_image_name );
					
	}
	
	/** 
	* @desc Retrieves all the friends for the current user.
	* @return JSON - Returns a JSON error response if the user does not exist or if a request has already been sent or a JSON success message.
	*/	
	
	public function update_profile( $formData ) {			
		
		$current_user = wp_get_current_user();
						
		$formData = (array) json_decode( stripslashes( $formData["data"] ) );
						
		if ( ( $formData["email"] != $current_user->user_email ) && email_exists( $formData['email'] ) ) {
				
			return array( 'success' => false, 'reason' => "That Email is already being used." );
				
		}
		
		$user = array( 'ID' => $current_user->ID, 'user_email' => $formData["email"] );
		
		wp_update_user( $current_user->ID , $user );
		
		update_user_meta( $current_user->ID , "profile" , array( "location" => $formData["location"] , "phone" => $formData["phone"] ) );
		
		return array( "success" => true , "data" => $this->current_user() );
					
	}	
	
}
