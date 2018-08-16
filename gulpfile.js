'use strict';
var gulp = 			require('gulp'),
    gp = 			require('gulp-load-plugins')(),
    sass = 			require("gulp-sass"),
	browserSync = 	require('browser-sync').create(),
	uglify = 		require('gulp-uglify'),
	pump = 			require('pump'),
	imagemin = 		require('gulp-imagemin'),
    concat =        require('gulp-concat');

gulp.task('pug', function () {
    return gulp.src('src/pug/pages/*.pug')
        .pipe(gp.pug({
            pretty:true
        }))
        .pipe(gulp.dest('build'))
        .on('end',browserSync.reload);
});

gulp.task('sass', function () {
    return gulp.src('src/static/scss/main.scss')
        .pipe(gp.sourcemaps.init())
        .pipe(gp.sass().on('error', sass.logError))
        .pipe(gp.autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .on("error", gp.notify.onError({
            message: "Error: <%= error.message %>",
            title: "Error!!!CSS"
        }))
        .pipe(gp.csso())
        .pipe(gp.sourcemaps.write())
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.reload({
            stream:true
        }));
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "build/"
        }
    });

});

gulp.task('imagemin', () =>
    gulp.src('src/static/img/*')
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
        .pipe(gulp.dest('build/imgmin/'))
);

gulp.task('compress', function () {
 return gulp.src('src/static/js/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('build/minjs'));
});



gulp.task('scripts', function() {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js',
        'node_modules/slick-carousel/slick/slick.min.js',
    'src/static/js/jquery.maskedinput.js'])
        .pipe(concat('libs.min.js'))
        .pipe(gulp.dest('build/minjs/'))
        .pipe(browserSync.reload({
            stream:true
        }));
});


gulp.task('watch', function() {
    gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
	gulp.watch('src/static/scss/**/*.scss',gulp.series('sass'));
	gulp.watch('src/static/img/*',gulp.series('imagemin'));
	gulp.watch('src/static/js/*.js',gulp.series('compress'));
});
gulp.task('default',gulp.series(
	gulp.parallel('pug','compress','scripts','imagemin','sass'),
	gulp.parallel('watch','serve')
	

	));