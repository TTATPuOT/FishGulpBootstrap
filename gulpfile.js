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

var build_path = "build/";
var release_path = "release/";

function ReleseBuild(cvars) {
	if(cvars.indexOf("--r") >- 1) {
		return true;
	} else{
		return false;
	}
}

var path = {
	build: {
		html: build_path,
		js: build_path+'js/',
		css: build_path+'css/',
		img: build_path+'img/',
		fonts: build_path+'fonts/'
	},
	release: {
		html: release_path,
		js: release_path+'js/',
		css: release_path+'css/',
		img: release_path+'img/',
		fonts: release_path+'fonts/'
	},
	src: {
		html: 'src/*.html',
		js: 'src/js/*.js',
		style: 'src/css/*.css',
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

//Build Tasks
gulp.task('img:build', function(){
	gulp.src(path.watch.img)
		.pipe(gulp.dest(path.release.img))
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
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}))
});
gulp.task('style:build', function(){
	gulp.src(path.src.style)
		.pipe(prefixer())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}))
});
gulp.task('build', [
	'img:build',
	'html:build',
	'js:build',
	'style:build',
	'fonts:build'
]);


//Release tasks
gulp.task('release', [
	'html:release',
	'js:release',
	'style:release',
	'img:release',
	'fonts:release'
]);
gulp.task('img:release', function(){
	gulp.src(path.watch.img)
		.pipe(imagemin())
		.pipe(gulp.dest(path.release.img))
		.pipe(reload({stream: true}));
});
gulp.task('fonts:release', function(){
	gulp.src(path.watch.fonts)
		.pipe(gulp.dest(path.release.fonts))
		.pipe(reload({stream: true}));
});
gulp.task('html:release', function(){
	gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.release.html))
		.pipe(reload({stream: true}));
});
gulp.task('js:release', function(){
	gulp.src(path.src.js)
		.pipe(uglify())
		.pipe(gulp.dest(path.release.js))
		.pipe(reload({stream: true}))
});
gulp.task('style:release', function(){
	gulp.src(path.src.style)
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(gulp.dest(path.release.css))
		.pipe(reload({stream: true}))
});

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

gulp.task('default', function() {

	if (ReleseBuild(process.argv)) {
		gulp.start('release');
		console.log("---------------");
		console.log("---------------");
		console.log("My congratulations with end of the project!");
		console.log("---------------");
		console.log("---------------");
	} else{
		gulp.start('build');
		gulp.start('webserver');
		gulp.start('watch');
	}
});