angular.module('GroupEffort.services', [])

.factory( 'Popup' , function( $rootScope, $ionicPopup ) {
	var error = function() {
		$rootScope.$watch( function(scope) { return scope.error } , function() {
			if ( $rootScope.error ) {
				var errorPopup = $ionicPopup.show({
					template: $rootScope.error,
					title: 'Uh Oh',
					scope: $rootScope,
					buttons: [
					  { text: 'OK' }				  
					]
				  });
				errorPopup.then( function(res) {
					$rootScope.error = undefined;
				  });  		  			  
			}
		});
	};
	
	var alert = function( title, message ) {
		var alertPopup = $ionicPopup.show({
			template: message,
			title: title,
			scope: $rootScope,
			buttons: [
			  { text: 'OK' }				  
			]
		  });
		alertPopup.then( function(res) {
			
		  });  		  			  

	};
	
	var confirm = function( message ) {
		   var confirmPopup = $ionicPopup.confirm({
			 title: 'Please Confirm',
			 template: message
		   });
		   
		   return confirmPopup.then( function(res) {
			 return res;
		   });
	 };
	 
	 var addEffort = function( friends ) {
		 	$rootScope.data = {};
			$rootScope.data.friends = {};
		 	list = '<ion-item class="item"><b>Effort Title</b><br><input type="text" placeholder="Title" ng-model="data.title"></ion-item>';			
			for( var i = 0; i < friends.length; i++ ) {
				list += '<ion-item  class="item-avatar" >'+friends[i].face+'<h2>'+friends[i].username+'</h2>'+'<p>'+friends[i].email+'</p><label class="toggle"><input type="checkbox" ng-model="data.friends.'+friends[i].username+'" ><div class="track"><div class="handle"></div></div></label></ion-item>';
			}
					 
	   var addEffortPopup = $ionicPopup.show({
		   title : 'Add New Effort',
			 template: list,
			 scope: $rootScope,
			buttons: [
			  { text: 'Cancel',
				onTap: function(e) {
					return false;
				}
			  },
			  {
				text: '<b>OK</b>',
				type: 'button-positive',
				onTap: function(e) {
					if ( null != $rootScope.data.title ) {
						return $rootScope.data;
					} else {						
						$rootScope.error = "Title can't be blank";
						return false;
					}
				}
			  }
			]
		   });
		   
		   return addEffortPopup.then( function(res) {
			 return res;
		   });
	 };  
	 
	 var friendsList = function( friends, current ) {
		 	 		  
			list = '';
			$rootScope.data = {};
			$rootScope.data.friends = {};
			for( var i = 0; i < friends.length; i++ ) {
				friend = {};
				var selected = 'ng-checked="false"';
				for( var a = 0; a < current.length; a++ ) {
					if ( friends[i].ID == current[a].id ) {
						selected = 'ng-checked="true"';
						$rootScope.data.friends[friends[i].username] = true;
					}
				}
				if ( friends[i].status == "Request Accepted" ) {
					list += '<ion-item  class="item-avatar" >'+friends[i].face+'<h2>'+friends[i].username+'</h2>'+'<p>'+friends[i].email+'</p><label class="toggle"><input type="checkbox" '+selected+' ng-model="data.friends.'+friends[i].username+'" ><div class="track"><div class="handle"></div></div></label></ion-item>';
				}
			}
					 
		   var friendsListPopup = $ionicPopup.show({
			 title: 'Add Friend',
			 template: list,
			 scope: $rootScope,
			buttons: [
			  { text: 'Cancel',
				onTap: function(e) {
					return false;
				}
			  },
			  {
				text: '<b>OK</b>',
				type: 'button-positive',
				onTap: function(e) {
					return $rootScope.data.friends;
				}
			  }
			]
		   });
		   
		   return friendsListPopup.then( function(res) {
			 return res;
		   });
	 };  			  
	
	
	return {
		error : error,
		confirm : confirm,
		alert : alert,
		addEffort : addEffort,
		friendsList : friendsList
	}
	
})

