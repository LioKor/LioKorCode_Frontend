const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
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
        host: '0.0.0.0',
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
            }
        ],
    },
};