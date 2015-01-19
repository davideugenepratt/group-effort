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
  * group_effort_edit_contributors();
  * @author David Eugene Pratt - david@davideugenepratt.com
*/  

class Group_Effort_Ajax {
	
/** 
* @desc Builds a response for the AJAX operation.
* @params $success (bool) = Whether or not the operation is a success.
* @params $reason (string) = If unsuccessful, the reason why it was not a success.
* @return If not a member of the effort it returns an error response and exits the script.
*/	

	public function response() {
		
	}
	
/** 
* @desc Ensures the current user is listed in the list of an efforts contributors.
* @params $effort (int) = The id number of the effort to check.
* @return JSON - If not a member of the effort it returns a JSON error response and exits the script.
*/	
	
	public function check_contributor( $effort ) {
		
		$user = wp_get_current_user();
		
		$contributors = get_post_meta( $effort, '_contributors', false ); 
		
		$exists = false;
		
		foreach ( $contributors as $contributor ) {		
		
			if( $contributor["id"] == $user->ID ) {
				
				$exists = true;
				
			}
			
		}				
		
		if ( !$exists ) {
			
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
	
	public function add_activity( $effort , $username , $activity , $comment ) {
		
		$activity = array( 	'username' => $username,
								'activity' => $activity,
								'comment' => $comment,
								'time' => current_time( 'l, F jS, Y \a\t g:i A' )
						);
		
		add_post_meta( 	$effort, 
						'_activity',
						$activity,
						false );	
							
	} // Helper functions for the class

/** 
* @desc Is connected with the "_nopriv" ajax call so that if user is not logged in the login check will direct to here.
* @return JSON - Returns a JSON error response and exits the script.
*/
	
	public function group_effort_not_logged_in() {	
		
		echo json_encode( array( "success" => false, "reason" => "The user is not logged in." ) );
		
		die();
		
	}

/** 
* @desc Is connected to the "authenticate" ajax action.
* @return JSON - Returns a JSON success response with the current user's information.
*/
	
	public function group_effort_logged_in() {
		
		$current_user = wp_get_current_user()->data;
		
		$user = array(	
						'id' => $current_user->ID,
						'username' => $current_user->user_login,
						'email' => $current_user->user_email,
						'face' => get_avatar( $current_user->ID )
						);
		
		echo json_encode( array( "success" => true, "data" => $user ) );
			
		die();
		
	}

/** 
* @desc Logs in user using information from login screen in Ionic App.
* @params $_GET["username"] (string) = The username.
* @params $_GET["password"] (string) = The password.
* @return JSON - Returns a JSON error message if it could not log in or a JSON success message with the user data attached.
*/
	
 	public function group_effort_login() {
		
		$creds = array();		
		$creds['user_login'] = $_GET["username"];
		$creds['user_password'] = $_GET["password"];
	 
		$user = wp_signon($creds, false);
		
		if ( is_wp_error( $user ) ) {
			
			echo json_encode( array( "success" => false, "reason" => "Incorrect username/password combination." ) );
			
			die();
			
		}
		 
		$current_user = array(	
						'id' => $user->ID,
						'username' => $user->data->user_login,
						'email' => $user->data->user_email,
						'face' => get_avatar( $user->ID )
						);
		
		echo json_encode( array( "success" => true, "data" => $current_user ) );
		
		die();
	}
	
/** 
* @desc Logs the current user out of the system.
* @return JSON - returns a JSON success message.
*/
	
	public function group_effort_logout() {
		
		wp_clear_auth_cookie();
		
		wp_logout();
		
		echo json_encode( array( "success" => true ) );
		
		die();
		
	}

/** 
* @desc Registers a new user.
* @params $_GET["fullname"] (string) = The username.
* @params $_GET["email"] (string) = The username.
* @params $_GET["username"] (string) = The username.
* @params $_GET["password"] (string) = The password.
* @return JSON - Returns a JSON error response if the username or email exists or a JSON success message with the created user data attached.
*/
	
	public function group_effort_register() {
		
		$creds = array(	'fullname' => $_GET["fullname"],
						'email' => $_GET["email"],
						'username' => $_GET["username"],
						'password' => $_GET["password"]
						
						);
		
		$user_id = username_exists( $creds['username'] );
		
		if ( $user_id ) {
			
			echo json_encode( array( 'success' => 'false', 'reason' => "User already exists." ) );
			
		} elseif ( email_exists( $creds['email'] ) == true ) {
			
			echo json_encode( array( 'success' => 'false', 'reason' => "Email already exists." ) );
			
		} else {
			
			$user_id = wp_create_user( $creds['username'], $creds['password'], $creds['email'] );
			
			wp_update_user( array( 'ID' => $user_id, 'first_name' => $creds['fullname'], 'role' => 'group_effort' ) );	
			
			$this->group_effort_login();
					
			$current_user = wp_get_current_user()->data;
			
			$user = array(	
							'id' => $current_user->ID,
							'username' => $current_user->user_login,
							'email' => $current_user->user_email,
							'face' => get_avatar( $current_user->ID )
							);
							
			echo json_encode( array( 'success' => true, 'data' => $user ) );
			
		}
		
		die();
		
	} // All the authentification functions

/** 
* @desc Returns all the efforts attached to the current user.
* @return JSON - Returns a JSON success message with the current user's efforts attached.
*/

	public function group_effort_all_efforts() {
		
		$current_user = wp_get_current_user(); // $current_user->ID
				
		echo json_encode( array( "success" => true, "data" => get_user_meta( $current_user->ID , '_efforts' , false) ) );
		
		die();
		
	}
	
/** 
* @desc Adds a new effort and attaches it to the current user.
* @params $_GET["contributors"] (string) = A comma seperated list of contributors to attach to effort.
* @params $_GET["title"] (string) = The title of the effort to be created.
* @return JSON - Returns a JSON error response if the username or email exists or a JSON success message with the created user data attached.
*/
	
	public function group_effort_add_effort() {
		
		$contributors = json_decode( stripslashes( $_GET["contributors"] ) );

		$post = array(
			'post_title' => $_GET["title"],
			'post_status' => 'publish',
		  	'post_type'      => 'group-effort'  // Default 'post'.
		);						 		
		
		$effort = wp_insert_post( $post );
		
		$current_user = wp_get_current_user();
				
		add_post_meta( $effort, '_contributors', array( 'id' => $current_user->ID, 'username' => $current_user->user_login, 'face' => get_avatar( $current_user->ID ), 'role' => 'admin' ), false ); 
		
		$this->add_activity( $effort , wp_get_current_user()->data->user_login , "created effort" , $_GET["title"] );
			
		add_user_meta( $current_user->ID, '_efforts', array(	'ID' => $effort,
																'title' => $post['post_title'],
																'activity' => 0 ),
																false ); 
		
		
		if ( is_array(  $contributors ) ) {
			
			foreach( $contributors as $contributor => $status ) {
				
				if ( $status ) {
					
					$user = get_user_by( 'login', $contributor );		
							
					add_post_meta( $effort, '_contributors', array( 'id' => $user->ID, 'username' => $user->data->user_login, 'face' => get_avatar( $user->ID ), 'role' => 'contributor' ), false ); 
					
					add_user_meta( $user->ID, '_efforts', array(	'ID' => $effort,
																	'title' => $post['post_title'],
																	'activity' => 0 ),
																	false ); 
					
				}
				
			}
			
		}
		
		echo json_encode( array( "success" => true, "data" => $effort ) );
		
		die();
		
	}
	
/** 
* @desc Removes current user from the specified effort.
* @params $_GET["id"] (int) = The id of the requested effort.
* @return No response.
*/	
	
	public function group_effort_leave_effort() {
				
		$current_user = wp_get_current_user();
		
		$efforts = get_user_meta( $current_user->ID , '_efforts' , false);
						
		foreach ( $efforts as $key => $effort ) {
			
			if ( $effort["ID"] == $_GET["id"] ) {
				
				delete_user_meta( $current_user->ID, '_efforts', $effort );	
				
				$tasks = get_post_meta( $_GET["id"], '_tasks', false );
				
				foreach ( $tasks as $task ) {
					
					if ( $task["dibs"] == $current_user->ID ) {
						
						$newTask = $task;
						
						$newTask["dibs"] = null;
						
						update_post_meta( $_GET["id"], '_tasks', $newTask, $task );
						
					}
					
				}
				
				$contributors = get_post_meta( $_GET["id"], '_contributors', false );
				
				foreach ( $contributors as $contributor ) {
					
					if ( $contributor["id"] == $current_user->ID ) {
						
						delete_post_meta( $_GET["id"], '_contributors', $contributor );
						
					}
					
				}		
						
				$this->add_activity( $_GET["id"] , wp_get_current_user()->data->user_login , "left effort" , '' );
								
			} 
			
		}
								
		die();
		
	}	

/** 
* @desc Edits the contributors of a specific effort.
* @params $_GET["id"] (int) = The id of the requested effort.
* @params $_GET["contributors"] (string) = A comma seperated list of all the contributors to be assigned to the effort.
* @return JSON - Returns a JSON error response if the user does not belong to the effort or a JSON success message with the effort data.
*/

	public function group_effort_edit_contributors() {									
		
		$this->check_contributor( $_GET["id"] );$newContributors = explode( ',' , $_GET["contributors"] );	
		
		$post = get_post( $_GET["id"] );					
		
		$oldContributors = get_post_meta( $_GET["id"], '_contributors', false );
				
		$owner = $oldContributors[0];
		
		foreach ( $oldContributors as $contributor ) {
			
			$oldList[] = $contributor["username"];	
			
		}
				
		delete_post_meta( $_GET["id"], '_contributors' );
		
		add_post_meta( $_GET["id"], '_contributors', $owner , false );				
		
		$toRemove = array_diff(  $oldList , $newContributors , array( $owner["username"] ) );	
		
		if ( count( $toRemove ) != 0 ) {
			
			foreach( $toRemove as $oldUser ) {		
						
				$user = get_user_by( 'login', $oldUser );	
						
				$userEfforts = get_user_meta( $user->ID, '_efforts' );	
						
				foreach( $userEfforts as $effort ) { 
				
					if ( $effort["ID"] == $_GET["id"] ) {
						
						delete_user_meta( $user->ID, '_efforts', $effort );
												
					}
					
				}
				
			}
			
		}
		
		$added = array();
		
		if 	( $_GET["contributors"] != '' ) {
			
			foreach( $newContributors as $contributor ) {
				
				$user = get_user_by( 'login', $contributor );
							
				$userEfforts = get_user_meta( $user->ID, '_efforts' );	
						
				$hasEffort = false;
				
				foreach( $userEfforts as $effort ) { 
				
					if ( $effort["ID"] == $_GET["id"] ) {
						
						$hasEffort = true;
						
					}
					
				}
				
				if ( $hasEffort == false ) {
					
					add_user_meta( 	$user->ID,
									'_efforts', 
									array(	'ID' => $_GET["id"],
											'title' => $post->post_title,
											'activity' => 0 ),
											false );
											
					$added[] = 	$contributor;		
						
				}
				
				add_post_meta( $_GET["id"], '_contributors', array( 'id' => $user->ID, 'username' => $user->user_login, 'face' => get_avatar( $user->ID ), 'role' => 'admin' ) , false ); 
				
			}
			
		}
		
		$removed = ( count( $toRemove ) > 0 ) ? "removed ".implode( ', ' , $toRemove ) : '';
		
		$added = ( ( count( $added ) > 0 ) && ( $added[0] != '' ) ) ? "added ".implode( ', ' , $added ) : '';
		
		$connector = ( ($removed != '' ) && ( $added != '' ) ) ? ' and ' : '';
		
		$comment = $removed.$connector.$added;
			
		$this->add_activity( $_GET["id"] , wp_get_current_user()->data->user_login , "changed contriubtors;" , $comment );							
				
		die();
			
	}

/** 
* @desc Gets the specified effort.
* @params $_GET["id"] (int) = The id of the requested effort.
* @return JSON - Returns a JSON error response if the user does not belong to the effort or a JSON success message with the effort data.
*/
	
	public function group_effort_get_effort() {
				
		$this->check_contributor( $_GET["id"] );
		
		$post = get_post( $_GET["id"] );
		
		$effort = array(
						'id' => $post->ID,
						'title' => $post->post_title,
						'contributors' => get_post_meta( $post->ID, '_contributors', false ),
						'activity' => get_post_meta( $post->ID, '_activity' )
						);
		
		echo json_encode( array( "success" => true, "data" => $effort ) );
		
		die();
		
	}
	
/** 
* @desc Gets the specified effort's tasks.
* @params $_GET["id"] (int) = The id of the requested effort.
* @return JSON - Returns a JSON error response if the user does not belong to the effort or a JSON success message with the effort's tasks.
*/	
	
	public function group_effort_get_effort_tasks() {
		
		$this->check_contributor( $_GET["id"] );
		
		$tasks = get_post_meta( $_GET["id"], '_tasks', false );
		
		echo json_encode( array( "success" => true, "data" => $tasks ) );
		
		die();
		
	}
	
/** 
* @desc Adds a task to the specified effort.
* @params $_GET["id"] (int) = The id of the requested effort.
* @return No response..
*/	
	
	public function group_effort_add_effort_task() {
		
		$this->check_contributor( $_GET["id"] );
		
		$task = (array) json_decode( stripslashes( $_GET["task"] ) );			
						
		add_post_meta( $_GET["id"], '_tasks', $task, false );
		
		$this->add_activity( $_GET["id"] , wp_get_current_user()->data->user_login , "added a task:" , $task["title"] );
					
		die();
		
	}
	
/** 
* @desc Let's a user call "dibs" on the specified task.
* @params $_GET["id"] (int) = The id of the requested effort.
* @params $_GET["task"] (int) = The index of the task that the user wants to call dibs on.
* @return No response..
*/		
	
	public function group_effort_dibs() {
		
		$this->check_contributor( $_GET["id"] );
		
		$tasks = (array) get_post_meta( $_GET["id"], '_tasks', false );
		
		$task = (array) $tasks[ $_GET["task"] ];
		
		if ( ( !isset( $task['dibs'] ) || '' == $task['dibs'] ) ) {
			
			$task['dibs'] = wp_get_current_user()->ID;		
				
			update_post_meta( $_GET["id"] , '_tasks' , $task, $tasks[ $_GET["task"] ] );
			
			$this->add_activity( $_GET["id"] , wp_get_current_user()->data->user_login , "called dibs on" , $task["title"] );
			
			echo json_encode( array( "success" => true ) );
			
		} elseif ( $task['dibs'] == wp_get_current_user()->ID ) {
			
			$task['dibs'] = '';
			
			update_post_meta( $_GET["id"] , '_tasks' , $task, $tasks[ $_GET["task"] ] );
			
			$this->add_activity( $_GET["id"] , wp_get_current_user()->data->user_login , "no longer has dibs on" , $task["title"] );
			
			echo json_encode( array( "success" => true ) );
			
		} else {
			
			echo json_encode( array( "success" => false, "data" => $task['dibs'] ) );
				
		} 
							
		die();
		
	}

/** 
* @desc Let's a user change the finished status of the task.
* @params $_GET["id"] (int) = The id of the requested effort.
* @params $_GET["task"] (int) = The index of the task that the user wants to call dibs on.
* @return JSON - A JSON success message with the task attached as data.
*/
	
	public function group_effort_change_task_status() {
		
		$this->check_contributor( $_GET["id"] );
		
		$tasks = get_post_meta( $_GET["id"], '_tasks', false );
		
		$task = (array) $tasks[ $_GET["task"] ];
		
		$newTask = $task;
		
		$newTask['finished'] = 	json_decode( $_GET["finished"] );			
		
		$action = ( $newTask['finished'] ) ? 'finished' : 'removed finished status of';
		
		$this->add_activity( $_GET["id"] , wp_get_current_user()->data->user_login , $action.' the task' , $task["title"] );
		
		update_post_meta( $_GET["id"] , '_tasks' , $newTask, $task );
		
		echo json_encode( array( "success" => true, "data" => $newTask ) );
					
		die();
		
	}
	
/** 
* @desc Gets all the comments for the specified effort.
* @params $_GET["id"] (int) = The id of the requested effort.
* @return JSON - A JSON success message with the task attached as data.
*/
	
	public function group_effort_get_effort_comments() {
		
		$this->check_contributor( $_GET["id"] );
		
		$comments = get_comments( 'post_id='.$_GET["id"] );
		
		foreach ( $comments as $comment ) {
			
			$comment->comment_date = date( 'l, F jS, Y \a\t g:i A' , strtotime( $comment->comment_date ) );	
			
		}				
				
		echo json_encode( array( "success" => true , "data" => $comments ) );
		
		die();
		
	}

/** 
* @desc Gets all the comments for the specified effort.
* @params $_GET["id"] (int) = The id of the requested effort.
* @params $_GET["comment"] (string) = The comment to be added.
* @return No response.
*/
	
	public function group_effort_add_effort_comment() {
		
		$this->check_contributor( $_GET["id"] );
		
		$current_user = wp_get_current_user();		
		
		$commentdata = array(
								'comment_post_ID' => $_GET["id"],
								'comment_author' => $current_user->data->user_login, 
								'comment_author_email' => $current_user->data->user_email, 
								'comment_author_url' => $current_user->data->user_url,  
								'comment_content' => $_GET["comment"],
								'comment_type' => '',
								'comment_parent' => '',
								'user_id' => $current_user->data->ID,
								'comment_author_IP' => ''
							);
		
		$this->add_activity( $_GET["id"] , wp_get_current_user()->data->user_login , "commented" , ' on '.get_post( $_GET["id"] )->post_title );
		
		$comment_id = wp_new_comment($commentdata);
						
		die();
		
	} // All effort functions
	
/** 
* @desc Sends a new request to the specified user.
* @params $_GET["email"] (string) = The username.
* @return JSON - Returns a JSON error response if the user does not exist or if a request has already been sent or a JSON success message.
*/
	
	public function group_effort_add_friend() {					
		
		$current_user = wp_get_current_user();
		
		$user = get_user_by( 'email', $_GET["email"] );
		
		$friends = get_user_meta( $current_user->ID, '_friends', false );
		
		$is_friend = false;
		
		foreach ( $friends as $friend ) {
			
			if ( $friend['email'] == $_GET["email"] ) {
				
				$is_friend = true;
				
			}
			
		}
		
		if ( !$user ) {
			
			echo json_encode( array( "success" => false, "reason" => "There is not a GroupEffort user with the email address ".$_GET["email"] ) );
			
		} else if ( $is_friend ) {
			
			echo json_encode( array( "success" => false, "reason" => "You have already sent a request to ".$_GET["email"] ) );
			
		} elseif ( $user && in_array( 'group_effort' , $user->roles ) ) {	
				
			add_user_meta( $current_user->ID, '_friends', array(	'ID' => $user->ID,
														'email' => $user->user_email,
														'username' => $user->user_login,
														'face' => get_avatar( $user->ID ),
														'status' => 'Request Sent' ),
														false ); 
														
			add_user_meta( $user->ID, '_friends', array(	'ID' => $current_user->ID,
														'email' => $current_user->user_email,
														'username' => $current_user->user_login,
														'face' => get_avatar( $current_user->ID ),
														'status' => 'Request Received' ),
														false );
																									
			echo json_encode( array( "success" => true ) );
			
		} 
		
		die();
		
	}

/** 
* @desc Accepts a request from the specified user.
* @params $_GET["email"] (string) = The email of the user whos request is to be accepted.
* @return JSON - Returns a JSON error response if the user does not exist or if a request has already been sent or a JSON success message.
*/
	
	public function group_effort_accept_request() {		
	
		$current_user = wp_get_current_user();
		
		$user = get_user_by( 'email', $_GET["email"] );
				
		if ( $user && in_array( 'group_effort' , $user->roles ) ) {				
					
			update_user_meta( $current_user->ID, '_friends', array(	'ID' => $user->ID,
														'email' => $user->data->user_email,
														'username' => $user->data->user_login,
														'face' => get_avatar( $user->ID ),
														'status' => 'Request Accepted' ),
														
														array(	'ID' => $user->ID,
														'email' => $user->data->user_email,
														'username' => $user->data->user_login,
														'face' => get_avatar( $user->ID ),
														'status' => 'Request Received' ) ); 
														
			update_user_meta( $user->ID, '_friends', array(	'ID' => $current_user->data->ID,
														'email' => $current_user->data->user_email,
														'username' => $current_user->data->user_login,
														'face' => get_avatar( $current_user->ID ),
														'status' => 'Request Accepted' ),
														
														array(	'ID' => $current_user->ID,
														'email' => $current_user->data->user_email,
														'username' => $current_user->data->user_login,
														'face' => get_avatar( $current_user->ID ),
														'status' => 'Request Sent' ) );		
																							
			echo json_encode( array( "success" => true ) );
			
		} 
		
		die();
		
	}

/** 
* @desc Removes a friend from the list of friends.
* @params $_GET["email"] (string) = The email of the user whos request is to be removed.
* @return JSON - Returns a JSON error response if the user does not exist or if a request has already been sent or a JSON success message.
*/

	public function group_effort_remove_friend() {
		
		echo 'test';
		
		$current_user = wp_get_current_user();
		
		$user = get_user_by( 'email', $_GET["email"] );
		
		$friends = get_user_meta( $current_user->ID , '_friends' , false);	
					
		foreach ( $friends as $key => $friend ) {
			
			if ( $friend["email"] == $_GET["email"] ) {
				
				delete_user_meta( $current_user->ID, '_friends', $friend );	
				
				if ( "Request Received" == $friend["status"] ) {
					
					echo json_encode( array( "success" => true, "data" => "Request has been removed." ) );
					
				} else {
					
					echo json_encode( array( "success" => true, "data" => "User has been removed from your network." ) );	
					
				}
				
			}
			
		}
		
		$friends = get_user_meta( $user->ID , '_friends' , false);			
		
		foreach ( $friends as $key => $friend ) {
			
			var_dump( $friend );
			
			if ( $friend["email"] == $current_user->data->user_email ) {
				
				delete_user_meta( $user->ID, '_friends', $friend );	
				
				if ( "Request Sent" == $friend["status"] ) {
					
					echo json_encode( array( "success" => true, "data" => "Request has been removed." ) );
					
				} else {
					
					echo json_encode( array( "success" => true, "data" => "User has been removed from your network." ) );	
					
				}
				
			}
			
		}		
		
		die();
		
	}
	
/** 
* @desc Retrieves all the friends for the current user.
* @return JSON - Returns a JSON error response if the user does not exist or if a request has already been sent or a JSON success message.
*/	
	
	public function group_effort_all_friends() {	
		
		$current_user = wp_get_current_user();
				
		echo json_encode( array( "success" => true, "data" => get_user_meta( $current_user->ID , '_friends' , false ) ) );
				
		die();
	
	}
	

	

	
}