"use strict";
/**
 * @plugin html-res-webpack-plugin
 * @author  heyli
 * @reference: https://github.com/ampedandwired/html-webpack-plugin
 */

// debug mode
const isDebug = false,
	  IS_TO_STR = true; 

const fs = require('fs-extra'),
      rimraf = require('rimraf'),
	  _ = require('lodash'),
	  vm = require('vm'),
	  path = require('path'),
	  Promise = require('bluebird'),
	  minify = require('html-minifier').minify,
	  childCompiler = require('./libs/compiler'),
	  utils = require('./libs/utils'),
	  errors = require('./libs/errors'),
	  url = require('url');


function hasProtocal(route) {
	return route.indexOf('http://') === 0 || route.indexOf('https://') === 0 || route.indexOf('//') === 0;
}

function removeAsset(tag) {
	utils.alert(tag + ' is removed because assets is not found.', this.options.logLevel);
	return '';
}

function replaceTag(removeUnMatchedAssets, route, tag) {
	return (removeUnMatchedAssets && !hasProtocal(route)) ? removeAsset.bind(this)(tag) : tag;
}

function removeQueryHash(route) {
	let urlObj = url.parse(route),
		newRoute = route;

	if (urlObj.hash) {
		newRoute = newRoute.replace(urlObj.hash, '');
	}

	if (urlObj.search) {
		newRoute = newRoute.replace(urlObj.search, '');
	}

	return newRoute;
}

function HtmlResWebpackPlugin(options) {

	// user input options
	this.options = _.extend({
		mode: options.mode || 'default', // default => 配置 html => 写在html中
		env: options.env || 'production',
		filename: options.filename || '',
		chunks: options.chunks || [],
		htmlMinify: options.htmlMinify || false,
		favicon: options.favicon || false,
		templateContent: options.templateContent || function(tpl) { return tpl; },
		cssPublicPath: options.cssPublicPath || null,
		entryLog: options.entryLog || true,
		logLevel: options.logLevel || 0, // log level
		removeUnMatchedAssets: options.removeUnMatchedAssets || false, // if asset is unmatch, it will be removed
	}, options);

	this.logChunkName = true;

	this.checkRequiredOptions(this.options);

	// html scripts/css/favicon assets
	this.stats = {
		assets: [],
		inlineAssets: {}
	};
	this.webpackOptions = {};
}

/**
 * check required options
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
HtmlResWebpackPlugin.prototype.checkRequiredOptions = function(options) {
	var requireOptions = ['filename', 'template', 'chunks'],
		count = 0,
		requiredOption = '';

	for (let option in options) {
		if (!!~requireOptions.indexOf(option)) {
			count++;
			requiredOption = option;
		}
	}

	if (count < requireOptions.length) {
		throw new errors.optionRequredErr(requiredOption);
	}

	var injectChunks = _.isArray(options.chunks) ? options.chunks : Object.keys(options.chunks);

	injectChunks.forEach((item) => {
		if (!path.extname(item)) {
			throw new errors.optionChunkExtention(item);
		}
	});

};

/**
 * [plugin init]
 * @param  {[type]}   compiler [compiler]
 * @param  {Function} callback [async callback]
 */
HtmlResWebpackPlugin.prototype.apply = function(compiler) {

	// format: loader!fiename
	this.options.templateLoaderName = this.getFullTemplatePath(this.options.template);
	this.options.templateDir = path.dirname(this.options.template); // template directory
	this.options.distPath = compiler.options.output.path; // destination path

	let compilationPromise = null;

	compiler.hooks.make.tapPromise('HtmlResWebpackPlugin', compilation => {
		isDebug && console.log("==================make================");
		return Promise.resolve().then(() => {
			compilationPromise = childCompiler.compileTemplate(this.options.templateLoaderName, compiler.context, this.options.filename, compilation);
		});

		// return childCompiler.compileTemplate(this.options.templateLoaderName, compiler.context, this.options.filename, compilation);
	});


  	// right after emit, files will be generated
	compiler.hooks.emit.tapAsync('HtmlResWebpackPlugin', (compilation, callback) => {
	    isDebug && console.log("===================emit===============");
		Promise.resolve()
	    	.then(() => {
        		return compilationPromise;
      		})
      		.then((compiledTemplate) => {
      			return this.evaluateCompilationResult(compilation, compiledTemplate.content);
      		}).
      		then((compiledResult) => {
      			// return basename, ie, /xxx/xxx.html return xxx.html
			    this.options.htmlFileName = this.addFileToWebpackAsset(compilation, this.options.template, utils.getBaseName(this.options.template, this.options.filename), IS_TO_STR, compiledResult);

			    // inject favicon
			    if (this.options.favicon) {
			    	this.options.faviconFileName = this.addFileToWebpackAsset(compilation, this.options.favicon, utils.getBaseName(this.options.favicon, null));
			    }

			    // webpack options
			    this.webpackOptions = compilation.options;

			    if (this.options.mode === 'default') {
			    	this.buildStats(compilation);
				    // start injecting resource into html
				    this.injectAssets(compilation);
				}
				else if (this.options.mode === 'html') {
					this.buildStatsHtmlMode(compilation);
					// process
					this.processAssets(compilation);
				}

			    // compress html content
			    this.options.htmlMinify && this.compressHtml(compilation);
			    
			    callback();

      			// console.log(compiledResult);

      		});
	});

	compiler.hooks.done.tap('HtmlResWebpackPlugin', () => {
		this.removeInlineRes();
	});

};

