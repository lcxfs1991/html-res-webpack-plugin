'use strict';

const path = require('path'),
      chalk = require('chalk');

module.exports = {

	getFileType: (filename) => {
		
		let ext = path.extname(filename).replace(".", ""),
			questionMark = ext.indexOf("?");

		if (!!~questionMark) {
			ext = ext.replace(ext.substring(questionMark, ext.length), "");
		}
		
		return ext;
	},

	/**
	 * [get file basename]
	 * @param  {[type]} template [模版位置]
	 * @param  {[type]} dest     [目标位置]
	 * @return {[type]}          []
	 */
	getBaseName: (template, dest) => {
		var filename = path.resolve(template);
		var basename = dest || path.basename(filename);
		
		return basename;
	},

	/**
	 * [print info level message]
	 * @param  {[type]} msg [description]
	 * @return {[type]}     [description]
	 */
	info: function(msg, level) {
		let l = level || 0;
		(l >= 0) && console.log(chalk.green('[html-res-webapck-plugin] ' + msg));
	},

	/**
	 * [print info alert message]
	 * @param  {[type]} msg [description]
	 * @return {[type]}     [description]
	 */
	alert: function(msg, level) {
		let l = level || 0;
		(l >= 1) && console.log(chalk.yellow('[html-res-webapck-plugin] ' + msg));
	}
};