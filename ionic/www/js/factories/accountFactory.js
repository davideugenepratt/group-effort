angular.module('GroupEffort.factories')

.factory( 'Account' , function( $rootScope, $http, Popup ) {
  
  var changePhoto = function() {
		
		var options =   {			
      quality: 100,
      destinationType: 1,
      sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
      encodingType: 0,    // 0=JPG 1=PNG
			cameraDirection: 1,
			targetWidth: 100,
			targetHeight: 100,
			allowEdit: true,
			saveToPhotoAlbum: true
        }
				
		var onSuccess = function( FILE_URI ) {				
			
			var myImg = FILE_URI;
			
			var options = new FileUploadOptions();
			
			options.fileKey="file";
			
			options.chunkedMode = false;
			
			var ft = new FileTransfer();			
					
			ft.upload( 
				
				myImg, 
				
				encodeURI( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=upload_photo" ), 
				
				function( response ) {
					
					var x = JSON.parse( response.response );	
										
					$rootScope.user.face = x.data + "?" + new Date().getTime();
																			
				},
				
				function() {
							
					$rootScope.error = "Sorry, looks like there was a problem uploading your photo";
								
				}, 
				
				options
				
			);
						
		};
		
		var onFail = function(e) {
			
			$rootScope.error = "Sorry, looks like there was a problem using your photo";
			
		};
		
		navigator.camera.getPicture( onSuccess , onFail , options );  
	  
  };
  
  var updateProfile = function( data ) {
	  	  
	  return $http.get( $rootScope.baseURL + "wp-admin/admin-ajax.php?action=group_effort&task=update_profile" +
	  				  
					  "&data=" + encodeURI( JSON.stringify( data ) )			  	
					  
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
    
	changePhoto : changePhoto,
	
	updateProfile : updateProfile
	
  }
	
});
