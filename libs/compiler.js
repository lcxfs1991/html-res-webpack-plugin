"use strict";

var _ = require("lodash");
var path = require("path");
var Promise = require("bluebird");
var NodeTemplatePlugin = require("webpack/lib/node/NodeTemplatePlugin");
var NodeTargetPlugin = require("webpack/lib/node/NodeTargetPlugin");
var LoaderTargetPlugin = require("webpack/lib/LoaderTargetPlugin");
var LibraryTemplatePlugin = require("webpack/lib/LibraryTemplatePlugin");
var SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");

module.exports.compileTemplate = function compileTemplate(
    template,
    context,
    outputFilename,
    compilation
) {
    var outputOptions = {
        filename: outputFilename,
        publicPath: compilation.outputOptions.publicPath
    };

    // Store the result of the parent compilation before we start the child compilation
    var assetsBeforeCompilation = _.assign(
        {},
        compilation.assets[outputOptions.filename]
    );
    // Create an additional child compiler which takes the template
    // and turns it into an Node.JS html factory.
    // This allows us to use loaders during the compilation

    var compilerName = getCompilerName(context, outputFilename);
    var childCompiler = compilation.createChildCompiler(
        compilerName,
        outputOptions
    );
    childCompiler.context = context;
    new NodeTemplatePlugin(outputOptions).apply(childCompiler);
    new NodeTargetPlugin().apply(childCompiler);
    new LibraryTemplatePlugin("HTML_RES_WEBPACK_PLUGIN_RESULT", "var").apply(
        childCompiler
    );
    new SingleEntryPlugin(this.context, template).apply(childCompiler);
    new LoaderTargetPlugin("node").apply(childCompiler);

    // Fix for "Uncaught TypeError: __webpack_require__(...) is not a function"
    // Hot module replacement requires that every child compiler has its own
    // cache. @see https://github.com/ampedandwired/html-webpack-plugin/pull/179
    childCompiler.hooks.compilation.tap("HtmlResWebpackPlugin", function(compilation) {
        if (compilation.cache) {
            if (!compilation.cache[compilerName]) {
                compilation.cache[compilerName] = {};
            }
            compilation.cache = compilation.cache[compilerName];
        }
    });

    // Compile and return a promise
    return new Promise(function(resolve, reject) {
        childCompiler.runAsChild(function(err, entries, childCompilation) {
            // Resolve / reject the promise
            if (
                childCompilation &&
                childCompilation.errors &&
                childCompilation.errors.length
            ) {
                var errorDetails = childCompilation.errors
                    .map(function(error) {
                        return (
                            error.message +
                            (error.error ? ":\n" + error.error : "")
                        );
                    })
                    .join("\n");
                reject(new Error("Child compilation failed:\n" + errorDetails));
            } else if (err) {
                reject(err);
            } else {
                // Replace [hash] placeholders in filename
                var outputName = compilation.mainTemplate.getAssetPath
                    ? compilation.mainTemplate.hooks.assetPath.call(
                          outputOptions.filename,
                          {
                              hash: childCompilation.hash,
                              chunk: entries[0]
                          }
                      )
                    : compilation.mainTemplate.applyPluginsWaterfall(
                          "asset-path",
                          outputOptions.filename,
                          {
                              hash: childCompilation.hash,
                              chunk: entries[0]
                          }
                      );
                // console.log(childCompilation.assets[outputName].source());
                // Restore the parent compilation to the state like it
                // was before the child compilation

                compilation.assets[outputName] =
                    assetsBeforeCompilation[outputName];

                // console.log(childCompilation.assets[outputName].source());

                if (assetsBeforeCompilation[outputName] === undefined) {
                    // If it wasn't there - delete it
                    delete compilation.assets[outputName];
                }
                resolve({
                    // Hash of the template entry point
                    hash: entries[0].hash,
                    // Output name
                    outputName: outputName,
                    // Compiled code
                    content: childCompilation.assets[outputName].source()
                });
            }
        });
    });
};

/**
 * Returns the child compiler name e.g. 'html-res-webpack-plugin for "index.html"'
 */
function getCompilerName(context, filename) {
    var absolutePath = path.resolve(context, filename);
    var relativePath = path.relative(context, absolutePath);
    return (
        'html-res-webpack-plugin for "' +
        (absolutePath.length < relativePath.length
            ? absolutePath
            : relativePath) +
        '"'
    );
}
