/*jshint camelcase: false*/

module.exports = function (grunt) {
  'use strict';

  // load all grunt tasks
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  // configurable paths
  var config = {
    app: 'app',
    dist: 'dist',
  };

  grunt.initConfig({
    config: config,
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= config.dist %>/*',
          ]
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: '<%= config.app %>/js/*.js'
    },
    nodewebkit: {
      options: {
        platforms: ['linux64'],
        buildDir: './<%= config.dist %>',
        cacheDir: './.nw-cache',
      },
      src: ['./app/**/*'] // Your node-webkit app
    },
    compress: {
      linux64: {
        options: {
          archive: './<%= config.dist %>/dashboard-<%= pkg.version %>-linux64.tar.gz'
        },
        files: [
          {expand: true, cwd: './<%= config.dist %>/dashboard/linux64/', src: '**', dest: '.'},
        ]
      }
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    'nodewebkit',
    'compress'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build',
  ]);

};
