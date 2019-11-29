const gulp = require('gulp');
const browserSync = require('browser-sync');
const connect = require('gulp-connect-php');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const tildeImporter = require('node-sass-tilde-importer');


gulp.task('serve-build', () => {
    connect.server({
        keepalive: true,
        port: 8000,
        base: 'dist'
    }, function () {
        browserSync({
            proxy: 'localhost:8000'
        });
    });
})

var sassPaths = ['./node_modules'];
gulp.task('sass', function () {
    return gulp.src([
            'src/assets/scss/**/*.scss'
        ])
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: sassPaths,
            importer: tildeImporter,
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("src/assets/css"))
        .pipe(browserSync.stream());
});

//  Serve Full browser sync server with Hot reloading Sass
gulp.task('serve', gulp.series('sass', function () {

    connect.server({
        keepalive: true,
        port: 8000,
        base: 'src'
    }, function () {
        browserSync({
            proxy: 'localhost:8000'
        });
    });
    gulp.watch([
        'src/assets/js/**/*.js',
        'src/**/*.php'
    ]).on('change', browserSync.reload);
    gulp.watch(['src/assets/scss/**/*.scss'], gulp.series('sass'));
}));

gulp.task('html-build', function () {
    return gulp.src([
            'src/**/*.php',
            'src/tile.png',
            'src/tile-wide.png',
            'src/site.webmanifest',
            'src/robots.txt',
            'src/icon.png',
            'src/humans.txt',
            'src/favicon.ico',
            'src/browserconfig.xml'
        ], {
            base: './src',
            allowEmpty: true
        })
        .pipe(gulp.dest("dist"))
})

gulp.task('sass-build', function () {
    return gulp.src([
            'src/assets/scss/**/*.scss'
        ])
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: sassPaths,
            importer: tildeImporter,
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest("dist/assets/css"));
})

gulp.task('img-build', function () {
    return gulp.src([
            'src/assets/img/**'
        ])
        .pipe(gulp.dest('dist/assets/img'))
})

gulp.task('fonts-build', function () {
    return gulp.src([
            'src/assets/fonts/**'
        ])
        .pipe(gulp.dest('dist/assets/fonts'))
})

gulp.task('js-build', function () {
    return gulp.src(['src/assets/js/**/*.js'])
        .pipe(gulp.dest('dist/assets/js'))
});

gulp.task('build',
    gulp.series('js-build',
        'sass-build',
        'html-build',
        'img-build',
        'fonts-build')
);

gulp.task('default',
    gulp.series('serve')
);