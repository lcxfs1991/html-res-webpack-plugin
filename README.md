# html-res-webpack-plugin

### [中文文档](https://github.com/lcxfs1991/html-res-webpack-plugin/blob/master/README_ZH.md)

## Why do I write a new html plugin

Previously, I use [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) for my projects. However, the plugin has a serious drawback. When I use inject mode, I need to filter all entry files that I don't need. In addition, If I hope to add attributes like async to my script tag, it is a mission impossible. If I use non-inject mode, md5 feature will be gone, let alone resource inline.

That is why I need to write a brand new one which is more intuitively.

## How to start

src/index.html
--> 
dist/index.html

### (please keep line break for each resource(script and link))
```
<!DOCTYPE html>
<html lang="en" id="html">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="x-dns-prefetch-control" content="on" />
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui" />
    <title>html-res-webpack-example</title>
    <link rel="stylesheet" href="/css/preview/preview.css">
</head>
<body>
    <div class="preview-wrapper"></div>
    <script src="/js/common.js"></script>
    <script src="/js/preview/preview.js?__inline"></script>
</body>
</html>
```

src/page/preview/main.js
-->
dist/js/preview/preview.js
```
require('./index.scss');

var init = function() {
    // some code here   
};
```

src/page/preview/index.scss
-->
dist/css/preview/preview.css
```
html, body {
    margin: 0;
}
// some code here
```

webpack.config.js
```
    var config = {
        hash: "-[hash:6]",
        chunkhash: "-[chunkhash:6]",
    };
    
    entry: {
        'preivew/preview': [path.join(config.path.src, "/page/preview/main.js")],
    },

    /**
     *  webpack options below
     */
    .
    .
    .
    output: {
        publicPath: (config.env === 'prod') ? config.cdn : config.defaultPath,
        path: path.join(config.path.dist),
        filename: "js/[name]" + config.chunkhash + ".js"
    },
    
    .
    .
    .

    plugins: [
        // some other plugins
        new ExtractTextPlugin("./css/[name]" + config.chunkhash + ".css"),
        new HtmlResWebpackPlugin({
            filename: "index.html",
            template: "src/index.html",
            jsHash: "[name]" + config.chunkhash + ".js",
            cssHash:  "[name]" + config.chunkhash + ".css"
        });
    ]
```

package.json
```
"scripts": {
    "dev": "webpack --progress --colors --watch",
    "publish-mac": "export NODE_ENV=prod&&webpack -p --progress --colors",
    "publish-windows": "SET NODE_ENV=prod&&webpack -p --progress --colors"
 },

```

If webpack is under watch mode (that is to say, the project is under developed), no md5 or resource inline functions will be called. If webpack is under production mode, the plugin will start adding md5 to resources and make the rest inline.

Another thing worth mentioning is that if you use hash for js, please add `jsHash` the same as the `output` webpack option `filename` excluding folder destination. If you use hash for css, please add `cssHash` the same as the option you input into ExtractTextPlugin excluding css destination folder.  

One thing need to be noticed is hash and chunkhash. The difference between hash and chunkhash is that hash is the same for all resources and chunkhash is different for specific resource. Usually you are recommended to use chunkhash instead (Exception for style files required in an entry js file. They share the same chunkhash if you use extract-text-webpack-plugin).

## Compatible with Hot Reload
If you use `ExtractTextPlugin` plugin, hot reload will fail for css changes. So you have to remove `ExtractTextPlugin` in development mode. However in this case, the link tag you put in html will warn you of reaching 404 because css codes are inline. In this case, please set `isHotReload` as `true`.

## Multiple Html Page
Sometimes there are more than one html pages in your projects. In this situation, please use similar iteration code to add plugins for different html pages
```
var config = {
    hash: "-[hash:6]",
    chunkhash: "-[chunkhash:6]",
};

var route = ['index', 'detail'];

route.forEach(function(item) {
    var htmlResWebpackPlugin = new HtmlResWebpackPlugin({
        filename: item + ".html",
        template: "src/" + item + ".html",
        jsHash: "[name]" + config.chunkhash + ".js",
        cssHash:  "[name]" + config.chunkhash + ".css",
        htmlMinify:{
            removeComments: true,
            collapseWhitespace: true,
        }
    });
    webpackConfig.plugins.push(htmlResWebpackPlugin);

});
```

## Favicon

index.html
```
<head>
    <link rel="shortcut icon" type="image/x-icon" href="./favicon.ico"> 
    <link rel="icon" type="image/x-icon" href="./favicon.ico">
</head>
```


webpack.config.js 
```
new HtmlResWebpackPlugin({
    filename: "index.html",
    template: "src/index.html",
    favicon: "src/favicon.ico",
}),
```

## Modify Html Content Before Output
```
new HtmlResWebpackPlugin({
    filename: "index.html",
    template: "src/index.html",
    templateContent: function(tpl) {
        // some modification of tpl
        // you can use this.options here, you can open index.js of the plugin
        // to check what options are offered
        return tpl;
    }
}),
```

## Options
- `filename`: generated filename
- `template`: template source
- `jsHash`: "[name]" + config.chunkhash + ".js" (example)
- `cssHash`:  "[name]" + config.chunkhash + ".css" (example)
- `htmlMinify`: please checkout `html-minifier`[https://github.com/kangax/html-minifier] to see detail options. If set false | null, html files won't be compressed.
- `isHotReload`: if set true, <link> tags will be ignored
- `favicon`: favicon path, for example, "src/favicon.ico"
- `templateContent`: a point for developer to modify html content before output. `this.options` can be used in such a function.

## Last Words
Since this is still v0.0.1, I may miss some project senarios. Please try this plugin and push any issues. I will help you solve the problem ASAP(usually within 24 hours).


## Changelog
- v0.0.1 resouce inline and md5
- v0.0.2 customized name and hash
- v0.0.3 support favicon file
- v0.0.4 fix adding prefix and adding md5 bugs
- v0.0.5 offer templateContent to modify html content before output
- v0.0.7 compatible with webpack2.0