.factory( 'Authenticate' , function( $rootScope , $http, $location, $state ) {
	
	var authenticate = function() {
		
		var check = function() {
			return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_authenticate" )
			.then( function( response ) {
				if ( "FALSE" == response.data ) {						
					return false;
				} else {
					$rootScope.user = response.data;
					return true;
				}										
			},
			function( result ) {
				$rootScope.error = 'Could Not Connect';
				return result.data;	
			});							
		};
		
		if ( null == $rootScope.loggedIn ) {
			return check().then( function( loggedIn ) {
				if ( !loggedIn ) {
					// not going to #login, we should redirect now
					if ( '/login' == $location.path() )  {
						// Do Nothing
					} else if ( '/register' == $location.path() )  {
						$state.go('register');
					} else if ( '/login' != $location.path() ) {
						$state.go('login');
					}
					return false;
				} else {				
					$rootScope.loggedIn = true;					
					if ( '/login' == $location.path() || '/register' == $location.path()  )  {
						$state.go('tab.dash');
					}
				}
			});
			} else if ( true == $rootScope.loggedIn ) {
				  if ( '/login' == $location.path() || '/register' == $location.path()  )  {
					$state.go('tab.dash');
				  }
			  }
			  
	};
	
	var validateRegister = function( fullname, email, username , password, passwordRetype ) {
	
		var validateEmail = function( email ) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test( email );
		};
		
		if ( null == fullname ) {
			$rootScope.error = "Full Name can not be empty";			
			return false;
		} else if ( !validateEmail( email ) ) {			
			$rootScope.error = "Invalid Email Address";			
			return false;
		} else if ( null == username ) {			
			$rootScope.error = "Username can not be empty";			
			return false;
		} else if ( 7 >= password.length ) {
			$rootScope.error = "Passwords must be 8 characters or more";			
			return false;
		} else if ( password != passwordRetype ) {
			$rootScope.error = "Passwords must match";			
			return false;
		} else {
			return true;
		}		
		
	};			
	
	var login = function( username , password ) {
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_login&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password) )
		.then( function( response ) {
			if ( "FALSE" == response.data ) {						
				return false;
			} else {				
				$rootScope.loggedIn = true;
				$rootScope.user = response.data;
				return true;
			}										
		},
		function( result ) {
			$rootScope.loggedIn = false;
			$rootScope.error = 'Could Not Connect';
			return false;	
		});
	};
	
	var logout = function() {		
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_logout" )
		.then( function( response ) {
			$rootScope.loggedIn = false;
			return true;								
		},
		function( result ) {
			$rootScope.loggedIn = true;
			$rootScope.error = 'Could Not Connect';
			return false;	
		});
	};
	
	var register = function( fullname, email, username , password, passwordRetype ) {
								
		return $http.get( 	$rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_register" +
						"&fullname=" + encodeURIComponent(fullname) + 
						"&email=" + encodeURIComponent(email) + 
						"&username=" + encodeURIComponent(username) + 
						"&password=" + encodeURIComponent(password) 						
						)
		.then( function( response ) {
			if ( "TRUE" == response.data ) {						
				$rootScope.loggedIn = true;				
				return true;
			} else {
				$rootScope.error = response.data;
				return false;
			}										
		},		
		function( result ) {
			$rootScope.loggedIn = false;
			$rootScope.error = 'Could Not Connect';
			return false;	
		});
		
	};
	
	return {
		authenticate : authenticate,
		login : login,
		validateRegister : validateRegister,
		register : register,
		logout : logout
	}
})

