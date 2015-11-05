angular.module('GroupEffort.factories')

.factory( 'Account' , function( $rootScope, $http, Popup ) {
  
  
  var updateProfile = function( data ) {
	  
    var params = {
      "action" : "group_effort",
      "task" : "update_profile",		  
			"data=" : encodeURI( JSON.stringify( data ) )
      
    };
    	  
	  return remoteStore.get("wp-admin/admin-ajax.php" , params , {} )
		
		.then( function( response ) {
			
			return response.data;
			
		},
		
		function( result ) {
			
			$rootScope.error = 'Could Not Connect';
			
			return false;
				
		});
	  
  };
  	
  return {
    	
	  updateProfile : updateProfile
	
  }
	
});
