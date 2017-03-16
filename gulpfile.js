const gulp = require('gulp');
const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');
const path = require('path');
const Server = require('karma').Server;
const jasmine = require('gulp-jasmine');

const reload = browserSync.reload;

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

gulp.task('nodemon', (callback) => {
  let called = false;
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

gulp.task('lint', () => gulp.src([
  '*.js',
  'test/**/*.js',
  'public/js/*.js',
  'public/js/**/*.js'
]).pipe(eslint({
  configFile: '.eslintrc.json',
  useEslintrc: true,
}))
.pipe(eslint.format())
.pipe(eslint.failOnError())
);

gulp.task('test-back', () =>
  gulp.src('test/backend/*.js')
    .pipe(jasmine())
);

gulp.task('test-front', (done) => {
  new Server({
    configFile: path.join(__dirname, 'karma.conf.js'),
    singleRun: true,
  }, () => {
    done();
  }).start();
});

gulp.task('test', ['test-front', 'test-back']);

gulp.task('default', ['browser-sync'], () => {
  gulp.watch([
    'public/js/**/*.js',
    '*.js', 'app/**/*.js',
    'config/**/*.js',
    'app/views/**/*.jade'
  ], reload);
  gulp.watch(['public/css/*.*'], reload);
  gulp.watch(['public/views/*.html'], reload);
  gulp.watch([], reload);
});
