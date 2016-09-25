const path = require('path');

var webpack = require('webpack'),
	config = require('../../config/config'),
	 nodeModulesPath = path.resolve('../node_modules');

var HtmlResWebpackPlugin = require('../../../index'),
	ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	entry: {
        'libs/react': [path.join(config.path.src, "/resource-dev1/libs/react")],
        'index': [path.join(config.path.src, "/resource-dev1/index")],
    },
    output: {
        publicPath: config.defaultPath,
        path: path.join(config.path.dist + '/resource-dev1/'),
        filename: "js/[name].js",
        chunkFilename: "chunk/[name].js",
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
                    "url-loader?limit=1000&name=img/[name].[ext]",
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
        new ExtractTextPlugin("./css/[name].css", {
            publicPath: "//localhost:1111/",
        }),
        new HtmlResWebpackPlugin({
            mode: 'html',
        	filename: "html/entry.html",
	        template: config.path.src + "/resource-dev1/index.html",
            cssPublicPath: "//localhost:1111/",
	        // chunks:{
         //        'libs/react': {

         //        },
         //        'js/index': {
         //            attr:{
         //                js: "",
         //                css: "offline",
         //            }
         //        },
         //    },
	        // templateContent: function(tpl) {
	        //     // 生产环境不作处理
	        //     if (!this.webpackOptions.watch) {
	        //         return tpl;
	        //     }
	        //     // 开发环境先去掉外链react.js
	        //     var regex = new RegExp("<script.*src=[\"|\']*(.+).*?[\"|\']><\/script>", "ig");
	        //     tpl = tpl.replace(regex, function(script, route) {
	        //         if (!!~script.indexOf('react.js') || !!~script.indexOf('react-dom.js')) {
	        //             return '';
	        //         }
	        //         return script;
	        //     });
	        //     return tpl;
	        // }, 
	        htmlMinify: null
        })
    ],
    watch: true,
};