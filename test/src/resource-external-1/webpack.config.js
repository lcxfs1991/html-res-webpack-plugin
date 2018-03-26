"use strict";

const path = require('path');

var webpack = require('webpack'),
	config = require('../../config/config'),
	 nodeModulesPath = path.resolve('../node_modules');


var HtmlResWebpackPlugin = require('../../../index'),
	MiniCssExtractPlgugin = require('mini-css-extract-plugin'),
    WebpackAssetPipeline = require('webpack-asset-pipeline');

module.exports = {
    context: config.path.src,
	entry: {
        'js/index': [path.join(config.path.src, "/resource-external-1/index")],
        'libs/react': [path.join(config.path.src, "/resource-external-1/libs/react")],
    },
    output: {
        publicPath: config.defaultPath,
        path: path.join(config.path.dist + '/resource-external-1/'),
        filename: "[name]" + config.chunkhash + ".js",
        chunkFilename: "chunk/[name]" + config.chunkhash + ".js",
    },
    module: {
        rules: [
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
                use: [
                    MiniCssExtractPlgugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            localIdentName: '[name]-[local]-[hash:base64:5]',
                        }
                    },
                    {
                        loader:  'less-loader',
                    }
                ],
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    "url-loader?limit=1000&name=img/[name]" + config.hash + ".[ext]",
                ],
                include: path.resolve(config.path.src)
            },
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlgugin({filename: "css/[name]-[contenthash:6].css"}),
        new HtmlResWebpackPlugin({
        	filename: "index.html",
	        template: config.path.src + "/resource-external-1/index.html",
	        chunks:{
                'common.css': {
                    external: true,
                    res: "//s.url.cn/common.css",
                    attr: "offline"
                },
                'libs/react.js': null,
                'qreport.js': {
                    external: true,
                    res:  "//s.url.cn/pub/js/qreport.js?_bid=2231",
                    attr: "async=\"true\"",
                },
                'js/index.js': null,
                'js/index.css': null,
            },
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
        }),
        new WebpackAssetPipeline(),
    ],
};