'use strict';
// PACKAGES
const { series } = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const webpackStream = require('webpack-stream');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const filesize = require('gulp-filesize');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
let isProd = true;
const browserSyncConfig = {
    server: {
        baseDir: "./",
    },
};

const pathConfig = {
    src: {
        style: 'src/styles/main.scss',
        js: 'src/js/**/*.js',
    },
    build: {
        css: `./build/styles`,
        js: `./build/js`
    },
    watch: {
        style: ['src/styles/**/*.scss'],
        js: './src/js/**/*.js',
        html: `./**/*.html`
    }
};

function devBuildStyles() {
    return gulp.src(pathConfig.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(pathConfig.build.css))
        .pipe(browserSync.stream())
}

function devBuildJS() {
    return gulp.src(pathConfig.src.js)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(plumber({
            errorHandler: notify.onError({
                title: "JS",
                message: "Error: <%= error.message %>"
            })
        }))
        .pipe(webpackStream({
            mode: isProd ? 'production' : 'development',
            output: {
                filename: 'main.js',
            },
            module: {
                rules: [{
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    targets: "defaults"
                                }]
                            ]
                        }
                    }
                }]
            },
        }))
        .on('error', function (err) {
            console.error('WEBPACK ERROR', err);
            this.emit('end');
        })
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(pathConfig.build.js))
        .pipe(browserSync.reload({ stream: true }));
}
function watch() {
    browserSync.init(browserSyncConfig);
    gulp.watch(pathConfig.watch.style, devBuildStyles);
    gulp.watch(pathConfig.watch.js, devBuildJS);
    gulp.watch(pathConfig.watch.html).on('change', browserSync.reload);
}

function prodBuildStyles() {
    return gulp.src(pathConfig.src.style)
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(filesize())
        .pipe(cleanCSS())
        // .pipe(rename('new name'))
        .pipe(gulp.dest(pathConfig.build.css))
        .pipe(filesize())
}

function prodBuildJS() {
    return gulp.src(pathConfig.src.js)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(filesize())
        .pipe(uglify())
        .pipe(gulp.dest(pathConfig.build.js))
        .pipe(filesize())
}

function cleanStylesDir(src) {
    return gulp.src([pathConfig.build.css + '/*.css', pathConfig.build.css + '/*.css.map'], { read: false, allowEmpty: true })
        .pipe(clean());
}

function cleanJSDir(src) {
    return gulp.src([pathConfig.build.js + '/*.js', pathConfig.build.js + '/*.js.map'], { read: false })
        .pipe(clean());
}


exports.devBuildStyles = devBuildStyles;
exports.devBuildJS = devBuildJS;
exports.prodBuildStyles = series(cleanStylesDir, prodBuildStyles);
exports.prodBuildJS = series(cleanJSDir, prodBuildJS);
exports.dev = watch;
exports.devBuild = series(devBuildStyles, devBuildJS);
exports.build = series(cleanStylesDir, prodBuildStyles, cleanJSDir, prodBuildJS);