HtmlResWebpackPlugin.prototype.buildStatsHtmlMode = function(compilation) {
	compilation.chunks.map((chunk) => {
		if (_.isArray(chunk.files)) {
			chunk.files.forEach((item) => {
				let ext = path.extname(item);
				if (!this.stats.assets[chunk.name + ext]) {
					this.stats.assets[chunk.name + ext] = [item];
				}
				else {
					this.stats.assets[chunk.name + ext] = this.stats.assets[chunk.name + ext].concat([item]);
				}
			});
		}
		else if (_.isString(chunk.files)) {
			let ext = path.extname(chunk.files);
			this.stats.assets[chunk.name + ext] = [chunk.files];
		}
	});

	let assets = Object.keys(compilation.assets) || [];

	assets.map((asset) => {
		let chunkName = compilation.assets[asset].chunk || null;
		if (chunkName) {
			
			if (typeof this.stats.assets[chunkName] === 'undefined') {
				this.stats.assets[chunkName] = [asset];
			}
			else if (_.isArray(this.stats.assets[chunkName])) {
				this.stats.assets[chunkName] = this.stats.assets[chunkName].concat(asset);
			}
		}
	});

	if (!this.logChunkName) {
		return;
	}

	this.logChunkName = false;
	this.printChunkName(this.stats.assets);
	
};

HtmlResWebpackPlugin.prototype.printChunkName = function(assets) {
	let assetsArray = Object.keys(assets);
	if (!assetsArray.length || !this.options.entryLog) {
		return;
	}

	utils.alert('assets used examples:');
	utils.alert('<link rel="stylesheet" href="' + assetsArray[0] + '">');
	utils.alert('<script src="' + assetsArray[0] + '"></script>');

	assetsArray.map((chunk, key) => {	
		utils.info("chunk" + (key + 1) + ": " + chunk, this.options.logLevel);
	});
};

HtmlResWebpackPlugin.prototype.evaluateCompilationResult = function(compilation, source) {
	if (!source) {
	    return Promise.reject('The child compilation didn\'t provide a result');
	  }

	  // The LibraryTemplatePlugin stores the template result in a local variable.
	  // To extract the result during the evaluation this part has to be removed.
	  source = source.replace('var HTML_RES_WEBPACK_PLUGIN_RESULT =', '');
	  var template = this.options.templateLoaderName.replace(/^.+!/, '').replace(/\?.+$/, '');
	  var vmContext = vm.createContext(_.extend({HTML_RES_WEBPACK_PLUGIN: true, require: require}, global));
	  var vmScript = new vm.Script(source, {filename: template});
	  // console.log(vmScript);
	  // Evaluate code and cast to string
	  var newSource;
	  try {
	    newSource = vmScript.runInContext(vmContext);
	  } catch (e) {
	    return Promise.reject(e);
	  }
	  return typeof newSource === 'string' || typeof newSource === 'function'
	    ? Promise.resolve(newSource)
	    : Promise.reject('The loader "' + this.options.templateLoaderName + '" didn\'t return html.');
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

	compilation.chunks.map((chunk) => {
		if (_.isArray(chunk.files)) {
			chunk.files.forEach((item) => {
				let ext = path.extname(item);
				if (!this.stats.assets[chunk.name + ext]) {
					this.stats.assets[chunk.name + ext] = [item];
				}
				else {
					this.stats.assets[chunk.name + ext] = this.stats.assets[chunk.name + ext].concat([item]);
				}
			});
		}
		else if (_.isString(chunk.files)) {
			let ext = path.extname(chunk.files);
			this.stats.assets[chunk.name + ext] = [chunk.files];
		}
	});
	
	/**
	 * compatible with copy-webpack-plugin / copy-webpack-plugin-hash                                 [description]
	 */
	
	if (!compilation.assets) {
		return;
	}

	Object.keys(compilation.assets).map((assetKey) => {
		let asset = compilation.assets[assetKey],
			chunkName = (asset.hasOwnProperty('chunk')) ? asset.chunk : "";

		if (!!~injectChunks.indexOf(chunkName)) {
			if (typeof this.stats.assets[chunkName] === 'undefined') {
				this.stats.assets[chunkName] = [assetKey];
			}
			else if (_.isArray(this.stats.assets[chunkName])) {
				this.stats.assets[chunkName] = this.stats.assets[chunkName].concat(assetKey);
			}
		}
	});

	// console.log(this.stats.assets);
};

