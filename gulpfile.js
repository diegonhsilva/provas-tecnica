var gulp 		 = require('gulp'),
	concat 		 = require('gulp-concat'),
	sass 		 = require('gulp-sass'),
	plumber 	 = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	minifyjs 	 = require('gulp-uglify'),
	rename 		 = require("gulp-rename"),
	browserSync = require('browser-sync').create();

gulp.task('sass', function() 
{
	gulp.src('assets/scss/style.scss')
		.pipe(plumber())
		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(autoprefixer())
		.pipe(gulp.dest('assets/css/', {'mode': '0777'}));
});

gulp.task('uglify', function() 
{
	gulp.src('assets/js/source/**/*.js')
		.pipe(plumber())
		.pipe(concat('scripts.min.js'))
		.pipe(minifyjs())
		.pipe(gulp.dest('assets/js/'));

	gulp.src('assets/js/plugins/**/*.js')
		.pipe(plumber())
		.pipe(concat('plugins.min.js'))
		.pipe(minifyjs())
		.pipe(gulp.dest('assets/js/'));
});

gulp.task('watch', function()
{

	browserSync.init({
		injectChanges: true,
		server: './',
		watch: true
	});

	//SASS
	gulp.watch(['assets/scss/**/*.scss'], ['sass']);

	//JS
	gulp.watch(['assets/js/source/**/*.js', 'assets/js/plugins/**/*.js'], ['uglify']);

});

gulp.task('default', ['sass', 'uglify', 'watch']);