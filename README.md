## 基于Vue的WebApp项目构建模板

#### 1. 构建工具

- 采用`Vue 2.x`和`webpack 3`构建基本的WebApp工程。
- 采用`Vue全家桶`作为基本开发框架。
- 采用`sass`和`css module`技术应用CSS样式。
- 采用`npm scripts`控制构建过程。

```
"scripts": {
  "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js",
  "dev": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.config.js"
}
```

#### 2. 自适应解决方案

> 一套设计稿如何适配不同移动端设备？

在项目中使用 [hotcss.js](https://github.com/imochen/hotcss)，这个插件会自动根据手机型号计算`dpr`的值，同时在`<html>`根标签内植入一个相应的`font-size`的值。

在vue-loader中使用 [px2rem](https://www.npmjs.com/package/px2rem-loader) 插件，根据设计稿所采用的手机型号（如iPhone 6 或 iPhone X），那么宽度则为`640px`或`750px`，因此先在chrome调试工具中获取移动端的`<html>`根元素的`font-size`的值，然后在配置`vue-loader`时将其设为`remUnit`参数的值:

```
css: 'vue-style-loader!css-loader!px2rem-loader?remUnit=40&remPrecision=8',
scss: 'vue-style-loader!css-loader!px2rem-loader?remUnit=40&remPrecision=8!sass-loader'
```

这样就可以根据设计稿尺寸，在开发时写CSS绝对值像素，`px2rem`会自动将尺寸转换成相应的`rem`单位，结合不同移动终端生成的不同`html`根元素的字体大小，从而实现一套设计稿在不同设备上完美兼容的效果。

> 注意事项：
> 
> 1、对于一些布局类的样式，宽度通常采用百分比为单位，如`width: 100%`; 又如配合`box-sizing: border-box`; 设置`width: 25%`可控制一行放4个div。
> 
> 2、对于一些小组件，如按钮、文字等，直接写设计稿上的css尺寸即可。如`font-size`, `margin`, `padding`, `height`…… 即使通过 PC 或 Pad 访问也不会丢失效果。

#### 3. 项目目录

```
.
├── node_modules
│   ├── ...
├── app
│   ├── assets
│   │   ├── images
│   │   └── styles
│   ├── components
│   │   ├── common          # 抽象组件
│   │   │   └── ...
│   │   ├── home            # 主路由组件
│   │   │   └── index.vue
│   │   └── layout          # 布局组件
│   │       └── ...
│   ├── config              # 配置
│   │   └── router.js
│   ├── App.vue             # 根组件
│   ├── index.html          # 页面模板
│   ├── index.js            # 入口文件
│   └── viewport.js         # hotcss
├── build
│   ├── vue-loader.config.js
│   └── webpack.config.js
├── package-lock.json
├── package.json
├── .npmrc
├── .babelrc
├── postcss.config.js
└── README.md

```