### Gulp

####gulpfile.js

```
import gulp from 'gulp';
import pug from 'gulp-pug';
import del from 'del';
import ws from 'gulp-webserver';
import ghPages from 'gulp-gh-pages';
import gimg from 'gulp-image';
import gsass from 'gulp-sass';
import gautoprefixer from 'gulp-autoprefixer';
import minifyCss from 'gulp-csso';
import gbro from 'gulp-bro';
import babelify from 'babelify';

gsass.compiler = require('node-sass');

const routes = {
	pug: {
		watch: 'src/**/*.pug',
		src: 'src/*.pug',
		dest: 'build',
	},
	img: {
		src: 'src/img/*',
		dest: 'build/img',
	},
	style: {
		watch: 'src/scss/*',
		src: 'src/scss/style.scss',
		dest: 'build/css',
	},
	js: {
		src: 'src/js/main.js',
		dest: 'build/js',
		watch: 'src/js/*',
	},
};

const clean = () => del(['build']);
const view = () => gulp.src(routes.pug.src).pipe(pug()).pipe(gulp.dest(routes.pug.dest));
const img = () => gulp.src(routes.img.src).pipe(gimg()).pipe(gulp.dest(routes.img.dest));
const sass = () =>
	gulp
	.src(routes.style.src)
	.pipe(gsass().on('error', gsass.logError))
	.pipe(gautoprefixer({
		cascade: true,
		overrideBrowserslist: ['last 2 versions']
	}))
	.pipe(minifyCss())
	.pipe(gulp.dest(routes.style.dest));

const js = () =>
	gulp
	.src(routes.js.src)
	.pipe(gbro({
		transform: [babelify.configure({
			presets: ['@babel/preset-env']
		}), ['uglifyify', {
			global: true
		}]]
	}))
	.pipe(gulp.dest(routes.js.dest));

const webserver = () => gulp.src('build').pipe(ws({
	livereload: true,
	open: true
}));

const watch = () => {
	gulp.watch(routes.pug.watch, view);
	gulp.watch(routes.img.src, img);
	gulp.watch(routes.style.watch, sass);
	gulp.watch(routes.js.watch, js);
};

const gh = () => gulp.src('build/**/*').pipe(ghPages());

const prepare = gulp.series([clean, img]);
const assets = gulp.series([view, sass, js]);
const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);
export const build = gulp.series([prepare, assets]);
export const deploy = gulp.series([build, gh]);
```
