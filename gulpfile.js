'use strict';
var gulp = require('gulp'),
    sass = require("gulp-sass"),
	gp   = require('gulp-load-plugins')(),
	browserSync = require('browser-sync').create();

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "../build/"
        }
    });
    browserSync.watch('../build', browserSync.reload)
    
});


gulp.task('sass', function () {
	return gulp.src('scss/main.scss')
	.pipe(gp.sourcemaps.init())
	.pipe(gp.sass().on('error', sass.logError))
	.pipe(gp.autoprefixer({
            browsers: ['last 10 versions']
        }))
	.on("error", gp.notify.onError({
        message: "Error: <%= error.message %>",
        title: "Stile"
      }))
	.pipe(gp.csso())
	.pipe(gp.sourcemaps.write())
	.pipe(gulp.dest('css/'));
});

gulp.task('watch', function() {
	gulp.watch('scss/**/*.scss',gulp.series('sass'));
});
gulp.task('default',gulp.series(
	gulp.parallel('sass'),
	gulp.parallel('watch','serve')
	

	));