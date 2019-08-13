'use strict'
const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PAGE_PATH = path.resolve(__dirname, '../src/view')
const HtmlWebapckInlineSourcePlugin = require('html-webpack-inline-source-plugin')

exports.assetsPath = function(_path) {
  const assetsSubDirectory = 'static'
  return path.posix.join(assetsSubDirectory, _path)
}

/**
 *  entry file and file path
 * @return map object  filename: filePath
 * @author gzll
 */ 
exports.entries = function () {
  var entryFiles = glob.sync(PAGE_PATH+'/**/*.js')
  let map = {}
  entryFiles.forEach((filePath)=>{
    let filename = filePath.substring(filePath.lastIndexOf('\/')+1, filePath.lastIndexOf('.'))
    map[filename] = filePath
  })
  return map
}

/**
 * @return arr add html plugins
 * @author gzll
 */
exports.htmlPlugin = function (){
  let entryHtml = glob.sync(PAGE_PATH+'/*/*.ejs')
  let arr = []
  entryHtml.forEach((filePath)=>{
    let filename = filePath.substring(filePath.lastIndexOf('\/')+1, filePath.lastIndexOf('.'))
    let conf = {
      title: filename,
      template: "ejs-loader!" + filePath,
      filename: filename + "/index.html",
      chunks: [filename],
      inject: true,
      inlineSource: ".(js|css)$",
      minify: {
        collapseInlineTagWhitespace: true,
        removeComments: true,
        removeCommentsFromCDATA: true,
        maxLineLength: 1,
        minifyCSS: true,
        minifyJS: true,
        preserveLineBreaks: true,
        processConditionalComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        trimCustomFragments: true
      }
    };
    arr.push(new HtmlWebpackPlugin(conf))
    arr.push(new HtmlWebapckInlineSourcePlugin())
  })
  return arr
}