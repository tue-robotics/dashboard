var parseBuildPlatforms = function (argumentPlatform) {
  // this will make it build no platform when the platform option is specified
  // without a value which makes argumentPlatform into a boolean
  var inputPlatforms = argumentPlatform || process.platform + ';' + process.arch;

  // Do some scrubbing to make it easier to match in the regexes bellow
  inputPlatforms = inputPlatforms.replace('darwin', 'mac');
  inputPlatforms = inputPlatforms.replace(/;ia|;x|;arm/, '');

  var buildAll = /^all$/.test(inputPlatforms);

  var buildPlatforms = {
    mac: /mac/.test(inputPlatforms) || buildAll,
    win: /win/.test(inputPlatforms) || buildAll,
    linux32: /linux32/.test(inputPlatforms) || buildAll,
    linux64: /linux64/.test(inputPlatforms) || buildAll
  };

  return buildPlatforms;
};

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
    nwjs: {
      options: {
        platforms: ['linux64', 'win32'],
        buildDir: './<%= config.dist %>',
        cacheDir: './.nw-cache',
        version: '0.10.5',
      },
      src: [
        './app/*',
        './app/icons/**/*',
        './app/scripts/**/*',
        './app/styles/**/*',
        './app/bower_components/*/*',
        './app/bower_components/bootstrap/dist/**/*',
        './app/bower_components/eventemitter2/lib/**/*',
        './app/bower_components/jquery/dist/**/*',
        './app/bower_components/robot-api/dist/**/*',
        './app/bower_components/roslib/build/**/*'
      ],
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

    exec: {
      linux64: {
        cmd: '"<%= nwjs.options.cacheDir %>/<%= nwjs.options.version %>/linux64/nw" <%= config.app %>'
      },
      win: {
        cmd: '"<%= nwjs.options.cacheDir %>/<%= nwjs.options.version %>/win32/nw.exe" <%= config.app %>'
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
    'nwjs',
    'compress'
  ]);

  grunt.registerTask('start', function () {
    var start = parseBuildPlatforms();
    if (start.win) {
      grunt.task.run('exec:win');
    } else if (start.mac) {
      grunt.task.run('exec:mac');
    } else if (start.linux32) {
      grunt.task.run('exec:linux32');
    } else if (start.linux64) {
      grunt.task.run('exec:linux64');
    } else {
      grunt.log.writeln('OS not supported.');
    }
  });

  grunt.registerTask('default', [
    'jshint',
    'build',
  ]);

};
