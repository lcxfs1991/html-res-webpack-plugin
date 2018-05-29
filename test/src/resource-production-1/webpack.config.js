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
        'libs/react': [path.join(config.path.src, "/resource-production-1/libs/react")],
        'index': [path.join(config.path.src, "/resource-production-1/index")],
        'detail': [path.join(config.path.src, "/resource-production-1/detail")],
    },
    output: {
        publicPath: config.defaultPath,
        path: path.join(config.path.dist + '/resource-production-1/'),
        filename: "js/[name].js",
        chunkFilename: "chunk/[name].js",
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
                    "url-loader?limit=1&name=img/[name].[ext]",
                ],
                include: path.resolve(config.path.src)
            },
        ],
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({ 
            filename: "css/[name].css", 
            publicPath: "//localhost:1111/",
        }),
        new HtmlResWebpackPlugin({
            env: "development",
            mode: 'html',
        	filename: "html/entry.html",
	        template: config.path.src + "/resource-production-1/index.html",
            cssPublicPath: "//localhost:1111/",
            removeUnMatchedAssets: true,
	        htmlMinify: null
        }),
        new HtmlResWebpackPlugin({
            env: "development",
            mode: 'html',
            filename: "html/detail.html",
            template: config.path.src + "/resource-production-1/detail.html",
            cssPublicPath: "//localhost:1111/",
            removeUnMatchedAssets: true,
            htmlMinify: null
        })
    ],
    watch: true,
};