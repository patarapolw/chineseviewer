const merge = require('webpack-merge');
const common = require('./webpack.common.js');
require('dotenv').config({
    path: ".."
});

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    performance: {
        maxEntrypointSize: 400000,
        maxAssetSize: 400000
    },
    output: {
        path: "/Users/patarapolw/GitHubProjects/chineseviewer4k/chineseviewer_kotlin/src/main/resources/public",
    },
});