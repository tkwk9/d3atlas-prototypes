const path = require("path");
const { SourceMapDevToolPlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const PrerendererWebpackPlugin = require("@prerenderer/webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "src", "App.js"),
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js",
    publicPath: "/",
  },
  mode: "production",
  resolve: {
    modules: ["node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new SourceMapDevToolPlugin({
      filename: "[file].map",
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
      inject: true,
    }),
    new FaviconsWebpackPlugin(
      path.join(__dirname, "src/assets", "favicon.ico")
    ),
    new PrerendererWebpackPlugin({
      routes: ["/", "/xyz"],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
