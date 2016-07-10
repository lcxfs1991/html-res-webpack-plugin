# html-res-webpack-plugin

### [英文文档](https://github.com/lcxfs1991/html-res-webpack-plugin/blob/master/README.md)

## 为什么我要重构

最近随着我对webpack了解的深入，发现webpack主要是基于chunks。因此基于chunks去写插件会更贴近webpack的理念。


## 基本概念：`chunks`和`assets`
在webpack里，基本的要素就是`chunks`。`entry`配置项中的值其实就是chunks。例如下面的`entry`配置中的`index`和`detail`都是`chunks`的名字。大多数情况下，chunk都是一个js文件。但如果你在js文件里引入样式或者其它文件，那么一个js的chunk除了包括js文件以外，还会包括你引入的那些文件。

```
entry: {
    index: xxx
    detail: xxx
}
```

那么`assets`呢？`Assets`是那些将要被webpack输出的文件。它们可以是任何类型的文件，比如样式、图片或者html文件。


## 如何开始

src/index.html
--> 
dist/index.html

```
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
                    'index': {
                        attr: {                     // attributes for index chunk
                            js: "async=\"true\"",
                            css: "offline",
                        },
                        inline: {                   // inline or not for index chunk
                            js: true,
                            css: true
                        }
                    }
                },
            });
        ]
    };
```

package.json
```
"scripts": {
    "dev": "webpack --progress --colors --watch",
    "publish-mac": "export NODE_ENV=prod&&webpack -p --progress --colors",
    "publish-windows": "SET NODE_ENV=prod&&webpack -p --progress --colors"
 },

```

有一个需要提及的是，hash与chunkhash的不同点在于，hash对于所有资源都是一样的，而每个入口文件却只有一个自己的chunkhash（如果你使用extract-text-webpack-plugin插件，在入口js文件里被引用的样式文件，则会共享相同的chunkhash。但请使用`contenthash`，这样能保证样式文件的hash会随着自身内容的改变而改变）。

另一个值得提及的，是`chunks`的顺序。那些被注入的资源的顺序，就是基于`html-res-webpack-plugin`中`chunks`配置的顺序。


## 多html页面
有时候，一个项目会有多于一个html文件。这种情况下，请对每个html文件添加对应的一个HtmlResWebacpk插件。
```
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
        'js/detail': {
            attr:{
                js: "",
                css: "",
            }
        },
    },
    'index': {
        'js/index': {
            attr:{
                js: "",
                css: "",
            }
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
```
new HtmlResWebpackPlugin({
    filename: "index.html",
    template: "xxx/index.html",
    favicon: "xxx/favicon.ico",
    chunks:[
        'js/index',
    ],
}),
```

## 输出前修改Html内容

```
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

## 与 ```copy-webpack-plugin```插件搭配使用
[copy-webpack-plugin-hash](https://www.npmjs.com/package/copy-webpack-plugin-hash) 是一个帮助直接复制文件的webpack插件。 我添加了一个`namePattern`的选项目，这样能够让复制的文件也带上hash（一旦主要的repo接受了我的request，我可能会删掉这个临时的repo）

如果你使用`copy-webpack-plugin-hash`，你也可以轻松使用`html-res-webpack-plugin`。例如，你想复制`/xxx/libs`文件夹到`libs/`。若你的文件夹包含`react`和`react-dom`，你可以添加chunks `libs/react/`和`libs/react-dom`到`html-res-webpack-plugin`中。


```
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
            'libs/react',
            'libs/react-dom',
            'js/index',
        ],
    }),
]
```

## Options
- `filename`: 
    - is required
    - 生成的html文件名
- `template`: 
    - is required
    - html模板来源
- `chunks`: 
    - is required
    - [Array|Object]
    - 注入的chunks
    - examples:
[Array]
```
    entry: {
        'index': xxx,
        'detail': xxx,
        'libs/react': xxx,
    }

    plugins: [
        new HtmlResWebpackPlugin({
            /** other config */
            chunks: [
                'index',
                'detail',
                'libs/react'
            ]
        })
    ]

```
[Object]

```
    plugins: [
        new HtmlResWebpackPlugin({
            /** other config */
            chunks: {
                'index': {
                    attr: {                     // index chunk注入的html标签属性
                        js: "async=\"true\"",
                        css: "offline",
                    },
                },
                'detail': {
                    inline: {                   // detail chunk是否内联
                        js: true,
                        css: true
                    }
                },
                'libs/react': nulls
            }
        })
    ]
```

- `htmlMinify`: 
    - is optional
    - 请查看 `html-minifier`[https://github.com/kangax/html-minifier] to see detail options. 如果设为false | null, html文件则不会被压缩
- `favicon`: 
    - is optional
    - favicon路径, 如: "src/favicon.ico"
- `templateContent`: 
    - is optional
    - 这里可提供给开发者在输出前修改html内容。 this.options和this.webpackOptions在这里也可以被使用

## 写在最后
为了保证稳定性和可靠性，我添加了测试用例。我早已开始在我自己的开发项目中使用。

如果你对README还是不理解，可以查看一下`specWebpack`目录下的例子。那也是测试用例存放的地方。


## Changelog
- v0.0.1 html生成及相关js,css资源内联
- v0.0.2 使生成的文件名和哈希可定制化
- v0.0.3 支持生成favicon文件
- v0.0.4 修复针对某些资源添加前缀或添加md5的错误
- v0.0.5 添加templateContent函数以提供定制化修改html的办法
- v0.0.7 compatible with webpack2.0 [README](https://github.com/lcxfs1991/html-res-webpack-plugin/blob/v0.0.7/README_ZH.md)
- v1.0.0 重构及添加测试用例
