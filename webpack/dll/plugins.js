const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const {
  optimize: { UglifyJsPlugin } = {},
  // DllPlugin,
  DefinePlugin,
  IgnorePlugin,
  NamedChunksPlugin,
  HashedModuleIdsPlugin
} = require('webpack')

module.exports = {
  plugins: [
    /**
     * NamedChunksPlugin 和 HashedModuleIdsPlugin 保证模块 hash 不受编译顺序的影响
     * 民间资料：https://www.imooc.com/article/details/id/21538
     * 官方资料（中文版）：https://doc.webpack-china.org/guides/caching#-module-identifiers-
     * 可预测的长效缓存（扩展）：https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
     */
    new NamedChunksPlugin(),
    new HashedModuleIdsPlugin(),

    /**
     * Webpack 任务前/后，使用此插件清除旧的编译文件
     */
    new CleanWebpackPlugin([path.resolve(__dirname, '../../dist/lib')], {
      verbose: false, // 不输出 log
      allowExternal: true, // 允许 CleanWebpackPlugin 清除本配置目录外的文件
      beforeEmit: true // 在 Webpack 工作完成、输出文件前夕执行清除操作
    }),

    /**
     * 忽略国际化部分以减小 moment.js 体积，参考：https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
     */
    new IgnorePlugin(/^\.\/locale$/, /moment$/),

    /**
     *  环境变量设置为生产模式以减小 react 或其他第三方插件体积，参考：https://reactjs.org/docs/add-react-to-an-existing-app.html#development-and-production-versions
     */
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),

    /**
     * 此处与 Tree Shaking 无关，单纯对第三方模块做压缩处理
     */
    new UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: false
    })
  ]
}