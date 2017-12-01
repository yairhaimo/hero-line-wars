const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
  entry: {
    app: ['./src/app.ts'],
    vendor: ['pixi', 'p2', 'phaser']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  // externals: {
  //   pixi: 'pixi',
  //   p2: 'p2',
  //   'phaser-ce': 'Phaser'
  // },
  module: {
    rules: [
      { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
      { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
      { test: /p2\.js/, use: ['expose-loader?p2'] },

      // {
      //   test: /(pixi|phaser).*.js/,
      //   use: 'script-loader'
      // },
      {
        test: /\.[jt]s$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor' /* chunkName= */,
      filename: 'vendor.bundle.js' /* filename= */
    }),
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([{ from: 'assets', to: 'assets' }]),
    new UglifyJSPlugin(),
    new HtmlWebpackPlugin({
      title: 'Game',
      template: 'index.html',
      chunks: ['vendor', 'app'],
      chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false,
        html5: false,
        minifyCSS: false,
        minifyJS: false,
        minifyURLs: false,
        removeComments: false,
        removeEmptyAttributes: false
      },
      hash: false
    })
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      phaser: phaser,
      pixi: pixi,
      p2: p2
    }
  },
  devtool: 'source-map',
  devServer: {
    hot: true,
    contentBase: './dist'
  }
};
