angular.module('GroupEffort.controllers', [ 'GroupEffort.services' ])

.controller('TabCtrl', function( $rootScope, $scope, $state, $ionicPopup, $ionicHistory, $ionicLoading, Authenticate, loggedIn ) {		
	
	if ( !loggedIn ) {
		
		$state.go( 'login' );
			
	}
	
	$scope.goForward = function () {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1) {
            $ionicTabsDelegate.select(selected + 1);
        }
    }

    $scope.goBack = function () {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1 && selected != 0) {
            $ionicTabsDelegate.select(selected - 1);
        }
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

.controller('EffortsCtrl', function( $rootScope, $scope, $state, $ionicLoading, Popup, Efforts, Friends, efforts , friends ) {
		
	$scope.efforts = efforts;
	
    $scope.friends = friends;
    
	$ionicLoading.hide();
    
	$scope.data = {};
	
	$scope.addEffort = function() {
		
		$scope.data.submitted = true;
		
		Efforts.addEffort( $scope.data.title , $scope.data.friends ).then( function( result ) {
			
			$state.go( 'tab.effort-detail-tasks' , { effortId : result.data } );
			
		});
		
	};
	
})

.controller('EffortsDetailActivityCtrl', function( $rootScope, $scope, $state, Popup, Efforts, effort  ) {
	
	$scope.current = "activity";
	
	effort.activity.reverse();

	$scope.effort = effort;	

})

.controller('EffortsDetailSettingsCtrl', function( $rootScope, $scope, $state, Popup, Efforts, Friends, effort, friends  ) {
	
	$scope.current = "settings";
	
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
	
	$scope.current = "comments";
	
	$scope.autoExpand = function( event ) {
		
		var element = event.target;
		
		var minimum = element.getAttribute( 'data-min-height' );
		
		var maximum = element.getAttribute( 'data-max-height' );
		
		element.style.height = Math.max( 0, minimum ) + "px";
			  		
		if ( element.scrollHeight < maximum || maximum == "" ) {
			
		  element.style.overflow = "hidden";				  // Set overflow:hidden if height is < maximum
		  
		} else {
			
		  element.style.overflow = "auto";
		  
		}
		
		if ( maximum != "" ) {

			element.style.height = Math.min( element.scrollHeight, maximum ) + "px";	// Sets the element's new height to it's scroll height.
			
		} else {

			element.style.height = Math.max( element.scrollHeight, minimum ) + "px";	// Sets the element's new height to it's scroll height.
			
		}
				
	};
	
	$scope.data = {};	
	
	$scope.addEffortComment = function() {
		
		$scope.data.submitted = true;
        
        $scope.data.commentFormShow = false;
        
        console.info( effort.id , $scope.data.comment );
		
		Efforts.addEffortComment( effort.id , $scope.data.comment ).then( function( response ) {
			
            console.info( $scope.comments , response.data );
            			
			$scope.comments = response.data;
            
            $scope.data.comment = "";
            
            $scope.data.submitted = false;
			
		});
		
	};	
	
	console.log( comments );
		
	$scope.comments = comments.data;
	
	$scope.effort = effort;	
	
	$scope.self = $rootScope.user;

})

.controller('EffortsDetailTasksCtrl', function( $rootScope, $scope, $state, Popup, Efforts, Friends, effort , tasks ) {
	
	$scope.current = "tasks";
	
	$scope.data = {};
	
	$scope.data.tasks = {};
		
	$scope.autoExpand = function( event ) {
		
		var element = event.target;
		
		var minimum = element.getAttribute( 'data-min-height' );
		
		var maximum = element.getAttribute( 'data-max-height' );
		
		element.style.height = Math.max( 0, minimum ) + "px";
			  		
		if ( element.scrollHeight < maximum || maximum == "" ) {
			
		  element.style.overflow = "hidden";				  // Set overflow:hidden if height is < maximum
		  
		} else {
			
		  element.style.overflow = "auto";
		  
		}
		
		if ( maximum != "" ) {

			element.style.height = Math.min( element.scrollHeight, maximum ) + "px";	// Sets the element's new height to it's scroll height.
			
		} else {

			element.style.height = Math.max( element.scrollHeight, minimum ) + "px";	// Sets the element's new height to it's scroll height.
			
		}
				
	};
	
	$scope.addTask = function() {
		
		$scope.data.submitted = true;
				
		var task = {};
		
		task.title = $scope.data.title;
		
		task.deadline = $scope.data.deadline;
		
		task.schedule = $scope.data.schedule;
		
		task.dibs = $scope.data.dibs;
		
		task.finished = false;
        
        $scope.data.title = "";
        
        tasks.push( task );
        
        $scope.data.tasks = Efforts.assignTasks( tasks , effort );
        
        $scope.tasks = tasks;
						
		Efforts.addEffortTask( effort.id , task ).then( function( result ) {
			            
            $scope.data.tasks = Efforts.assignTasks( result.data , effort );
	                
            $scope.tasks = result.data;
                        
            $scope.data.submitted = false;
						
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

.controller('FriendsCtrl', function( $rootScope, $scope, $state, Popup, Friends, friends ) {
	
	$scope.newFriendData = {};	
	
	$scope.searchUsers = function() {
				
		var searchTerm = $scope.newFriendData.searchTerm;
		console.info( searchTerm );
		
		Friends.searchUsers( searchTerm ).then( function( result ) {
			
			if ( result.success) {
				console.info( result.data );
				$scope.searchResults = result.data;
				
			} else {
				
				$rootScope.error = result.reason;
				
			}
			
		});
		
	};
	
	$scope.addFriend = function( friend ) {
				
		//var email = $scope.newFriendData.email;
		
		Friends.addFriend( friend.email ).then( function( result ) {
			
			if ( result.success) {								
				
				$scope.friends.ids.push( friend.id );
				$scope.friends.requestSent.push( friend )
								
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
	
	
	
	$scope.friends = {};
	
	$scope.friends.requestSent = [];
	
	$scope.friends.requestReceived = [];
		
	$scope.friends.requestAccepted = [];
	
	$scope.friends.ids = [];
		
	for( var i = 0, x = friends.length; i < x; i++ ) {
		
		$scope.friends.ids.push( parseInt( friends[i]["ID"] ) );
    	
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
								
			} else {
				
				$rootScope.error = result.data;
				
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
