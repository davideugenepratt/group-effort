angular.module('GroupEffort.controllers')

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
  	
});