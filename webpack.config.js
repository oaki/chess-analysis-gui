var webpack = require("webpack");
var path = require("path");
var dotenv = require("dotenv");
var packageJson = require("./package.json");
var CopyPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WorkboxPlugin = require('workbox-webpack-plugin');
const { BundleStatsWebpackPlugin } = require('bundle-stats-webpack-plugin');


// variables
var isProduction = process.argv.indexOf("-p") >= 0 || process.env.NODE_ENV === "production";
console.log('isProduction', isProduction);
var sourcePath = path.join(__dirname, "./src");
var outPath = path.join(__dirname, "./build");

// plugins
var HtmlWebpackPlugin = require("html-webpack-plugin");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
  // stats: "verbose",
  context: sourcePath,
  entry: {
    app: "./index.tsx"
  },
  output: {
    path: outPath,
    filename: isProduction ? "[contenthash].js" : "[hash].js",
    chunkFilename: isProduction ? "[name].[contenthash].js" : "[name].[hash].js"
  },
  target: "web",
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ["module", "browser", "main"],
    modules: ['node_modules', path.resolve('./src')],

    // alias: {
    //   app: path.resolve(__dirname, 'src/app/')
    // }
  },
  module: {
    rules: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: [
          !isProduction && {
            loader: "babel-loader",
            options: {plugins: ["react-hot-loader/babel"]}
          },
          "ts-loader"
        ].filter(Boolean)
      },
      // css
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            query: {
              import: true,
              sourceMap: !isProduction,
              importLoaders: 1,
              modules: 'global',

              // modules: {
              //
              //   // localIdentName: "[local]"
              //   // localIdentName: isProduction ? "[hash:base64:5]" : "[local]__|__[hash:base64:5]"
              // }
            }
          },
          // {
          //   loader: "postcss-loader",
          //   options: {
          //     postcssOptions: {
          //       ident: "postcss",
          //       plugins: [
          //         require("postcss-import")({addDependencyTo: webpack}),
          //         require("postcss-url")(),
          //         require("postcss-preset-env")({
          //           /* use stage 2 features (defaults) */
          //           stage: 2
          //         }),
          //         require("postcss-reporter")(),
          //         require("postcss-browser-reporter")({
          //           disabled: isProduction
          //         })
          //       ]
          //     }
          //   },
          // },
          {
            loader: "sass-loader",
          },
        ]
      },
      // static assets
      {test: /\.html$/, use: "html-loader"},
      {test: /\.(a?png|svg)$/, use: "url-loader?limit=10000"},
      {
        test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
        use: "file-loader"
      }
    ]
  },
  // optimization: {
    // splitChunks: {
    //   name: true,
    //   cacheGroups: {
    //     commons: {
    //       chunks: "initial",
    //       minChunks: 2
    //     },
    //     vendors: {
    //       test: /[\\/]node_modules[\\/]/,
    //       chunks: "all",
    //       filename: isProduction ? "vendor.[contenthash].js" : "vendor.[hash].js",
    //       priority: -10
    //     }
    //   }
    // },
    // runtimeChunk: true
  // },
  plugins: [
    new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.config().parsed)
    }),
    // new webpack.DefinePlugin({
    //   'process.env.REACT_APP_HOST': JSON.stringify(process.env.REACT_APP_HOST),
    //   'process.env.REACT_APP_SOCKET_IO_HOST': JSON.stringify(process.env.REACT_APP_SOCKET_IO_HOST),
    //   'process.env.REACT_APP_SOCKET_IO_PATH': JSON.stringify(process.env.REACT_APP_SOCKET_IO_PATH),
    //   'process.env.REACT_APP_GOOGLECLIENTID': JSON.stringify(process.env.REACT_APP_GOOGLECLIENTID),
    // }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development", // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: false
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[hash].css",
      disable: !isProduction
    }),
    new HtmlWebpackPlugin({
      // publicPath: 'https://goog.sk',
      // templateParameters: {
      //   'publicPath': 'https://goog.sk'
      // },
      template: "../public/index.html",
      minify: {
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        useShortDoctype: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true
      },
      append: {
        head: `<script src="//cdn.polyfill.io/v3/polyfill.min.js"></script>`
      },
      meta: {
        title: packageJson.name,
        description: packageJson.description,
        keywords: Array.isArray(packageJson.keywords) ? packageJson.keywords.join(",") : undefined
      }
    }),
    new CopyPlugin({
      patterns: [
        '../public'
      ],
    }),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  devServer: {
    contentBase: sourcePath,
    hot: true,
    inline: true,
    historyApiFallback: {
      disableDotRule: true
    },
    stats: "verbose",
    clientLogLevel: "warning"
  },
  // https://webpack.js.org/configuration/devtool/
  devtool: isProduction ? "hidden-source-map" : "cheap-module-eval-source-map"
};