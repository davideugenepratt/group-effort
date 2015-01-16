angular.module('GroupEffort.controllers', [ 'GroupEffort.services' ])

.controller('TabCtrl', function( $rootScope, $scope, $state, $ionicPopup, $ionicHistory, Authenticate ) {
		
	$scope.goToEfforts = function() {
		$state.go('tab.efforts');	
	}
})

.controller('LoginCtrl', function( $rootScope, $scope, $state, Authenticate ) {
	// Form data for the login modal
	$scope.loginData = {};
	
	$scope.login = function() {
		var username = $scope.loginData.username;
    	var password = $scope.loginData.password;
		
		Authenticate.login( username, password ).then( function(result ) {
			if ( true == result ) {
				$rootScope.loggedIn = true;
				$state.go('tab.dash');	
			} else {
				$rootScope.error = "Incorrect username/password combination.";
			}
		});
		
	};
})

.controller('RegisterCtrl', function( $rootScope, $scope, $state, Authenticate ) {
	// Form data for the login modal
	$scope.registerData = {};
	
	$scope.register = function() {		
		var fullname = $scope.registerData.fullname;
		var email = $scope.registerData.email;
		var phone = $scope.registerData.phone;
		var username = $scope.registerData.username;
    	var password = $scope.registerData.password;
		var passwordRetype = $scope.registerData.passwordRetype;
		
		if ( Authenticate.validateRegister( fullname, email, username , password, passwordRetype ) ) {		
			Authenticate.register( fullname, email, username , password ).then( function(result ) {
				if ( true == result ) {
					$rootScope.loggedIn = true;
					$state.go('tab.account');	
				}
			});
		}
		
	};
	
})

.controller('DashCtrl', function($scope) {
})

.controller('EffortsCtrl', function( $rootScope, $scope, $state, Popup, Efforts, Friends, efforts ) {
	$scope.newEffortData = {};	
	$scope.addEffort = function() {
		Friends.allFriends().then( function( result ) {
			Popup.addEffort( result ).then( function(response) {
					if ( response ) {			
						Efforts.addEffort( response.title , response.friends ).then( function( result ) {
							console.log( result );
							//$state.go( 'tab.effort-detail' , { effortId : result } );
						});
					} 
				});
			});
	};
	
	console.log( $rootScope.user, efforts );
	$scope.efforts = efforts;
	

})

.controller('EffortsNewCtrl', function( $rootScope, $scope, $state, $sce, Popup, Efforts, Friends, friends  ) {
		
	$scope.trusted = {}; 
	
	$scope.to_trusted = function(html_code) { 
		return $scope.trusted[html_code] || ($scope.trusted[html_code] = $sce.trustAsHtml(html_code)); 
	};
	
	$scope.data = {};
	//$scope.data.friends = {};
	$scope.addEffort = function() {
		if ( ( null != $scope.data.title ) && ( '' != $scope.data.title ) ) {
			Efforts.addEffort( $scope.data.title , $scope.data.friends ).then( function( result ) {
				console.log( result );
				$state.go( 'tab.effort-detail-tasks' , { effortId : result } );
			});
		} else {
			$rootScope.error = "The effort title can not be empty";
		}
	}
	
	$scope.friends = friends;
})

.controller('EffortsDetailCtrl', function( $rootScope, $scope, $state, Popup, Efforts, effort  ) {
	console.log( effort );
	effort.activity.reverse();
	
	$scope.effort = effort;	
	
})

.controller('EffortsDetailSettingsCtrl', function( $rootScope, $scope, $state, Popup, Efforts, Friends, effort, friends  ) {		
	$scope.deleteEffort = function( id ) {
		if ( effort.contributors.length == 1 ) {
			Popup.confirm( "You're the only one involved in this effort, if you leave this effort it will be deleted." ).then( function( confirm ) {
				if ( confirm ) {
					Efforts.leaveEffort( id ).then( function( result ) {
						$state.go( 'tab.efforts' );	
						Popup.alert( "You have left the effort" );						
					});
				}
			});
		} else {
			Efforts.leaveEffort( id ).then( function( result ) {
				$state.go( 'tab.efforts' );
				Popup.alert( "Success", "You have left the effort" );						
			});	
		}
	}
	
	$scope.data = {};
	
	$scope.editFriends = function( id ) {
		Efforts.editContributors( $scope.data, id ).then( function( response ) {
		});
	};
			
	effort.activity.reverse();
	
	for ( var i = 0; i < effort.contributors.length; i++ ) {
		for ( var a = 0; a < friends.length; a++ ) {
			if ( friends[a].ID == effort.contributors[i].id ) {
				$scope.data[effort.contributors[i].username] = true;
			}
		}
	}
	
	$scope.effort = effort;	
	$scope.friends = friends;
	
})

