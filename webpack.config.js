'use strict'
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin  = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const UglifyjsPlugin = require('uglifyjs-webpack-plugin')
const utils = require('./build/utils.js')
module.exports = {
  entry: {
    ...utils.entries()
  },
  output: {
    filename: utils.assetsPath("js/[name].[hash].js"),
    chunkFilename: utils.assetsPath("js/[id].[chunkhash].js"),
    path: path.resolve(__dirname, "v1"),
    publicPath: "/v1"
  },
  devServer: {
    contentBase: path.join(__dirname, "v1"),
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|JPG|jepg|svg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1000,
              publicPath: "/v1",
              name: utils.assetsPath("images/[name].[hash:7].[ext]")
            }
          }
        ]
      },
      {
        test: /\.(sa|ss|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true
            }
          }
        ]
      }
    ]
  },
  // 优化性能webpack4
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyjsPlugin({
        uglifyOptions: {
          compress: { drop_debugger: true },
          output: {},
          sourceMap: {},
          ecma: 5,
          ie8: true,
          //...
        }
      })
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env.ENV": JSON.stringify(process.env.ENV)
    }),
    // new webpack.SourceMapDevToolPlugin({
    //   filename: '[name].js.map',
    //   exclude: ['vendor.js']
    // }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "./static"),
        to: path.resolve(__dirname, "v1/static"),
        ignore: [".*"]
      }
    ]),
    //处理编译时的错误
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin({}),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath("css/[name].[hash:7].css"),
      chunkFilename: utils.assetsPath("css/[id].[chunkhash].css")
    })
  ].concat(utils.htmlPlugin())
};