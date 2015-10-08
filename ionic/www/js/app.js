// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('GroupEffort', ['ionic', 'GroupEffort.controllers', 'GroupEffort.services'])

.run( function ( $ionicPlatform, $rootScope, $location, $state, Authenticate, Popup ) {
    
	$rootScope.baseURL = "http://127.0.0.1/group-effort/wordpress/";  
	//$rootScope.baseURL = "http://www.davideugenepratt.com/group-effort/wordpress/";   
	 
  	Popup.errorWindow(); // This calls the listener on $rootScope.error so that when it is given a value it opens an error dialogue.	
	
    $ionicPlatform.ready(function() {				  		
			  
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
		  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
		  // org.apache.cordova.statusbar required
		  StatusBar.styleDefault();
		}		
		
    });
})

.config( function( $stateProvider, $urlRouterProvider, $ionicConfigProvider ) {
    
  $ionicConfigProvider.backButton.text( '' ).icon('ion-arrow-left-b').previousTitleText(false);				// Removes the back button text and icon. 
  
  $ionicConfigProvider.tabs.position( 'bottom' );															// Ensures the tabs stay on the bottom
    
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
	controller: 'TabCtrl',
    templateUrl: "templates/tabs.html",
	  resolve: {		  
			loggedIn : function( $rootScope, Authenticate ) {								
				return Authenticate.authenticate();
			}
	  }
  })

  .state('login', {
	cache : false,
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl'
  })
  
  .state('register', {
	  cache : false,
    url: "/register",
    templateUrl: "templates/register.html",
    controller: 'RegisterCtrl'
  })
  
  .state('tab.efforts', {
	  cache : false,
      url: '/efforts',
      views: {
        'tab-efforts': {
          templateUrl: 'templates/tab-efforts.html',
          controller: 'EffortsCtrl'
        }
      },
	  resolve: {
            efforts : function( $stateParams, Efforts ) {
                return Efforts.allEfforts();
        	},
            friends : function( $stateParams, Friends ) {
                return Friends.allFriends();
        	}
	  }
    })
	
    .state('tab.effort-detail-tasks', {
	  cache : false,
      url: '/efforts/:effortId/tasks',
      views: {
        'tab-efforts': {
          templateUrl: 'templates/effort-detail-tasks.html',
          controller: 'EffortsDetailTasksCtrl'
        }
      },
	  resolve: {
			tasks : function( $stateParams, Efforts ) {
                return Efforts.getEffortTasks( $stateParams.effortId );
        	},
			effort : function( $stateParams, Efforts ) {
                return Efforts.getEffort( $stateParams.effortId );
        	}
	  }
    })	

	.state('tab.effort-detail-notes', {
		cache : false,
      url: '/efforts/:effortId/notes',
      views: {
        'tab-efforts': {
          templateUrl: 'templates/effort-detail-notes.html',
          controller: 'EffortsDetailNotesCtrl'
        }
      },
	  resolve: {
			effort : function( $stateParams, Efforts ) {
                return Efforts.getEffort( $stateParams.effortId );
        	}
	  }
    })	
	
	.state('tab.effort-detail-comments', {
		cache : false,
      url: '/efforts/:effortId/comments',
      views: {
        'tab-efforts': {
          templateUrl: 'templates/effort-detail-comments.html',
          controller: 'EffortsDetailCommentsCtrl'
        }
      },
	  resolve: {
            comments : function( $stateParams, Efforts ) {
                return Efforts.getEffortComments( $stateParams.effortId );
        	},
			effort : function( $stateParams, Efforts ) {
                return Efforts.getEffort( $stateParams.effortId );
        	}
	  }
    })
	
	.state('tab.effort-detail-activity', {
		cache : false,
      url: '/efforts/:effortId/activity',
      views: {
        'tab-efforts': {
          templateUrl: 'templates/effort-detail-activity.html',
          controller: 'EffortsDetailActivityCtrl'
        }
      },
	  resolve: {
            effort : function( $stateParams, Efforts ) {
                return Efforts.getEffort( $stateParams.effortId );
        	}
	  }
    })
	
	.state('tab.effort-detail-contributors', {
		cache : false,
      url: '/efforts/:effortId/contributors',
      views: {
        'tab-efforts': {
          templateUrl: 'templates/effort-detail-contributors.html',
          controller: 'EffortsDetailSettingsCtrl'
        }
      },
	  resolve: {
            effort : function( $stateParams, Efforts ) {
                return Efforts.getEffort( $stateParams.effortId );
        	},
			friends : function( $stateParams, Friends ) {
                return Friends.allFriends(  );
        	}
	  }
    })
	
    .state('tab.effort-detail-settings', {
		cache : false,
      url: '/efforts/:effortId/settings',
      views: {
        'tab-efforts': {
          templateUrl: 'templates/effort-detail-settings.html',
          controller: 'EffortsDetailSettingsCtrl'
        }
      },
	  resolve: {
            effort : function( $stateParams, Efforts ) {
                return Efforts.getEffort( $stateParams.effortId );
        	},
			friends : function( $stateParams, Friends ) {
                return Friends.allFriends( );
        	}
	  }
    })

  .state('tab.friends', {
	  cache : false,
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      },
	  resolve: {
            friends : function( Friends ) {
                return Friends.allFriends();
        	}
	  }
    })
   .state('tab.friends-requests', {
	  cache : false,
      url: '/friends/requests',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friends-requests.html',
          controller: 'FriendsCtrl'
        }
      },
	  resolve: {
            friends : function( Friends ) {
                return Friends.allFriends();
        	}
	  }
    })
  .state('tab.friends-detail', {
	  cache : false,
      url: '/friends/:friendID',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friends-detail.html',
          controller: 'FriendsDetailCtrl'
        }
      },
	  resolve: {
            friend : function( $stateParams, Friends ) {
                return Friends.getFriend( $stateParams.friendID );
        	}
	  }
    })
  .state('tab.account', {
	cache : false,
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/efforts');

}).directive('focus', function($timeout, $parse) {
	
  return {
	  
    link: function(scope, element, attrs) {
		
      var model = $parse( attrs.focus );
	  
      scope.$watch( model, function(value) {
		  
        if(value === true) { 
		
          $timeout(function() {
			  
            element[0].focus(); 
			
          });
		  
        }
		
      });
	  
	  element.bind('blur', function() {
         scope.$apply( model.assign(scope, false) );
      });
	  
    }
	
  };
  
}).directive( 'autoexpand' , function( $window ) {

  return {
	  
        link: function ( scope, element, attrs, ctrl) {
			
            element.bind('keyup', function( event ) {
				
				event.preventDefault();
				
				var textarea = element[0];
				
				textarea.style.height =  "0px";
												
				textarea.style.height = textarea.scrollHeight + "px";	// Sets the element's new height to it's scroll height.
								
            });
        }
	
  };
});

