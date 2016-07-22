'use strict';

const path = require('path');


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
	 * [description]
	 * @param  {[type]} template [模版位置]
	 * @param  {[type]} dest     [目标位置]
	 * @return {[type]}          []
	 */
	getBaseName: (template, dest) => {
		var filename = path.resolve(template);
		var basename = dest || path.basename(filename);
		
		return basename;
	}
};