# html-res-webpack-plugin

[![NPM Version](https://img.shields.io/npm/v/html-res-webpack-plugin.svg?style=flat)](https://www.npmjs.com/package/html-res-webpack-plugin)
[![Travis](https://img.shields.io/travis/lcxfs1991/html-res-webpack-plugin.svg)](https://travis-ci.org/lcxfs1991/html-res-webpack-plugin)
[![Deps](https://david-dm.org/lcxfs1991/html-res-webpack-plugin.svg)](https://david-dm.org/lcxfs1991/html-res-webpack-plugin)

### [中文文档](/README_ZH.md)

## Why do I rewrite the whole thing

I rencently notice that webpack is based itself on chunks. Therefore, writing plugin logic based on chunk may be adaptable to the core and sprite of webpack.


## Basic Concpets: `chunks` and `assets`
In webpack, the basic element is `chunks`. The values in `entry` of webpack config are `chunks`. For instance, `index` and `detail` in the following entry config are chunks' names; In most cases, chunk is a js file. But if you require stylesheet or other files in js, a js chunk will include not only js file but also the files you require.

```javascript
entry: {
    index: xxx
    detail: xxx
}
```

What about assets? Assets are files will be exported by webpack. They can be any file types like stylesheets, images, html and so on.

## Breaking Change For V3

Since V3, we must add extension for both `default` or `html` mode. Otherwise, it will prompt an error.


## Require html-loader
[html-loader](https://github.com/webpack/html-loader) is required after `v1.1.3`, an example option is as follows:

```javascript
loaders: [
    // some other loaders
    {
      test: /\.html$/,
      loader: 'html-loader'
    }
]
```


## How to start

src/index.html
-->
dist/index.html

```javascript
<!DOCTYPE html>
<html lang="en" id="html">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="x-dns-prefetch-control" content="on" />
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui" />
    <title>html-res-webpack-example</title>
</head>
<body>
    <div class="preview-wrapper"></div>
</body>
</html>
```

src/page/preview/main.js
-->
dist/js/preview/preview.js
```javascript
require('./index.scss');

var init = function() {
    // some code here
};
```

src/page/preview/index.scss
-->
dist/css/preview/preview.css
```javascript
html, body {
    margin: 0;
}
// some code here
```

webpack.config.js
```javascript
    var config = {
        hash: "-[hash:6]",
        chunkhash: "-[chunkhash:6]",
        contenthash: "-[contenthash:6]"
    };
    var webpackconfig = {
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
            new ExtractTextPlugin("./css/[name]" + config.contenthash + ".css"),
            new HtmlResWebpackPlugin({
                filename: "index.html",
                template: "src/index.html",
                chunks:{
                    'index.js': {
                        attr: "async=\"true\"",  // attributes for js file in index chunk
                        inline: true,                   // inline or not for index chunk
                    },
                    'index.css': {
                        attr: "offline",  // attributes for css file in index chunk
                    }
                },
            });
        ]
    };
```

package.json
```javascript
"scripts": {
    "dev": "webpack --progress --colors --watch",
    "publish-mac": "export NODE_ENV=prod&&webpack -p --progress --colors",
    "publish-windows": "SET NODE_ENV=prod&&webpack -p --progress --colors"
 },

```


One thing need to be noticed is `hash` and `chunkhash`. The difference between `hash` and `chunkhash` is that `hash` is the same for all resources and `chunkhash` is different for specific resource. Usually you are recommended to use `chunkhash` instead (Exception for style files required in an entry js file. They share the same `chunkhash` if you use extract-text-webpack-plugin. Please use `contenthash` instead in order to ensure hash for stylesheet changes only when content changes).

Another thing worth being noticed is the order of `chunks`. The order of resources that will be injected is based on the order of `chunks` in `html-res-webpack-plugin`.

## Inject External Resource
Sometimes, you may need to use external common resources. If this is the case, please write options like following:

```javascript
chunks:{
    'qreport': {
        external: true,                                 // tell the plugin not to append publicPath
        res:  "//s.url.cn/pub/js/qreport.js?_bid=2231", // resource path
        attr: "async=\"true\"",
    }
}
```


## Multiple Html Page
Sometimes there are more than one html pages in your projects. In this situation, please use similar iteration code to add plugins for different html pages

```javascript
var config = {
    hash: "-[hash:6]",
    chunkhash: "-[chunkhash:6]",
    contenthash: "-[contenthash:6]"
};

var route = ['index', 'detail'];

var webapckConfig = {
    entry: {
        "js/index": "xxx/index",
        "js/detail": "xxx/detail",
    }
};

let pageMapping = {
    'detail': {
        'js/detail.js': {
            attr: ""
        },
        'js/detail.css': {
            attr: ""
        },
    },
    'index': {
        'js/index.js': {
            attr: ""
        },
        'js/index.css': {
            attr: ""
        },
    }
};

webpackConfig.addPlugins = function(plugin, opt) {
    devConfig.plugins.push(new plugin(opt));
};

route.html.forEach(function(page) {
    webapckConfig.addPlugins(HtmlResWebpackPlugin, {
        filename: page + ".html",
        template: "src/" + page + ".html",
        favicon: "src/favicon.ico",
        chunks: pageMapping[page],
    });
});
```

## Favicon

webpack.config.js
```javascript
new HtmlResWebpackPlugin({
    filename: "index.html",
    template: "xxx/index.html",
    favicon: "xxx/favicon.ico",
    chunks:[
        'js/index.js',
        'js/index.css',
    ],
}),
```

## Modify Html Content Before Output

```javascript
new HtmlResWebpackPlugin({
    filename: "index.html",
    template: "src/index.html",
    templateContent: function(tpl) {
        // some modification of tpl
        // you can use this.options [user input plugin options]
        // and this.webpackOptions [webpack config] here, you can open index.js of the plugin
        // to check what options are offered
        return tpl;
    }
}),
```

## Support Writing Assets in html files
In version 0.0.7 and before, we support writing assets in html files which is intuitive for developers. We drop this feature in v1.0 but not it is back in v1.1 but there are a few differences.

For example, if the config for entry is like following:
```javascript
entry: {
    'index': xxx,
    'detail': xxx,
    'libs/react': xxx,
}
```
Then, the settings for assets in html can be like this. That is to say, we put the key value of entry in asset route in order for the plugin to replace with the correct value for convenience.
```javascript
<script src="libs/react.js"></script>
<link rel="stylesheet" href="index.css">
<script src="index.js"></script>
```

If you hope to add attribute to the resource, please add it right before `src` or `rel`.

```javascript
<script asycn defer src="libs/react.js"></script>
<link asycn defer rel="stylesheet" href="index.css">
```

But for favico, we can directly write like this:
```javascript
<link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
<link rel="icon" type="image/x-icon" href="favicon.ico">
```

If you have no idea about the chunk name, you can try running webpack, the plugin will print chunk names available for usage.

```javascript
=====html-res-webapck-plugin=====
chunk1: commons.js
chunk2: js/index.js
chunk3: js/index.css
chunk4: js/list.js
chunk5: js/list.css
chunk6: js/detail.js
chunk7: js/detail.css
chunk8: libs/react
```

If you wanna inline resources that webpack will not compile, you can either make it through `copy-webpack-plugin-hash` (mentioned in next section) or make it through the plugin. For example, if the project structure is like this:

```javascript
-- src
  |-- index.html
  |-- libs
  |    |-- react.js
  |-- css
  |    |-- index.css
```

Then, you can write the resource matching in `index.html` like following:

```html
<script asycn defer src="./libs/react.js?__inline"></script>
<link asycn defer rel="stylesheet" href="./css/index.css?__inline">
```

If you only hope to show certain asset in production environment, you can set `env` options to `production`, then write the resource like following:

```html
<script asycn defer src="./libs/react.js?__production"></script>
<link asycn defer rel="stylesheet" href="./css/index.css?__production">
```

Same as asset in development environment:

```html
<script asycn defer src="./libs/react.js?__development"></script>
<link asycn defer rel="stylesheet" href="./css/index.css?__development">
```


## Usage with ```copy-webpack-plugin-hash```
[copy-webpack-plugin-hash](https://www.npmjs.com/package/copy-webpack-plugin-hash)  is a plugin that helps copy files directly without webpack parsing. I add `namePattern` option feature for it so that files generated by this plugin can also have hash (Once the main repo accepts my pull request, I will delete this temporary repo).

If you use copy-webpack-plugin for example, you can use `html-res-webpack-plugin` easily. For example, if you copy `/xxx/libs` folder to `libs/`. If the folder contains `react` and `react-dom`, you can add chunks `libs/react.js` and `libs/react-dom.js` in `html-res-webpack-plugin`.

```javascript
// copy-webpack-plugin-hash@5.x
plugins: [
    new CopyWebpackPlugin([
        {
            from: '/xxx/libs/',
            to: 'libs/'
        }
    ], {
        namePattern: "[name]-[contenthash:6].js"
    }),
    new HtmlResWebpackPlugin({
        filename: "index.html",
        template: config.path.src + "/resource-copy-plugin-1/index.html",
        chunks:[
            'libs/react.js',
            'libs/react-dom.js',
            'js/index.js',
            'js/index.css',
        ],
    }),
]

// copy-webpack-plugin-hash@5.x
plugins: [
    new CopyWebpackPlugin([
        {
            from: '/xxx/libs/',
            to: 'libs/[name]-[hash:6].[ext]'
        }
    ]),
    new HtmlResWebpackPlugin({
        filename: "index.html",
        template: config.path.src + "/resource-copy-plugin-1/index.html",
        chunks:[
            'libs/react.js',
            'libs/react-dom.js',
            'js/index.js',
            'js/index.css',
        ],
    }),
]
```

If you prefer writing assets in html files, it works too! Each file copied by the plugin will be regarded as a chunk, like `libs/react.js`, `libs/react-dom.js`, `js/index.js`. You can use these chunk names for `html-res-webpack-plugin` to match resource in html files which makes you easier to inline or md5 resources.

## Options
- `mode`:
    - is optional
    - `default` (write assets in config `chunks`) | `html` (write assets in html)
- `env`
    - is optional
    - `production` (production env) | `development`  (development env, not inline resource)
    - default `production`
- `filename`:
    - is required
    - generated filename
- `template`:
    - is required
    - template source
- `entryLog`:
    - is optional
    - [Boolean]
    - default `true`, if you use `html` `mode`, you can enable this to show entry names and use example
- `removeUnMatchedAssets`:
    - is optional
    - [Boolean]
    - default `false`, this is a beta option, which is used for remove asset if it is not found.
- `chunks`:
    - is required if `mode` is `default`, is not required if `mode` is `html`
    - [Array|Object]
    - injected chunks
    - examples:

[Array]
```javascript
    entry: {
        'index': xxx,
        'detail': xxx,
        'libs/react': xxx,
    }

    plugins: [
        new HtmlResWebpackPlugin({
            /** other config */
            chunks: [
                'index.js',
                'index.css',
                'detail.js',
                'detail.css',
                'libs/react.js'
            ]
        })
    ]

```
[Object]

```javascript
    plugins: [
        new HtmlResWebpackPlugin({
            /** other config */
            chunks: {
                'qreport.js': {
                    external: true              // tell the plugin not to append publicPath
                    res: "xxx"                  // resource path
                },
                'index.js': {
                    attr: "async=\"true\"",    // attributes for js file in index chunk
                        js: 
                        css: "offline",
                    },
                },
                'index.css': {
                    attr: "offline",    // attributes for css file in index chunk
                },
                'detail.js': {
                    inline: true,                 // inline or not for js file in detail chunk
                },
                'detail.css': {
                    inline: true,                 // inline or not for css file in detail chunk
                },
                'libs/react.js': nulls
            }
        })
    ]
```

- `htmlMinify`:
    - is optional
    - please checkout [html-minifier](https://github.com/kangax/html-minifier) to see detail options. If set false | null, html files won't be compressed.
- `favicon`:
    - is optional
    - favicon path, for example, "src/favicon.ico"
- `templateContent`:
    - is optional
    - a point for developer to modify html content before output. `this.options` and `this.webpackOptions`can be used in such a function.
- `cssPublicPath`:
    - is optional
    - pubilc path for css, using webpack config `output.publicPath` for default

## Last Words

I add automatic testing samples fo for the plugin to ensure stablity and relablility. I starting using this plugin in internal development.

If you still don't understand README, you can checkout examples in specWepback where testing samples are located.


## Changelog
- v0.0.1 resouce inline and md5
- v0.0.2 customized name and hash
- v0.0.3 support favicon file
- v0.0.4 fix adding prefix and adding md5 bugs
- v0.0.5 offer templateContent to modify html content before output
- v0.0.7 compatible with webpack2.0 [README](https://github.com/lcxfs1991/html-res-webpack-plugin/blob/v0.0.7/README.md)
- v1.0.0 rewrite the whole thing and add testing function
- v1.0.1 allow external resource to be injected
- v1.1.0 support writing assets in html
- v1.1.2 print chunk name in runtime
- v1.1.3 fix bug for using hot update
- v1.2.0 support using loader and image in html
- v1.2.2 fix bug from uglify js which remove quotes
- v1.2.3 just chanage a few text
- v1.2.6 add doc and test for resource attribute
- v1.3.0 upgrade `copy-webpack-plugin-hash` from 3.x to 4.x
- v1.3.1 fix favicon copy bug
- v1.3.2 compatible with link closing tag
- v1.3.3 remove inline resource
- v1.3.4 fix removeing inline resource bug
- v2.0.0 upgrade some dependencies and improve test cases
- v2.0.1 not inline when in dev mode
- v2.0.2 appending extension to chunk in resource is also supported
- v2.0.3 support inline resource without webpack compilation
- v2.0.4 fix xxx.min files copied by `copy-webpack-plugin-hash` issue
- v3.0.0 [breaking change] for `default` or `html` mode, `extention` is needed for matching resources
- v3.0.1 fix replace bug with special string $&
- v3.0.2 fix hot update bug
- v3.1.0 add asset production asset support; remove asset when option is set; ignore asset with http protocol
- v3.1.1 support development only asset
- v3.2.0 update dependency
- v3.2.2 support query and hash