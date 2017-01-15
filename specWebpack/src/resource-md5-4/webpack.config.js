const path = require('path');

var webpack = require('webpack'),
	config = require('../../config/config'),
	 nodeModulesPath = path.resolve('../node_modules');


var HtmlResWebpackPlugin = require('../../../index'),
	ExtractTextPlugin = require("extract-text-webpack-plugin-steamer");

module.exports = {
	entry: {
        'js/react': [path.join(config.path.src, "/resource-md5-4/libs/react")],
        'js/index': [path.join(config.path.src, "/resource-md5-4/index")],
    },
    output: {
        publicPath: config.defaultPath,
        path: path.join(config.path.dist + '/resource-md5-4/'),
        filename: "cdn/[name]" + config.chunkhash + ".js",
        chunkFilename: "js/chunk/[name]" + config.chunkhash + ".js",
    },
    module: {
        loaders: [
            { 
                test: /\.js?$/,
                loader: 'babel',
                query: {
                    cacheDirectory: false,
                    presets: [
                        'es2015', 
                    ]
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader"),
                include: path.resolve(config.path.src)
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader"),
                include: [nodeModulesPath, path.resolve(config.path.src)]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    "url-loader?limit=1000&name=img/[name]" + config.hash + ".[ext]",
                ],
                include: path.resolve(config.path.src)
            },
        ],
        noParse: [
            
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin("./cdn/css/[name]-[contenthash:6].css", {filenamefilter: function(filename) {
            // console.log(filename);
            return filename.replace('/js', '');
        }}),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new HtmlResWebpackPlugin({
            mode: "html",
        	filename: "index.html",
	        template: config.path.src + "/resource-md5-4/index.html",
	        htmlMinify: null
        }),
    ],
};