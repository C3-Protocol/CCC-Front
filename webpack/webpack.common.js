const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const dfxJson = require('../dfx.json')
const canister = require('../canister_ids.json')

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

// List of all aliases for canisters. This creates the module alias for
// the `import ... from "@dfinity/ic/canisters/xyz"` where xyz is the name of a
// canister.
const aliases = Object.entries(dfxJson.canisters).reduce((acc, [name, _value]) => {
  // Get the network name, or `local` by default.
  const networkName = process.env['DFX_NETWORK'] || 'local'
  const outputRoot = path.join(__dirname, '../.dfx', networkName, 'canisters', name)
  return {
    ...acc,
    ['dfx-generated/' + name]: path.join(outputRoot, '../', name + '.js')
  }
}, {})

const isProduction = process.env.NODE_ENV === 'production'
const devtool = isProduction ? 'source-map' : 'cheap-module-source-map'

/**
 * Generate a webpack configuration for a canister.
 */
function generateWebpackConfigForCanister(name, info) {
  if (typeof info.frontend !== 'object') {
    return
  }

  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      index: path.join(__dirname, '../', info.frontend.entrypoint).replace(/\.html$/, '.js')
    },
    devtool,
    cache: true,
    resolve: {
      alias: { ...aliases, canister: path.resolve(__dirname, '../src/server'), '@': path.resolve(__dirname, '../src') },
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
      filename: isProduction ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name]bundle.js',
      chunkFilename: isProduction ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js'
      // publicPath: '/dist/' // 设置基础路径
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: ['babel-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.(jpg|jpeg|png|svg|gif|webp)$/,
          // use: ['url-loader']
          type: 'asset/resource',
          parser: {
            //转base64的条件
            dataUrlCondition: {
              maxSize: 4 * 1024 // 25kb
            }
          },
          generator: {
            //   //与output.assetModuleFilename是相同的,这个写法引入的时候也会添加好这个路径
            filename: 'static/img/[name].[hash:8][ext]'
            //   //打包后对资源的引入，文件命名已经有/img了
            //   publicPath: './'
          }
        },
        // {
        //   test: /\.html/,
        //   type: 'asset/resource',
        //   generator: {
        //     filename: 'static/[hash][ext][query]'
        //   }
        // },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(__dirname, '../tsconfig.json')
              }
            }
          ]
        },
        {
          test: /\.(css|less)$/,
          use: [
            MiniCssExtractPlugin.loader,
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
            {
              loader: 'style-resources-loader',
              options: {
                patterns: path.resolve(__dirname, '../src/assets/style/var.less')
              }
            }
          ]
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          exclude: /(node_modules)/,
          loader: 'file-loader'
        }
        // {
        //   test: /\.less$/i,
        //   use: [
        //     'style-loader',
        //     'css-loader',
        //     {
        //       loader: 'less-loader',
        //       options: {
        //         lessOptions: {
        //           javascriptEnabled: true
        //           // modifyVars: {
        //           //   'primary-color': '#1DA57A'
        //           // }
        //         }
        //       }
        //     },
        //     // 在这里引入要增加的全局less文件
        // {
        //   loader: 'style-resources-loader',
        //   options: {
        //     patterns: path.resolve(__dirname, './src/assets/style/var.less')
        //   }
        // }
        //]
        // }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../', info.frontend.entrypoint),
        favicon: 'favicon.ico',
        filename: 'index.html',
        chunks: ['index']
      }),
      new webpack.ProvidePlugin({
        Buffer: [require.resolve('buffer/'), 'Buffer'],
        process: require.resolve('process/browser')
      }),
      new webpack.DefinePlugin({
        'process.env.DFX_NETWORK': JSON.stringify(process.env.DFX_NETWORK),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.NFT_STORAGE_API_KEY': JSON.stringify(canister['storageKey'][process.env.DFX_NETWORK]),
        'process.env.BLIND_BOX_KEY': JSON.stringify(canister['blindboxKey'][process.env.DFX_NETWORK])
      }),
      new MiniCssExtractPlugin()
    ]

    // optimization: {
    //   minimize: true,
    //   runtimeChunk: 'single',
    //   minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    //   chunkIds: 'named',
    //   splitChunks: {
    //     maxAsyncRequests: 6,
    //     cacheGroups: {
    //       vendors: {
    //         test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|axios|xlsx|video.js|lodash)/,
    //         name: 'vendors',
    //         chunks: 'all'
    //       }
    //     }
    //   }
    // }
    //(react|react-dom|react-router-dom|axios|xlsx|video\.js)
    // performance: {
    //   hints: false,
    //   // 打包之后的文件的大小超过 250000 字节报错提示
    //   maxAssetSize: 250000,
    //   // 首次加在文件的大小
    //   maxEntrypointSize: 400000
    // },
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
