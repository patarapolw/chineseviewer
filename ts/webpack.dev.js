const merge = require('webpack-merge');
const common = require('./webpack.common.js');
require('dotenv').config({path: ".."});

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: "/Users/patarapolw/GitHubProjects/chineseviewer4k/chineseviewer_kotlin/src/main/resources/public",
        watchContentBase: true,
        port: process.env.TS_PORT || 3000,
        proxy: {
            "/api": `http://localhost:${process.env.KOTLIN_PORT || 5000}`
        },
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