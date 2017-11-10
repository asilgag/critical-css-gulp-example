var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var urljoin = require('url-join');
var replace = require('gulp-replace');
var rimraf = require('rimraf');
var request = require('request');
var rp = require('request-promise');
var critical = require('critical');
var osTmpdir = require('os-tmpdir');
var config = require('../gulpconfig.js');
var configLocal = require('../gulpconfig.local.js');

// Allow requests to work with non-valid SSL certificates.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

gulp.task('critical', ['critical:clean'], function (done) {
  Object.keys(config.critical.urls).map(function(url, index) {
    var pageUrl = urljoin( configLocal.critical.baseDomain, url );
    var destCssPath = path.join(process.cwd(), config.critical.dest, config.critical.urls[url] + '.css' );

    return rp({uri: pageUrl, strictSSL: false}).then(function (body) {
      var htmlString = body
        .replace(/href="\//g, 'href="' + urljoin(configLocal.critical.baseDomain, '/'))
        .replace(/src="\//g, 'src="' + urljoin(configLocal.critical.baseDomain, '/'));

      gutil.log('Generating critical css', gutil.colors.magenta(destCssPath), 'from', pageUrl);

      critical.generate({
        base: osTmpdir(),
        html: htmlString,
        src: '',
        dest: destCssPath,
        minify: true,
        width: config.critical.width,
        height: config.critical.height
      });

      if (index+1 === Object.keys(config.critical.urls).length) {
        return done();
      }
    });


  });
});

gulp.task('critical:clean', function (done) {
  return rimraf(config.critical.dest, function() {
    gutil.log('Critical directory', gutil.colors.magenta(config.critical.dest), 'deleted');
    return done();
  });
});
