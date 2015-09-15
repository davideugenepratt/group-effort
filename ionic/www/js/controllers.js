angular.module('GroupEffort.controllers', [ 'GroupEffort.services' ])

.controller('TabCtrl', function( $rootScope, $scope, $state, $ionicPopup, $ionicHistory, $ionicLoading, Authenticate, loggedIn ) {		
	
	if ( !loggedIn ) {
		
		$state.go( 'login' );
			
	}		
	
	$scope.goToEfforts = function() {
	
		$state.go( 'tab.efforts' );
			
	};
	
	$scope.goToEffort = function( id ) {
	
		$state.go( 'tab.effort-detail-tasks' , { 'effortId' : id } );	
	
	};
	
	$scope.goToFriends = function() {
	
		$state.go( 'tab.friends' );	
	
	};
	
	$scope.goToFriend = function( id ) {
	
		$state.go( 'tab.friends-detail' , { 'friendID' : id } );	
	
	};
	
	$scope.goToAccount = function() {
	
		$state.go( 'tab.account' );	
	
	};
	
	$rootScope.tabs = true;		
	
	// This will show a loading screen while a request is made
	$rootScope.$on('loading:show', function () {
		$ionicLoading.show({
			templateUrl: 'templates/loading.html',
			delay: 300
		})
	});

	$rootScope.$on('loading:hide', function () {
		$ionicLoading.hide();
	});
	
	$rootScope.$on('$stateChangeStart', function () {
		$rootScope.$broadcast('loading:show');
	});
	
	$rootScope.$on('$stateChangeSuccess', function () {
		$rootScope.$broadcast('loading:hide');
	});
	
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
		
		$scope.data.submitted = true;
		
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
	
	$scope.goToLogin = function() {

		$state.go( 'login' );	
	
	};
	
	$rootScope.tabs = false;
	
	$scope.data = {};
	
	$scope.data.submitted = false;
	
	$scope.register = function() {
		$scope.data.submitted = true;
		var email = $scope.data.email;
		var phone = $scope.data.phone;
		var username = $scope.data.username;
    	var password = $scope.data.password;
		Authenticate.register( email, username , password ).then( function( result ) {			
			if ( result ) {
				$rootScope.loggedIn = true;
				$rootScope.user = result;
				console.log( $rootScope.user );
				$state.go('tab.account');	
			} else {
				console.log( result );
				$rootScope.loggedIn = false;
				$scope.data.submitted = false;
			}
		});		
	};
})

.controller('EffortsCtrl', function( $rootScope, $scope, $state, $ionicLoading, Popup, Efforts, Friends, efforts ) {
		
	$scope.efforts = efforts;
	
	$ionicLoading.hide();
	
})