/**
 * [process html script/link tags]
 * @param  {[type]} compilation [compilation]
 */
HtmlResWebpackPlugin.prototype.processAssets = function(compilation) {
	var htmlContent = compilation.assets[this.options.htmlFileName].source(),
		publicPath = this.webpackOptions.output.publicPath;
	
	htmlContent = this.checkResource(htmlContent, publicPath, compilation);

	compilation.assets[this.options.htmlFileName].source = () => {
		return this.options.templateContent.bind(this)(htmlContent);
	};
};

// 匹配资源
HtmlResWebpackPlugin.prototype.checkResource = function(htmlContent, publicPath, compilation) {
	let isProduction = this.options.env === "production",
		linkRegex = new RegExp("(<link[^>]*href=([\'\"]*)(.*?)([\'\"]*).*?\>)", "ig"),
		scriptRegex = new RegExp("(<script[^>]*src=([\'\"]*)(.*?)([\'\"]*).*?\>(<\/script>)?)", "ig");

	htmlContent = htmlContent.replace(linkRegex, (route) => {

		// if ?__production is appended, then it will only show in production environment
		if (!isProduction && !!~route.indexOf("__production")) {
			route = this.setProductionAsset(); 
			return route;
		}
		else {
			route = route.replace('?__production', '');
		}

		if (isProduction && !!~route.indexOf("__development")) {
			route = this.setDevelopmentAsset(); 
			return route;
		}
		else {
			route = route.replace('?__development', '');
		}

		if (!!~route.indexOf("__inline")) {
			// css inline
			let styleInlineRegex = new RegExp("<link.*href=(\s*?)*(.+)[\?]\_\_inline.*?(\s*?)>", "ig");
			route = this.inlineHtmlRes(route, styleInlineRegex, publicPath, compilation); 
		}
		else {
			// css md5
			let styleMd5Regex = new RegExp("<link.*href=(\s*?)*(.+).*?(\s*?)>", "ig");
			let cssPublicPath = this.options.cssPublicPath || publicPath;
			route = this.md5HtmlRes(route, styleMd5Regex, cssPublicPath);
		}

		return route;
	});

	htmlContent = htmlContent.replace(scriptRegex, (route) => {
		if (!isProduction && !!~route.indexOf("__production")) {
			route = this.setProductionAsset();
			return route;
		}
		else {
			route = route.replace('?__production', '');
		}

		if (isProduction && !!~route.indexOf("__development")) {
			route = this.setDevelopmentAsset(); 
			return route;
		}
		else {
			route = route.replace('?__development', '');
		}

		if (!!~route.indexOf("__inline")) {
			// js inline
			let scriptInlineRegex = new RegExp("<script.*src=(\s*?)*(.+)[\?]\_\_inline.*?(\s*?)><\/script>", "ig");
			route = this.inlineHtmlRes(route, scriptInlineRegex, publicPath, compilation);
		}
		else {
			// js md5
			let scriptMd5Regex = new RegExp("<script.*src=(\s*?)*(.+).*?(\s*?)><\/script>", "ig");
			route = this.md5HtmlRes(route, scriptMd5Regex, publicPath);
		}
		return route;
	});

	return htmlContent;
};

HtmlResWebpackPlugin.prototype.setProductionAsset = function() {
	return '';
};

HtmlResWebpackPlugin.prototype.setDevelopmentAsset = function() {
	return '';
};

