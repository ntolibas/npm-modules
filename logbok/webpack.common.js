const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    target: 'node',
    entry: {
        app: path.resolve(__dirname, './src/index.ts')
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    output: {
        filename: 'logger.umd.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'logger-js',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: 'this'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    },
    devtool: 'inline-source-map'
}