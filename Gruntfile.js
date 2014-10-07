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
        buildDir: './dist',
        cacheDir: './.nw-cache',
      },
      src: ['./app/**/*'] // Your node-webkit app
    },
  });

  grunt.registerTask('build', [
    'clean:dist',
    'nodewebkit',
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build',
  ]);

};
