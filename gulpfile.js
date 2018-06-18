const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const htmlReplace = require('gulp-html-replace');
const uglify = require('gulp-uglify');
const cssmin = require('gulp-cssmin');
const browserSync = require('browser-sync');
const jshint = require('gulp-jshint');
const jshintStylish = require('jshint-stylish');
const csslint = require('gulp-csslint');
const zip = require('gulp-zip');


gulp.task('copy', ['clean'], function() {

    return gulp.src('src/img/**/*')
        .pipe(gulp.dest('dist/img') );
});

gulp.task('clean', function() {
    return gulp.src('dist')
        .pipe(clean());
});

gulp.task('build-img', ['copy'], function() {
    gulp.src('src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('merge-css', function() {
    gulp.src(['src/css/normalize.min.css',
        'src/css/bootstrap.min.css',
        'src/css/global.css',
        'src/css/video.css',
        'src/css/section.css',
        'src/css/footer.css'])
        .pipe(concat('site.css') )
        .pipe(cleanCSS() )
        .pipe(gulp.dest('dist/css') );
});

gulp.task('html-replace', function() {
    gulp.src('src/**/*.html')
        .pipe(htmlReplace({css:'css/site.css', js: 'js/site.js'}) )
        .pipe(gulp.dest('dist') );
});

gulp.task('merge-js', function() {
    gulp.src(['src/js/jquery-3.3.1.min.js',
        'src/js/jquery.mb.YTPlayer.js',
        'src/js/global.js'])
        .pipe(concat('site.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('min-css', function(){
    gulp.src('dist/**/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dist'));
});

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    });

    gulp.watch('src/**/*').on('change', browserSync.reload);

    gulp.watch('src/css/**/*.css').on('change', function(event) {
        gulp.src(event.path)
            .pipe(csslint())
            .pipe(csslint.formatter());
    });

    gulp.watch('src/js/**/*.js').on('change', function(event) {

        gulp.src(event.path)
            .pipe(jshint())
            .pipe(jshint.reporter(jshintStylish));
    });

});

gulp.task('zip', function(){
    gulp.src('dist/**/*')
        .pipe(zip('projeto.zip'))
        .pipe(gulp.dest('dist'))
});