.factory('Efforts', function( $rootScope, $http ) {
  // Might use a resource here that returns a JSON array
	var addEffort = function( title , contributors ) {		
		return $http.get( $rootScope.baseURL + 	"wp-admin/admin-ajax.php?action=ge_addEffort" + 
												"&title=" + title +
												"&contributors=" + JSON.stringify( contributors ) 
												)
		.then( function( response ) {
			return response.data;
		},
		function( result ) {
			$rootScope.error = 'Could Not Connect';
			return false;	
		});
	};
	
	var leaveEffort = function( id ) {	
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_leaveEffort&" +
												"id="+id )
		.then( function( response ) {
			return response.data;
		},
		function( result ) {
			$rootScope.error = 'Could Not Connect';
			return false;	
		});
	};
	
	var getEffort = function( id ) {
		console.log( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_getEffort&" +
												"id="+id );	
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_getEffort&" +
												"id="+id )
		.then( function( response ) {
			return response.data;
		},
		function( result ) {
			$rootScope.error = 'Could Not Connect';
			return false;	
		});
	};
	
	var getEffortTasks = function( id ) {
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_getEffortTasks&" +
												"id="+id )
		.then( function( response ) {
			return response.data;
		},
		function( result ) {
			$rootScope.error = 'Could Not Connect';
			return false;	
		});
	};
	
	var addEffortTask = function( id , task ) {

		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_addEffortTask" +
												"&id=" + id +
												"&task=" + encodeURIComponent( JSON.stringify( task ) ) )
		.then( function( response ) {
			return response.data;
		},
		function( result ) {
			$rootScope.error = 'Could Not Connect';
			return false;	
		});
		
	};
	
	var dibs = function( id , task ) {

		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_dibs" +
												"&id=" + id +
												"&task=" + task )
		.then( function( response ) {
			return response.data;
		},
		function( result ) {
			$rootScope.error = 'Could Not Connect';
			return false;	
		});
		
	};
	
	var getEffortComments = function( id ) {
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_getEffortComments&" +
												"id="+id )
		.then( function( response ) {
			return response.data;
		},
		function( result ) {
			$rootScope.error = 'Could Not Connect';
			return false;	
		});
	};
	
	var addEffortComment = function( id , comment ) {

		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_addEffortComment" +
												"&id=" + id +
												"&comment=" + encodeURIComponent(comment) )
		.then( function( response ) {
			return response.data;
		},
		function( result ) {
			$rootScope.error = 'Could Not Connect';
			return false;	
		});
		
	};
	
	
	
	var allEfforts = function() {	
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_allEfforts" )
		.then( function( response ) {
			return response.data;
		},
		function( result ) {
			$rootScope.error = 'Could Not Connect';
			return false;	
		});
	};
	
	var editContributors = function( contributors, id ) {		
		
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
	getEffortComments : getEffortComments,
	addEffortComment : addEffortComment,
	getEffortTasks : getEffortTasks,
	addEffortTask : addEffortTask,
	dibs : dibs
  }
})

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function( $rootScope, $http, $state, Popup ) {
  // Might use a resource here that returns a JSON array
	var allFriends = function() {	
		return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_allFriends" )
		.then( function( response ) {
			return response.data;
		},
		function( result ) {
			$rootScope.error = 'Could Not Connect';
			return false;	
		});
	};
	
	var validateFriend = function( email, friends ) {
	
		var validateEmail = function( email ) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test( email );
		};
		
		if ( null == email ) {
			$rootScope.error = "Email can not be empty";			
			return false;
		} else if ( !validateEmail( email ) ) {			
			$rootScope.error = "Invalid Email Address";			
			return false;
		} else if ( $rootScope.user.email == email ) {			
			$rootScope.error = "This is your own email address";			
			return false;
		} else {
			for ( var i = 0; i < friends.length; i++ ) {
				if ( friends[i]["email"] == email ) {
					if ( friends[i]["status"] == "Request Sent" ) {
						$rootScope.error = "You've already sent a request to that email.";						
					} else if ( friends[i]["status"] == "Request Received" ) {
						$rootScope.error = "You've already sent a request to that email.";						
					} else if ( friends[i]["status"] == "Request Accepted" ) {
						$rootScope.error = "You're already friends with that person.";						
					}
					return false;	
				}
			}
		}
		
		return true;		
		
	};
  
  var addFriend = function( email, friends ) {
	  
	  //!! Need to make sure they are not already friends !!!!!//
	  if ( validateFriend( email, friends ) ) {
		  return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_addFriend&" +
													"email="+ email )
			.then( function( response ) {
				return response.data;			
			},
			function( result ) {
				$rootScope.error = 'Could Not Connect';
				return false;	
			});
	  }
  };
  
  var acceptRequest = function( email ) {
	  return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_acceptRequest&" +
													"email="+ email )
		.then( function( response ) {
			return response.data;			
		},
		function( result ) {
			$rootScope.error = 'Could Not Connect';
			return false;	
		});
	  
  };
  
  var denyRequest = function( email ) {
	  return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=ge_removeFriend&" +
													"email="+ email )
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
	denyRequest : denyRequest
  }
});
