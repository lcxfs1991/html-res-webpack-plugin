# html-res-webpack-plugin

## Why do I write a new html plugin

Previously, I use html-webpack-plugin for my projects. However, the plugin has a serious drawback. When I use inject mode, I need to filter all entry files that I don't need. In addition, If I hope to add attributes like async to my script tag, it is a mission impossible. If I use non-inject mode, md5 feature is gone.

That is why I need to write a brand new one which is more intuitively.

## How to start





## Changelog
v0.0.1 resouce inline and md5