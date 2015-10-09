angular.module('GroupEffort.controllers')

.controller('EffortsDetailCtrl', function( $rootScope, $scope, $state, Popup, Efforts, Friends , effort , friends , comments , tasks ) {
	
	$scope.current = "effort-detail";
  
  $scope.data = {};
  
  $scope.data.tasks = {};
	
	effort.activity.reverse();
			
	$scope.deleteEffort = function( id ) {
		
		if ( effort.contributors.length == 1 ) {
			
			Popup.confirmPrompt( "Real quick before you leave ..." , "You're the only one involved in this effort, if you leave this effort it will be deleted." ).then( function( confirm ) {
				
				if ( confirm ) {
					
					Efforts.leaveEffort( id ).then( function( result ) {
												
						// Popup.alertPrompt( "Ok, you did it," , "You have left the effort" );
						
						$state.go( 'tab.efforts' );
						
					});
					
				}
				
			});
			
		} else {
			
			Efforts.leaveEffort( id ).then( function( result ) {
				
				// Popup.alertPrompt( "Ok, you did it," , "You have left the effort" );

				$state.go( 'tab.efforts' );	
									
			});	
			
		}
		
	}	
		
	$scope.editFriends = function( id ) {
				
		Efforts.editContributors( id , $scope.data ).then( function( response ) {
			
			// console.log( response );
			
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
	
    $scope.changeStatus = function( effortId , index ) {
            
      var finished = !$scope.data.tasks[ index ]['finished'];
      
      $scope.data.tasks[ index ]['finished'] = finished;
      
      Efforts.changeTaskStatus( effortId , index , finished ).then( function( response ) {
        
        console.info( response );
        
        $scope.data.tasks = Efforts.assignTasks( response.data , effort );
        
        $scope.tasks[ index ] = response.data;
              
      });
        
    }
    
    $scope.deleteTask = function( effortId , index , title ) {
        
        $scope.data.tasks[ index ].editable = false;
        
        tasks.slice(index, 1);
        
        $scope.data.tasks = Efforts.assignTasks( tasks , effort );
        
        $scope.tasks = tasks;
        
        Efforts.deleteTask( effortId , index , title).then( function( result ) {
            
            tasks = result.data;
            
            $scope.data.tasks = Efforts.assignTasks( tasks , effort );
            
            $scope.tasks = tasks;
            
            
                        
        });
            
	};
	
  $scope.changeTask = function( effortId , index , title ) {
      
      Efforts.changeTask( effortId , index , title).then( function( result ) { });
      
  };
  
	$scope.data.tasks = Efforts.assignTasks( tasks , effort );
	
  console.info( $scope.data.tasks );
    		
	$scope.tasks = tasks;
	  
  $scope.effort = effort;		  
  
	$scope.friends = friends;
  
  $scope.comments = comments.data;
  		
});