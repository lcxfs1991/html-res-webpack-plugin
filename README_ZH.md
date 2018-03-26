# html-res-webpack-plugin

[![NPM Version](https://img.shields.io/npm/v/html-res-webpack-plugin.svg?style=flat)](https://www.npmjs.com/package/html-res-webpack-plugin)
[![Travis](https://img.shields.io/travis/lcxfs1991/html-res-webpack-plugin.svg)](https://travis-ci.org/lcxfs1991/html-res-webpack-plugin)
[![Deps](https://david-dm.org/lcxfs1991/html-res-webpack-plugin.svg)](https://david-dm.org/lcxfs1991/html-res-webpack-plugin)

### [英文文档](/README.md)

## 为什么我要重构

最近随着我对webpack了解的深入，发现webpack主要是基于chunks。因此基于chunks去写插件会更贴近webpack的理念。


## 基本概念：`chunks`和`assets`
在webpack里，基本的要素就是`chunks`。`entry`配置项中的值其实就是chunks。例如下面的`entry`配置中的`index`和`detail`都是`chunks`的名字。大多数情况下，chunk都是一个js文件。但如果你在js文件里引入样式或者其它文件，那么一个js的chunk除了包括js文件以外，还会包括你引入的那些文件。

```javascript
entry: {
    index: xxx
    detail: xxx
}
```

那么`assets`呢？`Assets`是那些将要被webpack输出的文件。它们可以是任何类型的文件，比如样式、图片或者html文件。

## V3 重大更新

从 V3 版本开始, 我们在使用 `default` 或 `html` mode 的时候，资源必须加上后缀名才可以正常注入或匹配。否则，它会报错。

## 依赖html-loader
自`v1.1.3`以后，webpack配置中需要包含[html-loader](https://github.com/webpack/html-loader)的配置，例如：

```javascript
rules: [
    // some other loaders
    {
      test: /\.html$/,
      loader: 'html-loader'
    }
]
```


## 如何开始

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

有一个需要提及的是，hash与chunkhash的不同点在于，hash对于所有资源都是一样的，而每个入口文件却只有一个自己的chunkhash（如果你使用extract-text-webpack-plugin插件，在入口js文件里被引用的样式文件，则会共享相同的chunkhash。但请使用`contenthash`，这样能保证样式文件的hash会随着自身内容的改变而改变）。

另一个值得提及的，是`chunks`的顺序。那些被注入的资源的顺序，就是基于`html-res-webpack-plugin`中`chunks`配置的顺序。

## 注入外部资源
有时候你可能需要使用外部的公共资源。如果是这样，请仿照以下的配置写法：

```javascript
chunks:{
    'qreport': {
        external: true,                                 // 告诉插件不要带上publicPath
        res:  "//s.url.cn/pub/js/qreport.js?_bid=2231", // 资源路径
        attr: {
            js: "async=\"true\"",
        }
    }
}
```

## 多html页面
有时候，一个项目会有多于一个html文件。这种情况下，请对每个html文件添加对应的一个HtmlResWebacpk插件。

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

## 输出前修改Html内容

```javascript
new HtmlResWebpackPlugin({
    filename: "index.html",
    template: "src/index.html",
    templateContent: function(tpl) {
        // 你可以在这里修改html内容tpl
        // 你也可以在这里使用this.options[用户传入的插件options]
        // 和this.webpackOptions[webpack配置]
        // 打开插件的index.js可以查看都有哪些option提供使用
        return tpl;
    }
}),
```

## 支持在html文件中配置资源Support Writing Assets in html files
在0.0.7版本及之前，我们支持在html文件中配置资源，这是一种对开发者来说比较直观的方式。这个功能在1.0版本去掉，但在1.1版本回归了。但使用方法会稍微有点不同。

例如，若entry配置中如下：
```javascript
entry: {
    'index': xxx,
    'detail': xxx,
    'libs/react': xxx,
}
```
那么html中的资源可以这样写，也就是将entry的key值，放在资源路径中，以便插件方便进行替换。
```javascript
<script src="libs/react"></script>
<link rel="stylesheet" href="index">
<script src="index"></script>
```

如果你想给资源添加属性，请在`src`与`rel`之前添加。
```javascript
<script src="libs/react.js"></script>
<link rel="stylesheet" href="index.css">
<script src="index.js"></script>
```

而favico则直接配置:
```javascript
<link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
<link rel="icon" type="image/x-icon" href="favicon.ico">
```

If you have no idea about the chunk name, you can try running webpack, the plugin will print chunk names available for usage.
如果你不知道chunka的名字，你可以尝试运行webpack，插件会打印出可用的chunk的名字

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

如果你想内联一些不需要经过 webpack 打包的资源，你既可以通过 `copy-webpack-plugin-hash` (下一部份提及），也可以通过插件达成。例如，如果项目的目录结构如下：

```javascript
-- src
  |-- index.html
  |-- libs
  |    |-- react.js
  |-- css
  |    |-- index.css
```

那么，你可以将在 `index.html` 中的资源匹配写成这样：

```html
<script asycn defer src="./libs/react.js?__inline"></script>
<link asycn defer rel="stylesheet" href="./css/index.css?__inline">
```

如果你想某些资源只在生产环境里显示，你需要设置 `env` 为 `production`，然后 html 的资源匹配写成这样：

```html
<script asycn defer src="./libs/react.js?__production"></script>
<link asycn defer rel="stylesheet" href="./css/index.css?__production">
```

如果只想在开发环境里出现某些资源，也如发炮制:

```html
<script asycn defer src="./libs/react.js?__development"></script>
<link asycn defer rel="stylesheet" href="./css/index.css?__development">
```


## 与 ```copy-webpack-plugin-hash```插件搭配使用
[copy-webpack-plugin-hash](https://www.npmjs.com/package/copy-webpack-plugin-hash) 是一个帮助直接复制文件的webpack插件。 我添加了一个`namePattern`的选项目，这样能够让复制的文件也带上hash（一旦主要的repo接受了我的request，我可能会删掉这个临时的repo）

如果你使用`copy-webpack-plugin-hash`，你也可以轻松使用`html-res-webpack-plugin`。例如，你想复制`/xxx/libs`文件夹到`libs/`。若你的文件夹包含`react`和`react-dom`，你可以添加chunks `libs/react/`和`libs/react-dom`到`html-res-webpack-plugin`中。


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
如果你倾向于在 html 文件中写资源，那也可以！每一个被插件拷贝的文件都将会被看作一个 chunk， 如 `libs/react`, `libs/react-dom`, `js/index`。你可以用这些 chunk 名字给 `html-res-webpack-plugin` 用于在 html 文件中匹配资源，那你便可以轻松进行资源内联或者md5了！

## Options
- `mode`:
    - is optional
    - `default` (在`chunks`配置中配置资源) | `html` (在html文中配置资源)
- `env`
    - is optional
    - `production` (生产环境) | `development`  (开发环境, 支持不内联元素)
    - 默认值 `production`
- `filename`:
    - is required
    - 生成的html文件名
- `template`:
    - is required
    - html模板来源
- `entryLog`:
    - is optional
    - [Boolean]
    - 默认值 `true`, 如果你使用 `html` `mode`, 你可以设置此值为`true`, 便可以看到`chunkName`以及其如何在`html`文件中占位的使用办法
- `removeUnMatchedAssets`:
    - is optional
    - 不再推荐使用
    - [Boolean]
    - 默认值 `false`, 这是一个正在测试的配置，用于去掉那些找不到资源的匹配。
- `logLevel`: 
    - is optional
    - [Integer]
    - 默认值 `0`, 0 => info(绿色), 1 => alert(黄色)
- `chunks`:
    - is required 如果 `mode` 是 `default`, is not required 如果 `mode` 是 `html`
    - [Array|Object]
    - 注入的chunks
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
                    external: true              // 告诉插件不要带上publicPath
                    res: "xxx"                  // 资源路径
                },
                'index.js': {
                    attr: "async=\"true\"",    // index chunk 中 js 文件注入的html标签属性
                        js: 
                        css: "offline",
                    },
                },
                'index.css': {
                    attr: "offline",    // index chunk 中 css 文件注入的html标签属性
                },
                'detail.js': {
                    inline: true,                 // detail chunk 中 js 文件是否内联
                },
                'detail.css': {
                    inline: true,                 // detail chunk 中 css 文件是否内联
                },
                'libs/react.js': nulls
            }
        })
    ]
```

- `htmlMinify`:
    - is optional
    - 请查看 [html-minifier](https://github.com/kangax/html-minifier) to see detail options. 如果设为false | null, html文件则不会被压缩
- `favicon`:
    - is optional
    - favicon路径, 如: "src/favicon.ico"
- `templateContent`:
    - is optional
    - 这里可提供给开发者在输出前修改html内容。 this.options和this.webpackOptions在这里也可以被使用
- `cssPublicPath`:
    - is optional
    - css的具体路径，默认使用webpack的配置`output.publicPath`

## 写在最后
为了保证稳定性和可靠性，我添加了测试用例。我早已开始在我自己的开发项目中使用。

如果你对README还是不理解，可以查看一下`specWebpack`目录下的例子。那也是测试用例存放的地方。