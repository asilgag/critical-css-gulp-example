'use strict';

var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    requireDir = require('require-dir')('./gulp_tasks');

var $ = require('gulp-load-plugins')();
var config = require('./gulpconfig.js');

gulp.task('default', ['critical']);
