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
      files: [
        '<%= config.app %>/*.js',
        '<%= config.app %>/scripts/*.js',
      ]
    },
    nodewebkit: {
      options: {
        platforms: ['linux64'],
        buildDir: './<%= config.dist %>',
        cacheDir: './.nw-cache',
        version: '0.10.5',
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
    },

    // for releasing a new version
    bump: {
      options: {
        files:       ['package.json', 'app/package.json'],
        commitFiles: ['package.json', 'app/package.json', 'package.xml'],
        updateConfigs: ['pkg'],
        commit: true,
        createTag: true,
        push: true,
        pushTo: 'origin',
      }
    },
    // update the version in the package.xml
    xmlpoke: {
      version: {
        options: {
        xpath: '//version',
        value: '<%=pkg.version%>'
        },
        files: {
          'package.xml': 'package.xml'
        }
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
