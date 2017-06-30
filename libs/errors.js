module.exports = {
	optionRequredErr: function(option) {
		console.error('html-res-webpack-plugin: ');
		console.error(option + ' is required');
	},
	optionChunkExtention: function(item) {
		console.error('html-res-webpack-plugin: ');
		console.error("If you use default mode, please add extension to the chunk you wanna inject.");
		console.error("Like " + item + ".js, " + item + ".css and so on.");
	},
	extensionRequired: function(route) {
		console.error('html-res-webpack-plugin: ');	
		console.error("If you use html mode, please add extension to the resource you wanna match.");
		console.error("Like <script src=\"" + route + ".js\"></script>, <link rel=\"stylesheet\" href=\"" + route + ".css\"> and so on.");
	}
};