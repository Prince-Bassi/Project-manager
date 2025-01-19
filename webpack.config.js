require("dotenv").config();

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
       mode: process.env.NODE_ENV,
       entry: "./Scripts/script.jsx",
       output: {
              path: path.resolve(__dirname, "ProjectFiles"),
              filename: "bundle.js",
              publicPath: '/',
       },
       module: {
              rules: [
              {
                     test: /\.(js|jsx)$/,
                     exclude: /node_modules/,
                     use: {
                            loader: "babel-loader",
                            options: {
                                   cacheDirectory: true,
                            },
                     },
              },
              {
                     test: /\.(sa|sc|c)ss$/,
                     use: [
                            'style-loader',
                            'css-loader',
                            'sass-loader',
                     ],
              },
              ],
       },
       resolve: {
              extensions: ['.js', '.jsx'],
       },
       plugins: [
              new HtmlWebpackPlugin({
                     template: './ProjectFiles/index.html',
              }),
       ],
       devtool: 'cheap-module-source-map',
       devServer: {
              static: path.join(__dirname, "ProjectFiles"),
              compress: true,
              hot: true,
              historyApiFallback: true,
              port: process.argv[2],
       },
};