var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('default', ['styles', 'scripts'], function() {
  console.log('Thus Spake Zara – Love Island, 2016')
});

gulp.task('styles', function() {
  return gulp.src('assets/styles/main.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('scripts', function() {
  return gulp.src('assets/javascripts/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ''
    },
  })
})

gulp.task('watch', ['browserSync', 'styles', 'scripts'], function() {
  gulp.watch('assets/styles/**/*.scss', ['styles']);
  gulp.watch('assets/javascripts/**/*.js', ['scripts']);
  gulp.watch('/*.html', browserSync.reload());
});
