const { src, dest, watch } = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify-es').default,
    rigger = require('gulp-rigger'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;


const paths = {
    src: "src/",
    build: "build/",
    release: "release/",
};
const Paths = new (require('./gulp/Paths'))(paths);

imgTask = () => {
    const source = Paths.setDirType('src').setFileType('img').setExtension('*').toString();
    const build = Paths.setDirType('build').setExtension('').toString();

    return src(source)
        .pipe(imagemin())
        .pipe(dest(build))
        .pipe(reload({stream: true}));
};

cssTask = () => {
    const source = Paths.setDirType('src').setFileType('css').setExtension('*.css').toString();
    const build = Paths.setDirType('build').setExtension('').toString();

    return src(source)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest(build))
        .pipe(reload({stream: true}));
};

jsTask = () => {
    const source = Paths.setDirType('src').setFileType('js').setExtension('*.js').toString();
    const build = Paths.setDirType('build').setExtension('').toString();

    return src(source)
        .pipe(uglify())
        .pipe(dest(build))
        .pipe(reload({stream: true}));
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
    cssTask();
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
    watch(Paths.setFileType('css').setExtension('*.css').toString(), cssTask);
    watch(Paths.setFileType('js').setExtension('*.js').toString(), jsTask);
    watch(Paths.setFileType('fonts').setExtension('*').toString(), fontsTask);
    watch(Paths.setFileType('').setExtension('*.html').toString(), htmlTask);

    startServer();
    cb();
};

exports.default = defaultTask;
