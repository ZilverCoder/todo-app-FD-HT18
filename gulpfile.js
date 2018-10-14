'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	watchSass = require('gulp-watch-sass'),
	ts = require('gulp-typescript'),
	tsProject = ts.createProject("tsconfig.json");

var paths = {
	//Non Compiled
	sassFolder: './public/sass/',
	jsFolder: './public/js/',
	//Compiled
	compiledCSS: './public/compiled/css',
	compiledJS: './public/compiled/js'
};

//#region Compile Func
	gulp.task('sass:compile', () => {
		return gulp.src(paths.sassFolder + '*.sass')
			.pipe(sass.sync().on('error', sass.logError))
			//.pipe(sass({ outputStyle: 'compressed' })) //This minifies the output
			.pipe(sass())
			.pipe(gulp.dest(paths.compiledCSS));
	});
	gulp.task('ts:compile', () => {
		return tsProject.src()
			.pipe(tsProject())
			.js.pipe(gulp.dest(paths.compiledJS));
	});
//#endregion

//#region Watch Func
	gulp.task('sass:watch', () => {
		watchSass([paths.sassFolder + '*.sass'])
			.pipe(sass())
			//.pipe(sass({ outputStyle: 'compressed', sourceComments: false })) //This minifies the output
			.pipe(gulp.dest(paths.compiledCSS));
	});
//#endregion