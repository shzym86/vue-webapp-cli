const path = require('path')
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const createVueLoaderOptions = require('./vue-loader.config')

const isDev = process.env.NODE_ENV === 'development'

// 通用配置
const config = {
  entry: [
    path.join(__dirname, '../app/index.js'),
    path.join(__dirname, '../app/viewport.js'),
  ],
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, '../dist')
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: createVueLoaderOptions(isDev)
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: '[name].[hash:8].[ext]'
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: [
      '.js', '.vue', '.json'
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new CleanWebpackPlugin(path.join(__dirname, '../dist'), {
      root: '/'
    }),
    new HTMLWebpackPlugin({
      template: path.join(__dirname, '../app/index.html')
    })
  ]
}

// 区分不同环境的配置项
if (isDev) { //开发环境
  config.module.rules.push({
    test: /\.scss/,
    loader: 'style-loader!css-loader!sass-loader'
  })
  config.devtool = '#cheap-module-eval-source-map'
  config.devServer = {
      port: 8090,
      host: '0.0.0.0',
      overlay: {
        errors: true
      },
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      historyApiFallback: {
        index: '/dist/index.html'
      }
    },
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    )
} else { // 生产环境
  config.entry = {
    app: [
      path.join(__dirname, '../app/index.js'),
      path.join(__dirname, '../app/viewport.js'),
    ],
    vendor: ['vue']
  }
  config.output.filename = '[name].[chunkhash:8].js'
  config.module.rules.push({
    test: /\.scss/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        },
        'sass-loader'
      ]
    })
  })
  config.plugins.push(
    new ExtractTextPlugin('styles.[contentHash:8].css', {
      ignoreOrder: true
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: false,
      parallel: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    })
  )
}
module.exports = config
