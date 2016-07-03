'use strict';

const path = require('path');


module.exports = {
	
	unifyFile: function(filename) {
		while(1) {
			if (filename && (filename[0] === "." || filename[0] === '/')) {
				filename = filename.slice(1);
			}
			else {
				break;
			}
		}

		let ext = path.extname(filename);
		// console.log(ext);
		switch (ext) {
			case '.css':
				return this.unifyCss(filename);
			case '.js': 
				return this.unifyJs(filename);
			default:
				return filename;
		}
		
	},

	// ./a/b.js or /a/b.js ==> a/b.js
	unifyJs: function(filename) {
		return filename;
	},

	// a/b.css or /a/b.css  => ./a/b.css
	unifyCss: function(filename) {
		
		let cssfile =  './' + filename;
		return cssfile;
	},

	getCssSource: function(sources) {
		if (typeof sources.length === undefined || !sources.length) {
			return '';
		}

		let str = '';
		
		for (let i = 0, len = sources.length; i < len; i++) {
			str += sources[i]._value;
		}

		return str;
	}
};