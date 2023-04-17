// const TerserWebpackPlugin = require("terser-webpack-plugin");
// console.log(process.env.NODE_ENV);
// module.exports = {
//   devtool: "source-map",
//   entry: {
//     app: "./js/app.js",
//   },
//   output: {
//     path: __dirname + "/dist",
//     filename: "bundle.js",
//     publicPath: "/assets/",
//     chunkFilename: "[name].bundle.js",
//   },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: "babel-loader",
//       },
//     ],
//   },
//   devServer: {
//     port: 9000,
//     contentBase: "public",
//   },
//   optimization: {
//     //usedExports: true,
//     minimize: false,
//     //minimizer: [new TerserWebpackPlugin()],
//   },
// };

const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPluging = require("mini-css-extract-plugin");

module.exports = {
  //devtool: "source-map",
  devtool: "source-map",
  entry: {
    app: "./js/app.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js",
    publicPath: "/assets/",
    chunkFilename: "[name].bundle.js",
  },
  plugins: [
    new MiniCssExtractPluging({ filename: "[name].bundle.css" }),
    new webpack.BannerPlugin(
      "*************\n Written by Joban\n****************"
    ),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_module/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        //use: ['style-loader', 'css-loader']
        use: [
          {
            loader: MiniCssExtractPluging.loader,
            options: {
              hrm: true,
            },
          },
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpeg)$/,
        exclude: /node_modules/,
        use: "url-loader?limit=10000",
      },
    ],
  },
  devServer: {
    port: 9000,
    contentBase: "public",
  },

  optimization: {
    minimize: false,
    splitChunks: {
      minSize: 1,
      cacheGroups: {
        common: {
          test: /node_modules/,
          name: "common",
          chunks: "all",
        },
      },
    },
  },
};
