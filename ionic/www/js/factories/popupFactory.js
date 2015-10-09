angular.module('GroupEffort.factories')

/**  
  * @desc this factory holds functions for error alerts, alert dialogues, and confirmation dialogues
  * Popup.errorWindow(); Popup.alertPrompt(); Popup.confirmPrompt();
  * @author David Eugene Pratt - david@davideugenepratt.com
*/  

.factory( 'Popup' , function( $rootScope, $ionicPopup ) {
	
	/** 
	  * @desc opens a modal window to display the error message stored in $rootScope.error
	  * @return bool - returns false to prevent error'd action from continuing 
	*/ 	
	
	var errorWindow = function() {
		
		$rootScope.$watch( function(scope) { return scope.error } , function() {
			
			if ( $rootScope.error ) {
				
				var errorPopup = $ionicPopup.show({
					template: $rootScope.error,
					title: 'Uh Oh!',
					scope: $rootScope,
					buttons: [ { text: 'OK' } ]					  				  					
				  });
				  
				errorPopup.then( function(res) {
					
					$rootScope.error = undefined;
					
					return false;
					
				  }); 
				   		  			  
			}
			
		});
		
	};
	
	/** 
	  * @desc opens a modal window to display the message provided by @var message.
	  * @params tile, message
	  * @return bool - returns false to prevent error'd action from continuing 
	*/		
	
	var alertPrompt = function( title, message ) {
		
		var alertPopup = $ionicPopup.show({
			template: message,
			title: title,
			scope: $rootScope,
			buttons: [ { text: 'OK' } ]
		});
		
		return alertPopup;  		
		  			  
	};
	
	/** 
	  * @desc opens a modal window to display a confirmation dialogue
	  * @params title, message
	  * @return bool - returns false to prevent error'd action from continuing 
	*/	
	
	var confirmPrompt = function( title , message ) {
		
		   var confirmPopup = $ionicPopup.confirm({
			 title: title,
			 template: message
		   });
		   
		   return confirmPopup.then( function(res) {
			   
			 return res;
			 
		   });
		   
	 };	 	 
	
	return {
		errorWindow : errorWindow,
		confirmPrompt : confirmPrompt,
		alertPrompt : alertPrompt
	}
	
});