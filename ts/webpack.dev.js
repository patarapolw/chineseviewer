const merge = require('webpack-merge');
const common = require('./webpack.common.js');
require('dotenv').config({
    path: "../.env"
});

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: process.env.PRODUCTION_STATIC_PATH,
        watchContentBase: true,
        port: process.env.TS_PORT || 3000,
        proxy: {
            "/api": `http://localhost:${process.env.PORT || 5000}`
        },
        publicPath: "/js/",
        stats: {
            colors: true,
            children: false,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    },
    node: {
        fs: 'empty',
        module: 'empty',
    },
    stats: {
        colors: true,
        children: false,
        chunks: false,
        chunkModules: false,
        modules: false
    }
});