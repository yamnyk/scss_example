const gulp = require("gulp"),
  clean = require("gulp-clean"),
  concat = require("gulp-concat"),
  imagemin = require("gulp-imagemin"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync").create();

sass.compiler = require("node-sass");

const paths = {
  html: "./index.html",
  src: {
    scss: "./src/scss/**/*.scss",
    js: "./src/js/*.js",
    img: "./src/img/*",
  },
  build: {
    css: "./build/css/",
    js: "./build/js/",
    img: "./build/img/",
    self: "./build/",
  },
};

/*** FUNCTIONS ***/

const buildJS = () =>
  gulp
    .src(paths.src.js)
    .pipe(concat("script.js"))
    .pipe(gulp.dest(paths.build.js))
    .pipe(browserSync.stream());

const buildCSS = () =>
  gulp
    .src(paths.src.scss)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(paths.build.css))
    .pipe(browserSync.stream());

const buildIMG = () =>
  gulp
    .src(paths.src.img)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.build.img))
    .pipe(browserSync.stream());

const cleanBuild = () =>
  gulp.src(paths.build.self, { allowEmpty: true }).pipe(clean());

const build = gulp.series(buildCSS, buildJS);

const watcher = () => {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });

  gulp.watch(paths.src.scss, buildCSS).on("change", browserSync.reload);
  gulp.watch(paths.src.js, buildJS).on("change", browserSync.reload);
  gulp.watch(paths.src.img, buildIMG).on("change", browserSync.reload);
  gulp.watch(paths.html, build).on("change", browserSync.reload);
};

/*** TASKS ***/
gulp.task("clean", cleanBuild);
gulp.task("buildCSS", buildCSS);
gulp.task("buildJS", buildJS);

gulp.task(
  "default",
  gulp.series(cleanBuild, gulp.parallel(buildIMG, build), watcher)
);
