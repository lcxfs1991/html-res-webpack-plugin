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

};