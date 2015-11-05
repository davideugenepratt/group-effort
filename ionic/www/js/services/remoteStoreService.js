angular.module('remoteStore.service')

/**  
  * @desc this factory holds functions for the authentication of users
  * Authenticate.authenticate(); 
  * Authenticate.authenticate.check(); 
  * Authenticate.authenticate();
  * @author David Eugene Pratt - david@davideugenepratt.com
*/  

.service( 'remoteStore' , function( $rootScope , $http ) {
    
    var transformParams = function( data ) {
        
        var obj = data;
        
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
          
        for(name in obj) {
          value = obj[name];
            
          if(value instanceof Array) {
            for(i=0; i<value.length; ++i) {
              subValue = value[i];
              fullSubName = name + '[' + i + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value instanceof Object) {
            for(subName in value) {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value !== undefined && value !== null)
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        
        data = query.length ? query.substr(0, query.length - 1) : query;
          
        return data;
        
    };
    
    this.post = function ( route , data , config ) {
                                  		
      return $http.post( $rootScope.baseURL + route , transformParams( data ) )
      
      .then( 
  
        function( response ) {
                    
          return response;	
                          
        },
      
        function( response ) {
        
          console.info( response );
              
          $rootScope.error = "Could Not Connect";            
        
          return false;	
        
        }
        
      );
          
    };
    
    this.get = function ( route , data , config ) {
                                  		
      return $http.get( $rootScope.baseURL + route + "?" + transformParams( data ) , config )
      
      .then( 
  
        function( response ) {
          
          console.info( response );
                    
          return response;	
                          
        },
      
        function( response ) {
        
          console.info( response );
              
          $rootScope.error = "Could Not Connect";            
        
          return false;	
        
        }
        
      );
          
    };
    
});