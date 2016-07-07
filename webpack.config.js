var webpack = require('webpack'),
    path = require("path"),
    autoprefixer = require('autoprefixer'),
    mqpacker = require('css-mqpacker'),
    stylelint = require('stylelint'),
    stylelintConfigStandard = require('stylelint-config-standard'),
    stylelintConfig = require('./stylelint.config.js'),
    reporter = require("postcss-reporter"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ModernizrWebpackPlugin = require('modernizr-webpack-plugin'),
    ModernizrConfig = require('./modernizr-config.js'),
    BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    SvgStore = require('webpack-svgstore-plugin'),
    postcssDiscardDuplicates = require('postcss-discard-duplicates'),
    postcssMergeRules = require('postcss-merge-rules');

module.exports = {
    entry: {
        vendor: ["jquery", "vue", "slick"],
        results: "./src/module/pages/page-results/page-results.js",
        home: './src/module/pages/page-home/page-home.js'
    },

    output: {
        path: "./dist",
        filename: "js/[name].js",
        publicPath: "/"
    },
    module: {
        loaders: [
            {// SASS -- note: sass-loader 3.2.0 not working
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", "css!sass?sourceMap") // extract css and create file
            },

            {
                test: /\.html$/,
                loader: 'html-loader'
            },

            {// VUE
                test: /\.vue$/,
                loader: 'vue'
            },

            {// BABEL
                test: /\.js$/,
                exclude: /(node_modules|bower_components|slick-carousel)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015']
                }
            },

            {// FONTS
              test: /\.(eot|svg|ttf|woff|woff2)$/,
              exclude: /(img)/,
              loader: 'file?name=fonts/[name].[ext]'
            },

            {// IMAGE
                test: /\.(jpe?g|png|gif|svg)$/i,
                exclude: /(fonts)/,
                loaders: [
                    'file?hash=sha512&digest=hex&name=img/[name].[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }
        ]
    },

    // htmlLoader: {
    //     ignoreCustomFragments: [/\{\{.*?}}/]
    // },

    postcss: function () {

        return [
            stylelint(stylelintConfig), // http://stylelint.io/user-guide/
            reporter({ clearMessages: true }),
            mqpacker,
            autoprefixer,
            postcssMergeRules,
            postcssDiscardDuplicates
        ]; //https://github.com/postcss/postcss
    },


    plugins: [

        new ExtractTextPlugin('css/[name].css'),

        new ModernizrWebpackPlugin(ModernizrConfig),

        new webpack.ProvidePlugin({'slick': 'slick-carousel/slick/slick'}),

        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),

        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),

        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"js/vendor.bundle.js"),

        //new HtmlWebpackPlugin(), // Generates default index.html
        new HtmlWebpackPlugin({  // Also generate a home.html
          filename: 'home.html',
          template: 'src/module/pages/page-home/page-home.html',
          excludeChunks: ['results']
        }),

        new HtmlWebpackPlugin({  // Also generate a results.html
          filename: 'results.html',
          template: 'src/module/pages/page-results/page-results.html',
          excludeChunks: ['home']
        }),

        //https://github.com/mrsum/webpack-svgstore-plugin
        new SvgStore({
            // svgo options -- not installed
            svgoOptions: {
                plugins: [
                    { removeTitle: true }
                ]
            }
        }),

        new BrowserSyncPlugin({
            // browse to http://localhost:3000/ during development,
            // ./public directory is being served
            host: 'localhost',
            port: 3000,
            server: { baseDir: ['dist'] }
        })

        // new CopyWebpackPlugin([
        //     { from: 'src/fonts', to: 'fonts' }
        // ])

    ]
};
