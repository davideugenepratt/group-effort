module.exports = function(grunt) {
require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
  // Project configuration.
  grunt.initConfig({
	  
	'pkg': grunt.file.readJSON('package.json'),
	
	'banner' :	'/*\n' +
				'Theme Name:     <%= pkg.name %>\n' +
            	'Theme URI:      <%= pkg.homepage %>\n' +//<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            	'Description:    <%= pkg.homepage %> \n' + // * http://<%= pkg.homepage %>/\n' +
           		'Author:         <%= pkg.author.name %> \n' + //* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
            	'Author URI:     <%= pkg.author.url %> \n' +
				'Version:        <%= pkg.version %> \n \n' +
				'*/',
	
	'sass': {
		'dist': {
			'files': {
				'style.dev.css' : 'sass/style.scss'
			}
		}
	},   
	
    'cssmin': {
		'options': {
                'banner' : '<%= banner %>'
        },
		'build': {
			'src': 'style.dev.css',
			'dest': 'style.css'
		}
	},
		
	'watch': {
		'scripts': {
			'files' : '*/*.scss',
			'tasks' : ['sass']
		}
	}
  });

  // Default task(s).
  grunt.registerTask( 'default' , 'sass' );

};