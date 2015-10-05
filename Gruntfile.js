module.exports = function(grunt) {
	
  require("matchdep").filterDev("grunt-*").forEach( grunt.loadNpmTasks );
  
  // Project configuration.
  grunt.initConfig({
	  
	'pkg': grunt.file.readJSON('package.json'),
	
	'banner' :	'/*\n' +
				'Theme Name:     <%= pkg.title %>\n' +
				'Theme URI:      <%= pkg.homepage %>\n' +//<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'Description:    <%= pkg.homepage %> \n' + // * http://<%= pkg.homepage %>/\n' +
				'Author:         <%= pkg.author.name %> \n' + //* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
				'Author URI:     <%= pkg.author.url %> \n' +
				'Version:        <%= pkg.version %> \n \n' +
				'*/',
	
	'tests' : {
		'includes_path' : 'wordpress/wp-content/plugins/<%= pkg.dir %>/',
		'bootstrap' : 'wordpress/wp-content/plugins/<%= pkg.dir %>/tests/bootstrap.php',
		'configuration' : 'wordpress/wp-content/plugins/<%= pkg.dir %>/phpunit.xml',
		'filepath' : null,
		'options' : null,
	},
	
	'sass': {
		'dist': {
			'files': {
				'wordpress/wp-content/themes/<%= pkg.dir %>/style.css' : 'wordpress/wp-content/themes/<%= pkg.dir %>/sass/style.scss'
			}
		}
	},   
	
	'cssmin': {
		'options': {
				'banner' : '<%= banner %>'
		},
		'build': {
			'src': 'wordpress/wp-content/themes/<%= pkg.dir %>/style.css',
			'dest': 'wordpress/wp-content/themes/<%= pkg.dir %>/style.css'
		}
	},

	'watch': {
		
		'sass': {
			
			'files' : [ '**/*.scss' ],
			'tasks' : ['sass']
			
		},
		
		'tdd': {
			
			'files': ['wordpress/wp-content/plugins/<%= pkg.dir %>/**/*.php', 'wordpress/wp-content/plugins/<%= pkg.dir %>/tests/tests/**/*.php'],
			
			'tasks': ['shell:phpunit'],
			
			'options': {
          		'spawn': false
        	}
		
		}
	
	},
		
	'shell': {
		
		'phpunit': {
		
			'command': 	'phpunit <%= tests.options %> <%= tests.filepath %>'
	
		}
	
	}
	
  });

  // Default task(s).
  grunt.registerTask( 'default' , ['sass'] );    
  
  grunt.event.on( 'watch' , function( action, filepath, target ) {
	
	var path = filepath.split("\\");
	var file = path[path.length - 1];
	
	if( file.indexOf( "test-" ) != -1 ) {
		grunt.config( 'tests.options' , '--configuration <%= tests.configuration %> --bootstrap <%= tests.bootstrap %> --include-path <%= tests.includes_path %> ' ); 
		grunt.config( 'tests.filepath' , filepath );  
	} else {
		grunt.config( 'tests.options' , '--configuration <%= tests.configuration %> --bootstrap <%= tests.bootstrap %> --include-path <%= tests.includes_path %> ' ); 
		var testpath = filepath.substr( filepath.indexOf( '\\app\\' ) + 5 );
		testpath = testpath.split("\\");
		testpath[testpath.length - 1] = "test-"+testpath[testpath.length - 1];
		grunt.config( 'tests.filepath' ,  '<%= tests.includes_path %>tests/tests/tdd/'+testpath.join( "\\" ) ); 				
	}
	
  });  
  
  
};

  