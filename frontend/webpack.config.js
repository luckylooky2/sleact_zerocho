const path = require("path");
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  name: "reactrouter-setting",
  mode: "development",
  devtool: "eval",
  resolve: {
    extensions: [".js", ".jsx"],
  },
  entry: {
    app: ["./client"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  browsers: ["last 2 chrome versions", "> 5% in KR"],
                },
                debug: true,
              },
            ],
            "@babel/preset-react",
          ],
          plugins: [
            "react-refresh/babel",
            // "@babel/plugin-proposal-class-properties", // class import하기 위해
          ],
        },
      },
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({ debug: true }),
    new ReactRefreshWebpackPlugin(),
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "app.js",
    publicPath: "/dist/",
  },
  devServer: {
    historyApiFallback: true, // 뒤로 가기 후 새로고침 => cannot get /number-baseball 에러 해결
    devMiddleware: { publicPath: "/dist" },
    static: { directory: path.resolve(__dirname) },
    port: 3000,
    hot: true,
  },
};
