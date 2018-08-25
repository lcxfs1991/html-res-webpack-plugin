"use strict";

const path = require('path');

let webpack = require('webpack');
let config = require('../../config/config');
let nodeModulesPath = path.resolve('../node_modules');

let  HtmlResWebpackPlugin = require('../../../index');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let WebpackAssetPipeline = require('webpack-asset-pipeline');

module.exports = {
    context: config.path.src,
	entry: {
        'libs/react': [path.join(config.path.src, "/resource-favico-3/libs/react")],
        'js/index': [path.join(config.path.src, "/resource-favico-3/index")],
    },
    output: {
        publicPath: config.defaultPath,
        path: path.join(config.path.dist + '/resource-favico-3/'),
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
                    "url-loader?limit=1000&name=img/[name]" + config.hash + ".[ext]",
                ],
                include: path.resolve(config.path.src)
            },
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({filename: "css/[name]-[contenthash:6].css"}),
        new HtmlResWebpackPlugin({
            mode: "html",
        	filename: "index.html",
	        template: config.path.src + "/resource-favico-3/index.html",
            favicon: config.path.src + "/resource-favico-3/favicon.ico",
	        templateContent: function(tpl) {
	            return tpl;
	        }, 
	        htmlMinify: null
        }),
        new WebpackAssetPipeline(),
    ],
};