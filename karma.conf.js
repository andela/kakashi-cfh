module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'test/client/**/*Spec.js'
    ],
    exclude: [
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
    concurrency: Infinity,
  });
};
