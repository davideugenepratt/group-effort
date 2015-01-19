angular.module('GroupEffort.controllers', [ 'GroupEffort.services' ])

.controller('TabCtrl', function( $rootScope, $scope, $state, $ionicPopup, $ionicHistory, Authenticate, loggedIn ) {		
	
	if ( !loggedIn ) {
		
		$state.go( 'login' );
			
	}
	
	$scope.goToEfforts = function() {
	
		$state.go( 'tab.efforts' );	
	
	};
	
	$rootScope.tabs = true;
	
	console.log( $rootScope.user );
	
})

.controller('LoginCtrl', function( $rootScope, $scope, $state, Authenticate ) {
	
	$rootScope.tabs = false;
		
	if ( $rootScope.loggedIn ) {
		
		$state.go( 'tab.efforts' );
		
		$rootScope.tabs = true;
			
	}
		
	$scope.data = {};
	
	$scope.data.submitted = false;
	
	$scope.login = function() {
		
		console.log( 'logging in');
		
		var username = $scope.data.username;
		
    	var password = $scope.data.password;
				
		Authenticate.login( username, password ).then( function(result ) {
			
			if ( result ) {
				
				$rootScope.loggedIn = true;								
				
				$state.go('tab.efforts');
				
				$rootScope.tabs = true;
								
			} else {
				
				$rootScope.loggedIn = false;
				
				$scope.data.submitted = false;
								
			}
			
		});
		
	};
	
})

.controller('RegisterCtrl', function( $rootScope, $scope, $state, Authenticate ) {
	
	$rootScope.tabs = false;
	
	$scope.data = {};
	$scope.register = function() {
		var fullname = $scope.data.fullname;
		var email = $scope.data.email;
		var phone = $scope.data.phone;
		var username = $scope.data.username;
    	var password = $scope.data.password;
		Authenticate.register( fullname, email, username , password ).then( function( result ) {			
			if ( false != result ) {
				$rootScope.loggedIn = true;
				$rootScope.user = result;
				$scope.data.submitted = false;
				console.log( $rootScope.user );
				$state.go('tab.account');	
			} else {
				$rootScope.loggedIn = false;
				$scope.data.submitted = false;
			}
		});		
	};
})

.controller('EffortsCtrl', function( $rootScope, $scope, $state, Popup, Efforts, Friends, efforts ) {
		
	$scope.efforts = efforts;
	
})

.controller('EffortsDetailNewCtrl', function( $rootScope, $scope, $state, $sce, Popup, Efforts, Friends, friends  ) {
	
	$scope.data = {};
	
	$scope.addEffort = function() {
		
		Efforts.addEffort( $scope.data.title , $scope.data.friends ).then( function( result ) {
			
			$state.go( 'tab.effort-detail-tasks' , { effortId : result.data } );
			
		});
		
	}
	
	$scope.friends = friends;
	
})

.controller('EffortsDetailNotesCtrl', function( $rootScope, $scope, $state, Popup, Efforts, effort  ) {

	effort.activity.reverse();
	
	$scope.effort = effort;	
	
})

.controller('EffortsDetailActivityCtrl', function( $rootScope, $scope, $state, Popup, Efforts, effort  ) {
	console.log( effort );
	effort.activity.reverse();
	$scope.effort = effort;	
})

.controller('EffortsDetailTasksCtrl', function( $rootScope, $scope, $state, Popup, Efforts, effort  ) {
	
	for ( var i = 0; i < effort.contributors.length; i++ ) {
		
		if ( effort.contributors[i]["id"] == $rootScope.user.id ) {						
			
			$scope.self = effort.contributors[i];
		
		}
		
	}
		
	effort.activity.reverse();	
	
	$scope.effort = effort;	
		
})

