var webpack = require('webpack'),
    path = require("path"),
    atImport = require("postcss-import"),
    //autoprefixer = require('autoprefixer'),
    //mqpacker = require('css-mqpacker'),
    //stylelint = require('stylelint'),
    //stylelintConfig = require('./stylelint.config.js'),
    //reporter = require("postcss-reporter"),
    //postcssDiscardDuplicates = require('postcss-discard-duplicates'),
    //postcssMergeRules = require('postcss-merge-rules'),
    rg = require('./plugins/postcss-rg'),

    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    BrowserSyncPlugin = require('browser-sync-webpack-plugin');


module.exports = {
    entry: {
        index: './src/components/page-home/page-home.js'
    },

    output: {
        path: "./dist",
        filename: "js/[name].js",
        publicPath: "./"
    },
    module: {
        loaders: [
            {
                test:   /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css!postcss") // extract css and create file
            },

            {
                test: /\.html$/,
                loader: 'html-loader'
            },
        ]
    },

    postcss: function () {

        return [
            atImport,
            rg
            // stylelint(stylelintConfig), // http://stylelint.io/user-guide/
            // reporter({ clearMessages: true }),
            // mqpacker,
            // autoprefixer,
            // postcssMergeRules,
            // postcssDiscardDuplicates
        ]; //https://github.com/postcss/postcss
    },


    plugins: [

        new ExtractTextPlugin('css/[name].css'),

        //new HtmlWebpackPlugin(), // Generates default index.html
        new HtmlWebpackPlugin({  // Also generate a home.html
          filename: 'home.html',
          template: './src/components/page-home/page-home.html',
          excludeChunks: []
        }),

        new BrowserSyncPlugin({
            // browse to http://localhost:3000/ during development,
            // ./public directory is being served
            host: 'localhost',
            port: 3000,
            server: { baseDir: ['dist'] }
        })
    ]
};
