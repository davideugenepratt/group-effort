angular.module('GroupEffort.controllers')

.controller('EffortsCtrl', function( $rootScope, $scope, $state, $ionicLoading, Popup, Efforts, Friends, efforts , friends ) {
		
	$scope.efforts = efforts;
	
  $scope.friends = friends;
    
	$ionicLoading.hide();
    
	$scope.data = {};
	
	$scope.addEffort = function() {
		
		$scope.data.submitted = true;
    
    $scope.efforts.push( $scope.data );
    
    var title = $scope.data.title;
    
    $scope.data.title = "";
		
		Efforts.addEffort( title , $scope.data.friends ).then( function( result ) {
			
      $scope.efforts = result.data;
      			
		});
		
	};
  	
});