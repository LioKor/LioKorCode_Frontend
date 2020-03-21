const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const jsObfuscator = require('webpack-obfuscator');

fs.writeFileSync('./build_info.js', 'exports.BUILD_TIMESTAMP = ' + Date.now() + ';');

let jsObfuscatorPlugin = new jsObfuscator({
    compact: true,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    rotateStringArray: true,
    stringArrayEncoding: true,
});

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        jsObfuscatorPlugin,
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require('./package.json').version)
        }),
        new CopyPlugin([
            { from: 'static', to: './' }
        ])
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        //host: '0.0.0.0',
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.worker.js$/,
                use: { loader: 'worker-loader' }
            },
            {
                test: /\.styl$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'stylus-loader'
                ]
            }
        ],
    }
};