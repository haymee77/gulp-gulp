import gulp from 'gulp';
import pug from 'gulp-pug';
import del from 'del';
import ws from 'gulp-webserver';
import ghPages from 'gulp-gh-pages';
import gimg from 'gulp-image';

const routes = {
  pug: {
    watch: 'src/**/*.pug',
    src: 'src/*.pug',
    dest: 'build',
  },
  img: {
    src: 'src/img/**/*.*',
    dest: 'build/img',
  },
};

const clean = () => del(['build']);
const view = () => gulp.src(routes.pug.src).pipe(pug()).pipe(gulp.dest(routes.pug.dest));
const img = () => gulp.src(routes.img.src).pipe(gimg()).pipe(gulp.dest(routes.img.dest));

const webserver = () => gulp.src('build').pipe(ws({ livereload: true, open: true }));
const watch = () => {
  gulp.watch(routes.pug.watch, view);
};

const gh = () => gulp.src('/build/**/*').pipe(ghPages());

const prepare = gulp.series([clean]);
const assets = gulp.series([view, img]);
const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);
export const build = gulp.series([prepare, assets]);
export const deploy = gulp.series([build, gh]);
