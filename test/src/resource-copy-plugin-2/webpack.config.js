"use strict";

const path = require('path');

var webpack = require('webpack'),
	config = require('../../config/config'),
	nodeModulesPath = path.resolve('../node_modules'),
    fs = require('fs');


var HtmlResWebpackPlugin = require('../../../index'),
	MiniCssExtractPlgugin = require('mini-css-extract-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin-hash'),
    WebpackAssetPipeline = require('webpack-asset-pipeline');

function CopyAssetPlugin() {

}

CopyAssetPlugin.prototype.apply = function(compiler) {
    compiler.hooks.afterEmit.tap('HtmlResWebpackPlugin', (compilation) => {
        let assets = compilation.assets,
           copyAssets = Object.keys(assets),
           assetChunk = [];

        copyAssets.forEach((file) => {
            if (assets[file].chunk) {
                assetChunk.push(file);
            }
        });

        let manifest = path.join(config.path.dist, "/resource-copy-plugin-2/manifest.json");

        let assetObject = JSON.parse(fs.readFileSync(manifest, "utf-8") || "");

        assetChunk.forEach((file) => {
            assetObject[assets[file].chunk] = file;
        });   

        fs.writeFileSync(manifest, JSON.stringify(assetObject, null, 4), "utf-8");    
    });
};

module.exports = {
    context: config.path.src,
	entry: {
        'js/index': [path.join(config.path.src, "/resource-copy-plugin-2/index")],
    },
    output: {
        publicPath: config.defaultPath,
        path: path.join(config.path.dist + '/resource-copy-plugin-2/'),
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
        ],
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlgugin({filename: "css/[name]-[contenthash:6].css"}),
        new CopyWebpackPlugin([
            {
                from: config.path.src + '/resource-copy-plugin-2/libs/',
                to: 'libs/[name]' + config.hash + '.[ext]'
            }
        ]),
        new HtmlResWebpackPlugin({
        	filename: "index.html",
	        template: config.path.src + "/resource-copy-plugin-2/index.html",
	        chunks:{
                'libs/react.js': {
                    attr: "async=\"true\"",
                },
                'libs/react-dom.js': null,
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
	        htmlMinify: null
        }),
        new WebpackAssetPipeline(),
        new CopyAssetPlugin(),
    ],
};