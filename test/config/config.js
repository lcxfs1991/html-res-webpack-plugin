'use strict';

const path = require('path'),
      __basename = path.dirname(__dirname);

/**
 * [config basic configuration]
 * @type {Object}
 */
var config = {
    path: {
        src: path.resolve(__basename, "src"),
        dist: path.resolve(__basename, "dist"),
        pub: path.resolve(__basename, "pub"),
        node: path.resolve(__basename, "node"),
    },
    chunkhash: "-[chunkhash:6]",
    hash: "-[hash:6]",
    contenthash: "-[contenthash:6]",
    defaultPath: "//localhost:9000/",
    cdn: "//localhost:8000/",
};

module.exports = config;
