// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('GroupEffort', ['ionic', 'GroupEffort.controllers', 'GroupEffort.services'])

.run( function ( $ionicPlatform, $rootScope, $location, $state, Authenticate, Popup ) {
    
	$rootScope.baseURL = "http://127.0.0.1:8080/Local%20Web/group-effort/";  
	 
  	Popup.error();
	
    $ionicPlatform.ready(function() {	  
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
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
    
  $ionicConfigProvider.backButton.text( '' ).icon('').previousTitleText(false);
  $ionicConfigProvider.tabs.position( 'bottom' );
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
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
			loggedeIn : function( Authenticate ) {
				return Authenticate.authenticate();
			}
	  }
  })

  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl'
  })
  
  .state('register', {
    url: "/register",
    templateUrl: "templates/register.html",
    controller: 'RegisterCtrl'
  })
  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
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
        	}
	  }
    })
	
    .state('tab.effort-new', {
		cache : false,
      url: '/efforts/new',
      views: {
        'tab-efforts': {
          templateUrl: 'templates/effort-new.html',
          controller: 'EffortsNewCtrl'
        }
      },
	  resolve: {
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
	
	.state('tab.effort-detail-task-add', {
		cache : false,
      url: '/efforts/:effortId/tasks/add',
      views: {
        'tab-efforts': {
          templateUrl: 'templates/effort-detail-tasks-add.html',
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
          controller: 'EffortsDetailCtrl'
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
          controller: 'EffortsDetailCtrl'
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

  .state('tab.account-friends', {
	  cache : false,
      url: '/account/friends',
      views: {
        'tab-account': {
          templateUrl: 'templates/account-friends.html',
          controller: 'FriendsCtrl'
        }
      },
	  resolve: {
            friends : function( Friends ) {
                return Friends.allFriends();
        	}
	  }
    })
   .state('tab.account-friends-requests', {
	  cache : false,
      url: '/account/friends/requests',
      views: {
        'tab-account': {
          templateUrl: 'templates/account-friends-requests.html',
          controller: 'FriendsCtrl'
        }
      },
	  resolve: {
            friends : function( Friends ) {
                return Friends.allFriends();
        	}
	  }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

}).directive('focus', function($timeout, $parse) {
  return {
    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs) {
      var model = $parse( attrs.focus );
      scope.$watch( model, function(value) {
        console.log('value=',value);
        if(value === true) { 
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
      // to address @blesh's comment, set attribute value to 'false'
      // on blur event:
      //element.bind('blur', function() {
         //console.log('blur');
         //scope.$apply(model.assign(scope, false));
      //});
    }
  };
});

