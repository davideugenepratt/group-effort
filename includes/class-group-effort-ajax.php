<?php

class Group_Effort_Ajax {
	
	public function check_contributor( $effort ) {
		$user = wp_get_current_user();
		$contributors = get_post_meta( $effort, '_contributors', false ); 
		
		foreach ( $contributors as $contributor ) {		
			if( $contributor["id"] == $user->ID ) {
				return true;
			}
			
		}
		
		return false;
		
	}
	
	public function add_activity( $effort , $username , $activity , $comment ) {
		add_post_meta( $effort, 
						'_activity',
						array( 	'username' => $username,
								'activity' => $activity,
								'comment' => $comment,
								'time' => current_time( 'l, F jS, Y \a\t g:i A' )
						),
						false );		
	}
	
	public function group_effort_authenticate() {		
		echo "FALSE";
		die();
	}
	
	public function group_effort_already_logged_in() {
		$current_user = wp_get_current_user()->data;
		$user = array(	
						'id' => $current_user->ID,
						'username' => $current_user->user_login,
						'email' => $current_user->user_email,
						'face' => get_avatar( $current_user->ID )
						);
		
		echo json_encode( $user );
			
		die();
	}
	
 	public function group_effort_login() {
		$creds = array();
		$creds['user_login'] = $_GET["username"];
		$creds['user_password'] = $_GET["password"];
	 
		$user = wp_signon($creds, false);
		if (is_wp_error($user))
		{
			echo "FALSE";
			die();
		}
		 
		$current_user = array(	
						'id' => $user->ID,
						'username' => $user->data->user_login,
						'email' => $user->data->user_email,
						'face' => get_avatar( $user->ID )
						);
		
		echo json_encode( $current_user );
		
		die();
	}
	
	public function group_effort_register() {
		$creds = array();
		$creds['fullname'] = $_GET["fullname"];
		$creds['email'] = $_GET["email"];
		$creds['username'] = $_GET["username"];
		$creds['password'] = $_GET["password"];
	 
		$user_id = username_exists( $creds['username'] );
		if ( $user_id ) {
			echo "User already exists";
			// $user_id = wp_create_user( $creds['username'], $creds['password'], $creds['email'] );
		} elseif ( email_exists( $creds['email'] ) == true ) {
			echo "Email already exists";
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
			
			echo json_encode( $user );
		}
		
		die();
	}
	
	public function group_effort_logout() {
		wp_clear_auth_cookie();
		wp_logout();
		echo "You are logged out.";
		die();
	}
	
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
		
