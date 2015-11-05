// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('GroupEffort', ['ionic', 'GroupEffort.controllers', 'GroupEffort.factories' , 'remoteStore.service' ])

.run( function ( $ionicPlatform, $rootScope, $location, $state, Authenticate, Popup ) {
     
	$rootScope.baseURL = "http://127.0.0.1/group-effort/wordpress/";    
	//$rootScope.baseURL = "http://www.davideugenepratt.com/group-effort/wordpress/";
  $rootScope.$state = $state;
  
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
    
  //$ionicConfigProvider.backButton.text( '' ).icon('ion-arrow-left-b').previousTitleText(false);				// Removes the back button text and icon. 
  
  $ionicConfigProvider.tabs.position( 'bottom' );															// Ensures the tabs stay on the bottom
    
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tabs', {
      cache: false,
      url: "/tabs/:tabId",
      controller: 'TabsCtrl',
      templateUrl: "templates/tabs.html",
      resolve: {		  
        loggedIn : function( Authenticate ) {								
          return Authenticate.authenticate();
        },
        efforts : function( Efforts ) {
          return Efforts.allEfforts();
        },
        friends : function( Friends ) {
          return Friends.allFriends();
        }
      }
    })
  
    .state('login', {
    cache : false,
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'AuthenticateCtrl'
    })
    
    .state('register', {
      cache : false,
      url: "/register",
      templateUrl: "templates/register.html",
      controller: 'AuthenticateCtrl'
    })
  
    .state('effort-detail', {
      cache : false,
      url: '/efforts/:effortId',
      templateUrl: 'templates/effort-detail.html',
      controller: 'EffortsDetailCtrl',
      resolve: {
        loggedIn : function( Authenticate ) {								
          return Authenticate.authenticate();
        },
        tasks : function( $stateParams, Efforts ) {
          return Efforts.getEffortTasks( $stateParams.effortId );
        },
        effort : function( $stateParams, Efforts ) {
          return Efforts.getEffort( $stateParams.effortId );
        },
        comments : function( $stateParams, Efforts ) {
          return Efforts.getEffortComments( $stateParams.effortId );
        },
        friends : function( $stateParams, Friends ) {
          return Friends.allFriends(  );
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tabs/0');

});

