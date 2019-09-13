var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglifycss = require('gulp-uglifycss');
var sourcemaps = require('gulp-sourcemaps');
var sassGlob = require('gulp-sass-glob');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: './dist'
  });

  gulp.watch('./scss/*.scss', ['sass']);
  gulp.watch('dist/*.html').on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp
    .src('./scss/styles.scss')
    .pipe(
      autoprefixer({
        browsers: ['> 1%', 'last 3 versions', 'Firefox >= 20', 'iOS >=7'],
        cascade: false
      })
    )
    .on('error', gutil.log)
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
    .pipe(
      plumber({
        errorHandler: function(err) {
          notify.onError({
            title: 'Gulp error in ' + err.plugin,
            message: err.toString()
          })(err);

          // play a sound once
          gutil.beep();
        }
      })
    )
    .pipe(sass())
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