		echo $effort;
		
				
		die();
		
	}
	
	public function group_effort_get_effort() {
				
		if ( !$this->check_contributor( $_GET["id"] ) ) { die(); }
				
		$post = get_post( $_GET["id"] );
		
		$effort = array(
						'id' => $post->ID,
						'title' => $post->post_title,
						'contributors' => get_post_meta( $post->ID, '_contributors', false ),
						'activity' => get_post_meta( $post->ID, '_activity' )
						);
		
		echo json_encode( $effort );
		
		die();
		
	}
	
	public function group_effort_get_effort_tasks() {
		
		if ( !$this->check_contributor( $_GET["id"] ) ) { die(); }
		
		$tasks = get_post_meta( $_GET["id"], '_tasks', false );
		
		echo json_encode( $tasks );
		
		die();
		
	}
	
	public function group_effort_add_effort_task() {
		
		if ( !$this->check_contributor( $_GET["id"] ) ) { die(); }
		
		add_post_meta( $_GET["id"], '_tasks', json_decode( stripslashes( $_GET["task"] ) ), false );
					
		die();
		
	}
	
	public function group_effort_dibs() {
		
		if ( !$this->check_contributor( $_GET["id"] ) ) { die(); }
		
		$tasks = (array) get_post_meta( $_GET["id"], '_tasks', false );
		$task = (array) $tasks[ $_GET["task"] ];
		
		if ( !isset( $task['dibs'] ) || '' == $task['dibs'] ) {
			$task['dibs'] = wp_get_current_user()->ID;			
			update_post_meta( $_GET["id"] , '_tasks' , $task, $tasks[ $_GET["task"] ] );
			echo "TRUE";
		} elseif ( $task['dibs'] == wp_get_current_user()->ID ) {
			$task['dibs'] = '';
			update_post_meta( $_GET["id"] , '_tasks' , $task, $tasks[ $_GET["task"] ] );
			echo "TRUE";
		} else {
			echo $task['dibs'];		
		} 
		
		//add_post_meta( $_GET["id"], '_tasks', json_decode( stripslashes( $_GET["task"] ) ), false );
					
		die();
		
	}
	
	public function group_effort_get_effort_comments() {
		
		if ( !$this->check_contributor( $_GET["id"] ) ) { die(); }
		
		$comments = get_comments( 'post_id='.$_GET["id"] );
		
		foreach ( $comments as $comment ) {
			$comment->comment_date = date('l, F jS, Y \a\t g:i A', strtotime($comment->comment_date));	
		}				
				
		echo json_encode( $comments );
		
		die();
		
	}
	
	public function group_effort_add_effort_comment() {
		
		if ( !$this->check_contributor( $_GET["id"] ) ) { die(); }
		
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
		
	}
	
	public function group_effort_all_efforts() {
		
		$current_user = wp_get_current_user(); // $current_user->ID
				
		echo json_encode( get_user_meta( $current_user->ID , '_efforts' , false) );
		
		die();
		
	}
	
	public function group_effort_leave_effort() {
		
		if ( !$this->check_contributor( $_GET["id"] ) ) { die(); }
		
		$current_user = wp_get_current_user();
		$efforts = get_user_meta( $current_user->ID , '_efforts' , false);
				
		foreach ( $efforts as $key => $effort ) {
			if ( $effort["ID"] == $_GET["id"] ) {
				delete_user_meta( $current_user->ID, '_efforts', $effort );	
			}
		}
		
		$contributors = get_post_meta( $_GET["id"], '_contributors', false );
		
		foreach ( $contributors as $contributor ) {
			if ( $contributor["id"] == $current_user->ID ) {
				delete_post_meta( $_GET["id"], '_contributors', $contributor );
			}
		}
		
		$this->add_activity( $_GET["id"] , wp_get_current_user()->data->user_login , "left effort" , '' );
		
		die();
		
	}
	
	public function group_effort_add_friend() {					
		
		$current_user = wp_get_current_user();
		$user = get_user_by( 'email', $_GET["email"] );
				
		if ( $user && in_array( 'group_effort' , $user->roles ) ) {			
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
			echo "TRUE";
		} else {
			echo "FALSE";	
		}
		
		die();
		
	}
	
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
			echo "TRUE";
		} else {
			echo "FALSE";	
		}
		
		die();
		
	}
	
	public function group_effort_all_friends() {	
		
		$current_user = wp_get_current_user(); // $current_user->ID
				
		echo json_encode( get_user_meta( $current_user->ID , '_friends' , false) );
				
		die();
	
	}
	
	public function group_effort_remove_friend() {
		
		$current_user = wp_get_current_user();
		$user = get_user_by( 'email', $_GET["email"] );
		
		$friends = get_user_meta( $current_user->ID , '_friends' , false);				
		foreach ( $friends as $key => $friend ) {
			if ( $friend["email"] == $_GET["email"] ) {
				delete_user_meta( $current_user->ID, '_friends', $friend );	
			}
		}
		
		$friends = get_user_meta( $user->ID , '_friends' , false);			
		
		foreach ( $friends as $key => $friend ) {
			if ( $friend["email"] == $current_user->data->user_email ) {
				delete_user_meta( $user->ID, '_friends', $friend );	
			}
		}		
		
		die();
		
	}
	
	public function group_effort_edit_contributors() {									
		
		if ( !$this->check_contributor( $_GET["id"] ) ) { die(); }
				
		$newContributors = explode( ',' , $_GET["contributors"] );	
		
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
	
}