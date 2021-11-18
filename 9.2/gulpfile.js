let projectFolder = "dist";
let sourceFolder = "src";

let path = {
    build:{
        html: projectFolder + "/",
        css: projectFolder + "/css/",
        js: projectFolder + "/js/",
        img: projectFolder + "/img/",
        fonts: projectFolder + "/fonts/",
    },
    src:{
        html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
        css: sourceFolder + "/scss/index.scss",
        js: sourceFolder + "/scripts/index.js",
        img: sourceFolder + "/img/**/*.{jpg,svg,png,gif,ico,webp}",
        fonts: sourceFolder + "/fonts/*.ttf",
    },
    watch:{
        html: sourceFolder + "/**/*.html",
        css: sourceFolder + "/scss/**/*.scss",
        js: sourceFolder + "/scripts/**/*.js",
        img: sourceFolder + "/img/**/*.{jpg,svg,png,gif,ico,webp}",
    },
    clean: "./" + projectFolder + "/"
}

let {src,dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileInclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    groupMedia = require('gulp-group-css-media-queries'),
    cleanCss = require('gulp-clean-css'),
    renameMedia = require('gulp-rename'),
    uglifyEs = require('gulp-uglify-es').default,
    babel = require('gulp-babel'),
    imagemin = require('gulp-imagemin');

function browserSync(arg){
    browsersync.init({
        server:{
            baseDir:"./" + projectFolder + "/"
        },
        port: 3000,
        notify: false
    })
}

function css(){
    return src(path.src.css)
        .pipe(autoprefixer({
            overrideBrowserslist: ["last 5 version"],
            cascade: true
        }))
        .pipe(groupMedia())
        .pipe(dest(path.build.css))
        .pipe(cleanCss())
        .pipe(renameMedia({
            extname: ".min.css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function html(){
    return src(path.src.html)
            .pipe(fileInclude())
            .pipe(dest(path.build.html))
            .pipe(browsersync.stream())
}

function images(){
    return src(path.src.img)
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{
                    removeViewBox: false
                }],
                interlaced: true,
                optimzationLevel: 3
            }))
            .pipe(dest(path.build.img))
            .pipe(browsersync.stream())
}

function js(){
    return src(path.src.js)
            .pipe(fileInclude())
            .pipe(dest(path.build.js))
            .pipe(babel())
            .pipe(uglifyEs())
            .pipe(renameMedia({
                extname: ".min.js"
            }))
            .pipe(dest(path.build.js))
            .pipe(browsersync.stream())
}

function whatchFiles(arg){
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean(arg){
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(css, html ,js ,images ));
let  watch = gulp.parallel(build,whatchFiles,browserSync);


exports.js = js;
exports.images = images;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;