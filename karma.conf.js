// Karma configuration

module.exports = function(config) {
  config.set({

    basePath: '',

    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    files: [
      'app/bower_components/angular/angular.min.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/scripts/*.js',
    ],

    exclude: [
    ],

    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },

    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    port: 9876,

    colors: true,

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: [],

    singleRun: false
  });
};
