const path = require('path');
const merge = require('webpack-merge')
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        app: path.resolve(__dirname, './test/create-logger-test.ts')
    }
})