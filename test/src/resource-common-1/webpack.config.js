"use strict";

const path = require('path');

var webpack = require('webpack'),
	config = require('../../config/config'),
	 nodeModulesPath = path.resolve('../node_modules');

var HtmlResWebpackPlugin = require('../../../index'),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
    WebpackAssetPipeline = require('webpack-asset-pipeline');

module.exports = {
    context: config.path.src,
	entry: {
        'js/index': [path.join(config.path.src, "/resource-common-1/index")],
        'js/detail': [path.join(config.path.src, "/resource-common-1/detail")],
        'js/list': [path.join(config.path.src, "/resource-common-1/list")],
        'libs/react': [path.join(config.path.src, "/resource-common-1/libs/react")],
    },
    output: {
        publicPath: config.defaultPath,
        path: path.join(config.path.dist + '/resource-common-1/'),
        filename: "[name]" + config.chunkhash + ".js",
        chunkFilename: "chunk/[name]" + config.chunkhash + ".js",
    },
    module: {
        loaders: [
            { 
                test: /\.js?$/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: false,
                    presets: [
                        'es2015', 
                    ]
                },
                exclude: /node_modules/,
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    // fallback: 'style-loader', 
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                localIdentName: '[name]-[local]-[hash:base64:5]',
                            }
                        },
                        {
                            loader:  'less-loader',
                        }
                    ]
                }),
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
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({filename: "css/[name]-[contenthash:6].css", disable: false}),
        new webpack.optimize.CommonsChunkPlugin({
          name: "commons",
          // (the commons chunk name)

          filename: "js/commons-[hash:6].js",
          // (the filename of the commons chunk)

          // minChunks: 3,
          // (Modules must be shared between 3 entries)

          // chunks: ["pageA", "pageB"],
          // (Only use these entries)
        }),
        new HtmlResWebpackPlugin({
        	filename: "index.html",
	        template: config.path.src + "/resource-common-1/index.html",
	        chunks:[
                'libs/react',
                'commons',
                'js/index',
                'js/detail',
                'js/list',
            ],
	        templateContent: function(tpl) {
	            // 生产环境不作处理
	            if (!this.webpackOptions.watch) {
                    return tpl;
                }
	            // 开发环境先去掉外链react.js
	            var regex = new RegExp("<script.*src=[\"|\']*(.+).*?[\"|\']><\/script>", "ig");
	            tpl = tpl.replace(regex, function(script, route) {
	                if (!!~script.indexOf('react.js') || !!~script.indexOf('react-dom.js')) {
	                    return '';
	                }
	                return script;
	            });
	            return tpl;
	        }, 
	        htmlMinify: {
                removeComments: true,
                collapseWhitespace: true,
            }
        }),
        new WebpackAssetPipeline(),
    ],
};