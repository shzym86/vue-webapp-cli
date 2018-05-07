const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = (isDev) => {
  return {
    preserveWhitepace: true,
    extractCSS: !isDev,
    cssModules: {
      localIdentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[hash:base64:5]',
      camelCase: true
    },
    loaders: isDev ? {
      css: 'vue-style-loader!css-loader!px2rem-loader?remUnit=40&remPrecision=8',
      scss: 'vue-style-loader!css-loader!px2rem-loader?remUnit=40&remPrecision=8!sass-loader'
    } : {
      css: ExtractTextPlugin.extract({
        use: 'css-loader?minimize!px2rem-loader?remUnit=40&remPrecision=8',
        fallback: 'vue-style-loader'
      }),
      scss: ExtractTextPlugin.extract({
        use: 'css-loader?minimize!px2rem-loader?remUnit=40&remPrecision=8!sass-loader',
        fallback: 'vue-style-loader'
      })
    }
    // hotReload: false, // 根据环境变量生成
  }
}
