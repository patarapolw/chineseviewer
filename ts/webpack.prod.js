const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");

require('dotenv').config({
    path: "../.env"
});

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    performance: {
        maxEntrypointSize: 400000,
        maxAssetSize: 400000
    },
    output: {
        path: path.join(process.env.PRODUCTION_STATIC_PATH, "js"),
    },
});