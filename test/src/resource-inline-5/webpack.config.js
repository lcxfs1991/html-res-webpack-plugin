"use strict";

const path = require('path');

var webpack = require('webpack'),
	config = require('../../config/config'),
	 nodeModulesPath = path.resolve('../node_modules');

var HtmlResWebpackPlugin = require('../../../index'),
	MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    context: config.path.src,
	entry: {
        index: [path.join(config.path.src, "/resource-inline-5/index")]
    },
    output: {
        publicPath: config.defaultPath,
        path: path.join(config.path.dist + '/resource-inline-5/'),
        filename: "js/[name].js",
        chunkFilename: "js/chunk/[name].js",
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
                    MiniCssExtractPlugin.loader,
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
                    "url-loader?limit=1000&name=img/[name].[ext]",
                ],
                include: path.resolve(config.path.src)
            },
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({ filename: "css/[name].css"}),
        new HtmlResWebpackPlugin({
        	filename: "index.html",
            env: "development",
            template: config.path.src + "/resource-inline-5/index.html",
            chunks:{
                'index.js': {
                    attr: "async=\"true\"",
                    inline: true,
                },
                'index.css': {
                    attr: "offline",
                    inline: true
                }
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
	        htmlMinify: null
        })
    ],
};