const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const entries = require('../../../entries')
const { project } = entries

const AutoInjectPlugin = require('../../../utils/auto-inject-plugin')

module.exports = [
  /**
   * 为每个入口生成 html 文件
   */
  ...Object.keys(project).map(
    projectName =>
      new HtmlWebpackPlugin({
        inject: false,
        filename: `${projectName}.html`,
        template: 'template.html',
        chunks: ['__runtime', '__vendor', projectName],
        chunksSortMode: 'dependency'
      })
  ),

  new HtmlWebpackIncludeAssetsPlugin({
    assets: ['__dll.js'],
    append: false
  })

  /**
   * 自建组件，分析入口文件引用，引入相关依赖
   */
  // new AutoInjectPlugin({
  //   entries,
  //   dllPath: 'dll/'
  // })
]