.controller('EffortsDetailCommentsCtrl', function( $rootScope, $scope, $state, Popup, Efforts, Friends, effort , comments ) {
	$scope.autoExpand = function( event ) {
		var element = event.target;
		var minimum = element.getAttribute( 'data-min-height' );
		var maximum = element.getAttribute( 'data-max-height' );
		element.style.height = Math.max( 0, minimum ) + "px";
			  
		// Set overflow:hidden if height is < maximum
		if ( element.scrollHeight < maximum ) {
		  element.style.overflow = "hidden";				  
		} else {
		  element.style.overflow = "auto";
		}
		
		// Sets the element's new height to it's scroll height.
		element.style.height = Math.min( element.scrollHeight, maximum ) + "px";
		
	};
	
	$scope.addCommentData = {};	
	
	$scope.addEffortComment = function() {
		Efforts.addEffortComment( effort.id , $scope.addCommentData.comment ).then( function( response ) {
			$state.go( 'tab.effort-detail-comments' , { effortId : effort.id } , { reload : true } );
			//console.log( response );
		});
	};
	
	
	
	//comments.reverse();
	$scope.comments = comments;
	$scope.effort = effort;	

})

.controller('EffortsDetailTasksCtrl', function( $rootScope, $scope, $state, Popup, Efforts, Friends, effort , tasks ) {
		
	$scope.autoExpand = function( event ) {
		var element = event.target;
		var minimum = element.getAttribute( 'data-min-height' );
		var maximum = element.getAttribute( 'data-max-height' );
		element.style.height = Math.max( 0, minimum ) + "px";
			  
		// Set overflow:hidden if height is < maximum
		if ( element.scrollHeight < maximum ) {
		  element.style.overflow = "hidden";				  
		} else {
		  element.style.overflow = "auto";
		}
		
		// Sets the element's new height to it's scroll height.
		element.style.height = Math.min( element.scrollHeight, maximum ) + "px";
		
	};
	
	$scope.data = {};
	
	$scope.addTask = function() {
		if ( ( null != $scope.data.title ) && ( '' != $scope.data.title ) ) {
			Efforts.addEffortTask( effort.id , $scope.data ).then( function( result ) {
				console.log( result );
				$state.go('tab.effort-detail-tasks' , { effortId : effort.id } , { reloat : true } );
			});
			
		} else {
			$rootScope.error = "The task title can not be empty.";
		}
	};
	
	$scope.data.tasks = {};
	
	$scope.dibs = function( id , task ) {
		Efforts.dibs( id , task ).then( function( result ) {
			if ( "TRUE" != result ) {
				for ( var a = 0; a < effort.contributors.length; a++) {
					if ( result == effort.contributors[a].id ) {
						Popup.alert( "Sorry" , "Looks like " + effort.contributors[a].username + " already called dibs on this one." );
						$scope.data.tasks[ task ].face = effort.contributors[a].face;
						$scope.data.tasks[ task ].available = false;
					}
				}
			}
		});
	}
	
	
	
	for ( var i = 0; i < tasks.length; i++ ) {
		$scope.data.tasks[ i ] = {};
		if ( ( tasks[i].dibs == $rootScope.user.id ) ) {			
			$scope.data.tasks[i].dibs = true;
			$scope.data.tasks[i].available = true;
		} else if ( ( tasks[i].dibs == '' ) || ( tasks[i].dibs == null ) ) {
			$scope.data.tasks[ i ].dibs = false;
			$scope.data.tasks[i].available = true;
		} else {
			$scope.data.tasks[i].available = false;
			for ( var a = 0; a < effort.contributors.length; a++) {
				if ( tasks[i].dibs == effort.contributors[a].id ) {
					$scope.data.tasks[ i ].face = effort.contributors[a].face;
				}
			}
		}
			
	}
	
	console.log( tasks, effort );
	
	$scope.tasks = tasks;
	$scope.effort = effort;	
})

.controller('FriendsCtrl', function( $rootScope, $scope, $state, Popup, Friends, friends) {
	$scope.newFriendData = {};	
	$scope.addFriend = function() {
		console.log( Friends.addFriend );
		var email = $scope.newFriendData.email;
		Friends.addFriend( email, friends ).then( function( result ) {
			//!!!! Don't know if this is the best way to do this. Need to refresh friends list !!!!!//
			if ( "TRUE" == result ) {
				$state.go('tab.account-friends-requests' , {}, {reload: true} );
				Popup.alert( "It's on its way!", "Your friend request has been sent.");
			} else {
				Popup.confirm( "We couldn't find the email address, would you like us to send them and invitation?" ).then( function( confirm ) {
					if ( confirm ) {
						//!!!!! Send Email Invitation. Probably go to new invitation screen !!!!!//
						console.log('Send Invite');
					}
				});
			}
		});
	};
	
	$scope.acceptRequest = function( email ) {
		Friends.acceptRequest( email ).then( function( result ) {
			//!!!! Don't know if this is the best way to do this. Need to refresh friends list !!!!!//
			$state.go('tab.account-friends' , {}, {reload: true} );
			Popup.alert( "Yay!!!!!!!!!!", "You are now friends.");			
		});
	};
	
	$scope.denyRequest = function( email ) {
		Popup.confirm( "Are you sure?" ).then( function( result ) {
			if( result ) {
				Friends.denyRequest( email ).then( function( result ) {
					$state.go('tab.account-friends' , {}, {reload: true} );
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
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function( $rootScope, $scope, $state, Authenticate ) {
  
  $scope.logout = function() {
	  Authenticate.logout().then( function( result ) {
			if ( true == result ) {
				$state.go('login');	
			} else {
				console.log( $rootScope.error );
			}
		});
  };
  
});
