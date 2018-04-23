'use strict';
var gulp = 			require('gulp'),
    sass = 			require("gulp-sass"),
	gp = 			require('gulp-load-plugins')(),
	browserSync = 	require('browser-sync').create(),
	uglify = 		require('gulp-uglify'),
	pump = 			require('pump'),
	imagemin = 		require('gulp-imagemin');

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "../build/"
        }
    });
    browserSync.watch('../build', browserSync.reload)
    
});

gulp.task('imagemin', () =>
    gulp.src('img/*')
        .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
        plugins: [
            {removeViewBox: false},
            {cleanupIDs: false}
        ]
    })
]))
        .pipe(gulp.dest('imgmin/'))
);

gulp.task('compress', function () {
 return gulp.src('js/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('minjs'));
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
	gulp.watch('img/*',gulp.series('imagemin'));
	gulp.watch('js/*.js',gulp.series('compress'));
});
gulp.task('default',gulp.series(
	gulp.parallel('sass'),
	gulp.parallel('imagemin'),
	gulp.parallel('compress'),
	gulp.parallel('watch','serve')
	

	));