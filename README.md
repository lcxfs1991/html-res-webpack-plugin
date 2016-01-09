# html-res-webpack-plugin

### [中文文档](https://github.com/lcxfs1991/html-res-webpack-plugin/blob/master/README_ZH.md)

## Why do I write a new html plugin

Previously, I use [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) for my projects. However, the plugin has a serious drawback. When I use inject mode, I need to filter all entry files that I don't need. In addition, If I hope to add attributes like async to my script tag, it is a mission impossible. If I use non-inject mode, md5 feature will be gone, let alone resource inline.

That is why I need to write a brand new one which is more intuitively.

## How to start

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

If webpack is under watch mode (that is to say, the project is under developed), no md5 or resource inline functions will be called. If webpack is under production mode, the plugin will start adding md5 to resources and make the rest inline.

Another thing worth mentioned is that if you use hash, please input `[hash:x]` (x is a number). If chunkhash is used, please input `[chunkhash:x]` (x is a number); x is required because I don't expect anyone will use a complete hash for a static resource. The difference between hash and chunkhash is that hash is the same for all resources and chunkhash is different for specific resource. Usually you are recommended to use chunkhash instead (Exception for style files required in an entry js file. They share the same chunkhash if you use extract-text-webpack-plugin).

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
        chunkhash: config.chunkhash
    });
    webpackConfig.plugins.push(htmlResWebpackPlugin);

});
```


## Options
- `filename`: generated filename
- `template`: template source
- `chunkhash`: "-[chunkhash:6]" or ".[chunkhash:6]" and etc
- `hash`: "-[hash:6]" or ".[hash:6]" and etc

## Last Words
Since this is still v0.0.1, I may miss some project senarios. Please try this plugin and push any issues. I will help you solve the problem ASAP(usually within 24 hours).


## Changelog
v0.0.1 resouce inline and md5

## Next
v0.0.2 use cache to boost the speed and satisfy more projects specs