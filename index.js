"use strict";

// debug mode
const isDebug = false,
	  IS_TO_STR = true; 

const fs = require('fs'),
	_ = require('lodash'),
	path = require('path'),
	minify = require('html-minifier').minify,
	utils = require('./libs/utils'),
	loaderUtils = require('loader-utils');

function HtmlResWebpackPlugin(options) {

	// user input options
	this.options = _.extend({
		chunks: options.chunks || [],
		htmlMinify: options.htmlMinify || false,
		favicon: options.favicon || false,
		templateContent: options.templateContent || function(tpl) { return tpl }
	}, options);

	// html scripts/css/favicon assets
	this.stats = {
		assets: [],
	};
	this.webpackOptions = {};
}

HtmlResWebpackPlugin.prototype.apply = function(compiler, callback) {

  	compiler.plugin("make", function(compilation, callback) {
	    isDebug && console.log("==================make================");
	    callback();
	});


  	// right after emit, files will be generated
	compiler.plugin("emit", (compilation, callback) => {
	    isDebug && console.log("===================emit===============");
	    // return basename, ie, /xxx/xxx.html return xxx.html
	    this.options.htmlFileName = this.addFileToWebpackAsset(compilation, this.options.template, IS_TO_STR);
	    // inject favicon
	    if (this.options.favicon) {
	    	this.options.faviconFileName = this.addFileToWebpackAsset(compilation, this.options.favicon);
	    }

	    // webpack options
	    this.webpackOptions = compilation.options;

	    this.buildStats(compilation);

	    this.injectAssets(compilation);


	    this.options.htmlMinify && this.compressHtml(compilation);
	    
	    callback();
	});

};

/**
 * find resources related the html
 * @param  {[type]} compilation [description]
 * @return {[type]}             [description]
 */
HtmlResWebpackPlugin.prototype.buildStats = function(compilation) {
	// array and object are allowed
	let optionChunks = this.options.chunks,
		injectChunks = _.isArray(optionChunks) ? optionChunks : Object.keys(optionChunks);

	// console.log(chunkSorter['auto'](c));

	compilation.chunks.map((chunk, key) => {
		// console.log(chunk.name, !!~injectChunks.indexOf(chunk.name));
		if (!!~injectChunks.indexOf(chunk.name)) {
			this.stats.assets[chunk.name] = chunk.files;
		}
	});

	// console.log(this.stats.assets);
};

/**
 * inject assets into html file
 * @param  {[type]} compilation [description]
 * @return {[type]}             [description]
 */
HtmlResWebpackPlugin.prototype.injectAssets = function(compilation) {
	let htmlContent = compilation.assets[this.options.htmlFileName].source(),
		styleContent = "",
		scriptContent = "",
		faviconContent = "",
		publicPath = this.webpackOptions.output.publicPath,
		optionChunks = this.options.chunks,
		injectChunks = _.isArray(optionChunks) ? optionChunks : Object.keys(optionChunks);

	let loopKeys = Object.keys(this.stats.assets);

	// use injectChunks in order to allow user to control occurences of file order
	injectChunks.map((chunkKey, key1) => {
		
		this.stats.assets[chunkKey].map((file, key2) => {
			let fileType = utils.getFileType(file);
			switch(fileType) {
				case 'js':
					let jsInline = false;
					if (!_.isArray(optionChunks)) {
						jsInline = this.inlineRes(compilation, optionChunks[chunkKey], file, fileType);
					}

					let jsAttr = (_.isArray(optionChunks)) ? '' :  this.injectAssetsAttr(optionChunks[chunkKey], fileType);
					scriptContent += (jsInline) ? 
									('<script ' + jsAttr + ' >' + jsInline + '</script>')
									: ('<script ' + jsAttr + ' type="text/javascript" src="' + publicPath + file + '"></script>\n');
					break;
				case 'css':
					let styleInline = false;
					if (!_.isArray(optionChunks)) {
						styleInline = this.inlineRes(compilation, optionChunks[chunkKey], file, fileType);
					}

					let styleAttr = (_.isArray(optionChunks)) ? '' :  this.injectAssetsAttr(optionChunks[chunkKey], fileType);
					styleContent += (styleInline) ? 
									('<style ' + styleAttr + '>' + styleInline + '</style>')
									: ('<link ' + styleAttr + ' rel="stylesheet" href="' + publicPath + file + '">\n');
					break;
				case 'ico':
					console.log(file);
					break;
			}
		});
	});

	// inject favicon
	if (this.options.favicon) {
		faviconContent = '<link rel="shortcut icon" type="image/x-icon" href="' + publicPath + this.options.faviconFileName + '">\n'
    				      + '<link rel="icon" type="image/x-icon" href="' + publicPath + this.options.faviconFileName + '">\n'
	}

	htmlContent = htmlContent.replace("</head>", faviconContent + "</head>").replace("</head>", styleContent + "</head>").replace("</body>", scriptContent + "</body>");
	
	let htmlAssetObj = compilation.assets[this.options.htmlFileName];
	compilation.assets[this.options.htmlFileName] = _.merge(htmlAssetObj, {
		source: () => {
			return this.options.templateContent.bind(this)(htmlContent);
		}
	});
};

/**
 * inject resource attributes
 * @param  {[type]} chunk    [description]
 * @param  {[type]} fileType [description]
 * @return {[type]}          [description]
 */
HtmlResWebpackPlugin.prototype.injectAssetsAttr = function(chunk, fileType) {

	if (!chunk.hasOwnProperty('attr') || !chunk.attr) {
		return '';
	}

	return chunk.attr[fileType] || '';
};

/**
 * inline resource
 * @param  {[type]} compilation [description]
 * @param  {[type]} chunk       [description]
 * @param  {[type]} file        [description]
 * @param  {[type]} fileType    [description]
 * @return {[type]}             [description]
 */
HtmlResWebpackPlugin.prototype.inlineRes = function(compilation, chunk, file, fileType) {
	if (!chunk.hasOwnProperty('inline') || !chunk.inline || !chunk.inline[fileType]) {
		return false;
	}

	return compilation.assets[file].source();
};

/**
 * use webpack to generate files when it is in dev mode
 * @param {[type]}  compilation [description]
 * @param {[type]}  template    [description]
 * @param {Boolean} isToStr     [description]
 */
HtmlResWebpackPlugin.prototype.addFileToWebpackAsset = function(compilation, template, isToStr) {
	var filename = path.resolve(template);
	var basename = path.basename(filename);
	
    compilation.fileDependencies.push(filename);
    compilation.assets[basename] = {
    	source: () => {
    		let fileContent = (isToStr) ? fs.readFileSync(filename).toString() : fs.readFileSync(filename);
      		return fileContent;
      	},
      	size: () => {
      		return fs.statSync(filename).size;
      	}
    };

    return basename;
};

/**
 * compress html files
 * @param  {[type]} compilation [description]
 * @return {[type]}             [description]
 */
HtmlResWebpackPlugin.prototype.compressHtml = function(compilation) {
	let htmlFileName = this.options.htmlFileName,
		htmlContent = compilation.assets[htmlFileName].source(),
		htmlAsset = compilation.assets[htmlFileName];

	compilation.assets[htmlFileName] = Object.assign(htmlAsset, {
		source: () => {
			return minify(htmlContent, this.options.htmlMinify);
		}
	});
};

module.exports = HtmlResWebpackPlugin;
