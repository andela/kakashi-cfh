var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');

gulp.task('browser-sync', ['nodemon'], () => {
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

gulp.task('nodemon', ['lint'], (cb) => {
  let called = false;
  return nodemon({
    script: 'server.js',
    ignore: [
      'node_modules/',
    ],
  })
  .on('start', () => {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', () => {
    setTimeout(() => {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task("lint", function() {
    gulp.src(['*.js', 'test/**/*.js', 'public/js/*.js', 'public/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

gulp.task('default', ['browser-sync'], () => {
  gulp.watch(['public/js/*.js'], reload);
  gulp.watch(['public/js/**/*.js'], reload);
  gulp.watch(['**/*.js'], reload);
  gulp.watch(['public/css/*.*'], reload);
  gulp.watch(['public/views/*.html'], reload);
  gulp.watch(['*.js'], reload);
});