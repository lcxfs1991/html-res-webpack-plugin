'use strict';

const path = require('path');


module.exports = {

	getFileType: (filename) => {
		return path.extname(filename).replace(".", "");
	},

};