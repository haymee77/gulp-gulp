import gulp from 'gulp';
import pug from 'gulp-pug';
import del from 'del';
import ghPages from 'gulp-gh-pages';

const routes = {
  pug: {
    src: 'src/*.pug',
    dest: 'build',
  },
};

const clean = () => del(['build']);
const view = () => gulp.src(routes.pug.src).pipe(pug()).pipe(gulp.dest(routes.pug.dest));
const gh = () => gulp.src('/build/**/*').pipe(ghPages());

const prepare = gulp.series([clean]);
const assets = gulp.series([view]);

export const dev = gulp.series([prepare, assets]);
export const build = gulp.series([prepare, assets]);
export const deploy = gulp.series([build, gh]);
