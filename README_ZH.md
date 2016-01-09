# html-res-webpack-plugin

## 我为什么要写一个新的html生成插件

之前，我一直使用[html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) 插件. 可是，这个插件有比较大的问题。当我使用inject模式的时候，我需要去筛走我不需要的入口文件。除此之外，如果我想加一些例如async这样的属性给我的script标签，也基本是不可能的事。如果我使用非inject模式，md5的自带特性将无法使用，更不用说资源内联了。

这就是我为什么要写一个全新的插件的原因，新的插件使用起来将会更加简单明了。

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
    <link rel="stylesheet" href="./css/preview/preview.css">
</head>
<body>
    <div class="preview-wrapper"></div>
    <script src="js/common.js"></script>
    <script src="js/preview/preview.js?__inline"></script>
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

    plugins: [
        // some other plugins

        new HtmlResWebpackPlugin({
            filename: "index.html",
            template: "src/index.html",
            chunkhash: config.chunkhash
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

如果webpack使用watch模式（就是说，项目正在开发中），md5和资源内联功能都不会被使用。如果webpack在production（生产）模式，插件将会给文件添上md5或者将其内联。

另一个值得提的是hash（哈希）的使用。如果你使用hash，请输入如`[hash:x]`(x是一个数字)。如果使用的是chunkhash，请输入`[chunkhash:x]` （x是一个数字)。x是必须的，因为我认为没人会使用完整的hash字符串。hash与chunkhash的不同点在于，hash对于所有资源都是一样的，而每个入口文件却只有一个自己的chunkhash（如果你使用extract-text-webpack-plugin插件，在入口js文件里被引用的样式文件，则会共享相同的chunkhash）。

## 多html页面
有时候，一个项目会有多于一个html文件。这种情况下，请对每个html文件添加对应的一个HtmlResWebacpk插件。

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
        chunkhash: config.chunkhash
    });
    webpackConfig.plugins.push(htmlResWebpackPlugin);

});
```

## Options
- `filename`: 生成的html文件名
- `template`: html模板来源
- `chunkhash`: "-[chunkhash:6]" or ".[chunkhash:6]" 等
- `hash`: "-[hash:6]" or ".[hash:6]" and 等

## 写在最后
因为这只是v0.0.1版本，我可能会漏掉一些项目的场景。请给我发issue或者发邮件，我会尽快帮你解决问题(通常24小时之内）并不断优化这个插件。


## 项目变更
v0.0.1 html生成及相关js,css资源内联

## 下一版本
v0.0.2 使用webpack的缓存特性使构建更快specs