.controller('EffortsDetailSettingsCtrl', function( $rootScope, $scope, $state, Popup, Efforts, Friends, effort, friends  ) {
	
	$scope.data = {};
			
	$scope.deleteEffort = function( id ) {
		
		if ( effort.contributors.length == 1 ) {
			
			Popup.confirm( "Real quick before you leave ..." , "You're the only one involved in this effort, if you leave this effort it will be deleted." ).then( function( confirm ) {
				
				if ( confirm ) {
					
					Efforts.leaveEffort( id ).then( function( result ) {
												
						Popup.alert( "Ok, you did it," , "You have left the effort" );
						
						$state.go( 'tab.efforts' );
						
					});
					
				}
				
			});
			
		} else {
			
			Efforts.leaveEffort( id ).then( function( result ) {
				
				Popup.alert( "Ok, you did it," , "You have left the effort" );

				$state.go( 'tab.efforts' );	
									
			});	
			
		}
		
	}	
		
	$scope.editFriends = function( id ) {
				
		Efforts.editContributors( id , $scope.data ).then( function( response ) {
			
			console.log( response );
			
		});
		
	};				
	
	for ( var i = 0; i < effort.contributors.length; i++ ) {
		
		if ( effort.contributors[i]["id"] == $rootScope.user.id ) {						
			
			$scope.self = effort.contributors[i];
		
		}
		
		for ( var a = 0; a < friends.length; a++ ) {
			
			if ( friends[a].ID == effort.contributors[i].id ) {
				
				$scope.data[effort.contributors[i].username] = {};
				
				$scope.data[effort.contributors[i].username].contributor = true;
				
				if ( effort.contributors[i].role == "admin" ) {
				
					$scope.data[effort.contributors[i].username].admin = true;
				
				} 
				
			}
			
		}
		
	}	
	
	console.log( friends , effort , $scope.data );
	
	effort.activity.reverse();
	
	$scope.effort = effort;	
	
	$scope.friends = friends;
	
})

.controller('EffortsDetailCommentsCtrl', function( $rootScope, $scope, $state, Popup, Efforts, Friends, effort , comments ) {
	
	$scope.autoExpand = function( event ) {
		
		var element = event.target;
		var minimum = element.getAttribute( 'data-min-height' );
		var maximum = element.getAttribute( 'data-max-height' );
		
		element.style.height = Math.max( 0, minimum ) + "px";
			  
		
		if ( element.scrollHeight < maximum ) {					// Set overflow:hidden if height is < maximum
		  element.style.overflow = "hidden";				  
		} else {
		  element.style.overflow = "auto";
		}
						
		element.style.height = Math.min( element.scrollHeight, maximum ) + "px";	// Sets the element's new height to it's scroll height.
		
	};
	
	$scope.addCommentData = {};	
	
	$scope.addEffortComment = function() {
		
		Efforts.addEffortComment( effort.id , $scope.addCommentData.comment ).then( function( response ) {
						
			$state.go( 'tab.effort-detail-comments' , { effortId : effort.id } , { reload : true } );
			
		});
		
	};	
	
	console.log( comments );
	
	comments.data.reverse();
	
	$scope.comments = comments.data;
	
	$scope.effort = effort;	
	

})

