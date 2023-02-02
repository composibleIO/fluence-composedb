// Generated using webpack-cli https://github.com/webpack/webpack-cli

const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: ["./src/index.ts","./styling/main.scss"],
  output: {
    path: path.resolve(__dirname, "public/"),
    chunkFilename: 'scripts.js',
    filename: 'scripts.js',
    // assetModuleFilename: (pathData) => {
    //   const filepath = path
    //       .dirname(pathData.filename)
    //       .split("/")
    //       .slice(1)
    //       .join("/");
    //   return `./styling/${filepath}/[name].[hash][ext][query]`;
    // },
  },
  devServer: {
    open:false,
    port: 3000,
    hot: false,
    client: {
      overlay: true,
      progress: true,
      reconnect: true,
    },
  },
  devtool:'source-map',
  plugins: [
      new MiniCssExtractPlugin({
        filename: "styles.css"
      }),
      new CopyWebpackPlugin({
        patterns: [
            { from: 'static' }
        ]
      }),
      new CopyWebpackPlugin({
        patterns: [
          'node_modules/@fluencelabs/avm/dist/avm.wasm',
          'node_modules/@fluencelabs/marine-js/dist/marine-js.wasm',
          'node_modules/@fluencelabs/marine-js/dist/marine-js.web.js'
        ]
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset/resource",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".ts",".js"],
    fallback: { 
      "assert": require.resolve("assert/"),
      "buffer": require.resolve("buffer/"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
    },
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js'
   }
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
