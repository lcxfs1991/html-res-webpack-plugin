module.exports = {
	optionRequredErr: function(option) {
		console.error('html-res-webpack-plugin: ');
		console.error(option + ' is required');
	},
	optionChunkExtention: function(item) {
		console.error('html-res-webpack-plugin: ');
		console.error("If you use default mode, please add extension to the chunk you wanna inject.");
		console.error("Like " + item + ".js, " + item + ".css and so on");
	}
};