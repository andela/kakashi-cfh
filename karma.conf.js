module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'test/client/helpers/socket/socket.io.js',
      'public/lib/angular/angular.js',
      'public/lib/angular-mocks/angular-mocks.js',
      'public/lib/angular-cookies/angular-cookies.js',
      'public/lib/angular-resource/angular-resource.js',
      'public/lib/angular-route/angular-route.js',
      'public/lib/angular-bootstrap/ui-bootstrap.min.js',
      'public/lib/angular-ui-utils/modules/route/route.js',
      'public/lib/angular-sanitize/angular-sanitize.min.js',
      'public/lib/jquery/jquery.min.js',
      'public/js/**/*.js',
      'test/client/*Spec.js',
    ],
    exclude: [
      'public/js/main.js'
    ],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    preprocessors: {
      'test/**/*Spec.js': 'coverage'
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    browsers: process.env.TRAVIS ? ['Chrome_travis_ci'] : ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  });
};
