var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

// Basic Gulp task syntax
gulp.task('hello', function() {
  console.log('iniciamos el repo!');
})

// Development Tasks 
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'templates/funcesia'
    }
  })
})

gulp.task('sass', function() {
  return gulp.src('dev/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass()) // Passes it through a gulp-sass
    .pipe(gulp.dest('templates/funcesia/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
})

// Watchers
gulp.task('watch', function() {
  gulp.watch('dev/scss/**/*.scss', ['sass']);
  gulp.watch('dev/*.html', browserSync.reload);
  gulp.watch('dev/js/**/*.js', browserSync.reload);
})

// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
gulp.task('useref', function() {
  return gulp.src('dev/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('templates/funcesia'));
});

// Optimizing Images 
gulp.task('images', function() {
  return gulp.src('dev/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('templates/funcesia/images'))
});

// Copying fonts 
gulp.task('fonts', function() {
  return gulp.src('dev/fonts/**/*')
    .pipe(gulp.dest('templates/funcesia/fonts'))
})

// Cleaning 
gulp.task('clean', function() {
  return del.sync('templates/funcesia').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:dist', function() {
  return del.sync(['templates/funcesia/**/*', '!templates/funcesia/images', '!templates/funcesia/images/**/*']);
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync', 'watch','useref'],
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})