var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var eslint = require('gulp-eslint');
var path = require('path');
var Server = require('karma').Server;

var reload = browserSync.reload;

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync({
    proxy: 'localhost:3000',
    port: 5000,
    notify: true,
    logLevel: 'debug',
    logPrefix: 'C4H-kakashi',
    logFileChanges: true,
    logConnections: true,
    minify: true,
  });
});

gulp.task('nodemon', function(callback) {
  var called = false;
  return nodemon({
    script: 'server.js'
  })
  .on('start', () => {
    if (!called) {
      called = true;
      callback();
    }
  })
  .on('restart', () => {
    setTimeout(() => {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('lint', function() {
  return gulp.src(['*.js', 'test/**/*.js', 'public/js/*.js', 'public/js/**/*.js']).pipe(eslint({
    'configFile': '.eslintrc.json',
    'useEslintrc': true,
  }))
  .pipe(eslint.format())
  .pipe(eslint.failOnError());
});

gulp.task('test', function(done) {
  new Server({
    configFile: path.join(__dirname, 'karma.conf.js'),
    singleRun: true
  }, done).start();
});


gulp.task('default', ['browser-sync'], function (){
  gulp.watch(['public/js/*.js'], reload);
  gulp.watch(['public/js/**/*.js'], reload);
  gulp.watch(['**/*.js'], reload);
  gulp.watch(['public/css/*.*'], reload);
  gulp.watch(['public/views/*.html'], reload);
  gulp.watch(['*.js'], reload);
});