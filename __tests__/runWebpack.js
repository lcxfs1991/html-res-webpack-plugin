"use strict";

const fs = require('fs-extra'),
	  async = require("async"),
	  webpack = require('webpack');
	
fs.removeSync('./dist');


var webpackConfig = [
	require('./src/resource-inline/webpack.config.js'),
	require('./src/resource-md5-1/webpack.config.js'),
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

