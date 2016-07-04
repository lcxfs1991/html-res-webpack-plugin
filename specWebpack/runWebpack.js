"use strict";

const fs = require('fs-extra'),
	  async = require("async"),
	  webpack = require('webpack');
	
fs.removeSync('./dist');


var webpackConfig = [
	require('./src/resource-dev/webpack.config.js'), 		// dev environment
	require('./src/resource-inline-1/webpack.config.js'),	// inline without compression
	require('./src/resource-inline-2/webpack.config.js'),	// inline with compression
	require('./src/resource-md5-1/webpack.config.js'),		// md5 with compression / index chunk before react
	require('./src/resource-md5-2/webpack.config.js'),	    // md5 without compression  / react chunk before index
	require('./src/resource-favico/webpack.config.js'),
];

async.filter(webpackConfig, function(configPath, callback) {
	let compiler = webpack(configPath);
	compiler.run(function(err, stats) {
	    callback(err, stats);
	});
}, function(err, results){
    if (!err) {
    	// console.log(results);
    }
    else {
    	console.log(err);
    }
});

