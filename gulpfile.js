'use strict';
var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-minify-css'),
	browserSync = require('browser-sync'),
	rimraf = require('rimraf'),
	imagemin = require('gulp-imagemin'),
	reload = browserSync.reload;

var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/'
	},
	src: {
		html: 'src/*.html',
		js: 'src/js/script.js',
		style: 'src/css/style.css',
		img: 'src/img/',
		fonts: 'src/fonts/'
	},
	watch: {
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/css/**/*.css',
		img: 'src/img/*',
		fonts: 'src/fonts/*'
	},
	clean: './build'
};

gulp.task("webserver", function(){
	browserSync({
		server:{
			baseDir: "./build"
		},
		host: 'localhost',
		port: 3000,
		tunnel: true
	})
});

gulp.task('img:build', function(){
	gulp.src(path.watch.img)
		.pipe(imagemin())
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
});

gulp.task('fonts:build', function(){
	gulp.src(path.watch.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.pipe(reload({stream: true}));
});

gulp.task('html:build', function(){
	gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

gulp.task('js:build', function(){
	gulp.src(path.src.js)
		.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}))
});

gulp.task('style:build', function(){
	gulp.src(path.src.style)
		.pipe(sourcemaps.init())
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}))
});

gulp.task('build', [
	'html:build',
	'js:build',
	'style:build',
	'img:build',
	'fonts:build'
]);

gulp.task('watch', function(){
	watch([path.watch.js], function(ev, callback){
		gulp.start('js:build');
	});
	watch([path.watch.html], function(ev, callback){
		gulp.start('html:build');
	});
	watch([path.watch.style], function(ev, callback){
		gulp.start('style:build');
	});
	watch([path.watch.img], function(ev, callback){
		gulp.start('img:build');
	});
	watch([path.watch.fonts], function(ev, callback){
		gulp.start('fonts:build');
	});
});

gulp.task('clean', function(callback) {
    rimraf(path.clean, callback)
});

gulp.task('default', ['build', 'webserver', 'watch']);