.controller('EffortsDetailNewCtrl', function( $rootScope, $scope, $state, $sce, Popup, Efforts, Friends, friends  ) {
	
	$scope.data = {};
	
	$scope.addEffort = function() {
		
		$scope.data.submitted = true;
		
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
			
			Popup.confirmPrompt( "Real quick before you leave ..." , "You're the only one involved in this effort, if you leave this effort it will be deleted." ).then( function( confirm ) {
				
				if ( confirm ) {
					
					Efforts.leaveEffort( id ).then( function( result ) {
												
						Popup.alertPrompt( "Ok, you did it," , "You have left the effort" );
						
						$state.go( 'tab.efforts' );
						
					});
					
				}
				
			});
			
		} else {
			
			Efforts.leaveEffort( id ).then( function( result ) {
				
				Popup.alertPrompt( "Ok, you did it," , "You have left the effort" );

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
		
	effort.activity.reverse();
	
	$scope.effort = effort;	
	
	$scope.friends = friends;
	
})

.controller('EffortsDetailCommentsCtrl', function( $rootScope, $scope, $state, Popup, Efforts, Friends, effort , comments ) {
	
	$scope.current = "test";
	
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
	
	$scope.data = {};	
	
	$scope.addEffortComment = function() {
		
		$scope.data.submitted = true;
		
		Efforts.addEffortComment( effort.id , $scope.data.comment ).then( function( response ) {
						
			$state.go( 'tab.effort-detail-comments' , { effortId : effort.id } , { reload : true } );
			
		});
		
	};	
	
	console.log( comments );
		
	$scope.comments = comments.data;
	
	$scope.effort = effort;	
	
	$scope.self = $rootScope.user;

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
		
		$scope.data.submitted = true;
				
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
						
						Popup.alertPrompt( "Sorry" , "Looks like " + effort.contributors[a].username + " already called dibs on this one." );
						
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
	
	console.log( $scope.data.tasks , effort );
		
	$scope.tasks = tasks;
	
	$scope.effort = effort;	
		
})

.controller('FriendsCtrl', function( $rootScope, $scope, $state, Popup, Friends, friends) {
	
	$scope.newFriendData = {};	
	
	$scope.addFriend = function() {
				
		var email = $scope.newFriendData.email;
		
		Friends.addFriend( email ).then( function( result ) {
			
			if ( result.success) {
				
				$state.go('tab.friends-requests' , {}, { reload: true } );
				
				Popup.alertPrompt( "It's on its way!", "Your request has been sent.");
				
			} else {
				
				$rootScope.error = result.reason;
				
			}
			
		});
		
	};
	
	$scope.acceptRequest = function( email ) {
		
		//$scope.data = { submitted: true };
		
		Friends.acceptRequest( email ).then( function( result ) {						
			
			Popup.alertPrompt( "Congratulations", "You just added another collaborator to your network.").then( function() {
				
				console.log( result );
			
				$state.go('tab.friends' , {}, { reload: true } );
				
			});
						
		});
		
	};
	
	$scope.denyRequest = function( email ) {
		
		$scope.data = { submitted: true };
				
		Popup.confirmPrompt( "Are you sure?" , "This person could be reallllllly valuable to one of your efforts." ).then( function( result ) {
						
			if( result ) {
				
				Friends.denyRequest( email ).then( function( result ) {
										
					$state.go( 'tab.friends' , {}, { reload: true } );
					
				});
				
			} else {
								
				$scope.data.submitted = false;
				
			}
			
		});
		
	};
	
	console.log( friends );
	
	$scope.friends = {};
	
	$scope.friends.requestSent = [];
	
	$scope.friends.requestReceived = [];
	
	$scope.friends.invitationSent = [];
	
	$scope.friends.requestAccepted = [];
		
	for( var i = 0, x = friends.length; i < x; i++ ) {
		
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

.controller('FriendsDetailCtrl', function($scope, $state, $stateParams, Friends, Popup, friend ) {
	
	$scope.removeFriend = function( email ) {
		
		$scope.data = { submitted: true };
				
		Popup.confirmPrompt( "Are you sure?" , "This person could be reallllllly valuable to one of your efforts." ).then( function( result ) {
			
			if( result ) {
				
				Friends.denyRequest( email ).then( function( result ) {
										
					$state.go('tab.friends' , {}, { reload: true } );
					
				});
				
			} else {
				
				$scope.data.submitted = false;
				
			}
			
		});
		
	};
	
	$scope.friend = friend;
	  
})

.controller('AccountCtrl', function( $rootScope, $scope, $state, $ionicLoading, Popup, Authenticate, Account ) {
    
	$scope.changePicture = function() {
	    		
        Account.changePhoto();
		
    };
	
    $scope.updateProfile = function() {
				
		$scope.data.submitted = true;
		
		Account.updateProfile( $scope.data ).then( function( result ) {
						
			if ( result.success ) {
				
				$scope.data.submitted = false;
				
				$state.go( 'tab.account' );
				
				$ionicLoading.hide();
				
			} else {
				
				$rootScope.error = result.data
				
			}
			
		});
		
	};
    
  $scope.logout = function() {
	  
	  Authenticate.logout().then( function( result ) {
		  
			if ( true == result ) {
				
				$rootScope.loggedIn = false;
				
				$state.go('login');	
				
				$ionicLoading.hide();
				
			} else {
				
				console.log( $rootScope.error );
				
			}
			
		});
		
  };
      
  $scope.self = $rootScope.user;
  $scope.self.face += "?" + new Date().getTime();
  $scope.data = $scope.self;
  
  $ionicLoading.hide();
  
});
