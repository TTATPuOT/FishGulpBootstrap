const { src, dest, watch } = require('gulp'),
	cleanCSS = require('gulp-clean-css'),
	uglify = require('gulp-uglify-es').default,
	rigger = require('gulp-rigger'),
	imagemin = require('gulp-imagemin'),
	browserSync = require('browser-sync'),
	less = require('gulp-less'),
	sourcemaps = require('gulp-sourcemaps'),
	sass = require('gulp-sass'),
	reload = browserSync.reload;

const dev = !(process.argv.find(i => i === '--r'));
if (dev) {
	console.log('Development GULP starts');
} else{
	console.log('Release GULP starts');
}


const paths = {
	src: "src/",
	build: "build/",
	release: "release/",
};
const Paths = new (require('./gulp/Paths'))(paths);

imgTask = () => {
	const source = Paths.setDirType('src').setFileType('img').setExtension('*').toString();
	const build = Paths.setDirType('build').setExtension('').toString();

	if (dev)
		return src(source).pipe(imagemin()).pipe(dest(build)).pipe(reload({stream: true}));
	else
		return src(source).pipe(dest(build)).pipe(reload({stream: true}));
	
};

stylesTask = (type = 'css') => {
	console.log('StyleTask', type);
	const build = Paths.setDirType('build').setFileType('css').setExtension('').toString();

	if (type === 'less') {
		const sourceLess = Paths.setDirType('src').setFileType('css').setExtension('*.less').toString();

		if (dev)
			return src(sourceLess)
				.pipe(sourcemaps.init())
				.pipe(less())
				.pipe(sourcemaps.write())
				.pipe(rigger())
				.pipe(cleanCSS({compatibility: 'ie8'}))
				.pipe(dest(build))
				.pipe(reload({stream: true}));
		else
			return src(sourceLess)
				.pipe(less())
				.pipe(rigger())
				.pipe(cleanCSS({compatibility: 'ie8'}))
				.pipe(dest(build))
				.pipe(reload({stream: true}));
	} else if (type === 'sass') {
		const sourceSass = Paths.setDirType('src').setFileType('css').setExtension('*.sass').toString();

		if (dev)
			return src(sourceSass)
				.pipe(sourcemaps.init())
				.pipe(sass().on('error', sass.logError))
				.pipe(rigger())
				.pipe(cleanCSS({compatibility: 'ie8'}))
				.pipe(sourcemaps.write())
				.pipe(dest(build))
				.pipe(reload({stream: true}));
		else
			return src(sourceSass)
				.pipe(sass().on('error', sass.logError))
				.pipe(rigger())
				.pipe(cleanCSS({compatibility: 'ie8'}))
				.pipe(dest(build))
				.pipe(reload({stream: true}));
	} else{
		const source = Paths.setDirType('src').setFileType('css').setExtension('*.css').toString();

		if (dev) 
			return src(source)
				.pipe(rigger())
				.pipe(cleanCSS({compatibility: 'ie8'}))
				.pipe(dest(build))
				.pipe(reload({stream: true}));
		else
			return src(source)
				.pipe(rigger())
				.pipe(dest(build))
				.pipe(reload({stream: true}));
	}
};
lessTask = () => stylesTask('less');
sassTask = () => stylesTask('sass');

jsTask = () => {
	const source = Paths.setDirType('src').setFileType('js').setExtension('*.js').toString();
	const build = Paths.setDirType('build').setExtension('').toString();

	if (dev)
		return src(source).pipe(rigger()).pipe(uglify()).pipe(dest(build)).pipe(reload({stream: true}));
	else
		return src(source).pipe(rigger()).pipe(dest(build)).pipe(reload({stream: true}));
};

htmlTask = () => {
	const source = Paths.setDirType('src').setFileType('').setExtension('*.html').toString();
	const build = Paths.setDirType('build').setExtension('').toString();

	console.log(source);
	console.log(build);

	return src(source)
		.pipe(rigger())
		.pipe(dest(build))
		.pipe(reload({stream: true}));
};

fontsTask = () => {
	const source = Paths.setDirType('src').setFileType('fonts').setExtension('*').toString();
	const build = Paths.setDirType('build').setExtension('').toString();

	return src(source)
		.pipe(dest(build))
		.pipe(reload({stream: true}));
};

workAll = () => {
	imgTask();
	stylesTask();
	lessTask();
	sassTask();
	jsTask();
	fontsTask();
	htmlTask();
};

startServer = () => {
	browserSync({
		server: {
			baseDir: Paths.setDirType('build').setFileType('').setExtension('').toString()
		},
		host: 'localhost',
		port: 3000,
		tunnel: false
	});
	workAll();
};

defaultTask = cb => {
	Paths.setDirType('src');

	watch(Paths.setFileType('img').setExtension('*').toString(), imgTask);
	watch(Paths.setFileType('css').setExtension('*.css').toString(), stylesTask);
	watch(Paths.setFileType('css').setExtension('*.less').toString(), lessTask);
	watch(Paths.setFileType('css').setExtension('*.sass').toString(), sassTask);
	watch(Paths.setFileType('js').setExtension('*.js').toString(), jsTask);
	watch(Paths.setFileType('fonts').setExtension('*').toString(), fontsTask);
	watch(Paths.setFileType('').setExtension('*.html').toString(), htmlTask);

	startServer();
	cb();
};

exports.default = defaultTask;
