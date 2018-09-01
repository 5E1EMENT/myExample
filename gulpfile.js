'use strict';
var gulp = 			require('gulp'),
    gp = 			require('gulp-load-plugins')(),
    sass = 			require("gulp-sass"),
	browserSync = 	require('browser-sync').create(),
	uglify = 		require('gulp-uglify'),
	pump = 			require('pump'),
    tinypng =       require('gulp-tinypng-compress'),
    concat =        require('gulp-concat'),
    svgmin =        require('gulp-svgmin'),
    cheerio =       require('gulp-cheerio'),
    replace =       require('gulp-replace'),
    svgSprite =     require('gulp-svg-sprites'),
    notify =        require("gulp-notify");

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
        .on("error", gp.notify.onError({
            message: "Error: <%= error.message %>",
            title: "Error!!!CSS"
        }))
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

gulp.task('fonts', function () {
    gulp.src('src/static/fonts/*.*') //Выберем файлы по нужному пути
        .pipe(gulp.dest('build/fonts')); //Выплюнем их в папку build
});
gulp.task('php', function () {
    gulp.src('src/static/mail.php') //Выберем файлы по нужному пути
        .pipe(gulp.dest('build/')); //Выплюнем их в папку build
});


gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "build/"
        }
    });

});


gulp.task('tinypng', function () {
   return gulp.src('src/static/img/*.{png,jpg,jpeg,JPG}')
        .pipe(tinypng({
            key: 'rRPO2Seavi9OVQAFZL3xe2nzhyCsgRhh',
            sigFile: 'images/.tinypng-sigs',
            log: true,
            parrallel: true
        }))
        .pipe(gulp.dest('build/img'))
        .on('end',browserSync.reload);
});

gulp.task('compress', function () {
 return gulp.src('src/static/js/*.js')
  .pipe(uglify())
     .on("error", gp.notify.onError({
         message: "Error: <%= error.message %>",
         title: "Error!!!"
     }))

  .pipe(gulp.dest('build/minjs'))
     .pipe(browserSync.reload({
         stream:true
     }));;
});



gulp.task('scripts', function() {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js',
        'node_modules/slick-carousel/slick/slick.min.js',
    'src/static/js/libs/jquery.maskedinput.js'])
        .pipe(concat('libs.min.js'))
        .pipe(gulp.dest('build/minjs/'))

        .pipe(browserSync.reload({
            stream:true
        }));
});

gulp.task('svg', function () {
    return gulp.src('src/static/img/svg/*.svg')
    // minify svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill and style declarations in out shapes
        .pipe(cheerio({
            run: function ($) {

            },
            parserOptions: { xmlMode: true }
        }))
        // cheerio plugin create unnecessary string '>', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite(({
            baseSize: 10,
            mode: "symbols",
            svg: {
                sprite: "svg.svg",

            }
        })))
        .pipe(gulp.dest('build/img/'));
});

gulp.task('watch', function() {
    gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
	gulp.watch('src/static/scss/**/*.scss',gulp.series('sass'));
	gulp.watch('src/static/img/*',gulp.series('tinypng'));
	gulp.watch('src/static/js/*.js',gulp.series('compress'));
	gulp.watch('src/static/img/svg/*.svg',gulp.series('svg'));

});

gulp.task('default',gulp.series(
	gulp.parallel('tinypng','pug','compress','scripts','sass', 'svg'),
	gulp.parallel('watch','serve')

	));