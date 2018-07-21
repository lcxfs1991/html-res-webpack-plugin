"use strict";

const path = require("path");

var webpack = require("webpack"),
    config = require("../../config/config"),
    nodeModulesPath = path.resolve("../node_modules");

var HtmlResWebpackPlugin = require("../../../index"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    context: config.path.src,
    entry: {
        index: [path.join(config.path.src, "/resource-inline-3/index")],
        common: [path.join(config.path.src, "/resource-inline-3/common")]
    },
    output: {
        publicPath: config.defaultPath,
        path: path.join(config.path.dist, "resource-inline-3/"),
        filename: "js/[name]" + config.chunkhash + ".js",
        chunkFilename: "js/chunk/[name]" + config.chunkhash + ".js"
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: "babel-loader",
                query: {
                    cacheDirectory: false,
                    presets: ["es2015"]
                },
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            localIdentName: "[name]-[local]-[hash:base64:5]"
                        }
                    },
                    {
                        loader: "less-loader"
                    }
                ]
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    "url-loader?limit=1000&name=img/[name]" +
                        config.hash +
                        ".[ext]"
                ],
                include: path.resolve(config.path.src)
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new HtmlResWebpackPlugin({
            mode: "html",
            filename: "index.html",
            template: config.path.src + "/resource-inline-3/index.html",
        }),
        new HtmlResWebpackPlugin({
            mode: "html",
            filename: "detail.html",
            template: config.path.src + "/resource-inline-3/detail.html",
        })
    ],
    optimization: {
        minimize: false
    }
};
