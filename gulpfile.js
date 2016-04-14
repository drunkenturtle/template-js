var gulp = require('gulp');
var webserver = require('gulp-webserver');
var uglify = require('gulp-uglify');
var copy = require('gulp-copy');
var concatenate = require('gulp-concat');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var cleancss = require('gulp-clean-css');
var del = require('del');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('server-prod', function() {
  return gulp.src('build/prod')
    .pipe(webserver({
      host: '0.0.0.0',
      port: 8080,
      fallback: 'index.html',
      livereload: true
    }));
});

gulp.task('server-dev', function() {
  return gulp.src('build/dev')
    .pipe(webserver({
      host: '0.0.0.0',
      port: 8080,
      fallback: 'index.html',
      livereload: true
    }));
});

gulp.task('clean', function () {
  return del(['build/**/*']);
});

gulp.task('compress', ['build'], function() {
  return gulp.src('build/app.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/min'));
});

gulp.task('copy-html-dev', function () {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('build/dev'));
});

gulp.task('copy-html-prod', function () {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('build/prod'));
});

gulp.task('concat-dev', ['build'], function() {
  return gulp.src(['libs/jquery-1.12.3.min.js', 'build/app.js'])
    .pipe(concatenate('app.js'))
    .pipe(gulp.dest('build/dev/js'));
});

gulp.task('concat-prod', ['compress'], function() {
  return gulp.src(['libs/jquery-1.12.3.min.js', 'build/min/app.js'])
    .pipe(concatenate('app.js'))
    .pipe(gulp.dest('build/prod/js'));
});

gulp.task('less-dev', function() {
  return gulp.src('src/less/app.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(cleancss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/dev/css'));
});

gulp.task('less-prod', function() {
  return gulp.src('src/less/app.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(cleancss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/prod/css'));
});

gulp.task('build', function() {
  browserify({
    entries: 'src/jsx/index.jsx',
    extensions: ['.jsx'],
    debug: true
  })
  .transform(babelify, {presets: ["es2015", "react"]})
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('build'));
});

gulp.task('watch-dev', function() {
  gulp.watch(['src/jsx/**/*.jsx', 'src/less/*.less'], ['dev']);
});

gulp.task('watch-prod', function() {
  gulp.watch(['src/jsx/**/*.jsx', 'src/less/*.less'], ['prod']);
});

/*###################
  configurar para tu distribucion
*/
gulp.task('clean-dist', function () {
  return del(['../server/core/web/static/**/*',
              '../server/core/web/templates/index.html'],
              {force: true}); //la opcion force es para poder borrar fuera del directorio principal
});

gulp.task('copy-dist-html', ['clean-dist'], function () {
  return gulp.src('build/prod/index.html')
    .pipe(gulp.dest('../server/core/web/templates'));
});

gulp.task('copy-dist-css', ['copy-dist-html'], function () {
  return gulp.src(['build/prod/css/**/*'])
    .pipe(gulp.dest('../server/core/web/static/css'));
});

gulp.task('copy-dist-js', ['copy-dist-css'], function () {
  return gulp.src(['build/prod/js/**/*'])
    .pipe(gulp.dest('../server/core/web/static/js'));
});
//tarea para copiar los archivos generados a tu distribucion favorita java war, python (tornado, django, flask)
gulp.task('dist', ['copy-dist-js']);
/*###################*/

//tareas principales
//servidor modo desarrollo
gulp.task('default', ['server-dev', 'watch-dev']);
//servidor modo produccion
//gulp.task('default', ['server-prod', 'watch-prod']);
gulp.task('dev', ['concat-dev', 'less-dev', 'copy-html-dev']);
gulp.task('prod', ['concat-prod', 'less-prod', 'copy-html-prod']);
