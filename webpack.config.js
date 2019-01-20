const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './main.js'
  },
  externals: {
    jquery: 'jQuery'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'inline-source-map',
  //devtool: 'eval-source-map',
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, './'),
    publicPath: path.resolve(__dirname, '/dist/'),
  },
  watch: true,
  plugins: [
      "@babel/plugin-proposal-class-properties",
      new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery"
      })
  ],
  module: {
    rules: [
      {
        test: /jquery[\\\/]src[\\\/]selector\.js$/,
        use: [
            {loader : 'amd-define-factory-patcher-loader'},
        ]

      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
            }  
          }
        ]
      }
    ]
  },
  plugins:[
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: path.resolve(__dirname, '/dist/'),
  },
};