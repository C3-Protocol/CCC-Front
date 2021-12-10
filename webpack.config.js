const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const dfxJson = require('./dfx.json')

// List of all aliases for canisters. This creates the module alias for
// the `import ... from "@dfinity/ic/canisters/xyz"` where xyz is the name of a
// canister.
const aliases = Object.entries(dfxJson.canisters).reduce((acc, [name, _value]) => {
  // Get the network name, or `local` by default.
  const networkName = process.env['DFX_NETWORK'] || 'local'
  const outputRoot = path.join(__dirname, '.dfx', networkName, 'canisters', name)
  return {
    ...acc,
    ['dfx-generated/' + name]: path.join(outputRoot, name + '.js')
  }
}, {})

/**
 * Generate a webpack configuration for a canister.
 */
function generateWebpackConfigForCanister(name, info) {
  if (typeof info.frontend !== 'object') {
    return
  }
  console.log('webpack: ', process.env.DFX_NETWORK)
  const isProduction = process.env.NODE_ENV === 'production'
  const devtool = isProduction ? undefined : 'source-map'

  return {
    mode: isProduction ? 'production' : 'development',
    // mode: 'production',
    entry: {
      index: path.join(__dirname, info.frontend.entrypoint).replace(/\.html$/, '.js')
    },
    devtool,
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()]
    },
    resolve: {
      alias: { ...aliases, canister: path.resolve(__dirname, '/src/server'), '@': path.resolve(__dirname, '/src') },
      extensions: ['.js', '.ts', '.jsx', '.tsx'],
      fallback: {
        assert: require.resolve('assert/'),
        buffer: require.resolve('buffer/'),
        events: require.resolve('events/'),
        stream: require.resolve('stream-browserify/'),
        util: require.resolve('util/'),
        zlib: require.resolve('browserify-zlib'),
        https: require.resolve('https-browserify'),
        path: require.resolve('path-browserify'),
        http: require.resolve('stream-http'),
        fs: false
      }
    },
    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'dist', name)
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: ['babel-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.(jpg|jpeg|png|svg)$/,
          use: ['url-loader']
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: ['ts-loader']
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.less$/i,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true
                  // modifyVars: {
                  //   'primary-color': '#1DA57A'
                  // }
                }
              }
            },
            // 在这里引入要增加的全局less文件
            {
              loader: 'style-resources-loader',
              options: {
                patterns: path.resolve(__dirname, './src/assets/style/var.less')
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, info.frontend.entrypoint),
        favicon: 'favicon.ico',
        filename: 'index.html',
        chunks: ['index']
      }),
      new webpack.ProvidePlugin({
        Buffer: [require.resolve('buffer/'), 'Buffer'],
        process: require.resolve('process/browser')
      }),
      new webpack.DefinePlugin({
        'process.env.DFX_NETWORK': JSON.stringify(process.env.DFX_NETWORK)
      })
    ],

    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|axios)/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    // performance: {
    //   hints: false,
    //   // 打包之后的文件的大小超过 250000 字节报错提示
    //   maxAssetSize: 250000,
    //   // 首次加在文件的大小
    //   maxEntrypointSize: 400000
    // },
    devServer: {
      proxy: {
        '/api': 'http://localhost:8000'
      },
      host: '0.0.0.0'
    }
  }
}

// If you have additional webpack configurations you want to build
//  as part of this configuration, add them to the section below.
module.exports = [
  ...Object.entries(dfxJson.canisters)
    .map(([name, info]) => {
      return generateWebpackConfigForCanister(name, info)
    })
    .filter((x) => !!x)
]