.controller('EffortsDetailTasksCtrl', function( $rootScope, $scope, $state, Popup, Efforts, Friends, effort , tasks ) {
	
	$scope.data = {};
	
	$scope.data.tasks = {};
		
	$scope.autoExpand = function( event ) {
		
		var element = event.target;
		
		var minimum = element.getAttribute( 'data-min-height' );
		
		var maximum = element.getAttribute( 'data-max-height' );
		
		element.style.height = Math.max( 0, minimum ) + "px";
			  		
		if ( element.scrollHeight < maximum ) {
			
		  element.style.overflow = "hidden";				  // Set overflow:hidden if height is < maximum
		  
		} else {
			
		  element.style.overflow = "auto";
		  
		}
		
		element.style.height = Math.min( element.scrollHeight, maximum ) + "px";				// Sets the element's new height to it's scroll height.
		
	};
	
	$scope.addTask = function() {
				
		var task = {};
		
		task.title = $scope.data.title;
		
		task.deadline = $scope.data.deadline;
		
		task.schedule = $scope.data.schedule;
		
		task.dibs = $scope.data.dibs;
		
		task.finished = false;
		
		console.log( task );
						
		Efforts.addEffortTask( effort.id , task ).then( function( result ) {
			
			console.log( result );
			
			$state.go('tab.effort-detail-tasks' , { effortId : effort.id } , { reloat : true } );
			
		});		
		
	};
		
	$scope.dibs = function( id , task ) {
		
		Efforts.dibs( id , task ).then( function( result ) {
						
			if ( !result.success ) {
				
				for ( var a = 0; a < effort.contributors.length; a++) {
					
					if ( result.data == effort.contributors[a].id ) {
						
						Popup.alert( "Sorry" , "Looks like " + effort.contributors[a].username + " already called dibs on this one." );
						
						$scope.data.tasks[ task ].face = effort.contributors[a].face;
						
						$scope.data.tasks[ task ].available = false;
						
					}
					
				}
				
			}
			
		});
		
	}			
	
	$scope.changeStatus = function( effortId , index , finished ) {
		
		$scope.tasks[ index ]['finished'] = finished;
		
		Efforts.changeTaskStatus( effortId , index , finished ).then( function( result ) {
			
			$scope.tasks[ index ] = result.data;
						
		});
			
	}
	
	for ( var i = 0; i < effort.contributors.length; i++ ) {
		
		if ( effort.contributors[i]["id"] == $rootScope.user.id ) {						
			
			$scope.self = effort.contributors[i];
		
		}
		
	}
	
	$scope.data.tasks = Efforts.assignTasks( tasks , effort );
		
	$scope.tasks = tasks;
	
	$scope.effort = effort;	
		
})

.controller('FriendsCtrl', function( $rootScope, $scope, $state, Popup, Friends, friends) {
	
	$scope.newFriendData = {};	
	
	$scope.addFriend = function() {
				
		var email = $scope.newFriendData.email;
		
		Friends.addFriend( email ).then( function( result ) {
			
			if ( result.success) {
				
				$state.go('tab.account-friends-requests' , {}, { reload: true } );
				
				Popup.alert( "It's on its way!", "Your request has been sent.");
				
			} else {
				
				$rootScope.error = result.reason;
				
			}
			
		});
		
	};
	
	$scope.acceptRequest = function( email ) {
		
		Friends.acceptRequest( email ).then( function( result ) {
			
			$state.go('tab.account-friends' , {}, { reload: true } );
			
			Popup.alert( "Congratulations", "You just added another collaborator to your network.");
						
		});
		
	};
	
	$scope.denyRequest = function( email ) {
		
		Popup.confirm( "Are you sure?" , "This person could be reallllllly valuable to one of your efforts." ).then( function( result ) {
			
			if( result ) {
				
				Friends.denyRequest( email ).then( function( result ) {
					
					console.log( result );
					
					$state.go('tab.account-friends' , {}, { reload: true } );
					
				});
				
			}
			
		});
		
	};
	
	$scope.friends = {};
	
	$scope.friends.requestSent = [];
	
	$scope.friends.requestReceived = [];
	
	$scope.friends.invitationSent = [];
	
	$scope.friends.requestAccepted = [];
	
	console.log( friends );
	
	console.log( $rootScope.user );
	
	for( var i = 0; i < friends.length; i++ ) {
		
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
	
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
	
  // $scope.friend = Friends.get($stateParams.friendId);
  
})

.controller('AccountCtrl', function( $rootScope, $scope, $state, Authenticate ) {
    
  $scope.logout = function() {
	  
	  Authenticate.logout().then( function( result ) {
		  
			if ( true == result ) {
				
				$rootScope.loggedIn = false;
				
				$state.go('login');	
				
			} else {
				
				console.log( $rootScope.error );
				
			}
			
		});
		
  };
  
});