HtmlResWebpackPlugin.prototype.md5HtmlRes = function(routeStr, reg, publicPath) {
	let _this = this;

	routeStr = routeStr.replace(reg, function(tag, gap, route) {
		route = route.replace(/[\"|']/g, "").replace(/[ ]* \//g, "");

		route = removeQueryHash(route);
		let extension = path.extname(route);
		extension = (extension) ? extension.replace(".", "") : extension;

		// extension required
		if (!extension && !hasProtocal(route)) {
			throw new errors.extensionRequired(route);
		}

		if (extension === "ico" && !!~route.indexOf("." + extension)) {
			tag = tag.replace(route, publicPath + route);
			return tag;
		}

		let newRoute = route;

		let assets = _this.stats.assets[newRoute] || [],
			file = "";

		if (!assets.length) {
			return replaceTag.bind(_this)(_this.options.removeUnMatchedAssets, route, tag);
		}

		assets.forEach(function(item) {
			if (!!~item.indexOf("." + extension) && !file) {
				file = item;
			}
		});

		tag = tag.replace(route, publicPath + file);

		return tag;
	});

	return routeStr;
};

HtmlResWebpackPlugin.prototype.inlineHtmlRes = function(routeStr, reg, publicPath, compilation) {

	let _this = this;

	routeStr = routeStr.replace(reg, function(tag, gap, route) {
		route = route.replace(/[\"|']/g, "");
		
		let extension = path.extname(route);
		extension = (extension) ? extension.replace(".", "") : extension;

		// extension required
		if (!extension && !hasProtocal(route)) {
			throw new errors.extensionRequired(route);
		}
		
		let newRoute = route;

		var assets = _this.stats.assets[newRoute] || [],
			file = "";

		// try to find inline for relative route
		if (!assets.length) {
			let resFile = path.resolve(_this.options.templateDir, route);

			if (fs.existsSync(resFile)) {
				let fileContent = fs.readFileSync(resFile, "utf-8");
				
				if (extension === 'js') {
					file = "<script>" + fileContent + "</script>";
				}
				else if (extension === 'css') {
					file = "<style>" + fileContent + "</style>";
				}

				if (file) {
					// tag = tag.replace(tag, file);
					tag = tag.replace(tag, function() {
						return file;
					});
				}
				else {
					return replaceTag.bind(_this)(_this.options.removeUnMatchedAssets, newRoute, tag);
				}
			}
			else {
				return replaceTag.bind(_this)(_this.options.removeUnMatchedAssets, newRoute, tag);
			}
		}
		// if asset is found in stats object
		else {
			if (_this.options.env === 'development') {
				route = route.replace(/[\"|']/g, "").replace(/[ ]* \//g, "");

				assets.forEach(function(item) {
					if (!!~item.indexOf("." + extension) && !file) {
						file = item;
					}
				});

				if (file) {
					tag = tag.replace(route, publicPath + file);
				}
				else {
					return replaceTag.bind(_this)(_this.options.removeUnMatchedAssets, newRoute, tag);
				}
			}
			else {
				assets.forEach(function(item) {
					if (!!~item.indexOf("." + extension) && extension === "js") {
						file = "<script>" + compilation.assets[item].source() + "</script>";
						_this.storeInlineRes(compilation, item);
					}
					else if (!!~item.indexOf("." + extension) && extension === "css") {
						file = "";
						let cssContent = "";
						let children = compilation.assets[item]._source.children || [];
						children.forEach(function(item) {
							cssContent += item._value || '\n';
						}) ;
						file = "<style>" + cssContent + "</style>";
						_this.storeInlineRes(compilation, item);
					}
				});

				// if file is not null, then replace
				if (file) {
					// tag = tag.replace(tag, file);
					tag = tag.replace(tag, function() {
						return file;
					});
				}
				else {
					return replaceTag(_this.options.removeUnMatchedAssets, newRoute, tag);
				}
			}
		}

		return tag;
	});

	return routeStr;
};

HtmlResWebpackPlugin.prototype.storeInlineRes = function(compilation, key) {
	this.stats.inlineAssets[key] = true;
};

HtmlResWebpackPlugin.prototype.removeInlineRes = function() {
	
	if (!this.webpackOptions || !this.webpackOptions.output) {
		return;
	}

	let outputPath = this.webpackOptions.output.path;

	Object.keys(this.stats.inlineAssets).forEach((file) => {
		let filePath = path.join(outputPath, file),
			dirPath = path.dirname(filePath);

		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}

		if (fs.existsSync(dirPath)) {
			let files = fs.readdirSync(dirPath);

			if (!files.length) {
				rimraf(dirPath, function() {

				});
			}
		}
	});
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

	// console.log(injectChunks);
	// console.log(this.stats.assets);
	// use injectChunks in order to allow user to control occurences of file order
	injectChunks.map((chunkKey) => {
		
		if (!this.stats.assets.hasOwnProperty(chunkKey)) {
			this.stats.assets[chunkKey] = [optionChunks[chunkKey].res];
		}
		// console.log(this.stats.assets);
		this.stats.assets[chunkKey].map((file) => {

			// if file is undefined then pop a warning but continue
			if (!file) {
				utils.alert(`${chunkKey} is not found but defined in option`, this.options.logLevel);
				return;
			}
			let fileType = utils.getFileType(file),
				isExternal = (optionChunks[chunkKey] && optionChunks[chunkKey].external) || false;
			
			switch(fileType) {
				case 'js': {
					let jsInline = false;
					if (!_.isArray(optionChunks)) {
						jsInline = this.inlineRes(compilation, optionChunks[chunkKey], file);
					}

					let jsAttr = (_.isArray(optionChunks)) ? '' :  this.injectAssetsAttr(optionChunks[chunkKey]),
					    srcPath = (isExternal) ? file : publicPath + file;
					scriptContent += (jsInline) ? 
									('<script ' + jsAttr + ' >' + jsInline + '</script>')
									: ('<script ' + jsAttr + ' type="text/javascript" src="' + srcPath + '"></script>\n');
									
					break;
				}
				case 'css': {
					let styleInline = false;
					if (!_.isArray(optionChunks)) {
						styleInline = this.inlineRes(compilation, optionChunks[chunkKey], file);
					}

					let styleAttr = (_.isArray(optionChunks)) ? '' :  this.injectAssetsAttr(optionChunks[chunkKey]),
						hrefPath = (isExternal) ? file : publicPath + file;
					styleContent += (styleInline) ? 
									('<style ' + styleAttr + '>' + styleInline + '</style>')
									: ('<link ' + styleAttr + ' rel="stylesheet" href="' + hrefPath + '">\n');
					
					break;
				}
				case 'ico': {
					break;
				}
			}
		});
	});

	// inject favicon
	if (this.options.favicon) {
		faviconContent = '<link rel="shortcut icon" type="image/x-icon" href="' + publicPath + this.options.faviconFileName + '">\n'
    				      + '<link rel="icon" type="image/x-icon" href="' + publicPath + this.options.faviconFileName + '">\n';
	}
	// console.log(compilation.assets[this.options.htmlFileName].source());
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
 * @return {[type]}          [description]
 */
HtmlResWebpackPlugin.prototype.injectAssetsAttr = function(chunk) {
	if (!chunk || !chunk.hasOwnProperty('attr') || !chunk.attr) {
		return '';
	}

	return chunk.attr || '';
};

/**
 * inline resource
 * @param  {[type]} compilation [description]
 * @param  {[type]} chunk       [description]
 * @param  {[type]} file        [description]
 * @return {[type]}             [description]
 */
HtmlResWebpackPlugin.prototype.inlineRes = function(compilation, chunk, file) {
	if (!chunk || !chunk.hasOwnProperty('inline') || !chunk.inline 
		|| !chunk.inline || this.options.env === 'development') {
		return false;
	}

	this.storeInlineRes(compilation, file);

	return compilation.assets[file].source();
};

/**
 * use webpack to generate files when it is in dev mode
 * @param {[type]}  compilation [description]
 * @param {[type]}  template    [description]
 * @param {Boolean} isToStr     [description]
 */
HtmlResWebpackPlugin.prototype.addFileToWebpackAsset = function(compilation, template, basename, isToStr, source) {
	var filename = path.resolve(template);
	// console.log(isToStr, filename);
    compilation.fileDependencies.add(filename);
    compilation.assets[basename] = {
    	source: () => {
    		let fileContent = (isToStr) ? source : fs.readFileSync(filename);
      		return fileContent;
      	},
      	size: () => {
      		return fs.statSync(filename).size;
      	}
    };

    return basename;
};

/**
 * Helper to return the absolute template path with a fallback loader
 */
HtmlResWebpackPlugin.prototype.getFullTemplatePath = function (template) {
  // If the template doesn't use a loader use the lodash template loader
  if (template.indexOf('!') === -1) {
    template = require.resolve('./libs/loader.js') + '!' + template;
  }
  // Resolve template path

  return template.replace(
    /([!])([^\/\\][^!\?]+|[^\/\\!?])($|\?.+$)/,
    function (match, prefix, filepath, postfix) {
      return prefix + path.resolve(filepath) + postfix;
    });
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
