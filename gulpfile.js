const gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  uglifycss = require('gulp-uglifycss');
(browserSync = require('browser-sync').create()),
  (source = './src/'),
  (dest = './builds/');

sass.compiler = require('node-sass');

function html() {
  return gulp.src(dest + '**/*.html');
}

function js() {
  return gulp.src(dest + '**/*.js');
}

function styles() {
  return gulp
    .src(source + 'scss/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        sourcemap: true,
        style: 'compressed'
      }).on('error', sass.logError)
    )
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(
      uglifycss({
        maxLineLen: 80,
        uglyComments: true
      })
    )
    .pipe(gulp.dest(dest + 'css'));
}

function watch() {
  gulp.watch(dest + 'js/**/*.js', js).on('change', browserSync.reload);
  gulp.watch(source + 'scss/**/*', styles).on('change', browserSync.reload);
  gulp.watch(dest + 'index.html', html).on('change', browserSync.reload);
}

function server() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: dest
    }
  });

  gulp
    .watch(source + 'scss/**/*.scss', styles)
    .on('change', browserSync.reload);
  gulp.watch(dest + 'js/**/*.js', js).on('change', browserSync.reload);
  gulp.watch(dest + 'index.html', html).on('change', browserSync.reload);
}

var build = gulp.series(gulp.parallel(js, styles, html), server, watch);

gulp.task('default', build);
