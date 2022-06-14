const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = baseConfig.map((config) =>
  merge(config, {
    devServer: {
      proxy: {
        '/api': 'http://localhost:8000'
      },
      // compress: true,
      hot: true // 开启热更新
    }
  })
)
// module.exports = baseConfig.map((config) =>
//   merge(config, {
//     plugins: [new webpack.HotModuleReplacementPlugin()],
//     devServer: {
//       proxy: {
//         '/api': 'http://localhost:8000'
//       },
//       // compress: true,
//       hot: true, // 开启热更新
//       host: '0.0.0.0'
//     }
//   })
// )
